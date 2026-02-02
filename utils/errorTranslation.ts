// Error translation utility for AI service errors

export interface TranslatedError {
  original: string;
  translated: string;
  suggestions: string[];
}

// Common error patterns and their translations
const errorTranslations: Record<
  string,
  { translated: string; suggestions: string[] }
> = {
  // API Key errors
  API_KEY_INVALID: {
    translated: "مفتاح API غير صالح أو منتهي الصلاحية",
    suggestions: [],
  },
  PERMISSION_DENIED: {
    translated: "تم رفض الوصول إلى الخدمة",
    suggestions: [],
  },
  QUOTA_EXCEEDED: {
    translated: "تم تجاوز الحد المسموح من الاستخدام",
    suggestions: [],
  },

  // Network errors
  NETWORK_ERROR: {
    translated: "مشكلة في الاتصال بالإنترنت",
    suggestions: [],
  },
  TIMEOUT: {
    translated: "انتهت مهلة الاتصال بالخدمة",
    suggestions: [],
  },
  CONNECTION_FAILED: {
    translated: "فشل الاتصال بخدمة Google AI",
    suggestions: [],
  },

  // Content errors
  CONTENT_FILTER: {
    translated: "تم رفض المحتوى بسبب سياسات السلامة",
    suggestions: [],
  },
  SAFETY_FILTER: {
    translated: "تم حظر المحتوى لأسباب أمنية",
    suggestions: [],
  },

  // Rate limiting
  RATE_LIMIT: {
    translated: "تم تجاوز عدد الطلبات المسموح به",
    suggestions: [],
  },
  TOO_MANY_REQUESTS: {
    translated: "طلبات كثيرة جداً في وقت قصير",
    suggestions: [],
  },

  // Model errors
  MODEL_NOT_FOUND: {
    translated: "النموذج المطلوب غير متاح",
    suggestions: [],
  },
  MODEL_OVERLOADED: {
    translated: "النموذج مشغول حالياً",
    suggestions: [],
  },

  // General errors
  UNKNOWN_ERROR: {
    translated: "حدث خطأ غير متوقع",
    suggestions: [],
  },
  INTERNAL_ERROR: {
    translated: "خطأ داخلي في الخدمة",
    suggestions: [],
  },
};

// Function to detect error type from error message
function detectErrorType(errorMessage: string): string {
  const lowerMessage = errorMessage.toLowerCase();

  // Check for API key issues
  if (
    lowerMessage.includes("api key") ||
    lowerMessage.includes("invalid") ||
    lowerMessage.includes("unauthorized")
  ) {
    return "API_KEY_INVALID";
  }

  // Check for permission issues
  if (
    lowerMessage.includes("permission") ||
    lowerMessage.includes("forbidden") ||
    lowerMessage.includes("denied")
  ) {
    return "PERMISSION_DENIED";
  }

  // Check for quota issues
  if (
    lowerMessage.includes("quota") ||
    lowerMessage.includes("limit") ||
    lowerMessage.includes("exceeded")
  ) {
    return "QUOTA_EXCEEDED";
  }

  // Check for network issues
  if (
    lowerMessage.includes("network") ||
    lowerMessage.includes("connection") ||
    lowerMessage.includes("fetch")
  ) {
    return "NETWORK_ERROR";
  }

  // Check for timeout
  if (lowerMessage.includes("timeout") || lowerMessage.includes("timed out")) {
    return "TIMEOUT";
  }

  // Check for content filter
  if (
    lowerMessage.includes("safety") ||
    lowerMessage.includes("filter") ||
    lowerMessage.includes("blocked")
  ) {
    return "CONTENT_FILTER";
  }

  // Check for rate limiting
  if (
    lowerMessage.includes("rate") ||
    lowerMessage.includes("too many") ||
    lowerMessage.includes("requests")
  ) {
    return "RATE_LIMIT";
  }

  // Check for model issues
  if (lowerMessage.includes("model") || lowerMessage.includes("overload")) {
    return "MODEL_OVERLOADED";
  }

  // Check for internal errors
  if (lowerMessage.includes("internal") || lowerMessage.includes("server")) {
    return "INTERNAL_ERROR";
  }

  return "UNKNOWN_ERROR";
}

// Main translation function
export function translateError(error: any): TranslatedError {
  const errorMessage = error?.message || error?.toString() || "خطأ غير معروف";
  const errorType = detectErrorType(errorMessage);
  const translation =
    errorTranslations[errorType] || errorTranslations["UNKNOWN_ERROR"];

  return {
    original: errorMessage,
    translated: translation.translated,
    suggestions: translation.suggestions,
  };
}

// Function to format error for display
export function formatErrorForDisplay(error: any): string {
  const translated = translateError(error);
  return translated.translated;
}

// Function to get error suggestions
export function getErrorSuggestions(error: any): string[] {
  const translated = translateError(error);
  return translated.suggestions;
}
