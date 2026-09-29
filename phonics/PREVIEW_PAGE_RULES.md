---

## 📌 ৮. Printing & Height Constraint Rule

প্রিন্ট বা সেভ করার সময় টেক্সট কেটে যাওয়া রোধ করতে CSS-এ `@media print`-এর ভেতরে অবশ্যই `.page { height: auto !important; min-height: 297mm; }` রাখতে হবে।

প্রিভিউ পেজের শেষ পৃষ্ঠায় ব্যানার যুক্ত করলে মূল কন্টেন্টের ফন্ট সাইজ এবং মার্জিন ১০-২০% কমিয়ে এডজাস্ট করতে হবে যাতে এটি ১টি একক A4 পাতার নির্দিষ্ট ফ্রেমে আটকে না থেকে নিচে কেটে না যায়।

### কেন `height: auto` দরকার:
স্ক্রিনে `.page { height: 297mm; overflow: hidden; }` দিলে কন্টেন্ট বাড়লে নিচের অংশ কেটে যায় (বিশেষত ব্যানারের ফোন নম্বর)। প্রিন্ট/PDF মোডে `height: auto` + `overflow: visible` দিলে কোনো লাইন কাটা যায় না — পেজ প্রয়োজনে সামান্য বেড়ে গেলেও PDF ঠিকঠাক রেন্ডার হয়।

```css
@media print {
  body { background: none; padding: 0; margin: 0; }
  .no-print, .pdf-btn, .btn-download { display: none !important; }
  .page {
    height: auto !important;      /* prevents text clipping in print mode */
    max-height: none !important;
    min-height: 297mm;
    overflow: visible !important;
    margin: 0 !important;
    border: none !important;
    box-shadow: none !important;
    page-break-after: always;
    page-break-inside: avoid;
  }
  .page:last-of-type { page-break-after: auto; }   /* no trailing blank sheet */
  .promo-banner, .pkg-item, .banner-title span, .word-card {
    -webkit-print-color-adjust: exact; print-color-adjust: exact;
  }
}
```

### ⚠️ সতর্কতা: `:nth-child` দিয়ে পেজ টার্গেট করবেন না
`<body>`-র প্রথম সন্তান `.no-print` ডিভ, তাই প্রথম ৩টি পেজ হলো `:nth-child(2)`, `(3)`, `(4)`।
`.page:nth-child(3)` ব্যবহার করলে ভুলে **Page 02** টার্গেট হবে। সবসময় একটি ডেডিকেটেড ক্লাস (যেমন `.promo-host`) ব্যবহার করুন:

```css
/* সঠিক উপায় — Page 3 কন্টেইনারে ক্লাস বসিয়ে স্কোপ করা */
.page.promo-host { padding: 6mm 10mm !important; }
.page.promo-host .rule-box { padding: 4px 8px !important; margin-bottom: 6px !important; font-size: 12.5px !important; }
.page.promo-host .word-card { padding: 2px 4px !important; }
.page.promo-host .practice-section { padding: 6px 10px !important; margin-bottom: 6px !important; }
.page.promo-host .practice-section ol li { margin-bottom: 2px !important; font-size: 13.5px !important; }
.page.promo-host .summary-box { padding: 4px 8px !important; margin-bottom: 6px !important; font-size: 12px !important; }
```

### ব্যানারে ইনলাইন স্টাইল কেন:
`.promo-banner`-এর কোনো একটি স্টাইল রুল ভুলে গেলেও যেন ফোন নম্বর না হারায়, তাই ব্যানারের স্ট্রাকচার ও স্টাইল দুটোই **ইনলাইন** রাখা হয় (`style="..."`) — কোনো এক্সটার্নাল CSS রুল মুছে গেলেও ব্যানার ঠিক থাকে।

---

## 📌 ৯. স্ক্রিন vs প্রিন্ট ফিট চেক (Fit Verification)

| মোড | `.page` উচ্চতা | উদ্দেশ্য |
|------|----------------|---------|
| স্ক্রিন | `height: 297mm; overflow: hidden` | প্রিভিউতে ঠিক একটি A4 শিট দেখানো |
| প্রিন্ট/PDF | `height: auto !important; min-height: 297mm; overflow: visible` | কোনো টেক্সট কাটা না যায় |

প্রতিটি পরিবর্তনের পরে **Print Preview (Ctrl+P)** অবশ্যই চেক করুন — আগে `.page` ৩য় পেজে কতটুকু ফাঁকা জায়গা আছে সেটা মাপা হয়, তারপর সেই পেজেই `padding`/`font-size`/`margin` ১০-২০% কমিয়ে ব্যানারের জায়গা করে নিতে হয়।

---

*সর্বশেষ হালনাগাদ: SparkKids Phonetics Preview (Page 01–03 + ৯৯ টাকা অফার ব্যানার) — প্রিন্ট/PDF ফিক্সসহ*