(function (window) {
    'use strict';

    let currentData;
    let playedCredits = 1;

    function getCurrentData(dataType) {
        currentData = app.slotMachineModel.getData(dataType);
       return currentData;
   }

   function updateCredits(amount, waitingResponse) {
       app.slotMachineModel.updateCredits(amount, waitingResponse);
   }

    function evaluateSlotRow(chosenSlotsArray) {
        const slotToMatch = chosenSlotsArray[0].dataset.chosenSlot;
        const slotValue = (currentData.slots[slotToMatch].value) * playedCredits;

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
            app.slotMachineView.showSlotResults(false);
        }
    }

    function creditsUpdated(updatedCredits, valueAdded) {
        app.slotMachineView.populateUserCredits(updatedCredits);

        if(valueAdded) {
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
        creditsUpdated: function (updatedCredits,  valueAdded) {
            creditsUpdated(updatedCredits, valueAdded);
        },
        updatePlayedCredits: function (playedCreditsAmount) {
            playedCredits = playedCreditsAmount;
        }
    }

    window.app = window.app || {};
    window.app.slotMachineController = slotMachineController;
})(window);