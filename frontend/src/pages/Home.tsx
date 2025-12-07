import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Wand2 } from 'lucide-react';
import axios from "axios";
import { BACKEND_URL } from '../config';

export function Home() {
  const [prompt, setPrompt] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim()) {
      navigate('/builder', { state: { prompt } });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-4">
      <div className="max-w-3xl w-full">
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl blur-2xl opacity-50 animate-pulse"></div>
              <div className="relative flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-2xl">
                <Wand2 className="w-10 h-10 text-white" />
              </div>
            </div>
          </div>
          <h1 className="text-5xl font-bold text-white mb-4 tracking-tight">
            Craftly       </h1>
          <p className="text-xl text-slate-300 leading-relaxed">
            Describe your dream website, and watch AI build it instantly
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-slate-800/40 backdrop-blur-sm rounded-2xl shadow-2xl border border-slate-700/50 p-8">
            <label className="block text-sm font-semibold text-slate-200 mb-3">
              What would you like to build?
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g., Build a modern e-commerce store with product grid, shopping cart, and checkout..."
              rows={5}
              className="w-full p-4 bg-slate-900/60 text-white border border-slate-600/50 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none placeholder-slate-500 text-base leading-relaxed transition-all"
            />
            <button
              type="submit"
              disabled={!prompt.trim()}
              className="w-full mt-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 disabled:from-slate-700 disabled:to-slate-700 text-white py-4 px-8 rounded-xl font-semibold text-lg transition-all duration-200 shadow-lg hover:shadow-2xl disabled:cursor-not-allowed disabled:opacity-50 flex items-center justify-center gap-3"
            >
              <Wand2 className="w-5 h-5" />
              Generate Website
            </button>
          </div>
          
          <p className="text-center text-sm text-slate-500">
            Powered by AI • Built with WebContainer
          </p>
        </form>
      </div>
    </div>
  );
}