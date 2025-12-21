import { body } from '/lokveda/dom.js';
import { getOfficeClose, getOfficeName, getOfficeOpen, getOfflineLink, getRole, INIT_DATA, logout } from '/lokveda/firebase.js';
import { initGreetingBot } from '/lokveda/greeting-bot.js';
import { show, hide } from '/lokveda/script-global.js';

await INIT_DATA();

const nav = document.getElementById('nav'), navTools = document.getElementById('nav-tools');

if (navTools) {

    /* ********************************* CREATE UI ELEMENTS ********************************* */

    const searchCont = document.createElement("li"),
        navProf = document.createElement('ul'),
        greet = document.createElement('li'),
        homeBtn = document.createElement('div'),
        searchBtn = document.createElement('div'),
        searchBar = document.createElement('input'),
        exitUl = document.createElement('ul'),
        exitLi = document.createElement('li'),
        logoutBtn = document.createElement('button');

    /* **************************************** UI **************************************** */

    /* ---------- nav-profile (left) ---------- */

    navProf.id = 'nav-profile';

    // Init: Greet Bot
    greet.id = 'greet';
    initGreetingBot(greet);

    // Append: Profile
    navProf.append(greet);
    nav.prepend(navProf);

    /* ---------- search-cont ---------- */

    // Search Cont
    searchCont.id = 'search-cont';
    searchCont.title = 'In Development';
    searchCont.ariaLabel = 'In Development';

    // Home Btn
    homeBtn.id = 'home-btn';
    homeBtn.className = 'icon-btn';
    homeBtn.title = 'Go to your dashboard';
    homeBtn.setAttribute('aria-label', 'Home');
    homeBtn.textContent = '🏠';
    homeBtn.addEventListener('click', () => window.location.href = `/lokveda/dashboard/dashboard-${getRole()}.html`);

    // Search Btn
    searchBtn.id = 'search-btn';
    searchBtn.className = 'icon';
    searchBtn.title = 'Search';
    searchBtn.setAttribute('aria-label', 'Search');
    searchBtn.textContent = '🔍';

    // Create & Hide: Search Bar UI
    searchBar.id = 'search-bar';
    searchBar.type = 'text';
    searchBar.placeholder = '⚡ Search loaded content here >"<';
    searchBar.title = 'Type here';
    searchBar.classList.add('display-none');

    // Append: Search Bar
    searchCont.append(homeBtn, searchBtn, searchBar);
    navTools.prepend(searchCont);

    /* ---------- exit (right) ---------- */

    // Exit Cont
    exitUl.id = "exit";

    // Logout Btn
    logoutBtn.id = 'logout';
    logoutBtn.title = 'Logout';
    logoutBtn.setAttribute('aria-label', 'Logout');
    logoutBtn.textContent = 'Logout⏻';
    logoutBtn.addEventListener('click', () => logoutModal.style.display = 'flex');

    // Append: Logout Btn
    exitLi.append(logoutBtn);
    exitUl.append(exitLi);
    nav.append(exitUl);

    /* --------- Search Bar UX --------- */

    // Select: Dark Mode Btn
    const darkModeBtn = document.getElementById('dark-mode');

    // Store: If search bar will expand
    let searchOpen = false;

    searchBtn.addEventListener('click', () => {
        // OPEN SEARCH
        if (!searchOpen) {
            searchOpen = true;

            show(searchBar);
            searchBar.focus();

            searchBtn.classList.add('rotate-y-180');

            // Hide Distractions
            if (navProf) hide(navProf);
            if (homeBtn) hide(homeBtn);
            if (darkModeBtn) hide(darkModeBtn);

            return;
        }

        // SEARCH OPEN → EMPTY → CLOSE
        if (!searchBar.value.trim()) {
            searchOpen = false;

            hide(searchBar);
            searchBar.value = '';

            searchBtn.classList.remove('rotate-y-180');

            // Restore UI
            if (navProf) show(navProf);
            if (homeBtn) show(homeBtn);
            if (darkModeBtn) show(darkModeBtn);

            return;
        }

        // SEARCH OPEN → HAS VALUE → SEARCH (placeholder)
        console.log('Searching for:', searchBar.value.trim());
    });
} else {
    console.warn('Not found #nav-tools');
}

/* ********************************************* LOGOUT DIALOG BOX ********************************************* */

// Logout Modal
const logoutModal = document.createElement('div');
logoutModal.id = 'logout-modal';
logoutModal.style.display = 'none';
logoutModal.innerHTML = `
    <div class="logout-box">
      <p><strong>Do you really want to logout?</strong></p>
      <p class="note">
        ⚠️ Accounts might get locked if not logged out properly.
      </p>
      <div class="actions">
        <button id="logout-confirm">Yes, Logout</button>
        <button id="logout-cancel">Cancel</button>
      </div>
    </div>
`;
body.append(logoutModal);

/* ------------ Btns ------------ */

// Cancel
document.getElementById('logout-cancel').addEventListener('click', () => {
    logoutModal.style.display = 'none';
});

// Logout
document.getElementById('logout-confirm').addEventListener('click', async () => {
    try { // ✅
        await logout();
        logoutModal.style.display = 'none';
    } catch (err) { // ❌
        // Retry msg
        const noteEl = logoutModal.querySelector('.logout-box .note');
        noteEl.textContent = '❌ Logout failed. Please try again.';
        noteEl.style.color = '#e63946';
        console.error(getRole(), 'logout failed. Err:', err);
    }
});

/* **************************************** FOOTER **************************************** */

let footer = document.querySelector('footer');
if (!footer) {
    footer = document.createElement('footer');
    document.body.appendChild(footer);
}

footer.innerHTML += `
    <p style="line-height: 2; text-align: center; font-size: 1rem;">
        📍 ${getOfficeName()} | 🕒 Open: ${getOfficeOpen()} - ${getOfficeClose()} <br>
        💬 <a href="mailto:dipsana@zohomail.in?subject=Feedback">Feedback</a> | 
        ❗ <a href="mailto:dipsana@zohomail.in?subject=Complaint">Complaint</a> | 
        📍 <a href="${getOfflineLink()}" target="_blank">View Location</a> <br>
    </p>`;