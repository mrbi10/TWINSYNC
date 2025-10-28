import { motion } from 'motion/react';
import { Mail, Lock, User, ArrowRight } from 'lucide-react';
import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';

interface SignupProps {
  onSignup: () => void;
  onSwitchToLogin: () => void;
}

export function Signup({ onSignup, onSwitchToLogin }: SignupProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Reset errors
    setNameError('');
    setEmailError('');
    setPasswordError('');
    setConfirmPasswordError('');

    let isValid = true;

    // Validate name
    if (!name) {
      setNameError('Name is required');
      isValid = false;
    } else if (name.length < 2) {
      setNameError('Name must be at least 2 characters');
      isValid = false;
    }

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

    // Validate confirm password
    if (!confirmPassword) {
      setConfirmPasswordError('Please confirm your password');
      isValid = false;
    } else if (password !== confirmPassword) {
      setConfirmPasswordError('Passwords do not match');
      isValid = false;
    }

    if (isValid) {
      // Here you would typically make an API call to create an account
      // For now, we'll just call the onSignup callback
      onSignup();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden bg-gradient-to-br from-violet-50 via-indigo-50 to-blue-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      {/* Animated Moving Gradient Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Primary Purple Orb */}
        <motion.div
          className="absolute w-[550px] h-[550px] rounded-full opacity-60"
          style={{
            background: 'radial-gradient(circle, rgba(168, 85, 247, 0.4) 0%, rgba(147, 51, 234, 0.2) 50%, transparent 70%)',
          }}
          animate={{
            x: [0, -140, 120, 0],
            y: [0, 130, -90, 0],
            scale: [1, 1.25, 1.1, 1],
          }}
          transition={{
            duration: 23,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          style={{ top: '0%', right: '-5%' }}
        />
        
        {/* Secondary Indigo Orb */}
        <motion.div
          className="absolute w-[500px] h-[500px] rounded-full opacity-50"
          style={{
            background: 'radial-gradient(circle, rgba(99, 102, 241, 0.4) 0%, rgba(79, 70, 229, 0.2) 50%, transparent 70%)',
          }}
          animate={{
            x: [0, 110, -70, 0],
            y: [0, -100, 90, 0],
            scale: [1, 1.2, 0.95, 1],
          }}
          transition={{
            duration: 19,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.5
          }}
          style={{ bottom: '10%', left: '5%' }}
        />
        
        {/* Tertiary Blue-Pink Orb */}
        <motion.div
          className="absolute w-[480px] h-[480px] rounded-full opacity-45"
          style={{
            background: 'radial-gradient(circle, rgba(236, 72, 153, 0.3) 0%, rgba(219, 39, 119, 0.15) 50%, transparent 70%)',
          }}
          animate={{
            x: [0, -80, 60, 0],
            y: [0, 70, -110, 0],
            scale: [1, 1.15, 1.3, 1],
          }}
          transition={{
            duration: 21,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1.5
          }}
          style={{ top: '40%', right: '20%' }}
        />

        {/* Accent Cyan Orb */}
        <motion.div
          className="absolute w-[420px] h-[420px] rounded-full opacity-35"
          style={{
            background: 'radial-gradient(circle, rgba(34, 211, 238, 0.3) 0%, rgba(6, 182, 212, 0.15) 50%, transparent 70%)',
          }}
          animate={{
            x: [0, 70, -90, 0],
            y: [0, -90, 80, 0],
            scale: [1, 1.3, 1.05, 1],
          }}
          transition={{
            duration: 17,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
          style={{ bottom: '20%', right: '40%' }}
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
              <User className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl bg-gradient-to-br from-violet-600 via-indigo-600 to-blue-600 bg-clip-text text-transparent mb-2">
              Create Account
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              Start your journey with your digital twin
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
            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="name" className="text-slate-700 dark:text-slate-200">
                Full Name
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={`pl-10 rounded-xl backdrop-blur-xl bg-white/50 dark:bg-slate-700/50 border ${
                    nameError ? 'border-red-400' : 'border-white/30 dark:border-slate-600/30'
                  } focus:border-violet-500 dark:focus:border-violet-400 text-slate-800 dark:text-white`}
                />
              </div>
              {nameError && (
                <p className="text-xs text-red-500 dark:text-red-400">{nameError}</p>
              )}
            </div>

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

            {/* Confirm Password */}
            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-slate-700 dark:text-slate-200">
                Confirm Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={`pl-10 rounded-xl backdrop-blur-xl bg-white/50 dark:bg-slate-700/50 border ${
                    confirmPasswordError ? 'border-red-400' : 'border-white/30 dark:border-slate-600/30'
                  } focus:border-violet-500 dark:focus:border-violet-400 text-slate-800 dark:text-white`}
                />
              </div>
              {confirmPasswordError && (
                <p className="text-xs text-red-500 dark:text-red-400">{confirmPasswordError}</p>
              )}
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full py-6 rounded-xl bg-gradient-to-r from-violet-600 via-indigo-600 to-blue-600 hover:from-violet-500 hover:via-indigo-500 hover:to-blue-500 text-white shadow-lg shadow-violet-500/30 hover:shadow-xl hover:shadow-violet-500/40 transition-all duration-300 group"
            >
              Create Account
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>

            {/* Terms */}
            <p className="text-xs text-center text-slate-500 dark:text-slate-400">
              By signing up, you agree to our{' '}
              <button type="button" className="text-violet-600 dark:text-violet-400 hover:underline">
                Terms
              </button>{' '}
              and{' '}
              <button type="button" className="text-violet-600 dark:text-violet-400 hover:underline">
                Privacy Policy
              </button>
            </p>
          </motion.form>

          {/* Switch to Login */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-8 text-center"
          >
            <p className="text-sm text-slate-600 dark:text-slate-300">
              Already have an account?{' '}
              <button
                onClick={onSwitchToLogin}
                className="text-violet-600 dark:text-violet-400 hover:text-violet-700 dark:hover:text-violet-300 transition-colors"
              >
                Log in
              </button>
            </p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
