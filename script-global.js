/* SCRIPT GLOBAL MODULE: Sets global cross UI-UX like dark-mode button, favicon, footer */

import { head, body } from '/lokveda/dom.js';

// Set favicon
(function (src) {
    let link = head.querySelector(`link[href="${src}"]`);
    if (!link) {
        link = document.createElement('link');
        link.rel = 'icon';
        link.type = 'image/png';
        head.appendChild(link);
    }
    link.href = src;
})('/lokveda/favicon.png');

// Append global dark mode btn to nav bar
{
    // Create:
    const ul = document.createElement('ul'), li = document.createElement('li'),
        btn = document.createElement('button'), img = document.createElement('img');

    // Default mode selection (Dark/Light)
    {
        // Init: mode, msg
        const mode = localStorage.getItem('mode');
        let msg = 'Toggle Dark Mode?';

        // Mode selection
        if (mode === 'dark')
            body.classList.add('dark-mode');
        else if (mode === 'light'){
            body.classList.remove('dark-mode');
            msg = 'Toggle Light Mode?'
        }
        else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
            localStorage.setItem('mode', 'dark');
            body.classList.add('dark-mode');
        }

        // Btn: title, alt, ariaLabel
        btn.title = msg; btn.alt = msg;
        btn.ariaLabel = msg;
    }

    // Select/Create: Nav Bar (Header)
    let nav = document.getElementById('nav');
    if (!nav) {
        nav = document.createElement('header');
        nav.id = 'nav';
        document.body.prepend(nav);
    }

    // Btn: id & src
    ul.id = 'nav-tools';
    btn.id = 'dark-mode';
    img.src = '/lokveda/assets/icons/dm-icon.png';

    // Append: btn(+img) to nav
    btn.append(img);
    li.append(btn);
    ul.append(li);
    nav.append(ul);

    // Dark mode toggle
    document.getElementById('dark-mode').addEventListener("click", () => {
        // TOGGLE:
        body.classList.toggle('dark-mode'); // Class

        // Message
        const msg = (() => {
            if (body.classList.contains('dark-mode')) {
                localStorage.setItem('mode', 'dark');
                return 'Toggle Dark Mode?';
            } else {
                localStorage.setItem('mode', 'light');
                return 'Toggle Light Mode?';
            }
        })();

        // Btn: title, alt, ariaLabel
        btn.title = msg; btn.alt = msg;
        btn.ariaLabel = msg;

        // TRANSITION
        body.style.transition = 'background-color 0.3s, color 0.3s';
        setTimeout(() => body.style.transition = 'none', 300);
    });
}

// Set footer
{
    let footer = document.querySelector('footer');
    if (!footer) {
        footer = document.createElement('footer');
        document.body.appendChild(footer);
    }

    footer.innerHTML += `
        <p style="line-height: 2; text-align: center; font-size: 1rem;">
            Maintained by LokVeda team | <a href="mailto:dipsana@zohomail.in?subject=Feedback&body=Hi Devs,">Email Us</a>
        </p>`;
}

/* *************************************************** UI UTILITIES *************************************************** 

    > Export
    # hide: Hide element with opacity transitions & display none property altogether
    # show: Display hidden element with opacity transitions & display none property altogether
*/

// DISPLAY NONE WITH OPACITY TRANSITIONS:
export function hide(elem) {
    try {
        elem.classList.add('transition-opacity', 'opacity-none');
        setTimeout(() => {
            elem.classList.add('display-none');
            elem.classList.remove('transition-opacity', 'opacity-none');
        }, 200);
    } catch (err) {
        console.log('Failed to hide:', elem, err);
    }
}

export function show(elem) {
    try {
        elem.classList.add('transition-opacity', 'opacity-none');
        elem.classList.remove('display-none');
        elem.classList.add('opacity-1');
        setTimeout(() => {
            elem.classList.remove('transition-opacity', 'opacity-none', 'opacity-1');
        }, 200);
    } catch (err) {
        console.log('Failed to show:', elem, err);
    }
}