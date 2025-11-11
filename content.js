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
      const duration = 0.4 + Math.random() * 0.2; // 0.4-0.6 sec

      // Véletlenszerű kezdő frekvencia a természetesebb hangzásért
      const startFreq = 600 + Math.random() * 300; // 600-900 Hz
      const midFreq = 280 + Math.random() * 150;   // 280-430 Hz
      const endFreq = 350 + Math.random() * 200;   // 350-550 Hz

      // Fő oszcillátor (alapfrekvencia)
      const mainOsc = audioCtx.createOscillator();
      mainOsc.type = 'sawtooth'; // Gazdagabb harmonikus tartalom

      // Komplex frekvencia envelope - macska "meow" alakja
      mainOsc.frequency.setValueAtTime(startFreq, currentTime);
      mainOsc.frequency.exponentialRampToValueAtTime(midFreq, currentTime + duration * 0.6);
      mainOsc.frequency.exponentialRampToValueAtTime(endFreq, currentTime + duration);

      // Második harmonikus oszcillátor
      const harmOsc = audioCtx.createOscillator();
      harmOsc.type = 'triangle';
      harmOsc.frequency.setValueAtTime(startFreq * 2, currentTime);
      harmOsc.frequency.exponentialRampToValueAtTime(midFreq * 2, currentTime + duration * 0.6);
      harmOsc.frequency.exponentialRampToValueAtTime(endFreq * 2, currentTime + duration);

      // Alacsony frekvenciás komponens a mélyebb hangzásért
      const subOsc = audioCtx.createOscillator();
      subOsc.type = 'sine';
      subOsc.frequency.setValueAtTime(startFreq * 0.5, currentTime);
      subOsc.frequency.exponentialRampToValueAtTime(midFreq * 0.5, currentTime + duration * 0.6);
      subOsc.frequency.exponentialRampToValueAtTime(endFreq * 0.5, currentTime + duration);

      // White noise a rekesztéshez
      const bufferSize = audioCtx.sampleRate * duration;
      const noiseBuffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }

      const noiseSource = audioCtx.createBufferSource();
      noiseSource.buffer = noiseBuffer;

      // Bandpass filter a zajhoz (macska hangmagasságra szűrve)
      const noiseFilter = audioCtx.createBiquadFilter();
      noiseFilter.type = 'bandpass';
      noiseFilter.frequency.setValueAtTime(500, currentTime);
      noiseFilter.Q.value = 1;

      // Gain node-ok
      const mainGain = audioCtx.createGain();
      const harmGain = audioCtx.createGain();
      const subGain = audioCtx.createGain();
      const noiseGain = audioCtx.createGain();
      const masterGain = audioCtx.createGain();

      // Gain envelope - kezdődik halkan, felerősödik, majd halkulás
      mainGain.gain.setValueAtTime(0.001, currentTime);
      mainGain.gain.exponentialRampToValueAtTime(0.15, currentTime + 0.05);
      mainGain.gain.exponentialRampToValueAtTime(0.08, currentTime + duration * 0.7);
      mainGain.gain.exponentialRampToValueAtTime(0.001, currentTime + duration);

      harmGain.gain.setValueAtTime(0.001, currentTime);
      harmGain.gain.exponentialRampToValueAtTime(0.06, currentTime + 0.05);
      harmGain.gain.exponentialRampToValueAtTime(0.03, currentTime + duration * 0.7);
      harmGain.gain.exponentialRampToValueAtTime(0.001, currentTime + duration);

      subGain.gain.setValueAtTime(0.001, currentTime);
      subGain.gain.exponentialRampToValueAtTime(0.08, currentTime + 0.05);
      subGain.gain.exponentialRampToValueAtTime(0.04, currentTime + duration * 0.7);
      subGain.gain.exponentialRampToValueAtTime(0.001, currentTime + duration);

      noiseGain.gain.setValueAtTime(0.001, currentTime);
      noiseGain.gain.exponentialRampToValueAtTime(0.03, currentTime + 0.02);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, currentTime + duration);

      masterGain.gain.value = 0.6;

      // Összekapcsolás
      mainOsc.connect(mainGain);
      harmOsc.connect(harmGain);
      subOsc.connect(subGain);
      noiseSource.connect(noiseFilter);
      noiseFilter.connect(noiseGain);

      mainGain.connect(masterGain);
      harmGain.connect(masterGain);
      subGain.connect(masterGain);
      noiseGain.connect(masterGain);

      masterGain.connect(audioCtx.destination);

      // Indítás és leállítás
      mainOsc.start(currentTime);
      harmOsc.start(currentTime);
      subOsc.start(currentTime);
      noiseSource.start(currentTime);

      mainOsc.stop(currentTime + duration);
      harmOsc.stop(currentTime + duration);
      subOsc.stop(currentTime + duration);
      noiseSource.stop(currentTime + duration);

      mainOsc.onended = function() {
        activeSounds--;
      };
    } catch (e) {
      console.log("Meow sound couldn't play", e);
      activeSounds--;
    }
  }
})();