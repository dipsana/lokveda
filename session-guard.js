/* SESSION GUARD: Guards the session, logouts user immediately if session is tampered.  */

import { assertAuth, logout } from '/lokveda/firebase.js';

(async () => {
    try { // ✅
        assertAuth();
        return;
    }
    catch (err) { // ❌
        alert('Session was tampered🥷. Logging out...😕');
        console.error('Session was tampered');
        await logout();
    }
})();