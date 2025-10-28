export const mockUserData = {
  name: "Alex",
  healthScore: 82,
  streaks: {
    focus: 5,
    breaks: 3,
    sleep: 7,
    hydration: 4
  },
  today: {
    waterLitres: 2.0,
    waterGlasses: 6, // Kept for backward compatibility
    focusHours: 4.5,
    sleepHours: 7.2,
    screenTime: 5.8,
    mood: "productive",
    breaks: 4
  }
};

export const weeklyHydrationData = [
  { day: 'Mon', litres: 2.4, glasses: 8 },
  { day: 'Tue', litres: 2.0, glasses: 6 },
  { day: 'Wed', litres: 2.2, glasses: 7 },
  { day: 'Thu', litres: 1.8, glasses: 5 },
  { day: 'Fri', litres: 2.5, glasses: 8 },
  { day: 'Sat', litres: 2.1, glasses: 6 },
  { day: 'Sun', litres: 2.0, glasses: 6 }
];

export const weeklyFocusData = [
  { day: 'Mon', hours: 5.2 },
  { day: 'Tue', hours: 4.8 },
  { day: 'Wed', hours: 6.1 },
  { day: 'Thu', hours: 4.5 },
  { day: 'Fri', hours: 5.5 },
  { day: 'Sat', hours: 3.2 },
  { day: 'Sun', hours: 2.8 }
];

export const weeklySleepData = [
  { day: 'Mon', hours: 7.5 },
  { day: 'Tue', hours: 6.8 },
  { day: 'Wed', hours: 7.2 },
  { day: 'Thu', hours: 6.5 },
  { day: 'Fri', hours: 7.8 },
  { day: 'Sat', hours: 8.2 },
  { day: 'Sun', hours: 7.2 }
];

export const weeklyScreenTimeData = [
  { day: 'Mon', hours: 6.2 },
  { day: 'Tue', hours: 5.8 },
  { day: 'Wed', hours: 7.1 },
  { day: 'Thu', hours: 5.8 },
  { day: 'Fri', hours: 6.5 },
  { day: 'Sat', hours: 4.2 },
  { day: 'Sun', hours: 3.8 }
];

export const habitHeatmapData = [
  { date: '2025-10-22', focus: 85, breaks: 70, sleep: 90, hydration: 60 },
  { date: '2025-10-23', focus: 90, breaks: 80, sleep: 85, hydration: 70 },
  { date: '2025-10-24', focus: 75, breaks: 60, sleep: 80, hydration: 80 },
  { date: '2025-10-25', focus: 95, breaks: 90, sleep: 90, hydration: 85 },
  { date: '2025-10-26', focus: 80, breaks: 75, sleep: 75, hydration: 70 },
  { date: '2025-10-27', focus: 88, breaks: 85, sleep: 95, hydration: 90 },
  { date: '2025-10-28', focus: 92, breaks: 88, sleep: 88, hydration: 75 }
];

export const insightsData = {
  achievements: [
    { id: 1, title: "5-day focus streak", date: "2025-10-28", icon: "target" },
    { id: 2, title: "7-day sleep streak", date: "2025-10-28", icon: "moon" },
    { id: 3, title: "Hydration champion", date: "2025-10-27", icon: "droplet" },
    { id: 4, title: "Balance master", date: "2025-10-25", icon: "award" }
  ],
  weeklyComparison: {
    thisWeek: { focus: 32.1, sleep: 51.2, breaks: 28, hydration: 48 },
    lastWeek: { focus: 28.5, sleep: 48.0, breaks: 21, hydration: 42 }
  }
};

export const twinFeedback = [
  { type: "positive", message: "Great job staying hydrated today! You're at 6/8 glasses." },
  { type: "neutral", message: "You've been working for 4.5 hours — consider taking a stretch break." },
  { type: "positive", message: "7-day sleep streak! Your consistency is paying off." },
  { type: "suggestion", message: "Your screen time is slightly high. Try the 20-20-20 rule." }
];

export const badgesData = [
  { id: 'hydration-week', name: 'Hydro Hero', description: 'Logged 8 glasses of water for 7 consecutive days', icon: '💧', unlocked: true },
  { id: 'focus-master', name: 'Focus Master', description: 'Completed 5-day focus streak', icon: '🎯', unlocked: true },
  { id: 'sleep-champion', name: 'Sleep Champion', description: 'Maintained 7+ hours sleep for a week', icon: '🌙', unlocked: true },
  { id: 'balance-guru', name: 'Balance Guru', description: 'Took 5 breaks per day for 3 days', icon: '⚖️', unlocked: false, progress: 2, target: 3 },
  { id: 'early-bird', name: 'Early Bird', description: 'Woke up before 6 AM for 5 days', icon: '🌅', unlocked: false, progress: 3, target: 5 },
  { id: 'wellness-warrior', name: 'Wellness Warrior', description: 'Maintained 85+ health score for a month', icon: '👑', unlocked: false, progress: 14, target: 30 }
];

export const activitiesData = [
  { id: '1', type: 'hydration' as const, label: 'Logged water glass', timestamp: new Date(Date.now() - 5 * 60000).toISOString(), isMilestone: false },
  { id: '2', type: 'focus' as const, label: 'Started focus session', timestamp: new Date(Date.now() - 45 * 60000).toISOString(), isMilestone: false },
  { id: '3', type: 'streak' as const, label: '7-day sleep streak achieved!', timestamp: new Date(Date.now() - 3 * 3600000).toISOString(), isMilestone: true },
  { id: '4', type: 'break' as const, label: 'Took a break', timestamp: new Date(Date.now() - 4 * 3600000).toISOString(), isMilestone: false },
  { id: '5', type: 'mood' as const, label: 'Logged mood: Happy', timestamp: new Date(Date.now() - 5 * 3600000).toISOString(), isMilestone: false },
  { id: '6', type: 'badge' as const, label: 'Unlocked "Sleep Champion" badge!', timestamp: new Date(Date.now() - 6 * 3600000).toISOString(), isMilestone: true },
  { id: '7', type: 'hydration' as const, label: 'Logged water glass', timestamp: new Date(Date.now() - 7 * 3600000).toISOString(), isMilestone: false },
  { id: '8', type: 'sleep' as const, label: 'Logged 7.5h sleep', timestamp: new Date(Date.now() - 24 * 3600000).toISOString(), isMilestone: false },
];
