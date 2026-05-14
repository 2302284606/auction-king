var gameState = {
  currentRound: 1,
  maxRounds: 5,
  money: 3000000,
  aiMoney: [2500000, 1800000, 3200000],
  hafCoins: 0,
  collectedItems: [],
  collectedValues: [],
  gridItems: [],
  isBidding: false,
  bidAmount: 0,
  bidMultiplier: 1.0,
  roundHistory: [],
  playerCharId: 'ethan'
};

var ROUND_RULES = [
  { label: '第一名 ≥ 第二名 × 2.0', threshold: 2.0, desc: '第一轮·翻倍成交' },
  { label: '第一名 ≥ 第二名 × 1.8', threshold: 1.8, desc: '第二轮·1.8倍成交' },
  { label: '第一名 ≥ 第二名 × 0.5', threshold: 0.5, desc: '第三轮·半价成交' },
  { label: '第一名 ≥ 第二名 × 0.2', threshold: 0.2, desc: '第四轮·二折成交' },
  { label: '第一名 > 第二名（高¥1）', threshold: 0, desc: '第五轮·加1元成交', special: true }
];

var AI_NAMES = ['落日余晖', '甜心炸弹', '深海猎手'];

var ITEM_TYPES = [
  { id: 1, name: '扫描器', icon: '🔍', desc: '显示随机3格品质', revealCount: 3 },
  { id: 2, name: '透视镜', icon: '👁', desc: '抽检2个物品(仅自己可见)', inspectCount: 2 },
  { id: 3, name: '鉴定眼', icon: '🔎', desc: '显示随机5格品质', revealCount: 5 }
];

var playerItems = {};
var roundItemUsed = {};

var SHOP_ITEMS = [
  { type: 1, name: '扫描器', icon: '🔍', desc: '揭示3格品质', price: 50 },
  { type: 2, name: '透视镜', icon: '👁', desc: '抽检2个物品', price: 80 },
  { type: 3, name: '鉴定眼', icon: '🔎', desc: '揭示5格品质', price: 120 }
];

var collectionItems = [
  { src: './image/藏品/1.png' },
  { src: './image/藏品/2.png' },
  { src: './image/藏品/3.png' },
  { src: './image/藏品/4.png' },
  { src: './image/藏品/5.png' },
  { src: './image/藏品/6.png' },
  { src: './image/藏品/7.png' },
  { src: './image/藏品/8.png' }
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
  var value = 0;
  if (rarity === 'gold') value = 150000 + Math.floor(Math.random() * 200000);
  else if (rarity === 'red') value = 80000 + Math.floor(Math.random() * 100000);
  else value = 10000 + Math.floor(Math.random() * 40000);
  return { src: base.src, rarity: rarity, value: value };
}

function getPlayerName(playerId) {
  if (playerId === 'me') {
    var ch = characterData.find(function(c) { return c.id === gameState.playerCharId; }) || characterData[0];
    return ch.name;
  }
  return AI_NAMES[playerId === 'ai1' ? 0 : playerId === 'ai2' ? 1 : 2];
}
