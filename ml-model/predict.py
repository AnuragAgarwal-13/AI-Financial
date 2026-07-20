import sys
import os
import joblib
import numpy as np

# ==========================================
# GET CURRENT DIRECTORY
# ==========================================

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# ==========================================
# LOAD TRAINED MODEL
# ==========================================

model_path = os.path.join(BASE_DIR, "loan_model.pkl")
model = joblib.load(model_path)

# ==========================================
# READ INPUTS FROM NODE.JS
# ==========================================

age = float(sys.argv[1])
income = float(sys.argv[2])
loan_amount = float(sys.argv[3])
credit_score = float(sys.argv[4])

# ==========================================
# CREATE FEATURE VECTOR
# ==========================================

features = np.array([[
    age,
    income,
    loan_amount,
    credit_score
]])

# ==========================================
# PREDICT
# ==========================================

prediction = int(model.predict(features)[0])

# ==========================================
# CONVERT TO RISK LABEL
# ==========================================

if prediction == 0:
    print("LOW RISK")
else:
    print("HIGH RISK")