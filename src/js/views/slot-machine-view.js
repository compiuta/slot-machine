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
    const playedCredtsScreen = document.querySelector('[data-player-info="creditsUsed"]');
    const resultStateTimeout = 1000;
    let playedCredits = 1;
    let creditCounter;
    let currentState;

    function setPlayedCredits() {
        if (playedCredits === 1) {
            playedCredits = 2;
            playedCredtsScreen.innerText = 2;
            slotPlayCreditButton.innerText = 'Play 1 Credit';
        } else {
            playedCredits = 1;
            playedCredtsScreen.innerText = 1;
            slotPlayCreditButton.innerText = 'Play 2 Credits';
        }

        app.slotMachineController.updatePlayedCredits(playedCredits);
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

    function spinReels() {
        const reelItemHeight = slotReels[0].parentNode.offsetHeight;
        const reelNodeCount = slotReels[0].childElementCount;
        const reelElementTopCount = reelNodeCount - 1;
        const reelMaxHeight = reelItemHeight * -reelElementTopCount;
        const passOneReelSlotInterval = 50;
        const initialReelRotations = reelNodeCount * 16;

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
            let i = 0;
            const spinInterval = initialReelRotations + (index * reelNodeCount) + stopOnElement;

            reel.style.top = 0;
            reel.setAttribute('data-chosen-slot', chosenReelSlotElementSymbol);

            setSpinButtonState(false);

            function slotReelInterval() {

                reel.style.top = newReelPosition(reel, reelItemHeight, reelMaxHeight);

                i += 1;

                if (i < spinInterval){
                    setTimeout(slotReelInterval, passOneReelSlotInterval);
                }

                if (i === spinInterval) {
                    soundReelEl.pause();
                    soundReelEl.currentTime = 0;
                    soundReelEl.play();

                    if (index === (slotReels.length - 1)) {
                        soundSpinEl.pause();
                        soundSpinEl.currentTime = 0;
                        bodyTag.classList.remove('slot-spin');
                        app.slotMachineController.evaluateSlotRow(slotReels);
                    }
                }
            }

            slotReelInterval();

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
        slotPlayCreditButton.removeAttribute('disabled');
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
        slotPlayCreditButton.removeAttribute('disabled');
        slotPlayCreditButton.classList.remove('button--disabled');

        setTimeout(() => {
            setSpinButtonState(true);
        }, resultStateTimeout);
    }

    function playerLoses() {
        toggleResultState('try-again');
        playerInfoCreditsWon.innerText = 'Try Again';
        slotPlayCreditButton.removeAttribute('disabled');
        slotPlayCreditButton.classList.remove('button--disabled');

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

    function checkCredits() {
        let enoughCredits = true;

        if ((creditCounter - playedCredits) < 0) {
            enoughCredits = false;
        }

        return enoughCredits;
    }

    function startSlotMachine()  {
        const enoughCredits = checkCredits();

        if (enoughCredits) {
            slotPlayCreditButton.setAttribute('disabled', 'disabled');
            slotPlayCreditButton.classList.add('button--disabled');
            playerInfoCreditsWon.innerText = ''
            spinReels();
        } else {
            playerInfoCreditsWon.innerText = 'Low Credits'
        }
    }

    if ((/Mobi/i.test(navigator.userAgent)) || (/Android/i.test(navigator.userAgent))) {
        bodyTag.classList.add('mobile');
    }

    populateSlotReels(currentData);

    slotStartButton.addEventListener('click', startSlotMachine);
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