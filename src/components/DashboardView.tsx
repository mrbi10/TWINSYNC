import { motion } from 'motion/react';
import { Droplet, Clock, Smile, Calendar as CalendarIcon, ChevronLeft, ChevronRight, Video, Activity as ActivityIcon, BarChart3, TrendingUp } from 'lucide-react';
import { IllustrativeTwin } from './IllustrativeTwin';
import { Progress } from './ui/progress';
import { Activity } from '../types';
import { useState } from 'react';
import { ImageWithFallback } from './figma/ImageWithFallback';
// import medicalIllustration from 'figma:asset/f7c78693582f55d877af3b344bc58cfc7d461b8f.png';

interface DashboardViewProps {
  balanceScore: number;
  streak: number;
  recentActivities: Activity[];
  onQuickAction: (type: 'hydration' | 'break' | 'mood') => void;
  showCelebration: boolean;
}

export function DashboardView({
  balanceScore,
  streak,
  recentActivities,
  onQuickAction,
  showCelebration,
}: DashboardViewProps) {
  const [selectedDate, setSelectedDate] = useState(6);
  const currentMonth = 'October 2025';

  const getHealthState = () => {
    if (balanceScore >= 80) return 'healthy';
    if (balanceScore >= 50) return 'neutral';
    return 'needs-attention';
  };

  const formatTimeAgo = (date: Date) => {
    const minutes = Math.floor((Date.now() - date.getTime()) / 60000);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  const quickActions = [
    { type: 'hydration' as const, label: 'Hydration', icon: '💧', bgColor: 'bg-[var(--focus-blue)]' },
    { type: 'break' as const, label: 'Break', icon: '⏸️', bgColor: 'bg-[var(--purple)]' },
    { type: 'mood' as const, label: 'Mood', icon: '😊', bgColor: 'bg-[var(--warm-orange)]' },
  ];

  // Mock calendar data
  const calendarDays = [
    { date: 1, hasEvent: false },
    { date: 2, hasEvent: false },
    { date: 3, hasEvent: true },
    { date: 4, hasEvent: false },
    { date: 5, hasEvent: true },
    { date: 6, hasEvent: true },
    { date: 7, hasEvent: false },
    { date: 8, hasEvent: false },
    { date: 9, hasEvent: false },
    { date: 10, hasEvent: false },
    { date: 11, hasEvent: false },
    { date: 12, hasEvent: true },
    { date: 13, hasEvent: false },
    { date: 14, hasEvent: true },
    { date: 15, hasEvent: false },
    { date: 16, hasEvent: false },
    { date: 17, hasEvent: false },
    { date: 18, hasEvent: false },
    { date: 19, hasEvent: true },
    { date: 20, hasEvent: false },
    { date: 21, hasEvent: false },
    { date: 22, hasEvent: false },
    { date: 23, hasEvent: false },
    { date: 24, hasEvent: false },
    { date: 25, hasEvent: false },
    { date: 26, hasEvent: false },
    { date: 27, hasEvent: false },
    { date: 28, hasEvent: false },
    { date: 29, hasEvent: false },
    { date: 30, hasEvent: false },
    { date: 31, hasEvent: false },
  ];

  const appointments = [
    { title: 'Manage stress', time: '10:00am - 12:00 pm', icon: '🧘', color: 'bg-[var(--mint)]' },
    { title: 'Physiotherapy', time: '09:00am - 10:00 am', icon: '💆', color: 'bg-[var(--peach)]' },
  ];

  return (
    <div className="space-y-6 pb-6">
      {/* Three Column Layout - TwinSync Dashboard with Digital Twin Centered */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Panel - Digital Twin (Front & Center) */}
        <div className="lg:col-span-3 space-y-6">
          {/* Digital Twin - Main Focus */}
          <motion.div
            className="bg-gradient-to-br from-[var(--mint)]/20 via-[var(--purple)]/10 to-[var(--focus-blue)]/15 rounded-3xl p-8 border border-border/50 shadow-xl relative overflow-hidden"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          >
            {/* Decorative background */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-50" />
            <div className="absolute top-4 right-4 w-24 h-24 bg-gradient-to-br from-[var(--mint)]/20 to-transparent rounded-full blur-2xl" />
            <div className="absolute bottom-4 left-4 w-20 h-20 bg-gradient-to-br from-[var(--purple)]/20 to-transparent rounded-full blur-2xl" />
            
            <div className="relative z-10">
              <div className="text-center mb-4">
                <h3 className="mb-1">Your Digital Twin</h3>
                <p className="text-sm text-muted-foreground">Synced & Active</p>
              </div>

              {/* Large Digital Twin Display */}
              <div className="flex items-center justify-center mb-6 py-4">
                <IllustrativeTwin 
                  healthState={getHealthState()} 
                  showCelebration={showCelebration} 
                  size="large" 
                />
              </div>

              {/* Health Status */}
              <div className="bg-white/60 rounded-2xl p-5 border border-white/80 backdrop-blur-sm shadow-lg">
                <div className="flex items-center justify-center gap-2 mb-4">
                  <div className="w-3 h-3 rounded-full bg-[var(--success-green)] animate-pulse-glow shadow-lg" />
                  <span className="text-sm">Excellent Health</span>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="text-muted-foreground">Balance Score</span>
                      <span>{balanceScore}%</span>
                    </div>
                    <Progress value={balanceScore} className="h-2" />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <div className="text-center p-3 rounded-xl bg-gradient-to-br from-[var(--mint)]/30 to-[var(--mint)]/10 border border-[var(--mint)]/30">
                      <div className="text-xl mb-1">🔥</div>
                      <div className="text-xs text-muted-foreground">Streak</div>
                      <div className="text-sm">{streak} days</div>
                    </div>
                    <div className="text-center p-3 rounded-xl bg-gradient-to-br from-[var(--purple)]/30 to-[var(--purple)]/10 border border-[var(--purple)]/30">
                      <div className="text-xl mb-1">⭐</div>
                      <div className="text-xs text-muted-foreground">Level</div>
                      <div className="text-sm">5</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Check Condition Card */}
          <motion.div
            className="bg-card rounded-3xl p-6 border border-border shadow-lg"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="text-center mb-4">
              <div className="text-4xl mb-3">🩺</div>
              <h4 className="mb-2">Check your condition</h4>
              <p className="text-sm text-muted-foreground">Review your wellness status and activities</p>
            </div>
            <motion.button
              onClick={() => onQuickAction('break')}
              className="w-full px-6 py-3 rounded-2xl bg-gradient-to-r from-[var(--mint)] to-[var(--success-green)] text-gray-800 hover:opacity-90 transition-all shadow-md hover:shadow-lg"
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              Check It Now
            </motion.button>
          </motion.div>

          {/* Quick Stats Illustration */}
          <motion.div
            className="bg-card rounded-3xl p-6 border border-border shadow-sm"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-gradient-to-br from-[var(--mint)]/20 to-[var(--mint)]/10 rounded-2xl p-4 text-center border border-[var(--mint)]/30">
                <div className="text-3xl mb-1">📅</div>
                <div className="text-xs text-muted-foreground">Calendar</div>
              </div>
              <div className="bg-gradient-to-br from-[var(--warm-orange)]/20 to-[var(--warm-orange)]/10 rounded-2xl p-4 text-center border border-[var(--warm-orange)]/30">
                <div className="text-3xl mb-1">📊</div>
                <div className="text-xs text-muted-foreground">Statistics</div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-[var(--success-green)]/20 to-[var(--success-green)]/10 rounded-2xl p-4 text-center border border-[var(--success-green)]/30">
              <div className="flex items-center justify-center gap-2 mb-1">
                <span className="text-2xl">✅</span>
                <div className="text-sm">Health Check</div>
              </div>
              <div className="text-xs text-muted-foreground">All systems normal</div>
            </div>
          </motion.div>

          {/* Wellness Illustration */}
          <motion.div
            className="bg-gradient-to-br from-[var(--cream)]/30 to-[var(--peach)]/10 rounded-3xl p-6 border border-border/50 relative overflow-hidden"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {/* Decorative elements */}
            <div className="absolute top-4 right-4 text-3xl opacity-30">🌿</div>
            <div className="absolute bottom-4 left-4 text-2xl opacity-30">🌱</div>
            
            <div className="flex items-center justify-center mb-4">
              <IllustrativeTwin healthState={getHealthState()} showCelebration={showCelebration} size="large" />
            </div>
            <div className="text-center relative z-10">
              <div className="flex items-center justify-center gap-2 mb-2">
                <span className="text-2xl">🩺</span>
                <span className="text-sm">Your Digital Twin</span>
              </div>
              <p className="text-xs text-muted-foreground">Monitoring your wellness journey</p>
              <div className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/60 border border-border/50">
                <div className="w-2 h-2 rounded-full bg-[var(--success-green)] animate-pulse-glow"></div>
                <span className="text-xs">Active & Healthy</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Center Column - Main Content */}
        <div className="xl:col-span-6 space-y-6">
          {/* Upcoming Wellness Session */}
          <motion.div
            className="bg-card rounded-3xl p-6 shadow-lg border border-border"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center justify-between mb-5">
              <h3>Upcoming wellness session</h3>
              <div className="text-xs text-muted-foreground bg-accent px-3 py-1.5 rounded-full">Today</div>
            </div>
            
            <div className="bg-gradient-to-br from-[var(--focus-blue)]/15 to-[var(--teal)]/10 rounded-3xl p-6 border border-[var(--focus-blue)]/20 relative overflow-hidden">
              {/* Decorative background pattern */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/20 to-transparent rounded-full blur-2xl"></div>
              
              <div className="flex items-start gap-5 relative z-10">
                {/* Hospital Illustration */}
                <div className="w-36 h-28 rounded-2xl overflow-hidden flex-shrink-0 bg-gradient-to-br from-[var(--focus-blue)]/40 to-[var(--teal)]/30 flex items-center justify-center border border-[var(--focus-blue)]/30 shadow-md">
                  <span className="text-5xl">🏥</span>
                </div>
                
                <div className="flex-1 min-w-0">
                  <h4 className="mb-1">TwinSync Wellness Center</h4>
                  <p className="text-sm text-muted-foreground mb-4">New York, USA</p>
                  <div className="flex flex-wrap items-center gap-4 text-sm mb-4">
                    <div className="flex items-center gap-2 bg-white/60 px-3 py-1.5 rounded-xl border border-border/50">
                      <CalendarIcon className="w-4 h-4 text-[var(--focus-blue)]" />
                      <span>14 Mar 2025</span>
                    </div>
                    <div className="flex items-center gap-2 bg-white/60 px-3 py-1.5 rounded-xl border border-border/50">
                      <Clock className="w-4 h-4 text-[var(--warm-orange)]" />
                      <span>09:00 pm</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 bg-background rounded-2xl p-2.5 border border-border shadow-sm">
                      <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[var(--peach)] to-[var(--soft-pink)] flex items-center justify-center shadow-md">
                        <span className="text-xl">👩‍⚕️</span>
                      </div>
                      <div>
                        <div className="text-sm">Dr. Emilia Winson</div>
                        <div className="text-xs text-muted-foreground">Wellness Coach</div>
                      </div>
                    </div>
                    <motion.button 
                      className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-[var(--success-green)] text-gray-800 hover:bg-[var(--success-green)]/90 transition-all shadow-md hover:shadow-lg"
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                    >
                      <Video className="w-4 h-4" />
                      Video call
                    </motion.button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Wellness Activities Chart */}
          <motion.div
            className="bg-card rounded-3xl p-6 shadow-lg border border-border"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="mb-1">Wellness activities</h3>
                <p className="text-sm text-muted-foreground">Today, 28 October 2025</p>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-2xl border border-border bg-background">
                <CalendarIcon className="w-4 h-4 text-muted-foreground" />
                <select className="bg-transparent border-none outline-none text-sm">
                  <option>Month</option>
                  <option>Week</option>
                  <option>Day</option>
                </select>
              </div>
            </div>

            {/* Bar Chart */}
            <div className="flex items-end justify-between h-48 gap-4 mb-6">
              {['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map((month, i) => {
                const heights = [45, 60, 40, 50, 55, 70];
                const colors = [
                  'bg-gradient-to-t from-[var(--mint)]/40 to-[var(--mint)]/20',
                  'bg-gradient-to-t from-[var(--mint)]/50 to-[var(--mint)]/30',
                  'bg-gradient-to-t from-[var(--mint)]/35 to-[var(--mint)]/20',
                  'bg-gradient-to-t from-[var(--mint)]/45 to-[var(--mint)]/25',
                  'bg-gradient-to-t from-[var(--mint)]/55 to-[var(--mint)]/35',
                  'bg-gradient-to-t from-[var(--success-green)] to-[var(--success-green)]/70'
                ];
                return (
                  <div key={i} className="flex-1 flex flex-col items-center gap-3">
                    <motion.div
                      className={`w-full rounded-t-2xl border-t-2 ${i === 5 ? 'border-[var(--success-green)]' : 'border-[var(--mint)]/50'} ${colors[i]}`}
                      initial={{ height: 0 }}
                      animate={{ height: `${heights[i]}%` }}
                      transition={{ duration: 0.6, delay: 0.2 + i * 0.1, ease: "easeOut" }}
                    />
                    <span className="text-xs text-muted-foreground">{month}</span>
                  </div>
                );
              })}
            </div>

            {/* Good conditions badge */}
            <div className="flex items-center justify-between p-4 rounded-2xl bg-gradient-to-r from-[var(--focus-blue)]/10 to-[var(--teal)]/10 border border-[var(--focus-blue)]/20">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[var(--focus-blue)]/30 to-[var(--teal)]/30 flex items-center justify-center">
                  <span className="text-2xl">😊</span>
                </div>
                <div>
                  <div>Good conditions</div>
                  <div className="text-xs text-muted-foreground">Anxiety & wellness improving</div>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </div>
          </motion.div>

          {/* Recent Activities & Quick Actions */}
          <motion.div
            className="bg-card rounded-3xl p-6 shadow-lg border border-border"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h3 className="mb-4">Quick wellness actions</h3>
            <div className="grid grid-cols-3 gap-4 mb-6">
              {quickActions.map((action, index) => (
                <motion.button
                  key={action.type}
                  onClick={() => onQuickAction(action.type)}
                  className="p-5 rounded-2xl bg-gradient-to-br from-accent/50 to-accent/20 hover:shadow-lg transition-all group border border-border/50"
                  whileHover={{ scale: 1.03, y: -3 }}
                  whileTap={{ scale: 0.97 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.3 + index * 0.1 }}
                >
                  <div className={`w-14 h-14 rounded-2xl ${action.bgColor} flex items-center justify-center mb-3 mx-auto group-hover:scale-110 transition-transform shadow-md`}>
                    <span className="text-2xl">{action.icon}</span>
                  </div>
                  <div className="text-center text-sm">{action.label}</div>
                </motion.button>
              ))}
            </div>

            {/* Streak Display */}
            <div className="p-5 rounded-2xl bg-gradient-to-br from-[var(--warm-orange)]/15 to-[var(--peach)]/10 border border-[var(--warm-orange)]/20">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[var(--warm-orange)] to-[var(--peach)] flex items-center justify-center shadow-lg">
                    <span className="text-2xl">🔥</span>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Focus Streak</div>
                    <div className="text-2xl">{streak} Days</div>
                  </div>
                </div>
                <TrendingUp className="w-6 h-6 text-[var(--success-green)]" />
              </div>
              <div className="flex gap-1.5">
                {[...Array(7)].map((_, i) => (
                  <div
                    key={i}
                    className={`flex-1 h-2.5 rounded-full transition-all ${
                      i < streak 
                        ? 'bg-gradient-to-r from-[var(--warm-orange)] to-[var(--peach)] shadow-sm' 
                        : 'bg-muted'
                    }`}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Right Column - Calendar & Appointments */}
        <div className="xl:col-span-3 space-y-6">
          {/* Calendar Widget */}
          <motion.div
            className="bg-card rounded-3xl p-6 shadow-lg border border-border"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h3 className="mb-5">List of appointments</h3>
            
            {/* View toggles */}
            <div className="flex gap-2 mb-5">
              <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-2xl border border-border text-sm hover:bg-accent transition-all">
                <CalendarIcon className="w-4 h-4" />
                Monthly
              </button>
              <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-2xl border border-border text-sm hover:bg-accent transition-all">
                <Clock className="w-4 h-4" />
                Daily
              </button>
            </div>

            {/* Calendar Header */}
            <div className="flex items-center justify-between mb-4">
              <h4>{currentMonth}</h4>
              <div className="flex gap-1">
                <button className="w-9 h-9 rounded-xl hover:bg-accent transition-colors flex items-center justify-center">
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button className="w-9 h-9 rounded-xl hover:bg-accent transition-colors flex items-center justify-center">
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Calendar Grid */}
            <div className="mb-4">
              <div className="grid grid-cols-7 gap-1.5 mb-3">
                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
                  <div key={i} className="text-center text-xs text-muted-foreground py-1.5">
                    {day}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-1.5">
                {/* Empty cells for alignment */}
                {[...Array(3)].map((_, i) => (
                  <div key={`empty-${i}`} className="aspect-square" />
                ))}
                {calendarDays.map((day) => (
                  <motion.button
                    key={day.date}
                    onClick={() => setSelectedDate(day.date)}
                    className={`aspect-square rounded-xl flex items-center justify-center text-sm relative transition-all ${
                      selectedDate === day.date
                        ? 'bg-[var(--warm-orange)] text-white shadow-md'
                        : day.hasEvent
                        ? 'bg-accent hover:bg-accent/80'
                        : 'hover:bg-accent/50'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {day.date}
                    {day.hasEvent && selectedDate !== day.date && (
                      <div className="absolute bottom-1.5 w-1.5 h-1.5 rounded-full bg-[var(--warm-orange)]" />
                    )}
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Daily Progress */}
          <motion.div
            className="bg-gradient-to-br from-[var(--cream)]/40 to-[var(--success-green)]/20 rounded-3xl p-6 border border-border/50 shadow-lg"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h4 className="mb-2">Daily progress</h4>
            <p className="text-sm text-muted-foreground mb-6">Keep improving the quality of your health</p>
            
            <div className="flex items-center justify-center mb-4">
              <div className="relative w-40 h-40">
                <svg className="w-full h-full -rotate-90">
                  <circle
                    cx="80"
                    cy="80"
                    r="70"
                    stroke="currentColor"
                    strokeWidth="14"
                    fill="none"
                    className="text-muted/20"
                  />
                  <motion.circle
                    cx="80"
                    cy="80"
                    r="70"
                    stroke="var(--success-green)"
                    strokeWidth="14"
                    fill="none"
                    strokeLinecap="round"
                    initial={{ strokeDasharray: "0 440" }}
                    animate={{ strokeDasharray: `${(balanceScore / 100) * 440} 440` }}
                    transition={{ duration: 1.2, delay: 0.3, ease: "easeOut" }}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-4xl mb-1">{balanceScore}%</div>
                    <div className="text-xs text-muted-foreground">Complete</div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Appointment List */}
          <motion.div
            className="bg-card rounded-3xl p-6 shadow-lg border border-border"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h4 className="mb-4">Upcoming sessions</h4>
            <div className="space-y-3">
              {appointments.map((apt, index) => (
                <motion.div
                  key={index}
                  className="flex items-center gap-3 p-4 rounded-2xl hover:bg-accent/50 transition-all cursor-pointer group border border-transparent hover:border-border"
                  whileHover={{ x: 4, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                >
                  <div className={`w-14 h-14 rounded-2xl ${apt.color} flex items-center justify-center flex-shrink-0 shadow-md`}>
                    <span className="text-2xl">{apt.icon}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm mb-1">{apt.title}</div>
                    <div className="text-xs text-muted-foreground">{apt.time}</div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </motion.div>
              ))}
            </div>
            <motion.button 
              className="w-full mt-5 py-3 text-sm hover:bg-accent/50 rounded-2xl transition-all flex items-center justify-center gap-2 group border border-border"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="text-[var(--purple)]">See More Schedule</span>
              <ChevronRight className="w-4 h-4 text-[var(--purple)] group-hover:translate-x-1 transition-transform" />
            </motion.button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
