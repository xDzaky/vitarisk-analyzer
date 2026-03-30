"""
Simple smoke test for the local Flask ML API.
Run after starting `python api/app.py`.
"""

from __future__ import annotations

import sys

import requests


BASE_URL = "http://127.0.0.1:5001"
TIMEOUT_SECONDS = 10

SAMPLE_PAYLOADS = {
    "heart": {
        "age": 24,
        "sex": "laki-laki",
        "cp": "nyeri ringan",
        "trestbps": 126,
        "chol": 210,
        "fbs": "tidak",
        "thalach": 156,
        "exang": "tidak",
        "family_history": "ya",
        "smoking": "kadang-kadang",
    },
    "diabetes": {
        "age": 24,
        "sex": "perempuan",
        "glucose": 110,
        "blood_pressure": 72,
        "bmi": 23.5,
        "family_history": "tidak",
        "diet_sweet": "jarang",
        "exercise_freq": "3x seminggu",
    },
    "cholesterol": {
        "age": 24,
        "sex": "laki-laki",
        "trestbps": 122,
        "diet_fat": "3-5x seminggu",
        "exercise_freq": "3x seminggu",
        "smoking": "tidak",
        "family_history": "tidak",
    },
}


def assert_ok(response: requests.Response, context: str) -> dict:
    if response.status_code != 200:
        raise RuntimeError(f"{context} gagal dengan status {response.status_code}: {response.text}")
    return response.json()


def run_health_check():
    response = requests.get(f"{BASE_URL}/health", timeout=TIMEOUT_SECONDS)
    payload = assert_ok(response, "Health check")
    print("[OK] /health")
    print(f"     status={payload.get('status')}")


def run_prediction_checks():
    for disease, payload in SAMPLE_PAYLOADS.items():
        response = requests.post(
            f"{BASE_URL}/predict/{disease}",
            json=payload,
            timeout=TIMEOUT_SECONDS,
        )
        data = assert_ok(response, f"Predict {disease}")
        print(f"[OK] /predict/{disease}")
        print(
            "     "
            f"risk_level={data.get('risk_level')} "
            f"risk_percent={data.get('risk_percent')} "
            f"base_probability={data.get('base_probability')}"
        )


def main():
    try:
        run_health_check()
        run_prediction_checks()
    except Exception as exc:
        print(f"[FAIL] {exc}")
        sys.exit(1)

    print("[DONE] Semua endpoint ML merespons dengan baik.")


if __name__ == "__main__":
    main()
