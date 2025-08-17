const toggleTheme = document.getElementById("toggleTheme");
const rootHtml = document.documentElement;
const sectionlink = document.querySelectorAll(".section-link");
const themeIcons = document.querySelectorAll(".theme-icon");

function updateIcons(theme) {
    themeIcons.forEach(icon => {
        const newSrc = icon.getAttribute(`data-src-${theme}`);
        if (newSrc) {
            icon.setAttribute('src', newSrc);
        }
    });
}

function changeTheme() {
    const currentTheme = rootHtml.getAttribute("data-theme");
    const newTheme = currentTheme === "dark" ? "light" : "dark";

    rootHtml.setAttribute("data-theme", newTheme);
    updateIcons(newTheme);
}

function initializeTheme() {
    const currentTheme = rootHtml.getAttribute("data-theme");
    updateIcons(currentTheme);
}

toggleTheme.addEventListener("click", changeTheme);

sectionlink.forEach(item => {
    item.addEventListener("click", () => {
        sectionlink.forEach(i => i.classList.remove("active"));
        item.classList.add("active");
    });
});

initializeTheme();