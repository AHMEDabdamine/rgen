import { GoogleGenAI } from "@google/genai";
import { ResearchRequest, ResearchLanguage } from "../types";

// External resource fetcher interface
interface ExternalResource {
  title: string;
  content: string;
  source: string;
  url: string;
}

// Fetch content from external resources
const fetchExternalResources = async (
  topic: string,
  language: ResearchLanguage,
): Promise<ExternalResource[]> => {
  const resources: ExternalResource[] = [];

  try {
    // Wikipedia API
    const wikiUrl =
      language === ResearchLanguage.ARABIC
        ? `https://ar.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(topic)}`
        : `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(topic)}`;

    const wikiResponse = await fetch(wikiUrl);
    if (wikiResponse.ok) {
      const wikiData = await wikiResponse.json();
      if (wikiData.extract && !wikiData.extract.includes("does not exist")) {
        resources.push({
          title: wikiData.title || topic,
          content: wikiData.extract,
          source: "Wikipedia",
          url: wikiData.content_urls?.desktop?.page || wikiUrl,
        });
      }
    }
  } catch (error) {
    console.log("Wikipedia fetch failed:", error);
  }

  // Mawdoo3 (Arabic content platform)
  if (language === ResearchLanguage.ARABIC) {
    try {
      // Note: Mawdoo3 doesn't have a public API, so we'll use a search-based approach
      // This is a simplified implementation - in production, you'd want a proper API or scraping service
      const searchQuery = encodeURIComponent(`${topic} موقع الموضوع`);
      resources.push({
        title: topic,
        content: `مصدر إضافي من الموضوع: ${topic} - يرجى الرجوع إلى موقع الموضوع (mawdoo3.com) للحصول على معلومات مفصلة وموثوقة باللغة العربية.`,
        source: "الموضوع",
        url: "https://mawdoo3.com",
      });
    } catch (error) {
      console.log("Mawdoo3 reference failed:", error);
    }
  }

  // Google Scholar reference (note: direct scraping is complex, so we'll provide guidance)
  try {
    const scholarQuery = encodeURIComponent(topic);
    resources.push({
      title: `أبحاث أكاديمية حول: ${topic}`,
      content: `يُنصح بالرجوع إلى Google Scholar للبحث عن الأوراق البحثية والمصادر الأكاديمية الموثوقة حول موضوع: ${topic}. ابحث عن الدراسات الحديثة والمراجعات العلمية لتعزيز البحث بمعلومات دقيقة وموثوقة.`,
      source: "Google Scholar",
      url: `https://scholar.google.com/scholar?q=${scholarQuery}`,
    });
  } catch (error) {
    console.log("Google Scholar reference failed:", error);
  }

  return resources;
};

export const generateResearchText = async (
  request: ResearchRequest,
  apiKey: string,
): Promise<string> => {
  if (!apiKey) {
    throw new Error("يرجى إدخال مفتاح API في الإعدادات أولاً.");
  }

  const ai = new GoogleGenAI({ apiKey });
  const isArabic = request.language === ResearchLanguage.ARABIC;
  const levelText = request.isCustomLevel
    ? "تلقائي (حدد المستوى الأنسب للموضوع بأسلوب أكاديمي رصين)"
    : request.level;

  const formatInstruction = request.isSingleParagraph
    ? "اكتب البحث كاملاً كفقرة واحدة متصلة ومنسجمة دون أي عناوين جانبية أو تقسيمات. يجب أن يتدفق النص بسلاسة من المقدمة إلى الخاتمة في كتلة نصية واحدة."
    : "قسم البحث إلى مقدمة، وعرض (يحتوي على عناوين فرعية)، وخاتمة. استخدم العناوين الرئيسية بـ '##' والعناوين الفرعية بـ '###'.";

  // Fetch external resources for enhanced content
  let externalResourcesContext = "";
  try {
    const resources = await fetchExternalResources(
      request.topic,
      request.language,
    );
    if (resources.length > 0) {
      externalResourcesContext = "\n\n--- مصادر إضافية للإثراء ---\n";
      resources.forEach((resource, index) => {
        externalResourcesContext += `\n${index + 1}. ${resource.source}: ${resource.title}\n`;
        externalResourcesContext += `   المحتوى: ${resource.content}\n`;
        externalResourcesContext += `   الرابط: ${resource.url}\n`;
      });
      externalResourcesContext += "\n--- انتهت المصادر الإضافية ---\n\n";
    }
  } catch (error) {
    console.log(
      "Failed to fetch external resources, proceeding without them:",
      error,
    );
  }

  const systemPrompt = `أنت خبير في البحث التربوي والتعليمي مع إمكانية الوصول إلى مصادر معرفية موثوقة.
مهمتك هي إنشاء نص بحث تعليمي منسق بشكل احترافي باللغة: [${request.language}].

المعايير العامة:
- الالتزام باللغة المختارة بدقة وبلاغة.
- ${isArabic ? "الالتزام التام باتجاه النص من اليمين إلى اليسار (RTL)." : "استخدام اتجاه النص المناسب للغة المختارة."}
- تقسيم الفقرات بفواصل واضحة (أسطر فارغة) ${request.isSingleParagraph ? "فقط إذا كان ذلك ضرورياً جداً، والأفضل الالتزام بفقرة واحدة طويلة ومترابطة" : ""}.
- ${formatInstruction}

قواعد التنسيق الصارمة:
- ممنوع تماماً استخدام الخطوط الأفقية (---) أو أي رموز تشبه الخطوط الفاصلة.
- ممنوع تماماً استخدام أي ألوان في النص؛ يجب أن يكون النص قابلاً للقراءة بلون أسود فقط.
- لا تضف أي زخارف رسومية.

قواعد المستوى التعليمي المستهدف [${levelText}]:
${
  !request.isCustomLevel
    ? `
- ابتدائي: جمل قصيرة، كلمات سهلة، شرح مباشر.
- متوسط: شرح أوضح مع أمثلة.
- ثانوي: تحليل، تعليل، تنظيم منطقي عميق.`
    : "- قم بتكييف مستوى اللغة والعمق الأكاديمي بما يتناسب مع طبيعة الموضوع المختار بشكل احترافي."
}

قواعد الطول [${request.length}]:
- قصير: محتوى مركز ومختصر.
- متوسط: محتوى متوسع يشمل أغلب الجوانب.
- طويل: تفصيل شديد وشامل لكافة الأبعاد.

تعليمات خاصة لاستخدام المصادر الخارجية:
- استخدم المعلومات من المصادر الموثوقة المقدمة لك لإثراء المحتوى.
- ادمج المعلومات بسلاسة في البحث دون نسخ مباشر.
- احتفظ بالأسلوب الأكاديمي المناسب للمستوى التعليمي.
- أشر إلى المصادر بشكل عام (مثال: "تشير الدراسات الحديثة..." أو "وفقاً للمصادر الموثوقة...").
- لا تذكر الروابط مباشرة في النص البحثي.

أخرج النص البحثي المنسق فقط بصيغة Markdown.`;

  const userPrompt = `أنشئ بحثاً تعليمياً حول الموضوع التالي: [${request.topic}]
اللغة: [${request.language}]
المستوى التعليمي المستهدف: [${levelText}]
الطول المطلوب للبحث: [${request.length}]
التنسيق المطلوب: [${request.isSingleParagraph ? "فقرة واحدة متصلة" : "أقسام مقسمة بعناوين"}]
${request.additionalDetails ? `تفاصيل إضافية مطلوبة: [${request.additionalDetails}]` : ""}

${externalResourcesContext}

الرجاء استخدام المعلومات من المصادر المذكورة أعلاه لإثراء البحث وجعله أكثر دقة وموثوقية.${request.additionalDetails ? " وإيلاء اهتمام خاص للتفاصيل الإضافية المذكورة." : ""}`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: userPrompt,
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.7,
      },
    });

    return response.text || "";
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    throw new Error(
      error.message || "فشل في توليد البحث. تأكد من صحة مفتاح API.",
    );
  }
};

export const extendResearchText = async (
  currentContent: string,
  request: ResearchRequest,
  apiKey: string,
): Promise<string> => {
  if (!apiKey) {
    throw new Error("يرجى إدخال مفتاح API.");
  }

  const ai = new GoogleGenAI({ apiKey });
  const levelText = request.isCustomLevel ? "تلقائي" : request.level;

  const formatExtInstruction = request.isSingleParagraph
    ? "حافظ على تنسيق الفقرة الواحدة المتصلة، ولكن قم بإطالتها وإثرائها بمعلومات وتفاصيل أكثر عمقاً."
    : "أضف محاور جديدة كلياً في 'العرض' لم تكن موجودة واستخدم العناوين (## و ###).";

  // Fetch additional external resources for extension
  let externalResourcesContext = "";
  try {
    const resources = await fetchExternalResources(
      request.topic,
      request.language,
    );
    if (resources.length > 0) {
      externalResourcesContext = "\n\n--- مصادر إضافية للتوسيع ---\n";
      resources.forEach((resource, index) => {
        externalResourcesContext += `\n${index + 1}. ${resource.source}: ${resource.title}\n`;
        externalResourcesContext += `   المحتوى: ${resource.content}\n`;
        externalResourcesContext += `   الرابط: ${resource.url}\n`;
      });
      externalResourcesContext += "\n--- انتهت المصادر الإضافية ---\n\n";
    }
  } catch (error) {
    console.log("Failed to fetch external resources for extension:", error);
  }

  const systemPrompt = `أنت باحث أكاديمي متخصص مع إمكانية الوصول إلى مصادر معرفية موثوقة. لديك نص بحثي حالي، ومهمتك هي "توسيعه وإثراؤه" بشكل كبير.
يجب عليك:
1. ${request.isSingleParagraph ? "الالتزام بفقرة واحدة مطولة" : "الاحتفاظ بالهيكل العام (مقدمة، عرض، خاتمة)"}.
2. ${formatExtInstruction}
3. إضافة تفاصيل دقيقة، إحصائيات تقريبية (إذا لزم)، أمثلة واقعية، وشروحات مطولة.
4. مضاعفة حجم النص الحالي مع الحفاظ على المستوى التعليمي [${levelText}].
5. التأكد من أن اللغة هي [${request.language}] وأن التنسيق Markdown سليم.
6. ممنوع استخدام الخطوط الفاصلة (---).
7. استخدم المعلومات من المصادر الخارجية المقدمة لإضافة محتوى جديد وموثوق.
8. ادمج المعلومات من المصادر بسلاسة دون نسخ مباشر.
9. أضف إحصائيات وحقائق من المصادر الموثوقة لتعزيز مصداقية البحث.

أعد كتابة البحث بالكامل بالنسخة الجديدة المطولة والمثراة.`;

  const userPrompt = `هذا هو البحث الحالي حول موضوع [${request.topic}]:
---
${currentContent}
---
${request.additionalDetails ? `تفاصيل إضافية مطلوبة: [${request.additionalDetails}]` : ""}

${externalResourcesContext}

قم بتوسيع هذا البحث بشكل كبير وإضافة محتوى جديد ومفصل جداً باستخدام المعلومات من المصادر الموثوقة المذكورة أعلاه. أضف إحصائيات وحقائق وأمثلة واقعية مع الحفاظ على تنسيق [${request.isSingleParagraph ? "فقرة واحدة" : "أقسام"}].${request.additionalDetails ? " وتأكد من تغطية التفاصيل الإضافية المذكورة بعمق." : ""}`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
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

// Export the external resources fetcher for potential direct use
export { fetchExternalResources };
export type { ExternalResource };
