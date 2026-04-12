# VitaRisk Analyzer

VitaRisk Analyzer adalah aplikasi web untuk membantu pengguna melakukan prediksi risiko awal penyakit jantung, diabetes, dan kolesterol. Aplikasi ini dibuat sebagai proyek capstone Coding Camp 2026 dengan fokus pada edukasi kesehatan, prediksi berbasis Machine Learning, chatbot kesehatan, dan riwayat pemeriksaan per akun.

## Fitur Utama

- Prediksi risiko penyakit jantung, diabetes, dan kolesterol
- Riwayat cek kesehatan per akun
- Login dengan Google
- Chatbot kesehatan berbasis knowledge base dan API backend
- Rekomendasi pencegahan berdasarkan hasil prediksi
- Rekomendasi rumah sakit terdekat

## Struktur Proyek

```text
vitarisk-analyzer/
├── backend/   # Express API, auth, history, chatbot, proxy ke ML
├── frontend/  # React + Vite user interface
├── ml/        # Flask ML service + training scripts + model files
└── docs/      # Dokumen proyek
```

## Teknologi yang Digunakan

- Frontend: React, Vite, Tailwind CSS
- Backend: Node.js, Express
- Database: PostgreSQL / Neon
- Machine Learning Service: Python, Flask, scikit-learn
- Deployment:
  - Frontend: Vercel (`https://vitarisk-analyzer.vercel.app/`)
  - Backend: Vercel / platform Node.js lain
  - ML Service: Hugging Face Spaces

## Template Environment

Repository ini sudah menyertakan template environment berikut:

- `backend/.env.example`
- `frontend/.env.example`
- `ml/.env.example`

Jangan commit file `.env` yang berisi kredensial asli. Copy dari `.env.example`, lalu isi sesuai kebutuhan environment kamu.

## Setup Environment

### 1. Clone repository

```bash
git clone https://github.com/xDzaky/vitarisk-analyzer.git
cd vitarisk-analyzer
```

### 2. Setup backend

```bash
cd backend
cp .env.example .env
npm install
```

Isi minimal file `backend/.env`:

```env
PORT=3000
NODE_ENV=development
FLASK_URL=http://localhost:5001
DATABASE_URL=postgresql://username:password@host:5432/dbname?sslmode=require
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
JWT_SECRET=your-random-secret
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
OPENROUTER_API_KEY=your_openrouter_api_key
```

### 3. Setup frontend

```bash
cd ../frontend
cp .env.example .env
npm install
```

Isi `frontend/.env`:

```env
VITE_API_BASE_URL=http://localhost:3000/api
VITE_GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
```

### 4. Setup ML service

Disarankan memakai Python 3.11.

```bash
cd ../ml
cp .env.example .env
python3.11 -m venv venv
source venv/bin/activate
python -m pip install --upgrade pip
python -m pip install -r requirements.txt
```

Kalau kamu memakai fish shell, aktifkan virtual environment dengan:

```fish
source venv/bin/activate.fish
```

## Tautan Model ML

Model Machine Learning lokal sudah disertakan di folder:

- `ml/models`

Versi service ML yang sudah dideploy dapat diakses di:

- `https://xdzaky-vitarisk-ml.hf.space`

Health check ML:

- `https://xdzaky-vitarisk-ml.hf.space/health`

Kalau ingin menjalankan backend menggunakan model yang sudah dideploy, ubah `FLASK_URL` di backend menjadi:

```env
FLASK_URL=https://xdzaky-vitarisk-ml.hf.space
```

## Cara Menjalankan Aplikasi

Versi frontend yang sudah dideploy dapat diakses di:

- `https://vitarisk-analyzer.vercel.app/`

Jalankan tiap service di terminal terpisah.

### Menjalankan backend

```bash
cd backend
npm run dev
```

Backend aktif di:

- `http://localhost:3000`

### Menjalankan frontend

```bash
cd frontend
npm run dev
```

Frontend aktif di:

- `http://localhost:5173`

### Menjalankan ML service

```bash
cd ml
source venv/bin/activate
python -m api.app
```

ML service aktif di:

- `http://localhost:5001`

## Alur Menjalankan Secara Lokal

1. Nyalakan ML service di folder `ml`
2. Nyalakan backend di folder `backend`
3. Nyalakan frontend di folder `frontend`
4. Buka `http://localhost:5173`
5. Lakukan login, cek penyakit, lalu lihat hasil dan riwayat

## Dataset dan Training

Kode pelatihan model tersedia di folder `ml`, misalnya:

- `ml/train_heart.py`
- `ml/train_diabetes.py`
- `ml/train_cholesterol.py`

Dependensi ML tersedia di:

- `ml/requirements.txt`

Dependensi frontend dan backend tersedia di:

- `frontend/package.json`
- `backend/package.json`

## Catatan Tambahan

- Hasil prediksi pada aplikasi ini adalah prediksi risiko awal, bukan diagnosis medis final.
- Untuk deployment production, pastikan `ALLOWED_ORIGINS`, `DATABASE_URL`, `JWT_SECRET`, dan `GOOGLE_CLIENT_ID` sudah diisi dengan benar.
- Jika backend production membatasi CORS untuk local development, gunakan backend local saat proses development.
