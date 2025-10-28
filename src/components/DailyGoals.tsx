import { motion } from 'motion/react';
import { Card } from './ui/card';
import { Progress } from './ui/progress';
import { CheckCircle2, Circle } from 'lucide-react';

interface Goal {
  id: string;
  label: string;
  completed: boolean;
  progress: number;
  target: number;
  unit: string;
}

export function DailyGoals() {
  const goals: Goal[] = [
    {
      id: '1',
      label: 'Drink 2.5L water',
      completed: false,
      progress: 1.8,
      target: 2.5,
      unit: 'L',
    },
    {
      id: '2',
      label: 'Take 4 breaks',
      completed: false,
      progress: 3,
      target: 4,
      unit: 'breaks',
    },
    {
      id: '3',
      label: 'Log mood',
      completed: true,
      progress: 1,
      target: 1,
      unit: '',
    },
    {
      id: '4',
      label: '6 hours focus time',
      completed: false,
      progress: 4.5,
      target: 6,
      unit: 'hours',
    },
  ];

  const completedGoals = goals.filter(g => g.completed).length;
  const totalGoals = goals.length;
  const completionPercentage = (completedGoals / totalGoals) * 100;

  return (
    <Card className="p-6 bg-gradient-to-br from-white to-slate-50">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-slate-800">Daily Goals</h3>
            <p className="text-sm text-slate-600">
              {completedGoals} of {totalGoals} completed
            </p>
          </div>
          <div className="text-right">
            <div className="bg-gradient-to-r from-teal-500 to-purple-500 bg-clip-text text-transparent">
              {Math.round(completionPercentage)}%
            </div>
          </div>
        </div>

        {/* Overall Progress */}
        <Progress value={completionPercentage} className="h-2" />

        {/* Goals List */}
        <div className="space-y-3 pt-2">
          {goals.map((goal, index) => {
            const goalProgress = (goal.progress / goal.target) * 100;
            return (
              <motion.div
                key={goal.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`flex items-center gap-3 p-3 rounded-lg transition-all ${
                  goal.completed
                    ? 'bg-emerald-50 border border-emerald-200'
                    : 'bg-white border border-slate-200'
                }`}
              >
                <div className="shrink-0">
                  {goal.completed ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  ) : (
                    <Circle className="w-5 h-5 text-slate-400" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p
                    className={`text-sm ${
                      goal.completed
                        ? 'text-emerald-700 line-through'
                        : 'text-slate-700'
                    }`}
                  >
                    {goal.label}
                  </p>
                  {!goal.completed && (
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex-1">
                        <Progress value={goalProgress} className="h-1" />
                      </div>
                      <span className="text-xs text-slate-500 whitespace-nowrap">
                        {goal.progress}/{goal.target} {goal.unit}
                      </span>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Motivational Message */}
        {completionPercentage === 100 ? (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-gradient-to-r from-emerald-500 to-green-600 text-white p-4 rounded-xl text-center"
          >
            <span className="text-2xl mb-2 block">🎉</span>
            <p>Amazing! All goals completed!</p>
          </motion.div>
        ) : completionPercentage >= 50 ? (
          <div className="bg-gradient-to-r from-teal-50 to-purple-50 p-3 rounded-lg text-center">
            <p className="text-sm text-slate-700">
              Great progress! You're halfway there! 💪
            </p>
          </div>
        ) : null}
      </div>
    </Card>
  );
}
