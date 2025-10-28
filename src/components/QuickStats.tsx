import { motion } from 'motion/react';
import { Card } from './ui/card';
import { Droplet, Zap, Heart, TrendingUp } from 'lucide-react';

interface Stat {
  label: string;
  value: string;
  change: string;
  icon: React.ElementType;
  color: string;
  bgColor: string;
}

export function QuickStats() {
  const stats: Stat[] = [
    {
      label: 'Today\'s Hydration',
      value: '1.8L',
      change: '+0.3L',
      icon: Droplet,
      color: 'text-cyan-600',
      bgColor: 'bg-cyan-100',
    },
    {
      label: 'Focus Time',
      value: '4.5h',
      change: '+1.2h',
      icon: Zap,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
    {
      label: 'Wellness Score',
      value: '87%',
      change: '+5%',
      icon: Heart,
      color: 'text-rose-600',
      bgColor: 'bg-rose-100',
    },
    {
      label: 'Week Streak',
      value: '5 days',
      change: 'Active',
      icon: TrendingUp,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-100',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="p-4 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className={`w-10 h-10 ${stat.bgColor} rounded-lg flex items-center justify-center`}>
                  <Icon className={`w-5 h-5 ${stat.color}`} />
                </div>
                <span className="text-xs text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                  {stat.change}
                </span>
              </div>
              <div>
                <p className="text-slate-600 text-sm mb-1">{stat.label}</p>
                <p className="text-slate-800">{stat.value}</p>
              </div>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
}
