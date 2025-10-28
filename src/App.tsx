import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { LayoutDashboard, Activity, Target, LineChart, Settings as SettingsIcon, X, Moon, Sun } from 'lucide-react';
import { SidebarNav } from './components/sidebar-nav';
import { Dashboard } from './components/dashboard';
import { Progress } from './components/Progress';
import { Onboarding } from './components/onboarding';
import { FocusTimer } from './components/focus-timer';
import { Insights } from './components/insights';
import { Settings } from './components/settings';
import { toast } from 'sonner';
import AuthPage from './components/Authpage';

type Screen = 'dashboard' | 'progress' | 'focus' | 'insights' | 'settings';


const user = JSON.parse(localStorage.getItem('user') || '{}');

export default function App() {
  const [showOnboarding, setShowOnboarding] = useState(true);
  const [activeScreen, setActiveScreen] = useState<Screen>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [darkMode, setDarkMode] = useState(true);
  const [authStage, setAuthStage] = useState<'auth' | 'onboarding' | 'app'>(() => {
    return (localStorage.getItem('authStage') as 'auth' | 'onboarding' | 'app') || 'auth';
  });


  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  useEffect(() => {
    localStorage.setItem('authStage', authStage);
  }, [authStage]);

  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };

  const handleQuickAction = (action: string) => {
    const messages: Record<string, string> = {
      focus: '🎯 Focus session started!',
      water: '💧 Great! Water logged',
      break: '☕ Break time! Stretch and relax',
      mood: '😊 Mood logged successfully',
      sleep: '🌙 Sleep tracking activated'
    };

    if (action === 'focus') {
      setActiveScreen('focus');
    }

    toast(messages[action] || 'Action completed!');
  };

  const navItems = [
    { id: 'dashboard' as const, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'progress' as const, label: 'Progress', icon: Activity },
    { id: 'focus' as const, label: 'Focus Timer', icon: Target },
    { id: 'insights' as const, label: 'Insights', icon: LineChart },
    { id: 'settings' as const, label: 'Settings', icon: SettingsIcon }
  ];

  if (authStage === 'auth') {
    return (
      <AuthPage
        onAuth={(type) => {
          if (type === 'signup') {
            setShowOnboarding(true);
            setAuthStage('onboarding');
          } else {
            setShowOnboarding(false);
            setAuthStage('app');
          }
        }}
      />

    );
  }





  if (authStage === 'onboarding') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-violet-50 via-indigo-50 to-blue-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
        <Onboarding onComplete={() => setAuthStage('app')} />
      </div>
    );
  }


  function setShowProgress(show: boolean): void {
    setActiveScreen(show ? 'progress' : 'dashboard');
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-indigo-50 to-blue-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 pointer-events-none">
        <motion.div
          className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-violet-400/20 to-purple-500/20 rounded-full blur-3xl"
          animate={{
            x: [0, 100, 0],
            y: [0, 50, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-br from-indigo-400/20 to-blue-500/20 rounded-full blur-3xl"
          animate={{
            x: [0, -100, 0],
            y: [0, -50, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-purple-400/10 to-pink-500/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      <div className="relative z-10 flex h-screen">
        {/* Sidebar */}
        <AnimatePresence>
          {sidebarOpen && (
            <motion.div
              initial={{ x: -300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -300, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="w-72 flex-shrink-0 border-r border-white/20 dark:border-slate-700/50 backdrop-blur-xl bg-white/30 dark:bg-slate-900/30"
            >
              <SidebarNav
                onQuickAction={(action) => console.log(action)}
                onLogout={() => setAuthStage('auth')}
              />

            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Top Navigation */}
          <div className="border-b border-white/20 dark:border-slate-700/50 backdrop-blur-2xl bg-white/40 dark:bg-slate-900/40">
            <div className="flex items-center justify-between px-8 py-4">
              <div className="flex items-center gap-6">
                <button
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="p-2 rounded-xl backdrop-blur-xl bg-white/50 dark:bg-slate-800/50 border border-white/30 dark:border-slate-700/30 hover:bg-white/80 dark:hover:bg-slate-800/80 transition-all duration-300"
                >
                  {sidebarOpen ? <X className="w-5 h-5" /> : <LayoutDashboard className="w-5 h-5" />}
                </button>

                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-500 via-purple-500 to-indigo-500 flex items-center justify-center">
                    <span className="text-white text-sm">
                      <div className="w-full h-full rounded-2xl bg-white dark:bg-slate-900 flex items-center justify-center backdrop-blur-xl">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-100 via-purple-100 to-indigo-100 flex items-center justify-center">
                          <img
                            src="/logo192.png"
                            alt="App Logo"
                            className="w-7 h-7 object-contain mix-blend-multiply"
                          />
                        </div>
                      </div>
                    </span>
                  </div>
                  <h1 className="text-xl bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                    TwinSync
                  </h1>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveScreen(item.id)}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl transition-all duration-300 ${activeScreen === item.id
                      ? 'backdrop-blur-xl bg-gradient-to-r from-violet-500/20 to-purple-500/20 border border-violet-500/30 text-violet-700 dark:text-violet-300'
                      : 'backdrop-blur-xl bg-white/50 dark:bg-slate-800/50 border border-white/30 dark:border-slate-700/30 text-slate-600 dark:text-slate-300 hover:bg-white/80 dark:hover:bg-slate-800/80'
                      }`}
                  >
                    <item.icon className="w-4 h-4" />
                    <span className="text-sm hidden lg:inline">{item.label}</span>
                  </button>
                ))}

                {/* Theme Toggle */}
                <button
                  onClick={toggleTheme}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-2xl backdrop-blur-xl bg-white/50 dark:bg-slate-800/50 border border-white/30 dark:border-slate-700/30 text-slate-600 dark:text-slate-300 hover:bg-white/80 dark:hover:bg-slate-800/80 transition-all duration-300"
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

          {/* Content Area */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-8">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeScreen}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  {activeScreen === 'dashboard' && <Dashboard />}
                  {activeScreen === 'progress' && <Progress
                    onSave={(data) => console.log("Saved:", data)}
                    onBack={() => setShowProgress(false)}
                  />
                  }
                  {activeScreen === 'focus' && <FocusTimer />}
                  {activeScreen === 'insights' && <Insights />}
                  {activeScreen === 'settings' && <Settings />}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
