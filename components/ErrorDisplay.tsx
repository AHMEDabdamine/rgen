import React from "react";
import { getErrorSuggestions } from "../utils/errorTranslation";

interface ErrorDisplayProps {
  error: string;
  lastError?: any;
  onOpenSettings?: () => void;
  showSettingsButton?: boolean;
}

export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({
  error,
  lastError,
  onOpenSettings,
  showSettingsButton = false,
}) => {
  const suggestions = lastError ? getErrorSuggestions(lastError) : [];

  return (
    <div className="bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 p-4 rounded-xl no-print">
      <div className="flex items-start gap-3">
        <svg
          className="w-5 h-5 mt-0.5 flex-shrink-0"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
            clipRule="evenodd"
          />
        </svg>

        <div className="flex-1 space-y-3">
          <p className="font-medium">{error}</p>

          {suggestions.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-medium text-rose-600 dark:text-rose-400">
                💡 اقتراحات للحل:
              </p>
              <ul className="text-sm space-y-1 list-disc list-inside">
                {suggestions.map((suggestion, index) => (
                  <li key={index} className="text-rose-600 dark:text-rose-400">
                    {suggestion}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {showSettingsButton && onOpenSettings && (
            <button
              onClick={onOpenSettings}
              className="text-indigo-600 dark:text-indigo-400 font-bold underline hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors text-sm"
            >
              ⚙️ افتح إعدادات API
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
