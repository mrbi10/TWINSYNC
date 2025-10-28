import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from './ui/button';
import { DigitalTwin } from './DigitalTwin';
import { Sparkles, ArrowRight } from 'lucide-react';

interface WelcomeScreenProps {
  onComplete: () => void;
}

export function WelcomeScreen({ onComplete }: WelcomeScreenProps) {
  const [step, setStep] = useState(0);

  const steps = [
    {
      title: 'Welcome to TwinSync',
      description: 'Your personal wellness companion that mirrors your health journey',
      icon: '👋',
    },
    {
      title: 'Meet Your Digital Twin',
      description: 'Your twin reflects your wellness state through colors and animations',
      showTwin: true,
    },
    {
      title: 'Track Your Habits',
      description: 'Log hydration, breaks, mood, and more to keep your twin healthy',
      icon: '📊',
    },
    {
      title: 'Unlock Achievements',
      description: 'Complete goals to earn badges and customize your twin',
      icon: '🏆',
    },
  ];

  const currentStep = steps[step];
  const isLastStep = step === steps.length - 1;

  const handleNext = () => {
    if (isLastStep) {
      onComplete();
    } else {
      setStep(step + 1);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-gradient-to-br from-teal-500 via-purple-500 to-pink-500 flex items-center justify-center p-4">
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: -20 }}
          className="bg-white rounded-3xl p-8 md:p-12 max-w-2xl w-full shadow-2xl"
        >
          <div className="flex flex-col items-center text-center space-y-6">
            {/* Icon or Twin */}
            {currentStep.showTwin ? (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', duration: 0.8 }}
              >
                <DigitalTwin healthState="healthy" size="large" showParticles />
              </motion.div>
            ) : (
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', duration: 0.8 }}
                className="text-7xl mb-4"
              >
                {currentStep.icon}
              </motion.div>
            )}

            {/* Content */}
            <div className="space-y-4">
              <div className="flex items-center justify-center gap-2">
                <Sparkles className="w-6 h-6 text-teal-600" />
                <h1 className="bg-gradient-to-r from-teal-600 to-purple-600 bg-clip-text text-transparent">
                  {currentStep.title}
                </h1>
              </div>
              <p className="text-slate-600 max-w-md mx-auto">
                {currentStep.description}
              </p>
            </div>

            {/* Progress Dots */}
            <div className="flex gap-2 pt-4">
              {steps.map((_, i) => (
                <div
                  key={i}
                  className={`h-2 rounded-full transition-all ${
                    i === step
                      ? 'w-8 bg-gradient-to-r from-teal-500 to-purple-500'
                      : 'w-2 bg-slate-300'
                  }`}
                />
              ))}
            </div>

            {/* Action Button */}
            <Button
              onClick={handleNext}
              size="lg"
              className="bg-gradient-to-r from-teal-500 to-purple-500 hover:from-teal-600 hover:to-purple-600 px-8"
            >
              {isLastStep ? 'Get Started' : 'Next'}
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>

            {/* Skip Button */}
            {!isLastStep && (
              <button
                onClick={onComplete}
                className="text-sm text-slate-500 hover:text-slate-700 transition-colors"
              >
                Skip Tutorial
              </button>
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
