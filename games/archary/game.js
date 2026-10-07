'use strict';

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const ui = {
  level: document.getElementById('levelValue'),
  progress: document.getElementById('levelProgress'),
  progressLabel: document.getElementById('progressLabel'),
  score: document.getElementById('scoreValue'),
  streak: document.getElementById('streakValue'),
  lives: document.getElementById('livesValue'),
  timer: document.getElementById('timerValue'),
  promptEmoji: document.getElementById('promptEmoji'),
  promptWord: document.getElementById('promptWord'),
  promptCategory: document.getElementById('promptCategory'),
  feedback: document.getElementById('gameFeedback'),
  roundAction: document.getElementById('roundAction'),
  roundMessage: document.getElementById('roundMessage'),
  roundActionButton: document.getElementById('roundActionButton'),
  gameOver: document.getElementById('gameOver'),
  finalScore: document.getElementById('finalScore'),
  finalLevel: document.getElementById('finalLevel'),
  finalStreak: document.getElementById('finalStreak')
};

const gameData = [
  { word: 'SUN', emoji: '☀️', category: 'Nature', bangla: 'সূর্য' },
  { word: 'STAR', emoji: '⭐', category: 'Space', bangla: 'তারা' },
  { word: 'CAT', emoji: '🐱', category: 'Animals', bangla: 'বিড়াল' },
  { word: 'DOG', emoji: '🐶', category: 'Animals', bangla: 'কুকুর' },
  { word: 'LION', emoji: '🦁', category: 'Animals', bangla: 'সিংহ' },
  { word: 'FISH', emoji: '🐟', category: 'Animals', bangla: 'মাছ' },
  { word: 'BIRD', emoji: '🐦', category: 'Animals', bangla: 'পাখি' },
  { word: 'FROG', emoji: '🐸', category: 'Animals', bangla: 'ব্যাঙ' },
  { word: 'BEAR', emoji: '🐻', category: 'Animals', bangla: 'ভালুক' },
  { word: 'DUCK', emoji: '🦆', category: 'Animals', bangla: 'হাঁস' },
  { word: 'APPLE', emoji: '🍎', category: 'Food', bangla: 'আপেল' },
  { word: 'BANANA', emoji: '🍌', category: 'Food', bangla: 'কলা' },
  { word: 'PIZZA', emoji: '🍕', category: 'Food', bangla: 'পিজ্জা' },
  { word: 'MILK', emoji: '🥛', category: 'Food', bangla: 'দুধ' },
  { word: 'CAKE', emoji: '🍰', category: 'Food', bangla: 'কেক' },
  { word: 'CAR', emoji: '🚗', category: 'Objects', bangla: 'গাড়ি' },
  { word: 'BUS', emoji: '🚌', category: 'Objects', bangla: 'বাস' },
  { word: 'BOAT', emoji: '⛵', category: 'Objects', bangla: 'নৌকা' },
  { word: 'BOOK', emoji: '📖', category: 'Objects', bangla: 'বই' },
  { word: 'BALL', emoji: '⚽', category: 'Objects', bangla: 'বল' }
];

const levelSettings = [
  { targets: 2, seconds: 5, maxLetters: 4, drift: 0, speed: 0 },
  { targets: 3, seconds: 4, maxLetters: 5, drift: 4, speed: 0.8 },
  { targets: 4, seconds: 3, maxLetters: 6, drift: 8, speed: 1.7 }
];

const slingBase = { x: 105, y: 300 };
const ball = {
  x: slingBase.x,
  y: slingBase.y,
  vx: 0,
  vy: 0,
  radius: 25,
  isDragging: false,
  isFlying: false
};

let currentLevel = 1;
let highestLevel = 1;
let score = 0;
let lives = 3;
let streak = 0;
let bestStreak = 0;
let correctHitsInLevel = 0;
let targetObj = null;
let targets = [];
let roundStartedAt = 0;
let lastTimerValue = -1;
let animationFrame = 0;
let gameRunning = false;
let roundState = 'playing';
let roundPausedAt = 0;
let lastWord = '';
let audioContext = null;
const retryQueue = [];

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function getLevelWords(level) {
  const maxLetters = levelSettings[level - 1].maxLetters;
  const minLetters = level === 1 ? 3 : level === 2 ? 4 : 5;
  return gameData.filter(item => item.word.length >= minLetters && item.word.length <= maxLetters);
}

function pickTarget(words) {
  const choices = words.length > 1 ? words.filter(item => item.word !== lastWord) : words;
  const picked = choices[Math.floor(Math.random() * choices.length)];
  lastWord = picked.word;
  return picked;
}

function updateHud() {
  ui.level.textContent = String(currentLevel);
  ui.score.textContent = String(score);
  const multiplier = Math.min(3, Math.floor(streak / 3) + 1);
  ui.streak.textContent = `${streak} (${multiplier}×)`;
  ui.lives.replaceChildren();
  for (let index = 0; index < 3; index += 1) {
    const heart = document.createElement('span');
    const alive = index < lives;
    heart.className = `life-heart ${alive ? 'is-alive' : 'is-lost'}`;
    heart.textContent = alive ? '❤️' : '🖤';
    heart.setAttribute('aria-hidden', 'true');
    ui.lives.appendChild(heart);
  }
  ui.lives.setAttribute('aria-label', `${lives} of 3 lives remaining`);
  const filledStars = currentLevel === levelSettings.length ? 5 : correctHitsInLevel;
  ui.progress.querySelectorAll('.progress-star').forEach((star, index) => {
    star.classList.toggle('is-filled', index < filledStars);
  });
  ui.progress.setAttribute(
    'aria-label',
    currentLevel === levelSettings.length
      ? `Level ${currentLevel}, maximum level reached`
      : `${correctHitsInLevel} of 5 hits to level up`
  );
  ui.progressLabel.textContent = currentLevel === levelSettings.length
    ? 'Max Level!'
    : `${correctHitsInLevel} / 5 Hits to Level Up`;
}

function resetBall() {
  ball.x = slingBase.x;
  ball.y = slingBase.y;
  ball.vx = 0;
  ball.vy = 0;
  ball.isDragging = false;
  ball.isFlying = false;
}

function startRound(now) {
  if (!gameRunning) return;

  const settings = levelSettings[currentLevel - 1];
  const eligibleWords = getLevelWords(currentLevel);
  let retryTarget = null;
  retryQueue.forEach(entry => { entry.turnsUntil -= 1; });
  const readyRetry = retryQueue.findIndex(entry => entry.turnsUntil <= 0);
  if (readyRetry !== -1) {
    retryTarget = retryQueue.splice(readyRetry, 1)[0].item;
  }
  targetObj = retryTarget || pickTarget(eligibleWords);
  ui.promptEmoji.textContent = targetObj.emoji;
  ui.promptWord.textContent = targetObj.word;
  ui.promptCategory.textContent = `${targetObj.category} • ${targetObj.bangla}`;
  roundStartedAt = now;
  roundPausedAt = 0;
  roundState = 'playing';
  lastTimerValue = -1;
  ui.timer.textContent = `${settings.seconds}s`;
  resetBall();
  ui.roundAction.hidden = true;
  ui.roundAction.classList.remove('is-success', 'is-miss');

  let distractorPool = gameData.filter(item => item.word !== targetObj.word);
  if (distractorPool.length < settings.targets - 1) {
    distractorPool = distractorPool.concat(eligibleWords.filter(item =>
      item.word !== targetObj.word && !distractorPool.some(candidate => candidate.word === item.word)
    ));
  }
  const distractors = shuffleArray(distractorPool).slice(0, settings.targets - 1);
  const choices = shuffleArray([targetObj, ...distractors]);
  const rowHeight = 400 / (choices.length + 1);

  targets = choices.map((item, index) => ({
    x: 445,
    y: rowHeight * (index + 1) - 32,
    width: 205,
    height: 64,
    data: item,
    phase: Math.random() * Math.PI * 2,
    hit: false
  }));

  speakText(`Shoot ${targetObj.word}`);
}

function getCanvasPoint(pointer) {
  const rect = canvas.getBoundingClientRect();
  return {
    x: (pointer.clientX - rect.left) * (canvas.width / rect.width),
    y: (pointer.clientY - rect.top) * (canvas.height / rect.height)
  };
}

function getTargetRect(target, now) {
  const settings = levelSettings[currentLevel - 1];
  const sway = settings.drift
    ? Math.sin(now / 380 * settings.speed + target.phase) * settings.drift
    : 0;
  return { x: target.x, y: target.y + sway, width: target.width, height: target.height };
}

function startDrag(pointer) {
  if (!gameRunning || ball.isFlying) return;
  const point = getCanvasPoint(pointer);
  if (Math.hypot(point.x - ball.x, point.y - ball.y) < 45) {
    ball.isDragging = true;
    canvas.setPointerCapture(pointer.pointerId);
  }
}

function drag(pointer) {
  if (!ball.isDragging) return;
  const point = getCanvasPoint(pointer);
  let x = point.x;
  let y = point.y;
  const dist = Math.hypot(x - slingBase.x, y - slingBase.y);
  const maxStretch = 80;

  if (dist > maxStretch) {
    const angle = Math.atan2(y - slingBase.y, x - slingBase.x);
    x = slingBase.x + Math.cos(angle) * maxStretch;
    y = slingBase.y + Math.sin(angle) * maxStretch;
  }
  ball.x = x;
  ball.y = y;
}

function release() {
  if (!gameRunning || !ball.isDragging) return;
  ball.isDragging = false;
  ball.isFlying = true;
  ball.vx = (slingBase.x - ball.x) * 0.22;
  ball.vy = (slingBase.y - ball.y) * 0.22;
  playLaunchSound();
}

canvas.addEventListener('pointerdown', startDrag);
canvas.addEventListener('pointermove', drag);
canvas.addEventListener('pointerup', release);
canvas.addEventListener('pointercancel', release);

function update(now) {
  if (roundState !== 'playing') return;
  const settings = levelSettings[currentLevel - 1];
  const remaining = Math.max(0, settings.seconds - (now - roundStartedAt) / 1000);
  const shownTime = Math.ceil(remaining - 0.001);
  if (shownTime !== lastTimerValue) {
    ui.timer.textContent = `${shownTime}s`;
    lastTimerValue = shownTime;
  }

  if (remaining <= 0) {
    loseLife('সময় শেষ! নতুন করে চেষ্টা করো।');
    return;
  }

  if (!ball.isFlying) return;

  ball.x += ball.vx;
  ball.y += ball.vy;
  ball.vy += 0.4;

  for (const target of targets) {
    const rect = getTargetRect(target, now);
    const hit = ball.x + ball.radius > rect.x &&
      ball.x - ball.radius < rect.x + rect.width &&
      ball.y + ball.radius > rect.y &&
      ball.y - ball.radius < rect.y + rect.height;

    if (hit && !target.hit) {
      ball.isFlying = false;
      if (target.data.word === targetObj.word) {
        handleCorrectHit(target, now);
      } else {
        loseLife('ভুল লক্ষ্য! একটি হার্ট কমেছে।', targetObj);
      }
      return;
    }
  }

  if (ball.y > canvas.height || ball.x > canvas.width || ball.x < 0 || ball.y < 0) {
    loseLife('লক্ষ্য মিস হয়েছে! একটি হার্ট কমেছে।');
  }
}

function showRoundAction(state, message, buttonText, buttonClass) {
  roundState = state;
  roundPausedAt = performance.now();
  ui.roundAction.classList.toggle('is-success', state === 'success');
  ui.roundAction.classList.toggle('is-miss', state === 'miss');
  ui.roundMessage.textContent = message;
  ui.roundActionButton.textContent = buttonText;
  ui.roundActionButton.className = `round-action-button ${buttonClass}`;
  ui.roundAction.hidden = false;
  ui.roundActionButton.focus();
}

function handleCorrectHit(target, now) {
  target.hit = true;
  playHitSound();
  streak += 1;
  bestStreak = Math.max(bestStreak, streak);
  const multiplier = Math.min(3, Math.floor(streak / 3) + 1);
  const fastBonus = now - roundStartedAt < 2000 ? 5 : 0;
  const pointsEarned = (10 + fastBonus) * multiplier;
  score += pointsEarned;
  correctHitsInLevel += 1;
  updateHud();
  const bonusMessage = fastBonus ? ' দ্রুততার +৫ বোনাসসহ' : '';
  ui.feedback.textContent = `চমৎকার! +${pointsEarned} পয়েন্ট${bonusMessage}`;
  showRoundAction(
    'success',
    `🎯 GREAT MATCH: ${target.data.emoji} + ${target.data.word}! +${pointsEarned}`,
    'পরবর্তী শব্দ ➔  Next Target',
    'next-target-button'
  );
}

function queueRetry(item) {
  if (!item) return;
  const existing = retryQueue.find(entry => entry.item.word === item.word);
  if (existing) {
    existing.turnsUntil = 2;
  } else {
    retryQueue.push({ item, turnsUntil: 2 });
  }
}

function loseLife(message, failedTarget) {
  if (!gameRunning) return;
  queueRetry(failedTarget || targetObj);
  lives -= 1;
  streak = 0;
  updateHud();
  playWrongSound();
  ui.feedback.textContent = message;

  if (lives <= 0) {
    endGame();
    return;
  }
  showRoundAction(
    'miss',
    `Oops! Let's try ${targetObj.word} again soon! 💡`,
    'আবার চেষ্টা করি 🔄  Try Again',
    'try-again-button'
  );
}

function continueAfterFeedback() {
  if (!gameRunning || roundState === 'playing') return;

  if (roundState === 'success' && correctHitsInLevel >= 5 && currentLevel < levelSettings.length) {
    currentLevel += 1;
    highestLevel = Math.max(highestLevel, currentLevel);
    correctHitsInLevel = 0;
  }
  updateHud();
  startRound(performance.now());
  animationFrame = requestAnimationFrame(gameLoop);
}

function endGame() {
  gameRunning = false;
  cancelAnimationFrame(animationFrame);
  ui.finalScore.textContent = String(score);
  ui.finalLevel.textContent = String(highestLevel);
  ui.finalStreak.textContent = String(bestStreak);
  ui.gameOver.hidden = false;
  document.getElementById('playAgainButton').focus();
  speakText('Game over!');
}

function draw(now) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.strokeStyle = '#78350f';
  ctx.lineWidth = 8;
  ctx.beginPath();
  ctx.moveTo(slingBase.x, slingBase.y + 60);
  ctx.lineTo(slingBase.x, slingBase.y);
  ctx.stroke();

  if (ball.isDragging || !ball.isFlying) {
    ctx.strokeStyle = '#ef4444';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(slingBase.x, slingBase.y);
    ctx.lineTo(ball.x, ball.y);
    ctx.stroke();
  }

  ctx.font = '40px "Segoe UI Emoji"';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  if (targetObj) ctx.fillText(targetObj.emoji, ball.x, ball.y);

  targets.forEach(target => {
    if (target.hit && roundState !== 'success') return;
    const frameTime = roundState === 'playing' ? now : roundPausedAt;
    const rect = getTargetRect(target, frameTime);
    if (target.hit && roundState === 'success') {
      ctx.save();
      ctx.shadowColor = '#22c55e';
      ctx.shadowBlur = 28;
      ctx.fillStyle = '#bbf7d0';
      ctx.strokeStyle = '#16a34a';
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.roundRect(rect.x, rect.y, rect.width, rect.height, 12);
      ctx.fill();
      ctx.stroke();
      ctx.restore();
      ctx.font = '30px "Segoe UI Emoji"';
      ctx.textAlign = 'center';
      ctx.fillText(target.data.emoji, rect.x + 38, rect.y + rect.height / 2);
      ctx.fillStyle = '#14532d';
      ctx.font = 'bold 20px "Segoe UI", sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText(target.data.word, rect.x + 72, rect.y + rect.height / 2 + 2);
      ctx.textAlign = 'center';
      return;
    }
    ctx.fillStyle = target.data.word === targetObj.word ? '#fde047' : '#fff7ed';
    ctx.strokeStyle = target.data.word === targetObj.word ? '#ca8a04' : '#fb923c';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.roundRect(rect.x, rect.y, rect.width, rect.height, 12);
    ctx.fill();
    ctx.stroke();

    ctx.font = '30px "Segoe UI Emoji"';
    ctx.fillText(target.data.emoji, rect.x + 38, rect.y + rect.height / 2);
    ctx.fillStyle = '#1e293b';
    ctx.font = 'bold 20px "Segoe UI", sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(target.data.word, rect.x + 72, rect.y + rect.height / 2 + 2);
    ctx.textAlign = 'center';
  });
}

function gameLoop(now) {
  if (!gameRunning) return;
  update(now);
  draw(roundState === 'playing' ? now : roundPausedAt);
  if (gameRunning) animationFrame = requestAnimationFrame(gameLoop);
}

function speakText(text) {
  if (!('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'en-US';
  utterance.rate = 0.8;
  utterance.pitch = 1.1;
  window.speechSynthesis.speak(utterance);
}

function playTone(type, frequencies, duration) {
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextClass) return;

  try {
    audioContext = audioContext || new AudioContextClass();
    if (audioContext.state === 'suspended') audioContext.resume();
    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();
    const now = audioContext.currentTime;
    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequencies[0], now);
    if (frequencies[1]) oscillator.frequency.setValueAtTime(frequencies[1], now + duration / 3);
    gain.gain.setValueAtTime(0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + duration);
    oscillator.connect(gain);
    gain.connect(audioContext.destination);
    oscillator.start(now);
    oscillator.stop(now + duration);
  } catch (error) {
    console.warn('Game sound could not be played:', error);
  }
}

function playLaunchSound() {
  playTone('sine', [200, 600], 0.15);
}

function playHitSound() {
  playTone('triangle', [523.25, 659.25], 0.3);
}

function playWrongSound() {
  playTone('sawtooth', [150], 0.25);
}

function startGame() {
  cancelAnimationFrame(animationFrame);
  currentLevel = 1;
  highestLevel = 1;
  score = 0;
  lives = 3;
  streak = 0;
  bestStreak = 0;
  correctHitsInLevel = 0;
  lastWord = '';
  retryQueue.length = 0;
  gameRunning = true;
  ui.gameOver.hidden = true;
  ui.feedback.textContent = 'টানুন, লক্ষ্য করুন, ছুড়ুন!';
  updateHud();
  startRound(performance.now());
  animationFrame = requestAnimationFrame(gameLoop);
}

document.getElementById('playAgainButton').addEventListener('click', startGame);
ui.roundActionButton.addEventListener('click', continueAfterFeedback);
startGame();
