"""
Cholesterol Risk Prediction — Model Training
Strategy: Reuse UCI Heart Disease dataset, derive target from chol column
         high_chol = 1 if chol > 200 mg/dL else 0
Run: python train_cholesterol.py
"""

import os
import pandas as pd
import numpy as np
import joblib
import warnings
warnings.filterwarnings("ignore")

from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.preprocessing import StandardScaler
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.tree import DecisionTreeClassifier
from sklearn.metrics import (
    accuracy_score, f1_score, roc_auc_score, classification_report
)
from training_utils import calculate_metrics, save_evaluation_artifacts

BASE_DIR  = os.path.dirname(os.path.abspath(__file__))
DATA_PATH = os.path.join(BASE_DIR, "data", "heart.csv")
MODEL_PATH    = os.path.join(BASE_DIR, "models", "cholesterol_model.joblib")
SCALER_PATH   = os.path.join(BASE_DIR, "models", "cholesterol_scaler.joblib")
FEATURES_PATH = os.path.join(BASE_DIR, "models", "cholesterol_features.joblib")

CHOLESTEROL_THRESHOLD = 200  # mg/dL — > 200 = borderline/high

# Encoding maps (same dataset as heart)
SEX_MAP     = {"Male": 1, "Female": 0, "male": 1, "female": 0}
CP_MAP      = {"typical angina": 0, "atypical angina": 1, "non-anginal": 2, "asymptomatic": 3}
RESTECG_MAP = {"normal": 0, "st-t abnormality": 1, "lv hypertrophy": 2}
SLOPE_MAP   = {"upsloping": 0, "flat": 1, "downsloping": 2}

# ─────────────────────────────────────────────
# 1. LOAD DATA
# ─────────────────────────────────────────────
def load_data():
    print("📂 Loading Heart Disease dataset for cholesterol model...")
    df = pd.read_csv(DATA_PATH)
    print(f"   Shape: {df.shape}")
    print(f"   chol stats: min={df['chol'].min()}, max={df['chol'].max()}, mean={df['chol'].mean():.1f}")

    # Derive cholesterol target
    df['high_chol'] = (df['chol'] > CHOLESTEROL_THRESHOLD).astype(int)
    print(f"   Derived target distribution (>200 mg/dL = high):\n{df['high_chol'].value_counts().to_string()}")
    return df

# ─────────────────────────────────────────────
# 2. PREPROCESSING
# ─────────────────────────────────────────────
def preprocess(df):
    print("\n🔧 Preprocessing for cholesterol prediction...")

    # Encode string categoricals (same maps as heart dataset)
    df['sex']     = df['sex'].map(SEX_MAP).fillna(0).astype(int)
    df['cp']      = df['cp'].map(CP_MAP).fillna(0).astype(int)
    df['restecg'] = df['restecg'].map(RESTECG_MAP).fillna(0).astype(int)
    df['slope']   = df['slope'].map(SLOPE_MAP).fillna(1).astype(int)
    df['fbs']     = df['fbs'].map({True: 1, False: 0}).fillna(0).astype(int)
    df['exang']   = df['exang'].map({True: 1, False: 0}).fillna(0).astype(int)

    # NOTE: 'thalch' is the actual column (not 'thalach'); drop 'ca' due to 66% NaN
    feature_candidates = ['age', 'sex', 'cp', 'trestbps', 'fbs',
                          'restecg', 'thalch', 'exang', 'oldpeak', 'slope']

    available = [c for c in feature_candidates if c in df.columns]
    print(f"   Features used: {available}")

    for col in available:
        if df[col].isnull().sum() > 0:
            df[col] = df[col].fillna(df[col].median())

    df = df.dropna(subset=['high_chol']).drop_duplicates()
    print(f"   Clean shape: {df.shape}")

    vc = df['high_chol'].value_counts()
    print(f"   Class balance: Normal={vc.get(0,0)} | High={vc.get(1,0)}")

    X = df[available]
    y = df['high_chol']
    return X, y, available

# ─────────────────────────────────────────────
# 3. TRAIN & EVALUATE
# ─────────────────────────────────────────────
def train_and_evaluate(X, y):
    print("\n🤖 Training cholesterol models...")

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )

    scaler = StandardScaler()
    X_train_s = scaler.fit_transform(X_train)
    X_test_s  = scaler.transform(X_test)

    models = {
        "Logistic Regression": LogisticRegression(random_state=42, max_iter=1000),
        "Decision Tree":       DecisionTreeClassifier(random_state=42, max_depth=5),
        "Random Forest":       RandomForestClassifier(n_estimators=100, random_state=42),
        "Gradient Boosting":   GradientBoostingClassifier(random_state=42),
    }

    results = {}
    for name, model in models.items():
        model.fit(X_train_s, y_train)
        y_pred = model.predict(X_test_s)
        y_prob = model.predict_proba(X_test_s)[:, 1]

        acc = accuracy_score(y_test, y_pred)
        f1  = f1_score(y_test, y_pred, zero_division=0)
        try:
            auc = roc_auc_score(y_test, y_prob)
        except Exception:
            auc = 0.5

        results[name] = {"model": model, "accuracy": acc, "f1": f1, "auc": auc}
        print(f"   {name:25s} | Acc: {acc:.3f} | F1: {f1:.3f} | AUC: {auc:.3f}")

    best_name = max(results, key=lambda k: results[k]["auc"])
    best = results[best_name]
    print(f"\n🏆 Best model: {best_name} (AUC={best['auc']:.3f})")

    cv_scores = cross_val_score(best["model"], X_train_s, y_train, cv=5, scoring='roc_auc')
    print(f"   5-Fold CV AUC: {cv_scores.mean():.3f} ± {cv_scores.std():.3f}")

    y_pred_best = best["model"].predict(X_test_s)
    y_prob_best = best["model"].predict_proba(X_test_s)[:, 1]
    print("\n📊 Classification Report:")
    print(classification_report(y_test, y_pred_best, target_names=["Normal Chol", "High Chol"]))

    metrics = calculate_metrics(y_test, y_pred_best, y_prob_best)

    return {
        "model": best["model"],
        "model_name": best_name,
        "scaler": scaler,
        "feature_names": X.columns.tolist(),
        "metrics": metrics,
        "cv_mean": cv_scores.mean(),
        "cv_std": cv_scores.std(),
        "y_test": y_test,
        "y_pred": y_pred_best,
    }

# ─────────────────────────────────────────────
# 4. FEATURE IMPORTANCE
# ─────────────────────────────────────────────
def get_feature_importance(model, feature_names):
    label_map = {
        'age': 'Usia', 'sex': 'Jenis Kelamin', 'cp': 'Jenis Nyeri Dada',
        'trestbps': 'Tekanan Darah', 'fbs': 'Gula Darah Puasa',
        'restecg': 'EKG Istirahat', 'thalch': 'Detak Jantung Maks',
        'exang': 'Nyeri Saat Olahraga', 'oldpeak': 'ST Depression',
        'slope': 'Kemiringan ST'
    }

    if hasattr(model, 'feature_importances_'):
        importances = model.feature_importances_
    elif hasattr(model, 'coef_'):
        importances = np.abs(model.coef_[0])
    else:
        return {}

    importance_map = {}
    for feat, imp in zip(feature_names, importances):
        importance_map[feat] = {
            "importance": float(imp),
            "label_id": label_map.get(feat, feat)
        }

    importance_map = dict(
        sorted(importance_map.items(), key=lambda x: x[1]["importance"], reverse=True)
    )

    print(f"\n🔍 Top Feature Importances:")
    for feat, data in list(importance_map.items())[:5]:
        print(f"   {data['label_id']:30s} {data['importance']:.4f}")

    return importance_map

# ─────────────────────────────────────────────
# 5. SAVE
# ─────────────────────────────────────────────
def save_model(model, scaler, features, feature_importance):
    os.makedirs(os.path.join(BASE_DIR, "models"), exist_ok=True)
    joblib.dump(model, MODEL_PATH)
    joblib.dump(scaler, SCALER_PATH)
    joblib.dump({
        "feature_names": features,
        "feature_importance": feature_importance,
        "disease": "cholesterol",
        "threshold_used": CHOLESTEROL_THRESHOLD,
        "target_label": {
            0: "Kolesterol dalam batas normal (≤200 mg/dL)",
            1: "Risiko kolesterol tinggi (>200 mg/dL)"
        },
        "risk_thresholds": {"low": 0.30, "medium": 0.60},
        "note": f"Target derived from chol > {CHOLESTEROL_THRESHOLD} mg/dL. Lifestyle features (diet, exercise, smoking) applied as risk modifiers."
    }, FEATURES_PATH)

    print(f"\n💾 Models saved:")
    print(f"   {MODEL_PATH}")
    print(f"   {SCALER_PATH}")
    print(f"   {FEATURES_PATH}")

# ─────────────────────────────────────────────
# MAIN
# ─────────────────────────────────────────────
if __name__ == "__main__":
    print("=" * 55)
    print("  Cholesterol Risk Model Training")
    print("=" * 55)

    df = load_data()
    X, y, _feature_names = preprocess(df)
    training_result = train_and_evaluate(X, y)
    model = training_result["model"]
    scaler = training_result["scaler"]
    feat_list = training_result["feature_names"]
    feature_importance = get_feature_importance(model, feat_list)
    save_model(model, scaler, feat_list, feature_importance)

    artifact_paths = save_evaluation_artifacts(
        disease_name="cholesterol",
        model_name=training_result["model_name"],
        metrics=training_result["metrics"],
        cv_mean=training_result["cv_mean"],
        cv_std=training_result["cv_std"],
        y_true=training_result["y_test"],
        y_pred=training_result["y_pred"],
        labels=["Normal Chol", "High Chol"],
    )

    print("\n✅ Cholesterol model training complete!")
    print(f"   Metrics: {artifact_paths['metrics_path']}")
    print(f"   Summary: {artifact_paths['summary_path']}")
    print(f"   Confusion matrix: {artifact_paths['confusion_matrix_path']}")
