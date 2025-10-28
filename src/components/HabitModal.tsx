import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Droplet, Clock, Smile, X, Plus, Minus } from 'lucide-react';
import { Button } from './ui/button';
import { HabitType } from '../types';

interface HabitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (type: HabitType, value: number | string) => void;
}

const habitOptions = [
  { type: 'hydration' as HabitType, label: 'Hydration', icon: Droplet, unit: 'ml', step: 250, default: 500 },
  { type: 'break' as HabitType, label: 'Break', icon: Clock, unit: 'min', step: 5, default: 10 },
  { type: 'mood' as HabitType, label: 'Mood', icon: Smile, unit: '', step: 0, default: '😊' },
];

const moodEmojis = ['😊', '😄', '😌', '😐', '😔', '😫', '😴', '🤩'];

export function HabitModal({ isOpen, onClose, onSave }: HabitModalProps) {
  const [selectedHabit, setSelectedHabit] = useState<HabitType | null>(null);
  const [hydrationValue, setHydrationValue] = useState(500);
  const [breakValue, setBreakValue] = useState(10);
  const [moodValue, setMoodValue] = useState('😊');

  const handleSave = () => {
    if (!selectedHabit) return;

    let value: number | string;
    if (selectedHabit === 'hydration') value = hydrationValue;
    else if (selectedHabit === 'break') value = breakValue;
    else value = moodValue;

    onSave(selectedHabit, value);
    setSelectedHabit(null);
    onClose();
  };

  const handleBack = () => {
    setSelectedHabit(null);
  };

  const getValue = (type: HabitType) => {
    if (type === 'hydration') return hydrationValue;
    if (type === 'break') return breakValue;
    return moodValue;
  };

  const setValue = (type: HabitType, newValue: number | string) => {
    if (type === 'hydration') setHydrationValue(newValue as number);
    else if (type === 'break') setBreakValue(newValue as number);
    else setMoodValue(newValue as string);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-card rounded-3xl shadow-2xl max-w-md w-full p-6 pointer-events-auto border border-border"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-accent transition-colors"
              >
                <X className="w-5 h-5 text-muted-foreground" />
              </button>

              {!selectedHabit ? (
                <>
                  <h2 className="mb-6">Log Your Habit</h2>
                  <div className="grid grid-cols-1 gap-3">
                    {habitOptions.map((habit) => {
                      const Icon = habit.icon;
                      return (
                        <motion.button
                          key={habit.type}
                          onClick={() => setSelectedHabit(habit.type)}
                          className="flex items-center gap-4 p-4 rounded-2xl border-2 border-border hover:border-[var(--teal)] transition-all hover:shadow-md hover:bg-accent/30"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[var(--mint)] to-[var(--purple)] flex items-center justify-center shadow-sm">
                            <Icon className="w-6 h-6 text-white" />
                          </div>
                          <span className="flex-1 text-left">{habit.label}</span>
                        </motion.button>
                      );
                    })}
                  </div>
                </>
              ) : (
                <>
                  <button
                    onClick={handleBack}
                    className="mb-4 text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    ← Back
                  </button>

                  {selectedHabit === 'mood' ? (
                    <>
                      <h2 className="mb-6">How are you feeling?</h2>
                      <div className="grid grid-cols-4 gap-3 mb-6">
                        {moodEmojis.map((emoji) => (
                          <motion.button
                            key={emoji}
                            onClick={() => setValue('mood', emoji)}
                            className={`text-4xl p-4 rounded-2xl border-2 transition-all ${
                              moodValue === emoji
                                ? 'scale-110 shadow-lg'
                                : 'border-border hover:border-[var(--purple)]'
                            }`}
                            style={moodValue === emoji ? { 
                              borderColor: 'var(--purple)',
                              backgroundColor: 'var(--purple)/10'
                            } : {}}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            {emoji}
                          </motion.button>
                        ))}
                      </div>
                    </>
                  ) : (
                    <>
                      <h2 className="mb-6">
                        {selectedHabit === 'hydration' ? 'Water Intake' : 'Break Duration'}
                      </h2>
                      <div className="flex items-center justify-center gap-4 mb-6">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => {
                            const habit = habitOptions.find((h) => h.type === selectedHabit)!;
                            const currentValue = getValue(selectedHabit) as number;
                            setValue(selectedHabit, Math.max(habit.step, currentValue - habit.step));
                          }}
                          className="h-12 w-12 rounded-full"
                        >
                          <Minus className="w-5 h-5" />
                        </Button>

                        <div className="text-center min-w-[120px]">
                          <div className="text-5xl mb-1">{getValue(selectedHabit)}</div>
                          <div className="text-sm text-muted-foreground">
                            {habitOptions.find((h) => h.type === selectedHabit)?.unit}
                          </div>
                        </div>

                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => {
                            const habit = habitOptions.find((h) => h.type === selectedHabit)!;
                            const currentValue = getValue(selectedHabit) as number;
                            setValue(selectedHabit, currentValue + habit.step);
                          }}
                          className="h-12 w-12 rounded-full"
                        >
                          <Plus className="w-5 h-5" />
                        </Button>
                      </div>
                    </>
                  )}

                  <Button
                    onClick={handleSave}
                    className="w-full h-12 rounded-2xl text-white shadow-lg"
                    style={{ background: 'linear-gradient(to right, var(--mint), var(--purple))' }}
                  >
                    Save
                  </Button>
                </>
              )}
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
