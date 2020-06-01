(function (window) {
    'use strict';

    let currentData;

    function getCurrentData(dataType) {
        currentData = app.slotMachineModel.getData(dataType);
       return currentData;
   }

   function updateCredits(amount, waitingResponse) {
       app.slotMachineModel.updateCredits(amount, waitingResponse);
   }

    function evaluateSlotRow(chosenSlotsArray) {
        const slotToMatch = chosenSlotsArray[0].dataset.chosenSlot;
        const slotValue = currentData.slots[slotToMatch].value;
        let isMatch = true;

        chosenSlotsArray.forEach(slot => {
           if(slot.dataset.chosenSlot !== slotToMatch) {
               isMatch = false;
               return;
           }
        });

        if(isMatch) {
            updateCredits(slotValue, true);
        } else {
            app.slotMachineView.showSlotResults(isMatch, slotValue);
        }
    }

    function creditsUpdated(updatedCredits, waitingResults, valueAdded) {
        app.slotMachineView.populateUserCredits(updatedCredits);

        if(waitingResults) {
            app.slotMachineView.showSlotResults(true, valueAdded);
        }
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
        updateCredits: function (amount, waitingResponse) {
            updateCredits(amount, waitingResponse);
        },
        creditsUpdated: function (updatedCredits, waitingResults, valueAdded) {
            creditsUpdated(updatedCredits, waitingResults, valueAdded);
        }
    }

    window.app = window.app || {};
    window.app.slotMachineController = slotMachineController;
})(window);