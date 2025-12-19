
import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import TutorChat from './components/TutorChat';
import PracticeLab from './components/PracticeLab';
import MistakeHistory from './components/MistakeHistory';
import Profile from './components/Profile';
import Resources from './components/Resources';
import { UserProfile, UserRole } from './types';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('tutor');
  const [profile, setProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('codemaster_profile');
    if (saved) return JSON.parse(saved);
    return {
      name: 'Future Dev',
      role: UserRole.BEGINNER,
      preferredLanguages: ['Python', 'JavaScript'],
      mistakes: [],
      completedLessons: [],
      points: 0,
    };
  });

  useEffect(() => {
    localStorage.setItem('codemaster_profile', JSON.stringify(profile));
  }, [profile]);

  const updateProfile = (updates: Partial<UserProfile>) => {
    setProfile(prev => ({ ...prev, ...updates }));
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'tutor': return <TutorChat profile={profile} />;
      case 'practice': return <PracticeLab profile={profile} onUpdateProfile={updateProfile} />;
      case 'history': return <MistakeHistory profile={profile} />;
      case 'profile': return <Profile profile={profile} />;
      case 'resources': return <Resources profile={profile} />;
      default: return <TutorChat profile={profile} />;
    }
  };

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
      <header className="bg-gray-900/80 backdrop-blur-md border-b border-gray-800 px-8 py-4 sticky top-0 z-10 flex justify-between items-center">
        <h2 className="text-lg font-bold">
          {activeTab === 'tutor' ? 'Personal AI Tutor' : 
           activeTab === 'practice' ? 'Coding Lab' : 
           activeTab === 'history' ? 'Mistake Journal' : 
           activeTab === 'resources' ? 'Learning Resources' : 'My Dashboard'}
        </h2>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-blue-900/30 px-3 py-1.5 rounded-full border border-blue-500/30">
            <span className="text-blue-400 font-bold">{profile.points}</span>
            <span className="text-xs text-blue-400 font-medium">XP</span>
          </div>
          <div className="w-8 h-8 rounded-full bg-gray-700 overflow-hidden border border-gray-600">
            <img src={`https://picsum.photos/seed/${profile.name}/40/40`} alt="Avatar" />
          </div>
        </div>
      </header>
      
      <div className="flex-1 overflow-hidden">
        {renderContent()}
      </div>
    </Layout>
  );
};

export default App;
