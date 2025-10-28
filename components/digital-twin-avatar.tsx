import { motion } from 'motion/react';
import { Sparkles, Heart, Zap } from 'lucide-react';
import { useEffect, useState } from 'react';

interface DigitalTwinAvatarProps {
  healthScore: number;
  hydrationLevel: number;
  sleepQuality: number;
  focusHours: number;
  onCelebrate?: boolean;
}

export function DigitalTwinAvatar({ healthScore, hydrationLevel, sleepQuality, focusHours, onCelebrate }: DigitalTwinAvatarProps) {
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number }>>([]);

  // Determine twin state based on health metrics
  const getTwinState = (): 'excellent' | 'good' | 'average' | 'needsAttention' | 'weak' => {
    if (healthScore >= 85) return 'excellent';
    if (healthScore >= 70) return 'good';
    if (healthScore >= 50) return 'average';
    if (healthScore >= 30) return 'needsAttention';
    return 'weak';
  };

  const state = getTwinState();

  // State-specific styling
  const stateConfig = {
    excellent: {
      gradient: 'from-emerald-400 via-green-400 to-teal-400',
      glow: 'shadow-emerald-500/50',
      expression: '😊',
      message: "Looking great! Keep it up!",
      pulseColor: 'rgb(52, 211, 153)',
      size: 'w-48 h-48'
    },
    good: {
      gradient: 'from-blue-400 via-cyan-400 to-blue-500',
      glow: 'shadow-blue-500/50',
      expression: '🙂',
      message: "You're doing well!",
      pulseColor: 'rgb(59, 130, 246)',
      size: 'w-48 h-48'
    },
    average: {
      gradient: 'from-amber-400 via-yellow-400 to-amber-500',
      glow: 'shadow-amber-500/50',
      expression: '😐',
      message: "Let's improve together",
      pulseColor: 'rgb(251, 191, 36)',
      size: 'w-48 h-48'
    },
    needsAttention: {
      gradient: 'from-slate-400 via-slate-500 to-slate-600',
      glow: 'shadow-slate-500/50',
      expression: '😔',
      message: "I need your attention",
      pulseColor: 'rgb(148, 163, 184)',
      size: 'w-44 h-44'
    },
    weak: {
      gradient: 'from-gray-300 via-gray-400 to-gray-500',
      glow: 'shadow-gray-500/30',
      expression: '😢',
      message: "Please take care of yourself...",
      pulseColor: 'rgb(107, 114, 128)',
      size: 'w-40 h-40'
    }
  };

  const config = stateConfig[state];

  // Celebration effect
  useEffect(() => {
    if (onCelebrate) {
      const newParticles = Array.from({ length: 20 }, (_, i) => ({
        id: Date.now() + i,
        x: Math.random() * 200 - 100,
        y: Math.random() * 200 - 100
      }));
      setParticles(newParticles);
      
      setTimeout(() => setParticles([]), 2000);
    }
  }, [onCelebrate]);

  return (
    <div className="flex flex-col items-center justify-center">
      <motion.div
        className="relative"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', duration: 0.8 }}
      >
        {/* Pulsing Glow Ring */}
        <motion.div
          className={`absolute inset-0 rounded-full bg-gradient-to-br ${config.gradient} blur-2xl ${config.glow}`}
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.5, 0.7, 0.5]
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
        />

        {/* Main Avatar Circle */}
        <motion.div
          className={`relative ${config.size} rounded-full bg-gradient-to-br ${config.gradient} p-1 shadow-2xl ${config.glow}`}
          whileHover={{ scale: 1.05 }}
          transition={{ type: 'spring' }}
          animate={{
            scale: state === 'weak' ? [1, 0.95, 1] : 1
          }}
        >
          <div className="w-full h-full rounded-full bg-white dark:bg-slate-900 flex items-center justify-center backdrop-blur-xl">
            {/* Avatar Face */}
            <motion.div
              className="text-7xl"
              animate={{
                scale: state === 'excellent' ? [1, 1.1, 1] : 1
              }}
              transition={{
                duration: 2,
                repeat: state === 'excellent' ? Infinity : 0,
                ease: 'easeInOut'
              }}
            >
              {config.expression}
            </motion.div>
          </div>

          {/* Health Indicators */}
          <motion.div
            className="absolute -top-2 -right-2 p-2 rounded-full bg-gradient-to-br from-rose-400 to-pink-500 shadow-lg"
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Heart className="w-4 h-4 text-white" fill="white" />
          </motion.div>

          <motion.div
            className="absolute -bottom-2 -right-2 p-2 rounded-full bg-gradient-to-br from-violet-400 to-purple-500 shadow-lg"
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <Zap className="w-4 h-4 text-white" fill="white" />
          </motion.div>
        </motion.div>

        {/* Celebration Particles */}
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute top-1/2 left-1/2 w-2 h-2 rounded-full bg-gradient-to-br from-yellow-400 to-orange-400"
            initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
            animate={{
              x: particle.x,
              y: particle.y,
              opacity: 0,
              scale: 0
            }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
          />
        ))}

        {/* Floating Sparkles */}
        {state === 'excellent' && (
          <>
            <motion.div
              className="absolute top-8 -left-8"
              animate={{
                y: [0, -20, 0],
                opacity: [0.5, 1, 0.5]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: 0
              }}
            >
              <Sparkles className="w-6 h-6 text-emerald-400" />
            </motion.div>
            <motion.div
              className="absolute top-8 -right-8"
              animate={{
                y: [0, -20, 0],
                opacity: [0.5, 1, 0.5]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: 0.5
              }}
            >
              <Sparkles className="w-6 h-6 text-teal-400" />
            </motion.div>
          </>
        )}
      </motion.div>

      {/* Twin Status Message */}
      <motion.div
        className="mt-6 text-center"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <h3 className="text-xl text-slate-800 dark:text-white mb-1">Your Digital Twin</h3>
        <p className={`text-sm bg-gradient-to-r ${config.gradient} bg-clip-text text-transparent`}>
          {config.message}
        </p>
      </motion.div>

      {/* Quick Stats */}
      <motion.div
        className="mt-4 flex gap-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <div className="flex flex-col items-center">
          <div className="text-xs text-slate-500 dark:text-slate-400">Hydration</div>
          <div className={`text-sm ${hydrationLevel >= 6 ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400'}`}>
            {hydrationLevel}/8
          </div>
        </div>
        <div className="flex flex-col items-center">
          <div className="text-xs text-slate-500 dark:text-slate-400">Sleep</div>
          <div className={`text-sm ${sleepQuality >= 7 ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400'}`}>
            {sleepQuality}h
          </div>
        </div>
        <div className="flex flex-col items-center">
          <div className="text-xs text-slate-500 dark:text-slate-400">Focus</div>
          <div className={`text-sm ${focusHours >= 4 ? 'text-violet-600 dark:text-violet-400' : 'text-slate-400'}`}>
            {focusHours}h
          </div>
        </div>
      </motion.div>
    </div>
  );
}
