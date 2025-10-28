import { motion } from 'motion/react';
import { Droplet, Coffee, Moon, Smile, Target, Timer } from 'lucide-react';
import { Button } from './ui/button';

interface SidebarNavProps {
  onQuickAction: (action: string) => void;
}

export function SidebarNav({ onQuickAction }: SidebarNavProps) {
  const quickActions = [
    { id: 'focus', label: 'Start Focus', icon: Target, color: 'from-violet-500 to-purple-500' },
    { id: 'water', label: 'Log Water', icon: Droplet, color: 'from-blue-500 to-cyan-500' },
    { id: 'break', label: 'Break', icon: Coffee, color: 'from-amber-500 to-orange-500' },
    { id: 'mood', label: 'Log Mood', icon: Smile, color: 'from-pink-500 to-rose-500' },
    { id: 'sleep', label: 'Sleep', icon: Moon, color: 'from-indigo-500 to-blue-500' }
  ];

  return (
    <div className="h-full flex flex-col gap-8 p-6">
      {/* Twin Avatar */}
      <motion.div
        className="flex flex-col items-center gap-3"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="relative">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 via-purple-500 to-indigo-500 p-[2px]">
            <div className="w-full h-full rounded-2xl bg-white dark:bg-slate-900 flex items-center justify-center backdrop-blur-xl">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-100 via-purple-100 to-indigo-100 flex items-center justify-center">
                <img
                  src="/logo192.png" 
                  alt="App Logo"
                  className="w-7 h-7 object-contain mix-blend-multiply"
                />
              </div>
            </div>
          </div>

          {/* <motion.div
            className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-gradient-to-br from-emerald-400 to-green-500"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          /> */}
        </div>
        <div className="text-center">
          <div className="text-sm text-slate-700 dark:text-slate-200">Your Twin</div>
          <div className="text-xs text-slate-500 dark:text-slate-400">Active</div>
        </div>
      </motion.div>

      {/* Quick Actions */}
      <div className="flex-1 flex flex-col gap-3">
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
      </div>

      {/* Stats Summary */}
      <motion.div
        className="p-4 rounded-2xl backdrop-blur-xl bg-gradient-to-br from-white/60 to-white/40 dark:from-slate-800/60 dark:to-slate-800/40 border border-slate-200/50 dark:border-slate-700/50"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <div className="text-xs text-slate-500 dark:text-slate-400 mb-3">Today's Progress</div>
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-600 dark:text-slate-300">Focus</span>
            <span className="text-violet-600 dark:text-violet-400">4.5h</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-600 dark:text-slate-300">Hydration</span>
            <span className="text-blue-600 dark:text-blue-400">6/8</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-600 dark:text-slate-300">Sleep</span>
            <span className="text-indigo-600 dark:text-indigo-400">7.2h</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
