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