# src — 本機前端 MVP

入口為 `main.tsx`。頁面在 `features/`，平台版型在 `layouts/`，欄位與完成度在 `domain/`，所有瀏覽器寫入均經 `app/Store.tsx` 與 `services/storage/`。

未來替換儲存時請實作對應資料存取服務，不要在表單加入後端憑證或 AI 呼叫。正式資料、草稿、歷程須維持分離，後端也必須獨立處理授權。

本次未實作會員、學校申請、文件匯入、AI、通知與後端。詳見根目錄 README 與 `wiki/mvp-implementation.md`。