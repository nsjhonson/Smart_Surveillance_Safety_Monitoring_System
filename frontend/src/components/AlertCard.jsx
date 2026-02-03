import { AlertTriangle, User, ShieldAlert } from 'lucide-react';

const AlertCard = ({ alert }) => {
    const time = new Date(alert.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const conf = (alert.confidence * 100).toFixed(0);

    return (
        <div className="relative group bg-white/5 hover:bg-white/10 backdrop-blur-lg border border-white/5 hover:border-white/20 rounded-2xl p-4 transition-all duration-300 hover:-translate-y-1">

            {/* Decoration */}
            <div className={`absolute left-0 top-4 bottom-4 w-1 rounded-r-full transition-colors ${alert.violation_type.includes("Mask") ? "bg-orange-500" : "bg-red-500 shadow-[0_0_10px_#ef4444]"
                }`}></div>

            <div className="flex items-start gap-4 pl-3">
                <div className={`p-3 rounded-xl ${alert.violation_type.includes("Mask")
                        ? "bg-orange-500/20 text-orange-400"
                        : "bg-red-500/20 text-red-400"
                    }`}>
                    {alert.violation_type.includes("Mask") ? <User className="w-5 h-5" /> : <ShieldAlert className="w-5 h-5" />}
                </div>

                <div className="flex-1">
                    <div className="flex justify-between items-start">
                        <h4 className="font-bold text-white text-sm group-hover:text-purple-200 transition-colors">
                            {alert.violation_type}
                        </h4>
                        <span className="text-[10px] font-bold text-white/40 bg-white/5 px-2 py-1 rounded-md">
                            {time}
                        </span>
                    </div>

                    <div className="flex items-center gap-2 mt-2">
                        <span className="text-xs bg-black/40 px-2 py-0.5 rounded text-white/60 border border-white/5">
                            CAM-{alert.camera_source}
                        </span>
                        <span className={`text-xs font-bold ${Number(conf) > 90 ? "text-green-400" : "text-yellow-400"
                            }`}>
                            {conf}% Match
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AlertCard;
