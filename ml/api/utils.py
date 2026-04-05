"""Helper functions for model loading and prediction."""

import os
import subprocess
import sys
import warnings
import joblib
import pandas as pd
from sklearn.exceptions import InconsistentVersionWarning

BASE_DIR    = os.path.dirname(os.path.abspath(__file__))
MODELS_DIR  = os.path.join(BASE_DIR, "..", "models")
ML_DIR      = os.path.abspath(os.path.join(BASE_DIR, ".."))
DISEASES    = ("heart", "diabetes", "cholesterol")

def load_all_models():
    """Load all models + scalers + feature metadata at startup."""
    loaded = {}
    load_errors = {}

    for d in DISEASES:
        model_path   = os.path.join(MODELS_DIR, f"{d}_model.joblib")
        scaler_path  = os.path.join(MODELS_DIR, f"{d}_scaler.joblib")
        feat_path    = os.path.join(MODELS_DIR, f"{d}_features.joblib")

        try:
            with warnings.catch_warnings():
                warnings.simplefilter("error", InconsistentVersionWarning)
                loaded[f"{d}_model"] = joblib.load(model_path)
                loaded[f"{d}_scaler"] = joblib.load(scaler_path)
                loaded[f"{d}_features"] = joblib.load(feat_path)
            print(f"   {d.capitalize()} model loaded")
        except FileNotFoundError:
            print(f"   {d.capitalize()} model not found at {model_path}")
            print(f"       Run: python ml/train_{d}.py first")
            loaded[f"{d}_model"]    = None
            loaded[f"{d}_scaler"]   = None
            loaded[f"{d}_features"] = None
            load_errors[d] = "model files not found"
        except InconsistentVersionWarning as exc:
            print(f"   {d.capitalize()} model version mismatch detected")
            print(f"       {exc}")
            loaded[f"{d}_model"] = None
            loaded[f"{d}_scaler"] = None
            loaded[f"{d}_features"] = None
            load_errors[d] = f"incompatible artifact: {exc}"
        except Exception as exc:
            print(f"   {d.capitalize()} model failed to load")
            print(f"       {type(exc).__name__}: {exc}")
            loaded[f"{d}_model"]    = None
            loaded[f"{d}_scaler"]   = None
            loaded[f"{d}_features"] = None
            load_errors[d] = f"{type(exc).__name__}: {exc}"

    loaded["_load_errors"] = load_errors
    return loaded


def get_missing_or_failed_diseases(models: dict) -> list[str]:
    """Return diseases with missing or failed model bundles."""
    unavailable = []
    for disease in DISEASES:
        if (
            models.get(f"{disease}_model") is None
            or models.get(f"{disease}_scaler") is None
            or models.get(f"{disease}_features") is None
        ):
            unavailable.append(disease)
    return unavailable


def retrain_models(diseases: list[str] | tuple[str, ...] | None = None) -> None:
    """Rebuild one or more model bundles using the current runtime dependencies."""
    diseases_to_train = list(diseases or DISEASES)

    for disease in diseases_to_train:
        script_path = os.path.join(ML_DIR, f"train_{disease}.py")
        print(f"   Rebuilding {disease} model from {script_path}")

        completed = subprocess.run(
            [sys.executable, script_path],
            cwd=ML_DIR,
            check=False,
            capture_output=True,
            text=True,
        )

        if completed.stdout:
            print(completed.stdout)
        if completed.stderr:
            print(completed.stderr)

        if completed.returncode != 0:
            raise RuntimeError(
                f"Training script failed for {disease} with exit code {completed.returncode}"
            )


def ensure_models_ready(auto_rebuild: bool = True) -> dict:
    """Load models and rebuild them automatically when artifacts are incompatible."""
    models = load_all_models()
    failed_diseases = get_missing_or_failed_diseases(models)

    if not failed_diseases or not auto_rebuild:
        return models

    print("Some model artifacts are missing or incompatible with this runtime.")
    print(f"   Affected diseases: {', '.join(failed_diseases)}")
    print("   Attempting to rebuild all models using the current environment...")

    retrain_models()
    models = load_all_models()

    remaining_failures = get_missing_or_failed_diseases(models)
    if remaining_failures:
        raise RuntimeError(
            "Model rebuild completed but some models are still unavailable: "
            + ", ".join(remaining_failures)
        )

    print("Model rebuild complete. All models loaded successfully.")
    return models

def validate_input(data: dict, required_fields: list) -> str | None:
    """Returns error string if validation fails, None if OK."""
    for field in required_fields:
        if field not in data or data[field] is None or data[field] == "":
            return f"Field '{field}' wajib diisi"
    return None


def get_risk_level(probability: float) -> dict:
    """Convert probability (0-1) to risk level label + color."""
    pct = round(probability * 100, 1)
    if probability <= 0.30:
        return {"risk_percent": pct, "risk_level": "Rendah",  "risk_color": "green"}
    elif probability <= 0.60:
        return {"risk_percent": pct, "risk_level": "Sedang",  "risk_color": "yellow"}
    else:
        return {"risk_percent": pct, "risk_level": "Tinggi",  "risk_color": "red"}


def get_top_factors(feature_importance: dict, top_n: int = 5) -> list:
    """Return top N most important features as human-readable labels."""
    sorted_feats = sorted(
        feature_importance.items(),
        key=lambda x: x[1]["importance"],
        reverse=True
    )
    return [data["label_id"] for _, data in sorted_feats[:top_n]]


MODIFIERS = {
    # (field, value_check_fn): probability_delta
    "family_history_yes":   +0.05,
    "smoking_active":       +0.08,
    "smoking_occasional":   +0.03,
    "diet_fat_daily":       +0.05,
    "diet_fat_frequent":    +0.03,
    "diet_sweet_daily":     +0.05,
    "diet_sweet_frequent":  +0.02,
    "exercise_never":       +0.05,
    "alcohol_frequent":     +0.03,
}

def apply_lifestyle_modifiers(base_prob: float, data: dict) -> float:
    """Add lifestyle risk modifiers not present in training dataset."""
    delta = 0.0

    # Family history
    if str(data.get("family_history", "tidak")).lower() in ("ya", "yes", "1", "true"):
        delta += MODIFIERS["family_history_yes"]

    # Smoking
    smoking = str(data.get("smoking", "tidak")).lower()
    if smoking in ("aktif setiap hari", "active", "yes", "ya", "1", "true"):
        delta += MODIFIERS["smoking_active"]
    elif smoking in ("kadang-kadang", "occasional"):
        delta += MODIFIERS["smoking_occasional"]

    # Diet fat (for cholesterol & heart)
    diet_fat = str(data.get("diet_fat", "jarang")).lower()
    if diet_fat in ("setiap hari", "daily"):
        delta += MODIFIERS["diet_fat_daily"]
    elif diet_fat in ("3-5x seminggu", "frequent"):
        delta += MODIFIERS["diet_fat_frequent"]

    # Diet sweet (for diabetes)
    diet_sweet = str(data.get("diet_sweet", "jarang")).lower()
    if diet_sweet in ("setiap hari", "daily"):
        delta += MODIFIERS["diet_sweet_daily"]
    elif diet_sweet in ("3-5x seminggu", "frequent"):
        delta += MODIFIERS["diet_sweet_frequent"]

    # Exercise
    exercise = str(data.get("exercise_freq", "jarang")).lower()
    if exercise in ("tidak pernah", "never", "0"):
        delta += MODIFIERS["exercise_never"]

    # Alcohol
    alcohol = str(data.get("alcohol", "tidak")).lower()
    if alcohol in ("sering", "frequent", "yes"):
        delta += MODIFIERS["alcohol_frequent"]

    # Cap between 0 and 1
    return min(1.0, max(0.0, base_prob + delta))


MEDIANS = {
    # Heart
    "trestbps":  122.0,
    "chol":      246.0,
    "thalach":   149.0,
    "oldpeak":   1.0,
    "restecg":   0.0,
    "slope":     1.0,
    "ca":        0.0,
    "thal":      2.0,
    # Diabetes
    "BloodPressure":  72.0,
    "SkinThickness":  29.0,
    "Insulin":        125.0,
    "DiabetesPedigreeFunction": 0.47,
    # Cholesterol
    "bmi_default":  27.5,
}

def safe_float(val, fallback: float) -> float:
    """Convert to float, or return fallback if unknown/invalid."""
    if val is None:
        return fallback
    s = str(val).lower().strip()
    if s in ("tidak tahu", "unknown", "", "none", "null"):
        return fallback
    try:
        return float(val)
    except (ValueError, TypeError):
        return fallback

def sex_to_int(val) -> int:
    """Convert sex field to 0/1 (0=female, 1=male)."""
    s = str(val).lower().strip()
    if s in ("laki-laki", "male", "l", "1"):
        return 1
    return 0

def fbs_to_int(val) -> int:
    """Fasting blood sugar > 120 mg/dL → 1, else 0."""
    s = str(val).lower().strip()
    if s in ("ya", "yes", "1", "true"):
        return 1
    return 0

def cp_to_int(val) -> int:
    """Chest pain type 0-3."""
    cp_map = {
        "tidak pernah": 0, "none": 0,
        "nyeri ringan": 1, "mild": 1,
        "nyeri sedang": 2, "moderate": 2,
        "nyeri berat": 3, "severe": 3,
    }
    s = str(val).lower().strip()
    return cp_map.get(s, safe_float(val, 0))

def exang_to_int(val) -> int:
    """Exercise induced angina 0/1."""
    s = str(val).lower().strip()
    if s in ("ya", "yes", "1", "true"):
        return 1
    return 0

def bmi_from_input(data: dict) -> float:
    """Get BMI from direct input or calculate from weight/height."""
    if "bmi" in data and data["bmi"]:
        return safe_float(data["bmi"], MEDIANS["bmi_default"])
    if "weight_kg" in data and "height_cm" in data:
        w = safe_float(data["weight_kg"], 65)
        h = safe_float(data["height_cm"], 165) / 100
        if h > 0:
            return round(w / (h * h), 1)
    return MEDIANS["bmi_default"]

def pregnancies_from_input(data: dict) -> int:
    """Get pregnancies count; 0 for males."""
    if sex_to_int(data.get("sex", "perempuan")) == 1:
        return 0  # male
    return int(safe_float(data.get("pregnancies", 0), 0))


def build_feature_frame(feature_names: list, feature_values: list) -> pd.DataFrame:
    """Build a single-row DataFrame to preserve training feature names."""
    return pd.DataFrame([feature_values], columns=feature_names)


def predict_scaled_probability(model, scaler, feature_names: list, feature_values: list) -> float:
    """Run scaler + model prediction with consistent feature names."""
    feature_frame = build_feature_frame(feature_names, feature_values)
    scaled_features = scaler.transform(feature_frame)
    return float(model.predict_proba(scaled_features)[0][1])


# ─────────────────────────────────────────────
# 7. PREDICT HEART
# ─────────────────────────────────────────────
def predict_heart(data: dict, models: dict) -> dict:
    model    = models["heart_model"]
    scaler   = models["heart_scaler"]
    meta     = models["heart_features"]

    if model is None:
        raise RuntimeError("Heart model not loaded. Run train_heart.py first.")

    feature_names = meta["feature_names"]

    # Build feature vector matching training feature order
    feature_values = []
    defaults = {
        "age": 25, "sex": 1, "cp": 0, "trestbps": 122, "chol": 246,
        "fbs": 0, "restecg": 0, "thalach": 149, "exang": 0,
        "oldpeak": 1.0, "slope": 1, "ca": 0, "thal": 2
    }

    for feat in feature_names:
        if feat == "age":
            feature_values.append(safe_float(data.get("age"), defaults["age"]))
        elif feat == "sex":
            feature_values.append(sex_to_int(data.get("sex", "laki-laki")))
        elif feat == "cp":
            feature_values.append(cp_to_int(data.get("cp", 0)))
        elif feat == "trestbps":
            feature_values.append(safe_float(data.get("trestbps"), MEDIANS["trestbps"]))
        elif feat == "chol":
            feature_values.append(safe_float(data.get("chol"), MEDIANS["chol"]))
        elif feat == "fbs":
            feature_values.append(fbs_to_int(data.get("fbs", "tidak")))
        elif feat == "restecg":
            feature_values.append(safe_float(data.get("restecg"), MEDIANS["restecg"]))
        elif feat in ("thalach", "thalch"):
            feature_values.append(safe_float(data.get("thalach"), MEDIANS["thalach"]))
        elif feat == "exang":
            feature_values.append(exang_to_int(data.get("exang", "tidak")))
        elif feat == "oldpeak":
            feature_values.append(safe_float(data.get("oldpeak"), MEDIANS["oldpeak"]))
        elif feat == "slope":
            feature_values.append(safe_float(data.get("slope"), MEDIANS["slope"]))
        elif feat == "ca":
            feature_values.append(safe_float(data.get("ca"), MEDIANS["ca"]))
        elif feat == "thal":
            feature_values.append(safe_float(data.get("thal"), MEDIANS["thal"]))
        else:
            feature_values.append(defaults.get(feat, 0))

    base_prob = predict_scaled_probability(model, scaler, feature_names, feature_values)

    # Apply lifestyle modifiers
    final_prob = apply_lifestyle_modifiers(base_prob, data)
    risk = get_risk_level(final_prob)
    top_factors = get_top_factors(meta["feature_importance"])

    return {
        "disease": "Penyakit Jantung",
        "risk_percent": risk["risk_percent"],
        "risk_level": risk["risk_level"],
        "risk_color": risk["risk_color"],
        "top_factors": top_factors,
        "base_probability": round(base_prob * 100, 1),
        "lifestyle_adjustment": round((final_prob - base_prob) * 100, 1),
        "disclaimer": "Hasil ini adalah estimasi berdasarkan model Machine Learning dan tidak menggantikan diagnosis dokter."
    }


# ─────────────────────────────────────────────
# 8. PREDICT DIABETES
# ─────────────────────────────────────────────
def predict_diabetes(data: dict, models: dict) -> dict:
    model    = models["diabetes_model"]
    scaler   = models["diabetes_scaler"]
    meta     = models["diabetes_features"]

    if model is None:
        raise RuntimeError("Diabetes model not loaded. Run train_diabetes.py first.")

    feature_names = meta["feature_names"]
    bmi = bmi_from_input(data)
    pregnancies = pregnancies_from_input(data)

    feature_values = []
    for feat in feature_names:
        if feat == "Pregnancies":
            feature_values.append(pregnancies)
        elif feat == "Glucose":
            feature_values.append(safe_float(data.get("glucose"), 120))
        elif feat == "BloodPressure":
            feature_values.append(safe_float(data.get("blood_pressure"), MEDIANS["BloodPressure"]))
        elif feat == "SkinThickness":
            feature_values.append(safe_float(data.get("skin_thickness"), MEDIANS["SkinThickness"]))
        elif feat == "Insulin":
            feature_values.append(safe_float(data.get("insulin"), MEDIANS["Insulin"]))
        elif feat == "BMI":
            feature_values.append(bmi)
        elif feat == "DiabetesPedigreeFunction":
            # Map family history (Ya/Tidak) → DiabetesPedigreeFunction proxy
            fam = str(data.get("family_history", "tidak")).lower()
            if fam in ("ya", "yes", "1"):
                feature_values.append(0.80)   # higher pedigree function → higher risk
            elif fam in ("tidak tahu", "unknown"):
                feature_values.append(MEDIANS["DiabetesPedigreeFunction"])
            else:
                feature_values.append(0.25)   # low pedigree
        elif feat == "Age":
            feature_values.append(safe_float(data.get("age"), 25))
        else:
            feature_values.append(0)

    base_prob = predict_scaled_probability(model, scaler, feature_names, feature_values)
    final_prob = apply_lifestyle_modifiers(base_prob, data)
    risk = get_risk_level(final_prob)
    top_factors = get_top_factors(meta["feature_importance"])

    return {
        "disease": "Diabetes",
        "risk_percent": risk["risk_percent"],
        "risk_level": risk["risk_level"],
        "risk_color": risk["risk_color"],
        "top_factors": top_factors,
        "base_probability": round(base_prob * 100, 1),
        "lifestyle_adjustment": round((final_prob - base_prob) * 100, 1),
        "bmi_used": bmi,
        "disclaimer": "Hasil ini adalah estimasi berdasarkan model Machine Learning dan tidak menggantikan diagnosis dokter."
    }


# ─────────────────────────────────────────────
# 9. PREDICT CHOLESTEROL
# ─────────────────────────────────────────────
def predict_cholesterol(data: dict, models: dict) -> dict:
    model    = models["cholesterol_model"]
    scaler   = models["cholesterol_scaler"]
    meta     = models["cholesterol_features"]

    if model is None:
        raise RuntimeError("Cholesterol model not loaded. Run train_cholesterol.py first.")

    feature_names = meta["feature_names"]

    feature_values = []
    for feat in feature_names:
        if feat == "age":
            feature_values.append(safe_float(data.get("age"), 25))
        elif feat == "sex":
            feature_values.append(sex_to_int(data.get("sex", "laki-laki")))
        elif feat == "cp":
            feature_values.append(cp_to_int(data.get("cp", 0)))
        elif feat == "trestbps":
            feature_values.append(safe_float(data.get("trestbps"), MEDIANS["trestbps"]))
        elif feat == "fbs":
            feature_values.append(fbs_to_int(data.get("fbs", "tidak")))
        elif feat == "restecg":
            feature_values.append(safe_float(data.get("restecg"), MEDIANS["restecg"]))
        elif feat == "thalch":
            feature_values.append(safe_float(data.get("thalach"), MEDIANS["thalach"]))
        elif feat == "exang":
            feature_values.append(exang_to_int(data.get("exang", "tidak")))
        elif feat == "oldpeak":
            feature_values.append(safe_float(data.get("oldpeak"), MEDIANS["oldpeak"]))
        elif feat == "slope":
            feature_values.append(safe_float(data.get("slope"), MEDIANS["slope"]))
        else:
            feature_values.append(0)

    base_prob = predict_scaled_probability(model, scaler, feature_names, feature_values)

    # Apply lifestyle modifiers
    final_prob = apply_lifestyle_modifiers(base_prob, data)
    risk = get_risk_level(final_prob)
    top_factors = get_top_factors(meta["feature_importance"])

    return {
        "disease": "Kolesterol Tinggi",
        "risk_percent": risk["risk_percent"],
        "risk_level": risk["risk_level"],
        "risk_color": risk["risk_color"],
        "top_factors": top_factors,
        "base_probability": round(base_prob * 100, 1),
        "lifestyle_adjustment": round((final_prob - base_prob) * 100, 1),
        "disclaimer": "Hasil ini adalah estimasi berdasarkan model Machine Learning dan tidak menggantikan diagnosis dokter."
    }
