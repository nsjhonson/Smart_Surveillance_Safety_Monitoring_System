import ControlPanel from './components/ControlPanel';
import AlertCard from './components/AlertCard';
import LiveFeed from './components/LiveFeed';
import BackendStatus from './components/BackendStatus';
import HistoryPanel from './components/HistoryPanel';
import { useAlerts } from './hooks/useSystem';
import { Shield, Sparkles, LayoutDashboard, History } from 'lucide-react';
import { useState, useEffect } from 'react';
import { soundManager } from './utils/SoundManager';

function App() {
  const { alerts, loading } = useAlerts();
  const [isRunning, setIsRunning] = useState(false);
  const [view, setView] = useState("dashboard"); // dashboard | history

  // Sound Alert Effect
  useEffect(() => {
    if (alerts.length > 0 && isRunning) {
      // Play sound if the latest alert is recent (less than 5 seconds old)
      const latestInfo = alerts[0];
      const alertTime = new Date(latestInfo.timestamp).getTime();
      const now = Date.now();

      if (now - alertTime < 5000) {
        soundManager.playSiren();
      }
    }
  }, [alerts, isRunning]);

  return (
    <div className="min-h-screen relative overflow-hidden bg-black text-white selection:bg-fuchsia-500/30 selection:text-fuchsia-200">
      <BackendStatus />

      {/* Background Aurora Effects */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[50vw] h-[50vh] bg-purple-600/20 rounded-full blur-[120px] aurora-blob"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[50vw] h-[50vh] bg-fuchsia-600/20 rounded-full blur-[120px] aurora-blob animation-delay-2000"></div>
        <div className="absolute top-[40%] left-[30%] w-[30vw] h-[30vh] bg-cyan-500/10 rounded-full blur-[100px] aurora-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto p-6 lg:p-12 space-y-8">

        {/* Header */}
        <header className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="relative group cursor-pointer" onClick={() => setView("dashboard")}>
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl blur opacity-40 group-hover:opacity-75 transition-opacity duration-500"></div>
              <div className="relative p-3.5 bg-black/80 backdrop-blur-xl border border-white/10 rounded-2xl">
                <Shield className="w-8 h-8 text-transparent bg-clip-text bg-gradient-to-br from-purple-400 to-pink-400 fill-current" />
              </div>
            </div>
            <div>
              <h1 className="text-4xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-purple-200 to-pink-200 drop-shadow-sm">
                Sentinel<span className="text-white/40 font-light">Core</span>
              </h1>
              <p className="text-white/50 font-medium tracking-wide text-sm flex items-center gap-2">
                <Sparkles className="w-3 h-3 text-yellow-400" />
                INTELLIGENT SURVEILLANCE SUITE
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-2 p-1 bg-white/5 backdrop-blur-md rounded-xl border border-white/10">
            <button
              onClick={() => setView("dashboard")}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold transition-all ${view === "dashboard"
                  ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg"
                  : "text-white/50 hover:text-white hover:bg-white/5"
                }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              Monitor
            </button>
            <button
              onClick={() => setView("history")}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold transition-all ${view === "history"
                  ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg"
                  : "text-white/50 hover:text-white hover:bg-white/5"
                }`}
            >
              <History className="w-4 h-4" />
              Archives
            </button>
          </div>
        </header>

        {/* MAIN VIEW CONTENT */}
        {view === "dashboard" ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-in fade-in slide-in-from-bottom-5 duration-700">

            {/* Main Feed Column (8 cols) */}
            <div className="lg:col-span-8 flex flex-col gap-8">
              <LiveFeed isRunning={isRunning} />
              <ControlPanel onStatusChange={setIsRunning} />
            </div>

            {/* Alerts Column (4 cols) */}
            <div className="lg:col-span-4 flex flex-col gap-6">
              <div className="flex items-center justify-between px-2">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
                  Live Alerts
                </h3>
                <span className="text-xs font-bold bg-white/10 px-2 py-1 rounded text-white/60">
                  {alerts.length} DETECTED
                </span>
              </div>

              <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar mask-image-b">
                {loading ? (
                  <div className="py-12 text-center text-white/30 animate-pulse">
                    Synchronizing...
                  </div>
                ) : alerts.length === 0 ? (
                  <div className="p-8 rounded-3xl border border-dashed border-white/10 bg-white/5 flex flex-col items-center justify-center text-center">
                    <Shield className="w-12 h-12 text-white/10 mb-3" />
                    <p className="text-white/40 font-medium">No Threats Detected</p>
                  </div>
                ) : (
                  alerts.map((alert) => (
                    <AlertCard key={alert.id} alert={alert} />
                  ))
                )}
              </div>
            </div>

          </div>
        ) : (
          <HistoryPanel />
        )}

      </div>
    </div>
  );
}

export default App;
