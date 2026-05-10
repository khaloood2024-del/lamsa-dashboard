import { useState, useEffect, useCallback } from "react";

const API_URL = "https://lamsa-salon-server-production.up.railway.app";

const SERVICES = [
  { id:1, name:"باديكير وميديكير", duration:45,  price:80,  icon:"💅", color:"#C44870" },
  { id:2, name:"تلوين شعر",        duration:90,  price:250, icon:"🎨", color:"#9058B0" },
  { id:3, name:"قص وتصفيف",        duration:60,  price:150, icon:"✂️", color:"#3A8AB0" },
  { id:4, name:"علاج بالأوزون",    duration:60,  price:200, icon:"🌿", color:"#3A8A60" },
  { id:5, name:"مساج استرخاء",     duration:60,  price:180, icon:"🪷", color:"#B04870" },
  { id:6, name:"تنظيف بشرة",       duration:75,  price:220, icon:"✨", color:"#C8A050" },
  { id:7, name:"عروس كاملة",       duration:240, price:800, icon:"👰", color:"#7858B0" },
];

// ─── DESIGN TOKENS ────────────────────────────────────────────────────
const T = {
  bg:        "#F7F3F5",
  bgDeep:    "#F0EAEe",
  surface:   "#FFFFFF",
  sidebarBg: "#1C0F18",
  rose:      "#C44870",
  roseDark:  "#9A3458",
  roseLight: "#FAE8EF",
  roseMid:   "#E0A0B8",
  blush:     "#FDF2F6",
  border:    "#EAD5E2",
  borderSoft:"#F2E4EC",
  text:      "#1A0E15",
  textSoft:  "#6A3550",
  muted:     "#A070888",
  mutedClr:  "#A07088",
  green:     "#2E7A52",
  red:       "#B83A50",
  amber:     "#B07828",
  purple:    "#7048A8",
  gold:      "#C8A050",
  goldLight: "#F9F0DC",
};

const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Noto+Naskh+Arabic:wght@400;500;600;700&family=Playfair+Display:wght@400;600;700&family=Inter:wght@400;500;600&display=swap');
  *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }
  body { background:${T.bg}; }
  ::-webkit-scrollbar { width:4px; height:4px; }
  ::-webkit-scrollbar-track { background:transparent; }
  ::-webkit-scrollbar-thumb { background:${T.roseMid}; border-radius:4px; }

  @keyframes fadeUp   { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
  @keyframes fadeIn   { from{opacity:0} to{opacity:1} }
  @keyframes shimmer  { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
  @keyframes pulse    { 0%,100%{opacity:.4} 50%{opacity:1} }
  @keyframes shake    { 0%,100%{transform:translateX(0)} 25%{transform:translateX(-8px)} 75%{transform:translateX(8px)} }
  @keyframes float    { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-5px)} }
  @keyframes spin     { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
  @keyframes slideIn  { from{transform:translateX(20px);opacity:0} to{transform:translateX(0);opacity:1} }
  @keyframes scaleIn  { from{transform:scale(.95);opacity:0} to{transform:scale(1);opacity:1} }

  .fade-up   { animation:fadeUp  0.45s cubic-bezier(.22,.68,0,1.1) both; }
  .fade-in   { animation:fadeIn  0.25s ease both; }
  .scale-in  { animation:scaleIn 0.3s cubic-bezier(.22,.68,0,1.15) both; }

  .btn-primary { transition:all 0.2s ease; }
  .btn-primary:hover:not(:disabled) { transform:translateY(-2px); box-shadow:0 8px 24px ${T.rose}45 !important; }
  .btn-primary:active:not(:disabled) { transform:translateY(0); }

  .btn-ghost { transition:all 0.2s ease; }
  .btn-ghost:hover { background:${T.blush} !important; border-color:${T.roseMid} !important; }

  .row-hover { transition:background 0.12s; cursor:default; }
  .row-hover:hover { background:${T.blush} !important; }

  .card-hover { transition:all 0.25s ease; }
  .card-hover:hover { transform:translateY(-4px); box-shadow:0 16px 40px ${T.rose}15 !important; }

  .nav-item { transition:all 0.18s ease; border:none; cursor:pointer; }
  .nav-item:hover { background:rgba(255,255,255,0.07) !important; }
  .nav-item-active { background:rgba(196,72,112,0.15) !important; }

  .sidebar-link { transition:all 0.18s ease; }

  input, select, button, textarea { font-family:'Noto Naskh Arabic',serif; }

  .stat-bar { transition:width 1.2s cubic-bezier(.22,.68,0,1.05); }
`;

// ─── ICONS ────────────────────────────────────────────────────────────
const Icon = ({ d, size=16, color="currentColor", sw=1.5 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
    <path d={d}/>
  </svg>
);
const IC = {
  grid:    "M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z",
  cal:     "M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z",
  cut:     "M6 3a3 3 0 1 0 0 6 3 3 0 0 0 0-6zM6 15a3 3 0 1 0 0 6 3 3 0 0 0 0-6zM20 4 8.12 15.88M14.47 14.48 20 20M8.12 8.12 12 12",
  ok:      "M20 6 9 17 4 12",
  clock:   "M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2zM12 6v6l4 2",
  bell:    "M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0",
  trend:   "M22 7 13.5 15.5l-5-5L2 17M22 7h-5M22 7v5",
  dl:      "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3",
  lock:    "M19 11H5a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2zM7 11V7a5 5 0 0 1 10 0v4",
  shield:  "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",
  out:     "M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9",
  search:  "M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z",
  phone:   "M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13.6a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 3h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 10.6a16 16 0 0 0 6 6l.94-.94a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 17z",
  warn:    "M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0zM12 9v4M12 17h.01",
  refresh: "M23 4v6h-6M1 20v-6h6M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15",
  plus:    "M12 5v14M5 12h14",
  edit:    "M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z",
  trash:   "M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2",
  eye:     "M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8zM12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z",
  eyeoff:  "M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24M1 1l22 22",
  heart:   "M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z",
  star:    "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z",
  sparkle: "M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3z",
  award:   "M12 15a7 7 0 1 0 0-14 7 7 0 0 0 0 14zM8.21 13.89 7 23l5-3 5 3-1.21-9.12",
};

// ─── HELPERS ─────────────────────────────────────────────────────────
const Avatar = ({ name, role, size=36 }) => {
  const bg = role==="admin"
    ? `linear-gradient(135deg,${T.purple},#5838A0)`
    : `linear-gradient(135deg,${T.rose},${T.roseDark})`;
  return (
    <div style={{ width:size, height:size, borderRadius:"50%", background:bg, flexShrink:0,
      display:"flex", alignItems:"center", justifyContent:"center",
      fontSize:size*0.38, fontWeight:700, color:"#fff",
      boxShadow:`0 2px 10px ${role==="admin"?T.purple:T.rose}50`,
      letterSpacing:0 }}>
      {name?.[0] || "م"}
    </div>
  );
};

const Chip = ({ label, type="default" }) => {
  const map = {
    confirmed: { bg:"#EBF7F1", color:T.green,  border:"#B0DCC4", dot:"#2E7A52" },
    pending:   { bg:"#FEF5E6", color:T.amber,  border:"#EDD090", dot:"#B07828" },
    cancelled: { bg:"#FDEEED", color:T.red,    border:"#EFBBC0", dot:"#B83A50" },
    admin:     { bg:"#F0EAFA", color:T.purple, border:"#CEBCE8", dot:"#7048A8" },
    staff:     { bg:T.roseLight, color:T.rose, border:T.roseMid, dot:T.rose    },
    default:   { bg:T.blush,  color:T.textSoft,border:T.border,  dot:T.mutedClr},
  };
  const s = map[type]||map.default;
  return (
    <span style={{ background:s.bg, color:s.color, border:`1px solid ${s.border}`,
      fontSize:11, padding:"3px 10px 3px 8px", borderRadius:20, fontWeight:600,
      whiteSpace:"nowrap", display:"inline-flex", alignItems:"center", gap:5 }}>
      <span style={{ width:5, height:5, borderRadius:"50%", background:s.dot, flexShrink:0 }}/>
      {label}
    </span>
  );
};

const StatCard = ({ label, value, sub, icon, color, delay=0 }) => (
  <div className="card-hover fade-up" style={{ animationDelay:`${delay}s`,
    background:T.surface, borderRadius:20,
    border:`1px solid ${T.borderSoft}`,
    padding:"0",
    boxShadow:`0 1px 8px rgba(0,0,0,0.06)`,
    overflow:"hidden", position:"relative" }}>
    <div style={{ height:3, background:`linear-gradient(90deg,${color},${color}80)` }}/>
    <div style={{ padding:"20px 20px 18px" }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
        <div style={{ flex:1 }}>
          <div style={{ color:T.mutedClr, fontSize:11, marginBottom:10, fontWeight:600,
            textTransform:"uppercase", letterSpacing:0.8 }}>{label}</div>
          <div style={{ color:T.text, fontSize:30, fontWeight:700, lineHeight:1,
            fontFamily:"'Playfair Display',serif" }}>{value}</div>
          {sub && <div style={{ color, fontSize:11, marginTop:7, fontWeight:600 }}>{sub}</div>}
        </div>
        <div style={{ width:46, height:46, borderRadius:14,
          background:`linear-gradient(145deg,${color}18,${color}08)`,
          border:`1.5px solid ${color}22`,
          display:"flex", alignItems:"center", justifyContent:"center",
          flexShrink:0 }}>
          <Icon d={icon} color={color} size={19} sw={1.75}/>
        </div>
      </div>
    </div>
  </div>
);

// ─── MODAL WRAPPER ────────────────────────────────────────────────────
const Modal = ({ title, onClose, children, width=390 }) => (
  <div className="fade-in" style={{ position:"fixed", inset:0,
    background:"rgba(26,14,21,0.5)", display:"flex",
    alignItems:"center", justifyContent:"center",
    zIndex:3000, direction:"rtl", backdropFilter:"blur(8px)" }}>
    <div className="scale-in" style={{ background:T.surface, borderRadius:24,
      padding:"30px", width, border:`1px solid ${T.borderSoft}`,
      boxShadow:`0 32px 80px rgba(0,0,0,0.2), 0 0 0 1px ${T.border}` }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:24 }}>
        <span style={{ color:T.text, fontWeight:700, fontSize:16, letterSpacing:0.3 }}>{title}</span>
        <button onClick={onClose} style={{ background:"none", border:"none",
          color:T.mutedClr, cursor:"pointer", fontSize:18, lineHeight:1,
          width:30, height:30, display:"flex", alignItems:"center", justifyContent:"center",
          borderRadius:"50%", transition:"all 0.2s" }}
          onMouseEnter={e=>{ e.currentTarget.style.background=T.blush; e.currentTarget.style.color=T.rose; }}
          onMouseLeave={e=>{ e.currentTarget.style.background="none"; e.currentTarget.style.color=T.mutedClr; }}>✕</button>
      </div>
      {children}
    </div>
  </div>
);

const Field = ({ label, children }) => (
  <div>
    <div style={{ color:T.textSoft, fontSize:11.5, marginBottom:7, fontWeight:600,
      textTransform:"uppercase", letterSpacing:0.6 }}>{label}</div>
    {children}
  </div>
);

const iStyle = (err=false) => ({
  width:"100%", background: err?"#FDF0F3":T.blush,
  border:`1.5px solid ${err?"#E8A8B4":T.border}`,
  borderRadius:11, padding:"10px 14px", color:T.text, fontSize:13,
  outline:"none", direction:"rtl", boxSizing:"border-box", fontFamily:"inherit",
  transition:"all 0.2s",
});

const BtnPrimary = ({ onClick, children, disabled, full, style={} }) => (
  <button onClick={onClick} disabled={disabled} className="btn-primary" style={{
    padding:"11px 22px",
    background: disabled ? T.roseMid : `linear-gradient(135deg,${T.rose},${T.roseDark})`,
    border:"none", borderRadius:12, color:"#fff", fontFamily:"inherit",
    fontSize:13, fontWeight:600, cursor: disabled?"default":"pointer",
    width: full?"100%":"auto",
    boxShadow: disabled?"none":`0 4px 16px ${T.rose}45`,
    letterSpacing:0.3, ...style }}>
    {children}
  </button>
);

const BtnGhost = ({ onClick, children, style={} }) => (
  <button onClick={onClick} className="btn-ghost" style={{
    padding:"11px 22px", background:T.blush,
    border:`1.5px solid ${T.border}`, borderRadius:12,
    color:T.textSoft, fontFamily:"inherit", fontSize:13, cursor:"pointer",
    transition:"all 0.2s", ...style }}>
    {children}
  </button>
);

// ─── LOGIN ────────────────────────────────────────────────────────────
function LoginScreen({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd,  setShowPwd]  = useState(false);
  const [error,    setError]    = useState("");
  const [loading,  setLoading]  = useState(false);
  const [shake,    setShake]    = useState(false);

  const handle = async () => {
    if (!username.trim()) return setError("أدخلي اسم المستخدم");
    if (!password.trim()) return setError("أدخلي كلمة المرور");
    setLoading(true); setError("");
    try {
      const res = await fetch(API_URL+"/api/login", { method:"POST",
        headers:{"Content-Type":"application/json"},
        body: JSON.stringify({ username:username.trim(), password }) });
      const data = await res.json();
      if (!res.ok) { setError(data.error||"خطأ في تسجيل الدخول"); setShake(true); setTimeout(()=>setShake(false),500); }
      else onLogin(data.role, data.username);
    } catch { setError("تعذر الاتصال بالسيرفر"); }
    finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight:"100vh", background:`linear-gradient(145deg, #1A0E15 0%, #2C1520 50%, #1A0E15 100%)`,
      display:"flex", alignItems:"center", justifyContent:"center",
      fontFamily:"'Noto Naskh Arabic',serif", direction:"rtl",
      position:"relative", overflow:"hidden" }}>
      <style>{GLOBAL_CSS}</style>

      {/* Background pattern */}
      <div style={{ position:"absolute", inset:0, pointerEvents:"none", overflow:"hidden" }}>
        <div style={{ position:"absolute", top:"-20%", right:"-15%", width:600, height:600, borderRadius:"50%",
          background:`radial-gradient(circle, ${T.rose}20 0%, transparent 60%)` }}/>
        <div style={{ position:"absolute", bottom:"-15%", left:"-10%", width:500, height:500, borderRadius:"50%",
          background:`radial-gradient(circle, ${T.purple}15 0%, transparent 60%)` }}/>
        <div style={{ position:"absolute", top:"30%", left:"10%", width:250, height:250, borderRadius:"50%",
          background:`radial-gradient(circle, ${T.gold}10 0%, transparent 60%)` }}/>
        {/* floating petals */}
        {[{t:"15%",l:"20%",s:10,d:3.2},{t:"35%",l:"75%",s:7,d:2.8},{t:"55%",l:"12%",s:12,d:3.8},
          {t:"72%",l:"60%",s:8,d:2.5},{t:"20%",l:"50%",s:6,d:4.1}].map((p,i)=>(
          <div key={i} style={{ position:"absolute", top:p.t, left:p.l,
            width:p.s, height:p.s, borderRadius:"50% 0 50% 0",
            background:`${T.rose}${25+i*8}`,
            animation:`float ${p.d}s ease-in-out infinite`,
            animationDelay:`${i*0.5}s` }}/>
        ))}
        {/* subtle grid lines */}
        <div style={{ position:"absolute", inset:0,
          backgroundImage:`linear-gradient(rgba(196,72,112,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(196,72,112,0.04) 1px, transparent 1px)`,
          backgroundSize:"40px 40px" }}/>
      </div>

      <div className="fade-up" style={{ width:420, position:"relative", zIndex:1 }}>
        {/* Logo area */}
        <div style={{ textAlign:"center", marginBottom:36 }}>
          <div style={{ position:"relative", display:"inline-flex", flexDirection:"column", alignItems:"center", gap:16 }}>
            <div style={{ position:"relative" }}>
              <div style={{ width:76, height:76, borderRadius:22,
                background:`linear-gradient(145deg,${T.rose},${T.roseDark})`,
                display:"flex", alignItems:"center", justifyContent:"center",
                fontSize:34, boxShadow:`0 20px 50px ${T.rose}60, 0 0 0 1px ${T.rose}30`,
                animation:"float 4s ease-in-out infinite" }}>✨</div>
              <div style={{ position:"absolute", inset:-6, borderRadius:28,
                border:`1px solid ${T.rose}30`, animation:"float 4s ease-in-out infinite" }}/>
            </div>
            <div>
              <div style={{ color:"#FFFFFF", fontSize:36, fontWeight:700,
                fontFamily:"'Playfair Display',serif", letterSpacing:3, marginBottom:4 }}>لمسة</div>
              <div style={{ color:"rgba(255,255,255,0.45)", fontSize:12, letterSpacing:2,
                textTransform:"uppercase", fontFamily:"Inter,sans-serif" }}>
                Salon & Spa Dashboard
              </div>
            </div>
          </div>
        </div>

        {/* Card */}
        <div style={{ background:"rgba(255,255,255,0.97)", borderRadius:26,
          padding:"36px 32px",
          border:`1px solid rgba(196,72,112,0.15)`,
          boxShadow:`0 30px 80px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.1)`,
          animation: shake?"shake 0.4s ease":"none",
          backdropFilter:"blur(20px)" }}>

          <div style={{ marginBottom:8 }}>
            <div style={{ color:T.text, fontSize:18, fontWeight:700,
              fontFamily:"'Playfair Display',serif", marginBottom:4 }}>أهلاً بك</div>
            <div style={{ color:T.mutedClr, fontSize:13 }}>سجّلي دخولك للمتابعة</div>
          </div>

          <div style={{ height:1, background:`linear-gradient(90deg, transparent, ${T.border}, transparent)`, margin:"18px 0 22px" }}/>

          <div style={{ display:"flex", flexDirection:"column", gap:16, marginBottom:24 }}>
            <Field label="اسم المستخدم">
              <input value={username} onChange={e=>{setUsername(e.target.value);setError("");}}
                onKeyDown={e=>e.key==="Enter"&&handle()}
                placeholder="أدخلي اسم المستخدم"
                style={iStyle(!!error&&!username)}
                onFocus={e=>{ e.target.style.borderColor=T.rose; e.target.style.background="#fff"; e.target.style.boxShadow=`0 0 0 3px ${T.rose}18`; }}
                onBlur={e=>{ e.target.style.borderColor=T.border; e.target.style.background=T.blush; e.target.style.boxShadow="none"; }}/>
            </Field>
            <Field label="كلمة المرور">
              <div style={{ position:"relative" }}>
                <input type={showPwd?"text":"password"} value={password}
                  onChange={e=>{setPassword(e.target.value);setError("");}}
                  onKeyDown={e=>e.key==="Enter"&&handle()}
                  placeholder="أدخلي كلمة المرور"
                  style={{...iStyle(!!error&&username&&!password), paddingLeft:40}}
                  onFocus={e=>{ e.target.style.borderColor=T.rose; e.target.style.background="#fff"; e.target.style.boxShadow=`0 0 0 3px ${T.rose}18`; }}
                  onBlur={e=>{ e.target.style.borderColor=T.border; e.target.style.background=T.blush; e.target.style.boxShadow="none"; }}/>
                <button onClick={()=>setShowPwd(!showPwd)} style={{
                  position:"absolute", left:12, top:"50%", transform:"translateY(-50%)",
                  background:"none", border:"none", cursor:"pointer", padding:0, color:T.mutedClr }}>
                  <Icon d={showPwd?IC.eyeoff:IC.eye} size={15} color={T.mutedClr}/>
                </button>
              </div>
            </Field>
            {error && (
              <div style={{ color:T.red, fontSize:12, background:"#FDF0F3",
                padding:"10px 14px", borderRadius:11, border:`1.5px solid #EABAC0`,
                display:"flex", alignItems:"center", gap:7 }}>
                <Icon d={IC.warn} size={13} color={T.red}/> {error}
              </div>
            )}
          </div>

          <BtnPrimary onClick={handle} disabled={loading} full>
            {loading ? (
              <span style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:8 }}>
                <span style={{ width:14, height:14, border:"2px solid rgba(255,255,255,0.3)",
                  borderTopColor:"#fff", borderRadius:"50%", animation:"spin 0.8s linear infinite",
                  display:"inline-block" }}/>
                جاري التحقق...
              </span>
            ) : "دخول إلى الداشبورد"}
          </BtnPrimary>
        </div>

        <div style={{ textAlign:"center", marginTop:20, color:"rgba(255,255,255,0.3)", fontSize:11,
          display:"flex", alignItems:"center", justifyContent:"center", gap:6 }}>
          <Icon d={IC.heart} size={10} color={`${T.rose}80`}/>
          صالون لمسة © 2026
        </div>
      </div>
    </div>
  );
}

// ─── ADMIN LOGIN MODAL ────────────────────────────────────────────────
function AdminLoginModal({ onClose, onSuccess }) {
  const [pwd,     setPwd]     = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [error,   setError]   = useState(false);
  const [loading, setLoading] = useState(false);

  const handle = async () => {
    setLoading(true);
    try {
      const res = await fetch(API_URL+"/api/login", { method:"POST",
        headers:{"Content-Type":"application/json"},
        body: JSON.stringify({ username:"مدير", password:pwd }) });
      if (res.ok) { onSuccess(); onClose(); } else setError(true);
    } catch { setError(true); }
    finally { setLoading(false); }
  };

  return (
    <Modal title="🔐 دخول المدير" onClose={onClose} width={340}>
      <div style={{ display:"flex", flexDirection:"column", gap:14, marginBottom:20 }}>
        <Field label="كلمة مرور المدير">
          <div style={{ position:"relative" }}>
            <input type={showPwd?"text":"password"} value={pwd}
              onChange={e=>{setPwd(e.target.value);setError(false);}}
              onKeyDown={e=>e.key==="Enter"&&handle()}
              placeholder="أدخل كلمة المرور" style={{...iStyle(error),paddingLeft:40}} autoFocus
              onFocus={e=>{ e.target.style.borderColor=T.rose; e.target.style.background="#fff"; e.target.style.boxShadow=`0 0 0 3px ${T.rose}18`; }}
              onBlur={e=>{ e.target.style.borderColor=error?"#E8A8B4":T.border; e.target.style.background=T.blush; e.target.style.boxShadow="none"; }}/>
            <button onClick={()=>setShowPwd(!showPwd)} style={{
              position:"absolute", left:12, top:"50%", transform:"translateY(-50%)",
              background:"none", border:"none", cursor:"pointer", padding:0 }}>
              <Icon d={showPwd?IC.eyeoff:IC.eye} size={15} color={T.mutedClr}/>
            </button>
          </div>
        </Field>
        {error && <div style={{ color:T.red, fontSize:12, display:"flex", alignItems:"center", gap:6 }}>
          <Icon d={IC.warn} size={12} color={T.red}/> كلمة المرور غير صحيحة</div>}
      </div>
      <div style={{ display:"flex", gap:10 }}>
        <BtnPrimary onClick={handle} disabled={loading} style={{flex:1}}>{loading?"جاري...":"دخول"}</BtnPrimary>
        <BtnGhost onClick={onClose} style={{flex:1}}>إلغاء</BtnGhost>
      </div>
    </Modal>
  );
}

// ─── CONFIRM ─────────────────────────────────────────────────────────
function ConfirmDialog({ message, onConfirm, onCancel }) {
  return (
    <Modal title="تأكيد الإلغاء" onClose={onCancel} width={320}>
      <p style={{ color:T.textSoft, fontSize:13, marginBottom:22, lineHeight:1.9 }}>{message}</p>
      <div style={{ display:"flex", gap:10 }}>
        <button onClick={onConfirm} className="btn-primary" style={{
          flex:1, padding:"11px",
          background:`linear-gradient(135deg,${T.red},#9A2838)`,
          border:"none", borderRadius:11, color:"#fff",
          fontFamily:"inherit", fontSize:13, fontWeight:600, cursor:"pointer",
          boxShadow:`0 4px 14px ${T.red}40` }}>
          تأكيد الإلغاء
        </button>
        <BtnGhost onClick={onCancel} style={{flex:1}}>تراجع</BtnGhost>
      </div>
    </Modal>
  );
}

// ─── ADD BOOKING ─────────────────────────────────────────────────────
function AddBookingModal({ onClose, onAdd }) {
  const PRICES = Object.fromEntries(SERVICES.map(s=>[s.name,s.price+" ريال"]));
  const [form,  setForm]  = useState({ name:"", service:SERVICES[0].name, date:"اليوم", time:"", phone:"" });
  const [error, setError] = useState("");
  const fi = () => ({ onFocus:e=>{e.target.style.borderColor=T.rose;e.target.style.background="#fff";e.target.style.boxShadow=`0 0 0 3px ${T.rose}18`;}, onBlur:e=>{e.target.style.borderColor=T.border;e.target.style.background=T.blush;e.target.style.boxShadow="none";} });

  return (
    <Modal title="✨ إضافة حجز جديد" onClose={onClose} width={420}>
      <div style={{ display:"flex", flexDirection:"column", gap:15, marginBottom:20 }}>
        <Field label="اسم العميلة *">
          <input value={form.name} onChange={e=>setForm({...form,name:e.target.value})}
            placeholder="مثال: نورة العتيبي" style={iStyle(!form.name&&!!error)} {...fi()}/>
        </Field>
        <Field label="رقم الواتساب">
          <input value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})}
            placeholder="+966..." style={iStyle()} {...fi()}/>
        </Field>
        <Field label="الخدمة *">
          <select value={form.service} onChange={e=>setForm({...form,service:e.target.value})}
            style={{...iStyle(),cursor:"pointer"}} {...fi()}>
            {SERVICES.map(s=><option key={s.name} value={s.name}>{s.icon} {s.name} — {s.price} ريال</option>)}
          </select>
        </Field>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
          <Field label="التاريخ *">
            <select value={form.date} onChange={e=>setForm({...form,date:e.target.value})}
              style={{...iStyle(),cursor:"pointer"}} {...fi()}>
              <option>اليوم</option><option>بكره</option><option>بعد بكره</option>
            </select>
          </Field>
          <Field label="الوقت *">
            <input value={form.time} onChange={e=>setForm({...form,time:e.target.value})}
              placeholder="3:00 م" style={iStyle(!form.time&&!!error)} {...fi()}/>
          </Field>
        </div>
        {error && <div style={{ color:T.red, fontSize:12, display:"flex", alignItems:"center", gap:6 }}>
          <Icon d={IC.warn} size={13} color={T.red}/>{error}</div>}
      </div>
      <div style={{ display:"flex", gap:10 }}>
        <BtnPrimary onClick={()=>{
          if(!form.name.trim()) return setError("اسم العميلة مطلوب");
          if(!form.time.trim()) return setError("الوقت مطلوب");
          onAdd({...form,price:PRICES[form.service],id:Date.now(),status:"confirmed",source:"manual"});
          onClose();
        }} style={{flex:1}}>إضافة الحجز</BtnPrimary>
        <BtnGhost onClick={onClose} style={{flex:1}}>إلغاء</BtnGhost>
      </div>
    </Modal>
  );
}

// ─── BOOKING ROW ──────────────────────────────────────────────────────
function BookingRow({ b, onCancel }) {
  const sm = {
    confirmed:{ label:"مكتمل",  type:"confirmed" },
    pending:  { label:"معلق",   type:"pending"   },
    cancelled:{ label:"ملغي",   type:"cancelled" },
  };
  const s = sm[b.status]||sm.confirmed;
  const phone = b.phone?.replace("whatsapp:","") || "";
  return (
    <div className="row-hover" style={{ display:"grid", gridTemplateColumns:"1.4fr 1fr 1.2fr 0.8fr 0.9fr auto",
      alignItems:"center", padding:"14px 22px", borderBottom:`1px solid ${T.borderSoft}`, background:T.surface }}>
      <div style={{ display:"flex", alignItems:"center", gap:11 }}>
        <Avatar name={b.name} role="staff" size={34}/>
        <div>
          <div style={{ color:T.text, fontSize:13, fontWeight:600 }}>{b.name}</div>
          {phone && <div style={{ color:T.mutedClr, fontSize:11, display:"flex", alignItems:"center", gap:4, marginTop:2 }}>
            <Icon d={IC.phone} size={10} color={T.mutedClr}/>{phone}
          </div>}
        </div>
      </div>
      <div style={{ color:T.textSoft, fontSize:13 }}>{b.service}</div>
      <div style={{ color:T.mutedClr, fontSize:12 }}>{b.date} — {b.time}</div>
      <div style={{ color:T.rose, fontWeight:700, fontSize:13, fontFamily:"'Playfair Display',serif" }}>{b.price}</div>
      <Chip label={s.label} type={s.type}/>
      <div>
        {b.status!=="cancelled"&&(
          <button onClick={()=>onCancel(b.id,b.name)} className="btn-ghost" style={{
            background:"#FDF0F3", border:`1px solid #EABAC0`, borderRadius:8,
            padding:"5px 12px", color:T.red, fontSize:11, cursor:"pointer",
            fontFamily:"inherit", fontWeight:500, transition:"all 0.2s" }}>
            إلغاء
          </button>
        )}
      </div>
    </div>
  );
}

// ─── REPORTS ─────────────────────────────────────────────────────────
function ReportsPage({ bookings }) {
  const [period, setPeriod] = useState("monthly");
  const completed = bookings.filter(b=>b.status==="confirmed");
  const cancelled = bookings.filter(b=>b.status==="cancelled");
  const totalRevenue = completed.reduce((sum,b)=>sum+(parseInt((b.price||"0").replace(/\D/g,""))||0),0);
  const uniqueClients = new Set(completed.map(b=>b.phone||b.name)).size;
  const serviceStats = {};
  completed.forEach(b=>{
    if(!serviceStats[b.service]) serviceStats[b.service]={count:0,revenue:0};
    serviceStats[b.service].count++;
    serviceStats[b.service].revenue+=parseInt((b.price||"0").replace(/\D/g,""))||0;
  });
  const sorted = Object.entries(serviceStats).sort((a,b)=>b[1].count-a[1].count);
  const maxC = sorted[0]?.[1]?.count||1;

  const exportCSV = () => {
    const h = ["الاسم","الخدمة","التاريخ","الوقت","السعر","الحالة"];
    const r = bookings.map(b=>[b.name,b.service,b.date,b.time,b.price,b.status==="confirmed"?"مكتمل":"ملغي"]);
    const NL = String.fromCharCode(10);
    const csv=[h,...r].map(row=>row.join(",")).join(NL);
    const blob=new Blob(["﻿"+csv],{type:"text/csv;charset=utf-8"});
    const url=URL.createObjectURL(blob);
    const a=document.createElement("a");a.href=url;a.download="تقرير-لمسة.csv";a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fade-up">
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:24 }}>
        <div style={{ display:"flex", gap:3, background:T.surface, border:`1.5px solid ${T.border}`, borderRadius:13, padding:4,
          boxShadow:`0 1px 6px rgba(0,0,0,0.05)` }}>
          {[{id:"daily",l:"يومي"},{id:"weekly",l:"أسبوعي"},{id:"monthly",l:"شهري"}].map(p=>(
            <button key={p.id} onClick={()=>setPeriod(p.id)} style={{
              padding:"7px 18px", borderRadius:9, border:"none", cursor:"pointer",
              fontFamily:"inherit", fontSize:12, transition:"all 0.2s", fontWeight:500,
              background: period===p.id?`linear-gradient(135deg,${T.rose},${T.roseDark})`:"transparent",
              color: period===p.id?"#fff":T.textSoft,
              boxShadow: period===p.id?`0 2px 8px ${T.rose}40`:"none" }}>
              {p.l}
            </button>
          ))}
        </div>
        <div style={{ display:"flex", gap:8 }}>
          {[{fn:exportCSV,c:T.green,l:"تصدير CSV"},{fn:()=>window.print(),c:T.purple,l:"طباعة PDF"}].map(btn=>(
            <button key={btn.l} onClick={btn.fn} className="btn-ghost" style={{
              display:"flex", alignItems:"center", gap:7, padding:"8px 16px",
              background:T.surface, border:`1.5px solid ${T.border}`, borderRadius:11,
              color:btn.c, fontFamily:"inherit", fontSize:12, cursor:"pointer",
              fontWeight:500, transition:"all 0.2s" }}>
              <Icon d={IC.dl} size={14} color={btn.c}/> {btn.l}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:14, marginBottom:22 }}>
        <StatCard label="إجمالي المواعيد"  value={bookings.length}                    sub="كل المواعيد"       icon={IC.cal}   color={T.rose}   delay={0}/>
        <StatCard label="مواعيد مكتملة"    value={completed.length}                   sub="موعد مؤكد"         icon={IC.ok}    color={T.green}  delay={.05}/>
        <StatCard label="مواعيد ملغية"     value={cancelled.length}                   sub="موعد ملغي"         icon={IC.warn}  color={T.red}    delay={.1}/>
        <StatCard label="إجمالي الإيرادات" value={totalRevenue.toLocaleString()+" ﷼"} sub="من المكتملة فقط"  icon={IC.trend} color={T.gold}   delay={.15}/>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"1.4fr 1fr", gap:16, marginBottom:16 }}>
        {/* Top services */}
        <div style={{ background:T.surface, border:`1.5px solid ${T.borderSoft}`, borderRadius:18,
          padding:"22px 26px", boxShadow:`0 1px 8px rgba(0,0,0,0.05)` }}>
          <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:20 }}>
            <Icon d={IC.star} size={15} color={T.gold} sw={2}/>
            <span style={{ color:T.text, fontWeight:700, fontSize:14 }}>الخدمات الأكثر طلباً</span>
          </div>
          {sorted.length===0 ? <div style={{ textAlign:"center",color:T.mutedClr,fontSize:13,padding:20 }}>لا توجد بيانات</div>
          : sorted.map(([name,stats],idx)=>(
            <div key={name} style={{ marginBottom:16 }}>
              <div style={{ display:"flex", justifyContent:"space-between", marginBottom:7, alignItems:"center" }}>
                <span style={{ color:T.textSoft, fontSize:13, fontWeight:500 }}>{name}</span>
                <div style={{ display:"flex", gap:10 }}>
                  <span style={{ color:T.green, fontSize:11, fontWeight:600,
                    background:"#EBF7F1", padding:"2px 8px", borderRadius:8 }}>{stats.count} حجز</span>
                  <span style={{ color:T.purple, fontSize:11, fontWeight:600,
                    background:"#F0EAFA", padding:"2px 8px", borderRadius:8 }}>{stats.revenue.toLocaleString()} ﷼</span>
                </div>
              </div>
              <div style={{ height:7, background:T.bgDeep, borderRadius:4 }}>
                <div className="stat-bar" style={{ height:"100%", borderRadius:4,
                  width:Math.round((stats.count/maxC)*100)+"%",
                  background:`linear-gradient(90deg,${T.roseMid},${T.rose})` }}/>
              </div>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div style={{ background:T.surface, border:`1.5px solid ${T.borderSoft}`, borderRadius:18,
          padding:"22px 26px", boxShadow:`0 1px 8px rgba(0,0,0,0.05)` }}>
          <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:20 }}>
            <Icon d={IC.trend} size={15} color={T.rose} sw={2}/>
            <span style={{ color:T.text, fontWeight:700, fontSize:14 }}>الإحصائيات</span>
          </div>
          <div style={{ display:"flex", flexDirection:"column", gap:18 }}>
            {[
              { label:"معدل الإكمال", value:bookings.length?Math.round((completed.length/bookings.length)*100):0, color:T.green },
              { label:"معدل الإلغاء", value:bookings.length?Math.round((cancelled.length/bookings.length)*100):0, color:T.red },
            ].map(item=>(
              <div key={item.label}>
                <div style={{ display:"flex", justifyContent:"space-between", marginBottom:7 }}>
                  <span style={{ color:T.textSoft, fontSize:13, fontWeight:500 }}>{item.label}</span>
                  <span style={{ color:item.color, fontWeight:700, fontSize:15,
                    fontFamily:"'Playfair Display',serif" }}>{item.value}%</span>
                </div>
                <div style={{ height:7, background:T.bgDeep, borderRadius:4 }}>
                  <div className="stat-bar" style={{ height:"100%", borderRadius:4, width:item.value+"%",
                    background:`linear-gradient(90deg,${item.color}70,${item.color})` }}/>
                </div>
              </div>
            ))}
            <div style={{ paddingTop:16, borderTop:`1px solid ${T.borderSoft}` }}>
              {[
                { l:"العملاء الفريدين",   v:uniqueClients, c:T.purple },
                { l:"متوسط قيمة الحجز",  v:(completed.length?Math.round(totalRevenue/completed.length):0).toLocaleString()+" ﷼", c:T.rose },
                { l:"إجمالي الإيرادات",  v:totalRevenue.toLocaleString()+" ﷼", c:T.gold },
              ].map(item=>(
                <div key={item.l} style={{ display:"flex", justifyContent:"space-between", marginBottom:12 }}>
                  <span style={{ color:T.textSoft, fontSize:13 }}>{item.l}</span>
                  <span style={{ color:item.c, fontWeight:700, fontFamily:"'Playfair Display',serif" }}>{item.v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div style={{ background:T.surface, border:`1.5px solid ${T.borderSoft}`, borderRadius:18, overflow:"hidden",
        boxShadow:`0 1px 8px rgba(0,0,0,0.05)` }}>
        <div style={{ padding:"16px 22px", borderBottom:`1px solid ${T.borderSoft}`,
          display:"flex", justifyContent:"space-between", alignItems:"center",
          background:`linear-gradient(135deg,${T.blush},${T.surface})` }}>
          <span style={{ color:T.text, fontWeight:700, fontSize:14 }}>جدول المواعيد التفصيلي</span>
          <span style={{ color:T.mutedClr, fontSize:12, background:T.bgDeep,
            padding:"3px 12px", borderRadius:20, fontWeight:500 }}>{bookings.length} موعد</span>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr 1fr 1fr",
          padding:"10px 22px", background:T.bgDeep, borderBottom:`1px solid ${T.border}` }}>
          {["العميلة","الخدمة","التاريخ","المبلغ","الحالة"].map(h=>(
            <div key={h} style={{ color:T.mutedClr, fontSize:11, fontWeight:700,
              textTransform:"uppercase", letterSpacing:0.6 }}>{h}</div>
          ))}
        </div>
        <div style={{ maxHeight:280, overflow:"auto" }}>
          {bookings.length===0 ? <div style={{ padding:32,textAlign:"center",color:T.mutedClr,fontSize:13 }}>لا توجد بيانات</div>
          : bookings.map(b=>(
            <div key={b.id} className="row-hover" style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr 1fr 1fr",
              padding:"13px 22px", borderBottom:`1px solid ${T.borderSoft}`, background:T.surface }}>
              <div style={{ color:T.text, fontSize:13, fontWeight:500 }}>{b.name}</div>
              <div style={{ color:T.textSoft, fontSize:12 }}>{b.service}</div>
              <div style={{ color:T.mutedClr, fontSize:12 }}>{b.date} {b.time}</div>
              <div style={{ color:T.rose, fontWeight:700, fontSize:13, fontFamily:"'Playfair Display',serif" }}>{b.price}</div>
              <Chip label={b.status==="confirmed"?"مكتمل":"ملغي"} type={b.status==="confirmed"?"confirmed":"cancelled"}/>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── USERS PAGE ───────────────────────────────────────────────────────
function UsersPage() {
  const [users,    setUsers]    = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [form,     setForm]     = useState({ username:"", password:"", role:"staff" });
  const [formErr,  setFormErr]  = useState("");
  const [saving,   setSaving]   = useState(false);
  const [showPwd,  setShowPwd]  = useState(false);

  const fetchUsers = async () => {
    try { const res=await fetch(API_URL+"/api/users"); setUsers(await res.json()); }
    catch {} finally { setLoading(false); }
  };
  useEffect(()=>{ fetchUsers(); },[]);

  const openAdd  = () => { setForm({username:"",password:"",role:"staff"}); setEditUser(null); setFormErr(""); setShowPwd(false); setShowForm(true); };
  const openEdit = (u) => { setForm({username:u.username,password:"",role:u.role}); setEditUser(u); setFormErr(""); setShowPwd(false); setShowForm(true); };

  const handleSave = async () => {
    if (!form.username.trim()) return setFormErr("اسم المستخدم مطلوب");
    if (!editUser&&!form.password.trim()) return setFormErr("كلمة المرور مطلوبة");
    setSaving(true);
    try {
      const url=editUser?API_URL+"/api/users/"+editUser.id:API_URL+"/api/users";
      const res=await fetch(url,{method:editUser?"PATCH":"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(form)});
      const data=await res.json();
      if(!res.ok) return setFormErr(data.error||"حدث خطأ");
      await fetchUsers(); setShowForm(false);
    } catch { setFormErr("تعذر الاتصال"); } finally { setSaving(false); }
  };

  const handleDelete = async (u) => {
    if(!window.confirm("هل تريد حذف "+u.username+"؟")) return;
    await fetch(API_URL+"/api/users/"+u.id,{method:"DELETE"});
    fetchUsers();
  };

  const fi = { onFocus:e=>{e.target.style.borderColor=T.rose;e.target.style.background="#fff";e.target.style.boxShadow=`0 0 0 3px ${T.rose}18`;}, onBlur:e=>{e.target.style.borderColor=T.border;e.target.style.background=T.blush;e.target.style.boxShadow="none";} };

  return (
    <div className="fade-up">
      {showForm && (
        <Modal title={editUser?"✏️ تعديل مستخدم":"✨ إضافة مستخدم"} onClose={()=>setShowForm(false)} width={380}>
          <div style={{ display:"flex", flexDirection:"column", gap:15, marginBottom:20 }}>
            <Field label="اسم المستخدم *">
              <input value={form.username} onChange={e=>setForm({...form,username:e.target.value})}
                placeholder="مثال: نورة" style={iStyle(!!formErr&&!form.username)} {...fi}/>
            </Field>
            <Field label={editUser?"كلمة مرور جديدة (اختياري)":"كلمة المرور *"}>
              <div style={{ position:"relative" }}>
                <input type={showPwd?"text":"password"} value={form.password}
                  onChange={e=>setForm({...form,password:e.target.value})}
                  placeholder={editUser?"اتركها فارغة للإبقاء":"أدخل كلمة المرور"}
                  style={{...iStyle(),paddingLeft:40}} {...fi}/>
                <button onClick={()=>setShowPwd(!showPwd)} style={{
                  position:"absolute",left:12,top:"50%",transform:"translateY(-50%)",
                  background:"none",border:"none",cursor:"pointer",padding:0}}>
                  <Icon d={showPwd?IC.eyeoff:IC.eye} size={15} color={T.mutedClr}/>
                </button>
              </div>
            </Field>
            <Field label="الصلاحية">
              <select value={form.role} onChange={e=>setForm({...form,role:e.target.value})}
                style={{...iStyle(),cursor:"pointer"}} {...fi}>
                <option value="staff">موظفة — بدون تقارير</option>
                <option value="admin">مدير — كامل الصلاحيات</option>
              </select>
            </Field>
            {formErr && <div style={{ color:T.red, fontSize:12, display:"flex", alignItems:"center", gap:6 }}>
              <Icon d={IC.warn} size={13} color={T.red}/>{formErr}</div>}
          </div>
          <div style={{ display:"flex", gap:10 }}>
            <BtnPrimary onClick={handleSave} disabled={saving} style={{flex:1}}>{saving?"جاري الحفظ...":"حفظ"}</BtnPrimary>
            <BtnGhost onClick={()=>setShowForm(false)} style={{flex:1}}>إلغاء</BtnGhost>
          </div>
        </Modal>
      )}

      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
        <div style={{ color:T.mutedClr, fontSize:13, display:"flex", alignItems:"center", gap:6 }}>
          <Icon d={IC.shield} size={14} color={T.mutedClr}/>
          {users.length} مستخدم مسجّل
        </div>
        <BtnPrimary onClick={openAdd} style={{ display:"flex", alignItems:"center", gap:7, padding:"10px 18px" }}>
          <Icon d={IC.plus} size={14} color="#fff" sw={2.5}/> إضافة مستخدم
        </BtnPrimary>
      </div>

      <div style={{ background:T.surface, border:`1.5px solid ${T.borderSoft}`, borderRadius:18, overflow:"hidden",
        boxShadow:`0 1px 8px rgba(0,0,0,0.05)` }}>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr auto",
          padding:"11px 22px", background:T.bgDeep, borderBottom:`1px solid ${T.border}` }}>
          {["المستخدم","الصلاحية","تاريخ الإضافة","الإجراءات"].map(h=>(
            <div key={h} style={{ color:T.mutedClr, fontSize:11, fontWeight:700,
              textTransform:"uppercase", letterSpacing:0.6 }}>{h}</div>
          ))}
        </div>
        {loading ? (
          <div style={{ padding:40, textAlign:"center", color:T.mutedClr, display:"flex", alignItems:"center", justifyContent:"center", gap:8 }}>
            <span style={{ width:16, height:16, border:`2px solid ${T.border}`, borderTopColor:T.rose,
              borderRadius:"50%", animation:"spin 0.8s linear infinite", display:"inline-block" }}/>
            جاري التحميل...
          </div>
        ) : users.map(u=>(
          <div key={u.id} className="row-hover" style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr auto",
            alignItems:"center", padding:"14px 22px", borderBottom:`1px solid ${T.borderSoft}`, background:T.surface }}>
            <div style={{ display:"flex", alignItems:"center", gap:11 }}>
              <Avatar name={u.username} role={u.role} size={36}/>
              <span style={{ color:T.text, fontSize:13, fontWeight:600 }}>{u.username}</span>
            </div>
            <Chip label={u.role==="admin"?"مدير":"موظفة"} type={u.role==="admin"?"admin":"staff"}/>
            <span style={{ color:T.mutedClr, fontSize:12 }}>{new Date(u.created_at).toLocaleDateString("ar-SA")}</span>
            <div style={{ display:"flex", gap:8 }}>
              <button onClick={()=>openEdit(u)} className="btn-ghost" style={{
                background:T.blush, border:`1px solid ${T.border}`, borderRadius:8,
                padding:"5px 12px", color:T.rose, fontSize:11, cursor:"pointer",
                fontFamily:"inherit", fontWeight:500 }}>تعديل</button>
              <button onClick={()=>handleDelete(u)} className="btn-ghost" style={{
                background:"#FDF0F3", border:"1px solid #EABAC0", borderRadius:8,
                padding:"5px 12px", color:T.red, fontSize:11, cursor:"pointer",
                fontFamily:"inherit", fontWeight:500 }}>حذف</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── MAIN ─────────────────────────────────────────────────────────────
export default function SalonDashboard() {
  const [loggedIn, setLoggedIn] = useState(()=>window.location.hash.startsWith("#auth"));
  const [userRole, setUserRole] = useState(()=>window.location.hash.includes("admin")?"admin":"staff");
  const [username, setUsername] = useState(()=>decodeURIComponent(window.location.hash.split("-")[2]||""));

  const handleLogin = (role, uname) => {
    window.location.hash = "#auth-"+role+"-"+encodeURIComponent(uname);
    setUserRole(role); setUsername(uname); setLoggedIn(true);
  };

  if (!loggedIn) return <LoginScreen onLogin={handleLogin}/>;
  return <Dashboard onLogout={()=>{ window.location.hash=""; window.location.reload(); }} initialRole={userRole} username={username}/>;
}

function Dashboard({ onLogout, initialRole, username }) {
  const [bookings,  setBookings]  = useState([]);
  const [activeTab, setActiveTab] = useState("overview");
  const [filter,    setFilter]    = useState("all");
  const [notifs,    setNotifs]    = useState([]);
  const [lastSync,  setLastSync]  = useState(null);
  const [syncing,   setSyncing]   = useState(false);
  const [search,    setSearch]    = useState("");
  const [confirm,   setConfirm]   = useState(null);
  const [showAdd,   setShowAdd]   = useState(false);
  const [isAdmin,   setIsAdmin]   = useState(()=>initialRole==="admin");
  const [showAdminLogin, setShowAdminLogin] = useState(false);

  const addNotif = (msg, type="success") => {
    const id=Date.now();
    setNotifs(p=>[...p,{id,msg,type}]);
    setTimeout(()=>setNotifs(p=>p.filter(n=>n.id!==id)),4000);
  };

  const fetchBookings = useCallback(async ()=>{
    setSyncing(true);
    try { const res=await fetch(API_URL+"/api/bookings"); setBookings(await res.json()); setLastSync(new Date()); }
    catch {} finally { setSyncing(false); }
  },[]);

  useEffect(()=>{ fetchBookings(); const i=setInterval(fetchBookings,30000); return ()=>clearInterval(i); },[fetchBookings]);

  useEffect(()=>{
    const es=new EventSource(API_URL+"/api/events");
    es.onmessage=(e)=>{ try{ const d=JSON.parse(e.data); if(d.type==="new_booking"){fetchBookings();addNotif("✨ حجز جديد — "+d.name,"success");} }catch{} };
    es.onerror=()=>es.close(); return ()=>es.close();
  },[fetchBookings]);

  const handleCancel=(id,name)=>setConfirm({id,name});
  const confirmCancel=async()=>{
    const {id}=confirm; setConfirm(null);
    try{await fetch(API_URL+"/api/bookings/"+id+"/cancel",{method:"PATCH"});}catch{}
    setBookings(p=>p.map(b=>b.id===id?{...b,status:"cancelled"}:b));
    addNotif("تم إلغاء الموعد","cancel");
  };
  const handleAddBooking=async(b)=>{
    try{ await fetch(API_URL+"/api/bookings/manual",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(b)}); fetchBookings(); }
    catch{ setBookings(p=>[b,...p]); }
    addNotif("✅ تم إضافة الحجز","success");
  };

  const today     = bookings.filter(b=>b.date==="اليوم"&&b.status!=="cancelled");
  const confirmed = bookings.filter(b=>b.status==="confirmed");
  const pending   = bookings.filter(b=>b.status==="pending");
  const cancelled = bookings.filter(b=>b.status==="cancelled");
  const filtered  = bookings.filter(b=>(filter==="all"||b.status===filter)&&(!search||b.name?.includes(search)||b.service?.includes(search)||b.phone?.includes(search)));

  const tabs = [
    {id:"overview", label:"نظرة عامة",  ip:IC.grid},
    {id:"bookings", label:"الحجوزات",   ip:IC.cal},
    {id:"services", label:"الخدمات",    ip:IC.cut},
    {id:"reports",  label:"التقارير",   ip:IC.trend, adminOnly:true},
    {id:"users",    label:"المستخدمين", ip:IC.shield, adminOnly:true},
  ];

  const pageLabels = { overview:"نظرة عامة", bookings:"إدارة الحجوزات", services:"قائمة الخدمات", reports:"التقارير والإحصاء", users:"إدارة المستخدمين" };

  return (
    <div style={{ minHeight:"100vh", background:T.bg, fontFamily:"'Noto Naskh Arabic',serif", direction:"rtl", color:T.text }}>
      <style>{GLOBAL_CSS}</style>

      {showAdminLogin && <AdminLoginModal onClose={()=>setShowAdminLogin(false)} onSuccess={()=>setIsAdmin(true)}/>}
      {showAdd && <AddBookingModal onClose={()=>setShowAdd(false)} onAdd={handleAddBooking}/>}
      {confirm && <ConfirmDialog message={`هل تريدين إلغاء موعد ${confirm.name}؟`} onConfirm={confirmCancel} onCancel={()=>setConfirm(null)}/>}

      {/* Toast notifications */}
      <div style={{ position:"fixed", top:24, left:"50%", transform:"translateX(-50%)",
        zIndex:2000, display:"flex", flexDirection:"column", gap:8, alignItems:"center", pointerEvents:"none" }}>
        {notifs.map(n=>{
          const colors = { success:{bg:T.green,border:"#2E7A5230"}, cancel:{bg:T.red,border:"#B83A5030"}, default:{bg:T.rose,border:`${T.rose}30`} };
          const c = colors[n.type]||colors.default;
          return (
            <div key={n.id} className="fade-up" style={{
              background:T.surface, border:`1px solid ${c.border}`,
              borderRight:`3px solid ${c.bg}`,
              color:T.text, padding:"12px 20px", borderRadius:14, fontSize:13,
              whiteSpace:"nowrap", boxShadow:`0 8px 24px rgba(0,0,0,0.12)`,
              display:"flex", alignItems:"center", gap:8 }}>
              <span style={{ width:7, height:7, borderRadius:"50%", background:c.bg, flexShrink:0 }}/>
              {n.msg}
            </div>
          );
        })}
      </div>

      {/* ── Sidebar ─────────────────────────────────────────── */}
      <div style={{ position:"fixed", top:0, right:0, height:"100vh", width:240,
        background:T.sidebarBg,
        display:"flex", flexDirection:"column", zIndex:100,
        boxShadow:`-2px 0 40px rgba(0,0,0,0.25)` }}>

        {/* Brand */}
        <div style={{ padding:"24px 18px 20px",
          borderBottom:"1px solid rgba(255,255,255,0.07)",
          background:`linear-gradient(180deg,rgba(196,72,112,0.12) 0%,transparent 100%)` }}>
          <div style={{ display:"flex", alignItems:"center", gap:12 }}>
            <div style={{ width:46, height:46, borderRadius:14,
              background:`linear-gradient(145deg,${T.rose},${T.roseDark})`,
              display:"flex", alignItems:"center", justifyContent:"center",
              fontSize:21, boxShadow:`0 8px 20px ${T.rose}50`,
              animation:"float 4s ease-in-out infinite", flexShrink:0 }}>✨</div>
            <div>
              <div style={{ color:"#FFFFFF", fontWeight:700, fontSize:20,
                fontFamily:"'Playfair Display',serif", letterSpacing:1.5, lineHeight:1.1 }}>لمسة</div>
              <div style={{ color:"rgba(255,255,255,0.35)", fontSize:10, letterSpacing:1.5,
                textTransform:"uppercase", fontFamily:"Inter,sans-serif", marginTop:3 }}>Salon & Spa</div>
            </div>
          </div>
        </div>

        {/* Nav section label */}
        <div style={{ padding:"18px 18px 8px" }}>
          <div style={{ color:"rgba(255,255,255,0.25)", fontSize:10, fontWeight:700,
            letterSpacing:1.5, textTransform:"uppercase", fontFamily:"Inter,sans-serif" }}>القائمة الرئيسية</div>
        </div>

        {/* Nav */}
        <nav style={{ flex:1, padding:"4px 10px 10px", display:"flex", flexDirection:"column", gap:2, overflow:"auto" }}>
          {tabs.map(t=>{
            const active = activeTab===t.id;
            return (
              <button key={t.id} className="nav-item" onClick={()=>{
                if(t.adminOnly&&!isAdmin){ setShowAdminLogin(true); return; }
                setActiveTab(t.id);
              }} style={{
                display:"flex", alignItems:"center", gap:11, padding:"11px 14px",
                borderRadius:12, textAlign:"right", width:"100%",
                background: active?"rgba(196,72,112,0.18)":"transparent",
                color: active?"#FFFFFF":"rgba(255,255,255,0.5)",
                fontFamily:"inherit", fontSize:13,
                fontWeight: active?600:400 }}>
                {active && <div style={{ position:"absolute", right:0, width:3, height:28,
                  background:`linear-gradient(180deg,${T.rose},${T.roseDark})`,
                  borderRadius:"2px 0 0 2px" }}/>}
                <div style={{ width:32, height:32, borderRadius:9, flexShrink:0,
                  background: active?`linear-gradient(145deg,${T.rose}30,${T.rose}15)`:"rgba(255,255,255,0.05)",
                  display:"flex", alignItems:"center", justifyContent:"center",
                  transition:"all 0.18s" }}>
                  <Icon d={t.ip} size={15} color={active?T.rose:"rgba(255,255,255,0.4)"} sw={active?2:1.5}/>
                </div>
                <span style={{ flex:1 }}>{t.label}</span>
                {t.adminOnly&&!isAdmin&&(
                  <Icon d={IC.lock} size={11} color="rgba(255,255,255,0.2)"/>
                )}
                {t.id==="bookings"&&pending.length>0&&(
                  <span style={{ background:T.rose, color:"#fff",
                    fontSize:10, padding:"2px 7px", borderRadius:10, fontWeight:700,
                    minWidth:20, textAlign:"center" }}>{pending.length}</span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Bottom user section */}
        <div style={{ padding:"12px 10px 16px",
          borderTop:"1px solid rgba(255,255,255,0.07)" }}>

          {/* User card */}
          <div style={{ display:"flex", alignItems:"center", gap:10, padding:"10px 12px",
            background:"rgba(255,255,255,0.05)", borderRadius:12, marginBottom:10,
            border:"1px solid rgba(255,255,255,0.07)" }}>
            <Avatar name={username} role={isAdmin?"admin":"staff"} size={34}/>
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ color:"rgba(255,255,255,0.9)", fontSize:12, fontWeight:600,
                overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{username||"مستخدم"}</div>
              <div style={{ color:"rgba(255,255,255,0.35)", fontSize:10, marginTop:1 }}>
                {isAdmin?"مدير النظام":"موظفة"}</div>
            </div>
            {isAdmin && <Icon d={IC.shield} size={13} color={T.purple}/>}
          </div>

          <div style={{ display:"flex", gap:6 }}>
            <button onClick={fetchBookings} disabled={syncing} style={{
              flex:1, display:"flex", alignItems:"center", justifyContent:"center", gap:6,
              padding:"8px", background:"rgba(255,255,255,0.06)",
              border:"1px solid rgba(255,255,255,0.08)",
              borderRadius:9, color:"rgba(255,255,255,0.5)", fontFamily:"inherit",
              fontSize:11, cursor:"pointer", transition:"all 0.18s" }}
              onMouseEnter={e=>e.currentTarget.style.background="rgba(255,255,255,0.1)"}
              onMouseLeave={e=>e.currentTarget.style.background="rgba(255,255,255,0.06)"}>
              <Icon d={IC.refresh} size={13} color="rgba(255,255,255,0.4)"
                style={{ animation:syncing?"spin 1s linear infinite":"none" }}/>
              {syncing?"...":"تحديث"}
            </button>
            <button onClick={onLogout} style={{
              flex:1, display:"flex", alignItems:"center", justifyContent:"center", gap:6,
              padding:"8px", background:`rgba(184,58,80,0.15)`,
              border:"1px solid rgba(184,58,80,0.25)",
              borderRadius:9, color:`${T.red}CC`, fontFamily:"inherit",
              fontSize:11, cursor:"pointer", transition:"all 0.18s" }}
              onMouseEnter={e=>e.currentTarget.style.background="rgba(184,58,80,0.25)"}
              onMouseLeave={e=>e.currentTarget.style.background="rgba(184,58,80,0.15)"}>
              <Icon d={IC.out} size={13} color={`${T.red}CC`}/> خروج
            </button>
          </div>

          {lastSync && (
            <div style={{ textAlign:"center", color:"rgba(255,255,255,0.2)", fontSize:10,
              marginTop:10, display:"flex", alignItems:"center", justifyContent:"center", gap:5 }}>
              <div style={{ width:5, height:5, borderRadius:"50%", background:T.green,
                animation:"pulse 2s infinite" }}/>
              آخر تحديث: {lastSync.toLocaleTimeString("ar-SA",{hour:"2-digit",minute:"2-digit"})}
            </div>
          )}
        </div>
      </div>

      {/* ── Main Content ─────────────────────────────────────── */}
      <div style={{ marginRight:240, padding:"28px 32px", minHeight:"100vh" }}>

        {/* Topbar */}
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:28 }}>
          <div>
            <div style={{ color:T.mutedClr, fontSize:11, marginBottom:6, fontWeight:600,
              textTransform:"uppercase", letterSpacing:1, display:"flex", alignItems:"center", gap:6 }}>
              <span>لوحة التحكم</span>
              <span style={{ color:T.border }}>›</span>
              <span style={{ color:T.rose }}>{pageLabels[activeTab]||"لوحة التحكم"}</span>
            </div>
            <h1 style={{ fontSize:24, fontWeight:700, color:T.text,
              fontFamily:"'Playfair Display',serif", letterSpacing:0.5, lineHeight:1.2 }}>
              {pageLabels[activeTab]||"لوحة التحكم"}
            </h1>
            <div style={{ color:T.mutedClr, fontSize:12, marginTop:4 }}>
              {new Date().toLocaleDateString("ar-SA",{weekday:"long",year:"numeric",month:"long",day:"numeric"})}
            </div>
          </div>

          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            {isAdmin && (
              <div style={{ display:"flex", alignItems:"center", gap:6, padding:"7px 14px",
                background:"#F0EAFA", border:"1px solid #CEBCE8", borderRadius:11,
                color:T.purple, fontSize:11, fontWeight:600 }}>
                <Icon d={IC.shield} size={12} color={T.purple}/> وضع المدير
              </div>
            )}
            <div style={{ display:"flex", alignItems:"center", gap:6, padding:"7px 14px",
              background:T.surface, border:`1.5px solid ${T.border}`, borderRadius:11,
              color:T.mutedClr, fontSize:12, boxShadow:`0 1px 4px rgba(0,0,0,0.05)` }}>
              <Icon d={IC.bell} size={13} color={T.mutedClr}/>
              {pending.length > 0 ? (
                <><span style={{ color:T.amber, fontWeight:600 }}>{pending.length}</span> معلق</>
              ) : "لا يوجد معلق"}
            </div>
            <BtnPrimary onClick={()=>setShowAdd(true)} style={{
              display:"flex", alignItems:"center", gap:7, padding:"10px 18px" }}>
              <Icon d={IC.plus} size={14} color="#fff" sw={2.5}/> إضافة حجز
            </BtnPrimary>
          </div>
        </div>

        {/* ── OVERVIEW ─────────────────────────────── */}
        {activeTab==="overview"&&(
          <div>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:14, marginBottom:24 }}>
              <StatCard label="حجوزات اليوم"  value={today.length}     sub={`${today.length} موعد نشط`}     icon={IC.cal}   color={T.rose}   delay={0}/>
              <StatCard label="مؤكدة"          value={confirmed.length} sub="إجمالي المكتملة"                icon={IC.ok}    color={T.green}  delay={.05}/>
              <StatCard label="في الانتظار"   value={pending.length}   sub="تحتاج مراجعة"                  icon={IC.clock} color={T.amber}  delay={.1}/>
              <StatCard label="ملغية"          value={cancelled.length} sub="إجمالي الإلغاءات"              icon={IC.warn}  color={T.red}    delay={.15}/>
            </div>

            <div style={{ display:"grid", gridTemplateColumns:"1.5fr 1fr", gap:16 }}>
              {/* Today's bookings */}
              <div className="fade-up" style={{ background:T.surface, border:`1.5px solid ${T.borderSoft}`,
                borderRadius:20, overflow:"hidden",
                boxShadow:`0 1px 8px rgba(0,0,0,0.05)`, animationDelay:"0.2s" }}>
                <div style={{ padding:"17px 22px", borderBottom:`1px solid ${T.borderSoft}`,
                  display:"flex", justifyContent:"space-between", alignItems:"center",
                  background:`linear-gradient(135deg,${T.blush},${T.surface})` }}>
                  <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                    <Icon d={IC.cal} size={15} color={T.rose} sw={2}/>
                    <span style={{ color:T.text, fontWeight:700, fontSize:14 }}>مواعيد اليوم</span>
                  </div>
                  <Chip label={`${today.length} موعد`} type="default"/>
                </div>
                {today.length===0 ? (
                  <div style={{ padding:48, textAlign:"center" }}>
                    <div style={{ fontSize:40, marginBottom:10 }}>🌸</div>
                    <div style={{ color:T.mutedClr, fontSize:13 }}>لا توجد مواعيد اليوم</div>
                  </div>
                ) : today.map(b=>(
                  <div key={b.id} className="row-hover" style={{ display:"flex", alignItems:"center",
                    gap:14, padding:"13px 22px", borderBottom:`1px solid ${T.borderSoft}`, background:T.surface }}>
                    <Avatar name={b.name} role="staff" size={36}/>
                    <div style={{ flex:1 }}>
                      <div style={{ color:T.text, fontSize:13, fontWeight:600 }}>{b.name}</div>
                      <div style={{ color:T.mutedClr, fontSize:11, marginTop:2 }}>{b.service}</div>
                    </div>
                    <div style={{ textAlign:"left" }}>
                      <div style={{ color:T.rose, fontSize:14, fontWeight:700,
                        fontFamily:"'Playfair Display',serif" }}>{b.time}</div>
                      <div style={{ color:T.mutedClr, fontSize:11, marginTop:2 }}>{b.price}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Top services */}
              <div className="fade-up" style={{ background:T.surface, border:`1.5px solid ${T.borderSoft}`,
                borderRadius:20, padding:"20px 22px",
                boxShadow:`0 1px 8px rgba(0,0,0,0.05)`, animationDelay:"0.25s" }}>
                <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:18 }}>
                  <Icon d={IC.star} size={15} color={T.gold} sw={2}/>
                  <span style={{ color:T.text, fontWeight:700, fontSize:14 }}>الخدمات الأكثر طلباً</span>
                </div>
                {SERVICES.slice(0,5).map(s=>{
                  const cnt=bookings.filter(b=>b.service===s.name).length;
                  const mx=Math.max(...SERVICES.map(sv=>bookings.filter(b=>b.service===sv.name).length),1);
                  return(
                    <div key={s.id} style={{ marginBottom:14 }}>
                      <div style={{ display:"flex", justifyContent:"space-between", marginBottom:6, alignItems:"center" }}>
                        <span style={{ color:T.textSoft, fontSize:12, fontWeight:500 }}>{s.icon} {s.name}</span>
                        <span style={{ color:s.color, fontSize:12, fontWeight:700,
                          background:`${s.color}12`, padding:"1px 8px", borderRadius:8 }}>{cnt}</span>
                      </div>
                      <div style={{ height:6, background:T.bgDeep, borderRadius:3 }}>
                        <div className="stat-bar" style={{ height:"100%", borderRadius:3,
                          width:(Math.round((cnt/mx)*100)||6)+"%",
                          background:`linear-gradient(90deg,${T.roseMid},${T.rose})` }}/>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ── BOOKINGS ─────────────────────────────── */}
        {activeTab==="bookings"&&(
          <div className="fade-up">
            <div style={{ display:"flex", gap:12, marginBottom:20, alignItems:"center" }}>
              <div style={{ display:"flex", alignItems:"center", gap:10, flex:1,
                background:T.surface, border:`1.5px solid ${T.border}`, borderRadius:13,
                padding:"10px 16px", boxShadow:`0 1px 6px rgba(0,0,0,0.05)` }}>
                <Icon d={IC.search} size={15} color={T.mutedClr}/>
                <input value={search} onChange={e=>setSearch(e.target.value)}
                  placeholder="ابحثي بالاسم أو الخدمة..."
                  style={{ flex:1, background:"transparent", border:"none", color:T.text,
                    fontSize:13, outline:"none", direction:"rtl", fontFamily:"inherit" }}/>
              </div>
              <div style={{ display:"flex", gap:3, background:T.surface, border:`1.5px solid ${T.border}`,
                borderRadius:13, padding:4, boxShadow:`0 1px 6px rgba(0,0,0,0.05)` }}>
                {[{id:"all",l:"الكل"},{id:"confirmed",l:"مكتملة"},{id:"pending",l:"معلقة"},{id:"cancelled",l:"ملغية"}].map(f=>(
                  <button key={f.id} onClick={()=>setFilter(f.id)} style={{
                    padding:"7px 15px", borderRadius:9, border:"none", cursor:"pointer",
                    fontFamily:"inherit", fontSize:12, transition:"all 0.2s", fontWeight:500,
                    background: filter===f.id?`linear-gradient(135deg,${T.rose},${T.roseDark})`:"transparent",
                    color: filter===f.id?"#fff":T.textSoft,
                    boxShadow: filter===f.id?`0 2px 8px ${T.rose}40`:"none" }}>
                    {f.l}
                    {f.id!=="all"&&<span style={{ opacity:.7, fontSize:10, marginRight:4 }}>
                      ({bookings.filter(b=>b.status===f.id).length})
                    </span>}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ background:T.surface, border:`1.5px solid ${T.borderSoft}`, borderRadius:20, overflow:"hidden",
              boxShadow:`0 1px 8px rgba(0,0,0,0.05)` }}>
              <div style={{ display:"grid", gridTemplateColumns:"1.4fr 1fr 1.2fr 0.8fr 0.9fr auto",
                padding:"11px 22px", background:T.bgDeep, borderBottom:`1px solid ${T.border}` }}>
                {["العميلة","الخدمة","الموعد","السعر","الحالة",""].map(h=>(
                  <div key={h} style={{ color:T.mutedClr, fontSize:11, fontWeight:700,
                    textTransform:"uppercase", letterSpacing:0.6 }}>{h}</div>
                ))}
              </div>
              {filtered.length===0 ? (
                <div style={{ padding:48, textAlign:"center" }}>
                  <div style={{ fontSize:36, marginBottom:10 }}>🌸</div>
                  <div style={{ color:T.mutedClr, fontSize:13 }}>لا توجد حجوزات مطابقة</div>
                </div>
              ) : filtered.map(b=><BookingRow key={b.id} b={b} onCancel={handleCancel}/>)}
            </div>
          </div>
        )}

        {/* ── SERVICES ─────────────────────────────── */}
        {activeTab==="services"&&(
          <div className="fade-up" style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:16 }}>
            {SERVICES.map((s,i)=>{
              const cnt=bookings.filter(b=>b.service===s.name&&b.status==="confirmed").length;
              const revenue=bookings.filter(b=>b.service===s.name&&b.status==="confirmed")
                .reduce((sum,b)=>sum+(parseInt((b.price||"0").replace(/\D/g,""))||0),0);
              return(
                <div key={s.id} className="card-hover fade-up" style={{
                  background:T.surface, border:`1.5px solid ${T.borderSoft}`, borderRadius:20,
                  overflow:"hidden", boxShadow:`0 1px 8px rgba(0,0,0,0.05)`,
                  animationDelay:i*0.05+"s" }}>
                  <div style={{ height:3, background:`linear-gradient(90deg,${s.color},${s.color}70)` }}/>
                  <div style={{ padding:"20px" }}>
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:16 }}>
                      <div style={{ width:52, height:52, borderRadius:16, fontSize:24,
                        background:`linear-gradient(145deg,${s.color}20,${s.color}08)`,
                        border:`1.5px solid ${s.color}25`,
                        display:"flex", alignItems:"center", justifyContent:"center" }}>{s.icon}</div>
                      <Chip label={cnt+" حجز"} type="default"/>
                    </div>
                    <div style={{ color:T.text, fontWeight:700, fontSize:14, marginBottom:4 }}>{s.name}</div>
                    <div style={{ color:T.mutedClr, fontSize:12, marginBottom:16 }}>
                      <Icon d={IC.clock} size={11} color={T.mutedClr} style={{ display:"inline", marginLeft:4 }}/>
                      {s.duration} دقيقة
                    </div>
                    <div style={{ paddingTop:14, borderTop:`1px solid ${T.borderSoft}`,
                      display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                      <span style={{ color:T.rose, fontWeight:700, fontSize:18,
                        fontFamily:"'Playfair Display',serif" }}>{s.price} ﷼</span>
                      {revenue > 0 && <span style={{ color:T.gold, fontSize:11, fontWeight:600,
                        background:T.goldLight, padding:"3px 10px", borderRadius:8 }}>
                        {revenue.toLocaleString()} ﷼ إيراد
                      </span>}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ── REPORTS ──────────────────────────────── */}
        {activeTab==="reports"&&(
          isAdmin ? <ReportsPage bookings={bookings}/> : (
            <div style={{ textAlign:"center", padding:80 }}>
              <div style={{ width:80, height:80, borderRadius:24, background:T.blush,
                border:`2px solid ${T.border}`, display:"flex", alignItems:"center",
                justifyContent:"center", fontSize:36, margin:"0 auto 20px" }}>🔐</div>
              <div style={{ color:T.textSoft, fontSize:15, fontWeight:600, marginBottom:8 }}>صفحة مخصصة للمدير</div>
              <div style={{ color:T.mutedClr, fontSize:13, marginBottom:24 }}>تحتاج إلى صلاحيات المدير للوصول</div>
              <BtnPrimary onClick={()=>setShowAdminLogin(true)}>دخول كمدير</BtnPrimary>
            </div>
          )
        )}

        {/* ── USERS ────────────────────────────────── */}
        {activeTab==="users"&&(
          isAdmin ? <UsersPage/> : (
            <div style={{ textAlign:"center", padding:80 }}>
              <div style={{ width:80, height:80, borderRadius:24, background:T.blush,
                border:`2px solid ${T.border}`, display:"flex", alignItems:"center",
                justifyContent:"center", fontSize:36, margin:"0 auto 20px" }}>🔐</div>
              <div style={{ color:T.textSoft, fontSize:15, fontWeight:600, marginBottom:8 }}>صفحة مخصصة للمدير</div>
              <div style={{ color:T.mutedClr, fontSize:13, marginBottom:24 }}>تحتاج إلى صلاحيات المدير للوصول</div>
              <BtnPrimary onClick={()=>setShowAdminLogin(true)}>دخول كمدير</BtnPrimary>
            </div>
          )
        )}
      </div>
    </div>
  );
}
