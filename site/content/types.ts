export type LocalizedText = { th: string; en: string };
export type Category = "official" | "collaboration" | "partner";
export type VoicebankStatus = "released" | "developing" | "coming-soon" | "archive";

export type Demo = {
  id: string;
  title: string;
  src: string;
};

export type Voicebank = {
  id: string;
  slug: string;
  name: string;
  aliases: string[];
  category: Category;
  status: VoicebankStatus;
  sourceOrder: number;
  profileImage: string;
  fullImage: string;
  voicer: string | null;
  engine: string | null;
  languages: string[];
  age: number | null;
  gender: string | null;
  heightCm: number | null;
  weightKg: number | null;
  birthday: string | null;
  releaseDate: string | null;
  vocalRange: string | null;
  genres: string[];
  projectIds: string[];
  demos: Demo[];
  biography: LocalizedText | null;
  sourceRefs: string[];
};

export type Project = {
  id: string;
  number: string;
  title: LocalizedText;
  description: LocalizedText;
};

export type Resource = {
  id: string;
  title: string;
  formats: string[];
  available: false;
};
