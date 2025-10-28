import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { mockUserData, badgesData, activitiesData } from '../data/mock-data';
import { toast } from 'sonner@2.0.3';

interface AppState {
  userData: typeof mockUserData;
  badges: typeof badgesData;
  activities: typeof activitiesData;
  updateUserData: (data: Partial<typeof mockUserData>) => void;
  logActivity: (type: string, label: string, isMilestone?: boolean) => void;
  updateHydration: (litres: number) => void;
  updateFocus: (hours: number) => void;
  updateSleep: (hours: number, quality: number) => void;
  updateBreaks: (count: number) => void;
  updateMood: (mood: string) => void;
}

const AppStateContext = createContext<AppState | undefined>(undefined);

export function AppStateProvider({ children }: { children: ReactNode }) {
  // Load state from localStorage or use mock data
  const [userData, setUserData] = useState(() => {
    const saved = localStorage.getItem('twinsync_user_data');
    return saved ? JSON.parse(saved) : mockUserData;
  });

  const [badges, setBadges] = useState(() => {
    const saved = localStorage.getItem('twinsync_badges');
    return saved ? JSON.parse(saved) : badgesData;
  });

  const [activities, setActivities] = useState(() => {
    const saved = localStorage.getItem('twinsync_activities');
    return saved ? JSON.parse(saved) : activitiesData;
  });

  // Save to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem('twinsync_user_data', JSON.stringify(userData));
  }, [userData]);

  useEffect(() => {
    localStorage.setItem('twinsync_badges', JSON.stringify(badges));
  }, [badges]);

  useEffect(() => {
    localStorage.setItem('twinsync_activities', JSON.stringify(activities));
  }, [activities]);

  const calculateHealthScore = (data: typeof userData) => {
    const waterScore = ((data.today.waterLitres || 0) / 2.5) * 25;
    const breaksScore = (data.today.breaks / 5) * 20;
    const focusScore = (data.today.focusHours / 6) * 30;
    const sleepScore = (data.today.sleepHours / 8) * 25;
    return Math.min(100, Math.round(waterScore + breaksScore + focusScore + sleepScore));
  };

  const updateUserData = (data: Partial<typeof mockUserData>) => {
    setUserData((prev: typeof mockUserData) => {
      const updated = { ...prev, ...data };
      updated.healthScore = calculateHealthScore(updated);
      return updated;
    });
  };

  const logActivity = (type: string, label: string, isMilestone: boolean = false) => {
    const newActivity = {
      id: Date.now().toString(),
      type: type as any,
      label,
      timestamp: new Date().toISOString(),
      isMilestone
    };
    setActivities((prev: typeof activitiesData) => [newActivity, ...prev].slice(0, 50)); // Keep last 50 activities
  };

  const updateHydration = (litres: number) => {
    setUserData((prev: typeof mockUserData) => {
      const newLitres = Math.max(0, Math.min(5, litres));
      const updated = {
        ...prev,
        today: {
          ...prev.today,
          waterLitres: newLitres,
          waterGlasses: Math.round(newLitres * 4)
        }
      };
      updated.healthScore = calculateHealthScore(updated);
      return updated;
    });
  };

  const updateFocus = (hours: number) => {
    setUserData((prev: typeof mockUserData) => {
      const updated = {
        ...prev,
        today: {
          ...prev.today,
          focusHours: Math.max(0, Math.min(12, hours))
        }
      };
      updated.healthScore = calculateHealthScore(updated);
      return updated;
    });
  };

  const updateSleep = (hours: number, quality: number) => {
    setUserData((prev: typeof mockUserData) => {
      const updated = {
        ...prev,
        today: {
          ...prev.today,
          sleepHours: Math.max(0, Math.min(12, hours))
        }
      };
      updated.healthScore = calculateHealthScore(updated);
      return updated;
    });
    logActivity('sleep', `Logged ${hours.toFixed(1)}h sleep (Quality: ${quality}/5)`);
    toast(`🌙 Sleep logged: ${hours.toFixed(1)}h`);
  };

  const updateBreaks = (count: number) => {
    setUserData((prev: typeof mockUserData) => {
      const updated = {
        ...prev,
        today: {
          ...prev.today,
          breaks: Math.max(0, Math.min(10, count))
        }
      };
      updated.healthScore = calculateHealthScore(updated);
      return updated;
    });
  };

  const updateMood = (mood: string) => {
    setUserData((prev: typeof mockUserData) => ({
      ...prev,
      today: {
        ...prev.today,
        mood
      }
    }));
    logActivity('mood', `Mood: ${mood}`);
    toast(`😊 Mood logged: ${mood}`);
  };

  const value: AppState = {
    userData,
    badges,
    activities,
    updateUserData,
    logActivity,
    updateHydration,
    updateFocus,
    updateSleep,
    updateBreaks,
    updateMood
  };

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
}

export function useAppState() {
  const context = useContext(AppStateContext);
  if (!context) {
    throw new Error('useAppState must be used within AppStateProvider');
  }
  return context;
}
