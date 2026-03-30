"""
Diabetes Risk Prediction — Model Training
Dataset: PIMA Indians Diabetes Database via Kaggle
Target: Binary classification (0 = no diabetes, 1 = diabetes)
Run: python train_diabetes.py
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
DATA_PATH = os.path.join(BASE_DIR, "data", "diabetes.csv")
MODEL_PATH   = os.path.join(BASE_DIR, "models", "diabetes_model.joblib")
SCALER_PATH  = os.path.join(BASE_DIR, "models", "diabetes_scaler.joblib")
FEATURES_PATH = os.path.join(BASE_DIR, "models", "diabetes_features.joblib")

# ─────────────────────────────────────────────
# 1. LOAD DATA
# ─────────────────────────────────────────────
def load_data():
    print("📂 Loading PIMA Diabetes dataset...")
    df = pd.read_csv(DATA_PATH)
    print(f"   Shape: {df.shape}")
    print(f"   Columns: {list(df.columns)}")

    # Standardize column names
    df.columns = [c.strip() for c in df.columns]

    # Target column may be 'Outcome' or 'outcome' or 'diabetes'
    for possible in ['Outcome', 'outcome', 'diabetes', 'target']:
        if possible in df.columns:
            df = df.rename(columns={possible: 'target'})
            break

    print(f"   Target distribution:\n{df['target'].value_counts()}")
    return df

# ─────────────────────────────────────────────
# 2. PREPROCESSING
# ─────────────────────────────────────────────
def preprocess(df):
    print("\n🔧 Preprocessing...")

    # PIMA dataset: zeros in certain columns mean missing/unknown
    # These features cannot be 0 biologically
    zero_invalid = ['Glucose', 'BloodPressure', 'SkinThickness', 'Insulin', 'BMI']
    for col in zero_invalid:
        if col in df.columns:
            zero_count = (df[col] == 0).sum()
            if zero_count > 0:
                median_val = df.loc[df[col] != 0, col].median()
                df[col] = df[col].replace(0, median_val)
                print(f"   Fixed {zero_count} zero values in '{col}' → median={median_val:.2f}")

    # Core features mapping to our form fields
    feature_candidates = [
        'Pregnancies', 'Glucose', 'BloodPressure', 'SkinThickness',
        'Insulin', 'BMI', 'DiabetesPedigreeFunction', 'Age'
    ]

    available = [c for c in feature_candidates if c in df.columns]
    print(f"   Available features: {available}")

    # Drop any remaining NaN
    df = df.dropna(subset=['target'] + available)
    df = df.drop_duplicates()
    print(f"   Clean shape: {df.shape}")

    X = df[available]
    y = df['target']

    return X, y, available

# ─────────────────────────────────────────────
# 3. TRAIN & EVALUATE
# ─────────────────────────────────────────────
def train_and_evaluate(X, y):
    print("\n🤖 Training models...")

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

        acc  = accuracy_score(y_test, y_pred)
        f1   = f1_score(y_test, y_pred, zero_division=0)
        auc  = roc_auc_score(y_test, y_prob)

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
    print(classification_report(y_test, y_pred_best, target_names=["No Diabetes", "Diabetes"]))

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
        'Pregnancies':             'Riwayat Kehamilan',
        'Glucose':                 'Kadar Glukosa',
        'BloodPressure':           'Tekanan Darah',
        'SkinThickness':           'Ketebalan Kulit',
        'Insulin':                 'Kadar Insulin',
        'BMI':                     'Indeks Massa Tubuh (BMI)',
        'DiabetesPedigreeFunction':'Riwayat Keluarga Diabetes',
        'Age':                     'Usia'
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
        print(f"   {data['label_id']:35s} {data['importance']:.4f}")

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
        "disease": "diabetes",
        "target_label": {0: "Tidak terdeteksi risiko diabetes", 1: "Terdeteksi risiko diabetes"},
        "risk_thresholds": {"low": 0.30, "medium": 0.60},
        "note": "PIMA dataset only includes female patients aged >=21. For male users, Pregnancies=0 and DiabetesPedigreeFunction uses median."
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
    print("  Diabetes Model Training")
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
        disease_name="diabetes",
        model_name=training_result["model_name"],
        metrics=training_result["metrics"],
        cv_mean=training_result["cv_mean"],
        cv_std=training_result["cv_std"],
        y_true=training_result["y_test"],
        y_pred=training_result["y_pred"],
        labels=["No Diabetes", "Diabetes"],
    )

    print("\n✅ Diabetes model training complete!")
    print(f"   Metrics: {artifact_paths['metrics_path']}")
    print(f"   Summary: {artifact_paths['summary_path']}")
    print(f"   Confusion matrix: {artifact_paths['confusion_matrix_path']}")
