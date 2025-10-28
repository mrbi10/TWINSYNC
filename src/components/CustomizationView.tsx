import { useState } from 'react';
import { motion } from 'motion/react';
import { Lock, ChevronLeft, ChevronRight } from 'lucide-react';
import { IllustrativeTwin } from './IllustrativeTwin';
import { Progress } from './ui/progress';
import { TwinCustomization } from '../types';
import { Button } from './ui/button';

interface CustomizationViewProps {
  customizations: TwinCustomization[];
  currentLevel: number;
  currentXP: number;
  maxXP: number;
}

export function CustomizationView({ customizations, currentLevel, currentXP, maxXP }: CustomizationViewProps) {
  const [selectedCategory, setSelectedCategory] = useState<'accessory' | 'background' | 'color'>('accessory');
  const [currentIndex, setCurrentIndex] = useState(0);

  const filteredItems = customizations.filter((c) => c.type === selectedCategory);
  const categories = [
    { id: 'accessory' as const, label: 'Accessories', icon: '👓' },
    { id: 'background' as const, label: 'Backgrounds', icon: '🎨' },
    { id: 'color' as const, label: 'Colors', icon: '🌈' },
  ];

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % filteredItems.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + filteredItems.length) % filteredItems.length);
  };

  return (
    <div className="space-y-6 pb-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="mb-6">Customize Your Twin</h2>

        {/* Level and XP */}
        <div className="bg-gradient-to-r from-[var(--mint)] to-[var(--purple)] rounded-3xl p-6 text-white mb-6 shadow-lg">
          <div className="flex items-center justify-between mb-3">
            <div>
              <div className="text-sm opacity-90">Current Level</div>
              <div className="text-3xl">Level {currentLevel}</div>
            </div>
            <div className="text-right">
              <div className="text-sm opacity-90">Experience</div>
              <div className="text-xl">
                {currentXP} / {maxXP} XP
              </div>
            </div>
          </div>
          <Progress value={(currentXP / maxXP) * 100} className="h-2 bg-white/20" />
          <p className="text-sm mt-3 opacity-90">Balanced Wellness - Keep logging habits to level up!</p>
        </div>
      </motion.div>

      {/* Twin Preview */}
      <motion.div
        className="bg-gradient-to-br from-[var(--mint)]/20 to-[var(--purple)]/10 rounded-3xl p-8 border border-border/50"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <IllustrativeTwin healthState="healthy" size="large" />
      </motion.div>

      {/* Category Selector */}
      <div className="flex gap-2 justify-center">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => {
              setSelectedCategory(cat.id);
              setCurrentIndex(0);
            }}
            className={`px-6 py-3 rounded-2xl transition-all ${
              selectedCategory === cat.id
                ? 'bg-gradient-to-r from-[var(--mint)] to-[var(--purple)] text-white shadow-lg scale-105'
                : 'bg-card border border-border hover:bg-accent'
            }`}
          >
            <span className="mr-2">{cat.icon}</span>
            {cat.label}
          </button>
        ))}
      </div>

      {/* Customization Carousel */}
      <motion.div
        className="bg-card rounded-3xl p-8 shadow-sm border border-border"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="flex items-center justify-between gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={handlePrev}
            disabled={filteredItems.length <= 1}
            className="h-12 w-12 rounded-full"
          >
            <ChevronLeft className="w-6 h-6" />
          </Button>

          <div className="flex-1 text-center">
            {filteredItems.length > 0 ? (
              <motion.div
                key={filteredItems[currentIndex].id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="inline-block"
              >
                <div className="relative inline-block mb-4">
                  <div
                    className={`w-32 h-32 rounded-full flex items-center justify-center text-6xl shadow-lg ${
                      filteredItems[currentIndex].unlocked
                        ? 'bg-gradient-to-br from-[var(--mint)] to-[var(--purple)]'
                        : 'bg-muted'
                    }`}
                  >
                    {filteredItems[currentIndex].unlocked ? (
                      filteredItems[currentIndex].icon
                    ) : (
                      <Lock className="w-12 h-12 text-muted-foreground" />
                    )}
                  </div>
                </div>
                <h3 className="mb-2">{filteredItems[currentIndex].name}</h3>
                {filteredItems[currentIndex].unlocked ? (
                  <div className="inline-block px-4 py-2 rounded-full text-sm" style={{ backgroundColor: 'var(--success-green)', color: '#1f2937' }}>
                    Unlocked ✓
                  </div>
                ) : (
                  <div className="inline-block px-4 py-2 bg-muted text-muted-foreground rounded-full text-sm">
                    Locked - Level {currentLevel + 3} Required
                  </div>
                )}
              </motion.div>
            ) : (
              <p className="text-muted-foreground">No items in this category yet</p>
            )}
          </div>

          <Button
            variant="outline"
            size="icon"
            onClick={handleNext}
            disabled={filteredItems.length <= 1}
            className="h-12 w-12 rounded-full"
          >
            <ChevronRight className="w-6 h-6" />
          </Button>
        </div>

        <div className="flex justify-center gap-2 mt-6">
          {filteredItems.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`h-2 rounded-full transition-all ${
                index === currentIndex ? 'w-6' : 'w-2'
              }`}
              style={{ backgroundColor: index === currentIndex ? 'var(--purple)' : 'var(--muted)' }}
            />
          ))}
        </div>
      </motion.div>

      {/* All Items Grid */}
      <div>
        <h3 className="mb-4 px-1">All {categories.find((c) => c.id === selectedCategory)?.label}</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {filteredItems.map((item, index) => (
            <motion.div
              key={item.id}
              className={`bg-card rounded-2xl p-4 text-center cursor-pointer transition-all border ${
                currentIndex === index ? 'shadow-lg border-[var(--purple)]' : 'shadow-sm hover:shadow-lg border-border'
              } ${!item.unlocked && 'opacity-60'}`}
              onClick={() => setCurrentIndex(index)}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              whileHover={{ scale: 1.05 }}
            >
              <div
                className={`w-16 h-16 rounded-full mx-auto mb-2 flex items-center justify-center text-3xl ${
                  item.unlocked ? 'bg-gradient-to-br from-[var(--mint)]/30 to-[var(--purple)]/30' : 'bg-muted'
                }`}
              >
                {item.unlocked ? item.icon : <Lock className="w-6 h-6 text-muted-foreground" />}
              </div>
              <div className="text-sm">{item.name}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
