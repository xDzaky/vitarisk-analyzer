const DISEASES = ["heart", "diabetes", "cholesterol"];
const RISK_LEVELS = ["Rendah", "Sedang", "Tinggi"];
const FACILITY_TYPES = ["hospital", "clinic"];

const SEX_VALUES = ["laki-laki", "perempuan", "male", "female", "l", "p", "0", "1", 0, 1];
const YES_NO_VALUES = ["ya", "tidak", "yes", "no", "true", "false", "0", "1", 0, 1, true, false];

const predictionSchemas = {
  heart: {
    required: [
      "age",
      "sex",
      "cp",
      "trestbps",
      "chol",
      "fbs",
      "thalach",
      "exang",
      "family_history",
      "smoking",
    ],
    numeric: ["age", "trestbps", "chol", "thalach", "oldpeak", "restecg", "slope", "ca", "thal"],
    enums: {
      sex: SEX_VALUES,
      fbs: YES_NO_VALUES,
      exang: YES_NO_VALUES,
      family_history: YES_NO_VALUES,
    },
  },
  diabetes: {
    required: [
      "age",
      "sex",
      "glucose",
      "blood_pressure",
      "family_history",
      "diet_sweet",
      "exercise_freq",
    ],
    requiredOneOf: [["bmi", "weight_kg"]],
    requiredTogether: [["weight_kg", "height_cm"]],
    numeric: [
      "age",
      "bmi",
      "glucose",
      "blood_pressure",
      "skin_thickness",
      "insulin",
      "pregnancies",
      "weight_kg",
      "height_cm",
    ],
    enums: {
      sex: SEX_VALUES,
      family_history: YES_NO_VALUES,
    },
  },
  cholesterol: {
    required: [
      "age",
      "sex",
      "trestbps",
      "diet_fat",
      "exercise_freq",
      "smoking",
      "family_history",
    ],
    numeric: ["age", "trestbps", "fbs", "restecg", "thalach", "oldpeak", "slope"],
    enums: {
      sex: SEX_VALUES,
      family_history: YES_NO_VALUES,
    },
  },
};

module.exports = {
  DISEASES,
  RISK_LEVELS,
  FACILITY_TYPES,
  predictionSchemas,
};
