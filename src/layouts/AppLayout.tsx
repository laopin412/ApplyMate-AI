import {
  ArrowLeft,
  ArrowRight,
  Bell,
  ChevronRight,
  Construction,
  FileText,
  GraduationCap,
  LayoutDashboard,
  Menu,
  MessageSquare,
  PanelLeftClose,
  Settings,
  ShieldCheck,
  UserRound,
  X,
} from "lucide-react";
import { useState } from "react";
import {
  Link,
  NavLink,
  Outlet,
  useLocation,
  useParams,
} from "react-router-dom";
import { Brand } from "../components/Brand";
import { SkipLink } from "../components/SkipLink";
import { useStore } from "../app/Store";
export const navigation = [
  { to: "/app", label: "儀表板", icon: LayoutDashboard, live: true },
  { to: "/app/profile", label: "個人資料", icon: UserRound, live: true },
  { to: "/app/applications", label: "學校申請管理", icon: GraduationCap },
  { to: "/app/documents", label: "備審文件", icon: FileText },
  { to: "/app/interview", label: "AI 模擬面試", icon: MessageSquare },
  { to: "/app/settings", label: "系統設定", icon: Settings },
];
export function AppLayout() {
  const [menu, setMenu] = useState(false);
  const [notifications, setNotifications] = useState(false);
  const location = useLocation();
  const { error } = useStore();
  const title =
    navigation.find(
      (n) =>
        n.to === location.pathname ||
        (n.to !== "/app" && location.pathname.startsWith(n.to)),
    )?.label || "功能預覽";
  return (
    <div className="app-shell">
      <SkipLink target="app-main" />
      {menu && (
        <button
          className="sidebar-backdrop"
          aria-label="關閉主選單"
          onClick={() => setMenu(false)}
        />
      )}
      <aside className={`app-sidebar ${menu ? "is-open" : ""}`}>
        <div className="sidebar-brand">
          <Brand light />
          <button
            className="icon-button mobile-only"
            aria-label="關閉選單"
            onClick={() => setMenu(false)}
          >
            <X />
          </button>
        </div>
        <div className="workspace-label">你的升學準備空間</div>
        <nav aria-label="平台主選單">
          {navigation.map((n) => (
            <NavLink
              key={n.to}
              to={n.to}
              end={n.to === "/app"}
              onClick={() => setMenu(false)}
              className={({ isActive }) =>
                `sidebar-link ${isActive ? "active" : ""}`
              }
            >
              <n.icon size={19} />
              <span>{n.label}</span>
              {!n.live && <small>未開放</small>}
            </NavLink>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <div className="sidebar-tip">
            <ShieldCheck size={22} />
            <strong>你的資料，留在這裡</strong>
            <p>
              訪客資料保存在此瀏覽器，
              <br />
              不會上傳至伺服器。
            </p>
          </div>
          <Link to="/" className="back-home">
            <ArrowLeft size={16} /> 返回首頁
          </Link>
          <div className="sidebar-version">
            APPLYMATE AI <span>v0.1 · 本機版</span>
          </div>
        </div>
      </aside>
      <div className="app-content">
        <header className="app-topbar">
          <div className="breadcrumbs">
            <button
              className="icon-button mobile-only"
              onClick={() => setMenu(true)}
              aria-label="開啟主選單"
              aria-expanded={menu}
            >
              <Menu size={21} />
            </button>
            <PanelLeftClose size={18} className="desktop-only" />
            <span className="desktop-only">我的工作空間</span>
            <ChevronRight size={14} className="desktop-only" />
            <strong>{title}</strong>
          </div>
          <div className="topbar-actions">
            <span className="local-badge">
              <span className="status-dot" />
              本機體驗版
            </span>
            <div className="notification-wrap">
              <button
                className="icon-button"
                aria-label="通知"
                aria-expanded={notifications}
                onClick={() => setNotifications(!notifications)}
              >
                <Bell size={19} />
              </button>
              {notifications && (
                <div className="notification-popover">
                  <strong>網站內通知</strong>
                  <p>通知功能尚未開放。此版本不會寄送 Email 或背景提醒。</p>
                  <button
                    className="text-button"
                    onClick={() => setNotifications(false)}
                  >
                    知道了
                  </button>
                </div>
              )}
            </div>
            <span className="topbar-divider" />
            <div className="guest-avatar">訪</div>
            <span className="guest-name">訪客</span>
          </div>
        </header>
        <main id="app-main" className="app-main" tabIndex={-1}>
          {error && (
            <div className="error-banner" role="alert">
              {error}
            </div>
          )}
          <Outlet />
        </main>
        <footer className="app-footer">
          <span>ApplyMate AI · 讓每一份努力，都被看見。</span>
          <span>資料僅儲存於目前瀏覽器</span>
        </footer>
      </div>
    </div>
  );
}
const descriptions: Record<string, [string, string]> = {
  applications: [
    "學校申請管理",
    "未來可集中管理申請校系、手動更新進度，並查看重要日期。",
  ],
  documents: [
    "備審文件",
    "未來將以你提供的真實資料，協助建立學校客製化與通用備審草稿。",
  ],
  interview: [
    "AI 模擬面試",
    "未來將提供動態追問與具體改善建議，陪你練習表達。",
  ],
  settings: ["系統設定", "帳號、偏好與通知設定將在後續版本加入。"],
  login: [
    "會員登入",
    "Email 與 Google 登入尚未串接。你現在就能以訪客身分整理個人資料。",
  ],
  import: [
    "AI 文件匯入",
    "PDF、DOCX、TXT 的分類預覽與確認匯入流程將在後續版本加入。",
  ],
};
export function ComingSoon({ missing = false }: { missing?: boolean }) {
  const { feature } = useParams();
  const content = descriptions[feature || ""];
  return (
    <section className="coming-soon">
      <span className="large-empty-icon">
        <Construction size={34} />
      </span>
      <span className="eyebrow">
        {missing || !content ? "PAGE NOT FOUND" : "MORE POSSIBILITIES AHEAD"}
      </span>
      <h1>{content?.[0] || "找不到這個頁面"}</h1>
      <span className="badge">{content ? "尚未開放" : "請檢查網址"}</span>
      <p>{content?.[1] || "這個網址沒有對應的頁面，請回到儀表板繼續。"}</p>
      {content && (
        <p className="muted">
          目前版本已開放個人資料管理。此功能尚在開發規劃中，與是否登入無關。
        </p>
      )}
      <div className="button-row">
        <Link className="button secondary" to="/app">
          返回儀表板
        </Link>
        <Link className="button primary" to="/app/profile">
          整理個人資料 <ArrowRight size={17} />
        </Link>
      </div>
    </section>
  );
}
