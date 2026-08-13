# Karpathy Guidelines - 簡潔開發技能

## 核心原則

### 1. 最簡單優先（Simplicity First）
- 每項工作採最簡單方案
- 不增加超出需求的功能
- 不建立不必要的抽象層或模式
- 代碼直白、易讀、無過度工程化

### 2. 可驗證標準（Verifiable Standards）
- 每項工作必須有明確的驗收條件
- 完成後必須能驗證：功能是否正確運作
- 避免模糊的「差不多了」判斷
- 清單式驗證：完成前逐項檢查

### 3. 直接實現（Direct Implementation）
- 不設計複雜的架構圖
- 直接寫可用的代碼
- 邊做邊調整，不過度規劃
- 重構只在必要時進行

### 4. 清晰的代碼風格
- 使用有意義的變數名
- 註解說明「為什麼」，不是「是什麼」
- 函數職責單一且明確
- 避免深層嵌套和複雜邏輯

### 5. 最小化依賴
- 不引入不必要的庫或框架
- 使用原生 API 優先
- 只在確實需要時才考慮外部工具

## 開發工作流

1. **理解需求** → 精確閱讀 requirements.md
2. **最小實現** → 寫出最簡單的工作代碼
3. **驗證** → 檢查所有驗收條件是否滿足
4. **完成** → 確認無誤後移至下一項

## 示例應用

### ❌ 不要做
```javascript
// 過度設計
class WaveformManager {
  constructor(config) {
    this.state = new WaveformState();
    this.renderer = new WaveformRenderer();
    this.controller = new WaveformController();
  }
}
```

### ✅ 要做
```javascript
// 直接實現
let frequency = 2;
let amplitude = 50;
let waveType = 'sine';

function generateWaveData(time) {
  // 簡單的波形生成邏輯
}
```

## 驗收清單模板

```
工作: [描述]

驗收條件:
- [ ] 條件 1
- [ ] 條件 2
- [ ] 條件 3

實現檢查:
- [ ] 代碼簡潔易懂
- [ ] 無不必要的抽象
- [ ] 所有條件都滿足
```

## 與本專案的結合

- 遵循 project-rules.md：純 HTML/CSS/JavaScript
- 參考 requirements.md：明確的使用者故事和驗收條件
- 參考 steering 文件：團隊規範和慣例
- 每完成一個需求故事，立即驗證所有條件
