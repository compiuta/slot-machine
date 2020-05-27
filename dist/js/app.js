(function (window) {
    'use strict';

    const defaultSlotData = [
        {
            symbol: 'wild',
            value: '',
            frequency: 2
        },
        {
            symbol: 'seven',
            value: 80,
            frequency: 1
        },
        {
            symbol: 'triple-bar',
            value: 40,
            frequency: 2
        },
        {
            symbol: 'double-bar',
            value: 25,
            frequency: 2
        },
        {
            symbol: 'single-bar',
            value: 10,
            frequency: 2
        },
        {
            symbol: 'cherry',
            value: 10,
            frequency: 1
        }
    ];

    console.log('model initialzed');

    const slotMachineModel = {
        getData: function (stateRequested) {
            if (stateRequested === 'default') {
                return defaultSlotData;
            }
        }
    }

    window.app = window.app || {};
    window.app.slotMachineModel = slotMachineModel;
})(window);
(function (window) {
    'use strict';

    function evaluateSlotRow(chosenSlotsArray) {
        alert('evaluating result...');
        app.slotMachineView.showSlotResults();
    }

    function getCurrentData(dataType) {
        const dataRequested = app.slotMachineModel.getData(dataType);
        return dataRequested;
    }

    console.log('controller initialized');

    const slotMachineController = {
        getCurrentData: function (dataType) {
            const dataRequested = getCurrentData(dataType);
            return dataRequested;
        },
        evaluateSlotRow: function (chosenSlotsArray) {
            evaluateSlotRow(chosenSlotsArray);
        }
    }

    window.app = window.app || {};
    window.app.slotMachineController = slotMachineController;
})(window);
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
        const passOneReelSlotInterval = 50;
        const fullSpinInterval = 300;
        const initialSpinIntervalTimeout = 7500;

        console.log(`reel count using .length ${slotReels.length}`);
        console.log(reelElementTopCount);


        slotReels.forEach(function (reel, index) {
            const selectRandomReelSlot = Math.ceil(Math.random() * reelNodeCount);
            const stopOnElement = selectRandomReelSlot - 1;
            const spinIntervalTimeout = initialSpinIntervalTimeout + (index * fullSpinInterval) + (passOneReelSlotInterval * stopOnElement);
console.log('stop on element '  + stopOnElement);
console.log('selectRandomReelSlot: ' + selectRandomReelSlot)
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
                    const chosenSlotsArray = document.querySelectorAll('[data-chosen-slot]');
                    app.slotMachineController.evaluateSlotRow(chosenSlotsArray);
                }
            }, spinIntervalTimeout);

        });
    }

    function showSlotResults(results) {
        alert('results');
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