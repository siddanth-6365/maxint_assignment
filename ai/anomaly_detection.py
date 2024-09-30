import pandas as pd
from sklearn.ensemble import IsolationForest

def detect_anomalies(transactions_df):
    df = transactions_df.copy()

    df['amount'] = pd.to_numeric(df['amount'], errors='coerce')

    # Drop rows with invalid or missing amounts
    df = df.dropna(subset=['amount'])

    # Consider only expenses (negative amounts)
    df = df[df['amount'] < 0]

    # Take absolute values of expenses for anomaly detection
    df['amount_abs'] = df['amount'].abs()

    # Select relevant features: 'amount_abs', 'category', and 'date' (if available)
    # Encode 'category' column to numeric values if it's present
    if 'category' in df.columns:
        df['category_encoded'] = pd.factorize(df['category'])[0]

    # Using 'amount_abs' for basic anomaly detection, adding 'category_encoded' for a comprehensive model
    features = ['amount_abs']
    if 'category' in df.columns:
        features.append('category_encoded')

    # Apply Isolation Forest for anomaly detection
    model = IsolationForest(contamination=0.05, random_state=42)
    df['anomaly'] = model.fit_predict(df[features])

    # Extract detected anomalies
    anomalies = df[df['anomaly'] == -1]

    return anomalies