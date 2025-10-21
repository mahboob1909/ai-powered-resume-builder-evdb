import React, { useEffect, useRef } from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';

interface ParallaxHeroProps {
  onGetStarted: () => void;
}

const ParallaxHero: React.FC<ParallaxHeroProps> = ({ onGetStarted }) => {
  const heroRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!heroRef.current || !bgRef.current || !contentRef.current) return;

      const scrolled = window.pageYOffset;
      const heroHeight = heroRef.current.offsetHeight;
      const scrollProgress = Math.min(scrolled / heroHeight, 1);

      // Parallax effect for background
      bgRef.current.style.transform = `translateY(${scrolled * 0.5}px)`;
      
      // Fade out content as user scrolls
      contentRef.current.style.opacity = `${1 - scrollProgress * 0.8}`;
      contentRef.current.style.transform = `translateY(${scrolled * 0.3}px)`;
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section ref={heroRef} className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Animated Background */}
      <div ref={bgRef} className="absolute inset-0 bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        {/* Animated particles */}
        <div className="absolute inset-0">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-white dark:bg-blue-400 rounded-full opacity-20 dark:opacity-30 animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 10}s`,
                animationDuration: `${10 + Math.random() * 20}s`,
              }}
            />
          ))}
        </div>
        
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-blue-900/50 dark:from-gray-900/70 to-transparent" />
      </div>

      {/* Hero Content */}
      <div ref={contentRef} className="relative z-10 text-center text-white px-6 max-w-5xl mx-auto">
        <div className="flex items-center justify-center mb-6">
          <Sparkles className="h-8 w-8 text-orange-400 dark:text-orange-300 mr-3 animate-pulse" />
          <span className="text-orange-400 dark:text-orange-300 font-semibold text-lg tracking-wide">
            AI-POWERED RESUME BUILDER
          </span>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
          Build Your Future.
          <br />
          <span className="bg-gradient-to-r from-blue-400 to-orange-400 dark:from-blue-300 dark:to-orange-300 bg-clip-text text-transparent">
            Land Your Dream Job.
          </span>
        </h1>
        
        <p className="text-xl md:text-2xl text-blue-100 dark:text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
          Create professional, ATS-optimized resumes with intelligent AI suggestions. 
          Stand out from the crowd and get noticed by top employers.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={onGetStarted}
            className="group bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 dark:from-orange-600 dark:to-orange-700 dark:hover:from-orange-700 dark:hover:to-orange-800 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl flex items-center"
          >
            Create My Resume for Free
            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-200" />
          </button>
          
          <div className="text-sm text-blue-200 dark:text-gray-400">
            ✨ No credit card required • Get started in 2 minutes
          </div>
        </div>
        
        {/* Stats */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div>
            <div className="text-3xl font-bold text-orange-400 dark:text-orange-300 mb-2">500K+</div>
            <div className="text-blue-200 dark:text-gray-400">Resumes Created</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-orange-400 dark:text-orange-300 mb-2">95%</div>
            <div className="text-blue-200 dark:text-gray-400">Success Rate</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-orange-400 dark:text-orange-300 mb-2">4.9/5</div>
            <div className="text-blue-200 dark:text-gray-400">User Rating</div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white dark:border-gray-300 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white dark:bg-gray-300 rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>
  );
};

export default ParallaxHero;