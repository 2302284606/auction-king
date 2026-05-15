# 古藏 · 五轮竞拍之王 — AI 项目地图

> **版本**: v2.0  
> **最后更新**: 2026-05-15  
> **用途**: 单一入口文档，AI 修改任何功能前只读此文件即可定位目标文件，最大限度减少 token 消耗

---

## 一、文件索引（精确到函数/类）

### 1.1 JavaScript 文件（按加载顺序）

| 文件 | 行数 | 职责 | 包含的函数/变量 |
|------|------|------|----------------|
| [gameState.js](file:///e:/竞拍之王/auction-king-main/auction-king-main/scripts/gameState.js) | 121 | 全局状态、配置数据、工具函数 | `gameState`, `ROUND_RULES`, `AI_NAMES`, `ITEM_TYPES`, `playerItems`, `roundItemUsed`, `SHOP_ITEMS`, `collectionItems`, `rarityTypes`, `characterData`, `treasureMaps`, `pickItem()`, `getPlayerName()` |
| [audioSystem.js](file:///e:/竞拍之王/auction-king-main/auction-king-main/scripts/audioSystem.js) | 113 | 音效系统（Web Audio API） | `audioCtx`, `getAudioCtx()`, `scheduleTone()`, `scheduleNoise()`, `playGavel()`, `playCoins()`, `playFanfare()`, `playFail()`, `playReveal()`, `playDealSound()` |
| [uiHelpers.js](file:///e:/竞拍之王/auction-king-main/auction-king-main/scripts/uiHelpers.js) | 27 | UI 更新、日志辅助 | `addLog()`, `addSkillLog()`, `updateUI()`, `updateHafCoinsUI()` |
| [numpad.js](file:///e:/竞拍之王/auction-king-main/auction-king-main/scripts/numpad.js) | 107 | 数字键盘、快捷出价 | `numpadValue`, `openNumpad()`, `closeNumpad()`, `numpadInput()`, `numpadClear()`, `numpadQuick()`, `numpadConfirm()`, `quickBid()`, `updateNumpadDisplay()`, `initNumpadListeners()` |
| [skillSystem.js](file:///e:/竞拍之王/auction-king-main/auction-king-main/scripts/skillSystem.js) | 51 | 角色技能（扫描/精算） | `activateShadowScan()`, `activateActuary()` |
| [itemSystem.js](file:///e:/竞拍之王/auction-king-main/auction-king-main/scripts/itemSystem.js) | 102 | 物品/背包系统 | `assignItems()`, `renderAllPlayerItems()`, `renderPlayerItems()`, `useItem()`, `revealCellsRarity()`, `inspectItems()`, `aiUseItem()`, `clearScanReveals()` |
| [confirmDialog.js](file:///e:/竞拍之王/auction-king-main/auction-king-main/scripts/confirmDialog.js) | 28 | 确认弹窗 | `pendingUseItem`, `showUseConfirm()`, `closeConfirm()`, `initConfirmListeners()` |
| [shopSystem.js](file:///e:/竞拍之王/auction-king-main/auction-king-main/scripts/shopSystem.js) | 85 | 商城系统 | `openShop()`, `closeShop()`, `renderShopItems()`, `renderShopInventory()`, `buyShopItem()`, `initShopListeners()` |
| [bidSystem.js](file:///e:/竞拍之王/auction-king-main/auction-king-main/scripts/bidSystem.js) | 231 | 出价/AI竞价/倍数/跳过 | `generateAIBids()`, `getEffectiveBid()`, `updateMultiplierResult()`, `confirmBid()`, `skipRound()`, `resetBidUI()`, `initBidListeners()`, `initMultiplierListeners()` |
| [settlementSystem.js](file:///e:/竞拍之王/auction-king-main/auction-king-main/scripts/settlementSystem.js) | 176 | 拍卖结算/弹窗/动画 | `resolveAuction()`, `showSettlement()` |
| [mapSystem.js](file:///e:/竞拍之王/auction-king-main/auction-king-main/scripts/mapSystem.js) | 146 | 地图抽取/轮盘 | `mapAnimating`, `openMapSelection()`, `closeMapSelection()`, `skipMapSelection()`, `buildMapTrack()`, `startMapRoulette()`, `initMapListeners()` |
| [characterSystem.js](file:///e:/竞拍之王/auction-king-main/auction-king-main/scripts/characterSystem.js) | 149 | 角色选择/轮盘/拖拽 | `selectedCharIndex`, `charDragging`, `charStartX`, `charScrollLeft`, `charTrackOffset`, `charAnimating`, `buildCharTrack()`, `selectCharCard()`, `initCharDrag()`, `openCharSelection()`, `closeCharSelection()`, `confirmCharSelection()`, `initCharacterListeners()` |
| [startScreen.js](file:///e:/竞拍之王/auction-king-main/auction-king-main/scripts/startScreen.js) | 101 | 开始界面/角色预览 | `startCharIndex`, `initStartScreen()`, `createStartParticles()`, `updateStartCharacter()`, `renderStartCharGrid()`, `openStartCharSelect()`, `closeStartCharSelect()`, `enterGame()` |
| [lobbySystem.js](file:///e:/竞拍之王/auction-king-main/auction-king-main/scripts/lobbySystem.js) | 102 | 大厅界面/角色展示 | `LOBBY_SKILLS`, `LOBBY_TITLES`, `lobbyCharIndex`, `openLobby()`, `closeLobby()`, `renderLobby()`, `renderLobbyThumbs()`, `renderLobbyPocket()`, `lobbyStartGame()` |
| [gameInit.js](file:///e:/竞拍之王/auction-king-main/auction-king-main/scripts/gameInit.js) | 133 | 初始化/重启/键盘监听/入口 | `init()`, `initRound()`, `restartGame()`, `initKeyboardListeners()`, `window.onload` |

### 1.2 CSS 文件（按加载顺序）

| 文件 | 行数 | 职责 | 关键类名前缀 |
|------|------|------|-------------|
| [global.css](file:///e:/竞拍之王/auction-king-main/auction-king-main/styles/global.css) | 11 | 重置、变量、三栏布局、玻璃面板 | `.game-wrapper`, `.glass-panel`, `.panel-header` |
| [player-list.css](file:///e:/竞拍之王/auction-king-main/auction-king-main/styles/player-list.css) | 18 | 玩家卡片、头像、金币、商城/地图入口 | `.player-card`, `.avatar-frame`, `.shop-entry`, `.map-entry` |
| [auction-area.css](file:///e:/竞拍之王/auction-king-main/auction-king-main/styles/auction-area.css) | 52 | 竞拍区、出价面板、日志、倍数 | `.main-arena`, `.auction-top`, `.bid-panel`, `#bid-logs`, `.log-*`, `.multiplier-*`, `.btn-confirm`, `.btn-pass` |
| [numpad.css](file:///e:/竞拍之王/auction-king-main/auction-king-main/styles/numpad.css) | 20 | 数字键盘浮层 | `.numpad-overlay`, `.numpad`, `.numpad-key`, `.numpad-quick` |
| [warehouse-grid.css](file:///e:/竞拍之王/auction-king-main/auction-king-main/styles/warehouse-grid.css) | 5 | 藏品矩阵网格 | `.wh-grid-6`, `.wh-cell`, `.scan-active`, `.actuary-active` |
| [item-bar.css](file:///e:/竞拍之王/auction-king-main/auction-king-main/styles/item-bar.css) | 8 | 物品栏格子 | `.item-bar`, `.item-slot`, `.slot-key`, `.slot-icon` |
| [settlement-modal.css](file:///e:/竞拍之王/auction-king-main/auction-king-main/styles/settlement-modal.css) | 31 | 结算弹窗、圆环动画、藏品网格 | `.modal`, `.settle-row`, `.settle-cell`, `.circle-loader`, `.rarity-gold`, `.rarity-red`, `.profit-number` |
| [map-overlay.css](file:///e:/竞拍之王/auction-king-main/auction-king-main/styles/map-overlay.css) | 55 | 仓库地图抽取、轮盘、卡片 | `.map-overlay`, `.map-track`, `.map-card`, `.map-shipwreck`, `.map-villa`, `.map-desert`, `.map-tomb` |
| [character-select.css](file:///e:/竞拍之王/auction-king-main/auction-king-main/styles/character-select.css) | 63 | 角色选择卡片、轮盘、拖拽 | `.char-overlay`, `.char-track`, `.char-card`, `.char-shipwreck`, `.char-villa`, `.char-desert`, `.char-tomb`, `.char-auction` |
| [shop.css](file:///e:/竞拍之王/auction-king-main/auction-king-main/styles/shop.css) | 29 | 商城面板、商品列表、背包 | `.shop-overlay`, `.shop-panel`, `.shop-item`, `.shop-buy-btn`, `.shop-inv-slot` |
| [confirm-dialog.css](file:///e:/竞拍之王/auction-king-main/auction-king-main/styles/confirm-dialog.css) | 11 | 确认弹窗 | `.confirm-overlay`, `.confirm-box`, `.confirm-yes`, `.confirm-no` |
| [start-screen.css](file:///e:/竞拍之王/auction-king-main/auction-king-main/styles/start-screen.css) | 57 | 开始界面、粒子、角色预览 | `.start-screen`, `.start-particle`, `.start-char-option`, `.char-select-overlay` |
| [lobby.css](file:///e:/竞拍之王/auction-king-main/auction-king-main/styles/lobby.css) | 50 | 大厅界面、角色展示、技能面板 | `.lobby-screen`, `.lobby-char-showcase`, `.lobby-thumb`, `.lobby-pocket-slot` |

### 1.3 HTML 文件

| 文件 | 行数 | 职责 |
|------|------|------|
| [index.html](file:///e:/竞拍之王/auction-king-main/auction-king-main/index.html) | 419 | 主页面：DOM 结构、script/link 加载顺序 |

---

## 二、功能 → 文件映射表（修改某功能只需读这些文件）

### 2.1 按功能分类

| 功能 | 必须读取的文件 | 可选读取 | 无需读取 |
|------|--------------|----------|----------|
| **修改角色数据/描述** | `gameState.js` (L55-96 `characterData`) | `character-select.css` | 其他全部 |
| **修改角色技能效果** | `skillSystem.js`, `gameState.js` (L55-96) | `character-select.css` | 商城、结算、地图等 |
| **修改角色选择界面** | `characterSystem.js`, `character-select.css` | — | 竞拍、结算等 |
| **修改开始界面** | `startScreen.js`, `start-screen.css` | `gameState.js` (角色数据) | 竞拍、结算等 |
| **修改大厅界面** | `lobbySystem.js`, `lobby.css` | `gameState.js` (角色/资金) | 竞拍、结算等 |
| **修改竞拍规则** | `gameState.js` (L17-23 `ROUND_RULES`), `bidSystem.js`, `settlementSystem.js` | `auction-area.css` | 商城、地图、角色等 |
| **修改 AI 出价策略** | `bidSystem.js` (L1-26 `generateAIBids`) | — | 其他全部 |
| **修改出价 UI/倍数** | `bidSystem.js` (L28-231), `auction-area.css` | `numpad.js` | 结算、商城等 |
| **修改数字键盘** | `numpad.js`, `numpad.css` | — | 其他全部 |
| **修改结算/成交** | `settlementSystem.js`, `bidSystem.js` (L90-148 `skipRound`) | `settlement-modal.css` | 商城、地图等 |
| **修改结算动画** | `settlementSystem.js` (L87-176 `showSettlement`), `settlement-modal.css` | — | 其他全部 |
| **修改物品/道具** | `gameState.js` (L27-31 `ITEM_TYPES`, L36-40 `SHOP_ITEMS`), `itemSystem.js`, `confirmDialog.js` | `item-bar.css`, `confirm-dialog.css` | 竞拍、结算等 |
| **修改道具使用效果** | `itemSystem.js` (L36-83 `useItem`/`revealCellsRarity`/`inspectItems`) | — | 其他全部 |
| **修改商城商品** | `gameState.js` (L36-40 `SHOP_ITEMS`), `shopSystem.js`, `shop.css` | — | 竞拍、结算、地图等 |
| **修改地图抽取** | `gameState.js` (L98-103 `treasureMaps`), `mapSystem.js`, `map-overlay.css` | — | 竞拍、结算、商城等 |
| **修改音效** | `audioSystem.js` | — | 其他全部 |
| **修改 UI/日志** | `uiHelpers.js`, `auction-area.css` (日志样式) | — | 其他全部 |
| **修改初始化/重启** | `gameInit.js`, `gameState.js` | `warehouse-grid.css` | — |
| **修改全局样式** | `global.css` | — | — |
| **修改响应式布局** | `global.css` (L8-11), 各组件 CSS 的 `@media` | — | — |

### 2.2 按文件反查（修改某文件会影响哪些功能）

| 文件 | 影响范围 | 关联文件（会调用/依赖它） |
|------|----------|------------------------|
| `gameState.js` | **全局** — 所有功能 | 所有 JS 文件 |
| `audioSystem.js` | 音效播放 | `bidSystem.js`, `settlementSystem.js`, `itemSystem.js`, `shopSystem.js`, `startScreen.js`, `lobbySystem.js`, `gameInit.js` |
| `uiHelpers.js` | UI 更新、日志 | `bidSystem.js`, `settlementSystem.js`, `shopSystem.js`, `gameInit.js`, `skillSystem.js`, `itemSystem.js` |
| `numpad.js` | 出价输入 | `bidSystem.js` |
| `skillSystem.js` | 角色技能视觉效果 | `gameInit.js` |
| `itemSystem.js` | 物品使用、渲染 | `confirmDialog.js`, `shopSystem.js`, `gameInit.js`, `bidSystem.js` |
| `confirmDialog.js` | 确认弹窗 | `itemSystem.js` |
| `shopSystem.js` | 商城 | `itemSystem.js`, `uiHelpers.js`, `audioSystem.js` |
| `bidSystem.js` | 竞拍核心 | `settlementSystem.js`, `gameInit.js` |
| `settlementSystem.js` | 结算 | `bidSystem.js` |
| `mapSystem.js` | 地图 | `gameInit.js`, `startScreen.js` |
| `characterSystem.js` | 角色选择 | `gameInit.js` |
| `startScreen.js` | 开始界面 | `gameInit.js` |
| `lobbySystem.js` | 大厅 | `gameInit.js`, `mapSystem.js` |
| `gameInit.js` | 入口/初始化 | 所有模块 |

---

## 三、跨文件依赖图

### 3.1 JS 模块依赖（从上到下）

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
startScreen.js        ← gameState, audioSystem, characterSystem, mapSystem
lobbySystem.js        ← gameState, audioSystem, characterSystem, itemSystem, mapSystem
gameInit.js           ← 所有模块
```

### 3.2 全局变量跨文件引用表

| 变量名 | 定义文件 | 被读取的文件 | 被写入的文件 |
|--------|----------|-------------|-------------|
| `gameState` | gameState.js | **所有 JS 文件** | gameInit.js, bidSystem.js, settlementSystem.js, shopSystem.js, characterSystem.js, startScreen.js, lobbySystem.js, numpad.js |
| `ROUND_RULES` | gameState.js | bidSystem.js, settlementSystem.js | — |
| `AI_NAMES` | gameState.js | bidSystem.js, gameState.js (`getPlayerName`) | — |
| `ITEM_TYPES` | gameState.js | itemSystem.js, confirmDialog.js, shopSystem.js, lobbySystem.js | — |
| `playerItems` | gameState.js | itemSystem.js, confirmDialog.js, shopSystem.js, lobbySystem.js | itemSystem.js, shopSystem.js, gameInit.js |
| `roundItemUsed` | gameState.js | itemSystem.js, confirmDialog.js | itemSystem.js, gameInit.js |
| `SHOP_ITEMS` | gameState.js | shopSystem.js | — |
| `collectionItems` | gameState.js | gameState.js (`pickItem`), skillSystem.js | — |
| `rarityTypes` | gameState.js | gameState.js (`pickItem`) | — |
| `characterData` | gameState.js | skillSystem.js, characterSystem.js, startScreen.js, lobbySystem.js, gameState.js (`getPlayerName`) | — |
| `treasureMaps` | gameState.js | mapSystem.js | — |
| `audioCtx` | audioSystem.js | audioSystem.js | audioSystem.js |
| `numpadValue` | numpad.js | numpad.js | numpad.js |
| `pendingUseItem` | confirmDialog.js | confirmDialog.js | confirmDialog.js |
| `mapAnimating` | mapSystem.js | mapSystem.js | mapSystem.js |
| `selectedCharIndex` | characterSystem.js | characterSystem.js, startScreen.js | characterSystem.js, startScreen.js, gameInit.js |
| `charTrackOffset` | characterSystem.js | characterSystem.js | characterSystem.js |
| `charAnimating` | characterSystem.js | characterSystem.js | characterSystem.js |
| `startCharIndex` | startScreen.js | startScreen.js | startScreen.js |
| `lobbyCharIndex` | lobbySystem.js | lobbySystem.js | lobbySystem.js |
| `LOBBY_SKILLS` | lobbySystem.js | lobbySystem.js | — |
| `LOBBY_TITLES` | lobbySystem.js | lobbySystem.js | — |

### 3.3 DOM ID 跨文件引用表

| ID | 定义位置 | 读取它的 JS 文件 | 读取它的 CSS 文件 |
|----|----------|-----------------|------------------|
| `startScreen` | index.html L23 | startScreen.js, gameInit.js | start-screen.css |
| `startParticles` | index.html L25 | startScreen.js | — |
| `startCharImg` | index.html L39 | startScreen.js | — |
| `startCharName` | index.html L47 | startScreen.js | — |
| `startCharGrid` | index.html L79 | startScreen.js | — |
| `startCharOverlay` | index.html L84 | startScreen.js, gameInit.js | start-screen.css |
| `startCharSelectGrid` | index.html L89 | startScreen.js | — |
| `lobbyScreen` | index.html L94 | lobbySystem.js, gameInit.js | lobby.css |
| `lobbyCharBg` | index.html L96 | lobbySystem.js | — |
| `lobbyCharImg` | index.html L115 | lobbySystem.js | — |
| `lobbyCharName` | index.html L118 | lobbySystem.js | — |
| `lobbyCharTitle` | index.html L119 | lobbySystem.js | — |
| `lobbyCharBio` | index.html L120 | lobbySystem.js | — |
| `lobbyThumbs` | index.html L126 | lobbySystem.js | — |
| `lobbySkillAvatar` | index.html L133 | lobbySystem.js | — |
| `lobbySkillName` | index.html L135 | lobbySystem.js | — |
| `lobbySkillDesc` | index.html L136 | lobbySystem.js | — |
| `lobbyPocketSlots` | index.html L143 | lobbySystem.js | — |
| `lobbyPocketCount` | index.html L144 | lobbySystem.js | — |
| `lobbyGold` | index.html L107 | lobbySystem.js | — |
| `numpadOverlay` | index.html L152 | numpad.js | numpad.css |
| `numpadClose` | index.html L153 | numpad.js | — |
| `numpadDisplay` | index.html L155 | numpad.js | — |
| `numpadKeyClear` | index.html L160 | numpad.js | — |
| `numpadKeyConfirm` | index.html L170 | numpad.js | — |
| `bidDisplay` | index.html L245 | numpad.js, bidSystem.js | auction-area.css |
| `bid-logs` | index.html L240 | uiHelpers.js, bidSystem.js | auction-area.css |
| `topPrice` | index.html L236 | bidSystem.js | — |
| `topBidder` | index.html L237 | bidSystem.js | — |
| `roundInfo` | index.html L186 | uiHelpers.js | — |
| `roundTag` | index.html L233 | uiHelpers.js | — |
| `myMoney` | index.html L194 | uiHelpers.js, bidSystem.js, settlementSystem.js, gameInit.js | — |
| `myHafCoins` | index.html L195 | uiHelpers.js, gameInit.js | — |
| `shopHafCoins` | index.html L381 | uiHelpers.js, shopSystem.js | — |
| `ai1Money` | index.html L204 | bidSystem.js, settlementSystem.js, gameInit.js | — |
| `ai2Money` | index.html L213 | bidSystem.js, settlementSystem.js, gameInit.js | — |
| `ai3Money` | index.html L222 | bidSystem.js, settlementSystem.js, gameInit.js | — |
| `myStatus` | index.html L196 | bidSystem.js, settlementSystem.js, gameInit.js | — |
| `ai1Status` | index.html L205 | bidSystem.js, gameInit.js | — |
| `ai2Status` | index.html L214 | bidSystem.js, gameInit.js | — |
| `ai3Status` | index.html L223 | bidSystem.js, gameInit.js | — |
| `btnConfirm` | index.html L268 | bidSystem.js, gameInit.js | auction-area.css |
| `btnPass` | index.html L269 | bidSystem.js | auction-area.css |
| `multiplierInput` | index.html L263 | bidSystem.js | auction-area.css |
| `multiplierResult` | index.html L265 | bidSystem.js | auction-area.css |
| `previewGrid` | index.html L283 | skillSystem.js, itemSystem.js, gameInit.js | warehouse-grid.css |
| `scanStatus` | index.html L279 | skillSystem.js, settlementSystem.js, gameInit.js | — |
| `settleModal` | index.html L288 | settlementSystem.js, gameInit.js | settlement-modal.css |
| `settleGrid` | index.html L304 | settlementSystem.js | settlement-modal.css |
| `settleTitle` | index.html L291 | settlementSystem.js | — |
| `settleCost` | index.html L293 | settlementSystem.js | — |
| `settleTotalVal` | index.html L295 | settlementSystem.js | — |
| `settleProfitLabel` | index.html L296 | settlementSystem.js | — |
| `settleProfit` | index.html L297 | settlementSystem.js | — |
| `settleFooter` | index.html L302 | settlementSystem.js | — |
| `btnNextRound` | index.html L305 | settlementSystem.js | — |
| `mapOverlay` | index.html L313 | mapSystem.js, gameInit.js | map-overlay.css |
| `mapTrack` | index.html L331 | mapSystem.js | map-overlay.css |
| `mapStartBtn` | index.html L334 | mapSystem.js | map-overlay.css |
| `mapResult` | index.html L335 | mapSystem.js | map-overlay.css |
| `mapCloseTop` | index.html L319 | mapSystem.js | — |
| `mapCloseBtn` | index.html L336 | mapSystem.js | — |
| `mapEntryBtn` | index.html L278 | mapSystem.js | — |
| `charSelectBtn` | index.html L342 | characterSystem.js | character-select.css |
| `charBtnAvatar` | index.html L344 | characterSystem.js, gameInit.js, startScreen.js | — |
| `charOverlay` | index.html L347 | characterSystem.js, gameInit.js | character-select.css |
| `charTrack` | index.html L364 | characterSystem.js | character-select.css |
| `charCloseTop` | index.html L352 | characterSystem.js | — |
| `charConfirmBtn` | index.html L367 | characterSystem.js | — |
| `shopOverlay` | index.html L374 | shopSystem.js, gameInit.js | shop.css |
| `shopItems` | index.html L383 | shopSystem.js | — |
| `shopInvSlots` | index.html L386 | shopSystem.js | — |
| `shopClose` | index.html L376 | shopSystem.js | — |
| `shopEntryBtn` | index.html L185 | shopSystem.js | — |
| `confirmOverlay` | index.html L391 | confirmDialog.js, gameInit.js | confirm-dialog.css |
| `confirmIcon` | index.html L393 | confirmDialog.js | — |
| `confirmTitle` | index.html L394 | confirmDialog.js | — |
| `confirmDesc` | index.html L395 | confirmDialog.js | — |
| `confirmYes` | index.html L397 | confirmDialog.js | — |
| `confirmNo` | index.html L398 | confirmDialog.js | — |

---

## 四、关键数据结构

### 4.1 gameState（核心状态对象）

```javascript
gameState = {
  currentRound: 1,        // 当前轮次（1~5）
  maxRounds: 5,           // 最大轮次
  money: 3000000,         // 玩家当前资金（初始 300 万）
  aiMoney: [2500000, 1800000, 3200000],  // 3 个 AI 的资金
  hafCoins: 0,            // 玩家的哈夫币（二级货币）
  collectedItems: [],     // 玩家已收集的所有藏品
  collectedValues: [],    // 对应的藏品价值
  gridItems: [],          // 仓库矩阵 60 格的物品数据
  isBidding: false,       // 是否正在出价结算中（锁定状态）
  bidAmount: 0,           // 玩家当前输入的出价金额
  bidMultiplier: 1.0,     // 出价倍数
  roundHistory: [],       // 历史轮次记录
  playerCharId: 'ethan',  // 玩家选择的角色 ID
}
```

### 4.2 五轮成交规则

```javascript
ROUND_RULES = [
  { label: '第一名 ≥ 第二名 × 2.0', threshold: 2.0, desc: '第一轮·翻倍成交' },
  { label: '第一名 ≥ 第二名 × 1.8', threshold: 1.8, desc: '第二轮·1.8倍成交' },
  { label: '第一名 ≥ 第二名 × 1.5', threshold: 0.5, desc: '第三轮·1.5倍成交' },
  { label: '第一名 ≥ 第二名 × 1.2', threshold: 0.2, desc: '第四轮·1.2倍成交' },
  { label: '第一名 > 第二名（高¥1）', threshold: 0, desc: '第五轮·加1元成交', special: true }
]
```

### 4.3 道具类型

```javascript
ITEM_TYPES = [
  { id: 1, name: '扫描器', icon: '🔍', desc: '显示随机3格品质', revealCount: 3 },
  { id: 2, name: '透视镜', icon: '👁', desc: '抽检2个物品(仅自己可见)', inspectCount: 2 },
  { id: 3, name: '鉴定眼', icon: '🔎', desc: '显示随机5格品质', revealCount: 5 }
]
```

### 4.4 角色数据

```javascript
characterData = [
  { id: 'ethan', name: '伊森', title: '古董鉴定师', cls: 'char-shipwreck' },
  { id: 'sunset', name: '落日余晖', title: '沙漠行者', cls: 'char-desert' },
  { id: 'sweet', name: '甜心炸弹', title: '收藏世家', cls: 'char-villa' },
  { id: 'hunter', name: '深海猎手', title: '海底探秘者', cls: 'char-tomb' },
  { id: 'auctioneer', name: '拍卖官', title: '古藏仲裁者', cls: 'char-auction' }
]
```

---

## 五、CSS 类名跨文件引用

### 5.1 按模块分类

| 模块 | CSS 文件 | 核心类名 |
|------|----------|----------|
| 全局布局 | `global.css` | `.game-wrapper`, `.glass-panel`, `.panel-header` |
| 玩家列表 | `player-list.css` | `.player-card`, `.avatar-frame`, `.active-frame`, `.winner-card`, `.loser-card`, `.shop-entry`, `.map-entry` |
| 竞拍区 | `auction-area.css` | `.main-arena`, `.auction-top`, `.round-num`, `.top-price`, `.bid-panel`, `.bid-input-display`, `.quick-btn`, `.multiplier-btn`, `.multiplier-input`, `.btn-confirm`, `.btn-pass`, `#bid-logs`, `.log-item`, `.log-system`, `.log-skill` |
| 数字键盘 | `numpad.css` | `.numpad-overlay`, `.numpad`, `.numpad-key`, `.numpad-quick` |
| 仓库网格 | `warehouse-grid.css` | `.wh-grid-6`, `.wh-cell`, `.scan-active`, `.actuary-active` |
| 物品栏 | `item-bar.css` | `.item-bar`, `.item-slot`, `.used`, `.my-slot`, `.slot-key`, `.slot-icon` |
| 结算弹窗 | `settlement-modal.css` | `.modal`, `.settle-row`, `.settle-left`, `.settle-center`, `.settle-right`, `.settle-cell`, `.circle-loader`, `.revealed`, `.rarity-gold`, `.rarity-red`, `.profit-number` |
| 地图 | `map-overlay.css` | `.map-overlay`, `.map-home-layout`, `.map-track`, `.map-card`, `.map-shipwreck`, `.map-villa`, `.map-desert`, `.map-tomb`, `.map-result` |
| 角色选择 | `character-select.css` | `.char-overlay`, `.char-track`, `.char-card`, `.char-shipwreck`, `.char-villa`, `.char-desert`, `.char-tomb`, `.char-auction`, `.selected`, `.char-confirm-btn` |
| 商城 | `shop.css` | `.shop-overlay`, `.shop-panel`, `.shop-item`, `.shop-buy-btn`, `.shop-inv-slot`, `.filled` |
| 确认弹窗 | `confirm-dialog.css` | `.confirm-overlay`, `.confirm-box`, `.confirm-yes`, `.confirm-no` |
| 开始界面 | `start-screen.css` | `.start-screen`, `.start-particle`, `.start-char-option`, `.active`, `.char-select-overlay` |
| 大厅 | `lobby.css` | `.lobby-screen`, `.lobby-thumb`, `.active`, `.lobby-pocket-slot`, `.filled`, `.empty` |

---

## 六、修改检查清单

### 6.1 修改前必读

- [ ] **定位功能** → 查看"功能 → 文件映射表"确定需要读取的文件
- [ ] **检查依赖** → 查看"跨文件依赖图"确认修改会影响哪些文件
- [ ] **检查全局变量** → 修改 `gameState` 结构会影响所有依赖它的函数
- [ ] **检查 DOM ID** → 新增/删除 ID 需要同步更新所有引用它的 JS/CSS

### 6.2 修改后必做

- [ ] **测试竞拍流程** — 任何涉及出价/结算的修改都需要验证 5 轮规则
- [ ] **检查 AI 兼容性** — AI 出价逻辑依赖 `gameState.money` 和 `gameState.aiMoney`
- [ ] **检查音效触发** — 确认新功能是否需要添加音效（调用 `audioSystem.js`）
- [ ] **检查响应式** — 确认新 UI 元素在移动端（≤900px）的显示
- [ ] **检查 z-index** — 新增弹窗需要与现有层级协调（确认弹窗 1001 > 角色/商城 1000 > 结算/地图 999 > 数字键盘 998）
- [ ] **更新本文档** — 如果新增了文件、函数、全局变量或 DOM ID，同步更新此地图

---

## 七、已知问题速查

| 编号 | 问题 | 位置 | 影响 | 修复建议 |
|------|------|------|------|----------|
| BUG-001 | `totalVal` 变量在 `resolveAuction` 中被使用但声明在其之后 | settlementSystem.js L41 vs L48 | 哈夫币计算可能使用错误的值 | 将 `totalVal` 的生成移到哈夫币计算之前 |
| BUG-002 | 透视镜的"抽检"调用 `pickItem()` 生成新物品，不读取矩阵真实数据 | itemSystem.js L75 | 信息不准确 | 应从 `gameState.gridItems` 中随机选取 |
| BUG-003 | 角色技能"空间残影"对所有角色都触发，没有角色区分 | skillSystem.js L3 | 角色差异化不足 | 根据 `playerCharId` 条件触发 |
| BUG-004 | AI 出价可能基于上一轮的玩家出价而非当前轮 | bidSystem.js L6 | AI 策略不够智能 | 每轮重置 AI 参考基准 |
| DESIGN-001 | 仓库地图抽取结果不影响实际游戏内容 | — | 地图系统沦为纯装饰 | 可让不同地图影响稀有度分布 |
| DESIGN-002 | 角色没有真正独特的技能效果 | — | 角色选择无实际意义 | 为每个角色设计独特技能 |
| DESIGN-003 | 游戏只能玩一轮就结束（点击重新开始） | — | 缺少多轮连续游玩体验 | 改为 5 轮完整竞拍 |
| DESIGN-004 | 商城只能购买道具，不能购买其他增益 | — | 经济系统单一 | 可增加更多商品类型 |

---

## 八、Token 消耗优化对比

| 指标 | 重构前 (33.html) | 重构后（使用本地图） |
|------|------------------|---------------------|
| 总文件数 | 1 | 15+ |
| 最大文件 | 1659 行 | 231 行 (bidSystem.js) |
| 修改音效需读取 | 1659 行 | **113 行** (audioSystem.js) |
| 修改商城需读取 | 1659 行 | **~220 行** (shopSystem.js + gameState.js 部分) |
| 修改角色需读取 | 1659 行 | **~270 行** (characterSystem.js + gameState.js 部分) |
| 修改竞拍需读取 | 1659 行 | **~530 行** (bidSystem.js + settlementSystem.js) |
| 预估 token 节省 | — | **70-85%** |

**使用本地图的额外节省**：AI 无需遍历整个项目即可定位文件，进一步减少 10-20% 的搜索 token。

---

## 九、扩展指南

### 9.1 添加新角色
1. `gameState.js` → `characterData` 数组添加条目
2. 准备头像图片放入 `image/` 目录
3. `character-select.css` → 添加 `.char-newtheme` 样式
4. 如需独特技能 → `skillSystem.js` 添加条件触发逻辑
5. `lobbySystem.js` → `LOBBY_SKILLS`/`LOBBY_TITLES` 添加描述

### 9.2 添加新道具
1. `gameState.js` → `ITEM_TYPES` 数组添加条目
2. `gameState.js` → `SHOP_ITEMS` 添加商城商品
3. `itemSystem.js` → `useItem()` 添加新的 `if` 分支
4. 实现道具效果函数

### 9.3 修改成交规则
1. `gameState.js` → 修改 `ROUND_RULES` 数组
2. `bidSystem.js` + `settlementSystem.js` → 确保判定逻辑兼容
3. 如添加特殊规则 → 设置 `special: true`

### 9.4 添加新仓库地图
1. `gameState.js` → `treasureMaps` 数组添加条目
2. `map-overlay.css` → 添加 `.map-newtype` 样式
3. 如需影响游戏内容 → 修改 `pickItem()` 中的参数

### 9.5 添加新稀有度
1. `gameState.js` → `rarityTypes` 数组添加类型
2. `gameState.js` → `pickItem()` 添加价值范围
3. `settlement-modal.css` + `warehouse-grid.css` → 添加样式
4. `itemSystem.js` → `revealCellsRarity()` 添加显示逻辑
5. `audioSystem.js` → `playReveal()` 添加音效

---

*本文档整合自 `COMPONENT_MAP.md` + `README_AI.md` + `游戏设计文档.md`，基于实际源码分析生成。修改代码后请同步更新此地图。*
