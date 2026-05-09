import { useState, useEffect, useCallback, useRef } from "react";

// ─── CONFIG ──────────────────────────────────────────────────────────
const API_URL = "https://lamsa-salon-server-production.up.railway.app";

const SERVICES = [
  { id:1, name:"باديكير وميديكير", duration:45,  price:80,  icon:"💅", color:"#E8A598" },
  { id:2, name:"تلوين شعر",        duration:90,  price:250, icon:"🎨", color:"#B8A9D9" },
  { id:3, name:"قص وتصفيف",        duration:60,  price:150, icon:"✂️", color:"#A8C9B8" },
  { id:4, name:"علاج بالأوزون",    duration:60,  price:200, icon:"🌿", color:"#A8C4B8" },
  { id:5, name:"مساج استرخاء",     duration:60,  price:180, icon:"🪷", color:"#D4A8B8" },
  { id:6, name:"تنظيف بشرة",       duration:75,  price:220, icon:"✨", color:"#D4C8A8" },
  { id:7, name:"عروس كاملة",       duration:240, price:800, icon:"👰", color:"#C8A8D4" },
];

// ─── ICONS ───────────────────────────────────────────────────────────
const Icon = ({ d, size=16, color="currentColor", strokeWidth=1.5 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
    <path d={d}/>
  </svg>
);
const IC = {
  grid:     "M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z",
  calendar: "M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z",
  scissors: "M6 3a3 3 0 1 0 0 6 3 3 0 0 0 0-6zM6 15a3 3 0 1 0 0 6 3 3 0 0 0 0-6zM20 4 8.12 15.88M14.47 14.48 20 20M8.12 8.12 12 12",
  check:    "M20 6 9 17 4 12",
  clock:    "M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2zM12 6v6l4 2",
  bell:     "M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0",
  trending: "M22 7 13.5 15.5l-5-5L2 17M22 7h-5M22 7v5",
  download: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3",
  lock:     "M19 11H5a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2zM7 11V7a5 5 0 0 1 10 0v4",
  shield:   "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",
  logout:   "M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9",
  search:   "M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z",
  phone:    "M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13.6a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 3h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 10.6a16 16 0 0 0 6 6l.94-.94a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 17z",
  alert:    "M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0zM12 9v4M12 17h.01",
  refresh:  "M23 4v6h-6M1 20v-6h6M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15",
  plus:     "M12 5v14M5 12h14",
  edit:     "M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z",
  trash:    "M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2",
  eye:      "M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8zM12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z",
  eyeoff:   "M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24M1 1l22 22",
};

// ─── CSS ─────────────────────────────────────────────────────────────
const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Noto+Naskh+Arabic:wght@400;500;600;700&family=Playfair+Display:wght@400;600&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: #FAF8F5; }
  ::-webkit-scrollbar { width: 4px; height: 4px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: #D4C5B0; border-radius: 4px; }

  @keyframes fadeUp   { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
  @keyframes fadeIn   { from { opacity:0; } to { opacity:1; } }
  @keyframes slideIn  { from { opacity:0; transform:translateX(20px); } to { opacity:1; transform:translateX(0); } }
  @keyframes pulse    { 0%,100% { opacity:.5; } 50% { opacity:1; } }
  @keyframes shake    { 0%,100%{transform:translateX(0)} 25%{transform:translateX(-6px)} 75%{transform:translateX(6px)} }
  @keyframes spin     { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }

  .fade-up   { animation: fadeUp   0.5s cubic-bezier(.22,.68,0,1.2) both; }
  .fade-in   { animation: fadeIn   0.4s ease both; }
  .slide-in  { animation: slideIn  0.4s ease both; }

  .btn-hover { transition: all 0.2s ease; }
  .btn-hover:hover { transform: translateY(-1px); box-shadow: 0 4px 16px rgba(0,0,0,0.12); }
  .btn-hover:active { transform: translateY(0); }

  .row-hover { transition: background 0.15s ease; }
  .row-hover:hover { background: #F5F0E8 !important; }

  .nav-item { transition: all 0.2s ease; cursor: pointer; }
  .nav-item:hover { background: rgba(180,155,120,0.08) !important; }

  .card-hover { transition: all 0.25s ease; }
  .card-hover:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(0,0,0,0.08) !important; }

  input, select, textarea { font-family: 'Noto Naskh Arabic', serif; }
  button { font-family: 'Noto Naskh Arabic', serif; }
`;

// ─── DESIGN TOKENS ───────────────────────────────────────────────────
const T = {
  cream:    "#FAF8F5",
  warm:     "#F5F0E8",
  border:   "#E8E0D0",
  muted:    "#B4A898",
  text:     "#2C2418",
  textSoft: "#6B5E52",
  gold:     "#B49678",
  goldDark: "#8C7258",
  goldLight:"#D4C5B0",
  green:    "#5C8C6C",
  red:      "#C46060",
  blue:     "#6080A0",
  purple:   "#8878C0",
};

// ─── HELPERS ─────────────────────────────────────────────────────────
const Avatar = ({ name, role, size=36 }) => {
  const bg = role==="admin" ? `linear-gradient(135deg,${T.purple},#6858A8)` : `linear-gradient(135deg,${T.gold},${T.goldDark})`;
  return (
    <div style={{ width:size, height:size, borderRadius:"50%", background:bg,
      display:"flex", alignItems:"center", justifyContent:"center",
      fontSize:size*0.38, fontWeight:700, color:"#fff", flexShrink:0, fontFamily:"serif" }}>
      {name?.[0] || "م"}
    </div>
  );
};

const Badge = ({ label, type="default" }) => {
  const styles = {
    confirmed: { bg:"#EBF5EE", color:T.green,   border:"#C4DEC8" },
    pending:   { bg:"#FDF5E6", color:"#B08040",  border:"#E8D090" },
    cancelled: { bg:"#FBEDED", color:T.red,      border:"#E8C0C0" },
    admin:     { bg:"#F0EDF8", color:T.purple,   border:"#D0C8E8" },
    staff:     { bg:"#F5F0E8", color:T.gold,     border:T.goldLight },
    default:   { bg:T.warm,    color:T.textSoft, border:T.border },
  };
  const s = styles[type] || styles.default;
  return (
    <span style={{ background:s.bg, color:s.color, border:`1px solid ${s.border}`,
      fontSize:11, padding:"3px 10px", borderRadius:20, fontWeight:500, whiteSpace:"nowrap" }}>
      {label}
    </span>
  );
};

const StatCard = ({ label, value, sub, icon, color, delay=0 }) => (
  <div className="card-hover fade-up" style={{ animationDelay:`${delay}s`,
    background:"#fff", border:`1px solid ${T.border}`, borderRadius:16,
    padding:"22px 20px", boxShadow:"0 2px 8px rgba(0,0,0,0.04)" }}>
    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
      <div>
        <div style={{ color:T.muted, fontSize:12, marginBottom:10, fontWeight:500 }}>{label}</div>
        <div style={{ color:T.text, fontSize:28, fontWeight:700, lineHeight:1, fontFamily:"'Playfair Display',serif" }}>{value}</div>
        {sub && <div style={{ color, fontSize:11, marginTop:6, fontWeight:500 }}>{sub}</div>}
      </div>
      <div style={{ width:42, height:42, borderRadius:12, background:`${color}18`,
        display:"flex", alignItems:"center", justifyContent:"center" }}>
        <Icon d={icon} color={color} size={18} strokeWidth={1.5}/>
      </div>
    </div>
  </div>
);

// ─── MODALS ──────────────────────────────────────────────────────────
const Modal = ({ title, onClose, children, width=380 }) => (
  <div className="fade-in" style={{ position:"fixed", inset:0, background:"rgba(44,36,24,0.4)",
    display:"flex", alignItems:"center", justifyContent:"center", zIndex:3000,
    direction:"rtl", backdropFilter:"blur(4px)" }}>
    <div className="fade-up" style={{ background:"#fff", borderRadius:20, padding:"28px 28px 24px",
      width, boxShadow:"0 24px 60px rgba(0,0,0,0.15)", border:`1px solid ${T.border}` }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
        <span style={{ color:T.text, fontWeight:700, fontSize:16 }}>{title}</span>
        <button onClick={onClose} style={{ background:"none", border:"none", color:T.muted,
          cursor:"pointer", fontSize:18, lineHeight:1, padding:4 }}>✕</button>
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

const inputStyle = (error=false) => ({
  width:"100%", background: error ? "#FDF5F5" : T.warm,
  border:`1px solid ${error ? "#E8C0C0" : T.border}`,
  borderRadius:10, padding:"10px 14px", color:T.text, fontSize:13,
  outline:"none", direction:"rtl", boxSizing:"border-box", fontFamily:"inherit",
  transition:"border-color 0.2s, background 0.2s",
});

const PrimaryBtn = ({ onClick, children, disabled, style={} }) => (
  <button onClick={onClick} disabled={disabled} className="btn-hover" style={{
    padding:"11px 20px", background: disabled ? T.goldLight : `linear-gradient(135deg,${T.gold},${T.goldDark})`,
    border:"none", borderRadius:10, color:"#fff", fontFamily:"inherit",
    fontSize:13, fontWeight:600, cursor: disabled ? "default" : "pointer",
    opacity: disabled ? 0.7 : 1, ...style }}>
    {children}
  </button>
);

const SecondaryBtn = ({ onClick, children, style={} }) => (
  <button onClick={onClick} className="btn-hover" style={{
    padding:"11px 20px", background:"#fff", border:`1px solid ${T.border}`,
    borderRadius:10, color:T.textSoft, fontFamily:"inherit",
    fontSize:13, fontWeight:500, cursor:"pointer", ...style }}>
    {children}
  </button>
);

// ─── LOGIN ───────────────────────────────────────────────────────────
function LoginScreen({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd,  setShowPwd]  = useState(false);
  const [error,    setError]    = useState("");
  const [shake,    setShake]    = useState(false);
  const [loading,  setLoading]  = useState(false);

  const handleLogin = async () => {
    if (!username.trim()) return setError("أدخل اسم المستخدم");
    if (!password.trim()) return setError("أدخل كلمة المرور");
    setLoading(true); setError("");
    try {
      const res = await fetch(API_URL + "/api/login", {
        method:"POST", headers:{"Content-Type":"application/json"},
        body: JSON.stringify({ username:username.trim(), password }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "خطأ في تسجيل الدخول"); setShake(true); setTimeout(()=>setShake(false),500); }
      else onLogin(data.role, data.username);
    } catch { setError("تعذر الاتصال بالسيرفر"); }
    finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight:"100vh", background:T.cream, display:"flex",
      alignItems:"center", justifyContent:"center", fontFamily:"'Noto Naskh Arabic',serif",
      direction:"rtl", position:"relative", overflow:"hidden" }}>
      <style>{GLOBAL_CSS}</style>

      {/* Decorative background */}
      <div style={{ position:"absolute", inset:0, overflow:"hidden", pointerEvents:"none" }}>
        <div style={{ position:"absolute", top:-100, right:-100, width:400, height:400,
          borderRadius:"50%", background:`radial-gradient(circle, ${T.goldLight}40 0%, transparent 70%)` }}/>
        <div style={{ position:"absolute", bottom:-80, left:-80, width:300, height:300,
          borderRadius:"50%", background:`radial-gradient(circle, #E8D4C040 0%, transparent 70%)` }}/>
        <div style={{ position:"absolute", top:"30%", left:"10%", width:1, height:200,
          background:`linear-gradient(to bottom, transparent, ${T.goldLight}60, transparent)` }}/>
        <div style={{ position:"absolute", top:"20%", right:"15%", width:1, height:150,
          background:`linear-gradient(to bottom, transparent, ${T.goldLight}40, transparent)` }}/>
      </div>

      <div className="fade-up" style={{ width:380, position:"relative" }}>
        {/* Logo */}
        <div style={{ textAlign:"center", marginBottom:36 }}>
          <div style={{ display:"inline-flex", alignItems:"center", justifyContent:"center",
            width:64, height:64, borderRadius:20,
            background:`linear-gradient(135deg,${T.gold},${T.goldDark})`,
            boxShadow:`0 8px 24px ${T.gold}50`, marginBottom:14, fontSize:28 }}>
            ✨
          </div>
          <div style={{ color:T.text, fontSize:26, fontWeight:700, fontFamily:"'Playfair Display',serif", letterSpacing:1 }}>
            لمسة
          </div>
          <div style={{ color:T.muted, fontSize:13, marginTop:4 }}>لوحة تحكم الصالون</div>
        </div>

        {/* Card */}
        <div style={{ background:"#fff", borderRadius:20, padding:"32px 28px",
          boxShadow:"0 8px 40px rgba(0,0,0,0.08)", border:`1px solid ${T.border}`,
          animation: shake ? "shake 0.4s ease" : "none" }}>

          <div style={{ display:"flex", flexDirection:"column", gap:14, marginBottom:20 }}>
            <Field label="اسم المستخدم">
              <input value={username} onChange={e=>{setUsername(e.target.value);setError("");}}
                onKeyDown={e=>e.key==="Enter"&&handleLogin()}
                placeholder="أدخل اسم المستخدم"
                style={inputStyle(!!error && !username)}
                onFocus={e=>{ e.target.style.borderColor=T.gold; e.target.style.background="#fff"; }}
                onBlur={e=>{ e.target.style.borderColor=T.border; e.target.style.background=T.warm; }}/>
            </Field>

            <Field label="كلمة المرور">
              <div style={{ position:"relative" }}>
                <input type={showPwd?"text":"password"} value={password}
                  onChange={e=>{setPassword(e.target.value);setError("");}}
                  onKeyDown={e=>e.key==="Enter"&&handleLogin()}
                  placeholder="أدخل كلمة المرور"
                  style={{...inputStyle(!!error && username && !password), paddingLeft:40}}
                  onFocus={e=>{ e.target.style.borderColor=T.gold; e.target.style.background="#fff"; }}
                  onBlur={e=>{ e.target.style.borderColor=T.border; e.target.style.background=T.warm; }}/>
                <button onClick={()=>setShowPwd(!showPwd)} style={{
                  position:"absolute", left:12, top:"50%", transform:"translateY(-50%)",
                  background:"none", border:"none", cursor:"pointer", color:T.muted, padding:0 }}>
                  <Icon d={showPwd?IC.eyeoff:IC.eye} size={15} color={T.muted}/>
                </button>
              </div>
            </Field>

            {error && (
              <div style={{ color:T.red, fontSize:12, background:"#FBEDED",
                padding:"8px 12px", borderRadius:8, border:"1px solid #E8C0C0" }}>
                {error}
              </div>
            )}
          </div>

          <PrimaryBtn onClick={handleLogin} disabled={loading} style={{width:"100%",padding:"13px"}}>
            {loading ? "جاري التحقق..." : "دخول"}
          </PrimaryBtn>
        </div>

        <div style={{ textAlign:"center", marginTop:20, color:T.muted, fontSize:12 }}>
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
      if (res.ok) { onSuccess(); onClose(); }
      else { setError(true); }
    } catch { setError(true); }
    finally { setLoading(false); }
  };

  return (
    <Modal title="تسجيل دخول المدير" onClose={onClose} width={340}>
      <div style={{ display:"flex", flexDirection:"column", gap:12, marginBottom:16 }}>
        <Field label="كلمة مرور المدير">
          <div style={{ position:"relative" }}>
            <input type={showPwd?"text":"password"} value={pwd}
              onChange={e=>{setPwd(e.target.value);setError(false);}}
              onKeyDown={e=>e.key==="Enter"&&handle()}
              placeholder="أدخل كلمة المرور"
              style={{...inputStyle(error), paddingLeft:40}}
              onFocus={e=>{ e.target.style.borderColor=T.gold; e.target.style.background="#fff"; }}
              onBlur={e=>{ e.target.style.borderColor=error?"#E8C0C0":T.border; e.target.style.background=T.warm; }}
              autoFocus/>
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
        <PrimaryBtn onClick={handle} disabled={loading} style={{flex:1}}>
          {loading?"جاري...":"دخول"}
        </PrimaryBtn>
        <SecondaryBtn onClick={onClose} style={{flex:1}}>إلغاء</SecondaryBtn>
      </div>
    </Modal>
  );
}

// ─── CONFIRM DIALOG ───────────────────────────────────────────────────
function ConfirmDialog({ message, onConfirm, onCancel }) {
  return (
    <Modal title="تأكيد" onClose={onCancel} width={320}>
      <p style={{ color:T.textSoft, fontSize:13, marginBottom:20, lineHeight:1.7 }}>{message}</p>
      <div style={{ display:"flex", gap:10 }}>
        <button onClick={onConfirm} className="btn-hover" style={{
          flex:1, padding:"10px", background:`linear-gradient(135deg,${T.red},#A04040)`,
          border:"none", borderRadius:10, color:"#fff", fontFamily:"inherit", fontSize:13, cursor:"pointer" }}>
          تأكيد الإلغاء
        </button>
        <SecondaryBtn onClick={onCancel} style={{flex:1}}>تراجع</SecondaryBtn>
      </div>
    </Modal>
  );
}

// ─── ADD BOOKING MODAL ────────────────────────────────────────────────
function AddBookingModal({ onClose, onAdd }) {
  const PRICES = Object.fromEntries(SERVICES.map(s=>[s.name, s.price+" ريال"]));
  const [form, setForm] = useState({ name:"", service:SERVICES[0].name, date:"اليوم", time:"", phone:"" });
  const [error, setError] = useState("");

  const handleSubmit = () => {
    if (!form.name.trim()) return setError("اسم العميلة مطلوب");
    if (!form.time.trim()) return setError("الوقت مطلوب");
    onAdd({ ...form, price:PRICES[form.service], id:Date.now(), status:"confirmed", source:"manual" });
    onClose();
  };

  return (
    <Modal title="إضافة حجز جديد" onClose={onClose} width={400}>
      <div style={{ display:"flex", flexDirection:"column", gap:14, marginBottom:16 }}>
        <Field label="اسم العميلة *">
          <input style={inputStyle(!form.name&&!!error)} value={form.name}
            onChange={e=>setForm({...form,name:e.target.value})} placeholder="مثال: نورة العتيبي"
            onFocus={e=>{ e.target.style.borderColor=T.gold; e.target.style.background="#fff"; }}
            onBlur={e=>{ e.target.style.borderColor=T.border; e.target.style.background=T.warm; }}/>
        </Field>
        <Field label="رقم الواتساب">
          <input style={inputStyle()} value={form.phone}
            onChange={e=>setForm({...form,phone:e.target.value})} placeholder="+966..."
            onFocus={e=>{ e.target.style.borderColor=T.gold; e.target.style.background="#fff"; }}
            onBlur={e=>{ e.target.style.borderColor=T.border; e.target.style.background=T.warm; }}/>
        </Field>
        <Field label="الخدمة *">
          <select style={{...inputStyle(), cursor:"pointer"}} value={form.service}
            onChange={e=>setForm({...form,service:e.target.value})}>
            {SERVICES.map(s=><option key={s.name} value={s.name}>{s.icon} {s.name} — {s.price} ريال</option>)}
          </select>
        </Field>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
          <Field label="التاريخ *">
            <select style={{...inputStyle(), cursor:"pointer"}} value={form.date}
              onChange={e=>setForm({...form,date:e.target.value})}>
              <option>اليوم</option><option>بكره</option><option>بعد بكره</option>
            </select>
          </Field>
          <Field label="الوقت *">
            <input style={inputStyle(!form.time&&!!error)} value={form.time}
              onChange={e=>setForm({...form,time:e.target.value})} placeholder="مثال: 3:00 م"
              onFocus={e=>{ e.target.style.borderColor=T.gold; e.target.style.background="#fff"; }}
              onBlur={e=>{ e.target.style.borderColor=T.border; e.target.style.background=T.warm; }}/>
          </Field>
        </div>
        {error && <div style={{ color:T.red, fontSize:12 }}>{error}</div>}
      </div>
      <div style={{ display:"flex", gap:10 }}>
        <PrimaryBtn onClick={handleSubmit} style={{flex:1}}>إضافة الحجز</PrimaryBtn>
        <SecondaryBtn onClick={onClose} style={{flex:1}}>إلغاء</SecondaryBtn>
      </div>
    </Modal>
  );
}

// ─── BOOKING ROW ──────────────────────────────────────────────────────
function BookingRow({ b, onCancel }) {
  const statusMap = {
    confirmed: { label:"مكتمل",  type:"confirmed" },
    pending:   { label:"معلق",   type:"pending"   },
    cancelled: { label:"ملغي",   type:"cancelled" },
  };
  const s = statusMap[b.status] || statusMap.confirmed;
  const phone = b.phone?.replace("whatsapp:","") || "";

  return (
    <div className="row-hover" style={{ display:"grid", gridTemplateColumns:"1.4fr 1fr 1.2fr 0.8fr 0.8fr auto",
      alignItems:"center", padding:"14px 20px", borderBottom:`1px solid ${T.border}`,
      background:"#fff" }}>
      <div style={{ display:"flex", alignItems:"center", gap:10 }}>
        <Avatar name={b.name} role="staff" size={34}/>
        <div>
          <div style={{ color:T.text, fontSize:13, fontWeight:500 }}>{b.name}</div>
          {phone && <div style={{ color:T.muted, fontSize:11, display:"flex", alignItems:"center", gap:3, marginTop:2 }}>
            <Icon d={IC.phone} size={10} color={T.muted}/>
            {phone}
          </div>}
        </div>
      </div>
      <div style={{ color:T.textSoft, fontSize:13 }}>{b.service}</div>
      <div style={{ color:T.muted, fontSize:12 }}>{b.date} — {b.time}</div>
      <div style={{ color:T.gold, fontWeight:600, fontSize:13 }}>{b.price}</div>
      <Badge label={s.label} type={s.type}/>
      <div>
        {b.status!=="cancelled" && (
          <button onClick={()=>onCancel(b.id,b.name)} className="btn-hover" style={{
            background:"#FBEDED", border:"1px solid #E8C0C0", borderRadius:8,
            padding:"4px 10px", color:T.red, fontSize:11, cursor:"pointer" }}>
            إلغاء
          </button>
        )}
      </div>
    </div>
  );
}

// ─── REPORTS PAGE ─────────────────────────────────────────────────────
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
    serviceStats[b.service].revenue += parseInt((b.price||"0").replace(/\D/g,""))||0;
  });
  const sortedServices = Object.entries(serviceStats).sort((a,b)=>b[1].count-a[1].count);
  const maxCount = sortedServices[0]?.[1]?.count || 1;

  const exportCSV = () => {
    const headers = ["الاسم","الخدمة","التاريخ","الوقت","السعر","الحالة"];
    const rows = bookings.map(b=>[b.name,b.service,b.date,b.time,b.price,b.status==="confirmed"?"مكتمل":"ملغي"]);
    const NL = String.fromCharCode(10);
    const csv = [headers,...rows].map(r=>r.join(",")).join(NL);
    const blob = new Blob(["\uFEFF"+csv],{type:"text/csv;charset=utf-8"});
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href=url; a.download="تقرير-لمسة.csv"; a.click();
    URL.revokeObjectURL(url);
  };

  const periods = [{id:"daily",l:"يومي"},{id:"weekly",l:"أسبوعي"},{id:"monthly",l:"شهري"}];

  return (
    <div className="fade-up">
      {/* Header */}
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:24 }}>
        <div style={{ display:"flex", gap:4, background:"#fff", border:`1px solid ${T.border}`,
          borderRadius:12, padding:4 }}>
          {periods.map(p=>(
            <button key={p.id} onClick={()=>setPeriod(p.id)} style={{
              padding:"7px 16px", borderRadius:8, border:"none", cursor:"pointer",
              fontFamily:"inherit", fontSize:12, transition:"all 0.2s",
              background: period===p.id ? `linear-gradient(135deg,${T.gold},${T.goldDark})` : "transparent",
              color: period===p.id ? "#fff" : T.textSoft, fontWeight: period===p.id ? 600 : 400 }}>
              {p.l}
            </button>
          ))}
        </div>
        <div style={{ display:"flex", gap:8 }}>
          <button onClick={exportCSV} className="btn-hover" style={{
            display:"flex", alignItems:"center", gap:6, padding:"8px 16px",
            background:"#fff", border:`1px solid ${T.border}`, borderRadius:10,
            color:T.green, fontFamily:"inherit", fontSize:12, cursor:"pointer" }}>
            <Icon d={IC.download} size={14} color={T.green}/> تصدير Excel
          </button>
          <button onClick={()=>window.print()} className="btn-hover" style={{
            display:"flex", alignItems:"center", gap:6, padding:"8px 16px",
            background:"#fff", border:`1px solid ${T.border}`, borderRadius:10,
            color:T.red, fontFamily:"inherit", fontSize:12, cursor:"pointer" }}>
            <Icon d={IC.download} size={14} color={T.red}/> تصدير PDF
          </button>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:14, marginBottom:24 }}>
        <StatCard label="إجمالي المواعيد"  value={bookings.length}               sub="كل المواعيد"          icon={IC.calendar} color={T.gold}   delay={0}/>
        <StatCard label="مواعيد مكتملة"    value={completed.length}              sub={completed.length+" موعد"} icon={IC.check}    color={T.green}  delay={0.05}/>
        <StatCard label="مواعيد ملغية"     value={cancelled.length}              sub={cancelled.length+" موعد"} icon={IC.alert}    color={T.red}    delay={0.1}/>
        <StatCard label="إجمالي المبالغ"   value={totalRevenue.toLocaleString()+" ر"} sub="من المكتملة"      icon={IC.trending}  color={T.purple} delay={0.15}/>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"1.4fr 1fr", gap:16, marginBottom:16 }}>
        {/* Services */}
        <div style={{ background:"#fff", border:`1px solid ${T.border}`, borderRadius:16, padding:"20px 24px" }}>
          <div style={{ color:T.text, fontWeight:600, fontSize:14, marginBottom:18 }}>الخدمات الأكثر طلباً</div>
          {sortedServices.length===0 ? (
            <div style={{ textAlign:"center", color:T.muted, fontSize:13, padding:20 }}>لا توجد بيانات</div>
          ) : sortedServices.map(([name,stats],i)=>(
            <div key={name} style={{ marginBottom:i<sortedServices.length-1?16:0 }}>
              <div style={{ display:"flex", justifyContent:"space-between", marginBottom:6 }}>
                <span style={{ color:T.textSoft, fontSize:13 }}>{name}</span>
                <div style={{ display:"flex", gap:12 }}>
                  <span style={{ color:T.green, fontSize:12, fontWeight:500 }}>{stats.count} حجز</span>
                  <span style={{ color:T.purple, fontSize:12, fontWeight:500 }}>{stats.revenue.toLocaleString()} ر</span>
                </div>
              </div>
              <div style={{ height:5, background:T.warm, borderRadius:3 }}>
                <div style={{ height:"100%", borderRadius:3,
                  width:Math.round((stats.count/maxCount)*100)+"%",
                  background:`linear-gradient(90deg,${T.goldLight},${T.gold})`,
                  transition:"width 1s ease" }}/>
              </div>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div style={{ background:"#fff", border:`1px solid ${T.border}`, borderRadius:16, padding:"20px 24px" }}>
          <div style={{ color:T.text, fontWeight:600, fontSize:14, marginBottom:18 }}>نسبة الإنجاز</div>
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
                <div style={{ height:6, background:T.warm, borderRadius:3 }}>
                  <div style={{ height:"100%", borderRadius:3, width:item.value+"%",
                    background:`linear-gradient(90deg,${item.color}80,${item.color})`,
                    transition:"width 1s ease" }}/>
                </div>
              </div>
            ))}
            <div style={{ paddingTop:16, borderTop:`1px solid ${T.border}` }}>
              <div style={{ display:"flex", justifyContent:"space-between", marginBottom:8 }}>
                <span style={{ color:T.textSoft, fontSize:13 }}>العملاء الفريدين</span>
                <span style={{ color:T.purple, fontWeight:600 }}>{uniqueClients}</span>
              </div>
              <div style={{ display:"flex", justifyContent:"space-between", marginBottom:8 }}>
                <span style={{ color:T.textSoft, fontSize:13 }}>متوسط قيمة الحجز</span>
                <span style={{ color:T.gold, fontWeight:600 }}>{completed.length?Math.round(totalRevenue/completed.length).toLocaleString():0} ر</span>
              </div>
              <div style={{ display:"flex", justifyContent:"space-between" }}>
                <span style={{ color:T.textSoft, fontSize:13 }}>إجمالي المبالغ</span>
                <span style={{ color:T.goldDark, fontWeight:700, fontSize:15 }}>{totalRevenue.toLocaleString()} ر</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div style={{ background:"#fff", border:`1px solid ${T.border}`, borderRadius:16, overflow:"hidden" }}>
        <div style={{ padding:"16px 20px", borderBottom:`1px solid ${T.border}`,
          display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <span style={{ color:T.text, fontWeight:600, fontSize:14 }}>جدول المواعيد التفصيلي</span>
          <span style={{ color:T.muted, fontSize:12 }}>{bookings.length} موعد</span>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr 1fr 1fr",
          padding:"10px 20px", background:T.warm, borderBottom:`1px solid ${T.border}` }}>
          {["العميلة","الخدمة","التاريخ","المبلغ","الحالة"].map(h=>(
            <div key={h} style={{ color:T.muted, fontSize:11, fontWeight:600 }}>{h}</div>
          ))}
        </div>
        <div style={{ maxHeight:280, overflow:"auto" }}>
          {bookings.length===0 ? (
            <div style={{ padding:30, textAlign:"center", color:T.muted, fontSize:13 }}>لا توجد بيانات</div>
          ) : bookings.map(b=>(
            <div key={b.id} className="row-hover" style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr 1fr 1fr",
              padding:"12px 20px", borderBottom:`1px solid ${T.border}80`, background:"#fff" }}>
              <div style={{ color:T.text, fontSize:13 }}>{b.name}</div>
              <div style={{ color:T.textSoft, fontSize:12 }}>{b.service}</div>
              <div style={{ color:T.muted, fontSize:12 }}>{b.date} {b.time}</div>
              <div style={{ color:T.gold, fontWeight:500, fontSize:13 }}>{b.price}</div>
              <Badge label={b.status==="confirmed"?"مكتمل":"ملغي"} type={b.status==="confirmed"?"confirmed":"cancelled"}/>
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

  useEffect(()=>{ fetchUsers(); }, []);

  const openAdd  = () => { setForm({username:"",password:"",role:"staff"}); setEditUser(null); setFormErr(""); setShowPwd(false); setShowForm(true); };
  const openEdit = (u) => { setForm({username:u.username,password:"",role:u.role}); setEditUser(u); setFormErr(""); setShowPwd(false); setShowForm(true); };

  const handleSave = async () => {
    if (!form.username.trim()) return setFormErr("اسم المستخدم مطلوب");
    if (!editUser && !form.password.trim()) return setFormErr("كلمة المرور مطلوبة");
    setSaving(true);
    try {
      const url = editUser ? API_URL+"/api/users/"+editUser.id : API_URL+"/api/users";
      const res = await fetch(url, { method:editUser?"PATCH":"POST",
        headers:{"Content-Type":"application/json"}, body:JSON.stringify(form) });
      const data = await res.json();
      if (!res.ok) return setFormErr(data.error||"حدث خطأ");
      await fetchUsers(); setShowForm(false);
    } catch { setFormErr("تعذر الاتصال"); }
    finally { setSaving(false); }
  };

  const handleDelete = async (u) => {
    if (!window.confirm("هل تريد حذف "+u.username+"؟")) return;
    await fetch(API_URL+"/api/users/"+u.id,{method:"DELETE"});
    fetchUsers();
  };

  return (
    <div className="fade-up">
      {showForm && (
        <Modal title={editUser?"تعديل مستخدم":"إضافة مستخدم جديد"} onClose={()=>setShowForm(false)} width={380}>
          <div style={{ display:"flex", flexDirection:"column", gap:14, marginBottom:16 }}>
            <Field label="اسم المستخدم *">
              <input style={inputStyle(!!formErr&&!form.username)} value={form.username}
                onChange={e=>setForm({...form,username:e.target.value})} placeholder="مثال: نورة"
                onFocus={e=>{ e.target.style.borderColor=T.gold; e.target.style.background="#fff"; }}
                onBlur={e=>{ e.target.style.borderColor=T.border; e.target.style.background=T.warm; }}/>
            </Field>
            <Field label={editUser?"كلمة المرور الجديدة (اختياري)":"كلمة المرور *"}>
              <div style={{ position:"relative" }}>
                <input type={showPwd?"text":"password"} style={{...inputStyle(), paddingLeft:40}}
                  value={form.password} onChange={e=>setForm({...form,password:e.target.value})}
                  placeholder={editUser?"اتركها فارغة للإبقاء على القديمة":"أدخل كلمة المرور"}
                  onFocus={e=>{ e.target.style.borderColor=T.gold; e.target.style.background="#fff"; }}
                  onBlur={e=>{ e.target.style.borderColor=T.border; e.target.style.background=T.warm; }}/>
                <button onClick={()=>setShowPwd(!showPwd)} style={{
                  position:"absolute", left:12, top:"50%", transform:"translateY(-50%)",
                  background:"none", border:"none", cursor:"pointer", padding:0 }}>
                  <Icon d={showPwd?IC.eyeoff:IC.eye} size={15} color={T.muted}/>
                </button>
              </div>
            </Field>
            <Field label="الصلاحية">
              <select style={{...inputStyle(), cursor:"pointer"}} value={form.role}
                onChange={e=>setForm({...form,role:e.target.value})}>
                <option value="staff">موظفة — بدون تقارير</option>
                <option value="admin">مدير — كامل الصلاحيات</option>
              </select>
            </Field>
            {formErr && <div style={{ color:T.red, fontSize:12 }}>{formErr}</div>}
          </div>
          <div style={{ display:"flex", gap:10 }}>
            <PrimaryBtn onClick={handleSave} disabled={saving} style={{flex:1}}>
              {saving?"جاري الحفظ...":"حفظ"}
            </PrimaryBtn>
            <SecondaryBtn onClick={()=>setShowForm(false)} style={{flex:1}}>إلغاء</SecondaryBtn>
          </div>
        </Modal>
      )}

      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
        <span style={{ color:T.muted, fontSize:13 }}>{users.length} مستخدم</span>
        <PrimaryBtn onClick={openAdd}>+ إضافة مستخدم</PrimaryBtn>
      </div>

      <div style={{ background:"#fff", border:`1px solid ${T.border}`, borderRadius:16, overflow:"hidden" }}>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr auto",
          padding:"12px 20px", background:T.warm, borderBottom:`1px solid ${T.border}` }}>
          {["المستخدم","الصلاحية","تاريخ الإضافة",""].map(h=>(
            <div key={h} style={{ color:T.muted, fontSize:11, fontWeight:600 }}>{h}</div>
          ))}
        </div>
        {loading ? (
          <div style={{ padding:30, textAlign:"center", color:T.muted }}>جاري التحميل...</div>
        ) : users.map(u=>(
          <div key={u.id} className="row-hover" style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr auto",
            alignItems:"center", padding:"14px 20px", borderBottom:`1px solid ${T.border}80`, background:"#fff" }}>
            <div style={{ display:"flex", alignItems:"center", gap:10 }}>
              <Avatar name={u.username} role={u.role} size={34}/>
              <span style={{ color:T.text, fontSize:13, fontWeight:500 }}>{u.username}</span>
            </div>
            <Badge label={u.role==="admin"?"مدير":"موظفة"} type={u.role==="admin"?"admin":"staff"}/>
            <span style={{ color:T.muted, fontSize:12 }}>
              {new Date(u.created_at).toLocaleDateString("ar-SA")}
            </span>
            <div style={{ display:"flex", gap:8 }}>
              <button onClick={()=>openEdit(u)} className="btn-hover" style={{
                background:T.warm, border:`1px solid ${T.border}`, borderRadius:8,
                padding:"5px 10px", color:T.gold, fontSize:11, cursor:"pointer" }}>
                تعديل
              </button>
              <button onClick={()=>handleDelete(u)} className="btn-hover" style={{
                background:"#FBEDED", border:"1px solid #E8C0C0", borderRadius:8,
                padding:"5px 10px", color:T.red, fontSize:11, cursor:"pointer" }}>
                حذف
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── MAIN DASHBOARD ───────────────────────────────────────────────────
export default function SalonDashboard() {
  const [loggedIn, setLoggedIn] = useState(() => window.location.hash.startsWith("#auth"));
  const [userRole, setUserRole] = useState(() => window.location.hash.includes("admin") ? "admin" : "staff");
  const [username, setUsername] = useState(() => decodeURIComponent(window.location.hash.split("-")[2] || ""));

  const handleLogin = (role, uname) => {
    window.location.hash = "#auth-" + role + "-" + encodeURIComponent(uname);
    setUserRole(role); setUsername(uname); setLoggedIn(true);
  };

  if (!loggedIn) return <LoginScreen onLogin={handleLogin}/>;
  return <Dashboard onLogout={()=>{ window.location.hash=""; window.location.reload(); }} initialRole={userRole} username={username}/>;
}

function Dashboard({ onLogout, initialRole, username }) {
  const [bookings,   setBookings]   = useState([]);
  const [activeTab,  setActiveTab]  = useState("overview");
  const [filter,     setFilter]     = useState("all");
  const [notifs,     setNotifs]     = useState([]);
  const [lastSync,   setLastSync]   = useState(null);
  const [syncing,    setSyncing]    = useState(false);
  const [search,     setSearch]     = useState("");
  const [confirm,    setConfirm]    = useState(null);
  const [showAdd,    setShowAdd]    = useState(false);
  const [isAdmin,    setIsAdmin]    = useState(() => initialRole === "admin");
  const [showAdminLogin, setShowAdminLogin] = useState(false);

  const addNotif = (msg, type="success") => {
    const id = Date.now();
    setNotifs(p=>[...p,{id,msg,type}]);
    setTimeout(()=>setNotifs(p=>p.filter(n=>n.id!==id)),4000);
  };

  const fetchBookings = useCallback(async () => {
    setSyncing(true);
    try { const res=await fetch(API_URL+"/api/bookings"); setBookings(await res.json()); setLastSync(new Date()); }
    catch {} finally { setSyncing(false); }
  }, []);

  useEffect(() => {
    fetchBookings();
    const interval = setInterval(fetchBookings, 30000);
    return () => clearInterval(interval);
  }, [fetchBookings]);

  useEffect(() => {
    const es = new EventSource(API_URL + "/api/events");
    es.onmessage = (e) => {
      try {
        const data = JSON.parse(e.data);
        if (data.type === "new_booking") { fetchBookings(); addNotif("✨ حجز جديد — "+data.name+" ("+data.service+")", "success"); }
      } catch {}
    };
    es.onerror = () => es.close();
    return () => es.close();
  }, [fetchBookings]);

  const handleCancel = (id, name) => setConfirm({id, name});
  const confirmCancel = async () => {
    const {id} = confirm; setConfirm(null);
    try { await fetch(API_URL+"/api/bookings/"+id+"/cancel",{method:"PATCH"}); }
    catch {}
    setBookings(p=>p.map(b=>b.id===id?{...b,status:"cancelled"}:b));
    addNotif("تم إلغاء الموعد","cancel");
  };

  const handleAddBooking = async (b) => {
    try {
      await fetch(API_URL+"/api/bookings/manual",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(b)});
      fetchBookings(); addNotif("✅ تم إضافة الحجز","success");
    } catch { setBookings(p=>[b,...p]); addNotif("✅ تم إضافة الحجز","success"); }
  };

  const today     = bookings.filter(b=>b.date==="اليوم"&&b.status!=="cancelled");
  const confirmed = bookings.filter(b=>b.status==="confirmed");
  const pending   = bookings.filter(b=>b.status==="pending");
  const cancelled = bookings.filter(b=>b.status==="cancelled");
  const filtered  = bookings.filter(b=>(filter==="all"||b.status===filter)&&(!search||b.name?.includes(search)||b.service?.includes(search)||b.phone?.includes(search)));

  const tabs = [
    {id:"overview", label:"نظرة عامة",   ip:IC.grid},
    {id:"bookings", label:"الحجوزات",    ip:IC.calendar},
    {id:"services", label:"الخدمات",     ip:IC.scissors},
    {id:"reports",  label:"التقارير",    ip:IC.trending, adminOnly:true},
    {id:"users",    label:"المستخدمين",  ip:IC.shield,   adminOnly:true},
  ];

  return (
    <div style={{ minHeight:"100vh", background:T.cream, fontFamily:"'Noto Naskh Arabic',serif", direction:"rtl", color:T.text }}>
      <style>{GLOBAL_CSS}</style>

      {/* Modals */}
      {showAdminLogin && <AdminLoginModal onClose={()=>setShowAdminLogin(false)} onSuccess={()=>setIsAdmin(true)}/>}
      {showAdd && <AddBookingModal onClose={()=>setShowAdd(false)} onAdd={handleAddBooking}/>}
      {confirm && <ConfirmDialog message={`هل تريدين إلغاء موعد ${confirm.name}؟`} onConfirm={confirmCancel} onCancel={()=>setConfirm(null)}/>}

      {/* Notifications */}
      <div style={{ position:"fixed", top:20, left:"50%", transform:"translateX(-50%)",
        zIndex:2000, display:"flex", flexDirection:"column", gap:8, alignItems:"center", pointerEvents:"none" }}>
        {notifs.map(n=>(
          <div key={n.id} className="fade-up" style={{
            background:"#fff", border:`1px solid ${n.type==="success"?T.green:n.type==="cancel"?T.red:T.gold}30`,
            boxShadow:"0 4px 16px rgba(0,0,0,0.1)",
            color: n.type==="success"?T.green:n.type==="cancel"?T.red:T.gold,
            padding:"10px 20px", borderRadius:50, fontSize:13, whiteSpace:"nowrap",
            backdropFilter:"blur(8px)" }}>
            {n.msg}
          </div>
        ))}
      </div>

      {/* Sidebar */}
      <div style={{ position:"fixed", top:0, right:0, height:"100vh", width:230,
        background:"#fff", borderLeft:`1px solid ${T.border}`,
        display:"flex", flexDirection:"column", zIndex:100,
        boxShadow:"-2px 0 16px rgba(0,0,0,0.04)" }}>

        {/* Logo */}
        <div style={{ padding:"24px 20px 20px", borderBottom:`1px solid ${T.border}` }}>
          <div style={{ display:"flex", alignItems:"center", gap:12 }}>
            <div style={{ width:42, height:42, borderRadius:12,
              background:`linear-gradient(135deg,${T.gold},${T.goldDark})`,
              display:"flex", alignItems:"center", justifyContent:"center",
              fontSize:20, boxShadow:`0 4px 12px ${T.gold}40` }}>✨</div>
            <div>
              <div style={{ color:T.text, fontWeight:700, fontSize:18, fontFamily:"'Playfair Display',serif" }}>لمسة</div>
              <div style={{ color:T.muted, fontSize:11 }}>صالون وسبا</div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex:1, padding:"16px 12px", display:"flex", flexDirection:"column", gap:2 }}>
          {tabs.map(t=>(
            <button key={t.id} className="nav-item" onClick={()=>{
              if(t.adminOnly&&!isAdmin){ setShowAdminLogin(true); return; }
              setActiveTab(t.id);
            }} style={{
              display:"flex", alignItems:"center", gap:10, padding:"10px 12px",
              borderRadius:10, border:"none", textAlign:"right",
              background: activeTab===t.id ? `linear-gradient(135deg,${T.gold}18,${T.gold}08)` : "transparent",
              color: activeTab===t.id ? T.goldDark : T.textSoft,
              fontFamily:"inherit", fontSize:13, fontWeight: activeTab===t.id ? 600 : 400,
              borderRight: activeTab===t.id ? `3px solid ${T.gold}` : "3px solid transparent" }}>
              <Icon d={t.ip} size={16} color={activeTab===t.id?T.gold:T.muted}/>
              {t.label}
              {t.adminOnly&&!isAdmin && <Icon d={IC.lock} size={11} color={T.muted}/>}
              {t.id==="bookings"&&pending.length>0&&(
                <span style={{ marginRight:"auto", background:T.gold+"20", color:T.gold,
                  fontSize:10, padding:"1px 7px", borderRadius:10, fontWeight:600 }}>{pending.length}</span>
              )}
            </button>
          ))}
        </nav>

        {/* User + Actions */}
        <div style={{ padding:"12px", borderTop:`1px solid ${T.border}` }}>
          {/* User info */}
          <div style={{ display:"flex", alignItems:"center", gap:10, padding:"10px 12px",
            background:T.warm, borderRadius:12, marginBottom:8 }}>
            <Avatar name={username} role={isAdmin?"admin":"staff"} size={32}/>
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ color:T.text, fontSize:12, fontWeight:600, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{username||"مستخدم"}</div>
              <div style={{ color:T.muted, fontSize:11 }}>{isAdmin?"مدير":"موظفة"}</div>
            </div>
          </div>

          <div style={{ display:"flex", gap:6 }}>
            <button onClick={fetchBookings} disabled={syncing} className="btn-hover" style={{
              flex:1, display:"flex", alignItems:"center", justifyContent:"center", gap:5,
              padding:"8px", background:T.warm, border:`1px solid ${T.border}`,
              borderRadius:8, color:T.textSoft, fontFamily:"inherit", fontSize:11, cursor:"pointer" }}>
              <Icon d={IC.refresh} size={13} color={T.muted}
                style={{ animation: syncing?"spin 1s linear infinite":"none" }}/>
              {syncing?"جاري...":"تحديث"}
            </button>
            <button onClick={onLogout} className="btn-hover" style={{
              flex:1, display:"flex", alignItems:"center", justifyContent:"center", gap:5,
              padding:"8px", background:"#FBEDED", border:"1px solid #E8C0C0",
              borderRadius:8, color:T.red, fontFamily:"inherit", fontSize:11, cursor:"pointer" }}>
              <Icon d={IC.logout} size={13} color={T.red}/>
              خروج
            </button>
          </div>

          {lastSync && (
            <div style={{ textAlign:"center", color:T.muted, fontSize:10, marginTop:8, display:"flex", alignItems:"center", justifyContent:"center", gap:4 }}>
              <div style={{ width:5, height:5, borderRadius:"50%", background:T.green, animation:"pulse 2s infinite" }}/>
              {lastSync.toLocaleTimeString("ar-SA",{hour:"2-digit",minute:"2-digit"})}
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div style={{ marginRight:230, padding:"28px 32px", minHeight:"100vh" }}>
        {/* Topbar */}
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:28 }}>
          <div>
            <h1 style={{ fontSize:22, fontWeight:700, color:T.text, fontFamily:"'Playfair Display',serif" }}>
              {tabs.find(t=>t.id===activeTab)?.label || "لوحة التحكم"}
            </h1>
            <div style={{ color:T.muted, fontSize:12, marginTop:4 }}>
              {new Date().toLocaleDateString("ar-SA",{weekday:"long",year:"numeric",month:"long",day:"numeric"})}
            </div>
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            {isAdmin && (
              <div style={{ display:"flex", alignItems:"center", gap:5, padding:"6px 12px",
                background:"#F0EDF8", border:`1px solid #D0C8E8`, borderRadius:10,
                color:T.purple, fontSize:11, fontWeight:500 }}>
                <Icon d={IC.shield} size={12} color={T.purple}/>
                وضع المدير
              </div>
            )}
            <div style={{ display:"flex", alignItems:"center", gap:5, padding:"6px 12px",
              background:T.warm, border:`1px solid ${T.border}`, borderRadius:10,
              color:T.muted, fontSize:12 }}>
              <Icon d={IC.bell} size={14} color={T.muted}/>
              {pending.length} معلق
            </div>
            <button onClick={()=>setShowAdd(true)} className="btn-hover" style={{
              display:"flex", alignItems:"center", gap:6, padding:"9px 16px",
              background:`linear-gradient(135deg,${T.gold},${T.goldDark})`,
              border:"none", borderRadius:10, color:"#fff",
              fontFamily:"inherit", fontSize:12, fontWeight:600, cursor:"pointer",
              boxShadow:`0 4px 12px ${T.gold}40` }}>
              <Icon d={IC.plus} size={14} color="#fff"/>
              إضافة حجز
            </button>
          </div>
        </div>

        {/* ── OVERVIEW ── */}
        {activeTab==="overview"&&(
          <div>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:14, marginBottom:24 }}>
              <StatCard label="حجوزات اليوم"    value={today.length}     sub={today.length+" موعد"}       icon={IC.calendar} color={T.gold}   delay={0}/>
              <StatCard label="إجمالي مؤكدة"    value={confirmed.length} sub="مكتملة"                    icon={IC.check}    color={T.green}  delay={0.05}/>
              <StatCard label="في الانتظار"     value={pending.length}   sub="تحتاج تأكيد"               icon={IC.clock}    color="#B08040"  delay={0.1}/>
              <StatCard label="ملغية"            value={cancelled.length} sub="إجمالي الإلغاءات"          icon={IC.alert}    color={T.red}    delay={0.15}/>
            </div>

            <div style={{ display:"grid", gridTemplateColumns:"1.4fr 1fr", gap:16 }}>
              {/* Today */}
              <div className="fade-up" style={{ background:"#fff", border:`1px solid ${T.border}`,
                borderRadius:16, overflow:"hidden", animationDelay:"0.2s" }}>
                <div style={{ padding:"16px 20px", borderBottom:`1px solid ${T.border}`,
                  display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                  <span style={{ color:T.text, fontWeight:600, fontSize:14 }}>مواعيد اليوم</span>
                  <Badge label={today.length+" موعد"} type="default"/>
                </div>
                {today.length===0 ? (
                  <div style={{ padding:40, textAlign:"center", color:T.muted, fontSize:13 }}>
                    <div style={{ fontSize:32, marginBottom:8 }}>📅</div>
                    ما في مواعيد اليوم
                  </div>
                ) : today.map(b=>(
                  <div key={b.id} className="row-hover" style={{ display:"flex", alignItems:"center",
                    gap:12, padding:"12px 20px", borderBottom:`1px solid ${T.border}80`, background:"#fff" }}>
                    <Avatar name={b.name} role="staff" size={34}/>
                    <div style={{ flex:1 }}>
                      <div style={{ color:T.text, fontSize:13, fontWeight:500 }}>{b.name}</div>
                      <div style={{ color:T.muted, fontSize:11, marginTop:2 }}>{b.service}</div>
                    </div>
                    <div style={{ textAlign:"left" }}>
                      <div style={{ color:T.gold, fontSize:13, fontWeight:600 }}>{b.time}</div>
                      <div style={{ color:T.muted, fontSize:11, marginTop:2 }}>{b.price}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Services */}
              <div className="fade-up" style={{ background:"#fff", border:`1px solid ${T.border}`,
                borderRadius:16, padding:"16px 20px", animationDelay:"0.25s" }}>
                <div style={{ color:T.text, fontWeight:600, fontSize:14, marginBottom:16 }}>الخدمات الأكثر طلباً</div>
                {SERVICES.slice(0,5).map(s=>{
                  const cnt=bookings.filter(b=>b.service===s.name).length;
                  const mx=Math.max(...SERVICES.map(sv=>bookings.filter(b=>b.service===sv.name).length),1);
                  return(
                    <div key={s.id} style={{ marginBottom:14 }}>
                      <div style={{ display:"flex", justifyContent:"space-between", marginBottom:5 }}>
                        <span style={{ color:T.textSoft, fontSize:12 }}>{s.icon} {s.name}</span>
                        <span style={{ color:s.color, fontSize:12, fontWeight:500 }}>{cnt} حجز</span>
                      </div>
                      <div style={{ height:5, background:T.warm, borderRadius:3 }}>
                        <div style={{ height:"100%", borderRadius:3,
                          width:Math.round((cnt/mx)*100)||8+"%",
                          background:`linear-gradient(90deg,${s.color}80,${s.color})`,
                          transition:"width 1s ease" }}/>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ── BOOKINGS ── */}
        {activeTab==="bookings"&&(
          <div className="fade-up">
            <div style={{ display:"flex", gap:12, marginBottom:20, alignItems:"center" }}>
              <div style={{ display:"flex", alignItems:"center", gap:8, flex:1,
                background:"#fff", border:`1px solid ${T.border}`, borderRadius:12, padding:"9px 14px" }}>
                <Icon d={IC.search} size={15} color={T.muted}/>
                <input value={search} onChange={e=>setSearch(e.target.value)}
                  placeholder="ابحثي بالاسم أو الخدمة أو الرقم..."
                  style={{ flex:1, background:"transparent", border:"none", color:T.text,
                    fontSize:13, outline:"none", direction:"rtl", fontFamily:"inherit" }}/>
              </div>
              <div style={{ display:"flex", gap:4, background:"#fff", border:`1px solid ${T.border}`,
                borderRadius:12, padding:4 }}>
                {[{id:"all",l:"الكل"},{id:"confirmed",l:"مكتملة"},{id:"pending",l:"معلقة"},{id:"cancelled",l:"ملغية"}].map(f=>(
                  <button key={f.id} onClick={()=>setFilter(f.id)} style={{
                    padding:"6px 14px", borderRadius:8, border:"none", cursor:"pointer",
                    fontFamily:"inherit", fontSize:12, transition:"all 0.2s",
                    background: filter===f.id ? `linear-gradient(135deg,${T.gold},${T.goldDark})` : "transparent",
                    color: filter===f.id ? "#fff" : T.textSoft,
                    fontWeight: filter===f.id ? 600 : 400 }}>
                    {f.l}
                    {f.id!=="all"&&<span style={{ opacity:.7, fontSize:10, marginRight:4 }}>
                      ({bookings.filter(b=>b.status===f.id).length})
                    </span>}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ background:"#fff", border:`1px solid ${T.border}`, borderRadius:16, overflow:"hidden" }}>
              <div style={{ display:"grid", gridTemplateColumns:"1.4fr 1fr 1.2fr 0.8fr 0.8fr auto",
                padding:"12px 20px", background:T.warm, borderBottom:`1px solid ${T.border}` }}>
                {["العميلة","الخدمة","الموعد","السعر","الحالة",""].map(h=>(
                  <div key={h} style={{ color:T.muted, fontSize:11, fontWeight:600 }}>{h}</div>
                ))}
              </div>
              {filtered.length===0 ? (
                <div style={{ padding:40, textAlign:"center", color:T.muted, fontSize:13 }}>
                  <div style={{ fontSize:32, marginBottom:8 }}>🔍</div>
                  ما في حجوزات
                </div>
              ) : filtered.map(b=><BookingRow key={b.id} b={b} onCancel={handleCancel}/>)}
            </div>
          </div>
        )}

        {/* ── SERVICES ── */}
        {activeTab==="services"&&(
          <div className="fade-up" style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:14 }}>
            {SERVICES.map((s,i)=>{
              const cnt=bookings.filter(b=>b.service===s.name&&b.status==="confirmed").length;
              return(
                <div key={s.id} className="card-hover fade-up" style={{
                  background:"#fff", border:`1px solid ${T.border}`, borderRadius:16,
                  padding:20, boxShadow:"0 2px 8px rgba(0,0,0,0.04)",
                  animationDelay:i*0.05+"s" }}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:14 }}>
                    <div style={{ width:48, height:48, borderRadius:14, fontSize:22,
                      background:s.color+"18", display:"flex", alignItems:"center", justifyContent:"center",
                      border:`1px solid ${s.color}30` }}>{s.icon}</div>
                    <Badge label={cnt+" حجز"} type="default"/>
                  </div>
                  <div style={{ color:T.text, fontWeight:600, fontSize:14, marginBottom:4 }}>{s.name}</div>
                  <div style={{ color:T.muted, fontSize:12, marginBottom:14 }}>مدة الخدمة: {s.duration} دقيقة</div>
                  <div style={{ paddingTop:12, borderTop:`1px solid ${T.border}` }}>
                    <span style={{ color:T.gold, fontWeight:700, fontSize:16, fontFamily:"'Playfair Display',serif" }}>
                      {s.price} ريال
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ── REPORTS ── */}
        {activeTab==="reports"&&(
          isAdmin ? <ReportsPage bookings={bookings}/> : (
            <div style={{ textAlign:"center", padding:60 }}>
              <div style={{ fontSize:48, marginBottom:16 }}>🔐</div>
              <div style={{ color:T.muted, fontSize:14, marginBottom:20 }}>هذه الصفحة للمدير فقط</div>
              <PrimaryBtn onClick={()=>setShowAdminLogin(true)}>دخول كمدير</PrimaryBtn>
            </div>
          )
        )}

        {/* ── USERS ── */}
        {activeTab==="users"&&(
          isAdmin ? <UsersPage/> : (
            <div style={{ textAlign:"center", padding:60 }}>
              <div style={{ fontSize:48, marginBottom:16 }}>🔐</div>
              <div style={{ color:T.muted, fontSize:14, marginBottom:20 }}>هذه الصفحة للمدير فقط</div>
              <PrimaryBtn onClick={()=>setShowAdminLogin(true)}>دخول كمدير</PrimaryBtn>
            </div>
          )
        )}
      </div>
    </div>
  );
}
