/* ==========================================================================
   HAPPY BIRTHDAY MOHIMA - ADVANCED INTERACTIVE JAVASCRIPT ENGINE
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  // 1. MOUSE TRAILING SPARKLE EFFECT
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

  // 2. MULTI-PRESET CANVAS PARTICLE RENDERER (RAIN, STARS, PETALS)
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
    constructor() {
      this.reset();
    }

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
    if (currentPreset === 'stars') currentPreset = 'rain';
    else if (currentPreset === 'rain') currentPreset = 'petals';
    else currentPreset = 'stars';

    particles.forEach(p => p.reset());
  });

  // 3. DIGITAL CLONE GPT PROMPT CHIPS
  const promptChips = document.querySelectorAll('.prompt-chip');
  const gptUrl = 'https://chatgpt.com/g/g-6a661f5e6c8481919422e7b592c9427f-vedant-singh';

  promptChips.forEach(chip => {
    chip.addEventListener('click', () => {
      const textToCopy = chip.getAttribute('data-prompt');
      navigator.clipboard.writeText(textToCopy).then(() => {
        alert(`Prompt copied: "${textToCopy}"!\nOpening Vedant's Digital Twin...`);
        window.open(gptUrl, '_blank');
      }).catch(() => {
        window.open(gptUrl, '_blank');
      });
    });
  });

  // 4. BIRTHDAY CAKE CANDLE BLOWOUT ENGINE & SMOKE PUFF ANIMATION
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
      triggerSmokePuffs();
      cakeStatus.innerHTML = '<i class="fa-solid fa-star"></i> Wish granted! 18th Birthday Candles Extinguished! 🎉';
      cakeStatus.style.color = '#ff75a0';
      triggerConfetti();
    } else {
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

  // 5. ADVANCED 3D BOOKSHELF & DUAL-PAGE READ ENGINE
  const bookModal = document.getElementById('bookModal');
  const closeBookBtn = document.getElementById('closeBookBtn');
  const bookModalTitle = document.getElementById('bookModalTitle');
  const bookModalTag = document.getElementById('bookModalTag');
  const bookModalQuote = document.getElementById('bookModalQuote');
  const bookModalContent = document.getElementById('bookModalContent');

  const bookData = {
    bookSpine1: {
      title: "Zade Meadows' Playbook 🖤",
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
    }
  };

  Object.keys(bookData).forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener('click', () => {
        const item = bookData[id];
        bookModalTitle.innerText = item.title;
        bookModalTag.innerText = item.tag;
        bookModalQuote.innerText = item.quote;
        bookModalContent.innerText = item.content;
        bookModal.classList.add('active');
      });
    }
  });

  closeBookBtn.addEventListener('click', () => bookModal.classList.remove('active'));

  // 6. INSTAGRAM DM VOICE NOTE AUDIO SIMULATOR
  const voiceNoteTrigger = document.getElementById('voiceNoteTrigger');
  const waveBars = document.getElementById('waveBars');
  let vnPlaying = false;

  voiceNoteTrigger.addEventListener('click', () => {
    vnPlaying = !vnPlaying;
    if (vnPlaying) {
      waveBars.classList.add('active');
      setTimeout(() => {
        waveBars.classList.remove('active');
        vnPlaying = false;
      }, 4000);
    } else {
      waveBars.classList.remove('active');
    }
  });

  // 7. QUIZ MINI-GAME ENGINE
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
      btnEl.classList.add('correct');
      quizScore++;
    } else {
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
  closeQuizRewardBtn.addEventListener('click', () => quizRewardModal.classList.remove('active'));

  // 8. FORTUNE WHEEL GENERATOR
  const fortuneResult = document.getElementById('fortuneResult');
  const spinFortuneBtn = document.getElementById('spinFortuneBtn');

  const fortunes = [
    "🥀 <strong>Trope: Enemies to Lovers</strong> — Zade Meadows inspects your A-Levels Physics notes and commands you to stop overthinking and go sleep!",
    "👑 <strong>Trope: Mafia Princess</strong> — You are officially crowned Supreme Executive of the Bangladesh Men-Hater Club & Dark Academia Society!",
    "☕ <strong>Trope: Fake Dating / Banter</strong> — Vedant buys you 4 cups of extra-strong black coffee and 10 fuzzy kittens for your 700th birthday!",
    "🦇 <strong>Trope: Reincarnated Vampire</strong> — Your 700-year-old soul receives a lifetime supply of dark romance paperbacks and rainy weather!",
    "🐾 <strong>Trope: Possessive Hero</strong> — Your 3 AM jungle walks in Dhaka/Hostel are now guarded by an army of fluffy kittens!",
    "🤌 <strong>Trope: Slow Burn Romance</strong> — Vedant officially admits your Hindi voice note is the cuteness winner of the entire year!"
  ];

  spinFortuneBtn.addEventListener('click', () => {
    fortuneResult.innerHTML = '🔮 <em>Consulting the 700-year-old dark romance archives...</em>';
    spinFortuneBtn.disabled = true;

    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * fortunes.length);
      fortuneResult.innerHTML = fortunes[randomIndex];
      spinFortuneBtn.disabled = false;
      triggerConfetti();
    }, 1200);
  });

  // 9. MODAL OVERLAYS (LETTER & GIFT)
  const letterModal = document.getElementById('letterModal');
  const openLetterBtn = document.getElementById('openLetterBtn');
  const closeLetterBtn = document.getElementById('closeLetterBtn');

  const giftModal = document.getElementById('giftModal');
  const unboxGiftBtn = document.getElementById('unboxGiftBtn');
  const closeGiftBtn = document.getElementById('closeGiftBtn');

  openLetterBtn.addEventListener('click', () => letterModal.classList.add('active'));
  closeLetterBtn.addEventListener('click', () => letterModal.classList.remove('active'));

  unboxGiftBtn.addEventListener('click', () => {
    giftModal.classList.add('active');
    triggerConfetti();
  });
  closeGiftBtn.addEventListener('click', () => giftModal.classList.remove('active'));

  window.addEventListener('click', (e) => {
    if (e.target === letterModal) letterModal.classList.remove('active');
    if (e.target === giftModal) giftModal.classList.remove('active');
    if (e.target === bookModal) bookModal.classList.remove('active');
    if (e.target === quizRewardModal) quizRewardModal.classList.remove('active');
  });

  // 10. ADVANCED ROMANTIC LOFI MUSIC BOX SYNTHESIZER
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
    } catch (e) {
      console.log('Audio note error:', e);
    }
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

});
