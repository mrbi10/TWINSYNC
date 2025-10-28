import { motion, AnimatePresence } from 'motion/react';
import { AlertCircle, CheckCircle, Info, X } from 'lucide-react';

interface NotificationBannerProps {
  show: boolean;
  type: 'success' | 'warning' | 'info';
  message: string;
  onClose: () => void;
}

export function NotificationBanner({ show, type, message, onClose }: NotificationBannerProps) {
  const config = {
    success: {
      icon: CheckCircle,
      bgColor: 'from-green-400 to-emerald-500',
      textColor: 'text-white',
    },
    warning: {
      icon: AlertCircle,
      bgColor: 'from-orange-400 to-red-500',
      textColor: 'text-white',
    },
    info: {
      icon: Info,
      bgColor: 'from-blue-400 to-cyan-500',
      textColor: 'text-white',
    },
  };

  const { icon: Icon, bgColor, textColor } = config[type];

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-full max-w-md px-4"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          transition={{ duration: 0.3 }}
        >
          <div className={`bg-gradient-to-r ${bgColor} ${textColor} rounded-2xl shadow-2xl p-4 flex items-center gap-3`}>
            <Icon className="w-6 h-6 flex-shrink-0" />
            <p className="flex-1">{message}</p>
            <button
              onClick={onClose}
              className="p-1 rounded-full hover:bg-white/20 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
