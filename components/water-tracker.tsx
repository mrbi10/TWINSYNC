import { motion } from 'motion/react';
import { Droplet, TrendingUp, Plus, AlertCircle, Sparkles } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { toast } from 'sonner@2.0.3';

interface WaterEntry {
  amount: number;
  timestamp: string;
  date: string;
}

interface DailyWaterData {
  date: string;
  total: number;
  entries: WaterEntry[];
}

export function WaterTracker() {
  const [waterHistory, setWaterHistory] = useState<Record<string, DailyWaterData>>(() => {
    const saved = localStorage.getItem('twinsync_water_history');
    return saved ? JSON.parse(saved) : {};
  });

  const [inputValue, setInputValue] = useState('');
  const dailyGoal = 2.5; // 2.5 litres
  
  const today = new Date().toISOString().split('T')[0];
  const todayData = waterHistory[today] || { date: today, total: 0, entries: [] };
  const litresConsumed = todayData.total;
  const percentage = Math.min((litresConsumed / dailyGoal) * 100, 100);

  useEffect(() => {
    localStorage.setItem('twinsync_water_history', JSON.stringify(waterHistory));
  }, [waterHistory]);

  const handleAddWater = () => {
    const amount = parseFloat(inputValue);
    if (isNaN(amount) || amount <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    const entry: WaterEntry = {
      amount,
      timestamp: new Date().toISOString(),
      date: today
    };

    const newTotal = litresConsumed + amount;
    
    setWaterHistory(prev => ({
      ...prev,
      [today]: {
        date: today,
        total: newTotal,
        entries: [...(prev[today]?.entries || []), entry]
      }
    }));

    setInputValue('');
    
    if (newTotal >= dailyGoal && litresConsumed < dailyGoal) {
      toast.success('🎉 Daily hydration goal reached!');
    } else {
      toast.success(`💧 Added ${amount}L - Great job staying hydrated!`);
    }
  };

  const handleQuickAdd = (amount: number) => {
    const entry: WaterEntry = {
      amount,
      timestamp: new Date().toISOString(),
      date: today
    };

    const newTotal = litresConsumed + amount;
    
    setWaterHistory(prev => ({
      ...prev,
      [today]: {
        date: today,
        total: newTotal,
        entries: [...(prev[today]?.entries || []), entry]
      }
    }));
    
    if (newTotal >= dailyGoal && litresConsumed < dailyGoal) {
      toast.success('🎉 Daily hydration goal reached!');
    } else {
      toast.success(`💧 Added ${amount}L`);
    }
  };

  // Calculate weekly data from history
  const getWeeklyData = () => {
    const weekData = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      const dayData = waterHistory[dateStr];
      
      weekData.push({
        day: date.toLocaleDateString('en-US', { weekday: 'short' }),
        litres: dayData ? dayData.total : 0,
        date: dateStr
      });
    }
    return weekData;
  };

  const weeklyData = getWeeklyData();

  // Calculate statistics
  const calculateStats = () => {
    const allDays = Object.values(waterHistory);
    
    if (allDays.length === 0) {
      return {
        weeklyAverage: 0,
        bestDay: { amount: 0, date: 'N/A' }
      };
    }

    // Weekly average (last 7 days)
    const weeklyTotal = weeklyData.reduce((sum, day) => sum + day.litres, 0);
    const weeklyAverage = weeklyTotal / 7;

    // Best day
    const bestDay = allDays.reduce((best, current) => 
      current.total > best.total ? current : best
    );

    return {
      weeklyAverage,
      bestDay: {
        amount: bestDay.total,
        date: new Date(bestDay.date).toLocaleDateString('en-US', { weekday: 'long' })
      }
    };
  };

  const stats = calculateStats();

  // Hydration insights
  const getHydrationInsights = () => {
    if (litresConsumed === 0) {
      return {
        status: 'start',
        message: 'Start tracking your water intake today!',
        color: 'text-slate-600 dark:text-slate-400',
        icon: '💧'
      };
    } else if (litresConsumed < dailyGoal * 0.5) {
      return {
        status: 'low',
        message: 'You need more water - stay hydrated!',
        color: 'text-orange-600 dark:text-orange-400',
        icon: '⚠️'
      };
    } else if (litresConsumed < dailyGoal) {
      return {
        status: 'moderate',
        message: 'Good progress! Keep it up!',
        color: 'text-blue-600 dark:text-blue-400',
        icon: '👍'
      };
    } else {
      return {
        status: 'excellent',
        message: 'Excellent! You\'ve reached your goal!',
        color: 'text-emerald-600 dark:text-emerald-400',
        icon: '✨'
      };
    }
  };

  const insight = getHydrationInsights();

  return (
    <div className="space-y-6 p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-3xl backdrop-blur-2xl bg-gradient-to-br from-white/70 via-white/50 to-white/30 dark:from-slate-800/70 dark:via-slate-800/50 dark:to-slate-800/30 border border-white/20 dark:border-slate-700/50 p-8 shadow-2xl"
      >
        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 shadow-lg shadow-blue-500/30">
            <Droplet className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl text-slate-800 dark:text-white">Hydration Tracker</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">Track your daily water intake</p>
          </div>
        </div>

        {/* Main Counter */}
        <div className="flex flex-col items-center justify-center mb-8">
          <motion.div
            className="relative w-64 h-64 mb-6"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
          >
            {/* Progress Circle */}
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="128"
                cy="128"
                r="110"
                stroke="currentColor"
                strokeWidth="12"
                fill="none"
                className="text-slate-200 dark:text-slate-700"
              />
              <motion.circle
                cx="128"
                cy="128"
                r="110"
                stroke="url(#waterGradient)"
                strokeWidth="12"
                fill="none"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 110}`}
                initial={{ strokeDashoffset: 2 * Math.PI * 110 }}
                animate={{ strokeDashoffset: 2 * Math.PI * 110 * (1 - percentage / 100) }}
                transition={{ duration: 1, delay: 0.5 }}
              />
              <defs>
                <linearGradient id="waterGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#3b82f6" />
                  <stop offset="100%" stopColor="#06b6d4" />
                </linearGradient>
              </defs>
            </svg>

            {/* Center Content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="text-5xl bg-gradient-to-br from-blue-600 to-cyan-600 bg-clip-text text-transparent mb-2">
                {litresConsumed.toFixed(1)}L
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-300">of {dailyGoal}L</div>
              <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">{Math.round(percentage)}% of goal</div>
            </div>
          </motion.div>

          {/* Status Message */}
          <div className={`flex items-center gap-2 mb-4 ${insight.color}`}>
            <span className="text-2xl">{insight.icon}</span>
            <span className="text-sm">{insight.message}</span>
          </div>

          {/* Input Section */}
          <div className="w-full max-w-md space-y-4">
            <div className="flex gap-3">
              <Input
                type="number"
                step="0.1"
                min="0"
                max="5"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Enter litres (e.g., 0.5)"
                className="flex-1 rounded-2xl backdrop-blur-xl bg-white/50 dark:bg-slate-800/50 border border-white/30 dark:border-slate-700/30 placeholder:text-slate-400/50 dark:placeholder:text-slate-500/50"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleAddWater();
                  }
                }}
              />
              <Button
                onClick={handleAddWater}
                className="px-6 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white shadow-lg shadow-blue-500/30"
              >
                <Plus className="w-5 h-5" />
              </Button>
            </div>

            {/* Quick Add Buttons */}
            <div className="flex gap-2">
              <Button
                onClick={() => handleQuickAdd(0.25)}
                variant="outline"
                className="flex-1 rounded-2xl backdrop-blur-xl bg-white/50 dark:bg-slate-800/50 border border-blue-500/30 hover:bg-blue-500/10"
              >
                +0.25L
              </Button>
              <Button
                onClick={() => handleQuickAdd(0.5)}
                variant="outline"
                className="flex-1 rounded-2xl backdrop-blur-xl bg-white/50 dark:bg-slate-800/50 border border-blue-500/30 hover:bg-blue-500/10"
              >
                +0.5L
              </Button>
              <Button
                onClick={() => handleQuickAdd(1.0)}
                variant="outline"
                className="flex-1 rounded-2xl backdrop-blur-xl bg-white/50 dark:bg-slate-800/50 border border-blue-500/30 hover:bg-blue-500/10"
              >
                +1.0L
              </Button>
            </div>
          </div>
        </div>

        {/* Visual Progress Bar */}
        <div className="relative h-24 rounded-2xl backdrop-blur-xl bg-slate-200/50 dark:bg-slate-700/50 overflow-hidden">
          <motion.div
            className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-blue-500 via-blue-400 to-cyan-400"
            initial={{ height: 0 }}
            animate={{ height: `${percentage}%` }}
            transition={{ duration: 1, delay: 0.3 }}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <Droplet className="w-12 h-12 text-white/80" />
          </div>
        </div>
      </motion.div>

      {/* Weekly Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="rounded-3xl backdrop-blur-2xl bg-gradient-to-br from-white/70 via-white/50 to-white/30 dark:from-slate-800/70 dark:via-slate-800/50 dark:to-slate-800/30 border border-white/20 dark:border-slate-700/50 p-8 shadow-2xl"
      >
        <div className="flex items-center gap-2 mb-6">
          <TrendingUp className="w-5 h-5 text-blue-500" />
          <h3 className="text-xl text-slate-800 dark:text-white">Weekly Progress</h3>
        </div>

        <div className="flex items-end justify-between gap-3 h-48">
          {weeklyData.map((data, index) => (
            <motion.div
              key={data.date}
              className="flex-1 flex flex-col items-center gap-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + index * 0.1 }}
            >
              <div 
                className={`w-full rounded-t-xl ${
                  data.litres === 0 
                    ? 'bg-slate-300 dark:bg-slate-600' 
                    : 'bg-gradient-to-t from-blue-500 to-cyan-400'
                } relative`}
                style={{ height: `${data.litres === 0 ? 10 : (data.litres / 3) * 100}%`, minHeight: '20px' }}
              >
                {data.litres > 0 && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Droplet className="w-4 h-4 text-white/60" />
                  </div>
                )}
              </div>
              <div className="text-xs text-slate-600 dark:text-slate-300">{data.day}</div>
              <div className={`text-xs ${data.litres === 0 ? 'text-slate-400' : 'text-blue-600 dark:text-blue-400'}`}>
                {data.litres.toFixed(1)}L
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Daily Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        <div className="p-6 rounded-2xl backdrop-blur-xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-500/30">
          <div className="text-sm text-slate-600 dark:text-slate-300 mb-2">Today's Total</div>
          <div className="text-2xl text-blue-600 dark:text-blue-400">{litresConsumed.toFixed(1)}L</div>
          <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">≈ {Math.round(litresConsumed * 4)} glasses</div>
        </div>

        <div className="p-6 rounded-2xl backdrop-blur-xl bg-gradient-to-br from-emerald-500/20 to-green-500/20 border border-emerald-500/30">
          <div className="text-sm text-slate-600 dark:text-slate-300 mb-2">Weekly Average</div>
          <div className="text-2xl text-emerald-600 dark:text-emerald-400">
            {stats.weeklyAverage.toFixed(1)}L
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">Per day</div>
        </div>

        <div className="p-6 rounded-2xl backdrop-blur-xl bg-gradient-to-br from-violet-500/20 to-purple-500/20 border border-violet-500/30">
          <div className="text-sm text-slate-600 dark:text-slate-300 mb-2">Best Day</div>
          <div className="text-2xl text-violet-600 dark:text-violet-400">
            {stats.bestDay.amount.toFixed(1)}L
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">{stats.bestDay.date}</div>
        </div>
      </motion.div>

      {/* Hydration Patterns & Insights */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="rounded-3xl backdrop-blur-2xl bg-gradient-to-br from-white/70 via-white/50 to-white/30 dark:from-slate-800/70 dark:via-slate-800/50 dark:to-slate-800/30 border border-white/20 dark:border-slate-700/50 p-8 shadow-2xl"
      >
        <div className="flex items-center gap-2 mb-6">
          <Sparkles className="w-5 h-5 text-cyan-500" />
          <h3 className="text-xl text-slate-800 dark:text-white">Hydration Insights</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="p-4 rounded-2xl bg-blue-500/10 border border-blue-500/20">
            <div className="text-sm text-slate-700 dark:text-slate-200 mb-2">💡 Did you know?</div>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Your body is about 60% water. Staying hydrated helps regulate body temperature, transport nutrients, and maintain organ function.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
            <div className="text-sm text-slate-700 dark:text-slate-200 mb-2">🎯 Optimal Timing</div>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Drink water first thing in the morning, before meals, and throughout the day to maintain consistent hydration levels.
            </p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-500/20">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-5 h-5 text-orange-600 dark:text-orange-400 flex-shrink-0 mt-0.5" />
            <div>
              <div className="text-sm text-slate-700 dark:text-slate-200 mb-1">Dehydration Symptoms</div>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Watch for: dry mouth, fatigue, dizziness, dark urine, headaches, decreased concentration
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Tips */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="rounded-3xl backdrop-blur-2xl bg-gradient-to-br from-blue-500/10 via-cyan-500/10 to-blue-500/10 border border-blue-500/20 p-6"
      >
        <h4 className="text-sm text-slate-700 dark:text-slate-200 mb-3">💧 Hydration Tips & Recommendations</h4>
        <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
          <li>• Aim for 2-3 litres daily (8-10 glasses) - adjust based on activity and climate</li>
          <li>• Start your day with a glass of water to kickstart your metabolism</li>
          <li>• Drink before, during, and after exercise - add 0.5-1L for intense workouts</li>
          <li>• Keep a reusable water bottle with you as a visual reminder</li>
          <li>• Set hourly reminders if you struggle to remember</li>
          <li>• Eat water-rich foods: cucumbers, watermelon, oranges, lettuce</li>
          <li>• Monitor urine color - pale yellow indicates good hydration</li>
        </ul>
      </motion.div>
    </div>
  );
}
