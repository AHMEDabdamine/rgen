
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
   * Cleans Markdown symbols like ** and * and --- from text
   */
  const stripMarkdownSymbols = (text: string): string => {
    return text
      .replace(/---/g, '') // Remove horizontal line markers
      .replace(/\*\*|\*/g, ''); // Remove bold/italic markers
  };

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
    let html = `<div dir="${direction}" style="font-family: 'Simplified Arabic', 'Traditional Arabic', serif; text-align: ${direction === 'rtl' ? 'right' : 'left'}; direction: ${direction}; font-size: ${fontSize}px; line-height: ${lineHeight}; color: #000000; background-color: #ffffff;">`;
    let inList = false;

    lines.forEach((line) => {
      const trimmed = line.trim();
      if (trimmed === '---' || trimmed === '***' || trimmed === '___') return; // Skip horizontal lines

      const cleanLine = stripMarkdownSymbols(trimmed);
      const processedLine = processScientificNotation(cleanLine);
      
      if (trimmed.startsWith('## ')) {
        if (inList) { html += '</ul>'; inList = false; }
        html += `<h2 style="color: #000000; margin-top: 24px; margin-bottom: 8px; font-size: 1.5em; font-weight: bold;">${processScientificNotation(cleanLine.replace('## ', ''))}</h2>`;
      } else if (trimmed.startsWith('### ')) {
        if (inList) { html += '</ul>'; inList = false; }
        html += `<h3 style="color: #000000; margin-top: 18px; margin-bottom: 6px; font-size: 1.3em; font-weight: bold;">${processScientificNotation(cleanLine.replace('### ', ''))}</h3>`;
      } else if (trimmed.startsWith('- ')) {
        if (!inList) { html += `<ul style="margin-${direction === 'rtl' ? 'right' : 'left'}: 25px; margin-bottom: 12px; list-style-type: disc; color: #000000;">`; inList = true; }
        html += `<li style="margin-bottom: 6px;">${processScientificNotation(cleanLine.replace('- ', ''))}</li>`;
      } else if (trimmed === '') {
        if (inList) { html += '</ul>'; inList = false; }
        html += '<div style="height: 12px;"></div>';
      } else {
        if (inList) { html += '</ul>'; inList = false; }
        html += `<p style="margin-bottom: 12px; text-align: justify; color: #000000;">${processedLine}</p>`;
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
      const data = [new ClipboardItem({ ['text/html']: blobHtml, ['text/plain']: blobText })];
      await navigator.clipboard.write(data);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      await navigator.clipboard.writeText(content);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  const renderFormattedLine = (line: string) => {
    const cleanedText = stripMarkdownSymbols(line);
    const parts = cleanedText.split(/(\$[^$]+\$)/g);
    
    return parts.map((part, i) => {
      if (part.startsWith('$') && part.endsWith('$')) {
        const formula = part.slice(1, -1);
        const subParts = formula.split(/(_[a-zA-Z0-9]+|\^[a-zA-Z0-9]+)/g);
        return (
          <span key={i} dir="ltr" className="inline-block font-serif mx-0.5 text-black">
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
      const trimmed = line.trim();
      
      // Skip horizontal lines
      if (trimmed === '---' || trimmed === '***' || trimmed === '___') return null;

      if (trimmed.startsWith('## ')) {
        return (
          <h2 key={index} className="font-bold text-black mt-8 mb-2" style={{ fontSize: '1.4em' }}>
            {renderFormattedLine(trimmed.replace('## ', ''))}
          </h2>
        );
      }
      if (trimmed.startsWith('### ')) {
        return (
          <h3 key={index} className="font-bold text-black mt-6 mb-2" style={{ fontSize: '1.2em' }}>
            {renderFormattedLine(trimmed.replace('### ', ''))}
          </h3>
        );
      }
      if (trimmed === '') return <div key={index} className="h-2" />;
      if (trimmed.startsWith('- ')) {
        return (
          <li key={index} className="mb-2 text-black list-disc" style={{ [direction === 'rtl' ? 'marginRight' : 'marginLeft']: '1.5rem' }}>
            {renderFormattedLine(trimmed.replace('- ', ''))}
          </li>
        );
      }
      return (
        <p key={index} className="text-black mb-4 text-justify leading-relaxed">
          {renderFormattedLine(line)}
        </p>
      );
    });
  };

  return (
    <div className="space-y-6">
      <div className="no-print bg-white p-6 rounded-xl shadow-sm border border-slate-100 space-y-6">
        <div className="flex flex-wrap gap-4 justify-between items-center">
          <h3 className="font-bold text-slate-800">إدارة البحث: {topic}</h3>
          <div className="flex flex-wrap gap-2">
            <Button variant="secondary" onClick={handleCopy} disabled={isLoading}>
              {isCopied ? "تم النسخ" : "نسخ للورد"}
            </Button>
            <Button variant="primary" onClick={onRegenerate} isLoading={isLoading}>توليد جديد</Button>
            <Button variant="outline" onClick={handlePrint} disabled={isLoading}>طباعة</Button>
            <Button variant="danger" onClick={onClear} disabled={isLoading}>إغلاق</Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-slate-100">
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-600 flex justify-between">
              <span>حجم الخط</span>
              <span>{fontSize}px</span>
            </label>
            <input type="range" min="12" max="32" value={fontSize} onChange={(e) => setFontSize(parseInt(e.target.value))} className="w-full h-2 bg-indigo-100 rounded-lg appearance-none cursor-pointer accent-indigo-600" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-600 flex justify-between">
              <span>تباعد الأسطر</span>
              <span>{lineHeight}</span>
            </label>
            <input type="range" min="1" max="2.5" step="0.1" value={lineHeight} onChange={(e) => setLineHeight(parseFloat(e.target.value))} className="w-full h-2 bg-indigo-100 rounded-lg appearance-none cursor-pointer accent-indigo-600" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-600">اتجاه النص</label>
            <div className="flex p-1 bg-slate-100 rounded-lg">
              <button onClick={() => setDirection('rtl')} className={`flex-1 py-1.5 rounded-md text-sm font-medium transition-all ${direction === 'rtl' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500'}`}>RTL</button>
              <button onClick={() => setDirection('ltr')} className={`flex-1 py-1.5 rounded-md text-sm font-medium transition-all ${direction === 'ltr' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500'}`}>LTR</button>
            </div>
          </div>
        </div>
      </div>

      <div className="research-paper bg-white p-8 md:p-12 rounded-xl shadow-xl border border-slate-200 min-h-[1000px] relative transition-all mx-auto academic-sheet" 
           style={{ 
             direction, 
             textAlign: direction === 'rtl' ? 'right' : 'left', 
             maxWidth: '210mm',
             fontFamily: "'Simplified Arabic', 'Traditional Arabic', serif"
           }}>
        
        {/* Print Header Removed to save space as requested */}

        <div className="border-b-2 border-black pb-4 mb-6 text-center">
          <h1 className="text-3xl font-black text-black mb-1">{topic}</h1>
        </div>

        <article className="max-w-none text-black" style={{ fontSize: `${fontSize}px`, lineHeight, color: '#000000' }}>
          {renderContent()}
        </article>

        <div className="hidden print:block mt-12 pt-4 border-t border-black text-[10px] text-black text-center italic">
          تم إعداد هذا التقرير البحثي آلياً عبر منصة مولد الأبحاث التربوية المتقدم.
        </div>
      </div>
    </div>
  );
};
