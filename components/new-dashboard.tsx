import { motion } from 'motion/react';
import { useState, useEffect, useMemo } from 'react';
import { DigitalTwinAvatar } from './digital-twin-avatar';
import { OneTapLogging } from './one-tap-logging';
import { SyncScoreRing } from './sync-score-ring';
import { StreaksBadges } from './streaks-badges';
import { ActivityFeed } from './activity-feed';
import { WhatIfSimulator } from './what-if-simulator';
import { ProgressCalendar } from './progress-calendar';
import { FeaturesGrid } from './features-grid';
import { DailyProgressData } from './add-progress';
import { ProgressHistory } from '../App';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Sparkles, PlusCircle, CheckCircle2, AlertCircle, TrendingUp, Lightbulb } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { 
  mockUserData, 
  weeklyHydrationData, 
  weeklyFocusData, 
  weeklySleepData, 
  badgesData,
  activitiesData
} from '../data/mock-data';

interface NewDashboardProps {
  onAddProgress: () => void;
  dailyProgress: DailyProgressData | null;
  progressHistory: ProgressHistory;
  onNavigate: (screen: string) => void;
}

export function NewDashboard({ onAddProgress, dailyProgress, progressHistory, onNavigate }: NewDashboardProps) {
  const [userData, setUserData] = useState(mockUserData);
  const [celebrate, setCelebrate] = useState(false);
  const [activities, setActivities] = useState<any[]>([]);
  const [badges, setBadges] = useState(badgesData);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedProgress, setSelectedProgress] = useState<DailyProgressData | null>(null);
  const [calendarDialogOpen, setCalendarDialogOpen] = useState(false);

  // Load daily goals from localStorage
  const dailyGoals = useMemo(() => {
    const saved = localStorage.getItem('twinsync_daily_goals');
    return saved ? JSON.parse(saved) : {
      water: 2.5,
      sleep: 8,
      focus: 6,
      steps: 10000
    };
  }, []);

  // Calculate weekly data from progress history
  const weeklyData = useMemo(() => {
    const last7Days = [];
    const today = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      const dayName = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][date.getDay()];
      
      const progress = progressHistory[dateStr];
      
      last7Days.push({
        day: dayName,
        date: dateStr,
        hydration: progress?.waterIntake || 0,
        focus: progress ? (progress.workHours + progress.learningHours) : 0,
        sleep: progress?.sleepHours || 0
      });
    }
    
    return last7Days;
  }, [progressHistory]);

  // Update userData when dailyProgress changes
  useEffect(() => {
    if (dailyProgress) {
      const newUserData = { ...userData };
      
      // Update today's data from progress
      newUserData.today.waterLitres = dailyProgress.waterIntake;
      newUserData.today.waterGlasses = Math.round(dailyProgress.waterIntake * 4);
      newUserData.today.sleepHours = dailyProgress.sleepHours;
      newUserData.today.focusHours = dailyProgress.workHours + dailyProgress.learningHours;
      
      // Calculate health score based on inputs
      // Higher inputs = higher score
      const waterScore = Math.min(25, (dailyProgress.waterIntake / 2.5) * 25);
      const sleepScore = Math.min(25, (dailyProgress.sleepHours / 8) * 25);
      const focusScore = Math.min(30, ((dailyProgress.workHours + dailyProgress.learningHours) / 8) * 30);
      
      // Meal score (breakfast, lunch, dinner)
      const mealCount = [dailyProgress.hadBreakfast, dailyProgress.hadLunch, dailyProgress.hadDinner].filter(Boolean).length;
      const mealScore = (mealCount / 3) * 10;
      
      // Activity score (steps)
      const stepScore = Math.min(10, (dailyProgress.steps / 10000) * 10);
      
      newUserData.healthScore = Math.round(waterScore + sleepScore + focusScore + mealScore + stepScore);
      
      setUserData(newUserData);
      
      // Add activity to feed
      const newActivity = {
        id: Date.now().toString(),
        type: 'progress' as any,
        label: 'Updated daily progress',
        timestamp: new Date().toISOString(),
        isMilestone: newUserData.healthScore >= 85
      };
      setActivities([newActivity, ...activities]);
    }
  }, [dailyProgress]);

  // Load real activities from localStorage
  useEffect(() => {
    const realActivities: any[] = [];

    try {
      // Water tracker activities
      const waterHistory = localStorage.getItem('twinsync_water_history');
      if (waterHistory) {
        const water = JSON.parse(waterHistory);
        Object.values(water).forEach((day: any) => {
          day.entries?.forEach((entry: any) => {
            realActivities.push({
              id: `water-${entry.timestamp}`,
              type: 'hydration',
              label: `Logged ${entry.amount}L of water`,
              timestamp: entry.timestamp
            });
          });
        });
      }

      // Focus timer activities
      const focusStats = localStorage.getItem('twinsync_focus_stats');
      if (focusStats) {
        const stats = JSON.parse(focusStats);
        if (stats.stats && stats.stats.sessionsToday > 0) {
          realActivities.push({
            id: `focus-${Date.now()}`,
            type: 'focus',
            label: `Completed ${stats.stats.sessionsToday} focus session${stats.stats.sessionsToday > 1 ? 's' : ''}`,
            timestamp: new Date().toISOString()
          });
        }
      }

      // Mood tracker activities
      const moodHistory = localStorage.getItem('twinsync_mood_history');
      if (moodHistory) {
        const moods = JSON.parse(moodHistory);
        Object.entries(moods).forEach(([date, entry]: [string, any]) => {
          realActivities.push({
            id: `mood-${date}`,
            type: 'mood',
            label: `Logged mood: ${entry.emoji}`,
            timestamp: entry.timestamp
          });
        });
      }

      // Sleep tracker activities
      const sleepHistory = localStorage.getItem('twinsync_sleep_history');
      if (sleepHistory) {
        const sleep = JSON.parse(sleepHistory);
        sleep.forEach((entry: any) => {
          realActivities.push({
            id: `sleep-${entry.timestamp}`,
            type: 'sleep',
            label: `Logged ${entry.hours}h ${entry.minutes}m of sleep`,
            timestamp: entry.timestamp
          });
        });
      }

      // Food log activities
      const foodHistory = localStorage.getItem('twinsync_food_history');
      if (foodHistory) {
        const food = JSON.parse(foodHistory);
        food.forEach((entry: any) => {
          realActivities.push({
            id: `food-${entry.id}`,
            type: 'progress',
            label: `Logged ${entry.name}`,
            timestamp: entry.timestamp
          });
        });
      }

      // Sort by timestamp (most recent first)
      realActivities.sort((a, b) => 
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );

      setActivities(realActivities);
    } catch (error) {
      console.error('Error loading activities:', error);
    }
  }, [dailyProgress, progressHistory]);

  // Real-time nudges system
  useEffect(() => {
    // Check for nudges every 2 hours (for demo, we'll show one on mount)
    const timer = setTimeout(() => {
      if (userData.today.breaks < 3) {
        toast('Your twin reminds you: Time for a break! 🌟', {
          description: "You haven't taken a break in 2 hours—stretch time!",
          action: {
            label: 'Log Break',
            onClick: () => handleLog('break')
          }
        });
      }
    }, 5000);

    return () => clearTimeout(timer);
  }, [userData.today.breaks]);

  const handleLog = (type: string) => {
    // Update user data based on log type
    const newUserData = { ...userData };
    let shouldCelebrate = false;

    switch (type) {
      case 'hydration':
        newUserData.today.waterLitres = Math.min(5, (userData.today.waterLitres || 0) + 0.25);
        newUserData.today.waterGlasses = Math.round(newUserData.today.waterLitres * 4);
        if (newUserData.today.waterLitres >= 2.5 && userData.today.waterLitres < 2.5) {
          shouldCelebrate = true;
          toast('🎉 Daily hydration goal reached!');
        } else {
          toast('💧 +0.25L logged!');
        }
        break;
      case 'break':
        newUserData.today.breaks = Math.min(10, userData.today.breaks + 1);
        toast('☕ Break logged!');
        break;
      case 'mood':
        // Navigate to mood tracker (handled in App.tsx)
        toast('😊 Opening mood tracker...');
        break;
      case 'focus':
        newUserData.today.focusHours = Math.min(12, userData.today.focusHours + 0.5);
        toast('🎯 +0.5h focus logged!');
        break;
      case 'sleep':
        // Navigate to sleep tracker (handled in App.tsx)
        toast('🌙 Opening sleep tracker...');
        break;
    }

    // Recalculate health score
    const waterScore = ((newUserData.today.waterLitres || 0) / 2.5) * 25;
    const breaksScore = (newUserData.today.breaks / 5) * 20;
    const focusScore = (newUserData.today.focusHours / 6) * 30;
    const sleepScore = (newUserData.today.sleepHours / 8) * 25;
    newUserData.healthScore = Math.min(100, Math.round(waterScore + breaksScore + focusScore + sleepScore));

    setUserData(newUserData);
    
    if (shouldCelebrate) {
      setCelebrate(true);
      setTimeout(() => setCelebrate(false), 2000);
    }

    // Add to activity feed
    const activityLabels: Record<string, string> = {
      hydration: 'Logged 0.25L water',
      break: 'Took a break',
      mood: 'Opened mood tracker',
      focus: 'Logged 0.5h focus',
      sleep: 'Opened sleep tracker'
    };
    
    const newActivity = {
      id: Date.now().toString(),
      type: type as any,
      label: activityLabels[type] || `Logged ${type}`,
      timestamp: new Date().toISOString(),
      isMilestone: shouldCelebrate
    };
    setActivities([newActivity, ...activities]);
  };

  const goals = {
    water: { current: userData.today.waterLitres || 0, target: dailyGoals.water },
    breaks: { current: userData.today.breaks, target: 5 },
    focus: { current: userData.today.focusHours, target: dailyGoals.focus },
    sleep: { current: userData.today.sleepHours, target: dailyGoals.sleep }
  };

  // Goal checking and feedback
  const goalFeedback = useMemo(() => {
    if (!dailyProgress) {
      return {
        met: [],
        notMet: [],
        tips: ['Start logging your progress to get personalized feedback!']
      };
    }

    const met = [];
    const notMet = [];
    const tips = [];

    // Water goal
    if (dailyProgress.waterIntake >= dailyGoals.water) {
      met.push({ goal: 'Hydration', value: `${dailyProgress.waterIntake}L / ${dailyGoals.water}L`, icon: '💧' });
    } else {
      notMet.push({ goal: 'Hydration', value: `${dailyProgress.waterIntake}L / ${dailyGoals.water}L`, icon: '💧' });
      tips.push('Drink more water throughout the day. Try keeping a water bottle nearby!');
    }

    // Sleep goal
    if (dailyProgress.sleepHours >= dailyGoals.sleep) {
      met.push({ goal: 'Sleep', value: `${dailyProgress.sleepHours}h / ${dailyGoals.sleep}h`, icon: '🌙' });
    } else {
      notMet.push({ goal: 'Sleep', value: `${dailyProgress.sleepHours}h / ${dailyGoals.sleep}h`, icon: '🌙' });
      tips.push(`Aim for ${dailyGoals.sleep} hours of sleep. Consider going to bed earlier tonight.`);
    }

    // Focus goal (work + learning)
    const totalFocus = dailyProgress.workHours + dailyProgress.learningHours;
    if (totalFocus >= dailyGoals.focus) {
      met.push({ goal: 'Focus', value: `${totalFocus}h / ${dailyGoals.focus}h`, icon: '🎯' });
    } else {
      notMet.push({ goal: 'Focus', value: `${totalFocus}h / ${dailyGoals.focus}h`, icon: '🎯' });
      tips.push(`Try to achieve at least ${dailyGoals.focus} hours of productive work and learning time.`);
    }

    // Steps goal
    if (dailyProgress.steps >= dailyGoals.steps) {
      met.push({ goal: 'Steps', value: `${dailyProgress.steps.toLocaleString()} / ${dailyGoals.steps.toLocaleString()}`, icon: '👟' });
    } else {
      notMet.push({ goal: 'Steps', value: `${dailyProgress.steps.toLocaleString()} / ${dailyGoals.steps.toLocaleString()}`, icon: '👟' });
      tips.push(`Take a walk to hit your ${dailyGoals.steps.toLocaleString()} step goal. Every step counts!`);
    }

    // Meals
    const mealsEaten = [dailyProgress.hadBreakfast, dailyProgress.hadLunch, dailyProgress.hadDinner].filter(Boolean).length;
    if (mealsEaten === 3) {
      met.push({ goal: 'Meals', value: `${mealsEaten} / 3`, icon: '🍽️' });
    } else {
      notMet.push({ goal: 'Meals', value: `${mealsEaten} / 3`, icon: '🍽️' });
      tips.push('Don\'t skip meals! Regular nutrition is key to productivity.');
    }

    // Social media warning
    if (dailyProgress.socialMediaHours > 3) {
      tips.push(`You spent ${dailyProgress.socialMediaHours}h on social media. Consider reducing screen time for better focus.`);
    }

    return { met, notMet, tips };
  }, [dailyProgress, dailyGoals]);

  const handleDateClick = (date: string, progress: DailyProgressData | null) => {
    setSelectedDate(date);
    setSelectedProgress(progress);
    setCalendarDialogOpen(true);
  };

  return (
    <div className="space-y-8 pb-8">
      {/* Add Progress CTA - Moved to Top */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-3xl backdrop-blur-3xl bg-gradient-to-br from-white/80 via-white/60 to-white/40 dark:from-slate-800/80 dark:via-slate-800/60 dark:to-slate-800/40 border-2 border-violet-500/40 dark:border-violet-500/40 p-10 shadow-[0_20px_60px_rgba(139,92,246,0.2)] dark:shadow-[0_20px_60px_rgba(139,92,246,0.3)]"
      >
        <div className="flex items-center justify-between flex-wrap gap-6">
          <div>
            <h3 className="text-2xl bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-2">
              Update progress made so far
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              Keep your twin in sync with your daily activities and stay on track with your goals
            </p>
          </div>
          <Button
            onClick={onAddProgress}
            size="lg"
            className="rounded-2xl bg-gradient-to-r from-violet-500 to-purple-500 text-white hover:from-violet-600 hover:to-purple-600 shadow-lg hover:shadow-xl hover:shadow-violet-500/30 text-base px-8 py-6 hover:scale-105 transition-all duration-300"
          >
            <PlusCircle className="w-5 h-5" />
            Update Progress
          </Button>
        </div>
      </motion.div>

      {/* Hero Section - Digital Twin & Score */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="rounded-3xl backdrop-blur-3xl bg-gradient-to-br from-white/80 via-white/60 to-white/40 dark:from-slate-800/80 dark:via-slate-800/60 dark:to-slate-800/40 border-2 border-white/30 dark:border-slate-700/60 p-8 shadow-[0_20px_60px_rgba(0,0,0,0.08)] dark:shadow-[0_20px_60px_rgba(0,0,0,0.3)]"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Digital Twin Avatar */}
          <div className="flex justify-center">
            <DigitalTwinAvatar
              healthScore={userData.healthScore}
              hydrationLevel={userData.today.waterLitres || 0}
              sleepQuality={userData.today.sleepHours}
              focusHours={userData.today.focusHours}
              onCelebrate={celebrate}
            />
          </div>

          {/* Sync Score Ring */}
          <div className="flex justify-center">
            <SyncScoreRing
              score={userData.healthScore}
              previousScore={75}
              goals={goals}
            />
          </div>
        </div>

        {/* Goal Status & Feedback */}
        {dailyProgress && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-6 space-y-4"
          >
            {/* Goals Met */}
            {goalFeedback.met.length > 0 && (
              <div className="p-4 rounded-2xl backdrop-blur-xl bg-gradient-to-br from-emerald-500/20 to-green-500/20 border border-emerald-500/30">
                <div className="flex items-center gap-2 mb-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <h4 className="text-sm text-emerald-700 dark:text-emerald-300">Goals Met Today! 🎉</h4>
                </div>
                <div className="flex flex-wrap gap-2">
                  {goalFeedback.met.map((item, idx) => (
                    <div key={idx} className="px-3 py-1.5 rounded-xl bg-white/50 dark:bg-slate-800/50 text-xs text-slate-700 dark:text-slate-200">
                      {item.icon} {item.goal}: {item.value}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Goals Not Met */}
            {goalFeedback.notMet.length > 0 && (
              <div className="p-4 rounded-2xl backdrop-blur-xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/30">
                <div className="flex items-center gap-2 mb-3">
                  <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                  <h4 className="text-sm text-amber-700 dark:text-amber-300">Room for Improvement</h4>
                </div>
                <div className="flex flex-wrap gap-2">
                  {goalFeedback.notMet.map((item, idx) => (
                    <div key={idx} className="px-3 py-1.5 rounded-xl bg-white/50 dark:bg-slate-800/50 text-xs text-slate-700 dark:text-slate-200">
                      {item.icon} {item.goal}: {item.value}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tips */}
            {goalFeedback.tips.length > 0 && (
              <div className="p-4 rounded-2xl backdrop-blur-xl bg-gradient-to-br from-violet-500/20 to-purple-500/20 border border-violet-500/30">
                <div className="flex items-center gap-2 mb-3">
                  <Lightbulb className="w-4 h-4 text-violet-600 dark:text-violet-400" />
                  <h4 className="text-sm text-violet-700 dark:text-violet-300">Helpful Tips</h4>
                </div>
                <ul className="space-y-2">
                  {goalFeedback.tips.map((tip, idx) => (
                    <li key={idx} className="text-xs text-slate-700 dark:text-slate-200 flex items-start gap-2">
                      <span className="text-violet-500 mt-0.5">•</span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </motion.div>
        )}
      </motion.div>

      {/* Progress Calendar & Activity Feed Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Progress Calendar */}
        <div className="lg:col-span-1">
          <ProgressCalendar 
            progressHistory={progressHistory} 
            onDateClick={handleDateClick} 
          />
        </div>

        {/* Activity Feed */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-2 rounded-3xl backdrop-blur-3xl bg-gradient-to-br from-white/80 via-white/60 to-white/40 dark:from-slate-800/80 dark:via-slate-800/60 dark:to-slate-800/40 border-2 border-white/30 dark:border-slate-700/60 p-8 shadow-[0_20px_60px_rgba(0,0,0,0.08)] dark:shadow-[0_20px_60px_rgba(0,0,0,0.3)]"
        >
          <ActivityFeed activities={activities} maxItems={10} />
        </motion.div>
      </div>

      {/* Features Grid */}
      <FeaturesGrid onNavigate={onNavigate} />

      {/* Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Hydration Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="rounded-3xl backdrop-blur-3xl bg-gradient-to-br from-white/80 via-white/60 to-white/40 dark:from-slate-800/80 dark:via-slate-800/60 dark:to-slate-800/40 border-2 border-white/30 dark:border-slate-700/60 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.08)] dark:shadow-[0_20px_60px_rgba(0,0,0,0.3)]"
        >
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-4 h-4 text-violet-500" />
            <h4 className="text-slate-600 dark:text-slate-300">Weekly Hydration (Litres)</h4>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={weeklyData}>
              <defs>
                <linearGradient id="hydrationGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.8} />
                  <stop offset="100%" stopColor="#06b6d4" stopOpacity={0.3} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.3} />
              <XAxis dataKey="day" stroke="#94a3b8" fontSize={12} />
              <YAxis stroke="#94a3b8" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  border: 'none',
                  borderRadius: '12px',
                  backdropFilter: 'blur(10px)'
                }}
              />
              <Bar dataKey="hydration" fill="url(#hydrationGradient)" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Focus Hours Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="rounded-3xl backdrop-blur-3xl bg-gradient-to-br from-white/80 via-white/60 to-white/40 dark:from-slate-800/80 dark:via-slate-800/60 dark:to-slate-800/40 border-2 border-white/30 dark:border-slate-700/60 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.08)] dark:shadow-[0_20px_60px_rgba(0,0,0,0.3)]"
        >
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-4 h-4 text-violet-500" />
            <h4 className="text-slate-600 dark:text-slate-300">Weekly Focus Hours</h4>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={weeklyData}>
              <defs>
                <linearGradient id="focusGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.8} />
                  <stop offset="100%" stopColor="#6366f1" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.3} />
              <XAxis dataKey="day" stroke="#94a3b8" fontSize={12} />
              <YAxis stroke="#94a3b8" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  border: 'none',
                  borderRadius: '12px',
                  backdropFilter: 'blur(10px)'
                }}
              />
              <Area type="monotone" dataKey="focus" stroke="#8b5cf6" strokeWidth={2} fill="url(#focusGradient)" />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* What-If Simulator */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="rounded-3xl backdrop-blur-3xl bg-gradient-to-br from-white/80 via-white/60 to-white/40 dark:from-slate-800/80 dark:via-slate-800/60 dark:to-slate-800/40 border-2 border-white/30 dark:border-slate-700/60 p-8 shadow-[0_20px_60px_rgba(0,0,0,0.08)] dark:shadow-[0_20px_60px_rgba(0,0,0,0.3)]"
      >
        <WhatIfSimulator
          currentHabits={{
            water: userData.today.waterLitres || 0,
            breaks: userData.today.breaks,
            focus: userData.today.focusHours,
            sleep: userData.today.sleepHours
          }}
        />
      </motion.div>

      {/* Calendar Progress Dialog */}
      <Dialog open={calendarDialogOpen} onOpenChange={setCalendarDialogOpen}>
        <DialogContent className="backdrop-blur-2xl bg-gradient-to-br from-white/90 via-white/80 to-white/70 dark:from-slate-800/90 dark:via-slate-800/80 dark:to-slate-800/70 border border-white/20 dark:border-slate-700/50">
          <DialogHeader>
            <DialogTitle>Progress for {selectedDate}</DialogTitle>
            <DialogDescription>
              {selectedProgress ? "Here's what you logged on this day:" : "No progress logged for this day."}
            </DialogDescription>
          </DialogHeader>
          {selectedProgress && (
            <div className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-white/50 dark:bg-slate-700/50">
                  <p className="text-xs text-slate-500 dark:text-slate-400">Water Intake</p>
                  <p className="text-xl text-slate-800 dark:text-white">{selectedProgress.waterIntake}L</p>
                </div>
                <div className="p-4 rounded-xl bg-white/50 dark:bg-slate-700/50">
                  <p className="text-xs text-slate-500 dark:text-slate-400">Sleep Hours</p>
                  <p className="text-xl text-slate-800 dark:text-white">{selectedProgress.sleepHours}h</p>
                </div>
                <div className="p-4 rounded-xl bg-white/50 dark:bg-slate-700/50">
                  <p className="text-xs text-slate-500 dark:text-slate-400">Work Hours</p>
                  <p className="text-xl text-slate-800 dark:text-white">{selectedProgress.workHours}h</p>
                </div>
                <div className="p-4 rounded-xl bg-white/50 dark:bg-slate-700/50">
                  <p className="text-xs text-slate-500 dark:text-slate-400">Learning Hours</p>
                  <p className="text-xl text-slate-800 dark:text-white">{selectedProgress.learningHours}h</p>
                </div>
                <div className="p-4 rounded-xl bg-white/50 dark:bg-slate-700/50">
                  <p className="text-xs text-slate-500 dark:text-slate-400">Steps</p>
                  <p className="text-xl text-slate-800 dark:text-white">{selectedProgress.steps.toLocaleString()}</p>
                </div>
                <div className="p-4 rounded-xl bg-white/50 dark:bg-slate-700/50">
                  <p className="text-xs text-slate-500 dark:text-slate-400">Social Media</p>
                  <p className="text-xl text-slate-800 dark:text-white">{selectedProgress.socialMediaHours}h</p>
                </div>
              </div>
              <div className="p-4 rounded-xl bg-white/50 dark:bg-slate-700/50">
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">Meals</p>
                <div className="flex gap-2">
                  {selectedProgress.hadBreakfast && <span className="px-3 py-1 rounded-lg bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-xs">Breakfast</span>}
                  {selectedProgress.hadLunch && <span className="px-3 py-1 rounded-lg bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-xs">Lunch</span>}
                  {selectedProgress.hadDinner && <span className="px-3 py-1 rounded-lg bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-xs">Dinner</span>}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
