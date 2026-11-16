# ApplyMate AI — AI 智慧升學推甄輔助平台

> 2026-11-16 · v0.1 本機前端 MVP。首頁、訪客儀表板、個人資料管理已實作；會員、AI、後端及公開部署尚未實作。

## 啟動與預覽

本次驗證環境：Windows、Node.js 22.16.0、npm 10.9.2。首次使用需安裝 Node.js 與下載 npm 依賴。

在專案資料夾雙擊 `start-local.cmd`，或在 PowerShell 執行：

```powershell
Set-Location -LiteralPath 'C:\Users\User\OneDrive\文件\ChatGPT\ApplyMate-AI'
npm.cmd install
npm.cmd run dev
```

開啟 **http://127.0.0.1:5173/**。保留執行中的終端機；按 `Ctrl+C` 停止。若連接埠已被占用，請使用已運行的網站，或停止原本的程序後再啟動；專案不會自動換埠。

- 首頁：`http://127.0.0.1:5173/`
- 儀表板：`http://127.0.0.1:5173/#/app`
- 個人資料：`http://127.0.0.1:5173/#/app/profile/basic`

請固定使用相同網址及瀏覽器。`localhost` 與 `127.0.0.1`、不同連接埠、不同瀏覽器各有獨立的本機暫存。不要直接雙擊 `index.html`。

## 本次可操作內容

- 公開首頁五區、功能介紹及使用流程；開始使用直接進訪客儀表板。
- 六項平台選單、手機收合選單、可跳過／恢復的新手任務。
- 基本資料單份；其他八類經歷可新增多筆、編輯與確認刪除。
- 輸入自動保存分類草稿，重新整理後恢復；按「儲存資料」才更新正式資料。
- 五項基本欄位各占完成度 20%，不完整也能保存，其他經歷不扣分。
- 正式修改歷程合計保留最近 20 次，可確認後還原該分類操作前資料。
- 容量不足、儲存停用、格式異常與偵測到分頁衝突時提供錯誤，不自動清除原資料。

學校申請、備審文件、AI 面試、會員登入、匯入、設定、通知均顯示尚未開放。儀表板統計使用空狀態，不填假申請資料。Groq 與 Gemini 仍為候選。

## 資料限制

資料留在瀏覽器 LocalStorage，鍵名 `applymate.guest.v1`，不會上傳至後端或 AI。這不是備份或加密保管庫；清除瀏覽資料或更換裝置會無法取得。每類保留一份編輯草稿，切換同類其他紀錄時先確認是否捨棄草稿。

多分頁寫入前會比對本機版本，偵測到衝突就阻止覆蓋並提示重新載入；不提供跨分頁即時同步，也不是完整的跨程序交易鎖。大量資料、高頻並行編輯與長期保存應留待後端階段處理。

## 程式架構

| 路徑 | 職責 |
|---|---|
| `src/main.tsx` | HashRouter 路由與入口，重整子頁不需伺服器路由設定 |
| `src/app/Store.tsx` | 前端狀態、儲存錯誤與資料存取入口 |
| `src/layouts/AppLayout.tsx` | 平台版型、導航、未開放頁 |
| `src/features/` | 首頁、儀表板、個人資料表單 |
| `src/components/` | 品牌、跳至主要內容、共用確認視窗 |
| `src/domain/profile.ts` | 九類欄位、型別、完成度、驗證 |
| `src/services/storage/` | 可替換儲存介面、資料生命週期與測試 |
| `src/styles/global.css` | 共用視覺、桌機／平板／手機規則 |
| `wiki/` | 需求、決策、實作、驗收與待辦 |

前端使用 React、TypeScript、Vite、React Router、Lucide。樣式集中於原生 CSS，未引入 UI 框架。後端、會員、AI Provider 與通知服務尚未建立，不預選供應商。

## 驗證指令

```powershell
npm.cmd test
npm.cmd run build
npm.cmd run preview
```

`build` 包含 TypeScript 檢查，輸出至 `dist/`。`preview` 使用 `http://127.0.0.1:4173/`，僅供建置驗證；因連接埠不同，不會自動讀取 5173 的資料。詳細實測見 [wiki/progress.md](wiki/progress.md)。

## 開發依據

查閱 [Wiki 索引](wiki/index.md)、[決策紀錄](wiki/decisions.md)、[本次 MVP 說明](wiki/mvp-implementation.md) 與 [待確認事項](wiki/open-questions.md)。完整產品需求不等於本次均已實作。

## GitHub Pages 部署（課堂作業）

本專案 v0.1 為**純前端展示版**，可以部署至 GitHub Pages。會員、AI API、後端資料庫與 Email 通知尚未實作；網站展示的個人資料會儲存在訪客**自己的瀏覽器**，而不是 GitHub 資料庫。

1. 在 GitHub 建立 **Public** Repository，建議名稱 `ApplyMate-AI`，預設分支 `main`。
2. 把**本專案資料夾內的所有來源檔案和子資料夾**提交至 Repository 根目錄（包含隱藏的 `.github/workflows/deploy.yml`、`.gitignore`、`AGENTS.md`、`wiki/` 等）。不要只上傳 ZIP 檔。
3. 進入 GitHub Repository → **Settings → Pages**，在 **Build and deployment → Source** 選 **GitHub Actions**。
4. 進入 **Actions**，查看 `Deploy ApplyMate AI to GitHub Pages` 是否通過（包含 `npm test` 與 `npm run build`）。如未執行可手動觸發 `Run workflow`。
5. 綠色成功後，在 Pages 設定頁取得正式網址；若儲存庫名稱是 `ApplyMate-AI`，預期為 `https://<GitHub帳號>.github.io/ApplyMate-AI/`。
6. 使用無痕視窗測試「開始使用」→ 儀表板 → 個人資料編輯／暫存／正式儲存。**不要用真實敏感個資做公開展示測試。**

### GitHub Pages 子路徑設定

- `.github/workflows/deploy.yml` 使用 `github.event.repository.name` 組出 `VITE_BASE_PATH`，不必預先填寫 GitHub 帳號。`vite.config.ts` 在 GitHub 建置時使用此路徑；一般本機開發仍維持 `/`。
- 上述工作流程適用一般專案型網址 `/<repo>/`。若使用 `<帳號>.github.io` 作為特殊儲存庫名稱（根網址網站）或自訂網域，須調整 `VITE_BASE_PATH` 為 `/`。
- `HashRouter` 讓子頁面使用 `#/app` 與 `#/app/profile/basic`，避免 GitHub Pages 缺少伺服器路由造成 404。
- 若 GitHub 上傳未保留 `.github/workflows/` 子資料夾，Pages 就不會自動執行此部署流程。
