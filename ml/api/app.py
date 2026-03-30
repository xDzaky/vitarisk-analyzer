"""Flask app for the ML prediction service."""

import os
import sys
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv

# Keep imports working whether the app is started from ml/ or ml/api/.
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))

from utils import (
    ensure_models_ready,
    get_missing_or_failed_diseases,
    predict_heart,
    predict_diabetes,
    predict_cholesterol,
    validate_input
)

load_dotenv()

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

print("Loading ML models...")
auto_rebuild_models = os.environ.get("AUTO_REBUILD_MODELS", "true").lower() == "true"
models = ensure_models_ready(auto_rebuild=auto_rebuild_models)
print("Models ready.")

@app.route("/health", methods=["GET"])
def health():
    loaded = {k: (v is not None) for k, v in models.items()}
    load_errors = models.get("_load_errors", {})
    unavailable = get_missing_or_failed_diseases(models)
    model_status = {k: v for k, v in loaded.items() if not k.startswith("_")}
    all_ready = len(unavailable) == 0
    return jsonify({
        "status": "ok" if all_ready else "partial",
        "models": model_status,
        "unavailable_diseases": unavailable,
        "load_errors": load_errors,
    }), 200 if all_ready else 206

@app.route("/predict/heart", methods=["POST"])
def predict_heart_route():
    data = request.get_json(force=True)
    if not data:
        return jsonify({"error": "Request body harus berupa JSON"}), 400

    required = ["age", "sex", "cp", "trestbps", "chol", "fbs",
                "thalach", "exang", "family_history", "smoking"]
    error = validate_input(data, required)
    if error:
        return jsonify({"error": error}), 400

    try:
        result = predict_heart(data, models)
        return jsonify(result), 200
    except Exception as e:
        return jsonify({"error": f"Prediction failed: {str(e)}"}), 500

@app.route("/predict/diabetes", methods=["POST"])
def predict_diabetes_route():
    data = request.get_json(force=True)
    if not data:
        return jsonify({"error": "Request body harus berupa JSON"}), 400

    required = ["age", "sex", "glucose", "blood_pressure",
                "family_history", "diet_sweet", "exercise_freq"]
    error = validate_input(data, required)
    if error:
        return jsonify({"error": error}), 400

    has_bmi = data.get("bmi") not in (None, "")
    has_weight_and_height = data.get("weight_kg") not in (None, "") and data.get("height_cm") not in (None, "")
    if not has_bmi and not has_weight_and_height:
        return jsonify({
            "error": "Field 'bmi' wajib diisi, atau kirim pasangan 'weight_kg' dan 'height_cm'."
        }), 400

    try:
        result = predict_diabetes(data, models)
        return jsonify(result), 200
    except Exception as e:
        return jsonify({"error": f"Prediction failed: {str(e)}"}), 500

@app.route("/predict/cholesterol", methods=["POST"])
def predict_cholesterol_route():
    data = request.get_json(force=True)
    if not data:
        return jsonify({"error": "Request body harus berupa JSON"}), 400

    required = ["age", "sex", "trestbps", "diet_fat", "exercise_freq",
                "smoking", "family_history"]
    error = validate_input(data, required)
    if error:
        return jsonify({"error": error}), 400

    try:
        result = predict_cholesterol(data, models)
        return jsonify(result), 200
    except Exception as e:
        return jsonify({"error": f"Prediction failed: {str(e)}"}), 500

if __name__ == "__main__":
    port = int(os.environ.get("PORT", os.environ.get("FLASK_PORT", 5001)))
    debug = os.environ.get("FLASK_DEBUG", "false").lower() == "true"
    print(f"ML service running on http://localhost:{port}")
    app.run(host="0.0.0.0", port=port, debug=debug)
