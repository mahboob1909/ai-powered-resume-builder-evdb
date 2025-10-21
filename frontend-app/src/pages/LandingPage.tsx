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
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
      {/* Navigation */}
      <nav className="absolute top-0 left-0 right-0 z-50 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <FileText className="h-8 w-8 text-blue-600" />
            <span className="text-2xl font-bold text-white dark:text-white">ResumeAI</span>
          </div>
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <button
              onClick={handleSignIn}
              className="text-white hover:text-blue-200 dark:text-gray-200 dark:hover:text-blue-300 transition-colors duration-200"
            >
              Sign In
            </button>
            <button
              onClick={handleGetStarted}
              className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg transition-all duration-200 transform hover:scale-105"
            >
              Get Started Free
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section with Parallax */}
      <ParallaxHero onGetStarted={handleGetStarted} />

      {/* Features Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Why Choose ResumeAI?
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Our AI-powered platform combines cutting-edge technology with professional design 
              to help you create resumes that get noticed.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-gray-700 p-8 rounded-xl shadow-lg hover:shadow-xl dark:shadow-gray-900/20 transition-all duration-300">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mb-6">
                <Sparkles className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">AI-Powered Content</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Get intelligent suggestions for bullet points, job descriptions, and skills 
                tailored to your industry and experience level.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-700 p-8 rounded-xl shadow-lg hover:shadow-xl dark:shadow-gray-900/20 transition-all duration-300">
              <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center mb-6">
                <FileText className="h-8 w-8 text-orange-600 dark:text-orange-400" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">ATS Optimized</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Ensure your resume passes through Applicant Tracking Systems with our 
                optimized formatting and keyword suggestions.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-700 p-8 rounded-xl shadow-lg hover:shadow-xl dark:shadow-gray-900/20 transition-all duration-300">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center mb-6">
                <Download className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Professional Templates</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Choose from our collection of modern, professionally designed templates 
                that make a great first impression.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 bg-white dark:bg-gray-900 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Choose Your Plan
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Start free and upgrade as you grow
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Free Plan */}
            <div className="bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-600 rounded-xl p-8 transition-colors duration-300">
              <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Free</h3>
              <div className="text-4xl font-bold text-gray-900 dark:text-white mb-6">$0<span className="text-lg text-gray-600 dark:text-gray-400">/month</span></div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 dark:text-green-400 mr-3" />
                  <span className="text-gray-700 dark:text-gray-300">3 resume downloads</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 dark:text-green-400 mr-3" />
                  <span className="text-gray-700 dark:text-gray-300">Basic templates</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 dark:text-green-400 mr-3" />
                  <span className="text-gray-700 dark:text-gray-300">AI content suggestions</span>
                </li>
              </ul>
              <button
                onClick={handleGetStarted}
                className="w-full bg-gray-900 dark:bg-gray-700 text-white py-3 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-600 transition-colors duration-200"
              >
                Get Started
              </button>
            </div>

            {/* Pro Plan */}
            <div className="bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-500 dark:border-blue-400 rounded-xl p-8 relative transition-colors duration-300">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-blue-500 dark:bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-semibold">
                  Most Popular
                </span>
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Pro</h3>
              <div className="text-4xl font-bold text-gray-900 dark:text-white mb-6">$19<span className="text-lg text-gray-600 dark:text-gray-400">/month</span></div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 dark:text-green-400 mr-3" />
                  <span className="text-gray-700 dark:text-gray-300">Unlimited downloads</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 dark:text-green-400 mr-3" />
                  <span className="text-gray-700 dark:text-gray-300">Premium templates</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 dark:text-green-400 mr-3" />
                  <span className="text-gray-700 dark:text-gray-300">Advanced AI features</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 dark:text-green-400 mr-3" />
                  <span className="text-gray-700 dark:text-gray-300">Cover letter builder</span>
                </li>
              </ul>
              <button
                onClick={handleGetStarted}
                className="w-full bg-blue-600 dark:bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors duration-200"
              >
                Start Pro Trial
              </button>
            </div>

            {/* Executive Plan */}
            <div className="bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-600 rounded-xl p-8 transition-colors duration-300">
              <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Executive</h3>
              <div className="text-4xl font-bold text-gray-900 dark:text-white mb-6">$39<span className="text-lg text-gray-600 dark:text-gray-400">/month</span></div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 dark:text-green-400 mr-3" />
                  <span className="text-gray-700 dark:text-gray-300">Everything in Pro</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 dark:text-green-400 mr-3" />
                  <span className="text-gray-700 dark:text-gray-300">LinkedIn integration</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 dark:text-green-400 mr-3" />
                  <span className="text-gray-700 dark:text-gray-300">Interview prep tools</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 dark:text-green-400 mr-3" />
                  <span className="text-gray-700 dark:text-gray-300">Priority support</span>
                </li>
              </ul>
              <button
                onClick={handleGetStarted}
                className="w-full bg-orange-600 dark:bg-orange-500 text-white py-3 rounded-lg hover:bg-orange-700 dark:hover:bg-orange-600 transition-colors duration-200"
              >
                Start Executive Trial
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 dark:bg-gray-950 text-white py-16 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <FileText className="h-8 w-8 text-blue-500 dark:text-blue-400" />
                <span className="text-2xl font-bold text-white">ResumeAI</span>
              </div>
              <p className="text-gray-400 dark:text-gray-500">
                Empowering job seekers worldwide with AI-powered resume building tools.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4 text-white">Product</h4>
              <ul className="space-y-2 text-gray-400 dark:text-gray-500">
                <li><a href="#" className="hover:text-white dark:hover:text-gray-300 transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white dark:hover:text-gray-300 transition-colors">Templates</a></li>
                <li><a href="#" className="hover:text-white dark:hover:text-gray-300 transition-colors">Pricing</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4 text-white">Company</h4>
              <ul className="space-y-2 text-gray-400 dark:text-gray-500">
                <li><a href="#" className="hover:text-white dark:hover:text-gray-300 transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white dark:hover:text-gray-300 transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-white dark:hover:text-gray-300 transition-colors">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4 text-white">Support</h4>
              <ul className="space-y-2 text-gray-400 dark:text-gray-500">
                <li><a href="#" className="hover:text-white dark:hover:text-gray-300 transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white dark:hover:text-gray-300 transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white dark:hover:text-gray-300 transition-colors">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 dark:border-gray-700 pt-8 text-center text-gray-400 dark:text-gray-500">
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