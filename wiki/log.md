# ApplyMate AI — 知識庫更新日誌

> **追加式紀錄**。新項目寫在末尾，保留舊紀錄便於追溯；不要抹去歷史。

## 2026-11-16 — Wiki 初版建立

- **類型**：Ingest / 專案初始化。
- **來源**：本專案此前使用者已確認的逐題需求對話（截至「問題 36：通用＋校系客製化，先客製化」與同意建立 Wiki）。
- **內容**：建立 `AGENTS.md`、`README.md`、Wiki 索引、需求規格、UI 設計、使用流程、概念資料模型、技術架構、AI 功能、決策、待定事項與開發進度。
- **重要原則**：區分已確認決策與待定技術；修正舊提案與後來決策之間的矛盾；清楚記錄尚未開發任何網站功能。
- **待確認**：詳見 `open-questions.md`。
- **測試情形**：目前僅文件建立與連結／內容檢查，不包含網站功能測試。

## 2026-11-16 — v0.1 本機前端 MVP

- **類型**：Implementation / 文件同步。
- **來源**：第一階段開發任務與開發計畫；使用者確認先建立初步網頁。
- **完成**：React／TypeScript／Vite 專案、五區首頁、訪客平台、九類資料 CRUD、草稿／正式保存、完成度、20 次修改歷程、響應式與未開放狀態。
- **資料保護**：本機儲存錯誤提示、損壞資料保留、偵測舊分頁覆寫、刪除與復原確認；不傳送個資至外部服務。
- **新增**：src 實作、設定與依賴鎖定檔、start-local.cmd、wiki/mvp-implementation.md。
- **更新**：README、src/README、AGENTS 階段現況、Wiki 索引、需求／流程／架構／資料模型、decisions、open-questions、progress。
- **測試**：10 項測試與 TypeScript／Vite build 通過；HTTP 200；瀏覽器新增、修改、刪除、復原、草稿重整、正式保存、完成度及手機選單／分類實測。細節與未測項見 progress.md。
- **邊界**：沒有實作會員、後端、AI、Email、申請管理或公開部署。供應商仍未選定。

## 2026-11-16 — 課堂 GitHub Pages 繳交準備

- 依據已確認的 v0.1 前端專案新增 `.github/workflows/deploy.yml`，將 `npm ci`、`npm test`、`npm run build` 與 GitHub Pages 發布串接。
- 調整 `vite.config.ts` 讓正式建置依 `VITE_BASE_PATH` 指定公開子路徑，本機開發保持 `/`。
- 補充 `AGENTS.md`「新增頁面的標準流程與命名規範」，讓其他 AI 能按相同規則延續網站開發。
- 在 `README.md` 新增上傳 GitHub 與 Pages 設定步驟；未更動任何既定產品功能與業務規則。
- **狀態：已準備部署設定，尚未實際上傳 GitHub 或取得公開網址；不得宣稱已發布。**
