import { motion } from 'motion/react';
import { HealthState } from '../types';
import { Sparkles } from 'lucide-react';

interface DigitalTwinProps {
  healthState: HealthState;
  showCelebration?: boolean;
  size?: 'small' | 'medium' | 'large';
}

export function DigitalTwin({ healthState, showCelebration = false, size = 'large' }: DigitalTwinProps) {
  const getColors = () => {
    switch (healthState) {
      case 'healthy':
        return {
          fill: 'rgba(72, 187, 120, 0.3)',
          glow: 'rgba(72, 187, 120, 0.6)',
          stroke: '#48bb78',
        };
      case 'neutral':
        return {
          fill: 'rgba(66, 153, 225, 0.3)',
          glow: 'rgba(66, 153, 225, 0.6)',
          stroke: '#4299e1',
        };
      case 'needs-attention':
        return {
          fill: 'rgba(245, 101, 101, 0.3)',
          glow: 'rgba(245, 101, 101, 0.6)',
          stroke: '#f56565',
        };
    }
  };

  const colors = getColors();
  const sizeClasses = {
    small: 'w-24 h-24',
    medium: 'w-40 h-40',
    large: 'w-64 h-64 md:w-80 md:h-80',
  };

  const getFaceExpression = () => {
    switch (healthState) {
      case 'healthy':
        return (
          <>
            <ellipse cx="45" cy="50" rx="3" ry="4" fill={colors.stroke} />
            <ellipse cx="65" cy="50" rx="3" ry="4" fill={colors.stroke} />
            <path
              d="M 35 65 Q 55 75 75 65"
              stroke={colors.stroke}
              strokeWidth="2.5"
              fill="none"
              strokeLinecap="round"
            />
          </>
        );
      case 'neutral':
        return (
          <>
            <ellipse cx="45" cy="50" rx="3" ry="4" fill={colors.stroke} />
            <ellipse cx="65" cy="50" rx="3" ry="4" fill={colors.stroke} />
            <line x1="40" y1="68" x2="70" y2="68" stroke={colors.stroke} strokeWidth="2.5" strokeLinecap="round" />
          </>
        );
      case 'needs-attention':
        return (
          <>
            <ellipse cx="45" cy="50" rx="3" ry="4" fill={colors.stroke} />
            <ellipse cx="65" cy="50" rx="3" ry="4" fill={colors.stroke} />
            <path
              d="M 35 72 Q 55 65 75 72"
              stroke={colors.stroke}
              strokeWidth="2.5"
              fill="none"
              strokeLinecap="round"
            />
          </>
        );
    }
  };

  return (
    <div className={`relative flex items-center justify-center ${sizeClasses[size]}`}>
      {/* Celebration sparkles */}
      {showCelebration && (
        <>
          <motion.div
            className="absolute"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: [0, 1, 0], scale: [0, 1, 1.5], rotate: 45 }}
            transition={{ duration: 1, repeat: Infinity, repeatDelay: 2 }}
            style={{ top: '10%', left: '10%' }}
          >
            <Sparkles className="w-6 h-6 text-yellow-400" />
          </motion.div>
          <motion.div
            className="absolute"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: [0, 1, 0], scale: [0, 1, 1.5], rotate: -45 }}
            transition={{ duration: 1, delay: 0.3, repeat: Infinity, repeatDelay: 2 }}
            style={{ top: '10%', right: '10%' }}
          >
            <Sparkles className="w-6 h-6 text-yellow-400" />
          </motion.div>
        </>
      )}

      {/* Outer glow */}
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{
          background: `radial-gradient(circle, ${colors.glow} 0%, transparent 70%)`,
          filter: 'blur(20px)',
        }}
        animate={
          healthState === 'healthy'
            ? {
                scale: [1, 1.1, 1],
                opacity: [0.6, 0.8, 0.6],
              }
            : {}
        }
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Twin SVG */}
      <motion.svg
        viewBox="0 0 110 150"
        className="relative z-10 w-full h-full"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Body */}
        <motion.ellipse
          cx="55"
          cy="100"
          rx="25"
          ry="35"
          fill={colors.fill}
          stroke={colors.stroke}
          strokeWidth="2"
          animate={
            healthState === 'healthy'
              ? {
                  strokeWidth: [2, 2.5, 2],
                }
              : {}
          }
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />

        {/* Head */}
        <motion.circle
          cx="55"
          cy="45"
          r="25"
          fill={colors.fill}
          stroke={colors.stroke}
          strokeWidth="2"
          animate={
            healthState === 'healthy'
              ? {
                  strokeWidth: [2, 2.5, 2],
                }
              : {}
          }
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />

        {/* Face expression */}
        {getFaceExpression()}

        {/* Arms */}
        <motion.line
          x1="30"
          y1="85"
          x2="15"
          y2="100"
          stroke={colors.stroke}
          strokeWidth="2"
          strokeLinecap="round"
          animate={
            healthState === 'healthy'
              ? {
                  x2: [15, 12, 15],
                  y2: [100, 95, 100],
                }
              : {}
          }
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <motion.line
          x1="80"
          y1="85"
          x2="95"
          y2="100"
          stroke={colors.stroke}
          strokeWidth="2"
          strokeLinecap="round"
          animate={
            healthState === 'healthy'
              ? {
                  x2: [95, 98, 95],
                  y2: [100, 95, 100],
                }
              : {}
          }
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 0.2,
          }}
        />

        {/* Legs */}
        <line x1="45" y1="130" x2="40" y2="145" stroke={colors.stroke} strokeWidth="2" strokeLinecap="round" />
        <line x1="65" y1="130" x2="70" y2="145" stroke={colors.stroke} strokeWidth="2" strokeLinecap="round" />
      </motion.svg>
    </div>
  );
}
