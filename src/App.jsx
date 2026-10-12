import { useEffect, useState } from "react";
import {
  Activity,
  ArrowUpRight,
  BookOpen,
  Check,
  CheckCircle2,
  CalendarDays,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Code2,
  Droplets,
  Flame,
  LayoutDashboard,
  Menu,
  NotebookPen,
  Plus,
  Quote,
  Settings,
  Sparkles,
  Target,
  Trophy,
  Dumbbell,
  X,
} from "lucide-react";

const STORAGE_KEY = "daybyday-data-v1";

const QUOTE_LIBRARY = [
  { text: "Your time is limited, so don't waste it living someone else's life.", author: "Steve Jobs", source: "Stanford commencement address · 2005", category: "MAKE TODAY COUNT" },
  { text: "You do not rise to the level of your goals. You fall to the level of your systems.", author: "James Clear", source: "Atomic Habits", category: "BUILD YOUR SYSTEMS" },
  { text: "Nothing in life is to be feared; it is only to be understood.", author: "Marie Curie", source: "Scientist · Nobel laureate", category: "STAY CURIOUS" },
  { text: "It is our choices that show what we truly are, far more than our abilities.", author: "Albus Dumbledore", source: "Harry Potter and the Chamber of Secrets", category: "CHOOSE YOUR ACTIONS" },
  { text: "Nothing will work unless you do.", author: "Maya Angelou", source: "Poet and author", category: "TAKE THE FIRST STEP" },
  { text: "Well done is better than well said.", author: "Benjamin Franklin", source: "Writer, inventor, and statesman", category: "LET ACTION SPEAK" },
  { text: "Do. Or do not. There is no try.", author: "Yoda", source: "Star Wars: The Empire Strikes Back", category: "COMMIT TO THE WORK" },
  { text: "You miss 100% of the shots you don't take.", author: "Wayne Gretzky", source: "Hockey player · commonly quoted", category: "TAKE YOUR CHANCE" },
  { text: "The important thing is not to stop questioning.", author: "Albert Einstein", source: "Physicist · commonly attributed", category: "STAY CURIOUS" },
  { text: "The secret of getting ahead is getting started.", author: "Mark Twain", source: "Writer · commonly attributed", category: "BEGIN BEFORE READY" },
  { text: "Great things are done by a series of small things brought together.", author: "Vincent van Gogh", source: "Artist · commonly attributed", category: "RESPECT SMALL STEPS" },
  { text: "It always seems impossible until it is done.", author: "Nelson Mandela", source: "Often attributed to Mandela", category: "KEEP GOING" },
  { text: "You have to be odd to be number one.", author: "Dr. Seuss", source: "Author and poet", category: "OWN YOUR PATH" },
  { text: "A person who never made a mistake never tried anything new.", author: "Albert Einstein", source: "Commonly attributed", category: "LEARN BY TRYING" },
  { text: "The only way out is through.", author: "Robert Frost", source: "Poet · phrase associated with his work", category: "FACE THE WORK" },
  { text: "It is never too late to be what you might have been.", author: "George Eliot", source: "Writer · commonly attributed", category: "START AGAIN" },
  { text: "Believe you can and you're halfway there.", author: "Theodore Roosevelt", source: "Commonly attributed", category: "TRUST YOUR EFFORT" },
  { text: "I have not failed. I've just found 10,000 ways that won't work.", author: "Thomas Edison", source: "Inventor · commonly attributed", category: "MAKE FAILURE USEFUL" },
  { text: "The journey of a thousand miles begins with a single step.", author: "Lao Tzu", source: "Tao Te Ching · traditional translation", category: "START SMALL" },
  { text: "The best way out is always through.", author: "Robert Frost", source: "Poet · commonly quoted", category: "STAY WITH IT" },
  { text: "If you can dream it, you can do it.", author: "Walt Disney", source: "Commonly attributed", category: "MAKE IT REAL" },
  { text: "Act as if what you do makes a difference. It does.", author: "William James", source: "Psychologist and philosopher", category: "YOUR WORK MATTERS" },
  { text: "Nothing is particularly hard if you divide it into small jobs.", author: "Henry Ford", source: "Industrialist · commonly attributed", category: "BREAK IT DOWN" },
  { text: "A year from now you may wish you had started today.", author: "Karen Lamb", source: "Writer · commonly attributed", category: "START TODAY" },
  { text: "We are what we repeatedly do.", author: "Will Durant", source: "The Story of Philosophy · summary of Aristotle", category: "BUILD YOUR HABITS" },
  { text: "The future depends on what you do today.", author: "Mahatma Gandhi", source: "Commonly attributed", category: "MAKE TODAY COUNT" },
  { text: "You don't have to see the whole staircase, just take the first step.", author: "Martin Luther King Jr.", source: "Commonly attributed", category: "TAKE THE FIRST STEP" },
  { text: "The only impossible journey is the one you never begin.", author: "Tony Robbins", source: "Author and speaker", category: "BEGIN THE JOURNEY" },
  { text: "Small disciplines repeated with consistency every day lead to great achievements.", author: "John C. Maxwell", source: "Author and leadership speaker", category: "CHOOSE CONSISTENCY" },
  { text: "Do what you can, with what you have, where you are.", author: "Theodore Roosevelt", source: "Commonly attributed", category: "USE WHAT YOU HAVE" },
];

// Select a stable set of five quotes for each local calendar date.
// The selection changes daily without an API or backend.
function getDailyQuotes(dateString) {
  const [year, month, day] = dateString.split("-").map(Number);
  const dayNumber = Math.floor(Date.UTC(year, month - 1, day) / 86400000);
  const start = dayNumber % QUOTE_LIBRARY.length;
  return Array.from({ length: 5 }, (_, index) =>
      QUOTE_LIBRARY[(start + index * 7) % QUOTE_LIBRARY.length]
  );
}

const DEFAULT_HABITS = [
  { id: "coding", name: "Deep work / coding", detail: "Focus on DSA or projects", icon: Code2 },
  { id: "study", name: "Study & learning", detail: "Learn something valuable", icon: BookOpen },
  { id: "workout", name: "Workout", detail: "Move your body today", icon: Dumbbell },
  { id: "water", name: "Drink water", detail: "Reach your daily water goal", icon: Droplets },
  { id: "reading", name: "Read", detail: "Read for at least 10 minutes", icon: BookOpen },
];

function getToday() {
  const now = new Date();
  const offset = now.getTimezoneOffset() * 60000;
  return new Date(now.getTime() - offset).toISOString().slice(0, 10);
}

function loadData() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : { days: {}, habits: null };
  } catch {
    return { days: {}, habits: null };
  }
}

function getInitialData() {
  const data = loadData();

  if (!data.days) data.days = {};

  if (!data.habits) {
    data.habits = DEFAULT_HABITS.map(({ id, name, detail }) => ({
      id,
      name,
      detail,
    }));
  }

  return data;
}

function getDayRecord(data, date) {
  return (
      data.days[date] || {
        completed: {},
        water: 0,
        note: "",
      }
  );
}

function formatDate(date) {
  return new Date(`${date}T12:00:00`).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function getGreeting() {
  const hour = new Date().getHours();

  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

function dateKey(date) {
  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0"),
  ].join("-");
}

function shiftDate(dateString, amount) {
  const date = new Date(`${dateString}T12:00:00`);
  date.setDate(date.getDate() + amount);
  return dateKey(date);
}

function hasAnyCompletedHabit(data, date, habits) {
  const completed = getDayRecord(data, date).completed || {};
  return habits.some((habit) => Boolean(completed[habit.id]));
}

function getStreak(data, habitId, today) {
  // If today's habit is not done yet, allow the streak to continue from yesterday.
  let cursor = getDayRecord(data, today).completed?.[habitId]
      ? today
      : shiftDate(today, -1);
  let streak = 0;

  while (getDayRecord(data, cursor).completed?.[habitId]) {
    streak += 1;
    cursor = shiftDate(cursor, -1);
  }

  return streak;
}

function getConsistencyStreak(data, habits, today) {
  let cursor = hasAnyCompletedHabit(data, today, habits)
      ? today
      : shiftDate(today, -1);
  let streak = 0;

  while (hasAnyCompletedHabit(data, cursor, habits)) {
    streak += 1;
    cursor = shiftDate(cursor, -1);
  }

  return streak;
}

function getBestConsistencyStreak(data, habits, today) {
  const dates = Object.keys(data.days || {}).filter((date) => date <= today).sort();
  let best = 0;
  let current = 0;
  let previousDate = null;

  for (const date of dates) {
    if (!hasAnyCompletedHabit(data, date, habits)) {
      current = 0;
      previousDate = date;
      continue;
    }

    if (previousDate && shiftDate(previousDate, 1) === date) {
      current += 1;
    } else {
      current = 1;
    }

    best = Math.max(best, current);
    previousDate = date;
  }

  return best;
}


function getCalendarYearDays(data, habits, year) {
  const daysInYear = new Date(year, 1, 29).getMonth() === 1 ? 366 : 365;

  return Array.from({ length: daysInYear }, (_, index) => {
    const date = dateKey(new Date(year, 0, index + 1));
    const record = getDayRecord(data, date);
    const completed = habits.filter(
        (habit) => record.completed?.[habit.id]
    ).length;
    const total = habits.length;

    const ratio = completed / Math.max(total, 1);
    const level =
        completed === 0 ? 0 :
            ratio < 0.34 ? 1 :
                ratio < 0.67 ? 2 :
                    ratio < 1 ? 3 : 4;

    return { date, completed, total, level };
  });
}



function Card({ children, className = "", style }) {
  return (
      <section
          style={style}
          className={`rounded-2xl border border-white/[0.07] bg-panel ${className}`}
      >
        {children}
      </section>
  );
}


function SectionTitle({ icon: Icon, title, subtitle, right }) {
  return (
      <div className="mb-5 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="rounded-xl border border-white/[0.07] bg-white/[0.04] p-2">
            <Icon size={18} className="text-lime-300" />
          </div>
          <div>
            <h2 className="font-semibold text-gray-100">{title}</h2>
            {subtitle && (
                <p className="mt-1 text-xs text-muted">{subtitle}</p>
            )}
          </div>
        </div>
        {right}
      </div>
  );
}

function App() {
  const [data, setData] = useState(getInitialData);
  const [today, setToday] = useState(getToday);
  const [note, setNote] = useState("");
  const [waterGoal, setWaterGoal] = useState(8);
  const [newHabit, setNewHabit] = useState("");
  const [addingHabit, setAddingHabit] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [notice, setNotice] = useState("");
  const [quoteIndex, setQuoteIndex] = useState(0);
  const dailyQuotes = getDailyQuotes(today);

  const record = getDayRecord(data, today);
  const habits = data.habits || DEFAULT_HABITS;
  const completedCount = habits.filter(
      (habit) => record.completed?.[habit.id]
  ).length;

  const percentage = habits.length
      ? Math.round((completedCount / habits.length) * 100)
      : 0;

  const currentStreak = getConsistencyStreak(data, habits, today);
  const bestStreak = getBestConsistencyStreak(data, habits, today);

  const calendarYear = Number(today.slice(0, 4));

  const activityDays = getCalendarYearDays(
      data,
      habits,
      calendarYear
  );

  const activeDays = activityDays.filter(
      (day) => day.date <= today && day.completed > 0
  ).length;

// Align January 1 with its correct weekday.
  const heatmapPadding = new Date(
      `${activityDays[0].date}T12:00:00`
  ).getDay();

  const heatmapCells = [
    ...Array.from({ length: heatmapPadding }, () => null),
    ...activityDays,
  ];

// Complete the final week so every column has seven rows.
  while (heatmapCells.length % 7 !== 0) {
    heatmapCells.push(null);
  }

  const heatmapWeeks = Array.from(
      { length: heatmapCells.length / 7 },
      (_, index) => heatmapCells.slice(index * 7, index * 7 + 7)
  );

  const longestHabitStreak = habits.reduce(
      (best, habit) => Math.max(best, getStreak(data, habit.id, today)),
      0
  );
  const last7Days = Array.from({ length: 7 }, (_, index) => {
    const date = shiftDate(today, index - 6);
    const dayRecord = getDayRecord(data, date);
    const completed = habits.filter((habit) => dayRecord.completed?.[habit.id]).length;
    return {
      date,
      label: new Date(`${date}T12:00:00`).toLocaleDateString("en-US", { weekday: "short" }),
      completed,
      total: habits.length,
      percentage: habits.length ? Math.round((completed / habits.length) * 100) : 0,
    };
  });
  const weeklyCompletionRate = Math.round(
      last7Days.reduce((sum, day) => sum + day.percentage, 0) / last7Days.length
  );
  const weeklyCompletedHabits = last7Days.reduce((sum, day) => sum + day.completed, 0);
  const bestDayThisWeek = last7Days.reduce(
      (best, day) => day.completed > best.completed ? day : best,
      last7Days[0]
  );
  const habitPerformance = habits.map((habit) => {
    const completedDays = last7Days.filter(
        (day) => getDayRecord(data, day.date).completed?.[habit.id]
    ).length;
    return { ...habit, completedDays, percentage: Math.round((completedDays / 7) * 100) };
  }).sort((a, b) => b.percentage - a.percentage);

  useEffect(() => {
    // Refresh the current local date while the page remains open.
    const dateRefresh = window.setInterval(() => {
      const currentDate = getToday();
      setToday((previous) => previous === currentDate ? previous : currentDate);
    }, 30000);

    return () => window.clearInterval(dateRefresh);
  }, []);

  useEffect(() => {
    setQuoteIndex(0);
    const rotation = window.setInterval(() => {
      setQuoteIndex((current) => (current + 1) % dailyQuotes.length);
    }, 15000);

    return () => window.clearInterval(rotation);
  }, [today]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [data]);

  useEffect(() => {
    setNote(record.note || "");
  }, [today]);

  function updateRecord(updates) {
    setData((previous) => {
      const existing = getDayRecord(previous, today);

      return {
        ...previous,
        days: {
          ...previous.days,
          [today]: {
            ...existing,
            ...updates,
          },
        },
      };
    });
  }

  function toggleHabit(id) {
    const completed = {
      ...record.completed,
      [id]: !record.completed?.[id],
    };

    updateRecord({ completed });
  }

  function changeWater(amount) {
    updateRecord({
      water: Math.max(0, Math.min(30, (record.water || 0) + amount)),
    });
  }

  function saveNote() {
    updateRecord({ note });
    setNotice("Your reflection is saved.");
    window.setTimeout(() => setNotice(""), 2500);
  }

  function addHabit(event) {
    event.preventDefault();

    const name = newHabit.trim();
    if (!name) return;

    const habit = {
      id: `custom-${Date.now()}`,
      name,
      detail: "Your personal daily habit",
    };

    setData((previous) => ({
      ...previous,
      habits: [...previous.habits, habit],
    }));

    setNewHabit("");
    setAddingHabit(false);
    setNotice("New habit added.");
    window.setTimeout(() => setNotice(""), 2500);
  }

  const stats = [
    {
      label: "Today's progress",
      value: `${percentage}%`,
      detail: `${completedCount} of ${habits.length} habits`,
      icon: Target,
    },
    {
      label: "Habits completed",
      value: `${completedCount}/${habits.length}`,
      detail: completedCount === habits.length && habits.length
          ? "Everything checked off!"
          : "One step at a time",
      icon: CheckCircle2,
    },
    {
      label: "Water intake",
      value: `${record.water || 0}/${waterGoal}`,
      detail: "Glasses tracked today",
      icon: Droplets,
    },
    {
      label: "Habits to build",
      value: String(habits.length),
      detail: "Your personal routine",
      icon: Flame,
    },
  ];

  const sidebarItems = [
    { name: "Dashboard", icon: LayoutDashboard },
    { name: "My habits", icon: CheckCircle2 },
    { name: "Journal", icon: NotebookPen },
    { name: "Progress", icon: Activity },
  ];

  function navigate(name) {
    setActiveTab(name);
    setMobileMenu(false);

    const target = {
      Dashboard: "dashboard",
      "My habits": "habits",
      Journal: "journal",
      Progress: "analytics",
    }[name];

    document.getElementById(target)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }

  return (
      <div className="min-h-screen bg-background text-gray-100">
        {mobileMenu && (
            <button
                aria-label="Close navigation overlay"
                onClick={() => setMobileMenu(false)}
                className="fixed inset-0 z-40 bg-black/60 lg:hidden"
            />
        )}

        {/* Sidebar */}
        <aside
            className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-white/[0.07] bg-[#0E1017] transition-transform duration-200 lg:translate-x-0 ${
                mobileMenu ? "translate-x-0" : "-translate-x-full"
            }`}
        >
          <div className="flex h-[76px] items-center justify-between border-b border-white/[0.07] px-6">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-lime-300 text-gray-950">
                <Activity size={21} strokeWidth={2.5} />
              </div>
              <div>
                <h1 className="font-bold tracking-[0.15em]">DAYBYDAY</h1>
                <p className="mt-0.5 text-[10px] tracking-wider text-muted">
                  BUILD YOUR CONSISTENCY
                </p>
              </div>
            </div>

            <button
                onClick={() => setMobileMenu(false)}
                className="rounded-lg p-2 text-muted hover:bg-white/5 lg:hidden"
                aria-label="Close menu"
            >
              <X size={18} />
            </button>
          </div>

          <div className="px-4 pt-8">
            <p className="mb-3 px-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-gray-500">
              Workspace
            </p>

            <nav className="space-y-1">
              {sidebarItems.map(({ name, icon: Icon }) => (
                  <button
                      key={name}
                      onClick={() => navigate(name)}
                      className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm transition ${
                          activeTab === name
                              ? "bg-lime-300/10 font-medium text-lime-300"
                              : "text-gray-400 hover:bg-white/[0.04] hover:text-white"
                      }`}
                  >
                    <Icon size={18} />
                    {name}
                    {activeTab === name && (
                        <span className="ml-auto h-1.5 w-1.5 rounded-full bg-lime-300" />
                    )}
                  </button>
              ))}
            </nav>
          </div>

          <div className="mt-auto p-4">
            <div className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-4">
              <div className="mb-3 flex items-center gap-2 text-lime-300">
                <Sparkles size={17} />
                <span className="text-xs font-semibold">A small reminder</span>
              </div>
              <p className="text-sm leading-6 text-gray-400">
                You don't need to be perfect. You just need to keep showing up.
              </p>
            </div>

            <div className="mt-4 flex items-center gap-3 border-t border-white/[0.07] pt-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-lime-300 to-emerald-500 font-bold text-gray-950">
                Y
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium">Your workspace</p>
                <p className="mt-1 text-xs text-muted">Personal tracker</p>
              </div>
              <Settings size={17} className="text-muted" />
            </div>
          </div>
        </aside>

        {/* Main content */}
        <main className="min-h-screen lg:ml-64">
          <header className="sticky top-0 z-30 flex h-[76px] items-center justify-between border-b border-white/[0.07] bg-background/90 px-4 backdrop-blur-xl sm:px-8">
            <div className="flex items-center gap-3">
              <button
                  onClick={() => setMobileMenu(true)}
                  className="rounded-lg p-2 text-gray-300 hover:bg-white/5 lg:hidden"
                  aria-label="Open navigation"
              >
                <Menu size={21} />
              </button>
              <div>
                <p className="text-sm font-medium">{activeTab}</p>
                <p className="mt-1 hidden text-xs text-muted sm:block">
                  Your progress, one day at a time
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden text-right sm:block">
                <p className="text-xs text-gray-300">{formatDate(today)}</p>
                <p className="mt-1 text-[10px] text-muted">LOCAL DATE</p>
              </div>
              <button
                  onClick={() => {
                    setToday(getToday());
                    setActiveTab("Dashboard");
                  }}
                  className="rounded-xl border border-white/10 bg-white/[0.03] p-2.5 text-gray-300 hover:bg-white/[0.07]"
                  title="Return to today"
                  aria-label="Return to today"
              >
                <ChevronDown size={17} />
              </button>
            </div>
          </header>

          <div id="dashboard" className="mx-auto max-w-[1440px] scroll-mt-24 p-4 sm:p-8">
            {/* Today's date and rotating motivation */}

            <Card
                style={{
                  backgroundColor: "#F7F0E5",
                  borderColor: "#E8D9C5",
                  color: "#29241F",
                }}
                className="relative mb-8 overflow-hidden border-[#E8D9C5] bg-[#F7F0E5] p-5 text-[#29241F] shadow-[0_18px_55px_rgba(0,0,0,0.16)] sm:p-8"
            >

            <div className="pointer-events-none absolute -right-16 -top-20 h-64 w-64 rounded-full bg-[#D9A15B]/20 blur-3xl" />
              <div className="pointer-events-none absolute -bottom-20 left-1/3 h-48 w-48 rounded-full bg-[#B96C43]/10 blur-3xl" />
              <div className="relative grid gap-8 lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-10">
                <div className="flex flex-col justify-between border-b border-[#DCCAB2] pb-6 lg:border-b-0 lg:border-r lg:pb-0 lg:pr-8">
                  <div>
                    <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#B96C43]/25 bg-white/50 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-[#98512F]">
                      <CalendarDays size={14} /> YOUR DAILY PAUSE
                    </div>
                    <p className="font-serif text-3xl font-semibold leading-tight tracking-tight text-[#29241F] sm:text-4xl">
                      {formatDate(today).split(", ")[1]}
                    </p>
                    <p className="mt-2 text-sm font-medium text-[#76695C]">
                      {formatDate(today).split(", ")[0]} · {today.slice(0, 4)} · A new page to write.
                    </p>
                  </div>
                  <div className="mt-6 flex items-center gap-2 text-xs font-medium text-[#98512F]">
                    <span className="h-2 w-2 rounded-full bg-[#B96C43]" />
                    ONE DAY. ONE STEP. KEEP GOING.
                  </div>
                </div>

                <div className="min-w-0">
                  <div className="mb-5 flex items-center justify-between gap-3">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-[#98512F]">A thought to carry with you</p>
                      <p className="mt-1 text-xs text-[#8A7A69]">Wisdom from science, stories, and creative minds</p>
                    </div>
                    <span className="shrink-0 rounded-full border border-[#DCCAB2] bg-white/60 px-3 py-1.5 text-[11px] font-semibold tabular-nums text-[#76695C]">
                      0{quoteIndex + 1} <span className="text-[#B96C43]">/</span> 05
                    </span>
                  </div>

                  <div className="min-h-[145px]" aria-live="polite" aria-atomic="true">
                    <Quote size={27} strokeWidth={1.6} className="mb-3 text-[#B96C43]/70" />
                    <p className="font-serif text-2xl font-medium leading-[1.35] tracking-[-0.025em] text-[#29241F] sm:text-3xl sm:leading-[1.35]">
                      “{dailyQuotes[quoteIndex].text}”
                    </p>
                    <div className="mt-5 flex flex-wrap items-end justify-between gap-4">
                      <div>
                        <p className="text-sm font-bold text-[#29241F]">{dailyQuotes[quoteIndex].author}</p>
                        <p className="mt-1 text-xs text-[#8A7A69]">{dailyQuotes[quoteIndex].source}</p>
                      </div>
                      <span className="rounded-md bg-[#E8D9C5]/70 px-2.5 py-1.5 text-[9px] font-bold tracking-[0.16em] text-[#98512F]">
                        {dailyQuotes[quoteIndex].category}
                      </span>
                    </div>
                  </div>

                  <div className="mt-6 flex items-center justify-between border-t border-[#DCCAB2] pt-4">
                    <p className="text-[11px] text-[#8A7A69]">Let the words settle. Then take the next step.</p>
                    <div className="flex items-center gap-2">
                      <button
                          type="button"
                          onClick={() => setQuoteIndex((current) => (current - 1 + dailyQuotes.length) % dailyQuotes.length)}
                          className="rounded-full border border-[#DCCAB2] bg-white/60 p-2.5 text-[#6F5A49] transition hover:border-[#B96C43] hover:bg-white hover:text-[#98512F]"
                          aria-label="Previous quote"
                      >
                        <ChevronLeft size={16} />
                      </button>
                      <div className="flex items-center gap-1.5 px-1" aria-label={`Quote ${quoteIndex + 1} of ${dailyQuotes.length}`}>
                        {dailyQuotes.map((quote, index) => (
                            <button
                                key={`${quote.author}-${index}`}
                                type="button"
                                onClick={() => setQuoteIndex(index)}
                                className={`h-1.5 rounded-full transition-all duration-300 ${index === quoteIndex ? "w-6 bg-[#B96C43]" : "w-1.5 bg-[#CBB9A3] hover:bg-[#A88E75]"}`}
                                aria-label={`Show quote ${index + 1}`}
                            />
                        ))}
                      </div>
                      <button
                          type="button"
                          onClick={() => setQuoteIndex((current) => (current + 1) % dailyQuotes.length)}
                          className="rounded-full border border-[#DCCAB2] bg-white/60 p-2.5 text-[#6F5A49] transition hover:border-[#B96C43] hover:bg-white hover:text-[#98512F]"
                          aria-label="Next quote"
                      >
                        <ChevronRight size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Greeting */}
            <div className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
              <div>
                <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-lime-300/15 bg-lime-300/[0.06] px-3 py-1.5 text-xs text-lime-300">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-lime-300" />
                  YOUR DAILY RESET
                </div>
                <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                  {getGreeting()}. Keep building.
                </h2>
                <p className="mt-2 max-w-xl text-sm leading-6 text-muted">
                  Small actions, repeated daily, create extraordinary results.
                  Let's make today count.
                </p>
              </div>

              <div className="flex items-center gap-2 self-start rounded-xl border border-white/[0.08] bg-panel px-4 py-3 sm:self-auto">
                <div className="rounded-lg bg-lime-300/10 p-2 text-lime-300">
                  <Trophy size={19} />
                </div>
                <div>
                  <p className="text-xs text-muted">Daily goal</p>
                  <p className="mt-0.5 text-sm font-semibold">
                    {percentage === 100 ? "Completed!" : "Keep going"}
                  </p>
                </div>
              </div>
            </div>

            {/* Summary cards */}
            <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {stats.map(({ label, value, detail, icon: Icon }) => (
                  <Card key={label} className="p-5">
                    <div className="mb-5 flex items-center justify-between">
                      <p className="text-sm text-muted">{label}</p>
                      <div className="rounded-xl border border-white/[0.07] bg-white/[0.035] p-2.5 text-lime-300">
                        <Icon size={19} />
                      </div>
                    </div>
                    <p className="text-3xl font-semibold tracking-tight">{value}</p>
                    <p className="mt-2 text-xs text-muted">{detail}</p>
                  </Card>
              ))}
            </div>

            {/* Full-year activity heatmap */}
            <Card className="mb-8 p-5 sm:p-6">
              <SectionTitle
                  icon={Activity}

                  title="Your consistency"
                  subtitle={`Your ${calendarYear} calendar. Each square represents one day.`}
                  right={
                    <span className="text-xs text-muted">
                       {activeDays} active days
                    </span>
                  }

              />
              <div className="overflow-x-auto pb-2">
                <div className="min-w-[1000px]">
                  <div
                      className="mb-2 grid gap-x-5 gap-y-[3px] pl-8 text-[10px] text-muted"
                      style={{ gridTemplateColumns: `repeat(${heatmapWeeks.length}, minmax(0, 1fr))` }}
                  >
                    {heatmapWeeks.map((week, weekIndex) => {

                      const firstOfMonth = week.find(
                          (day) => day && day.date.slice(8, 10) === "01"
                      );

                      const monthLabel = firstOfMonth
                          ? new Date(`${firstOfMonth.date}T12:00:00`)
                              .toLocaleDateString("en-US", { month: "short" })
                          : "";

                      return <span key={weekIndex}>{monthLabel}</span>;
                    })}
                  </div>
                  <div className="flex gap-2">
                    <div className="grid w-6 shrink-0 grid-rows-7 gap-[3px] text-[10px] text-muted">
                      <span>Sun</span><span></span><span>Tue</span><span></span><span>Thu</span><span></span><span>Sat</span>
                    </div>
                    <div
                        className="grid flex-1 gap-x-5 gap-y-[3px]"
                        style={{ gridTemplateColumns: `repeat(${heatmapWeeks.length}, minmax(0, 1fr))` }}
                    >
                      {heatmapWeeks.map((week, weekIndex) => (
                          <div
                              key={weekIndex}
                              className={`grid grid-rows-7 gap-1 ${
                                  weekIndex > 0 &&
                                  week.some((day) => day && day.date.slice(8, 10) === "01")
                                      ? "ml-2"
                                      : ""
                              }`}
                          >
                            {Array.from({ length: 7 }, (_, dayIndex) => {
                              const day = week[dayIndex];
                              if (!day) return <span key={`empty-${weekIndex}-${dayIndex}`} className="aspect-square" />;
                              const color = day.level === 0 ? "bg-white/[0.045]"
                                  : day.level === 1 ? "bg-lime-300/25"
                                      : day.level === 2 ? "bg-lime-300/45"
                                          : day.level === 3 ? "bg-lime-300/70"
                                              : "bg-lime-300";
                              return (
                                  <div
                                      key={day.date}
                                      title={`${formatDate(day.date)} — ${day.completed}/${day.total} habits completed`}
                                      aria-label={`${day.date}: ${day.completed} of ${day.total} habits completed`}
                                      className={`h-4 w-4 shrink-0 rounded-[3px] ${color}`}
                                  />
                              );
                            })}
                          </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                <p className="text-xs text-muted">Your history stays saved on this device. Keep showing up, one day at a time.</p>
                <div className="flex items-center gap-1.5 text-[10px] text-muted">
                  <span>Less</span>
                  {["bg-white/[0.045]", "bg-lime-300/25", "bg-lime-300/45", "bg-lime-300/70", "bg-lime-300"].map((color) => (
                      <span key={color} className={`h-3 w-3 rounded-[3px] ${color}`} />
                  ))}
                  <span>More</span>
                </div>
              </div>
            </Card>

            {/* Weekly analytics */}
            <section id="analytics" className="mb-8 scroll-mt-24 space-y-6">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <Card className="p-5">
                  <p className="text-sm text-muted">Weekly completion rate</p>
                  <div className="mt-3 flex items-end justify-between gap-3">
                    <p className="text-3xl font-semibold">{weeklyCompletionRate}%</p>
                    <span className="rounded-lg bg-lime-300/10 px-2 py-1 text-xs text-lime-300">Last 7 days</span>
                  </div>
                  <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
                    <div className="h-full rounded-full bg-lime-300 transition-all" style={{ width: `${weeklyCompletionRate}%` }} />
                  </div>
                </Card>
                <Card className="p-5">
                  <p className="text-sm text-muted">Habits completed this week</p>
                  <p className="mt-3 text-3xl font-semibold">{weeklyCompletedHabits}<span className="ml-2 text-sm font-normal text-muted">of {habits.length * 7}</span></p>
                  <p className="mt-2 text-xs text-muted">Across all your daily habits</p>
                </Card>
                <Card className="p-5">
                  <p className="text-sm text-muted">Best day this week</p>
                  <p className="mt-3 text-3xl font-semibold">{bestDayThisWeek.completed}/{bestDayThisWeek.total}</p>
                  <p className="mt-2 text-xs text-muted">{bestDayThisWeek.completed ? new Date(`${bestDayThisWeek.date}T12:00:00`).toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" }) : "Your next win can be today"}</p>
                </Card>
              </div>

              <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
                <Card className="p-5 sm:p-6">
                  <SectionTitle icon={Activity} title="Last 7 days" subtitle="Daily completion rate across your habits." />
                  <div className="flex h-44 items-end justify-between gap-2 sm:gap-4">
                    {last7Days.map((day) => (
                        <div key={day.date} className="flex h-full min-w-0 flex-1 flex-col items-center justify-end gap-2">
                          <span className="text-[10px] text-muted">{day.percentage}%</span>
                          <div className="flex h-28 w-full max-w-10 items-end overflow-hidden rounded-t-md bg-white/[0.04]">
                            <div title={`${day.date}: ${day.percentage}%`} className="w-full rounded-t-md bg-lime-300 transition-all duration-500" style={{ height: `${day.percentage}%`, minHeight: day.percentage > 0 ? "4px" : "0" }} />
                          </div>
                          <span className="text-[10px] text-muted">{day.label}</span>
                        </div>
                    ))}
                  </div>
                </Card>

                <Card className="p-5 sm:p-6">
                  <SectionTitle icon={Target} title="Habit performance" subtitle="How often each habit was completed in the last 7 days." />
                  {habitPerformance.length ? (
                      <div className="space-y-4">
                        {habitPerformance.map((habit) => (
                            <div key={habit.id}>
                              <div className="mb-2 flex items-center justify-between gap-3">
                                <span className="truncate text-sm text-gray-200">{habit.name}</span>
                                <span className="shrink-0 text-xs text-muted">{habit.completedDays}/7 · {habit.percentage}%</span>
                              </div>
                              <div className="h-2 overflow-hidden rounded-full bg-white/[0.06]">
                                <div className="h-full rounded-full bg-lime-300 transition-all duration-500" style={{ width: `${habit.percentage}%` }} />
                              </div>
                            </div>
                        ))}
                      </div>
                  ) : <p className="text-sm text-muted">Add a habit to start tracking performance.</p>}
                </Card>
              </div>
            </section>

            <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1.6fr)_minmax(300px,0.9fr)]">
              {/* Habits */}
              <div id="habits" className="scroll-mt-24 space-y-6">
                <Card className="p-5 sm:p-6">
                  <SectionTitle
                      icon={CheckCircle2}
                      title="Today's habits"
                      subtitle="Every checkmark is a promise kept."
                      right={
                        <button
                            onClick={() => setAddingHabit(!addingHabit)}
                            className="flex items-center gap-1.5 rounded-xl border border-white/10 px-3 py-2 text-xs font-medium text-gray-300 transition hover:border-lime-300/40 hover:text-lime-300"
                        >
                          <Plus size={15} />
                          <span className="hidden sm:inline">Add habit</span>
                        </button>
                      }
                  />

                  {addingHabit && (
                      <form
                          onSubmit={addHabit}
                          className="mb-4 flex gap-2"
                      >
                        <input
                            autoFocus
                            value={newHabit}
                            onChange={(event) => setNewHabit(event.target.value)}
                            placeholder="e.g. Practice Java for 30 min"
                            maxLength={60}
                            className="min-w-0 flex-1 rounded-xl border border-white/10 bg-black/20 px-3 py-2.5 text-sm outline-none placeholder:text-gray-600 focus:border-lime-300/50"
                        />
                        <button
                            type="submit"
                            className="rounded-xl bg-lime-300 px-4 text-sm font-semibold text-gray-950 hover:bg-lime-200"
                        >
                          Add
                        </button>
                      </form>
                  )}

                  <div className="mb-5 rounded-xl border border-white/[0.06] bg-black/10 p-4">
                    <div className="mb-3 flex items-center justify-between gap-3">
                      <div>
                        <p className="text-sm font-medium">Daily completion</p>
                        <p className="mt-1 text-xs text-muted">
                          {completedCount === habits.length && habits.length
                              ? "You showed up for yourself today."
                              : "Progress is progress, however small."}
                        </p>
                      </div>
                      <span className="text-xl font-semibold text-lime-300">
                      {percentage}%
                    </span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-white/[0.06]">
                      <div
                          className="h-full rounded-full bg-lime-300 transition-all duration-500"
                          style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    {habits.map((habit) => {
                      const Icon =
                          DEFAULT_HABITS.find((item) => item.id === habit.id)?.icon
                          || Target;
                      const done = Boolean(record.completed?.[habit.id]);

                      return (
                          <button
                              key={habit.id}
                              onClick={() => toggleHabit(habit.id)}
                              className={`group flex w-full items-center gap-3 rounded-xl border p-3.5 text-left transition sm:p-4 ${
                                  done
                                      ? "border-lime-300/20 bg-lime-300/[0.045]"
                                      : "border-white/[0.055] bg-white/[0.015] hover:border-white/[0.13] hover:bg-white/[0.035]"
                              }`}
                          >
                            <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                                done
                                    ? "bg-lime-300/10 text-lime-300"
                                    : "bg-white/[0.04] text-gray-400"
                            }`}>
                              <Icon size={19} />
                            </div>

                            <div className="min-w-0 flex-1">
                              <p className={`text-sm font-medium ${
                                  done ? "text-lime-100" : "text-gray-200"
                              }`}>
                                {habit.name}
                              </p>
                              <p className="mt-1 text-xs text-muted">
                                {habit.detail}
                              </p>
                            </div>

                            <div className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border transition ${
                                done
                                    ? "border-lime-300 bg-lime-300 text-gray-950"
                                    : "border-white/20 text-transparent group-hover:border-lime-300/50"
                            }`}>
                              <Check size={15} strokeWidth={3} />
                            </div>
                          </button>
                      );
                    })}
                  </div>

                  <p className="mt-4 text-center text-xs text-gray-600">
                    Your habits are saved automatically on this device.
                  </p>
                </Card>

                {/* Journal */}
                <Card id="journal" className="scroll-mt-24 p-5 sm:p-6">
                  <SectionTitle
                      icon={NotebookPen}
                      title="Daily reflection"
                      subtitle="A few honest lines can change your tomorrow."
                  />

                  <textarea
                      value={note}
                      onChange={(event) => {
                        const value = event.target.value;
                        setNote(value);
                        updateRecord({ note: value });
                      }}
                      placeholder="What did you accomplish today? What challenged you? What is one thing you'll do better tomorrow?"
                      rows={5}
                      maxLength={1500}
                      className="w-full rounded-xl border border-white/[0.08] bg-black/20 p-4 text-sm leading-6 text-gray-200 outline-none transition placeholder:text-gray-600 focus:border-lime-300/40"
                  />

                  <div className="mt-3 flex items-center justify-between gap-3">
                  <span className="text-xs text-muted">
                    {note.length}/1500 characters
                  </span>
                    <span className="flex items-center gap-1.5 text-xs text-lime-300">
                    <CheckCircle2 size={14} />
                    Auto-saved
                  </span>
                  </div>
                </Card>
              </div>

              {/* Right column */}
              <div className="space-y-6">
                {/* Streak engine */}
                <Card className="p-5 sm:p-6">
                  <SectionTitle
                      icon={Flame}
                      title="Consistency streak"
                      subtitle="Show up a little every day."
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-xl border border-orange-300/10 bg-orange-300/[0.05] p-4">
                      <div className="flex items-center gap-2 text-orange-300">
                        <Flame size={18} />
                        <span className="text-xs">Current streak</span>
                      </div>
                      <p className="mt-3 text-3xl font-semibold">{currentStreak} <span className="text-sm font-normal text-muted">days</span></p>
                    </div>
                    <div className="rounded-xl border border-lime-300/10 bg-lime-300/[0.05] p-4">
                      <div className="flex items-center gap-2 text-lime-300">
                        <Trophy size={18} />
                        <span className="text-xs">Best streak</span>
                      </div>
                      <p className="mt-3 text-3xl font-semibold">{bestStreak} <span className="text-sm font-normal text-muted">days</span></p>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center justify-between text-xs text-muted">
                    <span>Longest individual habit streak</span>
                    <span className="font-semibold text-gray-200">{longestHabitStreak} days</span>
                  </div>
                </Card>

                {/* Water */}
                <Card className="p-5 sm:p-6">
                  <SectionTitle
                      icon={Droplets}
                      title="Hydration"
                      subtitle="Small sips throughout the day."
                  />

                  <div className="flex items-center justify-between gap-3 rounded-xl border border-sky-400/10 bg-sky-400/[0.045] p-4">
                    <div>
                      <p className="text-3xl font-semibold">
                        {record.water || 0}
                        <span className="ml-1 text-sm font-normal text-muted">
                        / {waterGoal} glasses
                      </span>
                      </p>
                      <p className="mt-2 text-xs text-muted">
                        {Math.round(((record.water || 0) / waterGoal) * 100)}%
                        of your chosen goal
                      </p>
                    </div>
                    <div className="rounded-2xl bg-sky-400/10 p-3 text-sky-300">
                      <Droplets size={27} />
                    </div>
                  </div>

                  <div className="my-4 grid grid-cols-8 gap-1.5">
                    {Array.from({ length: waterGoal }, (_, index) => (
                        <button
                            key={index}
                            onClick={() =>
                                updateRecord({ water: index + 1 })
                            }
                            title={`Set water intake to ${index + 1} glasses`}
                            className={`flex aspect-square items-center justify-center rounded-lg transition ${
                                index < (record.water || 0)
                                    ? "bg-sky-400/20 text-sky-300"
                                    : "bg-white/[0.035] text-gray-600 hover:bg-white/[0.08]"
                            }`}
                        >
                          <Droplets size={16} />
                        </button>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    <button
                        onClick={() => changeWater(1)}
                        className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-sky-400 py-3 text-sm font-semibold text-gray-950 transition hover:bg-sky-300"
                    >
                      <Plus size={17} />
                      Add a glass
                    </button>
                    <button
                        onClick={() => changeWater(-1)}
                        disabled={!record.water}
                        className="rounded-xl border border-white/10 px-4 text-sm text-gray-300 hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-30"
                    >
                      −
                    </button>
                  </div>

                  <p className="mt-3 text-xs leading-5 text-muted">
                    One glass is a tracking unit. Adjust your goal to your needs.
                  </p>

                  <button
                      onClick={() =>
                          setWaterGoal((goal) => goal === 8 ? 10 : goal === 10 ? 6 : 8)
                      }
                      className="mt-2 text-xs text-sky-300 hover:text-sky-200"
                  >
                    Change goal ({waterGoal} glasses)
                  </button>
                </Card>

                {/* Daily challenge */}
                <Card className="relative overflow-hidden p-5 sm:p-6">
                  <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-lime-300/[0.06] blur-2xl" />
                  <div className="relative">
                    <div className="mb-4 flex items-center justify-between">
                      <div className="rounded-xl bg-lime-300/10 p-2.5 text-lime-300">
                        <Flame size={21} />
                      </div>
                      <span className="rounded-full border border-lime-300/15 bg-lime-300/[0.05] px-2.5 py-1 text-[10px] font-medium uppercase tracking-wider text-lime-300">
                      Daily reminder
                    </span>
                    </div>
                    <h3 className="text-lg font-semibold">The 1% rule</h3>
                    <p className="mt-2 text-sm leading-6 text-muted">
                      You don't have to transform your life in one day. Just
                      improve a little, and repeat tomorrow.
                    </p>
                    <div className="mt-5 flex items-center gap-2 text-xs text-lime-300">
                      <Sparkles size={15} />
                      Consistency beats intensity.
                    </div>
                  </div>
                </Card>

                {/* Progress placeholder */}
                <Card id="progress" className="scroll-mt-24 p-5 sm:p-6">
                  <SectionTitle
                      icon={Activity}
                      title="Today's snapshot"
                      subtitle="A quick look at your effort."
                  />

                  <div className="space-y-4">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="rounded-lg bg-lime-300/10 p-2 text-lime-300">
                          <CheckCircle2 size={17} />
                        </div>
                        <span className="text-sm text-gray-300">
                        Habits completed
                      </span>
                      </div>
                      <span className="text-sm font-semibold">
                      {completedCount}
                    </span>
                    </div>

                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="rounded-lg bg-sky-400/10 p-2 text-sky-300">
                          <Droplets size={17} />
                        </div>
                        <span className="text-sm text-gray-300">
                        Glasses recorded
                      </span>
                      </div>
                      <span className="text-sm font-semibold">
                      {record.water || 0}
                    </span>
                    </div>

                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="rounded-lg bg-violet-400/10 p-2 text-violet-300">
                          <NotebookPen size={17} />
                        </div>
                        <span className="text-sm text-gray-300">
                        Reflection
                      </span>
                      </div>
                      <span className={`text-xs font-medium ${
                          note.trim() ? "text-lime-300" : "text-gray-500"
                      }`}>
                      {note.trim() ? "Written" : "Not written"}
                    </span>
                    </div>
                  </div>

                  <div className="mt-5 rounded-xl bg-white/[0.025] p-3">
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-xs text-muted">Today's effort</span>
                      <span className="text-xs font-medium text-lime-300">
                      {percentage}%
                    </span>
                    </div>
                    <div className="h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
                      <div
                          className="h-full rounded-full bg-lime-300 transition-all duration-500"
                          style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                </Card>
              </div>
            </div>

            <footer className="mt-8 flex flex-col items-center justify-between gap-2 border-t border-white/[0.06] py-6 text-xs text-gray-600 sm:flex-row">
              <p>DAYBYDAY · Built one day at a time.</p>
              <p>Your journey. Your pace. Your progress.</p>
            </footer>
          </div>
        </main>

        {notice && (
            <div
                role="status"
                className="fixed bottom-5 right-5 z-[60] flex items-center gap-2 rounded-xl border border-lime-300/20 bg-[#171D16] px-4 py-3 text-sm text-lime-200 shadow-2xl"
            >
              <CheckCircle2 size={17} />
              {notice}
            </div>
        )}
      </div>
  );
}

export default App;