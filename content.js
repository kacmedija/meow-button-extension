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

      const currentTime = audioCtx.currentTime;
      const duration = 0.5 + Math.random() * 0.15; // 0.5-0.65 sec

      // "Mieuw" frekvencia envelope - véletlenszerű variációkkal
      const startFreq = 700 + Math.random() * 200; // Mi- (700-900 Hz)
      const midFreq = 300 + Math.random() * 80;    // -e- (300-380 Hz)
      const endFreq = 450 + Math.random() * 100;   // -uw (450-550 Hz)

      // Fő oszcillátor - puhább triangle wave
      const mainOsc = audioCtx.createOscillator();
      mainOsc.type = 'triangle';

      // "Mieuw" alakú frekvencia - gyors lesüllyedés, majd kicsit feljebb
      mainOsc.frequency.setValueAtTime(startFreq, currentTime);
      mainOsc.frequency.exponentialRampToValueAtTime(midFreq, currentTime + duration * 0.4);
      mainOsc.frequency.exponentialRampToValueAtTime(endFreq, currentTime + duration);

      // Vibrato LFO - természetes remegés effekt
      const vibrato = audioCtx.createOscillator();
      vibrato.type = 'sine';
      vibrato.frequency.value = 4 + Math.random() * 2; // 4-6 Hz vibrato

      const vibratoGain = audioCtx.createGain();
      vibratoGain.gain.value = 8 + Math.random() * 6; // Változó vibrato mélység

      vibrato.connect(vibratoGain);
      vibratoGain.connect(mainOsc.frequency);

      // Második oszcillátor - pici eltolással a gazdagabb hangért
      const voice2 = audioCtx.createOscillator();
      voice2.type = 'sine';
      voice2.detune.value = -8 + Math.random() * 4; // Kis detune
      voice2.frequency.setValueAtTime(startFreq, currentTime);
      voice2.frequency.exponentialRampToValueAtTime(midFreq, currentTime + duration * 0.4);
      voice2.frequency.exponentialRampToValueAtTime(endFreq, currentTime + duration);

      // Gain envelope - természetes attack/decay
      const mainGain = audioCtx.createGain();
      const voice2Gain = audioCtx.createGain();

      // Gyors, de lágy felfutás
      mainGain.gain.setValueAtTime(0.001, currentTime);
      mainGain.gain.exponentialRampToValueAtTime(0.2, currentTime + 0.08);
      mainGain.gain.exponentialRampToValueAtTime(0.12, currentTime + duration * 0.6);
      mainGain.gain.exponentialRampToValueAtTime(0.001, currentTime + duration);

      voice2Gain.gain.setValueAtTime(0.001, currentTime);
      voice2Gain.gain.exponentialRampToValueAtTime(0.08, currentTime + 0.08);
      voice2Gain.gain.exponentialRampToValueAtTime(0.05, currentTime + duration * 0.6);
      voice2Gain.gain.exponentialRampToValueAtTime(0.001, currentTime + duration);

      // Összekapcsolás
      mainOsc.connect(mainGain);
      voice2.connect(voice2Gain);
      mainGain.connect(audioCtx.destination);
      voice2Gain.connect(audioCtx.destination);

      // Indítás
      mainOsc.start(currentTime);
      voice2.start(currentTime);
      vibrato.start(currentTime);

      // Leállítás
      mainOsc.stop(currentTime + duration);
      voice2.stop(currentTime + duration);
      vibrato.stop(currentTime + duration);

      mainOsc.onended = function() {
        activeSounds--;
      };
    } catch (e) {
      console.log("Meow sound couldn't play", e);
      activeSounds--;
    }
  }
})();