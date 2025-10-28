import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, Moon, Sun, Home, TrendingUp, Settings as SettingsIcon, ClipboardList } from 'lucide-react';
import { SidebarNav } from './components/sidebar-nav';
import { NewDashboard } from './components/new-dashboard';
import { Onboarding } from './components/onboarding';
import { Login } from './components/login';
import { Signup } from './components/signup';
import { FocusTimer } from './components/focus-timer';
import { WaterTracker } from './components/water-tracker';
import { MoodTracker } from './components/mood-tracker';
import { SleepTracker } from './components/sleep-tracker';
import { Insights } from './components/insights';
import { Settings } from './components/settings';
import { SearchBar } from './components/search-bar';
import { AddProgress, DailyProgressData } from './components/add-progress';
import { Achievements } from './components/achievements';
import { ActivityLog } from './components/activity-log';
import { FoodLog } from './components/food-log';
import { ComprehensiveHabitHeatmap } from './components/comprehensive-habit-heatmap';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './components/ui/dialog';
import { Button } from './components/ui/button';
import { toast } from 'sonner@2.0.3';

type Screen = 'dashboard' | 'focus' | 'water' | 'mood' | 'sleep' | 'insights' | 'settings' | 'add-progress' | 'achievements' | 'activity-log' | 'food-log' | 'habit-heatmap';
type AuthScreen = 'onboarding' | 'login' | 'signup';

export interface ProgressHistory {
  [date: string]: DailyProgressData;
}

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authScreen, setAuthScreen] = useState<AuthScreen>('onboarding');
  const [activeScreen, setActiveScreen] = useState<Screen>('dashboard');
  const [progressDialogOpen, setProgressDialogOpen] = useState(false);

  // Scroll to top when changing screens
  useEffect(() => {
    const contentArea = document.querySelector('.content-area');
    if (contentArea) {
      contentArea.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [activeScreen]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [dailyProgress, setDailyProgress] = useState<DailyProgressData | null>(null);
  const [progressHistory, setProgressHistory] = useState<ProgressHistory>(() => {
    const saved = localStorage.getItem('twinsync_progress_history');
    return saved ? JSON.parse(saved) : {};
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };

  // Save progress history to localStorage
  useEffect(() => {
    localStorage.setItem('twinsync_progress_history', JSON.stringify(progressHistory));
  }, [progressHistory]);

  const handleProgressSave = (data: DailyProgressData) => {
    setDailyProgress(data);
    // Save to history
    setProgressHistory(prev => ({
      ...prev,
      [data.date]: data
    }));
    // Progress will be used in NewDashboard to update digital twin, sync score, and activity feed
  };

  // Get today's progress
  const today = new Date().toISOString().split('T')[0];
  const todayProgress = progressHistory[today] || dailyProgress;

  const handleLogin = () => {
    setIsAuthenticated(true);
    toast('✅ Successfully logged in!');
  };

  const handleSignup = () => {
    setIsAuthenticated(true);
    toast('🎉 Account created successfully!');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setAuthScreen('onboarding');
    toast('👋 Logged out successfully');
  };

  const navItems = [
    { id: 'dashboard' as Screen, label: 'Dashboard', icon: Home },
    { id: 'insights' as Screen, label: 'Insights', icon: TrendingUp },
    { id: 'settings' as Screen, label: 'Settings', icon: SettingsIcon }
  ];

  // Show authentication screens if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-violet-50 via-indigo-50 to-blue-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
        {authScreen === 'onboarding' && (
          <Onboarding
            onComplete={handleLogin}
            onLogin={() => setAuthScreen('login')}
            onSignup={() => setAuthScreen('signup')}
            darkMode={darkMode}
            onToggleTheme={toggleTheme}
          />
        )}
        {authScreen === 'login' && (
          <Login
            onLogin={handleLogin}
            onSwitchToSignup={() => setAuthScreen('signup')}
          />
        )}
        {authScreen === 'signup' && (
          <Signup
            onSignup={handleSignup}
            onSwitchToLogin={() => setAuthScreen('login')}
          />
        )}
      </div>
    );
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
              <SidebarNav onLogout={handleLogout} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Top Navigation */}
          <div className="relative border-b-2 border-white/30 dark:border-slate-700/60 backdrop-blur-3xl bg-gradient-to-r from-white/70 via-white/60 to-white/50 dark:from-slate-900/70 dark:via-slate-900/60 dark:to-slate-900/50 shadow-lg shadow-violet-500/5 dark:shadow-violet-500/10 z-50">
            <div className="flex items-center justify-between px-8 py-4 gap-4">
              <div className="flex items-center gap-6">
                <button
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="p-2 rounded-xl backdrop-blur-xl bg-white/50 dark:bg-slate-800/50 border border-white/30 dark:border-slate-700/30 hover:bg-white/80 dark:hover:bg-slate-800/80 hover:scale-110 hover:shadow-lg transition-all duration-300"
                >
                  {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>
                
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-500 via-purple-500 to-indigo-500 flex items-center justify-center">
                    <span className="text-white text-sm">T</span>
                  </div>
                  <h1 className="text-xl bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                    TwinSync
                  </h1>
                </div>
              </div>

              {/* Search Bar */}
              <div className="flex-1 max-w-md">
                <SearchBar onNavigate={(screen) => setActiveScreen(screen as Screen)} />
              </div>

              <div className="flex items-center gap-2">
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveScreen(item.id)}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl transition-all duration-300 hover:scale-105 ${
                      activeScreen === item.id
                        ? 'backdrop-blur-xl bg-gradient-to-r from-violet-500/20 to-purple-500/20 border border-violet-500/30 text-violet-700 dark:text-violet-300 shadow-lg shadow-violet-500/20'
                        : 'backdrop-blur-xl bg-white/50 dark:bg-slate-800/50 border border-white/30 dark:border-slate-700/30 text-slate-600 dark:text-slate-300 hover:bg-white/80 dark:hover:bg-slate-800/80 hover:shadow-md'
                    }`}
                  >
                    <item.icon className="w-4 h-4" />
                    <span className="text-sm hidden lg:inline">{item.label}</span>
                  </button>
                ))}
                
                {/* Today's Progress Button */}
                <Dialog open={progressDialogOpen} onOpenChange={setProgressDialogOpen}>
                  <DialogTrigger asChild>
                    <button
                      className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl transition-all duration-300 ${
                        todayProgress
                          ? 'backdrop-blur-xl bg-gradient-to-r from-emerald-500/20 to-green-500/20 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300'
                          : 'backdrop-blur-xl bg-white/50 dark:bg-slate-800/50 border border-white/30 dark:border-slate-700/30 text-slate-600 dark:text-slate-300 hover:bg-white/80 dark:hover:bg-slate-800/80'
                      }`}
                    >
                      <ClipboardList className="w-4 h-4" />
                      <span className="text-sm hidden lg:inline">Progress</span>
                      {todayProgress && (
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      )}
                    </button>
                  </DialogTrigger>
                  <DialogContent className="backdrop-blur-2xl bg-white/90 dark:bg-slate-800/90 border border-white/30 dark:border-slate-700/30 max-w-md">
                    <DialogHeader>
                      <DialogTitle className="text-slate-800 dark:text-white">Today's Progress</DialogTitle>
                      <DialogDescription className="text-slate-600 dark:text-slate-400">
                        View your logged activities and metrics for today
                      </DialogDescription>
                    </DialogHeader>
                    {todayProgress ? (
                      <div className="space-y-4">
                        <div className="p-4 rounded-2xl backdrop-blur-xl bg-gradient-to-br from-white/60 to-white/30 dark:from-slate-700/60 dark:to-slate-700/30 border border-white/30 dark:border-slate-600/30">
                          <div className="text-xs text-slate-500 dark:text-slate-400 mb-2">Mood</div>
                          <div className="text-lg text-slate-800 dark:text-white capitalize">{todayProgress.mood}</div>
                          {todayProgress.moodNotes && (
                            <p className="text-xs text-slate-600 dark:text-slate-300 mt-2">{todayProgress.moodNotes}</p>
                          )}
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="p-3 rounded-2xl backdrop-blur-xl bg-white/60 dark:bg-slate-700/60 border border-white/30 dark:border-slate-600/30">
                            <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">Water</div>
                            <div className="text-lg text-blue-600 dark:text-blue-400">{todayProgress.waterIntake}L</div>
                          </div>
                          <div className="p-3 rounded-2xl backdrop-blur-xl bg-white/60 dark:bg-slate-700/60 border border-white/30 dark:border-slate-600/30">
                            <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">Sleep</div>
                            <div className="text-lg text-indigo-600 dark:text-indigo-400">{todayProgress.sleepHours}h</div>
                          </div>
                          <div className="p-3 rounded-2xl backdrop-blur-xl bg-white/60 dark:bg-slate-700/60 border border-white/30 dark:border-slate-600/30">
                            <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">Work</div>
                            <div className="text-lg text-violet-600 dark:text-violet-400">{todayProgress.workHours}h</div>
                          </div>
                          <div className="p-3 rounded-2xl backdrop-blur-xl bg-white/60 dark:bg-slate-700/60 border border-white/30 dark:border-slate-600/30">
                            <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">Learning</div>
                            <div className="text-lg text-blue-600 dark:text-blue-400">{todayProgress.learningHours}h</div>
                          </div>
                          <div className="p-3 rounded-2xl backdrop-blur-xl bg-white/60 dark:bg-slate-700/60 border border-white/30 dark:border-slate-600/30">
                            <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">Steps</div>
                            <div className="text-lg text-emerald-600 dark:text-emerald-400">{todayProgress.steps.toLocaleString()}</div>
                          </div>
                          <div className="p-3 rounded-2xl backdrop-blur-xl bg-white/60 dark:bg-slate-700/60 border border-white/30 dark:border-slate-600/30">
                            <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">Social Media</div>
                            <div className="text-lg text-pink-600 dark:text-pink-400">{todayProgress.socialMediaHours}h</div>
                          </div>
                        </div>
                        <Button
                          onClick={() => {
                            setActiveScreen('add-progress');
                            setProgressDialogOpen(false);
                          }}
                          className="w-full rounded-2xl bg-gradient-to-r from-violet-500 to-purple-500 text-white hover:from-violet-600 hover:to-purple-600 transition-all"
                        >
                          Update Progress
                        </Button>
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-sm text-slate-600 dark:text-slate-300 mb-4">No progress logged for today yet.</p>
                        <Button
                          onClick={() => {
                            setActiveScreen('add-progress');
                            setProgressDialogOpen(false);
                          }}
                          className="rounded-2xl bg-gradient-to-r from-violet-500 to-purple-500 text-white hover:from-violet-600 hover:to-purple-600 transition-all"
                        >
                          Add Today's Progress
                        </Button>
                      </div>
                    )}
                  </DialogContent>
                </Dialog>
                
                {/* Theme Toggle */}
                <button
                  onClick={toggleTheme}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-2xl backdrop-blur-xl bg-white/50 dark:bg-slate-800/50 border border-white/30 dark:border-slate-700/30 text-slate-600 dark:text-slate-300 hover:bg-white/80 dark:hover:bg-slate-800/80 hover:scale-110 hover:shadow-lg hover:rotate-12 transition-all duration-300"
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
          <div className="flex-1 overflow-y-auto content-area">
            <div className="p-8">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeScreen}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  {activeScreen === 'dashboard' && <NewDashboard onAddProgress={() => setActiveScreen('add-progress')} dailyProgress={dailyProgress} progressHistory={progressHistory} onNavigate={(screen) => setActiveScreen(screen as Screen)} />}
                  {activeScreen === 'focus' && <FocusTimer />}
                  {activeScreen === 'water' && <WaterTracker />}
                  {activeScreen === 'mood' && <MoodTracker />}
                  {activeScreen === 'sleep' && <SleepTracker />}
                  {activeScreen === 'insights' && <Insights progressHistory={progressHistory} />}
                  {activeScreen === 'achievements' && <Achievements />}
                  {activeScreen === 'activity-log' && <ActivityLog />}
                  {activeScreen === 'food-log' && <FoodLog />}
                  {activeScreen === 'habit-heatmap' && <ComprehensiveHabitHeatmap />}
                  {activeScreen === 'settings' && <Settings />}
                  {activeScreen === 'add-progress' && <AddProgress onBack={() => setActiveScreen('dashboard')} onSave={handleProgressSave} />}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
