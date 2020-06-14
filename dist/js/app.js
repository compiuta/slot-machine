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

        if ((getCredits && amount) || (getCredits > 0)) {
            currentCredits = +(getCredits);
        } else {
            localStorage.setItem('userCredits', 5);
            currentCredits = 5;
        }

        if (amount) {
            currentCredits += amount;
            localStorage.setItem('userCredits', currentCredits);
        }

        if (amount < 0) {
            app.slotMachineController.creditsUpdated(currentCredits);
        } else {
            app.slotMachineController.creditsUpdated(currentCredits, amount);
        }
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
        }
    }

    window.app = window.app || {};
    window.app.slotMachineController = slotMachineController;
})(window);
(function (window) {
    'use strict';

    const bodyTag = document.querySelector('[data-element="bodyTag"]');
    const slotReels = document.querySelectorAll('[data-reel]');
    const playerInfoCreditsWon = document.querySelectorAll('[data-player-info="creditsWon"]');
    const playerInfoCurrentCredits = document.querySelector('[data-player-info="playerCredits"]');
    const slotStartButton = document.querySelector('[data-slot="startButton"]');
    const slotNewGameButton = document.querySelector('[data-slot="newGameButton"]');
    const currentData = app.slotMachineController.getCurrentData('default');
    const resultStateTimeout = 1000;
    let creditCounter;

    function setSpinButtonState(isActive) {
        if(isActive) {
            slotStartButton.classList.remove('button--disabled');
            slotStartButton.removeAttribute('disabled');
        } else {
            slotStartButton.classList.add('button--disabled');
            slotStartButton.setAttribute('disabled', 'disabled');
        }
    }

    function createReelElement(object, key, index) {
        const reelElementContainer = document.createElement('div');
        const image = document.createElement('img');
        const slotPosition = index + 1;

        reelElementContainer.setAttribute('data-slot-position', slotPosition);
        reelElementContainer.setAttribute('data-symbol', key);
        reelElementContainer.setAttribute('data-slot-value', object.value);

        reelElementContainer.classList.add('slot-machine__reel-element');
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
        playerInfoCurrentCredits.setAttribute('data-credits', amount);
        playerInfoCurrentCredits.innerText = amount;
        creditCounter = amount;
    }

    function newReelPosition(reel, reelItemHeight, reelMaxHeight) {
        let currentTopPositionNumber = +(reel.style.top.split('p')[0]);
        let newTopPosition;

        if(currentTopPositionNumber !== reelMaxHeight) {
            newTopPosition = currentTopPositionNumber - reelItemHeight;
        } else {
            newTopPosition = 0;
        }

        return `${newTopPosition}px`;
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

        bodyTag.classList.add('slot-spin');

        slotReels.forEach(function (reel, index) {
            const selectRandomReelSlot = Math.ceil(Math.random() * reelNodeCount);
            const chosenReelSlotElementSymbol = document.querySelector(`[data-slot-position="${selectRandomReelSlot}"]`).dataset.symbol;
            const stopOnElement = selectRandomReelSlot - 1;
            const spinIntervalTimeout = initialSpinIntervalTimeout + (index * fullSpinInterval) + (passOneReelSlotInterval * stopOnElement);

            console.log('selectRandomReelSlot ' + selectRandomReelSlot);
            console.log('stopOnElement: ' + stopOnElement);
            console.log('spinIntervalTimeout: ' + spinIntervalTimeout);

            reel.style.top = 0;

            reel.setAttribute('data-chosen-slot', chosenReelSlotElementSymbol);

            setSpinButtonState(false);

            const spinInterval = setInterval(() => {
                reel.style.top = newReelPosition(reel, reelItemHeight, reelMaxHeight);
            }, passOneReelSlotInterval);

            setTimeout(() => {
                clearInterval(spinInterval);

                if(index === (slotReels.length - 1)) {
                    bodyTag.classList.remove('slot-spin');
                    app.slotMachineController.evaluateSlotRow(slotReels);
                }
            }, spinIntervalTimeout);

        });
    }

    function toggleResultState(state) {
        bodyTag.classList.toggle(state);
    }

    function startNewGame() {
        toggleResultState('game-over');
        slotNewGameButton.setAttribute('disabled', 'disabled');
        slotNewGameButton.classList.add('button--disabled');
        app.slotMachineController.updateCredits();

        slotReels.forEach(reel => {
            reel.style.top = 0;
        });

        setSpinButtonState(true);
    }

    function gameOver() {
        toggleResultState('game-over');
        slotNewGameButton.removeAttribute('disabled');
        slotNewGameButton.classList.remove('button--disabled');
    }

    function playerWins(valueWon) {
        toggleResultState('you-win');
        playerInfoCreditsWon.innerText = valueWon;

        setTimeout(() => {
            toggleResultState('you-win');
            setSpinButtonState(true);
        }, resultStateTimeout);
    }

    function playerLoses() {
        toggleResultState('try-again');

        setTimeout(() => {
            toggleResultState('try-again');
            setSpinButtonState(true);
        }, resultStateTimeout);
    }

    function showSlotResults(isMatch, slotValue) {
        if (creditCounter === 0) {
            gameOver();
        } else {
            if (isMatch) {
                playerWins(slotValue);
            } else {
                playerLoses();
            }
        }
    }

    populateSlotReels(currentData);

    slotStartButton.addEventListener('click', spinReels);
    slotNewGameButton.addEventListener('click', startNewGame);
    window.addEventListener('load', function () {
        app.slotMachineController.updateCredits();
    });

    console.log('view initialized');

    const slotMachineView = {
        showSlotResults: function (isMatch, slotValue) {
            showSlotResults(isMatch, slotValue);
        },
        populateUserCredits: function (amount) {
            populateUserCredits(amount);
        }
    }

    window.app = window.app || {};
    window.app.slotMachineView = slotMachineView;
})(window);