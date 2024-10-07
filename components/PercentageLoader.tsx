import { Loader2 } from 'lucide-react';
import React, { useState, useEffect } from 'react';

const PercentageLoader = () => {
    const [loading, setLoading] = useState(false);
    const [percentage, setPercentage] = useState(0);

    const simulateApiRequest = async (updateProgress: (value: number) => void) => {
        const steps = [15, 30, 50, 70, 75, 80, 85, 90, 95, 100];
        for (const step of steps) {
            await new Promise(resolve => setTimeout(resolve, 1400));
            updateProgress(step);
        }
    };

    const startLoader = async () => {
        setLoading(true);
        setPercentage(0);
        await simulateApiRequest(setPercentage);
        setLoading(false);
    };

    useEffect(() => {
        startLoader();
    }, []);

    return (
        <div className="relative font-mono flex items-center justify-center h-64 w-64">
            <div className={`relative transition-all duration-500 ${loading ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
                <Loader2 className="text-blue-700 animate-spin" size={100} strokeWidth={0.5} />
                <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-white text-xl font-medium">{percentage}%</span>
                </div>
            </div>
        </div>
    );
};

export default PercentageLoader;