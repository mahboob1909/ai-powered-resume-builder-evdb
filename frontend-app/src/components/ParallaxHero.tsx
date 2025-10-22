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
      <div ref={bgRef} className="absolute inset-0 bg-gradient-to-br from-dark-900 via-dark-950 to-black">
        {/* Animated particles */}
        <div className="absolute inset-0">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-brand-gold rounded-full opacity-30 animate-float"
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
        <div className="absolute inset-0 bg-gradient-to-t from-dark-950/80 to-transparent" />

        {/* Gold accent lines */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-1/4 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand-gold to-transparent"></div>
          <div className="absolute top-2/4 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand-gold to-transparent"></div>
          <div className="absolute top-3/4 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand-gold to-transparent"></div>
        </div>
      </div>

      {/* Hero Content */}
      <div ref={contentRef} className="relative z-10 text-center text-white px-6 max-w-5xl mx-auto">
        <div className="flex items-center justify-center mb-6">
          <Sparkles className="h-8 w-8 text-brand-gold mr-3 animate-pulse" />
          <span className="text-brand-gold font-bold text-lg tracking-widest">
            AI-POWERED RESUME BUILDER
          </span>
        </div>

        <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight text-shadow-dark">
          Build Your Future.
          <br />
          <span className="text-gradient-gold">
            Land Your Dream Job.
          </span>
        </h1>

        <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
          Create professional, ATS-optimized resumes with intelligent AI suggestions.
          Stand out from the crowd and get noticed by top employers.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={onGetStarted}
            className="group bg-gradient-gold text-dark-950 px-8 py-4 rounded-lg text-lg font-bold transition-all duration-300 transform hover:scale-105 shadow-gold hover:shadow-gold-lg flex items-center"
          >
            Create My Resume for Free
            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-200" />
          </button>

          <div className="text-sm text-brand-gold/80">
            ✨ No credit card required • Get started in 2 minutes
          </div>
        </div>

        {/* Stats */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="group">
            <div className="text-4xl font-bold text-gradient-gold mb-2 group-hover:animate-bounce-subtle">500K+</div>
            <div className="text-gray-400">Resumes Created</div>
          </div>
          <div className="group">
            <div className="text-4xl font-bold text-gradient-gold mb-2 group-hover:animate-bounce-subtle">95%</div>
            <div className="text-gray-400">Success Rate</div>
          </div>
          <div className="group">
            <div className="text-4xl font-bold text-gradient-gold mb-2 group-hover:animate-bounce-subtle">4.9/5</div>
            <div className="text-gray-400">User Rating</div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-brand-gold rounded-full flex justify-center">
          <div className="w-1 h-3 bg-brand-gold rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>
  );
};

export default ParallaxHero;