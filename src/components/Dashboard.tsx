import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { HealthScore } from "./health-score";
import { HabitHeatmap } from "./habit-heatmap";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import { Sparkles, TrendingUp, AlertCircle } from "lucide-react";
import { BASE_URL } from "../constants/API";

export function Dashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const User = JSON.parse(localStorage.getItem('user') || '{}');


  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/user/health/${User.id}`);
        if (!res.ok) throw new Error(`HTTP error ${res.status}`);
        const json = await res.json();
        setData(json);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);


  if (loading)
    return (
      <div className="flex items-center justify-center h-full text-slate-500">
        Loading dashboard...
      </div>
    );

  if (error)
    return (
      <div className="flex items-center justify-center h-full text-red-500">
        {error}
      </div>
    );

  if (!data)
    return (
      <div className="flex items-center justify-center h-full text-slate-500">
        No data available.
      </div>
    );

  // ✅ Use safe fallback destructuring
  const user = data.user || {
    today: { focusHours: 0, waterGlasses: 0, sleepHours: 0, breaks: 0 },
  };
  const weekly = data.weekly || {
    hydration: [],
    focus: [],
    sleep: [],
    screenTime: [],
  };
  const feedback = Array.isArray(data.feedback) ? data.feedback : [];

  return (
    <div className="space-y-6 pb-8">
      {/* Today's Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-3xl backdrop-blur-2xl bg-gradient-to-br from-white/70 via-white/50 to-white/30 dark:from-slate-800/70 dark:via-slate-800/50 dark:to-slate-800/30 border border-white/20 dark:border-slate-700/50 p-8 shadow-2xl"
      >
        <div className="flex items-start justify-between mb-8">
          <div>
            <h2 className="text-2xl text-slate-800 dark:text-white mb-2">
              Today's Overview
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {new Date().toLocaleDateString("en-IN", {
                weekday: "long",
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </p>
          </div>
          <div className="px-4 py-2 rounded-2xl backdrop-blur-xl bg-gradient-to-r from-violet-500/20 to-purple-500/20 border border-violet-500/30">
            <span className="text-sm text-violet-700 dark:text-violet-300">
              Week {getWeekNumber(new Date())}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="flex flex-col items-center justify-center">
            <HealthScore score={data.healthScore} />
            <p className="mt-6 text-sm text-slate-600 dark:text-slate-300 text-center max-w-xs">
              Your overall wellness score based on focus, hydration, sleep, and
              activity balance.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {[
              {
                label: "Focus Hours",
                value: user.averages?.focus ?? 0,
                unit: "h",
                color: "violet",
                target: "6h goal",
              },
              {
                label: "Hydration",
                value: user.today?.waterGlasses ?? 0,
                unit: "/8",
                color: "blue",
                target: "8 glasses",
              },
              {
                label: "Sleep",
                value: data.averages.sleep ?? 0,
                unit: "h",
                color: "indigo",
                target: "8h goal",
              },
              {
                label: "Breaks Taken",
                value: user.today?.breaks ?? 0,
                unit: "",
                color: "amber",
                target: "5 target",
              },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="p-5 rounded-2xl backdrop-blur-xl bg-gradient-to-br from-white/60 to-white/30 dark:from-slate-700/60 dark:to-slate-700/30 border border-white/30 dark:border-slate-600/30"
              >
                <div className="text-xs text-slate-500 dark:text-slate-400 mb-2">
                  {stat.label}
                </div>
                <div
                  className={`text-3xl bg-gradient-to-br from-${stat.color}-600 to-${stat.color}-400 bg-clip-text text-transparent mb-1`}
                >
                  {stat.value}
                  {stat.unit}
                </div>
                <div className="text-xs text-slate-400 dark:text-slate-500">
                  {stat.target}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard
          title="Weekly Hydration"
          gradientId="hydrationGradient"
          color1="#3b82f6"
          color2="#06b6d4"
          data={weekly.hydration}
          dataKey="glasses"
        />
        <ChartCard
          title="Weekly Focus Hours"
          gradientId="focusGradient"
          color1="#8b5cf6"
          color2="#6366f1"
          data={weekly.focus}
          dataKey="hours"
        />
        <ChartCard
          title="Sleep Duration"
          gradientId="sleepGradient"
          color1="#6366f1"
          color2="#3b82f6"
          data={weekly.sleep}
          dataKey="hours"
        />
        <ChartCard
          title="Screen Time"
          gradientId="screenGradient"
          color1="#f59e0b"
          color2="#f97316"
          data={weekly.screenTime}
          dataKey="hours"
        />
      </div>

      {/* Feedback Section */}
      {feedback.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="rounded-3xl backdrop-blur-2xl bg-gradient-to-br from-white/70 via-white/50 to-white/30 dark:from-slate-800/70 dark:via-slate-800/50 dark:to-slate-800/30 border border-white/20 dark:border-slate-700/50 p-8 shadow-2xl"
        >
          <div className="flex items-center gap-2 mb-6">
            <Sparkles className="w-5 h-5 text-violet-500" />
            <h3 className="text-xl text-slate-800 dark:text-white">
              Twin Insights
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {feedback.map((f: any, index: number) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.7 + index * 0.1 }}
                className="p-5 rounded-2xl backdrop-blur-xl bg-gradient-to-br from-white/60 to-white/30 dark:from-slate-700/60 dark:to-slate-700/30 border border-white/30 dark:border-slate-600/30 flex items-start gap-3"
              >
                {f.type === "positive" && (
                  <TrendingUp className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                )}
                {f.type === "suggestion" && (
                  <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                )}
                {f.type === "neutral" && (
                  <Sparkles className="w-5 h-5 text-violet-500 flex-shrink-0 mt-0.5" />
                )}
                <p className="text-sm text-slate-700 dark:text-slate-200">
                  {data.feedback.message}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}

// Helper: week number
function getWeekNumber(date: Date) {
  const oneJan = new Date(date.getFullYear(), 0, 1);
  const numberOfDays = Math.floor(
    (date.getTime() - oneJan.getTime()) / (24 * 60 * 60 * 1000)
  );
  return Math.ceil((date.getDay() + 1 + numberOfDays) / 7);
}

// ChartCard (same as before)
function ChartCard({ title, gradientId, color1, color2, data, dataKey }: any) {
  if (!data || !Array.isArray(data)) return null;
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="rounded-3xl backdrop-blur-2xl bg-gradient-to-br from-white/70 via-white/50 to-white/30 dark:from-slate-800/70 dark:via-slate-800/50 dark:to-slate-800/30 border border-white/20 dark:border-slate-700/50 p-6 shadow-2xl"
    >
      <h4 className="text-sm text-slate-600 dark:text-slate-300 mb-4">
        {title}
      </h4>
      <ResponsiveContainer width="100%" height={200}>
        {dataKey === "glasses" ? (
          <BarChart data={data}>
            <defs>
              <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={color1} stopOpacity={0.8} />
                <stop offset="100%" stopColor={color2} stopOpacity={0.3} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.3} />
            <XAxis dataKey="day" stroke="#94a3b8" fontSize={12} />
            <YAxis stroke="#94a3b8" fontSize={12} />
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(255,255,255,0.9)",
                border: "none",
                borderRadius: "12px",
                backdropFilter: "blur(10px)",
              }}
            />
            <Bar dataKey={dataKey} fill={`url(#${gradientId})`} radius={[8, 8, 0, 0]} />
          </BarChart>
        ) : (
          <AreaChart data={data}>
            <defs>
              <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={color1} stopOpacity={0.8} />
                <stop offset="100%" stopColor={color2} stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.3} />
            <XAxis dataKey="day" stroke="#94a3b8" fontSize={12} />
            <YAxis stroke="#94a3b8" fontSize={12} />
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(255,255,255,0.9)",
                border: "none",
                borderRadius: "12px",
                backdropFilter: "blur(10px)",
              }}
            />
            <Area
              type="monotone"
              dataKey={dataKey}
              stroke={color1}
              strokeWidth={2}
              fill={`url(#${gradientId})`}
            />
          </AreaChart>
        )}
      </ResponsiveContainer>
    </motion.div>
  );
}
