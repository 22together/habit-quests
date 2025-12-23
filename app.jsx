// INEVITABLE 2026 - V5 COMPLETE
const { useState, useEffect, useMemo, useCallback } = React;

const App = () => {
  const [dark, setDark] = useState(() => JSON.parse(localStorage.getItem('v5_dark') ?? 'true'));
  const t = dark ? {
    bg: '#0a0a0f', card: 'rgba(22,22,30,0.95)', border: 'rgba(255,255,255,0.06)',
    text: '#f5f5f7', muted: '#6e6e73', accent: '#2dd4bf', accent2: '#a78bfa',
    green: '#30d158', red: '#ff453a', orange: '#ff9f0a', blue: '#0a84ff', input: 'rgba(28,28,35,0.9)'
  } : {
    bg: '#f5f5f7', card: 'rgba(255,255,255,0.95)', border: 'rgba(0,0,0,0.06)',
    text: '#1d1d1f', muted: '#86868b', accent: '#0d9488', accent2: '#7c3aed',
    green: '#34c759', red: '#ff3b30', orange: '#ff9500', blue: '#007aff', input: 'rgba(245,245,247,0.9)'
  };

  const [tab, setTab] = useState('today');
  const [toast, setToast] = useState({ show: false, msg: '' });
  const [modal, setModal] = useState(null);
  const [editItem, setEditItem] = useState(null);

  const avatars = [
    { id: 'default', icon: '👤', name: 'Rookie', lvl: 1 }, { id: 'warrior', icon: '⚔️', name: 'Warrior', lvl: 3 },
    { id: 'sage', icon: '🧙', name: 'Sage', lvl: 5 }, { id: 'champion', icon: '🏆', name: 'Champion', lvl: 7 },
    { id: 'phoenix', icon: '🔥', name: 'Phoenix', lvl: 10 }, { id: 'diamond', icon: '💎', name: 'Diamond', lvl: 15 },
    { id: 'crown', icon: '👑', name: 'King', lvl: 20 }, { id: 'dragon', icon: '🐉', name: 'Dragon', lvl: 50 }
  ];

  const cats = {
    sales: { icon: '📈', name: 'Sales', color: '#30d158', grad: 'linear-gradient(135deg,#30d158,#25a848)' },
    mindset: { icon: '🧠', name: 'Mindset', color: '#a78bfa', grad: 'linear-gradient(135deg,#a78bfa,#8b5cf6)' },
    discipline: { icon: '⚔️', name: 'Discipline', color: '#ff453a', grad: 'linear-gradient(135deg,#ff453a,#d63031)' },
    growth: { icon: '📚', name: 'Growth', color: '#0a84ff', grad: 'linear-gradient(135deg,#0a84ff,#0066cc)' },
    health: { icon: '💪', name: 'Health', color: '#ff9f0a', grad: 'linear-gradient(135deg,#ff9f0a,#f39c12)' },
    planning: { icon: '🎯', name: 'Planning', color: '#2dd4bf', grad: 'linear-gradient(135deg,#2dd4bf,#14b8a6)' }
  };

  const defQuests = [
    { id:'h1', name:'Cold Exposure', desc:'2-3 min cold shower', xp:40, cat:'health', on:true, neg:false },
    { id:'h2', name:'Morning Sunlight', desc:'10 min sunlight', xp:35, cat:'health', on:true, neg:false },
    { id:'h3', name:'10,000 Steps', desc:'Daily movement', xp:50, cat:'health', on:true, neg:false },
    { id:'h4', name:'Sleep by 22:30', desc:'Recovery optimization', xp:40, cat:'health', on:true, neg:false },
    { id:'h5', name:'Strength Training', desc:'Gym session', xp:60, cat:'health', on:false, neg:false },
    { id:'h6', name:'Hydration 3L', desc:'Water intake', xp:25, cat:'health', on:false, neg:false },
    { id:'d1', name:'Fasted Until 13:00', desc:'Only kefir allowed', xp:30, cat:'discipline', on:true, neg:false },
    { id:'d2', name:'No Phone in Office', desc:'Deep work mode', xp:30, cat:'discipline', on:true, neg:false },
    { id:'d3', name:'No News Until Evening', desc:'Information diet', xp:25, cat:'discipline', on:true, neg:false },
    { id:'m1', name:'Morning Ritual', desc:'Prayer & visualization', xp:50, cat:'mindset', on:true, neg:false },
    { id:'m2', name:'Gratitude Log', desc:'Write 3 things', xp:20, cat:'mindset', on:false, neg:false },
    { id:'m3', name:'Connect Non-Work', desc:'1 personal call', xp:30, cat:'mindset', on:false, neg:false },
    { id:'s1', name:'Script Practice', desc:'20 min rehearsal', xp:40, cat:'sales', on:true, neg:false },
    { id:'s2', name:'5 Prospecting Calls', desc:'Outbound calls', xp:60, cat:'sales', on:true, neg:false },
    { id:'s3', name:'Client Consultation', desc:'Face-to-face meeting', xp:100, cat:'sales', on:true, neg:false, main:true },
    { id:'s4', name:'Script Adherence Log', desc:'Rate 1-10', xp:30, cat:'sales', on:false, neg:false },
    { id:'p1', name:'CRM Update', desc:'Log activities', xp:25, cat:'planning', on:true, neg:false },
    { id:'p2', name:'Evening Review', desc:'Plan tomorrow', xp:40, cat:'planning', on:true, neg:false },
    { id:'g1', name:'Read 20 Pages', desc:'Sales/growth books', xp:35, cat:'growth', on:true, neg:false },
    { id:'g2', name:'Sacred Hour', desc:'Personal development', xp:35, cat:'growth', on:false, neg:false },
    { id:'n1', name:'🚬 Smoked', desc:'Cigarettes/vape', xp:-50, cat:'health', on:true, neg:true },
    { id:'n2', name:'🍺 Alcohol (Weekday)', desc:'Drank on work night', xp:-40, cat:'discipline', on:true, neg:true },
    { id:'n3', name:'🍔 Junk Food Binge', desc:'Unhealthy eating', xp:-30, cat:'health', on:true, neg:true },
    { id:'n4', name:'📱 Doomscrolled 1hr+', desc:'Social media waste', xp:-35, cat:'discipline', on:true, neg:true },
    { id:'n5', name:'😴 Slept Past 9am', desc:'Lost morning', xp:-25, cat:'discipline', on:true, neg:true },
    { id:'n6', name:'🎮 Gamed 3hr+', desc:'Excessive gaming', xp:-30, cat:'discipline', on:false, neg:true },
    { id:'n7', name:'💸 Impulse Buy >50CHF', desc:'Unplanned spending', xp:-35, cat:'discipline', on:false, neg:true },
    { id:'n8', name:'😤 Lost Temper', desc:'Anger outburst', xp:-40, cat:'mindset', on:false, neg:true },
    { id:'n9', name:'📺 Netflix 3hr+', desc:'Binge watching', xp:-25, cat:'discipline', on:false, neg:true },
  ];

  const defAch = [
    { id:'q1', name:'First Steps', icon:'🎯', desc:'Complete 1 quest', cond:'quest_1', unlocked:false },
    { id:'d1', name:'Closer', icon:'🤝', desc:'First deal', cond:'deal_1', unlocked:false },
    { id:'s3', name:'Hat Trick', icon:'🎩', desc:'3-day streak', cond:'streak_3', unlocked:false },
    { id:'s7', name:'Week Warrior', icon:'🔥', desc:'7-day streak', cond:'streak_7', unlocked:false },
    { id:'i5', name:'Getting Started', icon:'💵', desc:'5K CHF/month', cond:'income_5000', unlocked:false },
    { id:'i8', name:'Momentum', icon:'💰', desc:'8K CHF/month', cond:'income_8000', unlocked:false },
    { id:'i10', name:'10K Club', icon:'🏆', desc:'10K CHF/month', cond:'income_10000', unlocked:false },
    { id:'dd5', name:'Deal Maker', icon:'✋', desc:'5 deals total', cond:'deals_5', unlocked:false },
    { id:'x1', name:'XP Hunter', icon:'⚡', desc:'1,000 XP', cond:'xp_1000', unlocked:false },
    { id:'l5', name:'Rising Star', icon:'⭐', desc:'Level 5', cond:'level_5', unlocked:false },
    { id:'c50', name:'Dialer', icon:'📞', desc:'50 calls made', cond:'calls_50', unlocked:false },
  ];

  const [player, setPlayer] = useState(() => JSON.parse(localStorage.getItem('v5_player') ?? '{"level":1,"totalXP":0,"currentXP":0,"streak":{"current":0,"best":0},"avatar":"default"}'));
  const [incSet, setIncSet] = useState(() => JSON.parse(localStorage.getItem('v5_income') ?? '{"base":4166,"target":10000,"dealsTarget":4,"consultsTarget":15,"callsTarget":100}'));
  const [weeklyTargets, setWeeklyTargets] = useState(() => JSON.parse(localStorage.getItem('v5_weekly') ?? '{"deals":1,"consults":4,"calls":25}'));
  const [skillXP, setSkillXP] = useState(() => JSON.parse(localStorage.getItem('v5_skills') ?? '{"sales":0,"mindset":0,"discipline":0,"growth":0,"health":0,"planning":0}'));
  const [questLib, setQuestLib] = useState(() => JSON.parse(localStorage.getItem('v5_quests') ?? JSON.stringify(defQuests)));
  const [todayQ, setTodayQ] = useState(() => JSON.parse(localStorage.getItem('v5_today') ?? JSON.stringify(defQuests.filter(q=>q.on).map(q=>({...q,done:false})))));
  const [deals, setDeals] = useState(() => JSON.parse(localStorage.getItem('v5_deals') ?? '[]'));
  const [consults, setConsults] = useState(() => JSON.parse(localStorage.getItem('v5_consults') ?? '[]'));
  const [calls, setCalls] = useState(() => JSON.parse(localStorage.getItem('v5_calls') ?? '[]'));
  const [whoop, setWhoop] = useState(() => JSON.parse(localStorage.getItem('v5_whoop') ?? '{"recovery":70,"sleep":80,"strain":10,"hrv":55}'));
  const [whoopHist, setWhoopHist] = useState(() => JSON.parse(localStorage.getItem('v5_whoopHist') ?? '[]'));
  const [review, setReview] = useState(() => JSON.parse(localStorage.getItem('v5_review') ?? '[{"t":"Review goals","c":false},{"t":"Script adherence","c":false},{"t":"Update income","c":false},{"t":"Plan next week","c":false}]'));
  const [achievements, setAchievements] = useState(() => JSON.parse(localStorage.getItem('v5_ach') ?? JSON.stringify(defAch)));

  const [newDeal, setNewDeal] = useState({ client:'', product:'', commission:'' });
  const [newConsult, setNewConsult] = useState({ client:'', type:'Pension', status:'scheduled', script:'' });
  const [newCall, setNewCall] = useState({ client:'', outcome:'answered', notes:'' });
  const [newQuest, setNewQuest] = useState({ name:'', desc:'', xp:30, cat:'discipline', neg:false });

  const getSwissDate = () => new Date().toLocaleDateString('en-CA', { timeZone: 'Europe/Zurich' });

  const checkDailyReset = useCallback(() => {
    const today = getSwissDate();
    const lastDate = localStorage.getItem('v5_lastDate');
    if (lastDate && lastDate !== today) {
      const activeQuests = questLib.filter(q => q.on).map(q => ({ ...q, done: false }));
      setTodayQ(activeQuests);
      setPlayer(p => ({ ...p, streak: { current: p.streak.current + 1, best: Math.max(p.streak.current + 1, p.streak.best) } }));
      showToast('☀️ New day! Quests reset.');
    }
    localStorage.setItem('v5_lastDate', today);
  }, [questLib]);

  useEffect(() => { checkDailyReset(); const i = setInterval(checkDailyReset, 60000); return () => clearInterval(i); }, [checkDailyReset]);

  useEffect(() => { localStorage.setItem('v5_dark', JSON.stringify(dark)); }, [dark]);
  useEffect(() => { localStorage.setItem('v5_player', JSON.stringify(player)); }, [player]);
  useEffect(() => { localStorage.setItem('v5_income', JSON.stringify(incSet)); }, [incSet]);
  useEffect(() => { localStorage.setItem('v5_weekly', JSON.stringify(weeklyTargets)); }, [weeklyTargets]);
  useEffect(() => { localStorage.setItem('v5_skills', JSON.stringify(skillXP)); }, [skillXP]);
  useEffect(() => { localStorage.setItem('v5_quests', JSON.stringify(questLib)); }, [questLib]);
  useEffect(() => { localStorage.setItem('v5_today', JSON.stringify(todayQ)); }, [todayQ]);
  useEffect(() => { localStorage.setItem('v5_deals', JSON.stringify(deals)); }, [deals]);
  useEffect(() => { localStorage.setItem('v5_consults', JSON.stringify(consults)); }, [consults]);
  useEffect(() => { localStorage.setItem('v5_calls', JSON.stringify(calls)); }, [calls]);
  useEffect(() => { localStorage.setItem('v5_whoop', JSON.stringify(whoop)); }, [whoop]);
  useEffect(() => { localStorage.setItem('v5_whoopHist', JSON.stringify(whoopHist)); }, [whoopHist]);
  useEffect(() => { localStorage.setItem('v5_review', JSON.stringify(review)); }, [review]);
  useEffect(() => { localStorage.setItem('v5_ach', JSON.stringify(achievements)); }, [achievements]);

  const month = new Date().toISOString().slice(0, 7);
  const weekStart = (() => { const d = new Date(); d.setDate(d.getDate() - d.getDay() + 1); return d.toISOString().slice(0, 10); })();
  
  const monthlyDeals = deals.filter(d => d.date?.startsWith(month));
  const monthlyConsults = consults.filter(c => c.date?.startsWith(month));
  const monthlyCalls = calls.filter(c => c.date?.startsWith(month));
  const weeklyDeals = deals.filter(d => d.date >= weekStart);
  const weeklyConsults = consults.filter(c => c.date >= weekStart);
  const weeklyCalls = calls.filter(c => c.date >= weekStart);

  const commission = monthlyDeals.reduce((s, d) => s + (d.commission || 0), 0);
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

  const year = new Date().getFullYear().toString();
  const totalDealsYear = deals.filter(d => d.date?.startsWith(year)).length;
  const totalIncomeYear = deals.filter(d => d.date?.startsWith(year)).reduce((s, d) => s + (d.commission || 0), 0) + (incSet.base * (new Date().getMonth() + 1));

  const monthlyHistory = useMemo(() => {
    const months = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(); d.setMonth(d.getMonth() - i);
      const ms = d.toISOString().slice(0, 7);
      const mn = d.toLocaleDateString('en', { month: 'short' });
      months.push({
        month: mn,
        income: incSet.base + deals.filter(x => x.date?.startsWith(ms)).reduce((s, x) => s + (x.commission || 0), 0),
        deals: deals.filter(x => x.date?.startsWith(ms)).length,
        consults: consults.filter(x => x.date?.startsWith(ms)).length,
        calls: calls.filter(x => x.date?.startsWith(ms)).length
      });
    }
    return months;
  }, [deals, consults, calls, incSet.base]);

  useEffect(() => {
    setAchievements(prev => prev.map(a => {
      if (a.unlocked) return a;
      let u = false;
      if (a.cond === 'quest_1' && donePos >= 1) u = true;
      if (a.cond === 'deal_1' && deals.length >= 1) u = true;
      if (a.cond === 'deals_5' && deals.length >= 5) u = true;
      if (a.cond === 'streak_3' && player.streak.current >= 3) u = true;
      if (a.cond === 'streak_7' && player.streak.current >= 7) u = true;
      if (a.cond === 'income_5000' && income >= 5000) u = true;
      if (a.cond === 'income_8000' && income >= 8000) u = true;
      if (a.cond === 'income_10000' && income >= 10000) u = true;
      if (a.cond === 'xp_1000' && player.totalXP >= 1000) u = true;
      if (a.cond === 'level_5' && player.level >= 5) u = true;
      if (a.cond === 'calls_50' && calls.length >= 50) u = true;
      if (u) { setTimeout(() => showToast('🏆 ' + a.name + '!'), 500); return { ...a, unlocked: true }; }
      return a;
    }));
  }, [deals, consults, calls, player, income, donePos]);

  const showToast = (msg) => { setToast({ show: true, msg }); setTimeout(() => setToast({ show: false, msg: '' }), 3000); };

  const calcLvl = (xp) => {
    const lvl = Math.floor(xp / 500) + 1;
    return { level: lvl, currentXP: xp % 500 };
  };

  const toggleQ = (id) => {
    setTodayQ(prev => prev.map(q => {
      if (q.id === id) {
        const done = !q.done;
        setPlayer(p => {
          let xp = done ? p.totalXP + q.xp : p.totalXP - q.xp;
          xp = Math.max(0, xp);
          const { level, currentXP } = calcLvl(xp);
          return { ...p, totalXP: xp, level, currentXP };
        });
        if (!q.neg) setSkillXP(prev => ({ ...prev, [q.cat]: Math.max(0, prev[q.cat] + (done ? q.xp : -q.xp)) }));
        if (done) showToast(q.neg ? q.xp + ' XP 😔' : '+' + q.xp + ' XP ✓');
        return { ...q, done };
      }
      return q;
    }));
  };

  const addDeal = () => {
    if (!newDeal.client) return;
    setDeals(p => [...p, { id: 'd' + Date.now(), date: getSwissDate(), ...newDeal, commission: +newDeal.commission || 0 }]);
    setNewDeal({ client: '', product: '', commission: '' });
    setModal(null); showToast('Deal +' + (newDeal.commission || 0) + ' CHF');
  };

  const updateDeal = () => {
    if (!editItem) return;
    setDeals(p => p.map(d => d.id === editItem.id ? editItem : d));
    setEditItem(null); setModal(null); showToast('Updated!');
  };

  const deleteDeal = (id) => {
    setDeals(p => p.filter(d => d.id !== id));
    setEditItem(null); setModal(null); showToast('Deleted');
  };

  const addConsult = () => {
    if (!newConsult.client) return;
    setConsults(p => [...p, { id: 'c' + Date.now(), date: getSwissDate(), ...newConsult, script: +newConsult.script || null }]);
    setNewConsult({ client: '', type: 'Pension', status: 'scheduled', script: '' });
    setModal(null); showToast('Consultation logged!');
  };

  const updateConsult = () => {
    if (!editItem) return;
    setConsults(p => p.map(c => c.id === editItem.id ? editItem : c));
    setEditItem(null); setModal(null); showToast('Updated!');
  };

  const deleteConsult = (id) => {
    setConsults(p => p.filter(c => c.id !== id));
    setEditItem(null); setModal(null); showToast('Deleted');
  };

  const addCall = () => {
    if (!newCall.client) return;
    setCalls(p => [...p, { id: 'call' + Date.now(), date: getSwissDate(), ...newCall }]);
    setNewCall({ client: '', outcome: 'answered', notes: '' });
    setModal(null); showToast('Call logged!');
  };

  const updateCall = () => {
    if (!editItem) return;
    setCalls(p => p.map(c => c.id === editItem.id ? editItem : c));
    setEditItem(null); setModal(null); showToast('Updated!');
  };

  const deleteCall = (id) => {
    setCalls(p => p.filter(c => c.id !== id));
    setEditItem(null); setModal(null); showToast('Deleted');
  };

  const addQuest = () => {
    if (!newQuest.name) return;
    const q = { id: 'q' + Date.now(), name: newQuest.name, desc: newQuest.desc, xp: newQuest.neg ? -Math.abs(+newQuest.xp) : Math.abs(+newQuest.xp), cat: newQuest.cat, on: true, neg: newQuest.neg };
    setQuestLib(p => [...p, q]);
    setTodayQ(p => [...p, { ...q, done: false }]);
    setNewQuest({ name: '', desc: '', xp: 30, cat: 'discipline', neg: false });
    setModal(null); showToast('Quest added!');
  };

  const selectAvatar = (id) => {
    const a = avatars.find(x => x.id === id);
    if (a && player.level >= a.lvl) { setPlayer(p => ({ ...p, avatar: id })); showToast('Avatar: ' + a.name); }
    else showToast('Unlock at Lv ' + (a?.lvl || '?'));
  };

  const saveWhoop = () => {
    const today = getSwissDate();
    setWhoopHist(prev => [...prev.filter(h => h.date !== today), { date: today, ...whoop }].slice(-30));
    setModal(null); showToast('Saved!');
  };

  const LineChart = ({ data, keys, colors, height = 120 }) => {
    if (!data?.length) return React.createElement('div', { style: { height, display: 'flex', alignItems: 'center', justifyContent: 'center', color: t.muted, fontSize: 12 } }, 'No data yet');
    const allVals = keys.flatMap(k => data.map(d => d[k] || 0));
    const max = Math.max(...allVals, 1), min = Math.min(...allVals, 0), range = max - min || 1;
    return React.createElement('svg', { viewBox: '0 0 300 ' + height, style: { width: '100%', height } },
      [0, 0.5, 1].map((p, i) => React.createElement('line', { key: 'l'+i, x1: 40, y1: 10 + p * (height - 30), x2: 290, y2: 10 + p * (height - 30), stroke: t.border, strokeWidth: 1 })),
      [0, 0.5, 1].map((p, i) => React.createElement('text', { key: 't'+i, x: 35, y: 14 + p * (height - 30), fill: t.muted, fontSize: 9, textAnchor: 'end' }, Math.round(max - p * range))),
      keys.map((key, ki) => {
        const pts = data.map((d, i) => (45 + (i / (data.length - 1)) * 240) + ',' + (10 + (height - 30) - ((d[key] || 0) - min) / range * (height - 30))).join(' ');
        return React.createElement('g', { key },
          React.createElement('polyline', { points: pts, fill: 'none', stroke: colors[ki], strokeWidth: 2.5, strokeLinecap: 'round', strokeLinejoin: 'round' }),
          data.map((d, i) => React.createElement('circle', { key: i, cx: 45 + (i / (data.length - 1)) * 240, cy: 10 + (height - 30) - ((d[key] || 0) - min) / range * (height - 30), r: 4, fill: colors[ki] }))
        );
      }),
      data.map((d, i) => React.createElement('text', { key: 'x'+i, x: 45 + (i / (data.length - 1)) * 240, y: height - 5, fill: t.muted, fontSize: 9, textAnchor: 'middle' }, d.month || i + 1))
    );
  };

  const MiniChart = ({ data, k, color, h = 50 }) => {
    if (!data?.length) return null;
    const vals = data.map(d => d[k] || 0);
    const max = Math.max(...vals, 1), min = Math.min(...vals, 0), range = max - min || 1;
    const pts = data.map((d, i) => (5 + (i / (data.length - 1)) * 90) + ',' + (5 + (h - 10) - ((d[k] || 0) - min) / range * (h - 10))).join(' ');
    return React.createElement('svg', { viewBox: '0 0 100 ' + h, style: { width: '100%', height: h } },
      React.createElement('polyline', { points: pts, fill: 'none', stroke: color, strokeWidth: 2, strokeLinecap: 'round' }),
      data.map((d, i) => React.createElement('circle', { key: i, cx: 5 + (i / (data.length - 1)) * 90, cy: 5 + (h - 10) - ((d[k] || 0) - min) / range * (h - 10), r: 2.5, fill: color }))
    );
  };

  const s = {
    wrap: { minHeight: '100vh', background: t.bg, fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif', color: t.text, padding: '16px 16px 100px' },
    content: { maxWidth: 1200, margin: '0 auto' },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12, marginBottom: 20 },
    logo: { fontSize: 22, fontWeight: 700, letterSpacing: '-0.02em' },
    logoSub: { fontSize: 10, color: t.muted, letterSpacing: '0.12em', textTransform: 'uppercase', marginTop: 2 },
    headerR: { display: 'flex', alignItems: 'center', gap: 12 },
    netBadge: { background: netXP >= 0 ? t.green + '15' : t.red + '15', borderRadius: 12, padding: '10px 16px', textAlign: 'center' },
    pCard: { background: t.card, borderRadius: 16, padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 12, boxShadow: '0 2px 12px rgba(0,0,0,0.1)' },
    avatarStyle: { width: 44, height: 44, borderRadius: 12, background: 'linear-gradient(135deg, ' + t.accent + ', ' + t.accent2 + ')', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, cursor: 'pointer' },
    xpBar: { width: 80, height: 4, background: t.border, borderRadius: 2, overflow: 'hidden', marginTop: 4 },
    streak: { background: 'linear-gradient(135deg, ' + t.red + ', ' + t.orange + ')', padding: '6px 12px', borderRadius: 20, fontSize: 12, fontWeight: 600, color: '#fff' },
    setBtn: { width: 40, height: 40, borderRadius: 12, background: t.card, border: 'none', color: t.muted, fontSize: 18, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' },
    nav: { display: 'flex', gap: 4, background: t.card, padding: 4, borderRadius: 14, marginBottom: 20, overflowX: 'auto' },
    tabStyle: { padding: '10px 16px', borderRadius: 10, border: 'none', background: 'transparent', color: t.muted, cursor: 'pointer', fontSize: 12, fontWeight: 500, whiteSpace: 'nowrap' },
    tabOn: { background: t.bg, color: t.text, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' },
    mainG: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 16 },
    card: { background: t.card, borderRadius: 18, padding: 20, boxShadow: '0 2px 12px rgba(0,0,0,0.06)' },
    cHead: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
    cTitle: { fontSize: 14, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8 },
    btn: { padding: '10px 16px', borderRadius: 10, border: 'none', fontSize: 13, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit' },
    btnP: { background: t.accent, color: '#000' },
    btnS: { background: t.input, color: t.text },
    btnD: { background: t.red + '20', color: t.red },
    quest: { background: t.input, borderRadius: 12, padding: '14px 16px', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' },
    qDone: { background: t.accent + '15' },
    qNeg: { background: t.red + '08' },
    qNegDone: { background: t.red + '15' },
    chk: { width: 22, height: 22, borderRadius: 7, border: '2px solid ' + t.border, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, flexShrink: 0 },
    chkOn: { background: t.accent, border: 'none', color: '#000' },
    chkNeg: { background: t.red, border: 'none', color: '#fff' },
    xpB: { background: t.accent2 + '20', color: t.accent2, padding: '4px 10px', borderRadius: 8, fontSize: 11, fontWeight: 600 },
    xpBN: { background: t.red + '20', color: t.red },
    stat: { background: t.input, padding: 16, borderRadius: 14, textAlign: 'center' },
    prog: { height: 6, background: t.border, borderRadius: 3, overflow: 'hidden', marginTop: 8 },
    modal: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 20 },
    mBox: { background: t.card, borderRadius: 24, padding: 24, maxWidth: 440, width: '100%', maxHeight: '85vh', overflow: 'auto' },
    mHead: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
    mTitle: { fontSize: 20, fontWeight: 600 },
    mClose: { width: 36, height: 36, borderRadius: 10, background: t.input, border: 'none', color: t.muted, fontSize: 20, cursor: 'pointer' },
    inp: { width: '100%', padding: '14px 16px', borderRadius: 12, border: 'none', background: t.input, color: t.text, fontSize: 15, marginBottom: 12, fontFamily: 'inherit', outline: 'none' },
    sel: { width: '100%', padding: '14px 16px', borderRadius: 12, border: 'none', background: t.input, color: t.text, fontSize: 15, marginBottom: 12, fontFamily: 'inherit' },
    label: { fontSize: 12, color: t.muted, marginBottom: 6, display: 'block' },
    toastStyle: { position: 'fixed', bottom: 30, left: '50%', transform: 'translateX(-50%) translateY(' + (toast.show ? 0 : 100) + 'px)', background: t.card, color: t.text, padding: '14px 24px', borderRadius: 16, fontWeight: 500, fontSize: 14, zIndex: 2000, opacity: toast.show ? 1 : 0, transition: 'all 0.3s', boxShadow: '0 10px 40px rgba(0,0,0,0.3)' },
    chartBox: { background: t.input, borderRadius: 14, padding: 16, marginTop: 12 },
    listItem: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 16px', background: t.input, borderRadius: 12, marginBottom: 8, cursor: 'pointer' },
    legend: { display: 'flex', gap: 16, marginTop: 12, flexWrap: 'wrap' },
    legendItem: { display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: t.muted },
    legendDot: { width: 10, height: 10, borderRadius: 5 }
  };

  const Bar = ({ pct, color }) => React.createElement('div', { style: s.prog },
    React.createElement('div', { style: { height: '100%', width: Math.min(Math.max(pct, 0), 100) + '%', background: color, borderRadius: 3, transition: 'width 0.4s' } })
  );

  const tabs = ['today', 'week', 'month', 'year', 'skills', 'achievements'];

  return React.createElement('div', { style: s.wrap },
    React.createElement('div', { style: s.content },
      // HEADER
      React.createElement('header', { style: s.header },
        React.createElement('div', null,
          React.createElement('div', { style: s.logo }, 'Inevitable'),
          React.createElement('div', { style: s.logoSub }, '2026 Success System')
        ),
        React.createElement('div', { style: s.headerR },
          React.createElement('div', { style: s.netBadge },
            React.createElement('div', { style: { fontSize: 10, color: t.muted } }, 'Today'),
            React.createElement('div', { style: { fontSize: 18, fontWeight: 700, color: netXP >= 0 ? t.green : t.red } }, (netXP >= 0 ? '+' : '') + netXP + ' XP')
          ),
          React.createElement('div', { style: s.pCard },
            React.createElement('div', { style: s.avatarStyle, onClick: () => setModal('avatar') }, avatar.icon),
            React.createElement('div', null,
              React.createElement('div', { style: { fontSize: 14, fontWeight: 600 } }, 'Level ' + player.level),
              React.createElement('div', { style: { fontSize: 11, color: t.muted } }, (player.currentXP || 0) + '/500 XP'),
              React.createElement('div', { style: s.xpBar },
                React.createElement('div', { style: { height: '100%', width: ((player.currentXP || 0) / 500 * 100) + '%', background: 'linear-gradient(90deg, ' + t.accent + ', ' + t.accent2 + ')' } })
              )
            ),
            React.createElement('div', { style: s.streak }, '🔥 ' + player.streak.current)
          ),
          React.createElement('button', { style: s.setBtn, onClick: () => setModal('settings') }, '⚙️')
        )
      ),
      // NAV
      React.createElement('nav', { style: s.nav },
        tabs.map(x => React.createElement('button', { key: x, onClick: () => setTab(x), style: { ...s.tabStyle, ...(tab === x ? s.tabOn : {}) } }, x.charAt(0).toUpperCase() + x.slice(1)))
      ),
      // TODAY TAB
      tab === 'today' && React.createElement('div', { style: s.mainG },
        // Quests Card
        React.createElement('div', { style: s.card },
          React.createElement('div', { style: s.cHead },
            React.createElement('div', { style: s.cTitle }, '⚔️ Daily Quests'),
            React.createElement('div', { style: { display: 'flex', gap: 6 } },
              React.createElement('button', { style: { ...s.btn, ...s.btnS }, onClick: () => setModal('addQuest') }, '+ New'),
              React.createElement('button', { style: { ...s.btn, ...s.btnS }, onClick: () => setModal('editQuests') }, 'Edit')
            )
          ),
          React.createElement('div', { style: { fontSize: 12, color: t.muted, marginBottom: 12 } }, donePos + '/' + posQ.length + ' completed • +' + earnedXP + ' XP'),
          React.createElement('div', { style: { maxHeight: 400, overflowY: 'auto' } },
            posQ.map(q => React.createElement('div', { key: q.id, onClick: () => toggleQ(q.id), style: { ...s.quest, ...(q.done ? s.qDone : {}) } },
              React.createElement('div', { style: { width: 6, height: 6, borderRadius: 3, background: cats[q.cat]?.color || '#888' } }),
              React.createElement('div', { style: { ...s.chk, ...(q.done ? s.chkOn : { borderColor: cats[q.cat]?.color }) } }, q.done && '✓'),
              React.createElement('div', { style: { flex: 1 } },
                React.createElement('div', { style: { fontSize: 14, fontWeight: 500 } }, q.main ? '★ ' : '', q.name),
                React.createElement('div', { style: { fontSize: 11, color: t.muted, marginTop: 2 } }, q.desc)
              ),
              React.createElement('span', { style: s.xpB }, '+' + q.xp)
            ))
          ),
          React.createElement(Bar, { pct: (donePos / posQ.length) * 100, color: t.accent })
        ),
        // Vices Card
        React.createElement('div', { style: s.card },
          React.createElement('div', { style: s.cHead },
            React.createElement('div', { style: s.cTitle }, '⚠️ Vices'),
            doneNeg > 0 && React.createElement('span', { style: { fontSize: 12, color: t.red } }, '-' + lostXP + ' XP')
          ),
          React.createElement('div', { style: { fontSize: 12, color: t.muted, marginBottom: 12 } }, 'Check if you slipped today'),
          negQ.map(q => React.createElement('div', { key: q.id, onClick: () => toggleQ(q.id), style: { ...s.quest, ...s.qNeg, ...(q.done ? s.qNegDone : {}) } },
            React.createElement('div', { style: { ...s.chk, ...(q.done ? s.chkNeg : { borderColor: t.red }) } }, q.done && '✗'),
            React.createElement('div', { style: { flex: 1 } },
              React.createElement('div', { style: { fontSize: 14, fontWeight: 500 } }, q.name),
              React.createElement('div', { style: { fontSize: 11, color: t.muted, marginTop: 2 } }, q.desc)
            ),
            React.createElement('span', { style: { ...s.xpB, ...s.xpBN } }, q.xp)
          ))
        ),
        // Income Card
        React.createElement('div', { style: s.card },
          React.createElement('div', { style: s.cHead },
            React.createElement('div', { style: s.cTitle }, '💰 Income'),
            React.createElement('div', { style: { display: 'flex', gap: 6 } },
              React.createElement('button', { style: { ...s.btn, ...s.btnS }, onClick: () => setModal('incomeSet') }, '⚙️'),
              React.createElement('button', { style: { ...s.btn, ...s.btnP }, onClick: () => setModal('addDeal') }, '+ Deal')
            )
          ),
          React.createElement('div', { style: { textAlign: 'center', padding: '16px 0' } },
            React.createElement('div', { style: { fontSize: 42, fontWeight: 700, color: t.green } }, income.toLocaleString()),
            React.createElement('div', { style: { fontSize: 13, color: t.muted } }, 'of ' + incSet.target.toLocaleString() + ' CHF')
          ),
          React.createElement(Bar, { pct: (income / incSet.target) * 100, color: t.green }),
          React.createElement('div', { style: { marginTop: 16 } },
            React.createElement('div', { style: { fontSize: 12, fontWeight: 500, marginBottom: 8 } }, 'Deals (' + monthlyDeals.length + ')'),
            monthlyDeals.length === 0 ? React.createElement('div', { style: { padding: 16, textAlign: 'center', color: t.muted, fontSize: 12 } }, 'No deals this month') :
              monthlyDeals.slice(-5).reverse().map(d => React.createElement('div', { key: d.id, onClick: () => { setEditItem(d); setModal('editDeal'); }, style: s.listItem },
                React.createElement('div', null,
                  React.createElement('div', { style: { fontSize: 14, fontWeight: 500 } }, d.client),
                  React.createElement('div', { style: { fontSize: 11, color: t.muted } }, d.product + ' • ' + d.date)
                ),
                React.createElement('div', { style: { fontSize: 15, fontWeight: 600, color: t.green } }, '+' + d.commission)
              ))
          ),
          React.createElement('div', { style: s.chartBox },
            React.createElement('div', { style: { fontSize: 11, color: t.muted, marginBottom: 8 } }, '6-Month Trend'),
            React.createElement(MiniChart, { data: monthlyHistory, k: 'income', color: t.green, h: 50 })
          )
        ),
        // Whoop Card
        React.createElement('div', { style: s.card },
          React.createElement('div', { style: s.cHead },
            React.createElement('div', { style: s.cTitle }, '❤️ Health'),
            React.createElement('button', { style: { ...s.btn, ...s.btnS }, onClick: () => setModal('whoop') }, 'Update')
          ),
          React.createElement('div', { style: { textAlign: 'center', padding: '12px 0' } },
            React.createElement('div', { style: { fontSize: 52, fontWeight: 700, color: whoop.recovery >= 67 ? t.green : whoop.recovery >= 34 ? t.orange : t.red } }, whoop.recovery + '%'),
            React.createElement('div', { style: { fontSize: 12, color: t.muted } }, 'Recovery')
          ),
          React.createElement('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginTop: 8 } },
            React.createElement('div', { style: s.stat }, React.createElement('div', { style: { fontSize: 20, fontWeight: 600, color: t.blue } }, whoop.sleep + '%'), React.createElement('div', { style: { fontSize: 10, color: t.muted, marginTop: 2 } }, 'Sleep')),
            React.createElement('div', { style: s.stat }, React.createElement('div', { style: { fontSize: 20, fontWeight: 600, color: t.orange } }, whoop.strain), React.createElement('div', { style: { fontSize: 10, color: t.muted, marginTop: 2 } }, 'Strain')),
            React.createElement('div', { style: s.stat }, React.createElement('div', { style: { fontSize: 20, fontWeight: 600, color: t.accent2 } }, whoop.hrv), React.createElement('div', { style: { fontSize: 10, color: t.muted, marginTop: 2 } }, 'HRV'))
          ),
          whoopHist.length > 0 && React.createElement('div', { style: s.chartBox }, React.createElement(MiniChart, { data: whoopHist.slice(-7), k: 'recovery', color: t.green, h: 40 }))
        )
      ),
      // WEEK TAB
      tab === 'week' && React.createElement('div', { style: s.mainG },
        React.createElement('div', { style: s.card },
          React.createElement('div', { style: s.cHead },
            React.createElement('div', { style: s.cTitle }, '📅 Weekly Progress'),
            React.createElement('button', { style: { ...s.btn, ...s.btnS }, onClick: () => setModal('weeklySet') }, '⚙️')
          ),
          [{ n: 'Consultations', p: weeklyConsults.length, g: weeklyTargets.consults, c: t.green },
           { n: 'Deals', p: weeklyDeals.length, g: weeklyTargets.deals, c: t.orange },
           { n: 'Outgoing Calls', p: weeklyCalls.length, g: weeklyTargets.calls, c: t.blue }
          ].map((x, i) => React.createElement('div', { key: i, style: { marginBottom: 16 } },
            React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 6 } },
              React.createElement('span', { style: { fontWeight: 500 } }, x.n),
              React.createElement('span', { style: { color: x.c, fontWeight: 600 } }, x.p + '/' + x.g)
            ),
            React.createElement(Bar, { pct: (x.p / x.g) * 100, color: x.c })
          ))
        ),
        React.createElement('div', { style: s.card },
          React.createElement('div', { style: s.cHead }, React.createElement('div', { style: s.cTitle }, '📝 Sunday Review')),
          review.map((r, i) => React.createElement('div', { key: i, onClick: () => setReview(p => p.map((x, j) => j === i ? { ...x, c: !x.c } : x)), style: { display: 'flex', alignItems: 'center', gap: 10, padding: '12px 14px', background: t.input, borderRadius: 10, marginBottom: 6, cursor: 'pointer', opacity: r.c ? 0.5 : 1 } },
            React.createElement('div', { style: { width: 20, height: 20, borderRadius: 6, border: r.c ? 'none' : '2px solid ' + t.muted, background: r.c ? t.accent : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, color: '#000' } }, r.c && '✓'),
            React.createElement('span', { style: { fontSize: 13, textDecoration: r.c ? 'line-through' : 'none' } }, r.t)
          ))
        ),
        React.createElement('div', { style: { ...s.card, gridColumn: '1 / -1' } },
          React.createElement('div', { style: s.cHead },
            React.createElement('div', { style: s.cTitle }, '📞 Consultations'),
            React.createElement('button', { style: { ...s.btn, ...s.btnP }, onClick: () => setModal('addConsult') }, '+ Add')
          ),
          React.createElement('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 10 } },
            consults.slice(-8).reverse().map(c => React.createElement('div', { key: c.id, onClick: () => { setEditItem(c); setModal('editConsult'); }, style: s.listItem },
              React.createElement('div', null,
                React.createElement('div', { style: { fontSize: 14, fontWeight: 500 } }, c.client),
                React.createElement('div', { style: { fontSize: 11, color: t.muted } }, c.type + ' • ' + c.date + ' • Script: ' + (c.script || '-') + '/10')
              ),
              React.createElement('div', { style: { fontSize: 10, padding: '5px 10px', borderRadius: 8, background: c.status === 'closed' ? t.green + '20' : t.input, color: c.status === 'closed' ? t.green : t.muted, textTransform: 'uppercase', fontWeight: 600 } }, c.status)
            )),
            consults.length === 0 && React.createElement('div', { style: { color: t.muted, fontSize: 13, padding: 20 } }, 'No consultations yet')
          )
        ),
        React.createElement('div', { style: { ...s.card, gridColumn: '1 / -1' } },
          React.createElement('div', { style: s.cHead },
            React.createElement('div', { style: s.cTitle }, '📱 Outgoing Calls'),
            React.createElement('button', { style: { ...s.btn, ...s.btnP }, onClick: () => setModal('addCall') }, '+ Add')
          ),
          React.createElement('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 10 } },
            calls.slice(-8).reverse().map(c => React.createElement('div', { key: c.id, onClick: () => { setEditItem(c); setModal('editCall'); }, style: s.listItem },
              React.createElement('div', null,
                React.createElement('div', { style: { fontSize: 14, fontWeight: 500 } }, c.client),
                React.createElement('div', { style: { fontSize: 11, color: t.muted } }, c.date + ' • ' + (c.notes || 'No notes'))
              ),
              React.createElement('div', { style: { fontSize: 10, padding: '5px 10px', borderRadius: 8, background: c.outcome === 'answered' ? t.green + '20' : c.outcome === 'voicemail' ? t.orange + '20' : t.input, color: c.outcome === 'answered' ? t.green : c.outcome === 'voicemail' ? t.orange : t.muted, textTransform: 'uppercase', fontWeight: 600 } }, c.outcome)
            )),
            calls.length === 0 && React.createElement('div', { style: { color: t.muted, fontSize: 13, padding: 20 } }, 'No calls yet')
          )
        ),
        React.createElement('div', { style: { ...s.card, gridColumn: '1 / -1' } },
          React.createElement('div', { style: s.cHead }, React.createElement('div', { style: s.cTitle }, '📈 Activity Trends')),
          React.createElement(LineChart, { data: monthlyHistory, keys: ['consults', 'calls', 'deals'], colors: [t.green, t.blue, t.orange], height: 140 }),
          React.createElement('div', { style: s.legend },
            React.createElement('div', { style: s.legendItem }, React.createElement('div', { style: { ...s.legendDot, background: t.green } }), ' Consults'),
            React.createElement('div', { style: s.legendItem }, React.createElement('div', { style: { ...s.legendDot, background: t.blue } }), ' Calls'),
            React.createElement('div', { style: s.legendItem }, React.createElement('div', { style: { ...s.legendDot, background: t.orange } }), ' Deals')
          )
        )
      ),
      // MONTH TAB
      tab === 'month' && React.createElement('div', { style: s.mainG },
        React.createElement('div', { style: s.card },
          React.createElement('div', { style: s.cHead }, React.createElement('div', { style: s.cTitle }, '🗓️ Monthly Goals')),
          [{ n: incSet.target.toLocaleString() + ' CHF', p: income, g: incSet.target, c: t.green },
           { n: incSet.dealsTarget + ' Deals', p: monthlyDeals.length, g: incSet.dealsTarget, c: t.orange },
           { n: incSet.consultsTarget + ' Consultations', p: monthlyConsults.length, g: incSet.consultsTarget, c: t.blue },
           { n: incSet.callsTarget + ' Calls', p: monthlyCalls.length, g: incSet.callsTarget, c: t.accent2 }
          ].map((x, i) => React.createElement('div', { key: i, style: { marginBottom: 16 } },
            React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 6 } },
              React.createElement('span', { style: { fontWeight: 500 } }, x.n),
              React.createElement('span', { style: { color: x.c, fontWeight: 600 } }, Math.round((x.p / x.g) * 100) + '%')
            ),
            React.createElement(Bar, { pct: (x.p / x.g) * 100, color: x.c })
          ))
        ),
        React.createElement('div', { style: s.card },
          React.createElement('div', { style: s.cHead }, React.createElement('div', { style: s.cTitle }, '💵 Breakdown')),
          React.createElement('div', { style: { padding: '14px 16px', background: t.input, borderRadius: 12, marginBottom: 8, display: 'flex', justifyContent: 'space-between', fontSize: 14 } },
            React.createElement('span', { style: { color: t.muted } }, 'Base Salary'),
            React.createElement('span', null, incSet.base.toLocaleString() + ' CHF')
          ),
          React.createElement('div', { style: { padding: '14px 16px', background: t.input, borderRadius: 12, marginBottom: 8, display: 'flex', justifyContent: 'space-between', fontSize: 14 } },
            React.createElement('span', { style: { color: t.muted } }, 'Commission'),
            React.createElement('span', { style: { color: t.green } }, '+' + commission.toLocaleString() + ' CHF')
          ),
          React.createElement('div', { style: { padding: '16px 18px', background: t.accent + '15', borderRadius: 12, display: 'flex', justifyContent: 'space-between', fontSize: 16, fontWeight: 600 } },
            React.createElement('span', null, 'Total'),
            React.createElement('span', { style: { color: t.accent } }, income.toLocaleString() + ' CHF')
          )
        ),
        React.createElement('div', { style: { ...s.card, gridColumn: '1 / -1' } },
          React.createElement('div', { style: s.cHead }, React.createElement('div', { style: s.cTitle }, '📈 6-Month Trends')),
          React.createElement(LineChart, { data: monthlyHistory, keys: ['income'], colors: [t.green], height: 160 })
        ),
        React.createElement('div', { style: { ...s.card, gridColumn: '1 / -1' } },
          React.createElement('div', { style: s.cHead }, React.createElement('div', { style: s.cTitle }, '📊 Activity')),
          React.createElement(LineChart, { data: monthlyHistory, keys: ['deals', 'consults', 'calls'], colors: [t.orange, t.green, t.blue], height: 140 }),
          React.createElement('div', { style: s.legend },
            React.createElement('div', { style: s.legendItem }, React.createElement('div', { style: { ...s.legendDot, background: t.orange } }), ' Deals'),
            React.createElement('div', { style: s.legendItem }, React.createElement('div', { style: { ...s.legendDot, background: t.green } }), ' Consults'),
            React.createElement('div', { style: s.legendItem }, React.createElement('div', { style: { ...s.legendDot, background: t.blue } }), ' Calls')
          )
        )
      ),
      // YEAR TAB
      tab === 'year' && React.createElement('div', { style: s.mainG },
        React.createElement('div', { style: { ...s.card, gridColumn: '1 / -1' } },
          React.createElement('div', { style: s.cHead }, React.createElement('div', { style: s.cTitle }, '🎯 2026 Goals')),
          React.createElement('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 } },
            [{ n: '120K CHF Income', d: Math.round(totalIncomeYear / 1000) + 'K earned', p: totalIncomeYear, g: 120000, c: t.green },
             { n: '48 Deals', d: totalDealsYear + ' closed', p: totalDealsYear, g: 48, c: t.orange },
             { n: '365 Day Streak', d: player.streak.current + ' days', p: player.streak.current, g: 365, c: t.red }
            ].map((x, i) => React.createElement('div', { key: i, style: { background: t.input, borderRadius: 16, padding: 20 } },
              React.createElement('div', { style: { fontSize: 17, fontWeight: 600, marginBottom: 4 } }, x.n),
              React.createElement('div', { style: { fontSize: 12, color: t.muted, marginBottom: 12 } }, x.d),
              React.createElement(Bar, { pct: (x.p / x.g) * 100, color: x.c }),
              React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', fontSize: 12, marginTop: 8 } },
                React.createElement('span', { style: { color: t.muted } }, ((x.p / x.g) * 100).toFixed(1) + '%'),
                React.createElement('span', { style: { color: x.c, fontWeight: 600 } }, x.p.toLocaleString() + '/' + x.g.toLocaleString())
              )
            ))
          )
        ),
        React.createElement('div', { style: { ...s.card, gridColumn: '1 / -1' } },
          React.createElement('div', { style: s.cHead }, React.createElement('div', { style: s.cTitle }, '📈 Year Progress')),
          React.createElement(LineChart, { data: monthlyHistory, keys: ['income', 'deals'], colors: [t.green, t.orange], height: 180 }),
          React.createElement('div', { style: s.legend },
            React.createElement('div', { style: s.legendItem }, React.createElement('div', { style: { ...s.legendDot, background: t.green } }), ' Income'),
            React.createElement('div', { style: s.legendItem }, React.createElement('div', { style: { ...s.legendDot, background: t.orange } }), ' Deals')
          )
        )
      ),
      // SKILLS TAB
      tab === 'skills' && React.createElement('div', { style: s.mainG },
        React.createElement('div', { style: s.card },
          React.createElement('div', { style: s.cHead }, React.createElement('div', { style: s.cTitle }, '📊 Overview')),
          React.createElement('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 } },
            React.createElement('div', { style: { ...s.stat, background: t.green + '10' } }, React.createElement('div', { style: { fontSize: 28, fontWeight: 700, color: t.green } }, income.toLocaleString()), React.createElement('div', { style: { fontSize: 11, color: t.muted, marginTop: 4 } }, 'Income')),
            React.createElement('div', { style: { ...s.stat, background: t.accent2 + '10' } }, React.createElement('div', { style: { fontSize: 28, fontWeight: 700, color: t.accent2 } }, player.totalXP.toLocaleString()), React.createElement('div', { style: { fontSize: 11, color: t.muted, marginTop: 4 } }, 'XP')),
            React.createElement('div', { style: { ...s.stat, background: t.orange + '10' } }, React.createElement('div', { style: { fontSize: 28, fontWeight: 700, color: t.orange } }, deals.length), React.createElement('div', { style: { fontSize: 11, color: t.muted, marginTop: 4 } }, 'Deals')),
            React.createElement('div', { style: { ...s.stat, background: t.blue + '10' } }, React.createElement('div', { style: { fontSize: 28, fontWeight: 700, color: t.blue } }, calls.length), React.createElement('div', { style: { fontSize: 11, color: t.muted, marginTop: 4 } }, 'Calls'))
          ),
          React.createElement('div', { style: { marginTop: 16 } },
            [{ icon: '🔥', n: 'Current Streak', v: player.streak.current, c: t.red }, { icon: '⭐', n: 'Best Streak', v: player.streak.best, c: t.orange }].map((x, i) =>
              React.createElement('div', { key: i, style: { display: 'flex', alignItems: 'center', gap: 12, padding: 14, background: t.input, borderRadius: 12, marginBottom: 8 } },
                React.createElement('span', { style: { fontSize: 28 } }, x.icon),
                React.createElement('div', { style: { flex: 1, fontSize: 14, fontWeight: 500 } }, x.n),
                React.createElement('div', { style: { fontSize: 28, fontWeight: 700, color: x.c } }, x.v)
              )
            )
          )
        ),
        React.createElement('div', { style: s.card },
          React.createElement('div', { style: s.cHead }, React.createElement('div', { style: s.cTitle }, '⚡ Skill Trees')),
          Object.entries(cats).map(([k, v]) => React.createElement('div', { key: k, style: { display: 'flex', alignItems: 'center', gap: 12, padding: 14, background: t.input, borderRadius: 14, marginBottom: 10 } },
            React.createElement('div', { style: { fontSize: 24, width: 46, height: 46, display: 'flex', alignItems: 'center', justifyContent: 'center', background: v.grad, borderRadius: 12 } }, v.icon),
            React.createElement('div', { style: { flex: 1 } },
              React.createElement('div', { style: { fontSize: 14, fontWeight: 500 } }, v.name),
              React.createElement('div', { style: { fontSize: 11, color: t.muted } }, 'Lv ' + (skillLvls[k]?.lvl || 1) + ' • ' + (skillLvls[k]?.xp || 0) + ' XP')
            ),
            React.createElement('div', { style: { width: 80, height: 6, background: t.border, borderRadius: 3, overflow: 'hidden' } },
              React.createElement('div', { style: { height: '100%', width: ((skillLvls[k]?.prog || 0) * 100) + '%', background: v.color } })
            )
          ))
        ),
        whoopHist.length > 0 && React.createElement('div', { style: { ...s.card, gridColumn: '1 / -1' } },
          React.createElement('div', { style: s.cHead }, React.createElement('div', { style: s.cTitle }, '❤️ Health History')),
          React.createElement(LineChart, { data: whoopHist.slice(-14), keys: ['recovery', 'sleep'], colors: [t.green, t.blue], height: 140 }),
          React.createElement('div', { style: s.legend },
            React.createElement('div', { style: s.legendItem }, React.createElement('div', { style: { ...s.legendDot, background: t.green } }), ' Recovery'),
            React.createElement('div', { style: s.legendItem }, React.createElement('div', { style: { ...s.legendDot, background: t.blue } }), ' Sleep')
          )
        )
      ),
      // ACHIEVEMENTS TAB
      tab === 'achievements' && React.createElement('div', { style: s.card },
        React.createElement('div', { style: s.cHead },
          React.createElement('div', { style: s.cTitle }, '🏆 Achievements'),
          React.createElement('span', { style: { fontSize: 13, color: t.muted } }, achievements.filter(a => a.unlocked).length + '/' + achievements.length)
        ),
        React.createElement('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: 12 } },
          achievements.map(a => React.createElement('div', { key: a.id, style: { background: t.input, borderRadius: 16, padding: 18, textAlign: 'center', opacity: a.unlocked ? 1 : 0.35, filter: a.unlocked ? 'none' : 'grayscale(1)', border: a.unlocked ? '2px solid ' + t.accent + '30' : '2px solid transparent' } },
            React.createElement('div', { style: { fontSize: 38, marginBottom: 8 } }, a.icon),
            React.createElement('div', { style: { fontSize: 13, fontWeight: 600 } }, a.name),
            React.createElement('div', { style: { fontSize: 10, color: t.muted, marginTop: 4 } }, a.desc)
          ))
        )
      )
    ),
    modal === 'editDeal' && editItem && React.createElement('div', { style: s.modal, onClick: () => setModal(null) },
      React.createElement('div', { style: s.mBox, onClick: e => e.stopPropagation() },
        React.createElement('div', { style: s.mHead }, React.createElement('h3', { style: s.mTitle }, 'Edit Deal'), React.createElement('button', { style: s.mClose, onClick: () => setModal(null) }, '×')),
        React.createElement('label', { style: s.label }, 'Client'),
        React.createElement('input', { style: s.inp, value: editItem.client, onChange: e => setEditItem({ ...editItem, client: e.target.value }) }),
        React.createElement('label', { style: s.label }, 'Product'),
        React.createElement('input', { style: s.inp, value: editItem.product, onChange: e => setEditItem({ ...editItem, product: e.target.value }) }),
        React.createElement('label', { style: s.label }, 'Commission'),
        React.createElement('input', { style: s.inp, type: 'number', value: editItem.commission, onChange: e => setEditItem({ ...editItem, commission: +e.target.value }) }),
        React.createElement('label', { style: s.label }, 'Date'),
        React.createElement('input', { style: s.inp, type: 'date', value: editItem.date, onChange: e => setEditItem({ ...editItem, date: e.target.value }) }),
        React.createElement('div', { style: { display: 'flex', gap: 10 } },
          React.createElement('button', { style: { ...s.btn, ...s.btnP, flex: 1, padding: 16 }, onClick: updateDeal }, 'Save'),
          React.createElement('button', { style: { ...s.btn, ...s.btnD, padding: 16 }, onClick: () => deleteDeal(editItem.id) }, 'Delete')
        )
      )
    ),
    modal === 'addConsult' && React.createElement('div', { style: s.modal, onClick: () => setModal(null) },
      React.createElement('div', { style: s.mBox, onClick: e => e.stopPropagation() },
        React.createElement('div', { style: s.mHead }, React.createElement('h3', { style: s.mTitle }, 'Log Consultation'), React.createElement('button', { style: s.mClose, onClick: () => setModal(null) }, '×')),
        React.createElement('label', { style: s.label }, 'Client Name'),
        React.createElement('input', { style: s.inp, placeholder: 'Enter client name', value: newConsult.client, onChange: e => setNewConsult({ ...newConsult, client: e.target.value }) }),
        React.createElement('label', { style: s.label }, 'Type'),
        React.createElement('select', { style: s.sel, value: newConsult.type, onChange: e => setNewConsult({ ...newConsult, type: e.target.value }) },
          React.createElement('option', null, 'Pension'), React.createElement('option', null, 'Retirement'), React.createElement('option', null, 'Life Insurance'), React.createElement('option', null, 'Investment'), React.createElement('option', null, 'Health Insurance')
        ),
        React.createElement('label', { style: s.label }, 'Status'),
        React.createElement('select', { style: s.sel, value: newConsult.status, onChange: e => setNewConsult({ ...newConsult, status: e.target.value }) },
          React.createElement('option', { value: 'scheduled' }, 'Scheduled'), React.createElement('option', { value: 'completed' }, 'Completed'), React.createElement('option', { value: 'application' }, 'Application'), React.createElement('option', { value: 'closed' }, 'Closed'), React.createElement('option', { value: 'lost' }, 'Lost')
        ),
        React.createElement('label', { style: s.label }, 'Script Adherence (1-10)'),
        React.createElement('input', { style: s.inp, type: 'number', min: 1, max: 10, placeholder: 'Rate yourself', value: newConsult.script, onChange: e => setNewConsult({ ...newConsult, script: e.target.value }) }),
        React.createElement('button', { style: { ...s.btn, ...s.btnP, width: '100%', padding: 16, marginTop: 8 }, onClick: addConsult }, 'Log Consultation')
      )
    ),
    modal === 'editConsult' && editItem && React.createElement('div', { style: s.modal, onClick: () => setModal(null) },
      React.createElement('div', { style: s.mBox, onClick: e => e.stopPropagation() },
        React.createElement('div', { style: s.mHead }, React.createElement('h3', { style: s.mTitle }, 'Edit Consultation'), React.createElement('button', { style: s.mClose, onClick: () => setModal(null) }, '×')),
        React.createElement('label', { style: s.label }, 'Client'),
        React.createElement('input', { style: s.inp, value: editItem.client, onChange: e => setEditItem({ ...editItem, client: e.target.value }) }),
        React.createElement('label', { style: s.label }, 'Status'),
        React.createElement('select', { style: s.sel, value: editItem.status, onChange: e => setEditItem({ ...editItem, status: e.target.value }) },
          React.createElement('option', { value: 'scheduled' }, 'Scheduled'), React.createElement('option', { value: 'completed' }, 'Completed'), React.createElement('option', { value: 'application' }, 'Application'), React.createElement('option', { value: 'closed' }, 'Closed'), React.createElement('option', { value: 'lost' }, 'Lost')
        ),
        React.createElement('label', { style: s.label }, 'Script (1-10)'),
        React.createElement('input', { style: s.inp, type: 'number', value: editItem.script || '', onChange: e => setEditItem({ ...editItem, script: +e.target.value || null }) }),
        React.createElement('div', { style: { display: 'flex', gap: 10 } },
          React.createElement('button', { style: { ...s.btn, ...s.btnP, flex: 1, padding: 16 }, onClick: updateConsult }, 'Save'),
          React.createElement('button', { style: { ...s.btn, ...s.btnD, padding: 16 }, onClick: () => deleteConsult(editItem.id) }, 'Delete')
        )
      )
    ),
    modal === 'addCall' && React.createElement('div', { style: s.modal, onClick: () => setModal(null) },
      React.createElement('div', { style: s.mBox, onClick: e => e.stopPropagation() },
        React.createElement('div', { style: s.mHead }, React.createElement('h3', { style: s.mTitle }, 'Log Call'), React.createElement('button', { style: s.mClose, onClick: () => setModal(null) }, '×')),
        React.createElement('label', { style: s.label }, 'Client/Prospect Name'),
        React.createElement('input', { style: s.inp, placeholder: 'Enter name', value: newCall.client, onChange: e => setNewCall({ ...newCall, client: e.target.value }) }),
        React.createElement('label', { style: s.label }, 'Outcome'),
        React.createElement('select', { style: s.sel, value: newCall.outcome, onChange: e => setNewCall({ ...newCall, outcome: e.target.value }) },
          React.createElement('option', { value: 'answered' }, 'Answered'), React.createElement('option', { value: 'voicemail' }, 'Voicemail'), React.createElement('option', { value: 'no-answer' }, 'No Answer'), React.createElement('option', { value: 'callback' }, 'Callback Scheduled')
        ),
        React.createElement('label', { style: s.label }, 'Notes'),
        React.createElement('input', { style: s.inp, placeholder: 'Quick note (optional)', value: newCall.notes, onChange: e => setNewCall({ ...newCall, notes: e.target.value }) }),
        React.createElement('button', { style: { ...s.btn, ...s.btnP, width: '100%', padding: 16, marginTop: 8 }, onClick: addCall }, 'Log Call')
      )
    ),
    modal === 'editCall' && editItem && React.createElement('div', { style: s.modal, onClick: () => setModal(null) },
      React.createElement('div', { style: s.mBox, onClick: e => e.stopPropagation() },
        React.createElement('div', { style: s.mHead }, React.createElement('h3', { style: s.mTitle }, 'Edit Call'), React.createElement('button', { style: s.mClose, onClick: () => setModal(null) }, '×')),
        React.createElement('label', { style: s.label }, 'Client'),
        React.createElement('input', { style: s.inp, value: editItem.client, onChange: e => setEditItem({ ...editItem, client: e.target.value }) }),
        React.createElement('label', { style: s.label }, 'Outcome'),
        React.createElement('select', { style: s.sel, value: editItem.outcome, onChange: e => setEditItem({ ...editItem, outcome: e.target.value }) },
          React.createElement('option', { value: 'answered' }, 'Answered'), React.createElement('option', { value: 'voicemail' }, 'Voicemail'), React.createElement('option', { value: 'no-answer' }, 'No Answer'), React.createElement('option', { value: 'callback' }, 'Callback')
        ),
        React.createElement('label', { style: s.label }, 'Notes'),
        React.createElement('input', { style: s.inp, value: editItem.notes, onChange: e => setEditItem({ ...editItem, notes: e.target.value }) }),
        React.createElement('div', { style: { display: 'flex', gap: 10 } },
          React.createElement('button', { style: { ...s.btn, ...s.btnP, flex: 1, padding: 16 }, onClick: updateCall }, 'Save'),
          React.createElement('button', { style: { ...s.btn, ...s.btnD, padding: 16 }, onClick: () => deleteCall(editItem.id) }, 'Delete')
        )
      )
    ),
    modal === 'addQuest' && React.createElement('div', { style: s.modal, onClick: () => setModal(null) },
      React.createElement('div', { style: s.mBox, onClick: e => e.stopPropagation() },
        React.createElement('div', { style: s.mHead }, React.createElement('h3', { style: s.mTitle }, 'Add Quest'), React.createElement('button', { style: s.mClose, onClick: () => setModal(null) }, '×')),
        React.createElement('label', { style: s.label }, 'Quest Name'),
        React.createElement('input', { style: s.inp, placeholder: 'Enter name', value: newQuest.name, onChange: e => setNewQuest({ ...newQuest, name: e.target.value }) }),
        React.createElement('label', { style: s.label }, 'Description'),
        React.createElement('input', { style: s.inp, placeholder: 'Short description', value: newQuest.desc, onChange: e => setNewQuest({ ...newQuest, desc: e.target.value }) }),
        React.createElement('label', { style: s.label }, 'XP Value'),
        React.createElement('input', { style: s.inp, type: 'number', value: newQuest.xp, onChange: e => setNewQuest({ ...newQuest, xp: e.target.value }) }),
        React.createElement('label', { style: s.label }, 'Category'),
        React.createElement('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginBottom: 12 } },
          Object.entries(cats).map(([k, v]) => React.createElement('div', { key: k, onClick: () => setNewQuest({ ...newQuest, cat: k }), style: { padding: 14, borderRadius: 12, cursor: 'pointer', textAlign: 'center', background: v.grad, border: newQuest.cat === k ? '3px solid #fff' : '3px solid transparent', transform: newQuest.cat === k ? 'scale(1.05)' : 'scale(1)', opacity: newQuest.cat === k ? 1 : 0.7 } },
            React.createElement('div', { style: { fontSize: 20 } }, v.icon),
            React.createElement('div', { style: { fontSize: 10, fontWeight: 600, color: '#fff', marginTop: 4 } }, v.name)
          ))
        ),
        React.createElement('label', { style: { display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16, fontSize: 14 } },
          React.createElement('input', { type: 'checkbox', checked: newQuest.neg, onChange: e => setNewQuest({ ...newQuest, neg: e.target.checked }), style: { width: 20, height: 20 } }), ' Negative XP (Vice)'
        ),
        React.createElement('button', { style: { ...s.btn, ...s.btnP, width: '100%', padding: 16 }, onClick: addQuest }, 'Add Quest')
      )
    ),
    modal === 'editQuests' && React.createElement('div', { style: s.modal, onClick: () => setModal(null) },
      React.createElement('div', { style: s.mBox, onClick: e => e.stopPropagation() },
        React.createElement('div', { style: s.mHead }, React.createElement('h3', { style: s.mTitle }, 'Edit Quests'), React.createElement('button', { style: s.mClose, onClick: () => setModal(null) }, '×')),
        React.createElement('div', { style: { maxHeight: 400, overflowY: 'auto' } },
          questLib.map(q => React.createElement('div', { key: q.id, onClick: () => setQuestLib(p => p.map(x => x.id === q.id ? { ...x, on: !x.on } : x)), style: { display: 'flex', alignItems: 'center', gap: 10, padding: '12px 14px', background: q.on ? t.accent + '15' : t.input, border: q.on ? '1px solid ' + t.accent + '40' : '1px solid transparent', borderRadius: 10, marginBottom: 6, cursor: 'pointer' } },
            React.createElement('div', { style: { width: 6, height: 6, borderRadius: 3, background: q.neg ? t.red : cats[q.cat]?.color } }),
            React.createElement('div', { style: { width: 20, height: 20, borderRadius: 6, border: q.on ? 'none' : '2px solid ' + t.muted, background: q.on ? t.accent : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, color: '#000' } }, q.on && '✓'),
            React.createElement('div', { style: { flex: 1, fontSize: 13, fontWeight: 500 } }, q.name),
            React.createElement('span', { style: { fontSize: 11, color: q.neg ? t.red : t.accent2, fontWeight: 600 } }, (q.xp > 0 ? '+' : '') + q.xp)
          ))
        ),
        React.createElement('button', { style: { ...s.btn, ...s.btnP, width: '100%', marginTop: 16, padding: 16 }, onClick: () => { setTodayQ(questLib.filter(q => q.on).map(q => { const ex = todayQ.find(x => x.id === q.id); return ex ? { ...q, done: ex.done } : { ...q, done: false }; })); setModal(null); showToast('Updated!'); } }, 'Apply (' + questLib.filter(q => q.on).length + ' active)')
      )
    ),
    modal === 'whoop' && React.createElement('div', { style: s.modal, onClick: () => setModal(null) },
      React.createElement('div', { style: s.mBox, onClick: e => e.stopPropagation() },
        React.createElement('div', { style: s.mHead }, React.createElement('h3', { style: s.mTitle }, 'Update Health'), React.createElement('button', { style: s.mClose, onClick: () => setModal(null) }, '×')),
        React.createElement('label', { style: s.label }, 'Recovery %'),
        React.createElement('input', { style: s.inp, type: 'number', min: 0, max: 100, value: whoop.recovery, onChange: e => setWhoop({ ...whoop, recovery: +e.target.value || 0 }) }),
        React.createElement('label', { style: s.label }, 'Sleep %'),
        React.createElement('input', { style: s.inp, type: 'number', min: 0, max: 100, value: whoop.sleep, onChange: e => setWhoop({ ...whoop, sleep: +e.target.value || 0 }) }),
        React.createElement('label', { style: s.label }, 'Strain (0-21)'),
        React.createElement('input', { style: s.inp, type: 'number', step: 0.1, min: 0, max: 21, value: whoop.strain, onChange: e => setWhoop({ ...whoop, strain: +e.target.value || 0 }) }),
        React.createElement('label', { style: s.label }, 'HRV'),
        React.createElement('input', { style: s.inp, type: 'number', value: whoop.hrv, onChange: e => setWhoop({ ...whoop, hrv: +e.target.value || 0 }) }),
        React.createElement('button', { style: { ...s.btn, ...s.btnP, width: '100%', padding: 16, marginTop: 8 }, onClick: saveWhoop }, 'Save')
      )
    ),
    modal === 'avatar' && React.createElement('div', { style: s.modal, onClick: () => setModal(null) },
      React.createElement('div', { style: s.mBox, onClick: e => e.stopPropagation() },
        React.createElement('div', { style: s.mHead }, React.createElement('h3', { style: s.mTitle }, 'Select Avatar'), React.createElement('button', { style: s.mClose, onClick: () => setModal(null) }, '×')),
        React.createElement('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 } },
          avatars.map(a => React.createElement('div', { key: a.id, onClick: () => selectAvatar(a.id), style: { textAlign: 'center', padding: 14, background: player.avatar === a.id ? t.accent + '20' : t.input, border: player.avatar === a.id ? '2px solid ' + t.accent : '2px solid transparent', borderRadius: 14, opacity: player.level >= a.lvl ? 1 : 0.4, cursor: player.level >= a.lvl ? 'pointer' : 'not-allowed' } },
            React.createElement('div', { style: { fontSize: 32 } }, a.icon),
            React.createElement('div', { style: { fontSize: 11, fontWeight: 600, marginTop: 6 } }, a.name),
            React.createElement('div', { style: { fontSize: 10, color: t.muted } }, 'Lv ' + a.lvl)
          ))
        )
      )
    ),
    modal === 'incomeSet' && React.createElement('div', { style: s.modal, onClick: () => setModal(null) },
      React.createElement('div', { style: s.mBox, onClick: e => e.stopPropagation() },
        React.createElement('div', { style: s.mHead }, React.createElement('h3', { style: s.mTitle }, '💰 Income Settings'), React.createElement('button', { style: s.mClose, onClick: () => setModal(null) }, '×')),
        React.createElement('label', { style: s.label }, 'Base Salary (CHF)'),
        React.createElement('input', { style: s.inp, type: 'number', value: incSet.base, onChange: e => setIncSet({ ...incSet, base: +e.target.value || 0 }) }),
        React.createElement('label', { style: s.label }, 'Monthly Target (CHF)'),
        React.createElement('input', { style: s.inp, type: 'number', value: incSet.target, onChange: e => setIncSet({ ...incSet, target: +e.target.value || 0 }) }),
        React.createElement('label', { style: s.label }, 'Monthly Deals Target'),
        React.createElement('input', { style: s.inp, type: 'number', value: incSet.dealsTarget, onChange: e => setIncSet({ ...incSet, dealsTarget: +e.target.value || 0 }) }),
        React.createElement('label', { style: s.label }, 'Monthly Consultations Target'),
        React.createElement('input', { style: s.inp, type: 'number', value: incSet.consultsTarget, onChange: e => setIncSet({ ...incSet, consultsTarget: +e.target.value || 0 }) }),
        React.createElement('label', { style: s.label }, 'Monthly Calls Target'),
        React.createElement('input', { style: s.inp, type: 'number', value: incSet.callsTarget, onChange: e => setIncSet({ ...incSet, callsTarget: +e.target.value || 0 }) }),
        React.createElement('button', { style: { ...s.btn, ...s.btnP, width: '100%', padding: 16, marginTop: 8 }, onClick: () => { setModal(null); showToast('Saved!'); } }, 'Save')
      )
    ),
    modal === 'weeklySet' && React.createElement('div', { style: s.modal, onClick: () => setModal(null) },
      React.createElement('div', { style: s.mBox, onClick: e => e.stopPropagation() },
        React.createElement('div', { style: s.mHead }, React.createElement('h3', { style: s.mTitle }, '📅 Weekly Targets'), React.createElement('button', { style: s.mClose, onClick: () => setModal(null) }, '×')),
        React.createElement('label', { style: s.label }, 'Weekly Deals Target'),
        React.createElement('input', { style: s.inp, type: 'number', value: weeklyTargets.deals, onChange: e => setWeeklyTargets({ ...weeklyTargets, deals: +e.target.value || 0 }) }),
        React.createElement('label', { style: s.label }, 'Weekly Consultations Target'),
        React.createElement('input', { style: s.inp, type: 'number', value: weeklyTargets.consults, onChange: e => setWeeklyTargets({ ...weeklyTargets, consults: +e.target.value || 0 }) }),
        React.createElement('label', { style: s.label }, 'Weekly Calls Target'),
        React.createElement('input', { style: s.inp, type: 'number', value: weeklyTargets.calls, onChange: e => setWeeklyTargets({ ...weeklyTargets, calls: +e.target.value || 0 }) }),
        React.createElement('button', { style: { ...s.btn, ...s.btnP, width: '100%', padding: 16, marginTop: 8 }, onClick: () => { setModal(null); showToast('Saved!'); } }, 'Save')
      )
    ),
    modal === 'settings' && React.createElement('div', { style: s.modal, onClick: () => setModal(null) },
      React.createElement('div', { style: s.mBox, onClick: e => e.stopPropagation() },
        React.createElement('div', { style: s.mHead }, React.createElement('h3', { style: s.mTitle }, '⚙️ Settings'), React.createElement('button', { style: s.mClose, onClick: () => setModal(null) }, '×')),
        React.createElement('div', { style: { marginBottom: 24 } },
          React.createElement('div', { style: { fontSize: 13, fontWeight: 600, marginBottom: 12 } }, '🎨 Appearance'),
          React.createElement('div', { style: { display: 'flex', gap: 10 } },
            React.createElement('button', { onClick: () => setDark(true), style: { ...s.btn, flex: 1, padding: 14, background: dark ? t.accent : t.input, color: dark ? '#000' : t.text } }, '🌙 Dark'),
            React.createElement('button', { onClick: () => setDark(false), style: { ...s.btn, flex: 1, padding: 14, background: !dark ? t.accent : t.input, color: !dark ? '#000' : t.text } }, '☀️ Light')
          )
        ),
        React.createElement('div', { style: { marginBottom: 24 } },
          React.createElement('div', { style: { fontSize: 13, fontWeight: 600, marginBottom: 12 } }, '⚠️ Danger Zone'),
          React.createElement('button', { onClick: () => { if(confirm('Reset ALL data?')) { localStorage.clear(); location.reload(); }}, style: { ...s.btn, ...s.btnD, width: '100%', padding: 14 } }, '🗑️ Reset All Data')
        ),
        React.createElement('button', { style: { ...s.btn, ...s.btnS, width: '100%', padding: 14 }, onClick: () => setModal(null) }, 'Close')
      )
    ),
    // TOAST
    React.createElement('div', { style: s.toastStyle }, toast.msg)
  );
};

ReactDOM.createRoot(document.getElementById('root')).render(React.createElement(App));
