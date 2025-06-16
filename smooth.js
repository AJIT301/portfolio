
document.querySelectorAll('nav a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
        e.preventDefault();
        const targetID = link.getAttribute('href').substring(1);
        const target = document.getElementById(targetID);
        if (!target) return;

        const headerOffset = 80;  // Adjust to your fixed header height
        const elementPosition = target.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });
    });
});

let sections = [];
let navLinks = [];
let currentActiveSection = null;
let isAutoScrolling = false;

function initScrollEffects() {
    // Re-query DOM elements each time to ensure we have latest
    sections = document.querySelectorAll('section.scroll-section[id]');
    navLinks = document.querySelectorAll('nav a[href^="#"]');

    if (sections.length === 0 || navLinks.length === 0) {
        return false;
    }
    return true;
}

function activateNav() {
    if (isAutoScrolling) return;

    let scrollPos = window.pageYOffset || document.documentElement.scrollTop;
    let newActiveSection = null;

    sections.forEach(section => {
        const sectionTop = section.offsetTop - 30;  // Reduced from 90 to 30 for earlier activation
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');

        // Asymmetric detection - more sensitive when scrolling down (40% bottom buffer)
        if (scrollPos >= sectionTop - (sectionHeight * 0.25) &&
            scrollPos < sectionTop + sectionHeight * 1.4) {
            newActiveSection = sectionId;

            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });

    // If we found a new section in view and it's different from current
    if (newActiveSection && newActiveSection !== currentActiveSection) {
        currentActiveSection = newActiveSection;
        const targetSection = document.getElementById(currentActiveSection);

        // Add focused-section class for border effect
        sections.forEach(section => {
            section.classList.remove('focused-section');
        });
        targetSection.classList.add('focused-section');

        // Create comet effect for new section
        const comet = document.createElement('div');
        comet.className = 'comet';
        targetSection.querySelector('.content').prepend(comet);

        // Remove comet from previous section
        sections.forEach(section => {
            if (section.id !== currentActiveSection) {
                const existingComet = section.querySelector('.comet');
                if (existingComet) existingComet.remove();
            }
        });

        // Auto-scroll to center the section if it's not fully in view
        const sectionRect = targetSection.getBoundingClientRect();
        if (sectionRect.top < 100 || sectionRect.bottom > window.innerHeight - 100) {
            isAutoScrolling = true;
            window.scrollTo({
                top: targetSection.offsetTop - 80,
                behavior: 'smooth'
            });

            setTimeout(() => {
                isAutoScrolling = false;
            }, 1000);
        }
    }
}

// Debounce scroll events for better performance
let scrollTimeout;
window.addEventListener('scroll', () => {
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(activateNav, 100);
});

// Initialize when DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    if (!initScrollEffects()) {
        return;
    }

    // Set up initial state
    activateNav();

    // Initial comet for first section
    if (sections.length > 0) {
        currentActiveSection = sections[0].id;
        createComet(sections[0]);
    }

    // Re-check elements periodically in case of dynamic loading
    setTimeout(() => {
        initScrollEffects();
        activateNav();
    }, 1000);
});

function createComet(section) {
    const content = section.querySelector('.content');
    if (!content) return null;

    const comet = document.createElement('div');
    comet.className = 'comet';
    content.prepend(comet);
    return comet;
}
