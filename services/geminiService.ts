
import { GoogleGenAI } from "@google/genai";
import { ResearchRequest, ResearchLanguage } from "../types";

export const generateResearchText = async (request: ResearchRequest): Promise<string> => {
  // استخدام مفتاح API من البيئة مباشرة كما هو مطلوب
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const isArabic = request.language === ResearchLanguage.ARABIC;
  
  const systemInstruction = `أنت خبير في البحث التربوي والتعليمي.
مهمتك هي إنشاء نص بحث تعليمي منسق بشكل احترافي باللغة: [${request.language}].

المعايير العامة:
- الالتزام باللغة المختارة بدقة وبلاغة.
- الالتزام التام باتجاه النص المناسب (RTL للعربية).
- استخدام العناوين الرئيسية بـ "##" والعناوين الفرعية بـ "###".
- تقسيم الفقرات بفواصل واضحة.
- الالتزام بالبنية الإجبارية: (المقدمة، العرض، الخاتمة).
- تجنب استخدام الرموز التقنية مثل النجوم (*) أو الخطوط (---) في العناوين أو القوائم إلا للضرورة القصوى.

قواعد المستوى التعليمي المستهدف [${request.level}]:
- ابتدائي: جمل قصيرة، كلمات سهلة، شرح مباشر.
- متوسط: شرح أوضح مع أمثلة.
- ثانوي: تحليل، تعليل، تنظيم منطقي عميق.

قواعد الطول [${request.length}]:
- قصير: محوران كحد أقصى في العرض.
- متوسط: 3-4 محاور في العرض.
- طويل: 5 محاور أو أكثر مع توسع وتفصيل.

أخرج النص البحثي المنسق فقط بصيغة Markdown.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview', // استخدام نسخة Pro لضمان جودة بحثية أعلى
      contents: `أنشئ بحثاً تعليمياً حول الموضوع التالي: [${request.topic}]
اللغة: [${request.language}]
المستوى التعليمي المستهدف: [${request.level}]
الطول المطلوب للبحث: [${request.length}]`,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.7,
      },
    });

    return response.text || "";
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    throw new Error("حدث خطأ أثناء توليد البحث. يرجى المحاولة مرة أخرى.");
  }
};
