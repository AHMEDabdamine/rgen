# مولد الأبحاث التربوية المتقدم

تطبيق ويب حديث لإنشاء الأبحاث التربوية باستخدام الذكاء الاصطناعي من Google Gemini.

## طرق التشغيل

يمكنك تشغيل التطبيق بثلاث طرق مختلفة:

1. **محلياً (Local)** - للتطوير
2. **مع Docker** - للنشر والإنتاج
3. **مع Tauri** - كتطبيق سطح مكتب

---

## المتطلبات الأساسية

### للجميع:

- Node.js (إصدار 18 أو أحدث)
- npm أو yarn

### إضافية:

- **Docker**: Docker و Docker Compose
- **Tauri**: Rust وبيئة التطوير المناسبة لنظامك

---

## التشغيل المحلي (للتطوير)

### الخطوة 1: تثبيت الاعتماديات

```bash
npm install
```

### الخطوة 2: تشغيل خادم التطوير

```bash
npm run dev
```

### الخطوة 3: فتح التطبيق

افتح المتصفح على: `http://localhost:3000`

### الأوامر الأخرى:

```bash
# بناء المشروع للإنتاج
npm run build

# معاينة النسخة المبنية
npm run preview

# بناء وتشغيل في أمر واحد
npm start
```

---

## التشغيل مع Docker (للإنتاج)

### الطريقة الأسهل - Docker Compose:

```bash
# بناء وتشغيل
docker-compose up --build

# تشغيل في الخلفية
docker-compose up --build -d

# إيقاف
docker-compose down
```

### الطريقة اليدوية - Docker مباشرة:

```bash
# بناء الصورة
docker build -t research-generator .

# تشغيل الحاوية
docker run -p 3000:3000 research-generator
```

### الوصول للتطبيق:

- **محلي**: http://localhost:3000
- **شبكة**: http://your-server-ip:3000

---

## التشغيل مع Tauri (تطبيق سطح مكتب)

### تثبيت متطلبات Tauri:

**Windows:**

```bash
# تثبيت Visual Studio Build Tools
# تثبيت Rust من https://rustup.rs/
```

**macOS:**

```bash
# تثبيت Xcode Command Line Tools
xcode-select --install
# تثبيت Rust
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```

**Linux:**

```bash
# تثبيت Rust
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
# تثبيت متطلبات النظام
sudo apt update
sudo apt install libwebkit2gtk-4.0-dev \
    build-essential \
    curl \
    wget \
    libssl-dev \
    libgtk-3-dev \
    libayatana-appindicator3-dev \
    librsvg2-dev
```

### تشغيل تطبيق Tauri:

**وضع التطوير:**

```bash
npm run tauri dev
```

**بناء التطبيق:**

```bash
# بناء للنظام الحالي
npm run tauri build

# بناء لجميع الأنظمة
npm run tauri build -- --target all
```

**ملفات التطبيق المبنية:**

- **Windows**: `src-tauri/target/release/bundle/msi/`
- **macOS**: `src-tauri/target/release/bundle/macos/`
- **Linux**: `src-tauri/target/release/bundle/deb/`

---

## إعداد مفتاح API

### لجميع الطرق:

1. افتح التطبيق
2. انقر على أيقونة الإعدادات (الترس في أعلى اليمين)
3. أدخل مفتاح Google Gemini API الخاص بك
4. احفظ المفتاح

**الحصول على مفتاح API:**

1. اذهب إلى [Google AI Studio](https://aistudio.google.com/app/apikey)
2. أنشئ مفتاح API جديد
3. انسخ المفتاح وألصقه في التطبيق

---

## ملاحظات تقنية

### هيكل المشروع:

```
├── components/          # مكونات React
├── services/           # خدمات API
├── hooks/              # React Hooks مخصصة
├── src-tauri/          # كود تطبيق سطح المكتب
├── Dockerfile          # إعدادات Docker
├── docker-compose.yml  # إعدادات Docker Compose
└── types.ts           # تعريفات TypeScript
```

### التقنيات المستخدمة:

- **Frontend**: React 19 + TypeScript + Vite
- **Styling**: TailwindCSS + Dark Mode
- **AI**: Google Gemini API
- **Desktop**: Tauri + Rust
- **Containerization**: Docker + Docker Compose

---

## حل المشاكل

### مشاكل شائعة:

**المنفذ 3000 مشغول:**

```bash
# تغيير المنفذ في vite.config.ts
server: {
  port: 3001, // أو أي منفذ آخر
}
```

**مشاكل Docker:**

```bash
# تنظيف الحاويات القديمة
docker system prune -a

# إعادة بناء الصورة
docker-compose build --no-cache
```

**مشاكل Tauri:**

```bash
# تحديث الاعتماديات
npm update

# تنظيف وبناء من جديد
npm run tauri build -- --clean
```

---

## خلاصة سريعة

| الطريقة    | الاستخدام | الأمر                       |
| ---------- | --------- | --------------------------- |
| **محلي**   | تطوير     | `npm run dev`               |
| **Docker** | إنتاج     | `docker-compose up --build` |
| **Tauri**  | سطح مكتب  | `npm run tauri dev`         |

اختر الطريقة التي تناسب احتياجاتك:

- **محلي**: للتطوير والتعديل
- **Docker**: للنشر والخوادم
- **Tauri**: لتطبيق سطح مكتب مستقل
