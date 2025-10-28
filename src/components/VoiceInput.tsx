import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mic, MicOff } from 'lucide-react';
import { Button } from './ui/button';

interface VoiceInputProps {
  onCommand?: (command: string) => void;
}

export function VoiceInput({ onCommand }: VoiceInputProps) {
  const [isListening, setIsListening] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);

  const handleToggle = () => {
    setIsListening(!isListening);
    if (!isListening) {
      // Simulate audio level changes
      const interval = setInterval(() => {
        setAudioLevel(Math.random() * 100);
      }, 100);
      
      setTimeout(() => {
        clearInterval(interval);
        setIsListening(false);
        setAudioLevel(0);
      }, 3000);
    }
  };

  return (
    <div className="relative inline-block">
      <Button
        onClick={handleToggle}
        variant={isListening ? 'default' : 'outline'}
        size="icon"
        className={`relative rounded-full ${
          isListening
            ? 'bg-gradient-to-r from-teal-500 to-purple-500 hover:from-teal-600 hover:to-purple-600'
            : ''
        }`}
      >
        <AnimatePresence mode="wait">
          {isListening ? (
            <motion.div
              key="listening"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
            >
              <Mic className="w-5 h-5" />
            </motion.div>
          ) : (
            <motion.div
              key="idle"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
            >
              <MicOff className="w-5 h-5" />
            </motion.div>
          )}
        </AnimatePresence>
      </Button>

      {/* Sound Wave Animation */}
      <AnimatePresence>
        {isListening && (
          <div className="absolute -inset-2 flex items-center justify-center gap-1 pointer-events-none">
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                className="w-1 bg-teal-500 rounded-full"
                animate={{
                  height: [4, audioLevel / 5 + 8, 4],
                }}
                transition={{
                  duration: 0.3,
                  repeat: Infinity,
                  delay: i * 0.1,
                }}
              />
            ))}
          </div>
        )}
      </AnimatePresence>

      {/* Listening Indicator */}
      {isListening && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap"
        >
          <div className="bg-slate-800 text-white text-xs px-3 py-1 rounded-full">
            Listening...
          </div>
        </motion.div>
      )}
    </div>
  );
}
