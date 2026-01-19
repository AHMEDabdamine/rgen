
import React, { useState } from 'react';
import { Button } from './Button';

interface ResearchDisplayProps {
  content: string;
  topic: string;
  onClear: () => void;
  onRegenerate: () => void;
  isLoading: boolean;
}

export const ResearchDisplay: React.FC<ResearchDisplayProps> = ({ content, topic, onClear, onRegenerate, isLoading }) => {
  const [isCopied, setIsCopied] = useState(false);
  const [fontSize, setFontSize] = useState(18);
  const [lineHeight, setLineHeight] = useState(1.6);
  const [direction, setDirection] = useState<'rtl' | 'ltr'>('rtl');

  const handlePrint = () => {
    window.print();
  };

  /**
   * Processes text to handle scientific notation like $H_2O$ or $X^2$
   */
  const processScientificNotation = (text: string): string => {
    return text.replace(/\$([^$]+)\$/g, (match, formula) => {
      let processed = formula
        .replace(/_([a-zA-Z0-9]+)/g, '<sub>$1</sub>')
        .replace(/\^([a-zA-Z0-9]+)/g, '<sup>$1</sup>');
      return `<span dir="ltr" style="display: inline-block;">${processed}</span>`;
    });
  };

  const convertToHTML = (text: string) => {
    const lines = text.split('\n');
    let html = `<div dir="${direction}" style="font-family: 'Arial', sans-serif; text-align: ${direction === 'rtl' ? 'right' : 'left'}; direction: ${direction}; font-size: ${fontSize}px; line-height: ${lineHeight};">`;
    let inList = false;

    lines.forEach((line) => {
      const trimmed = line.trim();
      const processedLine = processScientificNotation(trimmed);
      
      if (trimmed.startsWith('## ')) {
        if (inList) { html += '</ul>'; inList = false; }
        html += `<h2 style="color: #1e1b4b; border-bottom: 2px solid #e0e7ff; padding-bottom: 4px; margin-top: 20px; margin-bottom: 10px; font-size: 1.4em;">${processScientificNotation(trimmed.replace('## ', ''))}</h2>`;
      } else if (trimmed.startsWith('### ')) {
        if (inList) { html += '</ul>'; inList = false; }
        html += `<h3 style="color: #1e293b; margin-top: 15px; margin-bottom: 8px; font-size: 1.2em;">${processScientificNotation(trimmed.replace('### ', ''))}</h3>`;
      } else if (trimmed.startsWith('- ')) {
        if (!inList) { html += `<ul style="margin-${direction === 'rtl' ? 'right' : 'left'}: 25px; margin-bottom: 10px;">`; inList = true; }
        html += `<li style="margin-bottom: 5px;">${processScientificNotation(trimmed.replace('- ', ''))}</li>`;
      } else if (trimmed === '') {
        if (inList) { html += '</ul>'; inList = false; }
        html += '<div style="height: 8px;"></div>';
      } else {
        if (inList) { html += '</ul>'; inList = false; }
        html += `<p style="margin-bottom: 8px; text-align: justify;">${processedLine}</p>`;
      }
    });

    if (inList) html += '</ul>';
    html += '</div>';
    return html;
  };

  const handleCopy = async () => {
    try {
      const htmlContent = convertToHTML(content);
      const blobHtml = new Blob([htmlContent], { type: 'text/html' });
      const blobText = new Blob([content], { type: 'text/plain' });
      
      const data = [
        new ClipboardItem({
          ['text/html']: blobHtml,
          ['text/plain']: blobText,
        })
      ];

      await navigator.clipboard.write(data);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy rich text: ', err);
      try {
        await navigator.clipboard.writeText(content);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      } catch (fallbackErr) {
        console.error('Fallback copy also failed: ', fallbackErr);
      }
    }
  };

  const renderFormattedLine = (line: string) => {
    const parts = line.split(/(\$[^$]+\$)/g);
    return parts.map((part, i) => {
      if (part.startsWith('$') && part.endsWith('$')) {
        const formula = part.slice(1, -1);
        const subParts = formula.split(/(_[a-zA-Z0-9]+|\^[a-zA-Z0-9]+)/g);
        return (
          <span key={i} dir="ltr" className="inline-block font-serif mx-0.5">
            {subParts.map((sp, j) => {
              if (sp.startsWith('_')) return <sub key={j}>{sp.slice(1)}</sub>;
              if (sp.startsWith('^')) return <sup key={j}>{sp.slice(1)}</sup>;
              return sp;
            })}
          </span>
        );
      }
      return part;
    });
  };

  const renderContent = () => {
    return content.split('\n').map((line, index) => {
      if (line.startsWith('## ')) {
        return (
          <h2 key={index} className="font-bold text-indigo-900 mt-6 mb-3 border-b-2 border-indigo-100 pb-1" style={{ fontSize: '1.4em' }}>
            {renderFormattedLine(line.replace('## ', ''))}
          </h2>
        );
      }
      if (line.startsWith('### ')) {
        return (
          <h3 key={index} className="font-bold text-slate-800 mt-4 mb-2" style={{ fontSize: '1.2em' }}>
            {renderFormattedLine(line.replace('### ', ''))}
          </h3>
        );
      }
      if (line.trim() === '') {
        return <div key={index} className="h-2" />;
      }
      if (line.startsWith('- ')) {
        return (
          <li key={index} className="mb-1 text-slate-700 list-disc ml-0 mr-0" style={{ [direction === 'rtl' ? 'marginRight' : 'marginLeft']: '1.5rem' }}>
            {renderFormattedLine(line.replace('- ', ''))}
          </li>
        );
      }
      return (
        <p key={index} className="text-slate-700 mb-2 text-justify">
          {renderFormattedLine(line)}
        </p>
      );
    });
  };

  return (
    <div className="space-y-6">
      <div className="no-print bg-white p-6 rounded-xl shadow-sm border border-slate-100 space-y-6">
        <div className="flex flex-wrap gap-4 justify-between items-center">
          <h3 className="font-bold text-slate-800">تنسيق البحث: {topic}</h3>
          <div className="flex flex-wrap gap-2">
            <Button variant="secondary" onClick={handleCopy} disabled={isLoading}>
              {isCopied ? (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  تم النسخ
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                  </svg>
                  نسخ للورد
                </>
              )}
            </Button>
            <Button variant="primary" onClick={onRegenerate} isLoading={isLoading}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              توليد جديد
            </Button>
            <Button variant="outline" onClick={handlePrint} disabled={isLoading}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
              طباعة
            </Button>
            <Button variant="danger" onClick={onClear} disabled={isLoading}>
              إغلاق
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-slate-100">
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-600 flex justify-between">
              <span>حجم الخط</span>
              <span>{fontSize}px</span>
            </label>
            <input 
              type="range" min="12" max="32" value={fontSize} 
              onChange={(e) => setFontSize(parseInt(e.target.value))}
              className="w-full h-2 bg-indigo-100 rounded-lg appearance-none cursor-pointer accent-indigo-600"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-600 flex justify-between">
              <span>تباعد الأسطر</span>
              <span>{lineHeight}</span>
            </label>
            <input 
              type="range" min="1" max="2.5" step="0.1" value={lineHeight} 
              onChange={(e) => setLineHeight(parseFloat(e.target.value))}
              className="w-full h-2 bg-indigo-100 rounded-lg appearance-none cursor-pointer accent-indigo-600"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-600">اتجاه النص</label>
            <div className="flex p-1 bg-slate-100 rounded-lg">
              <button 
                onClick={() => setDirection('rtl')}
                className={`flex-1 py-1.5 rounded-md text-sm font-medium transition-all ${direction === 'rtl' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500'}`}
              >
                من اليمين (RTL)
              </button>
              <button 
                onClick={() => setDirection('ltr')}
                className={`flex-1 py-1.5 rounded-md text-sm font-medium transition-all ${direction === 'ltr' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500'}`}
              >
                من اليسار (LTR)
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="research-paper bg-white p-8 md:p-12 rounded-xl shadow-xl border border-slate-200 min-h-[800px] relative transition-all mx-auto" 
           style={{ direction, textAlign: direction === 'rtl' ? 'right' : 'left', maxWidth: '210mm' }}>
        <div className="hidden print:block border-b-2 border-slate-900 pb-6 mb-10 text-center">
          <h1 className="text-3xl font-bold mb-2">بحث مدرسي</h1>
          <p className="text-xl">{topic}</p>
        </div>

        <article className="prose prose-slate max-w-none" style={{ fontSize: `${fontSize}px`, lineHeight }}>
          {renderContent()}
        </article>

        <div className="hidden print:block mt-12 pt-6 border-t border-slate-200 text-sm text-slate-500 text-center">
          تم إنشاء هذا البحث بواسطة مولد الأبحاث التربوية المتقدم - {new Date().toLocaleDateString('ar-EG')}
        </div>
      </div>
    </div>
  );
};
