// Arabic Alphabet (28 letters, ا to ي) - SparkKids
// Each Arabic letter maps to its Bengali pronunciation name (no emojis).
const arabicMeta = {
  'ا': { name: 'আলিফ' }, 'ب': { name: 'বা' }, 'ت': { name: 'তা' }, 'ث': { name: 'ছা' },
  'ج': { name: 'জীম' }, 'ح': { name: 'হা' }, 'خ': { name: 'খা' }, 'د': { name: 'দাল' },
  'ذ': { name: 'যাল' }, 'ر': { name: 'রা' }, 'ز': { name: 'ঝা' }, 'س': { name: 'সীন' },
  'ش': { name: 'শীন' }, 'ص': { name: 'সোয়াদ' }, 'ض': { name: 'দোয়াদ' }, 'ط': { name: 'তোয়া' },
  'ظ': { name: 'যোয়া' }, 'ع': { name: 'আইন' }, 'غ': { name: 'গাইন' }, 'ف': { name: 'ফা' },
  'ق': { name: 'ক্বাফ' }, 'ك': { name: 'কাফ' }, 'ل': { name: 'লাম' }, 'م': { name: 'মীম' },
  'ن': { name: 'নূন' }, 'ه': { name: 'গোল হা' }, 'و': { name: 'ওয়াও' }, 'ي': { name: 'ইয়া' }
};

// Arabic groups: 28 letters in 4-column pages (RTL: first letter renders top-right).
const arabicGroups = [
  ['ا', 'ب', 'ت', 'ث'],
  ['ج', 'ح', 'خ', 'د'],
  ['ذ', 'ر', 'ز', 'س'],
  ['ش', 'ص', 'ض', 'ط'],
  ['ظ', 'ع', 'غ', 'ف'],
  ['ق', 'ك', 'ل', 'م'],
  ['ن', 'ه', 'و', 'ي']
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
      <table class="practice-grid" dir="rtl">
        <thead><tr>${group.map(char => `<th style="width: ${colWidth}%;">হরফ '${char}'</th>`).join('')}</tr></thead>
        <tbody>
          <tr class="guide-row">${group.map(char => `<td>${char}</td>`).join('')}</tr>
          <tr class="word-row">${group.map(char => `<td>${arabicMeta[char] ? arabicMeta[char].name : ''}</td>`).join('')}</tr>
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
        <div class="exercise-title"><span>হরফ এক্সপ্রেস: শেখা হরফগুলো ট্রেনের বগির ভেতর লেখো!</span><span style="font-size: 11px; font-weight: normal; color: #555;">মজার অনুশীলন</span></div>
        <div class="train-container" dir="rtl"><div class="train-engine">🚂</div><div class="train-connector"></div>
  `;
  group.forEach((char, idx) => {
    const wordInfo = arabicMeta[char] ? arabicMeta[char].name : char;
    html += `<div class="train-bogie"><div class="bogie-header">${wordInfo}</div><div class="bogie-line-cell"></div><div class="bogie-wheels"><div class="wheel"></div><div class="wheel"></div></div></div>`;
    if (idx < group.length - 1) html += `<div class="train-connector"></div>`;
  });
  html += `</div></div><div class="footer">SparkKids | Arabic Handwriting Practice Series | Page ${pageNum}</div></div>`;
  container.innerHTML += html;
}

// Arabic practice pages: ا (Alif) starts top-right (RTL) through ي on the last page.
arabicGroups.forEach(renderPracticePage);