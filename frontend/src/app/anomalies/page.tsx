"use client"
import React from 'react';

import AnomalyDetection from '@/components/AnomalyDetection';

const HomePage: React.FC = () => {
    const userId = 1; // Example user ID; in a real app, fetch from auth context

    return (
        <div className="p-8">
            <AnomalyDetection userId={userId} />
        </div>
    );
};

export default HomePage;
