import {
  categoryIds,
  emptyRecords,
  type CategoryId,
  type Entry,
  type Records,
} from "../../domain/profile";
export const STORAGE_KEY = "applymate.guest.v1";
export interface Draft {
  entry: Entry;
  updatedAt: string;
}
export interface Revision {
  id: string;
  category: CategoryId;
  before: Entry[];
  at: string;
  action: string;
}
export interface GuestData {
  version: 1;
  records: Records;
  drafts: Partial<Record<CategoryId, Draft>>;
  revisions: Revision[];
  onboardingDismissed: boolean;
}
export interface StoragePort {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
}
export const emptyData = (): GuestData => ({
  version: 1,
  records: emptyRecords(),
  drafts: {},
  revisions: [],
  onboardingDismissed: false,
});
function isEntry(v: unknown): v is Entry {
  if (!v || typeof v !== "object") return false;
  const e = v as Entry;
  return (
    typeof e.id === "string" &&
    !!e.values &&
    typeof e.values === "object" &&
    !Array.isArray(e.values) &&
    Object.values(e.values).every((x) => typeof x === "string")
  );
}
function isEntries(v: unknown): v is Entry[] {
  return (
    Array.isArray(v) &&
    v.every(isEntry) &&
    new Set(v.map((e) => e.id)).size === v.length
  );
}
export function parseData(raw: string | null): GuestData {
  if (raw === null) return emptyData();
  try {
    const d = JSON.parse(raw) as GuestData;
    if (
      d.version !== 1 ||
      !d.records ||
      !categoryIds.every((k) => isEntries(d.records[k])) ||
      d.records.basic.length > 1 ||
      !d.drafts ||
      Array.isArray(d.drafts) ||
      typeof d.drafts !== "object" ||
      !Array.isArray(d.revisions) ||
      typeof d.onboardingDismissed !== "boolean"
    )
      throw new Error();
    for (const [k, draft] of Object.entries(d.drafts))
      if (
        !categoryIds.includes(k as CategoryId) ||
        !draft ||
        !isEntry(draft.entry) ||
        typeof draft.updatedAt !== "string"
      )
        throw new Error();
    if (
      !d.revisions.every(
        (r) =>
          typeof r.id === "string" &&
          categoryIds.includes(r.category) &&
          isEntries(r.before) &&
          (r.category !== "basic" || r.before.length <= 1) &&
          typeof r.at === "string" &&
          typeof r.action === "string",
      )
    )
      throw new Error();
    return d;
  } catch {
    throw new Error(
      "瀏覽器內的資料格式無法讀取。原始資料已保留，請勿清除瀏覽資料；可聯絡維護者協助復原。",
    );
  }
}
export class GuestRepository {
  private raw: string | null = null;
  private ready = false;
  constructor(private storage: StoragePort) {}
  load(): GuestData {
    this.raw = this.storage.getItem(STORAGE_KEY);
    const data = parseData(this.raw);
    this.ready = true;
    return data;
  }
  write(data: GuestData): GuestData {
    if (!this.ready)
      throw new Error("資料尚未安全載入，已停止寫入以保護原有內容。");
    if (this.storage.getItem(STORAGE_KEY) !== this.raw)
      throw new Error(
        "另一個分頁已更新資料。請先複製目前未保存的內容，再重新整理；本頁不會覆蓋另一分頁的資料。",
      );
    const next = JSON.stringify(data);
    try {
      this.storage.setItem(STORAGE_KEY, next);
    } catch {
      throw new Error(
        "無法保存至瀏覽器，可能空間不足或儲存被停用。請先複製目前內容；舊資料不會被清除。",
      );
    }
    this.raw = next;
    return data;
  }
}
function history(
  data: GuestData,
  category: CategoryId,
  action: string,
): Revision[] {
  return [
    {
      id: crypto.randomUUID(),
      category,
      before: structuredClone(data.records[category]),
      at: new Date().toISOString(),
      action,
    },
    ...data.revisions,
  ].slice(0, 20);
}
export function saveEntry(
  data: GuestData,
  category: CategoryId,
  entry: Entry,
): GuestData {
  const old = data.records[category];
  const entries =
    category === "basic"
      ? [entry]
      : old.some((e) => e.id === entry.id)
        ? old.map((e) => (e.id === entry.id ? entry : e))
        : [...old, entry];
  const drafts = { ...data.drafts };
  delete drafts[category];
  return {
    ...data,
    records: { ...data.records, [category]: entries },
    drafts,
    revisions: history(data, category, "儲存資料"),
  };
}
export function deleteEntry(
  data: GuestData,
  category: CategoryId,
  id: string,
): GuestData {
  const drafts = { ...data.drafts };
  if (drafts[category]?.entry.id === id) delete drafts[category];
  return {
    ...data,
    records: {
      ...data.records,
      [category]: data.records[category].filter((e) => e.id !== id),
    },
    drafts,
    revisions: history(
      data,
      category,
      category === "basic" ? "清空基本資料" : "刪除紀錄",
    ),
  };
}
export function restoreRevision(
  data: GuestData,
  revision: Revision,
): GuestData {
  const drafts = { ...data.drafts };
  delete drafts[revision.category];
  return {
    ...data,
    records: {
      ...data.records,
      [revision.category]: structuredClone(revision.before),
    },
    drafts,
    revisions: history(data, revision.category, "復原版本"),
  };
}
