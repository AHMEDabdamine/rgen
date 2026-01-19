
import { GoogleGenAI } from "@google/genai";
import { ResearchRequest, ResearchLanguage } from "../types";

export const generateResearchText = async (request: ResearchRequest, apiKey: string): Promise<string> => {
  if (!apiKey) {
    throw new Error("يرجى إدخال مفتاح API في الإعدادات أولاً.");
  }

  const ai = new GoogleGenAI({ apiKey });
  const isArabic = request.language === ResearchLanguage.ARABIC;
  const levelText = request.isCustomLevel ? "تلقائي (حدد المستوى الأنسب للموضوع بأسلوب أكاديمي رصين)" : request.level;
  
  const formatInstruction = request.isSingleParagraph 
    ? "اكتب البحث كاملاً كفقرة واحدة متصلة ومنسجمة دون أي عناوين جانبية أو تقسيمات. يجب أن يتدفق النص بسلاسة من المقدمة إلى الخاتمة في كتلة نصية واحدة."
    : "قسم البحث إلى مقدمة، وعرض (يحتوي على عناوين فرعية)، وخاتمة. استخدم العناوين الرئيسية بـ '##' والعناوين الفرعية بـ '###'.";

  const systemPrompt = `أنت خبير في البحث التربوي والتعليمي.
مهمتك هي إنشاء نص بحث تعليمي منسق بشكل احترافي باللغة: [${request.language}].

المعايير العامة:
- الالتزام باللغة المختارة بدقة وبلاغة.
- ${isArabic ? 'الالتزام التام باتجاه النص من اليمين إلى اليسار (RTL).' : 'استخدام اتجاه النص المناسب للغة المختارة.'}
- تقسيم الفقرات بفواصل واضحة (أسطر فارغة) ${request.isSingleParagraph ? 'فقط إذا كان ذلك ضرورياً جداً، والأفضل الالتزام بفقرة واحدة طويلة ومترابطة' : ''}.
- ${formatInstruction}

قواعد التنسيق الصارمة:
- ممنوع تماماً استخدام الخطوط الأفقية (---) أو أي رموز تشبه الخطوط الفاصلة.
- ممنوع تماماً استخدام أي ألوان في النص؛ يجب أن يكون النص قابلاً للقراءة بلون أسود فقط.
- لا تضف أي زخارف رسومية.

قواعد المستوى التعليمي المستهدف [${levelText}]:
${!request.isCustomLevel ? `
- ابتدائي: جمل قصيرة، كلمات سهلة، شرح مباشر.
- متوسط: شرح أوضح مع أمثلة.
- ثانوي: تحليل، تعليل، تنظيم منطقي عميق.` : '- قم بتكييف مستوى اللغة والعمق الأكاديمي بما يتناسب مع طبيعة الموضوع المختار بشكل احترافي.'}

قواعد الطول [${request.length}]:
- قصير: محتوى مركز ومختصر.
- متوسط: محتوى متوسع يشمل أغلب الجوانب.
- طويل: تفصيل شديد وشامل لكافة الأبعاد.

أخرج النص البحثي المنسق فقط بصيغة Markdown.`;

  const userPrompt = `أنشئ بحثاً تعليمياً حول الموضوع التالي: [${request.topic}]
اللغة: [${request.language}]
المستوى التعليمي المستهدف: [${levelText}]
الطول المطلوب للبحث: [${request.length}]
التنسيق المطلوب: [${request.isSingleParagraph ? 'فقرة واحدة متصلة' : 'أقسام مقسمة بعناوين'}]`;

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

export const extendResearchText = async (currentContent: string, request: ResearchRequest, apiKey: string): Promise<string> => {
  if (!apiKey) {
    throw new Error("يرجى إدخال مفتاح API.");
  }

  const ai = new GoogleGenAI({ apiKey });
  const levelText = request.isCustomLevel ? "تلقائي" : request.level;
  
  const formatExtInstruction = request.isSingleParagraph
    ? "حافظ على تنسيق الفقرة الواحدة المتصلة، ولكن قم بإطالتها وإثرائها بمعلومات وتفاصيل أكثر عمقاً."
    : "أضف محاور جديدة كلياً في 'العرض' لم تكن موجودة واستخدم العناوين (## و ###).";

  const systemPrompt = `أنت باحث أكاديمي متخصص. لديك نص بحثي حالي، ومهمتك هي "توسيعه وإثراؤه" بشكل كبير.
يجب عليك:
1. ${request.isSingleParagraph ? 'الالتزام بفقرة واحدة مطولة' : 'الاحتفاظ بالهيكل العام (مقدمة، عرض، خاتمة)'}.
2. ${formatExtInstruction}
3. إضافة تفاصيل دقيقة، إحصائيات تقريبية (إذا لزم)، أمثلة واقعية، وشروحات مطولة.
4. مضاعفة حجم النص الحالي مع الحفاظ على المستوى التعليمي [${levelText}].
5. التأكد من أن اللغة هي [${request.language}] وأن التنسيق Markdown سليم.
6. ممنوع استخدام الخطوط الفاصلة (---).

أعد كتابة البحث بالكامل بالنسخة الجديدة المطولة والمثراة.`;

  const userPrompt = `هذا هو البحث الحالي حول موضوع [${request.topic}]:
---
${currentContent}
---
قم بتوسيع هذا البحث وإضافة محتوى جديد ومفصل جداً مع الحفاظ على تنسيق [${request.isSingleParagraph ? 'فقرة واحدة' : 'أقسام'}].`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: userPrompt,
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.8,
      },
    });

    return response.text || currentContent;
  } catch (error: any) {
    console.error("Gemini Extension Error:", error);
    throw new Error("فشل في توسيع البحث. حاول مرة أخرى.");
  }
};
