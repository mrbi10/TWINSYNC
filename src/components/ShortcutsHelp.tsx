import { motion, AnimatePresence } from 'motion/react';
import { X, Keyboard } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';

interface ShortcutsHelpProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ShortcutsHelp({ isOpen, onClose }: ShortcutsHelpProps) {
  const shortcuts = [
    { keys: ['⌘/Ctrl', 'H'], description: 'Log Hydration' },
    { keys: ['⌘/Ctrl', 'B'], description: 'Log Break' },
    { keys: ['⌘/Ctrl', 'M'], description: 'Log Mood' },
    { keys: ['⌘/Ctrl', '1'], description: 'Go to Dashboard' },
    { keys: ['⌘/Ctrl', '2'], description: 'Go to Analytics' },
    { keys: ['⌘/Ctrl', '3'], description: 'Go to Achievements' },
    { keys: ['Esc'], description: 'Close Modal' },
    { keys: ['?'], description: 'Show Shortcuts' },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <Card className="w-full max-w-lg bg-white rounded-2xl shadow-2xl">
              {/* Header */}
              <div className="bg-gradient-to-r from-teal-500 to-purple-500 p-6 text-white rounded-t-2xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Keyboard className="w-6 h-6" />
                    <h2>Keyboard Shortcuts</h2>
                  </div>
                  <button
                    onClick={onClose}
                    className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 space-y-3 max-h-[60vh] overflow-y-auto">
                {shortcuts.map((shortcut, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
                  >
                    <span className="text-slate-700">{shortcut.description}</span>
                    <div className="flex gap-1">
                      {shortcut.keys.map((key, i) => (
                        <kbd
                          key={i}
                          className="px-2 py-1 bg-white border border-slate-300 rounded text-xs text-slate-600 shadow-sm"
                        >
                          {key}
                        </kbd>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Footer */}
              <div className="p-6 border-t border-slate-200">
                <Button
                  onClick={onClose}
                  className="w-full bg-gradient-to-r from-teal-500 to-purple-500 hover:from-teal-600 hover:to-purple-600"
                >
                  Got it!
                </Button>
              </div>
            </Card>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
