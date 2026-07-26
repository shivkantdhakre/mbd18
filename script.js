/* ==========================================================================
   HAPPY BIRTHDAY MOHIMA - ADVANCED INTERACTIVE ENGINE & WEB AUDIO SYNTH
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  // --------------------------------------------------------------------------
  // 1. WEB AUDIO API SYNTHESIZER FOR SOUND EFFECTS (SFX)
  // --------------------------------------------------------------------------
  let sfxCtx = null;

  function initSfxContext() {
    if (!sfxCtx) {
      sfxCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (sfxCtx.state === 'suspended') {
      sfxCtx.resume();
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
      gain.connect(sfxCtx.destination);
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
      gain.connect(sfxCtx.destination);
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
        gain.connect(sfxCtx.destination);
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
        gain.connect(sfxCtx.destination);
        osc.start(sfxCtx.currentTime + idx * 0.1);
        osc.stop(sfxCtx.currentTime + idx * 0.1 + 0.5);
      } catch (e) {}
    });
  }

  function playVoiceNoteAudio() {
    initSfxContext();
    if (!sfxCtx) return;
    // Synthetic romantic melody sequence simulating voice note audio
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
        gain.connect(sfxCtx.destination);

        osc.start(t);
        osc.stop(t + n.d);
        t += n.d + 0.05;
      } catch (e) {}
    });
  }

  // --------------------------------------------------------------------------
  // 2. MOUSE TRAILING SPARKLE EFFECT
  // --------------------------------------------------------------------------
  document.addEventListener('mousemove', (e) => {
    if (Math.random() < 0.25) {
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
  // 3. MULTI-PRESET CANVAS PARTICLE RENDERER (RAIN, STARS, PETALS)
  // --------------------------------------------------------------------------
  const canvas = document.getElementById('canvas-bg');
  const ctx = canvas.getContext('2d');
  let width = canvas.width = window.innerWidth;
  let height = canvas.height = window.innerHeight;

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  let currentPreset = 'stars';
  const particles = [];
  const particleCount = 80;

  class Particle {
    constructor() { this.reset(); }

    reset() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.size = Math.random() * 2.5 + 1;
      this.speedY = Math.random() * 1.5 + 0.5;
      this.speedX = (Math.random() - 0.5) * 0.4;
      this.opacity = Math.random() * 0.7 + 0.3;
      this.color = Math.random() > 0.4 ? '#ff75a0' : '#ffd700';

      if (currentPreset === 'rain') {
        this.speedY = Math.random() * 6 + 4;
        this.speedX = -0.5;
        this.color = '#a0c4ff';
        this.size = Math.random() * 1.5 + 0.5;
      } else if (currentPreset === 'petals') {
        this.speedY = Math.random() * 1.2 + 0.4;
        this.speedX = Math.sin(Math.random() * Math.PI) * 1.2;
        this.color = '#ff75a0';
        this.size = Math.random() * 3 + 2;
      }
    }

    update() {
      this.y += this.speedY;
      this.x += this.speedX;
      if (this.y > height) {
        this.y = 0;
        this.x = Math.random() * width;
      }
    }

    draw() {
      ctx.beginPath();
      if (currentPreset === 'rain') {
        ctx.strokeStyle = this.color;
        ctx.lineWidth = this.size;
        ctx.globalAlpha = this.opacity;
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(this.x + this.speedX, this.y + 12);
        ctx.stroke();
      } else {
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.globalAlpha = this.opacity;
        ctx.shadowBlur = 10;
        ctx.shadowColor = this.color;
        ctx.fill();
      }
      ctx.globalAlpha = 1.0;
    }
  }

  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  function animateParticles() {
    ctx.clearRect(0, 0, width, height);
    particles.forEach(p => {
      p.update();
      p.draw();
    });
    requestAnimationFrame(animateParticles);
  }
  animateParticles();

  const presetBtn = document.getElementById('presetBtn');
  presetBtn.addEventListener('click', () => {
    playPopSound();
    if (currentPreset === 'stars') currentPreset = 'rain';
    else if (currentPreset === 'rain') currentPreset = 'petals';
    else currentPreset = 'stars';

    particles.forEach(p => p.reset());
  });

  // --------------------------------------------------------------------------
  // 4. ACHIEVEMENTS & BADGES SYSTEM
  // --------------------------------------------------------------------------
  const badgeToggleBtn = document.getElementById('badgeToggleBtn');
  const badgesDrawer = document.getElementById('badgesDrawer');
  const closeBadgesBtn = document.getElementById('closeBadgesBtn');
  const badgeCountPill = document.getElementById('badgeCountPill');

  const unlockedBadges = new Set(JSON.parse(localStorage.getItem('mohima_unlocked_badges') || '["badge1"]'));

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
    localStorage.setItem('mohima_unlocked_badges', JSON.stringify(Array.from(unlockedBadges)));
  }

  function unlockBadge(id) {
    if (!unlockedBadges.has(id)) {
      unlockedBadges.add(id);
      updateBadgesUI();
      playChimeSound();
    }
  }

  updateBadgesUI();

  badgeToggleBtn.addEventListener('click', () => {
    playPopSound();
    badgesDrawer.classList.toggle('active');
  });

  closeBadgesBtn.addEventListener('click', () => {
    badgesDrawer.classList.remove('active');
  });

  // --------------------------------------------------------------------------
  // 5. BIRTHDAY CAKE CANDLE BLOWOUT ENGINE
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
      triggerConfetti();
      unlockBadge('badge2');
    } else {
      playPopSound();
      cakeStatus.innerHTML = '<i class="fa-solid fa-wand-magic-sparkles"></i> Click the cake to blow out your 18th candles!';
      cakeStatus.style.color = '#ffd700';
    }
  });

  function triggerConfetti() {
    const confettiCount = 80;
    for (let i = 0; i < confettiCount; i++) {
      const conf = document.createElement('div');
      conf.style.position = 'fixed';
      conf.style.left = Math.random() * 100 + 'vw';
      conf.style.top = '-10px';
      conf.style.width = Math.random() * 10 + 6 + 'px';
      conf.style.height = Math.random() * 10 + 6 + 'px';
      conf.style.backgroundColor = ['#ff75a0', '#ffd700', '#9d4edd', '#ffffff', '#ff4500'][Math.floor(Math.random() * 5)];
      conf.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
      conf.style.zIndex = '9999';
      conf.style.pointerEvents = 'none';
      conf.style.transition = 'transform 3.2s ease-out, opacity 3.2s ease-out';
      document.body.appendChild(conf);

      setTimeout(() => {
        conf.style.transform = `translate(${(Math.random() - 0.5) * 400}px, ${window.innerHeight + 50}px) rotate(${Math.random() * 720}deg)`;
        conf.style.opacity = '0';
      }, 50);

      setTimeout(() => conf.remove(), 3400);
    }
  }

  // --------------------------------------------------------------------------
  // 6. ADVANCED 3D BOOKSHELF & DUAL-PAGE READ ENGINE + SECRET BOOK UNLOCK
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
      quote: `"Ek hi hai men hater, books lover, novel reader, crush on fictional characters waali ladki 🙂 *slow claps*"`,
      content: "Mohima has spent over 200 hours reading smut & dark romance novels without sleep!\n\nPreferred Trope: Enemies to lovers, possessive stalker heroes, and dramatic rain scenes in Dhaka."
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
    bookSpineSecret: {
      title: "THE SECRET 18TH CHAPTER 👑",
      tag: "CHAPTER VII • FOREVER & ALWAYS",
      quote: `"You are my favorite mess, and I'm all yours 😚"`,
      content: "Congratulations on unlocking the secret chapter!\n\n700 years of soul connections, 48,640+ Instagram messages, and infinite banter across India & Bangladesh.\n\nHappy 18th Birthday Mohima, my pretty princess! 🖤✨"
    }
  };

  function unlockSecretBook() {
    if (!secretBookUnlocked && bookSpineSecret) {
      secretBookUnlocked = true;
      bookSpineSecret.classList.remove('locked');
      bookSpineSecret.querySelector('.spine-title').innerText = "THE SECRET 18TH CHAPTER 👑";
      triggerConfetti();
      playFanfareSound();
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
    bookModal.classList.remove('active');
  });

  // --------------------------------------------------------------------------
  // 7. LIVE INSTAGRAM DM CHAT SIMULATOR & VOICE NOTE SFX
  // --------------------------------------------------------------------------
  const voiceNoteTrigger = document.getElementById('voiceNoteTrigger');
  const dmChatBody = document.getElementById('dmChatBody');
  const dmInputField = document.getElementById('dmInputField');
  const dmInputForm = document.getElementById('dmInputForm');
  const typingIndicator = document.getElementById('typingIndicator');
  const starterChips = document.querySelectorAll('.starter-chip');

  voiceNoteTrigger.addEventListener('click', () => {
    playVoiceNoteAudio();
    alert("🎵 Playing Mohima's Hindi Voice Note (0:14)...\n\"Listen to my voice note 🙈 Also I'm not studying Rotational Motion today! 😭\"");
  });

  const vedantResponses = [
    { keywords: ['miss', 'missing'], response: "Awww miss me already? 🙈 Jaao pehle Rotational Motion complete karo, fir text karna! 💅" },
    { keywords: ['rotational', 'physics', 'study', 'exam', 'hate'], response: "Padhayi nhi karoghe toh hostel ke mess main mere saath bartan dhona padhegha 😅 Jaao physics padho mohtarma!" },
    { keywords: ['aaron', 'warner', 'zade', 'christian', 'smut', 'romance', 'book'], response: "Aaron Warner fictional hai, main real hun 🤌 Stop overthinking and go get your beauty sleep!" },
    { keywords: ['birthday', '18', 'happy'], response: "Happy 18th Birthday my pretty princess! 🥳✨ Make sure not to drink 4 cups of black coffee in one go today! 🖤" },
    { keywords: ['700', 'skeleton', 'soul', 'old'], response: "700 saal purani skeleton princess ho aap, esliye 17 ki umar main dadi ammi jesi baate karti ho 🥱" },
    { keywords: ['cute', 'accent', 'voice'], response: "Ur accent is cute but ngl ur hindi voice is even cuter 🤌 Ab zyaada sharmaao mat!" }
  ];

  function getVedantResponse(text) {
    const lower = text.toLowerCase();
    for (let item of vedantResponses) {
      if (item.keywords.some(k => lower.includes(k))) {
        return item.response;
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
  // 8. 3D VINTAGE POLAROID MEMORY LIGHTBOX MODAL
  // --------------------------------------------------------------------------
  const polaroidCards = document.querySelectorAll('.polaroid-card');
  const polaroidModal = document.getElementById('polaroidModal');
  const closePolaroidBtn = document.getElementById('closePolaroidBtn');
  const polaroidModalImg = document.getElementById('polaroidModalImg');
  const polaroidModalTitle = document.getElementById('polaroidModalTitle');
  const polaroidModalNote = document.getElementById('polaroidModalNote');

  polaroidCards.forEach(card => {
    card.addEventListener('click', () => {
      playBookSound();
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
    polaroidModal.classList.remove('active');
  });

  // --------------------------------------------------------------------------
  // 9. QUIZ MINI-GAME ENGINE
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
          triggerConfetti();
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
  // 10. FORTUNE WHEEL GENERATOR
  // --------------------------------------------------------------------------
  const fortuneResult = document.getElementById('fortuneResult');
  const spinFortuneBtn = document.getElementById('spinFortuneBtn');

  const fortunes = [
    "🥀 <strong>Trope: Enemies to Lovers</strong> — Aaron Warner inspects your A-Levels Physics notes and commands you to stop overthinking and go sleep!",
    "👑 <strong>Trope: Mafia Princess</strong> — You are officially crowned Supreme Executive of the Bangladesh Men-Hater Club & Dark Academia Society!",
    "☕ <strong>Trope: Fake Dating / Banter</strong> — Vedant buys you 4 cups of extra-strong black coffee and 10 fuzzy kittens for your 700th birthday!",
    "🦇 <strong>Trope: Reincarnated Vampire</strong> — Your 700-year-old soul receives a lifetime supply of dark romance paperbacks and rainy weather!",
    "🐾 <strong>Trope: Possessive Hero</strong> — Your 3 AM jungle walks in Dhaka/Hostel are now guarded by an army of fluffy kittens!",
    "🤌 <strong>Trope: Slow Burn Romance</strong> — Vedant officially admits your Hindi voice note is the cuteness winner of the entire year!"
  ];

  spinFortuneBtn.addEventListener('click', () => {
    playPopSound();
    fortuneResult.innerHTML = '🔮 <em>Consulting the 700-year-old dark romance archives...</em>';
    spinFortuneBtn.disabled = true;

    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * fortunes.length);
      fortuneResult.innerHTML = fortunes[randomIndex];
      spinFortuneBtn.disabled = false;
      triggerConfetti();
      playFanfareSound();
    }, 1200);
  });

  // --------------------------------------------------------------------------
  // 11. LIVE BIRTHDAY TICKING COUNTER (JULY 27 - INDIAN TIME UTC+5:30)
  // --------------------------------------------------------------------------
  const clockDays = document.getElementById('clockDays');
  const clockHours = document.getElementById('clockHours');
  const clockMinutes = document.getElementById('clockMinutes');
  const clockSeconds = document.getElementById('clockSeconds');
  const clockTitle = document.getElementById('clockTitle');

  // July 27 00:00:00 Indian Standard Time (UTC+5:30)
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
  // 12. KEYBOARD EASTER EGGS ('18' or '700')
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
      triggerConfetti();
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
  // 13. MODAL OVERLAYS (LETTER & GIFT)
  // --------------------------------------------------------------------------
  const letterModal = document.getElementById('letterModal');
  const openLetterBtn = document.getElementById('openLetterBtn');
  const closeLetterBtn = document.getElementById('closeLetterBtn');

  const giftModal = document.getElementById('giftModal');
  const unboxGiftBtn = document.getElementById('unboxGiftBtn');
  const closeGiftBtn = document.getElementById('closeGiftBtn');

  openLetterBtn.addEventListener('click', () => {
    playBookSound();
    letterModal.classList.add('active');
  });
  closeLetterBtn.addEventListener('click', () => {
    playPopSound();
    letterModal.classList.remove('active');
  });

  unboxGiftBtn.addEventListener('click', () => {
    playFanfareSound();
    giftModal.classList.add('active');
    triggerConfetti();
  });
  closeGiftBtn.addEventListener('click', () => {
    playPopSound();
    giftModal.classList.remove('active');
  });

  window.addEventListener('click', (e) => {
    if (e.target === letterModal) letterModal.classList.remove('active');
    if (e.target === giftModal) giftModal.classList.remove('active');
    if (e.target === bookModal) bookModal.classList.remove('active');
    if (e.target === quizRewardModal) quizRewardModal.classList.remove('active');
    if (e.target === polaroidModal) polaroidModal.classList.remove('active');
    if (e.target === easterEggModal) easterEggModal.classList.remove('active');
  });

  // --------------------------------------------------------------------------
  // 14. ADVANCED ROMANTIC LOFI MUSIC BOX SYNTHESIZER
  // --------------------------------------------------------------------------
  const musicToggleBtn = document.getElementById('musicToggleBtn');
  let audioPlaying = false;
  let audioCtx, musicTimer;

  const chords = [
    [261.63, 329.63, 392.00, 493.88], // Cmaj7
    [220.00, 261.63, 329.63, 392.00], // Am7
    [174.61, 220.00, 261.63, 329.63], // Fmaj7
    [196.00, 246.94, 293.66, 349.23]  // G7
  ];

  let currentChordIdx = 0;
  let noteStep = 0;

  function playPluckNote(freq) {
    if (!audioCtx || audioCtx.state === 'suspended') return;
    try {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

      gain.gain.setValueAtTime(0.001, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.12, audioCtx.currentTime + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 1.4);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start();
      osc.stop(audioCtx.currentTime + 1.4);
    } catch (e) {}
  }

  function startLofiLoop() {
    if (musicTimer) clearInterval(musicTimer);
    musicTimer = setInterval(() => {
      const chord = chords[currentChordIdx];
      const freq = chord[noteStep % chord.length];
      playPluckNote(freq);

      noteStep++;
      if (noteStep % chord.length === 0) {
        currentChordIdx = (currentChordIdx + 1) % chords.length;
      }
    }, 450);
  }

  musicToggleBtn.addEventListener('click', () => {
    if (!audioPlaying) {
      if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      }
      if (audioCtx.state === 'suspended') {
        audioCtx.resume();
      }

      startLofiLoop();
      musicToggleBtn.classList.add('playing');
      audioPlaying = true;
    } else {
      if (musicTimer) clearInterval(musicTimer);
      musicToggleBtn.classList.remove('playing');
      audioPlaying = false;
    }
  });

  // --------------------------------------------------------------------------
  // 15. DIGITAL TWIN PROMPT CHIPS COPY & LAUNCH HANDLER
  // --------------------------------------------------------------------------
  const promptChips = document.querySelectorAll('.prompt-chip');
  const gptUrl = 'https://chatgpt.com/g/g-6a661f5e6c8481919422e7b592c9427f-vedant-singh';

  promptChips.forEach(chip => {
    chip.addEventListener('click', () => {
      playPopSound();
      const textToCopy = chip.getAttribute('data-prompt');
      navigator.clipboard.writeText(textToCopy).then(() => {
        alert(`Prompt copied: "${textToCopy}"!\nOpening Vedant's Digital Twin...`);
        window.open(gptUrl, '_blank');
      }).catch(() => {
        window.open(gptUrl, '_blank');
      });
    });
  });

});
