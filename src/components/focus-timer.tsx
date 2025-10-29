import { motion } from 'motion/react';
import { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Coffee } from 'lucide-react';
import { Button } from './ui/button';
import { BASE_URL } from '../constants/API';

export function FocusTimer() {
  const [seconds, setSeconds] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const userId = JSON.parse(localStorage.getItem('user') || '{}');
  const [mode, setMode] = useState<'focus' | 'break'>('focus');
  const [stats, setStats] = useState({
    sessions_today: 0,
    total_focus_minutes: 0,
    breaks_taken: 0,
  });


  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch(`${BASE_URL}/api/focus-stats/${userId.id}`);
        const data = await res.json();
        setStats(data);
      } catch (err) {
        console.error("Error fetching stats", err);
      }
    }

    fetchStats();
  }, []);


  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isActive && seconds > 0) {
      interval = setInterval(() => {
        setSeconds((seconds) => seconds - 1);
      }, 1000);
    } else if (seconds === 0) {
      setIsActive(false);

      // When timer hits 0, send update
      const duration = mode === 'focus' ? 25 : 5;
      fetch("http://localhost:5000/api/focus-stats/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: userId.id,
          mode,
          duration_minutes: duration,
        }),
      })
        .then(() => {
          fetch(`${BASE_URL}/api/focus-stats/${userId.id}`)
            .then((r) => r.json())
            .then(setStats);
        })
        .catch(console.error);

      if (mode === "focus") {
        setMode("break");
        setSeconds(5 * 60);
      } else {
        setMode("focus");
        setSeconds(25 * 60);
      }
    }


    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, seconds, mode]);

  const toggleTimer = () => setIsActive(!isActive);

  const resetTimer = () => {
    setIsActive(false);
    setSeconds(mode === 'focus' ? 25 * 60 : 5 * 60);
  };

  const switchMode = (newMode: 'focus' | 'break') => {
    setMode(newMode);
    setIsActive(false);
    setSeconds(newMode === 'focus' ? 25 * 60 : 5 * 60);
  };

  const minutes = Math.floor(seconds / 60);
  const displaySeconds = seconds % 60;
  const progress = mode === 'focus'
    ? ((25 * 60 - seconds) / (25 * 60)) * 100
    : ((5 * 60 - seconds) / (5 * 60)) * 100;

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="max-w-2xl w-full">
        {/* Mode Selector */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex gap-3 mb-8 justify-center"
        >
          <Button
            onClick={() => switchMode('focus')}
            variant={mode === 'focus' ? 'default' : 'ghost'}
            className={`rounded-2xl px-6 ${mode === 'focus'
              ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-500/30'
              : 'backdrop-blur-xl bg-white/50 dark:bg-slate-800/50 border border-white/30 dark:border-slate-700/30'
              }`}
          >
            Focus Session
          </Button>
          <Button
            onClick={() => switchMode('break')}
            variant={mode === 'break' ? 'default' : 'ghost'}
            className={`rounded-2xl px-6 ${mode === 'break'
              ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-lg shadow-amber-500/30'
              : 'backdrop-blur-xl bg-white/50 dark:bg-slate-800/50 border border-white/30 dark:border-slate-700/30'
              }`}
          >
            <Coffee className="w-4 h-4 mr-2" />
            Break Time
          </Button>
        </motion.div>

        {/* Timer Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="rounded-3xl backdrop-blur-2xl bg-gradient-to-br from-white/70 via-white/50 to-white/30 dark:from-slate-800/70 dark:via-slate-800/50 dark:to-slate-800/30 border border-white/20 dark:border-slate-700/50 p-12 shadow-2xl"
        >
          {/* Circular Progress */}
          <div className="flex justify-center mb-8">
            <div className="relative w-80 h-80">
              <svg className="transform -rotate-90 w-full h-full">
                <defs>
                  <linearGradient id="timerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor={mode === 'focus' ? '#8b5cf6' : '#f59e0b'} />
                    <stop offset="50%" stopColor={mode === 'focus' ? '#6366f1' : '#f97316'} />
                    <stop offset="100%" stopColor={mode === 'focus' ? '#3b82f6' : '#fb923c'} />
                  </linearGradient>
                  <filter id="timerGlow">
                    <feGaussianBlur stdDeviation="4" result="coloredBlur" />
                    <feMerge>
                      <feMergeNode in="coloredBlur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>

                {/* Background circle */}
                <circle
                  cx="160"
                  cy="160"
                  r="140"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="16"
                  className="text-slate-200 dark:text-slate-700 opacity-20"
                />

                {/* Progress circle */}
                <motion.circle
                  cx="160"
                  cy="160"
                  r="140"
                  fill="none"
                  stroke="url(#timerGradient)"
                  strokeWidth="16"
                  strokeLinecap="round"
                  strokeDasharray={2 * Math.PI * 140}
                  strokeDashoffset={2 * Math.PI * 140 * (1 - progress / 100)}
                  filter="url(#timerGlow)"
                  initial={{ strokeDashoffset: 2 * Math.PI * 140 }}
                  animate={{ strokeDashoffset: 2 * Math.PI * 140 * (1 - progress / 100) }}
                  transition={{ duration: 0.5 }}
                />
              </svg>

              {/* Timer Display */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <motion.div
                  key={`${minutes}-${displaySeconds}`}
                  initial={{ scale: 1.1, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className={`text-7xl bg-gradient-to-br ${mode === 'focus'
                    ? 'from-violet-600 via-indigo-600 to-blue-600'
                    : 'from-amber-600 via-orange-600 to-orange-500'
                    } bg-clip-text text-transparent`}
                >
                  {String(minutes).padStart(2, '0')}:{String(displaySeconds).padStart(2, '0')}
                </motion.div>
                <div className="text-sm text-slate-500 dark:text-slate-400 mt-2 uppercase tracking-wider">
                  {mode === 'focus' ? 'Focus Mode' : 'Break Time'}
                </div>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="flex justify-center gap-4">
            <Button
              onClick={toggleTimer}
              size="lg"
              className={`rounded-2xl px-8 py-6 ${mode === 'focus'
                ? 'bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500'
                : 'bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500'
                } text-white shadow-lg transition-all duration-300`}
            >
              {isActive ? (
                <>
                  <Pause className="w-5 h-5 mr-2" />
                  Pause
                </>
              ) : (
                <>
                  <Play className="w-5 h-5 mr-2" />
                  Start
                </>
              )}
            </Button>
            <Button
              onClick={resetTimer}
              size="lg"
              variant="ghost"
              className="rounded-2xl px-8 py-6 backdrop-blur-xl bg-white/50 dark:bg-slate-800/50 border border-white/30 dark:border-slate-700/30 hover:bg-white/80 dark:hover:bg-slate-800/80"
            >
              <RotateCcw className="w-5 h-5 mr-2" />
              Reset
            </Button>
          </div>

          {/* Ambient Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-10 grid grid-cols-3 gap-4"
          >
            {[
              { label: 'Sessions Today', value: stats.sessions_today },
              { label: 'Total Focus', value: `${(stats.total_focus_minutes / 60).toFixed(1)}h` },
              { label: 'Breaks Taken', value: stats.breaks_taken }
            ]
              .map((stat, index) => (
                <div
                  key={stat.label}
                  className="p-4 rounded-2xl backdrop-blur-xl bg-gradient-to-br from-white/60 to-white/30 dark:from-slate-700/60 dark:to-slate-700/30 border border-white/30 dark:border-slate-600/30 text-center"
                >
                  <div className="text-2xl text-slate-800 dark:text-white mb-1">{stat.value}</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">{stat.label}</div>
                </div>
              ))}
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
