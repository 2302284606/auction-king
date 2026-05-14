# AI 上下文优化指南

## 设计目标

本项目专为降低 AI Agent 的 token 消耗而重构。核心原则：**修改一个功能时，AI 只需读取相关文件，而非整个项目。**

## Token 消耗对比

| 指标 | 重构前 (33.html) | 重构后 |
|------|------------------|--------|
| 总文件数 | 1 | 25 |
| 最大文件 | 1659行 | 146行 (settlementSystem.js) |
| AI修改商城需读取 | 1659行 | ~120行 (shopSystem.js + gameState.js部分) |
| AI修改角色需读取 | 1659行 | ~180行 (characterSystem.js + gameState.js部分) |
| AI修改竞拍需读取 | 1659行 | ~280行 (bidSystem.js + settlementSystem.js) |
| 预估 token 节省 | - | 70-85% |

## AI 修改操作指南

### 场景 1: 修改角色技能
```
需要读取:
1. scripts/gameState.js → characterData 数组
2. scripts/skillSystem.js → 技能逻辑

不需要读取:
- 商城、结算、地图、竞拍等全部文件
```

### 场景 2: 修改商城商品
```
需要读取:
1. scripts/gameState.js → SHOP_ITEMS 数组
2. scripts/shopSystem.js → 商城逻辑
3. styles/shop.css → 商城样式

不需要读取:
- 竞拍、结算、地图、角色等全部文件
```

### 场景 3: 修改竞拍规则
```
需要读取:
1. scripts/gameState.js → ROUND_RULES 数组
2. scripts/bidSystem.js → 竞拍逻辑
3. scripts/settlementSystem.js → 结算逻辑

不需要读取:
- 商城、地图、角色、音效等全部文件
```

### 场景 4: 修改音效
```
需要读取:
1. scripts/audioSystem.js → 仅此一个文件

不需要读取:
- 任何其他文件
```

### 场景 5: 修改地图抽取
```
需要读取:
1. scripts/gameState.js → treasureMaps 数组
2. scripts/mapSystem.js → 轮盘逻辑
3. styles/map-overlay.css → 地图样式

不需要读取:
- 商城、竞拍、角色等全部文件
```

### 场景 6: 修改物品系统
```
需要读取:
1. scripts/gameState.js → ITEM_TYPES 数组
2. scripts/itemSystem.js → 物品逻辑
3. scripts/confirmDialog.js → 使用确认
4. styles/item-bar.css → 物品栏样式
5. styles/confirm-dialog.css → 弹窗样式

不需要读取:
- 竞拍、结算、地图、角色等全部文件
```

## 文件命名规范

### 禁止的命名
- `helper.js`, `utils.js`, `common.js`
- `final.js`, `temp.js`, `copy.js`
- `script1.js`, `script2.js`

### 推荐的命名
- `bidSystem.js` — 竞拍系统
- `shopSystem.js` — 商城系统
- `settlementSystem.js` — 结算系统
- `mapSystem.js` — 地图系统
- `characterSystem.js` — 角色系统
- `audioSystem.js` — 音效系统
- `gameState.js` — 全局状态
- `gameInit.js` — 初始化

## CSS 命名规范 (BEM)

```css
.hero {}           /* 块 */
.hero__title {}    /* 元素 */
.hero--active {}   /* 修饰符 */
```

当前已使用的 BEM 前缀:
- `.shop-` — 商城
- `.char-` — 角色
- `.map-` — 地图
- `.settle-` — 结算
- `.confirm-` — 确认弹窗
- `.numpad-` — 数字键盘
- `.bid-` — 竞拍
- `.player-` — 玩家
- `.item-` — 物品

## JS 全局变量

| 变量名 | 类型 | 说明 |
|--------|------|------|
| `gameState` | Object | 核心游戏状态 |
| `playerItems` | Object | 玩家物品数据 |
| `roundItemUsed` | Object | 本轮物品使用记录 |
| `audioCtx` | Object | 音频上下文 |
| `numpadValue` | String | 数字键盘输入值 |
| `pendingUseItem` | Object | 待确认使用的物品 |
| `mapAnimating` | Boolean | 地图动画锁 |
| `selectedCharIndex` | Number | 选中角色索引 |
| `charTrackOffset` | Number | 角色轨道偏移 |
| `charAnimating` | Boolean | 角色动画锁 |

## 新增模块指南

如需新增功能模块:

1. 在 `scripts/` 创建新 JS 文件
2. 在 `styles/` 创建新 CSS 文件
3. 在 `index.html` 添加 `<link>` 和 `<script>` 标签
4. JS 放在 `gameInit.js` 之前加载
5. 在 `gameInit.js` 的 `window.onload` 中初始化事件监听
6. 在 `docs/COMPONENT_MAP.md` 中添加模块说明

## 注意事项

- 所有 JS 文件使用全局函数，不使用 ES modules
- HTML 中禁止使用 `onclick` 属性，全部通过 `addEventListener` 绑定
- CSS 中禁止使用 inline style，全部通过 class 控制
- 文件行数限制: HTML < 300行, CSS < 400行, JS < 500行
