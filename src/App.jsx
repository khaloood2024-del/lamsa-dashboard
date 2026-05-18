import { useState, useEffect, useCallback } from "react";

// ─── CONFIG (غيّر هنا لكل عميل) ──────────────────────────────────────
const CONFIG = {
  businessName: "اسم المنشأة",
  businessType: "منشأتي",
  primaryColor: "#2563EB",
};

const API_URL = "https://lamsa-salon-server-production.up.railway.app";

// ─── DESIGN TOKENS ────────────────────────────────────────────────────
const C = CONFIG.primaryColor;
const T = {
  bg:       "#F8FAFC",
  surface:  "#FFFFFF",
  border:   "#E2E8F0",
  text:     "#0F172A",
  textSoft: "#475569",
  muted:    "#94A3B8",
  accent:   C,
  accentBg: C + "12",
  accentMid:C + "30",
  green:    "#16A34A",
  greenBg:  "#F0FDF4",
  red:      "#DC2626",
  redBg:    "#FEF2F2",
  amber:    "#D97706",
  amberBg:  "#FFFBEB",
  purple:   "#7C3AED",
  purpleBg: "#F5F3FF",
  sidebar:  "#1E293B",
  sideText: "#CBD5E1",
  sideMuted:"#64748B",
  sideBg:   "#0F172A",
};

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@300;400;500;600;700&family=DM+Mono:wght@400;500&display=swap');
  *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }
  body { background:${T.bg}; font-family:'IBM Plex Sans Arabic',sans-serif; }
  ::-webkit-scrollbar { width:5px; }
  ::-webkit-scrollbar-thumb { background:${T.border}; border-radius:4px; }
  @keyframes fadeUp  { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
  @keyframes fadeIn  { from{opacity:0} to{opacity:1} }
  @keyframes spin    { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
  @keyframes shake   { 0%,100%{transform:translateX(0)} 25%{transform:translateX(-5px)} 75%{transform:translateX(5px)} }
  @keyframes pulse   { 0%,100%{opacity:.4} 50%{opacity:1} }
  @keyframes slideIn { from{opacity:0;transform:translateX(16px)} to{opacity:1;transform:translateX(0)} }
  .fu { animation:fadeUp  0.4s cubic-bezier(.22,.68,0,1.2) both; }
  .fi { animation:fadeIn  0.3s ease both; }
  .si { animation:slideIn 0.35s ease both; }
  .t  { transition:all 0.18s ease; }
  .hover-lift:hover { transform:translateY(-2px); box-shadow:0 8px 24px rgba(0,0,0,0.1) !important; }
  .row-h:hover { background:${T.bg} !important; }
  .nav-h:hover { background:rgba(255,255,255,0.06) !important; color:#fff !important; }
  input,select,button { font-family:'IBM Plex Sans Arabic',sans-serif; }
`;

// ─── ICONS ────────────────────────────────────────────────────────────
const Ico = ({ d, size=16, color="currentColor", sw=1.8 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
    <path d={d}/>
  </svg>
);
const I = {
  grid:    "M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z",
  cal:     "M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z",
  box:     "M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z",
  tag:     "M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82zM7 7h.01",
  trend:   "M22 7 13.5 15.5l-5-5L2 17M22 7h-5M22 7v5",
  shield:  "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",
  users:   "M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75",
  ok:      "M20 6 9 17 4 12",
  clock:   "M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2zM12 6v6l4 2",
  bell:    "M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0",
  warn:    "M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0zM12 9v4M12 17h.01",
  dl:      "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3",
  lock:    "M19 11H5a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2zM7 11V7a5 5 0 0 1 10 0v4",
  out:     "M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9",
  search:  "M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z",
  phone:   "M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13.6a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 3h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 10.6a16 16 0 0 0 6 6l.94-.94a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 17z",
  refresh: "M23 4v6h-6M1 20v-6h6M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15",
  plus:    "M12 5v14M5 12h14",
  edit:    "M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z",
  trash:   "M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2",
  eye:     "M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8zM12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z",
  eyeoff:  "M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24M1 1l22 22",
  filter:  "M22 3H2l8 9.46V19l4 2v-8.54L22 3z",
  smile:   "M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2zM8 14s1.5 2 4 2 4-2 4-2M9 9h.01M15 9h.01",
};

// ─── HELPERS ─────────────────────────────────────────────────────────
const ICONS_LIST = ["⭐","💎","🌟","✨","🎯","💫","🏅","🎀","💐","🌺","🌸","🌹","💆","💅","✂️","🪷","🧴","🧖","💊","🩺","🏥","🏨","🍽️","☕","🛎️","📋","🔑","💼","📱","🎁","🏷️","⚡","🔥","💡","🎨","🎭"];

const arabicDays = ["الأحد","الاثنين","الثلاثاء","الأربعاء","الخميس","الجمعة","السبت"];
const arabicMonths = ["يناير","فبراير","مارس","أبريل","مايو","يونيو","يوليو","أغسطس","سبتمبر","أكتوبر","نوفمبر","ديسمبر"];

// تحويل "اليوم"/"بكره" إلى تاريخ حقيقي
const resolveDate = (dateStr) => {
  const now = new Date();
  if (dateStr === "اليوم") return new Date(now.getFullYear(), now.getMonth(), now.getDate());
  if (dateStr === "بكره") { const d=new Date(now); d.setDate(d.getDate()+1); return new Date(d.getFullYear(),d.getMonth(),d.getDate()); }
  // محاولة تحليل التاريخ من النص العربي
  return null;
};

const formatDate = (dateStr) => {
  const resolved = resolveDate(dateStr);
  if (resolved) {
    return arabicDays[resolved.getDay()] + " " + resolved.getDate() + " " + arabicMonths[resolved.getMonth()];
  }
  return dateStr;
};

// حذف الحجوزات الملغية بعد يوم
const filterBookings = (bookings) => {
  const now = new Date();
  return bookings.filter(b => {
    if (b.status !== "cancelled") return true;
    if (!b.cancelledAt) return false;
    const diff = now - new Date(b.cancelledAt);
    return diff < 24 * 60 * 60 * 1000; // أقل من يوم
  });
};

const Avatar = ({ name, role, size=36 }) => (
  <div style={{ width:size, height:size, borderRadius:size*0.28,
    background:role==="admin"?T.purple:T.accent,
    display:"flex", alignItems:"center", justifyContent:"center",
    fontSize:size*0.38, fontWeight:700, color:"#fff", flexShrink:0,
    fontFamily:"'DM Mono',monospace" }}>
    {name?.[0]?.toUpperCase() || "?"}
  </div>
);

const Tag = ({ label, type="default" }) => {
  const m = {
    confirmed: { bg:T.greenBg,  color:T.green,  border:"#BBF7D0" },
    pending:   { bg:T.amberBg,  color:T.amber,  border:"#FDE68A" },
    cancelled: { bg:T.redBg,    color:T.red,    border:"#FECACA" },
    admin:     { bg:T.purpleBg, color:T.purple, border:"#DDD6FE" },
    staff:     { bg:T.accentBg, color:T.accent, border:T.accentMid },
    default:   { bg:T.bg,       color:T.textSoft,border:T.border },
  };
  const s = m[type]||m.default;
  return (
    <span style={{ background:s.bg, color:s.color, border:`1px solid ${s.border}`,
      fontSize:11, padding:"3px 10px", borderRadius:6, fontWeight:500, whiteSpace:"nowrap" }}>
      {label}
    </span>
  );
};

const KPI = ({ label, value, sub, icon, color, delay=0 }) => (
  <div className="hover-lift fu t" style={{ animationDelay:`${delay}s`,
    background:T.surface, border:`1px solid ${T.border}`,
    borderRadius:14, padding:"20px", boxShadow:"0 1px 4px rgba(0,0,0,0.05)",
    borderTop:`3px solid ${color}` }}>
    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
      <div>
        <div style={{ color:T.muted, fontSize:11, marginBottom:8, fontWeight:500, textTransform:"uppercase", letterSpacing:0.8 }}>{label}</div>
        <div style={{ color:T.text, fontSize:26, fontWeight:700, lineHeight:1, fontFamily:"'DM Mono',monospace" }}>{value}</div>
        {sub && <div style={{ color, fontSize:11, marginTop:6, fontWeight:500 }}>{sub}</div>}
      </div>
      <div style={{ width:40, height:40, borderRadius:10, background:color+"18",
        display:"flex", alignItems:"center", justifyContent:"center" }}>
        <Ico d={icon} color={color} size={18}/>
      </div>
    </div>
  </div>
);

const Modal = ({ title, onClose, children, width=400 }) => (
  <div className="fi" style={{ position:"fixed", inset:0, background:"rgba(15,23,42,0.5)",
    display:"flex", alignItems:"center", justifyContent:"center",
    zIndex:3000, direction:"rtl", backdropFilter:"blur(4px)" }}>
    <div className="fu" style={{ background:T.surface, borderRadius:16, padding:"24px",
      width, border:`1px solid ${T.border}`, boxShadow:"0 20px 60px rgba(0,0,0,0.2)",
      maxHeight:"90vh", overflowY:"auto" }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
        <span style={{ color:T.text, fontWeight:700, fontSize:15 }}>{title}</span>
        <button onClick={onClose} className="t" style={{ background:"none", border:"none",
          color:T.muted, cursor:"pointer", width:28, height:28, borderRadius:6,
          display:"flex", alignItems:"center", justifyContent:"center", fontSize:16 }}
          onMouseEnter={e=>e.currentTarget.style.background=T.bg}
          onMouseLeave={e=>e.currentTarget.style.background="none"}>✕</button>
      </div>
      {children}
    </div>
  </div>
);

const Lbl = ({ label, children }) => (
  <div>
    <div style={{ color:T.textSoft, fontSize:12, marginBottom:5, fontWeight:500 }}>{label}</div>
    {children}
  </div>
);

const inp = (err=false) => ({
  width:"100%", background:err?"#FEF2F2":T.bg,
  border:`1.5px solid ${err?"#FECACA":T.border}`,
  borderRadius:8, padding:"9px 12px", color:T.text, fontSize:13,
  outline:"none", direction:"rtl", boxSizing:"border-box", transition:"all 0.15s",
});
const fIn  = e => { e.target.style.borderColor=T.accent; e.target.style.background="#fff"; e.target.style.boxShadow=`0 0 0 3px ${T.accent}18`; };
const fOut = (err=false) => e => { e.target.style.borderColor=err?"#FECACA":T.border; e.target.style.background=T.bg; e.target.style.boxShadow="none"; };

const Btn = ({ onClick, children, disabled, variant="primary", style={} }) => {
  const v = {
    primary: { bg:`linear-gradient(135deg,${T.accent},${T.accent}CC)`, color:"#fff", border:"none", shadow:`0 4px 12px ${T.accent}40` },
    ghost:   { bg:T.bg, color:T.textSoft, border:`1.5px solid ${T.border}`, shadow:"none" },
    danger:  { bg:"linear-gradient(135deg,#DC2626,#B91C1C)", color:"#fff", border:"none", shadow:"0 4px 12px #DC262640" },
  };
  const s = v[variant]||v.primary;
  return (
    <button onClick={onClick} disabled={disabled} className="t" style={{
      padding:"10px 20px", background:disabled?T.border:s.bg,
      border:s.border||"none", borderRadius:8, color:disabled?T.muted:s.color,
      fontFamily:"inherit", fontSize:13, fontWeight:600,
      cursor:disabled?"default":"pointer",
      boxShadow:disabled?"none":s.shadow, opacity:disabled?0.7:1, ...style }}>
      {children}
    </button>
  );
};

// ─── LOGIN ────────────────────────────────────────────────────────────
function LoginScreen({ onLogin }) {
  const [user,    setUser]    = useState("");
  const [pwd,     setPwd]     = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [error,   setError]   = useState("");
  const [loading, setLoading] = useState(false);
  const [shake,   setShake]   = useState(false);

  const handle = async () => {
    if (!user.trim()) return setError("أدخل اسم المستخدم");
    if (!pwd.trim())  return setError("أدخل كلمة المرور");
    setLoading(true); setError("");
    try {
      const res  = await fetch(API_URL+"/api/login", { method:"POST",
        headers:{"Content-Type":"application/json"},
        body: JSON.stringify({ username:user.trim(), password:pwd }) });
      const data = await res.json();
      if (!res.ok) { setError(data.error||"بيانات غير صحيحة"); setShake(true); setTimeout(()=>setShake(false),500); }
      else onLogin(data.role, data.username);
    } catch { setError("تعذر الاتصال بالسيرفر"); }
    finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight:"100vh", background:T.sidebar, display:"flex",
      fontFamily:"'IBM Plex Sans Arabic',sans-serif", direction:"rtl" }}>
      <style>{CSS}</style>
      <div style={{ width:"45%", background:`linear-gradient(145deg,${T.sideBg} 0%,#1E3A5F 100%)`,
        display:"flex", flexDirection:"column", justifyContent:"space-between",
        padding:"48px", position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", inset:0, opacity:0.04,
          backgroundImage:`linear-gradient(rgba(255,255,255,0.5) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.5) 1px,transparent 1px)`,
          backgroundSize:"40px 40px" }}/>
        <div style={{ position:"absolute", bottom:-80, left:-80, width:400, height:400,
          borderRadius:"50%", background:`radial-gradient(circle,${T.accent}30 0%,transparent 70%)` }}/>
        <div style={{ position:"relative" }}>
          <div style={{ display:"inline-flex", alignItems:"center", justifyContent:"center",
            width:52, height:52, borderRadius:14,
            background:`linear-gradient(135deg,${T.accent},${T.accent}99)`,
            fontSize:24, marginBottom:32, boxShadow:`0 8px 24px ${T.accent}50` }}>🏢</div>
          <div style={{ color:"#fff", fontSize:28, fontWeight:700, marginBottom:8 }}>{CONFIG.businessName}</div>
          <div style={{ color:"#94A3B8", fontSize:14 }}>لوحة إدارة {CONFIG.businessType}</div>
        </div>
        <div style={{ position:"relative" }}>
          {["⚡ إدارة المواعيد لحظة بلحظة","🤖 استقبال ذكي على الواتساب","📊 تقارير وإحصائيات تفصيلية"].map((f,i)=>(
            <div key={i} style={{ display:"flex", alignItems:"center", gap:12, marginBottom:i<2?16:0, opacity:0.8 }}>
              <div style={{ width:34,height:34,borderRadius:8,background:"rgba(255,255,255,0.08)",
                display:"flex",alignItems:"center",justifyContent:"center",fontSize:16 }}>{f[0]}</div>
              <span style={{ color:"#CBD5E1", fontSize:13 }}>{f.slice(2)}</span>
            </div>
          ))}
        </div>
      </div>
      <div style={{ flex:1, background:T.bg, display:"flex", alignItems:"center", justifyContent:"center", padding:"48px" }}>
        <div className="fu" style={{ width:"100%", maxWidth:380 }}>
          <div style={{ marginBottom:32 }}>
            <h1 style={{ color:T.text, fontSize:24, fontWeight:700, marginBottom:6 }}>تسجيل الدخول</h1>
            <p style={{ color:T.muted, fontSize:13 }}>أدخل بيانات حسابك للمتابعة</p>
          </div>
          <div style={{ display:"flex", flexDirection:"column", gap:14, animation:shake?"shake 0.4s ease":"none" }}>
            <Lbl label="اسم المستخدم">
              <input value={user} onChange={e=>{setUser(e.target.value);setError("");}}
                onKeyDown={e=>e.key==="Enter"&&handle()} placeholder="اسم المستخدم"
                style={inp(!!error&&!user)} onFocus={fIn} onBlur={fOut()}/>
            </Lbl>
            <Lbl label="كلمة المرور">
              <div style={{ position:"relative" }}>
                <input type={showPwd?"text":"password"} value={pwd}
                  onChange={e=>{setPwd(e.target.value);setError("");}}
                  onKeyDown={e=>e.key==="Enter"&&handle()} placeholder="كلمة المرور"
                  style={{...inp(!!error&&user&&!pwd),paddingLeft:38}} onFocus={fIn} onBlur={fOut()}/>
                <button onClick={()=>setShowPwd(!showPwd)} style={{
                  position:"absolute",left:10,top:"50%",transform:"translateY(-50%)",
                  background:"none",border:"none",cursor:"pointer",padding:0,color:T.muted}}>
                  <Ico d={showPwd?I.eyeoff:I.eye} size={15} color={T.muted}/>
                </button>
              </div>
            </Lbl>
            {error && (
              <div style={{ display:"flex", alignItems:"center", gap:8,
                background:T.redBg, border:"1.5px solid #FECACA",
                padding:"9px 12px", borderRadius:8, color:T.red, fontSize:12 }}>
                <Ico d={I.warn} size={14} color={T.red}/>{error}
              </div>
            )}
            <Btn onClick={handle} disabled={loading} style={{width:"100%",padding:"12px",marginTop:4}}>
              {loading?"جاري التحقق...":"دخول ←"}
            </Btn>
          </div>
          <div style={{ marginTop:24, textAlign:"center", color:T.muted, fontSize:11 }}>
            نظام إدارة {CONFIG.businessType} © 2026
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── ADMIN MODAL ─────────────────────────────────────────────────────
function AdminModal({ onClose, onSuccess }) {
  const [pwd,loading,error,setP,setE] = [useState(""),useState(false),useState(false),x=>x,x=>x];
  const [p,setP2]=useState(""); const [ld,setLd]=useState(false); const [er,setEr]=useState(false);
  const handle = async()=>{
    setLd(true);
    try{ const r=await fetch(API_URL+"/api/login",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({username:"مدير",password:p})});
      if(r.ok){onSuccess();onClose();}else setEr(true);
    }catch{setEr(true);}finally{setLd(false);}
  };
  return (
    <Modal title="🔒 صلاحية المدير" onClose={onClose} width={340}>
      <div style={{display:"flex",flexDirection:"column",gap:12,marginBottom:16}}>
        <Lbl label="كلمة مرور المدير">
          <input type="password" value={p} onChange={e=>{setP2(e.target.value);setEr(false);}}
            onKeyDown={e=>e.key==="Enter"&&handle()} placeholder="كلمة المرور"
            style={inp(er)} autoFocus onFocus={fIn} onBlur={fOut(er)}/>
        </Lbl>
        {er&&<div style={{color:T.red,fontSize:12}}>كلمة المرور غير صحيحة</div>}
      </div>
      <div style={{display:"flex",gap:8}}>
        <Btn onClick={handle} disabled={ld} style={{flex:1}}>{ld?"...":"دخول"}</Btn>
        <Btn onClick={onClose} variant="ghost" style={{flex:1}}>إلغاء</Btn>
      </div>
    </Modal>
  );
}

// ─── CONFIRM ─────────────────────────────────────────────────────────
function Confirm({ msg, onOk, onCancel }) {
  return (
    <Modal title="تأكيد الإجراء" onClose={onCancel} width={320}>
      <p style={{color:T.textSoft,fontSize:13,marginBottom:20,lineHeight:1.7}}>{msg}</p>
      <div style={{display:"flex",gap:8}}>
        <Btn onClick={onOk} variant="danger" style={{flex:1}}>تأكيد</Btn>
        <Btn onClick={onCancel} variant="ghost" style={{flex:1}}>تراجع</Btn>
      </div>
    </Modal>
  );
}

// ─── ADD BOOKING ─────────────────────────────────────────────────────
function AddBooking({ onClose, onAdd, services }) {
  const [form,setForm]=useState({name:"",service:services[0]?.name||"",date:"",time:"",phone:""});
  const [error,setError]=useState("");
  return (
    <Modal title="إضافة حجز جديد" onClose={onClose} width={420}>
      <div style={{display:"flex",flexDirection:"column",gap:13,marginBottom:16}}>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
          <Lbl label="اسم العميل *">
            <input value={form.name} onChange={e=>setForm({...form,name:e.target.value})}
              placeholder="الاسم الكامل" style={inp(!form.name&&!!error)} onFocus={fIn} onBlur={fOut()}/>
          </Lbl>
          <Lbl label="رقم الهاتف">
            <input value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})}
              placeholder="+966..." style={inp()} onFocus={fIn} onBlur={fOut()}/>
          </Lbl>
        </div>
        <Lbl label="الخدمة *">
          <select value={form.service} onChange={e=>setForm({...form,service:e.target.value})}
            style={{...inp(),cursor:"pointer"}} onFocus={fIn} onBlur={fOut()}>
            {services.length===0
              ? <option value="">لا توجد خدمات — أضف خدمة أولاً</option>
              : services.map(s=><option key={s.id} value={s.name}>{s.icon} {s.name} — {s.price} ر.س</option>)
            }
          </select>
        </Lbl>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
          <Lbl label="التاريخ *">
            <input type="date" value={form.date} onChange={e=>setForm({...form,date:e.target.value})}
              style={{...inp(!form.date&&!!error),direction:"ltr"}} onFocus={fIn} onBlur={fOut()}/>
          </Lbl>
          <Lbl label="الوقت *">
            <input type="time" value={form.time} onChange={e=>setForm({...form,time:e.target.value})}
              style={{...inp(!form.time&&!!error),direction:"ltr"}} onFocus={fIn} onBlur={fOut()}/>
          </Lbl>
        </div>
        {error&&<div style={{color:T.red,fontSize:12}}>{error}</div>}
      </div>
      <div style={{display:"flex",gap:8}}>
        <Btn onClick={()=>{
          if(!form.name.trim()) return setError("اسم العميل مطلوب");
          if(!form.date) return setError("التاريخ مطلوب");
          if(!form.time) return setError("الوقت مطلوب");
          const svc = services.find(s=>s.name===form.service);
          const d = new Date(form.date);
          const dateLabel = arabicDays[d.getDay()]+" "+d.getDate()+" "+arabicMonths[d.getMonth()]+" "+d.getFullYear();
          const [h,m] = form.time.split(":");
          const hour = parseInt(h);
          const timeLabel = (hour>12?hour-12:hour===0?12:hour)+":"+(m||"00")+" "+(hour>=12?"م":"ص");
          onAdd({name:form.name,phone:form.phone,service:form.service,
            date:dateLabel,time:timeLabel,price:(svc?.price||0)+" ر.س",
            id:Date.now(),status:"confirmed",source:"manual"});
          onClose();
        }} style={{flex:1}}>إضافة الحجز</Btn>
        <Btn onClick={onClose} variant="ghost" style={{flex:1}}>إلغاء</Btn>
      </div>
    </Modal>
  );
}

// ─── SERVICES PAGE ────────────────────────────────────────────────────
function ServicesPage({ storageKey="lamsa_services" }) {
  const [services, setServices] = useLocalStorage(storageKey, []);
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [form,     setForm]     = useState({name:"",description:"",price:"",icon:"⭐"});
  const [formErr,  setFormErr]  = useState("");
  const [showIcons,setShowIcons]= useState(false);
  const [confirmDel, setConfirmDel] = useState(null);

  const openAdd  = ()=>{ setForm({name:"",description:"",price:"",icon:"⭐"}); setEditItem(null); setFormErr(""); setShowForm(true); };
  const openEdit = (s)=>{ setForm({name:s.name,description:s.description||"",price:String(s.price),icon:s.icon}); setEditItem(s); setFormErr(""); setShowForm(true); };

  const save = ()=>{
    if(!form.name.trim()) return setFormErr("اسم الخدمة مطلوب");
    if(!form.price||isNaN(Number(form.price))) return setFormErr("السعر يجب أن يكون رقماً");
    if(editItem){
      setServices(services.map(s=>s.id===editItem.id?{...s,...form,price:Number(form.price)}:s));
    } else {
      setServices([...services,{id:Date.now(),name:form.name,description:form.description,price:Number(form.price),icon:form.icon}]);
    }
    setShowForm(false);
  };

  const del = (id)=>{ setServices(services.filter(s=>s.id!==id)); setConfirmDel(null); };

  return (
    <div className="fu">
      {confirmDel && <Confirm msg={`حذف خدمة "${confirmDel.name}"؟`} onOk={()=>del(confirmDel.id)} onCancel={()=>setConfirmDel(null)}/>}
      {showForm && (
        <Modal title={editItem?"تعديل الخدمة":"إضافة خدمة جديدة"} onClose={()=>setShowForm(false)} width={420}>
          <div style={{display:"flex",flexDirection:"column",gap:14,marginBottom:16}}>
            {/* Icon picker */}
            <Lbl label="الأيقونة">
              <div style={{display:"flex",alignItems:"center",gap:10}}>
                <div onClick={()=>setShowIcons(!showIcons)} style={{
                  width:48,height:48,borderRadius:10,fontSize:24,
                  background:T.accentBg,border:`1.5px solid ${T.accentMid}`,
                  display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer"}}>
                  {form.icon}
                </div>
                <button onClick={()=>setShowIcons(!showIcons)} className="t" style={{
                  padding:"7px 12px",background:T.bg,border:`1.5px solid ${T.border}`,
                  borderRadius:8,color:T.textSoft,fontSize:12,cursor:"pointer"}}>
                  {showIcons?"إغلاق":"اختر أيقونة"}
                </button>
              </div>
              {showIcons && (
                <div style={{marginTop:10,display:"flex",flexWrap:"wrap",gap:6,
                  background:T.bg,border:`1.5px solid ${T.border}`,borderRadius:10,padding:10,maxHeight:160,overflowY:"auto"}}>
                  {ICONS_LIST.map(ic=>(
                    <button key={ic} onClick={()=>{setForm({...form,icon:ic});setShowIcons(false);}} className="t" style={{
                      width:36,height:36,fontSize:20,borderRadius:8,border:"none",cursor:"pointer",
                      background:form.icon===ic?T.accentBg:"transparent"}}>
                      {ic}
                    </button>
                  ))}
                </div>
              )}
            </Lbl>
            <Lbl label="اسم الخدمة *">
              <input value={form.name} onChange={e=>setForm({...form,name:e.target.value})}
                placeholder="مثال: قص شعر" style={inp(!!formErr&&!form.name)} onFocus={fIn} onBlur={fOut()}/>
            </Lbl>
            <Lbl label="وصف الخدمة">
              <input value={form.description} onChange={e=>setForm({...form,description:e.target.value})}
                placeholder="وصف مختصر للخدمة (اختياري)" style={inp()} onFocus={fIn} onBlur={fOut()}/>
            </Lbl>
            <Lbl label="السعر (ر.س) *">
              <input type="number" value={form.price} onChange={e=>setForm({...form,price:e.target.value})}
                placeholder="مثال: 150" style={{...inp(!!formErr&&!form.price),direction:"ltr"}} onFocus={fIn} onBlur={fOut()}/>
            </Lbl>
            {formErr&&<div style={{color:T.red,fontSize:12}}>{formErr}</div>}
          </div>
          <div style={{display:"flex",gap:8}}>
            <Btn onClick={save} style={{flex:1}}>حفظ</Btn>
            <Btn onClick={()=>setShowForm(false)} variant="ghost" style={{flex:1}}>إلغاء</Btn>
          </div>
        </Modal>
      )}

      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
        <div style={{color:T.muted,fontSize:12,fontFamily:"'DM Mono',monospace"}}>{services.length} خدمة</div>
        <Btn onClick={openAdd}>+ إضافة خدمة</Btn>
      </div>

      {services.length===0 ? (
        <div style={{textAlign:"center",padding:60,background:T.surface,borderRadius:14,border:`1.5px solid ${T.border}`}}>
          <div style={{fontSize:48,marginBottom:16,opacity:0.3}}>📦</div>
          <div style={{color:T.muted,fontSize:14,marginBottom:20}}>لا توجد خدمات بعد</div>
          <Btn onClick={openAdd}>+ أضف أول خدمة</Btn>
        </div>
      ) : (
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:14}}>
          {services.map((s,i)=>(
            <div key={s.id} className="hover-lift fu t" style={{
              background:T.surface,border:`1.5px solid ${T.border}`,borderRadius:14,
              padding:18,boxShadow:"0 1px 4px rgba(0,0,0,0.04)",animationDelay:i*0.05+"s"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:14}}>
                <div style={{width:46,height:46,borderRadius:12,fontSize:22,
                  background:T.accentBg,border:`1.5px solid ${T.accentMid}`,
                  display:"flex",alignItems:"center",justifyContent:"center"}}>{s.icon}</div>
                <div style={{display:"flex",gap:6}}>
                  <button onClick={()=>openEdit(s)} className="t" style={{
                    background:T.bg,border:`1.5px solid ${T.border}`,borderRadius:6,
                    padding:"4px 8px",color:T.accent,fontSize:11,cursor:"pointer"}}>تعديل</button>
                  <button onClick={()=>setConfirmDel(s)} className="t" style={{
                    background:T.redBg,border:"1.5px solid #FECACA",borderRadius:6,
                    padding:"4px 8px",color:T.red,fontSize:11,cursor:"pointer"}}>حذف</button>
                </div>
              </div>
              <div style={{color:T.text,fontWeight:600,fontSize:14,marginBottom:4}}>{s.name}</div>
              {s.description&&<div style={{color:T.muted,fontSize:12,marginBottom:12,lineHeight:1.5}}>{s.description}</div>}
              <div style={{paddingTop:12,borderTop:`1.5px solid ${T.border}`}}>
                <span style={{color:T.accent,fontWeight:700,fontSize:16,fontFamily:"'DM Mono',monospace"}}>{s.price} ر.س</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── OFFERS PAGE ──────────────────────────────────────────────────────
function OffersPage({ storageKey="lamsa_offers" }) {
  const [offers,   setOffers]  = useLocalStorage(storageKey, []);
  const [showForm, setShowForm]= useState(false);
  const [editItem, setEditItem]= useState(null);
  const [form,     setForm]    = useState({name:"",description:"",price:"",icon:"🎁",discount:""});
  const [formErr,  setFormErr] = useState("");
  const [showIcons,setShowIcons]=useState(false);
  const [confirmDel,setConfirmDel]=useState(null);

  const openAdd  = ()=>{ setForm({name:"",description:"",price:"",icon:"🎁",discount:""}); setEditItem(null); setFormErr(""); setShowForm(true); };
  const openEdit = (o)=>{ setForm({name:o.name,description:o.description||"",price:String(o.price),icon:o.icon,discount:String(o.discount||"")}); setEditItem(o); setFormErr(""); setShowForm(true); };

  const save = ()=>{
    if(!form.name.trim()) return setFormErr("اسم العرض مطلوب");
    if(!form.price||isNaN(Number(form.price))) return setFormErr("السعر يجب أن يكون رقماً");
    const item={...form,price:Number(form.price),discount:Number(form.discount)||0};
    if(editItem) setOffers(offers.map(o=>o.id===editItem.id?{...o,...item}:o));
    else setOffers([...offers,{id:Date.now(),...item}]);
    setShowForm(false);
  };

  return (
    <div className="fu">
      {confirmDel && <Confirm msg={`حذف عرض "${confirmDel.name}"؟`} onOk={()=>{setOffers(offers.filter(o=>o.id!==confirmDel.id));setConfirmDel(null);}} onCancel={()=>setConfirmDel(null)}/>}
      {showForm && (
        <Modal title={editItem?"تعديل العرض":"إضافة عرض جديد"} onClose={()=>setShowForm(false)} width={420}>
          <div style={{display:"flex",flexDirection:"column",gap:14,marginBottom:16}}>
            <Lbl label="الأيقونة">
              <div style={{display:"flex",alignItems:"center",gap:10}}>
                <div onClick={()=>setShowIcons(!showIcons)} style={{
                  width:48,height:48,borderRadius:10,fontSize:24,
                  background:"#FFF7ED",border:"1.5px solid #FED7AA",
                  display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer"}}>
                  {form.icon}
                </div>
                <button onClick={()=>setShowIcons(!showIcons)} className="t" style={{
                  padding:"7px 12px",background:T.bg,border:`1.5px solid ${T.border}`,
                  borderRadius:8,color:T.textSoft,fontSize:12,cursor:"pointer"}}>
                  {showIcons?"إغلاق":"اختر أيقونة"}
                </button>
              </div>
              {showIcons && (
                <div style={{marginTop:10,display:"flex",flexWrap:"wrap",gap:6,
                  background:T.bg,border:`1.5px solid ${T.border}`,borderRadius:10,padding:10,maxHeight:160,overflowY:"auto"}}>
                  {ICONS_LIST.map(ic=>(
                    <button key={ic} onClick={()=>{setForm({...form,icon:ic});setShowIcons(false);}} className="t" style={{
                      width:36,height:36,fontSize:20,borderRadius:8,border:"none",cursor:"pointer",
                      background:form.icon===ic?"#FFF7ED":"transparent"}}>
                      {ic}
                    </button>
                  ))}
                </div>
              )}
            </Lbl>
            <Lbl label="اسم العرض *">
              <input value={form.name} onChange={e=>setForm({...form,name:e.target.value})}
                placeholder="مثال: عرض الصيف" style={inp(!!formErr&&!form.name)} onFocus={fIn} onBlur={fOut()}/>
            </Lbl>
            <Lbl label="وصف العرض">
              <input value={form.description} onChange={e=>setForm({...form,description:e.target.value})}
                placeholder="تفاصيل العرض (اختياري)" style={inp()} onFocus={fIn} onBlur={fOut()}/>
            </Lbl>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
              <Lbl label="سعر العرض (ر.س) *">
                <input type="number" value={form.price} onChange={e=>setForm({...form,price:e.target.value})}
                  placeholder="مثال: 199" style={{...inp(!!formErr&&!form.price),direction:"ltr"}} onFocus={fIn} onBlur={fOut()}/>
              </Lbl>
              <Lbl label="نسبة الخصم % (اختياري)">
                <input type="number" value={form.discount} onChange={e=>setForm({...form,discount:e.target.value})}
                  placeholder="مثال: 20" style={{...inp(),direction:"ltr"}} onFocus={fIn} onBlur={fOut()}/>
              </Lbl>
            </div>
            {formErr&&<div style={{color:T.red,fontSize:12}}>{formErr}</div>}
          </div>
          <div style={{display:"flex",gap:8}}>
            <Btn onClick={save} style={{flex:1}}>حفظ</Btn>
            <Btn onClick={()=>setShowForm(false)} variant="ghost" style={{flex:1}}>إلغاء</Btn>
          </div>
        </Modal>
      )}

      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
        <div style={{color:T.muted,fontSize:12,fontFamily:"'DM Mono',monospace"}}>{offers.length} عرض</div>
        <Btn onClick={openAdd}>+ إضافة عرض</Btn>
      </div>

      {offers.length===0 ? (
        <div style={{textAlign:"center",padding:60,background:T.surface,borderRadius:14,border:`1.5px solid ${T.border}`}}>
          <div style={{fontSize:48,marginBottom:16,opacity:0.3}}>🎁</div>
          <div style={{color:T.muted,fontSize:14,marginBottom:20}}>لا توجد عروض بعد</div>
          <Btn onClick={openAdd}>+ أضف أول عرض</Btn>
        </div>
      ) : (
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:14}}>
          {offers.map((o,i)=>(
            <div key={o.id} className="hover-lift fu t" style={{
              background:T.surface,border:"1.5px solid #FED7AA",borderRadius:14,
              padding:18,boxShadow:"0 1px 4px rgba(0,0,0,0.04)",
              borderTop:"3px solid #F97316",animationDelay:i*0.05+"s"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:14}}>
                <div style={{width:46,height:46,borderRadius:12,fontSize:22,
                  background:"#FFF7ED",border:"1.5px solid #FED7AA",
                  display:"flex",alignItems:"center",justifyContent:"center"}}>{o.icon}</div>
                <div style={{display:"flex",gap:6,alignItems:"center"}}>
                  {o.discount>0&&<span style={{background:"#FEF3C7",color:"#D97706",border:"1px solid #FDE68A",
                    fontSize:11,padding:"2px 8px",borderRadius:6,fontWeight:600}}>{o.discount}% خصم</span>}
                  <button onClick={()=>openEdit(o)} className="t" style={{
                    background:T.bg,border:`1.5px solid ${T.border}`,borderRadius:6,
                    padding:"4px 8px",color:T.accent,fontSize:11,cursor:"pointer"}}>تعديل</button>
                  <button onClick={()=>setConfirmDel(o)} className="t" style={{
                    background:T.redBg,border:"1.5px solid #FECACA",borderRadius:6,
                    padding:"4px 8px",color:T.red,fontSize:11,cursor:"pointer"}}>حذف</button>
                </div>
              </div>
              <div style={{color:T.text,fontWeight:600,fontSize:14,marginBottom:4}}>{o.name}</div>
              {o.description&&<div style={{color:T.muted,fontSize:12,marginBottom:12,lineHeight:1.5}}>{o.description}</div>}
              <div style={{paddingTop:12,borderTop:"1.5px solid #FED7AA",display:"flex",alignItems:"center",gap:8}}>
                <span style={{color:"#F97316",fontWeight:700,fontSize:16,fontFamily:"'DM Mono',monospace"}}>{o.price} ر.س</span>
                {o.discount>0&&<span style={{color:T.muted,fontSize:12,textDecoration:"line-through",fontFamily:"'DM Mono',monospace"}}>
                  {Math.round(o.price/(1-o.discount/100))} ر.س
                </span>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── LOCAL STORAGE HOOK ───────────────────────────────────────────────
function useLocalStorage(key, initial) {
  const [val, setVal] = useState(()=>{
    try{ const s=localStorage.getItem(key); return s?JSON.parse(s):initial; }
    catch{ return initial; }
  });
  const set = (v) => { setVal(v); try{localStorage.setItem(key,JSON.stringify(v));}catch{} };
  return [val, set];
}

// ─── BOOKINGS TABLE ───────────────────────────────────────────────────
function BookingsPage({ bookings, onCancel }) {
  const [filters, setFilters] = useState({ name:"", service:"", date:"", time:"", status:"all" });

  const setF = (k,v) => setFilters(p=>({...p,[k]:v}));

  const visible = filterBookings(bookings).filter(b=>{
    if(filters.name    && !b.name?.includes(filters.name))     return false;
    if(filters.service && !b.service?.includes(filters.service))return false;
    if(filters.date    && !b.date?.includes(filters.date))     return false;
    if(filters.time    && !b.time?.includes(filters.time))     return false;
    if(filters.status !== "all" && b.status !== filters.status) return false;
    return true;
  });

  const fi = { height:32, background:T.bg, border:`1px solid ${T.border}`, borderRadius:6,
    padding:"0 8px", color:T.text, fontSize:12, outline:"none", width:"100%",
    direction:"rtl", fontFamily:"inherit" };

  return (
    <div className="fu">
      <div style={{background:T.surface,border:`1.5px solid ${T.border}`,borderRadius:14,overflow:"hidden"}}>
        {/* Filter row */}
        <div style={{display:"grid",gridTemplateColumns:"1.2fr 0.9fr 1.1fr 0.8fr 0.8fr 0.6fr auto",
          gap:8,padding:"10px 16px",background:T.bg,borderBottom:`1.5px solid ${T.border}`,alignItems:"center"}}>
          <input style={fi} value={filters.name} onChange={e=>setF("name",e.target.value)}
            placeholder="🔍 اسم العميل" onFocus={e=>e.target.style.borderColor=T.accent} onBlur={e=>e.target.style.borderColor=T.border}/>
          <input style={fi} value={filters.service} onChange={e=>setF("service",e.target.value)}
            placeholder="الخدمة" onFocus={e=>e.target.style.borderColor=T.accent} onBlur={e=>e.target.style.borderColor=T.border}/>
          <input style={fi} value={filters.date} onChange={e=>setF("date",e.target.value)}
            placeholder="التاريخ" onFocus={e=>e.target.style.borderColor=T.accent} onBlur={e=>e.target.style.borderColor=T.border}/>
          <input style={fi} value={filters.time} onChange={e=>setF("time",e.target.value)}
            placeholder="الوقت" onFocus={e=>e.target.style.borderColor=T.accent} onBlur={e=>e.target.style.borderColor=T.border}/>
          <select style={{...fi,cursor:"pointer"}} value={filters.status} onChange={e=>setF("status",e.target.value)}>
            <option value="all">الكل</option>
            <option value="confirmed">مؤكدة</option>
            <option value="cancelled">ملغية</option>
          </select>
          <div style={{color:T.muted,fontSize:11,fontFamily:"'DM Mono',monospace",textAlign:"center"}}>{visible.length}</div>
          <button onClick={()=>setFilters({name:"",service:"",date:"",time:"",status:"all"})} className="t" style={{
            background:T.bg,border:`1px solid ${T.border}`,borderRadius:6,
            padding:"4px 8px",color:T.muted,fontSize:11,cursor:"pointer"}}>مسح</button>
        </div>

        {/* Header */}
        <div style={{display:"grid",gridTemplateColumns:"1.2fr 0.7fr 1.1fr 0.8fr 1fr 0.7fr auto",
          padding:"10px 16px",borderBottom:`1.5px solid ${T.border}`}}>
          {["العميل","رقم الهاتف","التاريخ","الوقت","الخدمة","السعر",""].map(h=>(
            <div key={h} style={{color:T.muted,fontSize:11,fontWeight:600,textTransform:"uppercase",letterSpacing:0.5}}>{h}</div>
          ))}
        </div>

        {/* Rows */}
        {visible.length===0
          ?<div style={{padding:40,textAlign:"center",color:T.muted,fontSize:13}}>
            <div style={{fontSize:28,marginBottom:8,opacity:0.4}}>🔍</div>لا توجد نتائج
          </div>
          :visible.map(b=>{
            const sm={confirmed:{label:"مؤكد",type:"confirmed"},cancelled:{label:"ملغي",type:"cancelled"},pending:{label:"معلق",type:"pending"}};
            const s=sm[b.status]||sm.confirmed;
            const phone=b.phone?.replace("whatsapp:","") || "";
            return(
              <div key={b.id} className="row-h" style={{display:"grid",gridTemplateColumns:"1.2fr 0.7fr 1.1fr 0.8fr 1fr 0.7fr auto",
                alignItems:"center",padding:"12px 16px",borderBottom:`1px solid ${T.border}80`,background:T.surface}}>
                <div style={{display:"flex",alignItems:"center",gap:8}}>
                  <Avatar name={b.name} role="staff" size={30}/>
                  <span style={{color:T.text,fontSize:13,fontWeight:500}}>{b.name}</span>
                </div>
                <div style={{color:T.muted,fontSize:12,fontFamily:"'DM Mono',monospace"}}>{phone||"—"}</div>
                <div style={{color:T.textSoft,fontSize:12}}>{formatDate(b.date)}</div>
                <div style={{color:T.textSoft,fontSize:12,fontFamily:"'DM Mono',monospace"}}>{b.time}</div>
                <div style={{color:T.textSoft,fontSize:12}}>{b.service}</div>
                <div style={{color:T.accent,fontWeight:600,fontSize:12,fontFamily:"'DM Mono',monospace"}}>{b.price}</div>
                <div style={{display:"flex",alignItems:"center",gap:6}}>
                  <Tag label={s.label} type={s.type}/>
                  {b.status!=="cancelled"&&(
                    <button onClick={()=>onCancel(b.id,b.name)} className="t" style={{
                      background:T.redBg,border:"1px solid #FECACA",borderRadius:5,
                      padding:"3px 8px",color:T.red,fontSize:11,cursor:"pointer"}}>إلغاء</button>
                  )}
                </div>
              </div>
            );
          })
        }
      </div>
    </div>
  );
}

// ─── REPORTS ─────────────────────────────────────────────────────────
function Reports({ bookings }) {
  const [period, setPeriod] = useState("monthly");

  const filterByPeriod = (bList) => {
    const now = new Date();
    return bList.filter(b => {
      // نحاول تحليل التاريخ
      const resolved = resolveDate(b.date);
      if (!resolved) return true; // لو ما قدرنا نحلله نحسبه
      if (period === "daily") {
        return resolved.toDateString() === now.toDateString();
      }
      if (period === "weekly") {
        const diff = (now - resolved) / (1000*60*60*24);
        return diff <= 7;
      }
      if (period === "monthly") {
        return resolved.getMonth()===now.getMonth() && resolved.getFullYear()===now.getFullYear();
      }
      return true;
    });
  };

  // التقارير تحفظ كل الحجوزات (ملغية ومؤكدة)
  const all  = filterByPeriod(bookings);
  const done = all.filter(b=>b.status==="confirmed");
  const fail = all.filter(b=>b.status==="cancelled");
  const rev  = done.reduce((s,b)=>s+(parseInt((b.price||"0").replace(/\D/g,""))||0),0);
  const uniq = new Set(done.map(b=>b.phone||b.name)).size;
  const svc  = {};
  done.forEach(b=>{
    if(!svc[b.service]) svc[b.service]={count:0,revenue:0};
    svc[b.service].count++;
    svc[b.service].revenue+=parseInt((b.price||"0").replace(/\D/g,""))||0;
  });
  const sorted = Object.entries(svc).sort((a,b)=>b[1].count-a[1].count);
  const maxC   = sorted[0]?.[1]?.count||1;

  const exportCSV = () => {
    const h=["الاسم","الهاتف","الخدمة","التاريخ","الوقت","السعر","الحالة"];
    const r=all.map(b=>[b.name,b.phone?.replace("whatsapp:",""),b.service,formatDate(b.date),b.time,b.price,b.status==="confirmed"?"مؤكد":"ملغي"]);
    const NL=String.fromCharCode(10);
    const csv=[h,...r].map(row=>row.join(",")).join(NL);
    const blob=new Blob(["\uFEFF"+csv],{type:"text/csv;charset=utf-8"});
    const url=URL.createObjectURL(blob);
    const a=document.createElement("a");a.href=url;a.download="تقرير.csv";a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fu">
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:22}}>
        <div style={{display:"flex",background:T.surface,border:`1.5px solid ${T.border}`,borderRadius:10,padding:3}}>
          {[{id:"daily",l:"يومي"},{id:"weekly",l:"أسبوعي"},{id:"monthly",l:"شهري"}].map(p=>(
            <button key={p.id} onClick={()=>setPeriod(p.id)} className="t" style={{
              padding:"6px 16px",borderRadius:7,border:"none",cursor:"pointer",
              fontFamily:"inherit",fontSize:12,
              background:period===p.id?T.accent:"transparent",
              color:period===p.id?"#fff":T.textSoft,fontWeight:period===p.id?600:400}}>
              {p.l}
            </button>
          ))}
        </div>
        <div style={{display:"flex",gap:8}}>
          <button onClick={exportCSV} className="t" style={{
            display:"flex",alignItems:"center",gap:6,padding:"8px 14px",
            background:T.surface,border:`1.5px solid ${T.border}`,borderRadius:8,
            color:T.green,fontFamily:"inherit",fontSize:12,cursor:"pointer"}}>
            <Ico d={I.dl} size={13} color={T.green}/> Excel
          </button>
          <button onClick={()=>window.print()} className="t" style={{
            display:"flex",alignItems:"center",gap:6,padding:"8px 14px",
            background:T.surface,border:`1.5px solid ${T.border}`,borderRadius:8,
            color:T.red,fontFamily:"inherit",fontSize:12,cursor:"pointer"}}>
            <Ico d={I.dl} size={13} color={T.red}/> PDF
          </button>
        </div>
      </div>

      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:14,marginBottom:20}}>
        <KPI label="إجمالي الحجوزات" value={all.length}  sub="مؤكدة + ملغية"      icon={I.cal}   color={T.accent} delay={0}/>
        <KPI label="مؤكدة"            value={done.length} sub={done.length+" حجز"}  icon={I.ok}    color={T.green}  delay={.05}/>
        <KPI label="ملغية"            value={fail.length} sub={fail.length+" حجز"}  icon={I.warn}  color={T.red}    delay={.1}/>
        <KPI label="إجمالي الإيرادات" value={rev.toLocaleString()+" ر.س"} sub="من المؤكدة" icon={I.trend} color={T.purple} delay={.15}/>
      </div>

      <div style={{display:"grid",gridTemplateColumns:"1.4fr 1fr",gap:16,marginBottom:16}}>
        <div style={{background:T.surface,border:`1.5px solid ${T.border}`,borderRadius:14,padding:"20px"}}>
          <div style={{color:T.text,fontWeight:600,fontSize:13,marginBottom:16}}>الخدمات الأكثر طلباً</div>
          {sorted.length===0
            ?<div style={{textAlign:"center",color:T.muted,fontSize:13,padding:20}}>لا توجد بيانات</div>
            :sorted.map(([name,s])=>(
              <div key={name} style={{marginBottom:14}}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:5}}>
                  <span style={{color:T.textSoft,fontSize:12}}>{name}</span>
                  <div style={{display:"flex",gap:10}}>
                    <span style={{color:T.green,fontSize:11,fontWeight:500,fontFamily:"'DM Mono',monospace"}}>{s.count} حجز</span>
                    <span style={{color:T.purple,fontSize:11,fontWeight:500,fontFamily:"'DM Mono',monospace"}}>{s.revenue.toLocaleString()} ر.س</span>
                  </div>
                </div>
                <div style={{height:6,background:T.bg,borderRadius:3}}>
                  <div style={{height:"100%",borderRadius:3,width:Math.round((s.count/maxC)*100)+"%",
                    background:`linear-gradient(90deg,${T.accent}70,${T.accent})`,transition:"width 1s ease"}}/>
                </div>
              </div>
            ))
          }
        </div>

        <div style={{background:T.surface,border:`1.5px solid ${T.border}`,borderRadius:14,padding:"20px"}}>
          <div style={{color:T.text,fontWeight:600,fontSize:13,marginBottom:16}}>نسب الأداء</div>
          {[
            {label:"معدل الإكمال",value:all.length?Math.round((done.length/all.length)*100):0,color:T.green},
            {label:"معدل الإلغاء",value:all.length?Math.round((fail.length/all.length)*100):0,color:T.red},
          ].map(item=>(
            <div key={item.label} style={{marginBottom:16}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
                <span style={{color:T.textSoft,fontSize:13}}>{item.label}</span>
                <span style={{color:item.color,fontWeight:600,fontSize:13,fontFamily:"'DM Mono',monospace"}}>{item.value}%</span>
              </div>
              <div style={{height:6,background:T.bg,borderRadius:3}}>
                <div style={{height:"100%",borderRadius:3,width:item.value+"%",
                  background:`linear-gradient(90deg,${item.color}70,${item.color})`,transition:"width 1s ease"}}/>
              </div>
            </div>
          ))}
          <div style={{paddingTop:14,borderTop:`1.5px solid ${T.border}`}}>
            {[
              {l:"العملاء الفريدين",     v:uniq,                                                                c:T.purple},
              {l:"متوسط قيمة الحجز",    v:(done.length?Math.round(rev/done.length):0).toLocaleString()+" ر.س", c:T.accent},
              {l:"إجمالي الإيرادات",     v:rev.toLocaleString()+" ر.س",                                        c:T.text},
            ].map(item=>(
              <div key={item.l} style={{display:"flex",justifyContent:"space-between",marginBottom:8}}>
                <span style={{color:T.textSoft,fontSize:12}}>{item.l}</span>
                <span style={{color:item.c,fontWeight:600,fontSize:12,fontFamily:"'DM Mono',monospace"}}>{item.v}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* جدول تفصيلي */}
      <div style={{background:T.surface,border:`1.5px solid ${T.border}`,borderRadius:14,overflow:"hidden"}}>
        <div style={{padding:"14px 20px",borderBottom:`1.5px solid ${T.border}`,
          display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <span style={{color:T.text,fontWeight:600,fontSize:13}}>سجل الحجوزات</span>
          <span style={{color:T.muted,fontSize:11,fontFamily:"'DM Mono',monospace"}}>{all.length} سجل</span>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 0.8fr 0.8fr",
          padding:"9px 20px",background:T.bg,borderBottom:`1.5px solid ${T.border}`}}>
          {["العميل","الخدمة","التاريخ","المبلغ","الحالة"].map(h=>(
            <div key={h} style={{color:T.muted,fontSize:11,fontWeight:600,textTransform:"uppercase",letterSpacing:0.5}}>{h}</div>
          ))}
        </div>
        <div style={{maxHeight:280,overflow:"auto"}}>
          {all.length===0
            ?<div style={{padding:30,textAlign:"center",color:T.muted,fontSize:13}}>لا توجد بيانات</div>
            :all.map(b=>(
              <div key={b.id} className="row-h" style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 0.8fr 0.8fr",
                padding:"11px 20px",borderBottom:`1px solid ${T.border}80`,background:T.surface}}>
                <div style={{color:T.text,fontSize:13}}>{b.name}</div>
                <div style={{color:T.textSoft,fontSize:12}}>{b.service}</div>
                <div style={{color:T.muted,fontSize:12}}>{formatDate(b.date)} {b.time}</div>
                <div style={{color:T.accent,fontWeight:500,fontSize:12,fontFamily:"'DM Mono',monospace"}}>{b.price}</div>
                <Tag label={b.status==="confirmed"?"مؤكد":"ملغي"} type={b.status==="confirmed"?"confirmed":"cancelled"}/>
              </div>
            ))
          }
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
  const [form,     setForm]     = useState({username:"",password:"",role:"staff"});
  const [formErr,  setFormErr]  = useState("");
  const [saving,   setSaving]   = useState(false);
  const [showPwd,  setShowPwd]  = useState(false);

  const fetchU = async()=>{ try{const r=await fetch(API_URL+"/api/users");setUsers(await r.json());}catch{}finally{setLoading(false);} };
  useEffect(()=>{fetchU();},[]);

  const openAdd  = ()=>{ setForm({username:"",password:"",role:"staff"}); setEditUser(null); setFormErr(""); setShowPwd(false); setShowForm(true); };
  const openEdit = (u)=>{ setForm({username:u.username,password:"",role:u.role}); setEditUser(u); setFormErr(""); setShowPwd(false); setShowForm(true); };

  const save = async()=>{
    if(!form.username.trim()) return setFormErr("اسم المستخدم مطلوب");
    if(!editUser&&!form.password.trim()) return setFormErr("كلمة المرور مطلوبة");
    setSaving(true);
    try{
      const url=editUser?API_URL+"/api/users/"+editUser.id:API_URL+"/api/users";
      const res=await fetch(url,{method:editUser?"PATCH":"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(form)});
      const d=await res.json();
      if(!res.ok) return setFormErr(d.error||"حدث خطأ");
      await fetchU(); setShowForm(false);
    }catch{setFormErr("تعذر الاتصال");}finally{setSaving(false);}
  };

  const del = async(u)=>{ if(!window.confirm("حذف "+u.username+"؟")) return; await fetch(API_URL+"/api/users/"+u.id,{method:"DELETE"}); fetchU(); };

  return (
    <div className="fu">
      {showForm&&(
        <Modal title={editUser?"تعديل مستخدم":"إضافة مستخدم"} onClose={()=>setShowForm(false)} width={380}>
          <div style={{display:"flex",flexDirection:"column",gap:13,marginBottom:16}}>
            <Lbl label="اسم المستخدم *">
              <input value={form.username} onChange={e=>setForm({...form,username:e.target.value})}
                placeholder="اسم المستخدم" style={inp(!!formErr&&!form.username)} onFocus={fIn} onBlur={fOut()}/>
            </Lbl>
            <Lbl label={editUser?"كلمة مرور جديدة (اختياري)":"كلمة المرور *"}>
              <div style={{position:"relative"}}>
                <input type={showPwd?"text":"password"} value={form.password}
                  onChange={e=>setForm({...form,password:e.target.value})}
                  placeholder={editUser?"اتركها فارغة للإبقاء":"كلمة المرور"}
                  style={{...inp(),paddingLeft:38}} onFocus={fIn} onBlur={fOut()}/>
                <button onClick={()=>setShowPwd(!showPwd)} style={{position:"absolute",left:10,top:"50%",transform:"translateY(-50%)",background:"none",border:"none",cursor:"pointer",padding:0}}>
                  <Ico d={showPwd?I.eyeoff:I.eye} size={15} color={T.muted}/>
                </button>
              </div>
            </Lbl>
            <Lbl label="الصلاحية">
              <select value={form.role} onChange={e=>setForm({...form,role:e.target.value})}
                style={{...inp(),cursor:"pointer"}} onFocus={fIn} onBlur={fOut()}>
                <option value="staff">موظف — بدون تقارير</option>
                <option value="admin">مدير — كامل الصلاحيات</option>
              </select>
            </Lbl>
            {formErr&&<div style={{color:T.red,fontSize:12}}>{formErr}</div>}
          </div>
          <div style={{display:"flex",gap:8}}>
            <Btn onClick={save} disabled={saving} style={{flex:1}}>{saving?"جاري الحفظ...":"حفظ"}</Btn>
            <Btn onClick={()=>setShowForm(false)} variant="ghost" style={{flex:1}}>إلغاء</Btn>
          </div>
        </Modal>
      )}
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:18}}>
        <div style={{color:T.muted,fontSize:12,fontFamily:"'DM Mono',monospace"}}>{users.length} مستخدم</div>
        <Btn onClick={openAdd}>+ إضافة مستخدم</Btn>
      </div>
      <div style={{background:T.surface,border:`1.5px solid ${T.border}`,borderRadius:14,overflow:"hidden"}}>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr auto",
          padding:"10px 20px",background:T.bg,borderBottom:`1.5px solid ${T.border}`}}>
          {["المستخدم","الصلاحية","تاريخ الإضافة",""].map(h=>(
            <div key={h} style={{color:T.muted,fontSize:11,fontWeight:600,textTransform:"uppercase",letterSpacing:0.5}}>{h}</div>
          ))}
        </div>
        {loading
          ?<div style={{padding:30,textAlign:"center",color:T.muted}}>جاري التحميل...</div>
          :users.map(u=>(
            <div key={u.id} className="row-h" style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr auto",
              alignItems:"center",padding:"13px 20px",borderBottom:`1px solid ${T.border}80`,background:T.surface}}>
              <div style={{display:"flex",alignItems:"center",gap:10}}>
                <Avatar name={u.username} role={u.role} size={32}/>
                <span style={{color:T.text,fontSize:13,fontWeight:500}}>{u.username}</span>
              </div>
              <Tag label={u.role==="admin"?"مدير":"موظف"} type={u.role==="admin"?"admin":"staff"}/>
              <span style={{color:T.muted,fontSize:12,fontFamily:"'DM Mono',monospace"}}>
                {new Date(u.created_at).toLocaleDateString("ar-SA")}
              </span>
              <div style={{display:"flex",gap:6}}>
                <button onClick={()=>openEdit(u)} className="t" style={{
                  background:T.bg,border:`1.5px solid ${T.border}`,borderRadius:6,
                  padding:"4px 10px",color:T.accent,fontSize:11,cursor:"pointer"}}>تعديل</button>
                <button onClick={()=>del(u)} className="t" style={{
                  background:T.redBg,border:"1.5px solid #FECACA",borderRadius:6,
                  padding:"4px 10px",color:T.red,fontSize:11,cursor:"pointer"}}>حذف</button>
              </div>
            </div>
          ))
        }
      </div>
    </div>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────
export default function App() {
  const [loggedIn, setLoggedIn] = useState(()=>window.location.hash.startsWith("#auth"));
  const [userRole, setUserRole] = useState(()=>window.location.hash.includes("admin")?"admin":"staff");
  const [username, setUsername] = useState(()=>decodeURIComponent(window.location.hash.split("-")[2]||""));

  const handleLogin = (role, uname) => {
    window.location.hash = "#auth-"+role+"-"+encodeURIComponent(uname);
    setUserRole(role); setUsername(uname); setLoggedIn(true);
  };

  if (!loggedIn) return <LoginScreen onLogin={handleLogin}/>;
  return <Dashboard onLogout={()=>{window.location.hash="";window.location.reload();}} role={userRole} username={username}/>;
}

function Dashboard({ onLogout, role, username }) {
  const [bookings,  setBookings]  = useState([]);
  const [tab,       setTab]       = useState("overview");
  const [notifs,    setNotifs]    = useState([]);
  const [lastSync,  setLastSync]  = useState(null);
  const [syncing,   setSyncing]   = useState(false);
  const [showAdd,   setShowAdd]   = useState(false);
  const [confirm,   setConfirm]   = useState(null);
  const [isAdmin,   setIsAdmin]   = useState(()=>role==="admin");
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [services,  setServices]  = useLocalStorage("lamsa_services", []);

  const notif = (msg,type="success") => {
    const id=Date.now(); setNotifs(p=>[...p,{id,msg,type}]);
    setTimeout(()=>setNotifs(p=>p.filter(n=>n.id!==id)),4000);
  };

  const fetchB = useCallback(async()=>{
    setSyncing(true);
    try{const r=await fetch(API_URL+"/api/bookings");setBookings(await r.json());setLastSync(new Date());}
    catch{}finally{setSyncing(false);}
  },[]);

  useEffect(()=>{fetchB();const i=setInterval(fetchB,30000);return()=>clearInterval(i);},[fetchB]);

  useEffect(()=>{
    const es=new EventSource(API_URL+"/api/events");
    es.onmessage=e=>{try{const d=JSON.parse(e.data);if(d.type==="new_booking"){fetchB();notif("حجز جديد — "+d.name);}}catch{}};
    es.onerror=()=>es.close();return()=>es.close();
  },[fetchB]);

  const cancelBooking = (id,name) => setConfirm({id,name});
  const doCancel = async()=>{
    const{id}=confirm; setConfirm(null);
    const cancelledAt = new Date().toISOString();
    try{await fetch(API_URL+"/api/bookings/"+id+"/cancel",{method:"PATCH"});}catch{}
    setBookings(p=>p.map(b=>b.id===id?{...b,status:"cancelled",cancelledAt}:b));
    notif("تم إلغاء الموعد","cancel");
  };
  const addBooking = async(b)=>{
    try{await fetch(API_URL+"/api/bookings/manual",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(b)});fetchB();}
    catch{setBookings(p=>[b,...p]);}
    notif("تم إضافة الحجز","success");
  };

  const visibleBookings = filterBookings(bookings);
  const today     = visibleBookings.filter(b=>b.date==="اليوم"&&b.status!=="cancelled");
  const confirmed = visibleBookings.filter(b=>b.status==="confirmed");
  const pending   = visibleBookings.filter(b=>b.status==="pending");

  const TABS = [
    {id:"overview",label:"نظرة عامة",  icon:I.grid},
    {id:"bookings",label:"الحجوزات",   icon:I.cal},
    {id:"services",label:"الخدمات",    icon:I.box},
    {id:"offers",  label:"العروض",     icon:I.tag},
    {id:"reports", label:"التقارير",   icon:I.trend, admin:true},
    {id:"users",   label:"المستخدمون", icon:I.users, admin:true},
  ];

  return (
    <div style={{minHeight:"100vh",background:T.bg,fontFamily:"'IBM Plex Sans Arabic',sans-serif",direction:"rtl",display:"flex"}}>
      <style>{CSS}</style>

      {showAdminModal&&<AdminModal onClose={()=>setShowAdminModal(false)} onSuccess={()=>setIsAdmin(true)}/>}
      {showAdd&&<AddBooking onClose={()=>setShowAdd(false)} onAdd={addBooking} services={services}/>}
      {confirm&&<Confirm msg={`إلغاء موعد ${confirm.name}؟`} onOk={doCancel} onCancel={()=>setConfirm(null)}/>}

      {/* Notifications */}
      <div style={{position:"fixed",top:16,left:"50%",transform:"translateX(-50%)",
        zIndex:2000,display:"flex",flexDirection:"column",gap:8,alignItems:"center",pointerEvents:"none"}}>
        {notifs.map(n=>(
          <div key={n.id} className="si" style={{
            background:T.surface,border:`1.5px solid ${n.type==="success"?T.green:n.type==="cancel"?T.red:T.accent}40`,
            color:n.type==="success"?T.green:n.type==="cancel"?T.red:T.accent,
            padding:"10px 18px",borderRadius:50,fontSize:13,whiteSpace:"nowrap",
            boxShadow:"0 4px 16px rgba(0,0,0,0.1)"}}>
            {n.msg}
          </div>
        ))}
      </div>

      {/* Sidebar */}
      <div style={{width:220,background:T.sidebar,display:"flex",flexDirection:"column",
        position:"fixed",top:0,right:0,height:"100vh",zIndex:100,
        borderLeft:"1px solid rgba(255,255,255,0.05)"}}>
        <div style={{padding:"20px 16px 16px",borderBottom:"1px solid rgba(255,255,255,0.08)"}}>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <div style={{width:38,height:38,borderRadius:10,
              background:`linear-gradient(135deg,${T.accent},${T.accent}AA)`,
              display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,
              boxShadow:`0 4px 12px ${T.accent}50`}}>🏢</div>
            <div>
              <div style={{color:"#F1F5F9",fontWeight:700,fontSize:14,lineHeight:1.2}}>{CONFIG.businessName}</div>
              <div style={{color:T.sideMuted,fontSize:10,marginTop:2}}>{CONFIG.businessType}</div>
            </div>
          </div>
        </div>

        <nav style={{flex:1,padding:"12px 8px",display:"flex",flexDirection:"column",gap:1}}>
          {TABS.map(t=>(
            <button key={t.id} className="nav-h t" onClick={()=>{
              if(t.admin&&!isAdmin){setShowAdminModal(true);return;}
              setTab(t.id);
            }} style={{
              display:"flex",alignItems:"center",gap:9,padding:"9px 10px",
              borderRadius:8,border:"none",textAlign:"right",cursor:"pointer",
              background:tab===t.id?`${T.accent}25`:"transparent",
              color:tab===t.id?"#fff":T.sideText,
              fontFamily:"inherit",fontSize:13,fontWeight:tab===t.id?600:400,
              borderRight:`3px solid ${tab===t.id?T.accent:"transparent"}`}}>
              <Ico d={t.icon} size={15} color={tab===t.id?T.accent:T.sideMuted}/>
              {t.label}
              {t.admin&&!isAdmin&&<Ico d={I.lock} size={10} color={T.sideMuted}/>}
              {t.id==="bookings"&&pending.length>0&&(
                <span style={{marginRight:"auto",background:`${T.accent}30`,color:T.accent,
                  fontSize:10,padding:"1px 6px",borderRadius:6,fontWeight:700,fontFamily:"'DM Mono',monospace"}}>{pending.length}</span>
              )}
            </button>
          ))}
        </nav>

        <div style={{padding:"10px 8px",borderTop:"1px solid rgba(255,255,255,0.08)"}}>
          <div style={{display:"flex",alignItems:"center",gap:9,padding:"9px 10px",
            background:"rgba(255,255,255,0.05)",borderRadius:8,marginBottom:6}}>
            <Avatar name={username} role={isAdmin?"admin":"staff"} size={30}/>
            <div style={{flex:1,minWidth:0}}>
              <div style={{color:"#F1F5F9",fontSize:12,fontWeight:500,
                overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{username||"مستخدم"}</div>
              <div style={{color:T.sideMuted,fontSize:10}}>{isAdmin?"مدير":"موظف"}</div>
            </div>
          </div>
          <div style={{display:"flex",gap:5}}>
            <button onClick={fetchB} disabled={syncing} className="t" style={{
              flex:1,display:"flex",alignItems:"center",justifyContent:"center",gap:4,
              padding:"7px",background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.08)",
              borderRadius:7,color:T.sideText,fontFamily:"inherit",fontSize:11,cursor:"pointer"}}>
              <Ico d={I.refresh} size={12} color={T.sideMuted}
                style={{animation:syncing?"spin 1s linear infinite":"none"}}/>
              {syncing?"...":"تحديث"}
            </button>
            <button onClick={onLogout} className="t" style={{
              flex:1,display:"flex",alignItems:"center",justifyContent:"center",gap:4,
              padding:"7px",background:"rgba(220,38,38,0.12)",border:"1px solid rgba(220,38,38,0.2)",
              borderRadius:7,color:"#FCA5A5",fontFamily:"inherit",fontSize:11,cursor:"pointer"}}>
              <Ico d={I.out} size={12} color="#FCA5A5"/> خروج
            </button>
          </div>
          {lastSync&&(
            <div style={{textAlign:"center",color:T.sideMuted,fontSize:10,marginTop:6,
              display:"flex",alignItems:"center",justifyContent:"center",gap:4}}>
              <div style={{width:5,height:5,borderRadius:"50%",background:T.green,animation:"pulse 2s infinite"}}/>
              {lastSync.toLocaleTimeString("ar-SA",{hour:"2-digit",minute:"2-digit"})}
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div style={{marginRight:220,flex:1,padding:"24px 28px",minHeight:"100vh"}}>
        {/* Topbar */}
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:24}}>
          <div>
            <h1 style={{fontSize:20,fontWeight:700,color:T.text,letterSpacing:-0.3}}>
              {TABS.find(t=>t.id===tab)?.label||"لوحة التحكم"}
            </h1>
            <div style={{color:T.muted,fontSize:12,marginTop:3}}>
              {new Date().toLocaleDateString("ar-SA",{weekday:"long",year:"numeric",month:"long",day:"numeric"})}
            </div>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            {isAdmin&&(
              <div style={{display:"flex",alignItems:"center",gap:5,padding:"5px 10px",
                background:T.purpleBg,border:"1.5px solid #DDD6FE",borderRadius:8,
                color:T.purple,fontSize:11,fontWeight:500}}>
                <Ico d={I.shield} size={12} color={T.purple}/> مدير
              </div>
            )}
            <div style={{display:"flex",alignItems:"center",gap:5,padding:"5px 10px",
              background:T.bg,border:`1.5px solid ${T.border}`,borderRadius:8,
              color:T.muted,fontSize:12,fontFamily:"'DM Mono',monospace"}}>
              <Ico d={I.bell} size={13} color={T.muted}/>{pending.length} معلق
            </div>
            <Btn onClick={()=>setShowAdd(true)} style={{display:"flex",alignItems:"center",gap:5,padding:"9px 14px"}}>
              <Ico d={I.plus} size={14} color="#fff"/> حجز جديد
            </Btn>
          </div>
        </div>

        {/* OVERVIEW */}
        {tab==="overview"&&(
          <div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:14,marginBottom:22}}>
              <KPI label="حجوزات اليوم"  value={today.length}     sub={today.length+" حجز"}   icon={I.cal}   color={T.accent} delay={0}/>
              <KPI label="مؤكدة"          value={confirmed.length} sub="مكتملة"               icon={I.ok}    color={T.green}  delay={.05}/>
              <KPI label="في الانتظار"   value={pending.length}   sub="تحتاج تأكيد"           icon={I.clock} color={T.amber}  delay={.1}/>
              <KPI label="الخدمات"        value={services.length}  sub="خدمة مسجلة"           icon={I.box}   color={T.purple} delay={.15}/>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1.4fr 1fr",gap:16}}>
              <div className="fu" style={{background:T.surface,border:`1.5px solid ${T.border}`,
                borderRadius:14,overflow:"hidden",animationDelay:"0.2s"}}>
                <div style={{padding:"14px 18px",borderBottom:`1.5px solid ${T.border}`,
                  display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  <span style={{color:T.text,fontWeight:600,fontSize:13}}>حجوزات اليوم</span>
                  <Tag label={today.length+" حجز"}/>
                </div>
                {today.length===0
                  ?<div style={{padding:36,textAlign:"center",color:T.muted,fontSize:13}}>
                    <div style={{fontSize:32,marginBottom:8,opacity:0.4}}>📅</div>لا توجد حجوزات اليوم
                  </div>
                  :today.map(b=>(
                    <div key={b.id} className="row-h" style={{display:"flex",alignItems:"center",
                      gap:10,padding:"11px 18px",borderBottom:`1px solid ${T.border}80`,background:T.surface}}>
                      <Avatar name={b.name} role="staff" size={30}/>
                      <div style={{flex:1}}>
                        <div style={{color:T.text,fontSize:13,fontWeight:500}}>{b.name}</div>
                        <div style={{color:T.muted,fontSize:11,marginTop:1}}>{b.service}</div>
                      </div>
                      <div style={{textAlign:"left"}}>
                        <div style={{color:T.accent,fontSize:12,fontWeight:600,fontFamily:"'DM Mono',monospace"}}>{b.time}</div>
                        <div style={{color:T.muted,fontSize:11,marginTop:1,fontFamily:"'DM Mono',monospace"}}>{b.price}</div>
                      </div>
                    </div>
                  ))
                }
              </div>
              <div className="fu" style={{background:T.surface,border:`1.5px solid ${T.border}`,
                borderRadius:14,padding:"16px 18px",animationDelay:"0.25s"}}>
                <div style={{color:T.text,fontWeight:600,fontSize:13,marginBottom:16}}>الخدمات الأكثر طلباً</div>
                {services.length===0
                  ?<div style={{textAlign:"center",color:T.muted,fontSize:12,padding:20}}>
                    أضف خدماتك من قائمة الخدمات
                  </div>
                  :services.slice(0,5).map(s=>{
                    const cnt=bookings.filter(b=>b.service===s.name).length;
                    const mx=Math.max(...services.map(sv=>bookings.filter(b=>b.service===sv.name).length),1);
                    return(
                      <div key={s.id} style={{marginBottom:12}}>
                        <div style={{display:"flex",justifyContent:"space-between",marginBottom:5}}>
                          <span style={{color:T.textSoft,fontSize:12}}>{s.icon} {s.name}</span>
                          <span style={{color:T.accent,fontSize:11,fontWeight:500,fontFamily:"'DM Mono',monospace"}}>{cnt}</span>
                        </div>
                        <div style={{height:5,background:T.bg,borderRadius:3}}>
                          <div style={{height:"100%",borderRadius:3,
                            width:Math.round((cnt/mx)*100)||8+"%",
                            background:`linear-gradient(90deg,${T.accent}70,${T.accent})`,transition:"width 1s ease"}}/>
                        </div>
                      </div>
                    );
                  })
                }
              </div>
            </div>
          </div>
        )}

        {tab==="bookings" && <BookingsPage bookings={bookings} onCancel={cancelBooking}/>}
        {tab==="services" && <ServicesPage/>}
        {tab==="offers"   && <OffersPage/>}

        {tab==="reports"&&(isAdmin?<Reports bookings={bookings}/>:(
          <div style={{textAlign:"center",padding:60}}>
            <div style={{fontSize:48,marginBottom:16,opacity:0.3}}>🔒</div>
            <div style={{color:T.muted,fontSize:14,marginBottom:20}}>هذه الصفحة للمدير فقط</div>
            <Btn onClick={()=>setShowAdminModal(true)}>دخول كمدير</Btn>
          </div>
        ))}

        {tab==="users"&&(isAdmin?<UsersPage/>:(
          <div style={{textAlign:"center",padding:60}}>
            <div style={{fontSize:48,marginBottom:16,opacity:0.3}}>🔒</div>
            <div style={{color:T.muted,fontSize:14,marginBottom:20}}>هذه الصفحة للمدير فقط</div>
            <Btn onClick={()=>setShowAdminModal(true)}>دخول كمدير</Btn>
          </div>
        ))}
      </div>
    </div>
  );
}
