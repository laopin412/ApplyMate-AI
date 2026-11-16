export type CategoryId =
  | "basic"
  | "education"
  | "academic"
  | "projects"
  | "awards"
  | "skills"
  | "certificates"
  | "experience"
  | "other";
export type Entry = { id: string; values: Record<string, string> };
export type Field = {
  key: string;
  label: string;
  type?:
    "text" | "email" | "tel" | "month" | "date" | "textarea" | "url" | "select";
  options?: string[];
  core?: boolean;
  hint?: string;
};
export type Category = {
  id: CategoryId;
  label: string;
  short: string;
  description: string;
  fields: Field[];
};
const period: Field[] = [
  { key: "start", label: "開始年月", type: "month" },
  { key: "end", label: "結束年月", type: "month", hint: "仍在進行中可留白" },
];
const note: Field = {
  key: "description",
  label: "內容與說明",
  type: "textarea",
};
export const categories: Category[] = [
  {
    id: "basic",
    label: "基本資料",
    short: "關於你",
    description: "從認識你開始，建立專屬的升學資料庫。",
    fields: [
      { key: "name", label: "姓名", core: true },
      { key: "school", label: "就讀學校", core: true },
      { key: "department", label: "就讀科系", core: true },
      {
        key: "degree",
        label: "學歷階段",
        type: "select",
        options: ["高中／高職", "專科", "大學", "碩士", "博士", "其他"],
        core: true,
      },
      {
        key: "status",
        label: "在學狀態",
        type: "select",
        options: ["在學中", "應屆畢業", "已畢業", "休學中", "其他"],
        core: true,
      },
      { key: "email", label: "Email", type: "email" },
      { key: "phone", label: "聯絡電話", type: "tel" },
      {
        key: "intro",
        label: "關於我",
        type: "textarea",
        hint: "簡單記錄你的興趣、特質或目前的準備方向。",
      },
    ],
  },
  {
    id: "education",
    label: "學歷背景",
    short: "學習的起點",
    description: "記錄每一段學習歷程，逐步整理你的背景。",
    fields: [
      { key: "school", label: "學校名稱" },
      { key: "department", label: "科系／科別" },
      { key: "degree", label: "學歷階段" },
      ...period,
      note,
    ],
  },
  {
    id: "academic",
    label: "學業表現",
    short: "累積的成果",
    description: "保留原始成績與計分方式，讓表現有清楚的依據。",
    fields: [
      { key: "title", label: "成績項目" },
      { key: "term", label: "學期／期間" },
      { key: "score", label: "成績值" },
      {
        key: "scale",
        label: "滿分／計分方式",
        hint: "例如：100 分制、GPA 4.3 制",
      },
      { key: "rank", label: "排名" },
      { key: "total", label: "總人數" },
      note,
    ],
  },
  {
    id: "projects",
    label: "專題與研究",
    short: "探索與實作",
    description: "說明做了什麼，以及你在其中的實際貢獻。",
    fields: [
      { key: "title", label: "專題／研究名稱" },
      { key: "role", label: "擔任角色" },
      { key: "advisor", label: "指導老師" },
      ...period,
      note,
      { key: "contribution", label: "個人貢獻", type: "textarea" },
      { key: "url", label: "成果連結", type: "url" },
    ],
  },
  {
    id: "awards",
    label: "競賽與獎項",
    short: "努力的肯定",
    description: "大大小小的肯定，都值得好好記錄。",
    fields: [
      { key: "title", label: "競賽名稱" },
      { key: "organizer", label: "主辦單位" },
      { key: "date", label: "獲獎日期", type: "date" },
      { key: "award", label: "獎項" },
      { key: "contribution", label: "個人貢獻", type: "textarea" },
    ],
  },
  {
    id: "skills",
    label: "專業技能",
    short: "你的工具箱",
    description: "用實際應用經驗，呈現你熟悉的工具與能力。",
    fields: [
      { key: "title", label: "技能名稱" },
      { key: "category", label: "技能分類" },
      { key: "level", label: "熟悉程度描述" },
      { key: "description", label: "應用經驗", type: "textarea" },
    ],
  },
  {
    id: "certificates",
    label: "證照與檢定",
    short: "能力的足跡",
    description: "記錄證照與檢定，沒有也可以直接跳過。",
    fields: [
      { key: "title", label: "證照／檢定名稱" },
      { key: "issuer", label: "發證單位" },
      { key: "date", label: "取得日期", type: "date" },
      { key: "score", label: "成績／級別" },
      {
        key: "expiry",
        label: "有效期限",
        type: "date",
        hint: "永久有效可留白",
      },
    ],
  },
  {
    id: "experience",
    label: "實務經驗",
    short: "走進真實場域",
    description: "整理實習、工作與教學經驗中的收穫。",
    fields: [
      { key: "organization", label: "單位名稱" },
      { key: "role", label: "職務" },
      { key: "type", label: "經驗類型" },
      ...period,
      { key: "description", label: "工作內容與成果", type: "textarea" },
    ],
  },
  {
    id: "other",
    label: "其他經歷",
    short: "更多面的你",
    description: "社團、志工、活動，或任何想留下的經驗。",
    fields: [
      { key: "title", label: "經歷名稱" },
      { key: "type", label: "類型" },
      { key: "role", label: "角色" },
      ...period,
      note,
    ],
  },
];
export const categoryIds = categories.map((c) => c.id);
export type Records = Record<CategoryId, Entry[]>;
export const emptyRecords = (): Records => ({
  basic: [],
  education: [],
  academic: [],
  projects: [],
  awards: [],
  skills: [],
  certificates: [],
  experience: [],
  other: [],
});
export function completion(records: Records) {
  const v = records.basic[0]?.values ?? {};
  return (
    ["name", "school", "department", "degree", "status"].filter((k) =>
      v[k]?.trim(),
    ).length * 20
  );
}
export function entryTitle(entry: Entry) {
  return (
    entry.values.name ||
    entry.values.title ||
    entry.values.school ||
    entry.values.organization ||
    "未命名紀錄"
  );
}
export function validateEntry(entry: Entry): string | null {
  const v = entry.values;
  if (v.start && v.end && v.end < v.start) return "結束年月不能早於開始年月。";
  if (v.date && v.expiry && v.expiry < v.date)
    return "有效期限不能早於取得日期。";
  if (v.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email))
    return "請輸入有效的 Email 格式。";
  if (v.url) {
    try {
      const url = new URL(v.url);
      if (!["https:", "http:"].includes(url.protocol))
        return "成果連結請使用 http 或 https 網址。";
    } catch {
      return "請輸入完整的成果網址（包含 https://）。";
    }
  }
  return null;
}
