/* AUTH CORE MODULE: Exports UI Generation Utilities, links CSS & loads global script for auth-admin.js, auth-staff.js & auth-user.js.
                     Also redirects client to their respective dashboard after verification.

    > Export class instance
    # authGen: Gen Admin/Staff/User Login UI capable of OTP verification
*/
import { body, head } from "../dom.js";
import { confirmSession, getPhone, INIT, otp } from "../firebase.js";

// STORES AUTH ROLE
let _role;

// AUTH GEN CLASS
class AuthGen {

    // Init: AuthGen based on roles
    init(role) {
        _role = role;
        body.dataset.role = role;

        this.loadGlobalScript();
        this.loadStyles();
        this.renderUI();
        this.bindUI();
    }

    // Links CSS: style-global & auth
    loadStyles() {
        const styles = [
            '../style-global.css',
            './auth.css',
            '../utilities.css'
        ];

        for (const href of styles) {
            if (document.querySelector(`link[href="${href}"]`)) continue;

            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = href;
            head.appendChild(link);
        }
    }

    // Links JS: script-global
    loadGlobalScript() {
        if (document.querySelector('script[data-global]')) return;

        const script = document.createElement('script');
        script.type = 'module';
        script.src = '/script-global.js';
        script.dataset.global = 'true';
        body.append(script);
    }

    // Gen: UI
    renderUI() {
        const roleTitle =
            _role === 'user' ? 'User Access' :
                _role === 'admin' ? 'Admin Access' :
                    'Staff Access';

        const showNote = _role === 'user';

        body.insertAdjacentHTML('beforeend', `
            <main class="auth-card">
                <h1>${roleTitle}</h1>

                <form id="auth-form">
                    <div class="input-group">
                        <label for="aadhaar">Aadhaar Number</label>
                        <input
                            type="text"
                            id="aadhaar"
                            minlength="12" maxlength="12"
                            placeholder="Enter 12-digit Aadhaar"
                            required
                        />
                    </div>

                    <div class="input-group otp-section hidden">
                        <label for="otp">OTP</label>
                        <input
                            type="text"
                            id="otp"
                            minlength="6" maxlength="6"
                            placeholder="Enter OTP"
                        />
                    </div>

                    <div class="btn-group">
                        <button type="submit" id="send-otp-btn">Send OTP</button>
                        <button type="button" id="verify-otp-btn" class="hidden">Verify OTP</button>
                    </div>
                </form>

                ${showNote ? `
                    <div class="note">
                        Indian citizens residing in villages are pre-registered.
                        Just enter your Aadhaar number to access your dashboard.
                    </div>
                ` : ''}

                <p class="status-message" id="status-msg"></p>
                <div id="recaptcha-container"></div>
            </main>
        `);
    }

    // UI Interactivity
    async bindUI() {
        const sendBtn = document.getElementById('send-otp-btn'),
            aadhaarIp = document.getElementById('aadhaar'),
            verifyBtn = document.getElementById('verify-otp-btn'),
            otpSection = document.querySelector('.otp-section'),
            statusMsg = document.getElementById('status-msg'),
            otpInput = document.getElementById('otp'),
            form = document.getElementById('auth-form');

        // UX: Block typing non-digits
        aadhaarIp.addEventListener('input', () => aadhaarIp.value = aadhaarIp.value.replace(/\D/g, ''));
        otpInput.addEventListener('input', () => otpInput.value = otpInput.value.replace(/\D/g, ''));

        // Send OTP to Phone
        sendBtn.addEventListener("click", async () => {

            // I/p: Aadhaar No.
            const aadhaar = aadhaarIp.value.trim();
            if (!/^\d{12}$/.test(aadhaar)) {
                statusMsg.textContent = 'Aadhaar must be exactly 12 digits 🙂';
                return;
            }

            // Init & Check Records: Firebase
            statusMsg.textContent = "Checking records...😊";
            statusMsg.textContent = await INIT(_role, aadhaar);

            // Fetch: Phone No. via Aadhaar if exists
            const phone = getPhone();
            if (!phone) {
                statusMsg.textContent = 'Aadhaar not registered';
                return;
            }

            // Send: OTP to phone
            const sent = await otp.send();
            if (!sent) {
                statusMsg.textContent = 'OTP failed. Try again...😮‍💨';
                return;
            }

            // If OTP was sent to phone, inform user by adjusting CSS:
            aadhaarIp.readOnly = true;
            aadhaarIp.classList.add('locked');

            otpSection.classList.remove('hidden');
            sendBtn.classList.add('hidden');
            verifyBtn.classList.remove('hidden');
            otpInput.required = true;

            statusMsg.textContent = 'OTP sent to +91XXXXXX' + phone.slice(9);
        });

        // Verify OTP from User
        verifyBtn.addEventListener("click", async () => {
            const code = otpInput.value.trim();
            if (!/^\d{6}$/.test(code)) {
                statusMsg.textContent = 'OTP must be 6 digits 🙂';
                return;
            }

            statusMsg.textContent = 'Verifying...🤩';

            const ok = await otp.verify(code);
            if (!ok) {
                statusMsg.textContent = 'Wrong OTP 😟. Try again...😮‍💨';
                return;
            }

            // Confirm session & redirect user to dashboard
            confirmSession();
            window.location.href = `/dashboard/dashboard-${_role}.html`;
        });

        form.addEventListener('submit', e => e.preventDefault());
    }
}

// EXPORT AUTH GEN INSTANCE
export const authGen = new AuthGen();