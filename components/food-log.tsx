import { motion } from 'motion/react';
import { useState, useEffect } from 'react';
import { Apple, Carrot, Pizza, Salad, Drumstick, TrendingUp, Plus, X } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { toast } from 'sonner@2.0.3';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

type FoodCategory = 'fruits' | 'vegetables' | 'protein' | 'grains' | 'dairy' | 'junk' | 'light' | 'heavy';

interface NutritionalValues {
  carbs: number;
  protein: number;
  fat: number;
  sugar: number;
  calories: number;
}

interface FoodEntry {
  id: string;
  category: FoodCategory;
  name: string;
  nutrition: NutritionalValues;
  timestamp: string;
  date: string;
}

export function FoodLog() {
  const [foodHistory, setFoodHistory] = useState<FoodEntry[]>(() => {
    const saved = localStorage.getItem('twinsync_food_history');
    return saved ? JSON.parse(saved) : [];
  });

  const [selectedCategory, setSelectedCategory] = useState<FoodCategory | null>(null);
  const [foodName, setFoodName] = useState('');
  const [carbs, setCarbs] = useState('');
  const [protein, setProtein] = useState('');
  const [fat, setFat] = useState('');
  const [sugar, setSugar] = useState('');
  const [calories, setCalories] = useState('');

  useEffect(() => {
    localStorage.setItem('twinsync_food_history', JSON.stringify(foodHistory));
  }, [foodHistory]);

  const foodCategories = [
    { id: 'fruits' as FoodCategory, name: 'Fruits', icon: Apple, color: 'from-red-500 to-pink-500', emoji: '🍎' },
    { id: 'vegetables' as FoodCategory, name: 'Vegetables', icon: Carrot, color: 'from-green-500 to-emerald-500', emoji: '🥕' },
    { id: 'protein' as FoodCategory, name: 'Protein', icon: Drumstick, color: 'from-amber-500 to-orange-500', emoji: '🍗' },
    { id: 'grains' as FoodCategory, name: 'Grains', icon: Salad, color: 'from-yellow-500 to-amber-500', emoji: '🌾' },
    { id: 'dairy' as FoodCategory, name: 'Dairy', icon: Apple, color: 'from-blue-500 to-cyan-500', emoji: '🥛' },
    { id: 'junk' as FoodCategory, name: 'Junk Food', icon: Pizza, color: 'from-red-600 to-rose-600', emoji: '🍕' },
    { id: 'light' as FoodCategory, name: 'Light Food', icon: Salad, color: 'from-teal-500 to-cyan-500', emoji: '🥗' },
    { id: 'heavy' as FoodCategory, name: 'Heavy Food', icon: Drumstick, color: 'from-purple-500 to-violet-500', emoji: '🍖' }
  ];

  const handleLogFood = () => {
    if (!selectedCategory) {
      toast.error('Please select a food category');
      return;
    }

    if (!foodName.trim()) {
      toast.error('Please enter food name');
      return;
    }

    const entry: FoodEntry = {
      id: Date.now().toString(),
      category: selectedCategory,
      name: foodName,
      nutrition: {
        carbs: parseFloat(carbs) || 0,
        protein: parseFloat(protein) || 0,
        fat: parseFloat(fat) || 0,
        sugar: parseFloat(sugar) || 0,
        calories: parseFloat(calories) || 0
      },
      timestamp: new Date().toISOString(),
      date: new Date().toISOString().split('T')[0]
    };

    setFoodHistory(prev => [entry, ...prev]);

    // Reset form
    setSelectedCategory(null);
    setFoodName('');
    setCarbs('');
    setProtein('');
    setFat('');
    setSugar('');
    setCalories('');

    toast.success('🍽️ Food logged successfully!');
  };

  const handleDelete = (id: string) => {
    setFoodHistory(prev => prev.filter(e => e.id !== id));
    toast.success('Entry deleted');
  };

  // Calculate today's totals
  const getTodayTotals = () => {
    const today = new Date().toISOString().split('T')[0];
    const todayEntries = foodHistory.filter(e => e.date === today);
    
    return todayEntries.reduce((acc, entry) => ({
      carbs: acc.carbs + entry.nutrition.carbs,
      protein: acc.protein + entry.nutrition.protein,
      fat: acc.fat + entry.nutrition.fat,
      sugar: acc.sugar + entry.nutrition.sugar,
      calories: acc.calories + entry.nutrition.calories,
      count: acc.count + 1
    }), { carbs: 0, protein: 0, fat: 0, sugar: 0, calories: 0, count: 0 });
  };

  const todayTotals = getTodayTotals();

  // Calculate category distribution
  const getCategoryDistribution = () => {
    const today = new Date().toISOString().split('T')[0];
    const todayEntries = foodHistory.filter(e => e.date === today);
    
    const distribution: Record<FoodCategory, number> = {
      fruits: 0,
      vegetables: 0,
      protein: 0,
      grains: 0,
      dairy: 0,
      junk: 0,
      light: 0,
      heavy: 0
    };

    todayEntries.forEach(entry => {
      distribution[entry.category]++;
    });

    return Object.entries(distribution)
      .filter(([_, count]) => count > 0)
      .map(([category, count]) => ({
        name: foodCategories.find(c => c.id === category)?.name || category,
        value: count
      }));
  };

  const categoryDistribution = getCategoryDistribution();

  // Macro distribution for pie chart
  const getMacroDistribution = () => {
    if (todayTotals.carbs === 0 && todayTotals.protein === 0 && todayTotals.fat === 0) {
      return [];
    }

    return [
      { name: 'Carbs', value: todayTotals.carbs, color: '#3b82f6' },
      { name: 'Protein', value: todayTotals.protein, color: '#10b981' },
      { name: 'Fat', value: todayTotals.fat, color: '#f59e0b' }
    ];
  };

  const macroDistribution = getMacroDistribution();

  // Nutritional insights
  const getNutritionalInsights = () => {
    const insights = [];

    // Protein intake
    if (todayTotals.protein < 50) {
      insights.push({
        type: 'warning',
        message: 'Low protein intake. Aim for 50-100g daily for muscle maintenance.',
        icon: '⚠️'
      });
    } else if (todayTotals.protein >= 50 && todayTotals.protein <= 100) {
      insights.push({
        type: 'success',
        message: 'Good protein intake! You\'re meeting your daily needs.',
        icon: '✅'
      });
    }

    // Sugar intake
    if (todayTotals.sugar > 50) {
      insights.push({
        type: 'danger',
        message: 'High sugar intake! Try to limit to under 50g per day.',
        icon: '🚫'
      });
    }

    // Balanced diet
    const hasVeggies = foodHistory.some(e => e.date === new Date().toISOString().split('T')[0] && e.category === 'vegetables');
    const hasFruits = foodHistory.some(e => e.date === new Date().toISOString().split('T')[0] && e.category === 'fruits');
    
    if (hasVeggies && hasFruits) {
      insights.push({
        type: 'success',
        message: 'Great! You\'re including fruits and vegetables in your diet.',
        icon: '🌟'
      });
    }

    // Junk food warning
    const junkCount = foodHistory.filter(e => 
      e.date === new Date().toISOString().split('T')[0] && e.category === 'junk'
    ).length;
    
    if (junkCount > 2) {
      insights.push({
        type: 'warning',
        message: 'Too much junk food today. Try healthier alternatives.',
        icon: '⚠️'
      });
    }

    return insights;
  };

  const insights = getNutritionalInsights();

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl text-slate-800 dark:text-white mb-1">Food Log</h1>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Track your meals and nutrition
        </p>
      </motion.div>

      {/* Log Food */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-3xl backdrop-blur-2xl bg-gradient-to-br from-white/70 via-white/50 to-white/30 dark:from-slate-800/70 dark:via-slate-800/50 dark:to-slate-800/30 border border-white/20 dark:border-slate-700/50 p-8 shadow-2xl"
      >
        <h3 className="text-xl text-slate-800 dark:text-white mb-6">Log New Food</h3>

        {/* Category Selection */}
        <div className="space-y-4 mb-6">
          <Label>Food Category</Label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {foodCategories.map(category => (
              <Button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                variant={selectedCategory === category.id ? 'default' : 'outline'}
                className={`rounded-2xl p-6 h-auto flex flex-col items-center gap-2 ${
                  selectedCategory === category.id
                    ? `bg-gradient-to-br ${category.color} text-white border-0`
                    : 'backdrop-blur-xl bg-white/50 dark:bg-slate-800/50 border border-white/30 dark:border-slate-700/30'
                }`}
              >
                <span className="text-3xl">{category.emoji}</span>
                <span className="text-xs">{category.name}</span>
              </Button>
            ))}
          </div>
        </div>

        {/* Food Details */}
        <div className="space-y-4 mb-6">
          <div>
            <Label htmlFor="food-name">Food Name</Label>
            <Input
              id="food-name"
              value={foodName}
              onChange={(e) => setFoodName(e.target.value)}
              placeholder="e.g., Grilled Chicken Salad"
              className="rounded-2xl backdrop-blur-xl bg-white/50 dark:bg-slate-800/50 border border-white/30 dark:border-slate-700/30 placeholder:text-slate-400/50"
            />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div>
              <Label htmlFor="carbs" className="text-xs">Carbs (g)</Label>
              <Input
                id="carbs"
                type="number"
                value={carbs}
                onChange={(e) => setCarbs(e.target.value)}
                placeholder="0"
                className="rounded-2xl backdrop-blur-xl bg-white/50 dark:bg-slate-800/50 border border-white/30 dark:border-slate-700/30 placeholder:text-slate-400/50"
              />
            </div>

            <div>
              <Label htmlFor="protein" className="text-xs">Protein (g)</Label>
              <Input
                id="protein"
                type="number"
                value={protein}
                onChange={(e) => setProtein(e.target.value)}
                placeholder="0"
                className="rounded-2xl backdrop-blur-xl bg-white/50 dark:bg-slate-800/50 border border-white/30 dark:border-slate-700/30 placeholder:text-slate-400/50"
              />
            </div>

            <div>
              <Label htmlFor="fat" className="text-xs">Fat (g)</Label>
              <Input
                id="fat"
                type="number"
                value={fat}
                onChange={(e) => setFat(e.target.value)}
                placeholder="0"
                className="rounded-2xl backdrop-blur-xl bg-white/50 dark:bg-slate-800/50 border border-white/30 dark:border-slate-700/30 placeholder:text-slate-400/50"
              />
            </div>

            <div>
              <Label htmlFor="sugar" className="text-xs">Sugar (g)</Label>
              <Input
                id="sugar"
                type="number"
                value={sugar}
                onChange={(e) => setSugar(e.target.value)}
                placeholder="0"
                className="rounded-2xl backdrop-blur-xl bg-white/50 dark:bg-slate-800/50 border border-white/30 dark:border-slate-700/30 placeholder:text-slate-400/50"
              />
            </div>

            <div>
              <Label htmlFor="calories" className="text-xs">Calories</Label>
              <Input
                id="calories"
                type="number"
                value={calories}
                onChange={(e) => setCalories(e.target.value)}
                placeholder="0"
                className="rounded-2xl backdrop-blur-xl bg-white/50 dark:bg-slate-800/50 border border-white/30 dark:border-slate-700/30 placeholder:text-slate-400/50"
              />
            </div>
          </div>
        </div>

        <Button
          onClick={handleLogFood}
          className="w-full rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 text-white hover:from-orange-600 hover:to-amber-600"
        >
          <Plus className="w-4 h-4 mr-2" />
          Log Food
        </Button>
      </motion.div>

      {/* Today's Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="rounded-3xl backdrop-blur-2xl bg-gradient-to-br from-white/70 via-white/50 to-white/30 dark:from-slate-800/70 dark:via-slate-800/50 dark:to-slate-800/30 border border-white/20 dark:border-slate-700/50 p-8 shadow-2xl"
      >
        <h3 className="text-xl text-slate-800 dark:text-white mb-6">Today's Nutrition</h3>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          <div className="p-4 rounded-2xl bg-blue-500/10 border border-blue-500/20">
            <div className="text-xs text-slate-600 dark:text-slate-400 mb-1">Carbs</div>
            <div className="text-2xl text-blue-600 dark:text-blue-400">{todayTotals.carbs.toFixed(1)}g</div>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
            <div className="text-xs text-slate-600 dark:text-slate-400 mb-1">Protein</div>
            <div className="text-2xl text-emerald-600 dark:text-emerald-400">{todayTotals.protein.toFixed(1)}g</div>
          </div>

          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20">
            <div className="text-xs text-slate-600 dark:text-slate-400 mb-1">Fat</div>
            <div className="text-2xl text-amber-600 dark:text-amber-400">{todayTotals.fat.toFixed(1)}g</div>
          </div>

          <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20">
            <div className="text-xs text-slate-600 dark:text-slate-400 mb-1">Sugar</div>
            <div className="text-2xl text-red-600 dark:text-red-400">{todayTotals.sugar.toFixed(1)}g</div>
          </div>

          <div className="p-4 rounded-2xl bg-violet-500/10 border border-violet-500/20">
            <div className="text-xs text-slate-600 dark:text-slate-400 mb-1">Calories</div>
            <div className="text-2xl text-violet-600 dark:text-violet-400">{todayTotals.calories.toFixed(0)}</div>
          </div>
        </div>

        {macroDistribution.length > 0 && (
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={macroDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {macroDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </motion.div>

      {/* Insights */}
      {insights.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-3"
        >
          {insights.map((insight, index) => (
            <div
              key={index}
              className={`p-4 rounded-2xl backdrop-blur-xl border ${
                insight.type === 'success'
                  ? 'bg-emerald-500/10 border-emerald-500/20'
                  : insight.type === 'warning'
                  ? 'bg-amber-500/10 border-amber-500/20'
                  : 'bg-red-500/10 border-red-500/20'
              }`}
            >
              <div className="flex items-start gap-3">
                <span className="text-2xl">{insight.icon}</span>
                <p className="text-sm text-slate-700 dark:text-slate-200">{insight.message}</p>
              </div>
            </div>
          ))}
        </motion.div>
      )}

      {/* Today's Meals */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="rounded-3xl backdrop-blur-2xl bg-gradient-to-br from-white/70 via-white/50 to-white/30 dark:from-slate-800/70 dark:via-slate-800/50 dark:to-slate-800/30 border border-white/20 dark:border-slate-700/50 p-8 shadow-2xl"
      >
        <h3 className="text-xl text-slate-800 dark:text-white mb-6">Today's Meals</h3>

        {todayTotals.count === 0 ? (
          <p className="text-center text-slate-500 dark:text-slate-400 py-8">
            No meals logged today. Start tracking your nutrition!
          </p>
        ) : (
          <div className="space-y-3">
            {foodHistory
              .filter(entry => entry.date === new Date().toISOString().split('T')[0])
              .map(entry => {
                const category = foodCategories.find(c => c.id === entry.category);
                return (
                  <div
                    key={entry.id}
                    className="p-4 rounded-2xl bg-white/50 dark:bg-slate-700/50 border border-white/30 dark:border-slate-600/30 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{category?.emoji}</span>
                      <div>
                        <div className="text-sm text-slate-800 dark:text-white">{entry.name}</div>
                        <div className="text-xs text-slate-500 dark:text-slate-400">
                          {new Date(entry.timestamp).toLocaleTimeString()} • {category?.name}
                        </div>
                        <div className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                          C: {entry.nutrition.carbs}g | P: {entry.nutrition.protein}g | F: {entry.nutrition.fat}g | {entry.nutrition.calories} cal
                        </div>
                      </div>
                    </div>
                    <Button
                      onClick={() => handleDelete(entry.id)}
                      variant="ghost"
                      size="icon"
                      className="rounded-xl"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                );
              })}
          </div>
        )}
      </motion.div>

      {/* Recommendations */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="rounded-3xl backdrop-blur-2xl bg-gradient-to-br from-orange-500/10 via-amber-500/10 to-orange-500/10 border border-orange-500/20 p-6"
      >
        <h4 className="text-sm text-slate-700 dark:text-slate-200 mb-4">🍽️ Nutrition Recommendations</h4>
        <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
          <li>• <strong>Balanced macros:</strong> Aim for 45-65% carbs, 10-35% protein, 20-35% fat</li>
          <li>• <strong>Protein:</strong> 50-100g daily for muscle maintenance and satiety</li>
          <li>• <strong>Limit sugar:</strong> Keep added sugars under 50g (ideally 25g) per day</li>
          <li>• <strong>Fruits & vegetables:</strong> Aim for 5-9 servings daily for vitamins and fiber</li>
          <li>• <strong>Hydration:</strong> Drink 2-3L of water daily, more with exercise</li>
          <li>• <strong>Meal timing:</strong> Eat every 3-4 hours to maintain energy levels</li>
          <li>• <strong>Portion control:</strong> Use smaller plates, eat slowly, listen to hunger cues</li>
        </ul>
      </motion.div>
    </div>
  );
}
