import React, { useState, useEffect } from 'react';
import { School, Sparkles, RefreshCcw, ArrowRight, Loader2, BookOpen, Globe2, Share2, Download } from 'lucide-react';
import { UserProfile, CourseRecommendation, ViewState } from './types';
import { Input } from './components/Input';
import { Select } from './components/Select';
import { CourseCard } from './components/CourseCard';
import { getCourseRecommendations } from './services/geminiService';

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>('onboarding');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [recommendations, setRecommendations] = useState<CourseRecommendation[]>([]);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstallBtn, setShowInstallBtn] = useState(false);
  
  const [profile, setProfile] = useState<UserProfile>({
    name: '',
    city: '',
    country: '',
    residency: 'Resident',
    interests: ''
  });

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallBtn(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setShowInstallBtn(false);
    }
    setDeferredPrompt(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfile(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile.name || !profile.city || !profile.country || !profile.interests) {
        alert("Please fill in all required fields");
        return;
    }

    setLoading(true);
    setView('loading');
    setError(null);

    try {
      const results = await getCourseRecommendations(profile);
      setRecommendations(results);
      setView('results');
    } catch (err) {
      setError("We encountered an issue getting your personalized university list. Please try again.");
      setView('error');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setRecommendations([]);
    setError(null);
    setView('onboarding');
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'My University Recommendations',
          text: `Here are the top university recommendations for ${profile.name} based on interests in ${profile.interests}:\n\n` + 
                recommendations.map(r => `• ${r.courseName} at ${r.university} (${r.location})`).join('\n'),
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error sharing', error);
      }
    } else {
      // Fallback for desktop browsers that don't support share
      alert("Sharing is best supported on mobile devices!");
    }
  };

  const renderOnboarding = () => (
    <div className="max-w-md mx-auto animate-fade-in">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-indigo-100 text-indigo-600 mb-4 shadow-sm">
          <School size={32} />
        </div>
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Future Path Finder</h1>
        <p className="text-slate-500 mb-4">Discover your ideal university undergraduate program based on your location and interests.</p>
        
        {showInstallBtn && (
          <button 
            onClick={handleInstallClick}
            className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700 text-sm font-semibold rounded-full hover:bg-indigo-100 transition-colors mb-4"
          >
            <Download size={16} /> Install App
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <Input 
          label="Student Name"
          name="name"
          placeholder="e.g., Alex Smith"
          value={profile.name}
          onChange={handleInputChange}
          required
        />
        
        <div className="grid grid-cols-2 gap-4">
          <Input 
            label="City"
            name="city"
            placeholder="e.g., London"
            value={profile.city}
            onChange={handleInputChange}
            required
          />
          <Input 
            label="Country"
            name="country"
            placeholder="e.g., UK"
            value={profile.country}
            onChange={handleInputChange}
            required
          />
        </div>

        <Select 
          label="Residency Status"
          name="residency"
          value={profile.residency}
          onChange={handleInputChange}
          options={[
            { value: 'Resident', label: 'Resident / Citizen' },
            { value: 'International', label: 'International Student' }
          ]}
        />

        <div className="flex flex-col gap-1.5 mb-6">
          <label className="text-sm font-medium text-slate-700">
            Interest Areas for Higher Studies
          </label>
          <textarea
            name="interests"
            rows={3}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
            placeholder="e.g., Artificial Intelligence, Robotics, Physics, Digital Art..."
            value={profile.interests}
            onChange={handleInputChange}
            required
          />
          <p className="text-xs text-slate-400">Be specific! The more details, the better recommendations.</p>
        </div>

        <button 
          type="submit" 
          className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3.5 rounded-xl transition-all active:scale-[0.98] shadow-lg shadow-indigo-600/20"
        >
          Find Universities <ArrowRight size={18} />
        </button>
      </form>
    </div>
  );

  const renderLoading = () => (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-6">
      <div className="relative mb-8">
        <div className="absolute inset-0 bg-indigo-500 blur-xl opacity-20 animate-pulse rounded-full"></div>
        <div className="relative bg-white p-4 rounded-full shadow-lg">
          <Loader2 className="animate-spin text-indigo-600" size={48} />
        </div>
      </div>
      <h2 className="text-xl font-bold text-slate-900 mb-2">Analyzing Universities...</h2>
      <p className="text-slate-500 max-w-xs mx-auto">
        Checking global programs, fee structures, and eligibility requirements for {profile.name}.
      </p>
    </div>
  );

  const renderError = () => (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-6">
      <div className="bg-red-50 text-red-500 p-4 rounded-full mb-6">
        <RefreshCcw size={32} />
      </div>
      <h2 className="text-xl font-bold text-slate-900 mb-2">Oops! Analysis Failed</h2>
      <p className="text-slate-500 mb-8 max-w-xs mx-auto">{error}</p>
      <button 
        onClick={handleReset}
        className="px-6 py-3 bg-slate-900 text-white rounded-xl font-medium hover:bg-slate-800 transition-colors"
      >
        Try Again
      </button>
    </div>
  );

  const renderResults = () => (
    <div className="max-w-md mx-auto pb-20 animate-fade-in">
      <div className="bg-indigo-600 text-white p-6 rounded-b-3xl shadow-xl shadow-indigo-900/10 mb-8 -mx-4 md:mx-0 md:rounded-3xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10 transform translate-x-1/4 -translate-y-1/4">
          <Globe2 size={120} />
        </div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-2 text-indigo-200 text-sm font-medium mb-1">
            <BookOpen size={16} />
            <span>Higher Education Plan</span>
          </div>
          <h1 className="text-2xl font-bold mb-2">Hello, {profile.name}!</h1>
          <p className="text-indigo-100 text-sm leading-relaxed opacity-90">
            Based on your interest in <strong>{profile.interests}</strong>, we've selected these university programs for you.
          </p>
        </div>
      </div>

      <div className="px-4 md:px-0">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-slate-900">Recommended Programs</h2>
          <div className="flex items-center gap-2">
            {navigator.share && (
              <button 
                onClick={handleShare}
                className="p-2 text-indigo-600 bg-indigo-50 rounded-full hover:bg-indigo-100 transition-colors"
                title="Share Results"
              >
                <Share2 size={18} />
              </button>
            )}
            <span className="text-xs font-semibold bg-slate-100 text-slate-700 px-2.5 py-1 rounded-full">
              {recommendations.length} Matches
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          {recommendations.map((course, idx) => (
            <CourseCard key={idx} course={course} index={idx} />
          ))}
        </div>

        <button 
          onClick={handleReset}
          className="w-full mt-8 py-4 text-slate-500 text-sm font-medium hover:text-slate-800 transition-colors flex items-center justify-center gap-2"
        >
          <RefreshCcw size={14} /> Start New Search
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 md:py-8">
      {view === 'onboarding' && <div className="p-4">{renderOnboarding()}</div>}
      {view === 'loading' && renderLoading()}
      {view === 'results' && renderResults()}
      {view === 'error' && renderError()}
    </div>
  );
};

export default App;