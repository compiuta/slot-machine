(function (window) {
    'use strict';

    const slotReels = document.querySelectorAll('[data-reel]');
    const slotStartButton = document.querySelector('[data-slot="startButton"]');

    console.log('view initialized');

    const slotMachineView = {

    }

    window.app = window.app || {};
    window.app.slotMachineView = slotMachineView;
})(window);