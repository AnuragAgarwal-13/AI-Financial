# AI Financial Risk

AI Financial Risk is a full-stack financial planning dashboard that helps users estimate loan risk, calculate EMI, track expenses, and plan savings. The project combines a React frontend, an Express backend, and machine-learning scripts for credit-risk analysis.

## Features

- AI-powered loan risk prediction
- EMI calculator with salary-to-EMI insight
- Expense tracker with monthly savings summary
- Savings planner with goal-based recommendations
- Interactive dashboard with charts for risk, EMI, expenses, and savings

## Tech Stack

- Frontend: React + Vite + Tailwind CSS
- Backend: Node.js + Express
- Data & ML: Python, pandas, scikit-learn, joblib

## Project Structure

- frontend/ — user interface and dashboard components
- backend/ — Express API server
- ml-model/ — data cleaning, training, and prediction scripts
- dataset/ — Loan default dataset used for model experiments

## Getting Started

### 1. Install dependencies

Frontend

```bash
cd frontend
npm install
```

Backend

```bash
cd backend
npm install
```

ML tools (optional for model training)

```bash
pip install pandas scikit-learn joblib
```

### 2. Run the app

Start the backend server:

```bash
cd backend
node server.js
```

Start the frontend:

```bash
cd frontend
npm run dev
```

The frontend will usually run at http://localhost:5173 and the backend at http://localhost:5000.

### 3. Train the ML model (optional)

```bash
cd ml-model
python train_model.py
```

This generates the model file used by the prediction workflow.

## Default Login

For the current UI flow, use:

- Email: admin@gmail.com
- Password: 1234

## API

The backend currently exposes:

- GET / — health check
- POST /predict — returns a loan risk category and explanation

## Notes

- The current backend risk logic is a rule-based prediction endpoint.
- The ML scripts in the ml-model folder are available for training and experimentation with the dataset.

## License

This project is for learning and demonstration purposes.
