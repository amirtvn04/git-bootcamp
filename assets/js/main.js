'use strict';

//Opening or closing sidebar

const SIDEBAR_STATE_KEY = 'sidebarActiveState';

const sidebar = document.querySelector("[data-sidebar]");
const sidebarBtn = document.querySelector("[data-sidebar-btn]");

const elementToggleFunc = function (elem) {
    elem.classList.toggle("active");

    if (elem.classList.contains("active")) {
        localStorage.removeItem(SIDEBAR_STATE_KEY);
    } else {
        localStorage.setItem(SIDEBAR_STATE_KEY, 'inactive');
    }
}

const loadSidebarState = function () {
    const savedState = localStorage.getItem(SIDEBAR_STATE_KEY);

    if (savedState === 'inactive') {
        sidebar.classList.remove("active");
    }
}

loadSidebarState();

sidebarBtn.addEventListener("click", function () {
    elementToggleFunc(sidebar);
})

//Activating Modal-testimonial

// const testimonialsItem = document.querySelectorAll('[data-testimonials-item]');
// const modalContainer = document.querySelector('[data-modal-container]');
// const modalCloseBtn = document.querySelector('[data-modal-close-btn]');
// const overlay = document.querySelector('[data-overlay]');
//
// const modalImg = document.querySelector('[data-modal-img]');
// const modalTitle = document.querySelector('[data-modal-title]');
// const modalText = document.querySelector('[data-modal-text]');
//
// const testimonialsModalFunc = function () {
//     modalContainer.classList.toggle('active');
//     overlay.classList.toggle('active');
// }
//
// for (let i = 0; i < testimonialsItem.length; i++) {
//     testimonialsItem[i].addEventListener('click', function () {
//         modalImg.src = this.querySelector('[data-testimonials-avatar]').src;
//         modalImg.alt = this.querySelector('[data-testimonials-avatar]').alt;
//         modalTitle.innerHTML = this.querySelector('[data-testimonials-title]').innerHTML;
//         modalText.innerHTML = this.querySelector('[data-testimonials-text]').innerHTML;
//
//         testimonialsModalFunc();
//     })
// }

//Activating close button in modal-testimonial

// modalCloseBtn.addEventListener('click', testimonialsModalFunc);
// overlay.addEventListener('click', testimonialsModalFunc);

//Activating Filter Select and filtering options

const select = document.querySelector('[data-select]');
const selectItems = document.querySelectorAll('[data-select-item]');
const selectValue = document.querySelector('[data-select-value]');
const filterBtn = document.querySelectorAll('[data-filter-btn]');

select.addEventListener('click', function () { elementToggleFunc(this); });

for (let i = 0; i < selectItems.length; i++) {
    selectItems[i].addEventListener('click', function () {

        let selectedValue = this.innerText.toLowerCase();
        selectValue.innerText = this.innerText;
        elementToggleFunc(select);
        filterFunc(selectedValue);

    });
}

const filterItems = document.querySelectorAll('[data-filter-item]');

const filterFunc = function (selectedValue) {
    for (let i = 0; i < filterItems.length; i++) {
        if (selectedValue == "all") {
            filterItems[i].classList.add('active');
        } else if (selectedValue == filterItems[i].dataset.category) {
            filterItems[i].classList.add('active');
        } else {
            filterItems[i].classList.remove('active');
        }
    }
}

//Enabling filter button for larger screens 

let lastClickedBtn = filterBtn[0];

for (let i = 0; i < filterBtn.length; i++) {

    filterBtn[i].addEventListener('click', function () {

        let selectedValue = this.innerText.toLowerCase();
        selectValue.innerText = this.innerText;
        filterFunc(selectedValue);

        lastClickedBtn.classList.remove('active');
        this.classList.add('active');
        lastClickedBtn = this;

    })
}

// Enabling Contact Form

// const form = document.querySelector('[data-form]');
// const formInputs = document.querySelectorAll('[data-form-input]');
// const formBtn = document.querySelector('[data-form-btn]');
//
// for (let i = 0; i < formInputs.length; i++) {
//     formInputs[i].addEventListener('input', function () {
//         if (form.checkValidity()) {
//             formBtn.removeAttribute('disabled');
//         } else {
//             formBtn.setAttribute('disabled', '');
//         }
//     })
// }

// Enabling Page Navigation 

const navigationLinks = document.querySelectorAll('[data-nav-link]');
const pages = document.querySelectorAll('[data-page]');

for (let i = 0; i < navigationLinks.length; i++) {
    navigationLinks[i].addEventListener('click', function () {

        for (let i = 0; i < pages.length; i++) {
            if (this.innerHTML.toLowerCase() == pages[i].dataset.page) {
                pages[i].classList.add('active');
                navigationLinks[i].classList.add('active');
                window.scrollTo(0, 0);
            } else {
                pages[i].classList.remove('active');
                navigationLinks[i].classList.remove('active');
            }
        }
    });
}

// switch dark & light mode - save mode
const savedTheme = localStorage.getItem("theme");

if (savedTheme === "light") {
    document.documentElement.classList.add("light-theme");
    document.getElementById("darkmode-toggle").checked = true;
}

document.getElementById("theme-toggle").addEventListener("change", () => {
    const root = document.documentElement;

    root.classList.toggle("light-theme");

    if (root.classList.contains("light-theme")) {
        localStorage.setItem("theme", "light");
        document.getElementById("darkmode-toggle").checked = true;
    } else {
        localStorage.setItem("theme", "dark");
        document.getElementById("darkmode-toggle").checked = false;
    }
});

// Custom Scrollbar
class ScrollProgressIndicator {
    constructor() {
        this.scrollContainer = document.getElementById("scroll-container");
        this.indicator = document.getElementById("indicator");
        this.breakpoint = 700;
        this.currentLayout = null;

        if (!this.scrollContainer || !this.indicator) {
            console.warn("Scroll container or indicator not found");
            return;
        }

        this.init();
    }

    init() {
        this.updateActiveArticle();
        this.setupEventListeners();
        this.update();
    }

    updateActiveArticle() {
        this.article = document.querySelector("article.active[data-page]");

        if (this.article) {
            this.headers = this.article.querySelectorAll("h2[id]");
        } else {
            this.headers = [];
        }

        if (this.article && this.headers.length > 0) {
            this.scrollContainer.style.display = "block";
        } else {
            this.scrollContainer.style.display = "none";
        }
    }

    setupEventListeners() {
        document.addEventListener("scroll", () => this.update());
        window.addEventListener("resize", () => this.update());

        const navLinks = document.querySelectorAll("[data-nav-link]");
        navLinks.forEach(link => {
            link.addEventListener("click", () => {
                setTimeout(() => {
                    this.updateActiveArticle();
                    this.currentLayout = null;
                    this.update();
                }, 100);
            });
        });
    }

    getArticleDimensions() {
        if (!this.article) return null;

        const articleRect = this.article.getBoundingClientRect();
        const scrollTop = window.scrollY - this.article.offsetTop;
        const adjustedScrollTop = Math.max(
            0,
            Math.min(scrollTop, this.article.scrollHeight)
        );

        return {
            articleTop: articleRect.top + window.scrollY,
            articleHeight: this.article.scrollHeight,
            articleBottom: articleRect.bottom + window.scrollY,
            viewportHeight: window.innerHeight,
            scrollTop: adjustedScrollTop
        };
    }

    createHeaderMarker(header, position, isHorizontal) {
        const markerLink = document.createElement("a");
        markerLink.href = `#${header.id}`;
        markerLink.className = "heading-marker-container";

        const line = document.createElement("span");
        line.className = "heading-indicator";
        line.setAttribute("aria-hidden", "true");

        markerLink.appendChild(line);

        if (!isHorizontal) {
            const label = document.createElement("span");
            label.className = "heading-label";
            label.textContent = header.textContent.trim();
            markerLink.appendChild(label);
        }

        if (isHorizontal) {
            markerLink.style.left = `${position}%`;
            markerLink.style.top = "";
        } else {
            markerLink.style.top = `${position}%`;
            markerLink.style.left = "";
        }

        return markerLink;
    }

    resetIndicatorStyles() {
        this.indicator.style.width = "";
        this.indicator.style.height = "";
        this.indicator.style.top = "";
        this.indicator.style.left = "";
    }

    updateIndicator(isHorizontal) {
        const dimensions = this.getArticleDimensions();
        if (!dimensions) return;

        const { articleHeight, viewportHeight, scrollTop } = dimensions;

        if (isHorizontal) {
            const width = (scrollTop / (articleHeight - viewportHeight)) * 100;
            const clampedWidth = Math.max(0, Math.min(100, width));
            this.indicator.style.width = `${clampedWidth}%`;
            this.indicator.style.left = "0";
            this.indicator.style.top = "";
            this.indicator.style.height = "";
        } else {
            const height = (viewportHeight / articleHeight) * 100;
            const position = (scrollTop / articleHeight) * 100;
            const clampedPosition = Math.max(0, Math.min(100 - height, position));
            this.indicator.style.height = `${height}%`;
            this.indicator.style.top = `${clampedPosition}%`;
            this.indicator.style.left = "";
            this.indicator.style.width = "";
        }
    }

    updateHeaderMarkers(isHorizontal) {
        if (!this.article || !this.headers || this.headers.length === 0) return;

        const dimensions = this.getArticleDimensions();
        if (!dimensions) return;

        const { articleHeight } = dimensions;

        this.scrollContainer
            .querySelectorAll(".heading-marker-container")
            .forEach((marker) => marker.remove());

        this.headers.forEach((header) => {
            const headerOffset = header.offsetTop - this.article.offsetTop;
            const position = (headerOffset / articleHeight) * 100;
            const marker = this.createHeaderMarker(header, position, isHorizontal);
            this.scrollContainer.appendChild(marker);
        });
    }

    update() {
        if (!this.article || !this.headers || this.headers.length === 0) {
            if (this.scrollContainer) {
                this.scrollContainer.style.display = "none";
            }
            return;
        }

        this.scrollContainer.style.display = "block";

        const isHorizontal = window.innerWidth <= this.breakpoint;

        if (this.currentLayout !== isHorizontal) {
            this.currentLayout = isHorizontal;
            this.resetIndicatorStyles();
            this.updateHeaderMarkers(isHorizontal);
        }

        this.updateIndicator(isHorizontal);
    }
}

window.addEventListener('DOMContentLoaded', function() {
    new ScrollProgressIndicator();
});