
import { GoogleGenAI } from "@google/genai";
import { ResearchRequest, ResearchLanguage } from "../types";

export const generateResearchText = async (request: ResearchRequest, apiKey: string): Promise<string> => {
  if (!apiKey) {
    throw new Error("يرجى إدخال مفتاح API في الإعدادات أولاً.");
  }

  const ai = new GoogleGenAI({ apiKey });
  const isArabic = request.language === ResearchLanguage.ARABIC;
  
  const systemPrompt = `أنت خبير في البحث التربوي والتعليمي.
مهمتك هي إنشاء نص بحث تعليمي منسق بشكل احترافي باللغة: [${request.language}].

المعايير العامة:
- الالتزام باللغة المختارة بدقة وبلاغة.
- ${isArabic ? 'الالتزام التام باتجاه النص من اليمين إلى اليسار (RTL).' : 'استخدام اتجاه النص المناسب للغة المختارة.'}
- استخدام العناوين الرئيسية بـ "##" والعناوين الفرعية بـ "###".
- تقسيم الفقرات بفواصل واضحة.
- الالتزام بالبنية الإجبارية: (المقدمة، العرض، الخاتمة).

قواعد المستوى التعليمي المستهدف [${request.level}]:
- ابتدائي: جمل قصيرة، كلمات سهلة، شرح مباشر.
- متوسط: شرح أوضح مع أمثلة.
- ثانوي: تحليل، تعليل، تنظيم منطقي عميق.

قواعد الطول [${request.length}]:
- قصير: محوران كحد أقصى في العرض.
- متوسط: 3-4 محاور في العرض.
- طويل: 5 محاور أو أكثر مع توسع وتفصيل.

أخرج النص البحثي المنسق فقط بصيغة Markdown.`;

  const userPrompt = `أنشئ بحثاً تعليمياً حول الموضوع التالي: [${request.topic}]
اللغة: [${request.language}]
المستوى التعليمي المستهدف: [${request.level}]
الطول المطلوب للبحث: [${request.length}]`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: userPrompt,
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.7,
      },
    });

    return response.text || "";
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    throw new Error(error.message || "فشل في توليد البحث. تأكد من صحة مفتاح API.");
  }
};
