import { motion } from 'motion/react';
import { HealthState } from '../types';
import { Sparkles } from 'lucide-react';

interface IllustrativeTwinProps {
  healthState: HealthState;
  showCelebration?: boolean;
  size?: 'small' | 'medium' | 'large';
}

export function IllustrativeTwin({ healthState, showCelebration = false, size = 'large' }: IllustrativeTwinProps) {
  const getColors = () => {
    switch (healthState) {
      case 'healthy':
        return {
          primary: '#86efac',
          secondary: '#a7f3d0',
          accent: '#6ee7b7',
          skin: '#fcd5ce',
        };
      case 'neutral':
        return {
          primary: '#93c5fd',
          secondary: '#bfdbfe',
          accent: '#60a5fa',
          skin: '#fcd5ce',
        };
      case 'needs-attention':
        return {
          primary: '#fca5a5',
          secondary: '#fecaca',
          accent: '#f87171',
          skin: '#fcd5ce',
        };
    }
  };

  const colors = getColors();
  const sizeClasses = {
    small: 'w-24 h-24',
    medium: 'w-40 h-40',
    large: 'w-56 h-56 md:w-72 md:h-72',
  };

  return (
    <div className={`relative flex items-center justify-center ${sizeClasses[size]}`}>
      {/* Celebration sparkles */}
      {showCelebration && (
        <>
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute"
              initial={{ opacity: 0, scale: 0 }}
              animate={{
                opacity: [0, 1, 0],
                scale: [0, 1, 1.2],
                x: [0, (i % 2 ? 1 : -1) * (30 + i * 10)],
                y: [0, -(20 + i * 10)],
              }}
              transition={{ duration: 1.5, delay: i * 0.1, repeat: Infinity, repeatDelay: 2 }}
            >
              <Sparkles className="w-4 h-4 text-yellow-400" />
            </motion.div>
          ))}
        </>
      )}

      {/* Soft background glow */}
      <motion.div
        className="absolute inset-0 rounded-full blur-3xl opacity-30"
        style={{ background: colors.primary }}
        animate={
          healthState === 'healthy'
            ? { scale: [1, 1.15, 1], opacity: [0.2, 0.4, 0.2] }
            : {}
        }
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Twin Illustration */}
      <motion.svg
        viewBox="0 0 200 240"
        className="relative z-10 w-full h-full drop-shadow-lg"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <defs>
          <linearGradient id="bodyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={colors.primary} />
            <stop offset="100%" stopColor={colors.secondary} />
          </linearGradient>
          <linearGradient id="shirtGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={colors.accent} />
            <stop offset="100%" stopColor={colors.primary} />
          </linearGradient>
        </defs>

        {/* Body/Torso */}
        <motion.path
          d="M 70 110 Q 60 120 62 145 L 62 180 Q 62 190 72 190 L 128 190 Q 138 190 138 180 L 138 145 Q 140 120 130 110 Z"
          fill="url(#shirtGradient)"
          animate={
            healthState === 'healthy'
              ? { scale: [1, 1.02, 1] }
              : {}
          }
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          style={{ transformOrigin: '100px 150px' }}
        />

        {/* Left Arm */}
        <motion.ellipse
          cx="58"
          cy="135"
          rx="12"
          ry="32"
          fill="url(#shirtGradient)"
          transform="rotate(-15 58 135)"
          animate={
            healthState === 'healthy'
              ? {
                  rotate: [-15, -20, -15],
                }
              : {}
          }
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          style={{ transformOrigin: '58px 135px' }}
        />

        {/* Right Arm */}
        <motion.ellipse
          cx="142"
          cy="135"
          rx="12"
          ry="32"
          fill="url(#shirtGradient)"
          transform="rotate(15 142 135)"
          animate={
            healthState === 'healthy'
              ? {
                  rotate: [15, 20, 15],
                }
              : {}
          }
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut', delay: 0.3 }}
          style={{ transformOrigin: '142px 135px' }}
        />

        {/* Hands */}
        <circle cx="52" cy="165" r="8" fill={colors.skin} />
        <circle cx="148" cy="165" r="8" fill={colors.skin} />

        {/* Neck */}
        <rect x="90" y="95" width="20" height="15" rx="5" fill={colors.skin} />

        {/* Head */}
        <motion.circle
          cx="100"
          cy="70"
          r="35"
          fill={colors.skin}
          animate={
            healthState === 'healthy'
              ? { y: [0, -2, 0] }
              : {}
          }
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* Hair */}
        <motion.path
          d="M 65 70 Q 65 40 100 35 Q 135 40 135 70 Q 135 50 125 45 Q 115 42 100 40 Q 85 42 75 45 Q 65 50 65 70"
          fill="#4a5568"
          animate={
            healthState === 'healthy'
              ? { y: [0, -2, 0] }
              : {}
          }
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* Face - Eyes */}
        <motion.g
          animate={
            healthState === 'healthy'
              ? { y: [0, -2, 0] }
              : {}
          }
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ellipse cx="85" cy="68" rx="4" ry="5" fill="#2d3748" />
          <ellipse cx="115" cy="68" rx="4" ry="5" fill="#2d3748" />
          
          {/* Eye highlights */}
          <circle cx="87" cy="66" r="1.5" fill="white" opacity="0.8" />
          <circle cx="117" cy="66" r="1.5" fill="white" opacity="0.8" />

          {/* Cheeks */}
          <ellipse cx="75" cy="78" rx="8" ry="6" fill={colors.accent} opacity="0.3" />
          <ellipse cx="125" cy="78" rx="8" ry="6" fill={colors.accent} opacity="0.3" />

          {/* Mouth based on health state */}
          {healthState === 'healthy' && (
            <path
              d="M 85 85 Q 100 92 115 85"
              stroke="#2d3748"
              strokeWidth="2.5"
              fill="none"
              strokeLinecap="round"
            />
          )}
          {healthState === 'neutral' && (
            <line
              x1="85"
              y1="88"
              x2="115"
              y2="88"
              stroke="#2d3748"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          )}
          {healthState === 'needs-attention' && (
            <path
              d="M 85 92 Q 100 87 115 92"
              stroke="#2d3748"
              strokeWidth="2.5"
              fill="none"
              strokeLinecap="round"
            />
          )}
        </motion.g>

        {/* Legs */}
        <rect x="75" y="190" width="18" height="40" rx="9" fill={colors.primary} />
        <rect x="107" y="190" width="18" height="40" rx="9" fill={colors.primary} />

        {/* Shoes */}
        <ellipse cx="84" cy="230" rx="12" ry="6" fill="#4a5568" />
        <ellipse cx="116" cy="230" rx="12" ry="6" fill="#4a5568" />

        {/* Health indicator - small icon */}
        {healthState === 'healthy' && (
          <motion.g
            initial={{ scale: 0 }}
            animate={{ scale: [0, 1.2, 1], rotate: [0, 10, 0] }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <circle cx="130" cy="55" r="12" fill="white" />
            <text x="130" y="61" textAnchor="middle" fontSize="16">✓</text>
          </motion.g>
        )}
        {healthState === 'needs-attention' && (
          <motion.g
            animate={{ y: [0, -3, 0] }}
            transition={{ duration: 1, repeat: Infinity }}
          >
            <circle cx="130" cy="55" r="12" fill="white" />
            <text x="130" y="61" textAnchor="middle" fontSize="16">!</text>
          </motion.g>
        )}
      </motion.svg>
    </div>
  );
}
