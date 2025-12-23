# 2026 Inevitable Success System

A gamified goal-tracking dashboard for financial advisors. Built with React, uses localStorage for data persistence.

## 🚀 Features

- **Quest System**: 22+ habits with XP rewards
- **Negative XP Vices**: Track bad habits that subtract XP  
- **Skill Trees**: 6 categories linked to quests
- **Income Tracking**: Base salary + commission tracking
- **Consultations**: Log and edit client meetings
- **Whoop Integration**: Manual health metrics
- **Achievements**: 17 unlockable badges
- **Avatars**: 8 unlockable profile icons
- **Day/Night Mode**: Full theme support
- **Charts**: Visual trends for income, recovery, XP

---

## 📦 DEPLOYMENT GUIDE

### Option 1: GitHub Pages (FREE - Recommended)

#### Step 1: Create GitHub Repository
1. Go to https://github.com/new
2. Name it `2026-inevitable` (or anything you want)
3. Make it **Public**
4. Click "Create repository"

#### Step 2: Upload Files
1. Click "uploading an existing file"
2. Drag and drop these files:
   - `index.html`
   - `app.jsx`
   - `manifest.json`
3. Click "Commit changes"

#### Step 3: Enable GitHub Pages
1. Go to repository **Settings** (tab at top)
2. Scroll to **Pages** (left sidebar)
3. Under "Source", select **main** branch
4. Click **Save**
5. Wait 1-2 minutes
6. Your site will be at: `https://YOUR-USERNAME.github.io/2026-inevitable`

#### Step 4: Add App Icons (Optional)
Create two PNG files:
- `icon-192.png` (192x192 pixels)
- `icon-512.png` (512x512 pixels)
Upload them to the repository.

---

### Option 2: Netlify (FREE - Automatic HTTPS)

1. Go to https://app.netlify.com
2. Sign up with GitHub
3. Click "Add new site" → "Deploy manually"
4. Drag your folder containing all files
5. Done! Get your URL instantly

---

### Option 3: Vercel (FREE)

1. Go to https://vercel.com
2. Sign up with GitHub
3. Click "New Project"
4. Import your GitHub repo
5. Click Deploy

---

## 🔮 FUTURE: Adding Supabase (Cloud Database)

When ready to add cloud sync:

### Step 1: Create Supabase Project
1. Go to https://supabase.com
2. Create new project
3. Get your API URL and anon key

### Step 2: Create Tables
```sql
-- Users
create table users (
  id uuid primary key default gen_random_uuid(),
  email text unique,
  created_at timestamp default now()
);

-- Player Stats
create table player_stats (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id),
  level int default 1,
  total_xp int default 0,
  streak_current int default 0,
  streak_best int default 0,
  avatar text default 'default',
  updated_at timestamp default now()
);

-- Deals
create table deals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id),
  client text,
  product text,
  commission int,
  date date,
  created_at timestamp default now()
);

-- Consultations
create table consultations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id),
  client text,
  type text,
  status text,
  script_adherence int,
  date date,
  created_at timestamp default now()
);
```

### Step 3: Add Supabase Client
Add to your HTML:
```html
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
```

Initialize in app:
```javascript
const supabase = supabase.createClient(
  'YOUR_SUPABASE_URL',
  'YOUR_ANON_KEY'
);
```

---

## 📱 Making it a Mobile App (PWA)

The app is already PWA-ready with the manifest.json!

### On iPhone:
1. Open your deployed site in Safari
2. Tap Share button
3. Tap "Add to Home Screen"
4. Name it and tap Add

### On Android:
1. Open in Chrome
2. Tap menu (3 dots)
3. Tap "Add to Home Screen"

---

## 🔧 Customization

### Change Colors
Edit the `theme` object in `app.jsx`:
```javascript
const theme = darkMode ? {
  bg: 'linear-gradient(135deg, #0a0a0f, #1a1a2e, #16213e)',
  accent: '#2dd4bf',  // Change this
  accent2: '#a78bfa', // And this
  // ...
}
```

### Add More Quests
Add to the `defQuests` array:
```javascript
{ id: 'custom1', name: 'My Habit', desc: 'Description', xp: 50, cat: 'health', on: true, neg: false }
```

### Add More Achievements
Add to the `defAchievements` array:
```javascript
{ id: 'custom_ach', name: 'Custom', icon: '🎉', desc: 'Description', cond: 'custom_condition', unlocked: false }
```

---

## 📄 Files

```
2026-inevitable-system/
├── index.html      # Main HTML (loads React)
├── app.jsx         # React application
├── manifest.json   # PWA configuration
├── icon-192.png    # App icon (create this)
├── icon-512.png    # App icon (create this)
└── README.md       # This file
```

---

## 🙏 Credits

Built for the Vitality Method framework.
Health → Wealth → Happiness

---

## License

MIT - Do whatever you want with it!
