/* FIREBASE MODULE: Connect to Firebase. Initialize data & export auth & db functions. */

// Import SDK functions
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-app.js";
import {
    getFirestore, serverTimestamp,
    collection, query, where,
    getDoc, getDocs, updateDoc,
} from "https://www.gstatic.com/firebasejs/11.8.1/firebase-firestore.js";

// LokVeda's Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyDOSlBM6X-fjtkIt5OEGaSOr2SKpmpTbdE",
    authDomain: "digital-e-gram-panchayat-30ae1.firebaseapp.com",
    projectId: "digital-e-gram-panchayat-30ae1",
    storageBucket: "digital-e-gram-panchayat-30ae1.firebasestorage.app",
    messagingSenderId: "804007525877",
    appId: "1:804007525877:web:fc2a2da7b998a35257b4bc"
};

/* ******************************************* Init Firebase ******************************************* 

    Inits app, db, auth then fetches user data by their Role & Aadhaar No.

    > Export
      # INIT: Inits app when role & aadhaar are passed
      ⚠️ Before using this app, we must init it once successfully. Nothing will run if it fails.
      # INIT_DATA: Inits data after INIT is successful

    > Helpers: Check Initialization of
      # assertInit: db
      # assertSession: session

    > Export: Check Initialization of
      # assertAuth: db + session

    ---------- Permanent Internal Auth State ---------- 
   > Variables
      # curRole: user/staff/admin
      # curUser: user data object
      # curUserRef: pointer to user document in Firestore
      # area: user area object
      # coords: cached location { lat, lon }
      # sessionConfirmed: is the session authenticated (boolean)
      # initialized: is the DB initialized (boolean)
*/

const app = initializeApp(firebaseConfig), db = getFirestore(app);

/* ---------- init internal auth state ---------- */
let curRole = null,
    curUser = null,
    curUserRef = null,
    area = null,
    coords = null;

const SESSION_TIMEOUT = 3 * 60 * 60_000, // 3 hours
    ATTEMPT_COOLDOWN = 24 * 60 * 60_000, // 24 hours
    MAX_ATTEMPTS = 10;

export async function INIT(role, aadhaar) {
    // Prevent re-init
    if (sessionStorage.getItem('sessionConfirmed') === '1') return "Session already initialized";

    // Set role & aadhaar locally
    sessionStorage.setItem('role', role + "s");
    sessionStorage.setItem('aadhaar', aadhaar);

    // Fetch collection reference: users / admins / staffs
    const colRef = collection(db, sessionStorage.getItem('role'));

    // Query by Aadhaar
    const q = query(colRef, where("aadhaar", "==", sessionStorage.getItem('aadhaar'))),
        snap = await getDocs(q);

    if (snap.empty) return "User not found";

    const docSnap = snap.docs[0];
    const user = docSnap.data();
    const userRef = docSnap.ref;
    const now = Date.now();

    /* ---------- approval check ---------- */
    if (!user.approved) {
        return "You're not approved yet";
    }

    /* ---------- attempt cooldown ---------- */
    if (user.attemptResetAt && now < user.attemptResetAt.toMillis()) {
        return "Too many attempts, try later";
    }

    /* ---------- session check ---------- */
    if (user.authToken && user.lastSeen) {
        const lastSeenMs = user.lastSeen.toMillis();

        if (now - lastSeenMs < SESSION_TIMEOUT) {
            await updateDoc(userRef, {
                loginAttempts: (user.loginAttempts || 0) + 1,
                attemptResetAt:
                    (user.loginAttempts || 0) + 1 >= MAX_ATTEMPTS
                        ? new Date(now + ATTEMPT_COOLDOWN)
                        : null
            });

            return "You're already logged elsewhere";
        }
    }
    sessionStorage.setItem('initialized', '1');
    return INIT_DATA(); // Initialize Data
}

export async function INIT_DATA() {
    assertAuth();

    // Fetch collection reference: users / admins / staffs
    curRole = sessionStorage.getItem('role');
    const colRef = collection(db, curRole);

    // Query by Aadhaar
    const q = query(colRef, where("aadhaar", "==", sessionStorage.getItem('aadhaar'))),
        snap = await getDocs(q);

    if (snap.empty) return "User not found";

    const docSnap = snap.docs[0];
    const user = docSnap.data();
    const userRef = docSnap.ref;

    /* ---------- get co-ordinates from DB ---------- */

    // "Ex: fetch co-ordinates from: /areas/mathurGram"
    const areaSnap = await getDoc(user.areaRef);

    /* ---------- permanent internal auth state ---------- */

    // ✅ commit lookup ONLY AFTER SUCCESS
    curUser = user;
    curUserRef = userRef;
    area = areaSnap.data();
    coords = { lat: area.lat, lon: area.lon };

    return "Login successful";
}

/* ---------- helper functions ---------- */

// Throws Error if DB is uninitialized
function assertInit() {
    if (!sessionStorage.getItem('initialized') === '1') {
        throw new Error("DB not initialized");
    }
}

// Throws Error if Session is invalid
function assertSession() {
    if (!sessionStorage.getItem('sessionConfirmed') === '1') {
        throw new Error("User not authenticated");
    }
}

/* ---------- exported functions ---------- */

// Throws Error if either DB is uninitialized or Session is invalid
export function assertAuth() {
    assertInit();
    assertSession();
}

/* ---------- get co-ordinates via geolocation ---------- */

export async function fetchCoords() {
    if ('geolocation' in navigator) {
        return new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(
                pos => {
                    coords = { lat: pos.coords.latitude, lon: pos.coords.longitude };
                    resolve(coords);
                },
                err => {
                    // Denied → force logout
                    alert('Location access denied. Logging out...😕');
                    console.warn('Location access denied. Logging out.');
                    reject(new Error('Location access required'));
                },
                { timeout: 10_000 }
            );
        });
    } else {
        alert('Geolocation unsupported. Logging out...😕');
        console.error('Geolocation unsupported');
        throw new Error('Geolocation unsupported');
    }
}

/* ******************************************** Firebase DB ********************************************

    Exports getters & setters for performing operations in db
*/

/* =====================
   AUTH: GETTERS

   > Export
   # getPhone
===================== */

export function getPhone() {
    assertInit();
    return curUser.phone;
}

/* =====================
   AUTH: SETTERS

   > Export
   # confirmSession: validates session & sets session confirmed to true. Creates new session in DB by setting authToken & other needed values.
   # logout: logout client & updates required values in DB.
===================== */

export async function confirmSession() {
    // Validate Session
    assertInit();
    if (sessionStorage.getItem('sessionConfirmed') === '1') {
        await logout();
        throw new Error('Session already confirmed');
    }

    /* ---------- create new session in DB ---------- */
    await updateDoc(curUserRef, {
        authToken: crypto.randomUUID?.() ?? (Date.now() + Math.random()),
        lastSeen: serverTimestamp(),
        loginAttempts: 0,
        attemptResetAt: null,
        lastLoginAgent: navigator.userAgent
    });

    // OTP verification success
    sessionStorage.setItem('sessionConfirmed', '1');
}

export async function logout() {
    assertAuth();

    // Update DB
    await updateDoc(curUserRef, {
        authToken: null,
        lastSeen: serverTimestamp()
    });

    // Clear Session & DB Init
    sessionStorage.removeItem('sessionConfirmed');
    sessionStorage.removeItem('initialized');

    // Redirect client to home
    window.location.href = '/lokveda/index.html';
}

/* ------------ Auto logout on idle ------------ */
{
    let timer;

    function resetTimer() {
        clearTimeout(timer);
        timer = setTimeout(async () => {
            try {
                await logout();
            } catch {
                // ignore logout errors (tab closing, network, etc.)
            }
        }, 900_000); // 15 minutes
    }

    ["click", "mousemove", "keydown"].forEach(evt =>
        window.addEventListener(evt, resetTimer)
    );

    document.addEventListener("visibilitychange", () => {
        if (document.visibilityState === "visible") {
            resetTimer();
        }
    });

    resetTimer(); // start timer on load
}

/* =====================
   GETTERS

   > Export Current Client Details
     # getRole: Role → user/staff/admin
     # getLatitude, getLongitude: Location
     # getUserName

    > Export Panchayat Office Details
     # getOfficeName
     # getOfficeOpen, getOfficeClose
     # getOfficeLink
===================== */

export function getRole() {
    // assertAuth();
    return curRole.slice(0, curRole.length - 1);
}

export function getLatitude() {
    // assertAuth();
    if (!coords) throw new Error('Co-ordinates unavailable');
    return coords.lat;
}

export function getLongitude() {
    // assertAuth();
    if (!coords) throw new Error('Co-ordinates unavailable');
    return coords.lon;
}

export function getUserName() {
    // assertAuth();
    return curUser?.name;
}

export function getOfficeName() {
    return area?.name;
}

export function getOfficeOpen() {
    return area?.open;
}

export function getOfficeClose() {
    return area?.close;
}

export function getOfflineLink() {
    return area?.mapUrl;
}

export function getOfficeLatitude() {
    return area?.lat;
}

export function getOfficeLongitude() {
    return area?.lon;
}

/* ******************************************* Firebase Auth *******************************************

    Exports auth relation functions for authenticating users from db

    > Export class instance
    # otp: send, verify OTP for login
*/

// EXPORT: MOCK OTP INSTANCE
export const otp = (() => {

    // Helpers
    function generateOTP() {
        return Math.floor(100000 + Math.random() * 900000).toString();
    }

    class OTP {

        // SEND OTP (mock)
        async send() {
            assertInit();

            try { // ✅
                const code = generateOTP();

                // Update OTP in DB
                await updateDoc(curUserRef, {
                    otp: {
                        code,
                        createdAt: serverTimestamp(),
                        verified: false
                    }
                });

                console.log('📨 Mock OTP generated:', code);
                // 👆 visible in Firestore (for demo / viva)

                return true;
            } catch (err) { // ❌
                console.error('Failed to generate OTP', err);
                return false;
            }
        }

        // VERIFY OTP
        async verify(inputCode) {
            assertInit();

            try { // ✅❔
                const snap = await getDoc(curUserRef);
                if (!snap.exists()) return false;

                const data = snap.data();
                const savedOTP = data?.otp?.code;

                // ✅❌
                if (!savedOTP) {
                    console.warn('OTP not generated');
                    return false;
                }

                // ✅❌
                if (savedOTP !== inputCode) {
                    console.warn('Invalid OTP');
                    return false;
                }

                // Mark verified ✅✅
                await updateDoc(curUserRef, {
                    otp: {
                        verified: true
                    }
                });

                return true;
            } catch (err) { // ❌❌
                console.error('OTP verification failed', err);
                return false;
            }
        }
    }
    return new OTP();
})();