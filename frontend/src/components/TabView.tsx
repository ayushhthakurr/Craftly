import React from 'react';
import { Code2, Eye } from 'lucide-react';

interface TabViewProps {
  activeTab: 'code' | 'preview';
  onTabChange: (tab: 'code' | 'preview') => void;
}

export function TabView({ activeTab, onTabChange }: TabViewProps) {
  return (
    <div className="flex gap-1 px-5 py-4 border-b border-slate-700/50 bg-slate-900/40">
      <button
        onClick={() => onTabChange('code')}
        className={`flex items-center gap-2 px-4 py-2.5 rounded-lg transition-all duration-200 font-medium text-sm ${
          activeTab === 'code'
            ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-500/30'
            : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
        }`}
      >
        <Code2 className="w-4 h-4" />
        Code
      </button>
      <button
        onClick={() => onTabChange('preview')}
        className={`flex items-center gap-2 px-4 py-2.5 rounded-lg transition-all duration-200 font-medium text-sm ${
          activeTab === 'preview'
            ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-500/30'
            : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
        }`}
      >
        <Eye className="w-4 h-4" />
        Preview
      </button>
    </div>
  );
}