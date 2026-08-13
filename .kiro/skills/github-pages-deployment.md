# GitHub Pages 發布技能

## 確認的發布方式

基於官方 GitHub Pages 文檔（2024），本專案採用「從分支發布」方式。

### 發布設置步驟

1. **進入 Repository Settings**
   - GitHub 網頁 → 專案 → Settings 標籤
   - 左側邊欄：Code and automation → Pages

2. **設置發布源**
   - Build and deployment → Source：選擇 **Deploy from a branch**
   - Branch 下拉選單：選擇 **main**
   - Folder 下拉選單：選擇 **/ (root)** 或 **/docs**（本專案選 /docs）
   - 點擊 **Save**

3. **確認設置**
   - 設置生效後，會顯示：「Your site is live at https://username.github.io/uplot_vibe/」
   - 任何新 push 到 main 分支的 /docs 資料夾內容都會自動部署

## 本專案的具體設置

| 項目 | 設定值 |
|------|--------|
| 分支 | main |
| 資料夾 | /docs |
| 構建工具 | 無（靜態 HTML） |
| 發布 URL | https://username.github.io/uplot_vibe/ |

## 檔案結構

```
repository/
├── .git/
├── .gitignore
├── project-rules.md
├── requirements.md
├── docs/                    ← 發布源
│   ├── index.html          ← 主頁面
│   ├── style.css           ← 樣式
│   ├── script.js           ← 邏輯
│   └── assets/             ← 圖片、字體等
└── .kiro/
    ├── skills/
    └── settings/
```

## 開發工作流

1. **本機開發**
   - 在 `/docs` 資料夾編寫 HTML/CSS/JavaScript
   - 用瀏覽器開啟 `docs/index.html` 測試

2. **提交更改**
   ```bash
   git add docs/
   git commit -m "更新波形顯示功能"
   git push origin main
   ```

3. **自動部署**
   - GitHub 偵測到 push
   - 自動將 /docs 內容發布到 GitHub Pages
   - 約 1-2 分鐘後生效

## 重要注意事項

- ✅ 無需 Jekyll、Vite 或其他構建工具
- ✅ 純靜態 HTML/CSS/JavaScript 自動支援
- ✅ 無需額外的 GitHub Actions 工作流
- ⚠️ 如果移除 /docs 資料夾，發布會失敗（需重新設置）
- ⚠️ 敏感信息（密鑰、Token）不應提交到版本控制

## 驗證發布成功

1. Push 後等待 1-2 分鐘
2. 訪問 https://username.github.io/uplot_vibe/
3. 確認看到 /docs/index.html 的內容

如無法訪問，檢查：
- Settings → Pages 是否正確設置
- /docs 資料夾是否存在且包含 index.html
- 分支是否為 main
