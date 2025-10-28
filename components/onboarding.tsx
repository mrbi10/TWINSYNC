import { motion } from 'motion/react';
import { Shield, Clock, TrendingUp, Lock, Moon, Sun } from 'lucide-react';
import { Button } from './ui/button';

interface OnboardingProps {
  onComplete: () => void;
  onLogin: () => void;
  onSignup: () => void;
  darkMode: boolean;
  onToggleTheme: () => void;
}

export function Onboarding({ onComplete, onLogin, onSignup, darkMode, onToggleTheme }: OnboardingProps) {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Top Navbar */}
      <nav className="sticky top-0 z-50 backdrop-blur-2xl bg-white/50 dark:bg-slate-900/50 border-b border-white/20 dark:border-slate-700/50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-500 via-purple-500 to-indigo-500 flex items-center justify-center">
                <span className="text-white text-sm">T</span>
              </div>
              <h1 className="text-xl bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                TwinSync
              </h1>
            </div>

            {/* Auth Buttons + Theme Toggle */}
            <div className="flex items-center gap-3">
              <Button
                onClick={onLogin}
                variant="ghost"
                className="rounded-xl backdrop-blur-xl bg-white/50 dark:bg-slate-800/50 border border-white/30 dark:border-slate-700/30 text-slate-700 dark:text-slate-200 hover:bg-white/80 dark:hover:bg-slate-800/80"
              >
                Log In
              </Button>
              <Button
                onClick={onSignup}
                className="rounded-xl bg-gradient-to-r from-violet-600 via-indigo-600 to-blue-600 hover:from-violet-500 hover:via-indigo-500 hover:to-blue-500 text-white shadow-lg shadow-violet-500/30"
              >
                Sign Up
              </Button>
              <button
                onClick={onToggleTheme}
                className="flex items-center gap-2 px-3 py-2 rounded-xl backdrop-blur-xl bg-white/50 dark:bg-slate-800/50 border border-white/30 dark:border-slate-700/30 text-slate-600 dark:text-slate-300 hover:bg-white/80 dark:hover:bg-slate-800/80 transition-all duration-300"
                aria-label="Toggle theme"
              >
                {darkMode ? (
                  <Sun className="w-4 h-4" />
                ) : (
                  <Moon className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-6xl"
        >
          {/* Main Card */}
          <div className="rounded-3xl backdrop-blur-2xl bg-gradient-to-br from-white/70 via-white/50 to-white/30 dark:from-slate-800/70 dark:via-slate-800/50 dark:to-slate-800/30 border border-white/20 dark:border-slate-700/50 p-12 shadow-2xl text-center">
            
            {/* Twin Illustration */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-8 relative"
            >
              <div className="flex items-center justify-center gap-8 mb-6">
                {/* Left silhouette */}
                <motion.div
                  animate={{ 
                    scale: [1, 1.02, 1],
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="relative"
                >
                  <div className="w-32 h-32 rounded-full bg-gradient-to-br from-violet-400/30 to-purple-500/30 backdrop-blur-xl border border-violet-300/50" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-violet-500 to-purple-600" />
                  </div>
                </motion.div>

                {/* Connection line */}
                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 0.5, duration: 1 }}
                  className="h-[2px] w-16 bg-gradient-to-r from-violet-500 to-indigo-500 relative"
                >
                  <motion.div
                    animate={{ x: [-10, 10, -10] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-gradient-to-r from-violet-400 to-indigo-400"
                  />
                </motion.div>

                {/* Right silhouette */}
                <motion.div
                  animate={{ 
                    scale: [1, 1.02, 1],
                  }}
                  transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
                  className="relative"
                >
                  <div className="w-32 h-32 rounded-full bg-gradient-to-br from-indigo-400/30 to-blue-500/30 backdrop-blur-xl border border-indigo-300/50" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-500 to-blue-600" />
                  </div>
                </motion.div>
              </div>
            </motion.div>

            {/* Title */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <h1 className="text-4xl bg-gradient-to-br from-violet-600 via-indigo-600 to-blue-600 bg-clip-text text-transparent mb-4">
                Meet Your Digital Twin
              </h1>
              <p className="text-lg text-slate-600 dark:text-slate-300 mb-8">
                A privacy-first companion for balanced productivity and wellness
              </p>
            </motion.div>

            {/* Features */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10"
            >
              {[
                {
                  icon: Shield,
                  title: 'Privacy First',
                  description: 'Your data stays with you. Local-first storage with optional cloud sync.'
                },
                {
                  icon: Clock,
                  title: 'Balance Tracker',
                  description: 'Monitor focus, breaks, sleep, and hydration in one unified view.'
                },
                {
                  icon: TrendingUp,
                  title: 'Smart Insights',
                  description: 'Gentle nudges and patterns to help you maintain healthy habits.'
                },
                {
                  icon: Lock,
                  title: 'No Judgment',
                  description: 'A supportive mirror, not a strict watcher. Built for real humans.'
                }
              ].map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.7 + index * 0.1 }}
                  className="p-5 rounded-2xl backdrop-blur-xl bg-gradient-to-br from-white/60 to-white/30 dark:from-slate-700/60 dark:to-slate-700/30 border border-white/30 dark:border-slate-600/30 text-left"
                >
                  <feature.icon className="w-6 h-6 text-violet-500 mb-3" />
                  <h3 className="text-sm text-slate-800 dark:text-white mb-1">{feature.title}</h3>
                  <p className="text-xs text-slate-600 dark:text-slate-300">{feature.description}</p>
                </motion.div>
              ))}
            </motion.div>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
            >
              <Button
                onClick={onLogin}
                size="lg"
                className="px-8 py-6 rounded-2xl bg-gradient-to-r from-violet-600 via-indigo-600 to-blue-600 hover:from-violet-500 hover:via-indigo-500 hover:to-blue-500 text-white shadow-lg shadow-violet-500/30 transition-all duration-300"
              >
                Start Your Journey
              </Button>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-4">
                No account required • Fully private • Cancel anytime
              </p>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
