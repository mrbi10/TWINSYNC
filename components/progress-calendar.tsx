import { motion, AnimatePresence } from 'motion/react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState, useMemo } from 'react';
import { ProgressHistory } from '../App';
import { DailyProgressData } from './add-progress';

interface ProgressCalendarProps {
  progressHistory: ProgressHistory;
  onDateClick: (date: string, progress: DailyProgressData | null) => void;
}

export function ProgressCalendar({ progressHistory, onDateClick }: ProgressCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const calendarDays = useMemo(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(1 - firstDay.getDay()); // Start from Sunday
    
    const days = [];
    const currentDate = new Date(startDate);
    
    // Generate 6 weeks to ensure consistent calendar size
    for (let i = 0; i < 42; i++) {
      const dateStr = currentDate.toISOString().split('T')[0];
      const isCurrentMonth = currentDate.getMonth() === month;
      const isToday = dateStr === new Date().toISOString().split('T')[0];
      const hasProgress = !!progressHistory[dateStr];
      
      days.push({
        date: new Date(currentDate),
        dateStr,
        day: currentDate.getDate(),
        isCurrentMonth,
        isToday,
        hasProgress,
        progress: progressHistory[dateStr] || null
      });
      
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    return days;
  }, [currentMonth, progressHistory]);

  const monthName = currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' });

  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="rounded-3xl backdrop-blur-3xl bg-gradient-to-br from-white/80 via-white/60 to-white/40 dark:from-slate-800/80 dark:via-slate-800/60 dark:to-slate-800/40 border-2 border-white/30 dark:border-slate-700/60 p-5 shadow-[0_20px_60px_rgba(0,0,0,0.08)] dark:shadow-[0_20px_60px_rgba(0,0,0,0.3)] h-full"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <CalendarIcon className="w-4 h-4 text-violet-500" />
          <h3 className="text-slate-800 dark:text-white">Progress Calendar</h3>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            onClick={prevMonth}
            className="p-1 rounded-lg hover:bg-white/50 dark:hover:bg-slate-700/50 transition-colors"
          >
            <ChevronLeft className="w-3.5 h-3.5 text-slate-600 dark:text-slate-300" />
          </button>
          <span className="text-xs text-slate-700 dark:text-slate-200 min-w-[120px] text-center">
            {monthName}
          </span>
          <button
            onClick={nextMonth}
            className="p-1 rounded-lg hover:bg-white/50 dark:hover:bg-slate-700/50 transition-colors"
          >
            <ChevronRight className="w-3.5 h-3.5 text-slate-600 dark:text-slate-300" />
          </button>
        </div>
      </div>

      {/* Weekday Headers */}
      <div className="grid grid-cols-7 gap-1.5 mb-1.5">
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, idx) => (
          <div
            key={idx}
            className="text-center text-xs text-slate-500 dark:text-slate-400"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Days */}
      <div className="grid grid-cols-7 gap-1.5">
        {calendarDays.map((day, idx) => (
          <motion.button
            key={idx}
            onClick={() => day.hasProgress && onDateClick(day.dateStr, day.progress)}
            disabled={!day.hasProgress}
            whileHover={day.hasProgress ? { scale: 1.1 } : {}}
            whileTap={day.hasProgress ? { scale: 0.95 } : {}}
            className={`
              relative aspect-square rounded-lg flex items-center justify-center text-xs transition-all
              ${!day.isCurrentMonth ? 'opacity-30' : ''}
              ${day.isToday ? 'ring-2 ring-violet-500' : ''}
              ${day.hasProgress 
                ? 'bg-gradient-to-br from-emerald-400/30 to-green-400/30 dark:from-emerald-500/20 dark:to-green-500/20 hover:from-emerald-400/50 hover:to-green-400/50 cursor-pointer' 
                : 'bg-white/30 dark:bg-slate-700/30'
              }
              ${!day.hasProgress ? 'cursor-default' : ''}
            `}
          >
            <span className={`
              ${day.isToday ? 'text-violet-700 dark:text-violet-400' : ''}
              ${day.hasProgress ? 'text-slate-800 dark:text-white' : 'text-slate-500 dark:text-slate-400'}
            `}>
              {day.day}
            </span>
            {day.hasProgress && (
              <div className="absolute bottom-0.5 left-1/2 transform -translate-x-1/2 w-1 h-1 rounded-full bg-emerald-500" />
            )}
          </motion.button>
        ))}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-3 mt-3 pt-3 border-t border-slate-200/50 dark:border-slate-700/50">
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-gradient-to-br from-emerald-400/30 to-green-400/30 dark:from-emerald-500/20 dark:to-green-500/20" />
          <span className="text-xs text-slate-600 dark:text-slate-300">Logged</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full ring-2 ring-violet-500" />
          <span className="text-xs text-slate-600 dark:text-slate-300">Today</span>
        </div>
      </div>
    </motion.div>
  );
}
