import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Droplet, Coffee, Moon, Smile, Target, LogOut } from "lucide-react";
import { Button } from "./ui/button";
import "../app.css";
import { BASE_URL } from "../constants/API";


interface SidebarNavProps {
  onQuickAction: (action: string) => void;
  onLogout: () => void;
}

interface ProgressData {
  focusHours: number;
  waterGlasses: number;
  sleepHours: number;
}

export function SidebarNav({ onQuickAction, onLogout }: SidebarNavProps) {
  const [progress, setProgress] = useState<ProgressData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const firstLetter = user?.name?.charAt(0).toUpperCase() || "T";
  const displayName = user?.name || "Your Twin";

  useEffect(() => {
    async function fetchProgress() {
      if (!user?.id) return;
      try {
        const res = await fetch(`${BASE_URL}/api/user/health/${user.id}`);
        if (!res.ok) throw new Error("Failed to load progress");
        const data = await res.json();

        const today = data.averages || {};
        const history = data.feedback.message || [];
        console.log("Fetched progress data:", history);
        
        setProgress({
          focusHours: today.focus || 0,
          waterGlasses: history.water_intake || 0,
          sleepHours: today.sleep || 0,
        });
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchProgress();
  }, [user?.id]);

  const quickActions = [
    { id: "focus", label: "Start Focus", icon: Target, color: "from-violet-500 to-purple-500" },
    { id: "water", label: "Log Water", icon: Droplet, color: "from-blue-500 to-cyan-500" },
    { id: "break", label: "Break", icon: Coffee, color: "from-amber-500 to-orange-500" },
    { id: "mood", label: "Log Mood", icon: Smile, color: "from-pink-500 to-rose-500" },
    { id: "sleep", label: "Sleep", icon: Moon, color: "from-indigo-500 to-blue-500" },
  ];

  return (
    <div
      className="
        h-full flex flex-col gap-8 p-6
        overflow-y-auto scroll-smooth
        touch-pan-y overscroll-contain
        scrollbar-hide
        [&::-webkit-scrollbar]:hidden
        [-ms-overflow-style:none]
        [scrollbar-width:none]
      "
    >
      {/* User Avatar */}
      <motion.div
        className="flex flex-col items-center gap-3"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="relative">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 via-purple-500 to-indigo-500 p-[2px]">
            <div className="w-full h-full rounded-2xl bg-white dark:bg-slate-900 flex items-center justify-center backdrop-blur-xl">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-100 via-purple-100 to-indigo-100 flex items-center justify-center text-violet-700 font-bold text-lg">
                {firstLetter}
              </div>
            </div>
          </div>
        </div>
        <div className="text-center">
          <div className="text-xl text-slate-700 dark:text-slate-200">{displayName}</div>
        </div>
      </motion.div>

      {/* Quick Actions */}
      {/* <div className="flex-1 flex flex-col gap-3">
        <div className="text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
          Quick Actions
        </div>
        {quickActions.map((action, index) => (
          <motion.div
            key={action.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Button
              onClick={() => onQuickAction(action.id)}
              variant="ghost"
              className="w-full justify-start gap-3 h-12 rounded-2xl backdrop-blur-sm bg-white/50 dark:bg-slate-800/50 border border-slate-200/50 dark:border-slate-700/50 hover:bg-white/80 dark:hover:bg-slate-800/80 transition-all duration-300 group"
            >
              <div className={`p-2 rounded-xl bg-gradient-to-br ${action.color} text-white group-hover:scale-110 transition-transform duration-300`}>
                <action.icon className="w-4 h-4" />
              </div>
              <span className="text-sm text-slate-700 dark:text-slate-200">{action.label}</span>
            </Button>
          </motion.div>
        ))}
      </div> */}

      {/* Stats Summary + Logout */}
      <motion.div
        className="p-4 rounded-2xl backdrop-blur-xl bg-gradient-to-br from-white/60 to-white/40 dark:from-slate-800/60 dark:to-slate-800/40 border border-slate-200/50 dark:border-slate-700/50"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <div className="text-xs text-slate-500 dark:text-slate-400 mb-3">Today's Progress</div>

        {loading ? (
          <div className="text-sm text-slate-500 dark:text-slate-400">Loading...</div>
        ) : error ? (
          <div className="text-sm text-red-500">{error}</div>
        ) : progress ? (
          <div className="space-y-2 mb-4">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-600 dark:text-slate-300">Focus</span>
              <span className="text-violet-600 dark:text-violet-400">{progress.focusHours}h</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-600 dark:text-slate-300">Hydration</span>
              <span className="text-blue-600 dark:text-blue-400">{progress.waterGlasses}/8</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-600 dark:text-slate-300">Sleep</span>
              <span className="text-indigo-600 dark:text-indigo-400">{progress.sleepHours}h</span>
            </div>
          </div>
        ) : (
          <div className="text-sm text-slate-400">No data yet</div>
        )}

        <Button
          onClick={onLogout}
          variant="ghost"
          className="w-full justify-center gap-2 rounded-xl text-sm font-medium text-red-600 hover:text-white hover:bg-red-500 transition-all duration-300"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </Button>
      </motion.div>
    </div>
  );
}
