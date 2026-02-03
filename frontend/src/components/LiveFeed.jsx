import { useState, useEffect } from 'react';
import { Camera, Zap } from 'lucide-react';

const API_URL = '';

const LiveFeed = ({ isRunning }) => {
    const [timestamp, setTimestamp] = useState(Date.now());

    useEffect(() => {
        if (isRunning) {
            setTimestamp(Date.now());
        }
    }, [isRunning]);

    if (!isRunning) {
        return (
            <div className="w-full aspect-video bg-white/5 backdrop-blur-sm rounded-[32px] border border-white/10 flex flex-col items-center justify-center text-white/40 relative overflow-hidden group hover:border-white/20 transition-all duration-500">
                <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/10 via-transparent to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>

                <div className="p-6 rounded-full bg-black/20 border border-white/5 mb-4 group-hover:scale-110 transition-transform duration-500">
                    <Camera className="w-10 h-10 opacity-50" />
                </div>
                <p className="font-medium tracking-wide">SYSTEM OFFLINE</p>
            </div>
        );
    }

    return (
        <div className="relative w-full aspect-video bg-black rounded-[32px] overflow-hidden shadow-2xl shadow-purple-900/20 border border-white/10 group transform transition-transform hover:scale-[1.01] duration-500">

            <img
                src={`${API_URL}/video_feed?t=${timestamp}`}
                alt="Live Surveillance Feed"
                className="w-full h-full object-contain"
                onError={(e) => { e.target.style.display = 'none'; }}
            />

            {/* Aesthetic Overlay */}
            <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/80 to-transparent pointer-events-none"></div>

            {/* Floating Badge */}
            <div className="absolute top-6 right-6 flex items-center gap-2 pl-2 pr-4 py-2 bg-black/60 backdrop-blur-xl border border-white/10 rounded-full">
                <div className="relative">
                    <div className="w-2.5 h-2.5 bg-red-500 rounded-full animate-ping absolute opacity-75"></div>
                    <div className="w-2.5 h-2.5 bg-red-500 rounded-full relative shadow-[0_0_10px_#ef4444]"></div>
                </div>
                <span className="text-xs font-bold tracking-wider text-white">LIVE FEED</span>
            </div>

            {/* Tech Decoration */}
            <div className="absolute bottom-6 left-6 flex items-center gap-3 text-white/70">
                <div className="p-2 bg-white/10 rounded-lg backdrop-blur-md border border-white/5">
                    <Zap className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                </div>
                <div className="text-xs font-medium">
                    <span className="text-white/40 block text-[10px] font-bold tracking-wider uppercase">Connection</span>
                    SECURE • ENCRYPTED
                </div>
            </div>
        </div>
    );
};

export default LiveFeed;
