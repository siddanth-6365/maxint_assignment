import React, { useState } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const Forecast: React.FC<{ userId: number }> = ({ userId }) => {
  const [forecastData, setForecastData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPastData, setShowPastData] = useState(false);

  const fetchForecast = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post('/api/ai/forecast', { userId });
      setForecastData(response.data);
    } catch (err) {
      setError('Failed to fetch forecast.');
    } finally {
      setLoading(false);
    }
  };

  const filteredData = forecastData
    ? showPastData
      ? forecastData
      : forecastData.filter((item: any) => new Date(item.ds) > new Date())
    : [];

  // Prepare chart data with formatted dates
  const chartData = forecastData
    ? {
      labels: filteredData.map((item: any) =>
        new Date(item.ds).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
        })
      ),
      datasets: [
        {
          label: 'Predicted Spending',
          data: filteredData.map((item: any) => item.yhat),
          borderColor: 'rgba(75,192,192,1)',
          fill: false,
        },
      ],
    }
    : null;

  return (
    <div className="forecast mt-8 p-6 text-black bg-gray-100 shadow-lg rounded-md">
      <h2 className="text-3xl font-bold text-black mb-6 text-center">Spending Forecast</h2>
      <p className="text-gray-700 mb-6 text-center">
        This graph predicts your spending trend for the upcoming months based on your past financial transactions.
        <br />
        <span className="font-semibold">Positive values</span> indicate expected expenses, while <span className="font-semibold">negative values</span> suggest a net income or savings for that month.
      </p>
      <div className="text-center mb-6">
        <button
          onClick={fetchForecast}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded shadow transition-all duration-300"
        >
          {loading ? 'Loading...' : 'Get Forecast'}
        </button>
        <div className="mt-4">
          <label className="inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="form-checkbox h-5 w-5 text-green-600"
              checked={showPastData}
              onChange={() => setShowPastData(!showPastData)}
            />
            <span className="ml-2 text-gray-800">Show Historical Data</span>
          </label>
        </div>
      </div>
      {error && <p className="text-red-500 text-center mt-2">{error}</p>}
      {chartData && (
        <div className="mt-8">
          <Line
            data={chartData}
            options={{
              responsive: true,
              plugins: {
                title: {
                  display: true,
                  text: 'Monthly Predicted Spending vs Time',
                  font: {
                    size: 18,
                    weight: 'bold',
                  },
                  color: '#333',
                },
                tooltip: {
                  callbacks: {
                    label: function (context) {
                      const value = context.parsed.y;
                      return value >= 0
                        ? `Predicted Spending: $${value.toFixed(2)}`
                        : `Predicted Savings: $${Math.abs(value).toFixed(2)}`;
                    },
                  },
                },
              },
              scales: {
                y: {
                  title: {
                    display: true,
                    text: 'Spending Amount (in your currency)',
                    font: {
                      size: 14,
                      weight: 'bold',
                    },
                    color: '#333',
                  },
                  ticks: {
                    font: {
                      size: 12,
                    },
                  },
                },
                x: {
                  title: {
                    display: true,
                    text: 'Month',
                    font: {
                      size: 14,
                      weight: 'bold',
                    },
                    color: '#333',
                  },
                  ticks: {
                    font: {
                      size: 12,
                    },
                  },
                },
              },
            }}
          />
        </div>
      )}
    </div>
  );
};

export default Forecast;