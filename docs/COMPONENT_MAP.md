# 组件地图 (Component Map)

## 目录结构

```
3/
├── index.html                    (259行 - 纯HTML结构)
├── 33.html                       (原始文件 - 勿删)
│
├── styles/
│   ├── global.css                (10行 - reset, 变量, 布局)
│   ├── player-list.css           (18行 - 玩家卡片, 头像, 金币)
│   ├── auction-area.css          (41行 - 竞拍区, 出价面板, 日志)
│   ├── numpad.css                (20行 - 数字键盘浮层)
│   ├── warehouse-grid.css        (5行  - 藏品矩阵网格)
│   ├── item-bar.css              (8行  - 物品栏格子)
│   ├── settlement-modal.css      (31行 - 结算弹窗, 圆环动画)
│   ├── map-overlay.css           (55行 - 仓库地图抽取)
│   ├── character-select.css      (63行 - 角色选择卡片)
│   ├── shop.css                  (29行 - 商城面板)
│   └── confirm-dialog.css        (11行 - 确认弹窗)
│
├── scripts/
│   ├── gameState.js              (108行 - 全局状态, 常量, 配置数据)
│   ├── audioSystem.js            (104行 - 音效系统)
│   ├── uiHelpers.js              (24行  - 日志, UI更新)
│   ├── numpad.js                 (89行  - 数字键盘逻辑)
│   ├── skillSystem.js            (46行  - 角色技能)
│   ├── itemSystem.js             (95行  - 物品/背包系统)
│   ├── confirmDialog.js          (25行  - 确认弹窗)
│   ├── shopSystem.js             (78行  - 商城系统)
│   ├── bidSystem.js              (132行 - 出价/AI竞价)
│   ├── settlementSystem.js       (146行 - 拍卖结算/弹窗)
│   ├── mapSystem.js              (105行 - 地图抽取/轮盘)
│   ├── characterSystem.js        (126行 - 角色选择)
│   └── gameInit.js               (106行 - 初始化/重启/键盘)
│
├── image/                        (资源文件)
└── docs/
    ├── README_AI.md
    └── COMPONENT_MAP.md
```

## 模块依赖关系

```
gameState.js          ← 无依赖 (最底层)
audioSystem.js        ← 无依赖
uiHelpers.js          ← gameState
numpad.js             ← gameState
skillSystem.js        ← gameState, characterSystem(characterData)
itemSystem.js         ← gameState, audioSystem, uiHelpers
confirmDialog.js      ← itemSystem, gameState
shopSystem.js         ← gameState, itemSystem, audioSystem, uiHelpers
bidSystem.js          ← gameState, uiHelpers, audioSystem, itemSystem, skillSystem, characterSystem
settlementSystem.js   ← gameState, uiHelpers, audioSystem, itemSystem, bidSystem(resetBidUI)
mapSystem.js          ← gameState, uiHelpers
characterSystem.js    ← gameState
gameInit.js           ← 所有模块
```

## 修改场景速查

### AI 修改 FAQ / 角色描述
- 只需读取: `scripts/gameState.js` (characterData数组)
- 涉及CSS: `styles/character-select.css`

### AI 修改竞拍逻辑
- 只需读取: `scripts/bidSystem.js`, `scripts/settlementSystem.js`
- 涉及CSS: `styles/auction-area.css`, `styles/settlement-modal.css`

### AI 修改商城
- 只需读取: `scripts/shopSystem.js`, `scripts/gameState.js` (SHOP_ITEMS)
- 涉及CSS: `styles/shop.css`

### AI 修改数字键盘
- 只需读取: `scripts/numpad.js`
- 涉及CSS: `styles/numpad.css`

### AI 修改物品系统
- 只需读取: `scripts/itemSystem.js`, `scripts/confirmDialog.js`, `scripts/gameState.js` (ITEM_TYPES)
- 涉及CSS: `styles/item-bar.css`, `styles/confirm-dialog.css`

### AI 修改地图抽取
- 只需读取: `scripts/mapSystem.js`, `scripts/gameState.js` (treasureMaps)
- 涉及CSS: `styles/map-overlay.css`

### AI 修改音效
- 只需读取: `scripts/audioSystem.js`
- 无CSS依赖

### AI 修改角色技能
- 只需读取: `scripts/skillSystem.js`, `scripts/gameState.js` (characterData)
- 无独立CSS

### AI 修改UI/日志
- 只需读取: `scripts/uiHelpers.js`
- 涉及CSS: `styles/auction-area.css` (日志样式)

### AI 修改初始化/重启
- 只需读取: `scripts/gameInit.js`
- 涉及CSS: `styles/warehouse-grid.css`

## HTML ID 索引

| ID | 文件 | 用途 |
|---|---|---|
| `bidDisplay` | numpad.js, bidSystem.js | 出价显示/数字键盘入口 |
| `numpadOverlay` | numpad.js | 数字键盘浮层 |
| `bid-logs` | uiHelpers.js, bidSystem.js | 竞拍日志容器 |
| `topPrice` | bidSystem.js | 当前最高价 |
| `topBidder` | bidSystem.js | 当前最高出价者 |
| `previewGrid` | skillSystem.js, gameInit.js | 藏品矩阵网格 |
| `settleModal` | settlementSystem.js | 结算弹窗 |
| `settleGrid` | settlementSystem.js | 结算物品网格 |
| `mapOverlay` | mapSystem.js | 地图浮层 |
| `mapTrack` | mapSystem.js | 地图轮盘轨道 |
| `charOverlay` | characterSystem.js | 角色选择浮层 |
| `charTrack` | characterSystem.js | 角色卡片轨道 |
| `shopOverlay` | shopSystem.js | 商城浮层 |
| `confirmOverlay` | confirmDialog.js | 确认弹窗 |
| `shopHafCoins` | shopSystem.js, uiHelpers.js | 商城哈夫币显示 |
| `myHafCoins` | uiHelpers.js | 玩家哈夫币显示 |
