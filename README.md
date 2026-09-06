# أنزو (Anzu)

مساعد شخصي ذكي — مهام، ملاحظات، ذاكرة شخصية، ومحادثة صوتية مع Claude.

## الميزات بهذا الإصدار (MVP)
- لوحة رئيسية: مهام اليوم + ملاحظات سريعة
- إدارة مهام كاملة (تصنيف، تاريخ استحقاق، إنجاز)
- ذاكرة شخصية: معلومات ثابتة عنك يستخدمها أنزو بالمحادثة
- محادثة مع Claude API + دعم الصوت (تكلم واستمع للرد) بالعربي والإنجليزي
- كل البيانات تُحفظ على جهازك (localStorage) — ما فيه سيرفر قاعدة بيانات بعد

## التشغيل محلياً
```bash
npm install
cp .env.example .env.local   # وحط مفتاح Claude API بداخله
npm run dev
```

## الرفع لـ GitHub

1. سوّي مستودع جديد فارغ على github.com (بدون README أو .gitignore، لأنهم موجودين هنا أصلاً)
2. بمجلد المشروع:
```bash
git init
git add .
git commit -m "Initial Anzu MVP"
git branch -M main
git remote add origin https://github.com/USERNAME/anzu.git
git push -u origin main
```
(بدّل `USERNAME` باسم حسابك، و`anzu` باسم المستودع اللي سويته)

## النشر على Vercel (مجاني)

1. روح إلى vercel.com وسجّل دخول بحساب GitHub
2. اضغط **Add New → Project**، واختر مستودع `anzu`
3. Vercel يكتشف تلقائياً أنه مشروع Vite — خله الإعدادات الافتراضية
4. قبل الضغط على Deploy، افتح **Environment Variables** وأضف:
   - **Name:** `ANTHROPIC_API_KEY`
   - **Value:** مفتاحك من console.anthropic.com (يبدأ بـ `sk-ant-...`)
5. اضغط **Deploy** — بعد دقيقة أو دقيقتين يصير موقعك شغّال على رابط مثل `anzu.vercel.app`

بعد أي تعديل جديد بالكود، بس تسوي `git push`، Vercel ينشر النسخة الجديدة تلقائياً.

## هيكل المشروع
```
anzu/
├── api/chat.js          ← دالة سيرفرية تتواصل مع Claude (المفتاح محمي هنا فقط)
├── src/
│   ├── components/      ← Dashboard, Tasks, Chat, Memory, Sidebar
│   ├── lib/
│   │   ├── storage.js   ← حفظ البيانات محلياً
│   │   └── speech.js    ← التعرف على الصوت وقراءته
│   ├── App.jsx
│   └── index.css
└── index.html
```

## خطوات لاحقة مقترحة
- ربط قاعدة بيانات حقيقية (مثل Supabase أو Postgres) بدل localStorage عشان تدخل من أي جهاز
- إضافة موديول خاص بقناة "شوي معرفة" (أفكار محتوى، سكربتات)
- ربط مزود AI ثاني (OpenAI) كخيار إضافي بجانب Claude
