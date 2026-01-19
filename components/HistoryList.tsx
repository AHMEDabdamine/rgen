
import React from 'react';
import { SavedResearch } from '../types';
import { Button } from './Button';

interface HistoryListProps {
  history: SavedResearch[];
  onSelect: (item: SavedResearch) => void;
  onDelete: (id: string) => void;
}

export const HistoryList: React.FC<HistoryListProps> = ({ history, onSelect, onDelete }) => {
  if (history.length === 0) return null;

  return (
    <div className="w-full space-y-4 no-print">
      <div className="flex items-center gap-2 mb-4">
        <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h3 className="text-xl font-bold text-slate-800">سجل الأبحاث السابقة</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {history.map((item) => (
          <div 
            key={item.id} 
            className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all group flex flex-col justify-between"
          >
            <div>
              <div className="flex justify-between items-start mb-2">
                <div className="flex gap-1">
                  <span className="text-[10px] font-bold px-1.5 py-0.5 bg-indigo-50 text-indigo-700 rounded-md">
                    {item.level}
                  </span>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 bg-emerald-50 text-emerald-700 rounded-md">
                    {item.language}
                  </span>
                </div>
                <span className="text-[10px] text-slate-400">
                  {new Date(item.timestamp).toLocaleDateString('ar-EG')}
                </span>
              </div>
              <h4 className="text-lg font-bold text-slate-800 mb-2 truncate" title={item.topic}>
                {item.topic}
              </h4>
            </div>
            
            <div className="flex gap-2 mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button 
                variant="outline" 
                className="flex-1 py-1.5 text-sm" 
                onClick={() => onSelect(item)}
              >
                عرض
              </Button>
              <button 
                onClick={() => onDelete(item.id)}
                className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                title="حذف"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
