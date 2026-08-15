"use client";

import { useEffect, useMemo, useState } from "react";

const SAVE_KEY = "shanhe-wanxiang-save-v1";
const seasons = ["春", "夏", "秋", "冬"] as const;

type StatKey = "wealth" | "learning" | "physique" | "health" | "reputation" | "influence" | "virtue";
type Stats = Record<StatKey, number>;
type Tab = "chronicle" | "profile" | "family" | "world";
type Stage = "cover" | "create" | "play";

type Era = {
  id: string; dynasty: string; name: string; year: number; regnal: string; note: string;
  emperor: string; capital: string; world: string; anchor: string; rumor: string;
};

type Origin = {
  id: string; name: string; icon: string; desc: string; wealth: number; learning: number; physique: number; skill: string;
};

type Choice = {
  label: string; hint: string; result: string; delta: Partial<Stats>;
  required?: StatKey; threshold?: number; failResult?: string; failDelta?: Partial<Stats>; familyDelta?: number;
};

type StoryEvent = { id: string; title: string; location: string; paragraphs: string[]; world: string; choices: Choice[] };
type HistoryItem = { turn: number; year: number; season: string; title: string; text: string };
type Character = { name: string; gender: string; goal: string; birthplace: string; eraId: string; originId: string };
type GameState = {
  character: Character; year: number; seasonIndex: number; age: number; turn: number; stats: Stats;
  pendingResult: string | null; lastDelta: Partial<Stats>; history: HistoryItem[]; familyBond: number;
};

const eras: Era[] = [
  { id: "tang", dynasty: "唐", name: "大唐·开元二十三年", year: 735, regnal: "开元二十三年", note: "盛世之下，边事渐起", emperor: "唐玄宗", capital: "长安", world: "开元盛世仍在高处，均田、府兵与边镇的裂缝已悄然出现。", anchor: "河西商路繁盛，边镇节度使权势渐重。", rumor: "西市胡商说，北边的军报比往年更密。" },
  { id: "song", dynasty: "宋", name: "北宋·元丰元年", year: 1078, regnal: "元丰元年", note: "新法方炽，朝野相争", emperor: "宋神宗", capital: "汴京", world: "新法已经深入州县，保甲、青苗与市易既改变生计，也制造新的冲突。", anchor: "朝廷整军理财，士林围绕新旧之争分裂。", rumor: "驿路上传来话，说西北又在筹措军粮。" },
  { id: "ming", dynasty: "明", name: "大明·万历十年", year: 1582, regnal: "万历十年", note: "张居正病逝前夕", emperor: "明神宗", capital: "北京", world: "一条鞭法正在重塑赋役，改革的秩序与积压的反弹同时抵达地方。", anchor: "首辅张居正病重，京师政局即将转向。", rumor: "南来的官船上，有人低声议论首辅的病情。" },
  { id: "qing", dynasty: "清", name: "大清·乾隆四十六年", year: 1781, regnal: "乾隆四十六年", note: "繁华极盛，积弊已深", emperor: "乾隆帝", capital: "北京", world: "人口、商业与官僚体系一同膨胀，盛世表面之下，土地与吏治的压力日重。", anchor: "各省钱粮账册光鲜，地方亏空却难以尽知。", rumor: "远客说，几处州县都在追补历年的亏空。" },
];

const origins: Origin[] = [
  { id: "farmer", name: "佃农之子", icon: "田", desc: "食不果腹，却最懂土地与人情", wealth: 6, learning: 2, physique: 8, skill: "农事" },
  { id: "artisan", name: "匠户学徒", icon: "工", desc: "身有薄技，受制于行会与籍贯", wealth: 12, learning: 4, physique: 6, skill: "营造" },
  { id: "merchant", name: "行商遗孤", icon: "商", desc: "有些本钱，也背着一笔旧债", wealth: 30, learning: 5, physique: 4, skill: "商算" },
  { id: "scholar", name: "寒门书生", icon: "士", desc: "十年寒窗，功名是唯一窄门", wealth: 9, learning: 9, physique: 3, skill: "经义" },
  { id: "soldier", name: "边军之后", icon: "兵", desc: "弓马娴熟，军籍却如枷锁", wealth: 10, learning: 3, physique: 9, skill: "弓马" },
  { id: "clerk", name: "县衙小吏", icon: "吏", desc: "熟悉章程，也见惯灰色规矩", wealth: 18, learning: 7, physique: 4, skill: "文书" },
];

const goals = ["安稳一生", "光耀门楣", "富甲一方", "青史留名", "改变天下"];
const birthplaces = ["京畿", "江南", "中原", "山东", "关中", "巴蜀", "岭南", "边塞"];

const clamp = (value: number, min = 0, max = 100) => Math.max(min, Math.min(max, value));
const deltaText = (delta: Partial<Stats>) => Object.entries(delta).map(([key, value]) => `${statNames[key as StatKey]} ${Number(value) > 0 ? "+" : ""}${value}`).join(" · ");
const statNames: Record<StatKey, string> = { wealth: "家资", learning: "学识", physique: "体魄", health: "康健", reputation: "声望", influence: "人脉", virtue: "德行" };

function initialEvent(game: GameState, era: Era, origin: Origin): StoryEvent {
  const common = { location: `${game.character.birthplace} · 乡里`, world: era.rumor };
  const byOrigin: Record<string, StoryEvent> = {
    farmer: { id: "birth-farmer", title: "催租人走进田埂", ...common, paragraphs: ["麦苗刚刚返青，庄头便带着两名壮丁来到地头。今年的租额比旧账多出一成。", "父亲弯着腰没有说话。你认得账册上的涂改，也知道仓里只剩半袋陈粮。"], choices: [
      { label: "据理核对旧契", hint: "需要学识 2", required: "learning", threshold: 2, result: "你逐条指出涂改处，庄头没有认错，却暂缓了多收的一成。", delta: { reputation: 3, influence: -1 }, failResult: "你说不清契纸章程，反被扣上抗租的名头。", failDelta: { wealth: -3, reputation: -1 } },
      { label: "卖掉家中小羊补租", hint: "保全家人，损失家资", result: "租粮凑齐了，父亲的咳嗽却更重。", delta: { wealth: -4, virtue: 2 }, familyDelta: 5 },
      { label: "夜里去邻村寻短工", hint: "体魄检定", required: "physique", threshold: 7, result: "你连做七日河工，换回两斗粮和几枚铜钱。", delta: { wealth: 3, health: -5, reputation: 1 }, failResult: "重活压垮了你的肩背，工钱还不够买药。", failDelta: { health: -12, wealth: -1 } },
    ] },
    artisan: { id: "birth-artisan", title: "作坊里失落的铜尺", ...common, paragraphs: ["师傅最珍爱的官制铜尺不见了，行会管事正好在场。所有学徒都被锁在院里。", "你昨夜最后离开，却看见师兄曾独自在工具房停留。"], choices: [
      { label: "当众说出昨夜所见", hint: "可能得罪师兄", result: "铜尺从师兄的木箱里找到。师傅信你，作坊里却有人开始躲着你。", delta: { reputation: 4, influence: -2 } },
      { label: "先私下劝师兄交还", hint: "人情与风险并存", required: "influence", threshold: 3, result: "师兄悄悄归还铜尺，对你欠下一份人情。", delta: { influence: 5, virtue: 2 }, failResult: "师兄反咬一口，你被罚去最苦的炉房。", failDelta: { health: -6, reputation: -2 } },
      { label: "保持沉默，专心做工", hint: "技艺精进", result: "案子最终不了了之，你用三天打出一件漂亮的榫卯。", delta: { learning: 2, reputation: -1 } },
    ] },
    merchant: { id: "birth-merchant", title: "旧债与一船生丝", ...common, paragraphs: ["亡父的旧识带来一张借据，也带来一桩生意：合资买下受潮的生丝，运到北地转售。", "若成，旧债可清；若败，你仅存的本钱也会沉进河里。"], choices: [
      { label: "查验货色后压价入股", hint: "需要学识 5", required: "learning", threshold: 5, result: "你发现只有表层受潮，以六成价钱成交。", delta: { wealth: 12, reputation: 2 }, failResult: "丝包内层已经霉变，你被漂亮的样货蒙住了。", failDelta: { wealth: -12 } },
      { label: "拒绝生意，先分期还债", hint: "稳妥但缓慢", result: "债主答应宽限一年，你保住了周转本钱。", delta: { wealth: -4, virtue: 3, reputation: 1 } },
      { label: "请本地牙人共同担保", hint: "动用人脉", required: "influence", threshold: 3, result: "牙人愿意入局，风险被分散，利润也少了一半。", delta: { wealth: 6, influence: 3 }, failResult: "牙人把消息卖给对手，你错失货期。", failDelta: { wealth: -3, influence: -1 } },
    ] },
    scholar: { id: "birth-scholar", title: "县学门前的一场雨", ...common, paragraphs: ["春雨把青石路洗得发亮。县学张榜，今岁收取增广生员。你的旧塾师冒雨赶来，说愿替你写一封荐书。", "可家中已欠下两季田租。母亲没有劝你，只把账簿推到了桌边。"], choices: [
      { label: "接过荐书，赴县学应试", hint: "家资 −5 · 学识检定", required: "learning", threshold: 8, result: "你的策论被列为上等，县学从此为你留了一张书案。", delta: { wealth: -5, reputation: 6, learning: 2 }, failResult: "策论失于空泛，你花尽盘缠，只换回一句“明年再来”。", failDelta: { wealth: -5, reputation: -1 } },
      { label: "婉拒塾师，先替家里还租", hint: "家人亲近 · 错过县试", result: "你抄书换钱，终于补上田租。那封荐书在灯下静静放了一夜。", delta: { wealth: 3, virtue: 3 }, familyDelta: 7 },
      { label: "拜访粮商，筹钱兼求门路", hint: "需要人脉 3", required: "influence", threshold: 3, result: "粮商借你五贯，却要你日后替他写一封呈文。", delta: { wealth: 5, influence: 3, virtue: -1 }, failResult: "粮商笑着送客，你的窘迫第二天便传遍书院。", failDelta: { reputation: -2 } },
    ] },
    soldier: { id: "birth-soldier", title: "军籍上多出的名字", ...common, paragraphs: ["卫所点卯时，你在册上看见一个早已死去三年的名字。那份空额粮饷，一直被百户领走。", "同袍拽住你的袖子：看见，不等于该说。"], choices: [
      { label: "越级向千户告发", hint: "高风险 · 声望变化", required: "learning", threshold: 3, result: "证据确凿，百户被查。你升作小旗，也被旧部记恨。", delta: { reputation: 7, influence: -3, wealth: 2 }, failResult: "状纸格式有误，被原封退回百户手中。", failDelta: { health: -8, reputation: -3 } },
      { label: "与同袍一起保持沉默", hint: "获得照应", result: "你分到一小份余粮。从此，营中有人把你当自己人。", delta: { wealth: 3, influence: 4, virtue: -4 } },
      { label: "暗中抄下账册证据", hint: "等待更好的时机", result: "你把抄件缝进衣襟，暂时无人察觉。", delta: { learning: 2, influence: 1 } },
    ] },
    clerk: { id: "birth-clerk", title: "一张被压下的状纸", ...common, paragraphs: ["寡妇告里长侵田，状纸在签押房压了半月。主簿暗示你把文书退回，里长随后送来两贯“润笔钱”。", "纸很轻，背后却是三亩救命的田。"], choices: [
      { label: "照章登记，送入正堂", hint: "得罪主簿", result: "县令亲自审了此案。寡妇保住田，你被调去整理积年的烂账。", delta: { virtue: 6, reputation: 5, influence: -4 } },
      { label: "退回状纸，收下润笔钱", hint: "家资增加 · 德行下降", result: "两贯钱落进口袋，签押房的人第一次邀你同桌吃酒。", delta: { wealth: 5, influence: 5, virtue: -8 } },
      { label: "私下指点她补齐证据", hint: "折中处理", result: "状纸换了由头再次递入，你没有留下自己的名字。", delta: { learning: 1, virtue: 3, influence: 1 } },
    ] },
  };
  return byOrigin[origin.id];
}

function eraEvent(era: Era, birthplace: string): StoryEvent {
  const choices: Record<string, Choice[]> = {
    tang: [
      { label: "跟随商队西行", hint: "需要体魄 7", required: "physique", threshold: 7, result: "你穿过河西数镇，看见盛世财富如何依赖漫长商路。", delta: { wealth: 10, learning: 3, health: -5 }, failResult: "风沙与水土病让你中途折返。", failDelta: { health: -14, wealth: -3 } },
      { label: "留乡置地", hint: "安稳经营", result: "你把积蓄换成薄田，避开了商路的危险。", delta: { wealth: 4, reputation: 2 } },
      { label: "投书边帅幕府", hint: "需要学识 10", required: "learning", threshold: 10, result: "一篇边策替你赢得幕僚职位，也让你靠近权力漩涡。", delta: { reputation: 8, influence: 8 }, failResult: "边策无人拆阅，你只得在驿馆抄写公文。", failDelta: { wealth: -2, learning: 1 } },
    ],
    song: [
      { label: "参与保甲，谋求弓手差遣", hint: "需要体魄 7", required: "physique", threshold: 7, result: "你在乡里获得正式差遣，也卷入新旧两派的争执。", delta: { influence: 6, reputation: 3, wealth: 3 }, failResult: "操练时旧伤复发，你只能退出保甲。", failDelta: { health: -10 } },
      { label: "借青苗钱扩大营生", hint: "收益与债务并存", result: "这一季收成尚可，你偿还本息后仍有盈余。", delta: { wealth: 8, virtue: -1 } },
      { label: "替百姓写状反映抑配", hint: "学识检定", required: "learning", threshold: 8, result: "转运司派人复核，本县暂缓强行摊派。", delta: { reputation: 8, influence: -2, virtue: 4 }, failResult: "状纸被斥为妄诉，你受了笞罚。", failDelta: { health: -8, reputation: -2 } },
    ],
    ming: [
      { label: "配合清丈，重新丈量族田", hint: "得罪豪族", result: "隐田被查出，里甲税额稍见公平，你也被豪族记住。", delta: { reputation: 7, influence: -5, virtue: 4 } },
      { label: "替大户设法隐瞒田亩", hint: "家资大增 · 德行下降", result: "一封厚礼送到后门，你从此进入地方大户的圈子。", delta: { wealth: 14, influence: 7, virtue: -10 } },
      { label: "远离清丈争端", hint: "保全自己", result: "你闭门不出，却发现新税册仍改变了自家的负担。", delta: { wealth: -2, learning: 1 } },
    ],
    qing: [
      { label: "协助清查仓粮", hint: "需要学识 8", required: "learning", threshold: 8, result: "你从账缝里查出多年亏空，名声大振，却动了许多人的钱袋。", delta: { reputation: 9, influence: -6, virtue: 5 }, failResult: "账目层层做旧，你反被推作亏空的替罪人。", failDelta: { wealth: -8, reputation: -4 } },
      { label: "补上缺额，换取差事", hint: "用钱买路", result: "仓粮表面无缺，你得到一份稳定差遣。", delta: { wealth: -8, influence: 8, virtue: -5 } },
      { label: "将消息匿名送往省城", hint: "结果难料", result: "密信石沉大海，但数月后仓官忽然被调任。", delta: { learning: 2, reputation: 2 } },
    ],
  };
  return { id: `era-${era.id}`, title: era.anchor, location: `${birthplace} · 驿路`, paragraphs: [era.world, "大势并不直接询问你的意见，却会通过税粮、差役、物价和一纸命令走进你的生活。"], world: era.rumor, choices: choices[era.id] };
}

const commonEvents: Array<(game: GameState, era: Era, origin: Origin) => StoryEvent> = [
  (game, era) => ({ id: "grain", title: "米价在三日内涨了两成", location: `${game.character.birthplace} · 米市`, paragraphs: ["几艘粮船迟迟未到，米行门前已经排起长队。有人说只是风阻，也有人说大户正在囤粮。", "你手里的消息未必是真的，但家中下月就要买粮。"], world: era.rumor, choices: [
    { label: "趁早买入足够口粮", hint: "花钱换安稳", result: "后来粮船果然晚到，你保住了家中炊烟。", delta: { wealth: -5, reputation: 1 }, familyDelta: 4 },
    { label: "借钱囤粮，等高价卖出", hint: "需要家资 18", required: "wealth", threshold: 18, result: "米价又涨一轮，你在官府限价前及时脱手。", delta: { wealth: 13, virtue: -5, reputation: -2 }, failResult: "官府突然开仓平粜，借来的钱却要照数归还。", failDelta: { wealth: -9, reputation: -1 } },
    { label: "联络邻里合购分粮", hint: "积累乡望", result: "二十余户共同凑资，买到一船平价米。", delta: { reputation: 6, influence: 4, virtue: 3 } },
  ] }),
  (game, era) => ({ id: "tax", title: "里甲催办一项急差", location: `${game.character.birthplace} · 里门`, paragraphs: ["县里突然催办一批车马与民夫，期限只有五日。里长把最重的份额摊到几户外来人头上。", "众人推你出面，因为你认得一些字，也说得上几句话。"], world: `${era.capital}的命令抵达乡里时，已经多了几层解释。`, choices: [
    { label: "查阅旧册，要求重新均摊", hint: "需要学识 7", required: "learning", threshold: 7, result: "你找出旧例，迫使里长重新核算。", delta: { reputation: 7, influence: -2, virtue: 3 }, failResult: "旧册上的字句被里长逐一驳回。", failDelta: { reputation: -2, wealth: -3 } },
    { label: "替最穷的两户承担一份", hint: "损失家资 · 赢得人心", result: "两家人把这份恩记了许多年。", delta: { wealth: -6, reputation: 5, virtue: 5 }, familyDelta: -1 },
    { label: "送礼请里长减免自家", hint: "只保全自己", result: "你的名字从差役簿上淡了下去。", delta: { wealth: -3, influence: 3, virtue: -4 } },
  ] }),
  (game) => ({ id: "fever", title: "盛夏的热病", location: `${game.character.birthplace} · 家宅`, paragraphs: ["邻巷接连有人高热不退，药铺里的藿香与黄连一日三价。母亲也在夜里发起热来。", "城中医者说法不一，唯一相同的是诊金都很贵。"], world: "坊门比往日更早关闭，关于疫病的传言越过了城墙。", choices: [
    { label: "请最有名的医者上门", hint: "家资 −8", result: "药方对症，三日后烧退了。", delta: { wealth: -8, virtue: 1 }, familyDelta: 8 },
    { label: "照旧方自行采药", hint: "需要学识 8", required: "learning", threshold: 8, result: "你谨慎辨认药材，总算熬过最险的一夜。", delta: { learning: 2, health: -2 }, familyDelta: 5, failResult: "一味药用错了分量，病势更加反复。", failDelta: { health: -12, wealth: -3 }, },
    { label: "封闭家门，等待病势过去", hint: "保存钱财 · 亲情受损", result: "热病最终退去，但母亲记得你迟迟没有请医。", delta: { health: -7, virtue: -4 }, familyDelta: -8 },
  ] }),
  (game, era, origin) => ({ id: "patron", title: "席间递来的一张名帖", location: `${game.character.birthplace} · ${origin.id === "scholar" ? "文会" : "酒肆"}`, paragraphs: ["本地一位有势力的乡绅听说了你的名字，邀你过府赴宴。席散前，他让管家递来名帖。", "这张帖子能打开不少门，但乡绅正与邻县争一片水荡。"], world: `${era.dynasty}的地方秩序，往往不只写在律例里。`, choices: [
    { label: "收下名帖，进入门下", hint: "人脉大增", result: "你获得可靠门路，也开始替乡绅处理不便出面的事。", delta: { influence: 10, wealth: 5, virtue: -5 } },
    { label: "婉拒厚意，只留普通往来", hint: "保持距离", result: "乡绅没有发怒，却也不再对你格外照拂。", delta: { reputation: 3, virtue: 2 } },
    { label: "查清水荡争议后再答复", hint: "需要学识 10", required: "learning", threshold: 10, result: "你发现双方契据都有破绽，提出的折中方案保住了两村生计。", delta: { learning: 2, reputation: 8, influence: 4, virtue: 4 }, failResult: "你越查越深，反让双方都怀疑你替对方做事。", failDelta: { influence: -4, reputation: -2 } },
  ] }),
  (game) => ({ id: "fire", title: "子夜失火", location: `${game.character.birthplace} · 东巷`, paragraphs: ["更鼓刚过三响，东巷忽然火起。风把火星吹向连片木屋，哭喊声与铜锣声混在一起。", "你家尚未被波及，但邻居的孩子还困在里面。"], world: "巡夜的更夫奔向县衙，救火的人只能先靠自己。", choices: [
    { label: "冲进火场救人", hint: "需要体魄 7", required: "physique", threshold: 7, result: "你用湿被裹住孩子冲出火门，左臂留下灼伤。", delta: { health: -8, reputation: 10, virtue: 5 }, failResult: "横梁坠下，你虽被人拖出，却伤得不轻。", failDelta: { health: -22, reputation: 3 } },
    { label: "组织众人拆屋隔火", hint: "需要人脉 6", required: "influence", threshold: 6, result: "两间空屋被拆，火势终于在井边停住。", delta: { influence: 3, reputation: 8, wealth: -2 }, failResult: "众人各执一词，火越过了巷口。", failDelta: { wealth: -10, reputation: -2 } },
    { label: "先搬出自家财物", hint: "保住家资", result: "你保住箱笼，却只能看着邻家的屋顶塌下。", delta: { wealth: 2, virtue: -7, reputation: -5 }, familyDelta: 2 },
  ] }),
  (game) => ({ id: "marriage", title: "媒人带来两门亲事", location: `${game.character.birthplace} · 家中`, paragraphs: ["媒人把两张红帖并排放在桌上：一户家境殷实但性情强势，一户门第寻常却与你早有往来。", "母亲说婚姻不只是两个人的事，随后又补了一句：日子终究是你过。"], world: "宗族、财产与婚姻织成了普通人最牢固的关系网。", choices: [
    { label: "选择殷实之家", hint: "家资与人脉提升", result: "婚事办得体面，新亲带来生意与门路，也带来许多规矩。", delta: { wealth: 10, influence: 6, virtue: -1 }, familyDelta: 5 },
    { label: "选择熟识之人", hint: "亲情与安稳", result: "婚礼简朴，家中的笑声却比往年多。", delta: { wealth: -4, health: 3, virtue: 3 }, familyDelta: 12 },
    { label: "暂不成婚，专心此生所求", hint: "学识提升 · 宗族不满", result: "红帖被退回，你为自己争得几年清静。", delta: { learning: 3, reputation: -2 }, familyDelta: -4 },
  ] }),
  (game, era) => ({ id: "flood", title: "河堤在暴雨中开裂", location: `${game.character.birthplace} · 河堤`, paragraphs: ["连雨七日，上游水色浑黄。堤脚裂开一道能伸进手掌的缝，县里的修堤银却迟迟没有发下。", "若等官差赶到，低处三村可能已经进水。"], world: `${era.capital}离此地很远，水却只隔着一道土堤。`, choices: [
    { label: "出资雇工，连夜加固", hint: "需要家资 20", required: "wealth", threshold: 20, result: "两百袋土石压住险口。退水后，三村百姓给你送来一块匾。", delta: { wealth: -14, reputation: 15, virtue: 6 }, failResult: "钱不够，雇来的人在半夜散去。", failDelta: { wealth: -8, reputation: -2 } },
    { label: "召集乡民轮班抢险", hint: "需要声望 12", required: "reputation", threshold: 12, result: "你的名字让众人留下，堤防在黎明前合龙。", delta: { reputation: 10, influence: 8, health: -5 }, failResult: "没有足够的人相信你，裂口继续扩大。", failDelta: { reputation: -3, wealth: -7 } },
    { label: "带家人先撤往高处", hint: "保全家人", result: "洪水淹了半间屋，你的家人都平安。", delta: { wealth: -9, virtue: 1 }, familyDelta: 7 },
  ] }),
  (game) => ({ id: "bandits", title: "商路上的求救声", location: `${game.character.birthplace} · 山道`, paragraphs: ["你随队经过山口，前方忽然传来呼救。两名持刀人正围住一辆翻倒的骡车。", "同行者劝你绕路：这年景，多管闲事往往比刀更危险。"], world: "官道仍在地图上，真正维持道路的却是驿卒、乡勇和往来商队。", choices: [
    { label: "带人上前喝止", hint: "需要体魄 8", required: "physique", threshold: 8, result: "你们人数占优，盗匪退入山林。车主愿以重金相谢。", delta: { wealth: 8, reputation: 7, health: -3 }, failResult: "盗匪看穿虚势，你在混战中受伤。", failDelta: { health: -16, wealth: -5 } },
    { label: "绕行驿站报官", hint: "较稳妥，但可能太迟", result: "巡检赶到时车货已失，好在人还活着。", delta: { reputation: 2, virtue: 2 } },
    { label: "装作没有听见", hint: "避免风险", result: "你平安越过山口，那声呼救却在夜里反复响起。", delta: { virtue: -5, health: 1 } },
  ] }),
];

function getEvent(game: GameState): StoryEvent {
  const era = eras.find((item) => item.id === game.character.eraId) ?? eras[2];
  const origin = origins.find((item) => item.id === game.character.originId) ?? origins[3];
  if (game.turn === 0) return initialEvent(game, era, origin);
  if (game.turn === 3) return eraEvent(era, game.character.birthplace);
  return commonEvents[(game.turn - 1) % commonEvents.length](game, era, origin);
}

export default function Home() {
  const [stage, setStage] = useState<Stage>("cover");
  const [tab, setTab] = useState<Tab>("chronicle");
  const [eraId, setEraId] = useState("ming");
  const [originId, setOriginId] = useState("scholar");
  const [name, setName] = useState("沈砚");
  const [gender, setGender] = useState("男");
  const [goal, setGoal] = useState(goals[1]);
  const [birthplace, setBirthplace] = useState("江南");
  const [game, setGame] = useState<GameState | null>(null);
  const [savedGame, setSavedGame] = useState<GameState | null>(null);
  const [restartOpen, setRestartOpen] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(SAVE_KEY);
      if (raw) setSavedGame(JSON.parse(raw) as GameState);
    } catch { localStorage.removeItem(SAVE_KEY); }
  }, []);

  useEffect(() => {
    if (!game) return;
    localStorage.setItem(SAVE_KEY, JSON.stringify(game));
    setSavedGame(game);
  }, [game]);

  const era = useMemo(() => eras.find((item) => item.id === (game?.character.eraId ?? eraId)) ?? eras[2], [eraId, game]);
  const origin = useMemo(() => origins.find((item) => item.id === (game?.character.originId ?? originId)) ?? origins[3], [originId, game]);
  const event = game ? getEvent(game) : null;

  const startGame = () => {
    const next: GameState = {
      character: { name: name.trim(), gender, goal, birthplace, eraId, originId }, year: era.year, seasonIndex: 0, age: 16, turn: 0,
      stats: { wealth: origin.wealth, learning: origin.learning, physique: origin.physique, health: 72 + origin.physique * 2, reputation: 0, influence: origin.id === "clerk" ? 5 : 3, virtue: 50 },
      pendingResult: null, lastDelta: {}, history: [], familyBond: 62,
    };
    setGame(next); setTab("chronicle"); setStage("play"); window.scrollTo(0, 0);
  };

  const loadGame = () => { if (savedGame) { setGame(savedGame); setStage("play"); setTab("chronicle"); } };

  const choose = (choice: Choice) => {
    if (!game || !event || game.pendingResult) return;
    const passed = !choice.required || game.stats[choice.required] >= (choice.threshold ?? 0);
    const delta = passed ? choice.delta : (choice.failDelta ?? choice.delta);
    const result = passed ? choice.result : (choice.failResult ?? choice.result);
    const nextStats = { ...game.stats };
    (Object.keys(delta) as StatKey[]).forEach((key) => { nextStats[key] = clamp(nextStats[key] + (delta[key] ?? 0)); });
    setGame({ ...game, stats: nextStats, familyBond: clamp(game.familyBond + (choice.familyDelta ?? 0)), pendingResult: result, lastDelta: delta, history: [{ turn: game.turn, year: game.year, season: seasons[game.seasonIndex], title: event.title, text: result }, ...game.history].slice(0, 60) });
  };

  const advance = () => {
    if (!game) return;
    const nextSeason = (game.seasonIndex + 1) % 4;
    const yearPassed = nextSeason === 0;
    const healthDrift = game.age > 45 && yearPassed ? -1 : 0;
    setGame({ ...game, turn: game.turn + 1, seasonIndex: nextSeason, year: game.year + (yearPassed ? 1 : 0), age: game.age + (yearPassed ? 1 : 0), stats: { ...game.stats, health: clamp(game.stats.health + healthDrift) }, pendingResult: null, lastDelta: {} });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const restart = () => {
    localStorage.removeItem(SAVE_KEY); setGame(null); setSavedGame(null); setRestartOpen(false); setStage("cover"); setTab("chronicle");
  };

  if (stage === "cover") return <Cover savedGame={savedGame} onNew={() => setStage("create")} onContinue={loadGame} />;
  if (stage === "create") return <Create eraId={eraId} setEraId={setEraId} originId={originId} setOriginId={setOriginId} name={name} setName={setName} gender={gender} setGender={setGender} goal={goal} setGoal={setGoal} birthplace={birthplace} setBirthplace={setBirthplace} era={era} origin={origin} onBack={() => setStage("cover")} onStart={startGame} />;
  if (!game || !event) return null;

  const achievements = [game.stats.reputation >= 15 && "乡里闻名", game.stats.wealth >= 50 && "家业初成", game.stats.learning >= 15 && "学有所成", game.stats.influence >= 18 && "门路通达", game.stats.virtue >= 65 && "行义有声"].filter(Boolean) as string[];
  const currentSeason = seasons[game.seasonIndex];

  return (
    <main className="game-shell">
      <header className="game-header">
        <div><small>{era.dynasty} · {era.regnal}</small><h2>{game.character.name}，{game.age}岁</h2></div>
        <div className="season"><span>{currentSeason}</span><small>{["二月", "五月", "八月", "十一月"][game.seasonIndex]}</small></div>
      </header>
      <section className="status-strip">
        <div><small>家资</small><strong>{game.stats.wealth}<i>贯</i></strong></div><div><small>学识</small><strong>{game.stats.learning}<i>/100</i></strong></div><div><small>康健</small><strong>{game.stats.health}<i>/100</i></strong></div><div><small>声望</small><strong>{game.stats.reputation}<i>/100</i></strong></div>
      </section>

      {tab === "chronicle" && <Chronicle event={event} game={game} onChoose={choose} onAdvance={advance} />}
      {tab === "profile" && <Profile game={game} era={era} origin={origin} achievements={achievements} onRestart={() => setRestartOpen(true)} />}
      {tab === "family" && <Family game={game} />}
      {tab === "world" && <World game={game} era={era} />}

      <nav className="bottom-nav" aria-label="游戏功能">
        {([ ["chronicle", "卷", "纪事"], ["profile", "人", "命册"], ["family", "族", "家门"], ["world", "域", "天下"] ] as const).map(([id, icon, label]) => <button key={id} className={tab === id ? "active" : ""} onClick={() => { setTab(id); window.scrollTo(0, 0); }}><span>{icon}</span>{label}</button>)}
      </nav>

      {restartOpen && <div className="modal-backdrop" role="dialog" aria-modal="true"><div className="ink-modal"><span className="mini-seal">止</span><h3>舍弃这一世？</h3><p>现有命册与全部纪事将被清除，无法恢复。</p><div><button onClick={() => setRestartOpen(false)}>再想想</button><button className="danger" onClick={restart}>确认舍弃</button></div></div></div>}
    </main>
  );
}

function Cover({ savedGame, onNew, onContinue }: { savedGame: GameState | null; onNew: () => void; onContinue: () => void }) {
  return <main className="cover-shell"><div className="mountains" aria-hidden="true"><i /><i /><i /></div><section className="cover-card"><div className="seal">山河</div><p className="eyebrow">历史锚定型 · 古代人生沙盘</p><h1>山河万象</h1><p className="cover-subtitle">古代人生与帝国权谋模拟器</p><div className="cover-rule" /><blockquote>你不是在扮演皇帝。<br />你正在经历一个时代。</blockquote>{savedGame && <button className="continue-button" onClick={onContinue}><small>继续此世</small><strong>{savedGame.character.name} · {savedGame.year}年{seasons[savedGame.seasonIndex]}</strong></button>}<button className="primary-button" onClick={onNew}>{savedGame ? "另开一世" : "入世"}</button><p className="save-hint">一人一命 · 世事无常 · 本地自动存档</p></section></main>;
}

type CreateProps = { eraId: string; setEraId: (v: string) => void; originId: string; setOriginId: (v: string) => void; name: string; setName: (v: string) => void; gender: string; setGender: (v: string) => void; goal: string; setGoal: (v: string) => void; birthplace: string; setBirthplace: (v: string) => void; era: Era; origin: Origin; onBack: () => void; onStart: () => void };
function Create(props: CreateProps) {
  return <main className="create-shell"><header className="topbar"><button className="ghost-icon" onClick={props.onBack} aria-label="返回">‹</button><div><span>命册</span><small>择一世而生</small></div><span className="step-mark">壹</span></header>
    <section className="form-section"><Heading number="01" title="选择时代" note="历史大势不可凭空改写，但人可以留下痕迹" /><div className="era-list">{eras.map((item) => <button key={item.id} className={props.eraId === item.id ? "era-option active" : "era-option"} onClick={() => props.setEraId(item.id)}><strong>{item.name}</strong><small>{item.note}</small></button>)}</div></section>
    <section className="form-section"><Heading number="02" title="选择出身" note="起点会决定你能看见哪些门" /><div className="origin-grid">{origins.map((item) => <button key={item.id} className={props.originId === item.id ? "origin-option active" : "origin-option"} onClick={() => props.setOriginId(item.id)}><b>{item.icon}</b><strong>{item.name}</strong><small>{item.desc}</small></button>)}</div></section>
    <section className="form-section identity-section"><Heading number="03" title="写下姓名" note="从无名之人开始" /><label>姓名<input value={props.name} maxLength={6} onChange={(e) => props.setName(e.target.value)} placeholder="输入姓名" /></label><div className="segmented" aria-label="性别">{["男", "女"].map((item) => <button key={item} className={props.gender === item ? "active" : ""} onClick={() => props.setGender(item)}>{item}</button>)}</div><div className="field-pair"><label>出生地<select value={props.birthplace} onChange={(e) => props.setBirthplace(e.target.value)}>{birthplaces.map((item) => <option key={item}>{item}</option>)}</select></label><label>此生所求<select value={props.goal} onChange={(e) => props.setGoal(e.target.value)}>{goals.map((item) => <option key={item}>{item}</option>)}</select></label></div></section>
    <div className="sticky-action"><div><small>你的命格</small><strong>{props.era.name} · {props.origin.name}</strong></div><button disabled={!props.name.trim()} onClick={props.onStart}>落笔成命</button></div></main>;
}

function Heading({ number, title, note }: { number: string; title: string; note: string }) { return <div className="section-heading"><span>{number}</span><div><h2>{title}</h2><p>{note}</p></div></div>; }

function Chronicle({ event, game, onChoose, onAdvance }: { event: StoryEvent; game: GameState; onChoose: (c: Choice) => void; onAdvance: () => void }) {
  return <><section className="chronicle-card"><div className="date-rail"><span>{game.turn === 0 ? "初" : `第${game.turn + 1}`}</span><b>{seasons[game.seasonIndex]}</b><i /></div><article><p className="location">{event.location}</p><h3>{event.title}</h3>{event.paragraphs.map((p) => <p key={p}>{p}</p>)}{!game.pendingResult ? <div className="choices">{event.choices.map((choice, index) => <button key={choice.label} onClick={() => onChoose(choice)}><b>{["一", "二", "三"][index]}</b><span><strong>{choice.label}</strong><small>{choice.hint}</small></span></button>)}</div> : <div className="result-box"><span>命运已记</span><p>{game.pendingResult}</p>{Object.keys(game.lastDelta).length > 0 && <small>{deltaText(game.lastDelta)}</small>}<button className="next-turn" onClick={onAdvance}>进入下一季</button></div>}</article></section><section className="world-whisper"><span>天下事</span><p>{event.world}</p></section>{game.history.length > 0 && <section className="recent-history"><h3>近事</h3>{game.history.slice(0, 3).map((item) => <div key={`${item.turn}-${item.title}`}><time>{item.year} · {item.season}</time><p><strong>{item.title}</strong>{item.text}</p></div>)}</section>}</>;
}

function Profile({ game, era, origin, achievements, onRestart }: { game: GameState; era: Era; origin: Origin; achievements: string[]; onRestart: () => void }) {
  const stats: StatKey[] = ["health", "physique", "learning", "reputation", "influence", "virtue"];
  return <section className="tab-page"><div className="profile-hero"><div className="name-seal">{game.character.name.slice(0, 1)}</div><div><p>{era.dynasty}人 · {game.character.birthplace}</p><h2>{game.character.name}</h2><small>{game.character.gender} · {game.age}岁 · {origin.name}</small></div></div><div className="life-aim"><span>此生所求</span><strong>{game.character.goal}</strong><p>生于{era.regnal}，身具「{origin.skill}」之长。</p></div><h3 className="page-title">人物属性</h3><div className="stat-list">{stats.map((key) => <div key={key}><span>{statNames[key]}</span><i><b style={{ width: `${clamp(game.stats[key])}%` }} /></i><strong>{game.stats[key]}</strong></div>)}</div><h3 className="page-title">所得之名</h3><div className="achievement-list">{achievements.length ? achievements.map((item) => <span key={item}>{item}</span>) : <p>尚未在世间留下名号。</p>}</div><h3 className="page-title">生平纪事</h3><div className="history-book">{game.history.length ? game.history.map((item) => <div key={`${item.turn}-${item.title}`}><time>{item.year}年 · {item.season}</time><p><strong>{item.title}</strong>{item.text}</p></div>) : <p>命册新启，尚无旧事。</p>}</div><button className="restart-link" onClick={onRestart}>舍弃此世，重新投生</button></section>;
}

function Family({ game }: { game: GameState }) {
  const married = game.history.some((item) => item.title.includes("亲事"));
  return <section className="tab-page"><div className="family-banner"><span>家门</span><h2>{game.character.name.slice(0, 1)}氏小户</h2><p>{game.character.birthplace} · 家声 {Math.max(0, Math.round((game.stats.reputation + game.familyBond) / 2))}</p></div><div className="house-grid"><div><small>现有家资</small><strong>{game.stats.wealth}贯</strong></div><div><small>家人亲近</small><strong>{game.familyBond}</strong></div><div><small>居所</small><strong>{game.stats.wealth > 60 ? "三进宅院" : game.stats.wealth > 25 ? "自有小院" : "租居瓦房"}</strong></div></div><h3 className="page-title">家中之人</h3><div className="relation-card"><b>母</b><div><strong>母亲</strong><small>操持家计，最在意你的平安</small><i><span style={{ width: `${game.familyBond}%` }} /></i></div><em>{game.familyBond}</em></div><div className="relation-card"><b>亲</b><div><strong>{married ? "配偶" : "姻缘未定"}</strong><small>{married ? "与你共同支撑这个家" : "世事与选择将影响婚姻"}</small><i><span style={{ width: `${married ? 65 : 8}%` }} /></i></div><em>{married ? 65 : "—"}</em></div><h3 className="page-title">家训</h3><blockquote className="family-quote">“门第不只看祖先留下什么，也看这一代选择留下什么。”</blockquote><div className="system-note"><span>家族传承</span><p>家资、声望、仇怨与人情都会留给下一代。完成一生后，可由子嗣或族人继续这个时代。</p></div></section>;
}

function World({ game, era }: { game: GameState; era: Era }) {
  const pressure = clamp(32 + game.turn * 2, 0, 92); const order = clamp(78 - game.turn, 20, 90); const grain = clamp(65 - (game.turn % 5) * 6, 20, 90);
  return <section className="tab-page"><div className="world-banner"><small>{era.capital} · {era.emperor}在位</small><h2>{era.dynasty} · {era.regnal}</h2><p>{era.world}</p></div><h3 className="page-title">天下态势</h3><div className="world-meters"><Meter label="朝廷秩序" value={order} /><Meter label="民生粮储" value={grain} /><Meter label="边疆压力" value={pressure} /></div><h3 className="page-title">时代锚点</h3><article className="edict"><span>邸报</span><h3>{era.anchor}</h3><p>{era.rumor}</p></article><h3 className="page-title">世界运行中</h3><div className="system-tags">{["人口迁徙", "粮价与仓储", "赋税徭役", "官僚升降", "地方豪族", "商路流通", "战争后勤", "疾病灾害", "婚姻宗族", "信息延迟", "谣言传播", "阶层流动"].map((item) => <span key={item}>{item}</span>)}</div><div className="system-note"><span>你的影响</span><p>当前声望 {game.stats.reputation}、人脉 {game.stats.influence}。普通人的选择首先改变家庭与乡里；只有积累足够资源，才可能触及州县与朝堂。</p></div></section>;
}

function Meter({ label, value }: { label: string; value: number }) { return <div><span>{label}</span><i><b style={{ width: `${value}%` }} /></i><strong>{value}</strong></div>; }
