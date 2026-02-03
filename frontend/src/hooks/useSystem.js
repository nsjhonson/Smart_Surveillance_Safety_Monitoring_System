import { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = '';

export function useAlerts() {
    const [alerts, setAlerts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAlerts = async () => {
            try {
                const response = await axios.get(`${API_URL}/alerts?limit=50`);
                setAlerts(response.data);
            } catch (error) {
                console.error("Failed to fetch alerts", error);
            } finally {
                setLoading(false);
            }
        };

        fetchAlerts();
        const interval = setInterval(fetchAlerts, 2000); // Poll every 2s

        return () => clearInterval(interval);
    }, []);

    return { alerts, loading };
}

export const startDetection = async (source) => {
    try {
        const res = await axios.post(`${API_URL}/control/start?source=${source || 0}`);
        return res.data;
    } catch (err) {
        console.error(err);
        throw err;
    }
};

export const stopDetection = async () => {
    try {
        const res = await axios.post(`${API_URL}/control/stop`);
        return res.data;
    } catch (err) {
        console.error(err);
        throw err;
    }
};
