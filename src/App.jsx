import { useState, useEffect, useCallback } from "react";

const API_URL = "https://lamsa-salon-server-production.up.railway.app";

const SERVICES = [
  { id:1, name:"باديكير وميديكير", duration:45,  price:80,  icon:"💅", color:"#E8869A" },
  { id:2, name:"تلوين شعر",        duration:90,  price:250, icon:"🎨", color:"#C490D1" },
  { id:3, name:"قص وتصفيف",        duration:60,  price:150, icon:"✂️", color:"#90C4D1" },
  { id:4, name:"علاج بالأوزون",    duration:60,  price:200, icon:"🌿", color:"#90D1A8" },
  { id:5, name:"مساج استرخاء",     duration:60,  price:180, icon:"🪷", color:"#D190A8" },
  { id:6, name:"تنظيف بشرة",       duration:75,  price:220, icon:"✨", color:"#D4B86A" },
  { id:7, name:"عروس كاملة",       duration:240, price:800, icon:"👰", color:"#C4A0D4" },
];

// ─── DESIGN TOKENS ────────────────────────────────────────────────────
const T = {
  bg:        "#120A18",
  surface:   "rgba(255,255,255,0.07)",
  surfaceSolid: "#1E1128",
  rose:      "#E879A0",
  roseDark:  "#C4527C",
  roseLight: "rgba(232,121,160,0.15)",
  roseMid:   "rgba(232,121,160,0.4)",
  blush:     "rgba(232,121,160,0.08)",
  border:    "rgba(232,121,160,0.18)",
  borderSoft:"rgba(255,255,255,0.08)",
  text:      "#F8F0FF",
  textSoft:  "#C9A8D8",
  muted:     "#8A6A9A",
  green:     "#6ECFA0",
  red:       "#F07080",
  amber:     "#F0B060",
  purple:    "#C084FC",
  purpleDark:"#9B59F5",
};

const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;500;600;700;800&display=swap');
  *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }
  body { background:#120A18; }
  ::-webkit-scrollbar { width:4px; }
  ::-webkit-scrollbar-track { background:rgba(255,255,255,0.03); }
  ::-webkit-scrollbar-thumb { background:rgba(232,121,160,0.3); border-radius:4px; }
  ::-webkit-scrollbar-thumb:hover { background:rgba(232,121,160,0.5); }

  @keyframes fadeUp  { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
  @keyframes fadeIn  { from{opacity:0} to{opacity:1} }
  @keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
  @keyframes pulse   { 0%,100%{opacity:.4} 50%{opacity:1} }
  @keyframes shake   { 0%,100%{transform:translateX(0)} 25%{transform:translateX(-6px)} 75%{transform:translateX(6px)} }
  @keyframes float   { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-5px)} }
  @keyframes spin    { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
  @keyframes glowPulse { 0%,100%{box-shadow:0 0 20px rgba(232,121,160,0.2)} 50%{box-shadow:0 0 35px rgba(232,121,160,0.4)} }

  .fade-up  { animation:fadeUp  0.4s cubic-bezier(.22,.68,0,1.1) both; }
  .fade-in  { animation:fadeIn  0.25s ease both; }

  .btn-rose { transition:all 0.2s ease; }
  .btn-rose:hover { transform:translateY(-2px); box-shadow:0 8px 24px rgba(232,121,160,0.45); }
  .btn-rose:active { transform:translateY(0); }

  .btn-ghost { transition:all 0.2s ease; }
  .btn-ghost:hover { background:rgba(232,121,160,0.12) !important; border-color:rgba(232,121,160,0.3) !important; }

  .row-hover { transition:background 0.15s; }
  .row-hover:hover { background:rgba(232,121,160,0.07) !important; }

  .card-lift { transition:all 0.25s ease; }
  .card-lift:hover { transform:translateY(-3px); box-shadow:0 16px 40px rgba(232,121,160,0.2), 0 0 0 1px rgba(232,121,160,0.2) !important; }

  .nav-btn { transition:all 0.2s ease; border:none; cursor:pointer; }
  .nav-btn:hover { background:rgba(232,121,160,0.1) !important; }

  .glass { backdrop-filter:blur(20px); -webkit-backdrop-filter:blur(20px); }

  input, select, button { font-family:'Cairo',sans-serif; }
  select option { background:#1E1128; color:#F8F0FF; }
  input::placeholder { color:rgba(138,106,154,0.7); }
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
};

// ─── HELPERS ─────────────────────────────────────────────────────────
const Avatar = ({ name, role, size=36 }) => {
  const bg = role==="admin"
    ? `linear-gradient(135deg,${T.purple},#6848A8)`
    : `linear-gradient(135deg,${T.rose},${T.roseDark})`;
  return (
    <div style={{ width:size, height:size, borderRadius:"50%", background:bg, flexShrink:0,
      display:"flex", alignItems:"center", justifyContent:"center",
      fontSize:size*0.38, fontWeight:700, color:"#fff",
      boxShadow:`0 2px 12px ${role==="admin"?"rgba(192,132,252,0.45)":"rgba(232,121,160,0.45)"}` }}>
      {name?.[0] || "م"}
    </div>
  );
};

const Chip = ({ label, type="default" }) => {
  const map = {
    confirmed: { bg:"rgba(110,207,160,0.15)", color:T.green,  border:"rgba(110,207,160,0.3)" },
    pending:   { bg:"rgba(240,176,96,0.15)",  color:T.amber,  border:"rgba(240,176,96,0.3)"  },
    cancelled: { bg:"rgba(240,112,128,0.15)", color:T.red,    border:"rgba(240,112,128,0.3)" },
    admin:     { bg:"rgba(192,132,252,0.15)", color:T.purple, border:"rgba(192,132,252,0.3)" },
    staff:     { bg:T.roseLight, color:T.rose, border:T.roseMid },
    default:   { bg:T.blush, color:T.textSoft, border:T.border },
  };
  const s = map[type]||map.default;
  return (
    <span style={{ background:s.bg, color:s.color, border:`1px solid ${s.border}`,
      fontSize:11, padding:"3px 11px", borderRadius:20, fontWeight:600, whiteSpace:"nowrap" }}>
      {label}
    </span>
  );
};

const StatCard = ({ label, value, sub, icon, color, delay=0 }) => (
  <div className="card-lift glass fade-up" style={{ animationDelay:`${delay}s`,
    background:"rgba(255,255,255,0.05)",
    borderRadius:18,
    border:`1px solid rgba(255,255,255,0.1)`,
    padding:"22px 20px",
    boxShadow:`0 4px 24px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.08)`,
    position:"relative", overflow:"hidden" }}>
    <div style={{ position:"absolute", top:-24, left:-24, width:90, height:90,
      borderRadius:"50%", background:`${color}18`, filter:"blur(20px)" }}/>
    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", position:"relative" }}>
      <div>
        <div style={{ color:T.muted, fontSize:12, marginBottom:10, fontWeight:500 }}>{label}</div>
        <div style={{ color:T.text, fontSize:28, fontWeight:700, lineHeight:1 }}>{value}</div>
        {sub && <div style={{ color, fontSize:11, marginTop:6, fontWeight:600 }}>{sub}</div>}
      </div>
      <div style={{ width:46, height:46, borderRadius:14,
        background:`linear-gradient(135deg,${color}25,${color}12)`,
        border:`1px solid ${color}30`,
        display:"flex", alignItems:"center", justifyContent:"center",
        boxShadow:`0 4px 16px ${color}20` }}>
        <Icon d={icon} color={color} size={19}/>
      </div>
    </div>
  </div>
);

// ─── MODAL WRAPPER ────────────────────────────────────────────────────
const Modal = ({ title, onClose, children, width=390 }) => (
  <div className="fade-in" style={{ position:"fixed", inset:0,
    background:"rgba(10,4,16,0.7)", display:"flex",
    alignItems:"center", justifyContent:"center",
    zIndex:3000, direction:"rtl", backdropFilter:"blur(12px)" }}>
    <div className="fade-up glass" style={{
      background:"rgba(30,17,40,0.85)",
      borderRadius:22, padding:"28px", width,
      border:"1px solid rgba(232,121,160,0.2)",
      boxShadow:"0 32px 80px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.08)" }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:22 }}>
        <span style={{ color:T.text, fontWeight:700, fontSize:16 }}>{title}</span>
        <button onClick={onClose} style={{ background:"none", border:"none",
          color:T.muted, cursor:"pointer", fontSize:18, lineHeight:1,
          width:30, height:30, display:"flex", alignItems:"center", justifyContent:"center",
          borderRadius:"50%", transition:"all 0.2s" }}
          onMouseEnter={e=>{ e.currentTarget.style.background="rgba(232,121,160,0.15)"; e.currentTarget.style.color=T.rose; }}
          onMouseLeave={e=>{ e.currentTarget.style.background="none"; e.currentTarget.style.color=T.muted; }}>✕</button>
      </div>
      {children}
    </div>
  </div>
);

const Field = ({ label, children }) => (
  <div>
    <div style={{ color:T.textSoft, fontSize:12, marginBottom:6, fontWeight:500 }}>{label}</div>
    {children}
  </div>
);

const iStyle = (err=false) => ({
  width:"100%",
  background: err ? "rgba(240,112,128,0.1)" : "rgba(255,255,255,0.06)",
  border:`1px solid ${err ? "rgba(240,112,128,0.4)" : "rgba(255,255,255,0.1)"}`,
  borderRadius:10, padding:"10px 14px", color:T.text, fontSize:13,
  outline:"none", direction:"rtl", boxSizing:"border-box", fontFamily:"inherit",
  transition:"all 0.2s",
});

const BtnPrimary = ({ onClick, children, disabled, full, style={} }) => (
  <button onClick={onClick} disabled={disabled} className="btn-rose" style={{
    padding:"11px 22px",
    background: disabled
      ? "rgba(232,121,160,0.3)"
      : `linear-gradient(135deg,${T.rose},${T.roseDark})`,
    border:"none", borderRadius:12, color:"#fff", fontFamily:"inherit",
    fontSize:13, fontWeight:600, cursor: disabled?"default":"pointer",
    width: full?"100%":"auto",
    boxShadow: disabled?"none":`0 4px 20px rgba(232,121,160,0.4)`, ...style }}>
    {children}
  </button>
);

const BtnGhost = ({ onClick, children, style={} }) => (
  <button onClick={onClick} className="btn-ghost" style={{
    padding:"11px 22px", background:"rgba(255,255,255,0.05)",
    border:"1px solid rgba(255,255,255,0.12)", borderRadius:12,
    color:T.textSoft, fontFamily:"inherit", fontSize:13, cursor:"pointer", ...style }}>
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
    <div style={{ minHeight:"100vh", background:T.bg, display:"flex",
      alignItems:"center", justifyContent:"center",
      fontFamily:"'Cairo',sans-serif", direction:"rtl",
      position:"relative", overflow:"hidden" }}>
      <style>{GLOBAL_CSS}</style>

      {/* Decorative glows */}
      <div style={{ position:"absolute", inset:0, pointerEvents:"none" }}>
        <div style={{ position:"absolute", top:"-20%", right:"-10%", width:600, height:600, borderRadius:"50%",
          background:"radial-gradient(circle, rgba(232,121,160,0.2) 0%, transparent 65%)", filter:"blur(40px)" }}/>
        <div style={{ position:"absolute", bottom:"-15%", left:"-10%", width:500, height:500, borderRadius:"50%",
          background:"radial-gradient(circle, rgba(192,132,252,0.18) 0%, transparent 65%)", filter:"blur(40px)" }}/>
        <div style={{ position:"absolute", top:"35%", left:"10%", width:300, height:300, borderRadius:"50%",
          background:"radial-gradient(circle, rgba(232,121,160,0.12) 0%, transparent 70%)", filter:"blur(30px)" }}/>
        {["20%","45%","70%","85%","30%"].map((l,i)=>(
          <div key={i} style={{ position:"absolute", top:`${15+i*15}%`, left:l,
            width:6+i*2, height:6+i*2, borderRadius:"50%",
            background:`rgba(232,121,160,${0.15+i*0.06})`,
            animation:`float ${3+i*0.5}s ease-in-out infinite`,
            animationDelay:`${i*0.4}s`, filter:"blur(1px)" }}/>
        ))}
      </div>

      <div className="fade-up" style={{ width:400, position:"relative", zIndex:1 }}>
        {/* Logo */}
        <div style={{ textAlign:"center", marginBottom:32 }}>
          <div style={{ position:"relative", display:"inline-block", marginBottom:16 }}>
            <div style={{ width:76, height:76, borderRadius:24,
              background:`linear-gradient(135deg,${T.rose},${T.roseDark})`,
              display:"flex", alignItems:"center", justifyContent:"center",
              fontSize:34, boxShadow:`0 12px 40px rgba(232,121,160,0.5), 0 0 60px rgba(232,121,160,0.2)`,
              animation:"float 4s ease-in-out infinite" }}>✨</div>
            <div style={{ position:"absolute", inset:-5, borderRadius:28,
              border:"2px solid rgba(232,121,160,0.3)", animation:"float 4s ease-in-out infinite" }}/>
          </div>
          <div style={{ color:T.text, fontSize:32, fontWeight:800, letterSpacing:3 }}>لمسة</div>
          <div style={{ color:T.muted, fontSize:13, marginTop:6, letterSpacing:0.5 }}>
            لوحة تحكم الصالون
          </div>
        </div>

        {/* Card */}
        <div className="glass" style={{
          background:"rgba(30,17,40,0.75)",
          borderRadius:24, padding:"32px",
          border:"1px solid rgba(232,121,160,0.2)",
          boxShadow:"0 24px 64px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.08)",
          animation: shake?"shake 0.4s ease":"none" }}>

          <div style={{ display:"flex", flexDirection:"column", gap:16, marginBottom:22 }}>
            <Field label="اسم المستخدم">
              <input value={username} onChange={e=>{setUsername(e.target.value);setError("");}}
                onKeyDown={e=>e.key==="Enter"&&handle()}
                placeholder="أدخلي اسم المستخدم"
                style={iStyle(!!error&&!username)}
                onFocus={e=>{ e.target.style.borderColor=T.rose; e.target.style.background="rgba(255,255,255,0.1)"; e.target.style.boxShadow=`0 0 0 3px rgba(232,121,160,0.2)`; }}
                onBlur={e=>{ e.target.style.borderColor="rgba(255,255,255,0.1)"; e.target.style.background="rgba(255,255,255,0.06)"; e.target.style.boxShadow="none"; }}/>
            </Field>
            <Field label="كلمة المرور">
              <div style={{ position:"relative" }}>
                <input type={showPwd?"text":"password"} value={password}
                  onChange={e=>{setPassword(e.target.value);setError("");}}
                  onKeyDown={e=>e.key==="Enter"&&handle()}
                  placeholder="أدخلي كلمة المرور"
                  style={{...iStyle(!!error&&username&&!password), paddingLeft:40}}
                  onFocus={e=>{ e.target.style.borderColor=T.rose; e.target.style.background="#fff"; e.target.style.boxShadow=`0 0 0 3px ${T.rose}15`; }}
                  onBlur={e=>{ e.target.style.borderColor=T.border; e.target.style.background=T.blush; e.target.style.boxShadow="none"; }}/>
                <button onClick={()=>setShowPwd(!showPwd)} style={{
                  position:"absolute", left:12, top:"50%", transform:"translateY(-50%)",
                  background:"none", border:"none", cursor:"pointer", padding:0, color:T.muted }}>
                  <Icon d={showPwd?IC.eyeoff:IC.eye} size={15} color={T.muted}/>
                </button>
              </div>
            </Field>
            {error && (
              <div style={{ color:T.red, fontSize:12,
                background:"rgba(240,112,128,0.12)",
                padding:"9px 14px", borderRadius:10, border:"1px solid rgba(240,112,128,0.3)",
                display:"flex", alignItems:"center", gap:6 }}>
                <Icon d={IC.warn} size={13} color={T.red}/> {error}
              </div>
            )}
          </div>

          <BtnPrimary onClick={handle} disabled={loading} full>
            {loading ? "جاري التحقق..." : "✨ دخول"}
          </BtnPrimary>
        </div>

        <div style={{ textAlign:"center", marginTop:18, color:T.muted, fontSize:11, display:"flex", alignItems:"center", justifyContent:"center", gap:6 }}>
          <Icon d={IC.heart} size={11} color="rgba(232,121,160,0.5)"/>
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
      <div style={{ display:"flex", flexDirection:"column", gap:12, marginBottom:18 }}>
        <Field label="كلمة مرور المدير">
          <div style={{ position:"relative" }}>
            <input type={showPwd?"text":"password"} value={pwd}
              onChange={e=>{setPwd(e.target.value);setError(false);}}
              onKeyDown={e=>e.key==="Enter"&&handle()}
              placeholder="أدخل كلمة المرور" style={{...iStyle(error),paddingLeft:40}} autoFocus
              onFocus={e=>{ e.target.style.borderColor=T.rose; e.target.style.background="rgba(255,255,255,0.1)"; e.target.style.boxShadow="0 0 0 3px rgba(232,121,160,0.2)"; }}
              onBlur={e=>{ e.target.style.borderColor=error?"rgba(240,112,128,0.4)":"rgba(255,255,255,0.1)"; e.target.style.background="rgba(255,255,255,0.06)"; e.target.style.boxShadow="none"; }}/>
            <button onClick={()=>setShowPwd(!showPwd)} style={{
              position:"absolute", left:12, top:"50%", transform:"translateY(-50%)",
              background:"none", border:"none", cursor:"pointer", padding:0 }}>
              <Icon d={showPwd?IC.eyeoff:IC.eye} size={15} color={T.muted}/>
            </button>
          </div>
        </Field>
        {error && <div style={{ color:T.red, fontSize:12 }}>كلمة المرور غلط</div>}
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
      <p style={{ color:T.textSoft, fontSize:13, marginBottom:20, lineHeight:1.8 }}>{message}</p>
      <div style={{ display:"flex", gap:10 }}>
        <button onClick={onConfirm} className="btn-rose" style={{
          flex:1, padding:"10px",
          background:`linear-gradient(135deg,${T.red},#A03040)`,
          border:"none", borderRadius:10, color:"#fff",
          fontFamily:"inherit", fontSize:13, cursor:"pointer" }}>
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
  const fi = (f) => ({...iStyle(), onFocus:e=>{e.target.style.borderColor=T.rose;e.target.style.background="rgba(255,255,255,0.1)";e.target.style.boxShadow="0 0 0 3px rgba(232,121,160,0.2)";}, onBlur:e=>{e.target.style.borderColor="rgba(255,255,255,0.1)";e.target.style.background="rgba(255,255,255,0.06)";e.target.style.boxShadow="none";}});

  return (
    <Modal title="✨ إضافة حجز جديد" onClose={onClose} width={410}>
      <div style={{ display:"flex", flexDirection:"column", gap:14, marginBottom:18 }}>
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
            style={{...iStyle(),cursor:"pointer"}}>
            {SERVICES.map(s=><option key={s.name} value={s.name}>{s.icon} {s.name} — {s.price} ريال</option>)}
          </select>
        </Field>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
          <Field label="التاريخ *">
            <select value={form.date} onChange={e=>setForm({...form,date:e.target.value})}
              style={{...iStyle(),cursor:"pointer"}}>
              <option>اليوم</option><option>بكره</option><option>بعد بكره</option>
            </select>
          </Field>
          <Field label="الوقت *">
            <input value={form.time} onChange={e=>setForm({...form,time:e.target.value})}
              placeholder="3:00 م" style={iStyle(!form.time&&!!error)} {...fi()}/>
          </Field>
        </div>
        {error && <div style={{ color:T.red, fontSize:12 }}>{error}</div>}
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
    <div className="row-hover" style={{ display:"grid", gridTemplateColumns:"1.4fr 1fr 1.2fr 0.8fr 0.8fr auto",
      alignItems:"center", padding:"13px 20px", borderBottom:"1px solid rgba(255,255,255,0.05)", background:"transparent" }}>
      <div style={{ display:"flex", alignItems:"center", gap:10 }}>
        <Avatar name={b.name} role="staff" size={34}/>
        <div>
          <div style={{ color:T.text, fontSize:13, fontWeight:500 }}>{b.name}</div>
          {phone && <div style={{ color:T.muted, fontSize:11, display:"flex", alignItems:"center", gap:3, marginTop:1 }}>
            <Icon d={IC.phone} size={10} color={T.muted}/>{phone}
          </div>}
        </div>
      </div>
      <div style={{ color:T.textSoft, fontSize:13 }}>{b.service}</div>
      <div style={{ color:T.muted, fontSize:12 }}>{b.date} — {b.time}</div>
      <div style={{ color:T.rose, fontWeight:600, fontSize:13 }}>{b.price}</div>
      <Chip label={s.label} type={s.type}/>
      <div>
        {b.status!=="cancelled"&&(
          <button onClick={()=>onCancel(b.id,b.name)} className="btn-ghost" style={{
            background:"rgba(240,112,128,0.1)", border:"1px solid rgba(240,112,128,0.25)", borderRadius:8,
            padding:"4px 10px", color:T.red, fontSize:11, cursor:"pointer" }}>
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
    const blob=new Blob(["\uFEFF"+csv],{type:"text/csv;charset=utf-8"});
    const url=URL.createObjectURL(blob);
    const a=document.createElement("a");a.href=url;a.download="تقرير-لمسة.csv";a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fade-up">
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:24 }}>
        <div className="glass" style={{ display:"flex", gap:4, background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:12, padding:4 }}>
          {[{id:"daily",l:"يومي"},{id:"weekly",l:"أسبوعي"},{id:"monthly",l:"شهري"}].map(p=>(
            <button key={p.id} onClick={()=>setPeriod(p.id)} style={{
              padding:"7px 16px", borderRadius:8, border:"none", cursor:"pointer",
              fontFamily:"inherit", fontSize:12, transition:"all 0.2s",
              background: period===p.id?`linear-gradient(135deg,${T.rose},${T.roseDark})`:"transparent",
              color: period===p.id?"#fff":T.textSoft, fontWeight:period===p.id?600:400 }}>
              {p.l}
            </button>
          ))}
        </div>
        <div style={{ display:"flex", gap:8 }}>
          <button onClick={exportCSV} className="btn-ghost" style={{
            display:"flex", alignItems:"center", gap:6, padding:"8px 16px",
            background:"rgba(110,207,160,0.08)", border:"1px solid rgba(110,207,160,0.2)", borderRadius:10,
            color:T.green, fontFamily:"inherit", fontSize:12, cursor:"pointer" }}>
            <Icon d={IC.dl} size={14} color={T.green}/> Excel
          </button>
          <button onClick={()=>window.print()} className="btn-ghost" style={{
            display:"flex", alignItems:"center", gap:6, padding:"8px 16px",
            background:"rgba(240,112,128,0.08)", border:"1px solid rgba(240,112,128,0.2)", borderRadius:10,
            color:T.red, fontFamily:"inherit", fontSize:12, cursor:"pointer" }}>
            <Icon d={IC.dl} size={14} color={T.red}/> PDF
          </button>
        </div>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:14, marginBottom:22 }}>
        <StatCard label="إجمالي المواعيد"  value={bookings.length}               sub="كل المواعيد"           icon={IC.cal}   color={T.rose}   delay={0}/>
        <StatCard label="مواعيد مكتملة"    value={completed.length}              sub={completed.length+" موعد"}  icon={IC.ok}    color={T.green}  delay={.05}/>
        <StatCard label="مواعيد ملغية"     value={cancelled.length}              sub={cancelled.length+" موعد"}  icon={IC.warn}  color={T.red}    delay={.1}/>
        <StatCard label="إجمالي المبالغ"   value={totalRevenue.toLocaleString()+" ر"} sub="من المكتملة"        icon={IC.trend} color={T.purple} delay={.15}/>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"1.4fr 1fr", gap:16, marginBottom:16 }}>
        <div className="glass" style={{ background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:16, padding:"20px 24px" }}>
          <div style={{ color:T.text, fontWeight:600, fontSize:14, marginBottom:18 }}>💎 الخدمات الأكثر طلباً</div>
          {sorted.length===0 ? <div style={{ textAlign:"center",color:T.muted,fontSize:13,padding:20 }}>لا توجد بيانات</div>
          : sorted.map(([name,stats])=>(
            <div key={name} style={{ marginBottom:14 }}>
              <div style={{ display:"flex", justifyContent:"space-between", marginBottom:6 }}>
                <span style={{ color:T.textSoft, fontSize:13 }}>{name}</span>
                <div style={{ display:"flex", gap:12 }}>
                  <span style={{ color:T.green, fontSize:11, fontWeight:600 }}>{stats.count} حجز</span>
                  <span style={{ color:T.purple, fontSize:11, fontWeight:600 }}>{stats.revenue.toLocaleString()} ر</span>
                </div>
              </div>
              <div style={{ height:6, background:"rgba(255,255,255,0.06)", borderRadius:3 }}>
                <div style={{ height:"100%", borderRadius:3,
                  width:Math.round((stats.count/maxC)*100)+"%",
                  background:`linear-gradient(90deg,rgba(232,121,160,0.5),${T.rose})`,
                  transition:"width 1s ease" }}/>
              </div>
            </div>
          ))}
        </div>

        <div className="glass" style={{ background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:16, padding:"20px 24px" }}>
          <div style={{ color:T.text, fontWeight:600, fontSize:14, marginBottom:18 }}>📊 الإحصائيات</div>
          <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
            {[
              { label:"معدل الإكمال", value:bookings.length?Math.round((completed.length/bookings.length)*100):0, color:T.green },
              { label:"معدل الإلغاء", value:bookings.length?Math.round((cancelled.length/bookings.length)*100):0, color:T.red },
            ].map(item=>(
              <div key={item.label}>
                <div style={{ display:"flex", justifyContent:"space-between", marginBottom:6 }}>
                  <span style={{ color:T.textSoft, fontSize:13 }}>{item.label}</span>
                  <span style={{ color:item.color, fontWeight:600, fontSize:14 }}>{item.value}%</span>
                </div>
                <div style={{ height:6, background:"rgba(255,255,255,0.06)", borderRadius:3 }}>
                  <div style={{ height:"100%", borderRadius:3, width:item.value+"%",
                    background:`linear-gradient(90deg,${item.color}60,${item.color})`, transition:"width 1s ease" }}/>
                </div>
              </div>
            ))}
            <div style={{ paddingTop:14, borderTop:"1px solid rgba(255,255,255,0.07)" }}>
              {[
                { l:"العملاء الفريدين", v:uniqueClients, c:T.purple },
                { l:"متوسط قيمة الحجز", v:(completed.length?Math.round(totalRevenue/completed.length):0).toLocaleString()+" ر", c:T.rose },
                { l:"إجمالي المبالغ", v:totalRevenue.toLocaleString()+" ر", c:T.roseDark },
              ].map(item=>(
                <div key={item.l} style={{ display:"flex", justifyContent:"space-between", marginBottom:8 }}>
                  <span style={{ color:T.textSoft, fontSize:13 }}>{item.l}</span>
                  <span style={{ color:item.c, fontWeight:600 }}>{item.v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="glass" style={{ background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:16, overflow:"hidden" }}>
        <div style={{ padding:"14px 20px", borderBottom:"1px solid rgba(255,255,255,0.07)",
          display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <span style={{ color:T.text, fontWeight:600, fontSize:14 }}>جدول المواعيد التفصيلي</span>
          <span style={{ color:T.muted, fontSize:12 }}>{bookings.length} موعد</span>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr 1fr 1fr",
          padding:"10px 20px", background:"rgba(232,121,160,0.06)", borderBottom:"1px solid rgba(255,255,255,0.07)" }}>
          {["العميلة","الخدمة","التاريخ","المبلغ","الحالة"].map(h=>(
            <div key={h} style={{ color:T.muted, fontSize:11, fontWeight:600 }}>{h}</div>
          ))}
        </div>
        <div style={{ maxHeight:280, overflow:"auto" }}>
          {bookings.length===0 ? <div style={{ padding:30,textAlign:"center",color:T.muted,fontSize:13 }}>لا توجد بيانات</div>
          : bookings.map(b=>(
            <div key={b.id} className="row-hover" style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr 1fr 1fr",
              padding:"12px 20px", borderBottom:"1px solid rgba(255,255,255,0.05)", background:"transparent" }}>
              <div style={{ color:T.text, fontSize:13 }}>{b.name}</div>
              <div style={{ color:T.textSoft, fontSize:12 }}>{b.service}</div>
              <div style={{ color:T.muted, fontSize:12 }}>{b.date} {b.time}</div>
              <div style={{ color:T.rose, fontWeight:500, fontSize:13 }}>{b.price}</div>
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

  const fi = { onFocus:e=>{e.target.style.borderColor=T.rose;e.target.style.background="rgba(255,255,255,0.1)";e.target.style.boxShadow="0 0 0 3px rgba(232,121,160,0.2)";}, onBlur:e=>{e.target.style.borderColor="rgba(255,255,255,0.1)";e.target.style.background="rgba(255,255,255,0.06)";e.target.style.boxShadow="none";} };

  return (
    <div className="fade-up">
      {showForm && (
        <Modal title={editUser?"✏️ تعديل مستخدم":"✨ إضافة مستخدم"} onClose={()=>setShowForm(false)} width={380}>
          <div style={{ display:"flex", flexDirection:"column", gap:14, marginBottom:18 }}>
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
                  <Icon d={showPwd?IC.eyeoff:IC.eye} size={15} color={T.muted}/>
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
            {formErr && <div style={{ color:T.red, fontSize:12 }}>{formErr}</div>}
          </div>
          <div style={{ display:"flex", gap:10 }}>
            <BtnPrimary onClick={handleSave} disabled={saving} style={{flex:1}}>{saving?"جاري الحفظ...":"حفظ"}</BtnPrimary>
            <BtnGhost onClick={()=>setShowForm(false)} style={{flex:1}}>إلغاء</BtnGhost>
          </div>
        </Modal>
      )}

      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
        <span style={{ color:T.muted, fontSize:13 }}>{users.length} مستخدم</span>
        <BtnPrimary onClick={openAdd}>+ إضافة مستخدم</BtnPrimary>
      </div>

      <div className="glass" style={{ background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:16, overflow:"hidden" }}>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr auto",
          padding:"12px 20px", background:"rgba(232,121,160,0.06)", borderBottom:"1px solid rgba(255,255,255,0.07)" }}>
          {["المستخدم","الصلاحية","تاريخ الإضافة",""].map(h=>(
            <div key={h} style={{ color:T.muted, fontSize:11, fontWeight:600 }}>{h}</div>
          ))}
        </div>
        {loading ? <div style={{ padding:30,textAlign:"center",color:T.muted }}>جاري التحميل...</div>
        : users.map(u=>(
          <div key={u.id} className="row-hover" style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr auto",
            alignItems:"center", padding:"13px 20px", borderBottom:"1px solid rgba(255,255,255,0.05)", background:"transparent" }}>
            <div style={{ display:"flex", alignItems:"center", gap:10 }}>
              <Avatar name={u.username} role={u.role} size={34}/>
              <span style={{ color:T.text, fontSize:13, fontWeight:500 }}>{u.username}</span>
            </div>
            <Chip label={u.role==="admin"?"مدير":"موظفة"} type={u.role==="admin"?"admin":"staff"}/>
            <span style={{ color:T.muted, fontSize:12 }}>{new Date(u.created_at).toLocaleDateString("ar-SA")}</span>
            <div style={{ display:"flex", gap:8 }}>
              <button onClick={()=>openEdit(u)} className="btn-ghost" style={{
                background:"rgba(232,121,160,0.1)", border:"1px solid rgba(232,121,160,0.25)", borderRadius:8,
                padding:"4px 10px", color:T.rose, fontSize:11, cursor:"pointer" }}>تعديل</button>
              <button onClick={()=>handleDelete(u)} className="btn-ghost" style={{
                background:"rgba(240,112,128,0.1)", border:"1px solid rgba(240,112,128,0.25)", borderRadius:8,
                padding:"4px 10px", color:T.red, fontSize:11, cursor:"pointer" }}>حذف</button>
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

  return (
    <div style={{ minHeight:"100vh", background:T.bg, fontFamily:"'Cairo',sans-serif", direction:"rtl", color:T.text }}>
      <style>{GLOBAL_CSS}</style>

      {showAdminLogin && <AdminLoginModal onClose={()=>setShowAdminLogin(false)} onSuccess={()=>setIsAdmin(true)}/>}
      {showAdd && <AddBookingModal onClose={()=>setShowAdd(false)} onAdd={handleAddBooking}/>}
      {confirm && <ConfirmDialog message={`هل تريدين إلغاء موعد ${confirm.name}؟`} onConfirm={confirmCancel} onCancel={()=>setConfirm(null)}/>}

      {/* Ambient background glows */}
      <div style={{ position:"fixed", inset:0, pointerEvents:"none", zIndex:0 }}>
        <div style={{ position:"absolute", top:"-10%", right:"15%", width:500, height:500, borderRadius:"50%",
          background:"radial-gradient(circle, rgba(232,121,160,0.12) 0%, transparent 65%)", filter:"blur(60px)" }}/>
        <div style={{ position:"absolute", bottom:"-5%", left:"10%", width:400, height:400, borderRadius:"50%",
          background:"radial-gradient(circle, rgba(192,132,252,0.1) 0%, transparent 65%)", filter:"blur(60px)" }}/>
      </div>

      {/* Notifications */}
      <div style={{ position:"fixed", top:20, left:"50%", transform:"translateX(-50%)",
        zIndex:2000, display:"flex", flexDirection:"column", gap:8, alignItems:"center", pointerEvents:"none" }}>
        {notifs.map(n=>(
          <div key={n.id} className="fade-up glass" style={{
            background:"rgba(30,17,40,0.85)",
            border:`1px solid ${n.type==="success"?"rgba(110,207,160,0.3)":n.type==="cancel"?"rgba(240,112,128,0.3)":"rgba(232,121,160,0.3)"}`,
            color:n.type==="success"?T.green:n.type==="cancel"?T.red:T.rose,
            padding:"10px 20px", borderRadius:50, fontSize:13, whiteSpace:"nowrap",
            boxShadow:"0 8px 24px rgba(0,0,0,0.4)" }}>
            {n.msg}
          </div>
        ))}
      </div>

      {/* Sidebar */}
      <div className="glass" style={{ position:"fixed", top:0, right:0, height:"100vh", width:234,
        background:"rgba(20,10,28,0.8)",
        borderLeft:"1px solid rgba(255,255,255,0.07)",
        display:"flex", flexDirection:"column", zIndex:100,
        boxShadow:"-4px 0 40px rgba(0,0,0,0.4)" }}>

        {/* Logo */}
        <div style={{ padding:"22px 18px 18px", borderBottom:"1px solid rgba(255,255,255,0.07)" }}>
          <div style={{ display:"flex", alignItems:"center", gap:12 }}>
            <div style={{ width:44, height:44, borderRadius:14,
              background:`linear-gradient(135deg,${T.rose},${T.roseDark})`,
              display:"flex", alignItems:"center", justifyContent:"center",
              fontSize:20, boxShadow:`0 6px 20px rgba(232,121,160,0.45)`,
              animation:"float 4s ease-in-out infinite" }}>✨</div>
            <div>
              <div style={{ color:T.text, fontWeight:800, fontSize:20, letterSpacing:1 }}>لمسة</div>
              <div style={{ color:T.muted, fontSize:11 }}>صالون وسبا</div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex:1, padding:"14px 10px", display:"flex", flexDirection:"column", gap:2 }}>
          {tabs.map(t=>(
            <button key={t.id} className="nav-btn" onClick={()=>{
              if(t.adminOnly&&!isAdmin){ setShowAdminLogin(true); return; }
              setActiveTab(t.id);
            }} style={{
              display:"flex", alignItems:"center", gap:10, padding:"10px 12px",
              borderRadius:12, textAlign:"right",
              background: activeTab===t.id?"rgba(232,121,160,0.15)":"transparent",
              color: activeTab===t.id?T.rose:T.textSoft,
              fontFamily:"inherit", fontSize:13,
              fontWeight: activeTab===t.id?700:400,
              borderRight: `3px solid ${activeTab===t.id?T.rose:"transparent"}`,
              boxShadow: activeTab===t.id?"inset 0 0 20px rgba(232,121,160,0.05)":"none" }}>
              <Icon d={t.ip} size={16} color={activeTab===t.id?T.rose:T.muted}/>
              {t.label}
              {t.adminOnly&&!isAdmin&&<Icon d={IC.lock} size={11} color={T.muted}/>}
              {t.id==="bookings"&&pending.length>0&&(
                <span style={{ marginRight:"auto", background:"rgba(232,121,160,0.2)", color:T.rose,
                  fontSize:10, padding:"1px 7px", borderRadius:10, fontWeight:700 }}>{pending.length}</span>
              )}
            </button>
          ))}
        </nav>

        {/* User */}
        <div style={{ padding:"12px 10px", borderTop:"1px solid rgba(255,255,255,0.07)" }}>
          <div style={{ display:"flex", alignItems:"center", gap:10, padding:"10px 12px",
            background:"rgba(255,255,255,0.05)", borderRadius:12, marginBottom:8,
            border:"1px solid rgba(255,255,255,0.08)" }}>
            <Avatar name={username} role={isAdmin?"admin":"staff"} size={32}/>
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ color:T.text, fontSize:12, fontWeight:600,
                overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{username||"مستخدم"}</div>
              <div style={{ color:T.muted, fontSize:11 }}>{isAdmin?"مدير":"موظفة"}</div>
            </div>
            {isAdmin && <Icon d={IC.shield} size={13} color={T.purple}/>}
          </div>

          <div style={{ display:"flex", gap:6 }}>
            <button onClick={fetchBookings} disabled={syncing} className="btn-ghost" style={{
              flex:1, display:"flex", alignItems:"center", justifyContent:"center", gap:5,
              padding:"8px", background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.08)",
              borderRadius:9, color:T.textSoft, fontFamily:"inherit", fontSize:11, cursor:"pointer" }}>
              <Icon d={IC.refresh} size={13} color={T.muted}
                style={{ animation:syncing?"spin 1s linear infinite":"none" }}/>
              {syncing?"...":"تحديث"}
            </button>
            <button onClick={onLogout} className="btn-ghost" style={{
              flex:1, display:"flex", alignItems:"center", justifyContent:"center", gap:5,
              padding:"8px", background:"rgba(240,112,128,0.1)", border:"1px solid rgba(240,112,128,0.25)",
              borderRadius:9, color:T.red, fontFamily:"inherit", fontSize:11, cursor:"pointer" }}>
              <Icon d={IC.out} size={13} color={T.red}/> خروج
            </button>
          </div>

          {lastSync && (
            <div style={{ textAlign:"center", color:T.muted, fontSize:10, marginTop:8,
              display:"flex", alignItems:"center", justifyContent:"center", gap:4 }}>
              <div style={{ width:5, height:5, borderRadius:"50%", background:T.green, animation:"pulse 2s infinite" }}/>
              {lastSync.toLocaleTimeString("ar-SA",{hour:"2-digit",minute:"2-digit"})}
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div style={{ marginRight:234, padding:"26px 30px", minHeight:"100vh", position:"relative", zIndex:1 }}>
        {/* Topbar */}
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:26 }}>
          <div>
            <h1 style={{ fontSize:24, fontWeight:800, color:T.text, letterSpacing:0.5 }}>
              {tabs.find(t=>t.id===activeTab)?.label||"لوحة التحكم"}
            </h1>
            <div style={{ color:T.muted, fontSize:12, marginTop:3 }}>
              {new Date().toLocaleDateString("ar-SA",{weekday:"long",year:"numeric",month:"long",day:"numeric"})}
            </div>
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            {isAdmin && (
              <div style={{ display:"flex", alignItems:"center", gap:5, padding:"6px 12px",
                background:"rgba(192,132,252,0.12)", border:"1px solid rgba(192,132,252,0.25)", borderRadius:10,
                color:T.purple, fontSize:11, fontWeight:600 }}>
                <Icon d={IC.shield} size={12} color={T.purple}/> وضع المدير
              </div>
            )}
            <div style={{ display:"flex", alignItems:"center", gap:5, padding:"6px 12px",
              background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:10,
              color:T.muted, fontSize:12 }}>
              <Icon d={IC.bell} size={13} color={T.muted}/>{pending.length} معلق
            </div>
            <BtnPrimary onClick={()=>setShowAdd(true)} style={{
              display:"flex", alignItems:"center", gap:6, padding:"9px 16px" }}>
              <Icon d={IC.plus} size={14} color="#fff"/> إضافة حجز
            </BtnPrimary>
          </div>
        </div>

        {/* OVERVIEW */}
        {activeTab==="overview"&&(
          <div>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:14, marginBottom:22 }}>
              <StatCard label="حجوزات اليوم"  value={today.length}     sub={today.length+" موعد"}       icon={IC.cal}   color={T.rose}   delay={0}/>
              <StatCard label="إجمالي مؤكدة"  value={confirmed.length} sub="مكتملة"                    icon={IC.ok}    color={T.green}  delay={.05}/>
              <StatCard label="في الانتظار"   value={pending.length}   sub="تحتاج تأكيد"               icon={IC.clock} color={T.amber}  delay={.1}/>
              <StatCard label="ملغية"          value={cancelled.length} sub="إجمالي الإلغاءات"          icon={IC.warn}  color={T.red}    delay={.15}/>
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"1.4fr 1fr", gap:16 }}>
              <div className="fade-up glass" style={{
                background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)",
                borderRadius:18, overflow:"hidden", boxShadow:"0 8px 32px rgba(0,0,0,0.3)",
                animationDelay:"0.2s" }}>
                <div style={{ padding:"16px 20px", borderBottom:"1px solid rgba(255,255,255,0.07)",
                  display:"flex", justifyContent:"space-between", alignItems:"center",
                  background:"rgba(232,121,160,0.06)" }}>
                  <span style={{ color:T.text, fontWeight:600, fontSize:14 }}>💕 مواعيد اليوم</span>
                  <Chip label={today.length+" موعد"} type="default"/>
                </div>
                {today.length===0 ? (
                  <div style={{ padding:40, textAlign:"center", color:T.muted, fontSize:13 }}>
                    <div style={{ fontSize:36, marginBottom:8 }}>🌸</div>
                    ما في مواعيد اليوم
                  </div>
                ) : today.map(b=>(
                  <div key={b.id} className="row-hover" style={{ display:"flex", alignItems:"center",
                    gap:12, padding:"12px 20px", borderBottom:"1px solid rgba(255,255,255,0.05)", background:"transparent" }}>
                    <Avatar name={b.name} role="staff" size={34}/>
                    <div style={{ flex:1 }}>
                      <div style={{ color:T.text, fontSize:13, fontWeight:500 }}>{b.name}</div>
                      <div style={{ color:T.muted, fontSize:11, marginTop:1 }}>{b.service}</div>
                    </div>
                    <div style={{ textAlign:"left" }}>
                      <div style={{ color:T.rose, fontSize:13, fontWeight:600 }}>{b.time}</div>
                      <div style={{ color:T.muted, fontSize:11, marginTop:1 }}>{b.price}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="fade-up glass" style={{
                background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)",
                borderRadius:18, padding:"18px 20px", boxShadow:"0 8px 32px rgba(0,0,0,0.3)",
                animationDelay:"0.25s" }}>
                <div style={{ color:T.text, fontWeight:600, fontSize:14, marginBottom:16 }}>💎 الخدمات الأكثر طلباً</div>
                {SERVICES.slice(0,5).map(s=>{
                  const cnt=bookings.filter(b=>b.service===s.name).length;
                  const mx=Math.max(...SERVICES.map(sv=>bookings.filter(b=>b.service===sv.name).length),1);
                  return(
                    <div key={s.id} style={{ marginBottom:12 }}>
                      <div style={{ display:"flex", justifyContent:"space-between", marginBottom:5 }}>
                        <span style={{ color:T.textSoft, fontSize:12 }}>{s.icon} {s.name}</span>
                        <span style={{ color:s.color, fontSize:12, fontWeight:500 }}>{cnt}</span>
                      </div>
                      <div style={{ height:5, background:"rgba(255,255,255,0.06)", borderRadius:3 }}>
                        <div style={{ height:"100%", borderRadius:3, width:Math.round((cnt/mx)*100)||8+"%",
                          background:`linear-gradient(90deg,rgba(232,121,160,0.5),${T.rose})`, transition:"width 1s ease" }}/>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* BOOKINGS */}
        {activeTab==="bookings"&&(
          <div className="fade-up">
            <div style={{ display:"flex", gap:12, marginBottom:18, alignItems:"center" }}>
              <div className="glass" style={{ display:"flex", alignItems:"center", gap:8, flex:1,
                background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:12, padding:"9px 14px" }}>
                <Icon d={IC.search} size={15} color={T.muted}/>
                <input value={search} onChange={e=>setSearch(e.target.value)}
                  placeholder="ابحثي بالاسم أو الخدمة..."
                  style={{ flex:1, background:"transparent", border:"none", color:T.text,
                    fontSize:13, outline:"none", direction:"rtl", fontFamily:"inherit" }}/>
              </div>
              <div className="glass" style={{ display:"flex", gap:4, background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.08)",
                borderRadius:12, padding:4 }}>
                {[{id:"all",l:"الكل"},{id:"confirmed",l:"مكتملة"},{id:"pending",l:"معلقة"},{id:"cancelled",l:"ملغية"}].map(f=>(
                  <button key={f.id} onClick={()=>setFilter(f.id)} style={{
                    padding:"6px 14px", borderRadius:8, border:"none", cursor:"pointer",
                    fontFamily:"inherit", fontSize:12, transition:"all 0.2s",
                    background: filter===f.id?`linear-gradient(135deg,${T.rose},${T.roseDark})`:"transparent",
                    color: filter===f.id?"#fff":T.textSoft, fontWeight:filter===f.id?600:400 }}>
                    {f.l}
                    {f.id!=="all"&&<span style={{ opacity:.7, fontSize:10, marginRight:3 }}>
                      ({bookings.filter(b=>b.status===f.id).length})
                    </span>}
                  </button>
                ))}
              </div>
            </div>
            <div className="glass" style={{ background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:18, overflow:"hidden",
              boxShadow:"0 8px 32px rgba(0,0,0,0.3)" }}>
              <div style={{ display:"grid", gridTemplateColumns:"1.4fr 1fr 1.2fr 0.8fr 0.8fr auto",
                padding:"12px 20px", background:"rgba(232,121,160,0.06)", borderBottom:"1px solid rgba(255,255,255,0.07)" }}>
                {["العميلة","الخدمة","الموعد","السعر","الحالة",""].map(h=>(
                  <div key={h} style={{ color:T.muted, fontSize:11, fontWeight:600 }}>{h}</div>
                ))}
              </div>
              {filtered.length===0 ? (
                <div style={{ padding:40, textAlign:"center", color:T.muted, fontSize:13 }}>
                  <div style={{ fontSize:32, marginBottom:8 }}>🌸</div>ما في حجوزات
                </div>
              ) : filtered.map(b=><BookingRow key={b.id} b={b} onCancel={handleCancel}/>)}
            </div>
          </div>
        )}

        {/* SERVICES */}
        {activeTab==="services"&&(
          <div className="fade-up" style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:14 }}>
            {SERVICES.map((s,i)=>{
              const cnt=bookings.filter(b=>b.service===s.name&&b.status==="confirmed").length;
              return(
                <div key={s.id} className="card-lift glass fade-up" style={{
                  background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.09)", borderRadius:18,
                  padding:20, boxShadow:"0 8px 32px rgba(0,0,0,0.3)",
                  animationDelay:i*0.05+"s" }}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:14 }}>
                    <div style={{ width:52, height:52, borderRadius:16, fontSize:26,
                      background:`linear-gradient(135deg,${s.color}22,${s.color}0a)`,
                      border:`1px solid ${s.color}30`,
                      boxShadow:`0 4px 16px ${s.color}20`,
                      display:"flex", alignItems:"center", justifyContent:"center" }}>{s.icon}</div>
                    <Chip label={cnt+" حجز"} type="default"/>
                  </div>
                  <div style={{ color:T.text, fontWeight:600, fontSize:14, marginBottom:4 }}>{s.name}</div>
                  <div style={{ color:T.muted, fontSize:12, marginBottom:14 }}>{s.duration} دقيقة</div>
                  <div style={{ paddingTop:12, borderTop:"1px solid rgba(255,255,255,0.07)" }}>
                    <span style={{ color:T.rose, fontWeight:700, fontSize:16 }}>{s.price} ريال</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* REPORTS */}
        {activeTab==="reports"&&(
          isAdmin ? <ReportsPage bookings={bookings}/> : (
            <div style={{ textAlign:"center", padding:60 }}>
              <div style={{ fontSize:52, marginBottom:16 }}>🔐</div>
              <div style={{ color:T.muted, fontSize:14, marginBottom:20 }}>هذه الصفحة للمدير فقط</div>
              <BtnPrimary onClick={()=>setShowAdminLogin(true)}>دخول كمدير</BtnPrimary>
            </div>
          )
        )}

        {/* USERS */}
        {activeTab==="users"&&(
          isAdmin ? <UsersPage/> : (
            <div style={{ textAlign:"center", padding:60 }}>
              <div style={{ fontSize:52, marginBottom:16 }}>🔐</div>
              <div style={{ color:T.muted, fontSize:14, marginBottom:20 }}>هذه الصفحة للمدير فقط</div>
              <BtnPrimary onClick={()=>setShowAdminLogin(true)}>دخول كمدير</BtnPrimary>
            </div>
          )
        )}
      </div>
    </div>
  );
}
