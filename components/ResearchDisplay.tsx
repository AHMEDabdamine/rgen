
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
    let html = `<div dir="${direction}" style="font-family: 'Arial', sans-serif; text-align: ${direction === 'rtl' ? 'right' : 'left'}; direction: ${direction}; font-size: ${fontSize}px; line-height: ${lineHeight}; color: black;">`;
    let inList = false;

    lines.forEach((line) => {
      const trimmed = line.trim();
      const processedLine = processScientificNotation(trimmed);
      
      if (trimmed.startsWith('## ')) {
        if (inList) { html += '</ul>'; inList = false; }
        html += `<h2 style="color: #000; border-bottom: 2px solid #000; padding-bottom: 4px; margin-top: 24px; margin-bottom: 12px; font-size: 1.5em; font-weight: bold;">${processScientificNotation(trimmed.replace('## ', ''))}</h2>`;
      } else if (trimmed.startsWith('### ')) {
        if (inList) { html += '</ul>'; inList = false; }
        html += `<h3 style="color: #000; margin-top: 20px; margin-bottom: 10px; font-size: 1.3em; font-weight: bold;">${processScientificNotation(trimmed.replace('### ', ''))}</h3>`;
      } else if (trimmed.startsWith('- ')) {
        if (!inList) { html += `<ul style="margin-${direction === 'rtl' ? 'right' : 'left'}: 25px; margin-bottom: 12px; list-style-type: disc;">`; inList = true; }
        html += `<li style="margin-bottom: 6px;">${processScientificNotation(trimmed.replace('- ', ''))}</li>`;
      } else if (trimmed === '') {
        if (inList) { html += '</ul>'; inList = false; }
        html += '<div style="height: 12px;"></div>';
      } else {
        if (inList) { html += '</ul>'; inList = false; }
        html += `<p style="margin-bottom: 12px; text-align: justify;">${processedLine}</p>`;
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
          <h2 key={index} className="font-bold text-indigo-900 print:text-black mt-8 mb-4 border-b-2 border-indigo-100 print:border-black pb-1" style={{ fontSize: '1.4em' }}>
            {renderFormattedLine(line.replace('## ', ''))}
          </h2>
        );
      }
      if (line.startsWith('### ')) {
        return (
          <h3 key={index} className="font-bold text-slate-800 print:text-black mt-6 mb-3" style={{ fontSize: '1.2em' }}>
            {renderFormattedLine(line.replace('### ', ''))}
          </h3>
        );
      }
      if (line.trim() === '') return <div key={index} className="h-2" />;
      if (line.startsWith('- ')) {
        return (
          <li key={index} className="mb-2 text-slate-700 print:text-black list-disc" style={{ [direction === 'rtl' ? 'marginRight' : 'marginLeft']: '1.5rem' }}>
            {renderFormattedLine(line.replace('- ', ''))}
          </li>
        );
      }
      return (
        <p key={index} className="text-slate-700 print:text-black mb-4 text-justify leading-relaxed">
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

      <div className="research-paper bg-white p-8 md:p-16 rounded-xl shadow-xl border border-slate-200 min-h-[1000px] relative transition-all mx-auto academic-sheet" 
           style={{ direction, textAlign: direction === 'rtl' ? 'right' : 'left', maxWidth: '210mm' }}>
        
        <div className="hidden print:flex flex-col items-center mb-12 border-b-4 border-double border-black pb-8">
          <div className="w-full flex justify-between items-start text-sm font-bold mb-8">
            <div className="text-right">المملكة العربية السعودية<br/>وزارة التعليم<br/>إدارة البحث العلمي</div>
            <div className="text-center bg-slate-100 p-2 border-2 border-black rounded">نموذج بحث مدرسي</div>
            <div className="text-left">التاريخ: {new Date().toLocaleDateString('ar-EG')}<br/>المادة: بحث إثرائي</div>
          </div>
          <h1 className="text-4xl font-black mb-4 print:text-black">{topic}</h1>
        </div>

        <div className="print:hidden border-b-2 border-slate-100 pb-6 mb-10 text-center">
          <h1 className="text-3xl font-bold text-indigo-900 mb-2">{topic}</h1>
        </div>

        <article className="prose prose-slate prose-lg max-w-none print:text-black" style={{ fontSize: `${fontSize}px`, lineHeight, color: 'black' }}>
          {renderContent()}
        </article>

        <div className="hidden print:block mt-20 pt-8 border-t border-slate-300 text-xs text-slate-500 text-center italic">
          تم إعداد هذا التقرير البحثي آلياً عبر منصة مولد الأبحاث التربوية المتقدم.
        </div>
      </div>
    </div>
  );
};
