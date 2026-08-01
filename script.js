/* ==========================================================================
   HAPPY BIRTHDAY MOHIMA - ADVANCED INTERACTIVE ENGINE & REACTIVE ARCHITECTURE
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  // --------------------------------------------------------------------------
  // 1. REACTIVE PROXY STATE OBSERVER WITH URL HASH PERSISTENCE
  // --------------------------------------------------------------------------
  let saveStateTimeout = null;

  function debouncedSaveStateToHash() {
    if (saveStateTimeout) clearTimeout(saveStateTimeout);
    saveStateTimeout = setTimeout(() => {
      try {
        const stateToSave = {
          caffeineLevel: appState.caffeineLevel,
          activeVedantNickname: appState.activeVedantNickname,
          activeMohimaNickname: appState.activeMohimaNickname,
          unlockedBadges: Array.from(unlockedBadges),
          secretBookUnlocked: secretBookUnlocked
        };
        const b64 = btoa(JSON.stringify(stateToSave));
        window.history.replaceState(null, '', `#state=${b64}`);
        localStorage.setItem('mohima_birthday_app_state', JSON.stringify(stateToSave));
      } catch (e) {
        console.warn('Could not save state to URL hash');
      }
    }, 300);
  }

  function loadStateFromHash() {
    try {
      let savedObj = null;
      if (window.location.hash.startsWith('#state=')) {
        const b64 = window.location.hash.replace('#state=', '');
        savedObj = JSON.parse(atob(b64));
      } else {
        const local = localStorage.getItem('mohima_birthday_app_state');
        if (local) savedObj = JSON.parse(local);
      }

      if (savedObj) {
        if (savedObj.caffeineLevel) appState.caffeineLevel = savedObj.caffeineLevel;
        if (savedObj.activeVedantNickname) appState.activeVedantNickname = savedObj.activeVedantNickname;
        if (savedObj.activeMohimaNickname) appState.activeMohimaNickname = savedObj.activeMohimaNickname;
        if (savedObj.unlockedBadges) {
          savedObj.unlockedBadges.forEach(b => unlockedBadges.add(b));
          updateBadgesUI();
        }
        if (savedObj.secretBookUnlocked) unlockSecretBook();
      }
    } catch (e) {
      console.warn('URL state malformed, falling back to defaults');
    }
  }

  const appState = new Proxy({
    caffeineLevel: 0,
    activeVedantNickname: "All Fiction",
    activeMohimaNickname: "Viöla_Odessǣ"
  }, {
    set(target, property, value) {
      target[property] = value;
      onStateChange(property, value);
      debouncedSaveStateToHash();
      return true;
    }
  });

  function onStateChange(property, value) {
    if (property === 'activeVedantNickname') {
      const displayEl = document.getElementById('vedantDisplayNickname');
      if (displayEl) displayEl.innerText = value;
      const inputEl = document.getElementById('dmInputField');
      if (inputEl) inputEl.placeholder = `Message ${value}...`;
      document.querySelectorAll('.typing-name').forEach(el => el.innerText = value);
    }
    if (property === 'activeMohimaNickname') {
      const displayEl = document.getElementById('mohimaDisplayNickname');
      if (displayEl) displayEl.innerText = value;
    }
    if (property === 'caffeineLevel') {
      updateCoffeeWidgetUI(value);
    }
  }

  // --------------------------------------------------------------------------
  // TOAST NOTIFICATION ENGINE
  // --------------------------------------------------------------------------
  const toastContainer = document.getElementById('toastContainer');

  function showToast(message, type = 'normal', icon = '✨') {
    if (!toastContainer) return;
    const toast = document.createElement('div');
    toast.className = `toast-message ${type === 'gold' ? 'gold' : ''}`;
    toast.innerHTML = `<span class="toast-icon">${icon}</span><span>${message}</span>`;
    toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.classList.add('toast-out');
      setTimeout(() => toast.remove(), 300);
    }, 3200);
  }

  // --------------------------------------------------------------------------
  // DYNAMIC BACKGROUND PARTICLE ENGINE (STARS 💫 / PETALS 🌸 / RAIN 🌧️ / 3D PETALS 🌹 / BOKEH ✨)
  // --------------------------------------------------------------------------
  const bgCanvas = document.getElementById('canvas-bg');
  const presetBtn = document.getElementById('presetBtn');

  if (bgCanvas) {
    const bgCtx = bgCanvas.getContext('2d');
    let bgWidth = bgCanvas.width = window.innerWidth;
    let bgHeight = bgCanvas.height = window.innerHeight;

    window.addEventListener('resize', () => {
      bgWidth = bgCanvas.width = window.innerWidth;
      bgHeight = bgCanvas.height = window.innerHeight;
    });

    const modes = ['stars', 'petals', 'rain', 'rose_petals', 'glowing_bokeh'];
    let currentModeIdx = 0;
    let bgParticles = [];

    class BgParticle {
      constructor(mode) {
        this.reset(mode);
      }

      reset(mode) {
        this.mode = mode;
        this.x = Math.random() * bgWidth;
        this.y = Math.random() * bgHeight;

        if (mode === 'stars') {
          this.size = Math.random() * 2.5 + 1;
          this.speedY = Math.random() * 1.2 + 0.3;
          this.speedX = (Math.random() - 0.5) * 0.4;
          this.opacity = Math.random() * 0.7 + 0.3;
          this.color = Math.random() > 0.4 ? '#ff75a0' : '#ffd700';
        } else if (mode === 'petals') {
          this.size = Math.random() * 6 + 5;
          this.speedY = Math.random() * 0.9 + 0.5;
          this.speedX = Math.random() * 0.6 - 0.3;
          this.rotation = Math.random() * Math.PI * 2;
          this.rotSpeed = Math.random() * 0.02 - 0.01;
          this.swayAngle = Math.random() * Math.PI * 2;
          this.swaySpeed = 0.02 + Math.random() * 0.02;
          this.opacity = Math.random() * 0.55 + 0.35;
          this.color = ['#ffb7c5', '#ff75a0', '#ff85a1', '#ffd1dc', '#fff0f5'][Math.floor(Math.random() * 5)];
        } else if (mode === 'rain') {
          this.length = Math.random() * 22 + 12;
          this.speedY = Math.random() * 8 + 5;
          this.speedX = -0.5;
          this.opacity = Math.random() * 0.4 + 0.15;
          this.color = '#a0c4ff';
        } else if (mode === 'rose_petals') {
          this.size = Math.random() * 8 + 6;
          this.speedY = Math.random() * 1.4 + 0.6;
          this.speedX = Math.random() * 0.8 - 0.4;
          this.rotation = Math.random() * Math.PI * 2;
          this.rotSpeed = Math.random() * 0.03 - 0.015;
          this.swayAngle = Math.random() * Math.PI * 2;
          this.swaySpeed = 0.02 + Math.random() * 0.02;
          this.opacity = Math.random() * 0.7 + 0.3;
          this.color = ['#ff75a0', '#e63946', '#b30024', '#ff85a1'][Math.floor(Math.random() * 4)];
        } else if (mode === 'glowing_bokeh') {
          this.size = Math.random() * 18 + 8;
          this.speedY = -(Math.random() * 0.6 + 0.2);
          this.speedX = (Math.random() - 0.5) * 0.4;
          this.opacity = Math.random() * 0.35 + 0.1;
          this.pulseSpeed = 0.02 + Math.random() * 0.02;
          this.pulseAngle = Math.random() * Math.PI * 2;
          this.color = ['#ffd700', '#ff75a0', '#9d4edd', '#ffffff'][Math.floor(Math.random() * 4)];
        }
      }

      update() {
        if (this.mode === 'stars') {
          this.y += this.speedY;
          this.x += this.speedX;
          if (this.y > bgHeight) {
            this.y = 0;
            this.x = Math.random() * bgWidth;
          }
        } else if (this.mode === 'petals') {
          this.y += this.speedY;
          this.swayAngle += this.swaySpeed;
          this.x += Math.sin(this.swayAngle) * 1.2 + this.speedX;
          this.rotation += this.rotSpeed;
          if (this.y > bgHeight + 20) {
            this.y = -20;
            this.x = Math.random() * bgWidth;
          }
        } else if (this.mode === 'rain') {
          this.y += this.speedY;
          this.x += this.speedX;
          if (this.y > bgHeight + 30) {
            this.y = -30;
            this.x = Math.random() * (bgWidth + 100);
          }
        } else if (this.mode === 'rose_petals') {
          this.y += this.speedY;
          this.swayAngle += this.swaySpeed;
          this.x += Math.sin(this.swayAngle) * 0.8 + this.speedX;
          this.rotation += this.rotSpeed;
          if (this.y > bgHeight + 20) {
            this.y = -20;
            this.x = Math.random() * bgWidth;
          }
        } else if (this.mode === 'glowing_bokeh') {
          this.y += this.speedY;
          this.x += this.speedX;
          this.pulseAngle += this.pulseSpeed;
          if (this.y < -30) {
            this.y = bgHeight + 30;
            this.x = Math.random() * bgWidth;
          }
        }
      }

      draw(ctx) {
        ctx.save();
        ctx.globalAlpha = this.opacity;

        if (this.mode === 'stars') {
          ctx.fillStyle = this.color;
          ctx.shadowBlur = 10;
          ctx.shadowColor = this.color;
          ctx.beginPath();
          ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
          ctx.fill();
        } else if (this.mode === 'petals') {
          ctx.translate(this.x, this.y);
          ctx.rotate(this.rotation);
          ctx.fillStyle = this.color;
          ctx.shadowBlur = 12;
          ctx.shadowColor = this.color;
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.bezierCurveTo(-this.size * 0.8, -this.size * 1.2, -this.size * 1.2, this.size * 0.6, 0, this.size * 1.3);
          ctx.bezierCurveTo(this.size * 1.2, this.size * 0.6, this.size * 0.8, -this.size * 1.2, 0, 0);
          ctx.fill();
        } else if (this.mode === 'rain') {
          ctx.strokeStyle = this.color;
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.moveTo(this.x, this.y);
          ctx.lineTo(this.x + this.speedX, this.y + 14);
          ctx.stroke();
        } else if (this.mode === 'rose_petals') {
          ctx.translate(this.x, this.y);
          ctx.rotate(this.rotation);
          ctx.fillStyle = this.color;
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.bezierCurveTo(-this.size, -this.size * 1.5, -this.size * 1.5, this.size * 0.5, 0, this.size * 1.5);
          ctx.bezierCurveTo(this.size * 1.5, this.size * 0.5, this.size, -this.size * 1.5, 0, 0);
          ctx.fill();
        } else if (this.mode === 'glowing_bokeh') {
          const currentSize = this.size + Math.sin(this.pulseAngle) * 3;
          ctx.fillStyle = this.color;
          ctx.shadowBlur = 20;
          ctx.shadowColor = this.color;
          ctx.beginPath();
          ctx.arc(this.x, this.y, Math.max(2, currentSize), 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();
      }
    }

    function initBgParticles(mode) {
      bgParticles = [];
      const count = mode === 'rain' ? 100 : (mode === 'glowing_bokeh' ? 35 : 75);
      for (let i = 0; i < count; i++) {
        bgParticles.push(new BgParticle(mode));
      }
    }

    function renderBgLoop() {
      bgCtx.clearRect(0, 0, bgWidth, bgHeight);
      for (let i = 0; i < bgParticles.length; i++) {
        bgParticles[i].update();
        bgParticles[i].draw(bgCtx);
      }
      requestAnimationFrame(renderBgLoop);
    }

    initBgParticles(modes[currentModeIdx]);
    requestAnimationFrame(renderBgLoop);

    if (presetBtn) {
      presetBtn.addEventListener('click', () => {
        playPopSound();
        currentModeIdx = (currentModeIdx + 1) % modes.length;
        const newMode = modes[currentModeIdx];
        initBgParticles(newMode);

        const modeNames = {
          stars: "Midnight Starlight 💫",
          petals: "Soft Floating Petals 🌸",
          rain: "Stormy Rain Streaks 🌧️",
          rose_petals: "3D Velvet Rose Petals 🌹",
          glowing_bokeh: "Glowing Golden Bokeh ✨"
        };
        showToast(`Particle Preset: ${modeNames[newMode]}`, "gold", "✨");
      });
    }
  }

  // --------------------------------------------------------------------------
  // 2. WEB AUDIO API SYNTHESIZER WITH SPATIAL BIQUAD FILTERING
  // --------------------------------------------------------------------------
  let sfxCtx = null;
  let biquadFilter = null;

  function initSfxContext() {
    if (!sfxCtx) {
      sfxCtx = new (window.AudioContext || window.webkitAudioContext)();
      biquadFilter = sfxCtx.createBiquadFilter();
      biquadFilter.type = 'lowpass';
      biquadFilter.frequency.setValueAtTime(20000, sfxCtx.currentTime); // Default open
      biquadFilter.connect(sfxCtx.destination);
    }
    if (sfxCtx.state === 'suspended') {
      sfxCtx.resume();
    }
  }

  // Global gesture unlock listener for browser audio policy
  ['click', 'touchstart', 'keydown'].forEach(evt => {
    window.addEventListener(evt, () => {
      initSfxContext();
    }, { once: false });
  });

  function setSpatialMuffle(muffleOn) {
    if (!biquadFilter || !sfxCtx) return;
    const targetFreq = muffleOn ? 400 : 20000;
    try {
      biquadFilter.frequency.cancelScheduledValues(sfxCtx.currentTime);
      biquadFilter.frequency.setValueAtTime(biquadFilter.frequency.value || 20000, sfxCtx.currentTime);
      biquadFilter.frequency.exponentialRampToValueAtTime(targetFreq, sfxCtx.currentTime + 0.3);
    } catch (e) {
      biquadFilter.frequency.value = targetFreq;
    }
  }

  function playPopSound() {
    initSfxContext();
    if (!sfxCtx) return;
    try {
      const osc = sfxCtx.createOscillator();
      const gain = sfxCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(400, sfxCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(800, sfxCtx.currentTime + 0.08);

      gain.gain.setValueAtTime(0.1, sfxCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, sfxCtx.currentTime + 0.08);

      osc.connect(gain);
      gain.connect(biquadFilter);
      osc.start();
      osc.stop(sfxCtx.currentTime + 0.08);
    } catch (e) {}
  }

  function playBookSound() {
    initSfxContext();
    if (!sfxCtx) return;
    try {
      const osc = sfxCtx.createOscillator();
      const gain = sfxCtx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(220, sfxCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(110, sfxCtx.currentTime + 0.18);

      gain.gain.setValueAtTime(0.12, sfxCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, sfxCtx.currentTime + 0.18);

      osc.connect(gain);
      gain.connect(biquadFilter);
      osc.start();
      osc.stop(sfxCtx.currentTime + 0.18);
    } catch (e) {}
  }

  function playChimeSound() {
    initSfxContext();
    if (!sfxCtx) return;
    const freqs = [523.25, 659.25, 783.99, 1046.50];
    freqs.forEach((f, idx) => {
      try {
        const osc = sfxCtx.createOscillator();
        const gain = sfxCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(f, sfxCtx.currentTime + idx * 0.08);
        gain.gain.setValueAtTime(0.1, sfxCtx.currentTime + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, sfxCtx.currentTime + idx * 0.08 + 0.4);

        osc.connect(gain);
        gain.connect(biquadFilter);
        osc.start(sfxCtx.currentTime + idx * 0.08);
        osc.stop(sfxCtx.currentTime + idx * 0.08 + 0.4);
      } catch (e) {}
    });
  }

  function playFanfareSound() {
    initSfxContext();
    if (!sfxCtx) return;
    const notes = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99];
    notes.forEach((f, idx) => {
      try {
        const osc = sfxCtx.createOscillator();
        const gain = sfxCtx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(f, sfxCtx.currentTime + idx * 0.1);
        gain.gain.setValueAtTime(0.15, sfxCtx.currentTime + idx * 0.1);
        gain.gain.exponentialRampToValueAtTime(0.001, sfxCtx.currentTime + idx * 0.1 + 0.5);

        osc.connect(gain);
        gain.connect(biquadFilter);
        osc.start(sfxCtx.currentTime + idx * 0.1);
        osc.stop(sfxCtx.currentTime + idx * 0.1 + 0.5);
      } catch (e) {}
    });
  }

  function playVoiceNoteAudio() {
    initSfxContext();
    if (!sfxCtx) return;
    const melody = [
      { f: 349.23, d: 0.2 }, { f: 392.00, d: 0.2 }, { f: 440.00, d: 0.4 },
      { f: 523.25, d: 0.3 }, { f: 440.00, d: 0.3 }, { f: 392.00, d: 0.5 },
      { f: 349.23, d: 0.4 }, { f: 293.66, d: 0.6 }
    ];

    let t = sfxCtx.currentTime;
    melody.forEach(n => {
      try {
        const osc = sfxCtx.createOscillator();
        const gain = sfxCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(n.f, t);

        gain.gain.setValueAtTime(0.001, t);
        gain.gain.exponentialRampToValueAtTime(0.12, t + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.001, t + n.d);

        osc.connect(gain);
        gain.connect(biquadFilter);

        osc.start(t);
        osc.stop(t + n.d);
        t += n.d + 0.05;
      } catch (e) {}
    });
  }

  // 1. 🕊️ Carrier Pigeon Release Wings Flap Sound
  function playPigeonFlapSound() {
    initSfxContext();
    if (!sfxCtx) return;
    for (let i = 0; i < 4; i++) {
      setTimeout(() => {
        try {
          const osc = sfxCtx.createOscillator();
          const gain = sfxCtx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(140 + Math.random() * 40, sfxCtx.currentTime);
          osc.frequency.exponentialRampToValueAtTime(60, sfxCtx.currentTime + 0.06);

          gain.gain.setValueAtTime(0.08, sfxCtx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.001, sfxCtx.currentTime + 0.06);

          osc.connect(gain);
          gain.connect(biquadFilter);
          osc.start();
          osc.stop(sfxCtx.currentTime + 0.06);
        } catch (e) {}
      }, i * 70);
    }
  }

  // 2. ☕ Black Coffee Pouring & Bubbling Sound
  function playCoffeeBrewSound(packetNum) {
    initSfxContext();
    if (!sfxCtx) return;
    const baseFreq = 300 + packetNum * 120;
    try {
      const osc = sfxCtx.createOscillator();
      const gain = sfxCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(baseFreq, sfxCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(baseFreq + 200, sfxCtx.currentTime + 0.15);

      gain.gain.setValueAtTime(0.12, sfxCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, sfxCtx.currentTime + 0.15);

      osc.connect(gain);
      gain.connect(biquadFilter);
      osc.start();
      osc.stop(sfxCtx.currentTime + 0.15);
    } catch (e) {}
  }

  // 3. 📸 Vintage Polaroid Camera Shutter Snap Sound
  function playCameraShutterSound() {
    initSfxContext();
    if (!sfxCtx) return;
    try {
      const osc = sfxCtx.createOscillator();
      const gain = sfxCtx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(800, sfxCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(120, sfxCtx.currentTime + 0.05);

      gain.gain.setValueAtTime(0.15, sfxCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, sfxCtx.currentTime + 0.05);

      osc.connect(gain);
      gain.connect(biquadFilter);
      osc.start();
      osc.stop(sfxCtx.currentTime + 0.05);
    } catch (e) {}
  }

  // 4. 🎴 3D Banter Flashcard Flip Swish Sound
  function playCardFlipSound() {
    initSfxContext();
    if (!sfxCtx) return;
    try {
      const osc = sfxCtx.createOscillator();
      const gain = sfxCtx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(180, sfxCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(320, sfxCtx.currentTime + 0.08);

      gain.gain.setValueAtTime(0.09, sfxCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, sfxCtx.currentTime + 0.08);

      osc.connect(gain);
      gain.connect(biquadFilter);
      osc.start();
      osc.stop(sfxCtx.currentTime + 0.08);
    } catch (e) {}
  }

  // 5. 👻 Ghost Spirit Dissipation Whisper Sound
  function playGhostDissipateSound() {
    initSfxContext();
    if (!sfxCtx) return;
    try {
      const osc = sfxCtx.createOscillator();
      const gain = sfxCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(520, sfxCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(260, sfxCtx.currentTime + 0.5);

      gain.gain.setValueAtTime(0.001, sfxCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.08, sfxCtx.currentTime + 0.15);
      gain.gain.exponentialRampToValueAtTime(0.001, sfxCtx.currentTime + 0.5);

      osc.connect(gain);
      gain.connect(biquadFilter);
      osc.start();
      osc.stop(sfxCtx.currentTime + 0.5);
    } catch (e) {}
  }

  // 6. 🔮 Fortune Wheel Ticking Spin Sound
  function playSpinWheelSound() {
    initSfxContext();
    if (!sfxCtx) return;
    let ticks = 0;
    const interval = setInterval(() => {
      ticks++;
      try {
        const osc = sfxCtx.createOscillator();
        const gain = sfxCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(600 + (ticks % 3) * 100, sfxCtx.currentTime);
        gain.gain.setValueAtTime(0.05, sfxCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, sfxCtx.currentTime + 0.03);

        osc.connect(gain);
        gain.connect(biquadFilter);
        osc.start();
        osc.stop(sfxCtx.currentTime + 0.03);
      } catch (e) {}

      if (ticks >= 10) clearInterval(interval);
    }, 90);
  }

  // Ambient Lo-Fi & Rain Sound Synthesizer for Top Control Bar
  const musicToggleBtn = document.getElementById('musicToggleBtn');
  let isAmbientPlaying = false;
  let ambientOscInterval = null;

  function playLofiChord() {
    initSfxContext();
    if (!sfxCtx || !isAmbientPlaying) return;
    const chords = [
      [261.63, 329.63, 392.00, 493.88], // Cmaj7
      [220.00, 261.63, 329.63, 392.00], // Am7
      [174.61, 220.00, 261.63, 329.63], // Fmaj7
      [196.00, 246.94, 293.66, 349.23]  // G7
    ];
    const chord = chords[Math.floor(Math.random() * chords.length)];

    chord.forEach((freq) => {
      try {
        const osc = sfxCtx.createOscillator();
        const gain = sfxCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, sfxCtx.currentTime);

        gain.gain.setValueAtTime(0.001, sfxCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.03, sfxCtx.currentTime + 0.4);
        gain.gain.exponentialRampToValueAtTime(0.001, sfxCtx.currentTime + 2.5);

        osc.connect(gain);
        gain.connect(biquadFilter);
        osc.start();
        osc.stop(sfxCtx.currentTime + 2.6);
      } catch (e) {}
    });
  }

  if (musicToggleBtn) {
    musicToggleBtn.addEventListener('click', () => {
      initSfxContext();
      if (!isAmbientPlaying) {
        isAmbientPlaying = true;
        musicToggleBtn.classList.add('playing');
        musicToggleBtn.innerHTML = '<i class="fa-solid fa-volume-xmark" style="color: var(--accent-rose);"></i>';
        playLofiChord();
        ambientOscInterval = setInterval(playLofiChord, 3000);
      } else {
        isAmbientPlaying = false;
        musicToggleBtn.classList.remove('playing');
        musicToggleBtn.innerHTML = '<i class="fa-solid fa-volume-high"></i>';
        if (ambientOscInterval) clearInterval(ambientOscInterval);
      }
    });
  }

  // --------------------------------------------------------------------------
  // 3. OBJECT-POOLED CAFFEINE PARTICLE PHYSICS ENGINE
  // --------------------------------------------------------------------------
  const particlePool = [];
  const maxPoolSize = 25;
  let poolInitialized = false;

  function initParticlePool() {
    if (poolInitialized) return;
    for (let i = 0; i < maxPoolSize; i++) {
      const p = document.createElement('div');
      p.className = 'sparkle-dot';
      p.style.display = 'none';
      document.body.appendChild(p);
      particlePool.push({ el: p, active: false });
    }
    poolInitialized = true;
  }

  function triggerCaffeineAura() {
    initParticlePool();
    for (let i = 0; i < 15; i++) {
      const item = particlePool.find(p => !p.active);
      if (item) {
        item.active = true;
        const el = item.el;
        el.style.left = (window.innerWidth / 2 + (Math.random() - 0.5) * 300) + 'px';
        el.style.top = (window.innerHeight / 2 + (Math.random() - 0.5) * 200) + 'px';
        el.style.display = 'block';
        el.style.opacity = '1';
        el.style.transform = 'scale(1.5)';

        let start = null;
        function anim(timestamp) {
          if (!start) start = timestamp;
          const progress = timestamp - start;
          if (progress < 800) {
            el.style.transform = `translate(${(Math.random() - 0.5) * 40}px, -${progress * 0.1}px) scale(${1 - progress / 800})`;
            el.style.opacity = String(1 - progress / 800);
            requestAnimationFrame(anim);
          } else {
            el.style.display = 'none';
            item.active = false;
          }
        }
        requestAnimationFrame(anim);
      }
    }
  }

  // --------------------------------------------------------------------------
  // 4. MOUSE TRAILING SPARKLE EFFECT
  // --------------------------------------------------------------------------
  document.addEventListener('mousemove', (e) => {
    if (Math.random() < 0.2) {
      const sparkle = document.createElement('div');
      sparkle.className = 'sparkle-dot';
      sparkle.style.left = e.clientX + 'px';
      sparkle.style.top = e.clientY + 'px';
      document.body.appendChild(sparkle);

      setTimeout(() => {
        sparkle.style.transform = `translate(${(Math.random() - 0.5) * 30}px, ${(Math.random() - 0.5) * 30}px) scale(0)`;
        sparkle.style.opacity = '0';
      }, 50);

      setTimeout(() => sparkle.remove(), 600);
    }
  });

  // --------------------------------------------------------------------------
  // 6. ACHIEVEMENTS & BADGES SYSTEM
  // --------------------------------------------------------------------------
  const badgeToggleBtn = document.getElementById('badgeToggleBtn');
  const badgesDrawer = document.getElementById('badgesDrawer');
  const closeBadgesBtn = document.getElementById('closeBadgesBtn');
  const badgeCountPill = document.getElementById('badgeCountPill');

  const unlockedBadges = new Set(['badge1']);

  function updateBadgesUI() {
    let count = 0;
    unlockedBadges.forEach(id => {
      const el = document.getElementById(id);
      if (el) {
        el.classList.remove('locked');
        el.classList.add('unlocked');
        count++;
      }
    });
    if (badgeCountPill) badgeCountPill.innerText = count;
  }

  // Initial Badge Count Sync on Load
  updateBadgesUI();

  function unlockBadge(id) {
    if (!unlockedBadges.has(id)) {
      unlockedBadges.add(id);
      updateBadgesUI();
      playChimeSound();
      debouncedSaveStateToHash();

      const badgeEl = document.getElementById(id);
      const title = badgeEl ? badgeEl.getAttribute('data-title') : 'Achievement Unlocked';
      showToast(`Achievement Unlocked: ${title}!`, 'gold', '👑');
    }
  }

  badgeToggleBtn.addEventListener('click', () => {
    playPopSound();
    badgesDrawer.classList.toggle('active');
  });

  closeBadgesBtn.addEventListener('click', () => {
    badgesDrawer.classList.remove('active');
  });

  // --------------------------------------------------------------------------
  // 7. 3 AM BLACK COFFEE BREW WIDGET ENGINE
  // --------------------------------------------------------------------------
  const coffeePacketBtns = document.querySelectorAll('.coffee-packet-btn');
  const coffeeCountText = document.getElementById('coffeeCountText');
  const caffeineMeterFill = document.getElementById('caffeineMeterFill');
  let coffeeTapCooldown = false;

  function updateCoffeeWidgetUI(level) {
    if (coffeeCountText) {
      if (level >= 4) {
        coffeeCountText.innerText = `4/4 Packets (Max Caffeine Reached! ☕)`;
      } else {
        coffeeCountText.innerText = `${level}/4 Packets`;
      }
    }
    if (caffeineMeterFill) caffeineMeterFill.style.width = `${(level / 4) * 100}%`;

    coffeePacketBtns.forEach((btn, idx) => {
      if (idx < level) btn.classList.add('brewed');
      else btn.classList.remove('brewed');
      btn.disabled = (level >= 4);
    });

    if (level >= 4) {
      unlockBadge('badge6');
    }
  }

  coffeePacketBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      if (coffeeTapCooldown) return;
      coffeeTapCooldown = true;
      setTimeout(() => coffeeTapCooldown = false, 300);

      if (appState.caffeineLevel < 4) {
        appState.caffeineLevel += 1;
        playCoffeeBrewSound(appState.caffeineLevel);
        triggerCaffeineAura();
        showToast(`☕ Coffee Packet ${appState.caffeineLevel} brewed! Caffeine level rising...`, 'normal', '☕');
        if (appState.caffeineLevel === 4) {
          playFanfareSound();
          showToast(`☕ 4 Packets Brewed! Vedant: "4 packets of black coffee in 1 cup?! Go sleep mohtarma!"`, 'gold', '☕');
        }
      } else {
        playPopSound();
        showToast(`☕ Maximum caffeine limit reached (4/4 packets)!`, 'normal', '☕');
      }
    });
  });

  // --------------------------------------------------------------------------
  // 8. 1324 AD CARRIER PIGEON SCROLL ENGINE
  // --------------------------------------------------------------------------
  const pigeonBtn = document.getElementById('pigeonBtn');
  const pigeonModal = document.getElementById('pigeonModal');
  const closePigeonBtn = document.getElementById('closePigeonBtn');

  pigeonBtn.addEventListener('click', () => {
    playPigeonFlapSound();
    setSpatialMuffle(true);
    pigeonModal.classList.add('active');
  });

  closePigeonBtn.addEventListener('click', () => {
    playPopSound();
    setSpatialMuffle(false);
    pigeonModal.classList.remove('active');
  });

  // --------------------------------------------------------------------------
  // 9. BIRTHDAY CAKE CANDLE BLOWOUT ENGINE
  // --------------------------------------------------------------------------
  const cakeContainer = document.getElementById('cakeContainer');
  const flames = [document.getElementById('flame1'), document.getElementById('flame2'), document.getElementById('flame3')];
  const cakeStatus = document.getElementById('cakeStatus');
  let candlesLit = true;

  function triggerSmokePuffs() {
    flames.forEach(flame => {
      const rect = flame.getBoundingClientRect();
      for (let i = 0; i < 6; i++) {
        const puff = document.createElement('div');
        puff.className = 'smoke-puff';
        puff.style.left = (rect.left + rect.width / 2 + (Math.random() - 0.5) * 12) + 'px';
        puff.style.top = (rect.top + (Math.random() - 0.5) * 8) + 'px';
        puff.style.setProperty('--random-x', Math.random());
        document.body.appendChild(puff);

        setTimeout(() => puff.remove(), 1800);
      }
    });
  }

  cakeContainer.addEventListener('click', () => {
    candlesLit = !candlesLit;
    flames.forEach(f => {
      if (candlesLit) {
        f.classList.remove('off');
      } else {
        f.classList.add('off');
      }
    });

    if (!candlesLit) {
      playChimeSound();
      triggerSmokePuffs();
      cakeStatus.innerHTML = '<i class="fa-solid fa-star"></i> Wish granted! 18th Birthday Candles Extinguished! 🎉';
      cakeStatus.style.color = '#ff75a0';
      triggerCelebration();
      unlockBadge('badge2');
    } else {
      playPopSound();
      cakeStatus.innerHTML = '<i class="fa-solid fa-wand-magic-sparkles"></i> Click the cake to blow out your 18th candles!';
      cakeStatus.style.color = '#ffd700';
    }
  });

  // --------------------------------------------------------------------------
  // 9. HIGH-PERFORMANCE 60FPS PHYSICS CELEBRATION ENGINE
  // --------------------------------------------------------------------------
  const celCanvas = document.getElementById('celebrationCanvas');
  let celCtx = null;
  let celParticles = [];
  let celAnimFrame = null;
  let celEmitTimeout = null;
  let isEmittingCelebration = false;

  if (celCanvas) {
    celCtx = celCanvas.getContext('2d');
    function resizeCelCanvas() {
      celCanvas.width = window.innerWidth;
      celCanvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resizeCelCanvas);
    resizeCelCanvas();
  }

  class CelebrationParticle {
    constructor() {
      this.reset();
    }

    reset() {
      if (!celCanvas) return;
      this.x = celCanvas.width * (0.15 + Math.random() * 0.7);
      this.y = celCanvas.height * (0.4 + Math.random() * 0.4);
      
      // Velocity burst upward and outward
      const angle = (Math.random() - 0.5) * Math.PI * 0.85 - Math.PI / 2;
      const speed = Math.random() * 14 + 6;
      this.speedX = Math.cos(angle) * speed;
      this.speedY = Math.sin(angle) * speed;
      
      this.gravity = Math.random() * 0.18 + 0.12;
      this.drag = 0.982;
      
      this.size = Math.random() * 12 + 6;
      this.opacity = 1.0;
      this.decay = Math.random() * 0.008 + 0.004;

      this.rotation = Math.random() * Math.PI * 2;
      this.rotSpeed = (Math.random() - 0.5) * 0.12;
      this.flipX = Math.random() * Math.PI;
      this.flipSpeed = Math.random() * 0.08 + 0.03;

      this.swaySpeed = Math.random() * 0.05 + 0.02;
      this.swayOffset = Math.random() * Math.PI * 2;

      // Particle Type Distribution: Petals, Golden Foil, Sparkles, Bokeh
      const r = Math.random();
      if (r < 0.40) {
        this.type = 'petal';
        const colors = ['#ff75a0', '#ff4d6d', '#b30024', '#e63946', '#ff85a1', '#d90429'];
        this.color = colors[Math.floor(Math.random() * colors.length)];
      } else if (r < 0.70) {
        this.type = 'foil';
        const foilColors = ['#ffd700', '#ffb703', '#fff07c', '#e5a93c', '#ffffff'];
        this.color = foilColors[Math.floor(Math.random() * foilColors.length)];
      } else if (r < 0.88) {
        this.type = 'sparkle';
        this.color = '#fff07c';
      } else {
        this.type = 'bokeh';
        this.color = Math.random() > 0.5 ? 'rgba(255, 215, 0, 0.45)' : 'rgba(255, 117, 160, 0.45)';
      }
    }

    update() {
      this.swayOffset += this.swaySpeed;
      this.speedX *= this.drag;
      this.speedY += this.gravity;
      
      this.x += this.speedX + Math.sin(this.swayOffset) * 1.5;
      this.y += this.speedY;
      
      this.rotation += this.rotSpeed;
      this.flipX += this.flipSpeed;
      this.opacity -= this.decay;
    }

    draw() {
      if (!celCtx || this.opacity <= 0) return;
      celCtx.save();
      celCtx.translate(this.x, this.y);
      celCtx.rotate(this.rotation);
      celCtx.scale(Math.cos(this.flipX), 1);
      celCtx.globalAlpha = Math.max(0, this.opacity);
      celCtx.fillStyle = this.color;

      if (this.type === 'petal') {
        celCtx.shadowBlur = 10;
        celCtx.shadowColor = this.color;
        celCtx.beginPath();
        celCtx.moveTo(0, -this.size);
        celCtx.bezierCurveTo(this.size * 0.9, -this.size * 0.6, this.size * 1.1, this.size * 0.6, 0, this.size);
        celCtx.bezierCurveTo(-this.size * 1.1, this.size * 0.6, -this.size * 0.9, -this.size * 0.6, 0, -this.size);
        celCtx.fill();
      } else if (this.type === 'foil') {
        celCtx.shadowBlur = 8;
        celCtx.shadowColor = '#ffd700';
        celCtx.fillRect(-this.size * 0.5, -this.size * 0.3, this.size, this.size * 0.6);
      } else if (this.type === 'sparkle') {
        celCtx.shadowBlur = 12;
        celCtx.shadowColor = '#ffffff';
        celCtx.beginPath();
        for (let i = 0; i < 4; i++) {
          celCtx.lineTo(Math.cos((i * Math.PI) / 2) * this.size, Math.sin((i * Math.PI) / 2) * this.size);
          celCtx.lineTo(Math.cos(((i + 0.5) * Math.PI) / 2) * (this.size * 0.3), Math.sin(((i + 0.5) * Math.PI) / 2) * (this.size * 0.3));
        }
        celCtx.closePath();
        celCtx.fill();
      } else { // bokeh
        celCtx.shadowBlur = 16;
        celCtx.shadowColor = 'rgba(255, 215, 0, 0.6)';
        celCtx.beginPath();
        celCtx.arc(0, 0, this.size * 0.9, 0, Math.PI * 2);
        celCtx.fill();
      }
      celCtx.restore();
    }
  }

  function triggerCelebration() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (!celCanvas || !celCtx) return;

    // Spawn 85 - 110 burst particles
    const burstCount = 95;
    for (let i = 0; i < burstCount; i++) {
      celParticles.push(new CelebrationParticle());
    }

    isEmittingCelebration = true;

    if (celEmitTimeout) clearTimeout(celEmitTimeout);
    celEmitTimeout = setTimeout(() => {
      isEmittingCelebration = false;
    }, 3800);

    function celRenderLoop() {
      celCtx.clearRect(0, 0, celCanvas.width, celCanvas.height);

      for (let i = celParticles.length - 1; i >= 0; i--) {
        const p = celParticles[i];
        p.update();
        p.draw();
        if (p.opacity <= 0 || p.y > celCanvas.height + 50) {
          celParticles.splice(i, 1);
        }
      }

      if (celParticles.length > 0 || isEmittingCelebration) {
        celAnimFrame = requestAnimationFrame(celRenderLoop);
      } else {
        if (celAnimFrame) cancelAnimationFrame(celAnimFrame);
        celAnimFrame = null;
        celCtx.clearRect(0, 0, celCanvas.width, celCanvas.height);
      }
    }

    if (!celAnimFrame) {
      celRenderLoop();
    }
  }

  // --------------------------------------------------------------------------
  // 10. ADVANCED 3D BOOKSHELF & SPATIAL AUDIO ENGINE
  // --------------------------------------------------------------------------
  const bookModal = document.getElementById('bookModal');
  const closeBookBtn = document.getElementById('closeBookBtn');
  const bookModalTitle = document.getElementById('bookModalTitle');
  const bookModalTag = document.getElementById('bookModalTag');
  const bookModalQuote = document.getElementById('bookModalQuote');
  const bookModalContent = document.getElementById('bookModalContent');
  const bookSpineSecret = document.getElementById('bookSpineSecret');

  let readBooksCount = new Set();
  let secretBookUnlocked = false;

  const bookData = {
    bookSpine1: {
      title: "Aaron Warner's Rules 🖤",
      tag: "CHAPTER I • DARK ROMANCE",
      quote: `"Ignite, my love." — Aaron Warner (*Shatter Me*)`,
      content: "Mohima has spent over 200 hours reading smut & dark romance novels without sleep!\n\nPreferred Trope: Enemies to lovers, possessive stalker heroes, and Aaron Warner's green eyes."
    },
    bookSpine2: {
      title: "A-Levels Physics Survival ⚡",
      tag: "CHAPTER II • ACADEMICS",
      quote: `"Jaao padho Rotational Motion! Padhayi nhi karoghe toh hostel ke mess main bartan dhona padhegha 😂"`,
      content: "Contains formulas for physics, chemistry lab hacks, and Bangladeshi mom chappal dodge techniques.\n\nRecommended reading before Friday mock exams!"
    },
    bookSpine3: {
      title: "700 Yrs Skeleton Grimoire 👑",
      tag: "CHAPTER III • ANCIENT LORE",
      quote: `"As ur wish 700 yrs old skeleton Princess! 🥱"`,
      content: "Official records of Mohima claiming to have a 700-year-old dead soul who sent letters via pigeons in 1324 AD.\n\nCurrently updated with cat memes & aesthetic Instagram reels."
    },
    bookSpine4: {
      title: "Vedant's Hostel Manual 🌿",
      tag: "CHAPTER IV • HOSTEL LIFE",
      quote: `"Hostel main rehta hun yaha sab aalsi hai 😅 Dhoodh aur kele hai hostel mess main 😑"`,
      content: "Survival guide for 5th semester B.Tech engineering in India.\n\nFeatures 3 AM jungle walks, cockroach mess food discoveries, and attendance shortage emergency plans."
    },
    bookSpine5: {
      title: "Christian Harper's Rules 🥀",
      tag: "CHAPTER V • MAFIA ROMANCE",
      quote: `"You set your nickname to Knight of the little princess."`,
      content: "Rules of possession & protective romance.\n\nWhen Mohima claims she is a cold men-hater, but secretly loves being called 'my cute little princess' 😚"
    },
    bookSpine6: {
      title: "Cat Memes & 3 AM Reels 🐾",
      tag: "CHAPTER VI • LATE NIGHT DMs",
      quote: `"Kidnap kar lo yrr esko badha cute hai 🙃 Exactly 💯"`,
      content: "Archive of late-night Instagram reels sent between India & Bangladesh at 3 AM.\n\nIncludes 500+ fluffy kitten memes, rain aesthetics, and anime edits!"
    },
    bookSpine7: {
      title: "Lloyd & ORV Manhwa 🎭",
      tag: "CHAPTER VII • ANIME & MANHWA",
      quote: `"Lloyd Frontera faces & ORV Kim Dokja's sacrifices."`,
      content: "Vedant's personal anime & manhwa recommendations: Omniscient Reader's Viewpoint (ORV), Lord of the Mysteries (LOTM), Re:Zero, and Death Note!"
    },
    bookSpine8: {
      title: "Silent Patient Thriller 🔪",
      tag: "CHAPTER VIII • THRILLER VAULT",
      quote: `"The Silent Patient & Freida McFadden psychological thrillers."`,
      content: "Mohima's late-night psychological thriller collection! Mysterious plots, plot twists, and zero sleep!"
    },
    bookSpineSecret: {
      title: "THE SECRET 18TH CHAPTER 👑",
      tag: "CHAPTER IX • FOREVER & ALWAYS",
      quote: `"You are my favorite mess, and I'm all yours 😚"`,
      content: "Congratulations on unlocking the secret chapter!\n\n700 years of soul connections, 48,640+ Instagram messages, and infinite banter across India & Bangladesh.\n\nHappy 18th Birthday Mohima, my pretty princess! 🖤✨"
    }
  };

  function unlockSecretBook() {
    if (!secretBookUnlocked && bookSpineSecret) {
      secretBookUnlocked = true;
      bookSpineSecret.classList.remove('locked');
      bookSpineSecret.querySelector('.spine-title').innerText = "THE SECRET 18TH CHAPTER 👑";
      triggerCelebration();
      playFanfareSound();
      debouncedSaveStateToHash();
    }
  }

  Object.keys(bookData).forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener('click', () => {
        if (id === 'bookSpineSecret' && !secretBookUnlocked) {
          alert("🔒 The Secret 18th Chapter is locked! Score 100% on the Quiz or type key '18' to unlock!");
          return;
        }
        playBookSound();
        setSpatialMuffle(true);
        readBooksCount.add(id);
        if (readBooksCount.size >= 6) {
          unlockBadge('badge3');
        }
        const item = bookData[id];
        bookModalTitle.innerText = item.title;
        bookModalTag.innerText = item.tag;
        bookModalQuote.innerText = item.quote;
        bookModalContent.innerText = item.content;
        bookModal.classList.add('active');
      });
    }
  });

  closeBookBtn.addEventListener('click', () => {
    playPopSound();
    setSpatialMuffle(false);
    bookModal.classList.remove('active');
  });

  // --------------------------------------------------------------------------
  // 11. LIVE IG DM CHAT SIMULATOR & SEPARATE NICKNAME DROPDOWN HANDLERS
  // --------------------------------------------------------------------------
  const voiceNoteTrigger = document.getElementById('voiceNoteTrigger');
  const dmChatBody = document.getElementById('dmChatBody');
  const dmInputField = document.getElementById('dmInputField');
  const dmInputForm = document.getElementById('dmInputForm');
  const typingIndicator = document.getElementById('typingIndicator');
  const starterChips = document.querySelectorAll('.starter-chip');
  const vedantNicknameSelect = document.getElementById('vedantNicknameSelect');
  const mohimaNicknameSelect = document.getElementById('mohimaNicknameSelect');

  if (vedantNicknameSelect) {
    vedantNicknameSelect.addEventListener('change', (e) => {
      playPopSound();
      appState.activeVedantNickname = e.target.value;
      showToast(`Vedant's nickname updated: "${e.target.value}"`, 'gold', '👑');
    });
  }

  if (mohimaNicknameSelect) {
    mohimaNicknameSelect.addEventListener('change', (e) => {
      playPopSound();
      appState.activeMohimaNickname = e.target.value;
      showToast(`Mohima's nickname updated: "${e.target.value}"`, 'gold', '👑');
    });
  }

  voiceNoteTrigger.addEventListener('click', () => {
    playVoiceNoteAudio();
    showToast("🎵 Playing Mohima's Hindi Voice Note (0:14)...", 'normal', '🎵');
  });

  // Short-Circuit NLP Heuristics (Levenshtein Distance + Regex)
  function levenshtein(a, b) {
    const tmp = [];
    let i, j, alen = a.length, blen = b.length;
    if (alen === 0) return blen;
    if (blen === 0) return alen;
    for (i = 0; i <= alen; i++) tmp[i] = [i];
    for (j = 0; j <= blen; j++) tmp[0][j] = j;
    for (i = 1; i <= alen; i++) {
      for (j = 1; j <= blen; j++) {
        tmp[i][j] = Math.min(
          tmp[i - 1][j] + 1,
          tmp[i][j - 1] + 1,
          tmp[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)
        );
      }
    }
    return tmp[alen][blen];
  }

  const vedantResponses = [
    { keywords: ['miss', 'missing'], response: "Awww miss me already? 🙈 Jaao pehle Rotational Motion complete karo, fir text karna! 💅" },
    { keywords: ['rotational', 'physics', 'study', 'exam', 'hate', 'coffe', 'coffee'], response: "Padhayi nhi karoghe toh hostel ke mess main mere saath bartan dhona padhegha 😅 Jaao physics padho mohtarma!" },
    { keywords: ['aaron', 'warner', 'zade', 'christian', 'smut', 'romance', 'book'], response: "Aaron Warner fictional hai, main real hun 🤌 Stop overthinking and go get your beauty sleep!" },
    { keywords: ['birthday', '18', 'happy'], response: "Happy 18th Birthday my pretty princess! 🥳✨ Make sure not to drink 4 cups of black coffee in one go today! 🖤" },
    { keywords: ['700', 'skeleton', 'soul', 'old'], response: "700 saal purani skeleton princess ho aap, esliye 17 ki umar main dadi ammi jesi baate karti ho 🥱" },
    { keywords: ['cute', 'accent', 'voice'], response: "Ur accent is cute but ngl ur hindi voice is even cuter 🤌 Ab zyaada sharmaao mat!" }
  ];

  function getVedantResponse(text) {
    const lower = text.toLowerCase();

    // 1. Direct Regex / Exact substring short-circuit check
    for (let item of vedantResponses) {
      if (item.keywords.some(k => lower.includes(k))) {
        return item.response;
      }
    }

    // 2. Fuzzy Levenshtein Distance Check (edit distance <= 2)
    const words = lower.split(/\s+/);
    for (let word of words) {
      for (let item of vedantResponses) {
        for (let k of item.keywords) {
          if (levenshtein(word, k) <= 2) {
            return item.response;
          }
        }
      }
    }

    return "Accha 🙂 700 saal purani aatma ho aap, banter never stops! Tell me more or go study physics 😂";
  }

  function appendChatMessage(sender, text) {
    const bubble = document.createElement('div');
    bubble.className = `chat-bubble ${sender}`;
    bubble.innerText = text;
    dmChatBody.appendChild(bubble);
    dmChatBody.scrollTop = dmChatBody.scrollHeight;
  }

  function handleUserMessage(msgText) {
    if (!msgText.trim()) return;
    playPopSound();
    appendChatMessage('mohima', msgText);
    unlockBadge('badge5');

    typingIndicator.style.display = 'flex';
    dmChatBody.scrollTop = dmChatBody.scrollHeight;

    setTimeout(() => {
      typingIndicator.style.display = 'none';
      const reply = getVedantResponse(msgText);
      appendChatMessage('vedant', reply);
      playPopSound();
    }, 1200);
  }

  dmInputForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const val = dmInputField.value;
    dmInputField.value = '';
    handleUserMessage(val);
  });

  starterChips.forEach(chip => {
    chip.addEventListener('click', () => {
      const msg = chip.getAttribute('data-msg');
      handleUserMessage(msg);
    });
  });

  // --------------------------------------------------------------------------
  // 12. 3D BANTER MEMORY FLASHCARDS CAROUSEL ENGINE
  // --------------------------------------------------------------------------
  const flashcardBoxes = document.querySelectorAll('.flashcard-3d-box');
  const flashPrevBtn = document.getElementById('flashPrevBtn');
  const flashNextBtn = document.getElementById('flashNextBtn');
  const flashcardCounter = document.getElementById('flashcardCounter');
  const flashcardDots = document.querySelectorAll('.flashcard-dots .dot');
  const flashcardsTrackWrapper = document.querySelector('.flashcards-track-wrapper');
  let currentCardIdx = 0;

  function updateFlashcardsVisibility() {
    flashcardBoxes.forEach((box, idx) => {
      if (idx === currentCardIdx) {
        box.style.display = 'block';
      } else {
        box.style.display = 'none';
      }
    });

    if (flashcardCounter) {
      flashcardCounter.innerText = `CARD ${currentCardIdx + 1} OF ${flashcardBoxes.length}`;
    }

    flashcardDots.forEach((dot, idx) => {
      if (idx === currentCardIdx) dot.classList.add('active');
      else dot.classList.remove('active');
    });
  }

  flashcardDots.forEach(dot => {
    dot.addEventListener('click', () => {
      playPopSound();
      currentCardIdx = parseInt(dot.getAttribute('data-idx'));
      updateFlashcardsVisibility();
    });
  });

  // Mobile Touch Swipe Handling for Flashcards
  let touchStartX = 0;
  if (flashcardsTrackWrapper) {
    flashcardsTrackWrapper.addEventListener('touchstart', (e) => {
      touchStartX = e.touches[0].clientX;
    }, { passive: true });

    flashcardsTrackWrapper.addEventListener('touchend', (e) => {
      const touchEndX = e.changedTouches[0].clientX;
      const diffX = touchStartX - touchEndX;
      if (Math.abs(diffX) > 45) {
        if (diffX > 0) {
          // Swipe left -> Next card
          currentCardIdx = (currentCardIdx + 1) % flashcardBoxes.length;
        } else {
          // Swipe right -> Prev card
          currentCardIdx = (currentCardIdx - 1 + flashcardBoxes.length) % flashcardBoxes.length;
        }
        playCardFlipSound();
        updateFlashcardsVisibility();
      }
    }, { passive: true });
  }

  flashcardBoxes.forEach(box => {
    box.addEventListener('click', () => {
      playCardFlipSound();
      box.classList.toggle('flipped');
    });
  });

  if (flashPrevBtn && flashNextBtn) {
    flashPrevBtn.addEventListener('click', () => {
      playPopSound();
      currentCardIdx = (currentCardIdx - 1 + flashcardBoxes.length) % flashcardBoxes.length;
      updateFlashcardsVisibility();
    });

    flashNextBtn.addEventListener('click', () => {
      playPopSound();
      currentCardIdx = (currentCardIdx + 1) % flashcardBoxes.length;
      updateFlashcardsVisibility();
    });
  }

  updateFlashcardsVisibility();

  // --------------------------------------------------------------------------
  // 13. POLAROID LIGHTBOX MODAL
  // --------------------------------------------------------------------------
  const polaroidCards = document.querySelectorAll('.polaroid-card');
  const polaroidModal = document.getElementById('polaroidModal');
  const closePolaroidBtn = document.getElementById('closePolaroidBtn');
  const polaroidModalImg = document.getElementById('polaroidModalImg');
  const polaroidModalTitle = document.getElementById('polaroidModalTitle');
  const polaroidModalNote = document.getElementById('polaroidModalNote');

  polaroidCards.forEach(card => {
    card.addEventListener('click', () => {
      playCameraShutterSound();
      setSpatialMuffle(true);
      const title = card.getAttribute('data-title');
      const note = card.getAttribute('data-note');
      const img = card.getAttribute('data-img');

      polaroidModalTitle.innerText = title;
      polaroidModalNote.innerText = note;
      polaroidModalImg.src = img;
      polaroidModal.classList.add('active');
    });
  });

  closePolaroidBtn.addEventListener('click', () => {
    playPopSound();
    setSpatialMuffle(false);
    polaroidModal.classList.remove('active');
  });

  const ghostMirrorCard = document.getElementById('ghostMirrorCard');
  const mirrorReflectionImg = document.getElementById('mirrorReflectionImg');
  const mirrorSpiritTag = document.getElementById('mirrorSpiritTag');
  const mirrorRoastText = document.getElementById('mirrorRoastText');
  const liftDupattaBtn = document.getElementById('liftDupattaBtn');
  const shuffleMirrorBtn = document.getElementById('shuffleMirrorBtn');

  const mirrorGallery = [
    {
      img: 'mohima_blue_mirror.jpg',
      tag: '<i class="fa-solid fa-crown"></i> HRH Royal Blue Princess (1/4)',
      roast: '"700 saal purani aatma ho aap, toh ayna cover kyu karti ho? Ghosts won\'t eat you, you are the ghost chief! 😂🤌"'
    },
    {
      img: 'mohima_reading.jpg',
      tag: '<i class="fa-solid fa-book"></i> Twisted Games Reader (2/4)',
      roast: '"A-Levels Physics mock 2 din door hai aur madam Twisted Games padhne main busy hain! Rhys Larsen fictional hai, real life main main hi milunga 😭🖤"'
    },
    {
      img: 'mohima_floral_kurti.jpg',
      tag: '<i class="fa-solid fa-seedling"></i> Desi Academia President (3/4)',
      roast: '"Books in background, floral kurti in front... full Desi Dark Academia vibe! Itni pyaari lagoge toh men-hater club executive president kaun banega? 😂💕"'
    },
    {
      img: 'mohima_pink_kurti.jpg',
      tag: '<i class="fa-solid fa-heart"></i> Cute Little Princess (4/4)',
      roast: '"Ur accent is cute, but ur Hindi voice and these mirror selfies are even cuter 🤌 Permanently booked in my heart, zero refund policy! 🙈👑✨"'
    }
  ];

  let currentMirrorIdx = 0;
  let isGhostMirrorRevealed = false;

  function cycleMirrorPhoto() {
    currentMirrorIdx = (currentMirrorIdx + 1) % mirrorGallery.length;
    const item = mirrorGallery[currentMirrorIdx];

    if (mirrorReflectionImg) mirrorReflectionImg.src = item.img;
    if (mirrorSpiritTag) mirrorSpiritTag.innerHTML = item.tag;
    if (mirrorRoastText) mirrorRoastText.innerText = item.roast;
    if (shuffleMirrorBtn) shuffleMirrorBtn.innerHTML = `<i class="fa-solid fa-rotate"></i> Next Reflection (${currentMirrorIdx + 1}/4) 📸`;

    playCameraShutterSound();
    showToast(`Switched Reflection (${currentMirrorIdx + 1}/4)!`, 'normal', '📸');
  }

  function liftDupattaCover() {
    playGhostDissipateSound();
    unlockBadge('badge7');
    ghostMirrorCard.classList.add('uncovered');
    if (!isGhostMirrorRevealed) {
      isGhostMirrorRevealed = true;
      showToast("👻 Dupatta lifted! Royal Victorian Mirror unlocked!", "gold", "🪞");
    }
  }

  if (ghostMirrorCard) {
    ghostMirrorCard.addEventListener('click', (e) => {
      if (e.target.closest('#liftDupattaBtn') || !ghostMirrorCard.classList.contains('uncovered')) {
        liftDupattaCover();
      } else {
        cycleMirrorPhoto();
      }
    });

    if (shuffleMirrorBtn) {
      shuffleMirrorBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        cycleMirrorPhoto();
      });
    }

    if (liftDupattaBtn) {
      liftDupattaBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        liftDupattaCover();
      });
    }

    // 3D Parallax Mouse Tracking Tilt Effect
    ghostMirrorCard.addEventListener('mousemove', (e) => {
      const rect = ghostMirrorCard.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -8;
      const rotateY = ((x - centerX) / centerX) * 8;

      ghostMirrorCard.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
    });

    ghostMirrorCard.addEventListener('mouseleave', () => {
      ghostMirrorCard.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)`;
    });

    // IntersectionObserver to auto-reset Ghost Mirror when user scrolls to next section
    const mirrorObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) {
          ghostMirrorCard.classList.remove('uncovered');
          ghostMirrorCard.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)`;
          currentMirrorIdx = 0;
          const item = mirrorGallery[0];
          if (mirrorReflectionImg) mirrorReflectionImg.src = item.img;
          if (mirrorSpiritTag) mirrorSpiritTag.innerHTML = item.tag;
          if (mirrorRoastText) mirrorRoastText.innerText = item.roast;
          if (shuffleMirrorBtn) shuffleMirrorBtn.innerHTML = `<i class="fa-solid fa-rotate"></i> Next Reflection (1/4) 📸`;
        }
      });
    }, { threshold: 0.05 });

    mirrorObserver.observe(ghostMirrorCard);
  }

  // --------------------------------------------------------------------------
  // 14. EXPANDED 6-QUESTION QUIZ MINI-GAME ENGINE
  // --------------------------------------------------------------------------
  const quizQuestions = [
    {
      question: "What is the primary delicacy served in Vedant's Boys' Hostel Mess?",
      options: [
        "A) Dhoodh aur Kele (Banana & Milk) 🍌",
        "B) Five-Star Gourmet Steak 🥩",
        "C) Fresh Mango Cupcakes 🧁",
        "D) Cold Coffee & Pizza 🍕"
      ],
      answer: 0
    },
    {
      question: "What is Vedant's golden rule when performing Chemistry Lab experiments?",
      options: [
        "A) Mix everything together until something catches fire! 🔥",
        "B) Follow lab manuals silently 📚",
        "C) Ask the lab assistant for help 🧪",
        "D) Clean test tubes twice 🧽"
      ],
      answer: 0
    },
    {
      question: "Why is Mohima's bedroom mirror covered with an old dupatta?",
      options: [
        "A) So 700-year-old ghosts don't stare at her late at night! 👻",
        "B) Because she dislikes mirrors 🪞",
        "C) Room decoration aesthetic 🌸",
        "D) Direct sunlight reflection ☀️"
      ],
      answer: 0
    },
    {
      question: "Which location in Bangladesh does Vedant tease as 'Gangs of Wasseypur'?",
      options: [
        "A) Mohammadpur, Dhaka! 🇧🇩",
        "B) Sylhet 🌿",
        "C) Chittagong ⚓",
        "D) Cox's Bazar 🏖️"
      ],
      answer: 0
    },
    {
      question: "How old is Mohima's soul according to her own claims?",
      options: [
        "A) 17 Years Old 👧",
        "B) 700 Years Old Skeleton Soul 👑",
        "C) 100 Years Old 👵",
        "D) 2,000 Years Old 🏛️"
      ],
      answer: 1
    },
    {
      question: "What is Vedant's favorite compliment regarding Mohima's voice?",
      options: [
        "A) Ur accent is cute but ngl ur hindi voice is even cuter 🤌",
        "B) You sound like a radio presenter 🎙️",
        "C) You speak too fast ⚡",
        "D) You sound like Homelander 😂"
      ],
      answer: 0
    }
  ];

  let currentQuizIdx = 0;
  let quizScore = 0;

  const quizQuestionEl = document.getElementById('quizQuestion');
  const quizProgressEl = document.getElementById('quizProgress');
  const quizOptionsEl = document.getElementById('quizOptions');
  const quizRewardModal = document.getElementById('quizRewardModal');
  const closeQuizRewardBtn = document.getElementById('closeQuizRewardBtn');

  function renderQuizQuestion() {
    const q = quizQuestions[currentQuizIdx];
    quizProgressEl.innerText = `QUESTION ${currentQuizIdx + 1} OF ${quizQuestions.length}`;
    quizQuestionEl.innerText = q.question;

    quizOptionsEl.innerHTML = '';
    q.options.forEach((optText, idx) => {
      const btn = document.createElement('button');
      btn.className = 'quiz-opt-btn';
      btn.innerText = optText;
      btn.addEventListener('click', () => handleQuizAnswer(idx, btn));
      quizOptionsEl.appendChild(btn);
    });
  }

  function handleQuizAnswer(selectedIdx, btnEl) {
    const q = quizQuestions[currentQuizIdx];
    const allBtns = quizOptionsEl.querySelectorAll('.quiz-opt-btn');
    allBtns.forEach(b => b.disabled = true);

    if (selectedIdx === q.answer) {
      playChimeSound();
      btnEl.classList.add('correct');
      quizScore++;
    } else {
      playPopSound();
      btnEl.classList.add('wrong');
      allBtns[q.answer].classList.add('correct');
    }

    setTimeout(() => {
      currentQuizIdx++;
      if (currentQuizIdx < quizQuestions.length) {
        renderQuizQuestion();
      } else {
        if (quizScore === quizQuestions.length) {
          quizRewardModal.classList.add('active');
          triggerCelebration();
          unlockBadge('badge4');
          unlockSecretBook();
        } else {
          alert(`Quiz Finished! You scored ${quizScore}/${quizQuestions.length}. Retrying for 100% score!`);
          currentQuizIdx = 0;
          quizScore = 0;
          renderQuizQuestion();
        }
      }
    }, 1200);
  }

  renderQuizQuestion();
  closeQuizRewardBtn.addEventListener('click', () => {
    playPopSound();
    quizRewardModal.classList.remove('active');
  });

  // --------------------------------------------------------------------------
  // 15. EXPANDED FORTUNE WHEEL GENERATOR
  // --------------------------------------------------------------------------
  const fortuneResult = document.getElementById('fortuneResult');
  const spinFortuneBtn = document.getElementById('spinFortuneBtn');

  const fortunes = [
    "🥀 <strong>Trope: Enemies to Lovers</strong> — Aaron Warner inspects your A-Levels Physics notes and commands you to stop overthinking and go sleep!",
    "👑 <strong>Trope: Mafia Princess</strong> — You are officially crowned Supreme Executive of the Bangladesh Men-Hater Club & Dark Academia Society!",
    "☕ <strong>Trope: 3 AM Black Coffee Overdose</strong> — Vedant brews you 4 packets of black coffee and buys you 10 fuzzy kittens for your 700th birthday!",
    "🦇 <strong>Trope: Reincarnated Vampire</strong> — Your 700-year-old soul receives a lifetime supply of dark romance paperbacks and rainy weather in Mohammadpur!",
    "🎭 <strong>Trope: Omniscient Reader Viewpoint</strong> — You and Vedant unlock the Secret ORV Scenario with Lloyd Frontera's funniest facial expression!",
    "🐾 <strong>Trope: Possessive Hero</strong> — Your 3 AM walks in Dhaka/Hostel are now guarded by an army of fluffy kittens!",
    "🤌 <strong>Trope: Slow Burn Romance</strong> — Vedant officially admits your Hindi voice note is the cuteness winner of the entire year!"
  ];

  spinFortuneBtn.addEventListener('click', () => {
    playSpinWheelSound();
    fortuneResult.innerHTML = '🔮 <em>Consulting the 700-year-old dark romance archives...</em>';
    spinFortuneBtn.disabled = true;

    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * fortunes.length);
      fortuneResult.innerHTML = fortunes[randomIndex];
      spinFortuneBtn.disabled = false;
      triggerCelebration();
      playFanfareSound();
    }, 1200);
  });

  // --------------------------------------------------------------------------
  // 16. LIVE BIRTHDAY TICKING COUNTER (JULY 27 - INDIAN TIME UTC+5:30)
  // --------------------------------------------------------------------------
  const clockDays = document.getElementById('clockDays');
  const clockHours = document.getElementById('clockHours');
  const clockMinutes = document.getElementById('clockMinutes');
  const clockSeconds = document.getElementById('clockSeconds');
  const clockTitle = document.getElementById('clockTitle');

  const indianBirthday = new Date('2026-07-27T00:00:00+05:30');

  function updateLiveClock() {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - indianBirthday.getTime()) / 1000);

    const isCountdown = diffInSeconds < 0;
    const absDiff = Math.abs(diffInSeconds);

    const days = Math.floor(absDiff / (3600 * 24));
    const hours = Math.floor((absDiff % (3600 * 24)) / 3600);
    const minutes = Math.floor((absDiff % 3600) / 60);
    const seconds = Math.floor(absDiff % 60);

    if (clockDays) clockDays.innerText = String(days).padStart(2, '0');
    if (clockHours) clockHours.innerText = String(hours).padStart(2, '0');
    if (clockMinutes) clockMinutes.innerText = String(minutes).padStart(2, '0');
    if (clockSeconds) clockSeconds.innerText = String(seconds).padStart(2, '0');

    if (clockTitle) {
      if (isCountdown) {
        clockTitle.innerText = "Countdown to Mohima's 18th Birthday (India Time 🇮🇳) ⏳";
      } else {
        clockTitle.innerText = "Time Since Mohima Turned 18 (India Time 🇮🇳) ✨";
      }
    }
  }

  setInterval(updateLiveClock, 1000);
  updateLiveClock();

  // --------------------------------------------------------------------------
  // 17. KEYBOARD EASTER EGGS ('18' or '700')
  // --------------------------------------------------------------------------
  const easterEggModal = document.getElementById('easterEggModal');
  const closeEasterEggBtn = document.getElementById('closeEasterEggBtn');
  let keySequence = '';

  document.addEventListener('keydown', (e) => {
    keySequence += e.key;
    if (keySequence.length > 5) keySequence = keySequence.slice(-5);

    if (keySequence.includes('18') || keySequence.includes('700')) {
      keySequence = '';
      easterEggModal.classList.add('active');
      triggerCelebration();
      playFanfareSound();
      unlockBadge('badge6');
      unlockSecretBook();
    }
  });

  closeEasterEggBtn.addEventListener('click', () => {
    playPopSound();
    easterEggModal.classList.remove('active');
  });

  // --------------------------------------------------------------------------
  // 18. MODAL OVERLAYS (LETTER & GIFT)
  // --------------------------------------------------------------------------
  const letterModal = document.getElementById('letterModal');
  const openLetterBtn = document.getElementById('openLetterBtn');
  const closeLetterBtn = document.getElementById('closeLetterBtn');

  const giftModal = document.getElementById('giftModal');
  const unboxGiftBtn = document.getElementById('unboxGiftBtn');
  const closeGiftBtn = document.getElementById('closeGiftBtn');

  openLetterBtn.addEventListener('click', () => {
    playBookSound();
    setSpatialMuffle(true);
    letterModal.classList.add('active');
  });
  closeLetterBtn.addEventListener('click', () => {
    playPopSound();
    setSpatialMuffle(false);
    letterModal.classList.remove('active');
  });

  unboxGiftBtn.addEventListener('click', () => {
    playFanfareSound();
    giftModal.classList.add('active');
    triggerCelebration();
  });
  closeGiftBtn.addEventListener('click', () => {
    playPopSound();
    giftModal.classList.remove('active');
  });

  function closeAllActiveModals() {
    document.querySelectorAll('.modal-overlay.active').forEach(modal => {
      modal.classList.remove('active');
    });
    setSpatialMuffle(false);
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeAllActiveModals();
    }
  });

  window.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal-overlay') && e.target.id !== 'secretVaultModal') {
      e.target.classList.remove('active');
      setSpatialMuffle(false);
    }
  });

  // --------------------------------------------------------------------------
  // 19. DIGITAL TWIN PROMPT CHIPS HANDLER
  // --------------------------------------------------------------------------
  const promptChips = document.querySelectorAll('.prompt-chip');
  const gptUrl = 'https://chatgpt.com/g/g-6a661f5e6c8481919422e7b592c9427f-vedant-singh';

  promptChips.forEach(chip => {
    chip.addEventListener('click', () => {
      playPopSound();
      const textToCopy = chip.getAttribute('data-prompt');
      navigator.clipboard.writeText(textToCopy).then(() => {
        showToast(`📋 Prompt copied: "${textToCopy}"! Opening Vedant's Digital Twin...`, 'gold', '🤖');
        window.open(gptUrl, '_blank');
      }).catch(() => {
        window.open(gptUrl, '_blank');
      });
    });
  });

  // --------------------------------------------------------------------------
  // 20. GIRLFRIEND'S DAY SECRET VAULT ENGINE & CANVAS PROCEDURAL SYSTEM
  // --------------------------------------------------------------------------
  const secretVaultBtn = document.getElementById('secretVaultBtn');
  const secretVaultModal = document.getElementById('secretVaultModal');
  const closeVaultBtn = document.getElementById('closeVaultBtn');
  const vaultGateScreen = document.getElementById('vaultGateScreen');
  const waxSealBox = document.getElementById('waxSealBox');
  const vaultMainContent = document.getElementById('vaultMainContent');
  const envelopeCard = document.getElementById('envelopeCard');
  const envelopeFlap = document.getElementById('envelopeFlap');
  const vaultLoveLetterBox = document.getElementById('vaultLoveLetterBox');
  const petalCounterBadge = document.getElementById('petalCounterBadge');
  const petalCountText = document.getElementById('petalCountText');
  const shadeMauveRoseBtn = document.getElementById('shadeMauveRoseBtn');
  const shadeMauveBerryBtn = document.getElementById('shadeMauveBerryBtn');
  const shadeRoyalCrimsonBtn = document.getElementById('shadeRoyalCrimsonBtn');

  const vaultPetalCanvas = document.getElementById('vaultPetalCanvas');
  const vaultRoseCanvas = document.getElementById('vaultRoseCanvas');

  let petalCtx = vaultPetalCanvas ? vaultPetalCanvas.getContext('2d') : null;
  let roseCtx = vaultRoseCanvas ? vaultRoseCanvas.getContext('2d') : null;

  let petalsArray = [];
  let petalAnimationId = null;
  let petalsCaught = 0;

  // Web Audio Synthesizers for Secret Vault
  function playWaxCrackleSound() {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const bufferSize = ctx.sampleRate * 0.3;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.05));
      }
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;
      const filter = ctx.createBiquadFilter();
      filter.type = 'highpass';
      filter.frequency.value = 1200;
      noise.connect(filter);
      filter.connect(ctx.destination);
      noise.start();
    } catch (e) {}
  }

  function playRoseBloomSound() {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const freqs = [523.25, 659.25, 783.99, 987.77, 1046.50];
      freqs.forEach((f, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.value = f;
        gain.gain.setValueAtTime(0.08, ctx.currentTime + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.08 + 0.6);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + idx * 0.08);
        osc.stop(ctx.currentTime + idx * 0.08 + 0.6);
      });
    } catch (e) {}
  }

  // Drifting Petals Canvas Physics
  function initVaultPetals() {
    if (!vaultPetalCanvas) return;
    vaultPetalCanvas.width = window.innerWidth;
    vaultPetalCanvas.height = window.innerHeight;

    petalsArray = [];
    const colors = ['rgba(245, 215, 150, 0.75)', 'rgba(255, 117, 160, 0.75)', 'rgba(168, 28, 56, 0.75)', 'rgba(124, 62, 89, 0.75)'];
    const count = window.innerWidth < 768 ? 18 : 40;

    for (let i = 0; i < count; i++) {
      petalsArray.push({
        x: Math.random() * vaultPetalCanvas.width,
        y: Math.random() * vaultPetalCanvas.height,
        size: Math.random() * 8 + 6,
        speedY: Math.random() * 1.4 + 0.7,
        speedX: Math.random() * 0.8 - 0.4,
        rotation: Math.random() * 360,
        rotSpeed: (Math.random() - 0.5) * 1.8,
        color: colors[Math.floor(Math.random() * colors.length)]
      });
    }
  }

  function renderVaultPetals() {
    if (!petalCtx || !vaultPetalCanvas) return;
    petalCtx.clearRect(0, 0, vaultPetalCanvas.width, vaultPetalCanvas.height);

    petalsArray.forEach(p => {
      p.y += p.speedY;
      p.x += Math.sin(p.y * 0.01) + p.speedX;
      p.rotation += p.rotSpeed;

      if (p.y > vaultPetalCanvas.height + 20) {
        p.y = -20;
        p.x = Math.random() * vaultPetalCanvas.width;
      }

      petalCtx.save();
      petalCtx.translate(p.x, p.y);
      petalCtx.rotate((p.rotation * Math.PI) / 180);
      petalCtx.fillStyle = p.color;
      petalCtx.beginPath();
      petalCtx.ellipse(0, 0, p.size, p.size * 0.5, 0, 0, Math.PI * 2);
      petalCtx.fill();
      petalCtx.restore();
    });

    petalAnimationId = requestAnimationFrame(renderVaultPetals);
  }

  // Procedural Blooming Rose Animation System
  function drawSingleRose(ctx, centerX, centerY, scale, progress) {
    // Stem & Leaves
    ctx.strokeStyle = `rgba(74, 154, 98, ${Math.min(0.9, progress)})`;
    ctx.lineWidth = 3.5 * scale;
    ctx.beginPath();
    ctx.moveTo(centerX, centerY + 100 * scale);
    ctx.quadraticCurveTo(centerX - 15 * scale, centerY + 50 * scale, centerX, centerY);
    ctx.stroke();

    if (progress > 0.2) {
      ctx.fillStyle = 'rgba(74, 154, 98, 0.75)';
      ctx.beginPath();
      ctx.ellipse(centerX - 18 * scale, centerY + 50 * scale, 18 * scale * progress, 8 * scale * progress, -Math.PI / 4, 0, Math.PI * 2);
      ctx.fill();

      ctx.beginPath();
      ctx.ellipse(centerX + 18 * scale, centerY + 70 * scale, 18 * scale * progress, 8 * scale * progress, Math.PI / 4, 0, Math.PI * 2);
      ctx.fill();
    }

    // Spiraling Petals
    const totalPetals = 22;
    for (let i = 0; i < totalPetals; i++) {
      const petalProgress = Math.max(0, Math.min(1, (progress * 1.5) - (i * 0.03)));
      if (petalProgress <= 0) continue;

      const angle = (i * 137.5 * Math.PI) / 180;
      const dist = Math.sqrt(i) * 12 * scale * petalProgress;
      const px = centerX + Math.cos(angle) * dist;
      const py = centerY + Math.sin(angle) * dist;
      const petalSize = (14 + i * 1.2) * scale * petalProgress;

      const grad = ctx.createRadialGradient(px, py, 2, px, py, petalSize);
      if (i % 3 === 0) {
        grad.addColorStop(0, 'rgba(255, 215, 150, 0.95)');
        grad.addColorStop(1, 'rgba(220, 20, 60, 0.85)');
      } else if (i % 2 === 0) {
        grad.addColorStop(0, 'rgba(255, 105, 180, 0.95)');
        grad.addColorStop(1, 'rgba(168, 28, 56, 0.9)');
      } else {
        grad.addColorStop(0, 'rgba(168, 28, 56, 0.95)');
        grad.addColorStop(1, 'rgba(74, 14, 35, 0.9)');
      }

      ctx.save();
      ctx.translate(px, py);
      ctx.rotate(angle + progress);
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.ellipse(0, 0, petalSize, petalSize * 0.65, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  function renderBloomingRoses() {
    if (!roseCtx || !vaultRoseCanvas) return;
    vaultRoseCanvas.width = window.innerWidth;
    vaultRoseCanvas.height = window.innerHeight;

    const width = vaultRoseCanvas.width;
    const height = vaultRoseCanvas.height;
    const centerX = width / 2;
    const centerY = height / 2;

    let progress = 0;
    const interval = setInterval(() => {
      progress += 0.04;
      roseCtx.clearRect(0, 0, width, height);

      // Draw single central unsealing rose bloom behind wax stamp
      drawSingleRose(roseCtx, centerX, centerY - 20, 1.1, progress);

      // Floating glowing stardust spores
      for (let j = 0; j < 30; j++) {
        const sporeAngle = j * 12 + progress * 2;
        const sporeDist = 35 + j * 10 * progress;
        const sx = centerX + Math.cos(sporeAngle) * sporeDist;
        const sy = centerY + Math.sin(sporeAngle) * sporeDist;

        roseCtx.fillStyle = `rgba(245, 215, 150, ${Math.max(0, 0.85 - (j * 0.025))})`;
        roseCtx.beginPath();
        roseCtx.arc(sx, sy, 2.5 + Math.sin(progress * 5 + j) * 1.5, 0, Math.PI * 2);
        roseCtx.fill();
      }

      if (progress >= 1.4) {
        clearInterval(interval);
        setTimeout(() => {
          let alpha = 1;
          const fadeOutInterval = setInterval(() => {
            alpha -= 0.06;
            if (alpha <= 0) {
              clearInterval(fadeOutInterval);
              roseCtx.clearRect(0, 0, width, height);
            } else {
              roseCtx.clearRect(0, 0, width, height);
              roseCtx.save();
              roseCtx.globalAlpha = alpha;
              drawSingleRose(roseCtx, centerX, centerY - 20, 1.1, 1.4);
              roseCtx.restore();
            }
          }, 30);
        }, 800);
      }
    }, 30);
  }

  // Typewriter Audio & Safety Net System
  let typewriterAudioCtx = null;
  let typewriterOsc = null;
  let typewriterGain = null;
  let typewriterTimer = null;
  let isTypewriterRunning = false;

  const fullLetterHTML = `
    <div class="letter-parchment">
      <div class="letter-top-seal">✦ GIRLFRIEND'S DAY SPECIAL ✦</div>
      <h3 class="letter-salutation">accha 🙂</h3>
      <div class="letter-text-body">
        <p>happy girlfriend's day to my favorite 700-year-old skeleton princess, Wattpad dark romance queen, and men-hater club executive president 👑🌹</p>
        <p>ik you're probably sitting in Bangladesh right now, drinking your 4th cup of black coffee, stressing over A-Levels Physics and complaining ki mom ne phir se chappal se maara... but take a pause for a second, mohtarma.</p>
        <p>you once asked me if you'd ever hate hearing me say <em>"i love the mess you are."</em> the answer is still no. no matter how dramatic you get, how many late nights you stay up reading smut, or how much you claim your soul died in 1324 AD... y r my favorite mess, and I'm all yours.</p>
        <p>from analyzing whether your lipstick is deep mauve berry or mauve rose (and me demanding hex codes like a nerd 🤦‍♂️), to listening to your cute voice notes when you get insecure about your accent... you really think you're Watson to my Sherlock, but honestly? you're just my pretty princess.</p>
        <p>and yes, under all my sarcastic roasts about Rotational Motion and hostel mess bananas... I still wanna die in the arms of my to-be wife. (ab zyaada sharmaao mat, le nikal gaya sach 😏)</p>
        <p>happy girlfriend's day, babu. stay cute, don't break your sleep schedule today, and remember — zero refund policy, you're permanently stuck with me 🖤</p>
      </div>
      <div class="letter-signature-block">
        <p>— yours, Vedant (Knight of the Little Princess) 🛡️✨</p>
      </div>
    </div>
  `;

  function startTypewriterAudioLoop() {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      typewriterAudioCtx = new AudioCtx();
      typewriterOsc = typewriterAudioCtx.createOscillator();
      typewriterGain = typewriterAudioCtx.createGain();

      typewriterOsc.type = 'triangle';
      typewriterOsc.frequency.setValueAtTime(140, typewriterAudioCtx.currentTime);
      typewriterGain.gain.setValueAtTime(0.03, typewriterAudioCtx.currentTime);

      typewriterOsc.connect(typewriterGain);
      typewriterGain.connect(typewriterAudioCtx.destination);
      typewriterOsc.start();
    } catch (e) {}
  }

  function stopTypewriterAudioLoop() {
    try {
      if (typewriterGain && typewriterAudioCtx) {
        typewriterGain.gain.setTargetAtTime(0, typewriterAudioCtx.currentTime, 0.08);
        setTimeout(() => {
          if (typewriterOsc) {
            typewriterOsc.stop();
            typewriterOsc.disconnect();
          }
          if (typewriterAudioCtx) typewriterAudioCtx.close();
          typewriterAudioCtx = null;
          typewriterOsc = null;
          typewriterGain = null;
        }, 120);
      }
    } catch (e) {}
  }

  function startTypewriterLoveLetter() {
    if (!vaultLoveLetterBox) return;
    vaultLoveLetterBox.style.display = 'block';
    vaultLoveLetterBox.innerHTML = fullLetterHTML;
    
    const textContainer = vaultLoveLetterBox.querySelector('.letter-text-body');
    if (!textContainer) return;

    const originalText = textContainer.innerHTML;
    textContainer.innerHTML = '<span id="typewriterText"></span><span class="typewriter-cursor">|</span>';
    const textSpan = textContainer.querySelector('#typewriterText');

    let i = 0;
    isTypewriterRunning = true;
    startTypewriterAudioLoop();

    typewriterTimer = setInterval(() => {
      if (i < originalText.length) {
        textSpan.innerHTML = originalText.substring(0, i + 1);
        i++;
      } else {
        skipTypewriter();
      }
    }, 28);
  }

  function skipTypewriter() {
    if (!isTypewriterRunning) return;
    if (typewriterTimer) clearInterval(typewriterTimer);
    isTypewriterRunning = false;
    stopTypewriterAudioLoop();

    if (vaultLoveLetterBox) {
      vaultLoveLetterBox.innerHTML = fullLetterHTML;
    }
  }

  if (vaultLoveLetterBox) {
    vaultLoveLetterBox.addEventListener('click', skipTypewriter);
  }

  // Open Vault Modal
  function openSecretVault() {
    playBookSound();
    secretVaultModal.classList.add('active');
    
    // Reset gate screen state
    if (vaultGateScreen) {
      vaultGateScreen.style.display = 'block';
      vaultGateScreen.classList.remove('not-loaded');
    }
    if (vaultMainContent) vaultMainContent.style.display = 'none';
    if (waxSealBox) {
      waxSealBox.style.transform = 'scale(1)';
      waxSealBox.style.opacity = '1';
    }

    initVaultPetals();
    if (petalAnimationId) cancelAnimationFrame(petalAnimationId);
    renderVaultPetals();
    renderBloomingRoses();

    showToast("🌹 Girlfriend's Day Secret Vault unlocked!", "gold", "🗝️");
  }

  function closeSecretVault() {
    playPopSound();
    secretVaultModal.classList.remove('active');
    if (petalAnimationId) cancelAnimationFrame(petalAnimationId);
  }

  if (secretVaultBtn) secretVaultBtn.addEventListener('click', openSecretVault);
  if (closeVaultBtn) closeVaultBtn.addEventListener('click', closeSecretVault);

  // Wax Seal Gate Unlock
  if (waxSealBox) {
    waxSealBox.addEventListener('click', () => {
      playWaxCrackleSound();
      playRoseBloomSound();
      renderBloomingRoses();

      waxSealBox.style.transform = 'scale(1.15) rotate(5deg)';
      waxSealBox.style.opacity = '0.7';

      setTimeout(() => {
        vaultGateScreen.style.display = 'none';
        vaultMainContent.style.display = 'block';
        vaultMainContent.style.animation = 'fadeInVault 0.8s ease forwards';
        triggerCelebration();
      }, 600);
    });
  }

  // Envelope & Love Letter Unfold
  if (envelopeCard) {
    envelopeCard.addEventListener('click', () => {
      playBookSound();
      envelopeFlap.style.transform = 'rotateX(180deg)';
      setTimeout(() => {
        envelopeCard.style.display = 'none';
        startTypewriterLoveLetter();
        showToast("💌 Original Love Letter Unfolding!", "gold", "🌹");
      }, 500);
    });
  }

  // Interactive 3D Velvet Ring Box Toggle
  window.toggleRingBoxLid = function() {
    playPopSound();
    const ringBox = document.getElementById('proposalRingBox');
    if (ringBox) {
      ringBox.classList.toggle('open');
      if (ringBox.classList.contains('open')) {
        playRoseBloomSound();
        showToast("💎 3D Velvet Ring Box Opened! Pure 24K Diamond Revealed!", "gold", "👑");
      }
    }
  };

  // Proposal YES Button Handler & Certificate of Eternity Reveal
  window.handleProposalYes = function(e) {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }

    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        const ctx = new AudioCtx();
        ctx.resume();
      }
    } catch (err) {}

    playRoseBloomSound();
    playBookSound();

    const ringBox = document.getElementById('proposalRingBox');
    if (ringBox) {
      ringBox.classList.add('open');
      ringBox.style.transform = 'scale(1.2) rotate(360deg)';
      ringBox.style.boxShadow = '0 0 50px rgba(245, 215, 150, 0.9)';
    }

    const cert = document.getElementById('eternityCertificate');
    if (cert) {
      cert.style.display = 'block';
    }

    const btnText = document.getElementById('proposalBtnText');
    if (btnText) {
      btnText.innerText = 'FOREVER YOURS 💖👑 (ACCEPTED!)';
    }

    // Always trigger built-in HTML5 canvas fireworks celebration
    triggerCelebration();
    setTimeout(triggerCelebration, 400);
    setTimeout(triggerCelebration, 800);

    // Also trigger CDN confetti if available
    if (typeof confetti === 'function') {
      try {
        confetti({
          particleCount: 160,
          spread: 100,
          origin: { y: 0.6 },
          colors: ['#f5d796', '#c41e3a', '#ff75a0', '#ffffff', '#7c3e59']
        });

        setTimeout(() => {
          confetti({
            particleCount: 100,
            angle: 60,
            spread: 60,
            origin: { x: 0 },
            colors: ['#f5d796', '#c41e3a', '#ff75a0']
          });
          confetti({
            particleCount: 100,
            angle: 120,
            spread: 60,
            origin: { x: 1 },
            colors: ['#f5d796', '#c41e3a', '#ff75a0']
          });
        }, 300);
      } catch (err) {}
    }

    showToast("💍 SHE SAID YES! 700-Year Certificate of Eternity Issued!", "gold", "👑");
  };

  const proposalYesBtn = document.getElementById('proposalYesBtn');
  if (proposalYesBtn) {
    proposalYesBtn.addEventListener('click', window.handleProposalYes);
  }

  // Interactive Timeline Quote Highlighting
  document.querySelectorAll('.timeline-bubble').forEach(bubble => {
    bubble.addEventListener('click', () => {
      playPopSound();
      bubble.classList.toggle('highlighted');
      const quoteText = bubble.innerText.replace(/"/g, '');
      showToast(`💬 Highlighted quote: "${quoteText.substring(0, 35)}..."`, 'gold', '✨');
    });
  });

  // Mauve Shade Selector Interactive Easter Egg
  function setMauveShade(colorHex, name) {
    playPopSound();
    document.querySelectorAll('.shade-btn').forEach(btn => btn.classList.remove('active'));
    if (name === 'Mauve Rose') shadeMauveRoseBtn.classList.add('active');
    if (name === 'Deep Mauve Berry') shadeMauveBerryBtn.classList.add('active');
    if (name === 'Royal Crimson') shadeRoyalCrimsonBtn.classList.add('active');

    secretVaultModal.style.boxShadow = `inset 0 0 60px ${colorHex}`;
    showToast(`💄 Switched ambient aura to ${name} (${colorHex})!`, 'gold', '✨');
  }

  if (shadeMauveRoseBtn) shadeMauveRoseBtn.addEventListener('click', () => setMauveShade('#7C3E59', 'Mauve Rose'));
  if (shadeMauveBerryBtn) shadeMauveBerryBtn.addEventListener('click', () => setMauveShade('#521E36', 'Deep Mauve Berry'));
  if (shadeRoyalCrimsonBtn) shadeRoyalCrimsonBtn.addEventListener('click', () => setMauveShade('#9E1B32', 'Royal Crimson'));

  // Catch Floating Petals Interaction (Badge Click + Canvas Hit Testing)
  function catchPetalSuccess() {
    petalsCaught++;
    if (petalCountText) petalCountText.innerText = `${petalsCaught} Petal${petalsCaught === 1 ? '' : 's'} Caught`;
    playPopSound();
    showToast(`🌸 Caught a Rose Petal! (${petalsCaught}/5)`, "gold", "✨");
    if (petalsCaught === 5) {
      showToast("🌸 Caught 5 Rose Petals! Unlocked Secret 700-Yr Vow!", "gold", "👑");
      triggerCelebration();
    }
  }

  if (petalCounterBadge) {
    petalCounterBadge.addEventListener('click', (e) => {
      e.stopPropagation();
      catchPetalSuccess();
    });
  }

  if (secretVaultModal) {
    secretVaultModal.addEventListener('click', (e) => {
      // Don't intercept clicks on interactive buttons, proposal card, or envelope
      if (e.target.closest('button') || e.target.closest('.proposal-card-container') || e.target.closest('.envelope-3d-card') || e.target.closest('.vault-love-letter-box')) {
        return;
      }

      if (!petalsArray || petalsArray.length === 0) return;
      const clickX = e.clientX;
      const clickY = e.clientY;

      for (let i = 0; i < petalsArray.length; i++) {
        const p = petalsArray[i];
        const dist = Math.hypot(clickX - p.x, clickY - p.y);
        if (dist < 60) {
          p.y = -20;
          p.x = Math.random() * (vaultPetalCanvas ? vaultPetalCanvas.width : window.innerWidth);
          catchPetalSuccess();
          break;
        }
      }
    });
  }

  // Keyboard Shortcut 'G' or 'g' to Toggle Vault
  document.addEventListener('keydown', (e) => {
    if ((e.key === 'g' || e.key === 'G') && !['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) {
      if (secretVaultModal.classList.contains('active')) {
        closeSecretVault();
      } else {
        openSecretVault();
      }
    }
  });

  // Initialize State from URL Hash or localStorage
  loadStateFromHash();

});
