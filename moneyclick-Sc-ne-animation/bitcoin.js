let cripto = parseInt(localStorage.getItem('cripto')) || 0;
let usd = parseInt(localStorage.getItem('usd')) || 0;

let clickGain = parseInt(localStorage.getItem('clickGain')) || 1;
let passiveGain = parseInt(localStorage.getItem('passiveGain')) || 1;
let lastMilestone = parseInt(localStorage.getItem('lastMilestone')) || 0;

let passiveIncomeStarted = false;

function setupCriptoClicker() {
    document.getElementById('cripto').innerHTML = cripto + " BTC";

    document.getElementById('button').addEventListener('click', function () {
        let audio = new Audio('media/mario.mp3');
        audio.play();

        cripto += clickGain;
        document.getElementById('cripto').innerHTML = cripto + " BTC";
        localStorage.setItem('cripto', cripto);

        checkPassiveButtonVisibility();
        checkForMilestone();
    });
}

function passivIncome() {
    if (passiveIncomeStarted) return;
    passiveIncomeStarted = true;

    setInterval(() => {
        cripto += passiveGain;
        document.getElementById('cripto').innerHTML = cripto + " BTC";
        localStorage.setItem('cripto', cripto);
        checkPassiveButtonVisibility();
        checkForMilestone();
    }, 1000);
}

function checkPassiveButtonVisibility() {
    const passiveBtn = document.getElementById('passiveBtn');
    if (cripto >= 10) {
        passiveBtn.style.display = 'block';
    } else {
        passiveBtn.style.display = 'none';
    }
}

function resetCounter() {
    document.getElementById('reset').addEventListener('click', function () {
        localStorage.clear();
        location.reload();
    });
}

function setupBoost(boostId, threshold, reward, boostMultiplier = 1) {
    const boostButton = document.getElementById(boostId);
    const boostUsedKey = boostId + '_used';
    const boostRewardKey = boostId + '_reward';

    function updateButton() {
        const boostUsed = localStorage.getItem(boostUsedKey) === 'true';
        const currentReward = parseInt(localStorage.getItem(boostRewardKey)) || reward;
        if (!boostUsed && cripto >= threshold) {
            boostButton.style.display = 'block';
        } else {
            boostButton.style.display = 'none';
        }
    }

    boostButton.addEventListener('click', function () {
        if (localStorage.getItem(boostUsedKey) === 'true') return;

        let currentReward = parseInt(localStorage.getItem(boostRewardKey)) || reward;
        cripto += currentReward;

        // Augmenter la récompense pour le prochain palier
        currentReward *= boostMultiplier;
        localStorage.setItem(boostRewardKey, currentReward);  // Sauvegarder la nouvelle récompense

        document.getElementById('cripto').innerHTML = cripto + " BTC";
        localStorage.setItem('cripto', cripto);
        localStorage.setItem(boostUsedKey, 'true');
        boostButton.style.display = 'none';
        checkPassiveButtonVisibility();
    });

    setInterval(updateButton, 1000);
    updateButton();
}

function setupExchange() {
    const exchangeBtn = document.getElementById('exchangeBtn');
    const usdDisplay = document.getElementById('usd');
    const usdGain = document.getElementById('usdGain');

    usdDisplay.innerHTML = usd + " €";

    exchangeBtn.addEventListener('click', function () {
        if (cripto >= 200) {
            cripto -= 200;
            usd += 50;

            document.getElementById('cripto').innerHTML = cripto + " BTC";
            usdDisplay.innerHTML = usd + " € <span id='usdGain' class='gain-animation'>+50 €</span>";
            localStorage.setItem('cripto', cripto);
            localStorage.setItem('usd', usd);

            const gainEl = document.getElementById('usdGain');
            gainEl.classList.add('show');

            setTimeout(() => {
                gainEl.classList.remove('show');
            }, 800);

            checkPassiveButtonVisibility();
        } else {
            alert("⛔ Vous devez avoir au moins 200 BTC pour échanger !");
        }
    });
}

function checkForMilestone() {
    if (cripto >= lastMilestone + 500) {
        lastMilestone += 500;
        localStorage.setItem('lastMilestone', lastMilestone);
        document.getElementById('milestoneCripto').textContent = lastMilestone;
        document.getElementById('bonusModal').style.display = 'flex';
    }
}

function setupBonusModal() {
    document.getElementById('doubleClickGain').addEventListener('click', function () {
        clickGain += 0.5; // Augmenter le gain de clic de 0.5 au lieu de 1
        localStorage.setItem('clickGain', clickGain);
        document.getElementById('bonusModal').style.display = 'none';
    });

    document.getElementById('doublePassiveIncome').addEventListener('click', function () {
        passiveGain += 0.5; // Augmenter le gain passif de 0.5 au lieu de 1
        localStorage.setItem('passiveGain', passiveGain);
        document.getElementById('bonusModal').style.display = 'none';
    });
}


// Init
setupCriptoClicker();
document.getElementById('passiveBtn').addEventListener('click', passivIncome);
checkPassiveButtonVisibility();
resetCounter();
setupBoost('boost10', 50, 50, 2); // Le boost à 50 BTC augmente à chaque utilisation (multiplicateur de 2)
setupBoost('boost50', 300, 50, 1.5); // Le boost à 50 BTC augmente à chaque utilisation (multiplicateur de 1.5)
setupBoost('boost300', 500, 50, 1.2); // Le boost à 50 BTC augmente à chaque utilisation (multiplicateur de 1.2)
setupBoost('boost100', 800, 200, 1.3); // Le boost à 200 BTC augmente à chaque utilisation (multiplicateur de 1.3)

setupExchange();
setupBonusModal();

function setupRealShop() {
    const openBtn = document.getElementById('openGiftShopBtn');
    const modal = document.getElementById('giftShopModal');
    const closeBtn = document.getElementById('closeGiftShopBtn');
    const inventoryList = document.getElementById('inventoryList');
    let inventory = JSON.parse(localStorage.getItem('inventory')) || [];

    function updateInventoryDisplay() {
        inventoryList.innerHTML = '';
        inventory.forEach(item => {
            const li = document.createElement('li');
            li.textContent = item;
            inventoryList.appendChild(li);
        });
    }

    window.buyItem = function(itemName, price) {
        if (usd >= price) {
            usd -= price;
            inventory.push(itemName);
            localStorage.setItem('usd', usd);
            localStorage.setItem('inventory', JSON.stringify(inventory));
            document.getElementById('usd').innerHTML = usd + " €";
            updateInventoryDisplay();
            alert(`🎉 Vous avez acheté : ${itemName}`);
        } else {
            alert("⛔ Pas assez d'euros !");
        }
    };

    openBtn.addEventListener('click', () => modal.style.display = 'flex');
    closeBtn.addEventListener('click', () => modal.style.display = 'none');
    window.addEventListener('click', (e) => {
        if (e.target === modal) modal.style.display = 'none';
    });

    updateInventoryDisplay();
}
setupRealShop();