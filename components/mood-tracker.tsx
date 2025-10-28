import { motion, AnimatePresence } from 'motion/react';
import { Smile, Frown, Meh, Laugh, Annoyed, Calendar, BookOpen, TrendingUp, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { ScrollArea } from './ui/scroll-area';
import { toast } from 'sonner@2.0.3';

type MoodType = 'great' | 'good' | 'okay' | 'bad' | 'terrible';

interface MoodEntry {
  mood: MoodType;
  emoji: string;
  note: string;
  timestamp: string;
  date: string;
}

export function MoodTracker() {
  const [selectedMood, setSelectedMood] = useState<MoodType | null>(null);
  const [note, setNote] = useState('');
  const [moodHistory, setMoodHistory] = useState<Record<string, MoodEntry>>(() => {
    const saved = localStorage.getItem('twinsync_mood_history');
    return saved ? JSON.parse(saved) : {};
  });
  const [viewMode, setViewMode] = useState<'log' | 'history' | 'insights'>('log');
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  useEffect(() => {
    localStorage.setItem('twinsync_mood_history', JSON.stringify(moodHistory));
  }, [moodHistory]);

  // Load today's mood if exists
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    if (moodHistory[today]) {
      setSelectedMood(moodHistory[today].mood);
      setNote(moodHistory[today].note);
    }
  }, []);

  const moods = [
    { id: 'great' as MoodType, label: 'Great', icon: Laugh, color: 'from-emerald-500 to-green-500', emoji: '😄', score: 5 },
    { id: 'good' as MoodType, label: 'Good', icon: Smile, color: 'from-blue-500 to-cyan-500', emoji: '😊', score: 4 },
    { id: 'okay' as MoodType, label: 'Okay', icon: Meh, color: 'from-amber-500 to-yellow-500', emoji: '😐', score: 3 },
    { id: 'bad' as MoodType, label: 'Bad', icon: Frown, color: 'from-orange-500 to-red-500', emoji: '😕', score: 2 },
    { id: 'terrible' as MoodType, label: 'Terrible', icon: Annoyed, color: 'from-red-500 to-rose-500', emoji: '😢', score: 1 }
  ];

  const handleSaveMood = () => {
    if (!selectedMood) {
      toast.error('Please select a mood first');
      return;
    }

    const today = new Date().toISOString().split('T')[0];
    const moodData = moods.find(m => m.id === selectedMood)!;
    
    const entry: MoodEntry = {
      mood: selectedMood,
      emoji: moodData.emoji,
      note: note,
      timestamp: new Date().toISOString(),
      date: today
    };

    setMoodHistory(prev => ({
      ...prev,
      [today]: entry
    }));

    toast.success('Mood logged successfully! 📝');
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    // Add empty cells for days before month starts
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    // Add days of month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }
    return days;
  };

  const getMoodForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return moodHistory[dateStr];
  };

  const calculateInsights = () => {
    const entries = Object.values(moodHistory);
    if (entries.length === 0) return null;

    const moodCounts: Record<MoodType, number> = {
      great: 0,
      good: 0,
      okay: 0,
      bad: 0,
      terrible: 0
    };

    let totalScore = 0;
    entries.forEach(entry => {
      moodCounts[entry.mood]++;
      const moodData = moods.find(m => m.id === entry.mood);
      if (moodData) totalScore += moodData.score;
    });

    const avgScore = totalScore / entries.length;
    const mostCommonMood = Object.entries(moodCounts).reduce((a, b) => 
      b[1] > a[1] ? b : a
    )[0] as MoodType;

    // Get last 7 days trend
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      if (moodHistory[dateStr]) {
        const moodData = moods.find(m => m.id === moodHistory[dateStr].mood);
        last7Days.push(moodData?.score || 0);
      }
    }

    const recentTrend = last7Days.length >= 2 
      ? last7Days[last7Days.length - 1] - last7Days[0]
      : 0;

    return {
      totalEntries: entries.length,
      avgScore,
      mostCommonMood,
      moodCounts,
      recentTrend
    };
  };

  const insights = calculateInsights();

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl text-slate-800 dark:text-white mb-1">Mood Tracker</h1>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Track your emotional well-being
          </p>
        </div>

        <div className="flex gap-2">
          <Button
            onClick={() => setViewMode('log')}
            variant={viewMode === 'log' ? 'default' : 'ghost'}
            className="rounded-2xl"
          >
            <Smile className="w-4 h-4" />
            Log Mood
          </Button>
          <Button
            onClick={() => setViewMode('history')}
            variant={viewMode === 'history' ? 'default' : 'ghost'}
            className="rounded-2xl"
          >
            <Calendar className="w-4 h-4" />
            History
          </Button>
          <Button
            onClick={() => setViewMode('insights')}
            variant={viewMode === 'insights' ? 'default' : 'ghost'}
            className="rounded-2xl"
          >
            <TrendingUp className="w-4 h-4" />
            Insights
          </Button>
        </div>
      </motion.div>

      {/* Log Mood View */}
      {viewMode === 'log' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-3xl backdrop-blur-2xl bg-gradient-to-br from-white/70 via-white/50 to-white/30 dark:from-slate-800/70 dark:via-slate-800/50 dark:to-slate-800/30 border border-white/20 dark:border-slate-700/50 p-8 shadow-2xl"
        >
          <h3 className="text-xl text-slate-800 dark:text-white mb-6">How are you feeling today?</h3>
          
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
            {moods.map((mood, index) => {
              const Icon = mood.icon;
              return (
                <motion.button
                  key={mood.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => setSelectedMood(mood.id)}
                  className={`group relative p-6 rounded-2xl backdrop-blur-xl bg-gradient-to-br ${mood.color} ${
                    selectedMood === mood.id
                      ? 'ring-4 ring-white/50 dark:ring-slate-600/50 scale-105'
                      : 'opacity-70 hover:opacity-100'
                  } transition-all duration-300`}
                >
                  <div className="flex flex-col items-center gap-3">
                    <div className="text-5xl">{mood.emoji}</div>
                    <span className="text-sm text-white">{mood.label}</span>
                  </div>
                </motion.button>
              );
            })}
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-sm text-slate-700 dark:text-slate-200 mb-2 flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                Journal Entry (Optional)
              </label>
              <Textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="What's on your mind? How was your day?"
                className="min-h-[150px] rounded-2xl backdrop-blur-xl bg-white/50 dark:bg-slate-800/50 border border-white/30 dark:border-slate-700/30"
              />
            </div>

            <Button
              onClick={handleSaveMood}
              disabled={!selectedMood}
              className="w-full rounded-2xl bg-gradient-to-r from-violet-500 to-purple-500 text-white hover:from-violet-600 hover:to-purple-600"
            >
              Save Mood Entry
            </Button>
          </div>
        </motion.div>
      )}

      {/* History View */}
      {viewMode === 'history' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          {/* Calendar */}
          <div className="rounded-3xl backdrop-blur-2xl bg-gradient-to-br from-white/70 via-white/50 to-white/30 dark:from-slate-800/70 dark:via-slate-800/50 dark:to-slate-800/30 border border-white/20 dark:border-slate-700/50 p-8 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl text-slate-800 dark:text-white">
                {currentMonth.toLocaleDateString('default', { month: 'long', year: 'numeric' })}
              </h3>
              <div className="flex gap-2">
                <Button
                  onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
                  variant="ghost"
                  size="icon"
                  className="rounded-xl"
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Button
                  onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
                  variant="ghost"
                  size="icon"
                  className="rounded-xl"
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-7 gap-2 mb-2">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="text-center text-xs text-slate-500 dark:text-slate-400 p-2">
                  {day}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-2">
              {getDaysInMonth(currentMonth).map((date, index) => {
                if (!date) {
                  return <div key={`empty-${index}`} className="aspect-square" />;
                }

                const moodEntry = getMoodForDate(date);
                const isToday = date.toDateString() === new Date().toDateString();
                const dateStr = date.toISOString().split('T')[0];

                return (
                  <motion.button
                    key={date.toISOString()}
                    whileHover={{ scale: 1.05 }}
                    onClick={() => setSelectedDate(dateStr)}
                    className={`aspect-square rounded-xl backdrop-blur-xl ${
                      moodEntry
                        ? 'bg-gradient-to-br from-white/80 to-white/60 dark:from-slate-700/80 dark:to-slate-700/60'
                        : 'bg-white/30 dark:bg-slate-800/30'
                    } border ${
                      isToday
                        ? 'border-violet-500 ring-2 ring-violet-500/30'
                        : 'border-white/30 dark:border-slate-700/30'
                    } flex flex-col items-center justify-center transition-all`}
                  >
                    <span className="text-xs text-slate-700 dark:text-slate-200">
                      {date.getDate()}
                    </span>
                    {moodEntry && (
                      <span className="text-xl">{moodEntry.emoji}</span>
                    )}
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* Selected Date Detail */}
          {selectedDate && moodHistory[selectedDate] && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-3xl backdrop-blur-2xl bg-gradient-to-br from-white/70 via-white/50 to-white/30 dark:from-slate-800/70 dark:via-slate-800/50 dark:to-slate-800/30 border border-white/20 dark:border-slate-700/50 p-8 shadow-2xl"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl text-slate-800 dark:text-white">
                  {new Date(selectedDate).toLocaleDateString('default', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </h3>
                <div className="text-4xl">{moodHistory[selectedDate].emoji}</div>
              </div>
              
              {moodHistory[selectedDate].note && (
                <div className="p-4 rounded-2xl bg-white/50 dark:bg-slate-700/50 border border-white/30 dark:border-slate-600/30">
                  <div className="text-xs text-slate-500 dark:text-slate-400 mb-2">Journal Entry</div>
                  <p className="text-sm text-slate-700 dark:text-slate-200 whitespace-pre-wrap">
                    {moodHistory[selectedDate].note}
                  </p>
                </div>
              )}
            </motion.div>
          )}
        </motion.div>
      )}

      {/* Insights View */}
      {viewMode === 'insights' && insights && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <div className="rounded-3xl backdrop-blur-2xl bg-gradient-to-br from-white/70 via-white/50 to-white/30 dark:from-slate-800/70 dark:via-slate-800/50 dark:to-slate-800/30 border border-white/20 dark:border-slate-700/50 p-8 shadow-2xl">
            <h3 className="text-xl text-slate-800 dark:text-white mb-6">Your Mood Insights</h3>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="p-4 rounded-2xl bg-gradient-to-br from-violet-500/20 to-purple-500/20 border border-violet-500/30">
                <div className="text-2xl text-slate-800 dark:text-white mb-1">
                  {insights.totalEntries}
                </div>
                <div className="text-xs text-slate-600 dark:text-slate-400">Total Entries</div>
              </div>
              
              <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-500/30">
                <div className="text-2xl text-slate-800 dark:text-white mb-1">
                  {insights.avgScore.toFixed(1)}/5
                </div>
                <div className="text-xs text-slate-600 dark:text-slate-400">Avg Mood Score</div>
              </div>
              
              <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-green-500/20 border border-emerald-500/30">
                <div className="text-2xl mb-1">
                  {moods.find(m => m.id === insights.mostCommonMood)?.emoji}
                </div>
                <div className="text-xs text-slate-600 dark:text-slate-400">Most Common</div>
              </div>
              
              <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/30">
                <div className="text-2xl text-slate-800 dark:text-white mb-1">
                  {insights.recentTrend > 0 ? '📈' : insights.recentTrend < 0 ? '📉' : '➡️'}
                </div>
                <div className="text-xs text-slate-600 dark:text-slate-400">Recent Trend</div>
              </div>
            </div>

            <div>
              <h4 className="text-sm text-slate-700 dark:text-slate-200 mb-4">Mood Distribution</h4>
              <div className="space-y-3">
                {moods.map(mood => (
                  <div key={mood.id} className="flex items-center gap-3">
                    <span className="text-2xl">{mood.emoji}</span>
                    <div className="flex-1">
                      <div className="flex justify-between text-xs text-slate-600 dark:text-slate-400 mb-1">
                        <span>{mood.label}</span>
                        <span>{insights.moodCounts[mood.id]} times</span>
                      </div>
                      <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ 
                            width: `${(insights.moodCounts[mood.id] / insights.totalEntries) * 100}%` 
                          }}
                          className={`h-full bg-gradient-to-r ${mood.color}`}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
