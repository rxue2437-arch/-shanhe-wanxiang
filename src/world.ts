export type HistoryModeId = "true" | "rewrite" | "mirror" | "random";
export type StatKey =
  | "cash"
  | "grain"
  | "land"
  | "learning"
  | "physique"
  | "health"
  | "reputation"
  | "connections"
  | "credit"
  | "information"
  | "risk";

export type Stats = Record<StatKey, number>;

export type Era = {
  id: string;
  label: string;
  defaultYear: number;
  dynasty: string;
  capital: string;
  ruler: string;
  anchor: string;
  structure: string;
  rumor: string;
};

export type Identity = {
  id: string;
  label: string;
  group: "民生" | "技艺" | "士林" | "方外" | "江湖" | "商旅" | "官府" | "军政" | "宫廷" | "自定";
  social: string;
  occupation: string;
  description: string;
  stats: Partial<Stats>;
};

export type Choice = {
  label: string;
  hint: string;
  result: string;
  effects?: Partial<Stats>;
  requires?: Partial<Stats>;
  failResult?: string;
  failEffects?: Partial<Stats>;
  flags?: string[];
};

export type GameEvent = {
  id: string;
  title: string;
  location: string;
  paragraphs: string[];
  rumor?: string;
  identities?: string[];
  modes?: HistoryModeId[];
  minAge?: number;
  maxAge?: number;
  requiresFlags?: string[];
  excludesFlags?: string[];
  choices: Choice[];
};

export type Character = {
  name: string;
  gender: string;
  ageAtStart: number;
  birthplace: string;
  family: string;
  occupation: string;
  goal: string;
  eraId: string;
  exactYear: number;
  modeId: HistoryModeId;
  identityId: string;
};

export type HistoryEntry = {
  year: number;
  month: number;
  age: number;
  title: string;
  result: string;
};

export type KnownPerson = {
  id: string;
  name: string;
  publicIdentity: string;
  knownAttitude: string;
  memory: string[];
  hiddenGoal: string;
  hiddenFear: string;
  hiddenFaction: string;
};

export type GameState = {
  character: Character;
  year: number;
  month: number;
  age: number;
  turn: number;
  stats: Stats;
  flags: string[];
  resolvedEventIds: string[];
  pendingResult: string | null;
  currentEventId: string | null;
  history: HistoryEntry[];
  people: KnownPerson[];
  familyBond: number;
  ended: boolean;
  ending: string | null;
};

export const historyModes: Array<{ id: HistoryModeId; label: string; description: string }> = [
  { id: "true", label: "真实历史", description: "事实优先；个人行动仍受当时制度与结构约束" },
  { id: "rewrite", label: "历史改写", description: "真实历史开局；足够的行动与资源可以形成分叉" },
  { id: "mirror", label: "历史镜像", description: "虚构王朝；制度、人物与重大矛盾存在历史映射" },
  { id: "random", label: "随机时代", description: "时代、地域与身份由世界决定" },
];

export const eras: Era[] = [
  { id: "qin_end", label: "秦末", defaultYear: -209, dynasty: "秦", capital: "咸阳", ruler: "秦二世", anchor: "戍卒失期、徭役沉重与地方恐惧正在把零散反抗连成更大的动荡。", structure: "郡县、军功爵与严密法令仍在运作，基层执行却因征发与逃亡迅速失真。", rumor: "从大泽乡方向来的役夫说，有人已经不肯再按旧路去戍边。" },
  { id: "western_han", label: "西汉", defaultYear: -87, dynasty: "汉", capital: "长安", ruler: "汉武帝", anchor: "多年征伐之后，盐铁、赋役、边郡与继承问题同时进入朝廷议论。", structure: "郡国并行、察举萌发，国家财政深入盐铁与输运，豪族也在地方扩张。", rumor: "关中商旅说，朝廷近来反复核问盐铁与边费的数字。" },
  { id: "qinhan", label: "东汉", defaultYear: 184, dynasty: "汉", capital: "雒阳", ruler: "汉灵帝", anchor: "州郡奏报灾异与流民，太平道在乡里迅速扩张。", structure: "编户齐民、察举与郡县仍是秩序骨架，豪强庄园正在吞并土地。", rumor: "行脚人说，冀州有人以符水治病，追随者日众。" },
  { id: "three", label: "三国", defaultYear: 208, dynasty: "汉", capital: "许都", ruler: "汉献帝", anchor: "北方大军南下，荆州去向将改变天下形势。", structure: "战争、流民与部曲重塑地方，朝廷名义和军事实力彼此分离。", rumor: "江上的船夫说，各处都在征粮、造船、点兵。" },
  { id: "western_jin", label: "西晋", defaultYear: 291, dynasty: "晋", capital: "洛阳", ruler: "晋惠帝", anchor: "宗室辅政与禁军调动彼此牵连，京师命令不断更换来源。", structure: "门阀、占田荫客和宗王军权叠在统一表象下，地方灾荒与流民问题持续积累。", rumor: "洛阳来的车夫说，同一座城门三日内换了两批守军。" },
  { id: "eastern_jin", label: "东晋", defaultYear: 383, dynasty: "晋", capital: "建康", ruler: "晋孝武帝", anchor: "北方大军南下，江淮防线、侨姓门阀与北府军都在承受选择。", structure: "侨州郡、门阀政治、庄园与军镇共同构成江南政权，朝廷对地方控制并不均一。", rumor: "淮上逃来的百姓说，渡口正在征集所有能用的船。" },
  { id: "northsouth", label: "南北朝", defaultYear: 548, dynasty: "梁", capital: "建康", ruler: "梁武帝", anchor: "边将举兵，台城内外尚未看清危机的规模。", structure: "门阀、军镇、侨州郡与宗教共同塑造身份和权力。", rumor: "北来的客商忽然低价出售行囊，急着离开建康。" },
  { id: "sui_end", label: "隋末", defaultYear: 611, dynasty: "隋", capital: "大兴城", ruler: "隋炀帝", anchor: "东征、河工、远途转运与地方饥荒叠加，逃役和聚众事件越来越难压下。", structure: "统一制度和大工程调动能力极强，也因此把运输、户籍与民力推到极限。", rumor: "河北来的民夫说，下一轮征发名单已经贴到村口。" },
  { id: "high_tang", label: "盛唐", defaultYear: 741, dynasty: "唐", capital: "长安", ruler: "唐玄宗", anchor: "国家表面繁盛，漕运、括户、边防与朝廷用人仍在持续调整。", structure: "律令、科举、均田旧制、都市商业和多方向交通共同运转，繁盛并不等于没有代价。", rumor: "西市商人说，今年入京的外地货更多，关验也比去年细。" },
  { id: "suitang", label: "中晚唐", defaultYear: 755, dynasty: "唐", capital: "长安", ruler: "唐玄宗", anchor: "边镇军权、漕运与宫廷政治同时逼近临界点。", structure: "均田和府兵的旧框架松动，募兵、庄园与边镇日益重要。", rumor: "范阳来的驿卒说，军中点名册近来改得很勤。" },
  { id: "five", label: "五代十国", defaultYear: 923, dynasty: "后唐", capital: "洛阳", ruler: "唐庄宗", anchor: "新朝立国未稳，旧国降臣、牙兵与藩镇各有盘算。", structure: "军人集团决定政权更替，城与城之间的制度、货币和赋税并不一致。", rumor: "渡口有人争论，昨日还是敌国的将军今日已经换了旗号。" },
  { id: "north_song", label: "北宋", defaultYear: 1069, dynasty: "宋", capital: "东京", ruler: "宋神宗", anchor: "新法从中枢进入州县，青苗、免役、保甲与财赋执行出现不同结果。", structure: "文官体系、科举、城市商业与财政技术高度发展，边防和地方执行仍限制改革。", rumor: "州学士子说，新来的提举官正在逐县核问青苗钱。" },
  { id: "song", label: "南宋", defaultYear: 1127, dynasty: "宋", capital: "应天府", ruler: "宋高宗", anchor: "北方失守，朝廷南迁，百姓与官僚都在重新寻找立足之地。", structure: "文官体系、商品经济与发达交通仍在运转，却承受战争与财政的重压。", rumor: "难民说，汴京城门外的道路已经被车马堵死。" },
  { id: "yuan", label: "元", defaultYear: 1351, dynasty: "元", capital: "大都", ruler: "元顺帝", anchor: "河工、徭役与灾荒叠加，红巾起事开始蔓延。", structure: "行省、站赤与多层身份制度覆盖广阔疆域，地方执行高度不均。", rumor: "河工营里传出童谣，监工连夜搜查唱歌的人。" },
  { id: "ming", label: "明", defaultYear: 1582, dynasty: "明", capital: "北京", ruler: "明神宗", anchor: "首辅病重，一条鞭法后的秩序与反弹同时抵达地方。", structure: "卫所、里甲、科举与白银财政彼此牵动，地方豪族善于在制度缝隙中生存。", rumor: "南来的官船上，有人低声议论首辅的病情。" },
  { id: "qing", label: "清", defaultYear: 1796, dynasty: "清", capital: "北京", ruler: "嘉庆帝", anchor: "新帝即位，盛世积弊、人口压力与地方教乱一并浮现。", structure: "官僚体系深入州县，人口与土地的失衡使基层承受越来越重的压力。", rumor: "川楚客商说，山路上多了团练和查验文书的关卡。" },
  { id: "custom", label: "自定义具体年份", defaultYear: 960, dynasty: "自定", capital: "未定", ruler: "未知", anchor: "你选择的年份将由所选历史模式决定其事实与分叉。", structure: "制度、地理、人口和生产力仍然约束每个人的选择。", rumor: "远方消息尚未抵达，你只能先认识身边的世界。" },
];

export const identities: Identity[] = [
  { id: "laborer", label: "农民", group: "民生", social: "编户平民", occupation: "受雇耕作", description: "几乎没有自己的土地，劳力、工价、口粮和差役决定一家能否过冬。", stats: { cash: 2, grain: 5, land: 0, physique: 8, learning: 1, risk: 3 } },
  { id: "farmer", label: "农户", group: "民生", social: "自耕农户", occupation: "务农", description: "有少量口粮、农具和田地，生活取决于收成、租税和全家的劳力。", stats: { cash: 4, grain: 10, land: 2, physique: 7, learning: 1 } },
  { id: "tenant", label: "佃农", group: "民生", social: "依附佃户", occupation: "租佃", description: "耕作他人土地，契约、租额与庄头态度决定一年余粮。", stats: { cash: 2, grain: 6, land: 0, physique: 8, learning: 1, risk: 4 } },
  { id: "hunter", label: "猎户", group: "民生", social: "山民", occupation: "狩猎", description: "熟悉山川禽兽，收入不稳，与巡检、豪族和商贩都有往来。", stats: { cash: 6, grain: 5, physique: 9, information: 4 } },
  { id: "artisan", label: "工匠", group: "技艺", social: "匠籍/行会成员", occupation: "手工业", description: "靠一门技艺立身，也受官役、行会和原料价格牵制。", stats: { cash: 10, grain: 5, learning: 4, physique: 6, reputation: 2 } },
  { id: "doctor", label: "医者", group: "技艺", social: "民间医者", occupation: "行医", description: "诊治建立在经验、药材、信誉与有限知识上；救不活的人也会留下关系与后果。", stats: { cash: 10, grain: 4, learning: 9, reputation: 3, information: 3, credit: 4 } },
  { id: "merchant", label: "商人", group: "商旅", social: "行商", occupation: "经商", description: "有周转本钱，却要面对牙人、税关、信用与路途风险。", stats: { cash: 28, grain: 4, learning: 5, connections: 5, credit: 6 } },
  { id: "saltmerchant", label: "盐商", group: "商旅", social: "盐业商人", occupation: "经营盐运", description: "利润来自牌照、路线和官商关系；一张盐引背后可能牵动整条权力链。", stats: { cash: 65, grain: 5, learning: 6, connections: 10, credit: 7, information: 7, risk: 8 } },
  { id: "scholar", label: "书生", group: "士林", social: "寒门读书人", occupation: "读书抄写", description: "读书未必应试，也可能授徒、抄书、幕游或终身不仕。", stats: { cash: 6, grain: 4, learning: 9, reputation: 1, credit: 2 } },
  { id: "candidate", label: "士子", group: "士林", social: "应试士子", occupation: "读书应试", description: "功名是窄门；纸墨、师承、盘缠、资格与家计都真实消耗年月。", stats: { cash: 8, grain: 4, learning: 10, reputation: 2, credit: 2 } },
  { id: "daoist", label: "道士", group: "方外", social: "宫观道众", occupation: "斋醮、医卜与修行", description: "既处宗教网络，也可能接触医药、地方信仰、官府仪式与真假方术。", stats: { cash: 4, grain: 5, learning: 7, reputation: 3, information: 5, connections: 3 } },
  { id: "monk", label: "僧人", group: "方外", social: "寺院僧众", occupation: "寺务与修行", description: "寺院既是信仰共同体，也管理田产、赈济、香火、戒律与地方关系。", stats: { cash: 2, grain: 8, learning: 6, reputation: 4, connections: 4, credit: 4 } },
  { id: "wanderer", label: "江湖人物", group: "江湖", social: "无固定籍属", occupation: "游历谋生", description: "行走于官面秩序之外，但客栈、帮会、保人、债务和通缉仍会限制自由。", stats: { cash: 8, grain: 3, physique: 8, information: 7, connections: 4, risk: 8 } },
  { id: "escort", label: "镖师", group: "江湖", social: "镖局行当", occupation: "护送人货", description: "真正的本事不只在刀枪，还在认路、识人、谈判与判断何时不该动手。", stats: { cash: 14, grain: 4, physique: 9, reputation: 4, information: 6, connections: 5, risk: 7 } },
  { id: "clerk", label: "小吏", group: "官府", social: "胥吏", occupation: "文书差遣", description: "懂章程与地方旧例，身处官府却没有官员的清贵身份。", stats: { cash: 14, grain: 5, learning: 7, connections: 6, information: 6, credit: 3 } },
  { id: "magistrate", label: "县令", group: "官府", social: "亲民官", occupation: "治理一县", description: "负责钱粮、刑名、治安、赈灾与教化，却要依赖本地胥吏和乡绅执行。", stats: { cash: 20, grain: 6, learning: 10, reputation: 7, connections: 8, credit: 8, information: 7, risk: 7 } },
  { id: "prefect", label: "州官", group: "官府", social: "州府长官", occupation: "统筹州政", description: "要在属县、上司、军务、财政和地方势力之间分配有限权力与责任。", stats: { cash: 28, grain: 7, learning: 10, reputation: 9, connections: 11, credit: 8, information: 9, risk: 8 } },
  { id: "central", label: "中央官员", group: "官府", social: "京官", occupation: "中枢政务", description: "更接近决策，却也更依赖信息来源、程序、派系与皇帝的注意力。", stats: { cash: 32, grain: 6, learning: 11, reputation: 10, connections: 13, credit: 8, information: 11, risk: 10 } },
  { id: "official", label: "其他官员", group: "官府", social: "流官", occupation: "治政", description: "可自行填写具体品级与差遣；印信不等于执行力，政策仍要穿过钱粮、属吏与地方社会。", stats: { cash: 22, grain: 6, learning: 10, reputation: 8, connections: 9, credit: 8, information: 8, risk: 6 } },
  { id: "gentry", label: "地方豪族", group: "军政", social: "地方大户", occupation: "经营田庄", description: "拥有土地、宗族和门路，也承担更复杂的地方责任与敌意。", stats: { cash: 55, grain: 18, land: 35, learning: 6, reputation: 8, connections: 10, risk: 3 } },
  { id: "military", label: "军户", group: "军政", social: "军籍", occupation: "戍守", description: "吃粮当差，军籍能带来口粮，也可能成为世代枷锁。", stats: { cash: 7, grain: 8, physique: 9, information: 2, risk: 8 } },
  { id: "general", label: "武将", group: "军政", social: "军中将领", occupation: "统兵", description: "能够影响战局，但军心、粮道、上命与同僚比个人武勇更重要。", stats: { cash: 24, grain: 8, physique: 10, reputation: 9, connections: 8, information: 7, risk: 12 } },
  { id: "palace", label: "宫廷人物", group: "宫廷", social: "内廷", occupation: "宫中差遣", description: "离权力很近，离危险也近；知道多少、被谁记住都可能改变命运。", stats: { cash: 12, grain: 4, learning: 6, connections: 8, information: 12, credit: 5, risk: 12 } },
  { id: "royal", label: "宗室", group: "宫廷", social: "宗室", occupation: "奉朝请", description: "血缘既是资源也是监视；婚姻、储位和皇权都会改变安全边界。", stats: { cash: 65, grain: 12, land: 18, learning: 7, reputation: 12, connections: 13, information: 8, risk: 9 } },
  { id: "inlaw", label: "外戚", group: "宫廷", social: "后族", occupation: "以姻亲入权力网络", description: "权势依附宫中关系；恩宠、宗族扩张和官僚反弹会同时发生。", stats: { cash: 70, grain: 10, land: 20, reputation: 9, connections: 14, information: 9, risk: 12 } },
  { id: "eunuch", label: "宦官", group: "宫廷", social: "内官", occupation: "内廷差遣", description: "职位、皇帝信任、宫门与文书通道构成权力；同类也从来不是一个阵营。", stats: { cash: 18, grain: 4, learning: 6, reputation: 2, connections: 11, information: 14, credit: 4, risk: 14 } },
  { id: "emperor", label: "皇帝", group: "宫廷", social: "君主", occupation: "统治帝国", description: "名义权力最大，却不能绕过财政、官僚、军队、地方、信息延迟和继承问题。", stats: { cash: 90, grain: 20, land: 50, learning: 9, reputation: 15, connections: 16, information: 14, credit: 8, risk: 15 } },
  { id: "custom", label: "自定义", group: "自定", social: "自定身份", occupation: "自定职业", description: "由你填写身份细节；世界会按其合理资源与社会位置回应。", stats: { cash: 10, grain: 5, learning: 4, physique: 5, reputation: 1, connections: 2 } },
];

export const baseStats: Stats = {
  cash: 0, grain: 0, land: 0, learning: 2, physique: 5, health: 78,
  reputation: 0, connections: 1, credit: 2, information: 1, risk: 2,
};

const c = (label: string, hint: string, result: string, effects: Partial<Stats>, extra: Partial<Choice> = {}): Choice => ({ label, hint, result, effects, ...extra });

const originEvents: Record<string, GameEvent> = {
  laborer: { id: "origin-laborer-wage", title: "麦收前突然压低的工价", location: "东家田头", paragraphs: ["麦穗刚黄，庄头宣布今年短工只给往年七成口粮，理由是邻县来了许多逃荒人。", "若所有人各自答应，谁都很难再把工价抬回去；若停工，家中今晚便少一顿饭。"], choices: [c("联络熟工一同谈价", "共同承担失去活计的风险", "十二名熟工约定不拆台。庄头最终补回一成，并承诺午饭照旧。", { connections: 4, reputation: 3, grain: -1, risk: 2 }, { flags: ["laborers-bargained"] }), c("接受工价，争取多做两日", "先保住眼前口粮", "你得到六日活计。工钱勉强够吃，却也使新价成了往后的依据。", { grain: 4, health: -3, credit: 1 }, { flags: ["lower-wage"] }), c("转去县城找脚力活", "离开熟悉的雇佣关系", "城门外等活的人更多，你靠替药铺卸货挣到现钱，也认识了一个脚店掌柜。", { cash: 4, information: 2, connections: 1 })] },
  farmer: { id: "origin-farmer-seed", title: "种粮还是换桑", location: "自家薄田", paragraphs: ["开春前，村里牙人愿赊给你一批桑苗，三年后才见收益。父亲却坚持把仅有的两亩地全部种粟。", "去岁粮价平稳，布价却涨了。你们能承担的不是一道算术题，而是三年里任何一次灾病。"], choices: [c("仍种口粮", "先保一家口粮", "你没有追逐布价。秋收不算丰，却足以让灶火不断。", { grain: 5, cash: -1 }), c("拿半亩试种桑苗", "分散风险", "你留下大部分口粮田，把最靠路的一角改成桑地。", { cash: -3, learning: 2 }, { flags: ["mulberry-plot"] }), c("合几户共养蚕", "需要乡里信用", "四家共同出人出屋，收益未见，彼此的账先写得清楚。", { connections: 3, credit: 2, grain: -1 })] },
  tenant: { id: "origin-tenant-contract", title: "新契多出的一行字", location: "庄头宅前", paragraphs: ["续佃契送来时，你发现旧日的四六分成改成了对半，末尾还添了水脚和种子息。", "庄头没有催，只说后面排着三户愿接这块田的人。"], choices: [c("带旧契去族老处评理", "可能失去租田", "族老不肯得罪庄头，却证明那一行是后来添的。租额暂按旧例。", { reputation: 3, credit: 2, risk: 2 }), c("签下新契", "保住土地", "田保住了，但今年每一场雨都开始显得更重要。", { grain: -2, risk: 3 }, { flags: ["heavy-rent"] }), c("退佃，去河工营谋生", "离开土地", "你交回钥匙，带家人搬进河工棚。现钱多了，根却暂时没了。", { cash: 6, land: 0, health: -4 }, { flags: ["river-worker"] })] },
  artisan: { id: "origin-artisan-measure", title: "官尺与旧尺", location: "行会作坊", paragraphs: ["官府催造一批木箱，新发的官尺比作坊旧尺略短。按新尺交货能省料，日后验收却可能成为罪证。", "师傅把两把尺并排放着，问你以后愿意用哪一把。"], choices: [c("按官尺另做样板", "留下文书凭据", "你请书吏在样板上钤记尺寸。省下的木料没有落进私人腰包。", { learning: 2, reputation: 2, cash: 2 }), c("继续用旧尺", "稳妥但亏料", "货按时交了，作坊少赚一笔，却没有留下争端。", { cash: -2, credit: 2 }), c("两套尺寸分别入账", "高风险的灰色做法", "好料用旧尺、次料用官尺，管事看懂后没有声张。", { cash: 6, connections: 2, risk: 4, credit: -2 }, { flags: ["double-ledger"] })] },
  merchant: { id: "origin-merchant-debt", title: "旧债与一船生丝", location: "河埠牙行", paragraphs: ["亡父旧识拿来一张借据，也带来一船受潮生丝。若肯入股，利润或许足以清债。", "样包只有表层受潮，船舱深处却不许你独自查看。"], choices: [c("付钱拆验三包", "花钱买真实信息", "第三包内层已有霉斑。你压价买下仍可用的一半。", { cash: 7, information: 3, credit: 1 }), c("拒绝货物，分期认债", "保住周转本钱", "债主同意宽限一年，但要你按月送账。", { cash: -3, credit: 4 }, { flags: ["old-debt"] }), c("找另一家牙人共同担保", "利润和风险都分摊", "两家牙人互相牵制，货价回到合理范围。", { cash: 4, connections: 4, information: 1 })] },
  military: { id: "origin-military-ghost", title: "点名册上的死人", location: "营门点卯处", paragraphs: ["你在粮册上看见一个已经死去三年的名字，那份军粮仍按月支领。", "同袍只提醒一句：百户的岳家就在千户府里。"], choices: [c("抄下粮册，暂不声张", "保存证据等待时机", "你把数字缝进旧甲内衬，没有立刻变成任何人的敌人。", { information: 4, risk: 1 }, { flags: ["muster-evidence"] }), c("当场质问百户", "直接但危险", "百户称是补发抚恤，当晚你被调去最远的烽燧。", { reputation: 2, health: -3, risk: 5 }, { flags: ["remote-beacon"] }), c("默认旧例，分一份余粮", "进入营中利益链", "你拿到一小袋粮，也让自己的名字出现在另一册账上。", { grain: 4, connections: 4, credit: -4, risk: 3 })] },
  hunter: { id: "origin-hunter-tracks", title: "山里出现了陌生马蹄", location: "县北山道", paragraphs: ["雪后山路上有七八匹马留下的新蹄印，步幅整齐，不像寻常商队。", "你还在松枝下捡到半截军用箭羽。县城这几日没有调兵的消息。"], choices: [c("沿踪迹查到山口", "体力与风险", "你远远看见一队脱去号衣的军士，没有惊动他们。", { information: 5, health: -2, risk: 2 }, { flags: ["unknown-riders"] }), c("把箭羽交给巡检", "进入官面记录", "巡检收下箭羽，问了你三遍发现地点。", { reputation: 2, connections: 2, risk: 1 }), c("不管人事，转去布兽夹", "保全日常生计", "你避开山口，猎获一只獐子。三日后邻村丢了两匹马。", { cash: 4, grain: 2, information: -1 })] },
  doctor: { id: "origin-doctor-two-patients", title: "同一副药只够救一个人", location: "临河药铺", paragraphs: ["暴雨阻断药路，铺中最后三钱犀角替代药只够配一剂急方。门外同时抬来富商幼子和染坊女工。", "富商愿付十倍药钱；女工的脉象更险，家属只能拿出半串旧钱。"], choices: [c("按病势先救女工", "医理优先，承担权势反弹", "女工熬过最险的一夜。富商另寻他医，随后停止向你赊药。", { reputation: 5, credit: 4, connections: -3, cash: -2 }, { flags: ["doctor-chose-need"] }), c("收下重金救富商幼子", "保住药材渠道与钱财", "孩子退热，富商替你结清旧账；染坊女工次日病故。", { cash: 12, connections: 4, credit: -4 }, { flags: ["doctor-chose-patron"] }), c("拆药分治并改用针灸", "两边都承担更高不确定性", "两人的高热都暂退，却还需连续数日照护。你没有立刻得到结论。", { learning: 4, health: -3, risk: 3 }, { flags: ["doctor-split-course"] })] },
  saltmerchant: { id: "origin-saltmerchant-missing-seal", title: "盐引少了一处骑缝印", location: "运司验引房", paragraphs: ["三百引盐已经装船，验引吏却指出批文少了一处骑缝印。补印至少要等半月，梅雨却会使盐袋受潮。", "一名书办暗示，只需把其中二十引改挂到另一商号名下，当日便可放行。"], choices: [c("卸盐入仓，等正式补印", "承担仓租与行情变化", "你付了仓租，留住了整套合法文书。半月后盐价已经回落。", { cash: -9, credit: 5, risk: -2 }, { flags: ["salt-lawful-delay"] }), c("借挂同行商号", "用利润换共同责任", "船按时启程，同行得到两成利润，也从此掌握你这条线路。", { cash: 8, connections: 5, credit: -1, risk: 3 }, { flags: ["salt-shared-license"] }), c("给书办辛苦钱补盖旧印", "伪造程序痕迹", "骑缝印补上了，但印泥来自去年的一批公文。", { cash: 13, credit: -6, information: 2, risk: 8 }, { flags: ["salt-forged-seal"] })] },
  scholar: { id: "origin-scholar-letter", title: "县学门前的荐书", location: "县学", paragraphs: ["旧塾师愿替你写荐书，县学今岁只收三名增广生员。", "家里同时欠下两季田租。母亲没有劝你，只把账簿放在灯下。"], choices: [c("携荐书应试", "耗费盘缠与时间", "策问没有让你一步登天，却得到教谕一句认真评语。", { cash: -4, learning: 3, reputation: 2 }, { flags: ["county-school"] }), c("先抄书补齐田租", "错过今年名额", "租债清了一半，荐书被你收进书箱，等来年再用。", { cash: 3, credit: 2, learning: 1 }), c("向粮商借钱赴试", "以未来人情换眼前机会", "粮商借出五贯，条件是日后替他写一封呈文。", { cash: 4, connections: 3, credit: -1 }, { flags: ["merchant-favor"] })] },
  candidate: { id: "origin-candidate-essay", title: "一篇可能讨主考欢心的文章", location: "赴试客舍", paragraphs: ["同舍士子传来主考近年文集，人人连夜摹仿其中句法。你准备的策论恰好批评他所推崇的一项旧政。", "改文章或许更容易中式；不改，则要承担阅卷者并不公正的可能。"], choices: [c("保留论点，只重写论证", "不迎合，也不故意冒犯", "文章更谨严了，仍没有换掉你的判断。放榜前谁也不知道结果。", { learning: 4, credit: 3, reputation: 1 }, { flags: ["exam-independent"] }), c("改成主考熟悉的立场", "提高被看见的机会", "文章行文顺畅，几处你不相信的话也写得极漂亮。", { learning: 2, connections: 2, credit: -2 }, { flags: ["exam-conformed"] }), c("揭发同舍私传文集", "可能被视为清正或告密", "考棚收走了抄本，同舍众人从此不再与你交谈。", { reputation: 3, connections: -5, risk: 2 }, { flags: ["exam-reported"] })] },
  daoist: { id: "origin-daoist-rain", title: "县令要你三日内祈雨", location: "城外宫观", paragraphs: ["旱情已两月，县令派人请你设醮，并暗示若三日无雨，民怨会落在宫观头上。", "你知道云气确有变化，也知道没有任何科仪能保证何时落雨。"], choices: [c("直言科仪不能许诺降雨", "保住诚实，可能得罪官府", "你仍主持祈禳，却同时劝县里开井减役。官差对你的回答并不满意。", { credit: 5, reputation: 2, connections: -2 }, { flags: ["daoist-no-promise"] }), c("宣称三日必雨", "把声望押在天气上", "第二夜落了短雨，只湿透浮土。百姓说法分成了两派。", { reputation: 4, risk: 5, credit: -1 }, { flags: ["daoist-rain-claim"] }), c("借法会筹粮赈民", "把仪式资源用于现实救济", "香火钱换成了两口粥锅。雨仍未到，饥饿先缓了一日。", { cash: -3, grain: -2, reputation: 5, connections: 3 }, { flags: ["daoist-relief"] })] },
  monk: { id: "origin-monk-deed", title: "施主留下的田契", location: "寺院库房", paragraphs: ["一名亡故施主把六亩田留给寺院，他的女儿却说父亲病重时并不清醒。契上有手印，也有两名僧人作证。", "方丈希望尽快办完过户，以供来年斋粮。"], choices: [c("暂缓过户，请乡老重验", "寺院可能失去田产", "乡老确认手印为真，却也查出施主曾口头许女儿两亩。寺院同意分契。", { credit: 5, reputation: 3, grain: -1 }, { flags: ["temple-split-deed"] }), c("按契收田", "维护成文捐赠", "田归寺院，施主女儿在寺门哭了一日，此后不再参加亡父法会。", { land: 6, grain: 3, credit: -3, risk: 2 }, { flags: ["temple-took-land"] }), c("放弃全部田契", "解决争端，也影响寺产", "女儿收回田地，寺中负责斋粮的人不得不削减冬粥。", { reputation: 5, grain: -5, connections: -1 }, { flags: ["temple-renounced-land"] })] },
  wanderer: { id: "origin-wanderer-name", title: "客栈名簿上有一个熟悉的假名", location: "三岔驿客栈", paragraphs: ["你投宿时看见前一页写着“沈七”，那是旧日同伴躲避官差时惯用的名字。", "店外已经有两名差役询问一名断指旅客。你不知道他犯了什么，也不知道这个名字是否故意留给你。"], choices: [c("不动名簿，暗查后门马厩", "先判断是否有人等你", "马厩草料下压着半枚铜钱，是你们从前约定的求援记号。", { information: 5, risk: 3 }, { flags: ["wanderer-half-coin"] }), c("把假名告诉差役", "换取合法路引", "差役给你盖了临时验记，却要求你随他们辨认一处藏身地。", { connections: 3, credit: -2, risk: 4 }, { flags: ["wanderer-informed"] }), c("连夜离开驿路", "不介入旧事", "你绕行山道，三日后才到下一县。那半页名簿再没有出现在你眼前。", { cash: -3, health: -2, risk: -2 })] },
  escort: { id: "origin-escort-sealed-chest", title: "托镖人不肯说明箱中何物", location: "镖局前厅", paragraphs: ["一名官眷愿付三倍镖银，把一只铅封木箱送往省城，条件是沿途不得开验。", "同一条路上近日正在严查私盐与军器。局主让你决定是否接这趟镖。"], choices: [c("要求当面开验并另封", "可能失去高价生意", "箱中是未入册的外洋钟表，不是军器。托镖人压低了镖银，却同意写入契约。", { information: 4, credit: 4, cash: 3 }, { flags: ["escort-opened-chest"] }), c("按原条件接镖", "相信托镖人的身份担保", "木箱上路，第一处关卡便要求撬封。你必须在契约与官差之间选边。", { cash: 10, risk: 7, connections: 2 }, { flags: ["escort-sealed-chest"] }), c("拒接并通知同行", "维护行规，结怨托镖人", "三家镖局都拒绝了木箱。托镖人改雇一队不在行会名册上的脚夫。", { reputation: 4, connections: -2, information: 2 }, { flags: ["escort-refused-chest"] })] },
  clerk: { id: "origin-clerk-petition", title: "被压下的状纸", location: "县衙签押房", paragraphs: ["寡妇告里长侵田，状纸在签押房压了半月。主簿让你退回补正，里长随后送来两贯润笔钱。", "纸很轻，背后却是三亩救命田。"], choices: [c("照章登记送入正堂", "得罪主簿", "县令开审此案，你则被派去清理最难查的积年烂账。", { reputation: 4, credit: 3, connections: -3, risk: 2 }, { flags: ["widow-case"] }), c("退状并收钱", "融入胥吏旧例", "两贯钱入袋，签押房的人第一次邀你同桌吃酒。", { cash: 5, connections: 4, credit: -6, risk: 2 }), c("私下教她补齐证据", "不留下自己的名字", "状纸换了由头再次递入，你暂时没有站到台前。", { information: 2, credit: 2, connections: 1 })] },
  magistrate: { id: "origin-magistrate-dockets", title: "新任县令面前的三叠案卷", location: "县衙正堂", paragraphs: ["到任第一天，东案是两年未结的命案，西案是春耕水争，中间则是上司限期追完的钱粮。", "三件事都急，却只能先调动同一批衙役和书吏。"], choices: [c("先勘水争，保住春耕", "民生优先，钱粮考成延后", "两村重新分水，秧田没有错过时令；府里催征的文书也到了第二封。", { reputation: 5, credit: 2, connections: -1, risk: 3 }, { flags: ["magistrate-water-first"] }), c("先追钱粮", "满足上级明确考成", "账面在期限内补齐，三户欠户卖掉了耕牛，水争则在夜里演成械斗。", { connections: 4, credit: -2, cash: 4, risk: 5 }, { flags: ["magistrate-tax-first"] }), c("重启命案勘验", "让旧案证据继续流失前先行动", "仵作发现旧验状漏记一处伤痕，原先唯一的嫌犯不再是唯一可能。", { information: 6, reputation: 3, risk: 4 }, { flags: ["magistrate-cold-case"] })] },
  prefect: { id: "origin-prefect-three-counties", title: "三个属县报来三套灾情", location: "州衙签押厅", paragraphs: ["上县称灾情轻，申请免税却最多；中县报灾最重，却仍按额解粮；下县干脆迟迟不报。", "州仓只够赈一个县十日。若报表有假，错误分配会让真正缺粮的人付代价。"], choices: [c("派三组互不统属的人复核", "更慢，也更难串供", "复核发现中县用官仓填了缺口，下县驿路已经断了七日。", { information: 7, cash: -4, risk: 2 }, { flags: ["prefect-cross-audit"] }), c("按文书先赈上县", "程序最完整", "赈粮按时出仓，却有一部分直接进了预先登记的大户佃庄。", { grain: -6, connections: 3, credit: -3 }, { flags: ["prefect-paper-relief"] }), c("先截留解粮救中县", "越过常规财政用途", "中县饥民得到粮食，上司则要求你解释为何擅留正供。", { grain: -5, reputation: 5, connections: -3, risk: 6 }, { flags: ["prefect-diverted-tax"] })] },
  central: { id: "origin-central-memorial", title: "一封被退回三次的奏疏", location: "中枢值房", paragraphs: ["边省请求增兵，兵部说无饷，户部说无确数，内阁则要求把“边患”改成“边情”。", "你手里还有一份来自驿卒的私人记录，与正式数字相差四成。"], choices: [c("附上来源并按实数上奏", "把非正式证据带进程序", "奏疏终于留中。驿卒的名字也从此进入更多人的视线。", { information: 6, credit: 4, risk: 5 }, { flags: ["central-true-memorial"] }), c("按会商意见改写", "让文书先通过", "奏疏顺利批下小额饷银，远不足以覆盖原请。", { connections: 4, reputation: 2, credit: -1 }, { flags: ["central-softened-memorial"] }), c("先找经手各部逐项核数", "以时间换共同责任", "三部数字终于能互相解释，边省又送来一次告急。", { learning: 3, information: 4, risk: 3 }, { flags: ["central-joint-count"] })] },
  gentry: { id: "origin-gentry-granary", title: "族仓缺了十二石粮", location: "宗族义仓", paragraphs: ["清明开仓核账，账上十二石陈粮不见了。管仓的是你叔父的长子，族中老人希望把亏空悄悄补上。", "村外已有十几户人在等春借。"], choices: [c("自家出粮补仓，再查去向", "先保族仓信用", "借粮照常发出。你没有公开羞辱堂兄，却开始亲自核每笔账。", { grain: -8, credit: 5, information: 3 }, { flags: ["clan-audit"] }), c("当众开祠堂问责", "重立规矩", "堂兄被逐出管仓，叔父一房从此与你疏远。", { reputation: 5, connections: -4, credit: 3 }, { flags: ["clan-split"] }), c("把缺粮摊入各房名下", "保全管仓者", "账面重新平了，等粮的穷户却只借到原先一半。", { grain: 3, connections: 2, credit: -5, risk: 2 })] },
  general: { id: "origin-general-rations", title: "前营只剩五日粮", location: "中军帐", paragraphs: ["前营报称存粮只够五日，转运文书却写着尚余十二日。雨季将至，敌军并未停止侦骑。", "催战的军令和催粮的手本在同一刻送到。"], choices: [c("停进兵，先核三处粮台", "可能违逆上命", "第二处粮台被发现以砂土压袋。你失去两日，却保住了全军退路。", { information: 5, reputation: 2, risk: 3 }, { flags: ["grain-fraud"] }), c("按军令速战", "把时间作为武器", "先锋夺下一处渡口，但伤兵和牲畜消耗比预计更快。", { reputation: 5, health: -2, grain: -6, risk: 5 }, { flags: ["forced-march"] }), c("拆分部队就地筹粮", "减轻运输，增加扰民", "军粮续上了，沿途县村的怨气也被记在你名下。", { grain: 7, reputation: -5, connections: 2, risk: 2 })] },
  official: { id: "origin-official-seal", title: "印信之外的命令", location: "州县正堂", paragraphs: ["你到任第三日，前任留下的征解册与仓簿互相对不上。属吏说只要照旧签押，一切自然会平。", "地方大户当晚送来一份没有署名的迎仪。"], choices: [c("封存三库，逐笔交代", "政务停滞且树敌", "半月里公文堆积如山，但三条长期亏空的路径逐渐显形。", { information: 6, credit: 4, connections: -4, risk: 4 }, { flags: ["sealed-treasury"] }), c("先照旧运行，暗中核账", "以时间换证据", "表面一切如常，你让亲随从粮票和脚费查起。", { information: 4, risk: 1 }, { flags: ["quiet-audit"] }), c("接受旧账与迎仪", "快速进入地方秩序", "属吏立刻变得顺从，大户也送来可用的人手。旧账从此也有了你的签名。", { cash: 8, connections: 6, credit: -5, risk: 5 })] },
  royal: { id: "origin-royal-banquet", title: "宗宴上空着的座位", location: "宗正寺别院", paragraphs: ["宗宴按齿序排座，原该坐在你上首的一位近支宗亲突然告病。", "席间有人试探地问，你是否愿意替他向宫中递一封请安折。"], choices: [c("只按礼数问疾，不接折子", "保持边界", "你送去药材，没有替任何人传话。几方都暂时看不清你的立场。", { credit: 3, information: 1 }), c("接下折子但先看内容", "知情也意味着牵连", "折中没有明言政事，却夹着三个不该出现的名字。", { information: 6, risk: 4 }, { flags: ["sealed-names"] }), c("借机向内廷示警", "主动进入宫廷判断", "内廷只回了一句“知道了”。第二天，那张空座被撤出了名册。", { connections: 3, reputation: 2, risk: 7 }, { flags: ["palace-warning"] })] },
  inlaw: { id: "origin-inlaw-appointment", title: "族人求一张越级荐书", location: "后族宅第", paragraphs: ["一名族弟没有经过常调，便想借宫中关系谋得盐课差遣。他说外人都已经把你们当成一党，不用白不用。", "若拒绝，宗族会说你不肯提携；若答应，差遣中的每一笔账都可能回到宫门。"], choices: [c("只准他参加正常铨选", "限制宗族借恩扩张", "族弟愤然离席。几名老成族人私下说，这道边界迟早要有人立。", { credit: 5, connections: -4, reputation: 3 }, { flags: ["inlaw-limited-clan"] }), c("递荐书但回避具体差遣", "让程序替你承担一部分责任", "荐书进入吏部，族弟得到一处闲职，不是他想要的盐课。", { connections: 4, risk: 3, credit: -1 }, { flags: ["inlaw-general-letter"] }), c("直接替他谋盐课", "把外戚权势变成现实利益", "任命很快落定。盐商当天便送来第一份贺礼。", { cash: 15, connections: 7, credit: -6, risk: 8 }, { flags: ["inlaw-salt-office"] })] },
  palace: { id: "origin-palace-lamp", title: "夜半没有熄灭的宫灯", location: "内廷值房", paragraphs: ["宵禁后，偏殿宫灯仍亮。你奉命送茶时听见里面反复提到一名外任官员。", "回值房后，上司随口问你：方才可曾听见什么？"], choices: [c("只复述差事，不添一字", "守住职责边界", "上司盯了你片刻，让你退下。你没有因此得到信任，也没有留下口实。", { credit: 3, risk: -1 }), c("说自己什么都没听见", "过度否认也可能可疑", "上司笑了一下。此后几日，你被调离偏殿。", { information: -2, risk: 2 }), c("提到那名外官的名字", "用信息换位置", "上司没有追问，只让你明日起随侍另一处值房。", { information: 3, connections: 3, credit: -2, risk: 5 }, { flags: ["palace-name"] })] },
  eunuch: { id: "origin-eunuch-two-orders", title: "同一刻送到的两道口谕", location: "内廷门下", paragraphs: ["司礼监要你立刻取一份边军奏报，贵妃宫中却命你先送医官。两边都称是上意，且都没有成文手令。", "宫门开合有时，一旦先走一边，另一边便会知道自己被排在后面。"], choices: [c("先救急症，再亲送奏报", "以人命为先，承担奏报延误", "医官赶到时病人尚能说话。边报晚了半个时辰，司礼监记下了时刻。", { credit: 4, connections: 1, risk: 4 }, { flags: ["eunuch-doctor-first"] }), c("先取边报", "把军国程序置于宫眷急召之前", "奏报按时入内，贵妃宫中的管事从此不再给你方便。", { information: 5, connections: -3, risk: 3 }, { flags: ["eunuch-memorial-first"] }), c("要求两边补手令", "拒绝替口谕冲突背责", "两处都没有补文书，最终各自派了别人。你避开了这一局，也失去一次进入核心的机会。", { credit: 3, connections: -2, risk: -2 }, { flags: ["eunuch-demanded-order"] })] },
  emperor: { id: "origin-emperor-three-seals", title: "御案上的三份互相矛盾的数字", location: "宫城便殿", paragraphs: ["户部说国库可支九个月，兵部说边军欠饷四月，地方督抚却称仓储充足。三份奏疏都盖着合法印信。", "你可以下旨，却不能凭一道旨意知道哪一份数字更接近现实。"], choices: [c("命三方互派官员交叉盘库", "牺牲速度，制造可核对的共同责任", "盘库尚未结束，已查出军饷和漕粮使用了不同口径。没人能再用一句“数目无误”结束讨论。", { information: 8, connections: -2, risk: 3 }, { flags: ["emperor-cross-audit"] }), c("先拨内帑补边饷", "用皇室资源争取时间", "两个月欠饷暂时补上，边军没有立刻哗变；内廷营造和赏赐必须同时缩减。", { cash: -18, reputation: 5, credit: 3 }, { flags: ["emperor-used-privy-purse"] }), c("责令户部限期筹足", "把压力沿官僚体系向下传递", "户部在期限内报足数字，新增的加派和借款已经开始落到州县。", { cash: 10, connections: 3, credit: -4, risk: 6 }, { flags: ["emperor-forced-revenue"] })] },
  custom: { id: "origin-custom-first", title: "身份第一次受到查验", location: "你所在的街巷", paragraphs: ["一纸新到公文要求查验来历、户籍与差遣。你的自定身份第一次需要面对当时制度的实际承认。", "口头自称、邻里作保和官府文书，代表三种完全不同的安全程度。"], choices: [c("补齐文书与保结", "花费时间和钱", "你得到一份能在本地使用的身份凭据。", { cash: -3, credit: 4, connections: 1 }), c("请熟人出面作保", "欠下一份人情", "熟人签下名字，你的身份暂时被认可。", { connections: 3, credit: 1 }, { flags: ["guarantor-debt"] }), c("避开查验继续生活", "短期省事，长期风险", "这次点查没有找到你，名字却被留在下一轮名单上。", { risk: 5, information: 1 })] },
};

const commonEvents: GameEvent[] = [
  { id: "market-grain-boats", title: "三艘粮船没有按期靠岸", location: "城南米市", paragraphs: ["米行没有立刻涨价，只把每日售量减半。等粮的人因此更慌。", "有人说是风阻，有人说是大户在上游截买；两种消息都没有证据。"], rumor: "码头脚夫说，昨夜仍有空船逆流而上。", choices: [c("只买足家用七日", "不参与抢购", "你多付了一点钱，家里暂时不必排队。", { cash: -3, grain: 4, credit: 1 }), c("去上游查船期", "先买信息", "你确认一处浅滩堵住航道，最迟五日可以恢复。", { cash: -1, information: 4 }), c("借钱大量收粮", "高风险投机", "官府次日开仓平粜，你只能低价转手一半。", { cash: -6, credit: -2, risk: 2 })] },
  { id: "corvee-cart", title: "急差要四十辆车", location: "里门公所", paragraphs: ["县里五日内要凑四十辆车和八十名民夫，里长把重份额先压给外来户。", "众人推你出面，不是因为你最有权，而是因为你认得公文里的限额。"], choices: [c("以旧册要求重新均摊", "公开对抗里长", "旧例确实规定按田亩分摊，外来户的份额被削去一半。", { reputation: 4, credit: 2, connections: -2 }), c("替最穷两户承担车脚", "用资源换人情", "两家没有卖掉耕牛，这份恩情留在了乡里。", { cash: -5, connections: 4, reputation: 2 }), c("送礼减去自家名字", "只保全自己", "差役簿上没有你，邻里也记住了没有你。", { cash: -3, reputation: -3, risk: -1 })] },
  { id: "summer-fever", title: "药铺门口排起长队", location: "坊市药铺", paragraphs: ["邻巷接连有人高热，常用药材一日三价。家中也有人夜里发冷。", "城里医者说法不一，但都劝先隔开病人与饮水。"], choices: [c("请医并分屋照料", "花费家资", "药未必立刻见效，隔离和清洁却阻止了家中更多人倒下。", { cash: -7, health: -2, credit: 2 }), c("照旧方自行辨药", "需要一定学识", "你没有追求偏方，只用能确认的药材退热补水。", { learning: 2, health: -4 }, { requires: { learning: 5 }, failResult: "你错认一味药，病势反复，多花了两倍诊金。", failEffects: { cash: -6, health: -10, risk: 2 } }), c("封门等病势过去", "省钱但承受风险", "病最终退了，照料不足留下长久虚弱。", { health: -9, cash: -1, risk: 2 })] },
  { id: "guild-widow-shop", title: "寡妇想继续经营丈夫的铺子", location: "同行会馆", paragraphs: ["一名工匠病故，妻子熟悉账目和客源，却没有行会名籍。同行主张收回铺位。", "她愿按旧例缴纳会费，只求不让两个孩子失去生计。"], choices: [c("主张给她一年试营", "改变小范围旧例", "会首同意以一年账目定去留，反对者要求你担保。", { credit: 3, reputation: 3, risk: 1 }, { flags: ["widow-shop"] }), c("遵守旧例收回铺位", "维持行会秩序", "铺位很快给了另一名学徒，两个孩子离开了这条街。", { connections: 2, credit: -2 }), c("私下帮她转为家庭作坊", "避开名籍限制", "她不再挂招牌，老客仍能找到后门。", { information: 2, connections: 3, risk: 1 })] },
  { id: "flood-crack", title: "河堤裂开一道掌宽的缝", location: "下游河堤", paragraphs: ["连雨七日，堤脚渗出浑水。县里的修堤银尚未拨到。", "若等官差齐集，低处三村可能先见水。"], choices: [c("出资雇工连夜加固", "需要足够现钱", "土石在黎明前压住险口，退水后账目也摆在众人面前。", { cash: -12, reputation: 7, credit: 3 }, { requires: { cash: 12 }, failResult: "钱不够付足夜工，险口在半夜扩大。", failEffects: { cash: -5, reputation: -2, risk: 5 } }), c("召集乡民轮班抢险", "需要已有乡望", "留下的人比你预想的多，三村在雨停前守住堤线。", { reputation: 6, connections: 5, health: -5 }, { requires: { reputation: 5 }, failResult: "众人互相观望，你只能先带家人撤离。", failEffects: { cash: -7, grain: -4, risk: 4 } }), c("先带家人撤往高地", "保人而舍财", "水进了半间屋，但家中无人伤亡。", { cash: -6, grain: -3, credit: 1 })] },
  { id: "temple-relief", title: "寺院开了一口粥锅", location: "城西寺门", paragraphs: ["旱情后流民增多，寺院每日只够施三百碗粥。排队的人已有五百。", "僧人请乡里大户出粮，也有人怀疑寺院借灾情扩张田产。"], choices: [c("捐粮并要求公开簿册", "救济与监督并行", "粮入粥锅，收支贴在寺门外，几笔不明田租也被问了出来。", { grain: -5, reputation: 4, information: 2, credit: 2 }), c("只帮维持队伍秩序", "投入时间而非钱粮", "老人和孩童先领到粥，争抢没有扩大成踩踏。", { health: -2, reputation: 3, connections: 2 }), c("调查寺田来源", "暂不直接救济", "你查到其中两处田是灾年低价兼并，证据却不足以立刻归还。", { information: 5, risk: 2 })] },
  { id: "coin-shortage", title: "市面忽然不肯收旧钱", location: "布市与钱铺", paragraphs: ["钱铺只肯折价收旧铜钱，商户开始要求银、绢或新钱。小额买卖最先停滞。", "官府告示称钱法未变，告示旁却有人连夜收走好钱。"], choices: [c("把旧钱换成粮布", "承受眼前折价", "你损失一成，却换回家中真正需要的物资。", { cash: -4, grain: 4, risk: -1 }), c("追查好钱流向", "信息可能比兑换更值钱", "几家大铺正把足色钱运往另一州，那里银钱比价更高。", { information: 5, connections: 1 }), c("继续按官价收旧钱", "维护信用也承担风险", "小贩愿意与你交易，你的现钱价值却继续缩水。", { cash: -3, reputation: 4, credit: 3 })] },
  { id: "marriage-contract", title: "婚书里写着一笔附加田", location: "族亲家宴", paragraphs: ["媒人带来的婚书条件优厚，对方却要求婚后把一笔陪嫁田交由其长房代管。", "家中长辈看中门第，提醒你婚姻从来不只属于两个人。"], minAge: 17, choices: [c("要求田产仍归本人名下", "可能谈崩婚事", "对方沉默数日后同意改契，婚事少了热闹，多了清楚。", { credit: 4, connections: -1 }, { flags: ["married-clear-contract"] }), c("接受长房代管", "换取门第与关系", "婚礼如期举行，你也进入一个规则早已写好的家族。", { connections: 6, cash: 4, risk: 3 }, { flags: ["married-clan-control"] }), c("退回婚书", "保持自主", "两家面上无争，媒人却暂时不再登门。", { credit: 2, reputation: -1 }, { flags: ["declined-marriage"] })] },
  { id: "refugee-field", title: "荒地旁搭起二十顶草棚", location: "城外荒坡", paragraphs: ["北来的流民在荒地搭棚，愿替人做工换粮。本地佃户担心工价被压低。", "县里既未驱赶，也没有给他们编户。"], choices: [c("雇流民疏沟并按本地工价付钱", "避免压价", "沟渠修通，本地雇工起初不满，看到同价后才愿一同开工。", { cash: -5, land: 2, reputation: 3, connections: 2 }), c("联合本地人要求驱离", "保护眼前工价", "流民被赶往下一县，夜里有两间空仓失火。", { reputation: 1, risk: 4, information: -1 }), c("为几户寻找保结", "让人进入制度", "五户得到暂住文书，其余人仍在等待。", { credit: 4, connections: 4, risk: 1 }, { flags: ["refugee-guarantees"] })] },
  { id: "academy-faction", title: "书院请你在一篇公论上署名", location: "城东书院", paragraphs: ["文章批评近期一项政令，论据并非全错，末尾却暗指一名你不认识的官员。", "署名者中既有真正忧时者，也有借题攻击政敌的人。"], choices: [c("只就事实另写一篇", "不加入现成阵营", "你的文章传播更慢，却没有替陌生人的私怨背书。", { learning: 3, credit: 3, reputation: 1 }), c("在公论上署名", "进入士林共同声势", "名字很快传到州府，赞誉与名单一起被记录。", { reputation: 5, connections: 4, risk: 4 }, { flags: ["signed-public-letter"] }), c("查清被指官员再决定", "延迟表态", "你发现争论背后还有一桩书院田产纠纷。", { information: 5, reputation: -1 })] },
  { id: "salt-pass", title: "盐引上的印泥颜色不对", location: "河口税关", paragraphs: ["一队盐船文书齐全，只有官印颜色比本月公文略浅。押船人说是途中受潮。", "关吏暗示放行，船主愿补一笔查验辛苦钱。"], choices: [c("扣一船复验，不扣整队", "控制损失并查事实", "复验发现其中一张盐引套用了旧号，其他船只按时放行。", { information: 4, credit: 3, connections: -2, risk: 2 }), c("全部扣押", "最严格的官面选择", "盐价因船队滞留上涨，真正的主使者却没有出现在船上。", { reputation: 2, information: 2, risk: 4 }), c("收钱放行", "短期获利", "盐船连夜过关。一个月后，另一处税关查到了重复引号。", { cash: 7, credit: -5, risk: 6 }, { flags: ["salt-bribe"] })] },
  { id: "canal-silt", title: "漕渠水位比旧刻低了两寸", location: "漕渠石闸", paragraphs: ["船户抱怨载量减半，闸官坚持只是季节水浅。老水手指给你看石壁旧刻，泥沙已经盖住最下一道。", "疏浚需要停航，继续通行则可能在更忙时彻底堵塞。"], choices: [c("建议分段停航疏浚", "损失短期运量", "先停一段、放一段，半月后主槽恢复。几批急货仍误了期限。", { cash: -3, reputation: 3, credit: 2 }), c("维持通航到秋后", "把问题留给将来", "眼下船队继续走，第一次秋汛却让浅滩更厚。", { cash: 3, risk: 4 }, { flags: ["canal-delayed"] }), c("组织小船转运", "增加成本但不断供", "货物在浅段换船，沿岸多出一批临时生计。", { cash: 2, connections: 3, information: 1 })] },
  { id: "funeral-boundary", title: "下葬时发现地界碑被挪过", location: "族坟山脚", paragraphs: ["棺木已经抬到山脚，原定墓地却被邻族新立的界碑占去一角。", "若今日争斗，丧事会变成械斗；若退让，这块地以后便难再说清。"], choices: [c("停葬，请两族老人查旧契", "承受礼俗压力", "棺木暂厝一夜，旧契与树龄证明界碑确实被挪。", { information: 3, credit: 3, reputation: 1 }), c("先下葬，日后再诉", "不误丧期", "丧事完成，诉讼却因“既成事实”变得更难。", { credit: 1, risk: 2, land: -1 }), c("当场拔碑", "直接捍卫地界", "两边年轻人推搡受伤，县里第二天便传你到案。", { reputation: 2, risk: 6, health: -2 })] },
  { id: "midwife-record", title: "新生儿没有被写进户册", location: "邻里产房", paragraphs: ["邻家孩子出生三日，父亲却在外服役，里正不肯立刻入册。", "没有户籍，日后的田份、差役和婚姻都可能留下麻烦。"], choices: [c("替他们寻找同甲作保", "用邻里信用补足手续", "两户同甲签名，孩子终于有了正式名字。", { credit: 3, connections: 3, reputation: 2 }), c("建议等父亲回来再办", "程序最稳但留下空档", "文书没有冒险，孩子却在半年里不属于任何册页。", { risk: 1, credit: 1 }), c("给里正送礼当天入册", "有效但延续旧规矩", "名字写进去了，里正也记住这家人愿意花钱。", { cash: -2, credit: -1, connections: 1 })] },
  { id: "deserter-door", title: "逃兵在雨夜敲门", location: "村尾旧屋", paragraphs: ["他自称被克扣军粮，逃前没有伤人。追兵最迟明晨进村。", "收留逃兵会牵连全家，交人也未必能知道他说的是真是假。"], choices: [c("给一顿饭后劝其投案", "不藏人，也不立刻告密", "他天亮前自行去了巡检司，把粮册位置告诉了你。", { grain: -1, information: 4, credit: 2 }, { flags: ["deserter-ledger"] }), c("连夜报官", "避免窝藏责任", "人被带走，军官奖励你两贯钱。村里有人从此不再与你谈军中事。", { cash: 2, information: -2, reputation: -1 }), c("藏进柴房", "高风险保护", "追兵搜过前院没有发现。他留下一个军中联络人的名字后离开。", { information: 5, risk: 7, credit: 1 }, { flags: ["sheltered-deserter"] })] },
];

const historicalEvents: Record<string, GameEvent> = {
  qin_end: { id: "anchor-qin-dazexiang", title: "戍卒从东面折返", location: "通往郡城的驰道", paragraphs: ["一队本该继续北上的戍卒突然折返，衣甲不整，也不再出示传符。亭长命沿路各户闭门，并准备按连坐法追查。", "你不知道他们是否已经起事，只知道今晚借宿、报官或沉默都会被后来的人解释。"], choices: [c("只给水粮，不许留宿", "在人情与连坐之间划界", "戍卒取走水粮继续西行。亭长次日逐户询问，你如实说了经过。", { grain: -3, credit: 2, risk: 3 }, { flags: ["qin-fed-soldiers"] }), c("立刻向亭长报信", "站在现存法令一边", "追兵沿驰道追去，你得到免除一旬徭役的凭记。", { cash: 2, connections: 2, reputation: -1, risk: 2 }, { flags: ["qin-reported-soldiers"] }), c("让其中伤者藏进柴房", "承担连坐风险", "伤者留下一个乡名和一枚旧符，天亮前独自离开。", { information: 5, health: -1, risk: 8 }, { flags: ["qin-sheltered-soldier"] })] },
  western_han: { id: "anchor-han-salt-iron", title: "郡里重新核定盐铁户", location: "郡市官署", paragraphs: ["官吏要求铁器作坊、盐井脚户和转卖商贩重新入册，称是为了平抑价格与补充边费。", "小作坊担心被并入大炉，农户则抱怨官铁农具价高而难修。"], choices: [c("联名呈报农具实际损耗", "把地方使用情况写进官文", "呈文没有取消官营，却促成郡里设置一处修具点。", { learning: 2, reputation: 3, credit: 3 }, { flags: ["han-tool-petition"] }), c("申请成为官营转运户", "进入制度性生意", "你取得一段运输差遣，利润受限，路引却更可靠。", { cash: 6, connections: 4, risk: 2 }, { flags: ["han-state-carrier"] }), c("继续私下交易旧铁器", "维持乡里需要，触犯法令边界", "旧农具仍在流通，市吏也开始记录谁常往返村市。", { cash: 4, credit: -2, risk: 5 }, { flags: ["han-private-iron"] })] },
  qinhan: { id: "anchor-yellow-turbans", title: "州郡开始搜捕太平道众", location: "县城与乡里", paragraphs: ["榜文要求各里互相举告，许多真正求医的人也被列作嫌疑。", "你无法知道起事规模，只能看见邻里的关系开始改变。"], choices: [c("只报告确有兵器者", "区分信众与武装", "你提供的消息很少，却避免几户病家被一并拿走。", { credit: 3, information: 2, risk: 2 }), c("跟随官差逐户搜查", "进入官府临时力量", "你得到差遣和粮钱，也亲眼看见搜捕如何扩大。", { cash: 3, connections: 3, reputation: -2, risk: 3 }), c("提前带家人离开交通要道", "不介入即将到来的冲突", "你们搬到山边亲族处，田和屋暂时无人照看。", { cash: -4, grain: -2, risk: -3 })] },
  three: { id: "anchor-red-cliff-supply", title: "军粮征发沿江而下", location: "江北驿路", paragraphs: ["征粮文书盖着不同军府的印，谁最终控制这里尚未可知。", "船、草料和熟悉水道的人同时变得昂贵。"], choices: [c("只交法定份额并索取收据", "保留未来追索凭据", "粮被征走，收据也许有用，也许会随政权一起失效。", { grain: -4, credit: 2, information: 1 }), c("组织船工为军府运粮", "靠近战争后勤", "你没有上阵，却看懂一支军队如何被水路维持。", { cash: 5, information: 4, risk: 4 }), c("藏粮避征", "保住家用，承担搜查风险", "一半粮藏进夹墙。下一轮搜查比你预想得更细。", { grain: 3, credit: -3, risk: 5 })] },
  western_jin: { id: "anchor-jin-orders", title: "两位宗王各自征用同一批车马", location: "洛阳近郊驿路", paragraphs: ["上午到的牒文要车马运粮入城，下午另一道手令却要同一批车马载兵出城。两份文书印信都真，期限也都是明日。", "里正不敢判断哪位宗王会赢，只想把签名推给别人。"], choices: [c("按先到官文执行", "遵守可证明的程序先后", "粮车入城，下午那道手令的经办人记下了拒绝者名单。", { credit: 3, connections: -2, risk: 4 }, { flags: ["jin-first-order"] }), c("各分一半车马", "降低单边风险，也使两边都不足", "两队都晚了时辰，里中没有把全部财力押给一方。", { cash: -3, grain: -2, risk: 2 }, { flags: ["jin-split-carts"] }), c("称车马染疫不能出役", "以假情报避开争斗", "两道征文都暂时撤回，医官却在第三日来到村口核验。", { information: 2, credit: -4, risk: 7 }, { flags: ["jin-false-plague"] })] },
  eastern_jin: { id: "anchor-feishui-boats", title: "北府军征集浅水船", location: "淮水支流", paragraphs: ["军府要征集能在浅水行驶的小船，用于运粮和接应。船户担心船去不回，北来的流民则劝大家尽快站队。", "江面还看不见敌军，征船的命令已经先改变了所有人的生计。"], choices: [c("共同登记船价与船况", "为战后追偿留下证据", "二十三条船逐一量定，军府吏员无法再把旧船按新船报账。", { credit: 4, reputation: 3, information: 2 }, { flags: ["jin-boat-register"] }), c("带船入军负责转运", "直接进入战时后勤", "你学会在军令、风向和敌情不明之间安排航次。", { cash: 6, information: 5, risk: 5 }, { flags: ["jin-military-boat"] }), c("把船拆去桅杆藏进芦荡", "保住家庭资产，逃避征发", "船没有被征走，邻船户却知道你藏船的位置。", { cash: 2, credit: -3, risk: 5 }, { flags: ["jin-hidden-boat"] })] },
  northsouth: { id: "anchor-taicheng", title: "建康的城门忽然紧闭", location: "秦淮河岸", paragraphs: ["粮价先涨，接着是渡船停航。没有人能确定台城能守多久。", "城内门阀宅院开始招募守门人，城外百姓则寻找离开的船。"], choices: [c("替邻里筹备公用水粮", "先守住所在街坊", "你们封好井口、共用粮册，最初十日没有乱。", { grain: -3, reputation: 5, connections: 4 }), c("接受高门守宅差遣", "得到庇护也受其约束", "宅门后的粮足够，但你不能带所有亲族进去。", { cash: 4, connections: 4, credit: -1, risk: 2 }), c("趁夜乘小船离城", "放弃城内资产", "你们渡到南岸，身后火光把河面照亮。", { cash: -7, risk: -2, health: -3 })] },
  sui_end: { id: "anchor-sui-campaign", title: "转运队又来征集挽夫", location: "河北县道", paragraphs: ["去岁东征尚未归还的车牛仍在册上，今年的新征文又要求每里增派挽夫。", "有人准备逃入山泽，有人相信这次服完役便能免除下一轮。"], choices: [c("核对旧役未归者再定新名册", "阻止同一户重复承担", "六户旧役之家被暂缓征发，县吏要求里中另补人数。", { information: 3, reputation: 4, risk: 3 }, { flags: ["sui-checked-corvee"] }), c("替家中雇一名代役者", "把风险转给更穷的人", "你的名字从征册划去，代役者的家人先收到一半工钱。", { cash: -6, credit: -3, risk: -1 }, { flags: ["sui-hired-substitute"] }), c("携家逃往郡界外", "放弃现有户籍保护", "你们避开点发，却从此要靠陌生人的保结和零工生活。", { land: -2, grain: -3, risk: 6 }, { flags: ["sui-fled-register"] })] },
  high_tang: { id: "anchor-tang-household", title: "括户使查到一片未入册的庄田", location: "京畿庄园", paragraphs: ["庄田里有逃户、客户和投靠多年的佃人。括户使要求三日内报清口数与田亩，庄主则说这些人一旦入籍便会全部逃散。", "盛世的账册越完整，谁承担租庸调也就越具体。"], choices: [c("逐户说明入籍后的实际差役", "让人知情后自行决定", "一半客户愿意登记，另一半当夜离开庄园。", { credit: 4, information: 3, connections: -1 }, { flags: ["tang-open-registration"] }), c("替庄主隐去部分客户", "维持庄园劳力结构", "名单少了三成，括户使却从邻村取得另一份口供。", { cash: 5, connections: 4, credit: -4, risk: 6 }, { flags: ["tang-hidden-households"] }), c("如实全报并请求分期应役", "以完整数据换执行缓冲", "户籍补齐，州县准许把第一年差役分作两批。", { reputation: 3, credit: 5, risk: 2 }, { flags: ["tang-phased-corvee"] })] },
  suitang: { id: "anchor-anyang-riders", title: "范阳军令切断了部分驿路", location: "北方驿道", paragraphs: ["商旅最先得到消息，官府告示反而晚了两日。", "你只知道道路不通，并不知道这场兵变将把多少人卷入。"], choices: [c("囤积家用而不转卖", "为乱局做准备", "你把粮食分藏在三处，家里暂时安稳。", { cash: -5, grain: 7, risk: -1 }), c("替南下商队带路", "用地理信息换报酬", "你避开军道，带十几辆车绕过两处关卡。", { cash: 7, information: 4, risk: 3 }), c("投往附近军镇", "寻求武力庇护", "你被编入守城杂役，得到口粮，也失去自由行程。", { grain: 4, connections: 3, risk: 5 }, { flags: ["garrison-bound"] })] },
  five: { id: "anchor-regime-change", title: "城头旗号一夜之间换了", location: "州城", paragraphs: ["新军没有立即入户，先接管仓库、城门和文书库。", "旧官要求百姓守旧誓，新军则登记愿意继续当差的人。"], choices: [c("保护户籍与仓册不被焚毁", "保住城市连续性", "册页得以保存，新政权接管时少了一轮混乱。", { reputation: 4, information: 3, risk: 3 }), c("向新军登记效力", "尽快适应新秩序", "你保住差遣，旧同僚却开始避开你。", { cash: 3, connections: 3, credit: -2 }), c("闭门等待局势明确", "不抢先站队", "三日后秩序恢复，几处关键位置已经重新分配。", { risk: -1, information: -1 })] },
  north_song: { id: "anchor-song-green-sprouts", title: "青苗钱下到乡里", location: "县仓与乡书手案前", paragraphs: ["官府按户等发放青苗钱，文书说利息低于豪强旧贷。几户农家却不想借，书手担心完不成发放额。", "一项在朝堂上争论的政策，到了这里变成谁签名、谁作保、秋后拿什么偿还。"], choices: [c("只给自愿且核过田亩者", "牺牲发放数字，控制坏账", "借款户数少了，秋后能按约归还的人却更多。", { credit: 5, reputation: 3, connections: -2 }, { flags: ["song-voluntary-loans"] }), c("按户等强制摊派", "完成上级考核", "账面发放足额，一些不缺钱的人转手把钱贷给更穷的邻户。", { connections: 4, cash: 3, credit: -4, risk: 4 }, { flags: ["song-forced-loans"] }), c("让乡户共同议定保人", "把执行交给本地关系", "多数借款找到保人，也有两户因与族里不睦被排除在外。", { connections: 5, information: 2, reputation: 1 }, { flags: ["song-community-guarantee"] })] },
  song: { id: "anchor-jingkang-flight", title: "北来的车队挤满官道", location: "南下渡口", paragraphs: ["官员、军户、商贾与平民都在争渡，携带的文书比财物更能证明他们是谁。", "渡船有限，谣言说下一处城门也将关闭。"], choices: [c("护送家人与邻里同渡", "速度更慢但不丢下人", "你们分成三船过河，少了两箱物件，没有少人。", { cash: -6, connections: 5, credit: 3 }), c("替有钱人保管文书换船位", "信息与信用交易", "你得到四个船位，也知道几户大族正迁往何处。", { cash: 4, information: 4, credit: 1 }), c("留在本地观望", "避免路途风险", "渡口渐空，城中粮价却开始每日变化。", { grain: -2, risk: 4 })] },
  yuan: { id: "anchor-river-labor", title: "河工营停止发粮", location: "黄河工段", paragraphs: ["数万役夫已经两日没有领到足额口粮，监工仍要求按期合龙。", "营外出现红巾与符号，没人公开说那意味着什么。"], choices: [c("核对粮车去向", "寻找断粮原因", "你发现一批粮被转卖到附近军营，证据落在三套互相矛盾的签押上。", { information: 6, risk: 4 }), c("组织同乡共炊", "先避免营中失控", "零散口粮被集中分配，最弱的人多撑了几天。", { grain: -3, reputation: 5, connections: 4 }), c("离开河工营", "成为逃役者", "你趁夜沿支流离开，从此不能再安全使用原来的文书。", { health: -4, risk: 7 }, { flags: ["escaped-labor"] })] },
  ming: { id: "anchor-zhang-death", title: "首辅病逝的消息传到州县", location: "驿站与县衙", paragraphs: ["昨日还被要求加紧执行的清丈条目，今日忽然无人愿意先签名。", "改革没有立刻停止，执行者却开始重新判断风向。"], choices: [c("继续按现行条文办事", "把制度置于风向之前", "你完成本季册籍，新的上司尚未表态。", { credit: 4, connections: -2, risk: 3 }), c("暂缓争议案件", "等待权力重排", "短期冲突少了，积压的田亩争议却越堆越高。", { risk: -1, reputation: -2 }), c("整理执行中的弊端上报", "既不全盘否定也不掩饰", "报告进入省城档案，没有立刻带来奖惩。", { learning: 2, information: 3, credit: 2 })] },
  qing: { id: "anchor-white-lotus", title: "团练开始查验过路人的籍贯", location: "川楚驿路", paragraphs: ["教乱的消息真假混杂，团练先封山口，再逐一查验。", "商路停滞、逃难者和真正的教众被挤在同一条路上。"], choices: [c("协助区分商旅与武装人员", "用本地知识减少误抓", "几队正常商旅获准通行，你也见到团练名册里的私怨。", { information: 4, reputation: 3, risk: 2 }), c("加入团练守卡", "得到武装身份", "你领到器械和口粮，也必须服从地方绅首。", { grain: 3, connections: 4, risk: 5 }, { flags: ["local-militia"] }), c("绕开关卡暂停远行", "保全自身", "你返回原处，货物与消息都慢了一个月。", { cash: -3, risk: -2 })] },
  custom: { id: "anchor-custom-change", title: "一项远方变化抵达本地", location: "你所在的地域", paragraphs: ["它可能是政令、战争、灾害或贸易变化；真正落到你身上时，已经经过多层传递。", "你只能依据现有身份、信息和资源理解它。"], choices: [c("先查证不同来源", "延迟行动", "几个说法互相矛盾，你至少排除了最夸张的一种。", { information: 4 }), c("按最坏情况准备", "支付预防成本", "没有立刻发生灾难，准备本身仍保住了一些余地。", { cash: -4, grain: 4, risk: -2 }), c("维持日常", "接受信息有限", "你没有因传言改变生活，世界仍在远处推进。", { risk: 1 })] },
};

const quietScenes = [
  ["早春雨水比常年多", "沟渠里的水漫过旧石标，农人重新商量播种日期。没有官文，也没有大人物出现。"],
  ["集市换了卖油的人", "旧摊主回乡照料父亲，新来的摊主少给半勺，却肯赊账给熟客。"],
  ["邻县粮价微涨", "涨幅不足以引发抢购，却让几户准备婚事的人缩减了宴席。"],
  ["族里修了一段屋檐", "没有争产，也没有密谋。几名年轻人花了两日把漏雨处重新铺好。"],
  ["一封家书晚到半月", "驿路绕行使信纸沾了水，内容只是报平安，并问今年收成。"],
  ["夏夜有人在桥头乘凉", "人们谈的多是蚊虫、井水和谁家的孩子学会了写名字。"],
  ["城门提前半个时辰关闭", "守门卒解释是轮值变化。商贩抱怨几句，第二日又照常进城。"],
  ["秋收比估算少了一成", "不是灾年，只是灌浆时少了两场雨。家家重新计算冬天的用粮。"],
  ["私塾换了一本蒙书", "先生没有解释朝廷大事，只要求孩子们把昨日写错的字重抄十遍。"],
  ["第一场霜来得很早", "菜圃受了些损失，柴价在三天里稍微上涨。"],
  ["一队远客借宿后离开", "他们没有留下奇遇，只在灶边讲了几句远方口音的笑话。"],
  ["本月无足以改变一生的大事", "日子由做饭、劳作、探病、记账和等待组成。世界没有停，只是没有向你高声宣告。"],
  ["井绳断在清晨", "邻里借来长钩，把木桶重新捞起。半日劳作没有进入县志，却决定了这条巷子今天能否取水。"],
  ["一户人家重修灶台", "泥瓦匠收了半日工钱，孩子们围着新砌的烟道看了很久。晚饭时屋里第一次没有满是烟。"],
  ["渡口因雾迟开", "等船的人互相交换了几条消息，多半只是亲戚、货价和道路。雾散后没有奇遇，所有人各自赶路。"],
  ["旧衣被重新拆洗", "家中把不能再穿的夹袄拆成布片，好的留作鞋面，薄的填进被角。这是冬日前真实而细小的准备。"],
  ["社学先生病了三日", "孩子们暂时回家帮工，有人因此学会割草，也有人把刚认得的字忘了一半。"],
  ["官道旁补种了十几棵柳", "负责这段路的役夫挖坑、挑水、立桩。来年能活多少尚不可知，今天的车马因此绕慢了些。"],
  ["磨坊轮轴需要更换", "几户人家把粮袋暂存在廊下，商量谁去邻村请木匠。没有争执，只有每家都在计算多等一天的损耗。"],
  ["邻家老人办了一桌寿饭", "没有请戏班，也没有贵客。亲族带来鸡蛋、面和一小坛酒，席间说的都是已经说过许多次的旧事。"],
  ["一场短雨救下菜畦", "雨量不足以改变河道，却使城郊菜价没有继续上涨。卖菜人第二日把最蔫的叶子重新挑掉。"],
  ["更夫换了梆子", "新的梆声比旧的清亮，头两夜总有人被惊醒。第三夜之后，街坊又把它当成了时辰本身。"],
  ["家中清点了冬柴", "柴垛比估算少两捆。你们没有立刻遇到灾难，只是决定往后每次烧水都把余炭留下。"],
  ["远亲托人带来两双鞋", "针脚并不细，尺寸却合适。回信只写了平安、收成和来年若有余钱再去探望。"],
] as const;

export function buildInitialStats(identity: Identity, declaredWealth: number): Stats {
  const next = { ...baseStats };
  for (const [key, value] of Object.entries(identity.stats) as Array<[StatKey, number]>) next[key] += value;
  if (Number.isFinite(declaredWealth) && declaredWealth >= 0) next.cash = Math.round(declaredWealth);
  return next;
}

export function makePeople(character: Character): KnownPerson[] {
  const familyName = character.family.includes("无") ? "同乡长者" : "家中长辈";
  return [
    { id: "family-elder", name: familyName, publicIdentity: "与你共同生活的人", knownAttitude: "关心家计与安全", memory: [], hiddenGoal: "保全家人", hiddenFear: "家道突然断绝", hiddenFaction: "无" },
    { id: "local-clerk", name: "本地书吏", publicIdentity: "负责户籍与文书的基层人员", knownAttitude: "尚未与你深交", memory: [], hiddenGoal: "保住差遣并积攒钱财", hiddenFear: "旧账被翻出", hiddenFaction: "县衙胥吏" },
  ];
}

const meets = (stats: Stats, need?: Partial<Stats>) => !need || (Object.entries(need) as Array<[StatKey, number]>).every(([key, value]) => stats[key] >= value);
export function resolveChoice(stats: Stats, choice: Choice): { result: string; effects: Partial<Stats>; passed: boolean } {
  const passed = meets(stats, choice.requires);
  return { result: passed ? choice.result : (choice.failResult ?? choice.result), effects: passed ? (choice.effects ?? {}) : (choice.failEffects ?? choice.effects ?? {}), passed };
}

const eligible = (event: GameEvent, game: GameState) => {
  const identity = game.character.identityId;
  if (event.identities && !event.identities.includes(identity)) return false;
  if (event.modes && !event.modes.includes(game.character.modeId)) return false;
  if (event.minAge && game.age < event.minAge) return false;
  if (event.maxAge && game.age > event.maxAge) return false;
  if (event.requiresFlags && !event.requiresFlags.every((flag) => game.flags.includes(flag))) return false;
  if (event.excludesFlags && event.excludesFlags.some((flag) => game.flags.includes(flag))) return false;
  return !game.resolvedEventIds.includes(event.id);
};

function stableIndex(game: GameState, length: number) {
  const seed = [...game.character.name].reduce((sum, char) => sum + char.charCodeAt(0), 0) + game.turn * 17 + game.year * 3 + game.month;
  return Math.abs(seed) % Math.max(1, length);
}

export function getEvent(game: GameState): GameEvent {
  if (game.turn === 0) return originEvents[game.character.identityId] ?? originEvents.custom;
  const eraAnchor = historicalEvents[game.character.eraId] ?? historicalEvents.custom;
  if (game.turn >= 2 && !game.resolvedEventIds.includes(eraAnchor.id)) return eraAnchor;
  const available = commonEvents.filter((event) => eligible(event, game));
  if (available.length) return available[stableIndex(game, available.length)];
  const unusedQuiet = quietScenes
    .map((scene, index) => ({ scene, index }))
    .filter(({ index }) => !game.resolvedEventIds.includes(`quiet-scene-${index}`));
  if (unusedQuiet.length) {
    const picked = unusedQuiet[stableIndex(game, unusedQuiet.length)];
    return {
      id: `quiet-scene-${picked.index}`,
      title: picked.scene[0],
      location: `${game.character.birthplace} · 日常`,
      paragraphs: [picked.scene[1]],
      rumor: "远方仍有事情发生，只是这个月没有足够可靠的消息抵达你手中。",
      choices: [
        c("照常完成本业", "让生计延续", "你按自己的身份完成了这个月该做的事。没有传奇，家计也没有凭空停止。", { health: 1, cash: -1 }),
        c("把半日留给家人", "维护共同生活", "你处理了一件拖延已久的家事。它很小，却会留在家人的记忆里。", { cash: -1, connections: 1, credit: 1 }),
        c("整理账目与消息", "积累可核实的小事", "你核清一笔旧账，也划掉了一条没有根据的传言。", { learning: 1, information: 1 }),
      ],
    };
  }
  const latest = game.history[0];
  const ordinaryTitle = `${game.year}年${game.month}月的本业与家计`;
  return {
    id: `ordinary-${game.year}-${game.month}-${game.turn}`,
    title: ordinaryTitle,
    location: `${game.character.birthplace} · 日常`,
    paragraphs: [
      `你以${game.character.occupation}维持这一月的生活。收入、耗费、身体和人情都在缓慢变化，并没有突然出现一件专为你准备的大事。`,
      latest ? `上月“${latest.title}”留下的后果没有消失，只是不再以同一事件、同一对白重新上演。` : "这个月由劳作、饮食、往来和等待组成。",
    ],
    rumor: "你听见几条彼此矛盾的远方消息，因无法核实，暂不把它们写成事实。",
    choices: [
      c(`专心做完${game.character.occupation}`, "本业收益受身份与当月处境约束", "这个月的本业如期完成。所得不多，却不是凭空而来。", { cash: 1, health: -1, credit: 1 }),
      c("修补家中缺口", "把时间用于家计", "一件可能在以后变成损失的小事被提前处理。", { cash: -1, grain: 1, risk: -1 }),
      c("拜访一个已有往来的人", "关系依赖长期维护", "你们没有立刻结盟，只交换了各自能够确认的近况。", { connections: 1, information: 1 }),
    ],
  };
}

export function applyEffects(stats: Stats, effects: Partial<Stats>): Stats {
  const next = { ...stats };
  for (const [key, value] of Object.entries(effects) as Array<[StatKey, number]>) {
    const upper = ["cash", "grain", "land"].includes(key) ? 9999 : 100;
    next[key] = Math.max(0, Math.min(upper, next[key] + value));
  }
  return next;
}

export function statusWord(value: number, kind: "health" | "reputation" | "connections" | "risk") {
  if (kind === "health") return value >= 80 ? "精力充沛" : value >= 60 ? "尚称康健" : value >= 40 ? "时有病痛" : value >= 20 ? "久病虚弱" : "命悬一线";
  if (kind === "reputation") return value >= 70 ? "远近闻名" : value >= 40 ? "一地有名" : value >= 15 ? "乡里渐知" : value >= 0 ? "尚无名声" : "声名受损";
  if (kind === "connections") return value >= 70 ? "门生故吏遍布" : value >= 40 ? "州县有门路" : value >= 15 ? "已有可靠熟人" : "亲旧寥寥";
  return value >= 70 ? "危机逼近" : value >= 40 ? "暗流环伺" : value >= 15 ? "须留心" : "暂无迫近危险";
}

export function monthlyReport(game: GameState, era: Era) {
  const monthName = `${game.month}月`;
  const known = game.stats.information + game.stats.connections;
  return [
    ["京师", known >= 12 ? `${era.capital}的公文仍以${era.ruler}名义发出；你只确认到其中与本地差役有关的部分。` : "可靠消息尚未抵达。"],
    ["地方", game.stats.risk >= 35 ? "巡检与里役活动增多，夜间出行的人明显减少。" : "州县日常公事照常，未听说大规模变动。"],
    ["军务", known >= 18 ? era.anchor : "只有零散传言，无法判断军情真假。"],
    ["粮价", game.stats.grain < 4 ? "你切身感到粮食紧张，市价也比上月更硬。" : "本地粮价尚在可承受范围，个别米行限制大宗购买。"],
    ["边疆", known >= 25 ? "驿传中出现调马与筹粮的消息，但目的地并不清楚。" : "你没有足以核实的消息。"],
    ["士林", game.stats.learning >= 8 ? "书院议论集中在赋役与吏治，意见并不一致。" : "这些讨论尚未进入你的日常交往。"],
    ["商路", game.stats.cash >= 20 || game.character.identityId === "merchant" ? "主要道路仍通，脚价与关验时间比上月略有变化。" : "你只知道本地集市仍能开张。"],
    ["民间", `${monthName}最大的变化来自物价、婚丧、劳作与疾病，而非朝廷大事。`],
    ["宫廷", game.character.identityId === "palace" || game.character.identityId === "royal" ? "你接触到的只是各方刻意让你看见的一部分。" : "与你的生活距离很远，也没有可靠传闻。"],
    ["你能接触到的传闻", era.rumor],
  ] as const;
}
