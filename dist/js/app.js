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

    function evaluateRow() {

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
        let numberOfSpins = 10;


        slotReels.forEach(function (reel) {
            let currentTopPositionNumber = +(reel.style.top.split('p')[0]);
            const stopOnElement = Math.ceil(Math.random() * reelNodeCount);
            console.log(stopOnElement);
            let i;
            let n;

            for(i = 0; i <= numberOfSpins; i += 1) {
                for(n = 0; n <= reelNodeCount; n += 1) {
                        if (n < reelNodeCount) {
                            currentTopPositionNumber = currentTopPositionNumber + reelItemHeight;

                            if(i === numberOfSpins && n === stopOnElement) {
                                console.log('i: ' + i);
                                console.log('numberofspin: ' + numberOfSpins);
                                console.log('n: ' + n);
                                console.log('stoponelement: ' + stopOnElement);
                                break;

                            }
                        } else {
                            currentTopPositionNumber = 0;
                        }

                    reel.style.top = `-${currentTopPositionNumber}px`;
                }
            }

            numberOfSpins += 1;
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