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

// رابط السيرفر على Railway
const API_URL = "https://lamsa-salon-server-production.up.railway.app";

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
};

function StatCard({ label, value, sub, iconPath, accent }) {
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
          <SvgIcon d={iconPath} color={accent} size={18}/>
        </div>
      </div>
    </div>
  );
}

function BookingRow({ b, onCancel }) {
  const sm = {
    confirmed:{label:"مؤكد",bg:"rgba(34,197,94,0.12)",color:"#4ade80"},
    pending:  {label:"معلق",bg:"rgba(251,191,36,0.12)",color:"#fbbf24"},
    cancelled:{label:"ملغي",bg:"rgba(239,68,68,0.12)",color:"#f87171"},
  };
  const s = sm[b.status]||sm.confirmed;
  return (
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr auto",alignItems:"center",
      padding:"14px 20px",borderBottom:"1px solid rgba(255,255,255,0.05)",transition:"background 0.15s"}}
      onMouseEnter={e=>e.currentTarget.style.background="rgba(255,255,255,0.03)"}
      onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
      <div style={{display:"flex",alignItems:"center",gap:10}}>
        <div style={{width:34,height:34,borderRadius:"50%",flexShrink:0,
          background:"linear-gradient(135deg,#d4af37,#8b6914)",
          display:"flex",alignItems:"center",justifyContent:"center",
          fontSize:13,fontWeight:700,color:"#1a0a0f"}}>{b.name?.[0]}</div>
        <span style={{color:"#e8d5a3",fontSize:13}}>{b.name}</span>
      </div>
      <div style={{color:"rgba(255,255,255,0.6)",fontSize:13}}>{b.service}</div>
      <div style={{color:"rgba(255,255,255,0.5)",fontSize:12}}>{b.date} — {b.time}</div>
      <div style={{color:"#d4af37",fontWeight:600,fontSize:13}}>{b.price}</div>
      <div style={{display:"flex",alignItems:"center",gap:8}}>
        <span style={{background:s.bg,color:s.color,fontSize:11,padding:"3px 10px",borderRadius:20}}>{s.label}</span>
        {b.status!=="cancelled"&&(
          <button onClick={()=>onCancel(b.id)} style={{
            background:"rgba(239,68,68,0.1)",border:"1px solid rgba(239,68,68,0.2)",
            borderRadius:6,padding:"4px 8px",color:"#f87171",fontSize:11,cursor:"pointer"}}
            onMouseEnter={e=>e.currentTarget.style.background="rgba(239,68,68,0.2)"}
            onMouseLeave={e=>e.currentTarget.style.background="rgba(239,68,68,0.1)"}>
            إلغاء
          </button>
        )}
      </div>
    </div>
  );
}

export default function SalonDashboard() {
  const [bookings,  setBookings]  = useState([]);
  const [activeTab, setActiveTab] = useState("overview");
  const [filter,    setFilter]    = useState("all");
  const [notifs,    setNotifs]    = useState([]);
  const [lastSync,  setLastSync]  = useState(null);
  const [syncing,   setSyncing]   = useState(false);

  const fetchBookings = useCallback(async () => {
    setSyncing(true);
    try {
      const res  = await fetch(API_URL + "/api/bookings");
      const data = await res.json();
      setBookings(data);
      setLastSync(new Date());
    } catch (err) {
      console.error("فشل جلب الحجوزات:", err);
    } finally {
      setSyncing(false);
    }
  }, []);

  // جلب عند التحميل + كل 30 ثانية
  useEffect(() => {
    fetchBookings();
    const interval = setInterval(fetchBookings, 30000);
    return () => clearInterval(interval);
  }, [fetchBookings]);

  const addNotif = (msg, type="success") => {
    const id = Date.now();
    setNotifs(p=>[...p,{id,msg,type}]);
    setTimeout(()=>setNotifs(p=>p.filter(n=>n.id!==id)),4000);
  };

  const handleCancel = (id) => {
    setBookings(p=>p.map(b=>b.id===id?{...b,status:"cancelled"}:b));
    addNotif("تم إلغاء الموعد","cancel");
  };

  const today     = bookings.filter(b=>b.date==="اليوم"&&b.status!=="cancelled");
  const confirmed = bookings.filter(b=>b.status==="confirmed");
  const pending   = bookings.filter(b=>b.status==="pending");
  const filtered  = filter==="all"?bookings:bookings.filter(b=>b.status===filter);

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

      {/* Notifs */}
      <div style={{position:"fixed",top:20,left:"50%",transform:"translateX(-50%)",zIndex:2000,display:"flex",flexDirection:"column",gap:8,alignItems:"center"}}>
        {notifs.map(n=>(
          <div key={n.id} style={{
            background:n.type==="success"?"rgba(34,197,94,0.15)":"rgba(239,68,68,0.15)",
            border:"1px solid "+(n.type==="success"?"rgba(34,197,94,.4)":"rgba(239,68,68,.4)"),
            color:n.type==="success"?"#4ade80":"#f87171",
            padding:"9px 20px",borderRadius:50,fontSize:13,backdropFilter:"blur(10px)",whiteSpace:"nowrap",
            animation:"fadeUp .3s ease",
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

        <div style={{padding:"0 20px"}}>
          <div style={{background:"rgba(34,197,94,0.08)",border:"1px solid rgba(34,197,94,0.2)",
            borderRadius:10,padding:"10px 12px",display:"flex",alignItems:"center",gap:8}}>
            <div style={{width:7,height:7,borderRadius:"50%",background:"#4ade80",animation:"pulse2 2s infinite"}}/>
            <span style={{color:"#4ade80",fontSize:12}}>الصالون مفتوح</span>
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
              <SvgIcon d={IC.bell} size={14}/>{pending.length} معلق
            </div>
            <div style={{width:36,height:36,borderRadius:10,
              background:"linear-gradient(135deg,#d4af37,#8b6914)",
              display:"flex",alignItems:"center",justifyContent:"center",fontSize:16}}>👩‍💼</div>
          </div>
        </div>

        {/* Overview */}
        {activeTab==="overview"&&(
          <div style={{animation:"fadeUp .4s ease"}}>
            <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:16,marginBottom:28}}>
              <StatCard label="حجوزات اليوم"    value={today.length}     sub={today.length+" موعد"}  iconPath={IC.calendar} accent="#d4af37"/>
              <StatCard label="إجمالي الحجوزات" value={confirmed.length} sub="مؤكدة"                 iconPath={IC.check}    accent="#4ade80"/>
              <StatCard label="في الانتظار"     value={pending.length}   sub="تحتاج تأكيد"           iconPath={IC.clock}    accent="#fbbf24"/>
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
            <div style={{display:"flex",gap:8,marginBottom:20,
              background:"rgba(255,255,255,0.02)",border:"1px solid rgba(255,255,255,0.07)",
              borderRadius:12,padding:6,width:"fit-content"}}>
              {[{id:"all",label:"الكل"},{id:"confirmed",label:"مؤكدة"},{id:"pending",label:"معلقة"},{id:"cancelled",label:"ملغية"}].map(f=>(
                <button key={f.id} onClick={()=>setFilter(f.id)} style={{
                  padding:"7px 16px",borderRadius:8,border:"none",cursor:"pointer",
                  fontFamily:"inherit",fontSize:12,transition:"all 0.2s",
                  background:filter===f.id?"rgba(212,175,55,0.2)":"transparent",
                  color:filter===f.id?"#d4af37":"rgba(255,255,255,0.4)",
                  fontWeight:filter===f.id?600:400}}>
                  {f.label}
                  {f.id!=="all"&&<span style={{opacity:.6,fontSize:10,marginRight:4}}>({bookings.filter(b=>b.status===f.id).length})</span>}
                </button>
              ))}
            </div>
            <div style={{background:"rgba(255,255,255,0.02)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:16,overflow:"hidden"}}>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr auto",
                padding:"12px 20px",borderBottom:"1px solid rgba(255,255,255,0.06)",background:"rgba(255,255,255,0.03)"}}>
                {["العميلة","الخدمة","الموعد","السعر","الحالة"].map(h=>(
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
                  <div key={s.id} style={{background:"rgba(255,255,255,0.02)",border:"1px solid "+s.color+"25",
                    borderRadius:16,padding:20,transition:"all 0.25s"}}
                    onMouseEnter={e=>{e.currentTarget.style.background=s.color+"08";e.currentTarget.style.border="1px solid "+s.color+"50";e.currentTarget.style.transform="translateY(-2px)"}}
                    onMouseLeave={e=>{e.currentTarget.style.background="rgba(255,255,255,0.02)";e.currentTarget.style.border="1px solid "+s.color+"25";e.currentTarget.style.transform="translateY(0)"}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:14}}>
                      <div style={{width:46,height:46,borderRadius:12,fontSize:22,background:s.color+"18",display:"flex",alignItems:"center",justifyContent:"center"}}>{s.icon}</div>
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
