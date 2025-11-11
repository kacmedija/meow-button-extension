(function() {
  const buttonContainer = document.createElement('div');
  buttonContainer.className = 'meow-button-container';

  buttonContainer.style.cursor = 'move';

  const meowButton = document.createElement('button');
  meowButton.textContent = 'Meow?';
  meowButton.className = 'meow-button';
  buttonContainer.appendChild(meowButton);

  const catContainer = document.createElement('div');
  catContainer.className = 'global-cat-container';

  document.body.appendChild(buttonContainer);
  document.body.appendChild(catContainer);

  let catCount = 0;

  const catFaces = ['😺', '😸', '😹', '😻', '😼', '😽', '🙀', '😿', '😾'];

  let audioCtx = null;
  let activeSounds = 0;
  const MAX_CONCURRENT_SOUNDS = 5;
  
  meowButton.addEventListener('click', function(e) {
    if (!isDragging) {
      addCat();
    }
  });
  
  function getUrlKey() {
    const url = new URL(window.location.href);
    return url.hostname;
  }
  
  function saveButtonPosition(left, top) {
    const urlKey = getUrlKey();
    const positions = JSON.parse(localStorage.getItem('meowButtonPositions') || '{}');
    positions[urlKey] = { left, top };
    localStorage.setItem('meowButtonPositions', JSON.stringify(positions));
  }
  
  function loadButtonPosition() {
    const urlKey = getUrlKey();
    const positions = JSON.parse(localStorage.getItem('meowButtonPositions') || '{}');
    if (positions[urlKey]) {
      buttonContainer.style.left = positions[urlKey].left;
      buttonContainer.style.top = positions[urlKey].top;
      buttonContainer.style.right = 'auto';
    }
  }
  
  loadButtonPosition();
  
  let isDragging = false;
  let offsetX, offsetY;
  let dragStartX, dragStartY;
  
  buttonContainer.addEventListener('mousedown', function(e) {
    e.preventDefault();
    
    const rect = buttonContainer.getBoundingClientRect();
    offsetX = e.clientX - rect.left;
    offsetY = e.clientY - rect.top;
    
    dragStartX = e.clientX;
    dragStartY = e.clientY;
    
    isDragging = true;
    
    buttonContainer.classList.add('dragging');
  });
  
  document.addEventListener('mousemove', function(e) {
    if (!isDragging) return;
    
    const newLeft = e.clientX - offsetX;
    const newTop = e.clientY - offsetY;
    
    buttonContainer.style.left = newLeft + 'px';
    buttonContainer.style.top = newTop + 'px';
    buttonContainer.style.right = 'auto';
    
    const dragDistance = Math.sqrt(
      Math.pow(e.clientX - dragStartX, 2) + 
      Math.pow(e.clientY - dragStartY, 2)
    );
    
    buttonContainer.dataset.wasDragged = (dragDistance > 3).toString();
  });
  
  document.addEventListener('mouseup', function(e) {
    if (isDragging) {
      const wasDragged = buttonContainer.dataset.wasDragged === 'true';
      
      isDragging = false;
      
      buttonContainer.classList.remove('dragging');
      
      if (wasDragged) {
        e.preventDefault();
        e.stopPropagation();
        
        const clickCanceller = function(e) {
          e.stopPropagation();
          e.preventDefault();
          document.removeEventListener('click', clickCanceller, true);
        };
        document.addEventListener('click', clickCanceller, true);
        
        saveButtonPosition(buttonContainer.style.left, buttonContainer.style.top);
      }
      
      buttonContainer.dataset.wasDragged = 'false';
    }
  });
  
  function addCat() {
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    
    const randomX = Math.floor(Math.random() * (viewportWidth - 50));
    const randomY = Math.floor(Math.random() * 100);
    
    const catFace = catFaces[Math.floor(Math.random() * catFaces.length)];
    
    const catElement = document.createElement('div');
    catElement.className = 'global-cat';
    catElement.id = `cat-${catCount++}`;
    catElement.innerHTML = catFace;
    catElement.style.left = `${randomX}px`;
    catElement.style.top = `${randomY}px`;
    
    catContainer.appendChild(catElement);
    
    setTimeout(() => {
      catElement.style.top = `${viewportHeight}px`;
    }, 50);
    
    playMeowSound();
    
    setTimeout(() => {
      if (catElement.parentNode === catContainer) {
        catContainer.removeChild(catElement);
      }
    }, 2500);
  }
  
  function playMeowSound() {
    try {
      if (activeSounds >= MAX_CONCURRENT_SOUNDS) {
        return;
      }

      if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      }

      if (audioCtx.state === 'suspended') {
        audioCtx.resume();
      }

      activeSounds++;

      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();

      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(800, audioCtx.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(400, audioCtx.currentTime + 0.3);

      gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);

      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);

      oscillator.start();
      oscillator.stop(audioCtx.currentTime + 0.3);

      oscillator.onended = function() {
        activeSounds--;
      };
    } catch (e) {
      console.log("Meow sound couldn't play", e);
      activeSounds--;
    }
  }
})();