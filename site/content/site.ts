import type { Project, Resource } from "./types";

export const publicContact = "delta.vocaloid09378@gmail.com";

export const projects: Project[] = [
  { id: "bl-student-2019", number: "01", title: { th: "กลุ่มนักร้อง B.L. Student 2019", en: "The B.L. Student 2019 Team" }, description: { th: "โปรเจกต์ตั้งต้นของสตูดิโอและกลุ่มนักร้องผู้ร่วมก่อตั้ง", en: "The studio's founding singer project and original creative circle." } },
  { id: "drawer-kingdom", number: "02", title: { th: "อาณาจักรนักวาด", en: "The Drawer Kingdom Team" }, description: { th: "ความร่วมมือระหว่างเสียงร้องและงานออกแบบตัวละคร", en: "A collaboration between virtual voices and character artists." } },
  { id: "children-team", number: "03", title: { th: "กลุ่มนักร้องเด็ก", en: "The Children Team" }, description: { th: "คลังเสียงสำหรับบทบาทและช่วงเสียงวัยเด็ก", en: "Voice resources focused on child roles and ranges." } },
  { id: "older-singer-team", number: "04", title: { th: "กลุ่มนักร้องสูงวัย", en: "The Older Singer Team" }, description: { th: "การเก็บรักษาคาแรกเตอร์เสียงจากหลายช่วงวัย", en: "Preserving vocal character across generations." } },
  { id: "partner-creators", number: "05", title: { th: "พาร์ตเนอร์ครีเอเตอร์", en: "Partner Creator Team" }, description: { th: "โปรเจกต์ร่วมสร้างกับครีเอเตอร์ทั้งไทยและต่างประเทศ", en: "Co-created work with Thai and international creators." } },
  { id: "creator-singers", number: "06", title: { th: "นักร้องของครีเอเตอร์", en: "Creator Singer Collaborations" }, description: { th: "พื้นที่แลกเปลี่ยนเทคนิคและเสียงร้องระหว่างชุมชน", en: "A shared space for techniques and voices across communities." } },
  { id: "overseas-collaboration", number: "07", title: { th: "ความร่วมมือต่างประเทศ", en: "International Creative Singers" }, description: { th: "เชื่อมโยงผู้สร้างและนักร้องเสมือนจากต่างประเทศ", en: "Connecting overseas virtual-singer creators." } },
  { id: "staff-singers", number: "08", title: { th: "นักร้องจากช่วงชีวิตการทำงาน", en: "Staff Singer Archive" }, description: { th: "ตัวละครเสียงที่เกิดจากผู้คนและประสบการณ์ในชีวิตจริง", en: "Voices inspired by people and everyday working life." } },
  { id: "volunteer-charity", number: "09", title: { th: "อาสาพัฒนาสังคม", en: "Volunteer Upgrade Charity Project" }, description: { th: "โครงการอาสาที่ใช้ความสร้างสรรค์เป็นพื้นที่เชื่อมโยงผู้คน", en: "A volunteer initiative connecting people through creative work." } }
];

export const resources: Resource[] = [
  ["ban-saen-sok", "ban saen sok", ["USTX"]],
  ["dawn", "Dawn", ["USTX"]],
  ["falling-out-of-love", "Falling out of love", ["USTX"]],
  ["look-oam", "Look-oam ลูกอม feat Watchawalee", ["USTX"]],
  ["king-kanaria-eng", "King — Kanaria ENG", ["USTX"]],
  ["ojama-mushi-ii", "Ojama Mushi II Thai VER", ["USTX"]],
  ["springtrap-finale", "Springtrap Finale", ["USTX", "SVP"]],
  ["super-superhero", "Super Superhero feat. PinocchioP Thai VER", ["USTX"]],
  ["wrinkle-thai", "Wrinkle Thai VER by Lunacat", ["USTX"]]
].map(([id, title, formats]) => ({ id: id as string, title: title as string, formats: formats as string[], available: false }));
