import pandas as pd
from sklearn.ensemble import IsolationForest

def detect_anomalies(transactions_df):
    df = transactions_df.copy()

    df['amount'] = pd.to_numeric(df['amount'], errors='coerce')

    df = df.dropna(subset=['amount'])

    df = df[df['amount'] < 0]

    df['amount_abs'] = df['amount'].abs()

    if 'category' in df.columns:
        df['category_encoded'] = pd.factorize(df['category'])[0]

    features = ['amount_abs']
    if 'category' in df.columns:
        features.append('category_encoded')

    # Apply Isolation Forest for anomaly detection
    model = IsolationForest(contamination=0.05, random_state=42)
    df['anomaly'] = model.fit_predict(df[features])

    # Extract detected anomalies
    anomalies = df[df['anomaly'] == -1]

    return anomalies