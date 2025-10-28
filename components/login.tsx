import { motion } from 'motion/react';
import { Mail, Lock, ArrowRight } from 'lucide-react';
import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';

interface LoginProps {
  onLogin: () => void;
  onSwitchToSignup: () => void;
}

export function Login({ onLogin, onSwitchToSignup }: LoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Reset errors
    setEmailError('');
    setPasswordError('');

    let isValid = true;

    // Validate email
    if (!email) {
      setEmailError('Email is required');
      isValid = false;
    } else if (!validateEmail(email)) {
      setEmailError('Please enter a valid email address');
      isValid = false;
    }

    // Validate password
    if (!password) {
      setPasswordError('Password is required');
      isValid = false;
    } else if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      isValid = false;
    }

    if (isValid) {
      // Here you would typically make an API call to authenticate
      // For now, we'll just call the onLogin callback
      onLogin();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden bg-gradient-to-br from-violet-50 via-indigo-50 to-blue-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      {/* Animated Moving Gradient Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Primary Violet Orb */}
        <motion.div
          className="absolute w-[600px] h-[600px] rounded-full opacity-60"
          style={{
            background: 'radial-gradient(circle, rgba(139, 92, 246, 0.4) 0%, rgba(124, 58, 237, 0.2) 50%, transparent 70%)',
          }}
          animate={{
            x: [0, 150, -100, 0],
            y: [0, -150, 100, 0],
            scale: [1, 1.3, 0.9, 1],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          style={{ top: '-10%', left: '-5%' }}
        />
        
        {/* Secondary Indigo Orb */}
        <motion.div
          className="absolute w-[500px] h-[500px] rounded-full opacity-50"
          style={{
            background: 'radial-gradient(circle, rgba(99, 102, 241, 0.4) 0%, rgba(79, 70, 229, 0.2) 50%, transparent 70%)',
          }}
          animate={{
            x: [0, -120, 80, 0],
            y: [0, 120, -80, 0],
            scale: [1, 1.2, 1.1, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
          style={{ top: '50%', right: '-10%' }}
        />
        
        {/* Tertiary Blue Orb */}
        <motion.div
          className="absolute w-[450px] h-[450px] rounded-full opacity-40"
          style={{
            background: 'radial-gradient(circle, rgba(59, 130, 246, 0.3) 0%, rgba(37, 99, 235, 0.15) 50%, transparent 70%)',
          }}
          animate={{
            x: [0, 100, -50, 0],
            y: [0, -80, 120, 0],
            scale: [1, 1.15, 1.25, 1],
          }}
          transition={{
            duration: 22,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
          style={{ bottom: '-5%', left: '20%' }}
        />

        {/* Accent Purple Orb */}
        <motion.div
          className="absolute w-[400px] h-[400px] rounded-full opacity-30"
          style={{
            background: 'radial-gradient(circle, rgba(168, 85, 247, 0.3) 0%, rgba(147, 51, 234, 0.15) 50%, transparent 70%)',
          }}
          animate={{
            x: [0, -60, 90, 0],
            y: [0, 100, -70, 0],
            scale: [1, 1.2, 0.95, 1],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.5
          }}
          style={{ top: '30%', left: '40%' }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full relative z-10"
      >
        <div className="rounded-3xl backdrop-blur-3xl bg-gradient-to-br from-white/80 via-white/60 to-white/40 dark:from-slate-800/80 dark:via-slate-800/60 dark:to-slate-800/40 border-2 border-white/40 dark:border-slate-700/60 p-10 shadow-[0_20px_60px_rgba(139,92,246,0.3)] dark:shadow-[0_20px_60px_rgba(139,92,246,0.5)]">
          
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-center mb-8"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 via-purple-500 to-indigo-500 mb-4">
              <Lock className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl bg-gradient-to-br from-violet-600 via-indigo-600 to-blue-600 bg-clip-text text-transparent mb-2">
              Welcome Back
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              Log in to access your digital twin
            </p>
          </motion.div>

          {/* Form */}
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            onSubmit={handleSubmit}
            className="space-y-5"
          >
            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-slate-700 dark:text-slate-200">
                Email Address
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`pl-10 rounded-xl backdrop-blur-xl bg-white/50 dark:bg-slate-700/50 border ${
                    emailError ? 'border-red-400' : 'border-white/30 dark:border-slate-600/30'
                  } focus:border-violet-500 dark:focus:border-violet-400 text-slate-800 dark:text-white`}
                />
              </div>
              {emailError && (
                <p className="text-xs text-red-500 dark:text-red-400">{emailError}</p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-slate-700 dark:text-slate-200">
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`pl-10 rounded-xl backdrop-blur-xl bg-white/50 dark:bg-slate-700/50 border ${
                    passwordError ? 'border-red-400' : 'border-white/30 dark:border-slate-600/30'
                  } focus:border-violet-500 dark:focus:border-violet-400 text-slate-800 dark:text-white`}
                />
              </div>
              {passwordError && (
                <p className="text-xs text-red-500 dark:text-red-400">{passwordError}</p>
              )}
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full py-6 rounded-xl bg-gradient-to-r from-violet-600 via-indigo-600 to-blue-600 hover:from-violet-500 hover:via-indigo-500 hover:to-blue-500 text-white shadow-lg shadow-violet-500/30 hover:shadow-xl hover:shadow-violet-500/40 transition-all duration-300 group"
            >
              Log In
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>

            {/* Forgot Password */}
            <div className="text-center">
              <button
                type="button"
                className="text-sm text-violet-600 dark:text-violet-400 hover:text-violet-700 dark:hover:text-violet-300 transition-colors"
              >
                Forgot password?
              </button>
            </div>
          </motion.form>

          {/* Switch to Signup */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-8 text-center"
          >
            <p className="text-sm text-slate-600 dark:text-slate-300">
              Don't have an account?{' '}
              <button
                onClick={onSwitchToSignup}
                className="text-violet-600 dark:text-violet-400 hover:text-violet-700 dark:hover:text-violet-300 transition-colors"
              >
                Sign up
              </button>
            </p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
