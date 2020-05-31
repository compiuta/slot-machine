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
(function (window) {
    'use strict';

    const slotReels = document.querySelectorAll('[data-reel]');
    const slotStartButton = document.querySelector('[data-slot="startButton"]');
    const userCredits = document.querySelector('[data-slot="credits"]');
    const currentData = app.slotMachineController.getCurrentData('default');

    function createReelElement(object, key, index) {
        const reelElementContainer = document.createElement('div');
        const image = document.createElement('img');
        const slotPosition = index + 1;

        reelElementContainer.setAttribute('data-slot-position', slotPosition);
        reelElementContainer.setAttribute('data-symbol', key);
        reelElementContainer.setAttribute('data-slot-value', object.value);

        reelElementContainer.classList.add('slot--reel-element');
        reelElementContainer.classList.add(object.symbol);

        image.classList.add('reel-image');
        image.src = `dist/images/${object.symbol}.png`;

        reelElementContainer.appendChild(image);

        return reelElementContainer;
    }

    function populateSlotReels(data) {
        const slotData = data.slots;

        slotReels.forEach(function (reel) {
            const fragment = document.createDocumentFragment();

            reel.style.top = 0;

            Object.keys(slotData).forEach(function (key, index) {
                const reelElement = createReelElement(slotData[key], key, index);
                fragment.appendChild(reelElement);
            });

            reel.appendChild(fragment);
        });
    }

    function populateUserCredits(amount) {
        userCredits.setAttribute('data-credits', amount);
        userCredits.innerText = amount;
    }

    function spinReels() {
        const reelItemHeight = slotReels[0].parentNode.offsetHeight;
        const reelNodeCount = slotReels[0].childElementCount;
        const reelElementTopCount = reelNodeCount - 1;
        const reelMaxHeight = reelItemHeight * -reelElementTopCount;
        const passOneReelSlotInterval = 50;
        const fullSpinInterval = 300;
        const initialSpinIntervalTimeout = 7500;

        app.slotMachineController.updateCredits(-1);

        console.log(`reel count using .length ${slotReels.length}`);

        slotReels.forEach(function (reel, index) {
            const selectRandomReelSlot = Math.ceil(Math.random() * reelNodeCount);
            const stopOnElement = selectRandomReelSlot - 1;
            const spinIntervalTimeout = initialSpinIntervalTimeout + (index * fullSpinInterval) + (passOneReelSlotInterval * stopOnElement);

            console.log('selectRandomReelSlot ' + selectRandomReelSlot);
            console.log('stopOnElement: ' + stopOnElement);
            console.log('spinIntervalTimeout: ' + spinIntervalTimeout);

            reel.style.top = 0;

            reel.setAttribute('data-chosen-slot', selectRandomReelSlot);

            slotStartButton.classList.add('button--disabled');
            slotStartButton.setAttribute('disabled', 'disabled');

            const spinInterval = setInterval(() => {
                let currentTopPositionNumber = +(reel.style.top.split('p')[0]);
                let newTopPosition;

                if(currentTopPositionNumber !== reelMaxHeight) {
                    newTopPosition = currentTopPositionNumber - reelItemHeight;
                } else {
                    newTopPosition = 0;
                }

                reel.style.top = `${newTopPosition}px`;
            }, passOneReelSlotInterval);

            setTimeout(() => {
                clearInterval(spinInterval);

                if(index === (slotReels.length - 1)) {
                    app.slotMachineController.evaluateSlotRow(slotReels);
                }
            }, spinIntervalTimeout);

        });
    }

    function showSlotResults(isMatch, slotPosition) {
        if(isMatch) {
            const matchedSlot = document.querySelector(`[data-slot-position="${slotPosition}"]`);
            console.log(`you win ${matchedSlot.dataset.slotValue}`);
        } else {
            console.log('try again');
        }

        slotStartButton.classList.remove('button--disabled');
        slotStartButton.removeAttribute('disabled');
    }

    populateSlotReels(currentData);

    slotStartButton.addEventListener('click', spinReels);
    window.addEventListener('load', function () {
        app.slotMachineController.updateCredits();
    });

    console.log('view initialized');

    const slotMachineView = {
        showSlotResults: function (isMatch, slotToMatch) {
            showSlotResults(isMatch, slotToMatch);
        },
        populateUserCredits: function (amount) {
            populateUserCredits(amount);
        }
    }

    window.app = window.app || {};
    window.app.slotMachineView = slotMachineView;
})(window);