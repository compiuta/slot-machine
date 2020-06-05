(function (window) {
    'use strict';

    const bodyTag = document.querySelector('[data-element="bodyTag"]');
    const slotReels = document.querySelectorAll('[data-reel]');
    const slotStartButton = document.querySelector('[data-slot="startButton"]');
    const slotNewGameButton = document.querySelector('[data-slot="newGameButton"]');
    const userCredits = document.querySelector('[data-slot="credits"]');
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
        userCredits.setAttribute('data-credits', amount);
        userCredits.innerText = amount;
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
        app.slotMachineController.updateCredits();

        slotReels.forEach(reel => {
            reel.style.top = 0;
        });

        setSpinButtonState(true);
    }

    function gameOver() {
        toggleResultState('game-over');
        slotNewGameButton.removeAttribute('disabled');
    }

    function playerWins(valueWon) {
        toggleResultState('you-win');
        console.log(valueWon);

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