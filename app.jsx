// 2026 INEVITABLE SUCCESS SYSTEM - V4 FINAL
const { useState, useEffect, useMemo } = React;

const App = () => {
  const [darkMode, setDarkMode] = useState(() => JSON.parse(localStorage.getItem('inv_dark') ?? 'true'));
  const [activeTab, setActiveTab] = useState('today');
  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  const [modal, setModal] = useState(null);
  const [editConsult, setEditConsult] = useState(null);
  const [account, setAccount] = useState(() => JSON.parse(localStorage.getItem('inv_account') ?? '{"name":"Advisor","email":""}'));

  const theme = darkMode ? {
    bg: 'linear-gradient(135deg, #0a0a0f, #1a1a2e, #16213e)', card: 'rgba(30,41,59,0.5)', border: 'rgba(255,255,255,0.05)',
    text: '#e0e0e0', muted: '#6b7280', accent: '#2dd4bf', accent2: '#a78bfa', input: 'rgba(0,0,0,0.3)'
  } : {
    bg: 'linear-gradient(135deg, #f8fafc, #e2e8f0, #cbd5e1)', card: 'rgba(255,255,255,0.8)', border: 'rgba(0,0,0,0.1)',
    text: '#1e293b', muted: '#64748b', accent: '#0d9488', accent2: '#7c3aed', input: 'rgba(255,255,255,0.8)'
  };

  const avatars = [
    { id: 'default', icon: '👤', name: 'Rookie', lvl: 1 }, { id: 'warrior', icon: '⚔️', name: 'Warrior', lvl: 3 },
    { id: 'sage', icon: '🧙', name: 'Sage', lvl: 5 }, { id: 'champion', icon: '🏆', name: 'Champion', lvl: 7 },
    { id: 'phoenix', icon: '🔥', name: 'Phoenix', lvl: 10 }, { id: 'diamond', icon: '💎', name: 'Diamond', lvl: 15 },
    { id: 'crown', icon: '👑', name: 'King', lvl: 20 }, { id: 'dragon', icon: '🐉', name: 'Dragon', lvl: 50 }
  ];

  const cats = {
    sales: { icon: '📈', name: 'Sales', color: '#22c55e', grad: 'linear-gradient(135deg,#22c55e,#16a34a)' },
    mindset: { icon: '🧠', name: 'Mindset', color: '#a78bfa', grad: 'linear-gradient(135deg,#a78bfa,#7c3aed)' },
    discipline: { icon: '⚔️', name: 'Discipline', color: '#ef4444', grad: 'linear-gradient(135deg,#ef4444,#dc2626)' },
    growth: { icon: '📚', name: 'Growth', color: '#3b82f6', grad: 'linear-gradient(135deg,#3b82f6,#2563eb)' },
    health: { icon: '💪', name: 'Health', color: '#ec4899', grad: 'linear-gradient(135deg,#ec4899,#db2777)' },
    planning: { icon: '🎯', name: 'Planning', color: '#2dd4bf', grad: 'linear-gradient(135deg,#2dd4bf,#14b8a6)' }
  };

  const defQuests = [
    { id: 'h1', name: 'Cold Exposure', desc: 'Cold shower', xp: 40, cat: 'health', on: true, neg: false },
    { id: 'h2', name: 'Morning Sunlight', desc: '10 min sun', xp: 35, cat: 'health', on: true, neg: false },
    { id: 'h3', name: 'Fasted Until 13:00', desc: 'Only kefir', xp: 30, cat: 'discipline', on: true, neg: false },
    { id: 'h4', name: '10,000 Steps', desc: 'Movement', xp: 50, cat: 'health', on: true, neg: false },
    { id: 'h5', name: 'Sleep by 22:30', desc: 'Recovery', xp: 40, cat: 'health', on: true, neg: false },
    { id: 'w1', name: 'Morning Ritual', desc: 'Prayer & viz', xp: 50, cat: 'mindset', on: true, neg: false },
    { id: 'w2', name: 'Script Practice', desc: '20 min', xp: 40, cat: 'sales', on: true, neg: false },
    { id: 'w3', name: '5 Prospecting Calls', desc: 'Outbound', xp: 60, cat: 'sales', on: true, neg: false },
    { id: 'w4', name: 'Client Consultation', desc: 'Meeting', xp: 100, cat: 'sales', on: true, neg: false, main: true },
    { id: 'w5', name: 'CRM Update', desc: 'Log activities', xp: 25, cat: 'planning', on: true, neg: false },
    { id: 'w6', name: 'Read 20 Pages', desc: 'Books', xp: 35, cat: 'growth', on: true, neg: false },
    { id: 'w7', name: 'No Phone Office', desc: 'Deep work', xp: 30, cat: 'discipline', on: true, neg: false },
    { id: 'p1', name: 'Evening Review', desc: 'Plan tomorrow', xp: 40, cat: 'planning', on: true, neg: false },
    { id: 'n1', name: '🚬 Smoked', desc: 'Cigarettes', xp: -50, cat: 'health', on: true, neg: true },
    { id: 'n2', name: '🍺 Alcohol', desc: 'Weekday', xp: -40, cat: 'discipline', on: true, neg: true },
    { id: 'n3', name: '🍔 Junk Food', desc: 'Binge', xp: -30, cat: 'health', on: true, neg: true },
    { id: 'n4', name: '📱 Doomscroll', desc: '1hr+', xp: -35, cat: 'discipline', on: true, neg: true },
    { id: 'n5', name: '😴 Slept Late', desc: 'Past 9am', xp: -25, cat: 'discipline', on: true, neg: true },
    { id: 'n6', name: '🎮 Gaming 3hr+', desc: 'Excessive', xp: -30, cat: 'discipline', on: false, neg: true },
    { id: 'n7', name: '💸 Impulse Buy', desc: '>50CHF', xp: -35, cat: 'discipline', on: false, neg: true },
    { id: 'n8', name: '😤 Lost Temper', desc: 'Anger', xp: -40, cat: 'mindset', on: false, neg: true },
    { id: 'n9', name: '📺 Netflix 3hr+', desc: 'Binge', xp: -25, cat: 'discipline', on: false, neg: true },
  ];

  const defAchievements = [
    { id: 'q1', name: 'First Steps', icon: '🎯', desc: 'Complete 1 quest', cond: 'quest_1', unlocked: false },
    { id: 'd1', name: 'Closer', icon: '🤝', desc: 'First deal', cond: 'deal_1', unlocked: false },
    { id: 's3', name: 'Hat Trick', icon: '🎩', desc: '3-day streak', cond: 'streak_3', unlocked: false },
    { id: 's7', name: 'Week Warrior', icon: '🔥', desc: '7-day streak', cond: 'streak_7', unlocked: false },
    { id: 's30', name: 'Month Master', icon: '🌟', desc: '30-day streak', cond: 'streak_30', unlocked: false },
    { id: 'i5', name: 'Getting Started', icon: '💵', desc: '5K CHF/month', cond: 'income_5000', unlocked: false },
    { id: 'i8', name: 'Momentum', icon: '💰', desc: '8K CHF/month', cond: 'income_8000', unlocked: false },
    { id: 'i10', name: '10K Club', icon: '🏆', desc: '10K CHF/month', cond: 'income_10000', unlocked: false },
    { id: 'i15', name: 'High Roller', icon: '💎', desc: '15K CHF/month', cond: 'income_15000', unlocked: false },
    { id: 'dd5', name: 'Deal Maker', icon: '✋', desc: '5 deals', cond: 'deals_5', unlocked: false },
    { id: 'dd10', name: 'Double Digits', icon: '🔟', desc: '10 deals', cond: 'deals_10', unlocked: false },
    { id: 'x1', name: 'XP Hunter', icon: '⚡', desc: '1,000 XP', cond: 'xp_1000', unlocked: false },
    { id: 'x5', name: 'XP Warrior', icon: '🗡️', desc: '5,000 XP', cond: 'xp_5000', unlocked: false },
    { id: 'l5', name: 'Rising Star', icon: '⭐', desc: 'Level 5', cond: 'level_5', unlocked: false },
    { id: 'l10', name: 'Expert', icon: '🌟', desc: 'Level 10', cond: 'level_10', unlocked: false },
    { id: 'sc', name: 'Perfect Script', icon: '📜', desc: '10/10 adherence', cond: 'script_10', unlocked: false },
    { id: 'sk', name: 'Specialist', icon: '🎓', desc: 'Skill level 5', cond: 'skill_5', unlocked: false },
  ];

  const [player, setPlayer] = useState(() => JSON.parse(localStorage.getItem('inv_player') ?? '{"level":1,"totalXP":0,"currentXP":0,"streak":{"current":0,"best":0},"avatar":"default"}'));
  const [incSet, setIncSet] = useState(() => JSON.parse(localStorage.getItem('inv_income') ?? '{"base":4166,"target":10000,"deals":4,"consults":15}'));
  const [skillXP, setSkillXP] = useState(() => JSON.parse(localStorage.getItem('inv_skills') ?? '{"sales":0,"mindset":0,"discipline":0,"growth":0,"health":0,"planning":0}'));
  const [questLib, setQuestLib] = useState(() => JSON.parse(localStorage.getItem('inv_quests') ?? JSON.stringify(defQuests)));
  const [todayQ, setTodayQ] = useState(() => JSON.parse(localStorage.getItem('inv_today') ?? JSON.stringify(defQuests.filter(q=>q.on).map(q=>({...q,done:false})))));
  const [deals, setDeals] = useState(() => JSON.parse(localStorage.getItem('inv_deals') ?? '[]'));
  const [consults, setConsults] = useState(() => JSON.parse(localStorage.getItem('inv_consults') ?? '[]'));
  const [whoop, setWhoop] = useState(() => JSON.parse(localStorage.getItem('inv_whoop') ?? '{"recovery":70,"sleep":80,"strain":10,"hrv":55}'));
  const [review, setReview] = useState(() => JSON.parse(localStorage.getItem('inv_review') ?? '[{"t":"Review goals","c":false},{"t":"Script adherence","c":false},{"t":"Update income","c":false},{"t":"Plan next week","c":false},{"t":"Priority consults","c":false},{"t":"Monday calls","c":false},{"t":"Yearly goals","c":false}]'));
  const [achievements, setAchievements] = useState(() => JSON.parse(localStorage.getItem('inv_ach') ?? JSON.stringify(defAchievements)));
  const [newDeal, setNewDeal] = useState({ client: '', product: '', commission: '' });
  const [newConsult, setNewConsult] = useState({ client: '', type: 'Pension', status: 'scheduled', script: '' });
  const [newQuest, setNewQuest] = useState({ name: '', desc: '', xp: 30, cat: 'discipline', neg: false });

  // Save
  useEffect(() => { localStorage.setItem('inv_dark', JSON.stringify(darkMode)); }, [darkMode]);
  useEffect(() => { localStorage.setItem('inv_account', JSON.stringify(account)); }, [account]);
  useEffect(() => { localStorage.setItem('inv_player', JSON.stringify(player)); }, [player]);
  useEffect(() => { localStorage.setItem('inv_income', JSON.stringify(incSet)); }, [incSet]);
  useEffect(() => { localStorage.setItem('inv_skills', JSON.stringify(skillXP)); }, [skillXP]);
  useEffect(() => { localStorage.setItem('inv_quests', JSON.stringify(questLib)); }, [questLib]);
  useEffect(() => { localStorage.setItem('inv_today', JSON.stringify(todayQ)); }, [todayQ]);
  useEffect(() => { localStorage.setItem('inv_deals', JSON.stringify(deals)); }, [deals]);
  useEffect(() => { localStorage.setItem('inv_consults', JSON.stringify(consults)); }, [consults]);
  useEffect(() => { localStorage.setItem('inv_whoop', JSON.stringify(whoop)); }, [whoop]);
  useEffect(() => { localStorage.setItem('inv_review', JSON.stringify(review)); }, [review]);
  useEffect(() => { localStorage.setItem('inv_ach', JSON.stringify(achievements)); }, [achievements]);

  // Computed
  const commission = deals.reduce((s, d) => s + (d.commission || 0), 0);
  const income = incSet.base + commission;
  const posQ = todayQ.filter(q => !q.neg);
  const negQ = todayQ.filter(q => q.neg);
  const donePos = posQ.filter(q => q.done).length;
  const doneNeg = negQ.filter(q => q.done).length;
  const earnedXP = posQ.filter(q => q.done).reduce((s, q) => s + q.xp, 0);
  const lostXP = negQ.filter(q => q.done).reduce((s, q) => s + Math.abs(q.xp), 0);
  const netXP = earnedXP - lostXP;
  const avatar = avatars.find(a => a.id === player.avatar) || avatars[0];
  const skillLvls = useMemo(() => {
    const l = {};
    Object.keys(skillXP).forEach(k => { l[k] = { xp: skillXP[k], lvl: Math.floor(skillXP[k] / 300) + 1, prog: (skillXP[k] % 300) / 300 }; });
    return l;
  }, [skillXP]);

  // Achievement check
  const checkAch = () => {
    setAchievements(prev => prev.map(a => {
      if (a.unlocked) return a;
      let u = false;
      if (a.cond === 'quest_1' && donePos >= 1) u = true;
      if (a.cond === 'deal_1' && deals.length >= 1) u = true;
      if (a.cond === 'deals_5' && deals.length >= 5) u = true;
      if (a.cond === 'deals_10' && deals.length >= 10) u = true;
      if (a.cond === 'streak_3' && player.streak.current >= 3) u = true;
      if (a.cond === 'streak_7' && player.streak.current >= 7) u = true;
      if (a.cond === 'streak_30' && player.streak.current >= 30) u = true;
      if (a.cond === 'income_5000' && income >= 5000) u = true;
      if (a.cond === 'income_8000' && income >= 8000) u = true;
      if (a.cond === 'income_10000' && income >= 10000) u = true;
      if (a.cond === 'income_15000' && income >= 15000) u = true;
      if (a.cond === 'xp_1000' && player.totalXP >= 1000) u = true;
      if (a.cond === 'xp_5000' && player.totalXP >= 5000) u = true;
      if (a.cond === 'level_5' && player.level >= 5) u = true;
      if (a.cond === 'level_10' && player.level >= 10) u = true;
      if (a.cond === 'script_10' && consults.some(c => c.script >= 10)) u = true;
      if (a.cond === 'skill_5' && Object.values(skillLvls).some(s => s.lvl >= 5)) u = true;
      if (u && !a.unlocked) { setTimeout(() => toast(`🏆 ${a.name}!`), 500); return { ...a, unlocked: true }; }
      return a;
    }));
  };
  useEffect(() => { checkAch(); }, [deals, consults, player, skillXP, income]);

  // Handlers
  const toast = (m) => { setToastMsg(m); setShowToast(true); setTimeout(() => setShowToast(false), 3000); };
  
  const calcLvl = (xp) => {
    const lvl = Math.floor(xp / 500) + 1;
    const titles = ['Beginner','Beginner','Apprentice','Apprentice','Advisor','Advisor','Trusted Advisor','Trusted Advisor','Trusted Advisor','Expert','Expert','Expert','Expert','Expert','Master','Master','Master','Master','Master','Elite'];
    return { level: lvl, currentXP: xp % 500, title: titles[Math.min(lvl - 1, titles.length - 1)] };
  };

  const toggleQ = (id) => {
    setTodayQ(prev => prev.map(q => {
      if (q.id === id) {
        const done = !q.done;
        setPlayer(p => {
          let xp = done ? p.totalXP + q.xp : p.totalXP - q.xp;
          xp = Math.max(0, xp);
          const { level, currentXP, title } = calcLvl(xp);
          return { ...p, totalXP: xp, level, currentXP, title };
        });
        if (!q.neg) setSkillXP(prev => ({ ...prev, [q.cat]: Math.max(0, prev[q.cat] + (done ? q.xp : -q.xp)) }));
        if (done) toast(q.neg ? `${q.xp} XP 😔` : `+${q.xp} XP ✓`);
        return { ...q, done };
      }
      return q;
    }));
  };

  const addDeal = () => {
    if (!newDeal.client) return;
    setDeals(p => [...p, { id: 'd' + Date.now(), date: new Date().toISOString().slice(0,10), ...newDeal, commission: +newDeal.commission || 0 }]);
    setNewDeal({ client: '', product: '', commission: '' });
    setModal(null);
    toast(`Deal +${newDeal.commission} CHF`);
  };

  const addConsult = () => {
    if (!newConsult.client) return;
    setConsults(p => [...p, { id: 'c' + Date.now(), date: new Date().toISOString().slice(0,10), ...newConsult, script: +newConsult.script || null }]);
    setNewConsult({ client: '', type: 'Pension', status: 'scheduled', script: '' });
    setModal(null);
    toast('Consultation logged!');
  };

  const updateConsult = () => {
    setConsults(p => p.map(c => c.id === editConsult.id ? editConsult : c));
    setEditConsult(null);
    setModal(null);
    toast('Updated!');
  };

  const addQuest = () => {
    if (!newQuest.name) return;
    const q = { id: 'q' + Date.now(), name: newQuest.name, desc: newQuest.desc, xp: newQuest.neg ? -Math.abs(+newQuest.xp) : Math.abs(+newQuest.xp), cat: newQuest.cat, on: true, neg: newQuest.neg };
    setQuestLib(p => [...p, q]);
    setTodayQ(p => [...p, { ...q, done: false }]);
    setNewQuest({ name: '', desc: '', xp: 30, cat: 'discipline', neg: false });
    setModal(null);
    toast('Quest added!');
  };

  const selectAvatar = (id) => {
    const a = avatars.find(x => x.id === id);
    if (a && player.level >= a.lvl) { setPlayer(p => ({ ...p, avatar: id })); toast(`Avatar: ${a.name}`); }
    else toast(`Unlock at Lv ${a?.lvl}`);
  };

  // Charts
  const MiniChart = ({ data, k, color, h = 50 }) => {
    if (!data?.length) return null;
    const vals = data.map(d => d[k]), min = Math.min(...vals), max = Math.max(...vals), r = max - min || 1;
    const pts = data.map((d, i) => `${5 + (i / (data.length - 1)) * 90},${5 + (h - 10) - ((d[k] - min) / r) * (h - 10)}`).join(' ');
    return <svg viewBox={`0 0 100 ${h}`} style={{ width: '100%', height: h }}>
      <defs><linearGradient id={`g${k}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={color} stopOpacity="0.3"/><stop offset="100%" stopColor={color} stopOpacity="0"/></linearGradient></defs>
      <polygon points={`5,${h-5} ${pts} 95,${h-5}`} fill={`url(#g${k})`}/><polyline points={pts} fill="none" stroke={color} strokeWidth="2"/>
      {data.map((d, i) => <circle key={i} cx={5 + (i / (data.length - 1)) * 90} cy={5 + (h - 10) - ((d[k] - min) / r) * (h - 10)} r="2.5" fill={color}/>)}
    </svg>;
  };

  const whoopHist = [{ d: '1', recovery: 68 }, { d: '2', recovery: 75 }, { d: '3', recovery: 82 }, { d: '4', recovery: 71 }, { d: '5', recovery: 65 }, { d: '6', recovery: 78 }, { d: '7', recovery: 72 }];
  const monthHist = [{ m: 'Aug', income: 7200 }, { m: 'Sep', income: 7800 }, { m: 'Oct', income: 8500 }, { m: 'Nov', income: 9200 }, { m: 'Dec', income: 8800 }, { m: 'Jan', income }];

  // Styles
  const s = {
    wrap: { minHeight: '100vh', background: theme.bg, fontFamily: 'Inter,-apple-system,sans-serif', color: theme.text, padding: 16, paddingBottom: 100 },
    grid: { position: 'fixed', inset: 0, backgroundImage: `linear-gradient(${theme.border} 1px, transparent 1px), linear-gradient(90deg, ${theme.border} 1px, transparent 1px)`, backgroundSize: '50px 50px', pointerEvents: 'none', zIndex: 0 },
    content: { position: 'relative', zIndex: 1, maxWidth: 1400, margin: '0 auto' },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12, marginBottom: 16 },
    logo: { fontSize: 22, fontWeight: 800, background: `linear-gradient(135deg, ${theme.accent}, ${theme.accent2}, #f472b6)`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' },
    headerR: { display: 'flex', alignItems: 'center', gap: 10 },
    netBadge: { background: netXP >= 0 ? 'rgba(34,197,94,0.2)' : 'rgba(239,68,68,0.2)', border: `1px solid ${netXP >= 0 ? 'rgba(34,197,94,0.3)' : 'rgba(239,68,68,0.3)'}`, borderRadius: 10, padding: '8px 14px', textAlign: 'center' },
    pCard: { background: theme.card, border: `1px solid ${theme.border}`, borderRadius: 12, padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 10 },
    avatar: { width: 42, height: 42, borderRadius: '50%', background: `linear-gradient(135deg, ${theme.accent}, ${theme.accent2})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, cursor: 'pointer', boxShadow: `0 0 15px ${theme.accent}66` },
    xpBar: { width: 100, height: 5, background: 'rgba(0,0,0,0.4)', borderRadius: 3, overflow: 'hidden', marginTop: 4 },
    streak: { background: 'linear-gradient(135deg, #ef4444, #f97316)', padding: '6px 10px', borderRadius: 14, fontSize: 11, fontWeight: 700, color: '#fff' },
    setBtn: { width: 36, height: 36, borderRadius: 8, background: theme.card, border: `1px solid ${theme.border}`, color: theme.muted, fontSize: 16, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' },
    nav: { display: 'flex', gap: 3, background: theme.card, padding: 4, borderRadius: 10, marginBottom: 16, overflowX: 'auto', border: `1px solid ${theme.border}` },
    tab: { padding: '8px 12px', borderRadius: 6, border: 'none', background: 'transparent', color: theme.muted, cursor: 'pointer', fontSize: 10, fontWeight: 600, textTransform: 'uppercase' },
    tabOn: { background: `linear-gradient(135deg, ${theme.accent}33, ${theme.accent2}33)`, color: theme.accent },
    mainG: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 14 },
    card: { background: theme.card, border: `1px solid ${theme.border}`, borderRadius: 12, padding: 16 },
    cHead: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
    cTitle: { fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1.5, display: 'flex', alignItems: 'center', gap: 6 },
    btn: { padding: '6px 10px', borderRadius: 6, border: 'none', fontSize: 9, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' },
    btnP: { background: `linear-gradient(135deg, ${theme.accent}, ${theme.accent2})`, color: darkMode ? '#0a0a0f' : '#fff' },
    btnS: { background: theme.input, color: theme.text, border: `1px solid ${theme.border}` },
    btnD: { background: 'rgba(239,68,68,0.2)', color: '#ef4444' },
    quest: { background: theme.input, border: `1px solid ${theme.border}`, borderRadius: 8, padding: '8px 10px', marginBottom: 5, display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' },
    qDone: { opacity: 0.6, background: `${theme.accent}22`, border: `1px solid ${theme.accent}44` },
    qNeg: { background: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.15)' },
    qNegDone: { background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)' },
    chk: { width: 16, height: 16, borderRadius: 4, border: `2px solid ${theme.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, flexShrink: 0 },
    chkOn: { background: `linear-gradient(135deg, ${theme.accent}, ${theme.accent2})`, border: 'none', color: '#0a0a0f' },
    chkNeg: { background: '#ef4444', border: 'none', color: '#fff' },
    xpB: { background: `${theme.accent2}33`, color: theme.accent2, padding: '2px 6px', borderRadius: 6, fontSize: 8, fontWeight: 700 },
    xpBN: { background: 'rgba(239,68,68,0.2)', color: '#ef4444' },
    stat: { background: theme.input, padding: 10, borderRadius: 8, textAlign: 'center' },
    prog: { height: 5, background: 'rgba(0,0,0,0.3)', borderRadius: 3, overflow: 'hidden', marginTop: 5 },
    modal: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 16 },
    mBox: { background: darkMode ? '#1a1a2e' : '#fff', border: `1px solid ${theme.accent}44`, borderRadius: 12, padding: 18, maxWidth: 420, width: '100%', maxHeight: '85vh', overflow: 'auto' },
    inp: { width: '100%', padding: '10px 12px', borderRadius: 6, border: `1px solid ${theme.border}`, background: theme.input, color: theme.text, fontSize: 13, marginBottom: 10, fontFamily: 'inherit' },
    sel: { width: '100%', padding: '10px 12px', borderRadius: 6, border: `1px solid ${theme.border}`, background: theme.input, color: theme.text, fontSize: 13, marginBottom: 10, fontFamily: 'inherit' },
    toast: { position: 'fixed', bottom: 24, left: '50%', transform: `translateX(-50%) translateY(${showToast ? 0 : 80}px)`, background: `linear-gradient(135deg, ${theme.accent}, ${theme.accent2})`, color: '#0a0a0f', padding: '10px 18px', borderRadius: 10, fontWeight: 700, fontSize: 12, zIndex: 2000, opacity: showToast ? 1 : 0, transition: 'all 0.3s' },
    chartB: { background: theme.input, borderRadius: 8, padding: 10, marginTop: 10 },
    catCard: { padding: 12, borderRadius: 10, cursor: 'pointer', textAlign: 'center', transition: 'all 0.2s', border: '2px solid transparent', boxShadow: '0 4px 15px rgba(0,0,0,0.2)' },
  };

  const Bar = ({ pct, color }) => <div style={s.prog}><div style={{ height: '100%', width: `${Math.min(Math.max(pct, 0), 100)}%`, background: color, borderRadius: 3, transition: 'width 0.3s' }}/></div>;

  const tabs = ['today', 'week', 'month', 'year', 'overview', 'health', 'skills', 'achievements'];

  return (
    <div style={s.wrap}>
      <div style={s.grid}/>
      <div style={s.content}>
        {/* HEADER */}
        <header style={s.header}>
          <div>
            <div style={s.logo}>2026 INEVITABLE</div>
            <div style={{ fontSize: 9, color: theme.muted, letterSpacing: 2 }}>INPUTS → OUTPUTS</div>
          </div>
          <div style={s.headerR}>
            <div style={s.netBadge}>
              <div style={{ fontSize: 7, color: theme.muted }}>TODAY</div>
              <div style={{ fontSize: 16, fontWeight: 800, color: netXP >= 0 ? '#22c55e' : '#ef4444' }}>{netXP >= 0 ? '+' : ''}{netXP} XP</div>
            </div>
            <div style={s.pCard}>
              <div style={s.avatar} onClick={() => setModal('avatar')}>{avatar.icon}</div>
              <div>
                <div style={{ fontSize: 12, fontWeight: 700 }}>Lv {player.level} <span style={{ background: 'linear-gradient(135deg, #f59e0b, #ef4444)', color: '#fff', fontSize: 7, padding: '1px 5px', borderRadius: 6, marginLeft: 4 }}>{player.title || 'Beginner'}</span></div>
                <div style={{ fontSize: 9, color: theme.muted }}>{player.currentXP || 0}/500 XP</div>
                <div style={s.xpBar}><div style={{ height: '100%', width: `${((player.currentXP || 0) / 500) * 100}%`, background: `linear-gradient(90deg, ${theme.accent}, ${theme.accent2})`, borderRadius: 3 }}/></div>
              </div>
              <div style={s.streak}>🔥 {player.streak.current}</div>
            </div>
            <button style={s.setBtn} onClick={() => setModal('settings')}>⚙️</button>
          </div>
        </header>

        {/* NAV */}
        <nav style={s.nav}>
          {tabs.map(t => <button key={t} onClick={() => setActiveTab(t)} style={{ ...s.tab, ...(activeTab === t ? s.tabOn : {}) }}>{t}</button>)}
        </nav>

        {/* TODAY */}
        {activeTab === 'today' && (
          <div style={s.mainG}>
            <div style={s.card}>
              <div style={s.cHead}><div style={s.cTitle}>⚔️ Quests</div><div style={{ display: 'flex', gap: 4 }}><button style={{ ...s.btn, ...s.btnS }} onClick={() => setModal('addQuest')}>+ New</button><button style={{ ...s.btn, ...s.btnS }} onClick={() => setModal('editQuests')}>Edit</button></div></div>
              <div style={{ fontSize: 9, color: theme.muted, marginBottom: 8 }}>{donePos}/{posQ.length} • +{earnedXP} XP</div>
              {posQ.map(q => (
                <div key={q.id} onClick={() => toggleQ(q.id)} style={{ ...s.quest, ...(q.done ? s.qDone : {}) }}>
                  <div style={{ width: 4, height: 4, borderRadius: '50%', background: cats[q.cat]?.color || '#888' }}/>
                  <div style={{ ...s.chk, ...(q.done ? s.chkOn : { borderColor: cats[q.cat]?.color }) }}>{q.done && '✓'}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 11, fontWeight: 600 }}>{q.main && <span style={{ color: '#f59e0b' }}>★ </span>}{q.name}</div>
                    <div style={{ fontSize: 8, color: theme.muted, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{q.desc}</div>
                  </div>
                  <span style={s.xpB}>+{q.xp}</span>
                </div>
              ))}
              <Bar pct={(donePos / posQ.length) * 100} color={theme.accent}/>
            </div>

            <div style={s.card}>
              <div style={s.cHead}><div style={s.cTitle}>⚠️ Vices</div>{doneNeg > 0 && <span style={{ fontSize: 9, color: '#ef4444' }}>-{lostXP}</span>}</div>
              <div style={{ fontSize: 9, color: theme.muted, marginBottom: 8 }}>Check if slipped</div>
              {negQ.map(q => (
                <div key={q.id} onClick={() => toggleQ(q.id)} style={{ ...s.quest, ...s.qNeg, ...(q.done ? s.qNegDone : {}) }}>
                  <div style={{ ...s.chk, ...(q.done ? s.chkNeg : { borderColor: '#ef4444' }) }}>{q.done && '✗'}</div>
                  <div style={{ flex: 1 }}><div style={{ fontSize: 11, fontWeight: 600 }}>{q.name}</div><div style={{ fontSize: 8, color: theme.muted }}>{q.desc}</div></div>
                  <span style={{ ...s.xpB, ...s.xpBN }}>{q.xp}</span>
                </div>
              ))}
            </div>

            <div style={s.card}>
              <div style={s.cHead}><div style={s.cTitle}>💰 Income</div><div style={{ display: 'flex', gap: 4 }}><button style={{ ...s.btn, ...s.btnS }} onClick={() => setModal('incomeSet')}>⚙️</button><button style={{ ...s.btn, ...s.btnS }} onClick={() => setModal('addDeal')}>+ Deal</button></div></div>
              <div style={{ textAlign: 'center', padding: '10px 0' }}>
                <div style={{ fontSize: 32, fontWeight: 800, background: 'linear-gradient(135deg, #2dd4bf, #22c55e)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{income.toLocaleString()}</div>
                <div style={{ fontSize: 10, color: theme.muted }}>of {incSet.target.toLocaleString()} CHF</div>
              </div>
              <Bar pct={(income / incSet.target) * 100} color="#22c55e"/>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6, marginTop: 10 }}>
                <div style={s.stat}><div style={{ fontSize: 18, fontWeight: 800, color: '#22c55e' }}>{deals.length}</div><div style={{ fontSize: 7, color: theme.muted }}>DEALS</div></div>
                <div style={s.stat}><div style={{ fontSize: 18, fontWeight: 800, color: '#f59e0b' }}>{Math.max(0, incSet.deals - deals.length)}</div><div style={{ fontSize: 7, color: theme.muted }}>TO TARGET</div></div>
              </div>
              <div style={s.chartB}><div style={{ fontSize: 8, color: theme.muted, marginBottom: 4 }}>TREND</div><MiniChart data={monthHist} k="income" color="#22c55e" h={45}/></div>
            </div>

            <div style={s.card}>
              <div style={s.cHead}><div style={s.cTitle}>❤️ Whoop</div><button style={{ ...s.btn, ...s.btnS }} onClick={() => setModal('whoop')}>Update</button></div>
              <div style={{ textAlign: 'center', padding: '8px 0' }}>
                <div style={{ fontSize: 42, fontWeight: 800, color: whoop.recovery >= 67 ? '#22c55e' : whoop.recovery >= 34 ? '#f59e0b' : '#ef4444' }}>{whoop.recovery}%</div>
                <div style={{ fontSize: 9, color: theme.muted }}>RECOVERY</div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 6 }}>
                <div style={s.stat}><div style={{ fontSize: 14, fontWeight: 700, color: '#3b82f6' }}>{whoop.sleep}%</div><div style={{ fontSize: 7, color: theme.muted }}>SLEEP</div></div>
                <div style={s.stat}><div style={{ fontSize: 14, fontWeight: 700, color: '#f97316' }}>{whoop.strain}</div><div style={{ fontSize: 7, color: theme.muted }}>STRAIN</div></div>
                <div style={s.stat}><div style={{ fontSize: 14, fontWeight: 700, color: '#a78bfa' }}>{whoop.hrv}</div><div style={{ fontSize: 7, color: theme.muted }}>HRV</div></div>
              </div>
              <div style={s.chartB}><div style={{ fontSize: 8, color: theme.muted, marginBottom: 4 }}>7-DAY</div><MiniChart data={whoopHist} k="recovery" color="#22c55e" h={40}/></div>
            </div>
          </div>
        )}

        {/* WEEK */}
        {activeTab === 'week' && (
          <div style={s.mainG}>
            <div style={s.card}>
              <div style={s.cHead}><div style={s.cTitle}>📅 Weekly</div></div>
              {[{ n: '4 Consultations', p: consults.length, t: 4, c: '#22c55e' }, { n: '1 Deal', p: deals.length, t: 1, c: '#f59e0b' }].map((g, i) => (
                <div key={i} style={{ marginBottom: 14 }}><div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, marginBottom: 3 }}><span style={{ fontWeight: 600 }}>{g.n}</span><span style={{ color: g.c }}>{g.p}/{g.t}</span></div><Bar pct={(g.p / g.t) * 100} color={g.c}/></div>
              ))}
              <button style={{ ...s.btn, ...s.btnS, width: '100%' }} onClick={() => setModal('addConsult')}>+ Log Consultation</button>
            </div>
            <div style={s.card}>
              <div style={s.cHead}><div style={s.cTitle}>📝 Sunday Review</div></div>
              {review.map((r, i) => (
                <div key={i} onClick={() => setReview(p => p.map((x, j) => j === i ? { ...x, c: !x.c } : x))} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: 6, background: theme.input, borderRadius: 5, marginBottom: 3, cursor: 'pointer', opacity: r.c ? 0.6 : 1 }}>
                  <div style={{ width: 12, height: 12, borderRadius: 3, border: r.c ? 'none' : `2px solid ${theme.muted}`, background: r.c ? theme.accent : 'transparent', fontSize: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0a0a0f' }}>{r.c && '✓'}</div>
                  <span style={{ fontSize: 9, textDecoration: r.c ? 'line-through' : 'none' }}>{r.t}</span>
                </div>
              ))}
            </div>
            <div style={{ ...s.card, gridColumn: '1 / -1' }}>
              <div style={s.cHead}><div style={s.cTitle}>📞 Consultations</div><button style={{ ...s.btn, ...s.btnP }} onClick={() => setModal('addConsult')}>+ Add</button></div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 8 }}>
                {consults.map(c => (
                  <div key={c.id} onClick={() => { setEditConsult({...c}); setModal('editConsult'); }} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 10, background: theme.input, borderRadius: 8, cursor: 'pointer' }}>
                    <div><div style={{ fontSize: 11, fontWeight: 600 }}>{c.client}</div><div style={{ fontSize: 8, color: theme.muted }}>{c.type} • Script: {c.script || '-'}/10</div></div>
                    <div style={{ fontSize: 8, padding: '2px 6px', borderRadius: 6, background: c.status === 'closed' ? 'rgba(34,197,94,0.2)' : 'rgba(255,255,255,0.1)', color: c.status === 'closed' ? '#22c55e' : theme.muted, textTransform: 'uppercase', fontWeight: 600 }}>{c.status}</div>
                  </div>
                ))}
                {consults.length === 0 && <div style={{ color: theme.muted, fontSize: 11, padding: 20 }}>No consultations yet</div>}
              </div>
            </div>
          </div>
        )}

        {/* MONTH */}
        {activeTab === 'month' && (
          <div style={s.mainG}>
            <div style={s.card}>
              <div style={s.cHead}><div style={s.cTitle}>🗓️ Monthly</div></div>
              {[{ n: `${incSet.target.toLocaleString()} CHF`, p: income, t: incSet.target, c: '#22c55e' }, { n: `${incSet.deals} Deals`, p: deals.length, t: incSet.deals, c: '#f59e0b' }].map((g, i) => (
                <div key={i} style={{ marginBottom: 14 }}><div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, marginBottom: 3 }}><span style={{ fontWeight: 600 }}>{g.n}</span><span style={{ color: g.c }}>{Math.round((g.p / g.t) * 100)}%</span></div><Bar pct={(g.p / g.t) * 100} color={g.c}/></div>
              ))}
            </div>
            <div style={s.card}>
              <div style={s.cHead}><div style={s.cTitle}>💵 Breakdown</div></div>
              <div style={{ padding: 8, background: theme.input, borderRadius: 6, marginBottom: 4, display: 'flex', justifyContent: 'space-between', fontSize: 11 }}><span>Base</span><span>{incSet.base.toLocaleString()}</span></div>
              <div style={{ padding: 8, background: theme.input, borderRadius: 6, marginBottom: 4, display: 'flex', justifyContent: 'space-between', fontSize: 11 }}><span>Commission</span><span style={{ color: '#22c55e' }}>+{commission.toLocaleString()}</span></div>
              <div style={{ padding: 8, background: `${theme.accent}22`, borderRadius: 6, display: 'flex', justifyContent: 'space-between', fontSize: 12, fontWeight: 700 }}><span>Total</span><span style={{ color: theme.accent }}>{income.toLocaleString()}</span></div>
            </div>
          </div>
        )}

        {/* YEAR */}
        {activeTab === 'year' && (
          <div style={s.card}>
            <div style={s.cHead}><div style={s.cTitle}>🎯 2026 Vision</div></div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 10 }}>
              {[{ n: '120K Annual', d: '10k/month', p: income, t: 10000, c: '#22c55e' }, { n: '48 Deals', d: '4/month', p: deals.length, t: 4, c: '#f59e0b' }, { n: '365 Streak', d: 'Vitality', p: player.streak.current, t: 365, c: '#a78bfa' }].map((g, i) => (
                <div key={i} style={{ background: theme.input, borderRadius: 10, padding: 12 }}><div style={{ fontSize: 13, fontWeight: 700 }}>{g.n}</div><div style={{ fontSize: 9, color: theme.muted, marginBottom: 8 }}>{g.d}</div><Bar pct={(g.p / g.t) * 100} color={g.c}/></div>
              ))}
            </div>
          </div>
        )}

        {/* OVERVIEW */}
        {activeTab === 'overview' && (
          <div style={s.mainG}>
            <div style={s.card}>
              <div style={s.cHead}><div style={s.cTitle}>📊 Summary</div></div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 6 }}>
                <div style={{ ...s.stat, background: 'rgba(34,197,94,0.1)' }}><div style={{ fontSize: 20, fontWeight: 800, color: '#22c55e' }}>{income.toLocaleString()}</div><div style={{ fontSize: 7, color: theme.muted }}>INCOME</div></div>
                <div style={{ ...s.stat, background: 'rgba(167,139,250,0.1)' }}><div style={{ fontSize: 20, fontWeight: 800, color: '#a78bfa' }}>{player.totalXP.toLocaleString()}</div><div style={{ fontSize: 7, color: theme.muted }}>XP</div></div>
                <div style={{ ...s.stat, background: 'rgba(245,158,11,0.1)' }}><div style={{ fontSize: 20, fontWeight: 800, color: '#f59e0b' }}>{deals.length}</div><div style={{ fontSize: 7, color: theme.muted }}>DEALS</div></div>
                <div style={{ ...s.stat, background: 'rgba(59,130,246,0.1)' }}><div style={{ fontSize: 20, fontWeight: 800, color: '#3b82f6' }}>{consults.length}</div><div style={{ fontSize: 7, color: theme.muted }}>CONSULTS</div></div>
              </div>
            </div>
            <div style={s.card}>
              <div style={s.cHead}><div style={s.cTitle}>🔥 Streaks</div></div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: 10, background: theme.input, borderRadius: 8, marginBottom: 6 }}><span style={{ fontSize: 24 }}>🔥</span><div style={{ flex: 1, fontSize: 11, fontWeight: 600 }}>Current</div><div style={{ fontSize: 24, fontWeight: 800, color: '#ef4444' }}>{player.streak.current}</div></div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: 10, background: theme.input, borderRadius: 8 }}><span style={{ fontSize: 24 }}>⭐</span><div style={{ flex: 1, fontSize: 11, fontWeight: 600 }}>Best</div><div style={{ fontSize: 24, fontWeight: 800, color: '#f59e0b' }}>{player.streak.best}</div></div>
            </div>
          </div>
        )}

        {/* HEALTH */}
        {activeTab === 'health' && (
          <div style={s.mainG}>
            <div style={s.card}>
              <div style={s.cHead}><div style={s.cTitle}>❤️ Whoop</div><button style={{ ...s.btn, ...s.btnS }} onClick={() => setModal('whoop')}>Update</button></div>
              <div style={{ textAlign: 'center', padding: '12px 0' }}>
                <div style={{ fontSize: 56, fontWeight: 800, color: whoop.recovery >= 67 ? '#22c55e' : whoop.recovery >= 34 ? '#f59e0b' : '#ef4444' }}>{whoop.recovery}%</div>
                <div style={{ fontSize: 10, color: theme.muted }}>{whoop.recovery >= 67 ? '🟢 Push!' : whoop.recovery >= 34 ? '🟡 Normal' : '🔴 Rest'}</div>
              </div>
            </div>
            <div style={s.card}>
              <div style={s.cHead}><div style={s.cTitle}>💪 Health Habits</div></div>
              {todayQ.filter(q => q.cat === 'health' && !q.neg).map(q => (
                <div key={q.id} onClick={() => toggleQ(q.id)} style={{ ...s.quest, ...(q.done ? s.qDone : {}) }}>
                  <div style={{ ...s.chk, ...(q.done ? s.chkOn : { borderColor: '#ec4899' }) }}>{q.done && '✓'}</div>
                  <div style={{ flex: 1, fontSize: 11, fontWeight: 600 }}>{q.name}</div>
                  <span style={s.xpB}>+{q.xp}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SKILLS */}
        {activeTab === 'skills' && (
          <div style={s.mainG}>
            <div style={s.card}>
              <div style={s.cHead}><div style={s.cTitle}>⚡ Skill Trees</div></div>
              <div style={{ fontSize: 9, color: theme.muted, marginBottom: 12 }}>XP from category quests</div>
              {Object.entries(cats).map(([k, v]) => (
                <div key={k} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: 10, background: theme.input, borderRadius: 8, marginBottom: 6 }}>
                  <div style={{ fontSize: 20, width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', background: v.grad, borderRadius: 8 }}>{v.icon}</div>
                  <div style={{ flex: 1 }}><div style={{ fontSize: 11, fontWeight: 600 }}>{v.name}</div><div style={{ fontSize: 9, color: theme.muted }}>Lv {skillLvls[k]?.lvl || 1} • {skillLvls[k]?.xp || 0} XP</div></div>
                  <div style={{ width: 60, height: 5, background: 'rgba(0,0,0,0.3)', borderRadius: 3, overflow: 'hidden' }}><div style={{ height: '100%', width: `${(skillLvls[k]?.prog || 0) * 100}%`, background: v.color, borderRadius: 3 }}/></div>
                </div>
              ))}
            </div>
            <div style={s.card}>
              <div style={s.cHead}><div style={s.cTitle}>📊 XP</div></div>
              <div style={{ textAlign: 'center', padding: '16px 0' }}><div style={{ fontSize: 40, fontWeight: 800, color: theme.accent2 }}>{player.totalXP.toLocaleString()}</div><div style={{ fontSize: 10, color: theme.muted }}>Total XP</div></div>
            </div>
          </div>
        )}

        {/* ACHIEVEMENTS */}
        {activeTab === 'achievements' && (
          <div style={s.card}>
            <div style={s.cHead}><div style={s.cTitle}>🏆 Achievements</div><span style={{ fontSize: 10, color: theme.muted }}>{achievements.filter(a => a.unlocked).length}/{achievements.length}</span></div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: 10 }}>
              {achievements.map(a => (
                <div key={a.id} style={{ background: theme.input, borderRadius: 10, padding: 12, textAlign: 'center', opacity: a.unlocked ? 1 : 0.4, filter: a.unlocked ? 'none' : 'grayscale(1)', border: a.unlocked ? `2px solid ${theme.accent}44` : '2px solid transparent' }}>
                  <div style={{ fontSize: 28, marginBottom: 6 }}>{a.icon}</div>
                  <div style={{ fontSize: 9, fontWeight: 600 }}>{a.name}</div>
                  <div style={{ fontSize: 7, color: theme.muted, marginTop: 2 }}>{a.desc}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* MODALS */}
      {modal === 'addDeal' && (
        <div style={s.modal} onClick={() => setModal(null)}><div style={s.mBox} onClick={e => e.stopPropagation()}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}><h3 style={{ fontSize: 16, fontWeight: 700 }}>Add Deal</h3><button onClick={() => setModal(null)} style={{ background: 'none', border: 'none', color: theme.muted, fontSize: 20, cursor: 'pointer' }}>×</button></div>
          <input style={s.inp} placeholder="Client" value={newDeal.client} onChange={e => setNewDeal({ ...newDeal, client: e.target.value })}/>
          <input style={s.inp} placeholder="Product" value={newDeal.product} onChange={e => setNewDeal({ ...newDeal, product: e.target.value })}/>
          <input style={s.inp} type="number" placeholder="Commission (CHF)" value={newDeal.commission} onChange={e => setNewDeal({ ...newDeal, commission: e.target.value })}/>
          <button style={{ ...s.btn, ...s.btnP, width: '100%', padding: 12 }} onClick={addDeal}>Add Deal</button>
        </div></div>
      )}

      {modal === 'addConsult' && (
        <div style={s.modal} onClick={() => setModal(null)}><div style={s.mBox} onClick={e => e.stopPropagation()}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}><h3 style={{ fontSize: 16, fontWeight: 700 }}>Log Consultation</h3><button onClick={() => setModal(null)} style={{ background: 'none', border: 'none', color: theme.muted, fontSize: 20, cursor: 'pointer' }}>×</button></div>
          <input style={s.inp} placeholder="Client" value={newConsult.client} onChange={e => setNewConsult({ ...newConsult, client: e.target.value })}/>
          <select style={s.sel} value={newConsult.type} onChange={e => setNewConsult({ ...newConsult, type: e.target.value })}><option>Pension</option><option>Retirement</option><option>Life Insurance</option><option>Investment</option></select>
          <select style={s.sel} value={newConsult.status} onChange={e => setNewConsult({ ...newConsult, status: e.target.value })}><option value="scheduled">Scheduled</option><option value="completed">Completed</option><option value="closed">Closed</option><option value="lost">Lost</option></select>
          <input style={s.inp} type="number" placeholder="Script (1-10)" min="1" max="10" value={newConsult.script} onChange={e => setNewConsult({ ...newConsult, script: e.target.value })}/>
          <button style={{ ...s.btn, ...s.btnP, width: '100%', padding: 12 }} onClick={addConsult}>Log</button>
        </div></div>
      )}

      {modal === 'editConsult' && editConsult && (
        <div style={s.modal} onClick={() => setModal(null)}><div style={s.mBox} onClick={e => e.stopPropagation()}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}><h3 style={{ fontSize: 16, fontWeight: 700 }}>Edit Consultation</h3><button onClick={() => setModal(null)} style={{ background: 'none', border: 'none', color: theme.muted, fontSize: 20, cursor: 'pointer' }}>×</button></div>
          <input style={s.inp} placeholder="Client" value={editConsult.client} onChange={e => setEditConsult({ ...editConsult, client: e.target.value })}/>
          <select style={s.sel} value={editConsult.status} onChange={e => setEditConsult({ ...editConsult, status: e.target.value })}><option value="scheduled">Scheduled</option><option value="completed">Completed</option><option value="closed">Closed</option><option value="lost">Lost</option></select>
          <input style={s.inp} type="number" placeholder="Script (1-10)" value={editConsult.script || ''} onChange={e => setEditConsult({ ...editConsult, script: +e.target.value || null })}/>
          <div style={{ display: 'flex', gap: 8 }}>
            <button style={{ ...s.btn, ...s.btnP, flex: 1, padding: 12 }} onClick={updateConsult}>Save</button>
            <button style={{ ...s.btn, ...s.btnD, padding: 12 }} onClick={() => { setConsults(p => p.filter(c => c.id !== editConsult.id)); setModal(null); }}>Delete</button>
          </div>
        </div></div>
      )}

      {modal === 'addQuest' && (
        <div style={s.modal} onClick={() => setModal(null)}><div style={s.mBox} onClick={e => e.stopPropagation()}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}><h3 style={{ fontSize: 16, fontWeight: 700 }}>Add Quest</h3><button onClick={() => setModal(null)} style={{ background: 'none', border: 'none', color: theme.muted, fontSize: 20, cursor: 'pointer' }}>×</button></div>
          <input style={s.inp} placeholder="Quest Name" value={newQuest.name} onChange={e => setNewQuest({ ...newQuest, name: e.target.value })}/>
          <input style={s.inp} placeholder="Description" value={newQuest.desc} onChange={e => setNewQuest({ ...newQuest, desc: e.target.value })}/>
          <input style={s.inp} type="number" placeholder="XP" value={newQuest.xp} onChange={e => setNewQuest({ ...newQuest, xp: e.target.value })}/>
          <div style={{ fontSize: 10, color: theme.muted, marginBottom: 8 }}>Category</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginBottom: 12 }}>
            {Object.entries(cats).map(([k, v]) => (
              <div key={k} onClick={() => setNewQuest({ ...newQuest, cat: k })} style={{ ...s.catCard, background: v.grad, borderColor: newQuest.cat === k ? '#fff' : 'transparent', transform: newQuest.cat === k ? 'scale(1.05)' : 'scale(1)', opacity: newQuest.cat === k ? 1 : 0.7 }}>
                <div style={{ fontSize: 18 }}>{v.icon}</div>
                <div style={{ fontSize: 8, fontWeight: 700, color: '#fff' }}>{v.name}</div>
              </div>
            ))}
          </div>
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12, fontSize: 12 }}><input type="checkbox" checked={newQuest.neg} onChange={e => setNewQuest({ ...newQuest, neg: e.target.checked })}/> Negative XP (Vice)</label>
          <button style={{ ...s.btn, ...s.btnP, width: '100%', padding: 12 }} onClick={addQuest}>Add Quest</button>
        </div></div>
      )}

      {modal === 'editQuests' && (
        <div style={s.modal} onClick={() => setModal(null)}><div style={s.mBox} onClick={e => e.stopPropagation()}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}><h3 style={{ fontSize: 16, fontWeight: 700 }}>Edit Quests</h3><button onClick={() => setModal(null)} style={{ background: 'none', border: 'none', color: theme.muted, fontSize: 20, cursor: 'pointer' }}>×</button></div>
          <div style={{ maxHeight: 350, overflow: 'auto' }}>
            {questLib.map(q => (
              <div key={q.id} onClick={() => setQuestLib(p => p.map(x => x.id === q.id ? { ...x, on: !x.on } : x))} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: 10, background: q.on ? `${theme.accent}22` : theme.input, border: q.on ? `1px solid ${theme.accent}44` : '1px solid transparent', borderRadius: 6, marginBottom: 4, cursor: 'pointer' }}>
                <div style={{ width: 5, height: 5, borderRadius: '50%', background: q.neg ? '#ef4444' : cats[q.cat]?.color }}/>
                <div style={{ width: 16, height: 16, borderRadius: 3, border: q.on ? 'none' : `2px solid ${theme.muted}`, background: q.on ? theme.accent : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, color: '#0a0a0f' }}>{q.on && '✓'}</div>
                <div style={{ flex: 1, fontSize: 11, fontWeight: 600 }}>{q.name}</div>
                <span style={{ ...s.xpB, ...(q.neg ? s.xpBN : {}) }}>{q.xp > 0 ? '+' : ''}{q.xp}</span>
              </div>
            ))}
          </div>
          <button style={{ ...s.btn, ...s.btnP, width: '100%', marginTop: 12, padding: 12 }} onClick={() => { setTodayQ(questLib.filter(q => q.on).map(q => { const ex = todayQ.find(t => t.id === q.id); return ex ? { ...q, done: ex.done } : { ...q, done: false }; })); setModal(null); toast('Updated!'); }}>Apply ({questLib.filter(q => q.on).length})</button>
        </div></div>
      )}

      {modal === 'whoop' && (
        <div style={s.modal} onClick={() => setModal(null)}><div style={s.mBox} onClick={e => e.stopPropagation()}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}><h3 style={{ fontSize: 16, fontWeight: 700 }}>Update Whoop</h3><button onClick={() => setModal(null)} style={{ background: 'none', border: 'none', color: theme.muted, fontSize: 20, cursor: 'pointer' }}>×</button></div>
          <label style={{ fontSize: 10, color: theme.muted }}>Recovery %</label>
          <input style={s.inp} type="number" min="0" max="100" value={whoop.recovery} onChange={e => setWhoop({ ...whoop, recovery: +e.target.value || 0 })}/>
          <label style={{ fontSize: 10, color: theme.muted }}>Sleep %</label>
          <input style={s.inp} type="number" min="0" max="100" value={whoop.sleep} onChange={e => setWhoop({ ...whoop, sleep: +e.target.value || 0 })}/>
          <label style={{ fontSize: 10, color: theme.muted }}>Strain</label>
          <input style={s.inp} type="number" step="0.1" value={whoop.strain} onChange={e => setWhoop({ ...whoop, strain: +e.target.value || 0 })}/>
          <label style={{ fontSize: 10, color: theme.muted }}>HRV</label>
          <input style={s.inp} type="number" value={whoop.hrv} onChange={e => setWhoop({ ...whoop, hrv: +e.target.value || 0 })}/>
          <button style={{ ...s.btn, ...s.btnP, width: '100%', padding: 12 }} onClick={() => { setModal(null); toast('Saved!'); }}>Save</button>
        </div></div>
      )}

      {modal === 'avatar' && (
        <div style={s.modal} onClick={() => setModal(null)}><div style={s.mBox} onClick={e => e.stopPropagation()}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}><h3 style={{ fontSize: 16, fontWeight: 700 }}>Select Avatar</h3><button onClick={() => setModal(null)} style={{ background: 'none', border: 'none', color: theme.muted, fontSize: 20, cursor: 'pointer' }}>×</button></div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
            {avatars.map(a => (
              <div key={a.id} onClick={() => selectAvatar(a.id)} style={{ textAlign: 'center', padding: 10, background: player.avatar === a.id ? `${theme.accent}22` : theme.input, border: player.avatar === a.id ? `2px solid ${theme.accent}` : '2px solid transparent', borderRadius: 10, opacity: player.level >= a.lvl ? 1 : 0.4, cursor: player.level >= a.lvl ? 'pointer' : 'not-allowed' }}>
                <div style={{ fontSize: 28 }}>{a.icon}</div>
                <div style={{ fontSize: 9, fontWeight: 600, marginTop: 4 }}>{a.name}</div>
                <div style={{ fontSize: 8, color: theme.muted }}>Lv {a.lvl}</div>
              </div>
            ))}
          </div>
        </div></div>
      )}

      {modal === 'incomeSet' && (
        <div style={s.modal} onClick={() => setModal(null)}><div style={s.mBox} onClick={e => e.stopPropagation()}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}><h3 style={{ fontSize: 16, fontWeight: 700 }}>💰 Income Settings</h3><button onClick={() => setModal(null)} style={{ background: 'none', border: 'none', color: theme.muted, fontSize: 20, cursor: 'pointer' }}>×</button></div>
          <label style={{ fontSize: 10, color: theme.muted }}>Base Salary (CHF)</label>
          <input style={s.inp} type="number" value={incSet.base} onChange={e => setIncSet({ ...incSet, base: +e.target.value || 0 })}/>
          <label style={{ fontSize: 10, color: theme.muted }}>Monthly Target (CHF)</label>
          <input style={s.inp} type="number" value={incSet.target} onChange={e => setIncSet({ ...incSet, target: +e.target.value || 0 })}/>
          <label style={{ fontSize: 10, color: theme.muted }}>Deals Target</label>
          <input style={s.inp} type="number" value={incSet.deals} onChange={e => setIncSet({ ...incSet, deals: +e.target.value || 0 })}/>
          <label style={{ fontSize: 10, color: theme.muted }}>Consultations Target</label>
          <input style={s.inp} type="number" value={incSet.consults} onChange={e => setIncSet({ ...incSet, consults: +e.target.value || 0 })}/>
          <button style={{ ...s.btn, ...s.btnP, width: '100%', padding: 12 }} onClick={() => { setModal(null); toast('Saved!'); }}>Save</button>
        </div></div>
      )}

      {modal === 'settings' && (
        <div style={s.modal} onClick={() => setModal(null)}><div style={s.mBox} onClick={e => e.stopPropagation()}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}><h3 style={{ fontSize: 16, fontWeight: 700 }}>⚙️ Settings</h3><button onClick={() => setModal(null)} style={{ background: 'none', border: 'none', color: theme.muted, fontSize: 20, cursor: 'pointer' }}>×</button></div>
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 11, fontWeight: 600, marginBottom: 10 }}>🎨 Appearance</div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={() => setDarkMode(true)} style={{ ...s.btn, flex: 1, padding: 12, background: darkMode ? theme.accent : theme.input, color: darkMode ? '#0a0a0f' : theme.text }}>🌙 Dark</button>
              <button onClick={() => setDarkMode(false)} style={{ ...s.btn, flex: 1, padding: 12, background: !darkMode ? theme.accent : theme.input, color: !darkMode ? '#0a0a0f' : theme.text }}>☀️ Light</button>
            </div>
          </div>
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 11, fontWeight: 600, marginBottom: 10 }}>👤 Account</div>
            <label style={{ fontSize: 10, color: theme.muted }}>Name</label>
            <input style={s.inp} value={account.name} onChange={e => setAccount({ ...account, name: e.target.value })}/>
            <label style={{ fontSize: 10, color: theme.muted }}>Email</label>
            <input style={s.inp} type="email" value={account.email} onChange={e => setAccount({ ...account, email: e.target.value })}/>
          </div>
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 11, fontWeight: 600, marginBottom: 10 }}>⚠️ Danger</div>
            <button onClick={() => { if(confirm('Reset ALL data?')) { localStorage.clear(); location.reload(); }}} style={{ ...s.btn, ...s.btnD, width: '100%', padding: 12 }}>🗑️ Reset All Data</button>
          </div>
          <button style={{ ...s.btn, ...s.btnS, width: '100%', padding: 12 }} onClick={() => setModal(null)}>Close</button>
        </div></div>
      )}

      <div style={s.toast}>{toastMsg}</div>
    </div>
  );
};

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
