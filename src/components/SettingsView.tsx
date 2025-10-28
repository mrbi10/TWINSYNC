import { useState } from 'react';
import { motion } from 'motion/react';
import { Moon, Sun, Bell, Shield, AlertTriangle, ChevronRight } from 'lucide-react';
import { Switch } from './ui/switch';
import { Button } from './ui/button';
import { useTheme } from '../contexts/ThemeContext';

export function SettingsView() {
  const { theme, toggleTheme } = useTheme();
  const [notifications, setNotifications] = useState(true);
  const [breakReminders, setBreakReminders] = useState(true);
  const [hydrationReminders, setHydrationReminders] = useState(true);

  const settingSections = [
    {
      title: 'Appearance',
      items: [
        {
          icon: theme === 'dark' ? Moon : Sun,
          label: 'Dark Mode',
          description: 'Toggle dark theme',
          value: theme === 'dark',
          onChange: toggleTheme,
        },
      ],
    },
    {
      title: 'Notifications',
      items: [
        {
          icon: Bell,
          label: 'Enable Notifications',
          description: 'Receive wellness reminders',
          value: notifications,
          onChange: setNotifications,
        },
        {
          icon: Bell,
          label: 'Break Reminders',
          description: 'Every 2 hours',
          value: breakReminders,
          onChange: setBreakReminders,
          disabled: !notifications,
        },
        {
          icon: Bell,
          label: 'Hydration Reminders',
          description: 'Every hour',
          value: hydrationReminders,
          onChange: setHydrationReminders,
          disabled: !notifications,
        },
      ],
    },
  ];

  return (
    <div className="space-y-6 pb-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="mb-6">Settings & Privacy</h2>
      </motion.div>

      {/* Settings Sections */}
      {settingSections.map((section, sectionIndex) => (
        <motion.div
          key={section.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: sectionIndex * 0.1 }}
        >
          <h3 className="mb-3 px-1">{section.title}</h3>
          <div className="bg-card rounded-2xl shadow-sm overflow-hidden divide-y divide-border border border-border">
            {section.items.map((item, index) => {
              const Icon = item.icon;
              return (
                <div
                  key={index}
                  className={`p-4 flex items-center gap-4 ${item.disabled ? 'opacity-50' : ''}`}
                >
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[var(--mint)] to-[var(--purple)] flex items-center justify-center flex-shrink-0 shadow-sm">
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="mb-1">{item.label}</div>
                    <div className="text-sm text-muted-foreground">{item.description}</div>
                  </div>
                  <Switch
                    checked={item.value}
                    onCheckedChange={item.onChange}
                    disabled={item.disabled}
                  />
                </div>
              );
            })}
          </div>
        </motion.div>
      ))}

      {/* Privacy Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <h3 className="mb-3 px-1">Privacy & Security</h3>
        <div className="bg-card rounded-2xl shadow-sm overflow-hidden border border-border">
          <button className="w-full p-4 flex items-center gap-4 hover:bg-accent transition-colors">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[var(--focus-blue)] to-[var(--teal)] flex items-center justify-center flex-shrink-0 shadow-sm">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1 text-left">
              <div className="mb-1">Data Privacy</div>
              <div className="text-sm text-muted-foreground">Your data stays local on your device</div>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>
      </motion.div>

      {/* Emergency SOS */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <h3 className="mb-3 px-1">Emergency</h3>
        <Button
          variant="destructive"
          className="w-full h-14 text-white rounded-2xl"
          onClick={() => alert('Emergency services would be contacted in a real app')}
        >
          <AlertTriangle className="w-5 h-5 mr-2" />
          Emergency SOS
        </Button>
        <p className="text-sm text-muted-foreground mt-2 px-1">
          This button would contact emergency services and your designated contacts.
        </p>
      </motion.div>

      {/* App Info */}
      <motion.div
        className="bg-gradient-to-br from-[var(--mint)]/20 to-[var(--purple)]/10 rounded-2xl p-6 text-center border border-border/50"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <div className="text-4xl mb-2">🤝</div>
        <h3 className="mb-2">TwinSync</h3>
        <p className="text-sm text-muted-foreground mb-1">Your Wellness, Mirrored</p>
        <p className="text-xs text-muted-foreground">Version 1.0.0</p>
        <div className="mt-4 text-xs text-muted-foreground">
          Current Theme: <span className="capitalize">{theme}</span>
        </div>
      </motion.div>
    </div>
  );
}
