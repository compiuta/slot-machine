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