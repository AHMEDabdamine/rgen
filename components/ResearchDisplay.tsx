import React, { useState } from "react";
import { Button } from "./Button";

interface ResearchDisplayProps {
  content: string;
  topic: string;
  isCustomLevel?: boolean;
  onClear: () => void;
  onRegenerate: () => void;
  onExtend: () => void;
  isLoading: boolean;
}

export const ResearchDisplay: React.FC<ResearchDisplayProps> = ({
  content,
  topic,
  isCustomLevel,
  onClear,
  onRegenerate,
  onExtend,
  isLoading,
}) => {
  const [isCopied, setIsCopied] = useState(false);
  const [fontSize, setFontSize] = useState(14);
  const [lineHeight, setLineHeight] = useState(1);
  const [direction, setDirection] = useState<"rtl" | "ltr">("rtl");

  // Calculate estimated price (30 DA for 600 words) rounded up to nearest 5
  const calculatePrice = (wordCount: number): number => {
    const baseRate = 30; // 30 DA for 600 words
    const baseWords = 600;
    const pricePerWord = baseRate / baseWords;
    const exactPrice = wordCount * pricePerWord;
    // Round up to nearest 5
    return Math.ceil(exactPrice / 5) * 5;
  };

  const wordCount = content.split(/\s+/).length;
  const estimatedPrice = calculatePrice(wordCount);

  const handlePrint = () => {
    window.print();
  };

  const handleImageSearch = () => {
    const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(topic)}&tbm=isch`;
    window.open(searchUrl, "_blank");
  };

  const stripMarkdownSymbols = (text: string): string => {
    return text
      .replace(/---+/g, "")
      .replace(/\*\*\*+/g, "")
      .replace(/___+/g, "")
      .replace(/\*\*|\*/g, "");
  };

  const processScientificNotation = (text: string): string => {
    return text.replace(/\$([^$]+)\$/g, (match, formula) => {
      let processed = formula
        .replace(/_([a-zA-Z0-9]+)/g, "<sub>$1</sub>")
        .replace(/\^([a-zA-Z0-9]+)/g, "<sup>$1</sup>");
      return `<span dir="ltr" style="display: inline-block;">${processed}</span>`;
    });
  };

  const convertToHTML = (text: string) => {
    const lines = text.split("\n");
    let html = `<div dir="${direction}" style="font-family: 'Simplified Arabic', 'Traditional Arabic', serif; text-align: ${direction === "rtl" ? "right" : "left"}; direction: ${direction}; font-size: ${fontSize}px; line-height: ${lineHeight}; color: #000000; background-color: #ffffff;">`;
    let inList = false;

    lines.forEach((line) => {
      const trimmed = line.trim();
      if (trimmed === "---" || trimmed === "***" || trimmed === "___") return;

      const cleanLine = stripMarkdownSymbols(trimmed);
      const processedLine = processScientificNotation(cleanLine);

      if (trimmed.startsWith("## ")) {
        if (inList) {
          html += "</ul>";
          inList = false;
        }
        html += `<h2 style="color: #000000; margin-top: 24px; margin-bottom: 4px; font-size: 1.5em; font-weight: bold;">${processScientificNotation(cleanLine.replace("## ", ""))}</h2>`;
      } else if (trimmed.startsWith("### ")) {
        if (inList) {
          html += "</ul>";
          inList = false;
        }
        html += `<h3 style="color: #000000; margin-top: 18px; margin-bottom: 3px; font-size: 1.3em; font-weight: bold;">${processScientificNotation(cleanLine.replace("### ", ""))}</h3>`;
      } else if (trimmed.startsWith("- ")) {
        if (!inList) {
          html += `<ul style="margin-${direction === "rtl" ? "right" : "left"}: 25px; margin-bottom: 12px; list-style-type: disc; color: #000000;">`;
          inList = true;
        }
        html += `<li style="margin-bottom: 6px;">${processScientificNotation(cleanLine.replace("- ", ""))}</li>`;
      } else if (trimmed === "") {
        if (inList) {
          html += "</ul>";
          inList = false;
        }
        html += '<div style="height: 12px;"></div>';
      } else {
        if (inList) {
          html += "</ul>";
          inList = false;
        }
        html += `<p style="margin-bottom: 12px; text-align: justify; color: #000000;">${processedLine}</p>`;
      }
    });

    if (inList) html += "</ul>";
    html += "</div>";
    return html;
  };

  const handleCopy = async () => {
    try {
      const htmlContent = convertToHTML(content);
      const blobHtml = new Blob([htmlContent], { type: "text/html" });
      const blobText = new Blob([content], { type: "text/plain" });
      const data = [
        new ClipboardItem({
          ["text/html"]: blobHtml,
          ["text/plain"]: blobText,
        }),
      ];
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
      if (part.startsWith("$") && part.endsWith("$")) {
        const formula = part.slice(1, -1);
        const subParts = formula.split(/(_[a-zA-Z0-9]+|\^[a-zA-Z0-9]+)/g);
        return (
          <span
            key={i}
            dir="ltr"
            className="inline-block font-serif mx-0.5 text-black"
          >
            {subParts.map((sp, j) => {
              if (sp.startsWith("_")) return <sub key={j}>{sp.slice(1)}</sub>;
              if (sp.startsWith("^")) return <sup key={j}>{sp.slice(1)}</sup>;
              return sp;
            })}
          </span>
        );
      }
      return part;
    });
  };

  const renderContent = () => {
    return content.split("\n").map((line, index) => {
      const trimmed = line.trim();
      if (trimmed === "---" || trimmed === "***" || trimmed === "___")
        return null;

      if (trimmed.startsWith("## ")) {
        return (
          <h2
            key={index}
            className="font-bold text-black mt-8 mb-1 border-b-2 border-slate-100 pb-2"
            style={{ fontSize: "1.4em" }}
          >
            {renderFormattedLine(trimmed.replace("## ", ""))}
          </h2>
        );
      }
      if (trimmed.startsWith("### ")) {
        return (
          <h3
            key={index}
            className="font-bold text-black mt-6 mb-1"
            style={{ fontSize: "1.2em" }}
          >
            {renderFormattedLine(trimmed.replace("### ", ""))}
          </h3>
        );
      }
      if (trimmed === "") return <div key={index} className="h-2" />;
      if (trimmed.startsWith("- ")) {
        return (
          <li
            key={index}
            className="mb-2 text-black list-disc"
            style={{
              [direction === "rtl" ? "marginRight" : "marginLeft"]: "1.5rem",
            }}
          >
            {renderFormattedLine(trimmed.replace("- ", ""))}
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
          <div className="flex flex-col gap-1">
            <h3 className="font-bold text-slate-800">إدارة البحث: {topic}</h3>
            <span className="text-xs text-slate-400">
              عدد الكلمات تقريباً: {wordCount} كلمة
              {isCustomLevel && " • مستوى تلقائي"}
              {" • "}
              <span className="text-green-600 font-bold">
                السعر التقديري: {estimatedPrice} د.ج
              </span>
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              onClick={handleImageSearch}
              className="text-amber-600 border-amber-200 hover:bg-amber-50"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              صور
            </Button>

            <Button
              variant="secondary"
              onClick={onExtend}
              isLoading={isLoading}
              className="bg-violet-600 hover:bg-violet-700"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 4v16m8-8H4"
                />
              </svg>
              توسيع وإثراء
            </Button>

            <Button
              variant="primary"
              onClick={onRegenerate}
              isLoading={isLoading}
            >
              توليد جديد
            </Button>
            <Button
              variant="secondary"
              onClick={handleCopy}
              disabled={isLoading}
            >
              {isCopied ? "تم النسخ" : "نسخ للورد"}
            </Button>
            <Button
              variant="outline"
              onClick={handlePrint}
              disabled={isLoading}
            >
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
              type="range"
              min="12"
              max="32"
              value={fontSize}
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
              type="range"
              min="1"
              max="2.5"
              step="0.1"
              value={lineHeight}
              onChange={(e) => setLineHeight(parseFloat(e.target.value))}
              className="w-full h-2 bg-indigo-100 rounded-lg appearance-none cursor-pointer accent-indigo-600"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-600">
              اتجاه النص
            </label>
            <div className="flex p-1 bg-slate-100 rounded-lg">
              <button
                onClick={() => setDirection("rtl")}
                className={`flex-1 py-1.5 rounded-md text-sm font-medium transition-all ${direction === "rtl" ? "bg-white shadow-sm text-indigo-600" : "text-slate-500"}`}
              >
                RTL
              </button>
              <button
                onClick={() => setDirection("ltr")}
                className={`flex-1 py-1.5 rounded-md text-sm font-medium transition-all ${direction === "ltr" ? "bg-white shadow-sm text-indigo-600" : "text-slate-500"}`}
              >
                LTR
              </button>
            </div>
          </div>
        </div>
      </div>

      <div
        className="research-paper bg-white p-8 md:p-12 rounded-xl shadow-xl border border-slate-200 min-h-[1000px] relative transition-all mx-auto academic-sheet"
        style={{
          direction,
          textAlign: direction === "rtl" ? "right" : "left",
          maxWidth: "210mm",
          fontFamily: "'Simplified Arabic', 'Traditional Arabic', serif",
        }}
      >
        <article
          className="max-w-none text-black"
          style={{ fontSize: `${fontSize}px`, lineHeight, color: "#000000" }}
        >
          {renderContent()}
        </article>
      </div>
    </div>
  );
};
