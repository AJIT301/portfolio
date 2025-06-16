document.addEventListener('DOMContentLoaded', () => {
    const carousel = document.querySelector('.tech-carousel');
    const track = document.querySelector('.carousel-track');
    const items = document.querySelectorAll('.carousel-item');

    if (!carousel || !track || items.length === 0) return;

    // Clone items for infinite effect
    track.innerHTML += track.innerHTML;
    const allItems = document.querySelectorAll('.carousel-item');

    const gifMapping = {
        'Cypress': 'https://s6.imgcdn.dev/YcivuS.gif',
        'Playwright': 'https://s6.imgcdn.dev/YciaK9.gif',
        'Selenium': 'https://s6.imgcdn.dev/YciUWT.gif',
        'Jmeter': 'https://s6.imgcdn.dev/Yci1Zy.gif',
        'Postman': 'https://s6.imgcdn.dev/YciTat.gif',
        'Faker': 'https://s6.imgcdn.dev/YciSmH.gif',
        'Jira': 'https://s6.imgcdn.dev/Yci0E8.gif',
        'Gitlab': 'https://s6.imgcdn.dev/YciBi2.gif',
        'Github': 'https://s6.imgcdn.dev/YciGri.gif'
    };

    let currentPopup = null;
    let isPaused = false;
    let overCarouselItem = false;
    let overPopup = false;

    function updatePauseState() {
        isPaused = overCarouselItem || overPopup || !!currentPopup;
    }

    function closePopup() {
        if (currentPopup) {
            currentPopup.remove();
            currentPopup = null;
            overPopup = false;
            updatePauseState();
        }
    }

    function createPopup(item) {
        closePopup();

        const toolKey = item.dataset.tool;
        if (!toolKey) return;

        const popup = document.createElement('div');
        popup.classList.add('popup');

        const image = document.createElement('img');
        image.src = gifMapping[toolKey] || `https://picsum.photos/200/300?${toolKey}`;
        image.alt = toolKey;
        popup.appendChild(image);

        const title = document.createElement('h2');
        title.textContent = toolKey;
        popup.appendChild(title);

        const desc = document.createElement('p');
        desc.textContent = `Learn more about ${toolKey}`;
        popup.appendChild(desc);

        const closeBtn = document.createElement('button');
        closeBtn.textContent = 'Close';
        closeBtn.addEventListener('click', e => {
            e.stopPropagation();
            closePopup();
        });
        popup.appendChild(closeBtn);

        popup.addEventListener('mouseenter', () => {
            overPopup = true;
            updatePauseState();
           
        });

        popup.addEventListener('mouseleave', () => {
            overPopup = false;
            updatePauseState();
        });

        document.body.appendChild(popup);

        // Wait for render before positioning
        requestAnimationFrame(() => {
            const rect = item.getBoundingClientRect();
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;

            popup.style.position = 'absolute';
            popup.style.left = `${rect.left + scrollLeft + rect.width / 2}px`;
            popup.style.top = `${rect.top + scrollTop - popup.offsetHeight - 10}px`;
            popup.style.transform = 'translateX(-50%)';

            // Add fade-in class to make popup visible
            popup.classList.add('fade-in');

            currentPopup = popup;
            updatePauseState();
        });
    }

    allItems.forEach(item => {
        item.addEventListener('click', e => {
            e.stopPropagation();
            createPopup(item);
        });

        item.addEventListener('mouseenter', () => {
            overCarouselItem = true;
            updatePauseState();
        });

        item.addEventListener('mouseleave', () => {
            overCarouselItem = false;
            updatePauseState();
        });
    });

    document.addEventListener('click', e => {
        const clickedPopup = currentPopup && currentPopup.contains(e.target);
        const clickedItem = e.target.closest('.carousel-item');
        if (!clickedPopup && !clickedItem) {
            closePopup();
        }
    });

    document.addEventListener('keydown', e => {
        if (e.key === 'Escape') {
            closePopup();
        }
    });

    let position = 0;
    let direction = 1;
    const speed = 0.5;

    function animate() {
        if (!isPaused) {
            position -= speed * direction;
            track.style.transform = `translateX(${position}px)`;

            const resetPoint = track.scrollWidth / 2;
            if (Math.abs(position) >= resetPoint || position >= 0) {
                direction *= -1;
            }
        }
        requestAnimationFrame(animate);
    }

    animate();

    const handleResize = () => {
        track.style.width = `${items.length * 2 * (250 + 32)}px`;
    };

    window.addEventListener('resize', handleResize);
    handleResize();
});
