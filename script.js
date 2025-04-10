    $(document).ready(function() {
      const character = document.getElementById('character');
      const characterShadow = document.querySelector('.character-shadow');
      const moveSpeed = 10;
      const gameAreaWidth = $('#gameArea').width();
      const characterWidth = 100;
      let position = 300;
      let isJumping = false;
      let hasInteractedWithDresser = false;
      let hasInteractedWithBed = false;
      
      const backgroundMusic = document.getElementById('backgroundMusic');
      const interactionSound = document.getElementById('interactionSound');
      let isMusicPlaying = false;
      
      backgroundMusic.volume = 0.4;
      interactionSound.volume = 0.6;
      
      $('#musicToggle').on('click', function() {
        if (isMusicPlaying) {
          backgroundMusic.pause();
          $('.music-info').text('Music: Off');
          $('#musicToggle').text('♪');
        } else {
          backgroundMusic.play();
          $('.music-info').text('Music: On');
          $('#musicToggle').text('♫');
        }
        isMusicPlaying = !isMusicPlaying;
      });
      
      $('#musicToggle').click(); 
      function updateCharacterPosition() {
        character.style.left = position + 'px';
        characterShadow.style.left = (position + 15) + 'px';
        
        checkObjectInteractions();
      }
      
      function playInteractionSound() {
        interactionSound.currentTime = 0;
        interactionSound.play();
      }
      
      function checkObjectInteractions() {
        const dresserRect = $('.dresser')[0].getBoundingClientRect();
        const bedRect = $('.bed')[0].getBoundingClientRect();
        const characterRect = character.getBoundingClientRect();
        
        if (!hasInteractedWithDresser && 
            Math.abs(characterRect.left - dresserRect.left) < 100 && 
            characterRect.left < dresserRect.right && 
            characterRect.right > dresserRect.left) {
          showPopup('dresserPopup');
          playInteractionSound();
          hasInteractedWithDresser = true;
        }
        
        if (!hasInteractedWithBed && 
            Math.abs(characterRect.right - bedRect.left) < 100 && 
            characterRect.left < bedRect.right && 
            characterRect.right > bedRect.left) {
          showPopup('bedPopup');
          playInteractionSound();
          hasInteractedWithBed = true;
        }
      }
      
      function showPopup(popupId) {
        $('#' + popupId).fadeIn(300);
      }
      
      window.closePopup = function(popupId) {
        $('#' + popupId).fadeOut(300);
      };
      
      function moveLeft() {
        if (position > 0) {
          position -= moveSpeed;
          character.style.transform = 'scaleX(-1)'; 
          character.style.animation = 'walk 0.3s infinite';
          updateCharacterPosition();
        }
      }
      
      function moveRight() {
        if (position < gameAreaWidth - characterWidth) {
          position += moveSpeed;
          character.style.transform = 'scaleX(1)';
          character.style.animation = 'walk 0.3s infinite';
          updateCharacterPosition();
        }
      }
      
      function jump() {
        if (!isJumping) {
          isJumping = true;
          character.style.animation = 'jump 0.5s ease-out';
          
          setTimeout(() => {
            character.style.animation = '';
            isJumping = false;
          }, 500);
        }
      }
      
      function resetInteraction(object, distance) {
        const objectRect = $(object)[0].getBoundingClientRect();
        const characterRect = character.getBoundingClientRect();
        
        if (Math.abs(characterRect.left - objectRect.left) > distance) {
          if (object === '.dresser') {
            hasInteractedWithDresser = false;
          } else if (object === '.bed') {
            hasInteractedWithBed = false;
          }
        }
      }
      
      function checkResetInteractions() {
        resetInteraction('.dresser', 200);
        resetInteraction('.bed', 300);
      }
      
      $('#moveLeft').on('click', function() {
        moveLeft();
        checkResetInteractions();
      });
      
      $('#moveRight').on('click', function() {
        moveRight();
        checkResetInteractions();
      });
      
      $('#jump').on('click', jump);
      
      $(document).keydown(function(e) {
        switch(e.which) {
          case 37: 
            moveLeft();
            checkResetInteractions();
            break;
          case 38:
            jump();
            break;
          case 39: 
            moveRight();
            checkResetInteractions();
            break;
          default: return;
        }
        e.preventDefault();
      });
      
      $(document).keyup(function(e) {
        if (e.which === 37 || e.which === 39) {
          character.style.animation = '';
        }
      });
      
      $('.interactive').on('click', function() {
        if ($(this).hasClass('dresser')) {
          showPopup('dresserPopup');
          playInteractionSound();
        } else if ($(this).hasClass('bed')) {
          showPopup('bedPopup');
          playInteractionSound();
        }
      });
      
      updateCharacterPosition();
    });
