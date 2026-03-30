import json
import os
from datetime import datetime

import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.metrics import (
    accuracy_score,
    confusion_matrix,
    f1_score,
    precision_score,
    recall_score,
    roc_auc_score,
)


BASE_DIR = os.path.dirname(os.path.abspath(__file__))
RESULTS_DIR = os.path.join(BASE_DIR, "results")


def ensure_results_dir(disease_name: str) -> str:
    disease_dir = os.path.join(RESULTS_DIR, disease_name)
    os.makedirs(disease_dir, exist_ok=True)
    return disease_dir


def calculate_metrics(y_true, y_pred, y_prob):
    return {
        "accuracy": round(float(accuracy_score(y_true, y_pred)), 4),
        "precision": round(float(precision_score(y_true, y_pred, zero_division=0)), 4),
        "recall": round(float(recall_score(y_true, y_pred, zero_division=0)), 4),
        "f1": round(float(f1_score(y_true, y_pred, zero_division=0)), 4),
        "roc_auc": round(float(roc_auc_score(y_true, y_prob)), 4),
    }


def save_evaluation_artifacts(
    disease_name: str,
    model_name: str,
    metrics: dict,
    cv_mean: float,
    cv_std: float,
    y_true,
    y_pred,
    labels: list[str],
):
    disease_dir = ensure_results_dir(disease_name)

    metrics_path = os.path.join(disease_dir, "metrics.json")
    summary_path = os.path.join(disease_dir, "summary.md")
    confusion_matrix_path = os.path.join(disease_dir, "confusion_matrix.png")

    payload = {
        "disease": disease_name,
        "best_model": model_name,
        "evaluated_at": datetime.utcnow().isoformat() + "Z",
        "metrics": metrics,
        "cross_validation": {
            "roc_auc_mean": round(float(cv_mean), 4),
            "roc_auc_std": round(float(cv_std), 4),
        },
    }

    with open(metrics_path, "w", encoding="utf-8") as file:
        json.dump(payload, file, indent=2, ensure_ascii=False)

    with open(summary_path, "w", encoding="utf-8") as file:
        file.write(f"# {disease_name.title()} Model Summary\n\n")
        file.write(f"- Best model: `{model_name}`\n")
        file.write(f"- Accuracy: `{metrics['accuracy']}`\n")
        file.write(f"- Precision: `{metrics['precision']}`\n")
        file.write(f"- Recall: `{metrics['recall']}`\n")
        file.write(f"- F1 score: `{metrics['f1']}`\n")
        file.write(f"- ROC AUC: `{metrics['roc_auc']}`\n")
        file.write(f"- CV ROC AUC: `{round(float(cv_mean), 4)} +/- {round(float(cv_std), 4)}`\n")

    matrix = confusion_matrix(y_true, y_pred)
    plt.figure(figsize=(5, 4))
    sns.heatmap(
        matrix,
        annot=True,
        fmt="d",
        cmap="Blues",
        cbar=False,
        xticklabels=labels,
        yticklabels=labels,
    )
    plt.title(f"{disease_name.title()} Confusion Matrix")
    plt.xlabel("Predicted")
    plt.ylabel("Actual")
    plt.tight_layout()
    plt.savefig(confusion_matrix_path, dpi=150)
    plt.close()

    return {
        "metrics_path": metrics_path,
        "summary_path": summary_path,
        "confusion_matrix_path": confusion_matrix_path,
    }
