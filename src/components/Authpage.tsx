import { useState } from 'react';
import { motion } from 'motion/react';
import { Lock, UserPlus, LogIn } from 'lucide-react';
import { Button } from './ui/button';
import { toast } from 'sonner';
import { BASE_URL } from '../constants/API';

interface AuthPageProps {
    onAuth: (type: 'login' | 'signup', user?: any) => void;
}

export function AuthPage({ onAuth }: AuthPageProps) {
    const [isSignUp, setIsSignUp] = useState(false);
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({
        name: '',
        email: '',
        password: '',
        confirm: '',
        dob: '',
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (isSignUp && form.password !== form.confirm) {
            toast.error('Passwords do not match');
            return;
        }

        setLoading(true);
        try {
            if (isSignUp) {
                // calculate age from DOB
                const birthDate = new Date(form.dob);
                const today = new Date();
                let age = today.getFullYear() - birthDate.getFullYear();
                const m = today.getMonth() - birthDate.getMonth();
                if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
                    age--;
                }

                // signup request
                const res = await fetch(`${BASE_URL}/api/signup`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        name: form.name,
                        email: form.email,
                        password: form.password,
                        age,
                    }),
                });

                const data = await res.json();
                if (!res.ok) throw new Error(data.message || 'Signup failed');

                toast.success('Welcome! Let’s set up your TwinSync profile.');
                onAuth('signup', data.user); // 👈 go straight to onboarding instead of login
            }

            else {
                // login request
                const res = await fetch(`${BASE_URL}/api/login`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        email: form.email,
                        password: form.password,
                    }),
                });

                const data = await res.json();
                if (!res.ok) throw new Error(data.message || 'Login failed');

                toast.success('Login successful!');
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));
                onAuth('login', data.user);
            }
        } catch (err: any) {
            toast.error(err.message || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-violet-50 via-indigo-50 to-blue-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                className="w-full max-w-md rounded-3xl border border-white/20 dark:border-slate-700/50 backdrop-blur-2xl bg-white/70 dark:bg-slate-800/70 shadow-2xl p-8 sm:p-10"
            >
                {/* Header */}
                <div className="text-center mb-8">
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-violet-500 via-purple-500 to-indigo-500 flex items-center justify-center"
                    >
                        <Lock className="text-white w-8 h-8" />
                    </motion.div>

                    <h1 className="text-2xl font-semibold bg-gradient-to-r from-violet-600 via-indigo-600 to-blue-600 bg-clip-text text-transparent">
                        {isSignUp ? 'Create Account' : 'Welcome Back'}
                    </h1>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                        {isSignUp
                            ? 'Join TwinSync and meet your digital twin'
                            : 'Sign in to continue your journey'}
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-5">
                    {isSignUp && (
                        <div className="grid sm:grid-cols-2 gap-4">
                            <div className="sm:col-span-2">
                                <label className="block text-sm text-slate-700 dark:text-slate-300 mb-1">
                                    Full Name
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={form.name}
                                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                                    placeholder="Enter your full name"
                                    className="w-full px-4 py-3 rounded-xl border border-slate-300/50 dark:border-slate-700/50 bg-white/80 dark:bg-slate-800/70 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-400 transition-all"
                                />
                            </div>

                            <div>
                                <label className="block text-sm text-slate-700 dark:text-slate-300 mb-1">
                                    Date of Birth
                                </label>
                                <input
                                    type="date"
                                    required
                                    value={form.dob}
                                    onChange={(e) => setForm({ ...form, dob: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl border border-slate-300/50 dark:border-slate-700/50 bg-white/80 dark:bg-slate-800/70 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-400 transition-all"
                                />
                            </div>
                        </div>
                    )}

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm text-slate-700 dark:text-slate-300 mb-1">
                                Email
                            </label>
                            <input
                                type="email"
                                required
                                value={form.email}
                                onChange={(e) => setForm({ ...form, email: e.target.value })}
                                placeholder="example@email.com"
                                className="w-full px-4 py-3 rounded-xl border border-slate-300/50 dark:border-slate-700/50 bg-white/80 dark:bg-slate-800/70 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-400 transition-all"
                            />
                        </div>

                        <div className="grid sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm text-slate-700 dark:text-slate-300 mb-1">
                                    Password
                                </label>
                                <input
                                    type="password"
                                    required
                                    value={form.password}
                                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                                    placeholder="Enter your password"
                                    className="w-full px-4 py-3 rounded-xl border border-slate-300/50 dark:border-slate-700/50 bg-white/80 dark:bg-slate-800/70 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-400 transition-all"
                                />
                            </div>

                            {isSignUp && (
                                <div>
                                    <label className="block text-sm text-slate-700 dark:text-slate-300 mb-1">
                                        Confirm
                                    </label>
                                    <input
                                        type="password"
                                        required
                                        value={form.confirm}
                                        onChange={(e) => setForm({ ...form, confirm: e.target.value })}
                                        placeholder="Confirm password"
                                        className="w-full px-4 py-3 rounded-xl border border-slate-300/50 dark:border-slate-700/50 bg-white/80 dark:bg-slate-800/70 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-400 transition-all"
                                    />
                                </div>
                            )}
                        </div>
                    </div>

                    <Button
                        type="submit"
                        disabled={loading}
                        className="w-full mt-2 py-4 rounded-2xl bg-gradient-to-r from-violet-600 via-indigo-600 to-blue-600 hover:from-violet-500 hover:via-indigo-500 hover:to-blue-500 text-white text-lg shadow-lg shadow-violet-500/30 transition-all duration-300 disabled:opacity-60"
                    >
                        {loading ? (
                            'Please wait…'
                        ) : isSignUp ? (
                            <>
                                <UserPlus className="w-4 h-4 mr-2" /> Sign Up
                            </>
                        ) : (
                            <>
                                <LogIn className="w-4 h-4 mr-2" /> Sign In
                            </>
                        )}
                    </Button>
                </form>

                {/* Toggle */}
                <div className="text-center mt-6">
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                        {isSignUp ? 'Already have an account?' : "Don’t have an account?"}
                        <button
                            type="button"
                            onClick={() => setIsSignUp(!isSignUp)}
                            className="ml-2 text-violet-600 hover:text-violet-500 font-medium transition-colors"
                        >
                            {isSignUp ? 'Sign In' : 'Sign Up'}
                        </button>
                    </p>
                </div>
            </motion.div>
        </div>
    );
}