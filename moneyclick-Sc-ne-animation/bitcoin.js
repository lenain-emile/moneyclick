let cripto = parseInt(localStorage.getItem('cripto')) || 0;

function setupCriptoClicker() {
    document.getElementById('cripto').innerHTML = cripto + " BTC";

    document.getElementById('button').addEventListener('click', function () {
        let audio = new Audio('media/mario.mp3');
        audio.play();

        cripto += 1;

        document.getElementById('cripto').innerHTML = cripto + " BTC";
        localStorage.setItem('cripto', cripto);

        checkPassiveButtonVisibility(); //  mise à jour de la visibilité du bouton
    });
}

setupCriptoClicker();

//  Flag pour éviter de lancer plusieurs fois le revenu passif
let passiveIncomeStarted = false;

function passivIncome() {
    if (passiveIncomeStarted) return;
    passiveIncomeStarted = true;

    setInterval(() => {
        cripto += 1;

        document.getElementById('cripto').innerHTML = cripto + " BTC";
        localStorage.setItem('cripto', cripto);

        checkPassiveButtonVisibility(); //  encore ici pour mettre à jour si jamais
    }, 1000);
}

//  Attacher le lancement du revenu passif au clic sur le bouton
document.getElementById('passiveBtn').addEventListener('click', passivIncome);

function checkPassiveButtonVisibility() {
    const passiveBtn = document.getElementById('passiveBtn');
    if (cripto >= 10) { // 
        passiveBtn.style.display = 'block';
    } else {
        passiveBtn.style.display = 'none';
    }
}

//  Appel initial pour que le bouton apparaisse si cripto déjà assez élevé
checkPassiveButtonVisibility();

function resetCounter() {
    document.getElementById('reset').addEventListener('click', function () {
        localStorage.clear();
        location.reload();
    });
}

resetCounter();

function setupBoost(boostId, threshold, reward) {
    const boostButton = document.getElementById(boostId);
    const boostUsedKey = boostId + '_used';

    function updateButton() {
        const boostUsed = localStorage.getItem(boostUsedKey) === 'true';
        if (!boostUsed && cripto >= threshold) {
            boostButton.style.display = 'block';
        } else {
            boostButton.style.display = 'none';
        }
    }

    boostButton.addEventListener('click', function () {
        if (localStorage.getItem(boostUsedKey) === 'true') return;

        cripto += reward;
        document.getElementById('cripto').innerHTML = cripto + " BTC";
        localStorage.setItem('cripto', cripto);
        localStorage.setItem(boostUsedKey, 'true');
        boostButton.style.display = 'none';

        checkPassiveButtonVisibility(); // 
    });

    setInterval(updateButton, 1000);
    updateButton();
}

setupBoost('boost10', 50, 50);
setupBoost('boost50', 300, 50);
setupBoost('boost300', 500, 50);
setupBoost('boost100', 800, 200);


let usd = parseInt(localStorage.getItem('usd')) || 0;

function setupExchange() {
    const exchangeBtn = document.getElementById('exchangeBtn');
    const usdDisplay = document.getElementById('usd');
    const usdGain = document.getElementById('usdGain');

    usdDisplay.innerHTML = usd + " €";

    exchangeBtn.addEventListener('click', function () {
        if (cripto >= 200) {
            cripto -= 200;
            usd += 50;

            // Mise à jour affichage
            document.getElementById('cripto').innerHTML = cripto + " BTC";
            usdDisplay.innerHTML = usd + " € <span id='usdGain' class='gain-animation'>+50 €</span>";
            localStorage.setItem('cripto', cripto);
            localStorage.setItem('usd', usd);

            // Animation
            const gainEl = document.getElementById('usdGain');
            gainEl.classList.add('show');

            // Enlève l'animation après un petit délai
            setTimeout(() => {
                gainEl.classList.remove('show');
            }, 800);

            checkPassiveButtonVisibility();
        } else {
            alert("⛔ Pas assez de BTC pour échanger !");
        }
    });
}

setupExchange();
