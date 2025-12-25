// INEVITABLE 2026 - V8.0 PREMIUM
// Premium UI, 3D Breathwork, Sound, Haptics, Themes, Celebrations
const { useState, useEffect, useMemo, useCallback, useRef } = React;

// Sound effects
const sounds = {
  complete: () => { try { const a = new AudioContext(); const o = a.createOscillator(); const g = a.createGain(); o.connect(g); g.connect(a.destination); o.frequency.setValueAtTime(800, a.currentTime); o.frequency.exponentialRampToValueAtTime(1200, a.currentTime + 0.1); g.gain.setValueAtTime(0.3, a.currentTime); g.gain.exponentialRampToValueAtTime(0.01, a.currentTime + 0.3); o.start(); o.stop(a.currentTime + 0.3); } catch(e){} },
  levelUp: () => { try { const a = new AudioContext(); [523, 659, 784, 1047].forEach((f, i) => { const o = a.createOscillator(); const g = a.createGain(); o.connect(g); g.connect(a.destination); o.frequency.value = f; g.gain.setValueAtTime(0.2, a.currentTime + i * 0.15); g.gain.exponentialRampToValueAtTime(0.01, a.currentTime + i * 0.15 + 0.3); o.start(a.currentTime + i * 0.15); o.stop(a.currentTime + i * 0.15 + 0.3); }); } catch(e){} },
  achievement: () => { try { const a = new AudioContext(); [440, 554, 659, 880].forEach((f, i) => { const o = a.createOscillator(); const g = a.createGain(); o.type = 'triangle'; o.connect(g); g.connect(a.destination); o.frequency.value = f; g.gain.setValueAtTime(0.15, a.currentTime + i * 0.12); g.gain.exponentialRampToValueAtTime(0.01, a.currentTime + i * 0.12 + 0.4); o.start(a.currentTime + i * 0.12); o.stop(a.currentTime + i * 0.12 + 0.4); }); } catch(e){} },
  click: () => { try { const a = new AudioContext(); const o = a.createOscillator(); const g = a.createGain(); o.connect(g); g.connect(a.destination); o.frequency.value = 600; g.gain.setValueAtTime(0.1, a.currentTime); g.gain.exponentialRampToValueAtTime(0.01, a.currentTime + 0.05); o.start(); o.stop(a.currentTime + 0.05); } catch(e){} }
};

const haptic = (type = 'light') => { if (navigator.vibrate) navigator.vibrate(type === 'heavy' ? [50, 30, 50] : type === 'success' ? [10, 50, 10, 50, 10] : 10); };

const App = () => {
  // Settings & Theme
  const [settings, setSettings] = useState(() => JSON.parse(localStorage.getItem('v8_settings') ?? '{"timezone":"Europe/Zurich","theme":"night","sound":true,"haptic":true}'));
  const [focusMode, setFocusMode] = useState(false);

  useEffect(() => { document.documentElement.setAttribute('data-theme', settings.theme); }, [settings.theme]);

  const colors = { green: '#30d158', orange: '#ff9f0a', blue: '#0a84ff', purple: '#a78bfa', red: '#ff453a', teal: '#2dd4bf' };

  const [tab, setTab] = useState('today');
  const [toast, setToast] = useState({ show: false, msg: '', type: 'success' });
  const [modal, setModal] = useState(null);
  const [editItem, setEditItem] = useState(null);
  const [confetti, setConfetti] = useState(false);
  const [celebration, setCelebration] = useState(null);

  // Pomodoro
  const [pomo, setPomo] = useState({ active: false, mode: 'work', timeLeft: 25 * 60, sessions: 0 });
  const pomoRef = useRef(null);

  // Breathwork - FIXED
  const [breath, setBreath] = useState({ active: false, phase: 'ready', cycle: 0, progress: 0 });
  const breathRef = useRef(null);

  // Journal
  const [journal, setJournal] = useState(() => JSON.parse(localStorage.getItem('v8_journal') ?? '[]'));
  const [journalEntry, setJournalEntry] = useState('');

  const avatars = [
    { id: 'default', icon: '👤', name: 'Rookie', lvl: 1 }, { id: 'warrior', icon: '⚔️', name: 'Warrior', lvl: 3 },
    { id: 'sage', icon: '🧙', name: 'Sage', lvl: 5 }, { id: 'champion', icon: '🏆', name: 'Champion', lvl: 7 },
    { id: 'phoenix', icon: '🔥', name: 'Phoenix', lvl: 10 }, { id: 'diamond', icon: '💎', name: 'Diamond', lvl: 15 },
    { id: 'crown', icon: '👑', name: 'King', lvl: 20 }, { id: 'dragon', icon: '🐉', name: 'Dragon', lvl: 50 }
  ];

  const themes = [
    { id: 'night', name: 'Night', icon: '🌙' },
    { id: 'ocean', name: 'Ocean', icon: '🌊' },
    { id: 'forest', name: 'Forest', icon: '🌲' },
    { id: 'sakura', name: 'Sakura', icon: '🌸' },
    { id: 'day', name: 'Day', icon: '☀️' }
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
    { id:'q1', name:'First Steps', icon:'🎯', desc:'Complete 1 quest', cond:'quest_1', rarity:'common' },
    { id:'d1', name:'Closer', icon:'🤝', desc:'First deal', cond:'deal_1', rarity:'common' },
    { id:'s3', name:'Hat Trick', icon:'🎩', desc:'3-day streak', cond:'streak_3', rarity:'common' },
    { id:'s7', name:'Week Warrior', icon:'🔥', desc:'7-day streak', cond:'streak_7', rarity:'rare' },
    { id:'s21', name:'Habit Master', icon:'⚡', desc:'21-day streak', cond:'streak_21', rarity:'epic' },
    { id:'i10', name:'10K Club', icon:'🏆', desc:'10K CHF/month', cond:'income_10000', rarity:'legendary' },
    { id:'dd5', name:'Deal Maker', icon:'✋', desc:'5 deals', cond:'deals_5', rarity:'rare' },
    { id:'x1', name:'XP Hunter', icon:'⚡', desc:'1,000 XP', cond:'xp_1000', rarity:'common' },
    { id:'c50', name:'Dialer', icon:'📞', desc:'50 calls', cond:'calls_50', rarity:'rare' },
    { id:'p10', name:'Focus Master', icon:'🍅', desc:'10 pomodoros', cond:'pomo_10', rarity:'rare' },
    { id:'b5', name:'Zen Mind', icon:'🧘', desc:'5 breathwork sessions', cond:'breath_5', rarity:'rare' },
  ];

  // State - FIXED: proper daily reset
  const [player, setPlayer] = useState(() => JSON.parse(localStorage.getItem('v8_player') ?? '{"level":1,"totalXP":0,"currentXP":0,"streak":{"current":0,"best":0,"lastDate":null},"avatar":"default","pomodoros":0,"breathSessions":0}'));
  const [incSet, setIncSet] = useState(() => JSON.parse(localStorage.getItem('v8_income') ?? '{"base":4166,"target":10000,"dealsTarget":4,"consultsTarget":15,"callsTarget":100}'));
  const [weeklyTargets, setWeeklyTargets] = useState(() => JSON.parse(localStorage.getItem('v8_weekly') ?? '{"deals":1,"consults":4,"calls":25}'));
  const [skillXP, setSkillXP] = useState(() => JSON.parse(localStorage.getItem('v8_skills') ?? '{"sales":0,"mindset":0,"discipline":0,"growth":0,"health":0,"planning":0}'));
  const [questLib, setQuestLib] = useState(() => JSON.parse(localStorage.getItem('v8_quests') ?? JSON.stringify(defQuests)));
  const [todayQ, setTodayQ] = useState(() => JSON.parse(localStorage.getItem('v8_today') ?? JSON.stringify(defQuests.filter(q=>q.on).map(q=>({...q,done:false})))));
  const [deals, setDeals] = useState(() => JSON.parse(localStorage.getItem('v8_deals') ?? '[]'));
  const [consults, setConsults] = useState(() => JSON.parse(localStorage.getItem('v8_consults') ?? '[]'));
  const [calls, setCalls] = useState(() => JSON.parse(localStorage.getItem('v8_calls') ?? '[]'));
  const [whoop, setWhoop] = useState(() => JSON.parse(localStorage.getItem('v8_whoop') ?? '{"recovery":70,"sleep":80,"strain":10,"hrv":55}'));
  const [whoopHist, setWhoopHist] = useState(() => JSON.parse(localStorage.getItem('v8_whoopHist') ?? '[]'));
  const [achievements, setAchievements] = useState(() => JSON.parse(localStorage.getItem('v8_ach') ?? JSON.stringify(defAch.map(a => ({...a, unlocked: false})))'));

  // Forms
  const [newDeal, setNewDeal] = useState({ client:'', product:'', commission:'' });
  const [newConsult, setNewConsult] = useState({ client:'', type:'Pension', status:'scheduled', script:'' });
  const [newCall, setNewCall] = useState({ client:'', outcome:'answered', notes:'' });
  const [newQuest, setNewQuest] = useState({ name:'', desc:'', xp:30, cat:'discipline', neg:false });

  const getDate = () => new Date().toLocaleDateString('en-CA', { timeZone: settings.timezone });
  const getYear = () => new Date().toLocaleDateString('en-CA', { timeZone: settings.timezone }).slice(0, 4);
  const getMonth = () => new Date().toLocaleDateString('en-CA', { timeZone: settings.timezone }).slice(0, 7);

  // FIXED: Daily reset logic with proper streak handling
  const checkDailyReset = useCallback(() => {
    const today = getDate();
    const lastDate = localStorage.getItem('v8_lastDate');
    
    if (lastDate && lastDate !== today) {
      // Check if yesterday was completed (any quest done)
      const hadProgress = todayQ.some(q => q.done && !q.neg);
      
      // Reset quests for new day
      const activeQuests = questLib.filter(q => q.on).map(q => ({ ...q, done: false }));
      setTodayQ(activeQuests);
      localStorage.setItem('v8_today', JSON.stringify(activeQuests));
      
      // Update streak
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toLocaleDateString('en-CA', { timeZone: settings.timezone });
      
      if (lastDate === yesterdayStr && hadProgress) {
        // Continue streak
        setPlayer(p => {
          const newStreak = p.streak.current + 1;
          const updated = { ...p, streak: { current: newStreak, best: Math.max(newStreak, p.streak.best), lastDate: today } };
          localStorage.setItem('v8_player', JSON.stringify(updated));
          return updated;
        });
        showToast('☀️ Day ' + (player.streak.current + 1) + '! Keep going!', 'success');
      } else if (lastDate !== yesterdayStr) {
        // Streak broken
        setPlayer(p => {
          const updated = { ...p, streak: { current: 0, best: p.streak.best, lastDate: today } };
          localStorage.setItem('v8_player', JSON.stringify(updated));
          return updated;
        });
        showToast('New day! Streak reset.', 'info');
      }
    }
    localStorage.setItem('v8_lastDate', today);
  }, [questLib, settings.timezone, todayQ, player.streak.current]);

  useEffect(() => { 
    checkDailyReset(); 
    const i = setInterval(checkDailyReset, 60000); 
    return () => clearInterval(i); 
  }, [checkDailyReset]);

  // Persistence
  useEffect(() => { localStorage.setItem('v8_settings', JSON.stringify(settings)); }, [settings]);
  useEffect(() => { localStorage.setItem('v8_player', JSON.stringify(player)); }, [player]);
  useEffect(() => { localStorage.setItem('v8_income', JSON.stringify(incSet)); }, [incSet]);
  useEffect(() => { localStorage.setItem('v8_weekly', JSON.stringify(weeklyTargets)); }, [weeklyTargets]);
  useEffect(() => { localStorage.setItem('v8_skills', JSON.stringify(skillXP)); }, [skillXP]);
  useEffect(() => { localStorage.setItem('v8_quests', JSON.stringify(questLib)); }, [questLib]);
  useEffect(() => { localStorage.setItem('v8_today', JSON.stringify(todayQ)); }, [todayQ]);
  useEffect(() => { localStorage.setItem('v8_deals', JSON.stringify(deals)); }, [deals]);
  useEffect(() => { localStorage.setItem('v8_consults', JSON.stringify(consults)); }, [consults]);
  useEffect(() => { localStorage.setItem('v8_calls', JSON.stringify(calls)); }, [calls]);
  useEffect(() => { localStorage.setItem('v8_whoop', JSON.stringify(whoop)); }, [whoop]);
  useEffect(() => { localStorage.setItem('v8_whoopHist', JSON.stringify(whoopHist)); }, [whoopHist]);
  useEffect(() => { localStorage.setItem('v8_ach', JSON.stringify(achievements)); }, [achievements]);
  useEffect(() => { localStorage.setItem('v8_journal', JSON.stringify(journal)); }, [journal]);

  // Computed values
  const month = getMonth();
  const year = getYear();
  const weekStart = (() => { const d = new Date(); d.setDate(d.getDate() - d.getDay() + 1); return d.toISOString().slice(0, 10); })();
  
  const monthlyDeals = deals.filter(d => d.date?.startsWith(month));
  const monthlyConsults = consults.filter(c => c.date?.startsWith(month));
  const monthlyCalls = calls.filter(c => c.date?.startsWith(month));
  const weeklyDeals = deals.filter(d => d.date >= weekStart);
  const weeklyConsults = consults.filter(c => c.date >= weekStart);
  const weeklyCalls = calls.filter(c => c.date >= weekStart);
  const yearlyDeals = deals.filter(d => d.date?.startsWith(year));
  const yearlyConsults = consults.filter(c => c.date?.startsWith(year));
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

  // Monthly history - FIXED order: consults -> deals -> calls
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

  // Streak notifications
  const getStreakMessage = () => {
    const s = player.streak.current;
    const milestones = [3, 7, 14, 21, 30, 50, 66, 100, 365];
    for (const m of milestones) {
      if (s < m && m - s <= 2) return `🔥 ${m - s} day${m - s > 1 ? 's' : ''} to ${m}-day streak!`;
    }
    return null;
  };

  // Achievement checker with celebrations
  useEffect(() => {
    setAchievements(prev => prev.map(a => {
      if (a.unlocked) return a;
      let u = false;
      if (a.cond === 'quest_1' && donePos >= 1) u = true;
      if (a.cond === 'deal_1' && deals.length >= 1) u = true;
      if (a.cond === 'deals_5' && deals.length >= 5) u = true;
      if (a.cond === 'streak_3' && player.streak.current >= 3) u = true;
      if (a.cond === 'streak_7' && player.streak.current >= 7) u = true;
      if (a.cond === 'streak_21' && player.streak.current >= 21) u = true;
      if (a.cond === 'income_10000' && income >= 10000) u = true;
      if (a.cond === 'xp_1000' && player.totalXP >= 1000) u = true;
      if (a.cond === 'calls_50' && calls.length >= 50) u = true;
      if (a.cond === 'pomo_10' && player.pomodoros >= 10) u = true;
      if (a.cond === 'breath_5' && player.breathSessions >= 5) u = true;
      if (u) {
        setTimeout(() => {
          setCelebration(a);
          if (settings.sound) sounds.achievement();
          if (settings.haptic) haptic('success');
          setConfetti(true);
          setTimeout(() => setConfetti(false), 3000);
        }, 300);
        return { ...a, unlocked: true };
      }
      return a;
    }));
  }, [deals, player, income, donePos, calls, settings.sound, settings.haptic]);

  const showToast = (msg, type = 'success') => { 
    setToast({ show: true, msg, type }); 
    setTimeout(() => setToast({ show: false, msg: '', type: 'success' }), 3000); 
  };
  
  const calcLvl = (xp) => ({ level: Math.floor(xp / 500) + 1, currentXP: xp % 500 });

  const toggleQ = (id) => {
    setTodayQ(prev => prev.map(q => {
      if (q.id === id) {
        const done = !q.done;
        const prevLevel = player.level;
        setPlayer(p => {
          let xp = done ? p.totalXP + q.xp : p.totalXP - q.xp;
          xp = Math.max(0, xp);
          const { level, currentXP } = calcLvl(xp);
          if (level > prevLevel && done) {
            setTimeout(() => { if (settings.sound) sounds.levelUp(); setCelebration({ icon: '⬆️', name: 'Level Up!', desc: 'Level ' + level }); setConfetti(true); setTimeout(() => setConfetti(false), 3000); }, 100);
          }
          return { ...p, totalXP: xp, level, currentXP };
        });
        if (!q.neg) setSkillXP(prev => ({ ...prev, [q.cat]: Math.max(0, prev[q.cat] + (done ? q.xp : -q.xp)) }));
        if (done) {
          if (settings.sound) sounds.complete();
          if (settings.haptic) haptic('light');
          showToast(q.neg ? q.xp + ' XP 😔' : '+' + q.xp + ' XP ✓');
        }
        return { ...q, done };
      }
      return q;
    }));
  };

  // CRUD handlers
  const addDeal = () => {
    if (!newDeal.client) { showToast('Enter client name', 'error'); return; }
    const deal = { id: 'd' + Date.now(), date: getDate(), client: newDeal.client, product: newDeal.product, commission: +newDeal.commission || 0 };
    setDeals(p => [...p, deal]);
    if (settings.sound) sounds.complete();
    if (settings.haptic) haptic('success');
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
    if (!newConsult.client) { showToast('Enter client name', 'error'); return; }
    setConsults(p => [...p, { id: 'c' + Date.now(), date: getDate(), ...newConsult, script: +newConsult.script || null }]);
    if (settings.sound) sounds.complete();
    if (settings.haptic) haptic('light');
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
    if (!newCall.client) { showToast('Enter name', 'error'); return; }
    setCalls(p => [...p, { id: 'call' + Date.now(), date: getDate(), ...newCall }]);
    if (settings.sound) sounds.click();
    if (settings.haptic) haptic('light');
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
    if (!newQuest.name) { showToast('Enter quest name', 'error'); return; }
    const q = { id: 'q' + Date.now(), ...newQuest, xp: newQuest.neg ? -Math.abs(+newQuest.xp) : Math.abs(+newQuest.xp), on: true };
    setQuestLib(p => [...p, q]);
    setTodayQ(p => [...p, { ...q, done: false }]);
    setNewQuest({ name: '', desc: '', xp: 30, cat: 'discipline', neg: false });
    setModal(null); showToast('Quest added!');
  };

  const selectAvatar = (id) => {
    const a = avatars.find(x => x.id === id);
    if (a && player.level >= a.lvl) { 
      setPlayer(p => ({ ...p, avatar: id })); 
      if (settings.sound) sounds.click();
      showToast('Avatar: ' + a.name); 
    } else showToast('Unlock at Lv ' + (a?.lvl || '?'), 'error');
  };

  const saveWhoop = () => {
    const today = getDate();
    setWhoopHist(prev => [...prev.filter(h => h.date !== today), { date: today, ...whoop }].slice(-90));
    setModal(null); showToast('Saved!');
  };

  // POMODORO with auto-continue option
  const startPomo = () => {
    if (pomo.active) return;
    setFocusMode(true);
    setPomo(p => ({ ...p, active: true, timeLeft: 25 * 60, mode: 'work' }));
    if (settings.sound) sounds.click();
    
    pomoRef.current = setInterval(() => {
      setPomo(p => {
        if (p.timeLeft <= 1) {
          if (p.mode === 'work') {
            setPlayer(pl => ({ ...pl, pomodoros: pl.pomodoros + 1, totalXP: pl.totalXP + 50, currentXP: (pl.currentXP + 50) % 500, level: Math.floor((pl.totalXP + 50) / 500) + 1 }));
            if (settings.sound) sounds.levelUp();
            if (settings.haptic) haptic('success');
            showToast('🍅 +50 XP! Take a break');
            return { ...p, mode: 'break', timeLeft: 5 * 60, sessions: p.sessions + 1 };
          } else {
            if (settings.sound) sounds.complete();
            showToast('Break over! Starting next session...');
            return { ...p, mode: 'work', timeLeft: 25 * 60 };
          }
        }
        return { ...p, timeLeft: p.timeLeft - 1 };
      });
    }, 1000);
  };

  const stopPomo = () => {
    if (pomoRef.current) clearInterval(pomoRef.current);
    pomoRef.current = null;
    setFocusMode(false);
    setPomo(p => ({ ...p, active: false, mode: 'work', timeLeft: 25 * 60 }));
  };

  const formatTime = (s) => Math.floor(s / 60).toString().padStart(2, '0') + ':' + (s % 60).toString().padStart(2, '0');

  // BREATHWORK - FIXED smooth 3D animation
  const startBreath = () => {
    if (breath.active) return;
    if (settings.sound) sounds.click();
    setBreath({ active: true, phase: 'inhale', cycle: 1, progress: 0 });
    
    let phase = 'inhale';
    let tick = 0;
    let cycle = 1;
    
    breathRef.current = setInterval(() => {
      tick++;
      const phaseProgress = tick / 40; // 40 ticks = 4 seconds per phase (100ms interval)
      
      if (phase === 'inhale') {
        setBreath(b => ({ ...b, phase: 'inhale', progress: phaseProgress, cycle }));
        if (tick >= 40) { phase = 'hold1'; tick = 0; }
      } else if (phase === 'hold1') {
        setBreath(b => ({ ...b, phase: 'hold', progress: 1, cycle }));
        if (tick >= 40) { phase = 'exhale'; tick = 0; }
      } else if (phase === 'exhale') {
        setBreath(b => ({ ...b, phase: 'exhale', progress: 1 - phaseProgress, cycle }));
        if (tick >= 40) { phase = 'hold2'; tick = 0; }
      } else if (phase === 'hold2') {
        setBreath(b => ({ ...b, phase: 'hold', progress: 0, cycle }));
        if (tick >= 40) {
          cycle++;
          if (cycle > 15) {
            clearInterval(breathRef.current);
            breathRef.current = null;
            setBreath({ active: false, phase: 'done', cycle: 0, progress: 0 });
            setPlayer(p => ({ ...p, breathSessions: p.breathSessions + 1, totalXP: p.totalXP + 30, currentXP: (p.currentXP + 30) % 500, level: Math.floor((p.totalXP + 30) / 500) + 1 }));
            if (settings.sound) sounds.achievement();
            if (settings.haptic) haptic('success');
            showToast('🧘 +30 XP! Session complete');
            return;
          }
          phase = 'inhale';
          tick = 0;
        }
      }
    }, 100); // 100ms for smooth animation
  };

  const stopBreath = () => {
    if (breathRef.current) clearInterval(breathRef.current);
    breathRef.current = null;
    setBreath({ active: false, phase: 'ready', cycle: 0, progress: 0 });
  };

  // Journal
  const saveJournalEntry = () => {
    if (!journalEntry.trim()) return;
    const entry = { id: 'j' + Date.now(), date: getDate(), time: new Date().toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit' }), text: journalEntry };
    setJournal(p => [entry, ...p]);
    setJournalEntry('');
    if (settings.sound) sounds.complete();
    showToast('📝 Entry saved!');
  };

  // Progress Ring Component
  const ProgressRing = ({ progress, size = 120, strokeWidth = 8, color = 'var(--accent-primary)', glow = true }) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const offset = circumference - (progress / 100) * circumference;
    
    return React.createElement('svg', { width: size, height: size, style: { transform: 'rotate(-90deg)', filter: glow ? 'drop-shadow(0 0 10px ' + color + ')' : 'none' } },
      React.createElement('circle', { cx: size/2, cy: size/2, r: radius, fill: 'none', stroke: 'var(--bg-tertiary)', strokeWidth }),
      React.createElement('circle', { 
        cx: size/2, cy: size/2, r: radius, fill: 'none', stroke: color, strokeWidth, 
        strokeDasharray: circumference, strokeDashoffset: offset, strokeLinecap: 'round',
        style: { transition: 'stroke-dashoffset 0.3s ease' }
      })
    );
  };

  // 3D Breathwork Orb Component
  const BreathOrb = ({ active, phase, progress, cycle, onStart, onStop }) => {
    const baseSize = 140;
    const maxSize = 220;
    const currentSize = baseSize + (progress * (maxSize - baseSize));
    
    const phaseText = phase === 'inhale' ? 'Inhale' : phase === 'exhale' ? 'Exhale' : phase === 'hold' ? 'Hold' : phase === 'done' ? 'Complete!' : 'Tap to Start';
    
    const orbStyle = {
      width: currentSize,
      height: currentSize,
      borderRadius: '50%',
      background: active ? 
        `radial-gradient(circle at 30% 30%, rgba(255,255,255,0.3), transparent 60%), 
         radial-gradient(circle at 70% 70%, rgba(0,0,0,0.2), transparent 50%),
         linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))` :
        `radial-gradient(circle at 30% 30%, rgba(255,255,255,0.2), transparent 60%),
         linear-gradient(135deg, var(--bg-tertiary), var(--bg-elevated))`,
      boxShadow: active ? 
        `0 0 ${30 + progress * 50}px var(--accent-primary),
         0 0 ${60 + progress * 80}px var(--accent-secondary),
         inset 0 0 ${30 + progress * 30}px rgba(255,255,255,${0.1 + progress * 0.2}),
         0 20px 60px rgba(0,0,0,0.5)` :
        '0 10px 40px rgba(0,0,0,0.3), inset 0 0 30px rgba(255,255,255,0.05)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: active ? 'default' : 'pointer',
      transition: 'width 0.1s linear, height 0.1s linear, box-shadow 0.3s ease',
      transform: `perspective(500px) rotateX(${active ? 10 - progress * 5 : 0}deg)`,
      border: '1px solid rgba(255,255,255,0.1)'
    };

    return React.createElement('div', { style: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24 } },
      React.createElement('div', { 
        style: orbStyle, 
        onClick: () => !active && onStart()
      },
        React.createElement('div', { style: { fontSize: 18, fontWeight: 600, color: '#fff', textTransform: 'uppercase', letterSpacing: 2, textShadow: '0 2px 10px rgba(0,0,0,0.5)' } }, phaseText),
        active && React.createElement('div', { style: { fontSize: 14, color: 'rgba(255,255,255,0.7)', marginTop: 8 } }, cycle + '/15')
      ),
      active && React.createElement('button', { 
        onClick: onStop,
        style: { padding: '12px 32px', borderRadius: 12, background: 'var(--accent-danger)', color: '#fff', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-body)', fontWeight: 500 }
      }, 'Stop')
    );
  };

  // Line Chart - FIXED colors order
  const LineChart = ({ data, keys, colors, height = 140 }) => {
    if (!data?.length) return React.createElement('div', { style: { height, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-tertiary)', fontSize: 13 } }, 'No data yet');
    const allVals = keys.flatMap(k => data.map(d => d[k] || 0));
    const max = Math.max(...allVals, 1), min = Math.min(...allVals, 0), range = max - min || 1;
    return React.createElement('svg', { viewBox: '0 0 300 ' + height, style: { width: '100%', height } },
      [0, 0.5, 1].map((p, i) => React.createElement('line', { key: 'l'+i, x1: 40, y1: 10 + p * (height - 30), x2: 290, y2: 10 + p * (height - 30), stroke: 'var(--bg-tertiary)', strokeWidth: 1 })),
      [0, 0.5, 1].map((p, i) => React.createElement('text', { key: 't'+i, x: 35, y: 14 + p * (height - 30), fill: 'var(--text-tertiary)', fontSize: 9, textAnchor: 'end' }, Math.round(max - p * range))),
      keys.map((key, ki) => {
        const pts = data.map((d, i) => (45 + (i / Math.max(data.length - 1, 1)) * 240) + ',' + (10 + (height - 30) - ((d[key] || 0) - min) / range * (height - 30))).join(' ');
        return React.createElement('g', { key },
          React.createElement('polyline', { points: pts, fill: 'none', stroke: colors[ki], strokeWidth: 2.5, strokeLinecap: 'round', strokeLinejoin: 'round', style: { filter: 'drop-shadow(0 0 4px ' + colors[ki] + ')' } }),
          data.map((d, i) => React.createElement('circle', { key: i, cx: 45 + (i / Math.max(data.length - 1, 1)) * 240, cy: 10 + (height - 30) - ((d[key] || 0) - min) / range * (height - 30), r: 4, fill: colors[ki], style: { filter: 'drop-shadow(0 0 3px ' + colors[ki] + ')' } }))
        );
      }),
      data.map((d, i) => React.createElement('text', { key: 'x'+i, x: 45 + (i / Math.max(data.length - 1, 1)) * 240, y: height - 5, fill: 'var(--text-tertiary)', fontSize: 9, textAnchor: 'middle' }, d.month || i + 1))
    );
  };

  // Confetti Component
  const Confetti = ({ active }) => {
    if (!active) return null;
    const particles = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 2,
      color: ['#ff9f0a', '#30d158', '#0a84ff', '#a78bfa', '#ff453a', '#ffd60a'][Math.floor(Math.random() * 6)]
    }));
    return React.createElement('div', { style: { position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 9999, overflow: 'hidden' } },
      particles.map(p => React.createElement('div', { key: p.id, style: {
        position: 'absolute', left: p.left + '%', top: -20, width: 10, height: 10, background: p.color, borderRadius: 2,
        animation: `confetti-fall 3s ease-out ${p.delay}s forwards`
      }}))
    );
  };

  // Achievement Celebration Modal
  const CelebrationModal = ({ achievement, onClose }) => {
    if (!achievement) return null;
    const rarityColors = { common: '#9ca3af', rare: '#3b82f6', epic: '#a855f7', legendary: '#f59e0b' };
    return React.createElement('div', { style: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.9)', backdropFilter: 'blur(20px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9998 }, onClick: onClose },
      React.createElement('div', { style: { textAlign: 'center', animation: 'achievement-pop 0.6s ease-out' } },
        React.createElement('div', { style: { fontSize: 100, marginBottom: 24, filter: 'drop-shadow(0 0 30px ' + (rarityColors[achievement.rarity] || rarityColors.common) + ')' } }, achievement.icon),
        React.createElement('div', { style: { fontSize: 32, fontFamily: 'var(--font-display)', fontWeight: 600, marginBottom: 8 } }, achievement.name),
        React.createElement('div', { style: { fontSize: 16, color: 'var(--text-secondary)', marginBottom: 16 } }, achievement.desc),
        achievement.rarity && React.createElement('div', { style: { display: 'inline-block', padding: '6px 16px', borderRadius: 20, background: rarityColors[achievement.rarity] + '20', color: rarityColors[achievement.rarity], fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1 } }, achievement.rarity),
        React.createElement('div', { style: { marginTop: 32, fontSize: 14, color: 'var(--text-tertiary)' } }, 'Tap anywhere to continue')
      )
    );
  };

  // Styles with premium design
  const s = {
    wrap: { minHeight: '100vh', background: 'var(--bg-primary)', fontFamily: 'var(--font-body)', color: 'var(--text-primary)', padding: '16px 16px 100px', transition: 'background 0.3s' },
    content: { maxWidth: 1200, margin: '0 auto' },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12, marginBottom: 20 },
    logo: { fontSize: 26, fontFamily: 'var(--font-display)', fontWeight: 400, letterSpacing: '-0.02em' },
    logoSub: { fontSize: 10, color: 'var(--text-tertiary)', letterSpacing: '0.15em', textTransform: 'uppercase', marginTop: 2 },
    headerR: { display: 'flex', alignItems: 'center', gap: 12 },
    netBadge: { background: 'var(--bg-secondary)', borderRadius: 16, padding: '12px 18px', textAlign: 'center', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--bg-tertiary)' },
    pCard: { background: 'var(--bg-secondary)', borderRadius: 20, padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 14, boxShadow: 'var(--shadow-md)', border: '1px solid var(--bg-tertiary)' },
    avatarStyle: { width: 48, height: 48, borderRadius: 14, background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, cursor: 'pointer', boxShadow: 'var(--shadow-glow)' },
    xpBar: { width: 90, height: 5, background: 'var(--bg-tertiary)', borderRadius: 3, overflow: 'hidden', marginTop: 4 },
    streak: { background: 'var(--gradient-fire)', padding: '8px 14px', borderRadius: 24, fontSize: 13, fontWeight: 600, color: '#fff', boxShadow: '0 4px 15px rgba(255, 69, 58, 0.3)' },
    setBtn: { width: 44, height: 44, borderRadius: 14, background: 'var(--bg-secondary)', border: '1px solid var(--bg-tertiary)', color: 'var(--text-secondary)', fontSize: 20, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'var(--transition-fast)' },
    nav: { display: 'flex', gap: 4, background: 'var(--bg-secondary)', padding: 5, borderRadius: 16, marginBottom: 24, overflowX: 'auto', border: '1px solid var(--bg-tertiary)' },
    tabStyle: { padding: '12px 18px', borderRadius: 12, border: 'none', background: 'transparent', color: 'var(--text-tertiary)', cursor: 'pointer', fontSize: 13, fontWeight: 500, whiteSpace: 'nowrap', transition: 'var(--transition-fast)', fontFamily: 'var(--font-body)' },
    tabOn: { background: 'var(--bg-primary)', color: 'var(--text-primary)', boxShadow: 'var(--shadow-sm)' },
    mainG: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 20 },
    card: { background: 'var(--bg-secondary)', borderRadius: 24, padding: 24, boxShadow: 'var(--shadow-md)', border: '1px solid var(--bg-tertiary)', transition: 'var(--transition-base)' },
    cHead: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
    cTitle: { fontSize: 15, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 10 },
    btn: { padding: '12px 18px', borderRadius: 12, border: 'none', fontSize: 13, fontWeight: 500, cursor: 'pointer', fontFamily: 'var(--font-body)', transition: 'var(--transition-fast)' },
    btnP: { background: 'var(--accent-primary)', color: '#000' },
    btnS: { background: 'var(--bg-tertiary)', color: 'var(--text-primary)' },
    btnD: { background: 'rgba(255, 69, 58, 0.15)', color: 'var(--accent-danger)' },
    quest: { background: 'var(--bg-tertiary)', borderRadius: 16, padding: '16px 18px', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 14, cursor: 'pointer', transition: 'var(--transition-fast)', border: '1px solid transparent' },
    qDone: { background: 'rgba(45, 212, 191, 0.1)', border: '1px solid rgba(45, 212, 191, 0.2)' },
    qNeg: { background: 'rgba(255, 69, 58, 0.05)' },
    qNegDone: { background: 'rgba(255, 69, 58, 0.1)', border: '1px solid rgba(255, 69, 58, 0.2)' },
    chk: { width: 24, height: 24, borderRadius: 8, border: '2px solid var(--bg-elevated)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, flexShrink: 0, transition: 'var(--transition-fast)' },
    chkOn: { background: 'var(--accent-primary)', border: 'none', color: '#000', boxShadow: '0 0 12px var(--accent-primary)' },
    chkNeg: { background: 'var(--accent-danger)', border: 'none', color: '#fff', boxShadow: '0 0 12px var(--accent-danger)' },
    xpB: { background: 'rgba(167, 139, 250, 0.15)', color: 'var(--accent-secondary)', padding: '5px 12px', borderRadius: 10, fontSize: 11, fontWeight: 600 },
    xpBN: { background: 'rgba(255, 69, 58, 0.15)', color: 'var(--accent-danger)' },
    stat: { background: 'var(--bg-tertiary)', padding: 18, borderRadius: 16, textAlign: 'center' },
    modal: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(20px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 20 },
    mBox: { background: 'var(--bg-secondary)', borderRadius: 28, padding: 28, maxWidth: 460, width: '100%', maxHeight: '85vh', overflow: 'auto', border: '1px solid var(--bg-tertiary)', boxShadow: 'var(--shadow-lg)' },
    mHead: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
    mTitle: { fontSize: 22, fontFamily: 'var(--font-display)', fontWeight: 400 },
    mClose: { width: 40, height: 40, borderRadius: 12, background: 'var(--bg-tertiary)', border: 'none', color: 'var(--text-secondary)', fontSize: 22, cursor: 'pointer' },
    inp: { width: '100%', padding: '16px 18px', borderRadius: 14, border: '1px solid var(--bg-tertiary)', background: 'var(--bg-tertiary)', color: 'var(--text-primary)', fontSize: 15, marginBottom: 14, fontFamily: 'var(--font-body)', outline: 'none', transition: 'var(--transition-fast)' },
    sel: { width: '100%', padding: '16px 18px', borderRadius: 14, border: '1px solid var(--bg-tertiary)', background: 'var(--bg-tertiary)', color: 'var(--text-primary)', fontSize: 15, marginBottom: 14, fontFamily: 'var(--font-body)' },
    label: { fontSize: 12, color: 'var(--text-tertiary)', marginBottom: 8, display: 'block', textTransform: 'uppercase', letterSpacing: '0.05em' },
    toastStyle: { position: 'fixed', bottom: 32, left: '50%', transform: 'translateX(-50%) translateY(' + (toast.show ? 0 : 100) + 'px)', background: toast.type === 'error' ? 'var(--accent-danger)' : 'var(--bg-secondary)', color: 'var(--text-primary)', padding: '16px 28px', borderRadius: 20, fontWeight: 500, fontSize: 14, zIndex: 2000, opacity: toast.show ? 1 : 0, transition: 'all 0.3s', boxShadow: 'var(--shadow-lg)', border: '1px solid var(--bg-tertiary)' },
    listItem: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 18px', background: 'var(--bg-tertiary)', borderRadius: 14, marginBottom: 10, cursor: 'pointer', transition: 'var(--transition-fast)', border: '1px solid transparent' },
    legend: { display: 'flex', gap: 20, marginTop: 16, flexWrap: 'wrap' },
    legendItem: { display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: 'var(--text-secondary)' },
    legendDot: { width: 10, height: 10, borderRadius: 5 }
  };

  const GlowBar = ({ pct, color }) => React.createElement('div', { style: { height: 8, background: 'var(--bg-tertiary)', borderRadius: 4, overflow: 'hidden', marginTop: 8 } },
    React.createElement('div', { style: { height: '100%', width: Math.min(Math.max(pct, 0), 100) + '%', background: color, borderRadius: 4, transition: 'width 0.4s', boxShadow: '0 0 10px ' + color } })
  );

  const tabs = focusMode ? ['tools'] : ['today', 'week', 'month', 'year', 'tools', 'skills'];

  // RENDER
  const streakMsg = getStreakMessage();
  
  return React.createElement('div', { style: s.wrap },
    React.createElement(Confetti, { active: confetti }),
    React.createElement(CelebrationModal, { achievement: celebration, onClose: () => setCelebration(null) }),
    
    React.createElement('div', { style: s.content },
      // HEADER
      !focusMode && React.createElement('header', { style: s.header },
        React.createElement('div', null,
          React.createElement('div', { style: s.logo }, 'Inevitable'),
          React.createElement('div', { style: s.logoSub }, '2026 Success System')
        ),
        React.createElement('div', { style: s.headerR },
          streakMsg && React.createElement('div', { style: { fontSize: 12, color: 'var(--accent-warning)', padding: '8px 14px', background: 'rgba(255, 159, 10, 0.1)', borderRadius: 12 } }, streakMsg),
          React.createElement('div', { style: s.netBadge },
            React.createElement('div', { style: { fontSize: 10, color: 'var(--text-tertiary)', marginBottom: 2 } }, 'Today'),
            React.createElement('div', { style: { fontSize: 20, fontWeight: 700, color: netXP >= 0 ? 'var(--accent-success)' : 'var(--accent-danger)' } }, (netXP >= 0 ? '+' : '') + netXP + ' XP')
          ),
          React.createElement('div', { style: s.pCard },
            React.createElement('div', { style: s.avatarStyle, onClick: () => setModal('avatar') }, avatar.icon),
            React.createElement('div', null,
              React.createElement('div', { style: { fontSize: 15, fontWeight: 600 } }, 'Level ' + player.level),
              React.createElement('div', { style: { fontSize: 11, color: 'var(--text-tertiary)' } }, player.currentXP + '/500 XP'),
              React.createElement('div', { style: s.xpBar },
                React.createElement('div', { style: { height: '100%', width: (player.currentXP / 500 * 100) + '%', background: 'linear-gradient(90deg, var(--accent-primary), var(--accent-secondary))', boxShadow: '0 0 8px var(--accent-primary)' } })
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
            React.createElement('div', { style: { display: 'flex', gap: 8 } },
              React.createElement('button', { style: { ...s.btn, ...s.btnS }, onClick: () => setModal('addQuest') }, '+'),
              React.createElement('button', { style: { ...s.btn, ...s.btnS }, onClick: () => setModal('editQuests') }, 'Edit')
            )
          ),
          React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16 } },
            React.createElement(ProgressRing, { progress: (donePos / posQ.length) * 100, size: 60, strokeWidth: 5 }),
            React.createElement('div', null,
              React.createElement('div', { style: { fontSize: 24, fontWeight: 700 } }, donePos + '/' + posQ.length),
              React.createElement('div', { style: { fontSize: 12, color: 'var(--text-tertiary)' } }, '+' + earnedXP + ' XP earned')
            )
          ),
          React.createElement('div', { style: { maxHeight: 320, overflowY: 'auto' } },
            posQ.map(q => React.createElement('div', { key: q.id, onClick: () => toggleQ(q.id), style: { ...s.quest, ...(q.done ? s.qDone : {}) } },
              React.createElement('div', { style: { ...s.chk, ...(q.done ? s.chkOn : { borderColor: cats[q.cat]?.color }) } }, q.done && '✓'),
              React.createElement('div', { style: { flex: 1 } },
                React.createElement('div', { style: { fontSize: 14, fontWeight: 500 } }, q.main ? '★ ' : '', q.name),
                React.createElement('div', { style: { fontSize: 11, color: 'var(--text-tertiary)', marginTop: 2 } }, q.desc)
              ),
              React.createElement('span', { style: s.xpB }, '+' + q.xp)
            ))
          )
        ),
        // Vices
        React.createElement('div', { style: s.card },
          React.createElement('div', { style: s.cHead },
            React.createElement('div', { style: s.cTitle }, '⚠️ Vices'),
            doneNeg > 0 && React.createElement('span', { style: { fontSize: 13, color: 'var(--accent-danger)', fontWeight: 600 } }, '-' + lostXP + ' XP')
          ),
          negQ.map(q => React.createElement('div', { key: q.id, onClick: () => toggleQ(q.id), style: { ...s.quest, ...s.qNeg, ...(q.done ? s.qNegDone : {}) } },
            React.createElement('div', { style: { ...s.chk, ...(q.done ? s.chkNeg : { borderColor: 'var(--accent-danger)' }) } }, q.done && '✗'),
            React.createElement('div', { style: { flex: 1 } },
              React.createElement('div', { style: { fontSize: 14, fontWeight: 500 } }, q.name),
              React.createElement('div', { style: { fontSize: 11, color: 'var(--text-tertiary)', marginTop: 2 } }, q.desc)
            ),
            React.createElement('span', { style: { ...s.xpB, ...s.xpBN } }, q.xp)
          ))
        ),
        // Income
        React.createElement('div', { style: s.card },
          React.createElement('div', { style: s.cHead },
            React.createElement('div', { style: s.cTitle }, '💰 Income'),
            React.createElement('div', { style: { display: 'flex', gap: 8 } },
              React.createElement('button', { style: { ...s.btn, ...s.btnS }, onClick: () => setModal('incomeSet') }, '⚙️'),
              React.createElement('button', { style: { ...s.btn, ...s.btnP }, onClick: () => setModal('addDeal') }, '+ Deal')
            )
          ),
          React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 20, marginBottom: 16 } },
            React.createElement(ProgressRing, { progress: (income / incSet.target) * 100, size: 80, strokeWidth: 6, color: 'var(--accent-success)' }),
            React.createElement('div', null,
              React.createElement('div', { style: { fontSize: 32, fontWeight: 700, fontFamily: 'var(--font-display)', color: 'var(--accent-success)' } }, income.toLocaleString()),
              React.createElement('div', { style: { fontSize: 13, color: 'var(--text-tertiary)' } }, 'of ' + incSet.target.toLocaleString() + ' CHF')
            )
          ),
          monthlyDeals.length > 0 && React.createElement('div', null,
            monthlyDeals.slice(-3).reverse().map(d => React.createElement('div', { key: d.id, onClick: () => { setEditItem(d); setModal('editDeal'); }, style: s.listItem },
              React.createElement('div', null,
                React.createElement('div', { style: { fontSize: 13, fontWeight: 500 } }, d.client),
                React.createElement('div', { style: { fontSize: 11, color: 'var(--text-tertiary)' } }, d.product)
              ),
              React.createElement('div', { style: { fontSize: 15, fontWeight: 600, color: 'var(--accent-success)' } }, '+' + d.commission)
            ))
          )
        ),
        // Health
        React.createElement('div', { style: s.card },
          React.createElement('div', { style: s.cHead },
            React.createElement('div', { style: s.cTitle }, '❤️ Health'),
            React.createElement('button', { style: { ...s.btn, ...s.btnS }, onClick: () => setModal('whoop') }, 'Update')
          ),
          React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 20, marginBottom: 16 } },
            React.createElement(ProgressRing, { progress: whoop.recovery, size: 80, strokeWidth: 6, color: whoop.recovery >= 67 ? 'var(--accent-success)' : whoop.recovery >= 34 ? 'var(--accent-warning)' : 'var(--accent-danger)' }),
            React.createElement('div', null,
              React.createElement('div', { style: { fontSize: 32, fontWeight: 700, fontFamily: 'var(--font-display)', color: whoop.recovery >= 67 ? 'var(--accent-success)' : whoop.recovery >= 34 ? 'var(--accent-warning)' : 'var(--accent-danger)' } }, whoop.recovery + '%'),
              React.createElement('div', { style: { fontSize: 13, color: 'var(--text-tertiary)' } }, 'Recovery')
            )
          ),
          React.createElement('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 } },
            [{ v: whoop.sleep + '%', l: 'Sleep', c: 'var(--accent-blue)' }, { v: whoop.strain, l: 'Strain', c: 'var(--accent-warning)' }, { v: whoop.hrv, l: 'HRV', c: 'var(--accent-secondary)' }].map((x, i) =>
              React.createElement('div', { key: i, style: s.stat },
                React.createElement('div', { style: { fontSize: 18, fontWeight: 600, color: x.c } }, x.v),
                React.createElement('div', { style: { fontSize: 10, color: 'var(--text-tertiary)', marginTop: 4 } }, x.l)
              )
            )
          )
        )
      ),
 6px ' + colors.blue } }), ' Calls')
          )
        )
      ),

      // YEAR TAB - FIXED order: consults -> deals -> calls
      tab === 'year' && React.createElement('div', { style: s.mainG },
        React.createElement('div', { style: { ...s.card, gridColumn: '1 / -1' } },
          React.createElement('div', { style: s.cHead }, React.createElement('div', { style: s.cTitle }, '🎯 2026 Goals')),
          React.createElement('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 } },
            [{ n: '120K Income', d: Math.round(yearlyIncome / 1000) + 'K', p: yearlyIncome, g: 120000, c: colors.green },
             { n: '180 Consults', d: yearlyConsults.length, p: yearlyConsults.length, g: 180, c: colors.green },
             { n: '48 Deals', d: yearlyDeals.length, p: yearlyDeals.length, g: 48, c: colors.orange },
             { n: '1200 Calls', d: yearlyCalls.length, p: yearlyCalls.length, g: 1200, c: colors.blue }
            ].map((x, i) => React.createElement('div', { key: i, style: { background: 'var(--bg-tertiary)', borderRadius: 18, padding: 20, textAlign: 'center' } },
              React.createElement('div', { style: { fontSize: 14, fontWeight: 500, marginBottom: 8 } }, x.n),
              React.createElement(ProgressRing, { progress: (x.p / x.g) * 100, size: 90, strokeWidth: 6, color: x.c }),
              React.createElement('div', { style: { fontSize: 28, fontWeight: 700, fontFamily: 'var(--font-display)', color: x.c, marginTop: 12 } }, x.d),
              React.createElement('div', { style: { fontSize: 11, color: 'var(--text-tertiary)', marginTop: 4 } }, ((x.p / x.g) * 100).toFixed(1) + '%')
            ))
          )
        ),
        React.createElement('div', { style: { ...s.card, gridColumn: '1 / -1' } },
          React.createElement('div', { style: s.cHead }, React.createElement('div', { style: s.cTitle }, '📈 Progress')),
          React.createElement(LineChart, { data: monthlyHistory, keys: ['consults', 'deals', 'calls'], colors: [colors.green, colors.orange, colors.blue], height: 180 }),
          React.createElement('div', { style: s.legend },
            React.createElement('div', { style: s.legendItem }, React.createElement('div', { style: { ...s.legendDot, background: colors.green, boxShadow: '0 0 6px ' + colors.green } }), ' Consults'),
            React.createElement('div', { style: s.legendItem }, React.createElement('div', { style: { ...s.legendDot, background: colors.orange, boxShadow: '0 0 6px ' + colors.orange } }), ' Deals'),
            React.createElement('div', { style: s.legendItem }, React.createElement('div', { style: { ...s.legendDot, background: colors.blue, boxShadow: '0 0 6px ' + colors.blue } }), ' Calls')
          )
        )
      ),

      // TOOLS TAB - with 3D Breathwork
      tab === 'tools' && React.createElement('div', { style: s.mainG },
        // Pomodoro
        React.createElement('div', { style: s.card },
          React.createElement('div', { style: s.cHead }, 
            React.createElement('div', { style: s.cTitle }, '🍅 Pomodoro'),
            focusMode && React.createElement('span', { style: { fontSize: 11, color: 'var(--accent-warning)', padding: '4px 10px', background: 'rgba(255, 159, 10, 0.15)', borderRadius: 8 } }, 'Focus Mode')
          ),
          React.createElement('div', { style: { display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '24px 0' } },
            React.createElement('div', { style: { position: 'relative' } },
              React.createElement(ProgressRing, { progress: pomo.mode === 'work' ? ((25 * 60 - pomo.timeLeft) / (25 * 60)) * 100 : ((5 * 60 - pomo.timeLeft) / (5 * 60)) * 100, size: 160, strokeWidth: 10, color: pomo.mode === 'work' ? 'var(--accent-danger)' : 'var(--accent-success)' }),
              React.createElement('div', { style: { position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' } },
                React.createElement('div', { style: { fontSize: 42, fontWeight: 700, fontFamily: 'var(--font-display)' } }, formatTime(pomo.timeLeft)),
                React.createElement('div', { style: { fontSize: 12, color: 'var(--text-tertiary)', marginTop: 4 } }, pomo.mode === 'work' ? 'Focus' : 'Break')
              )
            ),
            React.createElement('div', { style: { fontSize: 13, color: 'var(--text-tertiary)', marginTop: 16 } }, 'Sessions: ' + pomo.sessions + ' • Total: ' + player.pomodoros),
            React.createElement('div', { style: { display: 'flex', gap: 12, marginTop: 20 } },
              !pomo.active ? 
                React.createElement('button', { style: { ...s.btn, ...s.btnP, padding: '14px 32px' }, onClick: startPomo }, '▶ Start Focus') :
                React.createElement('button', { style: { ...s.btn, ...s.btnD, padding: '14px 32px' }, onClick: stopPomo }, '⏹ Stop')
            )
          )
        ),

        // 3D Breathwork
        React.createElement('div', { style: s.card },
          React.createElement('div', { style: s.cHead }, React.createElement('div', { style: s.cTitle }, '🧘 Box Breathing')),
          React.createElement('div', { style: { display: 'flex', justifyContent: 'center', padding: '20px 0' } },
            React.createElement(BreathOrb, { active: breath.active, phase: breath.phase, progress: breath.progress, cycle: breath.cycle, onStart: startBreath, onStop: stopBreath })
          ),
          React.createElement('div', { style: { fontSize: 11, color: 'var(--text-tertiary)', textAlign: 'center' } }, '15 cycles • 4s inhale • 4s hold • 4s exhale • 4s hold'),
          React.createElement('div', { style: { fontSize: 12, color: 'var(--accent-secondary)', textAlign: 'center', marginTop: 8 } }, 'Sessions: ' + player.breathSessions + ' • +30 XP each')
        ),

        // Journal
        React.createElement('div', { style: { ...s.card, gridColumn: '1 / -1' } },
          React.createElement('div', { style: s.cHead }, React.createElement('div', { style: s.cTitle }, '📝 Journal')),
          React.createElement('textarea', { style: { ...s.inp, height: 100, resize: 'vertical' }, placeholder: "What's on your mind today?", value: journalEntry, onChange: e => setJournalEntry(e.target.value) }),
          React.createElement('button', { style: { ...s.btn, ...s.btnP, width: '100%' }, onClick: saveJournalEntry }, 'Save Entry'),
          journal.length > 0 && React.createElement('div', { style: { marginTop: 20, maxHeight: 280, overflowY: 'auto' } },
            journal.slice(0, 10).map(e => React.createElement('div', { key: e.id, style: { padding: 16, background: 'var(--bg-tertiary)', borderRadius: 14, marginBottom: 10 } },
              React.createElement('div', { style: { fontSize: 11, color: 'var(--text-tertiary)', marginBottom: 8 } }, e.date + ' • ' + e.time),
              React.createElement('div', { style: { fontSize: 13, lineHeight: 1.6 } }, e.text)
            ))
          )
        )
      ),

      // SKILLS TAB
      tab === 'skills' && React.createElement('div', { style: s.mainG },
        React.createElement('div', { style: s.card },
          React.createElement('div', { style: s.cHead }, React.createElement('div', { style: s.cTitle }, '📊 Stats')),
          React.createElement('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 } },
            [{ v: income.toLocaleString(), l: 'Income', c: colors.green },
             { v: player.totalXP.toLocaleString(), l: 'XP', c: colors.purple },
             { v: deals.length, l: 'Deals', c: colors.orange },
             { v: calls.length, l: 'Calls', c: colors.blue }
            ].map((x, i) => React.createElement('div', { key: i, style: { ...s.stat, background: x.c + '15' } },
              React.createElement('div', { style: { fontSize: 26, fontWeight: 700, fontFamily: 'var(--font-display)', color: x.c } }, x.v),
              React.createElement('div', { style: { fontSize: 11, color: 'var(--text-tertiary)', marginTop: 6 } }, x.l)
            ))
          ),
          React.createElement('div', { style: { marginTop: 20 } },
            [{ icon: '🔥', n: 'Streak', v: player.streak.current, c: colors.red },
             { icon: '🍅', n: 'Pomodoros', v: player.pomodoros, c: colors.orange },
             { icon: '🧘', n: 'Breathwork', v: player.breathSessions, c: colors.teal }
            ].map((x, i) => React.createElement('div', { key: i, style: { display: 'flex', alignItems: 'center', gap: 14, padding: 14, background: 'var(--bg-tertiary)', borderRadius: 14, marginBottom: 10 } },
              React.createElement('span', { style: { fontSize: 26 } }, x.icon),
              React.createElement('div', { style: { flex: 1, fontSize: 14 } }, x.n),
              React.createElement('div', { style: { fontSize: 26, fontWeight: 700, fontFamily: 'var(--font-display)', color: x.c } }, x.v)
            ))
          )
        ),
        React.createElement('div', { style: s.card },
          React.createElement('div', { style: s.cHead }, React.createElement('div', { style: s.cTitle }, '⚡ Skills')),
          Object.entries(cats).map(([k, v]) => React.createElement('div', { key: k, style: { display: 'flex', alignItems: 'center', gap: 12, padding: 14, background: 'var(--bg-tertiary)', borderRadius: 14, marginBottom: 10 } },
            React.createElement('div', { style: { fontSize: 22 } }, v.icon),
            React.createElement('div', { style: { flex: 1 } },
              React.createElement('div', { style: { fontSize: 13, fontWeight: 500 } }, v.name),
              React.createElement('div', { style: { fontSize: 10, color: 'var(--text-tertiary)' } }, 'Lv ' + (skillLvls[k]?.lvl || 1) + ' • ' + (skillLvls[k]?.xp || 0) + ' XP')
            ),
            React.createElement('div', { style: { width: 70, height: 6, background: 'var(--bg-elevated)', borderRadius: 3, overflow: 'hidden' } },
              React.createElement('div', { style: { height: '100%', width: ((skillLvls[k]?.prog || 0) * 100) + '%', background: v.color, boxShadow: '0 0 8px ' + v.color } })
            )
          ))
        ),
        React.createElement('div', { style: s.card },
          React.createElement('div', { style: s.cHead },
            React.createElement('div', { style: s.cTitle }, '🏆 Achievements'),
            React.createElement('span', { style: { fontSize: 13, color: 'var(--text-tertiary)' } }, achievements.filter(a => a.unlocked).length + '/' + achievements.length)
          ),
          React.createElement('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: 10 } },
            achievements.map(a => React.createElement('div', { key: a.id, onClick: () => a.unlocked && setCelebration(a), style: { textAlign: 'center', padding: 14, background: 'var(--bg-tertiary)', borderRadius: 14, opacity: a.unlocked ? 1 : 0.3, cursor: a.unlocked ? 'pointer' : 'default', border: a.unlocked ? '1px solid rgba(167, 139, 250, 0.3)' : '1px solid transparent' } },
              React.createElement('div', { style: { fontSize: 32, filter: a.unlocked ? 'drop-shadow(0 0 8px var(--accent-secondary))' : 'grayscale(1)' } }, a.icon),
              React.createElement('div', { style: { fontSize: 10, marginTop: 6 } }, a.name)
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
        React.createElement('div', { style: s.mHead }, React.createElement('h3', { style: s.mTitle }, 'Edit Deal'), React.createElement('button', { style: s.mClose, onClick: () => setModal(null) }, '×')),
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
        React.createElement('div', { style: s.mHead }, React.createElement('h3', { style: s.mTitle }, '📞 Add Consultation'), React.createElement('button', { style: s.mClose, onClick: () => setModal(null) }, '×')),
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
        React.createElement('div', { style: s.mHead }, React.createElement('h3', { style: s.mTitle }, 'Edit Consultation'), React.createElement('button', { style: s.mClose, onClick: () => setModal(null) }, '×')),
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
        React.createElement('div', { style: s.mHead }, React.createElement('h3', { style: s.mTitle }, '📱 Add Call'), React.createElement('button', { style: s.mClose, onClick: () => setModal(null) }, '×')),
        React.createElement('label', { style: s.label }, 'Name'),
        React.createElement('input', { style: s.inp, placeholder: 'Client or prospect', value: newCall.client, onChange: e => setNewCall({ ...newCall, client: e.target.value }) }),
        React.createElement('label', { style: s.label }, 'Outcome'),
        React.createElement('select', { style: s.sel, value: newCall.outcome, onChange: e => setNewCall({ ...newCall, outcome: e.target.value }) },
          [['answered', 'Answered'], ['voicemail', 'Voicemail'], ['no-answer', 'No Answer'], ['callback', 'Callback']].map(o => React.createElement('option', { key: o[0], value: o[0] }, o[1]))
        ),
        React.createElement('label', { style: s.label }, 'Notes'),
        React.createElement('input', { style: s.inp, placeholder: 'Optional', value: newCall.notes, onChange: e => setNewCall({ ...newCall, notes: e.target.value }) }),
        React.createElement('button', { style: { ...s.btn, ...s.btnP, width: '100%', padding: 16, marginTop: 8 }, onClick: addCall }, 'Add Call')
      )
    ),

    modal === 'editCall' && editItem && React.createElement('div', { style: s.modal, onClick: () => setModal(null) },
      React.createElement('div', { style: s.mBox, onClick: e => e.stopPropagation() },
        React.createElement('div', { style: s.mHead }, React.createElement('h3', { style: s.mTitle }, 'Edit Call'), React.createElement('button', { style: s.mClose, onClick: () => setModal(null) }, '×')),
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
        React.createElement('div', { style: s.mHead }, React.createElement('h3', { style: s.mTitle }, 'Add Quest'), React.createElement('button', { style: s.mClose, onClick: () => setModal(null) }, '×')),
        React.createElement('label', { style: s.label }, 'Name'),
        React.createElement('input', { style: s.inp, placeholder: 'Quest name', value: newQuest.name, onChange: e => setNewQuest({ ...newQuest, name: e.target.value }) }),
        React.createElement('label', { style: s.label }, 'Description'),
        React.createElement('input', { style: s.inp, placeholder: 'Short description', value: newQuest.desc, onChange: e => setNewQuest({ ...newQuest, desc: e.target.value }) }),
        React.createElement('label', { style: s.label }, 'XP'),
        React.createElement('input', { style: s.inp, type: 'number', value: newQuest.xp, onChange: e => setNewQuest({ ...newQuest, xp: e.target.value }) }),
        React.createElement('label', { style: s.label }, 'Category'),
        React.createElement('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 14 } },
          Object.entries(cats).map(([k, v]) => React.createElement('div', { key: k, onClick: () => setNewQuest({ ...newQuest, cat: k }), style: { padding: 12, borderRadius: 12, cursor: 'pointer', textAlign: 'center', background: newQuest.cat === k ? v.color + '25' : 'var(--bg-tertiary)', border: newQuest.cat === k ? '2px solid ' + v.color : '2px solid transparent' } },
            React.createElement('div', { style: { fontSize: 20 } }, v.icon),
            React.createElement('div', { style: { fontSize: 10, marginTop: 4 } }, v.name)
          ))
        ),
        React.createElement('label', { style: { display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14, fontSize: 13 } },
          React.createElement('input', { type: 'checkbox', checked: newQuest.neg, onChange: e => setNewQuest({ ...newQuest, neg: e.target.checked }) }), ' Vice (negative XP)'
        ),
        React.createElement('button', { style: { ...s.btn, ...s.btnP, width: '100%', padding: 16 }, onClick: addQuest }, 'Add Quest')
      )
    ),

    modal === 'editQuests' && React.createElement('div', { style: s.modal, onClick: () => setModal(null) },
      React.createElement('div', { style: s.mBox, onClick: e => e.stopPropagation() },
        React.createElement('div', { style: s.mHead }, React.createElement('h3', { style: s.mTitle }, 'Edit Quests'), React.createElement('button', { style: s.mClose, onClick: () => setModal(null) }, '×')),
        React.createElement('div', { style: { maxHeight: 400, overflowY: 'auto' } },
          questLib.map(q => React.createElement('div', { key: q.id, onClick: () => setQuestLib(p => p.map(x => x.id === q.id ? { ...x, on: !x.on } : x)), style: { display: 'flex', alignItems: 'center', gap: 12, padding: 14, background: q.on ? 'rgba(45, 212, 191, 0.1)' : 'var(--bg-tertiary)', borderRadius: 12, marginBottom: 8, cursor: 'pointer', border: q.on ? '1px solid rgba(45, 212, 191, 0.2)' : '1px solid transparent' } },
            React.createElement('div', { style: { width: 20, height: 20, borderRadius: 6, border: q.on ? 'none' : '2px solid var(--text-tertiary)', background: q.on ? 'var(--accent-primary)' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, color: '#000' } }, q.on && '✓'),
            React.createElement('div', { style: { flex: 1, fontSize: 13 } }, q.name),
            React.createElement('span', { style: { fontSize: 11, color: q.neg ? colors.red : colors.purple } }, (q.xp > 0 ? '+' : '') + q.xp)
          ))
        ),
        React.createElement('button', { style: { ...s.btn, ...s.btnP, width: '100%', marginTop: 14, padding: 16 }, onClick: () => { setTodayQ(questLib.filter(q => q.on).map(q => { const ex = todayQ.find(x => x.id === q.id); return ex ? { ...q, done: ex.done } : { ...q, done: false }; })); setModal(null); showToast('Saved!'); } }, 'Apply (' + questLib.filter(q => q.on).length + ' active)')
      )
    ),

    modal === 'whoop' && React.createElement('div', { style: s.modal, onClick: () => setModal(null) },
      React.createElement('div', { style: s.mBox, onClick: e => e.stopPropagation() },
        React.createElement('div', { style: s.mHead }, React.createElement('h3', { style: s.mTitle }, '❤️ Health'), React.createElement('button', { style: s.mClose, onClick: () => setModal(null) }, '×')),
        ['Recovery %', 'Sleep %', 'Strain (0-21)', 'HRV'].map((l, i) => {
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
        React.createElement('div', { style: s.mHead }, React.createElement('h3', { style: s.mTitle }, 'Avatar'), React.createElement('button', { style: s.mClose, onClick: () => setModal(null) }, '×')),
        React.createElement('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 } },
          avatars.map(a => React.createElement('div', { key: a.id, onClick: () => selectAvatar(a.id), style: { textAlign: 'center', padding: 14, background: player.avatar === a.id ? 'rgba(45, 212, 191, 0.15)' : 'var(--bg-tertiary)', border: player.avatar === a.id ? '2px solid var(--accent-primary)' : '2px solid transparent', borderRadius: 14, opacity: player.level >= a.lvl ? 1 : 0.3, cursor: player.level >= a.lvl ? 'pointer' : 'not-allowed' } },
            React.createElement('div', { style: { fontSize: 32, filter: player.level >= a.lvl ? 'drop-shadow(0 0 6px var(--accent-primary))' : 'grayscale(1)' } }, a.icon),
            React.createElement('div', { style: { fontSize: 11, marginTop: 6, fontWeight: 500 } }, a.name),
            React.createElement('div', { style: { fontSize: 10, color: 'var(--text-tertiary)' } }, 'Lv ' + a.lvl)
          ))
        )
      )
    ),

    modal === 'incomeSet' && React.createElement('div', { style: s.modal, onClick: () => setModal(null) },
      React.createElement('div', { style: s.mBox, onClick: e => e.stopPropagation() },
        React.createElement('div', { style: s.mHead }, React.createElement('h3', { style: s.mTitle }, '💰 Income Settings'), React.createElement('button', { style: s.mClose, onClick: () => setModal(null) }, '×')),
        [['Base Salary (CHF)', 'base'], ['Monthly Target (CHF)', 'target'], ['Monthly Deals Target', 'dealsTarget'], ['Monthly Consults Target', 'consultsTarget'], ['Monthly Calls Target', 'callsTarget']].map(([l, k]) => React.createElement('div', { key: k },
          React.createElement('label', { style: s.label }, l),
          React.createElement('input', { style: s.inp, type: 'number', value: incSet[k], onChange: e => setIncSet({ ...incSet, [k]: +e.target.value || 0 }) })
        )),
        React.createElement('button', { style: { ...s.btn, ...s.btnP, width: '100%', padding: 16 }, onClick: () => { setModal(null); showToast('Saved!'); } }, 'Save')
      )
    ),

    modal === 'weeklySet' && React.createElement('div', { style: s.modal, onClick: () => setModal(null) },
      React.createElement('div', { style: s.mBox, onClick: e => e.stopPropagation() },
        React.createElement('div', { style: s.mHead }, React.createElement('h3', { style: s.mTitle }, '📅 Weekly Targets'), React.createElement('button', { style: s.mClose, onClick: () => setModal(null) }, '×')),
        [['Deals', 'deals'], ['Consultations', 'consults'], ['Calls', 'calls']].map(([l, k]) => React.createElement('div', { key: k },
          React.createElement('label', { style: s.label }, l),
          React.createElement('input', { style: s.inp, type: 'number', value: weeklyTargets[k], onChange: e => setWeeklyTargets({ ...weeklyTargets, [k]: +e.target.value || 0 }) })
        )),
        React.createElement('button', { style: { ...s.btn, ...s.btnP, width: '100%', padding: 16 }, onClick: () => { setModal(null); showToast('Saved!'); } }, 'Save')
      )
    ),

    modal === 'settings' && React.createElement('div', { style: s.modal, onClick: () => setModal(null) },
      React.createElement('div', { style: s.mBox, onClick: e => e.stopPropagation() },
        React.createElement('div', { style: s.mHead }, React.createElement('h3', { style: s.mTitle }, '⚙️ Settings'), React.createElement('button', { style: s.mClose, onClick: () => setModal(null) }, '×')),
        
        // Theme Selection
        React.createElement('div', { style: { marginBottom: 24 } },
          React.createElement('label', { style: s.label }, 'Theme'),
          React.createElement('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 10 } },
            themes.map(t => React.createElement('div', { key: t.id, onClick: () => setSettings(s => ({...s, theme: t.id})), style: { textAlign: 'center', padding: 14, background: settings.theme === t.id ? 'var(--accent-primary)' + '20' : 'var(--bg-tertiary)', border: settings.theme === t.id ? '2px solid var(--accent-primary)' : '2px solid transparent', borderRadius: 12, cursor: 'pointer' } },
              React.createElement('div', { style: { fontSize: 22 } }, t.icon),
              React.createElement('div', { style: { fontSize: 10, marginTop: 6 } }, t.name)
            ))
          )
        ),
        
        // Timezone
        React.createElement('div', { style: { marginBottom: 24 } },
          React.createElement('label', { style: s.label }, 'Timezone'),
          React.createElement('select', { style: s.sel, value: settings.timezone, onChange: e => setSettings(s => ({...s, timezone: e.target.value})) },
            timezones.map(tz => React.createElement('option', { key: tz, value: tz }, tz))
          )
        ),
        
        // Sound & Haptic toggles
        React.createElement('div', { style: { display: 'flex', gap: 12, marginBottom: 24 } },
          React.createElement('div', { onClick: () => setSettings(s => ({...s, sound: !s.sound})), style: { flex: 1, padding: 16, background: settings.sound ? 'rgba(48, 209, 88, 0.15)' : 'var(--bg-tertiary)', borderRadius: 14, textAlign: 'center', cursor: 'pointer', border: settings.sound ? '1px solid rgba(48, 209, 88, 0.3)' : '1px solid transparent' } },
            React.createElement('div', { style: { fontSize: 24 } }, '🔊'),
            React.createElement('div', { style: { fontSize: 12, marginTop: 6 } }, 'Sound'),
            React.createElement('div', { style: { fontSize: 10, color: settings.sound ? colors.green : 'var(--text-tertiary)', marginTop: 4 } }, settings.sound ? 'On' : 'Off')
          ),
          React.createElement('div', { onClick: () => setSettings(s => ({...s, haptic: !s.haptic})), style: { flex: 1, padding: 16, background: settings.haptic ? 'rgba(48, 209, 88, 0.15)' : 'var(--bg-tertiary)', borderRadius: 14, textAlign: 'center', cursor: 'pointer', border: settings.haptic ? '1px solid rgba(48, 209, 88, 0.3)' : '1px solid transparent' } },
            React.createElement('div', { style: { fontSize: 24 } }, '📳'),
            React.createElement('div', { style: { fontSize: 12, marginTop: 6 } }, 'Haptic'),
            React.createElement('div', { style: { fontSize: 10, color: settings.haptic ? colors.green : 'var(--text-tertiary)', marginTop: 4 } }, settings.haptic ? 'On' : 'Off')
          )
        ),
        
        // Reset
        React.createElement('button', { onClick: () => { if(confirm('Reset all data? This cannot be undone.')) { localStorage.clear(); location.reload(); }}, style: { ...s.btn, ...s.btnD, width: '100%', padding: 16, marginBottom: 12 } }, '🗑️ Reset All Data'),
        React.createElement('button', { style: { ...s.btn, ...s.btnS, width: '100%', padding: 16 }, onClick: () => setModal(null) }, 'Close')
      )
    ),

    // Toast
    React.createElement('div', { style: s.toastStyle }, toast.msg)
  );
};

ReactDOM.createRoot(document.getElementById('root')).render(React.createElement(App));
