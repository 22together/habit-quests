// INEVITABLE 2026 - V7.0
// New: Tools tab (Pomodoro, Journal, Breathwork), Fixed modals, Consistent colors
const { useState, useEffect, useMemo, useCallback } = React;

const App = () => {
  // Settings
  const [settings, setSettings] = useState(() => JSON.parse(localStorage.getItem('v7_settings') ?? '{"timezone":"Europe/Zurich","theme":"auto"}'));
  
  const getAutoTheme = () => {
    const hour = new Date().getHours();
    return hour >= 6 && hour < 20 ? 'light' : 'dark';
  };
  
  const [dark, setDark] = useState(() => {
    if (settings.theme === 'auto') return getAutoTheme() === 'dark';
    return settings.theme === 'dark';
  });

  useEffect(() => {
    if (settings.theme === 'auto') {
      setDark(getAutoTheme() === 'dark');
      const interval = setInterval(() => setDark(getAutoTheme() === 'dark'), 60000);
      return () => clearInterval(interval);
    } else {
      setDark(settings.theme === 'dark');
    }
  }, [settings.theme]);

  // Consistent color palette
  const colors = { green: '#30d158', orange: '#ff9f0a', blue: '#0a84ff', purple: '#a78bfa', red: '#ff453a', teal: '#2dd4bf' };

  const t = dark ? {
    bg: '#0a0a0f', card: 'rgba(22,22,30,0.95)', border: 'rgba(255,255,255,0.06)',
    text: '#f5f5f7', muted: '#6e6e73', accent: colors.teal, accent2: colors.purple,
    ...colors, input: 'rgba(28,28,35,0.9)'
  } : {
    bg: '#f5f5f7', card: 'rgba(255,255,255,0.95)', border: 'rgba(0,0,0,0.06)',
    text: '#1d1d1f', muted: '#86868b', accent: '#0d9488', accent2: '#7c3aed',
    green: '#34c759', red: '#ff3b30', orange: '#ff9500', blue: '#007aff', purple: '#7c3aed', teal: '#0d9488', input: 'rgba(245,245,247,0.9)'
  };

  const [tab, setTab] = useState('today');
  const [toast, setToast] = useState({ show: false, msg: '' });
  const [modal, setModal] = useState(null);
  const [editItem, setEditItem] = useState(null);

  // Pomodoro state
  const [pomo, setPomo] = useState({ active: false, mode: 'work', timeLeft: 25 * 60, sessions: 0 });
  const [pomoInterval, setPomoInterval] = useState(null);

  // Breathwork state
  const [breath, setBreath] = useState({ active: false, phase: 'ready', cycle: 0, scale: 1 });
  const [breathInterval, setBreathInterval] = useState(null);

  // Journal state
  const [journal, setJournal] = useState(() => JSON.parse(localStorage.getItem('v7_journal') ?? '[]'));
  const [journalEntry, setJournalEntry] = useState('');

  const avatars = [
    { id: 'default', icon: '👤', name: 'Rookie', lvl: 1 }, { id: 'warrior', icon: '⚔️', name: 'Warrior', lvl: 3 },
    { id: 'sage', icon: '🧙', name: 'Sage', lvl: 5 }, { id: 'champion', icon: '🏆', name: 'Champion', lvl: 7 },
    { id: 'phoenix', icon: '🔥', name: 'Phoenix', lvl: 10 }, { id: 'diamond', icon: '💎', name: 'Diamond', lvl: 15 },
    { id: 'crown', icon: '👑', name: 'King', lvl: 20 }, { id: 'dragon', icon: '🐉', name: 'Dragon', lvl: 50 }
  ];

  const timezones = ['Europe/Zurich', 'Europe/London', 'Europe/Berlin', 'Europe/Paris', 'America/New_York', 'America/Los_Angeles', 'Asia/Tokyo', 'Asia/Singapore', 'Australia/Sydney'];

  const cats = {
    sales: { icon: '📈', name: 'Sales', color: colors.green },
    mindset: { icon: '🧠', name: 'Mindset', color: colors.purple },
    discipline: { icon: '⚔️', name: 'Discipline', color: colors.red },
    growth: { icon: '📚', name: 'Growth', color: colors.blue },
    health: { icon: '💪', name: 'Health', color: colors.orange },
    planning: { icon: '🎯', name: 'Planning', color: colors.teal }
  };

  const defQuests = [
    { id:'h1', name:'Cold Exposure', desc:'2-3 min cold shower', xp:40, cat:'health', on:true, neg:false },
    { id:'h2', name:'Morning Sunlight', desc:'10 min sunlight', xp:35, cat:'health', on:true, neg:false },
    { id:'h3', name:'10,000 Steps', desc:'Daily movement', xp:50, cat:'health', on:true, neg:false },
    { id:'h4', name:'Sleep by 22:30', desc:'Recovery optimization', xp:40, cat:'health', on:true, neg:false },
    { id:'d1', name:'Fasted Until 13:00', desc:'Only kefir allowed', xp:30, cat:'discipline', on:true, neg:false },
    { id:'d2', name:'No Phone in Office', desc:'Deep work mode', xp:30, cat:'discipline', on:true, neg:false },
    { id:'m1', name:'Morning Ritual', desc:'Prayer & visualization', xp:50, cat:'mindset', on:true, neg:false },
    { id:'s1', name:'Script Practice', desc:'20 min rehearsal', xp:40, cat:'sales', on:true, neg:false },
    { id:'s2', name:'5 Prospecting Calls', desc:'Outbound calls', xp:60, cat:'sales', on:true, neg:false },
    { id:'s3', name:'Client Consultation', desc:'Meeting', xp:100, cat:'sales', on:true, neg:false, main:true },
    { id:'p1', name:'CRM Update', desc:'Log activities', xp:25, cat:'planning', on:true, neg:false },
    { id:'p2', name:'Evening Review', desc:'Plan tomorrow', xp:40, cat:'planning', on:true, neg:false },
    { id:'g1', name:'Read 20 Pages', desc:'Sales/growth books', xp:35, cat:'growth', on:true, neg:false },
    { id:'n1', name:'🚬 Smoked', desc:'Cigarettes/vape', xp:-50, cat:'health', on:true, neg:true },
    { id:'n2', name:'🍺 Alcohol', desc:'Drank on work night', xp:-40, cat:'discipline', on:true, neg:true },
    { id:'n3', name:'🍔 Junk Food', desc:'Unhealthy eating', xp:-30, cat:'health', on:true, neg:true },
    { id:'n4', name:'📱 Doomscrolled', desc:'Social media waste', xp:-35, cat:'discipline', on:true, neg:true },
  ];

  const defAch = [
    { id:'q1', name:'First Steps', icon:'🎯', desc:'Complete 1 quest', cond:'quest_1', unlocked:false },
    { id:'d1', name:'Closer', icon:'🤝', desc:'First deal', cond:'deal_1', unlocked:false },
    { id:'s7', name:'Week Warrior', icon:'🔥', desc:'7-day streak', cond:'streak_7', unlocked:false },
    { id:'i10', name:'10K Club', icon:'🏆', desc:'10K CHF/month', cond:'income_10000', unlocked:false },
    { id:'dd5', name:'Deal Maker', icon:'✋', desc:'5 deals', cond:'deals_5', unlocked:false },
    { id:'x1', name:'XP Hunter', icon:'⚡', desc:'1,000 XP', cond:'xp_1000', unlocked:false },
    { id:'c50', name:'Dialer', icon:'📞', desc:'50 calls', cond:'calls_50', unlocked:false },
    { id:'p10', name:'Focus Master', icon:'🍅', desc:'10 pomodoros', cond:'pomo_10', unlocked:false },
  ];

  // State
  const [player, setPlayer] = useState(() => JSON.parse(localStorage.getItem('v7_player') ?? '{"level":1,"totalXP":0,"currentXP":0,"streak":{"current":0,"best":0},"avatar":"default","pomodoros":0}'));
  const [incSet, setIncSet] = useState(() => JSON.parse(localStorage.getItem('v7_income') ?? '{"base":4166,"target":10000,"dealsTarget":4,"consultsTarget":15,"callsTarget":100}'));
  const [weeklyTargets, setWeeklyTargets] = useState(() => JSON.parse(localStorage.getItem('v7_weekly') ?? '{"deals":1,"consults":4,"calls":25}'));
  const [skillXP, setSkillXP] = useState(() => JSON.parse(localStorage.getItem('v7_skills') ?? '{"sales":0,"mindset":0,"discipline":0,"growth":0,"health":0,"planning":0}'));
  const [questLib, setQuestLib] = useState(() => JSON.parse(localStorage.getItem('v7_quests') ?? JSON.stringify(defQuests)));
  const [todayQ, setTodayQ] = useState(() => JSON.parse(localStorage.getItem('v7_today') ?? JSON.stringify(defQuests.filter(q=>q.on).map(q=>({...q,done:false})))));
  const [deals, setDeals] = useState(() => JSON.parse(localStorage.getItem('v7_deals') ?? '[]'));
  const [consults, setConsults] = useState(() => JSON.parse(localStorage.getItem('v7_consults') ?? '[]'));
  const [calls, setCalls] = useState(() => JSON.parse(localStorage.getItem('v7_calls') ?? '[]'));
  const [whoop, setWhoop] = useState(() => JSON.parse(localStorage.getItem('v7_whoop') ?? '{"recovery":70,"sleep":80,"strain":10,"hrv":55}'));
  const [whoopHist, setWhoopHist] = useState(() => JSON.parse(localStorage.getItem('v7_whoopHist') ?? '[]'));
  const [achievements, setAchievements] = useState(() => JSON.parse(localStorage.getItem('v7_ach') ?? JSON.stringify(defAch)));

  // Forms
  const [newDeal, setNewDeal] = useState({ client:'', product:'', commission:'' });
  const [newConsult, setNewConsult] = useState({ client:'', type:'Pension', status:'scheduled', script:'' });
  const [newCall, setNewCall] = useState({ client:'', outcome:'answered', notes:'' });
  const [newQuest, setNewQuest] = useState({ name:'', desc:'', xp:30, cat:'discipline', neg:false });

  const getDate = () => new Date().toLocaleDateString('en-CA', { timeZone: settings.timezone });

  // Daily reset
  const checkDailyReset = useCallback(() => {
    const today = getDate();
    const lastDate = localStorage.getItem('v7_lastDate');
    if (lastDate && lastDate !== today) {
      const activeQuests = questLib.filter(q => q.on).map(q => ({ ...q, done: false }));
      setTodayQ(activeQuests);
      setPlayer(p => ({ ...p, streak: { current: p.streak.current + 1, best: Math.max(p.streak.current + 1, p.streak.best) } }));
      showToast('☀️ New day! Quests reset.');
    }
    localStorage.setItem('v7_lastDate', today);
  }, [questLib, settings.timezone]);

  useEffect(() => { checkDailyReset(); const i = setInterval(checkDailyReset, 60000); return () => clearInterval(i); }, [checkDailyReset]);

  // Persistence
  useEffect(() => { localStorage.setItem('v7_settings', JSON.stringify(settings)); }, [settings]);
  useEffect(() => { localStorage.setItem('v7_player', JSON.stringify(player)); }, [player]);
  useEffect(() => { localStorage.setItem('v7_income', JSON.stringify(incSet)); }, [incSet]);
  useEffect(() => { localStorage.setItem('v7_weekly', JSON.stringify(weeklyTargets)); }, [weeklyTargets]);
  useEffect(() => { localStorage.setItem('v7_skills', JSON.stringify(skillXP)); }, [skillXP]);
  useEffect(() => { localStorage.setItem('v7_quests', JSON.stringify(questLib)); }, [questLib]);
  useEffect(() => { localStorage.setItem('v7_today', JSON.stringify(todayQ)); }, [todayQ]);
  useEffect(() => { localStorage.setItem('v7_deals', JSON.stringify(deals)); }, [deals]);
  useEffect(() => { localStorage.setItem('v7_consults', JSON.stringify(consults)); }, [consults]);
  useEffect(() => { localStorage.setItem('v7_calls', JSON.stringify(calls)); }, [calls]);
  useEffect(() => { localStorage.setItem('v7_whoop', JSON.stringify(whoop)); }, [whoop]);
  useEffect(() => { localStorage.setItem('v7_whoopHist', JSON.stringify(whoopHist)); }, [whoopHist]);
  useEffect(() => { localStorage.setItem('v7_ach', JSON.stringify(achievements)); }, [achievements]);
  useEffect(() => { localStorage.setItem('v7_journal', JSON.stringify(journal)); }, [journal]);

  // Computed - CONSISTENT COLORS: green=consults, orange=deals, blue=calls
  const month = new Date().toISOString().slice(0, 7);
  const year = new Date().getFullYear().toString();
  const weekStart = (() => { const d = new Date(); d.setDate(d.getDate() - d.getDay() + 1); return d.toISOString().slice(0, 10); })();
  
  const monthlyDeals = deals.filter(d => d.date?.startsWith(month));
  const monthlyConsults = consults.filter(c => c.date?.startsWith(month));
  const monthlyCalls = calls.filter(c => c.date?.startsWith(month));
  const weeklyDeals = deals.filter(d => d.date >= weekStart);
  const weeklyConsults = consults.filter(c => c.date >= weekStart);
  const weeklyCalls = calls.filter(c => c.date >= weekStart);
  const yearlyDeals = deals.filter(d => d.date?.startsWith(year));
  const yearlyCalls = calls.filter(c => c.date?.startsWith(year));

  const commission = monthlyDeals.reduce((s, d) => s + (d.commission || 0), 0);
  const income = incSet.base + commission;
  const yearlyIncome = yearlyDeals.reduce((s, d) => s + (d.commission || 0), 0) + (incSet.base * (new Date().getMonth() + 1));
  
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

  // Monthly history for charts
  const monthlyHistory = useMemo(() => {
    const months = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(); d.setMonth(d.getMonth() - i);
      const ms = d.toISOString().slice(0, 7);
      const mn = d.toLocaleDateString('en', { month: 'short' });
      const mDeals = deals.filter(x => x.date?.startsWith(ms));
      const mWhoop = whoopHist.filter(x => x.date?.startsWith(ms));
      const avgRecovery = mWhoop.length ? Math.round(mWhoop.reduce((s, w) => s + w.recovery, 0) / mWhoop.length) : null;
      months.push({
        month: mn,
        income: incSet.base + mDeals.reduce((s, x) => s + (x.commission || 0), 0),
        deals: mDeals.length,
        consults: consults.filter(x => x.date?.startsWith(ms)).length,
        calls: calls.filter(x => x.date?.startsWith(ms)).length,
        recovery: avgRecovery
      });
    }
    return months;
  }, [deals, consults, calls, whoopHist, incSet.base]);

  // Achievement checker
  useEffect(() => {
    setAchievements(prev => prev.map(a => {
      if (a.unlocked) return a;
      let u = false;
      if (a.cond === 'quest_1' && donePos >= 1) u = true;
      if (a.cond === 'deal_1' && deals.length >= 1) u = true;
      if (a.cond === 'deals_5' && deals.length >= 5) u = true;
      if (a.cond === 'streak_7' && player.streak.current >= 7) u = true;
      if (a.cond === 'income_10000' && income >= 10000) u = true;
      if (a.cond === 'xp_1000' && player.totalXP >= 1000) u = true;
      if (a.cond === 'calls_50' && calls.length >= 50) u = true;
      if (a.cond === 'pomo_10' && player.pomodoros >= 10) u = true;
      if (u) { setTimeout(() => showToast('🏆 ' + a.name + '!'), 500); return { ...a, unlocked: true }; }
      return a;
    }));
  }, [deals, player, income, donePos, calls]);

  const showToast = (msg) => { setToast({ show: true, msg }); setTimeout(() => setToast({ show: false, msg: '' }), 3000); };
  const calcLvl = (xp) => ({ level: Math.floor(xp / 500) + 1, currentXP: xp % 500 });

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

  // CRUD handlers
  const addDeal = () => {
    if (!newDeal.client) { showToast('Enter client name'); return; }
    const deal = { id: 'd' + Date.now(), date: getDate(), client: newDeal.client, product: newDeal.product, commission: +newDeal.commission || 0 };
    setDeals(p => [...p, deal]);
    showToast('💰 Deal +' + deal.commission + ' CHF');
    setNewDeal({ client: '', product: '', commission: '' });
    setModal(null);
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
    if (!newConsult.client) { showToast('Enter client name'); return; }
    setConsults(p => [...p, { id: 'c' + Date.now(), date: getDate(), ...newConsult, script: +newConsult.script || null }]);
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
    if (!newCall.client) { showToast('Enter name'); return; }
    setCalls(p => [...p, { id: 'call' + Date.now(), date: getDate(), ...newCall }]);
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
    if (!newQuest.name) { showToast('Enter quest name'); return; }
    const q = { id: 'q' + Date.now(), ...newQuest, xp: newQuest.neg ? -Math.abs(+newQuest.xp) : Math.abs(+newQuest.xp), on: true };
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
    const today = getDate();
    setWhoopHist(prev => [...prev.filter(h => h.date !== today), { date: today, ...whoop }].slice(-90));
    setModal(null); showToast('Saved!');
  };

  // POMODORO TIMER
  const startPomo = () => {
    if (pomo.active) return;
    setPomo(p => ({ ...p, active: true, timeLeft: 25 * 60, mode: 'work' }));
    const interval = setInterval(() => {
      setPomo(p => {
        if (p.timeLeft <= 1) {
          if (p.mode === 'work') {
            setPlayer(pl => ({ ...pl, pomodoros: pl.pomodoros + 1, totalXP: pl.totalXP + 50, currentXP: (pl.currentXP + 50) % 500, level: Math.floor((pl.totalXP + 50) / 500) + 1 }));
            showToast('🍅 +50 XP! Take a break');
            return { ...p, mode: 'break', timeLeft: 5 * 60, sessions: p.sessions + 1 };
          } else {
            showToast('Break over! Ready to focus?');
            return { ...p, active: false, mode: 'work', timeLeft: 25 * 60 };
          }
        }
        return { ...p, timeLeft: p.timeLeft - 1 };
      });
    }, 1000);
    setPomoInterval(interval);
  };

  const stopPomo = () => {
    if (pomoInterval) clearInterval(pomoInterval);
    setPomoInterval(null);
    setPomo({ active: false, mode: 'work', timeLeft: 25 * 60, sessions: pomo.sessions });
  };

  const formatTime = (s) => Math.floor(s / 60).toString().padStart(2, '0') + ':' + (s % 60).toString().padStart(2, '0');

  // BREATHWORK - FIXED with smoother animation
  const startBreath = () => {
    if (breath.active) return;
    setBreath({ active: true, phase: 'inhale', cycle: 1, scale: 1 });
    let phase = 'inhale';
    let tick = 0;
    let cycle = 1;
    
    const interval = setInterval(() => {
      tick++;
      const progress = tick / 40; // 40 ticks = 4 seconds (100ms interval)
      
      if (phase === 'inhale') {
        setBreath(b => ({ ...b, phase: 'inhale', scale: 1 + progress * 0.5, cycle }));
        if (tick >= 40) { phase = 'hold1'; tick = 0; }
      } else if (phase === 'hold1') {
        setBreath(b => ({ ...b, phase: 'hold', scale: 1.5, cycle }));
        if (tick >= 40) { phase = 'exhale'; tick = 0; }
      } else if (phase === 'exhale') {
        setBreath(b => ({ ...b, phase: 'exhale', scale: 1.5 - progress * 0.5, cycle }));
        if (tick >= 40) { phase = 'hold2'; tick = 0; }
      } else if (phase === 'hold2') {
        setBreath(b => ({ ...b, phase: 'hold', scale: 1, cycle }));
        if (tick >= 40) {
          cycle++;
          if (cycle > 15) {
            clearInterval(interval);
            setBreathInterval(null);
            setBreath({ active: false, phase: 'done', cycle: 0, scale: 1 });
            showToast('🧘 Breathwork complete! +30 XP');
            setPlayer(p => ({ ...p, totalXP: p.totalXP + 30, currentXP: (p.currentXP + 30) % 500, level: Math.floor((p.totalXP + 30) / 500) + 1 }));
            return;
          }
          phase = 'inhale';
          tick = 0;
        }
      }
    }, 100); // 100ms for smooth animation
    setBreathInterval(interval);
  };

  const stopBreath = () => {
    if (breathInterval) {
      clearInterval(breathInterval);
      setBreathInterval(null);
    }
    setBreath({ active: false, phase: 'ready', cycle: 0, scale: 1 });
  };

  // JOURNAL
  const saveJournalEntry = () => {
    if (!journalEntry.trim()) return;
    const entry = { id: 'j' + Date.now(), date: getDate(), time: new Date().toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit' }), text: journalEntry };
    setJournal(p => [entry, ...p]);
    setJournalEntry('');
    showToast('📝 Entry saved!');
  };

  // Charts - CONSISTENT COLORS: green=income/consults, orange=deals, blue=calls
  const LineChart = ({ data, keys, colors, height = 120 }) => {
    if (!data?.length) return React.createElement('div', { style: { height, display: 'flex', alignItems: 'center', justifyContent: 'center', color: t.muted, fontSize: 12 } }, 'No data yet');
    const allVals = keys.flatMap(k => data.map(d => d[k] || 0).filter(v => v !== null));
    if (!allVals.length) return React.createElement('div', { style: { height, display: 'flex', alignItems: 'center', justifyContent: 'center', color: t.muted, fontSize: 12 } }, 'No data yet');
    const max = Math.max(...allVals, 1), min = Math.min(...allVals, 0), range = max - min || 1;
    return React.createElement('svg', { viewBox: '0 0 300 ' + height, style: { width: '100%', height } },
      [0, 0.5, 1].map((p, i) => React.createElement('line', { key: 'l'+i, x1: 40, y1: 10 + p * (height - 30), x2: 290, y2: 10 + p * (height - 30), stroke: t.border, strokeWidth: 1 })),
      [0, 0.5, 1].map((p, i) => React.createElement('text', { key: 't'+i, x: 35, y: 14 + p * (height - 30), fill: t.muted, fontSize: 9, textAnchor: 'end' }, Math.round(max - p * range))),
      keys.map((key, ki) => {
        const pts = data.map((d, i) => (45 + (i / Math.max(data.length - 1, 1)) * 240) + ',' + (10 + (height - 30) - ((d[key] || 0) - min) / range * (height - 30))).join(' ');
        return React.createElement('g', { key },
          React.createElement('polyline', { points: pts, fill: 'none', stroke: colors[ki], strokeWidth: 2.5, strokeLinecap: 'round', strokeLinejoin: 'round' }),
          data.map((d, i) => React.createElement('circle', { key: i, cx: 45 + (i / Math.max(data.length - 1, 1)) * 240, cy: 10 + (height - 30) - ((d[key] || 0) - min) / range * (height - 30), r: 4, fill: colors[ki] }))
        );
      }),
      data.map((d, i) => React.createElement('text', { key: 'x'+i, x: 45 + (i / Math.max(data.length - 1, 1)) * 240, y: height - 5, fill: t.muted, fontSize: 9, textAnchor: 'middle' }, d.month || i + 1))
    );
  };

  const MiniChart = ({ data, k, color, h = 50 }) => {
    if (!data?.length) return null;
    const vals = data.map(d => d[k] || 0);
    const max = Math.max(...vals, 1), min = Math.min(...vals, 0), range = max - min || 1;
    const pts = data.map((d, i) => (5 + (i / Math.max(data.length - 1, 1)) * 90) + ',' + (5 + (h - 10) - ((d[k] || 0) - min) / range * (h - 10))).join(' ');
    return React.createElement('svg', { viewBox: '0 0 100 ' + h, style: { width: '100%', height: h } },
      React.createElement('polyline', { points: pts, fill: 'none', stroke: color, strokeWidth: 2, strokeLinecap: 'round' }),
      data.map((d, i) => React.createElement('circle', { key: i, cx: 5 + (i / Math.max(data.length - 1, 1)) * 90, cy: 5 + (h - 10) - ((d[k] || 0) - min) / range * (h - 10), r: 2.5, fill: color }))
    );
  };

  // Styles
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

  const tabs = ['today', 'week', 'month', 'year', 'tools', 'skills'];

  // RENDER
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
        // Quests
        React.createElement('div', { style: s.card },
          React.createElement('div', { style: s.cHead },
            React.createElement('div', { style: s.cTitle }, '⚔️ Daily Quests'),
            React.createElement('div', { style: { display: 'flex', gap: 6 } },
              React.createElement('button', { style: { ...s.btn, ...s.btnS }, onClick: () => setModal('addQuest') }, '+'),
              React.createElement('button', { style: { ...s.btn, ...s.btnS }, onClick: () => setModal('editQuests') }, 'Edit')
            )
          ),
          React.createElement('div', { style: { fontSize: 12, color: t.muted, marginBottom: 12 } }, donePos + '/' + posQ.length + ' • +' + earnedXP + ' XP'),
          React.createElement('div', { style: { maxHeight: 350, overflowY: 'auto' } },
            posQ.map(q => React.createElement('div', { key: q.id, onClick: () => toggleQ(q.id), style: { ...s.quest, ...(q.done ? s.qDone : {}) } },
              React.createElement('div', { style: { ...s.chk, ...(q.done ? s.chkOn : { borderColor: cats[q.cat]?.color }) } }, q.done && '✓'),
              React.createElement('div', { style: { flex: 1 } },
                React.createElement('div', { style: { fontSize: 14, fontWeight: 500 } }, q.main ? '★ ' : '', q.name),
                React.createElement('div', { style: { fontSize: 11, color: t.muted } }, q.desc)
              ),
              React.createElement('span', { style: s.xpB }, '+' + q.xp)
            ))
          ),
          React.createElement(Bar, { pct: (donePos / posQ.length) * 100, color: t.accent })
        ),
        // Vices
        React.createElement('div', { style: s.card },
          React.createElement('div', { style: s.cHead },
            React.createElement('div', { style: s.cTitle }, '⚠️ Vices'),
            doneNeg > 0 && React.createElement('span', { style: { fontSize: 12, color: t.red } }, '-' + lostXP + ' XP')
          ),
          negQ.map(q => React.createElement('div', { key: q.id, onClick: () => toggleQ(q.id), style: { ...s.quest, ...s.qNeg, ...(q.done ? s.qNegDone : {}) } },
            React.createElement('div', { style: { ...s.chk, ...(q.done ? s.chkNeg : { borderColor: t.red }) } }, q.done && '✗'),
            React.createElement('div', { style: { flex: 1 } },
              React.createElement('div', { style: { fontSize: 14, fontWeight: 500 } }, q.name),
              React.createElement('div', { style: { fontSize: 11, color: t.muted } }, q.desc)
            ),
            React.createElement('span', { style: { ...s.xpB, ...s.xpBN } }, q.xp)
          ))
        ),
        // Income
        React.createElement('div', { style: s.card },
          React.createElement('div', { style: s.cHead },
            React.createElement('div', { style: s.cTitle }, '💰 Income'),
            React.createElement('div', { style: { display: 'flex', gap: 6 } },
              React.createElement('button', { style: { ...s.btn, ...s.btnS }, onClick: () => setModal('incomeSet') }, '⚙️'),
              React.createElement('button', { style: { ...s.btn, ...s.btnP }, onClick: () => setModal('addDeal') }, '+ Deal')
            )
          ),
          React.createElement('div', { style: { textAlign: 'center', padding: '12px 0' } },
            React.createElement('div', { style: { fontSize: 38, fontWeight: 700, color: t.green } }, income.toLocaleString() + ' CHF'),
            React.createElement('div', { style: { fontSize: 12, color: t.muted } }, 'of ' + incSet.target.toLocaleString() + ' target')
          ),
          React.createElement(Bar, { pct: (income / incSet.target) * 100, color: t.green }),
          monthlyDeals.length > 0 && React.createElement('div', { style: { marginTop: 12 } },
            monthlyDeals.slice(-3).reverse().map(d => React.createElement('div', { key: d.id, onClick: () => { setEditItem(d); setModal('editDeal'); }, style: s.listItem },
              React.createElement('div', null,
                React.createElement('div', { style: { fontSize: 13, fontWeight: 500 } }, d.client),
                React.createElement('div', { style: { fontSize: 11, color: t.muted } }, d.product)
              ),
              React.createElement('div', { style: { fontSize: 14, fontWeight: 600, color: t.green } }, '+' + d.commission)
            ))
          )
        ),
        // Health
        React.createElement('div', { style: s.card },
          React.createElement('div', { style: s.cHead },
            React.createElement('div', { style: s.cTitle }, '❤️ Health'),
            React.createElement('button', { style: { ...s.btn, ...s.btnS }, onClick: () => setModal('whoop') }, 'Update')
          ),
          React.createElement('div', { style: { textAlign: 'center', padding: '8px 0' } },
            React.createElement('div', { style: { fontSize: 48, fontWeight: 700, color: whoop.recovery >= 67 ? t.green : whoop.recovery >= 34 ? t.orange : t.red } }, whoop.recovery + '%'),
            React.createElement('div', { style: { fontSize: 12, color: t.muted } }, 'Recovery')
          ),
          React.createElement('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 } },
            React.createElement('div', { style: s.stat }, React.createElement('div', { style: { fontSize: 18, fontWeight: 600, color: t.blue } }, whoop.sleep + '%'), React.createElement('div', { style: { fontSize: 10, color: t.muted } }, 'Sleep')),
            React.createElement('div', { style: s.stat }, React.createElement('div', { style: { fontSize: 18, fontWeight: 600, color: t.orange } }, whoop.strain), React.createElement('div', { style: { fontSize: 10, color: t.muted } }, 'Strain')),
            React.createElement('div', { style: s.stat }, React.createElement('div', { style: { fontSize: 18, fontWeight: 600, color: t.purple } }, whoop.hrv), React.createElement('div', { style: { fontSize: 10, color: t.muted } }, 'HRV'))
          )
        )
      ),

      // WEEK TAB - COLORS: green=consults, orange=deals, blue=calls
      tab === 'week' && React.createElement('div', { style: s.mainG },
        React.createElement('div', { style: s.card },
          React.createElement('div', { style: s.cHead },
            React.createElement('div', { style: s.cTitle }, '📅 Weekly Progress'),
            React.createElement('button', { style: { ...s.btn, ...s.btnS }, onClick: () => setModal('weeklySet') }, '⚙️')
          ),
          [{ n: 'Consultations', p: weeklyConsults.length, g: weeklyTargets.consults, c: t.green },
           { n: 'Deals', p: weeklyDeals.length, g: weeklyTargets.deals, c: t.orange },
           { n: 'Calls', p: weeklyCalls.length, g: weeklyTargets.calls, c: t.blue }
          ].map((x, i) => React.createElement('div', { key: i, style: { marginBottom: 14 } },
            React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 4 } },
              React.createElement('span', null, x.n),
              React.createElement('span', { style: { color: x.c, fontWeight: 600 } }, x.p + '/' + x.g)
            ),
            React.createElement(Bar, { pct: (x.p / x.g) * 100, color: x.c })
          ))
        ),
        React.createElement('div', { style: { ...s.card, gridColumn: '1 / -1' } },
          React.createElement('div', { style: s.cHead },
            React.createElement('div', { style: s.cTitle }, '📞 Consultations'),
            React.createElement('button', { style: { ...s.btn, ...s.btnP }, onClick: () => setModal('addConsult') }, '+ Add')
          ),
          React.createElement('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 8 } },
            consults.slice(-6).reverse().map(c => React.createElement('div', { key: c.id, onClick: () => { setEditItem(c); setModal('editConsult'); }, style: s.listItem },
              React.createElement('div', null,
                React.createElement('div', { style: { fontSize: 13, fontWeight: 500 } }, c.client),
                React.createElement('div', { style: { fontSize: 11, color: t.muted } }, c.type + ' • ' + c.date)
              ),
              React.createElement('div', { style: { fontSize: 10, padding: '4px 8px', borderRadius: 6, background: c.status === 'closed' ? t.green + '20' : t.input, color: c.status === 'closed' ? t.green : t.muted, fontWeight: 600 } }, c.status)
            )),
            consults.length === 0 && React.createElement('div', { style: { color: t.muted, fontSize: 12, padding: 16 } }, 'No consultations yet')
          )
        ),
        React.createElement('div', { style: { ...s.card, gridColumn: '1 / -1' } },
          React.createElement('div', { style: s.cHead },
            React.createElement('div', { style: s.cTitle }, '📱 Calls'),
            React.createElement('button', { style: { ...s.btn, ...s.btnP }, onClick: () => setModal('addCall') }, '+ Add')
          ),
          React.createElement('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 8 } },
            calls.slice(-6).reverse().map(c => React.createElement('div', { key: c.id, onClick: () => { setEditItem(c); setModal('editCall'); }, style: s.listItem },
              React.createElement('div', null,
                React.createElement('div', { style: { fontSize: 13, fontWeight: 500 } }, c.client),
                React.createElement('div', { style: { fontSize: 11, color: t.muted } }, c.date)
              ),
              React.createElement('div', { style: { fontSize: 10, padding: '4px 8px', borderRadius: 6, background: c.outcome === 'answered' ? t.green + '20' : t.input, color: c.outcome === 'answered' ? t.green : t.muted, fontWeight: 600 } }, c.outcome)
            )),
            calls.length === 0 && React.createElement('div', { style: { color: t.muted, fontSize: 12, padding: 16 } }, 'No calls yet')
          )
        ),
        React.createElement('div', { style: { ...s.card, gridColumn: '1 / -1' } },
          React.createElement('div', { style: s.cHead }, React.createElement('div', { style: s.cTitle }, '📈 Trends')),
          React.createElement(LineChart, { data: monthlyHistory, keys: ['consults', 'deals', 'calls'], colors: [t.green, t.orange, t.blue], height: 140 }),
          React.createElement('div', { style: s.legend },
            React.createElement('div', { style: s.legendItem }, React.createElement('div', { style: { ...s.legendDot, background: t.green } }), ' Consults'),
            React.createElement('div', { style: s.legendItem }, React.createElement('div', { style: { ...s.legendDot, background: t.orange } }), ' Deals'),
            React.createElement('div', { style: s.legendItem }, React.createElement('div', { style: { ...s.legendDot, background: t.blue } }), ' Calls')
          )
        )
      ),

      // MONTH TAB - COLORS: green=consults, orange=deals, blue=calls
      tab === 'month' && React.createElement('div', { style: s.mainG },
        React.createElement('div', { style: s.card },
          React.createElement('div', { style: s.cHead }, React.createElement('div', { style: s.cTitle }, '🗓️ Monthly Goals')),
          [{ n: incSet.target.toLocaleString() + ' CHF', p: income, g: incSet.target, c: t.green },
           { n: incSet.consultsTarget + ' Consultations', p: monthlyConsults.length, g: incSet.consultsTarget, c: t.green },
           { n: incSet.dealsTarget + ' Deals', p: monthlyDeals.length, g: incSet.dealsTarget, c: t.orange },
           { n: incSet.callsTarget + ' Calls', p: monthlyCalls.length, g: incSet.callsTarget, c: t.blue }
          ].map((x, i) => React.createElement('div', { key: i, style: { marginBottom: 14 } },
            React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 4 } },
              React.createElement('span', null, x.n),
              React.createElement('span', { style: { color: x.c, fontWeight: 600 } }, Math.round((x.p / x.g) * 100) + '%')
            ),
            React.createElement(Bar, { pct: (x.p / x.g) * 100, color: x.c })
          ))
        ),
        React.createElement('div', { style: s.card },
          React.createElement('div', { style: s.cHead }, React.createElement('div', { style: s.cTitle }, '💵 Breakdown')),
          React.createElement('div', { style: { ...s.listItem, marginBottom: 8 } },
            React.createElement('span', { style: { color: t.muted } }, 'Base'),
            React.createElement('span', null, incSet.base.toLocaleString() + ' CHF')
          ),
          React.createElement('div', { style: { ...s.listItem, marginBottom: 8 } },
            React.createElement('span', { style: { color: t.muted } }, 'Commission'),
            React.createElement('span', { style: { color: t.green } }, '+' + commission.toLocaleString() + ' CHF')
          ),
          React.createElement('div', { style: { ...s.listItem, background: t.accent + '15' } },
            React.createElement('span', { style: { fontWeight: 600 } }, 'Total'),
            React.createElement('span', { style: { fontWeight: 700, color: t.accent } }, income.toLocaleString() + ' CHF')
          )
        ),
        React.createElement('div', { style: { ...s.card, gridColumn: '1 / -1' } },
          React.createElement('div', { style: s.cHead }, React.createElement('div', { style: s.cTitle }, '📈 Activity')),
          React.createElement(LineChart, { data: monthlyHistory, keys: ['consults', 'deals', 'calls'], colors: [t.green, t.orange, t.blue], height: 140 }),
          React.createElement('div', { style: s.legend },
            React.createElement('div', { style: s.legendItem }, React.createElement('div', { style: { ...s.legendDot, background: t.green } }), ' Consults'),
            React.createElement('div', { style: s.legendItem }, React.createElement('div', { style: { ...s.legendDot, background: t.orange } }), ' Deals'),
            React.createElement('div', { style: s.legendItem }, React.createElement('div', { style: { ...s.legendDot, background: t.blue } }), ' Calls')
          )
        )
      ),

      // YEAR TAB
      tab === 'year' && React.createElement('div', { style: s.mainG },
        React.createElement('div', { style: { ...s.card, gridColumn: '1 / -1' } },
          React.createElement('div', { style: s.cHead }, React.createElement('div', { style: s.cTitle }, '🎯 2026 Goals')),
          React.createElement('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12 } },
            [{ n: '120K Income', d: Math.round(yearlyIncome / 1000) + 'K', p: yearlyIncome, g: 120000, c: t.green },
             { n: '48 Deals', d: yearlyDeals.length, p: yearlyDeals.length, g: 48, c: t.orange },
             { n: '1200 Calls', d: yearlyCalls.length, p: yearlyCalls.length, g: 1200, c: t.blue },
             { n: '365 Streak', d: player.streak.current + 'd', p: player.streak.current, g: 365, c: t.red }
            ].map((x, i) => React.createElement('div', { key: i, style: { background: t.input, borderRadius: 14, padding: 16 } },
              React.createElement('div', { style: { fontSize: 15, fontWeight: 600 } }, x.n),
              React.createElement('div', { style: { fontSize: 24, fontWeight: 700, color: x.c, margin: '8px 0' } }, x.d),
              React.createElement(Bar, { pct: (x.p / x.g) * 100, color: x.c }),
              React.createElement('div', { style: { fontSize: 11, color: t.muted, marginTop: 6 } }, ((x.p / x.g) * 100).toFixed(1) + '%')
            ))
          )
        ),
        React.createElement('div', { style: { ...s.card, gridColumn: '1 / -1' } },
          React.createElement('div', { style: s.cHead }, React.createElement('div', { style: s.cTitle }, '📈 Progress')),
          React.createElement(LineChart, { data: monthlyHistory, keys: ['deals', 'consults', 'calls'], colors: [t.orange, t.green, t.blue], height: 160 }),
          React.createElement('div', { style: s.legend },
            React.createElement('div', { style: s.legendItem }, React.createElement('div', { style: { ...s.legendDot, background: t.orange } }), ' Deals'),
            React.createElement('div', { style: s.legendItem }, React.createElement('div', { style: { ...s.legendDot, background: t.green } }), ' Consults'),
            React.createElement('div', { style: s.legendItem }, React.createElement('div', { style: { ...s.legendDot, background: t.blue } }), ' Calls')
          )
        )
      ),

      // TOOLS TAB - Pomodoro, Breathwork, Journal
      tab === 'tools' && React.createElement('div', { style: s.mainG },
        // Pomodoro Timer
        React.createElement('div', { style: s.card },
          React.createElement('div', { style: s.cHead }, React.createElement('div', { style: s.cTitle }, '🍅 Pomodoro')),
          React.createElement('div', { style: { textAlign: 'center', padding: '20px 0' } },
            React.createElement('div', { style: { fontSize: 64, fontWeight: 700, color: pomo.mode === 'work' ? t.red : t.green, fontFamily: 'monospace' } }, formatTime(pomo.timeLeft)),
            React.createElement('div', { style: { fontSize: 14, color: t.muted, marginTop: 8 } }, pomo.mode === 'work' ? 'Focus Time' : 'Break Time'),
            React.createElement('div', { style: { fontSize: 12, color: t.muted, marginTop: 4 } }, 'Sessions: ' + pomo.sessions + ' • Total: ' + player.pomodoros)
          ),
          React.createElement('div', { style: { display: 'flex', gap: 10, marginTop: 16 } },
            !pomo.active ? 
              React.createElement('button', { style: { ...s.btn, ...s.btnP, flex: 1, padding: 16 }, onClick: startPomo }, '▶ Start') :
              React.createElement('button', { style: { ...s.btn, ...s.btnD, flex: 1, padding: 16 }, onClick: stopPomo }, '⏹ Stop')
          ),
          React.createElement('div', { style: { fontSize: 11, color: t.muted, textAlign: 'center', marginTop: 12 } }, '+50 XP per completed session')
        ),

        // Breathwork
        React.createElement('div', { style: s.card },
          React.createElement('div', { style: s.cHead }, React.createElement('div', { style: s.cTitle }, '🧘 Box Breathing')),
          React.createElement('div', { style: { display: 'flex', justifyContent: 'center', alignItems: 'center', height: 220, position: 'relative' } },
            React.createElement('div', { 
              style: { 
                width: 140 * breath.scale, 
                height: 140 * breath.scale, 
                borderRadius: '50%', 
                background: breath.active ? 
                  'linear-gradient(135deg, ' + t.accent + ', ' + t.accent2 + ')' :
                  'linear-gradient(135deg, ' + t.card + ', ' + t.input + ')',
                boxShadow: breath.active ? 
                  '0 0 ' + (30 + (breath.scale - 1) * 80) + 'px ' + t.accent + ', 0 0 ' + (60 + (breath.scale - 1) * 120) + 'px ' + t.accent2 + ', inset 0 0 30px rgba(255,255,255,0.1)' :
                  '0 10px 40px rgba(0,0,0,0.3), inset 0 0 20px rgba(255,255,255,0.05)',
                border: '2px solid rgba(255,255,255,0.2)',
                display: 'flex', 
                flexDirection: 'column',
                alignItems: 'center', 
                justifyContent: 'center',
                transition: 'width 0.1s linear, height 0.1s linear, box-shadow 0.3s ease',
                cursor: breath.active ? 'default' : 'pointer'
              },
              onClick: () => !breath.active && startBreath()
            },
              React.createElement('div', { style: { fontSize: 18, fontWeight: 600, color: breath.active ? '#fff' : t.text, textTransform: 'uppercase', letterSpacing: 2, textShadow: breath.active ? '0 2px 10px rgba(0,0,0,0.3)' : 'none' } }, 
                breath.active ? breath.phase : 'Tap to Start'
              ),
              breath.active && React.createElement('div', { style: { fontSize: 14, color: 'rgba(255,255,255,0.7)', marginTop: 8 } }, breath.cycle + '/15')
            )
          ),
          breath.active && React.createElement('button', { style: { ...s.btn, ...s.btnD, width: '100%', marginTop: 12 }, onClick: stopBreath }, 'Stop'),
          React.createElement('div', { style: { fontSize: 11, color: t.muted, textAlign: 'center', marginTop: 12 } }, '15 cycles • 4s inhale • 4s hold • 4s exhale • 4s hold')
        ),

        // Journal
        React.createElement('div', { style: { ...s.card, gridColumn: '1 / -1' } },
          React.createElement('div', { style: s.cHead }, React.createElement('div', { style: s.cTitle }, '📝 Journal')),
          React.createElement('textarea', { 
            style: { ...s.inp, height: 100, resize: 'vertical' }, 
            placeholder: 'What\'s on your mind today?',
            value: journalEntry,
            onChange: e => setJournalEntry(e.target.value)
          }),
          React.createElement('button', { style: { ...s.btn, ...s.btnP, width: '100%' }, onClick: saveJournalEntry }, 'Save Entry'),
          journal.length > 0 && React.createElement('div', { style: { marginTop: 16, maxHeight: 300, overflowY: 'auto' } },
            journal.slice(0, 10).map(e => React.createElement('div', { key: e.id, style: { padding: 14, background: t.input, borderRadius: 12, marginBottom: 8 } },
              React.createElement('div', { style: { fontSize: 11, color: t.muted, marginBottom: 6 } }, e.date + ' • ' + e.time),
              React.createElement('div', { style: { fontSize: 13, lineHeight: 1.5 } }, e.text)
            ))
          )
        )
      ),

      // SKILLS TAB
      tab === 'skills' && React.createElement('div', { style: s.mainG },
        React.createElement('div', { style: s.card },
          React.createElement('div', { style: s.cHead }, React.createElement('div', { style: s.cTitle }, '📊 Stats')),
          React.createElement('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 } },
            [{ v: income.toLocaleString(), l: 'Income', c: t.green },
             { v: player.totalXP.toLocaleString(), l: 'XP', c: t.purple },
             { v: deals.length, l: 'Deals', c: t.orange },
             { v: calls.length, l: 'Calls', c: t.blue }
            ].map((x, i) => React.createElement('div', { key: i, style: { ...s.stat, background: x.c + '10' } },
              React.createElement('div', { style: { fontSize: 24, fontWeight: 700, color: x.c } }, x.v),
              React.createElement('div', { style: { fontSize: 10, color: t.muted, marginTop: 4 } }, x.l)
            ))
          ),
          React.createElement('div', { style: { marginTop: 16 } },
            [{ icon: '🔥', n: 'Streak', v: player.streak.current, c: t.red },
             { icon: '🍅', n: 'Pomodoros', v: player.pomodoros, c: t.orange }
            ].map((x, i) => React.createElement('div', { key: i, style: { display: 'flex', alignItems: 'center', gap: 12, padding: 12, background: t.input, borderRadius: 12, marginBottom: 8 } },
              React.createElement('span', { style: { fontSize: 24 } }, x.icon),
              React.createElement('div', { style: { flex: 1, fontSize: 13 } }, x.n),
              React.createElement('div', { style: { fontSize: 24, fontWeight: 700, color: x.c } }, x.v)
            ))
          )
        ),
        React.createElement('div', { style: s.card },
          React.createElement('div', { style: s.cHead }, React.createElement('div', { style: s.cTitle }, '⚡ Skills')),
          Object.entries(cats).map(([k, v]) => React.createElement('div', { key: k, style: { display: 'flex', alignItems: 'center', gap: 10, padding: 12, background: t.input, borderRadius: 12, marginBottom: 8 } },
            React.createElement('div', { style: { fontSize: 20 } }, v.icon),
            React.createElement('div', { style: { flex: 1 } },
              React.createElement('div', { style: { fontSize: 13, fontWeight: 500 } }, v.name),
              React.createElement('div', { style: { fontSize: 10, color: t.muted } }, 'Lv ' + (skillLvls[k]?.lvl || 1))
            ),
            React.createElement('div', { style: { width: 60, height: 4, background: t.border, borderRadius: 2 } },
              React.createElement('div', { style: { height: '100%', width: ((skillLvls[k]?.prog || 0) * 100) + '%', background: v.color, borderRadius: 2 } })
            )
          ))
        ),
        React.createElement('div', { style: s.card },
          React.createElement('div', { style: s.cHead },
            React.createElement('div', { style: s.cTitle }, '🏆 Achievements'),
            React.createElement('span', { style: { fontSize: 12, color: t.muted } }, achievements.filter(a => a.unlocked).length + '/' + achievements.length)
          ),
          React.createElement('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 } },
            achievements.map(a => React.createElement('div', { key: a.id, style: { textAlign: 'center', padding: 12, background: t.input, borderRadius: 12, opacity: a.unlocked ? 1 : 0.3 } },
              React.createElement('div', { style: { fontSize: 28 } }, a.icon),
              React.createElement('div', { style: { fontSize: 10, marginTop: 4 } }, a.name)
            ))
          )
        )
      )
    ),

    // ALL MODALS
    modal === 'addDeal' && React.createElement('div', { style: s.modal, onClick: () => setModal(null) },
      React.createElement('div', { style: s.mBox, onClick: e => e.stopPropagation() },
        React.createElement('div', { style: s.mHead }, 
          React.createElement('h3', { style: s.mTitle }, '💰 Add Deal'), 
          React.createElement('button', { style: s.mClose, onClick: () => setModal(null) }, '×')
        ),
        React.createElement('label', { style: s.label }, 'Client Name'),
        React.createElement('input', { style: s.inp, placeholder: 'Enter client name', value: newDeal.client, onChange: e => setNewDeal({ ...newDeal, client: e.target.value }) }),
        React.createElement('label', { style: s.label }, 'Product'),
        React.createElement('input', { style: s.inp, placeholder: 'e.g., Pension Plan', value: newDeal.product, onChange: e => setNewDeal({ ...newDeal, product: e.target.value }) }),
        React.createElement('label', { style: s.label }, 'Commission (CHF)'),
        React.createElement('input', { style: s.inp, type: 'number', placeholder: '0', value: newDeal.commission, onChange: e => setNewDeal({ ...newDeal, commission: e.target.value }) }),
        React.createElement('button', { style: { ...s.btn, ...s.btnP, width: '100%', padding: 16, marginTop: 8 }, onClick: addDeal }, 'Add Deal')
      )
    ),

    modal === 'editDeal' && editItem && React.createElement('div', { style: s.modal, onClick: () => setModal(null) },
      React.createElement('div', { style: s.mBox, onClick: e => e.stopPropagation() },
        React.createElement('div', { style: s.mHead }, 
          React.createElement('h3', { style: s.mTitle }, 'Edit Deal'), 
          React.createElement('button', { style: s.mClose, onClick: () => setModal(null) }, '×')
        ),
        React.createElement('label', { style: s.label }, 'Client'),
        React.createElement('input', { style: s.inp, value: editItem.client, onChange: e => setEditItem({ ...editItem, client: e.target.value }) }),
        React.createElement('label', { style: s.label }, 'Product'),
        React.createElement('input', { style: s.inp, value: editItem.product || '', onChange: e => setEditItem({ ...editItem, product: e.target.value }) }),
        React.createElement('label', { style: s.label }, 'Commission'),
        React.createElement('input', { style: s.inp, type: 'number', value: editItem.commission, onChange: e => setEditItem({ ...editItem, commission: +e.target.value }) }),
        React.createElement('div', { style: { display: 'flex', gap: 10, marginTop: 8 } },
          React.createElement('button', { style: { ...s.btn, ...s.btnP, flex: 1, padding: 16 }, onClick: updateDeal }, 'Save'),
          React.createElement('button', { style: { ...s.btn, ...s.btnD, padding: 16 }, onClick: () => deleteDeal(editItem.id) }, 'Delete')
        )
      )
    ),

    modal === 'addConsult' && React.createElement('div', { style: s.modal, onClick: () => setModal(null) },
      React.createElement('div', { style: s.mBox, onClick: e => e.stopPropagation() },
        React.createElement('div', { style: s.mHead }, 
          React.createElement('h3', { style: s.mTitle }, '📞 Add Consultation'), 
          React.createElement('button', { style: s.mClose, onClick: () => setModal(null) }, '×')
        ),
        React.createElement('label', { style: s.label }, 'Client Name'),
        React.createElement('input', { style: s.inp, placeholder: 'Enter client name', value: newConsult.client, onChange: e => setNewConsult({ ...newConsult, client: e.target.value }) }),
        React.createElement('label', { style: s.label }, 'Type'),
        React.createElement('select', { style: s.sel, value: newConsult.type, onChange: e => setNewConsult({ ...newConsult, type: e.target.value }) },
          ['Pension', 'Retirement', 'Life Insurance', 'Investment', 'Health Insurance'].map(o => React.createElement('option', { key: o }, o))
        ),
        React.createElement('label', { style: s.label }, 'Status'),
        React.createElement('select', { style: s.sel, value: newConsult.status, onChange: e => setNewConsult({ ...newConsult, status: e.target.value }) },
          [['scheduled', 'Scheduled'], ['completed', 'Completed'], ['application', 'Application'], ['closed', 'Closed'], ['lost', 'Lost']].map(o => React.createElement('option', { key: o[0], value: o[0] }, o[1]))
        ),
        React.createElement('label', { style: s.label }, 'Script Adherence (1-10)'),
        React.createElement('input', { style: s.inp, type: 'number', min: 1, max: 10, placeholder: 'Rate 1-10', value: newConsult.script, onChange: e => setNewConsult({ ...newConsult, script: e.target.value }) }),
        React.createElement('button', { style: { ...s.btn, ...s.btnP, width: '100%', padding: 16, marginTop: 8 }, onClick: addConsult }, 'Add Consultation')
      )
    ),

    modal === 'editConsult' && editItem && React.createElement('div', { style: s.modal, onClick: () => setModal(null) },
      React.createElement('div', { style: s.mBox, onClick: e => e.stopPropagation() },
        React.createElement('div', { style: s.mHead }, 
          React.createElement('h3', { style: s.mTitle }, 'Edit Consultation'), 
          React.createElement('button', { style: s.mClose, onClick: () => setModal(null) }, '×')
        ),
        React.createElement('label', { style: s.label }, 'Client'),
        React.createElement('input', { style: s.inp, value: editItem.client, onChange: e => setEditItem({ ...editItem, client: e.target.value }) }),
        React.createElement('label', { style: s.label }, 'Status'),
        React.createElement('select', { style: s.sel, value: editItem.status, onChange: e => setEditItem({ ...editItem, status: e.target.value }) },
          [['scheduled', 'Scheduled'], ['completed', 'Completed'], ['application', 'Application'], ['closed', 'Closed'], ['lost', 'Lost']].map(o => React.createElement('option', { key: o[0], value: o[0] }, o[1]))
        ),
        React.createElement('div', { style: { display: 'flex', gap: 10, marginTop: 8 } },
          React.createElement('button', { style: { ...s.btn, ...s.btnP, flex: 1, padding: 16 }, onClick: updateConsult }, 'Save'),
          React.createElement('button', { style: { ...s.btn, ...s.btnD, padding: 16 }, onClick: () => deleteConsult(editItem.id) }, 'Delete')
        )
      )
    ),

    modal === 'addCall' && React.createElement('div', { style: s.modal, onClick: () => setModal(null) },
      React.createElement('div', { style: s.mBox, onClick: e => e.stopPropagation() },
        React.createElement('div', { style: s.mHead }, 
          React.createElement('h3', { style: s.mTitle }, '📱 Add Call'), 
          React.createElement('button', { style: s.mClose, onClick: () => setModal(null) }, '×')
        ),
        React.createElement('label', { style: s.label }, 'Name'),
        React.createElement('input', { style: s.inp, placeholder: 'Client or prospect name', value: newCall.client, onChange: e => setNewCall({ ...newCall, client: e.target.value }) }),
        React.createElement('label', { style: s.label }, 'Outcome'),
        React.createElement('select', { style: s.sel, value: newCall.outcome, onChange: e => setNewCall({ ...newCall, outcome: e.target.value }) },
          [['answered', 'Answered'], ['voicemail', 'Voicemail'], ['no-answer', 'No Answer'], ['callback', 'Callback']].map(o => React.createElement('option', { key: o[0], value: o[0] }, o[1]))
        ),
        React.createElement('label', { style: s.label }, 'Notes'),
        React.createElement('input', { style: s.inp, placeholder: 'Optional notes', value: newCall.notes, onChange: e => setNewCall({ ...newCall, notes: e.target.value }) }),
        React.createElement('button', { style: { ...s.btn, ...s.btnP, width: '100%', padding: 16, marginTop: 8 }, onClick: addCall }, 'Add Call')
      )
    ),

    modal === 'editCall' && editItem && React.createElement('div', { style: s.modal, onClick: () => setModal(null) },
      React.createElement('div', { style: s.mBox, onClick: e => e.stopPropagation() },
        React.createElement('div', { style: s.mHead }, 
          React.createElement('h3', { style: s.mTitle }, 'Edit Call'), 
          React.createElement('button', { style: s.mClose, onClick: () => setModal(null) }, '×')
        ),
        React.createElement('label', { style: s.label }, 'Name'),
        React.createElement('input', { style: s.inp, value: editItem.client, onChange: e => setEditItem({ ...editItem, client: e.target.value }) }),
        React.createElement('label', { style: s.label }, 'Outcome'),
        React.createElement('select', { style: s.sel, value: editItem.outcome, onChange: e => setEditItem({ ...editItem, outcome: e.target.value }) },
          [['answered', 'Answered'], ['voicemail', 'Voicemail'], ['no-answer', 'No Answer'], ['callback', 'Callback']].map(o => React.createElement('option', { key: o[0], value: o[0] }, o[1]))
        ),
        React.createElement('div', { style: { display: 'flex', gap: 10, marginTop: 8 } },
          React.createElement('button', { style: { ...s.btn, ...s.btnP, flex: 1, padding: 16 }, onClick: updateCall }, 'Save'),
          React.createElement('button', { style: { ...s.btn, ...s.btnD, padding: 16 }, onClick: () => deleteCall(editItem.id) }, 'Delete')
        )
      )
    ),

    modal === 'addQuest' && React.createElement('div', { style: s.modal, onClick: () => setModal(null) },
      React.createElement('div', { style: s.mBox, onClick: e => e.stopPropagation() },
        React.createElement('div', { style: s.mHead }, 
          React.createElement('h3', { style: s.mTitle }, 'Add Quest'), 
          React.createElement('button', { style: s.mClose, onClick: () => setModal(null) }, '×')
        ),
        React.createElement('label', { style: s.label }, 'Name'),
        React.createElement('input', { style: s.inp, placeholder: 'Quest name', value: newQuest.name, onChange: e => setNewQuest({ ...newQuest, name: e.target.value }) }),
        React.createElement('label', { style: s.label }, 'Description'),
        React.createElement('input', { style: s.inp, placeholder: 'Short description', value: newQuest.desc, onChange: e => setNewQuest({ ...newQuest, desc: e.target.value }) }),
        React.createElement('label', { style: s.label }, 'XP'),
        React.createElement('input', { style: s.inp, type: 'number', value: newQuest.xp, onChange: e => setNewQuest({ ...newQuest, xp: e.target.value }) }),
        React.createElement('label', { style: s.label }, 'Category'),
        React.createElement('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginBottom: 12 } },
          Object.entries(cats).map(([k, v]) => React.createElement('div', { key: k, onClick: () => setNewQuest({ ...newQuest, cat: k }), style: { padding: 10, borderRadius: 10, cursor: 'pointer', textAlign: 'center', background: newQuest.cat === k ? v.color + '30' : t.input, border: newQuest.cat === k ? '2px solid ' + v.color : '2px solid transparent' } },
            React.createElement('div', { style: { fontSize: 18 } }, v.icon),
            React.createElement('div', { style: { fontSize: 10, marginTop: 4 } }, v.name)
          ))
        ),
        React.createElement('label', { style: { display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12, fontSize: 13 } },
          React.createElement('input', { type: 'checkbox', checked: newQuest.neg, onChange: e => setNewQuest({ ...newQuest, neg: e.target.checked }) }), ' Vice (negative XP)'
        ),
        React.createElement('button', { style: { ...s.btn, ...s.btnP, width: '100%', padding: 16 }, onClick: addQuest }, 'Add Quest')
      )
    ),

    modal === 'editQuests' && React.createElement('div', { style: s.modal, onClick: () => setModal(null) },
      React.createElement('div', { style: s.mBox, onClick: e => e.stopPropagation() },
        React.createElement('div', { style: s.mHead }, 
          React.createElement('h3', { style: s.mTitle }, 'Edit Quests'), 
          React.createElement('button', { style: s.mClose, onClick: () => setModal(null) }, '×')
        ),
        React.createElement('div', { style: { maxHeight: 400, overflowY: 'auto' } },
          questLib.map(q => React.createElement('div', { key: q.id, onClick: () => setQuestLib(p => p.map(x => x.id === q.id ? { ...x, on: !x.on } : x)), style: { display: 'flex', alignItems: 'center', gap: 10, padding: 12, background: q.on ? t.accent + '15' : t.input, borderRadius: 10, marginBottom: 6, cursor: 'pointer' } },
            React.createElement('div', { style: { width: 18, height: 18, borderRadius: 5, border: q.on ? 'none' : '2px solid ' + t.muted, background: q.on ? t.accent : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, color: '#000' } }, q.on && '✓'),
            React.createElement('div', { style: { flex: 1, fontSize: 13 } }, q.name),
            React.createElement('span', { style: { fontSize: 11, color: q.neg ? t.red : t.accent2 } }, (q.xp > 0 ? '+' : '') + q.xp)
          ))
        ),
        React.createElement('button', { style: { ...s.btn, ...s.btnP, width: '100%', marginTop: 12, padding: 14 }, onClick: () => { setTodayQ(questLib.filter(q => q.on).map(q => { const ex = todayQ.find(x => x.id === q.id); return ex ? { ...q, done: ex.done } : { ...q, done: false }; })); setModal(null); showToast('Saved!'); } }, 'Apply (' + questLib.filter(q => q.on).length + ' active)')
      )
    ),

    modal === 'whoop' && React.createElement('div', { style: s.modal, onClick: () => setModal(null) },
      React.createElement('div', { style: s.mBox, onClick: e => e.stopPropagation() },
        React.createElement('div', { style: s.mHead }, 
          React.createElement('h3', { style: s.mTitle }, '❤️ Health'), 
          React.createElement('button', { style: s.mClose, onClick: () => setModal(null) }, '×')
        ),
        ['Recovery %', 'Sleep %', 'Strain', 'HRV'].map((l, i) => {
          const k = ['recovery', 'sleep', 'strain', 'hrv'][i];
          return React.createElement('div', { key: k },
            React.createElement('label', { style: s.label }, l),
            React.createElement('input', { style: s.inp, type: 'number', value: whoop[k], onChange: e => setWhoop({ ...whoop, [k]: +e.target.value || 0 }) })
          );
        }),
        React.createElement('button', { style: { ...s.btn, ...s.btnP, width: '100%', padding: 16 }, onClick: saveWhoop }, 'Save')
      )
    ),

    modal === 'avatar' && React.createElement('div', { style: s.modal, onClick: () => setModal(null) },
      React.createElement('div', { style: s.mBox, onClick: e => e.stopPropagation() },
        React.createElement('div', { style: s.mHead }, 
          React.createElement('h3', { style: s.mTitle }, 'Avatar'), 
          React.createElement('button', { style: s.mClose, onClick: () => setModal(null) }, '×')
        ),
        React.createElement('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 } },
          avatars.map(a => React.createElement('div', { key: a.id, onClick: () => selectAvatar(a.id), style: { textAlign: 'center', padding: 12, background: player.avatar === a.id ? t.accent + '20' : t.input, border: player.avatar === a.id ? '2px solid ' + t.accent : '2px solid transparent', borderRadius: 12, opacity: player.level >= a.lvl ? 1 : 0.3, cursor: player.level >= a.lvl ? 'pointer' : 'not-allowed' } },
            React.createElement('div', { style: { fontSize: 28 } }, a.icon),
            React.createElement('div', { style: { fontSize: 10, marginTop: 4 } }, a.name),
            React.createElement('div', { style: { fontSize: 9, color: t.muted } }, 'Lv ' + a.lvl)
          ))
        )
      )
    ),

    modal === 'incomeSet' && React.createElement('div', { style: s.modal, onClick: () => setModal(null) },
      React.createElement('div', { style: s.mBox, onClick: e => e.stopPropagation() },
        React.createElement('div', { style: s.mHead }, 
          React.createElement('h3', { style: s.mTitle }, '💰 Income Settings'), 
          React.createElement('button', { style: s.mClose, onClick: () => setModal(null) }, '×')
        ),
        [['Base Salary', 'base'], ['Monthly Target', 'target'], ['Deals Target', 'dealsTarget'], ['Consults Target', 'consultsTarget'], ['Calls Target', 'callsTarget']].map(([l, k]) => React.createElement('div', { key: k },
          React.createElement('label', { style: s.label }, l),
          React.createElement('input', { style: s.inp, type: 'number', value: incSet[k], onChange: e => setIncSet({ ...incSet, [k]: +e.target.value || 0 }) })
        )),
        React.createElement('button', { style: { ...s.btn, ...s.btnP, width: '100%', padding: 16 }, onClick: () => { setModal(null); showToast('Saved!'); } }, 'Save')
      )
    ),

    modal === 'weeklySet' && React.createElement('div', { style: s.modal, onClick: () => setModal(null) },
      React.createElement('div', { style: s.mBox, onClick: e => e.stopPropagation() },
        React.createElement('div', { style: s.mHead }, 
          React.createElement('h3', { style: s.mTitle }, '📅 Weekly Targets'), 
          React.createElement('button', { style: s.mClose, onClick: () => setModal(null) }, '×')
        ),
        [['Deals', 'deals'], ['Consultations', 'consults'], ['Calls', 'calls']].map(([l, k]) => React.createElement('div', { key: k },
          React.createElement('label', { style: s.label }, l),
          React.createElement('input', { style: s.inp, type: 'number', value: weeklyTargets[k], onChange: e => setWeeklyTargets({ ...weeklyTargets, [k]: +e.target.value || 0 }) })
        )),
        React.createElement('button', { style: { ...s.btn, ...s.btnP, width: '100%', padding: 16 }, onClick: () => { setModal(null); showToast('Saved!'); } }, 'Save')
      )
    ),

    modal === 'settings' && React.createElement('div', { style: s.modal, onClick: () => setModal(null) },
      React.createElement('div', { style: s.mBox, onClick: e => e.stopPropagation() },
        React.createElement('div', { style: s.mHead }, 
          React.createElement('h3', { style: s.mTitle }, '⚙️ Settings'), 
          React.createElement('button', { style: s.mClose, onClick: () => setModal(null) }, '×')
        ),
        React.createElement('div', { style: { marginBottom: 20 } },
          React.createElement('label', { style: s.label }, 'Theme'),
          React.createElement('div', { style: { display: 'flex', gap: 8 } },
            ['dark', 'light', 'auto'].map(m => React.createElement('button', { key: m, onClick: () => setSettings(s => ({...s, theme: m})), style: { ...s.btn, flex: 1, padding: 12, background: settings.theme === m ? t.accent : t.input, color: settings.theme === m ? '#000' : t.text } }, m === 'dark' ? '🌙' : m === 'light' ? '☀️' : '🔄'))
          )
        ),
        React.createElement('div', { style: { marginBottom: 20 } },
          React.createElement('label', { style: s.label }, 'Timezone'),
          React.createElement('select', { style: s.sel, value: settings.timezone, onChange: e => setSettings(s => ({...s, timezone: e.target.value})) },
            timezones.map(tz => React.createElement('option', { key: tz, value: tz }, tz))
          )
        ),
        React.createElement('button', { onClick: () => { if(confirm('Reset all data?')) { localStorage.clear(); location.reload(); }}, style: { ...s.btn, ...s.btnD, width: '100%', padding: 14, marginBottom: 12 } }, '🗑️ Reset All Data'),
        React.createElement('button', { style: { ...s.btn, ...s.btnS, width: '100%', padding: 14 }, onClick: () => setModal(null) }, 'Close')
      )
    ),

    React.createElement('div', { style: s.toastStyle }, toast.msg)
  );
};

ReactDOM.createRoot(document.getElementById('root')).render(React.createElement(App));
