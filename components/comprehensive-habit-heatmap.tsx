import { motion } from 'motion/react';
import { useState, useEffect } from 'react';
import { Plus, Trash2, TrendingUp, Calendar, Flame } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { toast } from 'sonner@2.0.3';

interface HabitEntry {
  date: string;
  intensity: number; // 0-4 (none, light, medium, strong, excellent)
}

interface Habit {
  id: string;
  name: string;
  color: string;
  entries: HabitEntry[];
  createdAt: string;
}

export function ComprehensiveHabitHeatmap() {
  const [habits, setHabits] = useState<Habit[]>(() => {
    const saved = localStorage.getItem('twinsync_habits');
    return saved ? JSON.parse(saved) : [];
  });

  const [newHabitName, setNewHabitName] = useState('');
  const [selectedColor, setSelectedColor] = useState('#6366f1');
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('twinsync_habits', JSON.stringify(habits));
  }, [habits]);

  const colors = [
    { value: '#6366f1', name: 'Indigo' },
    { value: '#8b5cf6', name: 'Violet' },
    { value: '#ec4899', name: 'Pink' },
    { value: '#f59e0b', name: 'Amber' },
    { value: '#10b981', name: 'Emerald' },
    { value: '#3b82f6', name: 'Blue' },
    { value: '#ef4444', name: 'Red' },
    { value: '#14b8a6', name: 'Teal' }
  ];

  const handleAddHabit = () => {
    if (!newHabitName.trim()) {
      toast.error('Please enter a habit name');
      return;
    }

    const newHabit: Habit = {
      id: Date.now().toString(),
      name: newHabitName,
      color: selectedColor,
      entries: [],
      createdAt: new Date().toISOString()
    };

    setHabits(prev => [...prev, newHabit]);
    setNewHabitName('');
    setSelectedColor('#6366f1');
    setDialogOpen(false);
    toast.success('✨ Habit added!');
  };

  const handleDeleteHabit = (id: string) => {
    setHabits(prev => prev.filter(h => h.id !== id));
    toast.success('Habit deleted');
  };

  const handleCellClick = (habitId: string, date: string) => {
    setHabits(prev => prev.map(habit => {
      if (habit.id !== habitId) return habit;

      const existingEntry = habit.entries.find(e => e.date === date);
      let newEntries;

      if (existingEntry) {
        // Cycle through intensity levels
        const newIntensity = (existingEntry.intensity + 1) % 5;
        if (newIntensity === 0) {
          // Remove entry if cycling back to 0
          newEntries = habit.entries.filter(e => e.date !== date);
        } else {
          newEntries = habit.entries.map(e =>
            e.date === date ? { ...e, intensity: newIntensity } : e
          );
        }
      } else {
        // Add new entry with intensity 1
        newEntries = [...habit.entries, { date, intensity: 1 }];
      }

      return { ...habit, entries: newEntries };
    }));
  };

  const getDaysArray = () => {
    const days = [];
    const today = new Date();
    
    // Show last 84 days (12 weeks)
    for (let i = 83; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      days.push({
        date: date.toISOString().split('T')[0],
        day: date.getDate(),
        month: date.getMonth(),
        weekday: date.getDay()
      });
    }
    return days;
  };

  const daysArray = getDaysArray();

  const getIntensityColor = (color: string, intensity: number) => {
    if (intensity === 0) return 'bg-slate-200 dark:bg-slate-700';
    
    const alphas = ['20', '40', '60', '80', '100'];
    const alpha = alphas[intensity - 1];
    const rgb = hexToRgb(color);
    
    return `bg-[rgba(${rgb.r},${rgb.g},${rgb.b},0.${alpha})]`;
  };

  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : { r: 99, g: 102, b: 241 };
  };

  const getHabitStats = (habit: Habit) => {
    const totalDays = daysArray.length;
    const completedDays = habit.entries.length;
    const completionRate = (completedDays / totalDays) * 100;

    // Calculate current streak
    let currentStreak = 0;
    const sortedDates = daysArray.map(d => d.date).reverse();
    
    for (const date of sortedDates) {
      if (habit.entries.some(e => e.date === date)) {
        currentStreak++;
      } else {
        break;
      }
    }

    // Calculate best streak
    let bestStreak = 0;
    let tempStreak = 0;
    
    for (const day of daysArray) {
      if (habit.entries.some(e => e.date === day.date)) {
        tempStreak++;
        bestStreak = Math.max(bestStreak, tempStreak);
      } else {
        tempStreak = 0;
      }
    }

    return { completedDays, completionRate, currentStreak, bestStreak };
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-between items-center"
      >
        <div>
          <h1 className="text-3xl text-slate-800 dark:text-white mb-1">Habit Heatmap</h1>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Track multiple habits with color-coded intensity levels
          </p>
        </div>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="rounded-2xl bg-gradient-to-r from-violet-500 to-purple-500 text-white hover:from-violet-600 hover:to-purple-600">
              <Plus className="w-4 h-4 mr-2" />
              Add Habit
            </Button>
          </DialogTrigger>
          <DialogContent className="rounded-3xl backdrop-blur-2xl bg-gradient-to-br from-white/90 via-white/80 to-white/70 dark:from-slate-800/90 dark:via-slate-800/80 dark:to-slate-800/70 border border-white/20 dark:border-slate-700/50">
            <DialogHeader>
              <DialogTitle>Add New Habit</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm text-slate-700 dark:text-slate-200 mb-2 block">
                  Habit Name
                </label>
                <Input
                  value={newHabitName}
                  onChange={(e) => setNewHabitName(e.target.value)}
                  placeholder="e.g., Morning Exercise"
                  className="rounded-2xl backdrop-blur-xl bg-white/50 dark:bg-slate-800/50 border border-white/30 dark:border-slate-700/30"
                />
              </div>

              <div>
                <label className="text-sm text-slate-700 dark:text-slate-200 mb-2 block">
                  Color
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {colors.map(color => (
                    <button
                      key={color.value}
                      onClick={() => setSelectedColor(color.value)}
                      className={`h-12 rounded-xl transition-all ${
                        selectedColor === color.value
                          ? 'ring-4 ring-offset-2 ring-white/50 dark:ring-slate-600/50 scale-105'
                          : ''
                      }`}
                      style={{ backgroundColor: color.value }}
                    />
                  ))}
                </div>
              </div>

              <Button
                onClick={handleAddHabit}
                className="w-full rounded-2xl bg-gradient-to-r from-violet-500 to-purple-500 text-white hover:from-violet-600 hover:to-purple-600"
              >
                Create Habit
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </motion.div>

      {habits.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-3xl backdrop-blur-2xl bg-gradient-to-br from-white/70 via-white/50 to-white/30 dark:from-slate-800/70 dark:via-slate-800/50 dark:to-slate-800/30 border border-white/20 dark:border-slate-700/50 p-12 shadow-2xl text-center"
        >
          <div className="text-6xl mb-4">📅</div>
          <h3 className="text-xl text-slate-800 dark:text-white mb-2">No Habits Yet</h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">
            Start tracking your habits to build consistency and reach your goals
          </p>
          <Button
            onClick={() => setDialogOpen(true)}
            className="rounded-2xl bg-gradient-to-r from-violet-500 to-purple-500 text-white hover:from-violet-600 hover:to-purple-600"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Your First Habit
          </Button>
        </motion.div>
      ) : (
        <>
          {/* Legend */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl backdrop-blur-xl bg-white/50 dark:bg-slate-800/50 border border-white/30 dark:border-slate-700/30 p-4"
          >
            <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
              <span>Click cells to cycle through intensity levels</span>
              <div className="flex items-center gap-2">
                <span>None</span>
                <div className="flex gap-1">
                  {[1, 2, 3, 4].map(level => (
                    <div
                      key={level}
                      className={`w-4 h-4 rounded ${getIntensityColor('#6366f1', level)}`}
                    />
                  ))}
                </div>
                <span>Excellent</span>
              </div>
            </div>
          </motion.div>

          {/* Habits */}
          {habits.map((habit, index) => {
            const stats = getHabitStats(habit);
            
            return (
              <motion.div
                key={habit.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="rounded-3xl backdrop-blur-2xl bg-gradient-to-br from-white/70 via-white/50 to-white/30 dark:from-slate-800/70 dark:via-slate-800/50 dark:to-slate-800/30 border border-white/20 dark:border-slate-700/50 p-8 shadow-2xl"
              >
                {/* Habit Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: habit.color }}
                    />
                    <h3 className="text-xl text-slate-800 dark:text-white">{habit.name}</h3>
                  </div>
                  <Button
                    onClick={() => handleDeleteHabit(habit.id)}
                    variant="ghost"
                    size="icon"
                    className="rounded-xl text-red-500 hover:bg-red-500/10"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="p-3 rounded-2xl bg-white/50 dark:bg-slate-700/50 border border-white/30 dark:border-slate-600/30">
                    <div className="text-xs text-slate-600 dark:text-slate-400 mb-1">Completion Rate</div>
                    <div className="text-xl text-slate-800 dark:text-white">
                      {stats.completionRate.toFixed(0)}%
                    </div>
                  </div>

                  <div className="p-3 rounded-2xl bg-white/50 dark:bg-slate-700/50 border border-white/30 dark:border-slate-600/30">
                    <div className="text-xs text-slate-600 dark:text-slate-400 mb-1">Days Completed</div>
                    <div className="text-xl text-slate-800 dark:text-white">
                      {stats.completedDays}
                    </div>
                  </div>

                  <div className="p-3 rounded-2xl bg-white/50 dark:bg-slate-700/50 border border-white/30 dark:border-slate-600/30">
                    <div className="text-xs text-slate-600 dark:text-slate-400 mb-1 flex items-center gap-1">
                      <Flame className="w-3 h-3" />
                      Current Streak
                    </div>
                    <div className="text-xl text-slate-800 dark:text-white">
                      {stats.currentStreak} days
                    </div>
                  </div>

                  <div className="p-3 rounded-2xl bg-white/50 dark:bg-slate-700/50 border border-white/30 dark:border-slate-600/30">
                    <div className="text-xs text-slate-600 dark:text-slate-400 mb-1">Best Streak</div>
                    <div className="text-xl text-slate-800 dark:text-white">
                      {stats.bestStreak} days
                    </div>
                  </div>
                </div>

                {/* Heatmap */}
                <div className="overflow-x-auto">
                  <div className="min-w-max">
                    {/* Month labels */}
                    <div className="flex mb-2">
                      {Array.from({ length: 12 }).map((_, weekIndex) => {
                        const dayIndex = weekIndex * 7;
                        if (dayIndex >= daysArray.length) return null;
                        
                        const day = daysArray[dayIndex];
                        const isFirstOfMonth = day.day === 1 || dayIndex === 0;
                        
                        return isFirstOfMonth ? (
                          <div key={weekIndex} className="text-xs text-slate-600 dark:text-slate-400 w-12">
                            {new Date(day.date).toLocaleDateString('default', { month: 'short' })}
                          </div>
                        ) : <div key={weekIndex} className="w-12" />;
                      })}
                    </div>

                    {/* Grid */}
                    <div className="flex gap-1">
                      {Array.from({ length: 12 }).map((_, weekIndex) => {
                        const weekDays = daysArray.slice(weekIndex * 7, (weekIndex + 1) * 7);
                        
                        return (
                          <div key={weekIndex} className="flex flex-col gap-1">
                            {weekDays.map(day => {
                              const entry = habit.entries.find(e => e.date === day.date);
                              const intensity = entry?.intensity || 0;
                              
                              return (
                                <button
                                  key={day.date}
                                  onClick={() => handleCellClick(habit.id, day.date)}
                                  className={`w-3 h-3 rounded-sm ${getIntensityColor(habit.color, intensity)} hover:ring-2 hover:ring-white/50 dark:hover:ring-slate-600/50 transition-all`}
                                  title={`${day.date}${entry ? ` - Level ${intensity}` : ''}`}
                                />
                              );
                            })}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </>
      )}
    </div>
  );
}
