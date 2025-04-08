
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
        cripto++;

        //affichage la valeur dans la div
        document.getElementById('cripto').innerHTML = cripto + " BTC";

        // Sauvegarde dans localStorage
        localStorage.setItem('cripto', cripto);
    });
}

setupCriptoClicker();


function passivIncome() {
    setInterval(() => {
        cripto++;
        
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
        alert('Le compteur a été réinitialisé !');
    });
}

resetCounter();