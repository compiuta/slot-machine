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