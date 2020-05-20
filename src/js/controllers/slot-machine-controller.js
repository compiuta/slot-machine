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