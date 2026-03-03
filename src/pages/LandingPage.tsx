import type { PageView } from '../App';
import { Bell, MapPin, Search, Briefcase, Shield, Clock, ChevronRight, Star, Menu, X, User, Building2 } from 'lucide-react';
import { useState } from 'react';

interface LandingPageProps {
  onNavigate: (view: PageView) => void;
}

export function LandingPage({ onNavigate }: LandingPageProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);


  return (
    <div className="min-h-screen bg-[#FFFBF0]">
      {/* Navigation */}
      <nav className="bg-[#1A1A1A] border-b border-gray-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo - Clickable to go home */}
            <button
              onClick={() => onNavigate('landing')}
              className="flex items-center gap-2"
            >
              <div className="w-10 h-10 bg-[#F5C518] rounded-xl flex items-center justify-center">
                <Bell className="w-5 h-5 text-[#1A1A1A]" />
              </div>
              <span className="text-xl font-bold text-white">AfterBell</span>
            </button>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              <button
                onClick={() => onNavigate('landing')}
                className="text-white hover:text-[#F5C518] font-medium transition-colors"
              >
                Home
              </button>
              <button
                onClick={() => onNavigate('about')}
                className="text-gray-400 hover:text-[#F5C518] font-medium transition-colors"
              >
                About
              </button>
              <button
                onClick={() => onNavigate('login')}
                className="text-gray-400 hover:text-[#F5C518] font-medium transition-colors"
              >
                Login
              </button>
              <button
                onClick={() => onNavigate('signup')}
                className="btn-primary text-sm"
              >
                Sign Up
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 text-white"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-[#1A1A1A] border-t border-gray-800 py-4">
            <div className="flex flex-col gap-4 px-4">
              <button
                onClick={() => { onNavigate('landing'); setMobileMenuOpen(false); }}
                className="text-white font-medium text-left"
              >
                Home
              </button>
              <button
                onClick={() => { onNavigate('about'); setMobileMenuOpen(false); }}
                className="text-gray-400 font-medium text-left"
              >
                About
              </button>
              <button
                onClick={() => { onNavigate('login'); setMobileMenuOpen(false); }}
                className="text-gray-400 font-medium text-left"
              >
                Login
              </button>
              <button
                onClick={() => { onNavigate('signup'); setMobileMenuOpen(false); }}
                className="btn-primary text-sm text-center"
              >
                Sign Up
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section - Black Theme */}
      <section className="relative overflow-hidden bg-[#1A1A1A]">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src="/site_images/Whisk_55817d435f9f27abdae4a455becaa0ebeg.png"
            alt="Background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/70"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 lg:py-32 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-full mb-6">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              <span className="text-xs sm:text-sm font-medium text-gray-300">New jobs added daily in your locality</span>
            </div>

            {/* Main Heading */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 sm:mb-6 leading-tight">
              Find Local <span className="text-[#F5C518]">Part-Time</span> Jobs
            </h1>

            {/* Subheading */}
            <p className="text-base sm:text-lg md:text-xl text-gray-400 mb-8 max-w-2xl mx-auto px-2">
              Connecting students with trusted nearby part-time work after college hours.
              Safe, simple, and student-first.
            </p>

            {/* Search Bar — stacked on mobile, row on sm+ */}
            <div className="max-w-xl mx-auto mb-8 px-2">
              <div className="flex flex-col sm:flex-row gap-2 bg-black/40 backdrop-blur-md border border-white/20 rounded-2xl sm:rounded-full p-2 focus-within:ring-2 focus-within:ring-[#F5C518]/50 transition-all shadow-lg">
                <div className="flex items-center pl-3 flex-1">
                  <Search className="w-5 h-5 text-gray-300 mr-2 flex-shrink-0" />
                  <input
                    type="text"
                    placeholder="Role, city, or keywords..."
                    className="bg-transparent border-none text-white placeholder-gray-400 w-full focus:outline-none text-sm sm:text-base py-2"
                  />
                </div>
                <button
                  onClick={() => onNavigate('login')}
                  className="bg-[#F5C518] text-[#1A1A1A] font-bold px-5 py-3 rounded-xl sm:rounded-full hover:bg-[#E5B508] transition-all flex items-center justify-center gap-2 whitespace-nowrap shadow-md"
                >
                  <User className="w-4 h-4" />
                  Find Jobs
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Quick Tags */}
            <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-10 px-2">
              <span className="inline-flex items-center gap-2 bg-black/40 backdrop-blur-md border border-white/10 px-3 py-1.5 rounded-full text-xs sm:text-sm text-gray-200 shadow-sm">
                <Shield className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-400" />
                Verified Indian Employers
              </span>
              <span className="inline-flex items-center gap-2 bg-black/40 backdrop-blur-md border border-white/10 px-3 py-1.5 rounded-full text-xs sm:text-sm text-gray-200 shadow-sm">
                <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#F5C518]" />
                Flexible Hours
              </span>
              <span className="inline-flex items-center gap-2 bg-black/40 backdrop-blur-md border border-white/10 px-3 py-1.5 rounded-full text-xs sm:text-sm text-gray-200 shadow-sm">
                <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-400" />
                Location Based Search
              </span>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center px-4">
              <button
                onClick={() => onNavigate('student-signup')}
                className="bg-[#F5C518] text-[#1A1A1A] font-bold text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 rounded-xl hover:bg-[#E5B508] transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-xl hover:-translate-y-1"
              >
                <User className="w-5 h-5" />
                Find Jobs
              </button>
              <button
                onClick={() => onNavigate('employer-signup')}
                className="bg-white text-[#1A1A1A] font-bold text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 rounded-xl hover:bg-gray-100 transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-xl hover:-translate-y-1"
              >
                <Building2 className="w-5 h-5" />
                Post a Job
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Why Use AfterBell Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[#1A1A1A] mb-4">
              Why use <span className="text-[#F5C518]">AfterBell</span>?
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-[#FFFBF0] rounded-2xl p-8 card-shadow hover:card-shadow-hover transition-all duration-300">
              <div className="w-14 h-14 bg-[#F5C518]/20 rounded-xl flex items-center justify-center mb-6">
                <Shield className="w-7 h-7 text-[#F5C518]" />
              </div>
              <h3 className="text-xl font-bold text-[#1A1A1A] mb-3">Verified Listings</h3>
              <p className="text-gray-600 leading-relaxed">
                Every job post is manually reviewed for the safety of students across India.
                No scams, just real opportunities.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-[#FFFBF0] rounded-2xl p-8 card-shadow hover:card-shadow-hover transition-all duration-300">
              <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-6">
                <MapPin className="w-7 h-7 text-blue-500" />
              </div>
              <h3 className="text-xl font-bold text-[#1A1A1A] mb-3">Radius-Based Search</h3>
              <p className="text-gray-600 leading-relaxed">
                Find jobs within your preferred km radius. Visualize your commute and
                discover opportunities in your neighborhood.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-[#FFFBF0] rounded-2xl p-8 card-shadow hover:card-shadow-hover transition-all duration-300">
              <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center mb-6">
                <Briefcase className="w-7 h-7 text-green-500" />
              </div>
              <h3 className="text-xl font-bold text-[#1A1A1A] mb-3">Student Focused</h3>
              <p className="text-gray-600 leading-relaxed">
                Employers on AfterBell understand Indian academic schedules.
                Filter by evening, weekend, or holiday shifts.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Trending Opportunities Section */}
      <section className="py-20 bg-[#1A1A1A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
                Trending <span className="text-[#F5C518]">Opportunities</span>
              </h2>
              <p className="text-gray-400">
                Popular part-time roles students are applying for across major Indian cities.
              </p>
            </div>
            <button
              onClick={() => onNavigate('login')}
              className="mt-4 md:mt-0 inline-flex items-center gap-2 text-[#F5C518] font-semibold hover:underline"
            >
              View all jobs
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Job Card 1 */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-[#F5C518] rounded-xl flex items-center justify-center text-[#1A1A1A] font-bold">
                  B
                </div>
                <div>
                  <span className="text-xs text-gray-400">Part-time</span>
                  <h4 className="text-white font-semibold">Barista & Cashier</h4>
                </div>
              </div>
              <p className="text-gray-400 text-sm mb-4">Bean & Brew Co.</p>
              <div className="flex items-center justify-between text-sm">
                <span className="text-[#F5C518] font-semibold">₹450/day</span>
                <span className="text-gray-500">0.5 km</span>
              </div>
            </div>

            {/* Job Card 2 */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center text-white font-bold">
                  L
                </div>
                <div>
                  <span className="text-xs text-gray-400">Weekend</span>
                  <h4 className="text-white font-semibold">Library Assistant</h4>
                </div>
              </div>
              <p className="text-gray-400 text-sm mb-4">City Public Library</p>
              <div className="flex items-center justify-between text-sm">
                <span className="text-[#F5C518] font-semibold">₹350/day</span>
                <span className="text-gray-500">1.2 km</span>
              </div>
            </div>

            {/* Job Card 3 */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center text-white font-bold">
                  G
                </div>
                <div>
                  <span className="text-xs text-gray-400">Flexible</span>
                  <h4 className="text-white font-semibold">Garden Help</h4>
                </div>
              </div>
              <p className="text-gray-400 text-sm mb-4">GreenThumb Nursery</p>
              <div className="flex items-center justify-between text-sm">
                <span className="text-[#F5C518] font-semibold">₹400/day</span>
                <span className="text-gray-500">2.0 km</span>
              </div>
            </div>

            {/* Job Card 4 */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center text-white font-bold">
                  T
                </div>
                <div>
                  <span className="text-xs text-gray-400">Remote</span>
                  <h4 className="text-white font-semibold">Math Tutor</h4>
                </div>
              </div>
              <p className="text-gray-400 text-sm mb-4">TopGrade Tutoring</p>
              <div className="flex items-center justify-between text-sm">
                <span className="text-[#F5C518] font-semibold">₹600/day</span>
                <span className="text-gray-500">Remote</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-[#FFFBF0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[#1A1A1A] mb-4">
              How It <span className="text-[#F5C518]">Works</span>
            </h2>
            <p className="text-gray-600">
              Start your journey to financial independence in three easy steps.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="text-center">
              <div className="w-20 h-20 bg-[#F5C518] rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="w-8 h-8 text-[#1A1A1A]" />
              </div>
              <div className="inline-block bg-[#1A1A1A] text-white text-xs font-bold px-3 py-1 rounded-full mb-4">
                STEP 01
              </div>
              <h3 className="text-xl font-bold text-[#1A1A1A] mb-3">SEARCH</h3>
              <p className="text-gray-600">
                Find local jobs near you. Use our smart map to see what's happening in your neighborhood.
              </p>
            </div>

            {/* Step 2 */}
            <div className="text-center">
              <div className="w-20 h-20 bg-[#F5C518] rounded-full flex items-center justify-center mx-auto mb-6">
                <Briefcase className="w-8 h-8 text-[#1A1A1A]" />
              </div>
              <div className="inline-block bg-[#1A1A1A] text-white text-xs font-bold px-3 py-1 rounded-full mb-4">
                STEP 02
              </div>
              <h3 className="text-xl font-bold text-[#1A1A1A] mb-3">APPLY</h3>
              <p className="text-gray-600">
                Quick application with one tap. No complicated forms—just your profile and your interest.
              </p>
            </div>

            {/* Step 3 */}
            <div className="text-center">
              <div className="w-20 h-20 bg-[#F5C518] rounded-full flex items-center justify-center mx-auto mb-6">
                <Star className="w-8 h-8 text-[#1A1A1A]" />
              </div>
              <div className="inline-block bg-[#1A1A1A] text-white text-xs font-bold px-3 py-1 rounded-full mb-4">
                STEP 03
              </div>
              <h3 className="text-xl font-bold text-[#1A1A1A] mb-3">EARN</h3>
              <p className="text-gray-600">
                Get paid per day for your work. No waiting for month-ends, enjoy direct and fast payments.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* For Job Seekers Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="inline-block bg-[#F5C518]/20 text-[#1A1A1A] text-sm font-semibold px-4 py-2 rounded-full mb-6">
                For Indian Job Seekers
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-[#1A1A1A] mb-6">
                Employers are looking for <span className="text-[#F5C518]">someone like you.</span>
              </h2>
              <p className="text-gray-600 text-lg mb-8">
                Don't let your perfect part-time gig slip away. Create a profile in minutes,
                set your availability, and let local Indian businesses find you.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => onNavigate('signup')}
                  className="btn-primary"
                >
                  Create Free Profile
                </button>
                <button
                  onClick={() => onNavigate('employer-signup')}
                  className="btn-outline"
                >
                  Post a Job
                </button>
              </div>
            </div>

            <div className="relative">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-[#FFFBF0] rounded-2xl p-6 card-shadow flex flex-col">
                  <div className="w-12 h-12 bg-[#F5C518] rounded-xl flex items-center justify-center mb-4">
                    <Briefcase className="w-6 h-6 text-[#1A1A1A]" />
                  </div>
                  <p className="font-semibold text-[#1A1A1A]">500+ Jobs</p>
                  <p className="text-sm text-gray-600">Posted weekly</p>
                </div>
                <div className="bg-[#FFFBF0] rounded-2xl p-6 card-shadow flex flex-col">
                  <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center mb-4">
                    <Shield className="w-6 h-6 text-white" />
                  </div>
                  <p className="font-semibold text-[#1A1A1A]">100% Verified</p>
                  <p className="text-sm text-gray-600">Employer checks</p>
                </div>
                <div className="bg-[#FFFBF0] rounded-2xl p-6 card-shadow flex flex-col">
                  <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center mb-4">
                    <Clock className="w-6 h-6 text-white" />
                  </div>
                  <p className="font-semibold text-[#1A1A1A]">Flexible</p>
                  <p className="text-sm text-gray-600">Work hours</p>
                </div>
                <div className="bg-[#FFFBF0] rounded-2xl p-6 card-shadow flex flex-col">
                  <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center mb-4">
                    <Star className="w-6 h-6 text-white" />
                  </div>
                  <p className="font-semibold text-[#1A1A1A]">4.8 Rating</p>
                  <p className="text-sm text-gray-600">From students</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#1A1A1A] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 sm:gap-12 mb-12">
            {/* Brand */}
            <div>
              <button
                onClick={() => onNavigate('landing')}
                className="flex items-center gap-2 mb-6"
              >
                <div className="w-10 h-10 bg-[#F5C518] rounded-xl flex items-center justify-center">
                  <Bell className="w-5 h-5 text-[#1A1A1A]" />
                </div>
                <span className="text-xl font-bold text-white">AfterBell</span>
              </button>
              <p className="text-gray-400 text-sm leading-relaxed">
                Connecting students with local opportunities across India.
                Building the workforce of tomorrow, today.
              </p>
            </div>

            {/* For Students */}
            <div>
              <h4 className="text-white font-semibold mb-6">For Students</h4>
              <ul className="space-y-3">
                <li><button onClick={() => onNavigate('login')} className="text-gray-400 hover:text-[#F5C518] text-sm transition-colors">Browse Jobs</button></li>
                <li><button onClick={() => onNavigate('career-advice')} className="text-gray-400 hover:text-[#F5C518] text-sm transition-colors">Career Advice</button></li>
                <li><button onClick={() => onNavigate('safety-tips')} className="text-gray-400 hover:text-[#F5C518] text-sm transition-colors">Safety Tips</button></li>
              </ul>
            </div>

            {/* For Employers */}
            <div>
              <h4 className="text-white font-semibold mb-6">For Employers</h4>
              <ul className="space-y-3">
                <li><button onClick={() => onNavigate('employer-signup')} className="text-gray-400 hover:text-[#F5C518] text-sm transition-colors">Post a Job</button></li>
                <li><button onClick={() => onNavigate('success-stories')} className="text-gray-400 hover:text-[#F5C518] text-sm transition-colors">Success Stories</button></li>
                <li><button onClick={() => onNavigate('verification-process')} className="text-gray-400 hover:text-[#F5C518] text-sm transition-colors">Verification Process</button></li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h4 className="text-white font-semibold mb-6">Support</h4>
              <ul className="space-y-3">
                <li><button onClick={() => onNavigate('help')} className="text-gray-400 hover:text-[#F5C518] text-sm transition-colors">Help Center</button></li>
                <li><button onClick={() => onNavigate('contact-us')} className="text-gray-400 hover:text-[#F5C518] text-sm transition-colors">Contact Us</button></li>
                <li><button onClick={() => onNavigate('privacy-policy')} className="text-gray-400 hover:text-[#F5C518] text-sm transition-colors">Privacy Policy</button></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-center items-center gap-4">
            <p className="text-gray-500 text-sm">
              © 2026 AfterBell Inc. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
