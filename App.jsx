import React, { useState, useMemo, useEffect } from "react";

/**
 * HopeLine MindCare — foundation build
 * -------------------------------------------------
 * This is a working front-end slice of the full platform brief:
 *   - Home (hero, categories, popular assessments, crisis banner, footer)
 *   - PHQ-9 assessment flow (intro -> questions -> scoring -> results)
 *   - Light/dark mode
 *   - EN/UR language toggle (RTL-aware) with a small string dictionary
 *
 * It is meant as the pattern every other assessment (GAD-7, PSS-10, etc.)
 * and page (dashboard, blog, therapist directory...) would follow, not
 * the complete production system — see the chat response for the phased
 * roadmap covering backend, auth, database, admin, and compliance work.
 */

// ---------- Design tokens (medical, calm: blue + green on white) ----------
const T = {
  light: {
    bg: "#FFFFFF",
    surface: "#F6F9F8",
    card: "#FFFFFF",
    border: "#E2E8E5",
    text: "#132A26",
    textMuted: "#5B6B67",
    blue: "#1D6FB8",
    blueDeep: "#124E85",
    green: "#1F9E6B",
    greenDeep: "#146B49",
    danger: "#C23A3A",
    dangerBg: "#FCEAEA",
  },
  dark: {
    bg: "#0B1615",
    surface: "#0F1E1C",
    card: "#12241F",
    border: "#22423B",
    text: "#EAF3F0",
    textMuted: "#9BB3AD",
    blue: "#5FA8E8",
    blueDeep: "#8FC2F0",
    green: "#4FCB94",
    greenDeep: "#7EDCB0",
    danger: "#F08A8A",
    dangerBg: "#2A1416",
  },
};

const STR = {
  en: {
    dir: "ltr",
    brand: "HopeLine MindCare",
    tagline: "Understand your mind. Take the first step, today.",
    heroSub:
      "Free, evidence-based self-assessments for depression, anxiety, stress and more — built with clinically validated questionnaires. Educational screening only, not a diagnosis.",
    searchPlaceholder: "Search assessments, e.g. \"anxiety\"",
    startBtn: "Start free assessment",
    browseBtn: "Browse all assessments",
    popular: "Popular assessments",
    categories: "Browse by category",
    disclaimerTitle: "Important: this is not a diagnosis",
    disclaimerBody:
      "HopeLine MindCare offers educational self-screening tools only. Results are not a medical or psychiatric diagnosis and do not replace an evaluation by a licensed clinician. If you're concerned about your mental health, please speak with a qualified professional.",
    emergencyTitle: "If you're in crisis, you're not alone",
    emergencyBody:
      "If you are thinking about suicide or self-harm, or you're worried about your immediate safety, please contact local emergency services or a crisis line right now, or reach out to someone you trust.",
    emergencyBtn: "Get emergency help",
    footer: "© 2026 HopeLine MindCare. Educational screening only — not a substitute for professional care.",
    minutes: "min",
    questions: "questions",
    take: "Take assessment",
    intro: "Introduction",
    who: "Who should take this",
    instructions: "Instructions",
    begin: "Begin assessment",
    back: "Back",
    next: "Next",
    submit: "See my results",
    progress: "Question",
    of: "of",
    yourResult: "Your result",
    severity: "Severity",
    recommendation: "What this means",
    retake: "Retake assessment",
    download: "Download PDF",
    email: "Email report",
    share: "Share",
    print: "Print report",
    home: "Home",
    assessments: "Assessments",
    dashboard: "Dashboard",
    library: "Library",
    therapists: "Find a therapist",
    lang: "اردو",
  },
  ur: {
    dir: "rtl",
    brand: "ہوپ لائن مائنڈ کیئر",
    tagline: "اپنے ذہن کو سمجھیں۔ آج پہلا قدم اٹھائیں۔",
    heroSub:
      "ڈپریشن، اضطراب، تناؤ اور دیگر کے لیے مفت، سائنسی بنیاد پر مبنی سیلف اسیسمنٹس — طبی طور پر تصدیق شدہ سوالناموں کے ساتھ۔ صرف تعلیمی اسکریننگ، تشخیص نہیں۔",
    searchPlaceholder: "اسیسمنٹ تلاش کریں، مثلاً \"اضطراب\"",
    startBtn: "مفت اسیسمنٹ شروع کریں",
    browseBtn: "تمام اسیسمنٹس دیکھیں",
    popular: "مقبول اسیسمنٹس",
    categories: "زمرے کے مطابق دیکھیں",
    disclaimerTitle: "اہم: یہ تشخیص نہیں ہے",
    disclaimerBody:
      "ہوپ لائن مائنڈ کیئر صرف تعلیمی سیلف اسکریننگ ٹولز فراہم کرتا ہے۔ نتائج طبی یا نفسیاتی تشخیص نہیں ہیں اور لائسنس یافتہ معالج کے معائنے کا متبادل نہیں۔ اگر آپ کو اپنی ذہنی صحت کی فکر ہے تو براہ کرم کسی مستند پیشہ ور سے بات کریں۔",
    emergencyTitle: "اگر آپ بحران میں ہیں تو آپ اکیلے نہیں ہیں",
    emergencyBody:
      "اگر آپ خودکشی یا خود کو نقصان پہنچانے کے بارے میں سوچ رہے ہیں، یا اپنی فوری حفاظت سے پریشان ہیں، تو براہ کرم ابھی مقامی ایمرجنسی سروسز یا کرائسس لائن سے رابطہ کریں، یا کسی قابلِ اعتماد شخص سے بات کریں۔",
    emergencyBtn: "ایمرجنسی مدد حاصل کریں",
    footer: "© 2026 ہوپ لائن مائنڈ کیئر۔ صرف تعلیمی اسکریننگ — پیشہ ورانہ نگہداشت کا متبادل نہیں۔",
    minutes: "منٹ",
    questions: "سوالات",
    take: "اسیسمنٹ لیں",
    intro: "تعارف",
    who: "کسے یہ لینا چاہیے",
    instructions: "ہدایات",
    begin: "اسیسمنٹ شروع کریں",
    back: "پیچھے",
    next: "اگلا",
    submit: "میرے نتائج دیکھیں",
    progress: "سوال",
    of: "از",
    yourResult: "آپ کا نتیجہ",
    severity: "شدت",
    recommendation: "اس کا مطلب",
    retake: "دوبارہ لیں",
    download: "پی ڈی ایف ڈاؤن لوڈ کریں",
    email: "ای میل رپورٹ",
    share: "شیئر کریں",
    print: "پرنٹ رپورٹ",
    home: "ہوم",
    assessments: "اسیسمنٹس",
    dashboard: "ڈیش بورڈ",
    library: "لائبریری",
    therapists: "معالج تلاش کریں",
    lang: "English",
  },
};

// ---------- Assessment catalog (subset) ----------
const CATALOG = [
  { id: "phq9", name: "PHQ-9 Depression", short: "Depression", minutes: 3, qCount: 9, icon: "cloud" },
  { id: "gad7", name: "GAD-7 Anxiety", short: "Anxiety", minutes: 2, qCount: 7, icon: "wave" },
  { id: "pss10", name: "PSS-10 Stress", short: "Stress", minutes: 3, qCount: 10, icon: "bolt" },
  { id: "who5", name: "WHO-5 Well-Being", short: "Well-being", minutes: 2, qCount: 5, icon: "sun" },
  { id: "isi", name: "Insomnia Severity Index", short: "Sleep", minutes: 3, qCount: 7, icon: "moon" },
  { id: "burnout", name: "Burnout Assessment", short: "Burnout", minutes: 4, qCount: 12, icon: "flame" },
];

const CATEGORIES = [
  "Mood & Depression",
  "Anxiety & Panic",
  "Stress & Burnout",
  "Sleep",
  "Trauma & PTSD",
  "Relationships & Family",
];

// PHQ-9 real item set (public domain instrument)
const PHQ9_QUESTIONS = [
  "Little interest or pleasure in doing things",
  "Feeling down, depressed, or hopeless",
  "Trouble falling or staying asleep, or sleeping too much",
  "Feeling tired or having little energy",
  "Poor appetite or overeating",
  "Feeling bad about yourself — or that you are a failure, or have let yourself or your family down",
  "Trouble concentrating on things, such as reading or watching television",
  "Moving or speaking so slowly that other people could have noticed, or the opposite — being so fidgety or restless that you have been moving around a lot more than usual",
  "Thoughts that you would be better off dead, or of hurting yourself in some way",
];

const PHQ9_OPTIONS = [
  { v: 0, label: "Not at all" },
  { v: 1, label: "Several days" },
  { v: 2, label: "More than half the days" },
  { v: 3, label: "Nearly every day" },
];

function phq9Severity(score) {
  if (score <= 4) return { level: "Minimal", color: "green", note: "Your responses suggest minimal or no symptoms of depression right now." };
  if (score <= 9) return { level: "Mild", color: "green", note: "Your responses suggest mild symptoms. Keep an eye on how you're feeling, and consider lifestyle steps like sleep, movement, and connection." };
  if (score <= 14) return { level: "Moderate", color: "amber", note: "Your responses suggest moderate symptoms. Speaking with a doctor or licensed mental health professional is a reasonable next step." };
  if (score <= 19) return { level: "Moderately severe", color: "amber", note: "Your responses suggest moderately severe symptoms. We'd encourage you to reach out to a licensed mental health professional soon." };
  return { level: "Severe", color: "red", note: "Your responses suggest severe symptoms. Please consider reaching out to a licensed mental health professional as soon as possible." };
}

// ---------- Icons (inline, no deps) ----------
function Icon({ name, size = 22, color }) {
  const s = { width: size, height: size, stroke: color || "currentColor", fill: "none", strokeWidth: 1.8, strokeLinecap: "round", strokeLinejoin: "round" };
  switch (name) {
    case "cloud": return <svg viewBox="0 0 24 24" style={s}><path d="M6 18a4 4 0 010-8 5 5 0 019.6-1.5A4.5 4.5 0 0118 18H6z" /></svg>;
    case "wave": return <svg viewBox="0 0 24 24" style={s}><path d="M2 12c2-4 4 4 6 0s4 4 6 0 4 4 6 0" /></svg>;
    case "bolt": return <svg viewBox="0 0 24 24" style={s}><path d="M13 2L4 14h6l-1 8 9-12h-6l1-8z" /></svg>;
    case "sun": return <svg viewBox="0 0 24 24" style={s}><circle cx="12" cy="12" r="4" /><path d="M12 2v3M12 19v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M2 12h3M19 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1" /></svg>;
    case "moon": return <svg viewBox="0 0 24 24" style={s}><path d="M21 12.5A9 9 0 1111.5 3a7 7 0 009.5 9.5z" /></svg>;
    case "flame": return <svg viewBox="0 0 24 24" style={s}><path d="M12 2s5 4.5 5 9.5a5 5 0 01-10 0C7 8 9 6 9 6s0 2 1 2c1.5 0 0-3.5 2-6z" /></svg>;
    case "search": return <svg viewBox="0 0 24 24" style={s}><circle cx="11" cy="11" r="7" /><path d="M21 21l-4.3-4.3" /></svg>;
    case "moonToggle": return <svg viewBox="0 0 24 24" style={s}><path d="M21 12.5A9 9 0 1111.5 3a7 7 0 009.5 9.5z" /></svg>;
    case "sunToggle": return <svg viewBox="0 0 24 24" style={s}><circle cx="12" cy="12" r="4" /><path d="M12 2v3M12 19v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M2 12h3M19 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1" /></svg>;
    case "alert": return <svg viewBox="0 0 24 24" style={s}><path d="M12 3l10 18H2L12 3z" /><path d="M12 10v4M12 17h.01" /></svg>;
    case "check": return <svg viewBox="0 0 24 24" style={s}><path d="M20 6L9 17l-5-5" /></svg>;
    case "download": return <svg viewBox="0 0 24 24" style={s}><path d="M12 3v12M7 10l5 5 5-5M4 21h16" /></svg>;
    case "mail": return <svg viewBox="0 0 24 24" style={s}><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3 7l9 6 9-6" /></svg>;
    case "share": return <svg viewBox="0 0 24 24" style={s}><circle cx="18" cy="5" r="2.5" /><circle cx="6" cy="12" r="2.5" /><circle cx="18" cy="19" r="2.5" /><path d="M8.3 10.7l7.4-4.4M8.3 13.3l7.4 4.4" /></svg>;
    case "print": return <svg viewBox="0 0 24 24" style={s}><path d="M6 9V3h12v6M6 18H4a1 1 0 01-1-1v-5a1 1 0 011-1h16a1 1 0 011 1v5a1 1 0 01-1 1h-2M6 14h12v7H6z" /></svg>;
    default: return null;
  }
}

// ---------- Small building blocks ----------
function Btn({ children, onClick, variant = "primary", theme, style, ...rest }) {
  const base = {
    display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8,
    padding: "12px 22px", borderRadius: 999, fontSize: 15, fontWeight: 600,
    cursor: "pointer", border: "1.5px solid transparent", transition: "transform .12s ease, opacity .12s ease",
  };
  const variants = {
    primary: { background: `linear-gradient(90deg, ${theme.blue}, ${theme.green})`, color: "#fff" },
    outline: { background: "transparent", borderColor: theme.border, color: theme.text },
    danger: { background: theme.danger, color: "#fff" },
    ghost: { background: theme.surface, color: theme.text },
  };
  return (
    <button
      onClick={onClick}
      style={{ ...base, ...variants[variant], ...style }}
      onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.97)")}
      onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
      {...rest}
    >
      {children}
    </button>
  );
}

function Card({ children, theme, style }) {
  return (
    <div style={{ background: theme.card, border: `1px solid ${theme.border}`, borderRadius: 18, padding: 22, ...style }}>
      {children}
    </div>
  );
}

// ---------- Header ----------
function Header({ theme, dark, setDark, lang, setLang, t, onNav }) {
  return (
    <header style={{ position: "sticky", top: 0, zIndex: 20, background: theme.bg + "F2", backdropFilter: "blur(8px)", borderBottom: `1px solid ${theme.border}` }}>
      <div style={{ maxWidth: 1120, margin: "0 auto", padding: "14px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }} onClick={() => onNav("home")}>
          <div style={{ width: 34, height: 34, borderRadius: 10, background: `linear-gradient(135deg, ${theme.blue}, ${theme.green})`, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#fff" strokeWidth="2"><path d="M12 21s-7-4.5-9.5-9C.5 8 2 4 6 4c2 0 3.5 1.2 4 2 .5-.8 2-2 4-2 4 0 5.5 4 3.5 8-2.5 4.5-9.5 9-9.5 9z" /></svg>
          </div>
          <span style={{ fontWeight: 700, fontSize: 18, color: theme.text }}>{t.brand}</span>
        </div>
        <nav style={{ display: "flex", gap: 22, fontSize: 14.5, color: theme.textMuted }}>
          {[["home", t.home], ["assessments", t.assessments], ["dashboard", t.dashboard], ["library", t.library], ["therapists", t.therapists]].map(([k, label]) => (
            <span key={k} onClick={() => onNav(k)} style={{ cursor: "pointer" }}>{label}</span>
          ))}
        </nav>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <button aria-label="Toggle language" onClick={() => setLang(lang === "en" ? "ur" : "en")} style={{ border: `1px solid ${theme.border}`, background: theme.surface, color: theme.text, borderRadius: 999, padding: "8px 14px", fontSize: 13, cursor: "pointer" }}>{t.lang}</button>
          <button aria-label="Toggle dark mode" onClick={() => setDark(!dark)} style={{ border: `1px solid ${theme.border}`, background: theme.surface, color: theme.text, borderRadius: 999, width: 38, height: 38, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
            <Icon name={dark ? "sunToggle" : "moonToggle"} size={17} />
          </button>
        </div>
      </div>
    </header>
  );
}

// ---------- Emergency banner (always visible) ----------
function EmergencyBanner({ theme, t, onOpen }) {
  return (
    <div style={{ background: theme.dangerBg, borderBottom: `1px solid ${theme.danger}55` }}>
      <div style={{ maxWidth: 1120, margin: "0 auto", padding: "10px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, color: theme.danger, fontSize: 13.5 }}>
          <Icon name="alert" size={17} />
          <span>{t.emergencyTitle}</span>
        </div>
        <button onClick={onOpen} style={{ background: theme.danger, color: "#fff", border: "none", borderRadius: 999, padding: "6px 16px", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>{t.emergencyBtn}</button>
      </div>
    </div>
  );
}

function EmergencyModal({ theme, t, onClose }) {
  return (
    <div style={{ position: "fixed", inset: 0, background: "#00000088", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }} onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} style={{ background: theme.card, borderRadius: 18, maxWidth: 460, width: "100%", padding: 26, border: `1px solid ${theme.border}` }}>
        <div style={{ display: "flex", gap: 12, alignItems: "flex-start", marginBottom: 14 }}>
          <div style={{ color: theme.danger }}><Icon name="alert" size={26} /></div>
          <div>
            <h3 style={{ margin: 0, color: theme.text, fontSize: 18 }}>{t.emergencyTitle}</h3>
          </div>
        </div>
        <p style={{ color: theme.textMuted, fontSize: 14.5, lineHeight: 1.7 }}>{t.emergencyBody}</p>
        <ul style={{ color: theme.text, fontSize: 14.5, lineHeight: 2, paddingInlineStart: 18 }}>
          <li>US: call or text 988 (Suicide & Crisis Lifeline)</li>
          <li>UK &amp; ROI: Samaritans, 116 123</li>
          <li>Elsewhere: contact your local emergency number or nearest hospital</li>
        </ul>
        <Btn theme={theme} variant="danger" onClick={onClose} style={{ width: "100%", marginTop: 8 }}>Close</Btn>
      </div>
    </div>
  );
}

// ---------- Home page ----------
function Home({ theme, t, lang, onStart, onBrowse }) {
  return (
    <>
      <section style={{ maxWidth: 1120, margin: "0 auto", padding: "64px 24px 40px", textAlign: "center" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: theme.surface, border: `1px solid ${theme.border}`, borderRadius: 999, padding: "6px 14px", fontSize: 12.5, color: theme.textMuted, marginBottom: 22 }}>
          <Icon name="check" size={14} color={theme.green} /> Evidence-based · Free · Private
        </div>
        <h1 style={{ fontSize: "clamp(30px, 5vw, 48px)", fontWeight: 700, color: theme.text, margin: "0 0 16px", lineHeight: 1.15 }}>{t.tagline}</h1>
        <p style={{ maxWidth: 640, margin: "0 auto 30px", color: theme.textMuted, fontSize: 16.5, lineHeight: 1.7 }}>{t.heroSub}</p>
        <div style={{ display: "flex", gap: 10, justifyContent: "center", maxWidth: 520, margin: "0 auto 18px" }}>
          <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 8, background: theme.card, border: `1px solid ${theme.border}`, borderRadius: 999, padding: "10px 16px" }}>
            <Icon name="search" size={17} color={theme.textMuted} />
            <input placeholder={t.searchPlaceholder} style={{ border: "none", outline: "none", background: "transparent", color: theme.text, fontSize: 14.5, width: "100%" }} />
          </div>
        </div>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <Btn theme={theme} onClick={onStart}>{t.startBtn}</Btn>
          <Btn theme={theme} variant="outline" onClick={onBrowse}>{t.browseBtn}</Btn>
        </div>
      </section>

      <section style={{ maxWidth: 1120, margin: "0 auto", padding: "20px 24px 60px" }}>
        <h2 style={{ color: theme.text, fontSize: 22, fontWeight: 700, marginBottom: 18 }}>{t.popular}</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))", gap: 16 }}>
          {CATALOG.map((a) => (
            <Card key={a.id} theme={theme} style={{ cursor: "pointer" }}>
              <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                <div style={{ width: 42, height: 42, borderRadius: 12, background: theme.surface, display: "flex", alignItems: "center", justifyContent: "center", color: theme.blue, flexShrink: 0 }}>
                  <Icon name={a.icon} size={21} />
                </div>
                <div>
                  <div style={{ fontWeight: 600, color: theme.text, fontSize: 15.5 }}>{a.name}</div>
                  <div style={{ color: theme.textMuted, fontSize: 13, marginTop: 4 }}>{a.qCount} {t.questions} · {a.minutes} {t.minutes}</div>
                </div>
              </div>
              <Btn theme={theme} variant="ghost" onClick={a.id === "phq9" ? onStart : undefined} style={{ width: "100%", marginTop: 16, fontSize: 13.5, padding: "9px 16px" }}>{t.take}</Btn>
            </Card>
          ))}
        </div>
      </section>

      <section style={{ maxWidth: 1120, margin: "0 auto", padding: "0 24px 60px" }}>
        <h2 style={{ color: theme.text, fontSize: 22, fontWeight: 700, marginBottom: 18 }}>{t.categories}</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 14 }}>
          {CATEGORIES.map((c) => (
            <div key={c} style={{ background: theme.surface, border: `1px solid ${theme.border}`, borderRadius: 14, padding: "16px 18px", color: theme.text, fontSize: 14.5, fontWeight: 500 }}>{c}</div>
          ))}
        </div>
      </section>

      <section style={{ maxWidth: 1120, margin: "0 auto", padding: "0 24px 70px" }}>
        <Card theme={theme} style={{ borderColor: theme.blue + "55" }}>
          <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
            <div style={{ color: theme.blue, flexShrink: 0 }}><Icon name="alert" size={22} /></div>
            <div>
              <div style={{ fontWeight: 700, color: theme.text, marginBottom: 6 }}>{t.disclaimerTitle}</div>
              <div style={{ color: theme.textMuted, fontSize: 14, lineHeight: 1.7 }}>{t.disclaimerBody}</div>
            </div>
          </div>
        </Card>
      </section>
    </>
  );
}

// ---------- PHQ-9 assessment flow ----------
function Assessment({ theme, t, onExit }) {
  const [stage, setStage] = useState("intro"); // intro | q | result
  const [qi, setQi] = useState(0);
  const [answers, setAnswers] = useState(Array(PHQ9_QUESTIONS.length).fill(null));

  const score = useMemo(() => answers.reduce((s, v) => s + (v ?? 0), 0), [answers]);
  const sev = phq9Severity(score);
  const riskFlag = (answers[8] ?? 0) > 0; // item 9 = self-harm ideation

  const sevColor = { green: theme.green, amber: "#C98A1F", red: theme.danger }[sev.color];

  function select(v) {
    const next = [...answers];
    next[qi] = v;
    setAnswers(next);
  }

  return (
    <div style={{ maxWidth: 720, margin: "0 auto", padding: "44px 24px 80px" }}>
      <button onClick={onExit} style={{ background: "none", border: "none", color: theme.textMuted, fontSize: 13.5, cursor: "pointer", marginBottom: 18 }}>← {t.home}</button>

      {stage === "intro" && (
        <Card theme={theme}>
          <h1 style={{ color: theme.text, fontSize: 24, marginTop: 0 }}>PHQ-9 — Patient Health Questionnaire</h1>
          <p style={{ color: theme.textMuted, fontSize: 14, lineHeight: 1.7 }}>
            <strong style={{ color: theme.text }}>{t.intro}: </strong>
            A 9-item, widely used screening tool for the presence and severity of depression symptoms over the last two weeks.
          </p>
          <p style={{ color: theme.textMuted, fontSize: 14, lineHeight: 1.7 }}>
            <strong style={{ color: theme.text }}>{t.who}: </strong>
            Adults who want to check in on their mood and everyday functioning. Not a substitute for a clinical evaluation.
          </p>
          <p style={{ color: theme.textMuted, fontSize: 14, lineHeight: 1.7 }}>
            <strong style={{ color: theme.text }}>{t.instructions}: </strong>
            Answer how often each has bothered you over the past two weeks. There are no right or wrong answers.
          </p>
          <Btn theme={theme} onClick={() => setStage("q")} style={{ marginTop: 10 }}>{t.begin}</Btn>
        </Card>
      )}

      {stage === "q" && (
        <Card theme={theme}>
          <div style={{ marginBottom: 18 }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12.5, color: theme.textMuted, marginBottom: 6 }}>
              <span>{t.progress} {qi + 1} {t.of} {PHQ9_QUESTIONS.length}</span>
              <span>{Math.round(((qi + 1) / PHQ9_QUESTIONS.length) * 100)}%</span>
            </div>
            <div style={{ height: 6, background: theme.surface, borderRadius: 999, overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${((qi + 1) / PHQ9_QUESTIONS.length) * 100}%`, background: `linear-gradient(90deg, ${theme.blue}, ${theme.green})`, transition: "width .25s ease" }} />
            </div>
          </div>

          <h2 style={{ color: theme.text, fontSize: 18.5, fontWeight: 600, lineHeight: 1.5 }}>{PHQ9_QUESTIONS[qi]}</h2>

          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 18 }}>
            {PHQ9_OPTIONS.map((opt) => {
              const active = answers[qi] === opt.v;
              return (
                <label key={opt.v} style={{ display: "flex", alignItems: "center", gap: 12, padding: "13px 16px", borderRadius: 12, border: `1.5px solid ${active ? theme.blue : theme.border}`, background: active ? theme.blue + "14" : "transparent", cursor: "pointer" }}>
                  <input type="radio" name={`q${qi}`} checked={active} onChange={() => select(opt.v)} style={{ accentColor: theme.blue, width: 17, height: 17 }} />
                  <span style={{ color: theme.text, fontSize: 14.5 }}>{opt.label}</span>
                </label>
              );
            })}
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 26 }}>
            <Btn theme={theme} variant="outline" onClick={() => (qi === 0 ? setStage("intro") : setQi(qi - 1))}>{t.back}</Btn>
            <Btn
              theme={theme}
              disabled={answers[qi] === null}
              onClick={() => (qi === PHQ9_QUESTIONS.length - 1 ? setStage("result") : setQi(qi + 1))}
              style={{ opacity: answers[qi] === null ? 0.5 : 1, pointerEvents: answers[qi] === null ? "none" : "auto" }}
            >
              {qi === PHQ9_QUESTIONS.length - 1 ? t.submit : t.next}
            </Btn>
          </div>
        </Card>
      )}

      {stage === "result" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {riskFlag && (
            <Card theme={theme} style={{ borderColor: theme.danger, background: theme.dangerBg }}>
              <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                <div style={{ color: theme.danger, flexShrink: 0 }}><Icon name="alert" size={22} /></div>
                <div style={{ color: theme.text, fontSize: 14, lineHeight: 1.7 }}>{t.emergencyBody}</div>
              </div>
            </Card>
          )}

          <Card theme={theme}>
            <div style={{ textAlign: "center", padding: "10px 0 6px" }}>
              <div style={{ color: theme.textMuted, fontSize: 13, marginBottom: 4 }}>{t.yourResult}</div>
              <div style={{ fontSize: 46, fontWeight: 700, color: theme.text }}>{score}<span style={{ fontSize: 18, color: theme.textMuted, fontWeight: 500 }}> / 27</span></div>
              <div style={{ display: "inline-block", marginTop: 10, padding: "6px 16px", borderRadius: 999, background: sevColor + "22", color: sevColor, fontWeight: 600, fontSize: 13.5 }}>
                {t.severity}: {sev.level}
              </div>
            </div>
            <div style={{ borderTop: `1px solid ${theme.border}`, marginTop: 18, paddingTop: 16 }}>
              <div style={{ fontWeight: 600, color: theme.text, marginBottom: 6 }}>{t.recommendation}</div>
              <p style={{ color: theme.textMuted, fontSize: 14, lineHeight: 1.7, margin: 0 }}>{sev.note}</p>
            </div>
            <div style={{ borderTop: `1px solid ${theme.border}`, marginTop: 16, paddingTop: 14, fontSize: 12.5, color: theme.textMuted, lineHeight: 1.6 }}>
              This screening tool does not provide a medical diagnosis. Please discuss these results with a licensed healthcare provider.
            </div>
          </Card>

          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <Btn theme={theme} variant="outline" style={{ flex: 1 }}><Icon name="download" size={16} />{t.download}</Btn>
            <Btn theme={theme} variant="outline" style={{ flex: 1 }}><Icon name="mail" size={16} />{t.email}</Btn>
            <Btn theme={theme} variant="outline" style={{ flex: 1 }}><Icon name="share" size={16} />{t.share}</Btn>
            <Btn theme={theme} variant="outline" style={{ flex: 1 }}><Icon name="print" size={16} />{t.print}</Btn>
          </div>
          <Btn theme={theme} onClick={() => { setStage("intro"); setQi(0); setAnswers(Array(PHQ9_QUESTIONS.length).fill(null)); }}>{t.retake}</Btn>
        </div>
      )}
    </div>
  );
}

// ---------- Footer ----------
function Footer({ theme, t }) {
  return (
    <footer style={{ borderTop: `1px solid ${theme.border}`, marginTop: 40, padding: "30px 24px", textAlign: "center", color: theme.textMuted, fontSize: 12.5 }}>
      {t.footer}
    </footer>
  );
}

// ---------- App ----------
export default function App() {
  const [dark, setDark] = useState(false);
  const [lang, setLang] = useState("en");
  const [page, setPage] = useState("home");
  const [emergencyOpen, setEmergencyOpen] = useState(false);

  const theme = dark ? T.dark : T.light;
  const t = STR[lang];

  useEffect(() => {
    document.documentElement.dir = t.dir;
  }, [lang]);

  function onNav(key) {
    if (key === "assessments") setPage("home");
    else if (["dashboard", "library", "therapists"].includes(key)) setPage("home");
    else setPage(key);
  }

  return (
    <div dir={t.dir} style={{ minHeight: "100vh", background: theme.bg, fontFamily: "'Inter', system-ui, -apple-system, sans-serif", transition: "background .2s ease" }}>
      <EmergencyBanner theme={theme} t={t} onOpen={() => setEmergencyOpen(true)} />
      <Header theme={theme} dark={dark} setDark={setDark} lang={lang} setLang={setLang} t={t} onNav={onNav} />

      {page === "home" && <Home theme={theme} t={t} lang={lang} onStart={() => setPage("assessment")} onBrowse={() => setPage("home")} />}
      {page === "assessment" && <Assessment theme={theme} t={t} onExit={() => setPage("home")} />}

      <Footer theme={theme} t={t} />
      {emergencyOpen && <EmergencyModal theme={theme} t={t} onClose={() => setEmergencyOpen(false)} />}
    </div>
  );
}
