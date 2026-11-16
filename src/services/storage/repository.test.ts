import { describe, expect, it } from "vitest";
import { completion, validateEntry, type Entry } from "../../domain/profile";
import {
  deleteEntry,
  emptyData,
  GuestRepository,
  parseData,
  restoreRevision,
  saveEntry,
  STORAGE_KEY,
  type StoragePort,
} from "./repository";
class MemoryStorage implements StoragePort {
  value: string | null = null;
  fail = false;
  getItem() {
    return this.value;
  }
  setItem(_key: string, value: string) {
    if (this.fail) throw new Error("quota");
    this.value = value;
  }
}
const entry: Entry = {
  id: "profile",
  values: {
    name: "測試使用者",
    school: "測試學校",
    department: "測試科系",
    degree: "大學",
    status: "在學中",
  },
};
describe("guest data lifecycle", () => {
  it("keeps unconfirmed draft separate and recovers on a fresh repository instance", () => {
    const storage = new MemoryStorage();
    const repo = new GuestRepository(storage);
    const d = repo.load();
    repo.write({
      ...d,
      drafts: { basic: { entry, updatedAt: new Date().toISOString() } },
    });
    const restored = new GuestRepository(storage).load();
    expect(restored.drafts.basic?.entry).toEqual(entry);
    expect(restored.records.basic).toEqual([]);
    expect(completion(restored.records)).toBe(0);
  });
  it("commits formal data, clears only its draft, and retains formal data after reload", () => {
    const storage = new MemoryStorage();
    const repo = new GuestRepository(storage);
    const d = repo.load();
    d.drafts.basic = { entry, updatedAt: "now" };
    d.drafts.skills = {
      entry: { id: "skill", values: { title: "Python" } },
      updatedAt: "now",
    };
    repo.write(saveEntry(d, "basic", entry));
    const reloaded = new GuestRepository(storage).load();
    expect(reloaded.records.basic).toEqual([entry]);
    expect(reloaded.drafts.basic).toBeUndefined();
    expect(reloaded.drafts.skills).toBeDefined();
    expect(completion(reloaded.records)).toBe(100);
  });
  it("calculates only the five confirmed basic fields and permits incomplete profiles", () => {
    const d = saveEntry(emptyData(), "basic", {
      id: "basic",
      values: { name: "小明", email: "test@example.com" },
    });
    expect(completion(d.records)).toBe(20);
    expect(validateEntry(d.records.basic[0])).toBeNull();
    expect(
      completion(
        saveEntry(d, "awards", { id: "award", values: { title: "測試" } })
          .records,
      ),
    ).toBe(20);
  });
  it("updates by id, deletes, and restores without losing other categories", () => {
    let d = saveEntry(emptyData(), "basic", entry);
    d = saveEntry(d, "skills", { id: "a", values: { title: "Python" } });
    d = saveEntry(d, "skills", { id: "a", values: { title: "TypeScript" } });
    expect(d.records.skills).toHaveLength(1);
    d = deleteEntry(d, "skills", "a");
    expect(d.records.skills).toEqual([]);
    d = restoreRevision(d, d.revisions[0]);
    expect(d.records.skills[0].values.title).toBe("TypeScript");
    expect(d.records.basic[0]).toEqual(entry);
    expect(d.revisions[0].action).toBe("復原版本");
  });
  it("caps revision history at 20 entries", () => {
    let d = emptyData();
    for (let i = 0; i < 25; i++)
      d = saveEntry(d, "basic", { ...entry, values: { name: String(i) } });
    expect(d.revisions).toHaveLength(20);
    expect(d.revisions[0].before[0].values.name).toBe("23");
  });
  it("does not overwrite storage on quota failure", () => {
    const storage = new MemoryStorage();
    const repo = new GuestRepository(storage);
    repo.write(repo.load());
    const before = storage.value;
    storage.fail = true;
    expect(() => repo.write(saveEntry(emptyData(), "basic", entry))).toThrow(
      "無法保存",
    );
    expect(storage.value).toBe(before);
  });
  it("preserves corrupt or unknown-version data and blocks writes", () => {
    for (const value of [
      "bad json",
      '{"version":2}',
      JSON.stringify({
        ...emptyData(),
        records: { ...emptyData().records, basic: [entry, entry] },
      }),
    ]) {
      const storage = new MemoryStorage();
      storage.value = value;
      const repo = new GuestRepository(storage);
      expect(() => repo.load()).toThrow();
      expect(() => repo.write(emptyData())).toThrow();
      expect(storage.value).toBe(value);
    }
  });
  it("blocks stale-tab overwrites, including a draft update", () => {
    const storage = new MemoryStorage();
    const a = new GuestRepository(storage);
    const b = new GuestRepository(storage);
    const da = a.load();
    const db = b.load();
    a.write(saveEntry(da, "basic", entry));
    expect(() => b.write({ ...db, onboardingDismissed: true })).toThrow(
      "另一個分頁",
    );
    expect(parseData(storage.getItem()).records.basic[0]).toEqual(entry);
  });
  it("rejects invalid URLs, email, reversed dates; does not require optional fields", () => {
    expect(
      validateEntry({ id: "a", values: { url: "javascript:alert(1)" } }),
    ).toBeTruthy();
    expect(validateEntry({ id: "a", values: { email: "bad" } })).toBeTruthy();
    expect(
      validateEntry({ id: "a", values: { start: "2026-10", end: "2025-10" } }),
    ).toBeTruthy();
    expect(
      validateEntry({
        id: "a",
        values: { date: "2026-10-01", expiry: "2025-10-01" },
      }),
    ).toBeTruthy();
    expect(validateEntry({ id: "a", values: {} })).toBeNull();
  });
  it("deleting a saved record preserves unrelated drafts", () => {
    let d = saveEntry(emptyData(), "skills", {
      id: "a",
      values: { title: "Python" },
    });
    d.drafts.skills = {
      entry: { id: "b", values: { title: "TypeScript" } },
      updatedAt: "now",
    };
    d.drafts.basic = { entry, updatedAt: "now" };
    d = deleteEntry(d, "skills", "a");
    expect(d.records.skills).toEqual([]);
    expect(d.drafts.skills?.entry.id).toBe("b");
    expect(d.drafts.basic?.entry).toEqual(entry);
  });
});
