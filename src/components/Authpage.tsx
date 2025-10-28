import React, { useState, useEffect } from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { Lock, UserPlus, LogIn } from 'lucide-react';
import { Button } from './ui/button';
import { toast } from 'sonner';
import { BASE_URL } from '../constants/API';

interface AuthPageProps {
    onAuth: (type: 'login' | 'signup', user?: any) => void;
}

export default function AuthPage({ onAuth }: AuthPageProps) {
    const [isSignUp, setIsSignUp] = useState(false);
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({
        name: '',
        email: '',
        password: '',
        confirm: '',
        dob: '',
    });

    // small parallax for the card based on mouse
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);
    const rotateY = useTransform(mouseX, [-200, 200], [10, -10]);
    const rotateX = useTransform(mouseY, [-200, 200], [-10, 10]);
    const lightPosX = useTransform(mouseX, [-200, 200], ['0%', '100%']);
    const lightPosY = useTransform(mouseY, [-200, 200], ['0%', '100%']);

    useEffect(() => {
        // reset transforms on unmount
        return () => {
            mouseX.set(0);
            mouseY.set(0);
        };
    }, []);

    const handleMouse = (e: React.MouseEvent) => {
        const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        mouseX.set(x);
        mouseY.set(y);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (isSignUp && form.password !== form.confirm) {
            toast.error('Passwords do not match');
            return;
        }

        setLoading(true);
        try {
            if (isSignUp) {
                const birthDate = new Date(form.dob);
                const today = new Date();
                let age = today.getFullYear() - birthDate.getFullYear();
                const m = today.getMonth() - birthDate.getMonth();
                if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
                    age--;
                }

                const res = await fetch(`${BASE_URL}/api/signup`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name: form.name, email: form.email, password: form.password, age }),
                });

                const data = await res.json();
                if (!res.ok) throw new Error(data.message || 'Signup failed');

                toast.success('Welcome! Let’s set up your TwinSync profile.');
                onAuth('signup', data.user);
            } else {
                const res = await fetch(`${BASE_URL}/api/login`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email: form.email, password: form.password }),
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

    // small decorative particles
    const particles = Array.from({ length: 10 }).map((_, i) => ({ id: i }));

    return (
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-violet-50 via-indigo-50 to-blue-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
            {/* Background ambient blobs */}
            <motion.div
                aria-hidden
                className="pointer-events-none absolute inset-0 -z-10"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
            >
                <div className="absolute -left-20 -top-8 w-[520px] h-[520px] bg-gradient-to-tr from-violet-300 via-indigo-300 to-blue-300 rounded-full filter blur-3xl opacity-60 animate-[blob_18s_linear_infinite]" />
                <div className="absolute -right-28 top-40 w-[420px] h-[420px] bg-gradient-to-br from-pink-200 via-violet-200 to-indigo-200 rounded-full filter blur-2xl opacity-40 animate-[blob_20s_linear_infinite]" />

                {/* subtle particles */}
                <div className="absolute inset-0 -z-20">
                    {particles.map((p) => (
                        <motion.span
                            key={p.id}
                            className={`absolute w-1.5 h-1.5 rounded-full bg-white/40 dark:bg-white/10`}
                            style={{
                                left: `${(p.id + 3) * 9}%`,
                                top: `${(p.id * 13) % 90}%`,
                            }}
                            animate={{
                                y: [0, -18, 0],
                                opacity: [0.7, 0.25, 0.7],
                                scale: [0.9, 1.4, 0.9],
                            }}
                            transition={{ duration: 8 + p.id, repeat: Infinity, ease: 'easeInOut', repeatType: 'loop' }}
                        />
                    ))}
                </div>
            </motion.div>

            {/* Center card */}
            <motion.div
                onMouseMove={handleMouse}
                style={{ rotateY, rotateX }}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.45, ease: 'easeOut' }}
                className="relative w-full max-w-md rounded-3xl border border-white/20 dark:border-slate-700/40 backdrop-blur-3xl bg-white/70 dark:bg-slate-800/60 shadow-[0_10px_40px_rgba(14,15,20,0.12)] p-8 sm:p-10"
            >
                {/* highlight rim */}
                <motion.div
                    style={{ background: 'linear-gradient(90deg, rgba(255,255,255,0.06), rgba(255,255,255,0))', left: 0 }}
                    className="absolute inset-0 rounded-3xl pointer-events-none"
                    aria-hidden
                />

                {/* glass light */}
                <motion.div
                    style={{
                        background: 'radial-gradient(800px 400px at var(--x, 40%) var(--y, 40%), rgba(255,255,255,0.06), transparent 20%)',
                    }}
                    className="absolute inset-0 rounded-3xl pointer-events-none"
                    animate={{}}
                    // bind CSS variables to motion transforms so light follows cursor
                    onUpdate={() => {
                        // no-op: variables are handled below via style prop on container if needed
                    }}
                />

                {/* Lock avatar + title */}
                <div className="relative z-10 text-center mb-6">
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.45 }}
                        className="mx-auto mb-4 w-20 h-20 rounded-2xl flex items-center justify-center bg-gradient-to-br from-violet-500 via-indigo-500 to-blue-600 shadow-2xl"
                    >
                        <Lock className="text-white w-6 h-6" />
                    </motion.div>

                    <h1 className="text-2xl font-semibold bg-gradient-to-r from-violet-600 via-indigo-600 to-blue-600 bg-clip-text text-transparent">
                        {isSignUp ? 'Create Account' : 'Welcome Back'}
                    </h1>

                    <p className="mt-2 text-sm text-slate-600 dark:text-slate-300 max-w-[26ch] mx-auto">
                        {isSignUp ? 'Join TwinSync and meet your digital twin' : 'Sign in to continue your journey'}
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="relative z-10 space-y-5">
                    {isSignUp && (
                        <div className="grid sm:grid-cols-2 gap-4">
                            <div className="sm:col-span-2">
                                <label className="block text-sm text-slate-700 dark:text-slate-300 mb-1">Full Name</label>
                                <input
                                    type="text"
                                    required
                                    value={form.name}
                                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                                    placeholder="Enter your full name"
                                    className="w-full px-4 py-3 rounded-2xl border border-slate-200/60 dark:border-slate-700/50 bg-white/60 dark:bg-slate-800/60 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-400 transition-shadow shadow-sm"
                                />
                            </div>

                            <div className="relative group">
                                <label className="block text-sm text-slate-700 dark:text-slate-300 mb-1">
                                    Date of Birth
                                </label>
                                <input
                                    type="date"
                                    required
                                    value={form.dob}
                                    onChange={(e) => setForm({ ...form, dob: e.target.value })}
                                    className="w-full px-4 py-3 rounded-2xl border border-slate-300/40 dark:border-slate-700/60 bg-white/40 dark:bg-slate-800/40 
               text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-400/70 backdrop-blur-lg
               transition-all duration-300 shadow-[inset_0_1px_3px_rgba(0,0,0,0.05)] hover dark:hover:bg-slate-800/70"
                                />
                                <div className="absolute right-3 top-10 transform -translate-y-1/2 text-violet-500 group-hover:text-violet-400 transition-colors">
                                </div>
                            </div>

                        </div>
                    )}

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm text-slate-700 dark:text-slate-300 mb-1">Email</label>
                            <input
                                type="email"
                                required
                                value={form.email}
                                onChange={(e) => setForm({ ...form, email: e.target.value })}
                                placeholder="Enter your email"
                                className="w-full px-4 py-3 rounded-2xl border border-slate-200/60 dark:border-slate-700/50 bg-white/60 dark:bg-slate-800/60 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-400 transition-shadow shadow-sm"
                            />
                        </div>

                        <div className="grid sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm text-slate-700 dark:text-slate-300 mb-1">Password</label>
                                <input
                                    type="password"
                                    required
                                    value={form.password}
                                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                                    placeholder="Enter your password"
                                    className="w-full px-4 py-3 rounded-2xl border border-slate-200/60 dark:border-slate-700/50 bg-white/60 dark:bg-slate-800/60 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-400 transition-shadow shadow-sm"
                                />
                            </div>

                            {isSignUp && (
                                <div>
                                    <label className="block text-sm text-slate-700 dark:text-slate-300 mb-1">Confirm</label>
                                    <input
                                        type="password"
                                        required
                                        value={form.confirm}
                                        onChange={(e) => setForm({ ...form, confirm: e.target.value })}
                                        placeholder="Confirm password"
                                        className="w-full px-4 py-3 rounded-2xl border border-slate-200/60 dark:border-slate-700/50 bg-white/60 dark:bg-slate-800/60 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-400 transition-shadow shadow-sm"
                                    />
                                </div>
                            )}
                        </div>
                    </div>

                    <Button
                        type="submit"
                        disabled={loading}
                        className="w-full mt-2 py-4 rounded-2xl bg-gradient-to-r from-violet-600 via-indigo-600 to-blue-600 hover:scale-[1.01] active:scale-[0.995] text-white text-lg shadow-2xl shadow-violet-500/30 transition-transform duration-200 disabled:opacity-60"
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

                {/* footer */}
                <div className="relative z-10 text-center mt-6">
                    <p className="text-sm text-slate-600 dark:text-slate-300">
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

                {/* subtle decorative edge */}
                <svg className="absolute -bottom-12 left-1/2 -translate-x-1/2 opacity-30" width="520" height="120" viewBox="0 0 520 120" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                    <defs>
                        <linearGradient id="g1" x1="0" x2="1">
                            <stop offset="0" stopColor="#8b5cf6" stopOpacity="0.18" />
                            <stop offset="1" stopColor="#06b6d4" stopOpacity="0.06" />
                        </linearGradient>
                    </defs>
                    <path d="M0 80 C120 10, 400 150, 520 80 L520 120 L0 120 Z" fill="url(#g1)" />
                </svg>
            </motion.div>

            {/* Small style helper for keyframe animations used above - keep scoped */}
            <style>{`
        @keyframes blob {
          0% { transform: translateY(0) scale(1); }
          33% { transform: translateY(-12px) scale(1.05); }
          66% { transform: translateY(6px) scale(0.95); }
          100% { transform: translateY(0) scale(1); }
        }
        .animate-\[blob_18s_linear_infinite\] { animation: blob 18s linear infinite; }
        .animate-\[blob_20s_linear_infinite\] { animation: blob 20s linear infinite; }
      `}</style>
        </div>
    );
}
