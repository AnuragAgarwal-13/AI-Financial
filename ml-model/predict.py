import sys
import os
import joblib
import numpy as np

# 🔹 Get current folder
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# 🔹 Load model
model_path = os.path.join(BASE_DIR, "loan_model.pkl")
model = joblib.load(model_path)

# 🔹 Get inputs from Node.js
age = float(sys.argv[1])
income = float(sys.argv[2])
loan_amount = float(sys.argv[3])
credit_score = float(sys.argv[4])

# 🔹 Create feature array (must match training)
features = [age, income, loan_amount, credit_score]
features = np.array([features])

# 🔹 Predict
prediction = model.predict(features)

# 🔹 Output result
print(prediction[0])