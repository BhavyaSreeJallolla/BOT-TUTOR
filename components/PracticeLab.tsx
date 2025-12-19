
import React, { useState } from 'react';
import { generateChallenge, reviewCode } from '../services/geminiService';
import { Difficulty, UserProfile, Mistake } from '../types';

interface PracticeLabProps {
  profile: UserProfile;
  onUpdateProfile: (updates: Partial<UserProfile>) => void;
}

const PracticeLab: React.FC<PracticeLabProps> = ({ profile, onUpdateProfile }) => {
  const [topic, setTopic] = useState('');
  const [language, setLanguage] = useState(profile.preferredLanguages[0] || 'JavaScript');
  const [difficulty, setDifficulty] = useState<Difficulty>(Difficulty.EASY);
  const [challenge, setChallenge] = useState<any>(null);
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [review, setReview] = useState<any>(null);

  const startChallenge = async () => {
    if (!topic || !language) return;
    setLoading(true);
    setReview(null);
    try {
      const newChallenge = await generateChallenge(language, topic, difficulty);
      setChallenge(newChallenge);
      setCode(newChallenge.starterCode);
    } catch (err) {
      alert("Failed to generate challenge. Try a simpler topic.");
    } finally {
      setLoading(false);
    }
  };

  const submitCode = async () => {
    setLoading(true);
    try {
      const result = await reviewCode(code, language, challenge.description, profile);
      setReview(result);
      
      if (!result.isCorrect) {
        const newMistake: Mistake = {
          id: Date.now().toString(),
          language,
          topic,
          wrongCode: code,
          correctCode: result.correctedCode || '',
          errorType: result.errorType || 'Logical Error',
          explanation: result.explanation,
          timestamp: Date.now(),
        };
        onUpdateProfile({ 
          mistakes: [...profile.mistakes, newMistake],
          points: profile.points + 5 // Small pity points for trying
        });
      } else {
        onUpdateProfile({
          points: profile.points + 50,
          completedLessons: [...profile.completedLessons, topic]
        });
      }
    } catch (err) {
      alert("Review failed. Check your connection.");
    } finally {
      setLoading(false);
    }
  };

  if (!challenge) {
    return (
      <div className="p-8 max-w-2xl mx-auto w-full">
        <h2 className="text-3xl font-bold mb-6">Practice Lab</h2>
        <div className="bg-gray-800 border border-gray-700 rounded-3xl p-8 space-y-6 shadow-xl">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-400">Topic</label>
            <input
              type="text"
              value={topic}
              onChange={e => setTopic(e.target.value)}
              placeholder="e.g., Recursion, SQL Joins, Async/Await"
              className="w-full bg-gray-900 border border-gray-700 rounded-xl p-4 focus:ring-2 focus:ring-blue-500/50 outline-none"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-400">Language</label>
              <select
                value={language}
                onChange={e => setLanguage(e.target.value)}
                className="w-full bg-gray-900 border border-gray-700 rounded-xl p-4 outline-none"
              >
                {['JavaScript', 'TypeScript', 'Python', 'Java', 'C++', 'Go', 'Rust', 'SQL'].map(lang => (
                  <option key={lang} value={lang}>{lang}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-400">Difficulty</label>
              <select
                value={difficulty}
                onChange={e => setDifficulty(e.target.value as Difficulty)}
                className="w-full bg-gray-900 border border-gray-700 rounded-xl p-4 outline-none"
              >
                {Object.values(Difficulty).map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>
          </div>

          <button
            onClick={startChallenge}
            disabled={!topic || loading}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-blue-900/40 disabled:opacity-50"
          >
            {loading ? 'Generating Challenge...' : 'Start Training'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full p-6 gap-6 overflow-hidden">
      <div className="flex-1 flex flex-col gap-6 overflow-hidden">
        <div className="bg-gray-800 border border-gray-700 rounded-2xl p-6 overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold">{challenge.title}</h3>
            <span className={`px-3 py-1 rounded-full text-xs font-bold ${
              challenge.difficulty === Difficulty.HARD ? 'bg-red-500/20 text-red-400' :
              challenge.difficulty === Difficulty.MEDIUM ? 'bg-yellow-500/20 text-yellow-400' :
              'bg-green-500/20 text-green-400'
            }`}>
              {challenge.difficulty}
            </span>
          </div>
          <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">{challenge.description}</p>
        </div>

        <div className="flex-1 bg-gray-950 border border-gray-800 rounded-2xl flex flex-col overflow-hidden relative">
          <div className="bg-gray-800 border-b border-gray-700 px-4 py-2 flex items-center justify-between">
            <span className="text-sm font-mono text-gray-400">editor.{language.toLowerCase()}</span>
          </div>
          <textarea
            value={code}
            onChange={e => setCode(e.target.value)}
            spellCheck={false}
            className="flex-1 bg-transparent p-6 font-mono text-sm resize-none focus:outline-none text-blue-300 leading-relaxed"
          />
          <button
            onClick={submitCode}
            disabled={loading}
            className="absolute bottom-4 right-4 bg-green-600 hover:bg-green-500 text-white px-8 py-3 rounded-xl font-bold shadow-xl transition-all disabled:opacity-50"
          >
            {loading ? 'Reviewing...' : 'Submit Code'}
          </button>
        </div>
      </div>

      <div className="w-96 flex flex-col gap-6 overflow-hidden">
        <div className="flex-1 bg-gray-800 border border-gray-700 rounded-2xl p-6 overflow-y-auto">
          <h4 className="text-sm font-bold uppercase text-gray-500 mb-4 tracking-wider">Review Results</h4>
          {!review ? (
            <div className="h-full flex flex-col items-center justify-center text-center opacity-50">
              <span className="text-4xl mb-4">🤖</span>
              <p>Submit your code to get AI feedback.</p>
            </div>
          ) : (
            <div className="space-y-6">
              <div className={`p-4 rounded-xl flex items-center gap-3 ${
                review.isCorrect ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-red-500/20 text-red-400 border border-red-500/30'
              }`}>
                <span className="text-xl">{review.isCorrect ? '✅' : '❌'}</span>
                <span className="font-bold">{review.isCorrect ? 'Challenge Passed!' : 'Needs Improvement'}</span>
              </div>
              
              <div className="space-y-2">
                <h5 className="font-bold text-gray-100">Feedback</h5>
                <p className="text-gray-400 text-sm leading-relaxed">{review.feedback}</p>
              </div>

              {review.explanation && (
                <div className="space-y-2">
                  <h5 className="font-bold text-gray-100">Explanation</h5>
                  <p className="text-gray-400 text-sm leading-relaxed">{review.explanation}</p>
                </div>
              )}

              {!review.isCorrect && review.improvementSuggestions && (
                <div className="space-y-2">
                  <h5 className="font-bold text-gray-100">Quick Tips</h5>
                  <ul className="list-disc list-inside text-sm text-gray-400 space-y-1">
                    {review.improvementSuggestions.map((s: string, i: number) => (
                      <li key={i}>{s}</li>
                    ))}
                  </ul>
                </div>
              )}

              <button
                onClick={() => {
                  setChallenge(null);
                  setReview(null);
                }}
                className="w-full bg-gray-700 hover:bg-gray-600 py-3 rounded-xl transition-all"
              >
                Try Another
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PracticeLab;
