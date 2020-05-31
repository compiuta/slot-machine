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

    function updateCredits(amount) {
        const getCredits = localStorage.getItem('userCredits');
        let currentCredits;

        if(getCredits) {
            currentCredits = +(getCredits);
        } else {
            localStorage.setItem('userCredits', 5);
            currentCredits = 5;
        }

        if(amount) {
            currentCredits += amount;
            localStorage.setItem('userCredits', currentCredits);
        }

        app.slotMachineController.creditsUpdated(currentCredits);
    }

    console.log('model initialzed');

    const slotMachineModel = {
        getData: function (stateRequested) {
            if (stateRequested === 'default') {
                return defaultSlotData;
            }
        },
        updateCredits: function (amount) {
            updateCredits(amount);
        }
    }

    window.app = window.app || {};
    window.app.slotMachineModel = slotMachineModel;
})(window);