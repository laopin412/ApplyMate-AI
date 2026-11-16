# ApplyMate AI — Wiki 總索引

> 文件狀態：v0.1 MVP 已實作；更新日期：2026-11-16。完整需求與本次實作範圍須分開閱讀。

## 文件導覽

| 文件 | 內容 | 定位 |
|---|---|---|
| [mvp-implementation.md](mvp-implementation.md) | 本次 MVP 範圍、欄位、技術與資料限制 | 實作說明 |
| [requirements.md](requirements.md) | 產品範圍、模組功能、規格與初步驗收標準 | 需求基準 |
| [ui-design.md](ui-design.md) | 公開首頁、後台架構、配色、RWD、頁面設計 | UI 設計 |
| [user-flows.md](user-flows.md) | 訪客／會員、文件匯入、申請與提醒等主要流程 | 流程設計 |
| [data-model.md](data-model.md) | 概念資料實體、關係、保存與合併規則 | 待技術定稿 |
| [architecture.md](architecture.md) | 前後端、AI、提醒、資料部署的架構原則 | 技術方向 |
| [ai-features.md](ai-features.md) | AI 匯入、文件生成、模擬面試、Groq／Gemini 測試 | AI 功能 |
| [decisions.md](decisions.md) | 使用者已確定的決策、被取代提案 | 決策事實 |
| [open-questions.md](open-questions.md) | 尚未確認的需求、技術和限制 | 待確認 |
| [progress.md](progress.md) | 已規劃／待開發的真實進度 | 開發狀態 |
| [log.md](log.md) | 每次文件、規格與程式維護的追加式紀錄 | 變更歷史 |

## 知識庫使用順序

- **新加入的 AI**：`../AGENTS.md` → 本索引 → `decisions.md` → 與任務相關的規格 → `progress.md`。
- **需求回答**：優先 `decisions.md`；詳細行為到 `requirements.md` 或 `user-flows.md` 查證。
- **開始開發**：先確認 `open-questions.md` 中有無阻擋性問題，再建立可測試的最小功能。
- **執行 Ingest**：整理來源、比對現有 Wiki、修改受影響頁面，追加 `log.md`。
- **執行 Lint**：檢查不一致與缺漏，只在確認後修改已定案規格。

## 類別與邊界

- **已確認**：使用者明確選擇的產品行為，記錄於 `decisions.md`。
- **建議／待定**：合理的工程方向或下一題，記錄於 `open-questions.md` 或規格中的「待決」。
- **已實作**：只有實際交付程式並有證據的項目才列於 `progress.md`；目前已完成本機前端 MVP，詳見 `progress.md`。
