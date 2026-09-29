# 📚 SparkKids Preview Page & Funnel System Rules

এই ফাইলটিতে **SparkKids Worksheet Series**-এর যেকোনো মডিউলের (Phonetics, Maths, Bangla, English) **Free Preview/Sample Version** তৈরি করার নিয়মাবলী বর্ণনা করা হলো।

---

## 🎯 ১. উদ্দেশ্য (Objective)
- ব্যবহারকারী বা অভিভাবকদের কন্টেন্টের কোয়ালিটি দেখানো (Teaser/Sample)।
- প্রথম ২-৩টি পেজ সম্পূর্ণ ফ্রিতে দেওয়া যাতে তারা বিশ্বাস ও আগ্রহ পায়।
- শেষ পেজে একটি আকর্ষণীয় অফার ও কন্টাক্ট নম্বর দিয়ে **৯৯ টাকার প্রিমিয়াম প্যাকেজে** রূপান্তর (Convert) করা।

---

## 📐 ২. পেজ কাউন্ট ও স্পেসিং রুলস (Page Layout Rules)

1. **সর্বোচ্চ ৩টি পেজ (Strict 3-Page Limit):**
   - প্রিভিউ ফাইলে শুধুমাত্র ৩টি পেজ থাকবে।
   - সম্পূর্ণ মডিউলটি যদি ১০-১২ পেজের হয়, বাকি পেজগুলো মূল প্রিন্ট ফাইলে থাকবে।

2. **A4 পেজ বাউন্ডারি (Single Sheet Containment):**
   - প্রতিটি পেজকে অবশ্যই `height: 297mm; width: 210mm;` মেজারমেন্ট মেনে চলতে হবে।
   - কোনো কন্টেন্ট বা ব্যানার যেন ২য় বা ৪র্থ পেজে উপচে (overflow) না পড়ে।
   - স্পেস কম পড়লে সেকশন মার্জিন ও প্যাডিং কমিয়ে (`padding: 6px - 8px`) ব্যানার ফিক্স করতে হবে।

3. **Preview পেজে কখনোই ফাঁকা জায়গা রাখা যাবে না:**
   - Page 3 সাধারণত Banner যোগ করার পরে সবচেয়ে টাইট হয়।
   - Banner বসানোর আগে Page 3-এর প্রতিটি সেকশন চেক করতে হবে যে উপরে-নিচে অতিরিক্ত `margin-bottom` নেই তো।

---

## 🎁 ৩. অফার ব্যানার স্ট্রাকচার (Offer Banner Component)

শেষ পেজের (`Page 3`) একদম নিচে `summary-box`-এর পর এই ব্যানারটি যুক্ত করতে হবে:

### HTML Structure:
```html
<div class="promo-banner">
  <div class="banner-title">
    🎁 সম্পূর্ণ [X] পেজের HD printable PDF + ৩০০+ শিক্ষণীয় PDF বই পেতে মাত্র <span>৯৯ টাকা</span> হাদিয়া পাঠ্য!
  </div>

  <div class="package-grid">
    <div class="pkg-item">১. ক্যামব্রিয়ান স্কুলের নার্সারি, প্লে ও কেজি-র সম্পূর্ণ সিলেবাস ও বই।</div>
    <div class="pkg-item">২. ব্রিটিশ কাউন্সিলের ১০০+ ওয়ার্কশিট (১০৮টি, প্লে-কেজি)।</div>
    <div class="pkg-item">৩. Scholastica সহ সেরা ইংলিশ মিডিয়ামের সিলেবাস, প্রশ্ন ও কারিকুলাম।</div>
    <div class="pkg-item">৪. দেশ সেরা ইংরেজি ও বাংলা মিডিয়ামের সহায়ক গল্পের বই ৫০+ (মোট ৩০০+ ফাইল)।</div>
  </div>

  <div class="banner-cta">
    👉 মাত্র ৯৯ টাকা হাদিয়ার বিনিময়ে সম্পূর্ণ প্যাকেজটি নিতে যোগাযোগ করুন:
    <div class="phone-no">📱 WhatsApp / Call: 01882834071</div>
  </div>
</div>
```

> ⚠️ **ফোন নম্বর কখনোই বাদ পড়বে না।** নম্বরটি `display: block` + ১৫-১৬px + `#d90429` রঙে আলাদা লাইনে বসাতে হবে, যাতে ছোট প্রিন্টেও স্পষ্ট দেখা যায়।

---

## 🎨 ৪. ব্যানার স্টাইলিং স্ট্যান্ডার্ড (CSS Guidelines)

```css
.promo-banner {
  border: 2px dashed #000;
  border-radius: 8px;
  padding: 8px 12px;
  margin-top: 8px;
  background-color: #fdfdfd;
  text-align: center;
}

.banner-title {
  font-size: 13.5px;
  font-weight: 800;
  margin-bottom: 6px;
}

.banner-title span {
  background: #000;
  color: #fff;
  padding: 1px 6px;
  border-radius: 4px;
}

.package-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4px;
  text-align: left;
  font-size: 10.5px;
  margin-bottom: 6px;
}

.pkg-item {
  background: #f0f0f0;
  padding: 4px 6px;
  border-radius: 4px;
  border: 1px solid #ddd;
}

.banner-cta {
  font-size: 12px;
  font-weight: bold;
}

.phone-no {
  font-size: 15px;
  font-weight: 800;
  color: #d90429;
  margin-top: 2px;
}

@media print {
  .promo-banner, .pkg-item, .banner-title span {
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
}
```

### Page-3 স্পেসিং টিউনিং (যখন Banner ফিট হয় না):
```css
.page.promo-host .practice-section { padding: 8px 10px; margin-bottom: 8px; }
.page.promo-host .summary-box      { margin-bottom: 8px; }
.page.promo-banner                 { padding: 8px 10px; margin-top: 6px; }
```

---

## 📁 ৫. ফাইল নামকরণ প্রক্রিয়া (Naming Convention)

মূল সম্পূর্ণ ফাইল: `[module]-all-pages.html` (যেমন: `phonics-all-pages.html`)

ফ্রিতে ডিস্ট্রিবিউট করার প্রিভিউ ফাইল: `[module]-preview.html` (যেমন: `phonics-preview.html`)

---

## 6. ✅ চেকলিস্ট (Definition of Done)

| # | চেক | স্ট্যাটাস |
|---|------|----------|
| 1 | প্রিভিউ ফাইলে ঠিক ৩টি `.page` কন্টেইনার | ☐ |
| 2 | পেজ নম্বর ০১, ০২, ০৩ (হেডার + ফুটার উভয়েই) | ☐ |
| 3 | মূল ফাইলের পেজ ৪+ কোনো কন্টেন্ট নেই | ☐ |
| 4 | `Spark Publication \| SparkKids` ব্র্যান্ডিং প্রতিটি পেজে | ☐ |
| 5 | `.promo-banner` Page 3-এ, `summary-box`-এর পরে, ফুটারের আগে | ☐ |
| 6 | ফোন নম্বর `01882834071` উপস্থিত ও `#d90429` রঙে | ☐ |
| 7 | `div` / `section` ট্যাগ ব্যালেন্সড | ☐ |
| 8 | Print Preview-এ প্রতিটি পেজ ঠিক ১টি A4 শিটে | ☐ |

---

## 7. 🧪 যাচাই (Verification) — দ্রুত চেক স্ক্রিপ্ট

```bash
node -e "const fs=require('fs');const h=fs.readFileSync('phonics/phonics-preview.html','utf8');
console.log('pages',(h.match(/<div class=\"page/g)||[]).length);
console.log('banner',(h.match(/<section class=\"promo-banner\">/g)||[]).length);
console.log('phone',h.includes('01882834071'));
console.log('divBalance',(h.match(/<div\b/g)||[]).length===(h.match(/<\/div>/g)||[]).length);"
```

---

*সর্বশেষ হালনাগাদ: SparkKids Phonetics Preview (Page 01–03 + ৯৯ টাকা অফার ব্যানার)*
