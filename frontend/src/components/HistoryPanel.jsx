import { useState, useEffect } from 'react';
import axios from 'axios';
import AlertCard from './AlertCard';
import { Search, Filter, Calendar } from 'lucide-react';

const API_URL = '';

const HistoryPanel = () => {
    const [alerts, setAlerts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("all"); // all, high-conf, today

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const res = await axios.get(`${API_URL}/alerts?limit=200`);
                setAlerts(res.data);
            } catch (e) {
                console.error("Failed to fetch history", e);
            } finally {
                setLoading(false);
            }
        };
        fetchHistory();
    }, []);

    const filteredAlerts = alerts.filter(a => {
        if (filter === "high-conf") return a.confidence > 0.85;
        if (filter === "today") {
            const date = new Date(a.timestamp);
            const today = new Date();
            return date.getDate() === today.getDate() &&
                date.getMonth() === today.getMonth() &&
                date.getFullYear() === today.getFullYear();
        }
        return true;
    });

    return (
        <div className="space-y-6 animate-in fade-in zoom-in duration-500">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white/5 p-6 rounded-[24px] backdrop-blur-md border border-white/10">
                <div>
                    <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
                        Security Archives
                    </h2>
                    <p className="text-white/40 text-sm">Reviewing past incidents and anomaly logs.</p>
                </div>

                <div className="flex bg-black/40 p-1 rounded-xl border border-white/10">
                    <button
                        onClick={() => setFilter("all")}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${filter === "all" ? "bg-white/10 text-white shadow-lg" : "text-white/40 hover:text-white"}`}
                    >
                        All Events
                    </button>
                    <button
                        onClick={() => setFilter("today")}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${filter === "today" ? "bg-white/10 text-white shadow-lg" : "text-white/40 hover:text-white"}`}
                    >
                        <Calendar className="w-3 h-3" /> Today
                    </button>
                    <button
                        onClick={() => setFilter("high-conf")}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${filter === "high-conf" ? "bg-white/10 text-white shadow-lg" : "text-white/40 hover:text-white"}`}
                    >
                        <Filter className="w-3 h-3" /> Critical
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {loading ? (
                    <div className="col-span-full py-20 text-center text-white/30 animate-pulse">
                        Retrieving encrypted logs...
                    </div>
                ) : filteredAlerts.length === 0 ? (
                    <div className="col-span-full py-20 text-center text-white/30">
                        No archives found matching your criteria.
                    </div>
                ) : (
                    filteredAlerts.map(alert => (
                        <AlertCard key={alert.id} alert={alert} />
                    ))
                )}
            </div>
        </div>
    );
};

export default HistoryPanel;
