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

    const currentData = app.slotMachineController.getCurrentData('default');

    function createReelElement(object) {
        const reelElementContainer = document.createElement('div');

        reelElementContainer.innerText = object.symbol;

        reelElementContainer.setAttribute('data-symbol', object.symbol);
        reelElementContainer.setAttribute('data-value', object.value);
        reelElementContainer.setAttribute('data-frequency', object.frequency);

        reelElementContainer.classList.add('slot--reel-element');
        reelElementContainer.classList.add(object.symbol);

        return reelElementContainer;
    }

    function populateSlotReels(data) {
        slotReels.forEach(function (reel) {
            const fragment = document.createDocumentFragment();

            data.forEach(function (object) {
                const reelElement = createReelElement(object);
                fragment.appendChild(reelElement);
            })

            reel.appendChild(fragment);

        });
    }

    populateSlotReels(currentData);

    console.log('view initialized');

    const slotMachineView = {
    }

    window.app = window.app || {};
    window.app.slotMachineView = slotMachineView;
})(window);