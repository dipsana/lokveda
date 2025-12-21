/* LOCATION VERIFIER MODULE: Verifies user is in inside service area via location checker. */

import { logout } from '/lokveda/firebase.js';
import { checkUserProximity } from '/lokveda/location-checker.js';

// Check if user is in inside service area via location
(async () => {
    try {
        const inside = await checkUserProximity();
        if (!inside) await logout();
    }
    catch (err) {
        console.log('Unable to verify user location', err);
        logout();
    }
})();