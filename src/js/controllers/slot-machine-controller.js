(function (window) {
    'use strict';

    function evaluateSlotRow(chosenSlotsArray) {
        console.log('evaluating result...');
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