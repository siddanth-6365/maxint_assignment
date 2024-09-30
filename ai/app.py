from flask import Flask, request, jsonify
import pandas as pd
from spending_forecast import forecast_spending
from anomaly_detection import detect_anomalies

app = Flask(__name__)

@app.route('/forecast', methods=['POST'])
def forecast():
    data = request.json
    transactions = pd.DataFrame(data['transactions'])
    periods = data.get('periods', 6)
    forecast_df = forecast_spending(transactions, periods)
    return jsonify(forecast_df.to_dict(orient='records'))

@app.route('/anomalies', methods=['POST'])
def anomalies():
    data = request.json
    transactions = pd.DataFrame(data['transactions'])
    anomalies_df = detect_anomalies(transactions)
    return jsonify(anomalies_df.to_dict(orient='records'))

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001)
