"""
Download Kaggle datasets for Prediksi Risiko Penyakit Muda
Run: python download_datasets.py
"""

import kagglehub
import shutil
import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = os.path.join(BASE_DIR, "data")
os.makedirs(DATA_DIR, exist_ok=True)

def download_heart():
    print("📥 Downloading UCI Heart Disease dataset...")
    path = kagglehub.dataset_download("redwankarimsony/heart-disease-data")
    print(f"   Cached at: {path}")
    for f in os.listdir(path):
        if f.endswith(".csv"):
            dest = os.path.join(DATA_DIR, "heart.csv")
            shutil.copy(os.path.join(path, f), dest)
            print(f"   ✅ Saved → ml/data/heart.csv ({os.path.getsize(dest)} bytes)")
            return dest
    print("   ⚠️ No CSV found, listing files:", os.listdir(path))

def download_diabetes():
    print("📥 Downloading PIMA Indians Diabetes dataset...")
    path = kagglehub.dataset_download("uciml/pima-indians-diabetes-database")
    print(f"   Cached at: {path}")
    for f in os.listdir(path):
        if f.endswith(".csv"):
            dest = os.path.join(DATA_DIR, "diabetes.csv")
            shutil.copy(os.path.join(path, f), dest)
            print(f"   ✅ Saved → ml/data/diabetes.csv ({os.path.getsize(dest)} bytes)")
            return dest
    print("   ⚠️ No CSV found, listing files:", os.listdir(path))

if __name__ == "__main__":
    print("=" * 55)
    print("  Dataset Downloader — Prediksi Risiko Penyakit Muda")
    print("=" * 55)
    download_heart()
    download_diabetes()
    print("\n✅ All datasets downloaded to ml/data/")
    print("   Files:", os.listdir(DATA_DIR))
