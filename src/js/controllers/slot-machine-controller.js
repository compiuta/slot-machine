(function (window) {
    'use strict';

    let currentData;

    function evaluateSlotRow(chosenSlotsArray) {
        const slotToMatch = chosenSlotsArray[0].dataset.chosenSlot;
        let isMatch = true;

        chosenSlotsArray.forEach(slot => {
           if(slot.dataset.chosenSlot !== slotToMatch) {
               isMatch = false;
               return;
           }
        });

        app.slotMachineView.showSlotResults(isMatch, slotToMatch);
    }

    function getCurrentData(dataType) {
         currentData = app.slotMachineModel.getData(dataType);
        return currentData;
    }

    function updateCredits(amount) {
        app.slotMachineModel.updateCredits(amount);
    }

    function creditsUpdated(updatedCredits) {
        app.slotMachineView.populateUserCredits(updatedCredits);
    }

    console.log('controller initialized');

    const slotMachineController = {
        getCurrentData: function (dataType) {
            const dataRequested = getCurrentData(dataType);
            return dataRequested;
        },
        evaluateSlotRow: function (chosenSlotsArray) {
            evaluateSlotRow(chosenSlotsArray);
        },
        updateCredits: function (amount) {
            updateCredits(amount);
        },
        creditsUpdated: function (updatedCredits) {
            creditsUpdated(updatedCredits);
        }
    }

    window.app = window.app || {};
    window.app.slotMachineController = slotMachineController;
})(window);