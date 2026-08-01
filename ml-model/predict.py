import sys

# ==========================================
# READ INPUTS FROM NODE.JS
# ==========================================

age = float(sys.argv[1])
income = float(sys.argv[2])
loan_amount = float(sys.argv[3])
credit_score = float(sys.argv[4])

# ==========================================
# RULE-BASED RISK PREDICTION
# ==========================================

# Rule 1: Senior Citizen
if age > 60:
    print("HIGH RISK")

# Rule 2: Loan amount too high compared to income
elif loan_amount > income * 50:
    print("HIGH RISK")

# Rule 3: Credit Score
elif credit_score <= 350:
    print("HIGH RISK")

elif credit_score <= 650:
    print("MEDIUM RISK")

else:
    print("LOW RISK")