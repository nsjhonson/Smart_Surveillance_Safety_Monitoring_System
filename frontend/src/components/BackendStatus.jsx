import { useState, useEffect } from 'react';
import axios from 'axios';
import { Wifi, WifiOff } from 'lucide-react';

const API_URL = '';

const BackendStatus = () => {
    const [isOnline, setIsOnline] = useState(false);

    useEffect(() => {
        const checkHealth = async () => {
            try {
                await axios.get(`${API_URL}/`);
                setIsOnline(true);
            } catch (e) {
                setIsOnline(false);
            }
        };

        checkHealth();
        const interval = setInterval(checkHealth, 5000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className={`fixed bottom-4 right-4 px-3 py-1.5 rounded-full flex items-center gap-2 text-xs font-medium border ${isOnline ? "bg-green-900/20 text-green-400 border-green-800" : "bg-red-900/20 text-red-400 border-red-800"}`}>
            {isOnline ? <Wifi className="w-3 h-3" /> : <WifiOff className="w-3 h-3" />}
            {isOnline ? "Server Online" : "Server Disconnected"}
        </div>
    );
};

export default BackendStatus;
