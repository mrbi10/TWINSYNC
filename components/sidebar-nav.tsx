import { motion, AnimatePresence } from 'motion/react';
import { Timer, LogOut, Trophy, ChevronDown } from 'lucide-react';
import { Button } from './ui/button';
import { ScrollArea } from './ui/scroll-area';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './ui/collapsible';
import { DailyGoals } from './daily-goals';
import { badgesData } from '../data/mock-data';
import { useState } from 'react';

interface SidebarNavProps {
  onLogout?: () => void;
}

export function SidebarNav({ onLogout }: SidebarNavProps) {
  const [badges] = useState(badgesData);
  const [badgesOpen, setBadgesOpen] = useState(false);
  
  const unlockedBadges = badges.filter(b => b.unlocked);
  const lockedBadges = badges.filter(b => !b.unlocked);

  return (
    <ScrollArea className="h-full">
      <div className="flex flex-col gap-6 p-6">
      {/* Twin Avatar */}
      <motion.div 
        className="flex flex-col items-center gap-3"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="relative">
          {/* Mini Twin Avatar */}
          <motion.div
            className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-400 via-green-400 to-teal-400 flex items-center justify-center shadow-2xl shadow-emerald-500/30 relative overflow-hidden"
            animate={{
              boxShadow: [
                '0 20px 60px rgba(52, 211, 153, 0.3)',
                '0 20px 80px rgba(52, 211, 153, 0.5)',
                '0 20px 60px rgba(52, 211, 153, 0.3)',
              ],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            {/* Shimmer effect */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
              animate={{
                x: ['-100%', '200%'],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'linear',
              }}
            />
            <span className="text-3xl relative z-10">😊</span>
          </motion.div>
          <motion.div
            className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-gradient-to-br from-emerald-400 to-green-500"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </div>
        <div className="text-center">
          <div className="text-sm text-slate-700 dark:text-slate-200">Your Twin</div>
          <div className="text-xs text-slate-500 dark:text-slate-400">Active</div>
        </div>
      </motion.div>

      {/* Logout Button */}
      {onLogout && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
        >
          <Button
            onClick={onLogout}
            variant="ghost"
            className="w-full justify-start gap-3 h-11 rounded-2xl backdrop-blur-sm bg-red-500/10 dark:bg-red-500/5 border border-red-500/20 dark:border-red-500/10 text-red-600 dark:text-red-400 hover:bg-red-500/20 dark:hover:bg-red-500/10 transition-all duration-300"
          >
            <LogOut className="w-4 h-4" />
            <span className="text-xs">Log Out</span>
          </Button>
        </motion.div>
      )}

      {/* Today's Progress */}
      <motion.div
        className="p-4 rounded-2xl backdrop-blur-xl bg-gradient-to-br from-white/60 to-white/40 dark:from-slate-800/60 dark:to-slate-800/40 border border-slate-200/50 dark:border-slate-700/50"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="text-xs text-slate-500 dark:text-slate-400 mb-3">Today's Progress</div>
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-600 dark:text-slate-300">Focus</span>
            <span className="text-violet-600 dark:text-violet-400">4.5h</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-600 dark:text-slate-300">Hydration</span>
            <span className="text-blue-600 dark:text-blue-400">2.0L</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-600 dark:text-slate-300">Sleep</span>
            <span className="text-indigo-600 dark:text-indigo-400">7.2h</span>
          </div>
        </div>
      </motion.div>

      {/* Daily Goals */}
      <DailyGoals />

      {/* Collapsible Achievement Badges */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <Collapsible open={badgesOpen} onOpenChange={setBadgesOpen}>
          <CollapsibleTrigger asChild>
            <button className="w-full p-4 rounded-2xl backdrop-blur-xl bg-gradient-to-br from-yellow-400/20 to-orange-500/20 dark:from-yellow-400/10 dark:to-orange-500/10 border border-yellow-500/30 dark:border-yellow-500/20 hover:from-yellow-400/30 hover:to-orange-500/30 dark:hover:from-yellow-400/15 dark:hover:to-orange-500/15 transition-all duration-300">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
                  <span className="text-xs text-slate-700 dark:text-slate-200">Badges</span>
                  <span className="text-xs text-yellow-600 dark:text-yellow-400">
                    ({unlockedBadges.length})
                  </span>
                </div>
                <motion.div
                  animate={{ rotate: badgesOpen ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <ChevronDown className="w-4 h-4 text-slate-600 dark:text-slate-300" />
                </motion.div>
              </div>
            </button>
          </CollapsibleTrigger>
          
          <CollapsibleContent>
            <AnimatePresence>
              {badgesOpen && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="mt-3 space-y-4"
                >
                  {/* Unlocked Badges */}
                  {unlockedBadges.length > 0 && (
                    <div className="p-4 rounded-2xl backdrop-blur-xl bg-white/40 dark:bg-slate-800/40 border border-white/30 dark:border-slate-700/30">
                      <div className="text-xs text-emerald-600 dark:text-emerald-400 mb-3">
                        ✨ Unlocked ({unlockedBadges.length})
                      </div>
                      <div className="space-y-2">
                        {unlockedBadges.map((badge, index) => (
                          <motion.div
                            key={badge.id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="flex items-start gap-3 p-3 rounded-xl bg-gradient-to-br from-yellow-400/30 to-orange-500/30 dark:from-yellow-400/20 dark:to-orange-500/20 border border-yellow-500/30"
                          >
                            <div className="text-2xl">{badge.icon}</div>
                            <div className="flex-1 min-w-0">
                              <div className="text-xs text-slate-800 dark:text-white mb-1">
                                {badge.name}
                              </div>
                              <div className="text-xs text-slate-600 dark:text-slate-300">
                                {badge.description}
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Locked Badges */}
                  {lockedBadges.length > 0 && (
                    <div className="p-4 rounded-2xl backdrop-blur-xl bg-white/40 dark:bg-slate-800/40 border border-white/30 dark:border-slate-700/30">
                      <div className="text-xs text-slate-500 dark:text-slate-400 mb-3">
                        🔒 In Progress ({lockedBadges.length})
                      </div>
                      <div className="space-y-2">
                        {lockedBadges.map((badge, index) => (
                          <motion.div
                            key={badge.id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="flex items-start gap-3 p-3 rounded-xl bg-slate-200/50 dark:bg-slate-700/50 border border-slate-300/30 dark:border-slate-600/30"
                          >
                            <div className="text-2xl grayscale opacity-50">{badge.icon}</div>
                            <div className="flex-1 min-w-0">
                              <div className="text-xs text-slate-700 dark:text-slate-200 mb-1">
                                {badge.name}
                              </div>
                              <div className="text-xs text-slate-500 dark:text-slate-400 mb-2">
                                {badge.description}
                              </div>
                              {badge.progress !== undefined && badge.target !== undefined && (
                                <div className="space-y-1">
                                  <div className="w-full h-1.5 bg-slate-300 dark:bg-slate-600 rounded-full overflow-hidden">
                                    <motion.div
                                      className="h-full bg-gradient-to-r from-violet-500 to-purple-500"
                                      initial={{ width: 0 }}
                                      animate={{ width: `${(badge.progress / badge.target) * 100}%` }}
                                      transition={{ duration: 0.5 }}
                                    />
                                  </div>
                                  <div className="text-xs text-slate-500 dark:text-slate-400">
                                    {badge.progress}/{badge.target}
                                  </div>
                                </div>
                              )}
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </CollapsibleContent>
        </Collapsible>
      </motion.div>
      </div>
    </ScrollArea>
  );
}
