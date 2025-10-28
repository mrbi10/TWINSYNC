import { motion } from 'motion/react';
import { Sparkles, TrendingUp, RotateCcw, Smile, Droplet, Utensils, Briefcase, GraduationCap, Smartphone, Film, Moon, Activity } from 'lucide-react';
import { useState } from 'react';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Switch } from './ui/switch';
import { Textarea } from './ui/textarea';

interface SimulatedData {
  mood: 'great' | 'good' | 'okay' | 'bad' | 'terrible';
  moodNotes: string;
  waterIntake: number;
  hadBreakfast: boolean;
  hadLunch: boolean;
  hadDinner: boolean;
  foodLog: string;
  workHours: number;
  learningHours: number;
  socialMediaHours: number;
  entertainmentHours: number;
  sleepHours: number;
  steps: number;
}

interface WhatIfSimulatorProps {
  currentData?: Partial<SimulatedData>;
  onSimulate?: (data: SimulatedData) => void;
}

export function WhatIfSimulator({ currentData, onSimulate }: WhatIfSimulatorProps) {
  const [simulatedData, setSimulatedData] = useState<SimulatedData>({
    mood: currentData?.mood || 'good',
    moodNotes: currentData?.moodNotes || '',
    waterIntake: currentData?.waterIntake || 0,
    hadBreakfast: currentData?.hadBreakfast ?? false,
    hadLunch: currentData?.hadLunch ?? false,
    hadDinner: currentData?.hadDinner ?? false,
    foodLog: currentData?.foodLog || '',
    workHours: currentData?.workHours || 0,
    learningHours: currentData?.learningHours || 0,
    socialMediaHours: currentData?.socialMediaHours || 0,
    entertainmentHours: currentData?.entertainmentHours || 0,
    sleepHours: currentData?.sleepHours || 0,
    steps: currentData?.steps || 0,
  });

  const moods = [
    { value: 'great' as const, emoji: '😄', label: 'Great', color: 'from-emerald-500 to-green-500' },
    { value: 'good' as const, emoji: '😊', label: 'Good', color: 'from-blue-500 to-cyan-500' },
    { value: 'okay' as const, emoji: '😐', label: 'Okay', color: 'from-yellow-500 to-amber-500' },
    { value: 'bad' as const, emoji: '😟', label: 'Bad', color: 'from-orange-500 to-red-500' },
    { value: 'terrible' as const, emoji: '😢', label: 'Terrible', color: 'from-red-600 to-rose-600' },
  ];

  // Calculate projected health score based on simulated data
  const calculateProjectedScore = (data: SimulatedData) => {
    let score = 0;

    // Mood (15 points)
    const moodScores = { great: 15, good: 12, okay: 8, bad: 5, terrible: 2 };
    score += moodScores[data.mood];

    // Water intake (20 points) - goal 2.5L
    score += Math.min(20, (data.waterIntake / 2.5) * 20);

    // Meals (10 points)
    const mealsCount = [data.hadBreakfast, data.hadLunch, data.hadDinner].filter(Boolean).length;
    score += (mealsCount / 3) * 10;

    // Work-life balance (20 points)
    const totalHours = data.workHours + data.learningHours + data.socialMediaHours + data.entertainmentHours + data.sleepHours;
    const balanceScore = data.workHours <= 10 && data.sleepHours >= 6 && data.sleepHours <= 9 ? 20 : 10;
    score += balanceScore;

    // Sleep (15 points) - optimal 7-9 hours
    if (data.sleepHours >= 7 && data.sleepHours <= 9) {
      score += 15;
    } else if (data.sleepHours >= 6 && data.sleepHours <= 10) {
      score += 10;
    } else {
      score += 5;
    }

    // Steps (10 points) - goal 10,000
    score += Math.min(10, (data.steps / 10000) * 10);

    // Screen time penalty (10 points)
    const screenTime = data.socialMediaHours + data.entertainmentHours;
    if (screenTime <= 3) {
      score += 10;
    } else if (screenTime <= 5) {
      score += 5;
    }

    return Math.min(100, Math.round(score));
  };

  const projectedScore = calculateProjectedScore(simulatedData);

  const updateField = <K extends keyof SimulatedData>(field: K, value: SimulatedData[K]) => {
    const newData = { ...simulatedData, [field]: value };
    setSimulatedData(newData);
    onSimulate?.(newData);
  };

  const resetSimulation = () => {
    const resetData: SimulatedData = {
      mood: currentData?.mood || 'good',
      moodNotes: currentData?.moodNotes || '',
      waterIntake: currentData?.waterIntake || 2.0,
      hadBreakfast: currentData?.hadBreakfast ?? true,
      hadLunch: currentData?.hadLunch ?? true,
      hadDinner: currentData?.hadDinner ?? true,
      foodLog: currentData?.foodLog || '',
      workHours: currentData?.workHours || 6,
      learningHours: currentData?.learningHours || 2,
      socialMediaHours: currentData?.socialMediaHours || 1.5,
      entertainmentHours: currentData?.entertainmentHours || 2,
      sleepHours: currentData?.sleepHours || 7,
      steps: currentData?.steps || 8000,
    };
    setSimulatedData(resetData);
  };

  const getTwinPreview = () => {
    if (projectedScore >= 85) return { emoji: '😊', message: 'Your twin looks energized!', color: 'from-emerald-400 to-green-400' };
    if (projectedScore >= 70) return { emoji: '🙂', message: 'Your twin looks good!', color: 'from-blue-400 to-cyan-400' };
    if (projectedScore >= 50) return { emoji: '😐', message: 'Your twin looks okay', color: 'from-amber-400 to-yellow-400' };
    return { emoji: '😔', message: 'Your twin needs care', color: 'from-slate-400 to-slate-500' };
  };

  const twinPreview = getTwinPreview();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-violet-500" />
          <h3 className="text-lg text-slate-800 dark:text-white">What-If Simulator</h3>
        </div>
        <button
          onClick={resetSimulation}
          className="flex items-center gap-2 px-4 py-2 rounded-xl backdrop-blur-xl bg-white/50 dark:bg-slate-800/50 border border-white/30 dark:border-slate-700/30 text-sm text-violet-600 dark:text-violet-400 hover:bg-white/70 dark:hover:bg-slate-800/70 transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
          Reset
        </button>
      </div>

      <p className="text-sm text-slate-600 dark:text-slate-300">
        Adjust the inputs below to see how different habits would affect your health score and digital twin state.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Input Sections */}
        <div className="lg:col-span-2 space-y-6">
          {/* Mood Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-3xl backdrop-blur-2xl bg-gradient-to-br from-white/70 via-white/50 to-white/30 dark:from-slate-800/70 dark:via-slate-800/50 dark:to-slate-800/30 border border-white/20 dark:border-slate-700/50 p-6 shadow-xl"
          >
            <div className="flex items-center gap-2 mb-4">
              <Smile className="w-4 h-4 text-violet-500" />
              <h4 className="text-sm text-slate-700 dark:text-slate-200">Mood</h4>
            </div>

            <div className="flex gap-2 mb-4 flex-wrap">
              {moods.map((mood) => (
                <button
                  key={mood.value}
                  onClick={() => updateField('mood', mood.value)}
                  className={`flex-1 min-w-[70px] p-3 rounded-xl border-2 transition-all duration-300 ${
                    simulatedData.mood === mood.value
                      ? `bg-gradient-to-br ${mood.color} border-white text-white scale-105`
                      : 'backdrop-blur-xl bg-white/50 dark:bg-slate-800/50 border-white/30 dark:border-slate-700/30 hover:scale-105'
                  }`}
                >
                  <div className="text-2xl mb-1">{mood.emoji}</div>
                  <div className={`text-xs ${simulatedData.mood === mood.value ? 'text-white' : 'text-slate-700 dark:text-slate-200'}`}>
                    {mood.label}
                  </div>
                </button>
              ))}
            </div>

            <Textarea
              value={simulatedData.moodNotes}
              onChange={(e) => updateField('moodNotes', e.target.value)}
              placeholder="Notes about the day..."
              className="min-h-[60px] rounded-xl backdrop-blur-xl bg-white/50 dark:bg-slate-800/50 border border-white/30 dark:border-slate-700/30 text-sm"
            />
          </motion.div>

          {/* Hydration & Nutrition */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="rounded-3xl backdrop-blur-2xl bg-gradient-to-br from-white/70 via-white/50 to-white/30 dark:from-slate-800/70 dark:via-slate-800/50 dark:to-slate-800/30 border border-white/20 dark:border-slate-700/50 p-6 shadow-xl"
          >
            <div className="flex items-center gap-2 mb-4">
              <Utensils className="w-4 h-4 text-violet-500" />
              <h4 className="text-sm text-slate-700 dark:text-slate-200">Nutrition & Hydration</h4>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="sim-water" className="text-xs text-slate-700 dark:text-slate-200 flex items-center gap-2">
                  <Droplet className="w-3 h-3 text-blue-500" />
                  Water Intake (Litres)
                </Label>
                <Input
                  id="sim-water"
                  type="number"
                  step="0.1"
                  min="0"
                  max="10"
                  value={simulatedData.waterIntake || ''}
                  onChange={(e) => updateField('waterIntake', parseFloat(e.target.value) || 0)}
                  placeholder="Enter number"
                  className="rounded-xl backdrop-blur-xl bg-white/50 dark:bg-slate-800/50 border border-white/30 dark:border-slate-700/30 text-sm placeholder:text-slate-400/50 dark:placeholder:text-slate-500/50"
                />
              </div>

              <div className="space-y-3">
                <Label className="text-xs text-slate-700 dark:text-slate-200">Meals</Label>
                <div className="flex gap-3 flex-wrap">
                  <div className="flex items-center gap-2 p-3 rounded-xl backdrop-blur-xl bg-white/50 dark:bg-slate-800/50 border border-white/30 dark:border-slate-700/30 flex-1 min-w-[120px]">
                    <Switch
                      checked={simulatedData.hadBreakfast}
                      onCheckedChange={(checked) => updateField('hadBreakfast', checked)}
                    />
                    <span className="text-xs text-slate-700 dark:text-slate-200">🍳 Breakfast</span>
                  </div>
                  <div className="flex items-center gap-2 p-3 rounded-xl backdrop-blur-xl bg-white/50 dark:bg-slate-800/50 border border-white/30 dark:border-slate-700/30 flex-1 min-w-[120px]">
                    <Switch
                      checked={simulatedData.hadLunch}
                      onCheckedChange={(checked) => updateField('hadLunch', checked)}
                    />
                    <span className="text-xs text-slate-700 dark:text-slate-200">🥗 Lunch</span>
                  </div>
                  <div className="flex items-center gap-2 p-3 rounded-xl backdrop-blur-xl bg-white/50 dark:bg-slate-800/50 border border-white/30 dark:border-slate-700/30 flex-1 min-w-[120px]">
                    <Switch
                      checked={simulatedData.hadDinner}
                      onCheckedChange={(checked) => updateField('hadDinner', checked)}
                    />
                    <span className="text-xs text-slate-700 dark:text-slate-200">🍽️ Dinner</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="sim-food" className="text-xs text-slate-700 dark:text-slate-200">
                  Food Log (optional)
                </Label>
                <Textarea
                  id="sim-food"
                  value={simulatedData.foodLog}
                  onChange={(e) => updateField('foodLog', e.target.value)}
                  placeholder="What you ate..."
                  className="min-h-[50px] rounded-xl backdrop-blur-xl bg-white/50 dark:bg-slate-800/50 border border-white/30 dark:border-slate-700/30 text-sm"
                />
              </div>
            </div>
          </motion.div>

          {/* Time Tracking */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="rounded-3xl backdrop-blur-2xl bg-gradient-to-br from-white/70 via-white/50 to-white/30 dark:from-slate-800/70 dark:via-slate-800/50 dark:to-slate-800/30 border border-white/20 dark:border-slate-700/50 p-6 shadow-xl"
          >
            <div className="flex items-center gap-2 mb-4">
              <Briefcase className="w-4 h-4 text-violet-500" />
              <h4 className="text-sm text-slate-700 dark:text-slate-200">Time Spent</h4>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="sim-work" className="text-xs text-slate-700 dark:text-slate-200 flex items-center gap-2">
                  <Briefcase className="w-3 h-3 text-violet-500" />
                  Work Hours
                </Label>
                <Input
                  id="sim-work"
                  type="number"
                  step="0.5"
                  min="0"
                  max="24"
                  value={simulatedData.workHours || ''}
                  onChange={(e) => updateField('workHours', parseFloat(e.target.value) || 0)}
                  placeholder="Enter number"
                  className="rounded-xl backdrop-blur-xl bg-white/50 dark:bg-slate-800/50 border border-white/30 dark:border-slate-700/30 text-sm placeholder:text-slate-400/50 dark:placeholder:text-slate-500/50"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="sim-learning" className="text-xs text-slate-700 dark:text-slate-200 flex items-center gap-2">
                  <GraduationCap className="w-3 h-3 text-blue-500" />
                  Learning Hours
                </Label>
                <Input
                  id="sim-learning"
                  type="number"
                  step="0.5"
                  min="0"
                  max="24"
                  value={simulatedData.learningHours || ''}
                  onChange={(e) => updateField('learningHours', parseFloat(e.target.value) || 0)}
                  placeholder="Enter number"
                  className="rounded-xl backdrop-blur-xl bg-white/50 dark:bg-slate-800/50 border border-white/30 dark:border-slate-700/30 text-sm placeholder:text-slate-400/50 dark:placeholder:text-slate-500/50"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="sim-social" className="text-xs text-slate-700 dark:text-slate-200 flex items-center gap-2">
                  <Smartphone className="w-3 h-3 text-pink-500" />
                  Social Media
                </Label>
                <Input
                  id="sim-social"
                  type="number"
                  step="0.5"
                  min="0"
                  max="24"
                  value={simulatedData.socialMediaHours || ''}
                  onChange={(e) => updateField('socialMediaHours', parseFloat(e.target.value) || 0)}
                  placeholder="Enter number"
                  className="rounded-xl backdrop-blur-xl bg-white/50 dark:bg-slate-800/50 border border-white/30 dark:border-slate-700/30 text-sm placeholder:text-slate-400/50 dark:placeholder:text-slate-500/50"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="sim-entertainment" className="text-xs text-slate-700 dark:text-slate-200 flex items-center gap-2">
                  <Film className="w-3 h-3 text-amber-500" />
                  Entertainment
                </Label>
                <Input
                  id="sim-entertainment"
                  type="number"
                  step="0.5"
                  min="0"
                  max="24"
                  value={simulatedData.entertainmentHours || ''}
                  onChange={(e) => updateField('entertainmentHours', parseFloat(e.target.value) || 0)}
                  placeholder="Enter number"
                  className="rounded-xl backdrop-blur-xl bg-white/50 dark:bg-slate-800/50 border border-white/30 dark:border-slate-700/30 text-sm placeholder:text-slate-400/50 dark:placeholder:text-slate-500/50"
                />
              </div>
            </div>
          </motion.div>

          {/* Sleep & Activity */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="rounded-3xl backdrop-blur-2xl bg-gradient-to-br from-white/70 via-white/50 to-white/30 dark:from-slate-800/70 dark:via-slate-800/50 dark:to-slate-800/30 border border-white/20 dark:border-slate-700/50 p-6 shadow-xl"
          >
            <div className="flex items-center gap-2 mb-4">
              <Moon className="w-4 h-4 text-violet-500" />
              <h4 className="text-sm text-slate-700 dark:text-slate-200">Rest & Activity</h4>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="sim-sleep" className="text-xs text-slate-700 dark:text-slate-200 flex items-center gap-2">
                  <Moon className="w-3 h-3 text-indigo-500" />
                  Sleep Hours
                </Label>
                <Input
                  id="sim-sleep"
                  type="number"
                  step="0.5"
                  min="0"
                  max="24"
                  value={simulatedData.sleepHours || ''}
                  onChange={(e) => updateField('sleepHours', parseFloat(e.target.value) || 0)}
                  placeholder="Enter number"
                  className="rounded-xl backdrop-blur-xl bg-white/50 dark:bg-slate-800/50 border border-white/30 dark:border-slate-700/30 text-sm placeholder:text-slate-400/50 dark:placeholder:text-slate-500/50"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="sim-steps" className="text-xs text-slate-700 dark:text-slate-200 flex items-center gap-2">
                  <Activity className="w-3 h-3 text-emerald-500" />
                  Steps Taken
                </Label>
                <Input
                  id="sim-steps"
                  type="number"
                  step="100"
                  min="0"
                  max="50000"
                  value={simulatedData.steps || ''}
                  onChange={(e) => updateField('steps', parseInt(e.target.value) || 0)}
                  placeholder="Enter number"
                  className="rounded-xl backdrop-blur-xl bg-white/50 dark:bg-slate-800/50 border border-white/30 dark:border-slate-700/30 text-sm placeholder:text-slate-400/50 dark:placeholder:text-slate-500/50"
                />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Preview Panel - Sticky */}
        <div className="lg:col-span-1">
          <div className="sticky top-6 space-y-6">
            {/* Twin Preview */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="rounded-3xl backdrop-blur-2xl bg-gradient-to-br from-white/70 via-white/50 to-white/30 dark:from-slate-800/70 dark:via-slate-800/50 dark:to-slate-800/30 border border-white/20 dark:border-slate-700/50 p-6 shadow-xl"
            >
              <h4 className="text-sm text-slate-600 dark:text-slate-300 mb-4 text-center">Projected State</h4>
              
              <div className="text-center mb-6">
                <motion.div
                  key={twinPreview.emoji}
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: 'spring' }}
                  className="text-7xl mb-3"
                >
                  {twinPreview.emoji}
                </motion.div>
                <motion.p
                  key={twinPreview.message}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`text-sm bg-gradient-to-r ${twinPreview.color} bg-clip-text text-transparent`}
                >
                  {twinPreview.message}
                </motion.p>
              </div>

              <div className="space-y-4">
                <div className="text-center">
                  <div className="text-xs text-slate-600 dark:text-slate-300 mb-2">Projected Health Score</div>
                  <motion.div
                    className="text-4xl bg-gradient-to-br from-violet-600 via-indigo-600 to-blue-600 bg-clip-text text-transparent"
                    key={projectedScore}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: 'spring' }}
                  >
                    {projectedScore}
                  </motion.div>
                </div>

                <motion.div
                  className="h-3 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden"
                  layout
                >
                  <motion.div
                    className={`h-full ${
                      projectedScore >= 85 ? 'bg-gradient-to-r from-emerald-500 to-green-500' :
                      projectedScore >= 70 ? 'bg-gradient-to-r from-blue-500 to-cyan-500' :
                      projectedScore >= 50 ? 'bg-gradient-to-r from-amber-500 to-yellow-500' :
                      'bg-gradient-to-r from-red-500 to-rose-500'
                    }`}
                    initial={{ width: 0 }}
                    animate={{ width: `${projectedScore}%` }}
                    transition={{ type: 'spring' }}
                  />
                </motion.div>

                {projectedScore >= 70 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3 rounded-xl bg-gradient-to-r from-emerald-500/20 to-green-500/20 border border-emerald-500/30"
                  >
                    <p className="text-xs text-emerald-700 dark:text-emerald-300 text-center">
                      Great habits! Keep this up! 🎉
                    </p>
                  </motion.div>
                )}

                {projectedScore < 50 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3 rounded-xl bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30"
                  >
                    <p className="text-xs text-amber-700 dark:text-amber-300 text-center">
                      Try adjusting your habits for a better score 💪
                    </p>
                  </motion.div>
                )}
              </div>
            </motion.div>

            {/* Quick Stats */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="rounded-2xl backdrop-blur-xl bg-white/50 dark:bg-slate-800/50 border border-white/30 dark:border-slate-700/30 p-4"
            >
              <h4 className="text-xs text-slate-600 dark:text-slate-300 mb-3">Quick Stats</h4>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-600 dark:text-slate-400">Total Hours</span>
                  <span className="text-slate-800 dark:text-white">
                    {(simulatedData.workHours + simulatedData.learningHours + simulatedData.socialMediaHours + simulatedData.entertainmentHours + simulatedData.sleepHours).toFixed(1)}h
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600 dark:text-slate-400">Screen Time</span>
                  <span className="text-slate-800 dark:text-white">
                    {(simulatedData.socialMediaHours + simulatedData.entertainmentHours).toFixed(1)}h
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600 dark:text-slate-400">Daily Steps</span>
                  <span className="text-slate-800 dark:text-white">
                    {simulatedData.steps.toLocaleString()}
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
