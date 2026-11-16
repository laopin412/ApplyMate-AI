import {
  ArrowRight,
  ArrowUpRight,
  Check,
  CheckCheck,
  FileText,
  GraduationCap,
  LayoutDashboard,
  Menu,
  MessageSquare,
  ShieldCheck,
  Sparkles,
  UserRound,
  X,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { Brand } from "../components/Brand";
import { SkipLink } from "../components/SkipLink";
const features = [
  {
    icon: UserRound,
    no: "01",
    title: "讓經歷，有條理",
    text: "從學歷、專題到每一份肯定，分成九類整理。把散落的經歷，慢慢拼成完整的你。",
    tag: "個人資料管理",
    available: true,
  },
  {
    icon: GraduationCap,
    no: "02",
    title: "讓準備，有方向",
    text: "集中管理目標校系與申請進度，掌握重要時程，專注在當下最重要的準備。",
    tag: "學校申請管理",
    available: false,
  },
  {
    icon: FileText,
    no: "03",
    title: "讓故事，被看見",
    text: "以真實經歷為基礎，規劃符合目標校系的備審草稿，讓你的優勢清楚呈現。",
    tag: "AI 備審文件",
    available: false,
  },
  {
    icon: MessageSquare,
    no: "04",
    title: "讓表達，更從容",
    text: "透過動態追問與具體改善建議，練習把自己的想法，說得更清楚。",
    tag: "AI 模擬面試",
    available: false,
  },
];
export function Landing() {
  const [menu, setMenu] = useState(false);
  const scroll = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMenu(false);
  };
  return (
    <div className="landing">
      <SkipLink target="main" />
      <header className="public-header">
        <div className="public-nav">
          <Brand />
          <button
            className="icon-button mobile-only"
            aria-label={menu ? "關閉選單" : "開啟選單"}
            aria-expanded={menu}
            onClick={() => setMenu(!menu)}
          >
            {menu ? <X /> : <Menu />}
          </button>
          <nav
            className={menu ? "public-links open" : "public-links"}
            aria-label="首頁導覽"
          >
            <button onClick={() => scroll("features")}>功能介紹</button>
            <button onClick={() => scroll("workflow")}>使用流程</button>
            <Link className="login-link" to="/app/login">
              登入 <span>即將開放</span>
            </Link>
            <Link className="button primary small" to="/app">
              開始使用 <ArrowUpRight size={16} />
            </Link>
          </nav>
        </div>
      </header>
      <main id="main" tabIndex={-1}>
        <section className="hero">
          <div className="hero-grid">
            <div className="hero-copy">
              <div className="eyebrow">
                <span className="status-dot" /> YOUR NEXT CHAPTER STARTS HERE
              </div>
              <h1>
                讓每一份努力，
                <br />
                <span>都被看見。</span>
              </h1>
              <p className="hero-description">
                升學準備，不必一個人摸索。
                <br />
                從整理經歷到展現自己，ApplyMate AI
                <br className="desktop-break" /> 陪你把每一步，走得更有方向。
              </p>
              <div className="hero-actions">
                <Link className="button primary large" to="/app">
                  開始使用 <ArrowRight size={18} />
                </Link>
                <button
                  className="text-button"
                  onClick={() => scroll("features")}
                >
                  探索平台功能 <ArrowUpRight size={16} />
                </button>
              </div>
              <div className="hero-note">
                <ShieldCheck size={16} />
                <span>不需註冊，現在就能整理個人資料</span>
              </div>
            </div>
            <div className="hero-art" aria-label="平台介面示意，非使用者資料">
              <div className="art-orbit orbit-one" />
              <div className="art-orbit orbit-two" />
              <div className="floating-label float-top">
                <span className="mini-icon lavender">
                  <Sparkles size={17} />
                </span>
                <div>
                  <strong>你的故事，值得好好整理</strong>
                  <small>從第一筆經歷開始</small>
                </div>
              </div>
              <div className="preview-window">
                <div className="preview-top">
                  <div className="window-dots">
                    <i />
                    <i />
                    <i />
                  </div>
                  <span>你的升學準備空間</span>
                  <span className="preview-demo">介面示意</span>
                </div>
                <div className="preview-content">
                  <aside className="preview-sidebar">
                    <span className="brand-mark">
                      <GraduationCap size={18} />
                    </span>
                    <LayoutDashboard size={17} />
                    <span className="preview-active">
                      <UserRound size={17} />
                    </span>
                    <FileText size={17} />
                    <MessageSquare size={17} />
                  </aside>
                  <div className="preview-main">
                    <span className="micro-label">MY PROFILE</span>
                    <h3>一步一步，累積你的可能。</h3>
                    <p>每段經歷，都是認識自己的線索。</p>
                    <div className="preview-progress">
                      <div>
                        <strong>我的準備旅程</strong>
                        <span>持續累積中</span>
                      </div>
                      <div className="decorative-track">
                        <i />
                      </div>
                    </div>
                    <div className="preview-row">
                      <span className="mini-icon blue">
                        <UserRound size={17} />
                      </span>
                      <div>
                        <strong>個人基本資料</strong>
                        <small>建立你的專屬檔案</small>
                      </div>
                      <Check size={16} />
                    </div>
                    <div className="preview-row">
                      <span className="mini-icon lavender">
                        <GraduationCap size={17} />
                      </span>
                      <div>
                        <strong>學歷與專題經歷</strong>
                        <small>把學習足跡串連起來</small>
                      </div>
                      <Check size={16} />
                    </div>
                    <div className="preview-row muted">
                      <span className="mini-icon">
                        <FileText size={17} />
                      </span>
                      <div>
                        <strong>下一段精彩，等你寫下</strong>
                        <small>依照自己的步調前進</small>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="floating-label float-bottom">
                <span className="mini-icon green">
                  <CheckCheck size={19} />
                </span>
                <div>
                  <strong>讓準備，成為日常</strong>
                  <small>整理一次，累積更多可能</small>
                </div>
              </div>
              <span className="art-spark spark-one">✦</span>
              <span className="art-spark spark-two">✦</span>
            </div>
          </div>
          <div className="hero-bottom">
            <span>專為大學・研究所申請者打造</span>
            <span className="hero-divider" />
            <span>
              個人資料 <i>／</i> 申請管理 <i>／</i> 備審文件 <i>／</i> 面試練習
            </span>
          </div>
        </section>
        <section className="features-section section-wrap" id="features">
          <div className="section-heading">
            <div>
              <span className="eyebrow">
                A LITTLE STRUCTURE. A LOT MORE POSSIBILITY.
              </span>
              <h2>
                把繁雜的準備，
                <br className="mobile-only" />
                變成清楚的下一步。
              </h2>
            </div>
            <p>
              一個專屬空間，串起你的升學旅程。
              <br />
              目前開放個人資料管理，其餘功能逐步加入。
            </p>
          </div>
          <div className="feature-grid">
            {features.map((f) => (
              <article className="feature-card" key={f.no}>
                <div className="feature-top">
                  <span className="feature-icon">
                    <f.icon size={25} strokeWidth={1.5} />
                  </span>
                  <span>{f.no}</span>
                </div>
                <div className="feature-tag">
                  {f.tag}
                  <span className={f.available ? "available-tag" : ""}>
                    {f.available ? "已開放" : "規劃中"}
                  </span>
                </div>
                <h3>{f.title}</h3>
                <p>{f.text}</p>
                <Link
                  to={
                    f.available
                      ? "/app/profile/basic"
                      : `/app/${f.no === "02" ? "applications" : f.no === "03" ? "documents" : "interview"}`
                  }
                  className="feature-link"
                >
                  {f.available ? "開始整理" : "了解功能"}
                  <ArrowUpRight size={18} />
                </Link>
              </article>
            ))}
          </div>
        </section>
        <section className="workflow-section" id="workflow">
          <div className="section-wrap">
            <div className="section-heading">
              <div>
                <span className="eyebrow">ONE STEP AT A TIME</span>
                <h2>從認識自己，到走向理想。</h2>
              </div>
              <p>
                不用一次準備好所有事情。
                <br />
                先留下第一筆資料，就是好的開始。
              </p>
            </div>
            <div className="steps">
              {[
                [
                  "01",
                  "整理你的經歷",
                  "建立個人資料，讓每一段學習與實作都有位置。",
                ],
                [
                  "02",
                  "找到申請方向",
                  "規劃目標校系，逐步安排自己的準備節奏。",
                ],
                [
                  "03",
                  "練習展現自己",
                  "以真實經歷完成備審，為下一場面試做好準備。",
                ],
              ].map(([n, t, d]) => (
                <div className="step" key={n}>
                  <span>{n}</span>
                  <h3>
                    {t}
                    {n !== "01" && <small>後續開放</small>}
                  </h3>
                  <p>{d}</p>
                </div>
              ))}
            </div>
            <div className="bottom-cta">
              <div>
                <Sparkles size={26} />
                <h3>下一段旅程，從這裡開始。</h3>
              </div>
              <Link className="button primary" to="/app">
                開始使用 <ArrowRight size={17} />
              </Link>
            </div>
          </div>
        </section>
      </main>
      <footer className="public-footer section-wrap">
        <Brand />
        <p>把你的努力，整理成被看見的機會。</p>
        <small>© {new Date().getFullYear()} ApplyMate AI · 本機體驗版</small>
      </footer>
    </div>
  );
}
