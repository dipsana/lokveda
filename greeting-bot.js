/* GREETING BOT MODULE: Dynamic greeting (<li id="greet">) using sunrise/sunset or fallback clock logic.

    > Exports
    #initGreetingBot: Greets user based on their location
*/

import { getLatitude, getLongitude, getUserName } from './firebase.js';

export async function initGreetingBot(greet = document.getElementById('greet')) {
    if (!greet) return console.error('Greeter element not provided');

    const HOUR_MS = 3_600_000; // 1 hour in ms
    let sunTimes = await fetchSunTimesOnce();

    // Fade-in animation
    greet.classList.remove('show');

    updateGreeting();
    scheduleDailyRefresh();

    function updateGreeting() {
        // Get IST time using toLocaleString with 'Asia/Kolkata' timezone
        const istNow = new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }));
        greet.innerHTML = getGreeting(istNow) + '<br>' + getUserName();

        // Fade in by forcing a reflow so transition works
        void greet.offsetWidth;
        greet.classList.add('show');

        setTimeout(updateGreeting, HOUR_MS - (Date.now() % HOUR_MS) + 50);
    }

    // Uses sunrise/sunset if available, otherwise falls back to fixed hours
    function getGreeting(istDate) {
        const h = istDate.getHours();
        if (sunTimes) {
            const now = istDate.getTime();
            if (now < sunTimes.sunrise) return 'Good Night!';
            if (now < sunTimes.sunset) {
                if (h < 12) return 'Good Morning!';
                if (h < 17) return 'Good Afternoon!';
                return 'Good Evening!';
            }
            return 'Good Evening!';
        }
        // fallback purely by clock
        if (h > 16) return 'Good Evening!';
        if (h < 4) return 'Good Night!';
        if (h < 12) return 'Good Morning!';
        return 'Good Afternoon!';
    }

    // Hits sunrise-sunset API once; fallback if unavailable
    async function fetchSunTimesOnce() {
        try {
            const lat = getLatitude();
            const lon = getLongitude();
            const url = `https://api.sunrise-sunset.org/json?lat=${lat}&lng=${lon}&formatted=0`;
            const { results } = await (await fetch(url)).json();
            return { sunrise: new Date(results.sunrise).getTime(), sunset: new Date(results.sunset).getTime() };
        } catch (e) {
            console.warn('Sun-times unavailable → fallback to clock only', e);
            return null;
        }
    }

    // Updates sunTimes daily ~5s after IST midnight
    function scheduleDailyRefresh() {
        // Get IST time using toLocaleString with 'Asia/Kolkata' timezone
        const istNow = new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }));
        const tomorrow = new Date(istNow);
        tomorrow.setHours(24, 0, 5, 0);
        setTimeout(async () => {
            sunTimes = await fetchSunTimesOnce();
            scheduleDailyRefresh();
        }, tomorrow.getTime() - istNow.getTime());
    }
}