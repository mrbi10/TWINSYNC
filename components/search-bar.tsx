import { motion, AnimatePresence } from 'motion/react';
import { Search, X } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';

interface SearchResult {
  id: string;
  title: string;
  description: string;
  category: string;
  action: () => void;
}

interface SearchBarProps {
  onNavigate: (screen: string) => void;
}

export function SearchBar({ onNavigate }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const searchRef = useRef<HTMLDivElement>(null);

  // Search index with all searchable features
  const searchIndex: SearchResult[] = [
    // Navigation
    { id: 'dashboard', title: 'Dashboard', description: 'View your daily overview and statistics', category: 'Navigation', action: () => onNavigate('dashboard') },
    { id: 'insights', title: 'Insights', description: 'View historical patterns and achievements', category: 'Navigation', action: () => onNavigate('insights') },
    { id: 'settings', title: 'Settings', description: 'Manage your preferences and goals', category: 'Navigation', action: () => onNavigate('settings') },
    
    // Progress
    { id: 'add-progress', title: 'Add Progress', description: 'Log your daily activities and update your twin', category: 'Trackers', action: () => onNavigate('add-progress') },
    
    // Trackers
    { id: 'water', title: 'Water Tracker', description: 'Track your daily water intake in litres', category: 'Trackers', action: () => onNavigate('water') },
    { id: 'mood', title: 'Mood Tracker', description: 'Log your daily mood and notes', category: 'Trackers', action: () => onNavigate('mood') },
    { id: 'sleep', title: 'Sleep Tracker', description: 'Monitor your sleep patterns and quality', category: 'Trackers', action: () => onNavigate('sleep') },
    { id: 'focus', title: 'Focus Timer', description: 'Pomodoro timer for productive work sessions', category: 'Trackers', action: () => onNavigate('focus') },
    
    // Features
    { id: 'health-score', title: 'Health Score', description: 'Your overall wellness score', category: 'Features', action: () => onNavigate('dashboard') },
    { id: 'habit-heatmap', title: 'Habit Heatmap', description: 'Visual representation of your habits', category: 'Features', action: () => onNavigate('dashboard') },
    { id: 'achievements', title: 'Achievements & Badges', description: 'View your unlocked badges and progress', category: 'Features', action: () => onNavigate('insights') },
    { id: 'weekly-stats', title: 'Weekly Statistics', description: 'Compare your weekly performance', category: 'Features', action: () => onNavigate('insights') },
    
    // Settings
    { id: 'privacy', title: 'Privacy Settings', description: 'Control your data and privacy preferences', category: 'Settings', action: () => onNavigate('settings') },
    { id: 'notifications', title: 'Notifications', description: 'Manage notification preferences', category: 'Settings', action: () => onNavigate('settings') },
    { id: 'theme', title: 'Theme', description: 'Switch between light and dark mode', category: 'Settings', action: () => onNavigate('settings') },
    
    // Goals
    { id: 'water-goal', title: 'Water Goal', description: 'Set your daily water intake target', category: 'Goals', action: () => onNavigate('settings') },
    { id: 'sleep-goal', title: 'Sleep Goal', description: 'Set your target sleep hours', category: 'Goals', action: () => onNavigate('settings') },
    { id: 'focus-goal', title: 'Focus Goal', description: 'Set your daily focus hours target', category: 'Goals', action: () => onNavigate('settings') },
    { id: 'break-goal', title: 'Break Goal', description: 'Set your daily break target', category: 'Goals', action: () => onNavigate('settings') },
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (query.trim() === '') {
      setResults([]);
      return;
    }

    const searchQuery = query.toLowerCase();
    const filtered = searchIndex.filter(item => 
      item.title.toLowerCase().includes(searchQuery) ||
      item.description.toLowerCase().includes(searchQuery) ||
      item.category.toLowerCase().includes(searchQuery)
    );

    setResults(filtered.slice(0, 8)); // Limit to 8 results
  }, [query]);

  const handleSelect = (result: SearchResult) => {
    result.action();
    setQuery('');
    setIsOpen(false);
  };

  const handleClear = () => {
    setQuery('');
    setResults([]);
  };

  const categoryColors: Record<string, string> = {
    Navigation: 'from-violet-500 to-purple-500',
    Trackers: 'from-blue-500 to-cyan-500',
    Features: 'from-emerald-500 to-green-500',
    Settings: 'from-amber-500 to-orange-500',
    Goals: 'from-pink-500 to-rose-500'
  };

  return (
    <div ref={searchRef} className="relative w-full max-w-md" style={{ zIndex: 100000 }}>
      <div className="relative">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsOpen(true)}
          placeholder="Search features, trackers, settings..."
          className="w-full pl-11 pr-10 py-2.5 rounded-2xl backdrop-blur-xl bg-white/50 dark:bg-slate-800/50 border border-white/30 dark:border-slate-700/30 text-slate-800 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/50 transition-all duration-300"
        />
        {query && (
          <button
            onClick={handleClear}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 rounded-lg hover:bg-slate-200/50 dark:hover:bg-slate-700/50 transition-colors"
          >
            <X className="w-4 h-4 text-slate-400 dark:text-slate-500" />
          </button>
        )}
      </div>

      {/* Search Results Dropdown */}
      <AnimatePresence>
        {isOpen && results.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full mt-2 w-full rounded-2xl backdrop-blur-2xl bg-white/90 dark:bg-slate-800/90 border border-white/30 dark:border-slate-700/30 shadow-2xl overflow-hidden"
            style={{ zIndex: 100001 }}
          >
            <div className="max-h-96 overflow-y-auto">
              {results.map((result, index) => (
                <motion.button
                  key={result.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => handleSelect(result)}
                  className="w-full px-4 py-3 flex items-start gap-3 hover:bg-white/60 dark:hover:bg-slate-700/60 transition-colors text-left group"
                >
                  <div className={`p-2 rounded-xl bg-gradient-to-br ${categoryColors[result.category]} flex-shrink-0 group-hover:scale-110 transition-transform duration-300`}>
                    <Search className="w-3.5 h-3.5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm text-slate-800 dark:text-white">
                        {result.title}
                      </span>
                      <span className={`text-xs px-2 py-0.5 rounded-full bg-gradient-to-r ${categoryColors[result.category]} text-white`}>
                        {result.category}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-1">
                      {result.description}
                    </p>
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* No Results */}
      <AnimatePresence>
        {isOpen && query.trim() !== '' && results.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full mt-2 w-full rounded-2xl backdrop-blur-2xl bg-white/90 dark:bg-slate-800/90 border border-white/30 dark:border-slate-700/30 shadow-2xl p-4"
            style={{ zIndex: 100001 }}
          >
            <p className="text-sm text-slate-500 dark:text-slate-400 text-center">
              No results found for "{query}"
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
