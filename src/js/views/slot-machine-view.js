(function (window) {
    'use strict';

    const slotReels = document.querySelectorAll('[data-reel]');
    const slotStartButton = document.querySelector('[data-slot="startButton"]');
    let reelSpinIntervalArr = [];

    const currentData = app.slotMachineController.getCurrentData('default');

    function createReelElement(object, key, index) {
        const reelElementContainer = document.createElement('div');
        const image = document.createElement('img');
        const slotPosition = index + 1;

        reelElementContainer.setAttribute('data-slot-position', slotPosition);
        reelElementContainer.setAttribute('data-symbol', key);
        reelElementContainer.setAttribute('data-slot-value', object.value);

        reelElementContainer.classList.add('slot--reel-element');
        reelElementContainer.classList.add(object.symbol);

        image.classList.add('reel-image');
        image.src = `dist/images/${object.symbol}.png`;

        reelElementContainer.appendChild(image);

        return reelElementContainer;
    }

    function populateSlotReels(data) {
        const slotData = data.slots;

        slotReels.forEach(function (reel) {
            const fragment = document.createDocumentFragment();

            reel.style.top = 0;

            Object.keys(slotData).forEach(function (key, index) {
                const reelElement = createReelElement(slotData[key], key, index);
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
        const passOneReelSlotInterval = 50;
        const fullSpinInterval = 300;
        const initialSpinIntervalTimeout = 7500;

        console.log(`reel count using .length ${slotReels.length}`);

        slotReels.forEach(function (reel, index) {
            const selectRandomReelSlot = Math.ceil(Math.random() * reelNodeCount);
            const stopOnElement = selectRandomReelSlot - 1;
            const spinIntervalTimeout = initialSpinIntervalTimeout + (index * fullSpinInterval) + (passOneReelSlotInterval * stopOnElement);

            console.log('selectRandomReelSlot ' + selectRandomReelSlot);
            console.log('stopOnElement: ' + stopOnElement);
            console.log('spinIntervalTimeout: ' + spinIntervalTimeout);

            reel.style.top = 0;

            reel.setAttribute('data-chosen-slot', selectRandomReelSlot);

            slotStartButton.classList.add('button--disabled');
            slotStartButton.setAttribute('disabled', 'disabled');

            const spinInterval = setInterval(() => {
                let currentTopPositionNumber = +(reel.style.top.split('p')[0]);
                let newTopPosition;

                if(currentTopPositionNumber !== reelMaxHeight) {
                    newTopPosition = currentTopPositionNumber - reelItemHeight;
                } else {
                    newTopPosition = 0;
                }

                reel.style.top = `${newTopPosition}px`;
            }, passOneReelSlotInterval);

            setTimeout(() => {
                clearInterval(spinInterval);

                if(index === (slotReels.length - 1)) {
                    app.slotMachineController.evaluateSlotRow(slotReels);
                }
            }, spinIntervalTimeout);

        });
    }

    function showSlotResults(isMatch, slotPosition) {
        if(isMatch) {
            const matchedSlot = document.querySelector(`[data-slot-position=${slotPosition}]`);
            console.log(`you win ${matchedSlot.dataset.slotValue}`);
        } else {
            console.log('try again');
        }
        
        slotStartButton.classList.remove('button--disabled');
        slotStartButton.removeAttribute('disabled');
    }

    populateSlotReels(currentData);

    slotStartButton.addEventListener('click', spinReels);

    console.log('view initialized');

    const slotMachineView = {
        showSlotResults: function (results) {
            showSlotResults(results);
        }
    }

    window.app = window.app || {};
    window.app.slotMachineView = slotMachineView;
})(window);