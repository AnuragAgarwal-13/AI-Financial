import pandas as pd

# Load dataset
data = pd.read_csv("../dataset/Loan_default.csv")

# Remove ID column
data = data.drop("LoanID", axis=1)

# Remove duplicates
data = data.drop_duplicates()

# Save cleaned data (IMPORTANT)
data.to_csv("../dataset/cleaned_loan.csv", index=False)

print("Data cleaning completed ✅")
print(data.head())