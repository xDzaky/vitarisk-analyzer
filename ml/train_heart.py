"""
Heart Disease Risk Prediction — Model Training
Dataset: UCI Heart Disease (Cleveland) via Kaggle
Target: Binary classification (0 = no disease, 1 = disease)
Run: python train_heart.py
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
    accuracy_score, precision_score, recall_score,
    f1_score, roc_auc_score, classification_report
)
from training_utils import calculate_metrics, save_evaluation_artifacts

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_PATH = os.path.join(BASE_DIR, "data", "heart.csv")
MODEL_PATH = os.path.join(BASE_DIR, "models", "heart_model.joblib")
SCALER_PATH = os.path.join(BASE_DIR, "models", "heart_scaler.joblib")
FEATURES_PATH = os.path.join(BASE_DIR, "models", "heart_features.joblib")

# ─────────────────────────────────────────────
# 1. LOAD DATA
# ─────────────────────────────────────────────
# ── Encoding maps ───────────────────────────────────────────────────
SEX_MAP     = {"Male": 1, "Female": 0, "male": 1, "female": 0}
CP_MAP      = {"typical angina": 0, "atypical angina": 1,
               "non-anginal": 2, "asymptomatic": 3}
RESTECG_MAP = {"normal": 0, "st-t abnormality": 1, "lv hypertrophy": 2}
SLOPE_MAP   = {"upsloping": 0, "flat": 1, "downsloping": 2}
THAL_MAP    = {"normal": 0, "fixed defect": 1,
               "reversable defect": 2, "reversible defect": 2}

def load_data():
    print("📂 Loading heart disease dataset...")
    df = pd.read_csv(DATA_PATH)
    print(f"   Shape: {df.shape}")
    print(f"   Columns: {list(df.columns)}")

    # 'num' is the target column (0=no disease, 1-4=disease)
    df['target'] = (df['num'] > 0).astype(int)
    print(f"   Target distribution:\n{df['target'].value_counts().to_string()}")
    return df

# ─────────────────────────────────────────────
# 2. PREPROCESSING
# ─────────────────────────────────────────────
def preprocess(df):
    print("\n🔧 Preprocessing...")

    # Encode string categoricals
    df['sex']     = df['sex'].map(SEX_MAP).fillna(0).astype(int)
    df['cp']      = df['cp'].map(CP_MAP).fillna(0).astype(int)
    df['restecg'] = df['restecg'].map(RESTECG_MAP).fillna(0).astype(int)
    df['slope']   = df['slope'].map(SLOPE_MAP).fillna(1).astype(int)
    df['thal']    = df['thal'].map(THAL_MAP).fillna(0).astype(int)
    df['fbs']     = df['fbs'].map({True: 1, False: 0}).fillna(0).astype(int)
    df['exang']   = df['exang'].map({True: 1, False: 0}).fillna(0).astype(int)

    # Use 'thalch' (actual column name) as max heart rate; drop 'ca' (66% NaN)
    FEATURES = ['age', 'sex', 'cp', 'trestbps', 'chol', 'fbs',
                'restecg', 'thalch', 'exang', 'oldpeak', 'slope']

    # Fill remaining numeric NaN with median
    for col in FEATURES:
        if df[col].isnull().sum() > 0:
            df[col] = df[col].fillna(df[col].median())

    df = df.dropna(subset=['target']).drop_duplicates()
    print(f"   Clean shape: {df.shape}")

    X = df[FEATURES]
    y = df['target']
    return X, y, FEATURES

# ─────────────────────────────────────────────
# 3. TRAIN & EVALUATE MODELS
# ─────────────────────────────────────────────
def train_and_evaluate(X, y):
    print("\n🤖 Training models...")

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )

    # Scale features
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)

    models = {
        "Logistic Regression": LogisticRegression(random_state=42, max_iter=1000),
        "Decision Tree":       DecisionTreeClassifier(random_state=42, max_depth=5),
        "Random Forest":       RandomForestClassifier(n_estimators=100, random_state=42),
        "Gradient Boosting":   GradientBoostingClassifier(random_state=42),
    }

    results = {}
    for name, model in models.items():
        model.fit(X_train_scaled, y_train)
        y_pred = model.predict(X_test_scaled)
        y_prob = model.predict_proba(X_test_scaled)[:, 1]

        acc   = accuracy_score(y_test, y_pred)
        prec  = precision_score(y_test, y_pred, zero_division=0)
        rec   = recall_score(y_test, y_pred, zero_division=0)
        f1    = f1_score(y_test, y_pred, zero_division=0)
        auc   = roc_auc_score(y_test, y_prob)

        results[name] = {"model": model, "accuracy": acc, "precision": prec,
                         "recall": rec, "f1": f1, "auc": auc}
        print(f"   {name:25s} | Acc: {acc:.3f} | F1: {f1:.3f} | AUC: {auc:.3f}")

    # Pick best model by AUC
    best_name = max(results, key=lambda k: results[k]["auc"])
    best = results[best_name]
    print(f"\n🏆 Best model: {best_name} (AUC={best['auc']:.3f})")

    cv_scores = cross_val_score(best["model"], X_train_scaled, y_train, cv=5, scoring='roc_auc')
    print(f"   5-Fold CV AUC: {cv_scores.mean():.3f} ± {cv_scores.std():.3f}")

    y_pred_best = best["model"].predict(X_test_scaled)
    y_prob_best = best["model"].predict_proba(X_test_scaled)[:, 1]
    print("\n📊 Classification Report:")
    print(classification_report(y_test, y_pred_best, target_names=["No Disease", "Disease"]))

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
    importance_map = {}

    if hasattr(model, 'feature_importances_'):
        importances = model.feature_importances_
    elif hasattr(model, 'coef_'):
        importances = np.abs(model.coef_[0])
    else:
        return {}

    label_map = {
        'age': 'Usia', 'sex': 'Jenis Kelamin', 'cp': 'Jenis Nyeri Dada',
        'trestbps': 'Tekanan Darah Istirahat', 'chol': 'Kadar Kolesterol',
        'fbs': 'Gula Darah Puasa > 120', 'restecg': 'EKG Istirahat',
        'thalch': 'Detak Jantung Maks', 'exang': 'Nyeri Saat Olahraga',
        'oldpeak': 'ST Depression', 'slope': 'Kemiringan Segmen ST',
        'ca': 'Jumlah Pembuluh Darah', 'thal': 'Thalassemia'
    }

    for feat, imp in zip(feature_names, importances):
        importance_map[feat] = {
            "importance": float(imp),
            "label_id": label_map.get(feat, feat)
        }

    # Sort by importance descending
    importance_map = dict(
        sorted(importance_map.items(), key=lambda x: x[1]["importance"], reverse=True)
    )
    print(f"\n🔍 Feature Importances:")
    for feat, data in list(importance_map.items())[:5]:
        print(f"   {data['label_id']:30s} {data['importance']:.4f}")

    return importance_map

# ─────────────────────────────────────────────
# 5. SAVE MODEL
# ─────────────────────────────────────────────
def save_model(model, scaler, features, feature_importance):
    os.makedirs(os.path.join(BASE_DIR, "models"), exist_ok=True)
    joblib.dump(model, MODEL_PATH)
    joblib.dump(scaler, SCALER_PATH)
    joblib.dump({
        "feature_names": features,
        "feature_importance": feature_importance,
        "disease": "heart",
        "target_label": {0: "Tidak ada penyakit jantung", 1: "Terdeteksi risiko penyakit jantung"},
        "risk_thresholds": {"low": 0.30, "medium": 0.60}
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
    print("  Heart Disease Model Training")
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
        disease_name="heart",
        model_name=training_result["model_name"],
        metrics=training_result["metrics"],
        cv_mean=training_result["cv_mean"],
        cv_std=training_result["cv_std"],
        y_true=training_result["y_test"],
        y_pred=training_result["y_pred"],
        labels=["No Disease", "Disease"],
    )

    print("\n✅ Heart disease model training complete!")
    print(f"   Metrics: {artifact_paths['metrics_path']}")
    print(f"   Summary: {artifact_paths['summary_path']}")
    print(f"   Confusion matrix: {artifact_paths['confusion_matrix_path']}")
