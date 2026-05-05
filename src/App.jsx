import { useState, useEffect, useCallback } from "react";

const SERVICES = [
  { id:1, name:"باديكير وميديكير", duration:45,  price:80,  icon:"💅", color:"#f472b6" },
  { id:2, name:"تلوين شعر",        duration:90,  price:250, icon:"🎨", color:"#a78bfa" },
  { id:3, name:"قص وتصفيف",        duration:60,  price:150, icon:"✂️", color:"#34d399" },
  { id:4, name:"علاج بالأوزون",    duration:60,  price:200, icon:"🌿", color:"#6ee7b7" },
  { id:5, name:"مساج استرخاء",     duration:60,  price:180, icon:"🪷", color:"#fb923c" },
  { id:6, name:"تنظيف بشرة",       duration:75,  price:220, icon:"✨", color:"#fbbf24" },
  { id:7, name:"عروس كاملة",       duration:240, price:800, icon:"👰", color:"#e879f9" },
];

const API_URL = "https://lamsa-salon-server-production.up.railway.app";
const PASSWORD = "lamsa2026";

function SvgIcon({ d, size=18, color="currentColor" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d={d}/>
    </svg>
  );
}

const IC = {
  grid:     "M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z",
  calendar: "M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z",
  scissors: "M6 3a3 3 0 1 0 0 6 3 3 0 0 0 0-6zM6 15a3 3 0 1 0 0 6 3 3 0 0 0 0-6zM20 4 8.12 15.88M14.47 14.48 20 20M8.12 8.12 12 12",
  check:    "M20 6 9 17 4 12",
  clock:    "M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2zM12 6v6l4 2",
  bell:     "M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0",
  refresh:  "M23 4v6h-6M1 20v-6h6M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15",
  logout:   "M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9",
  search:   "M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z",
  phone:    "M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13.6a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 3h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 10.6a16 16 0 0 0 6 6l.94-.94a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 17z",
  alert:    "M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0zM12 9v4M12 17h.01",
};

// ─── LOGIN ───────────────────────────────────────────────────────
function LoginScreen({ onLogin }) {
  const [pwd, setPwd]     = useState("");
  const [error, setError] = useState(false);
  const [shake, setShake] = useState(false);

  const handleLogin = () => {
    if (pwd === PASSWORD) {
      onLogin();
    } else {
      setError(true);
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }
  };

  return (
    <div style={{
      minHeight:"100vh", background:"#0d0508",
      display:"flex", alignItems:"center", justifyContent:"center",
      fontFamily:"'Noto Naskh Arabic',serif", direction:"rtl",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Naskh+Arabic:wght@400;600;700&display=swap');
        @keyframes shake{0%,100%{transform:translateX(0)}25%{transform:translateX(-8px)}75%{transform:translateX(8px)}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
      `}</style>
      <div style={{
        background:"rgba(255,255,255,0.03)", border:"1px solid rgba(212,175,55,0.25)",
        borderRadius:20, padding:"40px 36px", width:340,
        boxShadow:"0 20px 60px rgba(0,0,0,0.6)",
        animation: shake ? "shake 0.4s ease" : "fadeUp 0.4s ease",
      }}>
        <div style={{textAlign:"center", marginBottom:32}}>
          <div style={{
            width:60, height:60, borderRadius:14, margin:"0 auto 14px",
            background:"linear-gradient(135deg,#d4af37,#8b6914)",
            display:"flex", alignItems:"center", justifyContent:"center", fontSize:28,
          }}>✨</div>
          <div style={{color:"#d4af37", fontWeight:700, fontSize:20}}>لمسة</div>
          <div style={{color:"rgba(255,255,255,0.35)", fontSize:13, marginTop:4}}>لوحة تحكم الصالون</div>
        </div>
        <div style={{marginBottom:16}}>
          <input type="password" value={pwd}
            onChange={e=>{setPwd(e.target.value); setError(false);}}
            onKeyDown={e=>e.key==="Enter"&&handleLogin()}
            placeholder="كلمة المرور"
            style={{
              width:"100%", background:"rgba(255,255,255,0.05)",
              border: error?"1px solid rgba(239,68,68,0.6)":"1px solid rgba(212,175,55,0.2)",
              borderRadius:12, padding:"12px 16px", color:"#e8d5a3",
              fontSize:14, outline:"none", direction:"rtl", boxSizing:"border-box",
            }}/>
          {error && <div style={{color:"#f87171", fontSize:12, marginTop:6}}>كلمة المرور غلط</div>}
        </div>
        <button onClick={handleLogin} style={{
          width:"100%", padding:"12px",
          background:"linear-gradient(135deg,#d4af37,#8b6914)",
          border:"none", borderRadius:12, color:"#1a0a0f",
          fontFamily:"inherit", fontSize:14, fontWeight:700, cursor:"pointer",
        }}>دخول</button>
      </div>
    </div>
  );
}

// ─── CONFIRM DIALOG ──────────────────────────────────────────────
function ConfirmDialog({ message, onConfirm, onCancel }) {
  return (
    <div style={{
      position:"fixed", inset:0, background:"rgba(0,0,0,0.7)",
      display:"flex", alignItems:"center", justifyContent:"center",
      zIndex:3000, direction:"rtl",
    }}>
      <div style={{
        background:"#1a0a0f", border:"1px solid rgba(212,175,55,0.3)",
        borderRadius:16, padding:"28px 32px", width:320,
        boxShadow:"0 20px 60px rgba(0,0,0,0.8)",
        animation:"fadeUp 0.2s ease",
      }}>
        <div style={{display:"flex", alignItems:"center", gap:10, marginBottom:16}}>
          <SvgIcon d={IC.alert} color="#fbbf24" size={20}/>
          <span style={{color:"#fff", fontWeight:600, fontSize:15}}>تأكيد الإلغاء</span>
        </div>
        <p style={{color:"rgba(255,255,255,0.6)", fontSize:13, margin:"0 0 20px"}}>{message}</p>
        <div style={{display:"flex", gap:10}}>
          <button onClick={onConfirm} style={{
            flex:1, padding:"10px", background:"rgba(239,68,68,0.15)",
            border:"1px solid rgba(239,68,68,0.4)", borderRadius:10,
            color:"#f87171", fontFamily:"inherit", fontSize:13, cursor:"pointer",
          }}>إلغاء الموعد</button>
          <button onClick={onCancel} style={{
            flex:1, padding:"10px", background:"rgba(255,255,255,0.05)",
            border:"1px solid rgba(255,255,255,0.1)", borderRadius:10,
            color:"rgba(255,255,255,0.6)", fontFamily:"inherit", fontSize:13, cursor:"pointer",
          }}>تراجع</button>
        </div>
      </div>
    </div>
  );
}

// ─── STAT CARD ───────────────────────────────────────────────────
function StatCard({ label, value, sub, ip, accent }) {
  return (
    <div style={{
      background:"rgba(255,255,255,0.03)", border:"1px solid "+accent+"30",
      borderRadius:16, padding:20, position:"relative", overflow:"hidden",
    }}>
      <div style={{position:"absolute",top:-12,left:-12,width:80,height:80,borderRadius:"50%",background:accent+"12"}}/>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
        <div>
          <div style={{color:"rgba(255,255,255,0.45)",fontSize:12,marginBottom:8}}>{label}</div>
          <div style={{color:"#fff",fontSize:26,fontWeight:700,lineHeight:1}}>{value}</div>
          {sub&&<div style={{color:accent,fontSize:11,marginTop:6}}>{sub}</div>}
        </div>
        <div style={{width:40,height:40,borderRadius:10,background:accent+"20",display:"flex",alignItems:"center",justifyContent:"center"}}>
          <SvgIcon d={ip} color={accent} size={18}/>
        </div>
      </div>
    </div>
  );
}

// ─── BOOKING ROW ─────────────────────────────────────────────────
function BookingRow({ b, onCancel }) {
  const sm = {
    confirmed:{label:"مؤكد",bg:"rgba(34,197,94,0.12)",color:"#4ade80"},
    pending:  {label:"معلق",bg:"rgba(251,191,36,0.12)",color:"#fbbf24"},
    cancelled:{label:"ملغي",bg:"rgba(239,68,68,0.12)",color:"#f87171"},
  };
  const s = sm[b.status]||sm.confirmed;
  const phone = b.phone?.replace("whatsapp:","") || "";

  return (
    <div style={{
      display:"grid", gridTemplateColumns:"1.2fr 1fr 1fr 0.8fr 0.8fr auto",
      alignItems:"center", padding:"14px 20px",
      borderBottom:"1px solid rgba(255,255,255,0.05)", transition:"background 0.15s",
    }}
    onMouseEnter={e=>e.currentTarget.style.background="rgba(255,255,255,0.03)"}
    onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
      <div style={{display:"flex",alignItems:"center",gap:10}}>
        <div style={{
          width:34,height:34,borderRadius:"50%",flexShrink:0,
          background:"linear-gradient(135deg,#d4af37,#8b6914)",
          display:"flex",alignItems:"center",justifyContent:"center",
          fontSize:13,fontWeight:700,color:"#1a0a0f",
        }}>{b.name?.[0]}</div>
        <div>
          <div style={{color:"#e8d5a3",fontSize:13}}>{b.name}</div>
          {phone && <div style={{color:"rgba(255,255,255,0.35)",fontSize:11,display:"flex",alignItems:"center",gap:3}}>
            <SvgIcon d={IC.phone} size={10} color="rgba(255,255,255,0.35)"/>
            {phone}
          </div>}
        </div>
      </div>
      <div style={{color:"rgba(255,255,255,0.6)",fontSize:13}}>{b.service}</div>
      <div style={{color:"rgba(255,255,255,0.5)",fontSize:12}}>{b.date} — {b.time}</div>
      <div style={{color:"#d4af37",fontWeight:600,fontSize:13}}>{b.price}</div>
      <span style={{background:s.bg,color:s.color,fontSize:11,padding:"3px 10px",borderRadius:20,width:"fit-content"}}>{s.label}</span>
      <div>
        {b.status!=="cancelled"&&(
          <button onClick={()=>onCancel(b.id, b.name)} style={{
            background:"rgba(239,68,68,0.1)",border:"1px solid rgba(239,68,68,0.2)",
            borderRadius:6,padding:"4px 8px",color:"#f87171",fontSize:11,cursor:"pointer",
          }}
          onMouseEnter={e=>e.currentTarget.style.background="rgba(239,68,68,0.2)"}
          onMouseLeave={e=>e.currentTarget.style.background="rgba(239,68,68,0.1)"}>
            إلغاء
          </button>
        )}
      </div>
    </div>
  );
}

// ─── MAIN DASHBOARD ──────────────────────────────────────────────
export default function SalonDashboard() {
  const [loggedIn, setLoggedIn] = useState(() => window.location.hash === "#authenticated");

  const handleLogin = () => {
    window.location.hash = "authenticated";
    window.location.reload();
  };

  if (!loggedIn) return <LoginScreen onLogin={handleLogin}/>;

  return <Dashboard onLogout={()=>{ window.location.hash = ""; window.location.reload(); }}/>;
}

// ─── ADD BOOKING MODAL ───────────────────────────────────────────
function AddBookingModal({ onClose, onAdd }) {
  const SERVICES_LIST = ["باديكير وميديكير","تلوين شعر","قص وتصفيف","علاج بالأوزون","مساج استرخاء","تنظيف بشرة","عروس كاملة"];
  const PRICES = {"باديكير وميديكير":"80 ريال","تلوين شعر":"250 ريال","قص وتصفيف":"150 ريال","علاج بالأوزون":"200 ريال","مساج استرخاء":"180 ريال","تنظيف بشرة":"220 ريال","عروس كاملة":"800 ريال"};
  const [form, setForm] = useState({ name:"", service:SERVICES_LIST[0], date:"اليوم", time:"", phone:"" });
  const [error, setError] = useState("");

  const handleSubmit = () => {
    if (!form.name.trim()) return setError("اسم العميلة مطلوب");
    if (!form.time.trim()) return setError("الوقت مطلوب");
    onAdd({ ...form, price: PRICES[form.service], id: Date.now(), status:"confirmed", source:"manual" });
    onClose();
  };

  const inputStyle = {
    width:"100%", background:"rgba(255,255,255,0.05)",
    border:"1px solid rgba(212,175,55,0.2)", borderRadius:10,
    padding:"10px 14px", color:"#e8d5a3", fontSize:13,
    outline:"none", direction:"rtl", boxSizing:"border-box", fontFamily:"inherit",
  };

  return (
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.75)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:3000,direction:"rtl"}}>
      <div style={{background:"#1a0a0f",border:"1px solid rgba(212,175,55,0.3)",borderRadius:20,padding:"28px 32px",width:380,boxShadow:"0 20px 60px rgba(0,0,0,0.8)",animation:"fadeUp 0.2s ease"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
          <span style={{color:"#d4af37",fontWeight:700,fontSize:16}}>إضافة حجز يدوي</span>
          <button onClick={onClose} style={{background:"none",border:"none",color:"rgba(255,255,255,0.4)",cursor:"pointer",fontSize:18}}>✕</button>
        </div>

        <div style={{display:"flex",flexDirection:"column",gap:12}}>
          <div>
            <div style={{color:"rgba(255,255,255,0.45)",fontSize:12,marginBottom:5}}>اسم العميلة *</div>
            <input style={inputStyle} placeholder="مثال: نورة العتيبي" value={form.name} onChange={e=>setForm({...form,name:e.target.value})}
              onFocus={e=>e.target.style.borderColor="rgba(212,175,55,0.5)"} onBlur={e=>e.target.style.borderColor="rgba(212,175,55,0.2)"}/>
          </div>
          <div>
            <div style={{color:"rgba(255,255,255,0.45)",fontSize:12,marginBottom:5}}>رقم الواتساب (اختياري)</div>
            <input style={inputStyle} placeholder="+966..." value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})}
              onFocus={e=>e.target.style.borderColor="rgba(212,175,55,0.5)"} onBlur={e=>e.target.style.borderColor="rgba(212,175,55,0.2)"}/>
          </div>
          <div>
            <div style={{color:"rgba(255,255,255,0.45)",fontSize:12,marginBottom:5}}>الخدمة *</div>
            <select style={{...inputStyle,cursor:"pointer"}} value={form.service} onChange={e=>setForm({...form,service:e.target.value})}>
              {SERVICES_LIST.map(s=><option key={s} value={s}>{s} — {PRICES[s]}</option>)}
            </select>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
            <div>
              <div style={{color:"rgba(255,255,255,0.45)",fontSize:12,marginBottom:5}}>التاريخ *</div>
              <select style={{...inputStyle,cursor:"pointer"}} value={form.date} onChange={e=>setForm({...form,date:e.target.value})}>
                <option>اليوم</option>
                <option>بكره</option>
                <option>بعد بكره</option>
              </select>
            </div>
            <div>
              <div style={{color:"rgba(255,255,255,0.45)",fontSize:12,marginBottom:5}}>الوقت *</div>
              <input style={inputStyle} placeholder="مثال: 3:00 م" value={form.time} onChange={e=>setForm({...form,time:e.target.value})}
                onFocus={e=>e.target.style.borderColor="rgba(212,175,55,0.5)"} onBlur={e=>e.target.style.borderColor="rgba(212,175,55,0.2)"}/>
            </div>
          </div>
          {error && <div style={{color:"#f87171",fontSize:12}}>{error}</div>}
        </div>

        <div style={{display:"flex",gap:10,marginTop:20}}>
          <button onClick={handleSubmit} style={{
            flex:1,padding:"11px",background:"linear-gradient(135deg,#d4af37,#8b6914)",
            border:"none",borderRadius:10,color:"#1a0a0f",fontFamily:"inherit",fontSize:13,fontWeight:700,cursor:"pointer",
          }}>إضافة الحجز</button>
          <button onClick={onClose} style={{
            flex:1,padding:"11px",background:"rgba(255,255,255,0.05)",
            border:"1px solid rgba(255,255,255,0.1)",borderRadius:10,
            color:"rgba(255,255,255,0.5)",fontFamily:"inherit",fontSize:13,cursor:"pointer",
          }}>إلغاء</button>
        </div>
      </div>
    </div>
  );
}

function Dashboard({ onLogout }) {
  const [bookings,  setBookings]  = useState([]);
  const [activeTab, setActiveTab] = useState("overview");
  const [filter,    setFilter]    = useState("all");
  const [notifs,    setNotifs]    = useState([]);
  const [lastSync,  setLastSync]  = useState(null);
  const [syncing,   setSyncing]   = useState(false);
  const [search,    setSearch]    = useState("");
  const [confirm,   setConfirm]   = useState(null);
  const [showAdd,   setShowAdd]   = useState(false);

  const addNotif = (msg, type="success") => {
    const id = Date.now();
    setNotifs(p=>[...p,{id,msg,type}]);
    setTimeout(()=>setNotifs(p=>p.filter(n=>n.id!==id)),4000);
  };

  const fetchBookings = useCallback(async () => {
    setSyncing(true);
    try {
      const res  = await fetch(API_URL + "/api/bookings");
      const data = await res.json();
      setBookings(data);
      setLastSync(new Date());
    } catch {}
    finally { setSyncing(false); }
  }, []);

  useEffect(() => {
    fetchBookings();
    const interval = setInterval(fetchBookings, 30000);
    return () => clearInterval(interval);
  }, [fetchBookings]);

  // SSE إشعارات فورية
  useEffect(() => {
    const es = new EventSource(API_URL + "/api/events");
    es.onmessage = (e) => {
      try {
        const data = JSON.parse(e.data);
        if (data.type === "new_booking") {
          fetchBookings();
          addNotif(`✨ حجز جديد — ${data.name} (${data.service})`, "success");
        }
      } catch {}
    };
    es.onerror = () => es.close();
    return () => es.close();
  }, [fetchBookings]);

  const handleCancel = (id, name) => setConfirm({id, name});

  const handleAddBooking = async (b) => {
    try {
      await fetch(API_URL + "/api/bookings/manual", {
        method:"POST", headers:{"Content-Type":"application/json"},
        body: JSON.stringify(b),
      });
      fetchBookings();
      addNotif("✅ تم إضافة الحجز", "success");
    } catch {
      setBookings(p=>[b,...p]);
      addNotif("✅ تم إضافة الحجز", "success");
    }
  };

  const confirmCancel = async () => {
    const {id} = confirm;
    setConfirm(null);
    try {
      await fetch(API_URL + "/api/bookings/" + id + "/cancel", {method:"PATCH"});
      setBookings(p=>p.map(b=>b.id===id?{...b,status:"cancelled"}:b));
      addNotif("❌ تم إلغاء الموعد","cancel");
    } catch {
      addNotif("❌ تم إلغاء الموعد","cancel");
    }
  };

  const today     = bookings.filter(b=>b.date==="اليوم"&&b.status!=="cancelled");
  const confirmed = bookings.filter(b=>b.status==="confirmed");
  const pending   = bookings.filter(b=>b.status==="pending");
  const cancelled = bookings.filter(b=>b.status==="cancelled");

  const filtered = bookings
    .filter(b=> filter==="all" || b.status===filter)
    .filter(b=> !search || b.name?.includes(search) || b.service?.includes(search) || b.phone?.includes(search));

  const tabs = [
    {id:"overview",label:"نظرة عامة",ip:IC.grid},
    {id:"bookings",label:"الحجوزات", ip:IC.calendar},
    {id:"services",label:"الخدمات",  ip:IC.scissors},
  ];

  return (
    <div style={{minHeight:"100vh",background:"#0d0508",fontFamily:"'Noto Naskh Arabic',serif",direction:"rtl",color:"#fff"}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Naskh+Arabic:wght@400;600;700&display=swap');
        @keyframes fadeUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
        @keyframes pulse2{0%,100%{opacity:.4}50%{opacity:1}}
        *{box-sizing:border-box}
        ::-webkit-scrollbar{width:4px}
        ::-webkit-scrollbar-thumb{background:rgba(212,175,55,.25);border-radius:4px}
      `}</style>

      {/* Add Booking Modal */}
      {showAdd && <AddBookingModal onClose={()=>setShowAdd(false)} onAdd={handleAddBooking}/>}

      {/* Confirm Dialog */}
      {confirm && (
        <ConfirmDialog
          message={`هل تريدين إلغاء موعد ${confirm.name}؟`}
          onConfirm={confirmCancel}
          onCancel={()=>setConfirm(null)}
        />
      )}

      {/* Notifications */}
      <div style={{position:"fixed",top:20,left:"50%",transform:"translateX(-50%)",
        zIndex:2000,display:"flex",flexDirection:"column",gap:8,alignItems:"center",pointerEvents:"none"}}>
        {notifs.map(n=>(
          <div key={n.id} style={{
            background:n.type==="success"?"rgba(34,197,94,0.15)":n.type==="cancel"?"rgba(239,68,68,0.15)":"rgba(59,130,246,0.15)",
            border:"1px solid "+(n.type==="success"?"rgba(34,197,94,.4)":n.type==="cancel"?"rgba(239,68,68,.4)":"rgba(59,130,246,.4)"),
            color:n.type==="success"?"#4ade80":n.type==="cancel"?"#f87171":"#60a5fa",
            padding:"9px 20px",borderRadius:50,fontSize:13,backdropFilter:"blur(10px)",
            whiteSpace:"nowrap",animation:"fadeUp .3s ease",
          }}>{n.msg}</div>
        ))}
      </div>

      {/* Sidebar */}
      <div style={{position:"fixed",top:0,right:0,height:"100vh",width:220,
        background:"rgba(255,255,255,0.02)",borderLeft:"1px solid rgba(212,175,55,0.12)",
        display:"flex",flexDirection:"column",padding:"24px 0",zIndex:100}}>
        <div style={{padding:"0 20px 28px",borderBottom:"1px solid rgba(212,175,55,0.1)"}}>
          <div style={{width:44,height:44,borderRadius:12,marginBottom:10,
            background:"linear-gradient(135deg,#d4af37,#8b6914)",
            display:"flex",alignItems:"center",justifyContent:"center",fontSize:22}}>✨</div>
          <div style={{color:"#d4af37",fontWeight:700,fontSize:18}}>لمسة</div>
          <div style={{color:"rgba(255,255,255,0.3)",fontSize:11,marginTop:2}}>صالون وسبا</div>
        </div>

        <nav style={{flex:1,padding:"20px 12px",display:"flex",flexDirection:"column",gap:4}}>
          {tabs.map(t=>(
            <button key={t.id} onClick={()=>setActiveTab(t.id)} style={{
              display:"flex",alignItems:"center",gap:10,padding:"10px 12px",
              borderRadius:10,border:"none",cursor:"pointer",textAlign:"right",
              background:activeTab===t.id?"rgba(212,175,55,0.15)":"transparent",
              color:activeTab===t.id?"#d4af37":"rgba(255,255,255,0.45)",
              fontFamily:"inherit",fontSize:13,fontWeight:activeTab===t.id?600:400,transition:"all 0.2s"}}
              onMouseEnter={e=>{if(activeTab!==t.id)e.currentTarget.style.background="rgba(255,255,255,0.04)"}}
              onMouseLeave={e=>{if(activeTab!==t.id)e.currentTarget.style.background="transparent"}}>
              <SvgIcon d={t.ip} size={16} color={activeTab===t.id?"#d4af37":"rgba(255,255,255,0.4)"}/>
              {t.label}
              {t.id==="bookings"&&pending.length>0&&(
                <span style={{marginRight:"auto",background:"rgba(251,191,36,0.2)",color:"#fbbf24",fontSize:10,padding:"1px 6px",borderRadius:10}}>
                  {pending.length}
                </span>
              )}
            </button>
          ))}
        </nav>

        {/* Refresh + Logout */}
        <div style={{padding:"0 12px",display:"flex",flexDirection:"column",gap:8}}>
          <button onClick={fetchBookings} disabled={syncing} style={{
            display:"flex",alignItems:"center",gap:8,padding:"10px 12px",
            borderRadius:10,border:"1px solid rgba(212,175,55,0.2)",cursor:"pointer",
            background:"rgba(212,175,55,0.06)",color:"rgba(212,175,55,0.7)",
            fontFamily:"inherit",fontSize:12,transition:"all 0.2s",
          }}>
            <SvgIcon d={IC.refresh} size={14} color="rgba(212,175,55,0.7)"/>
            {syncing ? "جاري التحديث..." : "تحديث"}
          </button>

          <button onClick={onLogout} style={{
            display:"flex",alignItems:"center",gap:8,padding:"10px 12px",
            borderRadius:10,border:"1px solid rgba(239,68,68,0.2)",cursor:"pointer",
            background:"rgba(239,68,68,0.06)",color:"rgba(239,68,68,0.7)",
            fontFamily:"inherit",fontSize:12,transition:"all 0.2s",
          }}>
            <SvgIcon d={IC.logout} size={14} color="rgba(239,68,68,0.7)"/>
            تسجيل خروج
          </button>

          <div style={{background:"rgba(34,197,94,0.08)",border:"1px solid rgba(34,197,94,0.2)",
            borderRadius:10,padding:"8px 12px",display:"flex",alignItems:"center",gap:6}}>
            <div style={{width:6,height:6,borderRadius:"50%",background:"#4ade80",animation:"pulse2 2s infinite"}}/>
            <span style={{color:"#4ade80",fontSize:11}}>
              {lastSync ? lastSync.toLocaleTimeString("ar-SA",{hour:"2-digit",minute:"2-digit"}) : "..."}
            </span>
          </div>
        </div>
      </div>

      {/* Main */}
      <div style={{marginRight:220,padding:"28px 32px",minHeight:"100vh"}}>
        {/* Topbar */}
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:28}}>
          <div>
            <h1 style={{margin:0,fontSize:22,fontWeight:700,color:"#fff"}}>
              {activeTab==="overview"?"لوحة التحكم":activeTab==="bookings"?"الحجوزات":"الخدمات"}
            </h1>
            <div style={{color:"rgba(255,255,255,0.35)",fontSize:12,marginTop:4}}>
              {new Date().toLocaleDateString("ar-SA",{weekday:"long",year:"numeric",month:"long",day:"numeric"})}
            </div>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <div style={{background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.08)",
              borderRadius:10,padding:"8px 14px",display:"flex",alignItems:"center",gap:6,
              color:"rgba(255,255,255,0.5)",fontSize:12}}>
              <SvgIcon d={IC.bell} size={14}/>
              {pending.length} معلق
            </div>
            <button onClick={()=>setShowAdd(true)} style={{
              display:"flex",alignItems:"center",gap:6,padding:"8px 14px",
              background:"linear-gradient(135deg,#d4af37,#8b6914)",
              border:"none",borderRadius:10,color:"#1a0a0f",
              fontFamily:"inherit",fontSize:12,fontWeight:700,cursor:"pointer",
            }}>+ إضافة حجز</button>
            <div style={{width:36,height:36,borderRadius:10,
              background:"linear-gradient(135deg,#d4af37,#8b6914)",
              display:"flex",alignItems:"center",justifyContent:"center",fontSize:16}}>👩‍💼</div>
          </div>
        </div>

        {/* Overview */}
        {activeTab==="overview"&&(
          <div style={{animation:"fadeUp .4s ease"}}>
            <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:16,marginBottom:28}}>
              <StatCard label="حجوزات اليوم"    value={today.length}     sub={today.length+" موعد"}    ip={IC.calendar} accent="#d4af37"/>
              <StatCard label="إجمالي مؤكدة"    value={confirmed.length} sub="مؤكدة"                   ip={IC.check}    accent="#4ade80"/>
              <StatCard label="في الانتظار"     value={pending.length}   sub="تحتاج تأكيد"             ip={IC.clock}    accent="#fbbf24"/>
              <StatCard label="ملغية"            value={cancelled.length} sub="إجمالي الإلغاءات"        ip={IC.alert}    accent="#f87171"/>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1.4fr 1fr",gap:20}}>
              <div style={{background:"rgba(255,255,255,0.02)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:16,overflow:"hidden"}}>
                <div style={{padding:"16px 20px",borderBottom:"1px solid rgba(255,255,255,0.06)",
                  display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  <span style={{color:"#fff",fontWeight:600,fontSize:14}}>مواعيد اليوم</span>
                  <span style={{background:"rgba(212,175,55,0.12)",color:"#d4af37",fontSize:11,padding:"2px 10px",borderRadius:20}}>
                    {today.length} موعد
                  </span>
                </div>
                {today.length===0?(
                  <div style={{padding:30,textAlign:"center",color:"rgba(255,255,255,0.25)",fontSize:13}}>ما في مواعيد اليوم</div>
                ):today.map(b=>(
                  <div key={b.id} style={{display:"flex",alignItems:"center",gap:12,padding:"12px 20px",borderBottom:"1px solid rgba(255,255,255,0.04)"}}>
                    <div style={{width:32,height:32,borderRadius:"50%",flexShrink:0,
                      background:"linear-gradient(135deg,#d4af37,#8b6914)",
                      display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:700,color:"#1a0a0f"}}>
                      {b.name?.[0]}
                    </div>
                    <div style={{flex:1}}>
                      <div style={{color:"#e8d5a3",fontSize:13,fontWeight:500}}>{b.name}</div>
                      <div style={{color:"rgba(255,255,255,0.4)",fontSize:11}}>{b.service}</div>
                    </div>
                    <div style={{textAlign:"left"}}>
                      <div style={{color:"#d4af37",fontSize:12,fontWeight:600}}>{b.time}</div>
                      <div style={{color:"rgba(255,255,255,0.3)",fontSize:11}}>{b.price}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div style={{background:"rgba(255,255,255,0.02)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:16,padding:"16px 20px"}}>
                <div style={{color:"#fff",fontWeight:600,fontSize:14,marginBottom:16}}>الخدمات الأكثر طلبًا</div>
                {SERVICES.slice(0,5).map(s=>{
                  const cnt=bookings.filter(b=>b.service===s.name).length;
                  const mx=Math.max(...SERVICES.map(sv=>bookings.filter(b=>b.service===sv.name).length),1);
                  return(
                    <div key={s.id} style={{marginBottom:14}}>
                      <div style={{display:"flex",justifyContent:"space-between",marginBottom:5}}>
                        <span style={{color:"rgba(255,255,255,0.65)",fontSize:12}}>{s.icon} {s.name}</span>
                        <span style={{color:s.color,fontSize:12,fontWeight:600}}>{cnt} حجز</span>
                      </div>
                      <div style={{height:5,background:"rgba(255,255,255,0.06)",borderRadius:3}}>
                        <div style={{height:"100%",borderRadius:3,width:Math.round((cnt/mx)*100)||8+"%",
                          background:"linear-gradient(90deg,"+s.color+"99,"+s.color+")",transition:"width 1s ease"}}/>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Bookings */}
        {activeTab==="bookings"&&(
          <div style={{animation:"fadeUp .4s ease"}}>
            {/* Search + Filter */}
            <div style={{display:"flex",gap:12,marginBottom:20,alignItems:"center"}}>
              <div style={{
                display:"flex",alignItems:"center",gap:8,flex:1,
                background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.1)",
                borderRadius:12,padding:"8px 14px",
              }}>
                <SvgIcon d={IC.search} size={15} color="rgba(255,255,255,0.3)"/>
                <input value={search} onChange={e=>setSearch(e.target.value)}
                  placeholder="ابحث بالاسم أو الخدمة أو الرقم..."
                  style={{flex:1,background:"transparent",border:"none",color:"#e8d5a3",
                    fontSize:13,outline:"none",direction:"rtl"}}/>
              </div>
              <div style={{display:"flex",gap:6,background:"rgba(255,255,255,0.02)",
                border:"1px solid rgba(255,255,255,0.07)",borderRadius:12,padding:5}}>
                {[{id:"all",l:"الكل"},{id:"confirmed",l:"مؤكدة"},{id:"pending",l:"معلقة"},{id:"cancelled",l:"ملغية"}].map(f=>(
                  <button key={f.id} onClick={()=>setFilter(f.id)} style={{
                    padding:"6px 14px",borderRadius:8,border:"none",cursor:"pointer",
                    fontFamily:"inherit",fontSize:12,transition:"all 0.2s",
                    background:filter===f.id?"rgba(212,175,55,0.2)":"transparent",
                    color:filter===f.id?"#d4af37":"rgba(255,255,255,0.4)",
                    fontWeight:filter===f.id?600:400}}>
                    {f.l}
                    {f.id!=="all"&&<span style={{opacity:.6,fontSize:10,marginRight:4}}>
                      ({bookings.filter(b=>b.status===f.id).length})
                    </span>}
                  </button>
                ))}
              </div>
            </div>

            <div style={{background:"rgba(255,255,255,0.02)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:16,overflow:"hidden"}}>
              <div style={{display:"grid",gridTemplateColumns:"1.2fr 1fr 1fr 0.8fr 0.8fr auto",
                padding:"12px 20px",borderBottom:"1px solid rgba(255,255,255,0.06)",background:"rgba(255,255,255,0.03)"}}>
                {["العميلة","الخدمة","الموعد","السعر","الحالة",""].map(h=>(
                  <div key={h} style={{color:"rgba(255,255,255,0.35)",fontSize:11,fontWeight:600}}>{h}</div>
                ))}
              </div>
              {filtered.length===0?(
                <div style={{padding:40,textAlign:"center",color:"rgba(255,255,255,0.2)",fontSize:13}}>ما في حجوزات</div>
              ):filtered.map(b=><BookingRow key={b.id} b={b} onCancel={handleCancel}/>)}
            </div>
          </div>
        )}

        {/* Services */}
        {activeTab==="services"&&(
          <div style={{animation:"fadeUp .4s ease"}}>
            <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:16}}>
              {SERVICES.map(s=>{
                const cnt=bookings.filter(b=>b.service===s.name&&b.status==="confirmed").length;
                return(
                  <div key={s.id} style={{background:"rgba(255,255,255,0.02)",
                    border:"1px solid "+s.color+"25",borderRadius:16,padding:20,transition:"all 0.25s"}}
                    onMouseEnter={e=>{e.currentTarget.style.background=s.color+"08";e.currentTarget.style.border="1px solid "+s.color+"50";e.currentTarget.style.transform="translateY(-2px)"}}
                    onMouseLeave={e=>{e.currentTarget.style.background="rgba(255,255,255,0.02)";e.currentTarget.style.border="1px solid "+s.color+"25";e.currentTarget.style.transform="translateY(0)"}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:14}}>
                      <div style={{width:46,height:46,borderRadius:12,fontSize:22,
                        background:s.color+"18",display:"flex",alignItems:"center",justifyContent:"center"}}>{s.icon}</div>
                      <span style={{background:s.color+"18",color:s.color,fontSize:11,padding:"3px 10px",borderRadius:20}}>{cnt} حجز</span>
                    </div>
                    <div style={{color:"#e8d5a3",fontWeight:600,fontSize:14,marginBottom:4}}>{s.name}</div>
                    <div style={{color:"rgba(255,255,255,0.35)",fontSize:12,marginBottom:14}}>مدة الخدمة: {s.duration} دقيقة</div>
                    <div style={{paddingTop:12,borderTop:"1px solid "+s.color+"20"}}>
                      <span style={{color:s.color,fontWeight:700,fontSize:16}}>{s.price} ريال</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
