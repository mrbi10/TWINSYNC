import { motion } from 'motion/react';
import { Flame, Coffee, Moon, Droplet } from 'lucide-react';

interface HabitHeatmapProps {
  data: Array<{
    date: string;
    focus: number;
    breaks: number;
    sleep: number;
    hydration: number;
  }>;
  streaks: {
    focus: number;
    breaks: number;
    sleep: number;
    hydration: number;
  };
}

export function HabitHeatmap({ data, streaks }: HabitHeatmapProps) {
  const habits = [
    { key: 'focus' as const, label: 'Focus', icon: Flame, color: 'violet' },
    { key: 'breaks' as const, label: 'Breaks', icon: Coffee, color: 'amber' },
    { key: 'sleep' as const, label: 'Sleep', icon: Moon, color: 'indigo' },
    { key: 'hydration' as const, label: 'Water', icon: Droplet, color: 'blue' }
  ];

  const getOpacity = (value: number) => {
    if (value >= 85) return 'opacity-100';
    if (value >= 70) return 'opacity-75';
    if (value >= 50) return 'opacity-50';
    return 'opacity-25';
  };

  const getColorClass = (color: string, opacity: string) => {
    const colorMap: Record<string, string> = {
      violet: `bg-violet-500 ${opacity}`,
      amber: `bg-amber-500 ${opacity}`,
      indigo: `bg-indigo-500 ${opacity}`,
      blue: `bg-blue-500 ${opacity}`
    };
    return colorMap[color];
  };

  return (
    <div className="space-y-4">
      {habits.map((habit, habitIndex) => (
        <motion.div
          key={habit.key}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: habitIndex * 0.1 }}
          className="space-y-2"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <habit.icon className={`w-4 h-4 text-${habit.color}-500`} />
              <span className="text-sm text-slate-700 dark:text-slate-200">{habit.label}</span>
            </div>
            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r ${
              habit.color === 'violet' ? 'from-violet-500/20 via-purple-500/20 to-violet-500/20 border-violet-500/30' :
              habit.color === 'amber' ? 'from-amber-500/20 via-orange-500/20 to-amber-500/20 border-amber-500/30' :
              habit.color === 'indigo' ? 'from-indigo-500/20 via-blue-500/20 to-indigo-500/20 border-indigo-500/30' :
              'from-blue-500/20 via-cyan-500/20 to-blue-500/20 border-blue-500/30'
            } border backdrop-blur-xl shadow-lg`}>
              <Flame className={`w-3.5 h-3.5 ${
                habit.color === 'violet' ? 'text-violet-500' :
                habit.color === 'amber' ? 'text-amber-500' :
                habit.color === 'indigo' ? 'text-indigo-500' :
                'text-blue-500'
              }`} />
              <span className={`text-xs bg-gradient-to-r ${
                habit.color === 'violet' ? 'from-violet-600 to-purple-600' :
                habit.color === 'amber' ? 'from-amber-600 to-orange-600' :
                habit.color === 'indigo' ? 'from-indigo-600 to-blue-600' :
                'from-blue-600 to-cyan-600'
              } bg-clip-text text-transparent`}>
                {streaks[habit.key]} day streak
              </span>
            </div>
          </div>
          
          <div className="flex gap-1.5">
            {data.map((day, dayIndex) => {
              const value = day[habit.key];
              const opacity = getOpacity(value);
              
              return (
                <motion.div
                  key={day.date}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: habitIndex * 0.1 + dayIndex * 0.05 }}
                  className="group relative flex-1"
                >
                  <div
                    className={`h-10 rounded-lg ${getColorClass(habit.color, opacity)} backdrop-blur-sm transition-all duration-300 group-hover:scale-110 group-hover:opacity-100`}
                  />
                  <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                    <div className="px-2 py-1 rounded-lg bg-slate-900 dark:bg-slate-700 text-white text-xs whitespace-nowrap">
                      {value}%
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      ))}
    </div>
  );
}
