# 專案規則

## 技術棧
- **純 HTML / CSS / JavaScript**（不使用任何框架或構建工具）
- **無 Node.js / Vite 依賴**
- **無外部 API 呼叫**

## 檔案結構
- 所有網站檔案存放在 `docs/` 資料夾
- 直接編寫 HTML、CSS、JavaScript 檔案
- 靜態資源（圖片、字體等）也放在 `docs/` 內

## 開發要求
- 使用**繁體中文**作為界面語言
- **響應式設計**（支援桌面、平板、行動裝置）
- 使用**模擬資料**進行開發和測試
- 不連接任何真實的後端服務或 API

## 部署
- 透過 **GitHub Pages** 發布
- 從 `main` 分支的 `docs/` 目錄發布
- GitHub 設定：Settings → Pages → Source: Deploy from a branch → Branch: main, Folder: /docs

## 開發工具
- 編輯器：VS Code 或任何文字編輯器
- 測試：在瀏覽器中直接開啟 `docs/index.html`
- 版本控制：Git

## 命名慣例
- 檔案名稱：kebab-case（例：`main-chart.js`、`styles-header.css`）
- HTML IDs/Classes：kebab-case
- JavaScript 變數：camelCase
- 常數：UPPER_SNAKE_CASE

## 注意事項
- 確保所有內容自包含（Self-contained）
- 不依賴外部 CDN 或線上資源（除非必要，應下載到本地）
- 跨瀏覽器相容性：支援主流瀏覽器
