import type { PageView } from '../App';
import { Bell, MapPin, Search, Briefcase, Shield, Clock, ChevronRight, Star, Menu, X, User, Building2, Coffee, GraduationCap, Quote } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import type { Variants } from 'framer-motion';
import Spline from '@splinetool/react-spline';

interface LandingPageProps {
  onNavigate: (view: PageView) => void;
}

const marqueeJobs = [
  "🔥 Urgent: Math Tutor in Trivandrum",
  "☕ Coffee Shop Staff needed in Kochi",
  "📚 Library Assistant in Kozhikode",
  "🖥️ Freelance Content Writer in Thrissur",
  "🛍️ Retail Staff in Ernakulam",
  "💡 Event Helper for Weekends in Kannur"
];

// Animation Variants
const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8 } }
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15
    }
  }
};

export function LandingPage({ onNavigate }: LandingPageProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { scrollYProgress, scrollY } = useScroll();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Draw Path for How It works
  const howItWorksRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: pathProgress } = useScroll({
    target: howItWorksRef,
    offset: ["start center", "end center"]
  });

  // Typewriter effect state
  const searchPlaceholders = [
    "Role, city, or keywords...",
    "Coffee Shop Worker in Kochi...",
    "Library Assistant in Kozhikode...",
    "Math Tutor in Trivandrum...",
    "Weekend jobs in Kerala..."
  ];
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  // Parallax calculations
  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '40%']);
  const navBlur = useTransform(scrollY, [0, 100], ['blur(0px)', 'blur(12px)']);
  const navBg = useTransform(scrollY, [0, 100], ['rgba(26,26,26,1)', 'rgba(26,26,26,0.85)']);

  // Handle Mouse movement for gradient tracking
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Handle Typewriter Effect
  useEffect(() => {
    const currentString = searchPlaceholders[placeholderIndex];
    let typingSpeed = isDeleting ? 30 : 60;

    if (!isDeleting && displayText === currentString) {
      typingSpeed = 2500; // Pause at the end
      const timer = setTimeout(() => setIsDeleting(true), typingSpeed);
      return () => clearTimeout(timer);
    }

    if (isDeleting && displayText === '') {
      setIsDeleting(false);
      setPlaceholderIndex((prev) => (prev + 1) % searchPlaceholders.length);
      return;
    }

    const timer = setTimeout(() => {
      setDisplayText((prev) =>
        isDeleting ? currentString.substring(0, prev.length - 1) : currentString.substring(0, prev.length + 1)
      );
    }, typingSpeed);

    return () => clearTimeout(timer);
  }, [displayText, isDeleting, placeholderIndex]);


  return (
    <div className="min-h-screen bg-[#FFFBF0]">
      {/* Scroll Progress Bar */}
      <motion.div 
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#F5C518] to-orange-400 z-[60]"
        style={{ scaleX: scrollYProgress, transformOrigin: '0% 50%' }}
      />

      {/* Navigation */}
      <motion.nav 
        className="border-b border-gray-800 sticky top-0 z-50 transition-colors"
        style={{ backgroundColor: navBg, backdropFilter: navBlur }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onNavigate('landing')}
              className="flex items-center gap-2"
            >
              <div className="w-10 h-10 bg-[#F5C518] rounded-xl flex items-center justify-center shadow-lg shadow-[#F5C518]/20">
                <Bell className="w-5 h-5 text-[#1A1A1A]" />
              </div>
              <span className="text-xl font-bold text-white">AfterBell</span>
            </motion.button>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              <motion.button whileHover={{ y: -2 }} onClick={() => onNavigate('landing')} className="text-white hover:text-[#F5C518] font-medium transition-colors cursor-pointer">Home</motion.button>
              <motion.button whileHover={{ y: -2 }} onClick={() => onNavigate('about')} className="text-gray-400 hover:text-[#F5C518] font-medium transition-colors cursor-pointer">About</motion.button>
              <motion.button whileHover={{ y: -2 }} onClick={() => onNavigate('login')} className="text-gray-400 hover:text-[#F5C518] font-medium transition-colors cursor-pointer">Login</motion.button>
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onNavigate('signup')} 
                className="btn-primary text-sm shadow-xl shadow-[#F5C518]/20 cursor-pointer"
              >
                Sign Up
              </motion.button>
            </div>

            {/* Mobile Menu Button */}
            <button className="md:hidden p-2 text-white cursor-pointer" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden bg-[#1A1A1A] border-t border-gray-800 py-4 overflow-hidden"
            >
              <div className="flex flex-col gap-4 px-4">
                <button onClick={() => { onNavigate('landing'); setMobileMenuOpen(false); }} className="text-white font-medium text-left">Home</button>
                <button onClick={() => { onNavigate('about'); setMobileMenuOpen(false); }} className="text-gray-400 font-medium text-left">About</button>
                <button onClick={() => { onNavigate('login'); setMobileMenuOpen(false); }} className="text-gray-400 font-medium text-left">Login</button>
                <button onClick={() => { onNavigate('signup'); setMobileMenuOpen(false); }} className="btn-primary text-sm text-center">Sign Up</button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Hero Section - Black Theme with Parallax */}
      <section className="relative overflow-hidden bg-[#1A1A1A] min-h-[90vh] flex items-center justify-center">
        {/* Parallax Cinematic Video Background */}
        <motion.div className="absolute inset-0 z-0 pointer-events-none" style={{ y: heroY }}>
          <video 
            autoPlay 
            loop 
            muted 
            playsInline
            className="w-full h-[140%] object-cover absolute -top-[20%] left-0 opacity-40 scale-105"
            poster="/site_images/Whisk_55817d435f9f27abdae4a455becaa0ebeg.png"
          >
            <source src="https://videos.pexels.com/video-files/3205807/3205807-uhd_2560_1440_25fps.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A] via-[#1A1A1A]/70 to-[#1A1A1A]/40 mix-blend-multiply" />
        </motion.div>

        {/* 3D Interactive Spline Object */}
        <div className="absolute inset-0 z-10 hidden lg:block opacity-60">
          <Spline scene="https://prod.spline.design/6Wq1Q7YGyM-iab9i/scene.splinecode" />
        </div>

        {/* Floating Glass Cards */}
        <motion.div 
          animate={{ y: [0, -20, 0] }} 
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="hidden lg:flex absolute top-32 left-10 lg:left-20 bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-2xl items-center gap-3 z-0"
        >
          <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center">
            <span className="text-xl">🎉</span>
          </div>
          <div>
            <p className="text-white font-medium text-sm">Amal hired as Cafe Staff</p>
            <p className="text-gray-400 text-xs">Kochi • Just now</p>
          </div>
        </motion.div>

        <motion.div 
          animate={{ y: [0, 20, 0] }} 
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="hidden lg:flex absolute bottom-32 right-10 lg:right-20 bg-white/10 backdrop-blur-md border border-[#F5C518]/30 p-4 rounded-2xl items-center gap-3 z-0"
        >
          <div className="w-10 h-10 bg-[#F5C518]/20 rounded-full flex items-center justify-center">
            <span className="text-xl">💸</span>
          </div>
          <div>
            <p className="text-white font-medium text-sm">Average Pay ₹500/day</p>
            <p className="text-gray-400 text-xs">Weekly Payouts</p>
          </div>
        </motion.div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 lg:py-32 relative z-10">
          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="text-center max-w-3xl mx-auto"
          >
            {/* Badge */}
            <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-full mb-6 ring-1 ring-white/20">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.7)]"></span>
              <span className="text-xs sm:text-sm font-medium text-gray-300">New jobs added daily in Kerala</span>
            </motion.div>

            {/* Main Heading */}
            <motion.h1 variants={fadeInUp} className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-white mb-6 leading-tight tracking-tight">
              Find Local <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F5C518] to-orange-400">Part-Time</span> Jobs
            </motion.h1>

            {/* Subheading */}
            <motion.p variants={fadeInUp} className="text-base sm:text-lg md:text-xl text-gray-300 mb-10 max-w-2xl mx-auto px-2 font-light">
              Connecting students with trusted nearby part-time work after college hours. Safe, simple, and student-first.
            </motion.p>

            {/* Search Bar with Typewriter */}
            <motion.div variants={fadeInUp} className="max-w-xl mx-auto mb-10 px-2">
              <div className="flex flex-col sm:flex-row gap-2 bg-black/60 backdrop-blur-lg border border-white/20 rounded-2xl sm:rounded-full p-2 focus-within:ring-2 focus-within:ring-[#F5C518]/70 transition-all shadow-[0_0_40px_rgba(245,197,24,0.1)]">
                <div className="flex items-center pl-4 flex-1">
                  <Search className="w-5 h-5 text-[#F5C518] mr-3 flex-shrink-0" />
                  <div className="relative w-full overflow-hidden whitespace-nowrap">
                    <input
                      type="text"
                      className="bg-transparent border-none text-white w-full focus:outline-none text-sm sm:text-base py-3 relative z-10 caret-[#F5C518]"
                      placeholder={''}
                    />
                    <div className="absolute top-1/2 -translate-y-1/2 left-0 pointer-events-none text-gray-400 text-sm sm:text-base">
                      {displayText}
                      <motion.span 
                        animate={{ opacity: [1, 0] }}
                        transition={{ repeat: Infinity, duration: 0.8 }}
                        className="inline-block w-[2px] h-4 bg-[#F5C518] ml-1 align-middle"
                      />
                    </div>
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05, border: "none" }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onNavigate('login')}
                  className="bg-gradient-to-r from-[#F5C518] to-orange-400 text-[#1A1A1A] font-bold px-6 py-3 rounded-xl sm:rounded-full transition-all flex items-center justify-center gap-2 whitespace-nowrap shadow-xl"
                >
                  <User className="w-4 h-4" />
                  Find Jobs
                </motion.button>
              </div>
            </motion.div>

            {/* Quick Tags */}
            <motion.div variants={fadeInUp} className="flex flex-wrap justify-center gap-3 mb-10 px-2">
              {[
                { icon: Shield, text: "Verified Kerala Employers", color: "text-green-400" },
                { icon: Clock, text: "Flexible Hours", color: "text-[#F5C518]" },
                { icon: MapPin, text: "Location Based Search", color: "text-blue-400" }
              ].map((tag, i) => (
                <motion.span 
                  key={i}
                  whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.15)" }}
                  className="inline-flex items-center gap-2 bg-white/5 backdrop-blur-md border border-white/10 px-4 py-2 rounded-full text-xs sm:text-sm text-gray-200 cursor-default transition-colors"
                >
                  <tag.icon className={`w-4 h-4 ${tag.color}`} />
                  {tag.text}
                </motion.span>
              ))}
            </motion.div>

            {/* CTA Buttons */}
            <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-4 justify-center px-4">
              <motion.button
                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                onClick={() => onNavigate('student-signup')}
                className="bg-[#F5C518] text-[#1A1A1A] font-bold text-base px-8 py-4 rounded-xl flex items-center justify-center gap-2 shadow-xl shadow-[#F5C518]/20"
              >
                <User className="w-5 h-5" /> Sign up as Student
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.9)" }} whileTap={{ scale: 0.95 }}
                onClick={() => onNavigate('employer-signup')}
                className="bg-white text-[#1A1A1A] font-bold text-base px-8 py-4 rounded-xl flex items-center justify-center gap-2 shadow-xl"
              >
                <Building2 className="w-5 h-5" /> Post a Job
              </motion.button>
            </motion.div>
          </motion.div>
        </div>
        
        {/* Infinite Scrolling Marquee */}
        <div className="w-full bg-[#F5C518] py-3 overflow-hidden border-y border-orange-300 relative z-20">
          <motion.div 
            className="flex whitespace-nowrap w-max"
            animate={{ x: [0, "-50%"] }}
            transition={{ repeat: Infinity, ease: "linear", duration: 35 }}
          >
            {[...marqueeJobs, ...marqueeJobs].map((text, i) => (
              <div key={i} className="flex items-center mx-6">
                <span className="text-[#1A1A1A] font-bold text-sm uppercase tracking-wider">{text}</span>
                <span className="ml-12 text-[#1A1A1A]/30">♦</span>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Why Use AfterBell Section */}
      <section className="py-24 bg-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-96 h-96 bg-yellow-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-50 pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              className="text-3xl md:text-5xl font-extrabold text-[#1A1A1A] mb-4"
            >
              Why use <span className="text-[#F5C518]">AfterBell</span>?
            </motion.h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: Shield, title: "Verified Listings", desc: "Every job post is manually reviewed for the safety of students across Kerala. No scams.", color: "text-[#F5C518]", bg: "bg-[#F5C518]/20" },
              { icon: MapPin, title: "Radius-Based Search", desc: "Find jobs within your preferred km radius. Discover opportunities just down your street.", color: "text-blue-500", bg: "bg-blue-100" },
              { icon: Briefcase, title: "Student Focused", desc: "Employers on AfterBell respect your academic schedules. Easily find evening and weekend shifts.", color: "text-green-500", bg: "bg-green-100" }
            ].map((feature, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: i * 0.15 }}
                whileHover={{ y: -10 }}
                className="bg-[#FFFBF0] rounded-3xl p-8 border border-orange-50/50 shadow-xl shadow-orange-900/5 group"
              >
                {/* Complex Lottie-like Hover Animation */}
                <motion.div 
                  className={`relative w-16 h-16 ${feature.bg} rounded-2xl flex items-center justify-center mb-6`}
                  whileHover="hover"
                >
                  <motion.div 
                    className={`absolute inset-0 rounded-2xl border-2 ${feature.color.replace('text-', 'border-')} opacity-0`}
                    variants={{
                      hover: { scale: [1, 1.4], opacity: [0.8, 0], transition: { duration: 1, repeat: Infinity } }
                    }}
                  />
                  <motion.div 
                    variants={{
                      hover: { rotate: [0, -15, 15, -15, 15, 0], scale: 1.15, transition: { duration: 0.6 } }
                    }}
                  >
                    <feature.icon className={`w-8 h-8 ${feature.color} relative z-10`} />
                  </motion.div>
                </motion.div>
                <h3 className="text-2xl font-bold text-[#1A1A1A] mb-4">{feature.title}</h3>
                <p className="text-gray-600 text-lg leading-relaxed">
                  {feature.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Trending Opportunities Section with Flashlight effect */}
      <section className="py-24 bg-[#1A1A1A] relative overflow-hidden group/section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16">
            <motion.div 
              initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-4">
                Trending <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F5C518] to-orange-400">Opportunities</span>
              </h2>
              <p className="text-gray-400 text-lg max-w-xl">
                Popular part-time roles students are applying for right now across major cities in Kerala.
              </p>
            </motion.div>
            <motion.button
              whileHover={{ x: 5 }}
              onClick={() => onNavigate('login')}
              className="mt-6 md:mt-0 inline-flex items-center gap-2 text-[#F5C518] font-bold text-lg hover:text-white transition-colors"
            >
              View all jobs <ChevronRight className="w-5 h-5" />
            </motion.button>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { role: "Coffee Shop Staff", company: "Bean & Brew Co.", price: "₹450/day", dist: "Kochi", icon: Coffee, bg: "bg-[#F5C518]" },
              { role: "Library Assistant", company: "City Public Library", price: "₹350/day", dist: "Kozhikode", icon: Star, bg: "bg-purple-500" },
              { role: "Garden Help", company: "GreenThumb Nursery", price: "₹400/day", dist: "Trivandrum", icon: Shield, bg: "bg-green-500" },
              { role: "Math Tutor", company: "TopGrade", price: "₹600/day", dist: "Thrissur", icon: GraduationCap, bg: "bg-blue-400" }
            ].map((job, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 group cursor-pointer overflow-hidden"
              >
                {/* Spotlight effect */}
                <div 
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                  style={{
                    background: `radial-gradient(400px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(245, 197, 24, 0.08), transparent 40%)`
                  }}
                />
                
                <div className="flex items-center gap-4 mb-6 relative z-10">
                  <div className={`w-14 h-14 ${job.bg} rounded-2xl flex items-center justify-center text-[#1A1A1A] font-bold shadow-lg`}>
                    <job.icon className="w-6 h-6 text-[#1A1A1A]" />
                  </div>
                  <div>
                    <span className="text-xs font-bold tracking-wider text-[#F5C518] uppercase">Part-time</span>
                    <h4 className="text-white font-bold text-lg mt-1 group-hover:text-[#F5C518] transition-colors">{job.role}</h4>
                  </div>
                </div>
                <p className="text-gray-400 font-medium mb-6 relative z-10">{job.company}</p>
                <div className="flex items-center justify-between relative z-10 pt-4 border-t border-white/10">
                  <span className="text-white font-bold text-lg">{job.price}</span>
                  <span className="bg-white/10 px-3 py-1 rounded-full text-gray-300 text-sm font-medium">{job.dist}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section ref={howItWorksRef} className="py-32 bg-[#FFFBF0] relative overflow-hidden">
        {/* Animated SVG Path connecting the dots */}
        <div className="absolute inset-0 pointer-events-none z-0 hidden md:block" style={{ top: '40%' }}>
          <svg className="w-full h-24" preserveAspectRatio="none">
            <motion.path
              d="M 100,50 Q 300,-50 500,50 T 900,50"
              fill="transparent"
              stroke="#F5C518"
              strokeWidth="4"
              strokeDasharray="10 10"
              style={{ pathLength: pathProgress }}
            />
          </svg>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20 relative z-10">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              className="text-3xl md:text-5xl font-extrabold text-[#1A1A1A] mb-6"
            >
              How It <span className="text-[#F5C518]">Works</span>
            </motion.h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Start your journey to financial independence in three easy steps.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12 relative z-10">
            {[
              { icon: Search, title: "SEARCH", desc: "Find local jobs near you. Use our smart map to see what's happening in your neighborhood." },
              { icon: Briefcase, title: "APPLY", desc: "Quick application with one tap. No complicated forms—just your profile and your interest." },
              { icon: Star, title: "EARN", desc: "Get paid per day for your work. Enjoy fast, direct payments from verified employers." }
            ].map((step, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.2 }}
                className="text-center relative z-10"
              >
                <motion.div 
                  whileHover={{ rotate: [0, -10, 10, -5, 5, 0] }}
                  transition={{ duration: 0.5 }}
                  className="w-24 h-24 bg-[#F5C518] rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-xl shadow-[#F5C518]/20 ring-8 ring-white"
                >
                  <step.icon className="w-10 h-10 text-[#1A1A1A]" />
                </motion.div>
                <div className="inline-block bg-[#1A1A1A] text-white text-xs font-bold px-4 py-1.5 rounded-full mb-6">
                  STEP 0{i + 1}
                </div>
                <h3 className="text-2xl font-bold text-[#1A1A1A] mb-4">{step.title}</h3>
                <p className="text-gray-600 text-lg">
                  {step.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* For Job Seekers Section */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-white -z-10" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <span className="inline-block bg-[#F5C518]/20 text-[#1A1A1A] text-sm font-bold tracking-wider uppercase px-5 py-2 rounded-full mb-6">
                For Kerala Job Seekers
              </span>
              <h2 className="text-3xl md:text-5xl font-extrabold text-[#1A1A1A] mb-6 leading-tight">
                Employers are looking for <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F5C518] to-orange-500">someone like you.</span>
              </h2>
              <p className="text-gray-600 text-lg lg:text-xl mb-10 leading-relaxed">
                Don't let your perfect part-time gig slip away. Create a profile in minutes,
                set your availability, and let local businesses across Kerala find you.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => onNavigate('signup')} className="btn-primary text-lg px-8 py-4">
                  Create Free Profile
                </motion.button>
                <motion.button whileHover={{ scale: 1.05, backgroundColor: "#f3f4f6" }} whileTap={{ scale: 0.95 }} onClick={() => onNavigate('employer-signup')} className="btn-outline text-lg px-8 py-4 border-2">
                  Post a Job
                </motion.button>
              </div>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {[
                { icon: Briefcase, title: "500+ Jobs", sub: "Posted weekly in Kerala", color: "bg-[#F5C518]", text: "text-[#1A1A1A]", delay: 0 },
                { icon: Shield, title: "100% Verified", sub: "Thorough KYC checks", color: "bg-green-500", text: "text-white", delay: 0.1 },
                { icon: Clock, title: "Flexible", sub: "Study & work balance", color: "bg-blue-500", text: "text-white", delay: 0.2 },
                { icon: Star, title: "4.8 Rating", sub: "By Indian students", color: "bg-purple-500", text: "text-white", delay: 0.3 }
              ].map((stat, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: stat.delay }}
                  whileHover={{ y: -8 }}
                  className="bg-white rounded-3xl p-8 border border-gray-100 shadow-2xl shadow-gray-200/50"
                >
                  <div className={`w-14 h-14 ${stat.color} rounded-2xl flex items-center justify-center mb-6`}>
                    <stat.icon className={`w-7 h-7 ${stat.text}`} />
                  </div>
                  <p className="font-extrabold text-[#1A1A1A] text-2xl mb-1">{stat.title}</p>
                  <p className="font-medium text-gray-500">{stat.sub}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Dynamic Student Success Stories Carousel */}
      <section className="py-24 bg-[#1A1A1A] overflow-hidden relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-4">
              Student <span className="text-[#F5C518]">Success Stories</span>
            </h2>
            <p className="text-gray-400 text-lg">Hear from students across Kerala who found their perfect gig.</p>
          </motion.div>
        </div>

        <div className="ml-4 sm:ml-6 lg:ml-8 pl-0">
          <motion.div 
            drag="x"
            dragConstraints={{ right: 0, left: -800 }}
            className="flex gap-6 cursor-grab active:cursor-grabbing pb-8 pr-8"
          >
            {[
              { name: "Arjun K.", role: "Library Assistant", city: "Trivandrum", quote: "I was struggling to find a job that fit my university schedule. AfterBell matched me with a role just 2km from my hostel." },
              { name: "Meera Nair", role: "Part-time Tutor", city: "Kochi", quote: "The verification process made me feel incredibly safe. Now I teach math every weekend and earn enough for all my expenses!" },
              { name: "Vishnu Pillai", role: "Cafe Staff", city: "Kozhikode", quote: "Got hired within 24 hours of uploading my profile. The interactive map is a game changer for finding hyper-local jobs." },
              { name: "Sneha P.", role: "Retail Helper", city: "Thrissur", quote: "No more waiting weeks for callbacks. The instant messaging with employers directly on AfterBell is fantastic." }
            ].map((story, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -5, scale: 1.02 }}
                className="w-[350px] md:w-[450px] shrink-0 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl relative overflow-hidden"
              >
                <Quote className="absolute top-6 right-6 w-12 h-12 text-[#F5C518]/20" />
                <p className="text-gray-300 text-lg mb-8 leading-relaxed relative z-10">"{story.quote}"</p>
                <div className="flex items-center gap-4 relative z-10">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#F5C518] to-orange-500 rounded-full flex items-center justify-center text-xl font-bold text-[#1A1A1A]">
                    {story.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="text-white font-bold">{story.name}</h4>
                    <p className="text-gray-400 text-sm">{story.role} • {story.city}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#1A1A1A] pt-20 pb-10 border-t-8 border-[#F5C518]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
            <div>
              <button onClick={() => onNavigate('landing')} className="flex items-center gap-2 mb-6 group">
                <div className="w-12 h-12 bg-[#F5C518] rounded-xl flex items-center justify-center group-hover:rotate-12 transition-transform">
                  <Bell className="w-6 h-6 text-[#1A1A1A]" />
                </div>
                <span className="text-2xl font-bold text-white">AfterBell</span>
              </button>
              <p className="text-gray-400 text-lg leading-relaxed mix-blend-lighten">
                Connecting students with local opportunities. Building the workforce of tomorrow across Kerala and beyond.
              </p>
            </div>

            {[
              { title: "For Students", links: [ { t: 'Browse Jobs', a: 'login' }, { t: 'Career Advice', a: 'career-advice'}, { t: 'Safety Tips', a: 'safety-tips'} ] },
              { title: "For Employers", links: [ { t: 'Post a Job', a: 'employer-signup' }, { t: 'Success Stories', a: 'success-stories'}, { t: 'Verification Process', a: 'verification-process'} ] },
              { title: "Support", links: [ { t: 'Help Center', a: 'help' }, { t: 'Contact Us', a: 'contact-us'}, { t: 'Privacy Policy', a: 'privacy-policy'} ] }
            ].map((col, idx) => (
              <div key={idx}>
                <h4 className="text-white font-bold text-xl mb-6">{col.title}</h4>
                <ul className="space-y-4">
                  {col.links.map((link, lidx) => (
                    <li key={lidx}>
                      <button 
                        onClick={() => onNavigate(link.a as PageView)} 
                        className="text-gray-400 font-medium hover:text-[#F5C518] hover:translate-x-1 transition-all flex items-center gap-2"
                      >
                         {link.t}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-500 font-medium">
              © 2026 AfterBell Inc. All rights reserved.
            </p>
            <div className="flex gap-4">
              <span className="w-10 h-10 bg-white/5 rounded-full"></span>
              <span className="w-10 h-10 bg-white/5 rounded-full"></span>
              <span className="w-10 h-10 bg-white/5 rounded-full"></span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
