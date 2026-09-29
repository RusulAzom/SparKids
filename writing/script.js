// Full Bangla Bornomala - 50 Letters - SparKids
const banglaMeta = {
  'অ': { word: '🥭 আম' }, 'আ': { word: '🍍 আনারস' }, 'ই': { word: '🐭 ইঁদুর' }, 'ঈ': { word: '🦅 ঈগল' },
  'উ': { word: '🐫 উট' }, 'ঊ': { word: '🌅 ঊষা' }, 'ঋ': { word: '🧘 ঋষি' }, 'এ': { word: '🛺 এক্কাগাড়ী' },
  'ঐ': { word: '🐘 ঐরাবত' }, 'ও': { word: '🧅 ওল' }, 'ঔ': { word: '💊 ঔষধ' },
  'ক': { word: '🍌 কলা' }, 'খ': { word: '🐰 খরগোশ' }, 'গ': { word: '🐄 গরু' }, 'ঘ': { word: '🏠 ঘর' },
  'ঙ': { word: '🐸 ব্যাঙ' }, 'চ': { word: '🌙 চাঁদ' }, 'ছ': { word: '☂️ ছাতা' }, 'জ': { word: '🚢 জাহাজ' },
  'ঝ': { word: '💧 ঝর্ণা' }, 'ঞ': { word: '👨 মিঞা' }, 'ট': { word: '🍅 টমেটো' }, 'ঠ': { word: '👄 ঠোঁট' },
  'ড': { word: '🥚 ডিম' }, 'ঢ': { word: '🥁 ঢোল' }, 'ণ': { word: '🦌 হরিণ' }, 'ত': { word: '🍉 তরমুজ' },
  'থ': { word: '🍽️ থালা' }, 'দ': { word: '🚪 দরজা' }, 'ধ': { word: '🌾 ধান' }, 'ন': { word: '⛵ নৌকা' },
  'প': { word: '🐦 পাখি' }, 'ফ': { word: '🌸 ফুল' }, 'ব': { word: '⚽ বল' }, 'ভ': { word: '🐻 ভালুক' },
  'ম': { word: '🐟 মাছ' }, 'য': { word: '🚗 যান' }, 'র': { word: '🌹 রজনী' }, 'ল': { word: '🍋 লেবু' },
  'শ': { word: '🪷 শাপলা' }, 'ষ': { word: '🐂 ষাঁড়' }, 'স': { word: '☀️ সূর্য' }, 'হ': { word: '🐘 হাতি' },
  'ড়': { word: '🚗 গাড়ি' }, 'ঢ়': { word: '🌧️ আষাঢ়' }, 'য়': { word: '🏆 বিজয়' }, 'ৎ': { word: '⚡ হঠাৎ' },
  'ং': { word: '🎨 রং' }, 'ঃ': { word: '😔 দুঃখ' }, 'ঁ': { word: '🌜 চাঁদ' }
};

const vowelGroups = [
  ['অ', 'আ', 'ই', 'ঈ'],
  ['উ', 'ঊ', 'ঋ', 'এ'],
  ['ঐ', 'ও', 'ঔ']
];

const consonantGroups = [
  ['ক', 'খ', 'গ', 'ঘ'],
  ['ঙ', 'চ', 'ছ', 'জ'],
  ['ঝ', 'ঞ', 'ট', 'ঠ'],
  ['ড', 'ঢ', 'ণ', 'ত'],
  ['থ', 'দ', 'ধ', 'ন'],
  ['প', 'ফ', 'ব', 'ভ'],
  ['ম', 'য', 'র', 'ল'],
  ['শ', 'ষ', 'স', 'হ'],
  ['ড়', 'ঢ়', 'য়', 'ৎ'],
  ['ং', 'ঃ', 'ঁ']
];

const container = document.getElementById('worksheet-container');
let pageCounter = 0;

function renderPracticePage(group) {
  pageCounter++;
  const colWidth = (100 / group.length).toFixed(2);
  const pageNum = String(pageCounter).padStart(2, '0');
  let html = `
    <div class="page">
      <table class="header-table">
        <tr>
          <td class="title" style="width: 50%;">নাম: ______________________</td>
          <td style="width: 25%; text-align: center;">তারিখ: _________</td>
          <td style="width: 25%; text-align: right;">পৃষ্ঠা: ${pageNum}</td>
        </tr>
      </table>
      <table class="practice-grid">
        <thead><tr>${group.map(char => `<th style="width: ${colWidth}%;">বর্ণ '${char}'</th>`).join('')}</tr></thead>
        <tbody>
          <tr class="guide-row">${group.map(char => `<td>${char}</td>`).join('')}</tr>
          <tr class="word-row">${group.map(char => `<td>${banglaMeta[char] ? banglaMeta[char].word : ''}</td>`).join('')}</tr>
  `;
  for (let r = 0; r < 11; r++) {
    let opacity = 1.0 - (r * 0.1);
    if (r >= 9) opacity = 0;
    html += `<tr>`;
    group.forEach(char => {
      if (opacity > 0) {
        html += `<td class="dot-cell"><div class="dual-container"><svg class="char-svg" viewBox="0 0 100 60"><text x="50" y="45" text-anchor="middle" class="dotted-text" opacity="${opacity}">${char}</text></svg><svg class="char-svg" viewBox="0 0 100 60"><text x="50" y="45" text-anchor="middle" class="dotted-text" opacity="${opacity}">${char}</text></svg></div></td>`;
      } else {
        html += `<td class="dot-cell"></td>`;
      }
    });
    html += `</tr>`;
  }
  html += `</tbody></table>
      <div class="exercise-section">
        <div class="exercise-title"><span>🚂 শব্দ এক্সপ্রেস: শেখা শব্দগুলো ট্রেনের বগির ভেতর লেখো!</span><span style="font-size: 11px; font-weight: normal; color: #555;">মজার অনুশীলন</span></div>
        <div class="train-container"><div class="train-engine">🚂</div><div class="train-connector"></div>
  `;
  group.forEach((char, idx) => {
    const wordInfo = banglaMeta[char] ? banglaMeta[char].word : char;
    html += `<div class="train-bogie"><div class="bogie-header">${wordInfo}</div><div class="bogie-line-cell"></div><div class="bogie-wheels"><div class="wheel"></div><div class="wheel"></div></div></div>`;
    if (idx < group.length - 1) html += `<div class="train-connector"></div>`;
  });
  html += `</div></div><div class="footer">SparKids | Bangla Handwriting Practice Series | Page ${pageNum}</div></div>`;
  container.innerHTML += html;
}

// 1. Vowels (স্বরবর্ণ): ends at 'ঔ' — never mixed with 'ক'
vowelGroups.forEach(renderPracticePage);

// 2. Consonants divider / cover page ("ব্যঞ্জনবর্ণ") — inserted after 'ঔ', before 'ক'
(function renderConsonantDivider() {
  const allConsonants = consonantGroups.flat();
  const gridCells = allConsonants.map(char => `<span class="divider-char">${char}</span>`).join('');
  const dividerHtml = `
    <div class="page divider-page">
      <div class="divider-inner">
        <div class="cover-badge">দ্বিতীয় অধ্যায়</div>
        <h1 class="divider-title">ব্যঞ্জনবর্ণ</h1>
        <p class="divider-subtitle">ব্যঞ্জনবর্ণ অনুশীলন &bull; ক থেকে &#x981; পর্যন্ত</p>
        <div class="divider-grid">${gridCells}</div>
        <p class="divider-note">✏️ এবার ব্যঞ্জনবর্ণগুলো দাগ টেনে লেখো ও নতুন শব্দ শেখো 🎨</p>
      </div>
      <div class="cover-footer">
        <p class="publisher-tag">Published by <span class="publisher-brand">Spar Publication | SparKids</span></p>
      </div>
    </div>`;
  container.innerHTML += dividerHtml;
})();

// 3. Consonants (ব্যঞ্জনবর্ণ): starts cleanly from 'ক'
consonantGroups.forEach(renderPracticePage);