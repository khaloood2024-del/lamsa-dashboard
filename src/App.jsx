import { useState, useEffect, useCallback } from "react";

const SERVICES = [
  { id:1, name:"باديكير وميديكير", duration:45,  price:80,  icon:"💅", color:"#f472b6" },
  { id:2, name:"تلوين شعر",        duration:90,  price:250, icon:"🎨", color:"#c084fc" },
  { id:3, name:"قص وتصفيف",        duration:60,  price:150, icon:"✂️", color:"#fb7185" },
  { id:4, name:"علاج بالأوزون",    duration:60,  price:200, icon:"🌿", color:"#34d399" },
  { id:5, name:"مساج استرخاء",     duration:60,  price:180, icon:"🪷", color:"#f9a8d4" },
  { id:6, name:"تنظيف بشرة",       duration:75,  price:220, icon:"✨", color:"#fcd34d" },
  { id:7, name:"عروس كاملة",       duration:240, price:800, icon:"👰", color:"#e879f9" },
];

const API_URL = "https://lamsa-salon-server-production.up.railway.app";
const PASSWORD = "123456";

const GLOBAL_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Noto+Naskh+Arabic:wght@400;500;600;700&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    background: #0d0511;
    font-family: 'Noto Naskh Arabic', serif;
    direction: rtl;
    color: #fff;
  }

  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: rgba(244,114,182,0.3); border-radius: 4px; }

  @keyframes fadeUp   { from { opacity:0; transform:translateY(16px) } to { opacity:1; transform:translateY(0) } }
  @keyframes fadeIn   { from { opacity:0 } to { opacity:1 } }
  @keyframes shake    { 0%,100%{transform:translateX(0)} 25%{transform:translateX(-8px)} 75%{transform:translateX(8px)} }
  @keyframes pulse    { 0%,100%{opacity:.5;transform:scale(1)} 50%{opacity:1;transform:scale(1.15)} }
  @keyframes float    { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-12px)} }
  @keyframes spin     { to { transform: rotate(360deg) } }
  @keyframes shimmer  { 0%{background-position:200% center} 100%{background-position:-200% center} }

  .glass {
    background: rgba(255,255,255,0.06);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border: 1px solid rgba(244,114,182,0.15);
  }

  .glass-dark {
    background: rgba(0,0,0,0.3);
    backdrop-filter: blur(24px);
    -webkit-backdrop-filter: blur(24px);
    border: 1px solid rgba(244,114,182,0.12);
  }

  input::placeholder { color: rgba(255,255,255,0.3); }
  input:focus { outline: none; }
  button { cursor: pointer; font-family: 'Noto Naskh Arabic', serif; }
`;

function SvgIcon({ d, size = 18, color = "currentColor", strokeWidth = 1.8 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      <path d={d} />
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
  star:     "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z",
  sparkle:  "M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83",
};

// ─── BACKGROUND ORBS ──────────────────────────────────────────────
function BgOrbs() {
  return (
    <div style={{ position: "fixed", inset: 0, overflow: "hidden", pointerEvents: "none", zIndex: 0 }}>
      <div style={{
        position: "absolute", width: 500, height: 500, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(236,72,153,0.18) 0%, transparent 70%)",
        top: "-100px", right: "-100px", animation: "float 8s ease-in-out infinite",
      }} />
      <div style={{
        position: "absolute", width: 400, height: 400, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(212,175,55,0.1) 0%, transparent 70%)",
        bottom: "10%", left: "10%", animation: "float 10s ease-in-out infinite reverse",
      }} />
      <div style={{
        position: "absolute", width: 300, height: 300, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(192,132,252,0.12) 0%, transparent 70%)",
        top: "40%", left: "30%", animation: "float 12s ease-in-out infinite",
      }} />
    </div>
  );
}

// ─── LOGIN ────────────────────────────────────────────────────────
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
      minHeight: "100vh",
      background: "linear-gradient(135deg, #0d0511 0%, #140820 50%, #0d0511 100%)",
      display: "flex", alignItems: "center", justifyContent: "center",
      position: "relative", overflow: "hidden",
    }}>
      <style>{GLOBAL_STYLES}</style>
      <BgOrbs />

      <div style={{
        position: "relative", zIndex: 1, width: 380,
        animation: shake ? "shake 0.4s ease" : "fadeUp 0.6s ease",
      }}>
        {/* Card */}
        <div style={{
          background: "rgba(255,255,255,0.05)",
          backdropFilter: "blur(30px)",
          WebkitBackdropFilter: "blur(30px)",
          border: "1px solid rgba(244,114,182,0.2)",
          borderRadius: 28, padding: "48px 40px",
          boxShadow: "0 30px 80px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.08)",
        }}>
          {/* Logo */}
          <div style={{ textAlign: "center", marginBottom: 40 }}>
            <div style={{
              width: 76, height: 76, borderRadius: 22, margin: "0 auto 16px",
              background: "linear-gradient(135deg, #ec4899, #d4af37)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 34, boxShadow: "0 8px 32px rgba(236,72,153,0.4)",
            }}>✨</div>
            <div style={{
              fontSize: 26, fontWeight: 700,
              background: "linear-gradient(135deg, #f9a8d4, #d4af37)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}>لمسة</div>
            <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 13, marginTop: 5 }}>
              لوحة تحكم الصالون
            </div>
          </div>

          {/* Input */}
          <div style={{ marginBottom: 14 }}>
            <div style={{
              background: "rgba(255,255,255,0.06)",
              border: error ? "1px solid rgba(251,113,133,0.6)" : "1px solid rgba(244,114,182,0.2)",
              borderRadius: 14, padding: "13px 18px",
              display: "flex", alignItems: "center", gap: 10,
              transition: "border 0.2s",
            }}>
              <SvgIcon d={IC.sparkle} size={16} color="rgba(244,114,182,0.5)" />
              <input
                type="password" value={pwd}
                onChange={e => { setPwd(e.target.value); setError(false); }}
                onKeyDown={e => e.key === "Enter" && handleLogin()}
                placeholder="كلمة المرور"
                style={{
                  flex: 1, background: "transparent", border: "none",
                  color: "#f9d7e8", fontSize: 14, direction: "rtl",
                }}
              />
            </div>
            {error && (
              <div style={{ color: "#fb7185", fontSize: 12, marginTop: 8, paddingRight: 4 }}>
                ❌ كلمة المرور غلط
              </div>
            )}
          </div>

          {/* Button */}
          <button onClick={handleLogin} style={{
            width: "100%", padding: "14px",
            background: "linear-gradient(135deg, #ec4899, #be185d)",
            border: "none", borderRadius: 14,
            color: "#fff", fontSize: 15, fontWeight: 700,
            boxShadow: "0 8px 24px rgba(236,72,153,0.4)",
            transition: "transform 0.15s, box-shadow 0.15s",
          }}
          onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 12px 32px rgba(236,72,153,0.5)"; }}
          onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(236,72,153,0.4)"; }}>
            دخول ✨
          </button>
        </div>

        {/* Bottom glow */}
        <div style={{
          position: "absolute", bottom: -30, left: "50%", transform: "translateX(-50%)",
          width: 200, height: 60,
          background: "radial-gradient(ellipse, rgba(236,72,153,0.3) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />
      </div>
    </div>
  );
}

// ─── CONFIRM DIALOG ───────────────────────────────────────────────
function ConfirmDialog({ message, onConfirm, onCancel }) {
  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)",
      display: "flex", alignItems: "center", justifyContent: "center",
      zIndex: 3000, direction: "rtl", backdropFilter: "blur(8px)",
      animation: "fadeIn 0.2s ease",
    }}>
      <div style={{
        background: "rgba(20,8,32,0.9)",
        backdropFilter: "blur(30px)",
        WebkitBackdropFilter: "blur(30px)",
        border: "1px solid rgba(244,114,182,0.25)",
        borderRadius: 20, padding: "32px 36px", width: 340,
        boxShadow: "0 30px 80px rgba(0,0,0,0.8)",
        animation: "fadeUp 0.25s ease",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
          <div style={{
            width: 38, height: 38, borderRadius: 10,
            background: "rgba(251,113,133,0.15)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <SvgIcon d={IC.alert} color="#fb7185" size={18} />
          </div>
          <span style={{ color: "#fff", fontWeight: 700, fontSize: 15 }}>تأكيد الإلغاء</span>
        </div>
        <p style={{ color: "rgba(255,255,255,0.55)", fontSize: 13, marginBottom: 24, lineHeight: 1.6 }}>
          {message}
        </p>
        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={onConfirm} style={{
            flex: 1, padding: "11px",
            background: "rgba(251,113,133,0.15)",
            border: "1px solid rgba(251,113,133,0.35)",
            borderRadius: 12, color: "#fb7185", fontSize: 13, fontWeight: 600,
            transition: "all 0.2s",
          }}
          onMouseEnter={e => e.currentTarget.style.background = "rgba(251,113,133,0.25)"}
          onMouseLeave={e => e.currentTarget.style.background = "rgba(251,113,133,0.15)"}>
            إلغاء الموعد
          </button>
          <button onClick={onCancel} style={{
            flex: 1, padding: "11px",
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 12, color: "rgba(255,255,255,0.55)", fontSize: 13,
            transition: "all 0.2s",
          }}
          onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.1)"}
          onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.05)"}>
            تراجع
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── STAT CARD ────────────────────────────────────────────────────
function StatCard({ label, value, sub, ip, accent }) {
  return (
    <div style={{
      background: "rgba(255,255,255,0.05)",
      backdropFilter: "blur(20px)",
      WebkitBackdropFilter: "blur(20px)",
      border: "1px solid " + accent + "30",
      borderRadius: 20, padding: "22px 20px",
      position: "relative", overflow: "hidden",
      transition: "transform 0.25s, box-shadow 0.25s",
    }}
    onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = `0 12px 40px ${accent}20`; }}
    onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}>
      {/* Glow orb */}
      <div style={{
        position: "absolute", top: -30, left: -30, width: 100, height: 100,
        borderRadius: "50%", background: accent + "18", pointerEvents: "none",
      }} />
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", position: "relative" }}>
        <div>
          <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 11, marginBottom: 10, letterSpacing: "0.3px" }}>
            {label}
          </div>
          <div style={{ color: "#fff", fontSize: 30, fontWeight: 700, lineHeight: 1 }}>{value}</div>
          {sub && <div style={{ color: accent, fontSize: 11, marginTop: 8, opacity: 0.8 }}>{sub}</div>}
        </div>
        <div style={{
          width: 44, height: 44, borderRadius: 13,
          background: accent + "20",
          border: "1px solid " + accent + "30",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <SvgIcon d={ip} color={accent} size={20} />
        </div>
      </div>
    </div>
  );
}

// ─── BOOKING ROW ──────────────────────────────────────────────────
function BookingRow({ b, onCancel }) {
  const sm = {
    confirmed: { label: "مؤكد",  bg: "rgba(34,197,94,0.12)",   color: "#4ade80",  border: "rgba(34,197,94,0.25)" },
    pending:   { label: "معلق",  bg: "rgba(251,191,36,0.12)",  color: "#fbbf24",  border: "rgba(251,191,36,0.25)" },
    cancelled: { label: "ملغي",  bg: "rgba(251,113,133,0.12)", color: "#fb7185",  border: "rgba(251,113,133,0.25)" },
  };
  const s = sm[b.status] || sm.confirmed;
  const phone = b.phone?.replace("whatsapp:", "") || "";

  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "1.2fr 1fr 1fr 0.8fr 0.8fr auto",
      alignItems: "center", padding: "14px 20px",
      borderBottom: "1px solid rgba(244,114,182,0.06)",
      transition: "background 0.15s",
    }}
    onMouseEnter={e => e.currentTarget.style.background = "rgba(244,114,182,0.04)"}
    onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{
          width: 36, height: 36, borderRadius: "50%", flexShrink: 0,
          background: "linear-gradient(135deg, #ec4899, #d4af37)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 13, fontWeight: 700, color: "#fff",
          boxShadow: "0 4px 12px rgba(236,72,153,0.35)",
        }}>{b.name?.[0]}</div>
        <div>
          <div style={{ color: "#fce7f3", fontSize: 13, fontWeight: 500 }}>{b.name}</div>
          {phone && (
            <div style={{ color: "rgba(255,255,255,0.35)", fontSize: 11, display: "flex", alignItems: "center", gap: 3, marginTop: 2 }}>
              <SvgIcon d={IC.phone} size={10} color="rgba(244,114,182,0.4)" />
              {phone}
            </div>
          )}
        </div>
      </div>
      <div style={{ color: "rgba(255,255,255,0.6)", fontSize: 13 }}>{b.service}</div>
      <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 12 }}>{b.date} — {b.time}</div>
      <div style={{
        color: "#d4af37", fontWeight: 700, fontSize: 13,
        background: "linear-gradient(135deg,#d4af37,#f9a8d4)",
        WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
      }}>{b.price}</div>
      <span style={{
        background: s.bg, color: s.color, fontSize: 11,
        padding: "4px 12px", borderRadius: 20, width: "fit-content",
        border: "1px solid " + s.border,
      }}>{s.label}</span>
      <div>
        {b.status !== "cancelled" && (
          <button onClick={() => onCancel(b.id, b.name)} style={{
            background: "rgba(251,113,133,0.1)",
            border: "1px solid rgba(251,113,133,0.25)",
            borderRadius: 8, padding: "5px 10px",
            color: "#fb7185", fontSize: 11,
            transition: "all 0.2s",
          }}
          onMouseEnter={e => { e.currentTarget.style.background = "rgba(251,113,133,0.2)"; e.currentTarget.style.borderColor = "rgba(251,113,133,0.45)"; }}
          onMouseLeave={e => { e.currentTarget.style.background = "rgba(251,113,133,0.1)"; e.currentTarget.style.borderColor = "rgba(251,113,133,0.25)"; }}>
            إلغاء
          </button>
        )}
      </div>
    </div>
  );
}

// ─── SIDEBAR ──────────────────────────────────────────────────────
function Sidebar({ activeTab, setActiveTab, tabs, pending, syncing, lastSync, fetchBookings, onLogout }) {
  return (
    <div style={{
      position: "fixed", top: 0, right: 0, height: "100vh", width: 230,
      background: "rgba(13,5,17,0.75)",
      backdropFilter: "blur(28px)",
      WebkitBackdropFilter: "blur(28px)",
      borderLeft: "1px solid rgba(244,114,182,0.12)",
      display: "flex", flexDirection: "column",
      padding: "28px 0", zIndex: 100,
    }}>
      {/* Logo */}
      <div style={{ padding: "0 20px 28px", borderBottom: "1px solid rgba(244,114,182,0.1)" }}>
        <div style={{
          width: 50, height: 50, borderRadius: 15, marginBottom: 12,
          background: "linear-gradient(135deg, #ec4899, #d4af37)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 24, boxShadow: "0 6px 20px rgba(236,72,153,0.4)",
        }}>✨</div>
        <div style={{
          fontSize: 20, fontWeight: 700,
          background: "linear-gradient(135deg, #f9a8d4, #d4af37)",
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          backgroundClip: "text",
        }}>لمسة</div>
        <div style={{ color: "rgba(255,255,255,0.3)", fontSize: 11, marginTop: 3 }}>صالون وسبا</div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: "20px 14px", display: "flex", flexDirection: "column", gap: 4 }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id)} style={{
            display: "flex", alignItems: "center", gap: 10,
            padding: "11px 14px", borderRadius: 13, border: "none",
            textAlign: "right", width: "100%",
            background: activeTab === t.id
              ? "linear-gradient(135deg, rgba(236,72,153,0.2), rgba(212,175,55,0.1))"
              : "transparent",
            boxShadow: activeTab === t.id ? "inset 0 0 0 1px rgba(244,114,182,0.2)" : "none",
            color: activeTab === t.id ? "#f9a8d4" : "rgba(255,255,255,0.4)",
            fontSize: 13, fontWeight: activeTab === t.id ? 600 : 400,
            transition: "all 0.2s",
          }}
          onMouseEnter={e => { if (activeTab !== t.id) e.currentTarget.style.background = "rgba(244,114,182,0.06)"; }}
          onMouseLeave={e => { if (activeTab !== t.id) e.currentTarget.style.background = "transparent"; }}>
            <SvgIcon d={t.ip} size={16} color={activeTab === t.id ? "#f472b6" : "rgba(255,255,255,0.35)"} />
            {t.label}
            {t.id === "bookings" && pending.length > 0 && (
              <span style={{
                marginRight: "auto",
                background: "rgba(244,114,182,0.2)", color: "#f472b6",
                fontSize: 10, padding: "2px 7px", borderRadius: 10,
                border: "1px solid rgba(244,114,182,0.3)",
              }}>{pending.length}</span>
            )}
          </button>
        ))}
      </nav>

      {/* Bottom actions */}
      <div style={{ padding: "0 14px", display: "flex", flexDirection: "column", gap: 8 }}>
        <button onClick={fetchBookings} disabled={syncing} style={{
          display: "flex", alignItems: "center", gap: 8, padding: "10px 14px",
          borderRadius: 12, border: "1px solid rgba(244,114,182,0.2)",
          background: "rgba(244,114,182,0.06)", color: "rgba(244,114,182,0.7)",
          fontSize: 12, transition: "all 0.2s", width: "100%",
        }}>
          <div style={{ animation: syncing ? "spin 1s linear infinite" : "none", display: "flex" }}>
            <SvgIcon d={IC.refresh} size={14} color="rgba(244,114,182,0.7)" />
          </div>
          {syncing ? "جاري التحديث..." : "تحديث"}
        </button>

        <button onClick={onLogout} style={{
          display: "flex", alignItems: "center", gap: 8, padding: "10px 14px",
          borderRadius: 12, border: "1px solid rgba(251,113,133,0.2)",
          background: "rgba(251,113,133,0.06)", color: "rgba(251,113,133,0.7)",
          fontSize: 12, transition: "all 0.2s", width: "100%",
        }}>
          <SvgIcon d={IC.logout} size={14} color="rgba(251,113,133,0.7)" />
          تسجيل خروج
        </button>

        {/* Status */}
        <div style={{
          background: "rgba(74,222,128,0.07)",
          border: "1px solid rgba(74,222,128,0.18)",
          borderRadius: 12, padding: "9px 14px",
          display: "flex", alignItems: "center", gap: 7,
        }}>
          <div style={{
            width: 7, height: 7, borderRadius: "50%", background: "#4ade80",
            animation: "pulse 2s infinite",
          }} />
          <span style={{ color: "#4ade80", fontSize: 11 }}>
            {lastSync
              ? lastSync.toLocaleTimeString("ar-SA", { hour: "2-digit", minute: "2-digit" })
              : "..."}
          </span>
        </div>
      </div>
    </div>
  );
}

// ─── MAIN DASHBOARD ───────────────────────────────────────────────
export default function SalonDashboard() {
  const [loggedIn, setLoggedIn] = useState(() => window.location.hash === "#authenticated");

  const handleLogin = () => {
    window.location.hash = "authenticated";
    window.location.reload();
  };

  if (!loggedIn) return <LoginScreen onLogin={handleLogin} />;
  return <Dashboard onLogout={() => { window.location.hash = ""; window.location.reload(); }} />;
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

  const addNotif = (msg, type = "success") => {
    const id = Date.now();
    setNotifs(p => [...p, { id, msg, type }]);
    setTimeout(() => setNotifs(p => p.filter(n => n.id !== id)), 4000);
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

  const handleCancel   = (id, name) => setConfirm({ id, name });
  const confirmCancel  = async () => {
    const { id } = confirm;
    setConfirm(null);
    try {
      await fetch(API_URL + "/api/bookings/" + id + "/cancel", { method: "PATCH" });
      setBookings(p => p.map(b => b.id === id ? { ...b, status: "cancelled" } : b));
      addNotif("تم إلغاء الموعد", "cancel");
    } catch {
      addNotif("تم إلغاء الموعد", "cancel");
    }
  };

  const today     = bookings.filter(b => b.date === "اليوم" && b.status !== "cancelled");
  const confirmed = bookings.filter(b => b.status === "confirmed");
  const pending   = bookings.filter(b => b.status === "pending");
  const cancelled = bookings.filter(b => b.status === "cancelled");

  const filtered = bookings
    .filter(b => filter === "all" || b.status === filter)
    .filter(b => !search || b.name?.includes(search) || b.service?.includes(search) || b.phone?.includes(search));

  const tabs = [
    { id: "overview", label: "نظرة عامة", ip: IC.grid },
    { id: "bookings", label: "الحجوزات",  ip: IC.calendar },
    { id: "services", label: "الخدمات",   ip: IC.scissors },
  ];

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #0d0511 0%, #140820 50%, #0d0511 100%)",
      fontFamily: "'Noto Naskh Arabic', serif",
      direction: "rtl", color: "#fff", position: "relative",
    }}>
      <style>{GLOBAL_STYLES}</style>
      <BgOrbs />

      {confirm && (
        <ConfirmDialog
          message={`هل تريدين إلغاء موعد ${confirm.name}؟`}
          onConfirm={confirmCancel}
          onCancel={() => setConfirm(null)}
        />
      )}

      {/* Notifications */}
      <div style={{
        position: "fixed", top: 24, left: "50%", transform: "translateX(-50%)",
        zIndex: 2000, display: "flex", flexDirection: "column", gap: 8,
        alignItems: "center", pointerEvents: "none",
      }}>
        {notifs.map(n => (
          <div key={n.id} style={{
            background: n.type === "success"
              ? "rgba(236,72,153,0.15)"
              : n.type === "cancel"
              ? "rgba(251,113,133,0.15)"
              : "rgba(212,175,55,0.15)",
            border: "1px solid " + (n.type === "success"
              ? "rgba(236,72,153,0.4)"
              : n.type === "cancel"
              ? "rgba(251,113,133,0.4)"
              : "rgba(212,175,55,0.4)"),
            color: n.type === "success" ? "#f9a8d4" : n.type === "cancel" ? "#fb7185" : "#fcd34d",
            padding: "10px 24px", borderRadius: 50, fontSize: 13,
            backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)",
            boxShadow: "0 8px 24px rgba(0,0,0,0.3)",
            animation: "fadeUp .3s ease",
          }}>{n.msg}</div>
        ))}
      </div>

      <Sidebar
        activeTab={activeTab} setActiveTab={setActiveTab}
        tabs={tabs} pending={pending} syncing={syncing}
        lastSync={lastSync} fetchBookings={fetchBookings} onLogout={onLogout}
      />

      {/* Main content */}
      <div style={{ marginRight: 230, padding: "32px 36px", minHeight: "100vh", position: "relative", zIndex: 1 }}>

        {/* Topbar */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          marginBottom: 32,
        }}>
          <div>
            <h1 style={{ margin: 0, fontSize: 24, fontWeight: 700, color: "#fff" }}>
              {activeTab === "overview" ? "لوحة التحكم" : activeTab === "bookings" ? "الحجوزات" : "الخدمات"}
            </h1>
            <div style={{ color: "rgba(255,255,255,0.35)", fontSize: 12, marginTop: 5 }}>
              {new Date().toLocaleDateString("ar-SA", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {/* Pending badge */}
            <div style={{
              background: "rgba(255,255,255,0.05)",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(244,114,182,0.15)",
              borderRadius: 12, padding: "9px 16px",
              display: "flex", alignItems: "center", gap: 7,
              color: "rgba(255,255,255,0.5)", fontSize: 12,
            }}>
              <SvgIcon d={IC.bell} size={14} color="rgba(244,114,182,0.6)" />
              {pending.length} معلق
            </div>
            {/* Avatar */}
            <div style={{
              width: 40, height: 40, borderRadius: 12,
              background: "linear-gradient(135deg, #ec4899, #d4af37)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 18, boxShadow: "0 4px 16px rgba(236,72,153,0.4)",
            }}>👩‍💼</div>
          </div>
        </div>

        {/* ── Overview ── */}
        {activeTab === "overview" && (
          <div style={{ animation: "fadeUp .4s ease" }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16, marginBottom: 28 }}>
              <StatCard label="حجوزات اليوم"  value={today.length}     sub={today.length + " موعد"}      ip={IC.calendar} accent="#f472b6" />
              <StatCard label="إجمالي مؤكدة"  value={confirmed.length} sub="مؤكدة"                       ip={IC.check}    accent="#4ade80" />
              <StatCard label="في الانتظار"   value={pending.length}   sub="تحتاج تأكيد"                 ip={IC.clock}    accent="#fcd34d" />
              <StatCard label="ملغية"          value={cancelled.length} sub="إجمالي الإلغاءات"            ip={IC.alert}    accent="#fb7185" />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 20 }}>
              {/* Today's appointments */}
              <div style={{
                background: "rgba(255,255,255,0.04)",
                backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)",
                border: "1px solid rgba(244,114,182,0.1)",
                borderRadius: 20, overflow: "hidden",
              }}>
                <div style={{
                  padding: "18px 22px",
                  borderBottom: "1px solid rgba(244,114,182,0.08)",
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                  background: "rgba(244,114,182,0.04)",
                }}>
                  <span style={{ color: "#fff", fontWeight: 600, fontSize: 14 }}>مواعيد اليوم</span>
                  <span style={{
                    background: "rgba(244,114,182,0.15)", color: "#f472b6",
                    fontSize: 11, padding: "3px 12px", borderRadius: 20,
                    border: "1px solid rgba(244,114,182,0.25)",
                  }}>{today.length} موعد</span>
                </div>
                {today.length === 0 ? (
                  <div style={{ padding: 36, textAlign: "center", color: "rgba(255,255,255,0.2)", fontSize: 13 }}>
                    ما في مواعيد اليوم 🌸
                  </div>
                ) : today.map(b => (
                  <div key={b.id} style={{
                    display: "flex", alignItems: "center", gap: 12,
                    padding: "13px 22px",
                    borderBottom: "1px solid rgba(244,114,182,0.05)",
                    transition: "background 0.15s",
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = "rgba(244,114,182,0.04)"}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                    <div style={{
                      width: 34, height: 34, borderRadius: "50%", flexShrink: 0,
                      background: "linear-gradient(135deg, #ec4899, #d4af37)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 13, fontWeight: 700, color: "#fff",
                      boxShadow: "0 3px 10px rgba(236,72,153,0.3)",
                    }}>{b.name?.[0]}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ color: "#fce7f3", fontSize: 13, fontWeight: 500 }}>{b.name}</div>
                      <div style={{ color: "rgba(255,255,255,0.35)", fontSize: 11, marginTop: 2 }}>{b.service}</div>
                    </div>
                    <div style={{ textAlign: "left" }}>
                      <div style={{ color: "#f472b6", fontSize: 12, fontWeight: 700 }}>{b.time}</div>
                      <div style={{ color: "rgba(255,255,255,0.3)", fontSize: 11, marginTop: 2 }}>{b.price}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Popular services */}
              <div style={{
                background: "rgba(255,255,255,0.04)",
                backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)",
                border: "1px solid rgba(244,114,182,0.1)",
                borderRadius: 20, padding: "18px 22px",
              }}>
                <div style={{ color: "#fff", fontWeight: 600, fontSize: 14, marginBottom: 20 }}>
                  الخدمات الأكثر طلبًا
                </div>
                {SERVICES.slice(0, 5).map(s => {
                  const cnt = bookings.filter(b => b.service === s.name).length;
                  const mx  = Math.max(...SERVICES.map(sv => bookings.filter(b => b.service === sv.name).length), 1);
                  return (
                    <div key={s.id} style={{ marginBottom: 16 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                        <span style={{ color: "rgba(255,255,255,0.6)", fontSize: 12 }}>{s.icon} {s.name}</span>
                        <span style={{ color: s.color, fontSize: 12, fontWeight: 600 }}>{cnt} حجز</span>
                      </div>
                      <div style={{ height: 5, background: "rgba(255,255,255,0.06)", borderRadius: 4 }}>
                        <div style={{
                          height: "100%", borderRadius: 4,
                          width: Math.round((cnt / mx) * 100) + "%",
                          background: `linear-gradient(90deg, ${s.color}80, ${s.color})`,
                          transition: "width 1s ease",
                          minWidth: 8,
                        }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ── Bookings ── */}
        {activeTab === "bookings" && (
          <div style={{ animation: "fadeUp .4s ease" }}>
            <div style={{ display: "flex", gap: 12, marginBottom: 20, alignItems: "center" }}>
              {/* Search */}
              <div style={{
                display: "flex", alignItems: "center", gap: 8, flex: 1,
                background: "rgba(255,255,255,0.05)",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(244,114,182,0.15)",
                borderRadius: 14, padding: "10px 16px",
              }}>
                <SvgIcon d={IC.search} size={15} color="rgba(244,114,182,0.4)" />
                <input value={search} onChange={e => setSearch(e.target.value)}
                  placeholder="ابحث بالاسم أو الخدمة أو الرقم..."
                  style={{
                    flex: 1, background: "transparent", border: "none",
                    color: "#fce7f3", fontSize: 13, direction: "rtl",
                  }} />
              </div>
              {/* Filter pills */}
              <div style={{
                display: "flex", gap: 5,
                background: "rgba(255,255,255,0.03)",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(244,114,182,0.1)",
                borderRadius: 14, padding: 5,
              }}>
                {[
                  { id: "all",       l: "الكل" },
                  { id: "confirmed", l: "مؤكدة" },
                  { id: "pending",   l: "معلقة" },
                  { id: "cancelled", l: "ملغية" },
                ].map(f => (
                  <button key={f.id} onClick={() => setFilter(f.id)} style={{
                    padding: "7px 16px", borderRadius: 10, border: "none",
                    fontSize: 12, transition: "all 0.2s",
                    background: filter === f.id
                      ? "linear-gradient(135deg, rgba(236,72,153,0.25), rgba(212,175,55,0.15))"
                      : "transparent",
                    boxShadow: filter === f.id ? "inset 0 0 0 1px rgba(244,114,182,0.3)" : "none",
                    color: filter === f.id ? "#f9a8d4" : "rgba(255,255,255,0.4)",
                    fontWeight: filter === f.id ? 600 : 400,
                  }}>
                    {f.l}
                    {f.id !== "all" && (
                      <span style={{ opacity: 0.6, fontSize: 10, marginRight: 4 }}>
                        ({bookings.filter(b => b.status === f.id).length})
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div style={{
              background: "rgba(255,255,255,0.04)",
              backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)",
              border: "1px solid rgba(244,114,182,0.1)",
              borderRadius: 20, overflow: "hidden",
            }}>
              {/* Table header */}
              <div style={{
                display: "grid",
                gridTemplateColumns: "1.2fr 1fr 1fr 0.8fr 0.8fr auto",
                padding: "13px 20px",
                borderBottom: "1px solid rgba(244,114,182,0.08)",
                background: "rgba(244,114,182,0.04)",
              }}>
                {["العميلة", "الخدمة", "الموعد", "السعر", "الحالة", ""].map(h => (
                  <div key={h} style={{ color: "rgba(244,114,182,0.5)", fontSize: 11, fontWeight: 600, letterSpacing: "0.3px" }}>{h}</div>
                ))}
              </div>
              {filtered.length === 0 ? (
                <div style={{ padding: 44, textAlign: "center", color: "rgba(255,255,255,0.2)", fontSize: 13 }}>
                  ما في حجوزات 🌸
                </div>
              ) : filtered.map(b => <BookingRow key={b.id} b={b} onCancel={handleCancel} />)}
            </div>
          </div>
        )}

        {/* ── Services ── */}
        {activeTab === "services" && (
          <div style={{ animation: "fadeUp .4s ease" }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 18 }}>
              {SERVICES.map(s => {
                const cnt = bookings.filter(b => b.service === s.name && b.status === "confirmed").length;
                return (
                  <div key={s.id} style={{
                    background: "rgba(255,255,255,0.04)",
                    backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)",
                    border: "1px solid " + s.color + "22",
                    borderRadius: 20, padding: 22,
                    transition: "all 0.25s",
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = s.color + "0d";
                    e.currentTarget.style.border     = "1px solid " + s.color + "50";
                    e.currentTarget.style.transform  = "translateY(-4px)";
                    e.currentTarget.style.boxShadow  = "0 16px 40px " + s.color + "20";
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = "rgba(255,255,255,0.04)";
                    e.currentTarget.style.border     = "1px solid " + s.color + "22";
                    e.currentTarget.style.transform  = "translateY(0)";
                    e.currentTarget.style.boxShadow  = "none";
                  }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
                      <div style={{
                        width: 50, height: 50, borderRadius: 15, fontSize: 24,
                        background: s.color + "18",
                        border: "1px solid " + s.color + "30",
                        display: "flex", alignItems: "center", justifyContent: "center",
                      }}>{s.icon}</div>
                      <span style={{
                        background: s.color + "18", color: s.color,
                        fontSize: 11, padding: "4px 12px", borderRadius: 20,
                        border: "1px solid " + s.color + "30",
                      }}>{cnt} حجز</span>
                    </div>
                    <div style={{ color: "#fce7f3", fontWeight: 600, fontSize: 14, marginBottom: 5 }}>{s.name}</div>
                    <div style={{ color: "rgba(255,255,255,0.35)", fontSize: 12, marginBottom: 16 }}>
                      مدة الخدمة: {s.duration} دقيقة
                    </div>
                    <div style={{ paddingTop: 14, borderTop: "1px solid " + s.color + "18" }}>
                      <span style={{
                        fontWeight: 700, fontSize: 17,
                        background: `linear-gradient(135deg, ${s.color}, #d4af37)`,
                        WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                        backgroundClip: "text",
                      }}>{s.price} ريال</span>
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
