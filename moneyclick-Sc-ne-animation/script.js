    const character = document.getElementById('character');
    const characterImg = character.querySelector('img');
    const characterShadow = document.querySelector('.character-shadow');
    const moveLeftBtn = document.getElementById('moveLeft');
    const moveRightBtn = document.getElementById('moveRight');
    const jumpBtn = document.getElementById('jump');
    const gameArea = document.getElementById('gameArea');
    const dayNightCycle = document.querySelector('.day-night-cycle');

    let position = 300;
    let isJumping = false;
    let isMovingLeft = false;
    let isMovingRight = false;
    let facing = 'right';
    let animationId;
    let walkAnimationId;
    let lastTimestamp = 0;
    let speed = 0;
    let acceleration = 0.5;
    let maxSpeed = 5;
    let friction = 0.9;
    let dayNightPhase = 0;

    function getMaxPosition() {
      return gameArea.offsetWidth - character.offsetWidth - 20;
    }

    function updateCharacterPosition() {
      character.style.left = position + 'px';
      characterShadow.style.left = position + 15 + 'px';
    }

    function walkAnimation() {
      if ((isMovingLeft || isMovingRight) && !isJumping) {
        character.style.animation = 'walk 0.5s infinite';
      } else {
        character.style.animation = 'none';
      }
    }

    function jump() {
      if (!isJumping) {
        isJumping = true;
        character.style.animation = 'jump 0.5s ease-out';
        
        // Shrink and fade shadow during jump
        characterShadow.style.width = '40px';
        characterShadow.style.opacity = '0.2';
        
        setTimeout(() => {
          isJumping = false;
          character.style.animation = (isMovingLeft || isMovingRight) ? 'walk 0.5s infinite' : 'none';
          
          // Return shadow to normal
          characterShadow.style.width = '70px';
          characterShadow.style.opacity = '0.3';
        }, 500);
      }
    }

    function updateGameLoop(timestamp) {
      // Time-based animation for smooth movement
      const deltaTime = timestamp - lastTimestamp;
      lastTimestamp = timestamp;
      
      // Physics-based movement
      if (isMovingLeft) {
        speed -= acceleration;
        facing = 'left';
        character.style.transform = 'scaleX(-1)';
      } else if (isMovingRight) {
        speed += acceleration;
        facing = 'right';
        character.style.transform = 'scaleX(1)';
      } else {
        // Apply friction when not moving
        speed *= friction;
      }
      
      // Limit speed
      speed = Math.max(-maxSpeed, Math.min(maxSpeed, speed));
      
      // Apply movement if speed is significant
      if (Math.abs(speed) > 0.1) {
        position += speed;
        position = Math.max(20, Math.min(position, getMaxPosition()));
        updateCharacterPosition();
        walkAnimation();
      } else {
        speed = 0;
        character.style.animation = 'none';
      }
      
      // Update day/night cycle slowly
      dayNightPhase += 0.0005;
      if (dayNightPhase > 2) dayNightPhase = 0;
      
      updateLighting(dayNightPhase);
      
      animationId = requestAnimationFrame(updateGameLoop);
    }

    function updateLighting(phase) {
      // 0 = morning, 0.5 = noon, 1 = evening, 1.5 = night
      let opacity, color;
      
      if (phase < 0.5) {
        // Morning to noon (getting brighter)
        opacity = 0.1 - (phase * 0.1);
        color = `rgba(255, 253, 245, ${opacity})`;
      } else if (phase < 1) {
        // Noon to evening (getting warmer)
        opacity = (phase - 0.5) * 0.2;
        color = `rgba(255, 200, 150, ${opacity})`;
      } else if (phase < 1.5) {
        // Evening to night (getting darker)
        opacity = (phase - 1) * 0.6;
        color = `rgba(20, 20, 50, ${opacity})`;
      } else {
        // Night to morning (getting lighter)
        opacity = 0.3 - ((phase - 1.5) * 0.3);
        color = `rgba(20, 20, 80, ${opacity})`;
      }
      
      dayNightCycle.style.background = color;
      
      // Update window lighting
      const window = document.querySelector('.window');
      if (phase < 0.5 || phase > 1.5) {
        // Morning or late night
        window.style.background = 'linear-gradient(to bottom, #a7c8e6, #c7e6ff)';
      } else if (phase < 1) {
        // Noon to evening
        window.style.background = 'linear-gradient(to bottom, #ffd89b, #ffefba)';
      } else {
        // Night
        window.style.background = 'linear-gradient(to bottom, #141e30, #243b55)';
      }
      
      // Adjust lamp glow based on time of day
      const lampShade = document.querySelector('.lamp-shade');
      if (phase > 1 && phase < 1.8) {
        // Night time - lamp on
        lampShade.style.boxShadow = '0 0 20px 10px rgba(255, 223, 158, 0.5)';
      } else {
        // Day time - lamp dimmer
        lampShade.style.boxShadow = '0 0 20px 5px rgba(255, 223, 158, 0.2)';
      }
    }

    function startMoving(direction) {
      if (direction === 'left') {
        isMovingLeft = true;
        isMovingRight = false;
      } else if (direction === 'right') {
        isMovingRight = true;
        isMovingLeft = false;
      }
    }

    function stopMoving(direction) {
      if (direction === 'left') {
        isMovingLeft = false;
      } else if (direction === 'right') {
        isMovingRight = false;
      }
    }

    // Button controls
    moveLeftBtn.addEventListener('mousedown', () => startMoving('left'));
    moveRightBtn.addEventListener('mousedown', () => startMoving('right'));
    moveLeftBtn.addEventListener('mouseup', () => stopMoving('left'));
    moveRightBtn.addEventListener('mouseup', () => stopMoving('right'));
    moveLeftBtn.addEventListener('mouseleave', () => stopMoving('left'));
    moveRightBtn.addEventListener('mouseleave', () => stopMoving('right'));
    jumpBtn.addEventListener('click', jump);

    // Keyboard controls
    document.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') {
        startMoving('left');
      }
      if (e.key === 'ArrowRight'){
        startMoving('right')
      }
      if (e.key === ' ' || e.key === 'ArrowUp')
      {
        jump();
      } 
    });

    document.addEventListener('keyup', (e) => {
      if (e.key === 'ArrowLeft') stopMoving('left');
      if (e.key === 'ArrowRight') stopMoving('right');
    });

    // Touch controls for mobile
    moveLeftBtn.addEventListener('touchstart', () => startMoving('left'));
    moveRightBtn.addEventListener('touchstart', () => startMoving('right'));
    moveLeftBtn.addEventListener('touchend', () => stopMoving('left'));
    moveRightBtn.addEventListener('touchend', () => stopMoving('right'));
    jumpBtn.addEventListener('touchstart', jump);

    // Initialize character position
    updateCharacterPosition();

    // Start the game loop
    animationId = requestAnimationFrame(updateGameLoop);

    function openModal() {
      const modal = document.getElementById('customModal');
      modal.style.display = 'block';
    }
    
    function closeModal() {
      const modal = document.getElementById('customModal');
      modal.style.display = 'none';
    }
    
    document.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') {
        startMoving('left');
      }
      if (e.key === 'ArrowRight'){
        startMoving('right')
      }
      if (e.key === ' ' || e.key === 'ArrowUp') {
        jump();
    
        // Vérifie si le personnage est à gauche
        if (position <= 20) {
          openModal();
        }
      } 
    });
    