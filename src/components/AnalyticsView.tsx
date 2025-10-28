import { motion } from 'motion/react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, Droplet, Brain, Coffee } from 'lucide-react';
import { AnalyticsData } from '../types';

interface AnalyticsViewProps {
  data: AnalyticsData[];
}

export function AnalyticsView({ data }: AnalyticsViewProps) {
  const bestFocusDay = data.reduce((max, day) => (day.focusHours > max.focusHours ? day : max), data[0]);
  const avgHydration = (data.reduce((sum, day) => sum + day.hydration, 0) / data.length).toFixed(1);
  const totalBreaks = data.reduce((sum, day) => sum + day.breaks, 0);

  const insights = [
    {
      icon: Brain,
      title: 'Best Focus Day',
      value: bestFocusDay.date,
      detail: `${bestFocusDay.focusHours} hours`,
      color: 'from-purple-400 to-indigo-500',
    },
    {
      icon: Droplet,
      title: 'Hydration Average',
      value: `${avgHydration}L`,
      detail: 'per day',
      color: 'from-blue-400 to-cyan-500',
    },
    {
      icon: Coffee,
      title: 'Total Breaks',
      value: totalBreaks,
      detail: 'this week',
      color: 'from-orange-400 to-pink-500',
    },
  ];

  return (
    <div className="space-y-6 pb-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center justify-between mb-6">
          <h2>Your Wellness Trends</h2>
          <select className="px-4 py-2 rounded-2xl border border-border bg-card text-sm shadow-sm">
            <option>This Week</option>
            <option>This Month</option>
            <option>Last 3 Months</option>
          </select>
        </div>
      </motion.div>

      {/* Insight Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {insights.map((insight, index) => {
          const Icon = insight.icon;
          return (
            <motion.div
              key={insight.title}
              className="bg-card rounded-2xl p-5 shadow-sm border border-border"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 + index * 0.1 }}
            >
              <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${insight.color} flex items-center justify-center mb-3 shadow-sm`}>
                <Icon className="w-6 h-6 text-white" />
              </div>
              <div className="text-sm text-muted-foreground mb-1">{insight.title}</div>
              <div className="text-2xl mb-1">{insight.value}</div>
              <div className="text-sm text-muted-foreground/70">{insight.detail}</div>
            </motion.div>
          );
        })}
      </div>

      {/* Line Chart - Weekly Trends */}
      <motion.div
        className="bg-card rounded-3xl p-6 shadow-sm border border-border"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <h3 className="mb-6">Weekly Activity Trends</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="date" stroke="#999" />
            <YAxis stroke="#999" />
            <Tooltip
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e5e5e5',
                borderRadius: '8px',
                padding: '12px',
              }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="hydration"
              stroke="#4299e1"
              strokeWidth={3}
              dot={{ fill: '#4299e1', r: 5 }}
              activeDot={{ r: 7 }}
              name="Hydration (L)"
            />
            <Line
              type="monotone"
              dataKey="focusHours"
              stroke="#9f7aea"
              strokeWidth={3}
              dot={{ fill: '#9f7aea', r: 5 }}
              activeDot={{ r: 7 }}
              name="Focus (hrs)"
            />
            <Line
              type="monotone"
              dataKey="breaks"
              stroke="#f6ad55"
              strokeWidth={3}
              dot={{ fill: '#f6ad55', r: 5 }}
              activeDot={{ r: 7 }}
              name="Breaks"
            />
          </LineChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Bar Chart - Daily Breakdown */}
      <motion.div
        className="bg-card rounded-3xl p-6 shadow-sm border border-border"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <h3 className="mb-6">Daily Breakdown</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="date" stroke="#999" />
            <YAxis stroke="#999" />
            <Tooltip
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e5e5e5',
                borderRadius: '8px',
                padding: '12px',
              }}
            />
            <Legend />
            <Bar dataKey="focusHours" fill="#9f7aea" radius={[8, 8, 0, 0]} name="Focus Hours" />
            <Bar dataKey="breaks" fill="#f6ad55" radius={[8, 8, 0, 0]} name="Breaks" />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Correlation Insights */}
      <motion.div
        className="bg-gradient-to-br from-[var(--mint)]/20 to-[var(--purple)]/10 rounded-3xl p-6 border border-border/50"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-2xl bg-card flex items-center justify-center flex-shrink-0 border border-border shadow-sm">
            <TrendingUp className="w-5 h-5 text-[var(--teal)]" />
          </div>
          <div>
            <h4 className="mb-1">Insight</h4>
            <p className="text-muted-foreground">
              Your best focus days correlate with 8+ hours of sleep and consistent hydration. 
              Keep maintaining your {bestFocusDay.date} routine!
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
