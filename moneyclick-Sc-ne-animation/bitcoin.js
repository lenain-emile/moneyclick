
let cripto = parseInt(localStorage.getItem('cripto')) || 0;


function setupCriptoClicker() {
    
    // Récupère la valeur "cripto" depuis le localStorage, la convertit en nombre entier.
    // Si aucune valeur n'existe on utilise 0 par défaut.

    // Affiche la valeur actuelle de "cripto" (BTC) dans la div avec l'id "cripto"
    document.getElementById('cripto').innerHTML = cripto + " BTC";
    document.getElementById('button').addEventListener('click', function() {
        // Joue le son situé dans le dossier "media"
        let audio = new Audio('media/mario.mp3');
        audio.play();
        cripto+= 1; // Incrémente la valeur de 1 BTC chaque fois que le bouton est cliqué

        //affichage la valeur dans la div
        document.getElementById('cripto').innerHTML = cripto + " BTC";

        // Sauvegarde dans localStorage
        localStorage.setItem('cripto', cripto);
    });
}

setupCriptoClicker();


function passivIncome() {
    setInterval(() => {
        cripto+=1;
        
        // Mise à jour de l'affichage
        document.getElementById('cripto').innerHTML = cripto + " BTC";
        
        // Sauvegarde dans le localStorage
        localStorage.setItem('cripto', cripto);
    }, 1000); // Incrémente toutes les 1000ms (1 seconde)
}
passivIncome();



function resetCounter() {
    document.getElementById('reset').addEventListener('click', function() {
        localStorage.clear();
        location.reload();
       
    });
}

resetCounter();



function setupBoost(boostId, threshold, reward) {
    const boostButton = document.getElementById(boostId);
    const boostUsedKey = boostId + '_used';

    // Masquer ou afficher selon cripto et si déjà utilisé
    function updateButton() {
        const boostUsed = localStorage.getItem(boostUsedKey) === 'true';
        if (!boostUsed && cripto >= threshold) {
            boostButton.style.display = 'block';
        } else {
            boostButton.style.display = 'none';
        }
    }

    // Action du boost
    boostButton.addEventListener('click', function() {
        if (localStorage.getItem(boostUsedKey) === 'true') return;

        cripto += reward;
        document.getElementById('cripto').innerHTML = cripto + " BTC";
        localStorage.setItem('cripto', cripto);
        localStorage.setItem(boostUsedKey, 'true');
        boostButton.style.display = 'none';
    });

    // Vérifier régulièrement
    setInterval(updateButton, 1000);
    updateButton(); // appel initial
}

// Appelle cette fonction pour chaque palier
setupBoost('boost10', 20, 50);
setupBoost('boost50', 100, 150);
setupBoost('boost300', 300, 50);
setupBoost('boost100', 600, 200);

boostCripto100();


