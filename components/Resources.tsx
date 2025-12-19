
import React, { useState, useEffect } from 'react';
import { getRecommendedResources } from '../services/geminiService';
import { UserProfile } from '../types';

interface ResourcesProps {
  profile: UserProfile;
}

const Resources: React.FC<ResourcesProps> = ({ profile }) => {
  const [topic, setTopic] = useState('');
  const [resources, setResources] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchResources = async () => {
    if (!topic) return;
    setLoading(true);
    try {
      const data = await getRecommendedResources(topic, profile.preferredLanguages[0]);
      setResources(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto w-full space-y-8">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-3xl p-10 text-white shadow-2xl">
        <h2 className="text-4xl font-bold mb-4">Resource Center</h2>
        <p className="text-blue-100 text-lg">Find the best hand-picked materials to deep dive into any concept.</p>
        
        <div className="mt-8 flex gap-4">
          <input
            type="text"
            value={topic}
            onChange={e => setTopic(e.target.value)}
            placeholder="Search for resources (e.g. Docker, Python Pandas, Data Structures)"
            className="flex-1 bg-white/10 border border-white/20 rounded-2xl px-6 py-4 focus:outline-none focus:bg-white/20 text-white placeholder-blue-200"
          />
          <button 
            onClick={fetchResources}
            disabled={loading}
            className="bg-white text-blue-700 px-8 py-4 rounded-2xl font-bold hover:bg-blue-50 transition-colors disabled:opacity-50"
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {resources.map((res, i) => (
          <div key={i} className="bg-gray-800 border border-gray-700 rounded-3xl p-8 hover:border-blue-500/50 transition-all flex flex-col group">
            <div className="flex justify-between items-start mb-4">
              <span className="text-xs font-bold uppercase tracking-widest text-blue-400 bg-blue-400/10 px-3 py-1 rounded-full">{res.type}</span>
              <span className="text-2xl group-hover:scale-110 transition-transform">
                {res.type === 'Video' ? '🎥' : res.type === 'Repo' ? '📦' : res.type === 'Document' ? '📖' : '🔗'}
              </span>
            </div>
            <h3 className="text-xl font-bold mb-2">{res.title}</h3>
            <p className="text-gray-400 text-sm leading-relaxed mb-6 flex-1">{res.description}</p>
            <a 
              href={res.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-blue-400 font-bold hover:text-blue-300 transition-colors"
            >
              Explore Resource
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
            </a>
          </div>
        ))}
      </div>
      
      {resources.length === 0 && !loading && (
        <div className="text-center py-20 opacity-30 italic">
          Try searching for a topic to see tailored recommendations.
        </div>
      )}
    </div>
  );
};

export default Resources;
