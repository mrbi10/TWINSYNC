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
    waterGlasses: 6,
    focusHours: 4.5,
    sleepHours: 7.2,
    screenTime: 5.8,
    mood: "productive",
    breaks: 4
  }
};

export const weeklyHydrationData = [
  { day: 'Mon', glasses: 8 },
  { day: 'Tue', glasses: 6 },
  { day: 'Wed', glasses: 7 },
  { day: 'Thu', glasses: 5 },
  { day: 'Fri', glasses: 8 },
  { day: 'Sat', glasses: 6 },
  { day: 'Sun', glasses: 6 }
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
