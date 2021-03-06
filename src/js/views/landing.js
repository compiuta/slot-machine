(function (window) {
    'use-strict';

    const bodyTag = document.querySelector('[data-body-tag]');
    const slotLandingContainer = document.querySelector('[data-slot-landing]');
    const mobileMenu = document.querySelector('[data-mobile-menu]');
    const navElement = document.querySelector('[data-main-nav]');
    const buttonScrollUp = document.querySelector('[data-scroll-up]');
    const buttonScrollDown = document.querySelector('[data-scroll-down]');
    const navModal = document.querySelector('[data-nav-modal]');
    const navWrap = document.querySelector('[data-nav-wrapper]');
    const modalClose = document.querySelector('[data-modal-close]');
    const slotItems = [
        'diamond-active',
        'seven-active',
        'triple-bar-active',
        'double-bar-active',
        'single-bar-active',
        'cherry-active'
    ];
    const numberOfMenuItems = 6;
    let navElementSize;
    let menuItemSize;
    let currentMenuItem = 0;

    function toggleMobileMenu() {
        slotLandingContainer.classList.toggle('mobile-menu-open');
    }

    function calculateElementsSize() {
        navElementSize = navElement.offsetHeight;
        menuItemSize = navElementSize / numberOfMenuItems;
    }

    function resizeElements() {
        calculateElementsSize();
        navElement.style.top = `-${currentMenuItem * menuItemSize}px`;
    }

    function toggleSliderButtons() {
        if (currentMenuItem === 0) {
            buttonScrollUp.classList.add('disable-button');
        } else {
            buttonScrollUp.classList.remove('disable-button');
        }

        if (currentMenuItem === (numberOfMenuItems - 1)) {
            buttonScrollDown.classList.add('disable-button');
        } else {
            buttonScrollDown.classList.remove('disable-button');
        }
    }

    function toggleTopTransition() {
        navElement.classList.toggle('nav-top-transition');
    }

    function toggleCurrentMenuItem() {
        navWrap.classList.toggle(slotItems[currentMenuItem]);
    }

    function navScroll(e) {
        const clickedButton = e.currentTarget;

        toggleCurrentMenuItem();

        toggleTopTransition();

        if (clickedButton.classList.contains('scroll-button-down')) {
            currentMenuItem += 1;
        } else {
            currentMenuItem -= 1;
        }

        toggleCurrentMenuItem();
        toggleSliderButtons();
        navElement.style.top = `-${currentMenuItem * menuItemSize}px`;

        setTimeout(() => {
            toggleTopTransition();
        }, 200);
    }

    function openModal() {
        navModal.classList.remove('hide');
        bodyTag.classList.add('animation-activated');
        slotLandingContainer.classList.add('mobile-menu-open');
    }

    function closeModal() {
        bodyTag.classList.remove('animation-activated');
        bodyTag.classList.add('animate-close');

        setTimeout(() => {
            navModal.classList.add('hide');
            bodyTag.classList.remove('animate-close');
        }, 1000);
    }

    mobileMenu.addEventListener('click', toggleMobileMenu);
    buttonScrollUp.addEventListener('click', navScroll);
    buttonScrollDown.addEventListener('click', navScroll);
    navElement.addEventListener('click', openModal);
    modalClose.addEventListener('click', closeModal);
    window.addEventListener('resize', resizeElements);

    calculateElementsSize();
    toggleSliderButtons();
})(window);