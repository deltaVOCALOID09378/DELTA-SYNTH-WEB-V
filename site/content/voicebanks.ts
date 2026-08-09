import type { Category, Voicebank } from "./types";

type Seed = {
  name: string;
  slug: string;
  category?: Category;
  voicer?: string;
  engine?: string;
  languages?: string[];
  age?: number;
  gender?: string;
  heightCm?: number;
  weightKg?: number;
  birthday?: string;
  releaseDate?: string;
  vocalRange?: string;
  genres?: string[];
  aliases?: string[];
  status?: Voicebank["status"];
  projectIds?: string[];
};

const seeds: Seed[] = [
  { name: "Ayanami Hikaru", slug: "ayanami-hikaru", voicer: "DELTA SYNTH", age: 20, gender: "Male", heightCm: 168, weightKg: 50, birthday: "1 August", releaseDate: "2019-07-21", genres: ["Pop", "EDM", "Rock"], projectIds: ["bl-student-2019"] },
  { name: "Ayanami Kyoko", slug: "ayanami-kyoko", voicer: "DELTA SYNTH", age: 23, gender: "Female", heightCm: 175, weightKg: 49, birthday: "1 March", releaseDate: "2021-04-27", vocalRange: "B3–G♯5", projectIds: ["creator-singers"] },
  { name: "Guren Kani", slug: "guren-kani", voicer: "MikiBlackqueen", age: 22, gender: "Male", heightCm: 172, weightKg: 65, birthday: "20 April", releaseDate: "2019-10-02", vocalRange: "G2–F♯4", projectIds: ["bl-student-2019"] },
  { name: "Kochujang", slug: "kochujang", voicer: "TangmoThipphawan", age: 17, gender: "Female", heightCm: 167, weightKg: 55, birthday: "16 June", releaseDate: "2019-09-30", vocalRange: "B2–F♯4", projectIds: ["bl-student-2019"] },
  { name: "SUN", slug: "sun", voicer: "SunZERO5", age: 19, gender: "Male", heightCm: 168, weightKg: 63, birthday: "28 July", releaseDate: "2019-09-30", vocalRange: "E2–A3", projectIds: ["bl-student-2019"] },
  { name: "FangYu", slug: "fangyu", aliases: ["Fangyu", "Haru No Shonen"], voicer: "Busthor1512", age: 25, gender: "Male", heightCm: 160, weightKg: 52, birthday: "1 May", releaseDate: "2021-06-03", vocalRange: "F4–C♯5", projectIds: ["older-singer-team"] },
  { name: "Thitiya Anantanetr", slug: "thitiya-anantanetr", voicer: "Thitiya Thai Pinpong", age: 24, gender: "Male", birthday: "7 January", releaseDate: "2021-10-02", projectIds: ["drawer-kingdom"] },
  { name: "KangFu", slug: "kangfu", voicer: "KhaoSitthiphon", age: 20, birthday: "24 October", releaseDate: "2022-02-08", projectIds: ["partner-creators"] },
  { name: "Yamada Takeshi", slug: "yamada-takeshi", voicer: "Seriku", age: 10, gender: "Male", heightCm: 137, weightKg: 42, birthday: "4 June", releaseDate: "2022-06-05", vocalRange: "F3–A♯4", projectIds: ["children-team"] },
  { name: "SRIPHAN", slug: "sriphan", voicer: "Miss Choi", age: 24, gender: "Female", heightCm: 170, weightKg: 55, birthday: "8 April", vocalRange: "A♯2–E4", projectIds: ["older-singer-team"] },
  { name: "Diwachi", slug: "diwachi", voicer: "Wachi TH", age: 20, gender: "Male", heightCm: 175, weightKg: 54, birthday: "25 January", releaseDate: "2022-10-19", vocalRange: "A2–D♯4", projectIds: ["partner-creators"] },
  { name: "Mairu Maishi", slug: "mairu-maishi", voicer: "Papermintty YT CH", age: 18, birthday: "22 November", releaseDate: "2023-02-25", projectIds: ["creator-singers"] },
  { name: "Arun Kamonlanert", slug: "arun-kamonlanert", aliases: ["Arun Kamonlanetr"], voicer: "ArunP", age: 22, birthday: "1 July", releaseDate: "2022-06-20", projectIds: ["creator-singers"] },
  { name: "Miro", slug: "miro", voicer: "Nashiamm", gender: "Female", status: "developing", projectIds: ["creator-singers"] },
  { name: "Fuwari Bento", slug: "fuwari-bento", voicer: "Fuwari Bento CH", gender: "Male", status: "developing", projectIds: ["creator-singers"] },
  { name: "Onika", slug: "onika", aliases: ["Onika Maruyama"], voicer: "Ferina Synth and Namumi Synth CH", engine: "DiffSinger", category: "collaboration", projectIds: ["overseas-collaboration"] },
  { name: "ARZBTV", slug: "arzbtv", voicer: "ARZBTV", projectIds: ["drawer-kingdom"] },
  { name: "FellowWhite", slug: "fellowwhite", voicer: "FellowWhite", gender: "Male", releaseDate: "2025-09-12", category: "partner", projectIds: ["partner-creators"] },
  { name: "Ahctan", slug: "ahctan", aliases: ["Achtan"] },
  { name: "Narisa", slug: "narisa" },
  { name: "Root", slug: "root" },
  { name: "Tom", slug: "tom", projectIds: ["staff-singers"] },
  { name: "Dokya", slug: "dokya" },
  { name: "Namphueng", slug: "namphueng", voicer: "FayChatchadaporn", age: 23, birthday: "22 November", releaseDate: "2025-11-22", genres: ["K-pop"], projectIds: ["staff-singers"] },
  { name: "Charnsamorn", slug: "charnsamorn", aliases: ["Chansamorn"], voicer: "Boonsree Wongyai", age: 80, birthday: "3 June", projectIds: ["older-singer-team"] },
  { name: "Sakultala", slug: "sakultala", voicer: "Nookang", age: 27, birthday: "2 December", projectIds: ["staff-singers"] },
  { name: "Savanna", slug: "savanna", voicer: "Savanna", gender: "LGBTQ+", status: "coming-soon" },
  { name: "Mayuree", slug: "mayuree" },
  { name: "Azaya Aika", slug: "azaya-aika" },
  { name: "Helen", slug: "helen", age: 400 },
  { name: "Ball Powerine", slug: "ball-powerine", category: "partner" },
  { name: "Beem Powerine", slug: "beem-powerine", category: "partner" },
  { name: "Bew Powerine", slug: "bew-powerine", aliases: ["Bew  Powerine"], category: "partner" },
  { name: "Haruhiko", slug: "haruhiko", category: "collaboration" },
  { name: "Ibara Kouya", slug: "ibara-kouya", category: "collaboration", languages: ["Japanese", "Thai", "English"] },
  { name: "Jonu", slug: "jonu", category: "collaboration" },
  { name: "Kikokawa Usagi", slug: "kikokawa-usagi", aliases: ["Kikakowa Usagi"], category: "collaboration" },
  { name: "Kira", slug: "kira", category: "partner" },
  { name: "Koizumi Satoru", slug: "koizumi-satoru", category: "collaboration" },
  { name: "Mojine Sora", slug: "mojine-sora", category: "collaboration" },
  { name: "Okaminari Tanda", slug: "okaminari-tanda", aliases: ["Natsune Tanda"], category: "collaboration" },
  { name: "Quint", slug: "quint", aliases: ["Quint New"], category: "collaboration" },
  { name: "RelVeN", slug: "relven", aliases: ["RelVen"], category: "partner" },
  { name: "Saphire Blue", slug: "saphire-blue" },
  { name: "Shiroino Mochi", slug: "shiroino-mochi", aliases: ["MochiAI", "Mochiai"], category: "collaboration", languages: ["Japanese", "Thai", "English"] },
  { name: "Tackpee", slug: "tackpee" },
  { name: "Tenshi Saburo", slug: "tenshi-saburo", aliases: ["Tenshio Saburo"] },
  { name: "Uchu Sutori", slug: "uchu-sutori" },
  { name: "Utashi Nara", slug: "utashi-nara", category: "collaboration" },
  { name: "Yamada Kimada", slug: "yamada-kimada" },
  { name: "Yamada Satoru", slug: "yamada-satoru" },
  { name: "Yokuatsu Takuto", slug: "yokuatsu-takuto", category: "collaboration" },
  { name: "Yuuya Sato", slug: "yuuya-sato", category: "collaboration" },
  { name: "Felix", slug: "felix", category: "collaboration" }
];

const audioFiles: Record<string, string[]> = {
  "ahctan": ["ahctan"],
  "arun-kamonlanert": ["arun-kamonlanetr"],
  "arzbtv": ["arzbtv"],
  "ayanami-hikaru": ["ayanami-hikaru"],
  "ayanami-kyoko": ["ayanami-kyoko", "ayanami-kyoko-2"],
  "azaya-aika": ["azaya-aika"],
  "beem-powerine": ["beem", "beem-2"],
  "bew-powerine": ["bew-powerine"],
  "charnsamorn": ["charnsamorn"],
  "diwachi": ["diwachi"],
  "dokya": ["dokya"],
  "fangyu": ["fangyu"],
  "felix": ["felix"],
  "fellowwhite": ["fellowwhite"],
  "fuwari-bento": ["fuwari-bento"],
  "guren-kani": ["guren-kani"],
  "haruhiko": ["haruhiko"],
  "helen": ["helen"],
  "ibara-kouya": ["ibara-kouya"],
  "jonu": ["jonu"],
  "kangfu": ["kangfu"],
  "kikokawa-usagi": ["kikokawa-usagi", "kikokawa-usagi-2"],
  "kira": ["kira"],
  "kochujang": ["kochujang-1", "kochujang-2"],
  "koizumi-satoru": ["koizumi-satoru"],
  "mairu-maishi": ["mairu-maishi"],
  "mayuree": ["mayuree"],
  "miro": ["miro"],
  "mojine-sora": ["mojine-sora"],
  "namphueng": ["namphueng", "namphueng-1", "namphueng-3"],
  "narisa": ["narisa"],
  "okaminari-tanda": ["natsune-tanda"],
  "onika": ["onika"],
  "quint": ["quint"],
  "relven": ["relven"],
  "root": ["root"],
  "sakultala": ["sakultala-1", "sakultala-2", "sakultala-3"],
  "saphire-blue": ["saphire-blue", "saphire-blue-2"],
  "savanna": ["savanna"],
  "shiroino-mochi": ["shiroino-mochi"],
  "sriphan": ["sriphan"],
  "sun": ["sun"],
  "tackpee": ["tackpee"],
  "tenshi-saburo": ["tenshi-saburo"],
  "thitiya-anantanetr": ["thitiya"],
  "tom": ["tom", "tom-2"],
  "uchu-sutori": ["uchu-sutori"],
  "utashi-nara": ["utashi-nara"],
  "yamada-kimada": ["yamada-kimada-1", "yamada-kimada-2"],
  "yamada-satoru": ["yamada-satoru"],
  "yamada-takeshi": ["yamada-takeshi", "yamada-takeshi-2"],
  "yokuatsu-takuto": ["yokuatsu-takuto", "yokuatsu-takuto-2"],
  "yuuya-sato": ["yuuya-sato"]
};

export const voicebanks: Voicebank[] = seeds.map((seed, index) => ({
  id: seed.slug,
  slug: seed.slug,
  name: seed.name,
  aliases: seed.aliases ?? [],
  category: seed.category ?? "official",
  status: seed.status ?? "released",
  sourceOrder: index,
  profileImage: `/assets/voicebanks/profile/${seed.slug}.webp`,
  fullImage: `/assets/voicebanks/full/${seed.slug}.webp`,
  voicer: seed.voicer ?? null,
  engine: seed.engine ?? null,
  languages: seed.languages ?? [],
  age: seed.age ?? null,
  gender: seed.gender ?? null,
  heightCm: seed.heightCm ?? null,
  weightKg: seed.weightKg ?? null,
  birthday: seed.birthday ?? null,
  releaseDate: seed.releaseDate ?? null,
  vocalRange: seed.vocalRange ?? null,
  genres: seed.genres ?? [],
  projectIds: seed.projectIds ?? [],
  demos: (audioFiles[seed.slug] ?? []).map((file, demoIndex) => ({
    id: `${seed.slug}-demo-${demoIndex + 1}`,
    title: `Voice demo ${String(demoIndex + 1).padStart(2, "0")}`,
    src: `/assets/audio/${file}.mp3`
  })),
  biography: null,
  sourceRefs: [
    "src/public/3._All Voicebank _ DELTA SYNTH.html",
    "Picture File/A Profile for Singer Picture",
    "Picture File/A Full Body Picture"
  ]
}));

export const getVoicebank = (slug: string) => voicebanks.find((voicebank) => voicebank.slug === slug);
