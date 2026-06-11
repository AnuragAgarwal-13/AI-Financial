import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix
from sklearn.utils import resample
import joblib

# 🔹 Load dataset
data = pd.read_csv("../dataset/Loan_default.csv")

# 🔹 Remove ID column
data = data.drop("LoanID", axis=1)

# 🔹 Select required columns
data = data[['Age', 'Income', 'LoanAmount', 'CreditScore', 'Default']]

# 🔹 Rename columns
data.columns = ['age', 'income', 'loan_amount', 'credit_score', 'default']

# 🔹 Check class distribution
print("Before balancing:")
print(data['default'].value_counts())

# 🔥 HANDLE IMBALANCE (VERY IMPORTANT)

# Separate classes
df_majority = data[data.default == 0]
df_minority = data[data.default == 1]

# Upsample minority class
df_minority_upsampled = resample(
    df_minority,
    replace=True,
    n_samples=len(df_majority),
    random_state=42
)

# Combine both
data = pd.concat([df_majority, df_minority_upsampled])

# Shuffle dataset
data = data.sample(frac=1, random_state=42)

print("\nAfter balancing:")
print(data['default'].value_counts())

# 🔹 Features & target
X = data[['age', 'income', 'loan_amount', 'credit_score']]
y = data['default']

# 🔹 Train-test split
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# 🔥 Improved model
model = RandomForestClassifier(
    n_estimators=200,
    max_depth=10,
    class_weight='balanced',
    random_state=42
)

# 🔹 Train
model.fit(X_train, y_train)

# 🔹 Predict
y_pred = model.predict(X_test)

# 🔹 Evaluation
print("\nModel Accuracy:", accuracy_score(y_test, y_pred))

print("\nConfusion Matrix:")
print(confusion_matrix(y_test, y_pred))

print("\nClassification Report:")
print(classification_report(y_test, y_pred))

# 🔹 Save model
joblib.dump(model, "loan_model.pkl")

print("\nModel saved successfully ✅")