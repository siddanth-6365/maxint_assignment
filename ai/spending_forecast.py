import pandas as pd
from prophet import Prophet

def forecast_spending(transactions_df, periods=12):
    transactions_df['amount'] = pd.to_numeric(transactions_df['amount'], errors='coerce')

    transactions_df = transactions_df.dropna(subset=['amount'])

    transactions_df['date'] = pd.to_datetime(transactions_df['date'])
    monthly_spend = transactions_df.groupby(pd.Grouper(key='date', freq='M')).sum().reset_index()

    monthly_spend = monthly_spend.rename(columns={'date': 'ds', 'amount': 'y'})

    monthly_spend['ds'] = monthly_spend['ds'].dt.tz_localize(None)
    
    model = Prophet()
    model.fit(monthly_spend)

    # Create future dataframe
    future = model.make_future_dataframe(periods=periods, freq='M')
    forecast = model.predict(future)

    return forecast[['ds', 'yhat', 'yhat_lower', 'yhat_upper']]
