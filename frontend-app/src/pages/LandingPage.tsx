import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { FileText, Sparkles, Download, CheckCircle, Star, Users, ArrowRight } from 'lucide-react';
import AuthModal from '../components/AuthModal';
import ParallaxHero from '../components/ParallaxHero';
import ThemeToggle from '../components/ThemeToggle';

const LandingPage: React.FC = () => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('register');
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleGetStarted = () => {
    setAuthMode('register');
    setShowAuthModal(true);
  };

  const handleSignIn = () => {
    setAuthMode('login');
    setShowAuthModal(true);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-dark-950 transition-colors duration-300">
      {/* Navigation */}
      <nav className="absolute top-0 left-0 right-0 z-50 px-6 py-4 backdrop-blur-sm bg-dark-950/30">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <FileText className="h-8 w-8 text-brand-gold" />
            <span className="text-2xl font-bold text-gradient-gold">ResumeAI</span>
          </div>
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <button
              onClick={handleSignIn}
              className="text-white hover:text-brand-gold dark:text-gray-200 dark:hover:text-brand-gold transition-colors duration-300 font-medium"
            >
              Sign In
            </button>
            <button
              onClick={handleGetStarted}
              className="bg-gradient-gold text-dark-950 px-6 py-2.5 rounded-lg font-bold shadow-gold hover:shadow-gold-lg transition-all duration-300 transform hover:scale-105"
            >
              Get Started Free
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section with Parallax */}
      <ParallaxHero onGetStarted={handleGetStarted} />

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white dark:from-dark-900 dark:to-dark-950 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Why Choose <span className="text-gradient-gold">ResumeAI</span>?
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Our AI-powered platform combines cutting-edge technology with professional design
              to help you create resumes that get noticed.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-dark-900 p-8 rounded-xl shadow-soft hover:shadow-gold border-2 border-transparent hover:border-brand-gold/30 transition-all duration-300 group">
              <div className="w-16 h-16 bg-gradient-gold rounded-lg flex items-center justify-center mb-6 group-hover:animate-bounce-subtle">
                <Sparkles className="h-8 w-8 text-dark-950" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">AI-Powered Content</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Get intelligent suggestions for bullet points, job descriptions, and skills
                tailored to your industry and experience level.
              </p>
            </div>

            <div className="bg-white dark:bg-dark-900 p-8 rounded-xl shadow-soft hover:shadow-gold border-2 border-transparent hover:border-brand-gold/30 transition-all duration-300 group">
              <div className="w-16 h-16 bg-brand-pirate-gold rounded-lg flex items-center justify-center mb-6 group-hover:animate-bounce-subtle">
                <FileText className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">ATS Optimized</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Ensure your resume passes through Applicant Tracking Systems with our
                optimized formatting and keyword suggestions.
              </p>
            </div>

            <div className="bg-white dark:bg-dark-900 p-8 rounded-xl shadow-soft hover:shadow-gold border-2 border-transparent hover:border-brand-gold/30 transition-all duration-300 group">
              <div className="w-16 h-16 bg-brand-yukon-gold rounded-lg flex items-center justify-center mb-6 group-hover:animate-bounce-subtle">
                <Download className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Professional Templates</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Choose from our collection of modern, professionally designed templates
                that make a great first impression.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 bg-white dark:bg-dark-950 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Choose Your <span className="text-gradient-gold">Plan</span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Start free and upgrade as you grow
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Free Plan */}
            <div className="bg-white dark:bg-dark-900 border-2 border-gray-200 dark:border-dark-800 rounded-xl p-8 hover:border-brand-gold/30 transition-all duration-300 hover:shadow-soft">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Free</h3>
              <div className="text-4xl font-bold text-gray-900 dark:text-white mb-6">$0<span className="text-lg text-gray-600 dark:text-gray-400">/month</span></div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-brand-gold mr-3" />
                  <span className="text-gray-700 dark:text-gray-300">3 resume downloads</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-brand-gold mr-3" />
                  <span className="text-gray-700 dark:text-gray-300">Basic templates</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-brand-gold mr-3" />
                  <span className="text-gray-700 dark:text-gray-300">AI content suggestions</span>
                </li>
              </ul>
              <button
                onClick={handleGetStarted}
                className="w-full bg-dark-900 dark:bg-dark-800 text-white py-3 rounded-lg hover:bg-dark-800 dark:hover:bg-dark-700 border border-brand-gold/20 transition-all duration-300 font-semibold"
              >
                Get Started
              </button>
            </div>

            {/* Pro Plan */}
            <div className="bg-gradient-to-br from-brand-gold/10 to-brand-pirate-gold/10 dark:from-brand-gold/5 dark:to-brand-pirate-gold/5 border-2 border-brand-gold rounded-xl p-8 relative transition-all duration-300 shadow-gold hover:shadow-gold-lg transform hover:scale-105">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-gradient-gold text-dark-950 px-4 py-2 rounded-full text-sm font-bold shadow-gold">
                  Most Popular
                </span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Pro</h3>
              <div className="text-4xl font-bold text-gray-900 dark:text-white mb-6">$19<span className="text-lg text-gray-600 dark:text-gray-400">/month</span></div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-brand-gold mr-3" />
                  <span className="text-gray-700 dark:text-gray-300">Unlimited downloads</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-brand-gold mr-3" />
                  <span className="text-gray-700 dark:text-gray-300">Premium templates</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-brand-gold mr-3" />
                  <span className="text-gray-700 dark:text-gray-300">Advanced AI features</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-brand-gold mr-3" />
                  <span className="text-gray-700 dark:text-gray-300">Cover letter builder</span>
                </li>
              </ul>
              <button
                onClick={handleGetStarted}
                className="w-full bg-gradient-gold text-dark-950 py-3 rounded-lg font-bold shadow-gold hover:shadow-gold-lg transition-all duration-300 transform hover:scale-105"
              >
                Start Pro Trial
              </button>
            </div>

            {/* Executive Plan */}
            <div className="bg-white dark:bg-dark-900 border-2 border-gray-200 dark:border-dark-800 rounded-xl p-8 hover:border-brand-gold/30 transition-all duration-300 hover:shadow-soft">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Executive</h3>
              <div className="text-4xl font-bold text-gray-900 dark:text-white mb-6">$39<span className="text-lg text-gray-600 dark:text-gray-400">/month</span></div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-brand-gold mr-3" />
                  <span className="text-gray-700 dark:text-gray-300">Everything in Pro</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-brand-gold mr-3" />
                  <span className="text-gray-700 dark:text-gray-300">LinkedIn integration</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-brand-gold mr-3" />
                  <span className="text-gray-700 dark:text-gray-300">Interview prep tools</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-brand-gold mr-3" />
                  <span className="text-gray-700 dark:text-gray-300">Priority support</span>
                </li>
              </ul>
              <button
                onClick={handleGetStarted}
                className="w-full bg-brand-pirate-gold hover:bg-brand-yukon-gold text-white py-3 rounded-lg transition-all duration-300 font-bold shadow-lg hover:shadow-xl"
              >
                Start Executive Trial
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-dark-950 border-t border-brand-gold/20 text-white py-16 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <FileText className="h-8 w-8 text-brand-gold" />
                <span className="text-2xl font-bold text-gradient-gold">ResumeAI</span>
              </div>
              <p className="text-gray-400">
                Empowering job seekers worldwide with AI-powered resume building tools.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-bold mb-4 text-brand-gold">Product</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-brand-gold transition-colors duration-300">Features</a></li>
                <li><a href="#" className="hover:text-brand-gold transition-colors duration-300">Templates</a></li>
                <li><a href="#" className="hover:text-brand-gold transition-colors duration-300">Pricing</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-bold mb-4 text-brand-gold">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-brand-gold transition-colors duration-300">About</a></li>
                <li><a href="#" className="hover:text-brand-gold transition-colors duration-300">Careers</a></li>
                <li><a href="#" className="hover:text-brand-gold transition-colors duration-300">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-bold mb-4 text-brand-gold">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-brand-gold transition-colors duration-300">Help Center</a></li>
                <li><a href="#" className="hover:text-brand-gold transition-colors duration-300">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-brand-gold transition-colors duration-300">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-brand-gold/20 pt-8 text-center text-gray-400">
            <p>&copy; 2024 ResumeAI. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Auth Modal */}
      {showAuthModal && (
        <AuthModal
          mode={authMode}
          onClose={() => setShowAuthModal(false)}
          onSwitchMode={(mode) => setAuthMode(mode)}
        />
      )}
    </div>
  );
};

export default LandingPage;