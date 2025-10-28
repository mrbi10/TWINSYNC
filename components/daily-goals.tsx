import { motion } from 'motion/react';
import { Target, Save, Check } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { toast } from 'sonner@2.0.3';

interface DailyGoalsState {
  water: number;
  sleep: number;
  focus: number;
  steps: number;
}

export function DailyGoals() {
  const [goals, setGoals] = useState<DailyGoalsState>(() => {
    const saved = localStorage.getItem('twinsync_daily_goals');
    return saved ? JSON.parse(saved) : {
      water: 0,
      sleep: 0,
      focus: 0,
      steps: 0
    };
  });
  
  const [hasChanges, setHasChanges] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const updateGoal = (key: keyof DailyGoalsState, value: string) => {
    const numValue = parseFloat(value) || 0;
    setGoals(prev => ({ ...prev, [key]: numValue }));
    setHasChanges(true);
    setIsSaved(false);
  };
  
  const handleSave = () => {
    localStorage.setItem('twinsync_daily_goals', JSON.stringify(goals));
    setHasChanges(false);
    setIsSaved(true);
    toast.success('Goals saved successfully!');
    
    // Reset saved state after 2 seconds
    setTimeout(() => {
      setIsSaved(false);
    }, 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.65 }}
      className="p-4 rounded-2xl backdrop-blur-xl bg-gradient-to-br from-white/60 to-white/40 dark:from-slate-800/60 dark:to-slate-800/40 border border-slate-200/50 dark:border-slate-700/50"
    >
      <div className="flex items-center gap-2 mb-4">
        <Target className="w-4 h-4 text-violet-600 dark:text-violet-400" />
        <div className="text-xs text-slate-700 dark:text-slate-200">Daily Goals</div>
      </div>

      <div className="space-y-3">
        {/* Water Goal */}
        <div className="space-y-1">
          <label className="text-xs text-slate-600 dark:text-slate-300">💧 Water (L)</label>
          <Input
            type="number"
            value={goals.water || ''}
            onChange={(e) => updateGoal('water', e.target.value)}
            placeholder="Enter liters (e.g., 2.5)"
            min={0}
            max={5}
            step={0.5}
            className="h-8 text-xs rounded-xl backdrop-blur-xl bg-white/50 dark:bg-slate-700/50 border border-white/30 dark:border-slate-600/30 placeholder:text-slate-400/50 dark:placeholder:text-slate-500/50"
          />
        </div>

        {/* Focus Goal */}
        <div className="space-y-1">
          <label className="text-xs text-slate-600 dark:text-slate-300">🎯 Focus (h)</label>
          <Input
            type="number"
            value={goals.focus || ''}
            onChange={(e) => updateGoal('focus', e.target.value)}
            placeholder="Enter hours (e.g., 6)"
            min={0}
            max={12}
            step={0.5}
            className="h-8 text-xs rounded-xl backdrop-blur-xl bg-white/50 dark:bg-slate-700/50 border border-white/30 dark:border-slate-600/30 placeholder:text-slate-400/50 dark:placeholder:text-slate-500/50"
          />
        </div>

        {/* Sleep Goal */}
        <div className="space-y-1">
          <label className="text-xs text-slate-600 dark:text-slate-300">🌙 Sleep (h)</label>
          <Input
            type="number"
            value={goals.sleep || ''}
            onChange={(e) => updateGoal('sleep', e.target.value)}
            placeholder="Enter hours (e.g., 8)"
            min={0}
            max={10}
            step={0.5}
            className="h-8 text-xs rounded-xl backdrop-blur-xl bg-white/50 dark:bg-slate-700/50 border border-white/30 dark:border-slate-600/30 placeholder:text-slate-400/50 dark:placeholder:text-slate-500/50"
          />
        </div>

        {/* Steps Goal */}
        <div className="space-y-1">
          <label className="text-xs text-slate-600 dark:text-slate-300">👟 Steps</label>
          <Input
            type="number"
            value={goals.steps || ''}
            onChange={(e) => updateGoal('steps', e.target.value)}
            placeholder="Enter steps (e.g., 10000)"
            min={0}
            max={20000}
            step={1000}
            className="h-8 text-xs rounded-xl backdrop-blur-xl bg-white/50 dark:bg-slate-700/50 border border-white/30 dark:border-slate-600/30 placeholder:text-slate-400/50 dark:placeholder:text-slate-500/50"
          />
        </div>
        
        {/* Save Button */}
        <Button
          onClick={handleSave}
          disabled={!hasChanges}
          variant={isSaved ? "secondary" : hasChanges ? "default" : "ghost"}
          className={`w-full h-8 text-xs rounded-xl transition-all duration-300 ${
            isSaved 
              ? 'bg-gradient-to-r from-emerald-500 to-green-500 text-white hover:from-emerald-600 hover:to-green-600' 
              : hasChanges
              ? 'bg-gradient-to-r from-violet-500 to-purple-500 text-white hover:from-violet-600 hover:to-purple-600'
              : 'bg-slate-300 dark:bg-slate-600 text-slate-500 dark:text-slate-400 cursor-not-allowed'
          }`}
        >
          {isSaved ? (
            <>
              <Check className="w-3 h-3" />
              Saved!
            </>
          ) : (
            <>
              <Save className="w-3 h-3" />
              Save Goals
            </>
          )}
        </Button>
      </div>
    </motion.div>
  );
}
