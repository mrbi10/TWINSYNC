import { motion } from 'motion/react';
import { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Coffee, Settings } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { toast } from 'sonner@2.0.3';

interface SessionStats {
  sessionsToday: number;
  totalFocusSeconds: number;
  breaksTaken: number;
}

export function FocusTimer() {
  const [focusDuration, setFocusDuration] = useState(0);
  const [breakDuration, setBreakDuration] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState<'focus' | 'break'>('focus');
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [isConfigured, setIsConfigured] = useState(false);
  
  // Load stats from localStorage
  const [stats, setStats] = useState<SessionStats>(() => {
    const today = new Date().toDateString();
    const saved = localStorage.getItem('twinsync_focus_stats');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.date === today) {
        return parsed.stats;
      }
    }
    return { sessionsToday: 0, totalFocusSeconds: 0, breaksTaken: 0 };
  });

  // Save stats to localStorage
  useEffect(() => {
    const today = new Date().toDateString();
    localStorage.setItem('twinsync_focus_stats', JSON.stringify({
      date: today,
      stats
    }));
  }, [stats]);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isActive && seconds > 0) {
      interval = setInterval(() => {
        setSeconds((seconds) => seconds - 1);
        
        // Track focus time
        if (mode === 'focus') {
          setStats(prev => ({
            ...prev,
            totalFocusSeconds: prev.totalFocusSeconds + 1
          }));
        }
      }, 1000);
    } else if (seconds === 0) {
      setIsActive(false);
      
      // Update stats when timer completes
      if (mode === 'focus') {
        setStats(prev => ({
          ...prev,
          sessionsToday: prev.sessionsToday + 1
        }));
        toast.success('🎉 Focus session complete!', {
          description: 'Great work! Time for a break.'
        });
        setMode('break');
        setSeconds(breakDuration * 60);
      } else {
        setStats(prev => ({
          ...prev,
          breaksTaken: prev.breaksTaken + 1
        }));
        toast.success('☕ Break complete!', {
          description: 'Ready for another focus session?'
        });
        setMode('focus');
        setSeconds(focusDuration * 60);
      }
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, seconds, mode, focusDuration, breakDuration]);

  const toggleTimer = () => setIsActive(!isActive);
  
  const resetTimer = () => {
    setIsActive(false);
    setSeconds(mode === 'focus' ? focusDuration * 60 : breakDuration * 60);
  };

  const switchMode = (newMode: 'focus' | 'break') => {
    setMode(newMode);
    setIsActive(false);
    setSeconds(newMode === 'focus' ? focusDuration * 60 : breakDuration * 60);
  };

  const handleSaveSettings = (focusMins: number, breakMins: number) => {
    setFocusDuration(focusMins);
    setBreakDuration(breakMins);
    setSeconds(mode === 'focus' ? focusMins * 60 : breakMins * 60);
    setIsConfigured(true);
    setSettingsOpen(false);
    toast.success('⚙️ Timer configured! Ready to start.');
  };

  const minutes = Math.floor(seconds / 60);
  const displaySeconds = seconds % 60;
  const totalDuration = mode === 'focus' ? focusDuration * 60 : breakDuration * 60;
  const progress = ((totalDuration - seconds) / totalDuration) * 100;

  const formatTime = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="max-w-2xl w-full">
        {/* Header with Settings */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-between items-center mb-8"
        >
          <h2 className="text-2xl text-slate-800 dark:text-white">Focus Timer</h2>
          
          {isConfigured && (
            <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
              <DialogTrigger asChild>
                <Button
                  variant="ghost"
                  className="rounded-2xl backdrop-blur-xl bg-white/50 dark:bg-slate-800/50 border border-white/30 dark:border-slate-700/30"
                >
                  <Settings className="w-4 h-4" />
                  Settings
                </Button>
              </DialogTrigger>
              <DialogContent className="rounded-3xl backdrop-blur-2xl bg-gradient-to-br from-white/90 via-white/80 to-white/70 dark:from-slate-800/90 dark:via-slate-800/80 dark:to-slate-800/70 border border-white/20 dark:border-slate-700/50">
                <DialogHeader>
                  <DialogTitle>Timer Settings</DialogTitle>
                </DialogHeader>
                <TimerSettings
                  defaultFocus={focusDuration}
                  defaultBreak={breakDuration}
                  onSave={handleSaveSettings}
                />
              </DialogContent>
            </Dialog>
          )}
        </motion.div>

        {/* Initial Configuration */}
        {!isConfigured && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="rounded-3xl backdrop-blur-2xl bg-gradient-to-br from-white/70 via-white/50 to-white/30 dark:from-slate-800/70 dark:via-slate-800/50 dark:to-slate-800/30 border border-white/20 dark:border-slate-700/50 p-12 shadow-2xl"
          >
            <div className="text-center mb-8">
              <div className="text-6xl mb-4">⏱️</div>
              <h3 className="text-2xl text-slate-800 dark:text-white mb-2">Set Up Your Timer</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Configure your focus and break durations to get started
              </p>
            </div>
            
            <TimerSettings
              defaultFocus={25}
              defaultBreak={5}
              onSave={handleSaveSettings}
            />
          </motion.div>
        )}

        {/* Timer Interface (only shown when configured) */}
        {isConfigured && (
          <>
            {/* Mode Selector */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex gap-3 mb-8 justify-center"
            >
          <Button
            onClick={() => switchMode('focus')}
            variant={mode === 'focus' ? 'default' : 'ghost'}
            className={`rounded-2xl px-6 ${
              mode === 'focus' 
                ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-500/30' 
                : 'backdrop-blur-xl bg-white/50 dark:bg-slate-800/50 border border-white/30 dark:border-slate-700/30'
            }`}
          >
            Focus Session ({focusDuration}m)
          </Button>
          <Button
            onClick={() => switchMode('break')}
            variant={mode === 'break' ? 'default' : 'ghost'}
            className={`rounded-2xl px-6 ${
              mode === 'break' 
                ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-lg shadow-amber-500/30' 
                : 'backdrop-blur-xl bg-white/50 dark:bg-slate-800/50 border border-white/30 dark:border-slate-700/30'
            }`}
          >
            <Coffee className="w-4 h-4" />
            Break Time ({breakDuration}m)
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
                    <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
                    <feMerge>
                      <feMergeNode in="coloredBlur"/>
                      <feMergeNode in="SourceGraphic"/>
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
                  className={`text-7xl bg-gradient-to-br ${
                    mode === 'focus' 
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
              className={`rounded-2xl px-8 py-6 ${
                mode === 'focus'
                  ? 'bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500'
                  : 'bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500'
              } text-white shadow-lg transition-all duration-300`}
            >
              {isActive ? (
                <>
                  <Pause className="w-5 h-5" />
                  Pause
                </>
              ) : (
                <>
                  <Play className="w-5 h-5" />
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
              <RotateCcw className="w-5 h-5" />
              Reset
            </Button>
          </div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-10 grid grid-cols-3 gap-4"
          >
            {[
              { label: 'Sessions Today', value: stats.sessionsToday.toString() },
              { label: 'Total Focus', value: formatTime(stats.totalFocusSeconds) },
              { label: 'Breaks Taken', value: stats.breaksTaken.toString() }
            ].map((stat, index) => (
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
          </>
        )}
      </div>
    </div>
  );
}

function TimerSettings({ 
  defaultFocus, 
  defaultBreak, 
  onSave 
}: { 
  defaultFocus: number; 
  defaultBreak: number; 
  onSave: (focus: number, break_: number) => void;
}) {
  const [focusMins, setFocusMins] = useState(defaultFocus.toString());
  const [breakMins, setBreakMins] = useState(defaultBreak.toString());

  const handleSave = () => {
    const focus = parseInt(focusMins) || 25;
    const break_ = parseInt(breakMins) || 5;
    onSave(focus, break_);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="focus-duration">Focus Duration (minutes)</Label>
        <Input
          id="focus-duration"
          type="number"
          min="1"
          max="120"
          value={focusMins}
          onChange={(e) => setFocusMins(e.target.value)}
          placeholder="Enter minutes (e.g., 25)"
          className="rounded-2xl backdrop-blur-xl bg-white/50 dark:bg-slate-800/50 border border-white/30 dark:border-slate-700/30 placeholder:text-slate-400/50 dark:placeholder:text-slate-500/50"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="break-duration">Break Duration (minutes)</Label>
        <Input
          id="break-duration"
          type="number"
          min="1"
          max="60"
          value={breakMins}
          onChange={(e) => setBreakMins(e.target.value)}
          placeholder="Enter minutes (e.g., 5)"
          className="rounded-2xl backdrop-blur-xl bg-white/50 dark:bg-slate-800/50 border border-white/30 dark:border-slate-700/30 placeholder:text-slate-400/50 dark:placeholder:text-slate-500/50"
        />
      </div>

      <Button
        onClick={handleSave}
        className="w-full rounded-2xl bg-gradient-to-r from-violet-500 to-purple-500 text-white hover:from-violet-600 hover:to-purple-600"
      >
        Save Settings
      </Button>
    </div>
  );
}
