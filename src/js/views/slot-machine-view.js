(function (window) {
    'use strict';

    const slotReels = document.querySelectorAll('[data-reel]');
    const slotStartButton = document.querySelector('[data-slot="startButton"]');
    let reelSpinIntervalArr = [];

    const currentData = app.slotMachineController.getCurrentData('default');

    function createReelElement(object) {
        const reelElementContainer = document.createElement('div');
        const image = document.createElement('img');

        reelElementContainer.setAttribute('data-symbol', object.symbol);
        reelElementContainer.setAttribute('data-value', object.value);
        reelElementContainer.setAttribute('data-frequency', object.frequency);

        reelElementContainer.classList.add('slot--reel-element');
        reelElementContainer.classList.add(object.symbol);

        image.classList.add('reel-image');
        image.src = `dist/images/${object.symbol}.png`;

        reelElementContainer.appendChild(image);

        return reelElementContainer;
    }

    function populateSlotReels(data) {
        slotReels.forEach(function (reel) {
            const fragment = document.createDocumentFragment();

            reel.style.top = 0;

            data.forEach(function (object) {
                const reelElement = createReelElement(object);
                fragment.appendChild(reelElement);
            });

            reel.appendChild(fragment);
        });
    }

    function spinReels() {
        const reelItemHeight = slotReels[0].parentNode.offsetHeight;
        const reelNodeCount = slotReels[0].childElementCount;
        const reelElementTopCount = reelNodeCount - 1;
        const reelMaxHeight = reelItemHeight * -reelElementTopCount;
        let spinIntervalTimeout = 10000;

        slotReels.forEach(function (reel) {
            const stopOnElement = Math.ceil(Math.random() * reelElementTopCount);

            const spinInterval = setInterval(() => {
                let currentTopPositionNumber = +(reel.style.top.split('p')[0]);
                let newTopPosition;

                if(currentTopPositionNumber !== reelMaxHeight) {
                    newTopPosition = currentTopPositionNumber - reelItemHeight;
                } else {
                    newTopPosition = 0;
                }

                reel.style.top = `${newTopPosition}px`;
            }, 50);

            setTimeout(() => {
                clearInterval(spinInterval);
            }, spinIntervalTimeout);

            spinIntervalTimeout += 500;
        });
    }

    populateSlotReels(currentData);

    slotStartButton.addEventListener('click', spinReels);

    console.log('view initialized');

    const slotMachineView = {
    }

    window.app = window.app || {};
    window.app.slotMachineView = slotMachineView;
})(window);