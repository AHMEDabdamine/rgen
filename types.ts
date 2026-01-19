
export enum EducationalLevel {
  PRIMARY = 'ابتدائي',
  INTERMEDIATE = 'متوسط',
  SECONDARY = 'ثانوي'
}

export enum ResearchLength {
  SHORT = 'قصير',
  MEDIUM = 'متوسط',
  LONG = 'طويل'
}

export enum ResearchLanguage {
  ARABIC = 'العربية',
  ENGLISH = 'الإنجليزية',
  FRENCH = 'الفرنسية'
}

export interface ResearchRequest {
  topic: string;
  level: EducationalLevel;
  length: ResearchLength;
  language: ResearchLanguage;
  isCustomLevel: boolean;
  isSingleParagraph: boolean;
}

export interface ResearchResponse {
  content: string;
  timestamp: string;
}

export interface SavedResearch extends ResearchRequest {
  id: string;
  content: string;
  timestamp: string;
}
