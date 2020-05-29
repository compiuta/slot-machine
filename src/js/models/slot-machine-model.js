(function (window) {
    'use strict';

    const defaultSlotData = {
        slots: {
            dimond: {
                symbol: 'diamond',
                value: 200
            },
            seven: {
                symbol: 'seven',
                value: 80
            },
            tripleBar: {
                symbol: 'triple-bar',
                value: 40
            },
            doubleBar: {
                symbol: 'double-bar',
                value: 30
            },
            singleBar: {
                symbol: 'single-bar',
                value: 20
            },
            cherry: {
                symbol: 'cherry',
                value: 10
            }
        }
    };

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