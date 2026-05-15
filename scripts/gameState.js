var INITIAL_MONEY = 3000000;
var INITIAL_AI_MONEY = [2500000, 1800000, 3200000];

var gameState = {
  currentRound: 1,
  maxRounds: 5,
  gameNumber: 1,
  money: INITIAL_MONEY,
  aiMoney: INITIAL_AI_MONEY.slice(),
  hafCoins: 0,
  collectedItems: [],
  collectedValues: [],
  gridItems: [],
  isBidding: false,
  bidAmount: 0,
  bidMultiplier: 1.0,
  roundHistory: [],
  playerCharId: 'ethan',
  countdownTime: 30,
  countdownTimer: null,
  isCountdownActive: false
};

var ROUND_RULES = [
  { label: '第一名 ≥ 第二名 × 2.0', threshold: 2.0, desc: '第一轮·翻倍成交' },
  { label: '第一名 ≥ 第二名 × 1.8', threshold: 1.8, desc: '第二轮·1.8倍成交' },
  { label: '第一名 ≥ 第二名 × 1.5', threshold: 1.5, desc: '第三轮·1.5倍成交' },
  { label: '第一名 ≥ 第二名 × 1.2', threshold: 1.2, desc: '第四轮·1.2倍成交' },
  { label: '第一名 > 第二名（高¥1）', threshold: 0, desc: '第五轮·加1元成交', special: true }
];

var AI_NAMES = ['落日余晖', '甜心炸弹', '深海猎手'];

var ITEM_TYPES = [
  { id: 1, name: '扫描器', icon: '🔍', desc: '显示随机3格品质', revealCount: 3 },
  { id: 2, name: '透视镜', icon: '👁', desc: '抽检2个物品(仅自己可见)', inspectCount: 2 },
  { id: 3, name: '鉴定眼', icon: '🔎', desc: '显示随机5格品质', revealCount: 5 },
  { id: 4, name: '透视卷轴', icon: '📜', desc: '深度抽检4个物品(仅自己可见)', inspectCount: 4 },
  { id: 5, name: '鉴定大师', icon: '🏛', desc: '揭示一整行6格品质', revealCount: 6 },
  { id: 6, name: '幸运骰子', icon: '🎲', desc: '揭示3格,保底1个高品质', revealCount: 3, lucky: true }
];

var playerItems = {};
var roundItemUsed = {};

var SHOP_CATEGORIES = [
  { id: 'all', name: '全部', icon: '🏪' },
  { id: 'reveal', name: '揭示类', icon: '🔍' },
  { id: 'inspect', name: '透视类', icon: '👁' },
  { id: 'special', name: '特殊类', icon: '✨' }
];

var SHOP_ITEMS = [
  { type: 1, name: '扫描器', icon: '🔍', desc: '揭示3格品质，基础侦察工具', price: 50, cat: 'reveal', tag: '', hot: false },
  { type: 3, name: '鉴定眼', icon: '🔎', desc: '揭示5格品质，专业鉴定装备', price: 120, cat: 'reveal', tag: '推荐', hot: true },
  { type: 5, name: '鉴定大师', icon: '🏛', desc: '揭示一整行6格品质，终极揭示', price: 200, cat: 'reveal', tag: '强力', hot: false },
  { type: 2, name: '透视镜', icon: '👁', desc: '抽检2个物品，窥探对手底牌', price: 80, cat: 'inspect', tag: '', hot: false },
  { type: 4, name: '透视卷轴', icon: '📜', desc: '深度抽检4个物品，洞察力翻倍', price: 150, cat: 'inspect', tag: '进阶', hot: false },
  { type: 6, name: '幸运骰子', icon: '🎲', desc: '揭示3格并保底1个高品质', price: 180, cat: 'special', tag: '稀有', hot: true }
];

var collectionItems = [
  { src: './image/藏品/1.png', gridSize: 1, price: 30000 },
  { src: './image/藏品/2.png', gridSize: 2, price: 85000 },
  { src: './image/藏品/3.png', gridSize: 1, price: 25000 },
  { src: './image/藏品/4.png', gridSize: 3, price: 150000 },
  { src: './image/藏品/5.png', gridSize: 2, price: 65000 },
  { src: './image/藏品/6.png', gridSize: 1, price: 35000 },
  { src: './image/藏品/7.png', gridSize: 2, price: 120000 },
  { src: './image/藏品/8.png', gridSize: 3, price: 200000 },
  { src: './image/古董/五代 耀州窑青釉刻花莲瓣纹碗.jpeg', gridSize: 1, price: 85000 },
  { src: './image/古董/元 蓝釉描金折枝花纹匜.jpeg', gridSize: 2, price: 320000 },
  { src: './image/古董/元 青白釉串珠纹玉壶春瓶.jpeg', gridSize: 2, price: 180000 },
  { src: './image/古董/元 青白釉水月观音坐像.jpeg', gridSize: 3, price: 450000 },
  { src: './image/古董/元 青白釉观音坐像.jpeg', gridSize: 3, price: 420000 },
  { src: './image/古董/元 青花云龙纹大罐.jpeg', gridSize: 3, price: 380000 },
  { src: './image/古董/元 青花凤首扁壶.jpeg', gridSize: 2, price: 260000 },
  { src: './image/古董/元 青花釉里红雕怪石花卉图盖罐.jpeg', gridSize: 3, price: 350000 },
  { src: './image/古董/元 青釉印花莲纹碗.jpeg', gridSize: 1, price: 65000 },
  { src: './image/古董/元 黑釉刻花玉壶春瓶.jpeg', gridSize: 2, price: 170000 },
  { src: './image/古董/元 龙泉窑青釉缠枝牡丹纹大瓶.jpeg', gridSize: 3, price: 290000 },
  { src: './image/古董/元-青花缠枝牡丹纹罐.jpeg', gridSize: 2, price: 210000 },
  { src: './image/古董/北宋 耀州窑青釉刻花人物纹执壶.jpeg', gridSize: 2, price: 195000 },
  { src: './image/古董/北宋 耀州窑青釉刻花莲瓣纹盖瓶.jpeg', gridSize: 2, price: 175000 },
  { src: './image/古董/北齐 青釉模印兽面纹四系罐.jpeg', gridSize: 2, price: 160000 },
  { src: './image/古董/南宋 官窑粉青釉金丝铁线方洗.jpeg', gridSize: 1, price: 250000 },
  { src: './image/古董/南宋 龙泉窑青釉弦纹盘口瓶.jpeg', gridSize: 2, price: 220000 },
  { src: './image/古董/唐 越窑秘色瓷八棱净瓶.jpeg', gridSize: 2, price: 310000 },
  { src: './image/古董/唐 邢窑白釉盈字款罐.jpeg', gridSize: 2, price: 155000 },
  { src: './image/古董/宋 定窑白釉刻花莲瓣纹芒口碗.jpeg', gridSize: 1, price: 95000 },
  { src: './image/古董/宋 磁州窑白地黑花缠枝纹玉壶春瓶.jpeg', gridSize: 2, price: 145000 },
  { src: './image/古董/宋 磁州窑绿釉刻花牡丹纹梅瓶.jpeg', gridSize: 2, price: 185000 },
  { src: './image/古董/宋 钧窑天蓝釉三足炉.jpeg', gridSize: 2, price: 230000 },
  { src: './image/古董/宋 钧窑玫瑰紫釉海棠式花盆.jpeg', gridSize: 3, price: 270000 },
  { src: './image/古董/春秋 越王勾践剑.jpeg', gridSize: 3, price: 500000 },
  { src: './image/古董/隋 白釉双龙柄联腹传瓶.jpeg', gridSize: 3, price: 240000 },
  { src: './image/古董/隋 青釉四系盘口瓶.jpeg', gridSize: 2, price: 135000 }
];

var rarityTypes = ['normal','normal','normal','normal','gold','red'];

var characterData = [
  {
    id: 'ethan',
    name: '伊森',
    title: '古董鉴定师',
    img: './image/玩家1.jpg',
    cls: 'char-shipwreck',
    desc: '来自东方的古董鉴定大师，拥有敏锐的眼光和过人的胆识。曾在一座被遗忘的海底沉船中发现了一批价值连城的宋代瓷器，从此名声大噪。他擅长"空间残影"技能，能透视仓库矩阵中隐藏的宝物结构，在混乱的拍卖场上总能洞察每一件藏品的真正价值。'
  },
  {
    id: 'sunset',
    name: '落日余晖',
    title: '沙漠行者',
    img: './image/玩家2.jpg',
    cls: 'char-desert',
    desc: '神秘的沙漠行者，常年游走于丝绸之路的废墟之间。她的直觉比任何精密仪器都要准确，曾在塔克拉玛干深处的废弃驿站中发掘出一整箱波斯银币。精通"精算流"技能，能精准评估区域内藏品的平均价值，让每一次出价都建立在精确的计算之上。'
  },
  {
    id: 'sweet',
    name: '甜心炸弹',
    title: '收藏世家',
    img: './image/玩家3.png',
    cls: 'char-villa',
    desc: '出身于欧洲没落贵族的千金，从小在祖父的私人博物馆中耳濡目染。她将家族传承的鉴赏品味与现代拍卖策略完美融合，以柔克刚的制胜之道令无数对手折服。擅长在关键时刻抛出令人意想不到的报价，如同一颗甜蜜的炸弹，瞬间引爆全场。'
  },
  {
    id: 'hunter',
    name: '深海猎手',
    title: '海底探秘者',
    img: './image/玩家4.png',
    cls: 'char-tomb',
    desc: '退役海军潜水员，专精于海底沉船宝藏的打捞与鉴定。二十年的深海生涯让他对每一处暗礁、每一艘沉船的位置都了然于胸。对深海遗珍有着近乎偏执的热爱，每一次举牌都带着破釜沉舟的决心，从不轻易放弃任何一件来自深海的珍宝。'
  },
  {
    id: 'auctioneer',
    name: '拍卖官',
    title: '古藏仲裁者',
    img: './image/拍卖师.png',
    cls: 'char-auction',
    desc: '五轮竞拍之王的裁判者，掌控着拍卖场上的节奏与规则。数十年来，他手中的木槌落下过无数次，见证了一件件稀世珍宝的归属。如今他决定亲自下场，凭借对规则的深刻理解和对人性的精准把控，用规则的力量征服每一场竞拍。'
  }
];

var treasureMaps = [
  { name: '海底沉船', emoji: '🚢', cls: 'map-shipwreck', desc: '深海遗迹的古老沉船' },
  { name: '废弃别墅', emoji: '🏚️', cls: 'map-villa', desc: '荒废多年的神秘别墅' },
  { name: '沙漠密藏', emoji: '🏜️', cls: 'map-desert', desc: '黄沙之下的千年宝藏' },
  { name: '神秘古墓', emoji: '⚰️', cls: 'map-tomb', desc: '机关重重的帝王陵墓' }
];

function pickItem() {
  var base = collectionItems[Math.floor(Math.random() * collectionItems.length)];
  var rarity = rarityTypes[Math.floor(Math.random() * rarityTypes.length)];
  return { src: base.src, rarity: rarity, value: base.price, gridSize: base.gridSize };
}

function getPlayerName(playerId) {
  if (playerId === 'me') {
    var ch = characterData.find(function(c) { return c.id === gameState.playerCharId; }) || characterData[0];
    return ch.name;
  }
  return AI_NAMES[playerId === 'ai1' ? 0 : playerId === 'ai2' ? 1 : 2];
}
