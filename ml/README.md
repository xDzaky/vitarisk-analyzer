# ML Service

Folder ini berisi service Flask untuk prediksi tiga risiko kesehatan: jantung, diabetes, dan kolesterol. Model yang dipakai disimpan di folder `ml/models`, sedangkan training script tetap disediakan kalau model perlu dibuat ulang.

## Menjalankan lokal

```bash
cd ml
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python -m api.app
```

Secara default service berjalan di `http://localhost:5001`.

## Endpoint

- `GET /health`
- `POST /predict/heart`
- `POST /predict/diabetes`
- `POST /predict/cholesterol`

## Contoh request

### Heart

```json
{
  "age": 45,
  "sex": "laki-laki",
  "cp": "nyeri ringan",
  "trestbps": 130,
  "chol": 250,
  "fbs": "tidak",
  "thalach": 150,
  "exang": "tidak",
  "family_history": "ya",
  "smoking": "tidak"
}
```

### Diabetes

```json
{
  "age": 35,
  "sex": "perempuan",
  "glucose": 110,
  "blood_pressure": 72,
  "bmi": 25.5,
  "family_history": "tidak",
  "diet_sweet": "jarang",
  "exercise_freq": "3x seminggu"
}
```

Kalau `bmi` tidak dikirim, service juga bisa menerima `weight_kg` dan `height_cm`.

### Cholesterol

```json
{
  "age": 40,
  "sex": "laki-laki",
  "trestbps": 125,
  "diet_fat": "3-5x seminggu",
  "exercise_freq": "jarang",
  "smoking": "kadang-kadang",
  "family_history": "ya"
}
```

## Format response

Semua endpoint prediksi mengembalikan format umum seperti ini:

```json
{
  "disease": "Penyakit Jantung",
  "risk_percent": 42.5,
  "risk_level": "Sedang",
  "risk_color": "yellow",
  "top_factors": ["Usia", "Tekanan Darah", "Kolesterol"],
  "base_probability": 35.5,
  "lifestyle_adjustment": 7.0,
  "disclaimer": "..."
}
```

## Cek cepat

```bash
curl http://localhost:5001/health

curl -X POST http://localhost:5001/predict/heart \
  -H "Content-Type: application/json" \
  -d '{"age":45,"sex":"laki-laki","cp":"nyeri ringan","trestbps":130,"chol":250,"fbs":"tidak","thalach":150,"exang":"tidak","family_history":"ya","smoking":"tidak"}'
```

## Variabel environment

```bash
PORT=5001
FLASK_DEBUG=false
AUTO_REBUILD_MODELS=true
```
