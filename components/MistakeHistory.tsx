
import React, { useState } from 'react';
import { UserProfile, Mistake } from '../types';

interface MistakeHistoryProps {
  profile: UserProfile;
}

const MistakeHistory: React.FC<MistakeHistoryProps> = ({ profile }) => {
  const [selectedMistake, setSelectedMistake] = useState<Mistake | null>(null);

  if (profile.mistakes.length === 0) {
    return (
      <div className="p-12 text-center max-w-lg mx-auto">
        <div className="bg-gray-800 border border-gray-700 rounded-3xl p-12 space-y-4">
          <span className="text-6xl">🏆</span>
          <h2 className="text-2xl font-bold">Your Journal is Clean!</h2>
          <p className="text-gray-400">You haven't made any recorded mistakes yet. Keep practicing to build your mistake memory!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full p-8 gap-8">
      <div className="w-1/3 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
        <h2 className="text-2xl font-bold mb-6">Mistake Memory</h2>
        {profile.mistakes.slice().reverse().map(m => (
          <button
            key={m.id}
            onClick={() => setSelectedMistake(m)}
            className={`w-full text-left p-4 rounded-2xl border transition-all ${
              selectedMistake?.id === m.id 
                ? 'bg-blue-600 border-blue-400 shadow-lg shadow-blue-900/30' 
                : 'bg-gray-800 border-gray-700 hover:bg-gray-750'
            }`}
          >
            <div className="flex justify-between items-start mb-1">
              <span className="font-bold text-sm truncate">{m.topic}</span>
              <span className="text-[10px] opacity-60">{new Date(m.timestamp).toLocaleDateString()}</span>
            </div>
            <div className="flex gap-2">
              <span className="text-xs bg-black/30 px-2 py-0.5 rounded uppercase font-mono">{m.language}</span>
              <span className="text-xs bg-red-500/20 text-red-300 px-2 py-0.5 rounded uppercase">{m.errorType}</span>
            </div>
          </button>
        ))}
      </div>

      <div className="flex-1 bg-gray-800 border border-gray-700 rounded-3xl p-8 overflow-y-auto shadow-2xl">
        {!selectedMistake ? (
          <div className="h-full flex flex-col items-center justify-center opacity-30 text-center">
            <span className="text-7xl mb-6">💡</span>
            <p className="text-xl">Select a mistake to analyze and review.</p>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-3xl font-bold">{selectedMistake.topic}</h3>
                <p className="text-gray-400 mt-1">Reviewing the error in {selectedMistake.language}</p>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-lg font-bold text-red-400">The Problematic Code</h4>
              <div className="bg-gray-950 rounded-2xl border border-red-500/20 p-6">
                <pre className="font-mono text-sm leading-relaxed overflow-x-auto text-red-200">
                  {selectedMistake.wrongCode}
                </pre>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-lg font-bold text-green-400">The Correction</h4>
              <div className="bg-gray-950 rounded-2xl border border-green-500/20 p-6">
                <pre className="font-mono text-sm leading-relaxed overflow-x-auto text-green-200">
                  {selectedMistake.correctCode}
                </pre>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-lg font-bold">Why it happened</h4>
              <div className="bg-gray-900/50 p-6 rounded-2xl border border-gray-700 text-gray-300 leading-relaxed">
                {selectedMistake.explanation}
              </div>
            </div>

            <div className="pt-6 border-t border-gray-700 flex gap-4">
              <button className="bg-blue-600 hover:bg-blue-500 px-6 py-3 rounded-xl font-bold transition-all">
                Retry Challenge
              </button>
              <button className="bg-gray-700 hover:bg-gray-600 px-6 py-3 rounded-xl font-bold transition-all">
                Mark as Learned
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MistakeHistory;
