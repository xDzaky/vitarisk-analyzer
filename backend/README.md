# Backend

Folder ini berisi backend Express yang dipakai sebagai gateway antara frontend dan service ML. Tugas utamanya menangani autentikasi, meneruskan request prediksi ke ML, memberi rekomendasi sederhana, dan mencari fasilitas kesehatan terdekat.

## Menjalankan lokal

```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

Secara default backend berjalan di `http://localhost:3000`.

## Konfigurasi

Contoh isi `.env`:

```bash
PORT=3000
NODE_ENV=development
FLASK_URL=http://localhost:5001
GOOGLE_CLIENT_ID=xxx.apps.googleusercontent.com
JWT_SECRET=isi-secret-kamu
JWT_EXPIRES_IN=7d
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
ALLOW_DEV_LOGIN=true
```

Catatan:
- `FLASK_URL` diarahkan ke service ML.
- `GOOGLE_CLIENT_ID` dipakai untuk verifikasi login Google.
- `ALLOW_DEV_LOGIN=true` bisa dipakai saat testing kalau OAuth belum siap.

## Endpoint utama

### Auth

- `GET /api/auth/config`
- `POST /api/auth/google`
- `POST /api/auth/dev-login`
- `GET /api/auth/me`
- `POST /api/auth/logout`

Contoh body untuk login Google:

```json
{
  "credential": "google-jwt-token"
}
```

### Prediksi

Backend hanya meneruskan payload ke service ML:

- `POST /api/predict/heart`
- `POST /api/predict/diabetes`
- `POST /api/predict/cholesterol`

### Endpoint lain

- `POST /api/recommendations`
- `GET /api/hospitals?lat=-6.2088&lng=106.8456&radius=5000`

## Cek cepat

```bash
curl http://localhost:3000/health

curl -X POST http://localhost:3000/api/auth/dev-login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","name":"Test"}'

curl -X POST http://localhost:3000/api/predict/heart \
  -H "Content-Type: application/json" \
  -d '{"age":45,"sex":"laki-laki","cp":"nyeri ringan","trestbps":130,"chol":250,"fbs":"tidak","thalach":150,"exang":"tidak","family_history":"ya","smoking":"tidak"}'
```

## Menjalankan bersama ML

Terminal 1:

```bash
cd ml
source venv/bin/activate
python -m api.app
```

Terminal 2:

```bash
cd backend
npm run dev
```
