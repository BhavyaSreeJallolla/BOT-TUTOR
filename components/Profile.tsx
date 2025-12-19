
import React from 'react';
import { UserProfile, UserRole } from '../types';

interface ProfileProps {
  profile: UserProfile;
}

const Profile: React.FC<ProfileProps> = ({ profile }) => {
  const stats = [
    { label: 'Total Points', value: profile.points, icon: '💎' },
    { label: 'Mistakes Logged', value: profile.mistakes.length, icon: '📝' },
    { label: 'Lessons Mastered', value: profile.completedLessons.length, icon: '🎓' },
    { label: 'Skill Level', value: profile.role, icon: '🔥' },
  ];

  return (
    <div className="p-8 max-w-5xl mx-auto w-full space-y-8">
      <header className="flex items-center gap-6">
        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-4xl shadow-2xl border-4 border-gray-800">
          {profile.name[0]}
        </div>
        <div>
          <h2 className="text-4xl font-bold">{profile.name}</h2>
          <p className="text-gray-400">Coding enthusiast mastering {profile.preferredLanguages.join(', ')}</p>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {stats.map(s => (
          <div key={s.label} className="bg-gray-800 border border-gray-700 rounded-3xl p-6 shadow-lg">
            <span className="text-3xl mb-2 block">{s.icon}</span>
            <p className="text-xs text-gray-500 uppercase font-bold tracking-widest">{s.label}</p>
            <p className="text-2xl font-black mt-1">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-gray-800 border border-gray-700 rounded-3xl p-8">
          <h3 className="text-xl font-bold mb-6">Language Proficiency</h3>
          <div className="space-y-6">
            {profile.preferredLanguages.map(lang => (
              <div key={lang} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-bold">{lang}</span>
                  <span className="text-gray-500">Mastery: 65%</span>
                </div>
                <div className="h-3 bg-gray-900 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-blue-500 rounded-full" 
                    style={{ width: `${Math.random() * 40 + 40}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gray-800 border border-gray-700 rounded-3xl p-8">
          <h3 className="text-xl font-bold mb-6">Recent Mastery</h3>
          {profile.completedLessons.length > 0 ? (
            <div className="space-y-4">
              {profile.completedLessons.slice(-5).map((lesson, i) => (
                <div key={i} className="flex items-center gap-4 bg-gray-900/50 p-4 rounded-2xl border border-gray-700">
                  <span className="bg-green-500/20 text-green-400 w-8 h-8 rounded-lg flex items-center justify-center text-xs">✓</span>
                  <span className="font-medium">{lesson}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 opacity-30">
              <p>Complete challenges to earn mastery badges.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
