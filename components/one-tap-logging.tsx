import { motion } from 'motion/react';
import { Droplet, Coffee, Smile, Target, Moon } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface OneTapLoggingProps {
  onLog: (type: string) => void;
}

export function OneTapLogging({ onLog }: OneTapLoggingProps) {
  const actions = [
    {
      id: 'hydration',
      label: 'Water',
      icon: Droplet,
      gradient: 'from-blue-500 to-cyan-500',
      hoverGradient: 'from-blue-600 to-cyan-600',
      message: '💧 Water logged! Stay hydrated',
      animation: 'droplet'
    },
    {
      id: 'break',
      label: 'Break',
      icon: Coffee,
      gradient: 'from-amber-500 to-orange-500',
      hoverGradient: 'from-amber-600 to-orange-600',
      message: '☕ Break logged! Keep balanced',
      animation: 'steam'
    },
    {
      id: 'mood',
      label: 'Mood',
      icon: Smile,
      gradient: 'from-pink-500 to-rose-500',
      hoverGradient: 'from-pink-600 to-rose-600',
      message: '😊 Mood logged! Thanks for sharing',
      animation: 'heart'
    },
    {
      id: 'focus',
      label: 'Focus',
      icon: Target,
      gradient: 'from-violet-500 to-purple-500',
      hoverGradient: 'from-violet-600 to-purple-600',
      message: '🎯 Focus session started!',
      animation: 'pulse'
    },
    {
      id: 'sleep',
      label: 'Sleep',
      icon: Moon,
      gradient: 'from-indigo-500 to-blue-500',
      hoverGradient: 'from-indigo-600 to-blue-600',
      message: '🌙 Sleep logged! Rest well',
      animation: 'moon'
    }
  ];

  const handleLog = (action: typeof actions[0]) => {
    onLog(action.id);
    toast(action.message);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-sm text-slate-600 dark:text-slate-300">Quick Log Habits</h3>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {actions.map((action, index) => (
          <motion.button
            key={action.id}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleLog(action)}
            className={`group relative p-6 rounded-2xl backdrop-blur-xl bg-gradient-to-br ${action.gradient} hover:${action.hoverGradient} shadow-lg transition-all duration-300 overflow-hidden`}
          >
            {/* Shine effect */}
            <motion.div
              className="absolute inset-0 bg-white/20"
              initial={{ x: '-100%' }}
              whileHover={{ x: '100%' }}
              transition={{ duration: 0.5 }}
            />

            {/* Icon */}
            <motion.div
              className="relative mb-3 flex justify-center"
              whileTap={{ rotate: [0, -10, 10, -10, 0] }}
              transition={{ duration: 0.5 }}
            >
              <action.icon className="w-8 h-8 text-white" />
            </motion.div>

            {/* Label */}
            <div className="relative text-sm text-white">{action.label}</div>

            {/* Progress indicator */}
            <motion.div
              className="absolute bottom-0 left-0 right-0 h-1 bg-white/30"
              initial={{ scaleX: 0 }}
              whileTap={{ scaleX: 1 }}
              transition={{ duration: 0.3 }}
              style={{ originX: 0 }}
            />
          </motion.button>
        ))}
      </div>
    </div>
  );
}
