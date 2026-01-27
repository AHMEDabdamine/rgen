import React, { useState } from "react";
import {
  EducationalLevel,
  ResearchLength,
  ResearchLanguage,
  ResearchRequest,
} from "../types";
import { Button } from "./Button";

interface ResearchFormProps {
  onSubmit: (data: ResearchRequest) => void;
  isLoading: boolean;
}

export const ResearchForm: React.FC<ResearchFormProps> = ({
  onSubmit,
  isLoading,
}) => {
  const [topic, setTopic] = useState("");
  const [level, setLevel] = useState<EducationalLevel>(
    EducationalLevel.PRIMARY,
  );
  const [length, setLength] = useState<ResearchLength>(ResearchLength.SHORT);
  const [language, setLanguage] = useState<ResearchLanguage>(
    ResearchLanguage.ARABIC,
  );
  const [isCustomLevel, setIsCustomLevel] = useState(false);
  const [isSingleParagraph, setIsSingleParagraph] = useState(false);
  const [additionalDetails, setAdditionalDetails] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;
    onSubmit({
      topic,
      level,
      length,
      language,
      isCustomLevel,
      isSingleParagraph,
      additionalDetails,
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded-xl shadow-md border border-slate-100 space-y-6 no-print"
    >
      <div className="space-y-2">
        <label className="block text-sm font-bold text-slate-700">
          موضوع البحث
        </label>
        <input
          type="text"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="مثال: أهمية الماء، تلوث البيئة، الفضاء..."
          className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all text-lg"
          required
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-bold text-slate-700">
          تفاصيل إضافية (اختياري)
        </label>
        <textarea
          value={additionalDetails}
          onChange={(e) => setAdditionalDetails(e.target.value)}
          placeholder="أضف أي تفاصيل إضافية تود تضمينها في البحث مثل: نقاط محددة للتركيز عليها، أمثلة مطلوبة، جوانب معينة لتغطيتها..."
          className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all resize-none h-24"
          rows={3}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="space-y-2">
          <label className="block text-sm font-bold text-slate-700">
            لغة البحث
          </label>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value as ResearchLanguage)}
            className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none appearance-none bg-white cursor-pointer"
          >
            {Object.values(ResearchLanguage).map((lang) => (
              <option key={lang} value={lang}>
                {lang}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="block text-sm font-bold text-slate-700">
              المستوى التعليمي
            </label>
            <label className="flex items-center gap-1 cursor-pointer">
              <input
                type="checkbox"
                checked={isCustomLevel}
                onChange={(e) => setIsCustomLevel(e.target.checked)}
                className="w-4 h-4 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500"
              />
              <span className="text-xs text-slate-500">تلقائي</span>
            </label>
          </div>
          <select
            value={level}
            onChange={(e) => setLevel(e.target.value as EducationalLevel)}
            disabled={isCustomLevel}
            className={`w-full px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none appearance-none bg-white cursor-pointer disabled:bg-slate-50 disabled:text-slate-400 transition-colors`}
          >
            {Object.values(EducationalLevel).map((lvl) => (
              <option key={lvl} value={lvl}>
                {lvl}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-bold text-slate-700">
            طول البحث
          </label>
          <select
            value={length}
            onChange={(e) => setLength(e.target.value as ResearchLength)}
            className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none appearance-none bg-white cursor-pointer"
          >
            {Object.values(ResearchLength).map((len) => (
              <option key={len} value={len}>
                {len}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-bold text-slate-700">
            تنسيق النص
          </label>
          <div className="flex p-1 bg-slate-100 rounded-lg h-[50px]">
            <button
              type="button"
              onClick={() => setIsSingleParagraph(false)}
              className={`flex-1 py-1 rounded-md text-xs font-bold transition-all ${!isSingleParagraph ? "bg-white shadow-sm text-indigo-600" : "text-slate-500 hover:text-slate-700"}`}
            >
              أقسام
            </button>
            <button
              type="button"
              onClick={() => setIsSingleParagraph(true)}
              className={`flex-1 py-1 rounded-md text-xs font-bold transition-all ${isSingleParagraph ? "bg-white shadow-sm text-indigo-600" : "text-slate-500 hover:text-slate-700"}`}
            >
              فقرة واحدة
            </button>
          </div>
        </div>
      </div>

      <Button
        type="submit"
        isLoading={isLoading}
        className="w-full text-lg py-4"
        variant="primary"
      >
        إنشاء البحث الآن
      </Button>
    </form>
  );
};
