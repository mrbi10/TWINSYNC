import { motion } from 'motion/react';
import { IllustrativeTwin } from './IllustrativeTwin';

export function SplashScreen() {
  return (
    <motion.div
      className="fixed inset-0 flex flex-col items-center justify-center z-50"
      style={{ background: 'linear-gradient(to bottom right, var(--mint), var(--purple))' }}
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <div className="mb-8">
          <IllustrativeTwin healthState="healthy" size="large" showCelebration />
        </div>
        
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-white"
        >
          <h1 className="text-4xl mb-2 text-white">TwinSync</h1>
          <p className="text-xl opacity-90">Your Wellness, Mirrored</p>
          
          <motion.div
            className="mt-8 flex gap-2 justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <div className="w-2 h-2 rounded-full bg-white animate-pulse" style={{ animationDelay: '0ms' }} />
            <div className="w-2 h-2 rounded-full bg-white animate-pulse" style={{ animationDelay: '150ms' }} />
            <div className="w-2 h-2 rounded-full bg-white animate-pulse" style={{ animationDelay: '300ms' }} />
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
