"use client"
import React from 'react'
import Forecast from '@/components/Forecast';

const page = () => {
    const userId = 1; // Example user ID; in a real app, fetch from auth context

    return (
        <div className="p-8">
            <Forecast userId={userId} />

        </div>
    );
}

export default page