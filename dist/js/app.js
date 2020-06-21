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
    const playerInfoCreditsWon = document.querySelector('[data-player-info="creditsWon"]');
    const playerInfoCurrentCredits = document.querySelector('[data-player-info="playerCredits"]');
    const slotStartButton = document.querySelector('[data-slot="startButton"]');
    const slotNewGameButton = document.querySelector('[data-slot="newGameButton"]');
    const slotPlayCreditButton = document.querySelector('[data-slot="playCreditButton"]');
    const currentData = app.slotMachineController.getCurrentData('default');
    const soundSpinEl = document.querySelector('[data-slot-audio="spin"]');
    const soundReelEl = document.querySelector('[data-slot-audio="reelSounds"]');
    const resultStateTimeout = 1000;
    let playedCredits = 1;
    let creditCounter;
    let currentState;

    function setPlayedCredits() {
        if (playedCredits === 1) {
            playedCredits = 2;
            slotPlayCreditButton.innerText = 'Play 1 Credit';
        } else {
            playedCredits = 1;
            slotPlayCreditButton.innerText = 'Play 2 Credits';
        }
    }

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

    function reelSpinInnerSetTimeOut(spinInterval, index) {
        soundReelEl.pause();
        soundReelEl.currentTime = 0;
        clearInterval(spinInterval);
        soundReelEl.play();

        if(index === (slotReels.length - 1)) {
            soundSpinEl.pause();
            soundSpinEl.currentTime = 0;
            bodyTag.classList.remove('slot-spin');
            app.slotMachineController.evaluateSlotRow(slotReels);
        }
    }

    function spinReels() {
        const reelItemHeight = slotReels[0].parentNode.offsetHeight;
        const reelNodeCount = slotReels[0].childElementCount;
        const reelElementTopCount = reelNodeCount - 1;
        const reelMaxHeight = reelItemHeight * -reelElementTopCount;
        const passOneReelSlotInterval = 50;
        const fullSpinInterval = 300;
        const initialSpinIntervalTimeout = 7500;

        app.slotMachineController.updateCredits(playedCredits * -1);

        soundSpinEl.play();

        if(currentState) {
            toggleResultState(currentState);
            playerInfoCreditsWon.innerText = '';
            soundReelEl.currentTime = 0;
        }

        bodyTag.classList.add('slot-spin');

        soundReelEl.src = 'dist/audio/stop-reel.wav';

        slotReels.forEach(function (reel, index) {
            const selectRandomReelSlot = Math.ceil(Math.random() * reelNodeCount);
            const chosenReelSlotElementSymbol = document.querySelector(`[data-slot-position="${selectRandomReelSlot}"]`).dataset.symbol;
            const stopOnElement = selectRandomReelSlot - 1;
            const spinIntervalTimeout = initialSpinIntervalTimeout + (index * fullSpinInterval) + (passOneReelSlotInterval * stopOnElement);

            reel.style.top = 0;
            reel.setAttribute('data-chosen-slot', chosenReelSlotElementSymbol);

            setSpinButtonState(false);

            const spinInterval = setInterval(() => {
                reel.style.top = newReelPosition(reel, reelItemHeight, reelMaxHeight);
            }, passOneReelSlotInterval);

            setTimeout(() => {
                reelSpinInnerSetTimeOut(spinInterval, index);
            }, spinIntervalTimeout);

        });
    }

    function toggleResultState(state) {
        if (bodyTag.classList.contains(state)) {
            currentState = '';
        } else {
            currentState = state;
        }

        bodyTag.classList.toggle(state);
    }

    function startNewGame() {
        playerInfoCreditsWon.innerText = '';
        toggleResultState('game-over');
        slotNewGameButton.setAttribute('disabled', 'disabled');
        slotNewGameButton.classList.add('button--disabled');
        slotPlayCreditButton.classList.remove('button--disabled');
        slotPlayCreditButton.remove('disabled');
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
        slotPlayCreditButton.classList.add('button--disabled');
        slotPlayCreditButton.setAttribute('disabled', 'disabled');
        playerInfoCreditsWon.innerText = 'Game Over';
    }

    function playerWins(valueWon) {
        soundReelEl.src = 'dist/audio/win.wav';
        soundReelEl.play();
        toggleResultState('you-win');
        playerInfoCreditsWon.innerText = valueWon;

        setTimeout(() => {
            setSpinButtonState(true);
        }, resultStateTimeout);
    }

    function playerLoses() {
        toggleResultState('try-again');
        playerInfoCreditsWon.innerText = 'Try Again';

        setTimeout(() => {
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

    if ((/Mobi/i.test(navigator.userAgent)) || (/Android/i.test(navigator.userAgent))) {
        bodyTag.classList.add('mobile');
    }

    populateSlotReels(currentData);

    slotStartButton.addEventListener('click', spinReels);
    slotNewGameButton.addEventListener('click', startNewGame);
    slotPlayCreditButton.addEventListener('click', setPlayedCredits);
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