import { motion } from 'motion/react';
import { useState, useEffect } from 'react';
import { ArrowLeft, Save, Smile, Droplet, Utensils, Briefcase, GraduationCap, Smartphone, Film, Moon, Activity } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Switch } from './ui/switch';
import { toast } from 'sonner@2.0.3';

interface AddProgressProps {
  onBack: () => void;
  onSave: (data: DailyProgressData) => void;
}

export interface DailyProgressData {
  date: string;
  mood: 'great' | 'good' | 'okay' | 'bad' | 'terrible';
  moodNotes: string;
  waterIntake: number; // in litres
  foodLog: string;
  hadBreakfast: boolean;
  hadLunch: boolean;
  hadDinner: boolean;
  workHours: number;
  learningHours: number;
  socialMediaHours: number;
  entertainmentHours: number;
  sleepHours: number;
  steps: number;
}

export function AddProgress({ onBack, onSave }: AddProgressProps) {
  const today = new Date().toISOString().split('T')[0];
  
  const [formData, setFormData] = useState<DailyProgressData>(() => {
    const saved = localStorage.getItem(`twinsync_progress_${today}`);
    if (saved) {
      return JSON.parse(saved);
    }
    return {
      date: today,
      mood: 'good' as const,
      moodNotes: '',
      waterIntake: 0,
      foodLog: '',
      hadBreakfast: true,
      hadLunch: true,
      hadDinner: true,
      workHours: 0,
      learningHours: 0,
      socialMediaHours: 0,
      entertainmentHours: 0,
      sleepHours: 0,
      steps: 0
    };
  });

  const moods = [
    { value: 'great' as const, emoji: '😄', label: 'Great', color: 'from-emerald-500 to-green-500' },
    { value: 'good' as const, emoji: '😊', label: 'Good', color: 'from-blue-500 to-cyan-500' },
    { value: 'okay' as const, emoji: '😐', label: 'Okay', color: 'from-yellow-500 to-amber-500' },
    { value: 'bad' as const, emoji: '😟', label: 'Bad', color: 'from-orange-500 to-red-500' },
    { value: 'terrible' as const, emoji: '😢', label: 'Terrible', color: 'from-red-600 to-rose-600' }
  ];

  const handleSave = () => {
    // Save to localStorage
    localStorage.setItem(`twinsync_progress_${today}`, JSON.stringify(formData));
    
    // Call parent callback
    onSave(formData);
    
    toast.success('✅ Progress saved successfully!', {
      description: 'Your digital twin has been updated'
    });
    
    onBack();
  };

  const updateField = <K extends keyof DailyProgressData>(field: K, value: DailyProgressData[K]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-4"
      >
        <Button
          onClick={onBack}
          variant="ghost"
          className="rounded-2xl backdrop-blur-xl bg-white/50 dark:bg-slate-800/50 border border-white/30 dark:border-slate-700/30"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>
        <div>
          <h2 className="text-2xl text-slate-800 dark:text-white">Add Today's Progress</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
      </motion.div>

      {/* Mood Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="rounded-3xl backdrop-blur-2xl bg-gradient-to-br from-white/70 via-white/50 to-white/30 dark:from-slate-800/70 dark:via-slate-800/50 dark:to-slate-800/30 border border-white/20 dark:border-slate-700/50 p-8 shadow-2xl"
      >
        <div className="flex items-center gap-2 mb-6">
          <Smile className="w-5 h-5 text-violet-500" />
          <h3 className="text-xl text-slate-800 dark:text-white">How are you feeling today?</h3>
        </div>

        <div className="flex gap-3 mb-6 flex-wrap">
          {moods.map((mood) => (
            <button
              key={mood.value}
              onClick={() => updateField('mood', mood.value)}
              className={`flex-1 min-w-[100px] p-4 rounded-2xl border-2 transition-all duration-300 ${
                formData.mood === mood.value
                  ? `bg-gradient-to-br ${mood.color} border-white text-white scale-105`
                  : 'backdrop-blur-xl bg-white/50 dark:bg-slate-800/50 border-white/30 dark:border-slate-700/30 hover:scale-105'
              }`}
            >
              <div className="text-3xl mb-2">{mood.emoji}</div>
              <div className={`text-sm ${formData.mood === mood.value ? 'text-white' : 'text-slate-700 dark:text-slate-200'}`}>
                {mood.label}
              </div>
            </button>
          ))}
        </div>

        <div className="space-y-2">
          <Label htmlFor="moodNotes" className="text-sm text-slate-700 dark:text-slate-200">
            Notes (optional)
          </Label>
          <Textarea
            id="moodNotes"
            value={formData.moodNotes}
            onChange={(e) => updateField('moodNotes', e.target.value)}
            placeholder="How was your day? Any highlights or challenges?"
            className="min-h-[80px] rounded-2xl backdrop-blur-xl bg-white/50 dark:bg-slate-800/50 border border-white/30 dark:border-slate-700/30"
          />
        </div>
      </motion.div>

      {/* Hydration & Nutrition */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="rounded-3xl backdrop-blur-2xl bg-gradient-to-br from-white/70 via-white/50 to-white/30 dark:from-slate-800/70 dark:via-slate-800/50 dark:to-slate-800/30 border border-white/20 dark:border-slate-700/50 p-8 shadow-2xl"
      >
        <div className="flex items-center gap-2 mb-6">
          <Utensils className="w-5 h-5 text-violet-500" />
          <h3 className="text-xl text-slate-800 dark:text-white">Nutrition & Hydration</h3>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="waterIntake" className="text-sm text-slate-700 dark:text-slate-200 flex items-center gap-2">
              <Droplet className="w-4 h-4 text-blue-500" />
              Water Intake (Litres)
            </Label>
            <Input
              id="waterIntake"
              type="number"
              step="0.1"
              min="0"
              max="10"
              value={formData.waterIntake || ''}
              onChange={(e) => updateField('waterIntake', parseFloat(e.target.value) || 0)}
              placeholder="Enter liters (e.g., 2.5)"
              className="rounded-2xl backdrop-blur-xl bg-white/50 dark:bg-slate-800/50 border border-white/30 dark:border-slate-700/30 placeholder:text-slate-400/50 dark:placeholder:text-slate-500/50"
            />
          </div>

          <div className="space-y-4">
            <Label className="text-sm text-slate-700 dark:text-slate-200">Meals Today</Label>
            <div className="flex gap-4 flex-wrap">
              <div className="flex items-center gap-2 p-4 rounded-2xl backdrop-blur-xl bg-white/50 dark:bg-slate-800/50 border border-white/30 dark:border-slate-700/30 flex-1 min-w-[150px]">
                <Switch
                  checked={formData.hadBreakfast}
                  onCheckedChange={(checked) => updateField('hadBreakfast', checked)}
                />
                <span className="text-sm text-slate-700 dark:text-slate-200">🍳 Breakfast</span>
              </div>
              <div className="flex items-center gap-2 p-4 rounded-2xl backdrop-blur-xl bg-white/50 dark:bg-slate-800/50 border border-white/30 dark:border-slate-700/30 flex-1 min-w-[150px]">
                <Switch
                  checked={formData.hadLunch}
                  onCheckedChange={(checked) => updateField('hadLunch', checked)}
                />
                <span className="text-sm text-slate-700 dark:text-slate-200">🥗 Lunch</span>
              </div>
              <div className="flex items-center gap-2 p-4 rounded-2xl backdrop-blur-xl bg-white/50 dark:bg-slate-800/50 border border-white/30 dark:border-slate-700/30 flex-1 min-w-[150px]">
                <Switch
                  checked={formData.hadDinner}
                  onCheckedChange={(checked) => updateField('hadDinner', checked)}
                />
                <span className="text-sm text-slate-700 dark:text-slate-200">🍽️ Dinner</span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="foodLog" className="text-sm text-slate-700 dark:text-slate-200">
              What did you eat today? (optional)
            </Label>
            <Textarea
              id="foodLog"
              value={formData.foodLog}
              onChange={(e) => updateField('foodLog', e.target.value)}
              placeholder="e.g., Oatmeal for breakfast, chicken salad for lunch..."
              className="min-h-[60px] rounded-2xl backdrop-blur-xl bg-white/50 dark:bg-slate-800/50 border border-white/30 dark:border-slate-700/30"
            />
          </div>
        </div>
      </motion.div>

      {/* Time Tracking */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="rounded-3xl backdrop-blur-2xl bg-gradient-to-br from-white/70 via-white/50 to-white/30 dark:from-slate-800/70 dark:via-slate-800/50 dark:to-slate-800/30 border border-white/20 dark:border-slate-700/50 p-8 shadow-2xl"
      >
        <div className="flex items-center gap-2 mb-6">
          <Briefcase className="w-5 h-5 text-violet-500" />
          <h3 className="text-xl text-slate-800 dark:text-white">Time Spent Today</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="workHours" className="text-sm text-slate-700 dark:text-slate-200 flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-violet-500" />
              Work Hours
            </Label>
            <Input
              id="workHours"
              type="number"
              step="0.5"
              min="0"
              max="24"
              value={formData.workHours || ''}
              onChange={(e) => updateField('workHours', parseFloat(e.target.value) || 0)}
              placeholder="Enter hours (e.g., 8)"
              className="rounded-2xl backdrop-blur-xl bg-white/50 dark:bg-slate-800/50 border border-white/30 dark:border-slate-700/30 placeholder:text-slate-400/50 dark:placeholder:text-slate-500/50"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="learningHours" className="text-sm text-slate-700 dark:text-slate-200 flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-blue-500" />
              Learning Hours
            </Label>
            <Input
              id="learningHours"
              type="number"
              step="0.5"
              min="0"
              max="24"
              value={formData.learningHours || ''}
              onChange={(e) => updateField('learningHours', parseFloat(e.target.value) || 0)}
              placeholder="Enter hours (e.g., 2)"
              className="rounded-2xl backdrop-blur-xl bg-white/50 dark:bg-slate-800/50 border border-white/30 dark:border-slate-700/30 placeholder:text-slate-400/50 dark:placeholder:text-slate-500/50"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="socialMediaHours" className="text-sm text-slate-700 dark:text-slate-200 flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-pink-500" />
              Social Media Hours
            </Label>
            <Input
              id="socialMediaHours"
              type="number"
              step="0.5"
              min="0"
              max="24"
              value={formData.socialMediaHours || ''}
              onChange={(e) => updateField('socialMediaHours', parseFloat(e.target.value) || 0)}
              placeholder="Enter hours (e.g., 1.5)"
              className="rounded-2xl backdrop-blur-xl bg-white/50 dark:bg-slate-800/50 border border-white/30 dark:border-slate-700/30 placeholder:text-slate-400/50 dark:placeholder:text-slate-500/50"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="entertainmentHours" className="text-sm text-slate-700 dark:text-slate-200 flex items-center gap-2">
              <Film className="w-4 h-4 text-amber-500" />
              Entertainment Hours
            </Label>
            <Input
              id="entertainmentHours"
              type="number"
              step="0.5"
              min="0"
              max="24"
              value={formData.entertainmentHours || ''}
              onChange={(e) => updateField('entertainmentHours', parseFloat(e.target.value) || 0)}
              placeholder="Enter hours (e.g., 2)"
              className="rounded-2xl backdrop-blur-xl bg-white/50 dark:bg-slate-800/50 border border-white/30 dark:border-slate-700/30 placeholder:text-slate-400/50 dark:placeholder:text-slate-500/50"
            />
          </div>
        </div>
      </motion.div>

      {/* Sleep & Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="rounded-3xl backdrop-blur-2xl bg-gradient-to-br from-white/70 via-white/50 to-white/30 dark:from-slate-800/70 dark:via-slate-800/50 dark:to-slate-800/30 border border-white/20 dark:border-slate-700/50 p-8 shadow-2xl"
      >
        <div className="flex items-center gap-2 mb-6">
          <Moon className="w-5 h-5 text-violet-500" />
          <h3 className="text-xl text-slate-800 dark:text-white">Rest & Activity</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="sleepHours" className="text-sm text-slate-700 dark:text-slate-200 flex items-center gap-2">
              <Moon className="w-4 h-4 text-indigo-500" />
              Sleep Hours
            </Label>
            <Input
              id="sleepHours"
              type="number"
              step="0.5"
              min="0"
              max="24"
              value={formData.sleepHours || ''}
              onChange={(e) => updateField('sleepHours', parseFloat(e.target.value) || 0)}
              placeholder="Enter hours (e.g., 8)"
              className="rounded-2xl backdrop-blur-xl bg-white/50 dark:bg-slate-800/50 border border-white/30 dark:border-slate-700/30 placeholder:text-slate-400/50 dark:placeholder:text-slate-500/50"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="steps" className="text-sm text-slate-700 dark:text-slate-200 flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-500" />
              Steps Taken
            </Label>
            <Input
              id="steps"
              type="number"
              step="100"
              min="0"
              max="50000"
              value={formData.steps || ''}
              onChange={(e) => updateField('steps', parseInt(e.target.value) || 0)}
              placeholder="Enter steps (e.g., 10000)"
              className="rounded-2xl backdrop-blur-xl bg-white/50 dark:bg-slate-800/50 border border-white/30 dark:border-slate-700/30 placeholder:text-slate-400/50 dark:placeholder:text-slate-500/50"
            />
          </div>
        </div>
      </motion.div>

      {/* Save Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="flex justify-end gap-4"
      >
        <Button
          onClick={onBack}
          variant="ghost"
          className="rounded-2xl backdrop-blur-xl bg-white/50 dark:bg-slate-800/50 border border-white/30 dark:border-slate-700/30"
        >
          Cancel
        </Button>
        <Button
          onClick={handleSave}
          className="rounded-2xl bg-gradient-to-r from-violet-500 to-purple-500 text-white hover:from-violet-600 hover:to-purple-600"
        >
          <Save className="w-4 h-4" />
          Save Progress
        </Button>
      </motion.div>
    </div>
  );
}
