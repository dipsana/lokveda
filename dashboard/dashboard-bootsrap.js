// Inject dashboard-specific CSS files
const styles = [
    '../style-global.css',
    '../utilities.css',
    './dashboard.css'
];

styles.forEach(href => {
    if (!document.querySelector(`link[href="${href}"]`)) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = href;
        document.head.appendChild(link);
    }
});

// Inject required JS modules
const scripts = [
    '../script-global.js',
    '../nav-bar.js'
];

scripts.forEach(src => {
    if (!document.querySelector(`script[src="${src}"]`)) {
        const script = document.createElement('script');
        script.type = 'module';
        script.src = src;
        document.body.appendChild(script);
    }
});

// Redirect Users to Form Menu
document.addEventListener('click', e => {
    const service = e.target.closest('#service');
    if (!service) return;

    window.location.href = '../form-loader/forms-menu.html';
});