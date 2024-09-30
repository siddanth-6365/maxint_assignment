import React, { useState } from 'react';
import axios from 'axios';

const AnomalyDetection: React.FC<{ userId: number }> = ({ userId }) => {
  const [anomalies, setAnomalies] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAnomalies = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post('/api/ai/anomalies', { userId });
      setAnomalies(response.data);
    } catch (err) {
      setError('Failed to detect anomalies.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="anomaly-detection mt-8">
      <h2 className="text-2xl font-semibold mb-4">Anomaly Detection</h2>
      <button onClick={fetchAnomalies} className="bg-red-500 hover:bg-red-600 text-white p-2 rounded">
        {loading ? 'Loading...' : 'Detect Anomalies'}
      </button>
      {error && <p className="text-red-500 mt-2">{error}</p>}

      {anomalies.length > 0 && (
        <div className="mt-6 overflow-x-auto">
          <h3 className="text-lg font-medium mb-4">Unusual Transactions</h3>
          <table className="table-auto w-full border-collapse border text-black border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="px-4 py-2 border border-gray-300 text-left">Date</th>
                <th className="px-4 py-2 border border-gray-300 text-left">Category</th>
                <th className="px-4 py-2 border border-gray-300 text-left">Amount</th>
                {/* <th className="px-4 py-2 border border-gray-300 text-left">Description</th> */}
              </tr>
            </thead>
            <tbody>
              {anomalies.map((txn, index) => (
                <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-100'}>
                  <td className="px-4 py-2 border border-gray-300">
                    {new Date(txn.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: '2-digit',
                    })}
                  </td>
                  <td className="px-4 py-2 border border-gray-300">{txn.category}</td>
                  <td className={`px-4 py-2 border border-gray-300 ${txn.amount < 0 ? 'text-red-500' : 'text-green-500'}`}>
                    ${Math.abs(txn.amount).toFixed(2)}
                  </td>
                  {/* <td className="px-4 py-2 border border-gray-300">{txn.description}</td> */}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {anomalies.length === 0 && !loading && (
        <p className="mt-4 text-gray-600">No anomalies detected at this time.</p>
      )}
    </div>
  );
};

export default AnomalyDetection;
