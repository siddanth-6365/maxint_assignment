"use client";
import React, { useState, useEffect } from 'react';
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

// Add this interface definition after the imports
interface ChartData {
    labels: number[];
    datasets: {
        label: string;
        data: number[];
        borderColor: string;
        backgroundColor: string;
        fill: boolean;
    }[];
}

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

const TVMCalculator: React.FC = () => {
    const [inputs, setInputs] = useState({
        pv: '',
        rate: '',
        years: '',
        inflationRate: '',
        calcType: 'FV',
    });

    const [result, setResult] = useState<number | null>(null);

    const [chartData, setChartData] = useState<ChartData | null>(null);
    const [errors, setErrors] = useState<string[]>([]);

    useEffect(() => {
        const fetchInflationRate = async () => {
            try {
                const response = await axios.get('/api/inflationRate');
                console.log('Inflation Rate:', response.data.inflationRate);
                setInputs((prevInputs) => ({
                    ...prevInputs,
                    inflationRate: response.data.inflationRate.toString(),
                }));
            } catch (error) {
                console.error('Error fetching inflation rate:', error);
            }
        };

        fetchInflationRate();
    }, []);

    const calculateFV = (pv: number, rate: number, years: number): number => {
        return pv * Math.pow(1 + rate, years);
    };

    const calculatePV = (fv: number, rate: number, years: number): number => {
        return fv / Math.pow(1 + rate, years);
    };

    const performCalculations = () => {
        const errorMessages: string[] = [];

        const pv = parseFloat(inputs.pv);
        const rateInput = parseFloat(inputs.rate) / 100;
        const years = parseFloat(inputs.years);
        const inflationRateInput = inputs.inflationRate
            ? parseFloat(inputs.inflationRate) / 100
            : 0;

        // Input validation
        if (isNaN(pv) || pv <= 0) {
            errorMessages.push('Present Value must be greater than 0.');
        }
        if (isNaN(rateInput)) {
            errorMessages.push('Please enter a valid Interest Rate.');
        }
        if (isNaN(years) || years <= 0) {
            errorMessages.push('Time Period must be greater than 0.');
        }

        if (errorMessages.length > 0) {
            setErrors(errorMessages);
            return;
        } else {
            setErrors([]);
        }

        // Adjust the rate for inflation
        const rate = (1 + rateInput) / (1 + inflationRateInput) - 1;

        let resultValue: number;
        if (inputs.calcType === 'FV') {
            resultValue = calculateFV(pv, rate, years);
        } else {
            resultValue = calculatePV(pv, rate, years);
        }

        setResult(resultValue);
        generateChartData(pv, rate, years);
    };

    const generateChartData = (pv: number, rate: number, years: number) => {
        const dataPointsWithInflation: number[] = [];
        const dataPointsWithoutInflation: number[] = [];
        const yearsArray: number[] = [];

        const nominalRate = parseFloat(inputs.rate) / 100;

        for (let i = 0; i <= years; i++) {
            yearsArray.push(i);
            const valueWithInflation = calculateFV(pv, rate, i);
            const valueWithoutInflation = calculateFV(pv, nominalRate, i);
            dataPointsWithInflation.push(valueWithInflation);
            dataPointsWithoutInflation.push(valueWithoutInflation);
        }

        setChartData({
            labels: yearsArray,
            datasets: [
                {
                    label: 'With Inflation Adjustment',
                    data: dataPointsWithInflation,
                    borderColor: 'rgba(75,192,192,1)',
                    backgroundColor: 'rgba(75,192,192,0.2)',
                    fill: false,
                },
                {
                    label: 'Without Inflation Adjustment',
                    data: dataPointsWithoutInflation,
                    borderColor: 'rgba(192,75,75,1)',
                    backgroundColor: 'rgba(192,75,75,0.2)',
                    fill: false,
                },
            ],
        });
    };

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        setInputs({ ...inputs, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        performCalculations();
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">
                Time Value of Money Calculator
            </h1>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 max-w-md ">
                <label>
                    Present Value (PV):
                    <input
                        type="number"
                        name="pv"
                        value={inputs.pv}
                        onChange={handleChange}
                        placeholder="Enter Present Value"
                        className="border p-2 text-black w-full"
                        required
                    />
                </label>
                <label>
                    Annual Interest Rate (%):
                    <input
                        type="number"
                        name="rate"
                        value={inputs.rate}
                        onChange={handleChange}
                        placeholder="Enter Interest Rate"
                        className="border p-2 text-black w-full"
                        required
                    />
                </label>
                <label>
                    Time Period (Years):
                    <input
                        type="number"
                        name="years"
                        value={inputs.years}
                        onChange={handleChange}
                        placeholder="Enter Time Period"
                        className="border p-2 text-black w-full"
                        required
                    />
                </label>
                <label>
                    Inflation Rate (%) (Current Rate as per FRED is {inputs.inflationRate}%):
                    <input
                        type="number"
                        name="inflationRate"
                        value={inputs.inflationRate}
                        onChange={handleChange}
                        placeholder="Enter Inflation Rate"
                        className="border p-2 text-black w-full"
                    />
                </label>
                <label>
                    Calculation Type:
                    <select
                        name="calcType"
                        value={inputs.calcType}
                        onChange={handleChange}
                        className="border p-2 text-black w-full"
                    >
                        <option value="FV">Calculate Future Value</option>
                        <option value="PV">Calculate Present Value</option>
                    </select>
                </label>
                <button type="submit" className="bg-blue-500 text-white p-2">
                    Calculate
                </button>
            </form>

            {errors.length > 0 && (
                <div className="mt-4 text-red-500">
                    {errors.map((error, index) => (
                        <p key={index}>{error}</p>
                    ))}
                </div>
            )}

            {result !== null && (
                <div className="result mt-4">
                    <h2 className="text-xl">
                        {inputs.calcType === 'FV' ? 'Future Value' : 'Present Value'}: $
                        {result.toFixed(2)}
                    </h2>
                </div>
            )}

            {chartData && (
                <div className="chart mt-4">
                    <Line data={chartData} />
                </div>
            )}
        </div>
    );
};

export default TVMCalculator;
