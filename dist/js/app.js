(function (window) {
    'use strict';

    const defaultSlotData = [
        {
            symbol: 'diamond',
            value: 800,
            frequency: 2
        },
        {
            symbol: 'seven',
            value: 80,
            frequency: 4
        },
        {
            symbol: 'triple-bar',
            value: 40,
            frequency: 6
        },
        {
            symbol: 'double-bar',
            value: 25,
            frequency: 8
        },
        {
            symbol: 'single-bar',
            value: 10,
            frequency: 10
        },
        {
            symbol: 'cherry',
            value: 10,
            frequency: 12
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

    function populateSlotReels(data) {
        slotReels.forEach(function (reel) {
            reel.innerText = JSON.stringify(data);
        });
    }

    populateSlotReels(currentData);

    console.log('view initialized');

    const slotMachineView = {
    }

    window.app = window.app || {};
    window.app.slotMachineView = slotMachineView;
})(window);