import { motion } from 'motion/react';
import { Shield, Database, Bell, Lock, Cloud, Target } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Switch } from './ui/switch';
import { Input } from './ui/input';
import { Label } from './ui/label';

export interface DailyGoals {
  water: number;
  sleep: number;
  focus: number;
  steps: number;
}

export function Settings() {
  const [notifications, setNotifications] = useState(true);
  const [cloudSync, setCloudSync] = useState(false);
  const [localOnly, setLocalOnly] = useState(true);
  const [dailyGoals, setDailyGoals] = useState<DailyGoals>(() => {
    const saved = localStorage.getItem('twinsync_daily_goals');
    return saved ? JSON.parse(saved) : {
      water: 2.5,
      sleep: 8,
      focus: 6,
      steps: 10000
    };
  });

  // Save goals to localStorage
  useEffect(() => {
    localStorage.setItem('twinsync_daily_goals', JSON.stringify(dailyGoals));
  }, [dailyGoals]);

  const updateGoal = (key: keyof DailyGoals, value: number) => {
    setDailyGoals(prev => ({ ...prev, [key]: value }));
  };

  const handleStorageToggle = (type: 'local' | 'cloud') => {
    if (type === 'local') {
      setLocalOnly(true);
      setCloudSync(false);
    } else {
      setLocalOnly(false);
      setCloudSync(true);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-3xl backdrop-blur-2xl bg-gradient-to-br from-white/70 via-white/50 to-white/30 dark:from-slate-800/70 dark:via-slate-800/50 dark:to-slate-800/30 border border-white/20 dark:border-slate-700/50 p-8 shadow-2xl"
      >
        <h2 className="text-2xl text-slate-800 dark:text-white mb-2">Settings</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">Manage your preferences and data</p>
      </motion.div>

      {/* Privacy & Storage */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="rounded-3xl backdrop-blur-2xl bg-gradient-to-br from-white/70 via-white/50 to-white/30 dark:from-slate-800/70 dark:via-slate-800/50 dark:to-slate-800/30 border border-white/20 dark:border-slate-700/50 p-8 shadow-2xl"
      >
        <div className="flex items-center gap-2 mb-6">
          <Shield className="w-5 h-5 text-violet-500" />
          <h3 className="text-xl text-slate-800 dark:text-white">Privacy & Storage</h3>
        </div>

        <div className="space-y-6">
          {/* Local Storage Option */}
          <div className="flex items-start justify-between p-5 rounded-2xl backdrop-blur-xl bg-gradient-to-br from-white/60 to-white/30 dark:from-slate-700/60 dark:to-slate-700/30 border border-white/30 dark:border-slate-600/30">
            <div className="flex gap-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 text-white">
                <Database className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <h4 className="text-sm text-slate-800 dark:text-white mb-1">Local Storage Only</h4>
                <p className="text-xs text-slate-600 dark:text-slate-300 mb-2">
                  All data stays on your device. Maximum privacy, no cloud dependency.
                </p>
                <div className="flex items-center gap-2">
                  <Lock className="w-3 h-3 text-green-600 dark:text-green-400" />
                  <span className="text-xs text-green-600 dark:text-green-400">100% Private</span>
                </div>
              </div>
            </div>
            <Switch 
              checked={localOnly} 
              onCheckedChange={() => handleStorageToggle('local')}
            />
          </div>

          {/* Cloud Sync Option */}
          <div className="flex items-start justify-between p-5 rounded-2xl backdrop-blur-xl bg-gradient-to-br from-white/60 to-white/30 dark:from-slate-700/60 dark:to-slate-700/30 border border-white/30 dark:border-slate-600/30">
            <div className="flex gap-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 text-white">
                <Cloud className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <h4 className="text-sm text-slate-800 dark:text-white mb-1">Cloud Sync (Optional)</h4>
                <p className="text-xs text-slate-600 dark:text-slate-300 mb-2">
                  Encrypted backup across devices. Your data, your control.
                </p>
                <div className="flex items-center gap-2">
                  <Shield className="w-3 h-3 text-blue-600 dark:text-blue-400" />
                  <span className="text-xs text-blue-600 dark:text-blue-400">End-to-end encrypted</span>
                </div>
              </div>
            </div>
            <Switch 
              checked={cloudSync} 
              onCheckedChange={() => handleStorageToggle('cloud')}
            />
          </div>
        </div>
      </motion.div>

      {/* Notifications */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="rounded-3xl backdrop-blur-2xl bg-gradient-to-br from-white/70 via-white/50 to-white/30 dark:from-slate-800/70 dark:via-slate-800/50 dark:to-slate-800/30 border border-white/20 dark:border-slate-700/50 p-8 shadow-2xl"
      >
        <div className="flex items-center gap-2 mb-6">
          <Bell className="w-5 h-5 text-violet-500" />
          <h3 className="text-xl text-slate-800 dark:text-white">Notifications</h3>
        </div>

        <div className="space-y-4">
          <div className="flex items-start justify-between p-5 rounded-2xl backdrop-blur-xl bg-gradient-to-br from-white/60 to-white/30 dark:from-slate-700/60 dark:to-slate-700/30 border border-white/30 dark:border-slate-600/30">
            <div className="flex gap-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 text-white">
                <Bell className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm text-slate-800 dark:text-white mb-1">Gentle Reminders</h4>
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  Receive subtle nudges for breaks, hydration, and sleep
                </p>
              </div>
            </div>
            <Switch 
              checked={notifications} 
              onCheckedChange={setNotifications}
            />
          </div>

          {notifications && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="pl-16 space-y-3"
            >
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-600 dark:text-slate-300">Break reminders</span>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-600 dark:text-slate-300">Hydration reminders</span>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-600 dark:text-slate-300">Sleep suggestions</span>
                <Switch defaultChecked />
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* About */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="rounded-3xl backdrop-blur-2xl bg-gradient-to-br from-white/70 via-white/50 to-white/30 dark:from-slate-800/70 dark:via-slate-800/50 dark:to-slate-800/30 border border-white/20 dark:border-slate-700/50 p-8 shadow-2xl text-center"
      >
        <div className="w-12 h-12 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-violet-500 via-purple-500 to-indigo-500 flex items-center justify-center">
          <Shield className="w-6 h-6 text-white" />
        </div>
        <h3 className="text-lg text-slate-800 dark:text-white mb-2">TwinSync v1.0</h3>
        <p className="text-xs text-slate-600 dark:text-slate-300 max-w-md mx-auto">
          Your privacy-first digital wellness companion. Built for students and professionals who value balance and personal data ownership.
        </p>
        <div className="mt-6 flex items-center justify-center gap-4 text-xs text-slate-500 dark:text-slate-400">
          <button className="hover:text-violet-600 dark:hover:text-violet-400 transition-colors">Privacy Policy</button>
          <span>•</span>
          <button className="hover:text-violet-600 dark:hover:text-violet-400 transition-colors">Terms of Use</button>
          <span>•</span>
          <button className="hover:text-violet-600 dark:hover:text-violet-400 transition-colors">Support</button>
        </div>
      </motion.div>
    </div>
  );
}
