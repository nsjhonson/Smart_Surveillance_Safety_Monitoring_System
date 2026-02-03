import { useState } from 'react';
import { Play, Square, Loader, Radio } from 'lucide-react';
import { startDetection, stopDetection } from '../hooks/useSystem';

const ControlPanel = ({ onStatusChange }) => {
    const [status, setStatus] = useState("idle");
    const [source, setSource] = useState("0");

    const handleStart = async () => {
        setStatus("processing");
        try {
            await startDetection(source);
            setStatus("running");
            if (onStatusChange) onStatusChange(true);
        } catch (e) {
            console.error(e);
            setStatus("idle");
            if (onStatusChange) onStatusChange(false);
            alert(`Error: ${e.message}`);
        }
    };

    const handleStop = async () => {
        setStatus("processing");
        try {
            await stopDetection();
            setStatus("idle");
            if (onStatusChange) onStatusChange(false);
        } catch (e) {
            console.error(e);
            setStatus("running");
        }
    };

    return (
        <div className="p-1 rounded-[32px] bg-gradient-to-br from-white/10 to-white/0 border border-white/10 backdrop-blur-md shadow-xl text-white">
            <div className="bg-black/40 rounded-[28px] p-8">

                <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                    System Control
                    {status === "running" && (
                        <span className="px-3 py-1 rounded-full bg-green-500/20 text-green-400 text-xs font-bold border border-green-500/30">
                            ACTIVE
                        </span>
                    )}
                </h2>

                <div className="flex flex-col md:flex-row gap-6">
                    <div className="flex-1 space-y-3">
                        <label className="text-sm font-medium text-white/50 pl-1">Input Source</label>
                        <div className="relative group">
                            <input
                                type="text"
                                value={source}
                                onChange={(e) => setSource(e.target.value)}
                                className="w-full bg-white/5 text-white placeholder-white/20 px-6 py-4 rounded-2xl border border-white/10 focus:border-purple-500/50 focus:bg-white/10 focus:ring-4 focus:ring-purple-500/10 transition-all outline-none font-medium"
                                placeholder="Camera ID (0) or RTSP Link"
                            />
                            <Radio className="absolute right-5 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-purple-400 transition-colors pointer-events-none" />
                        </div>
                    </div>

                    <div className="flex gap-4 md:w-auto items-end">
                        <button
                            onClick={handleStart}
                            disabled={status === "running" || status === "processing"}
                            className="h-[58px] px-8 rounded-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 disabled:opacity-50 disabled:grayscale transition-all shadow-lg shadow-purple-900/40 hover:scale-105 active:scale-95 flex items-center gap-2"
                        >
                            {status === "processing" ? <Loader className="animate-spin w-5 h-5" /> : <Play className="w-5 h-5 fill-current" />}
                            <span>Scan</span>
                        </button>

                        <button
                            onClick={handleStop}
                            disabled={status === "idle" || status === "processing"}
                            className="h-[58px] px-6 rounded-2xl font-bold bg-white/5 hover:bg-white/10 border border-white/10 disabled:opacity-50 transition-all hover:text-red-400 hover:border-red-500/30 active:scale-95 flex items-center gap-2"
                        >
                            <Square className="w-5 h-5 fill-current" />
                            <span className="hidden md:inline">Stop</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ControlPanel;
