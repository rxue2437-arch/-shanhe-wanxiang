"use client";

import { useEffect, useMemo, useState } from "react";
import {
  applyEffects,
  buildInitialStats,
  eras,
  getEvent,
  historyModes,
  identities,
  makePeople,
  monthlyReport,
  resolveChoice,
  statusWord,
  type Character,
  type Choice,
  type Era,
  type GameEvent,
  type GameState,
  type HistoryModeId,
  type Identity,
} from "./world";

const SAVE_KEY = "shanhe-wanxiang-save-v2";
const monthNames = ["正月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "冬月", "腊月"];
const identityGroupOrder: Identity["group"][] = ["民生", "技艺", "士林", "方外", "江湖", "商旅", "官府", "军政", "宫廷", "自定"];

type Stage = "cover" | "create" | "play" | "ended";
type Tab = "chronicle" | "profile" | "family" | "world";

type Draft = {
  eraId: string;
  modeId: HistoryModeId;
  exactYear: number;
  identityId: string;
  name: string;
  gender: string;
  age: number;
  birthplace: string;
  family: string;
  occupation: string;
  wealth: number;
  goal: string;
};

const defaultDraft: Draft = {
  eraId: "ming",
  modeId: "true",
  exactYear: 1582,
  identityId: "scholar",
  name: "",
  gender: "男",
  age: 16,
  birthplace: "江南一县",
  family: "父母俱在，家中另有一名幼弟；薄田二亩，尚欠一季田租",
  occupation: "随塾师读书，偶尔替人抄写文书",
  wealth: 8,
  goal: "先保全家人，再决定是否求取功名",
};

export default function Game() {
  const [stage, setStage] = useState<Stage>("cover");
  const [tab, setTab] = useState<Tab>("chronicle");
  const [draft, setDraft] = useState<Draft>(defaultDraft);
  const [game, setGame] = useState<GameState | null>(null);
  const [savedGame, setSavedGame] = useState<GameState | null>(null);
  const [restartOpen, setRestartOpen] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(SAVE_KEY);
      if (raw) setSavedGame(JSON.parse(raw) as GameState);
    } catch {
      localStorage.removeItem(SAVE_KEY);
    }
  }, []);

  useEffect(() => {
    if (!game) return;
    localStorage.setItem(SAVE_KEY, JSON.stringify(game));
    setSavedGame(game);
  }, [game]);

  const selectedEra = useMemo(() => eras.find((item) => item.id === draft.eraId) ?? eras[7], [draft.eraId]);
  const selectedIdentity = useMemo(() => identities.find((item) => item.id === draft.identityId) ?? identities.find((item) => item.id === "scholar")!, [draft.identityId]);

  const startGame = () => {
    const era = draft.modeId === "random" ? eras[Math.floor(Math.random() * (eras.length - 1))] : selectedEra;
    const identity = draft.modeId === "random" ? identities[Math.floor(Math.random() * (identities.length - 1))] : selectedIdentity;
    const year = draft.modeId === "random" ? era.defaultYear : draft.exactYear || era.defaultYear;
    const character: Character = {
      name: draft.name.trim(), gender: draft.gender, ageAtStart: draft.age,
      birthplace: draft.birthplace.trim(), family: draft.family.trim(),
      occupation: draft.occupation.trim() || identity.occupation, goal: draft.goal.trim(),
      eraId: era.id, exactYear: year, modeId: draft.modeId, identityId: identity.id,
    };
    const next: GameState = {
      character, year, month: 1, age: draft.age, turn: 0,
      stats: buildInitialStats(identity, draft.wealth), flags: [], resolvedEventIds: [],
      pendingResult: null, currentEventId: null, history: [], people: makePeople(character),
      familyBond: 60, ended: false, ending: null,
    };
    setGame(next); setStage("play"); setTab("chronicle"); window.scrollTo(0, 0);
  };

  const currentEra = game ? (eras.find((item) => item.id === game.character.eraId) ?? eras[9]) : selectedEra;
  const currentIdentity = game ? (identities.find((item) => item.id === game.character.identityId) ?? identities.find((item) => item.id === "custom")!) : selectedIdentity;
  const event = game ? getEvent(game) : null;

  const choose = (choice: Choice) => {
    if (!game || !event || game.pendingResult || game.ended) return;
    const outcome = resolveChoice(game.stats, choice);
    const nextStats = applyEffects(game.stats, outcome.effects);
    const entry = { year: game.year, month: game.month, age: game.age, title: event.title, result: outcome.result };
    setGame({ ...game, stats: nextStats, flags: Array.from(new Set([...game.flags, ...(choice.flags ?? [])])), pendingResult: outcome.result, currentEventId: event.id, history: [entry, ...game.history].slice(0, 500) });
  };

  const advance = () => {
    if (!game || !event) return;
    const month = game.month === 12 ? 1 : game.month + 1;
    const yearPassed = month === 1;
    const age = game.age + (yearPassed ? 1 : 0);
    const livingCost = game.stats.cash > 0 && game.turn % 2 === 1 ? -1 : 0;
    const ageDrift = yearPassed && age >= 45 ? -Math.max(1, Math.floor((age - 40) / 20)) : 0;
    const stats = applyEffects(game.stats, { cash: livingCost, health: ageDrift });
    const resolved = Array.from(new Set([...game.resolvedEventIds, game.currentEventId ?? event.id]));
    const mortalityPressure = age >= 70 ? age - 65 : 0;
    const ended = yearPassed && (stats.health <= 5 || (mortalityPressure > 0 && (game.year + age + game.turn) % 35 < mortalityPressure));
    const ending = ended ? `${game.character.name}卒于${game.year}年${monthNames[game.month - 1]}之后。死因不会被写成“任务失败”；这一生留下的家业、名声、债务、人情和未竟之事仍属于这个世界。` : null;
    setGame({ ...game, year: game.year + (yearPassed ? 1 : 0), month, age, turn: game.turn + 1, stats, resolvedEventIds: resolved, pendingResult: null, currentEventId: null, ended, ending });
    if (ended) setStage("ended");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const loadGame = () => {
    if (!savedGame) return;
    setGame(savedGame); setStage(savedGame.ended ? "ended" : "play"); setTab("chronicle");
  };

  const restart = () => {
    localStorage.removeItem(SAVE_KEY); setGame(null); setSavedGame(null); setRestartOpen(false); setStage("cover"); setTab("chronicle");
  };

  const exportSave = async () => {
    if (!game) return;
    const text = JSON.stringify(game, null, 2);
    try {
      await navigator.clipboard.writeText(text);
      window.alert("《山河万象·历史人生存档》已复制。请保存这段完整文本。");
    } catch {
      window.prompt("复制并保存这份完整存档：", text);
    }
  };

  const importSave = () => {
    const raw = window.prompt("粘贴完整的《山河万象·历史人生存档》：");
    if (!raw) return;
    try {
      const restored = JSON.parse(raw) as GameState;
      if (!restored.character || !Array.isArray(restored.history)) throw new Error("invalid");
      setGame(restored); setStage(restored.ended ? "ended" : "play"); setTab("chronicle");
    } catch {
      window.alert("这不是可识别的完整存档文本。");
    }
  };

  if (stage === "cover") return <Cover savedGame={savedGame} onNew={() => setStage("create")} onContinue={loadGame} onImport={importSave} />;
  if (stage === "create") return <Create draft={draft} setDraft={setDraft} era={selectedEra} identity={selectedIdentity} onBack={() => setStage("cover")} onStart={startGame} />;
  if (!game || !event) return null;
  if (stage === "ended") return <Ending game={game} onExport={exportSave} onRestart={() => setRestartOpen(true)} restartOpen={restartOpen} closeRestart={() => setRestartOpen(false)} restart={restart} />;

  return (
    <main className="game-shell">
      <header className="game-header"><div><small>{currentEra.dynasty} · {game.year}年</small><h2>{game.character.name}，{game.age}岁</h2></div><div className="season"><span>{monthNames[game.month - 1]}</span><small>第{game.turn + 1}月</small></div></header>
      <section className="status-strip status-words"><div><small>身份</small><strong>{currentIdentity.label}</strong></div><div><small>家资</small><strong>{game.stats.cash}<i>贯</i></strong></div><div><small>身体</small><strong>{statusWord(game.stats.health, "health")}</strong></div><div><small>名声</small><strong>{statusWord(game.stats.reputation, "reputation")}</strong></div></section>
      {tab === "chronicle" && <Chronicle event={event} game={game} onChoose={choose} onAdvance={advance} />}
      {tab === "profile" && <Profile game={game} era={currentEra} identity={currentIdentity} onExport={exportSave} onRestart={() => setRestartOpen(true)} />}
      {tab === "family" && <Family game={game} />}
      {tab === "world" && <World game={game} era={currentEra} />}
      <nav className="bottom-nav" aria-label="游戏功能">{([ ["chronicle", "卷", "纪事"], ["profile", "人", "命册"], ["family", "族", "家门"], ["world", "域", "天下"] ] as const).map(([id, icon, label]) => <button key={id} className={tab === id ? "active" : ""} onClick={() => { setTab(id); window.scrollTo(0, 0); }}><span>{icon}</span>{label}</button>)}</nav>
      {restartOpen && <RestartModal close={() => setRestartOpen(false)} restart={restart} />}
    </main>
  );
}

function Cover({ savedGame, onNew, onContinue, onImport }: { savedGame: GameState | null; onNew: () => void; onContinue: () => void; onImport: () => void }) {
  return <main className="cover-shell"><div className="mountains" aria-hidden="true"><i /><i /><i /></div><section className="cover-card"><div className="seal">山河</div><p className="eyebrow">V1.0 · 历史锚定型超高自由度世界沙盘</p><h1>山河万象</h1><p className="cover-subtitle">古代人生与帝国权谋模拟器</p><div className="cover-rule" /><blockquote>你不是在玩皇帝。<br />你正在经历一个时代。</blockquote>{savedGame && <button className="continue-button" onClick={onContinue}><small>继续此世</small><strong>{savedGame.character.name} · {savedGame.year}年{monthNames[savedGame.month - 1]}</strong></button>}<button className="primary-button" onClick={onNew}>{savedGame ? "另开一世" : "进入世界"}</button><button className="text-button" onClick={onImport}>恢复文字存档</button><p className="save-hint">世界不是为玩家准备的 · 人生没有统一胜利条件</p></section></main>;
}

function Create({ draft, setDraft, era, identity, onBack, onStart }: { draft: Draft; setDraft: (value: Draft) => void; era: Era; identity: Identity; onBack: () => void; onStart: () => void }) {
  const update = <K extends keyof Draft>(key: K, value: Draft[K]) => setDraft({ ...draft, [key]: value });
  const chooseEra = (item: Era) => setDraft({ ...draft, eraId: item.id, exactYear: item.defaultYear });
  const chooseIdentity = (item: Identity) => setDraft({ ...draft, identityId: item.id, occupation: item.occupation, wealth: item.stats.cash ?? 10 });
  const ready = Boolean(draft.name.trim() && draft.birthplace.trim() && draft.family.trim() && draft.occupation.trim() && draft.goal.trim());
  return <main className="create-shell"><header className="topbar"><button className="ghost-icon" onClick={onBack} aria-label="返回">‹</button><div><span>命册</span><small>世界开始前的身份记录</small></div><span className="step-mark">始</span></header>
    <section className="form-section"><Heading number="01" title="请选择时代" note="可填写具体年份；历史事实优先于新生成内容" /><div className="era-list complete-era-list">{eras.map((item) => <button key={item.id} className={draft.eraId === item.id ? "era-option active" : "era-option"} onClick={() => chooseEra(item)}><strong>{item.label}</strong><small>{item.id === "custom" ? "由具体年份与模式建立世界" : `默认 ${item.defaultYear} 年`}</small></button>)}</div><label className="wide-field">具体年份<input type="number" value={draft.exactYear} onChange={(e) => update("exactYear", Number(e.target.value))} /></label></section>
    <section className="form-section"><Heading number="02" title="历史模式" note="模式改变历史锚点如何约束世界，不会改变现实因果" /><div className="mode-grid">{historyModes.map((item) => <button key={item.id} className={draft.modeId === item.id ? "mode-option active" : "mode-option"} onClick={() => update("modeId", item.id)}><strong>{item.label}</strong><small>{item.description}</small></button>)}</div></section>
    <section className="form-section"><Heading number="03" title="你想从什么身份开始" note="完整保留原设定身份；身份不是职业，户籍、家庭、资源与公众认知分别存在" /><div className="identity-groups">{identityGroupOrder.map((group) => <section className="identity-group" key={group}><h3>{group}</h3><div className="origin-grid complete-origin-grid">{identities.filter((item) => item.group === group).map((item) => <button key={item.id} className={draft.identityId === item.id ? "origin-option active" : "origin-option"} onClick={() => chooseIdentity(item)}><b>{item.label.slice(0, 1)}</b><strong>{item.label}</strong><small>{item.description}</small></button>)}</div></section>)}</div></section>
    <section className="form-section identity-section"><Heading number="04" title="写下这一世" note="系统不会替你决定感受、悔恨或人生目标" /><label>姓名<input value={draft.name} maxLength={12} onChange={(e) => update("name", e.target.value)} placeholder="输入姓名" /></label><div className="segmented" aria-label="性别">{["男", "女", "自定"].map((item) => <button key={item} className={draft.gender === item ? "active" : ""} onClick={() => update("gender", item)}>{item}</button>)}</div><div className="field-pair"><label>年龄<input type="number" min="0" max="90" value={draft.age} onChange={(e) => update("age", Number(e.target.value))} /></label><label>初始财富（贯）<input type="number" min="0" value={draft.wealth} onChange={(e) => update("wealth", Number(e.target.value))} /></label></div><label>籍贯<input value={draft.birthplace} onChange={(e) => update("birthplace", e.target.value)} placeholder="州、府、县或具体村落" /></label><label>家庭情况<textarea value={draft.family} onChange={(e) => update("family", e.target.value)} placeholder="家庭成员、田产、债务、关系" /></label><label>当前职业<input value={draft.occupation} onChange={(e) => update("occupation", e.target.value)} /></label><label>人生目标<textarea value={draft.goal} onChange={(e) => update("goal", e.target.value)} placeholder="目标可在经历中改变" /></label></section>
    <section className="creation-summary"><small>即将进入</small><strong>{era.label} · {draft.exactYear}年 · {historyModes.find((item) => item.id === draft.modeId)?.label}</strong><p>{identity.label}｜{draft.birthplace || "籍贯未定"}｜{draft.age}岁</p></section>
    <div className="sticky-action"><div><small>此世身份</small><strong>{draft.name || "尚未署名"} · {identity.label}</strong></div><button disabled={!ready} onClick={onStart}>世界开始</button></div></main>;
}

function Heading({ number, title, note }: { number: string; title: string; note: string }) { return <div className="section-heading"><span>{number}</span><div><h2>{title}</h2><p>{note}</p></div></div>; }

function Chronicle({ event, game, onChoose, onAdvance }: { event: GameEvent; game: GameState; onChoose: (choice: Choice) => void; onAdvance: () => void }) {
  return <><section className="chronicle-card"><div className="date-rail"><span>{game.year}</span><b>{monthNames[game.month - 1]}</b><i /></div><article><p className="location">{event.location}</p><h3>{event.title}</h3>{event.paragraphs.map((paragraph, index) => <p key={`${event.id}-${index}`}>{paragraph}</p>)}{!game.pendingResult ? <div className="choices">{event.choices.map((choice, index) => <button key={choice.label} onClick={() => onChoose(choice)}><b>{["一", "二", "三"][index]}</b><span><strong>{choice.label}</strong><small>{choice.hint}</small></span></button>)}</div> : <div className="result-box"><span>此事已发生</span><p>{game.pendingResult}</p><small>结果不会显示后台数值；它已进入人物记忆与历史连续性。</small><button className="next-turn" onClick={onAdvance}>进入下个月</button></div>}</article></section><section className="world-whisper"><span>你能听到的传闻</span><p>{event.rumor ?? "这个月没有可靠的远方消息抵达。"}</p></section>{game.history.length > 0 && <section className="recent-history"><h3>近事</h3>{game.history.slice(0, 3).map((item, index) => <div key={`${item.year}-${item.month}-${index}`}><time>{item.year}年 · {monthNames[item.month - 1]}</time><p><strong>{item.title}</strong>{item.result}</p></div>)}</section>}</>;
}

function Profile({ game, era, identity, onExport, onRestart }: { game: GameState; era: Era; identity: Identity; onExport: () => void; onRestart: () => void }) {
  return <section className="tab-page"><div className="profile-hero"><div className="name-seal">{game.character.name.slice(0, 1)}</div><div><p>{era.dynasty} · {game.character.birthplace}</p><h2>{game.character.name}</h2><small>{game.character.gender} · {game.age}岁 · {identity.label}</small></div></div><div className="life-aim"><span>长期目标</span><strong>{game.character.goal}</strong><p>目标可以改变；系统不会替你决定内心。</p></div><h3 className="page-title">《山河万象·人生状态》</h3><dl className="state-ledger"><div><dt>时代</dt><dd>{era.label} · {game.year}年</dd></div><div><dt>年龄</dt><dd>{game.age}岁</dd></div><div><dt>身份</dt><dd>{identity.label}</dd></div><div><dt>籍贯/所在地</dt><dd>{game.character.birthplace}</dd></div><div><dt>家庭</dt><dd>{game.character.family}</dd></div><div><dt>财富</dt><dd>{game.stats.cash}贯现钱 · {game.stats.grain}石粮 · {game.stats.land}亩地</dd></div><div><dt>社会身份</dt><dd>{identity.social}</dd></div><div><dt>职业</dt><dd>{game.character.occupation}</dd></div><div><dt>名声</dt><dd>{statusWord(game.stats.reputation, "reputation")}</dd></div><div><dt>人际网络</dt><dd>{statusWord(game.stats.connections, "connections")}</dd></div><div><dt>当前处境</dt><dd>{statusWord(game.stats.health, "health")}；{statusWord(game.stats.risk, "risk")}</dd></div><div><dt>已知重大事件</dt><dd>{game.history.length ? game.history.slice(0, 4).map((item) => item.title).join("、") : "暂无"}</dd></div></dl><h3 className="page-title">生平纪事</h3><div className="history-book">{game.history.length ? game.history.map((item, index) => <div key={`${item.year}-${item.month}-${index}`}><time>{item.year}年 · {monthNames[item.month - 1]} · {item.age}岁</time><p><strong>{item.title}</strong>{item.result}</p></div>) : <p>命册新启，尚无旧事。</p>}</div><div className="save-actions"><button onClick={onExport}>生成文字存档</button><button onClick={onRestart}>舍弃此世</button></div></section>;
}

function Family({ game }: { game: GameState }) {
  return <section className="tab-page"><div className="family-banner"><span>家门</span><h2>{game.character.name.slice(0, 1)}氏家中</h2><p>{game.character.birthplace}</p></div><div className="family-truth"><h3>开局家庭情况</h3><p>{game.character.family}</p></div><div className="house-grid"><div><small>现钱</small><strong>{game.stats.cash}贯</strong></div><div><small>存粮</small><strong>{game.stats.grain}石</strong></div><div><small>土地</small><strong>{game.stats.land}亩</strong></div></div><h3 className="page-title">你所认识的人</h3>{game.people.map((person) => <div className="relation-card" key={person.id}><b>{person.name.slice(0, 1)}</b><div><strong>{person.name}</strong><small>{person.publicIdentity} · {person.knownAttitude}</small>{person.memory.length > 0 && <p>{person.memory.at(-1)}</p>}</div></div>)}<div className="system-note"><span>视角限制</span><p>这里只显示你合理知道的身份、态度与共同经历。真实目标、恐惧、派系和计划不会直接展示。</p></div></section>;
}

function World({ game, era }: { game: GameState; era: Era }) {
  const report = monthlyReport(game, era);
  return <section className="tab-page"><div className="world-banner"><small>{game.year}年 · {monthNames[game.month - 1]}</small><h2>天下近况</h2><p>消息受距离、身份、识字、人脉和传递时间限制。</p></div><div className="monthly-report">{report.map(([label, text]) => <article key={label}><span>{label}</span><p>{text}</p></article>)}</div><div className="system-note"><span>历史连续性</span><p>已经发生的行为、确认的事实、人物记忆与存档记录不会为了制造剧情被抹去。</p></div></section>;
}

function Ending({ game, onExport, onRestart, restartOpen, closeRestart, restart }: { game: GameState; onExport: () => void; onRestart: () => void; restartOpen: boolean; closeRestart: () => void; restart: () => void }) {
  return <main className="ending-shell"><section><span className="mini-seal">终</span><p>一生至此</p><h1>{game.character.name}</h1><blockquote>{game.ending}</blockquote><div className="ending-summary"><p>生于：{game.character.exactYear}年</p><p>终于：{game.year}年</p><p>享年：{game.age}岁</p><p>留下纪事：{game.history.length}件</p></div><button className="primary-button" onClick={onExport}>保存这一生</button><button className="text-button" onClick={onRestart}>由家族或新人继续时代</button></section>{restartOpen && <RestartModal close={closeRestart} restart={restart} />}</main>;
}

function RestartModal({ close, restart }: { close: () => void; restart: () => void }) { return <div className="modal-backdrop" role="dialog" aria-modal="true"><div className="ink-modal"><span className="mini-seal">止</span><h3>舍弃当前存档？</h3><p>这一操作会删除本机保存的命册。建议先生成文字存档。</p><div><button onClick={close}>返回</button><button className="danger" onClick={restart}>确认舍弃</button></div></div></div>; }
