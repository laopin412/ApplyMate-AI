import {
  ArrowRight,
  Check,
  CheckCircle2,
  ChevronRight,
  Clock3,
  FileUp,
  History,
  Info,
  Pencil,
  Plus,
  RotateCcw,
  Save,
  Trash2,
  UserRound,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import { useStore } from "../app/Store";
import { useConfirm } from "../components/useConfirm";
import {
  categories,
  completion,
  entryTitle,
  validateEntry,
  type Category,
  type CategoryId,
  type Entry,
} from "../domain/profile";
import {
  deleteEntry,
  restoreRevision,
  saveEntry,
} from "../services/storage/repository";
function makeEntry(): Entry {
  return { id: crypto.randomUUID(), values: {} };
}
function time(value: string) {
  return new Date(value).toLocaleString("zh-TW", { hour12: false });
}
export function Profile() {
  const { categoryId = "basic" } = useParams();
  const category = categories.find((c) => c.id === categoryId);
  if (!category) return <Navigate to="/app/profile/basic" replace />;
  return <ProfileEditor key={categoryId} category={category} />;
}
function ProfileEditor({ category }: { category: Category }) {
  const { confirm, confirmation } = useConfirm();
  const { data, commit, blocked } = useStore();
  const navigate = useNavigate();
  const id = category.id;
  const [editor, setEditor] = useState<Entry | null>(
    () =>
      data.drafts[id]?.entry ??
      (id === "basic" ? (data.records.basic[0] ?? makeEntry()) : null),
  );
  const [notice, setNotice] = useState(
    data.drafts[id] ? "已恢復此分類上次未正式保存的草稿。" : "",
  );
  const [validation, setValidation] = useState("");
  const [historyOpen, setHistoryOpen] = useState(false);
  const [failedDraft, setFailedDraft] = useState(false);
  const percent = completion(data.records);
  const draft = data.drafts[id];
  const entries = data.records[id];
  useEffect(() => {
    if (!failedDraft) return;
    const unload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = "";
    };
    const leave = async (event: MouseEvent) => {
      const target =
        event.target instanceof Element ? event.target.closest("a") : null;
      if (target) {
        event.preventDefault();
        event.stopPropagation();
        if (
          await confirm(
            "目前內容尚未成功保存。離開前請先複製內容。仍要離開嗎？",
          )
        )
          navigate(new URL(target.href).hash.slice(1) || "/");
      }
    };
    window.addEventListener("beforeunload", unload);
    document.addEventListener("click", leave, true);
    return () => {
      window.removeEventListener("beforeunload", unload);
      document.removeEventListener("click", leave, true);
    };
  }, [failedDraft]);
  function update(key: string, value: string) {
    if (!editor) return;
    const next = { ...editor, values: { ...editor.values, [key]: value } };
    setEditor(next);
    setNotice("");
    setValidation("");
    const success = commit((d) => ({
      ...d,
      drafts: {
        ...d.drafts,
        [id]: { entry: next, updatedAt: new Date().toISOString() },
      },
    }));
    setFailedDraft(!success);
  }
  function clearDraft() {
    return commit((d) => {
      const drafts = { ...d.drafts };
      delete drafts[id];
      return { ...d, drafts };
    });
  }
  async function openEditor(entry?: Entry) {
    if (
      (draft || failedDraft) &&
      !(await confirm(
        "此分類有未正式保存的草稿。要捨棄草稿並開啟另一筆資料嗎？",
      ))
    )
      return;
    if ((draft || failedDraft) && !clearDraft()) return;
    setEditor(entry ? structuredClone(entry) : makeEntry());
    setFailedDraft(false);
    setValidation("");
    setNotice("");
  }
  function save() {
    if (!editor) return;
    const clean = {
      ...editor,
      values: Object.fromEntries(
        Object.entries(editor.values).map(([k, v]) => [k, v.trim()]),
      ),
    };
    const error = validateEntry(clean);
    if (error) {
      setValidation(error);
      return;
    }
    if (id !== "basic" && !Object.values(clean.values).some(Boolean)) {
      setValidation("請先填寫至少一項內容，再儲存這筆經歷。");
      return;
    }
    if (commit((d) => saveEntry(d, id, clean))) {
      setEditor(id === "basic" ? clean : null);
      setFailedDraft(false);
      setValidation("");
      setNotice("正式資料已更新，已保存在此瀏覽器。");
    }
  }
  async function cancel() {
    if (
      (draft || failedDraft) &&
      !(await confirm("確定捨棄這份草稿？已正式保存的資料不會改變。"))
    )
      return;
    if (!clearDraft()) return;
    setEditor(id === "basic" ? (data.records.basic[0] ?? makeEntry()) : null);
    setFailedDraft(false);
    setValidation("");
    setNotice("已取消修改，正式資料維持不變。");
  }
  async function remove(entry: Entry) {
    if (
      !(await confirm(
        id === "basic"
          ? "確定清空正式基本資料？相關草稿也會清除，可從最近的修改歷程復原正式資料。"
          : `確定刪除「${entryTitle(entry)}」？可從最近的修改歷程復原正式資料。`,
      ))
    )
      return;
    if (commit((d) => deleteEntry(d, id, entry.id))) {
      if (editor?.id === entry.id) {
        setEditor(id === "basic" ? makeEntry() : null);
        setFailedDraft(false);
      }
      setNotice("已刪除正式資料，可於修改歷程復原。");
    }
  }
  return (
    <>
      {confirmation}
      <div className="page-heading">
        <div>
          <span className="eyebrow">YOUR STORY STARTS WITH YOU</span>
          <h1>個人資料管理</h1>
          <p>把每一段經歷整理好，為下一步累積底氣。</p>
        </div>
        <Link className="button secondary" to="/app/import">
          <FileUp size={17} /> AI 文件匯入 <span className="badge">未開放</span>
        </Link>
      </div>
      <div className="profile-overview panel">
        <div className="overview-title">
          <span className="mini-icon blue">
            <UserRound size={22} />
          </span>
          <div>
            <strong>一點一滴，建立完整的你</strong>
            <p>先完成五項基本資料，其他經歷依需要補充即可。</p>
          </div>
        </div>
        <div className="overview-progress">
          <div>
            <span>基本資料完成度</span>
            <strong>{percent}%</strong>
          </div>
          <div className="progress-track">
            <span style={{ width: `${percent}%` }} />
          </div>
          <small>依正式資料計算 · {percent / 20} / 5 項</small>
        </div>
      </div>
      <div className="profile-layout">
        <aside className="category-sidebar">
          <span className="category-heading">
            我的資料分類 <small>09</small>
          </span>
          <nav aria-label="個人資料分類">
            {categories.map((c, index) => (
              <Link
                to={`/app/profile/${c.id}`}
                key={c.id}
                className={`category-link ${c.id === id ? "selected" : ""}`}
                aria-current={c.id === id ? "page" : undefined}
              >
                <span className="category-number">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span>{c.label}</span>
                {data.drafts[c.id] && (
                  <span className="draft-dot" title="有未正式保存的草稿" />
                )}
                <small>
                  {c.id === "basic" ? (
                    percent === 100 ? (
                      <Check size={14} />
                    ) : (
                      ""
                    )
                  ) : (
                    data.records[c.id].length || ""
                  )}
                </small>
                {c.id === id && <ChevronRight size={14} />}
              </Link>
            ))}
          </nav>
          <div className="category-tip">
            <Info size={17} />
            <p>
              不需要填滿每一類。
              <br />
              真實的經歷，就是最好的起點。
            </p>
          </div>
        </aside>
        <div className="profile-workspace">
          <label className="mobile-category mobile-only">
            資料分類
            <select
              value={id}
              onChange={async (e) => {
                const nextCategory = e.target.value;
                if (
                  failedDraft &&
                  !(await confirm(
                    "草稿尚未成功保存。請先複製內容，確定仍要切換分類嗎？",
                  ))
                )
                  return;
                navigate(`/app/profile/${nextCategory}`);
              }}
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.label}
                </option>
              ))}
            </select>
          </label>
          <section className="panel profile-panel">
            <div className="profile-panel-heading">
              <div>
                <span className="micro-label">{category.short}</span>
                <h2>
                  {category.label}
                  <span className="badge">
                    {id === "basic"
                      ? "單份資料"
                      : `${entries.length} 筆正式紀錄`}
                  </span>
                </h2>
                <p>{category.description}</p>
              </div>
              <button
                className={`icon-label-button ${historyOpen ? "selected" : ""}`}
                onClick={() => setHistoryOpen(!historyOpen)}
                aria-expanded={historyOpen}
              >
                <History size={17} />
                <span>修改歷程</span>
              </button>
            </div>
            {notice && (
              <div className="success-message" role="status">
                <CheckCircle2 size={17} />
                {notice}
              </div>
            )}
            {historyOpen && (
              <div className="history-panel">
                <div className="panel-heading">
                  <h3>正式資料修改歷程</h3>
                  <button
                    className="icon-button"
                    aria-label="關閉修改歷程"
                    onClick={() => setHistoryOpen(false)}
                  >
                    <X size={17} />
                  </button>
                </div>
                <p>
                  所有分類合計保留最近 20
                  次變更。復原會取回該次操作前的此分類資料，並清除此分類草稿。
                </p>
                {data.revisions.filter((r) => r.category === id).length ===
                0 ? (
                  <p className="muted">這個分類還沒有正式修改紀錄。</p>
                ) : (
                  data.revisions
                    .filter((r) => r.category === id)
                    .map((r) => (
                      <div className="history-row" key={r.id}>
                        <div>
                          <strong>{r.action}</strong>
                          <small>
                            {time(r.at)} · 操作前 {r.before.length} 筆
                          </small>
                        </div>
                        <button
                          className="text-button"
                          disabled={blocked}
                          onClick={async () => {
                            if (
                              !(await confirm(
                                "將恢復為這次操作前的分類資料，並捨棄此分類目前的草稿。確定復原？",
                              ))
                            )
                              return;
                            if (commit((d) => restoreRevision(d, r))) {
                              setEditor(
                                id === "basic"
                                  ? (r.before[0] ?? makeEntry())
                                  : null,
                              );
                              setFailedDraft(false);
                              setValidation("");
                              setNotice(
                                "已復原正式資料，並保留本次復原前的版本。",
                              );
                            }
                          }}
                        >
                          <RotateCcw size={14} />
                          復原
                        </button>
                      </div>
                    ))
                )}
              </div>
            )}
            {id !== "basic" && (
              <>
                <div className="entries-toolbar">
                  <span className="muted caption">
                    只記錄真實經歷，未填寫的欄位可以留白。
                  </span>
                  <button
                    className="button primary small"
                    disabled={blocked}
                    onClick={() => openEditor()}
                  >
                    <Plus size={16} />
                    新增紀錄
                  </button>
                </div>
                {entries.length > 0 && (
                  <div className="entries-list">
                    {entries.map((entry) => (
                      <article className="entry-card" key={entry.id}>
                        <div>
                          <h3>{entryTitle(entry)}</h3>
                          <p>
                            {Object.entries(entry.values)
                              .filter(
                                ([k, v]) =>
                                  v &&
                                  ![
                                    "name",
                                    "title",
                                    "school",
                                    "organization",
                                  ].includes(k),
                              )
                              .slice(0, 2)
                              .map(([, v]) => v)
                              .join(" · ") || "尚未填寫更多內容"}
                          </p>
                        </div>
                        <div className="entry-actions">
                          <button
                            className="icon-button"
                            aria-label={`編輯 ${entryTitle(entry)}`}
                            onClick={() => openEditor(entry)}
                            disabled={blocked}
                          >
                            <Pencil size={16} />
                          </button>
                          <button
                            className="icon-button danger-text"
                            aria-label={`刪除 ${entryTitle(entry)}`}
                            onClick={() => remove(entry)}
                            disabled={blocked}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </article>
                    ))}
                  </div>
                )}
                {entries.length === 0 && !editor && (
                  <div className="empty-state profile-empty">
                    <span className="empty-icon">
                      <Plus size={27} />
                    </span>
                    <h3>留下第一段{category.label}</h3>
                    <p>
                      現在沒有也沒關係。你可以隨時回來補充，
                      <br />
                      這不會影響基本資料完成度。
                    </p>
                    <button
                      className="button secondary"
                      disabled={blocked}
                      onClick={() => openEditor()}
                    >
                      新增一筆紀錄 <ArrowRight size={16} />
                    </button>
                  </div>
                )}
              </>
            )}
            {editor && (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  save();
                }}
                noValidate
              >
                <div className="form-intro">
                  <span>
                    <Info size={15} />
                    {id === "basic"
                      ? "標記「基本」的五個欄位用於計算完成度，未填滿仍可保存。"
                      : entries.some((e) => e.id === editor.id)
                        ? "正在編輯紀錄，正式保存後才會更新。"
                        : "新增紀錄，填寫完成後請按「儲存資料」。"}
                  </span>
                </div>
                <div className="form-grid">
                  {category.fields.map((field) => (
                    <label
                      className={`field ${field.type === "textarea" ? "field-wide" : ""}`}
                      key={field.key}
                    >
                      <span>
                        {field.label}
                        {field.core ? (
                          <small className="core-label">基本</small>
                        ) : (
                          <small>選填</small>
                        )}
                      </span>
                      {field.type === "textarea" ? (
                        <textarea
                          value={editor.values[field.key] || ""}
                          onChange={(e) => update(field.key, e.target.value)}
                          rows={4}
                          maxLength={10000}
                          disabled={blocked}
                          placeholder={`寫下你的${field.label}…`}
                        />
                      ) : field.type === "select" ? (
                        <select
                          value={editor.values[field.key] || ""}
                          onChange={(e) => update(field.key, e.target.value)}
                          disabled={blocked}
                        >
                          <option value="">請選擇{field.label}</option>
                          {field.options?.map((option) => (
                            <option key={option}>{option}</option>
                          ))}
                        </select>
                      ) : (
                        <input
                          type={field.type || "text"}
                          value={editor.values[field.key] || ""}
                          onChange={(e) => update(field.key, e.target.value)}
                          maxLength={1000}
                          disabled={blocked}
                          placeholder={
                            field.type === "url"
                              ? "https://"
                              : `請輸入${field.label}`
                          }
                          autoComplete={
                            field.key === "name"
                              ? "name"
                              : field.key === "email"
                                ? "email"
                                : field.key === "phone"
                                  ? "tel"
                                  : "off"
                          }
                        />
                      )}{" "}
                      {field.hint && (
                        <small className="field-hint">{field.hint}</small>
                      )}
                    </label>
                  ))}
                </div>
                {validation && (
                  <div role="alert" className="error-banner">
                    {validation}
                  </div>
                )}
                <div className="save-bar">
                  <div
                    className={`draft-status ${failedDraft ? "danger-text" : ""}`}
                    aria-live="polite"
                  >
                    <Clock3 size={16} />
                    <span>
                      {failedDraft
                        ? "草稿未成功保存，請勿關閉頁面"
                        : draft
                          ? "草稿已保存 · 尚未正式更新"
                          : "修改時會自動保存草稿"}
                      {draft && !failedDraft && (
                        <small>{time(draft.updatedAt)}</small>
                      )}
                    </span>
                  </div>
                  <div className="button-row">
                    <button
                      type="button"
                      className="button secondary"
                      onClick={cancel}
                      disabled={blocked}
                    >
                      取消修改
                    </button>
                    <button
                      type="submit"
                      className="button primary"
                      disabled={blocked}
                    >
                      <Save size={16} />
                      儲存資料
                    </button>
                  </div>
                </div>
              </form>
            )}
            {id === "basic" && entries.length > 0 && (
              <div className="clear-basic">
                <button
                  className="text-button danger-text"
                  onClick={() => remove(entries[0])}
                  disabled={blocked}
                >
                  <Trash2 size={14} />
                  清空基本資料
                </button>
              </div>
            )}
          </section>
          <p className="storage-footnote">
            <ShieldNote />
            資料僅保存在目前瀏覽器，無跨裝置同步。儲存容量有限，清除網站資料可能造成遺失。
          </p>
        </div>
      </div>
    </>
  );
}
function ShieldNote() {
  return <Info size={14} />;
}
