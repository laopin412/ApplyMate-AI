import {
  ArrowRight,
  ArrowUpRight,
  CalendarDays,
  Check,
  ChevronRight,
  Circle,
  FileText,
  GraduationCap,
  MessageSquare,
  Plus,
  ShieldCheck,
  Sparkles,
  Trophy,
  UserRound,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useStore } from "../app/Store";
import { categories, completion } from "../domain/profile";
export function Dashboard() {
  const { data, commit } = useStore();
  const percent = completion(data.records);
  const name = data.records.basic[0]?.values.name;
  const experienceCount = categories
    .filter((c) => c.id !== "basic")
    .reduce((sum, c) => sum + data.records[c.id].length, 0);
  const tasks = [
    {
      title: "建立個人基本資料",
      desc: "先讓平台認識你",
      done: percent === 100,
      to: "/app/profile/basic",
      available: true,
    },
    {
      title: "新增目標學校",
      desc: "找到想前往的方向",
      done: false,
      to: "/app/applications",
      available: false,
    },
    {
      title: "整理學歷與專題",
      desc: "留下你的學習足跡",
      done:
        data.records.education.length > 0 && data.records.projects.length > 0,
      to: data.records.education.length
        ? "/app/profile/projects"
        : "/app/profile/education",
      available: true,
    },
    {
      title: "生成第一份備審文件",
      desc: "用故事展現你的優勢",
      done: false,
      to: "/app/documents",
      available: false,
    },
  ];
  return (
    <>
      <div className="page-heading">
        <div>
          <span className="eyebrow">YOUR PREPARATION, AT A GLANCE</span>
          <h1>
            {name ? `${name}，準備好下一步了嗎？` : "你好，準備出發的你。"}
            <span className="greeting-spark">✦</span>
          </h1>
          <p>不必一次做到完美，每一小步都算數。</p>
        </div>
        <Link className="button primary" to="/app/profile">
          整理個人資料 <ArrowUpRight size={17} />
        </Link>
      </div>
      <div className="visitor-notice">
        <ShieldCheck size={19} />
        <p>
          <strong>目前為訪客模式</strong>
          <span>
            資料僅保存在此瀏覽器。清除瀏覽資料或更換裝置，將無法取回；此暫存不是永久備份。
          </span>
        </p>
        <span className="badge">本機保存</span>
      </div>
      <div className="stats-grid">
        {[
          { label: "申請學校", icon: GraduationCap, color: "blue" },
          { label: "備審文件", icon: FileText, color: "lavender" },
          { label: "面試安排", icon: MessageSquare, color: "amber" },
          { label: "錄取結果", icon: Trophy, color: "green" },
        ].map((s) => (
          <div className="stat-card" key={s.label}>
            <div>
              <span>{s.label}</span>
              <span className={`mini-icon ${s.color}`}>
                <s.icon size={19} />
              </span>
            </div>
            <strong>—</strong>
            <small>
              <span className="tiny-dot" />
              相關功能尚未開放
            </small>
          </div>
        ))}
      </div>
      {!data.onboardingDismissed ? (
        <section className="onboarding panel">
          <div className="panel-heading">
            <div>
              <div className="heading-with-icon">
                <Sparkles size={20} />
                <h2>從這幾件小事開始</h2>
                <span className="badge lavender-badge">新手任務</span>
              </div>
              <p>依照自己的步調完成，不必按順序，也可以稍後再做。</p>
            </div>
            <button
              className="text-button muted"
              onClick={() =>
                commit((d) => ({ ...d, onboardingDismissed: true }))
              }
            >
              稍後再說
            </button>
          </div>
          <div className="task-grid">
            {tasks.map((t, i) => (
              <Link
                className={`task ${t.done ? "done" : ""} ${!t.available ? "pending" : ""}`}
                to={t.to}
                key={t.title}
              >
                <span className="task-number">
                  {t.done ? <Check size={16} /> : `0${i + 1}`}
                </span>
                <h3>{t.title}</h3>
                <p>{t.desc}</p>
                <span className="task-action">
                  {t.done ? "已完成" : t.available ? "開始整理" : "尚未開放"}
                  {t.available && <ArrowRight size={14} />}
                </span>
              </Link>
            ))}
          </div>
        </section>
      ) : (
        <button
          className="text-button restore-onboarding"
          onClick={() => commit((d) => ({ ...d, onboardingDismissed: false }))}
        >
          <Sparkles size={16} />
          重新顯示新手任務
        </button>
      )}
      <div className="dashboard-columns">
        <section className="panel dates-panel">
          <div className="panel-heading">
            <h2>近期重要事項</h2>
            <span className="muted caption">準備的節奏，由你掌握</span>
          </div>
          <div className="empty-state">
            <span className="empty-icon">
              <CalendarDays size={28} strokeWidth={1.4} />
            </span>
            <h3>未來的計畫，留在這裡</h3>
            <p>
              學校申請管理開放後，這裡將顯示
              <br />
              你所建立的重要日期與待辦。
            </p>
            <Link className="text-button" to="/app/applications">
              了解學校申請管理 <ChevronRight size={15} />
            </Link>
          </div>
        </section>
        <section className="panel progress-panel">
          <div className="panel-heading">
            <h2>我的資料準備</h2>
            <UserRound size={19} className="muted" />
          </div>
          <div className="completion-block">
            <div
              className="progress-ring"
              style={{
                background: `conic-gradient(#6681d8 ${percent}%, #edf0f6 0)`,
              }}
            >
              <span>
                {percent}
                <small>%</small>
              </span>
            </div>
            <div>
              <strong>基本資料完成度</strong>
              <p>已完成 {percent / 20} / 5 項必要資料</p>
              <span className="caption muted">選填經歷不影響完成度</span>
            </div>
          </div>
          <div className="experience-summary">
            <span>
              <Circle size={12} /> 已整理經歷
            </span>
            <strong>
              {experienceCount} <small>筆</small>
            </strong>
          </div>
          <Link className="button secondary full-width" to="/app/profile">
            繼續整理 <ArrowRight size={16} />
          </Link>
        </section>
      </div>
      <section className="quick-section">
        <div className="panel-heading">
          <h2>讓準備，更有效率</h2>
          <span className="muted caption">常用功能入口</span>
        </div>
        <div className="quick-grid">
          {[
            {
              to: "/app/profile",
              title: "個人資料",
              text: "你的經歷，都有位置",
              icon: UserRound,
              live: true,
            },
            {
              to: "/app/documents",
              title: "備審文件",
              text: "將經歷整理成故事",
              icon: FileText,
            },
            {
              to: "/app/interview",
              title: "模擬面試",
              text: "練習自信表達",
              icon: MessageSquare,
            },
          ].map((q) => (
            <Link className="quick-card" key={q.to} to={q.to}>
              <span className="mini-icon blue">
                <q.icon size={20} />
              </span>
              <div>
                <h3>
                  {q.title}
                  {!q.live && <small>尚未開放</small>}
                </h3>
                <p>{q.text}</p>
              </div>
              {q.live ? <Plus size={18} /> : <ArrowUpRight size={18} />}
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
