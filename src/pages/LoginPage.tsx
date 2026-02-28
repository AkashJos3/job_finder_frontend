import { useState } from 'react';
import type { PageView, UserRole } from '../App';
import { Bell, Mail, Lock, Eye, EyeOff, MessageSquare } from 'lucide-react';
import { API_URL } from '../lib/api';
import { supabase } from '../lib/supabaseClient';

interface LoginPageProps {
    onNavigate: (view: PageView) => void;
    onLogin: (role: UserRole) => void;
}

export function LoginPage({ onNavigate, onLogin }: LoginPageProps) {
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loginMethod, setLoginMethod] = useState<'password' | 'otp'>('password');
    const [otpSent, setOtpSent] = useState(false);
    const [otpCode, setOtpCode] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) {
            setErrorMsg('Please enter an email address.');
            return;
        }

        setIsLoading(true);
        setErrorMsg('');

        try {
            if (loginMethod === 'password') {
                const { data, error } = await supabase.auth.signInWithPassword({ email, password });
                if (error) throw error;
                await checkRoleAndLogin(data.user);
            } else if (loginMethod === 'otp' && !otpSent) {

                // 1. Manually check if the user exists before sending OTP. 
                // Supabase's shouldCreateUser=false flag is frequently overridden by dashboard email templates.
                const checkRes = await fetch(`${API_URL}/api/auth/check-email`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email })
                });

                if (!checkRes.ok) {
                    throw new Error('Failed to verify account. Please try again later.');
                }

                const checkData = await checkRes.json();
                if (!checkData.exists) {
                    throw new Error('Account does not exist. Please create an account first.');
                }

                // 2. Since they exist, safely send the OTP
                const { error } = await supabase.auth.signInWithOtp({
                    email,
                    options: {
                        shouldCreateUser: false,
                    },
                });

                if (error) {
                    throw error;
                }

                setOtpSent(true);
            } else if (loginMethod === 'otp' && otpSent) {
                // Verify OTP
                if (!otpCode) {
                    throw new Error('Please enter the OTP code.');
                }
                const { data, error } = await supabase.auth.verifyOtp({ email, token: otpCode, type: 'email' });
                if (error) throw error;
                await checkRoleAndLogin(data.user);
            }
        } catch (err: any) {
            setErrorMsg(err.message || 'Invalid login credentials');
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleAuth = async () => {
        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: window.location.origin,
                },
            });
            if (error) throw error;
        } catch (err: any) {
            setErrorMsg(err.message || 'An error occurred with Google Sign-In');
        }
    };

    const checkRoleAndLogin = async (user: any) => {
        if (!user) return;
        const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single();

        if (profileError) throw profileError;

        if (profileData?.role === 'banned') {
            await supabase.auth.signOut();
            throw new Error("Your account has been banned due to violations of our policies.");
        }

        if (profileData && profileData.role) {
            onLogin(profileData.role as UserRole);
        } else {
            onLogin('student'); // Fallback
        }
    };

    return (
        <div className="min-h-screen bg-[#FFFBF0] flex items-center justify-center p-4">
            {/* Background Decorations */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-20 left-20 w-32 h-32 bg-[#F5C518]/20 rounded-full blur-2xl"></div>
                <div className="absolute bottom-20 right-20 w-48 h-48 bg-[#F5C518]/10 rounded-full blur-3xl"></div>
                <div className="absolute top-1/3 right-10 w-24 h-24 bg-[#F5C518]/15 rounded-full blur-xl"></div>
            </div>

            {/* Login Card */}
            <div className="w-full max-w-md relative z-10">
                {/* Logo */}
                <div className="flex items-center justify-center gap-2 mb-8">
                    <div className="w-12 h-12 bg-[#F5C518] rounded-xl flex items-center justify-center">
                        <Bell className="w-6 h-6 text-[#1A1A1A]" />
                    </div>
                    <span className="text-2xl font-bold text-[#1A1A1A]">AfterBell</span>
                </div>

                <div className="bg-white rounded-3xl shadow-xl p-8 md:p-10">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-[#1A1A1A] mb-2">Welcome!</h1>
                        <p className="text-gray-600">
                            Login to find part-time gigs near your college.
                        </p>
                    </div>

                    {/* Login Form */}
                    <form onSubmit={handleLogin} className="space-y-6">
                        {/* Email/Mobile Field */}
                        {!otpSent ? (
                            <div>
                                <label className="block text-sm font-medium text-[#1A1A1A] mb-2">
                                    Email Address
                                </label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="you@university.edu"
                                        className="w-full px-4 py-3 border border-gray-200 bg-white text-[#1A1A1A] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F5C518] focus:border-transparent transition-all duration-200 pl-12"
                                        required
                                    />
                                </div>
                            </div>
                        ) : (
                            <div className="bg-green-50 rounded-xl p-4 flex items-start justify-between">
                                <div>
                                    <p className="text-sm font-medium text-green-800">OTP Sent!</p>
                                    <p className="text-xs text-green-600 mt-1">We've sent a 6-digit code to {email}</p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setOtpSent(false)}
                                    className="text-xs font-semibold text-green-700 hover:text-green-800 underline"
                                >
                                    Change Email
                                </button>
                            </div>
                        )}

                        {/* Password Field */}
                        {loginMethod === 'password' && (
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <label className="text-sm font-medium text-[#1A1A1A]">Password</label>
                                    <button
                                        type="button"
                                        className="text-sm text-[#F5C518] hover:underline font-medium"
                                    >
                                        FORGOT?
                                    </button>
                                </div>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="••••••••••••"
                                        className="w-full px-4 py-3 border border-gray-200 bg-white text-[#1A1A1A] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F5C518] focus:border-transparent transition-all duration-200 pl-12 pr-12"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    >
                                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* OTP Code Field */}
                        {loginMethod === 'otp' && otpSent && (
                            <div>
                                <label className="block text-sm font-medium text-[#1A1A1A] mb-2">8-Digit OTP</label>
                                <div className="relative">
                                    <MessageSquare className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        type="text"
                                        maxLength={8}
                                        value={otpCode}
                                        onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                                        placeholder="12345678"
                                        className="w-full px-4 py-3 border border-gray-200 bg-white text-[#1A1A1A] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F5C518] focus:border-transparent transition-all duration-200 pl-12 text-center tracking-[0.5em] font-bold text-xl"
                                    />
                                </div>
                                <p className="text-xs text-gray-500 mt-2 text-center">
                                    Make sure to check your spam folder!
                                </p>
                            </div>
                        )}

                        {/* Error Message */}
                        {errorMsg && (
                            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-4">
                                {errorMsg}
                            </div>
                        )}

                        {/* Login Button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full btn-dark py-4 text-lg disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {isLoading
                                ? 'Please wait...'
                                : loginMethod === 'password'
                                    ? 'Log In'
                                    : otpSent
                                        ? 'Verify & Log In'
                                        : 'Send OTP Code'}
                        </button>
                    </form>

                    {/* Divider */}
                    <div className="flex items-center gap-4 my-8">
                        <div className="flex-1 h-px bg-gray-200"></div>
                        <span className="text-sm text-gray-400 font-medium">QUICK ACCESS</span>
                        <div className="flex-1 h-px bg-gray-200"></div>
                    </div>

                    {/* Alternative Login Methods */}
                    {!otpSent && (
                        <div className="space-y-4">
                            <button
                                type="button"
                                onClick={handleGoogleAuth}
                                className="w-full flex items-center justify-center gap-3 px-4 py-3 border-2 border-gray-200 rounded-xl hover:border-gray-300 transition-all duration-200"
                            >
                                <svg className="w-5 h-5" viewBox="0 0 24 24">
                                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                </svg>
                                <span className="font-medium text-[#1A1A1A]">Sign in with Google</span>
                            </button>

                            <div className="grid grid-cols-2 gap-4">
                                <button
                                    type="button"
                                    onClick={() => setLoginMethod('password')}
                                    className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 transition-all duration-200 ${loginMethod === 'password'
                                        ? 'border-[#1A1A1A] bg-[#1A1A1A] text-white'
                                        : 'border-gray-200 hover:border-gray-300 text-gray-600'
                                        }`}
                                >
                                    <Lock className="w-5 h-5" />
                                    Password
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setLoginMethod('otp')}
                                    className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 transition-all duration-200 ${loginMethod === 'otp'
                                        ? 'border-[#1A1A1A] bg-[#1A1A1A] text-white'
                                        : 'border-gray-200 hover:border-gray-300 text-gray-600'
                                        }`}
                                >
                                    <MessageSquare className="w-5 h-5" />
                                    Email OTP
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Sign Up Link */}
                    <p className="text-center mt-8 text-gray-600">
                        New here?{' '}
                        <button
                            onClick={() => onNavigate('signup')}
                            className="text-[#F5C518] font-semibold hover:underline"
                        >
                            Create Account
                        </button>
                    </p>
                </div>

                {/* Footer Links */}
                <div className="flex items-center justify-center gap-6 mt-8 text-sm text-gray-500">
                    <button onClick={() => onNavigate('privacy-policy')} className="hover:text-[#1A1A1A] transition-colors">Privacy</button>
                    <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                    <button onClick={() => onNavigate('terms')} className="hover:text-[#1A1A1A] transition-colors">Terms</button>
                    <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                    <button onClick={() => onNavigate('help')} className="hover:text-[#1A1A1A] transition-colors">Help</button>
                </div>

                <p className="text-center mt-4 text-sm text-gray-400">
                    © 2026 AfterBell India. All rights reserved.
                </p>
            </div>
        </div>
    );
}

