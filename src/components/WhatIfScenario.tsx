import { useState } from 'react';
import { Card } from './ui/card';
import { Slider } from './ui/slider';
import { DigitalTwin } from './DigitalTwin';
import { HealthState } from '../types';
import { Droplet, Zap, Moon } from 'lucide-react';

export function WhatIfScenario() {
  const [hydration, setHydration] = useState(2.5);
  const [focus, setFocus] = useState(6);
  const [sleep, setSleep] = useState(7);

  // Calculate predicted health state based on inputs
  const calculateHealthState = (): HealthState => {
    const score = (hydration / 3) * 33 + (focus / 8) * 33 + (sleep / 8) * 34;
    if (score >= 75) return 'healthy';
    if (score >= 50) return 'neutral';
    return 'needs-attention';
  };

  const calculateScore = (): number => {
    return Math.round((hydration / 3) * 33 + (focus / 8) * 33 + (sleep / 8) * 34);
  };

  const healthState = calculateHealthState();
  const score = calculateScore();

  const getScoreColor = () => {
    if (score >= 75) return 'from-emerald-500 to-green-600';
    if (score >= 50) return 'from-cyan-500 to-blue-600';
    return 'from-orange-500 to-red-600';
  };

  return (
    <Card className="p-6 bg-gradient-to-br from-indigo-50 to-purple-50">
      <div className="space-y-6">
        <div>
          <h3 className="text-slate-800 mb-1">What If Scenario</h3>
          <p className="text-sm text-slate-600">
            Adjust your habits to see how your twin would respond
          </p>
        </div>

        {/* Twin Preview */}
        <div className="flex flex-col items-center gap-4 p-6 bg-white/50 rounded-xl">
          <DigitalTwin healthState={healthState} size="medium" />
          <div className="text-center">
            <div className={`inline-block bg-gradient-to-r ${getScoreColor()} bg-clip-text text-transparent`}>
              Predicted Score: {score}%
            </div>
            <p className="text-sm text-slate-600 mt-1">
              {healthState === 'healthy' && '✨ Excellent balance!'}
              {healthState === 'neutral' && '👌 Doing okay'}
              {healthState === 'needs-attention' && '⚠️ Needs improvement'}
            </p>
          </div>
        </div>

        {/* Sliders */}
        <div className="space-y-6">
          {/* Hydration */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Droplet className="w-4 h-4 text-cyan-600" />
                <span className="text-sm text-slate-700">Daily Hydration</span>
              </div>
              <span className="text-sm bg-cyan-100 text-cyan-700 px-2 py-1 rounded">
                {hydration.toFixed(1)}L
              </span>
            </div>
            <Slider
              value={[hydration]}
              onValueChange={(value) => setHydration(value[0])}
              min={0.5}
              max={4}
              step={0.1}
              className="w-full"
            />
          </div>

          {/* Focus Hours */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-purple-600" />
                <span className="text-sm text-slate-700">Focus Hours</span>
              </div>
              <span className="text-sm bg-purple-100 text-purple-700 px-2 py-1 rounded">
                {focus}h
              </span>
            </div>
            <Slider
              value={[focus]}
              onValueChange={(value) => setFocus(value[0])}
              min={0}
              max={12}
              step={0.5}
              className="w-full"
            />
          </div>

          {/* Sleep */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Moon className="w-4 h-4 text-indigo-600" />
                <span className="text-sm text-slate-700">Sleep Hours</span>
              </div>
              <span className="text-sm bg-indigo-100 text-indigo-700 px-2 py-1 rounded">
                {sleep}h
              </span>
            </div>
            <Slider
              value={[sleep]}
              onValueChange={(value) => setSleep(value[0])}
              min={4}
              max={12}
              step={0.5}
              className="w-full"
            />
          </div>
        </div>

        {/* Recommendations */}
        {healthState !== 'healthy' && (
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl">
            <p className="text-sm text-amber-800">
              💡 <strong>Tip:</strong>{' '}
              {score < 50
                ? 'Try increasing your hydration and getting more sleep for better wellness.'
                : 'Almost there! Small improvements in your habits can make a big difference.'}
            </p>
          </div>
        )}
      </div>
    </Card>
  );
}
