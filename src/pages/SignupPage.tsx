import { useState } from 'react';
import type { PageView, UserRole } from '../App';
import { Bell, User, Mail, Lock, Eye, EyeOff, GraduationCap, Building2, ArrowRight, Phone } from 'lucide-react';

import { supabase } from '../lib/supabaseClient';

interface SignUpPageProps {
  onNavigate: (view: PageView) => void;
  onSignUp: (role: UserRole) => void;
  initialRole?: 'student' | 'employer';
}

export function SignUpPage({ onNavigate, onSignUp, initialRole = 'student' }: SignUpPageProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState<'student' | 'employer'>(initialRole);
  const [loginMethod, setLoginMethod] = useState<'email' | 'phone'>('email');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) throw error;

      if (data.user) {
        // Create user profile
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: data.user.id,
            role: selectedRole,
            full_name: fullName,
            phone: phone
          });

        if (profileError) throw profileError;

        onSignUp(selectedRole); // Trigger App.tsx login state
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'An error occurred during signup');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    try {
      localStorage.setItem('pendingRole', selectedRole);
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

  return (
    <div className="min-h-screen bg-[#FFFBF0] flex items-center justify-center p-4">
      {/* Background Decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-32 h-32 bg-[#F5C518]/20 rounded-full blur-2xl"></div>
        <div className="absolute bottom-20 right-20 w-48 h-48 bg-[#F5C518]/10 rounded-full blur-3xl"></div>
      </div>

      <div className="w-full max-w-5xl relative z-10">
        {/* Header Logo */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-[#F5C518] rounded-xl flex items-center justify-center">
              <Bell className="w-5 h-5 text-[#1A1A1A]" />
            </div>
            <span className="text-xl font-bold text-[#1A1A1A]">AfterBell</span>
          </div>
          <p className="text-gray-600">
            Already have an account?{' '}
            <button
              onClick={() => onNavigate('login')}
              className="text-[#F5C518] font-semibold hover:underline"
            >
              Log in
            </button>
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
          <div className="grid lg:grid-cols-2">
            {/* Left Side - Info */}
            <div className="bg-gradient-to-br from-[#F5C518]/20 to-[#F5C518]/5 p-10 lg:p-12 flex flex-col justify-between relative overflow-hidden">
              {/* Decorative dots */}
              <div className="absolute inset-0 opacity-30">
                <div className="absolute top-10 left-10 w-2 h-2 bg-[#F5C518] rounded-full"></div>
                <div className="absolute top-20 left-20 w-3 h-3 bg-[#F5C518] rounded-full"></div>
                <div className="absolute top-40 left-8 w-2 h-2 bg-[#F5C518] rounded-full"></div>
                <div className="absolute bottom-40 right-10 w-2 h-2 bg-[#F5C518] rounded-full"></div>
                <div className="absolute bottom-20 right-20 w-3 h-3 bg-[#F5C518] rounded-full"></div>
              </div>

              <div className="relative z-10">
                <h2 className="text-3xl lg:text-4xl font-bold text-[#1A1A1A] mb-6 leading-tight">
                  Start your career journey while you study.
                </h2>
                <p className="text-gray-600 text-lg">
                  Join thousands of students finding flexible work across India.
                </p>
              </div>

              {/* Features List */}
              <div className="relative z-10 mt-12 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-[#F5C518] rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-gray-700 font-medium">Verified employers only</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-[#F5C518] rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-gray-700 font-medium">Flexible work hours</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-[#F5C518] rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-gray-700 font-medium">Daily payment options</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-[#F5C518] rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-gray-700 font-medium">Location-based matching</span>
                </div>
              </div>
            </div>

            {/* Right Side - Form */}
            <div className="p-10 lg:p-12">
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-[#1A1A1A] mb-2">Create an account</h2>
                <p className="text-gray-600">
                  Fill in your details to get started with AfterBell.
                </p>
              </div>

              <form onSubmit={handleSignUp} className="space-y-6">
                {/* Role Selection */}
                <div>
                  <label className="block text-sm font-medium text-[#1A1A1A] mb-3">
                    I am a...
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      type="button"
                      onClick={() => setSelectedRole('student')}
                      className={`flex flex-col items-center gap-3 p-6 rounded-xl border-2 transition-all duration-200 ${selectedRole === 'student'
                        ? 'border-[#F5C518] bg-[#F5C518]/10'
                        : 'border-gray-200 hover:border-gray-300'
                        }`}
                    >
                      <GraduationCap className={`w-8 h-8 ${selectedRole === 'student' ? 'text-[#F5C518]' : 'text-gray-400'}`} />
                      <span className={`font-semibold ${selectedRole === 'student' ? 'text-[#1A1A1A]' : 'text-gray-500'}`}>
                        Student
                      </span>
                      {selectedRole === 'student' && (
                        <div className="w-6 h-6 bg-[#F5C518] rounded-full flex items-center justify-center">
                          <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedRole('employer')}
                      className={`flex flex-col items-center gap-3 p-6 rounded-xl border-2 transition-all duration-200 ${selectedRole === 'employer'
                        ? 'border-[#F5C518] bg-[#F5C518]/10'
                        : 'border-gray-200 hover:border-gray-300'
                        }`}
                    >
                      <Building2 className={`w-8 h-8 ${selectedRole === 'employer' ? 'text-[#F5C518]' : 'text-gray-400'}`} />
                      <span className={`font-semibold ${selectedRole === 'employer' ? 'text-[#1A1A1A]' : 'text-gray-500'}`}>
                        Employer
                      </span>
                      {selectedRole === 'employer' && (
                        <div className="w-6 h-6 bg-[#F5C518] rounded-full flex items-center justify-center">
                          <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      )}
                    </button>
                  </div>
                </div>

                {/* Login Method Toggle */}
                <div>
                  <label className="block text-sm font-medium text-[#1A1A1A] mb-3">
                    Login using
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      type="button"
                      onClick={() => setLoginMethod('email')}
                      className={`flex items-center justify-center gap-2 p-3 rounded-xl border-2 transition-all duration-200 ${loginMethod === 'email'
                        ? 'border-[#F5C518] bg-[#F5C518]/10'
                        : 'border-gray-200 hover:border-gray-300'
                        }`}
                    >
                      <Mail className={`w-5 h-5 ${loginMethod === 'email' ? 'text-[#F5C518]' : 'text-gray-400'}`} />
                      <span className={`font-medium ${loginMethod === 'email' ? 'text-[#1A1A1A]' : 'text-gray-500'}`}>
                        Email
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setLoginMethod('phone')}
                      className={`flex items-center justify-center gap-2 p-3 rounded-xl border-2 transition-all duration-200 ${loginMethod === 'phone'
                        ? 'border-[#F5C518] bg-[#F5C518]/10'
                        : 'border-gray-200 hover:border-gray-300'
                        }`}
                    >
                      <Phone className={`w-5 h-5 ${loginMethod === 'phone' ? 'text-[#F5C518]' : 'text-gray-400'}`} />
                      <span className={`font-medium ${loginMethod === 'phone' ? 'text-[#1A1A1A]' : 'text-gray-500'}`}>
                        Phone
                      </span>
                    </button>
                  </div>
                </div>

                {/* Full Name */}
                <div>
                  <label className="block text-sm font-medium text-[#1A1A1A] mb-2">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Rahul Sharma"
                      className="w-full px-4 py-3 border border-gray-200 bg-white text-[#1A1A1A] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F5C518] focus:border-transparent transition-all duration-200 pl-12"
                    />
                  </div>
                </div>

                {/* Email or Phone based on selection */}
                {loginMethod === 'email' ? (
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
                        placeholder="you@example.com"
                        className="w-full px-4 py-3 border border-gray-200 bg-white text-[#1A1A1A] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F5C518] focus:border-transparent transition-all duration-200 pl-12"
                      />
                    </div>
                  </div>
                ) : (
                  <div>
                    <label className="block text-sm font-medium text-[#1A1A1A] mb-2">
                      Phone Number
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+91 98765 43210"
                        className="w-full px-4 py-3 border border-gray-200 bg-white text-[#1A1A1A] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F5C518] focus:border-transparent transition-all duration-200 pl-12"
                      />
                    </div>
                  </div>
                )}

                {/* Password */}
                <div>
                  <label className="block text-sm font-medium text-[#1A1A1A] mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
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
                  <p className="text-sm text-gray-500 mt-2">
                    Must be at least 8 characters.
                  </p>
                </div>

                {/* Error Message */}
                {errorMsg && (
                  <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-4">
                    {errorMsg}
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full btn-primary py-4 text-lg flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Creating Account...' : 'Create Account'}
                  {!isLoading && <ArrowRight className="w-5 h-5" />}
                </button>
              </form>

              {/* Divider */}
              <div className="flex items-center gap-4 my-8">
                <div className="flex-1 h-px bg-gray-200"></div>
                <span className="text-sm text-gray-400">Or continue with</span>
                <div className="flex-1 h-px bg-gray-200"></div>
              </div>

              {/* Google Sign Up */}
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
                <span className="font-medium text-[#1A1A1A]">Sign up with Google</span>
              </button>

              {/* Terms */}
              <p className="text-center mt-8 text-sm text-gray-500">
                By clicking "Create Account", you agree to our{' '}
                <button
                  onClick={() => onNavigate('terms')}
                  className="text-[#F5C518] hover:underline"
                >
                  Terms of Service
                </button>
                {' '}and{' '}
                <button
                  onClick={() => onNavigate('privacy-policy')}
                  className="text-[#F5C518] hover:underline"
                >
                  Privacy Policy
                </button>.
              </p>
            </div>
          </div>
        </div>

        <p className="text-center mt-8 text-sm text-gray-400">
          © 2026 AfterBell. All rights reserved.
        </p>
      </div>
    </div>
  );
}
