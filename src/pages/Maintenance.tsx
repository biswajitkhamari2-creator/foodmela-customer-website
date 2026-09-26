// 🛠️ Maintenance page — MAINTENANCE_MODE true hone par poori site ki jagah ye dikhega.
export default function Maintenance({ eta = '30 min' }: { eta?: string }) {
  return (
    <div className="fm-maintenance">
      <style>{`
        .fm-maintenance { min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; padding: 24px; background: linear-gradient(180deg, #FFF7F2 0%, #FFE8DC 100%); position: relative; overflow: hidden; }
        @keyframes fmFloat { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-12px); } }
        @keyframes fmSpin { to { transform: rotate(360deg); } }
        @keyframes fmWiggle { 0%,100% { transform: rotate(-8deg); } 50% { transform: rotate(8deg); } }
        @keyframes fmPulse { 0%,100% { opacity: 0.3; } 50% { opacity: 1; } }
        @keyframes fmBar { 0% { transform: translateX(-100%); } 100% { transform: translateX(250%); } }
        .fm-float-food { position: absolute; opacity: 0.7; animation: fmFloat 3s ease-in-out infinite; pointer-events: none; }
        .fm-gears { position: relative; width: 130px; height: 110px; margin-bottom: 20px; }
        .fm-gears span { position: absolute; display: inline-block; }
        .fm-dot { width: 10px; height: 10px; border-radius: 50%; background: #FF6535; animation: fmPulse 1.2s ease-in-out infinite; }
        .fm-bar-wrap { width: 192px; height: 8px; border-radius: 999px; margin-top: 20px; overflow: hidden; background: #F0E4D8; }
        .fm-bar { height: 100%; width: 40%; border-radius: 999px; background: linear-gradient(90deg, #FF6535, #F59E0B); animation: fmBar 1.4s ease-in-out infinite; }
      `}</style>

      {[
        { e: '🍕', l: '8%', t: '12%', d: '0s', s: '28px' },
        { e: '🍔', l: '78%', t: '15%', d: '0.8s', s: '24px' },
        { e: '🍩', l: '12%', t: '68%', d: '1.6s', s: '26px' },
        { e: '🍜', l: '82%', t: '62%', d: '0.4s', s: '28px' },
        { e: '🧁', l: '70%', t: '80%', d: '1.2s', s: '22px' },
        { e: '🌮', l: '18%', t: '38%', d: '2s', s: '22px' },
      ].map((f, i) => (
        <span key={i} className="fm-float-food" style={{ left: f.l, top: f.t, fontSize: f.s, animationDelay: f.d }}>{f.e}</span>
      ))}

      <div className="fm-gears">
        <span style={{ left: 0, top: 0, fontSize: '56px', animation: 'fmSpin 6s linear infinite' }}>⚙️</span>
        <span style={{ right: 0, bottom: 0, fontSize: '44px', animation: 'fmSpin 6s linear infinite reverse' }}>⚙️</span>
        <span style={{ left: '38px', top: '22px', fontSize: '52px', animation: 'fmWiggle 1.5s ease-in-out infinite' }}>🔧</span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span className="fm-dot" />
        <h1 style={{ fontSize: '24px', fontWeight: 900, color: '#1A1614', margin: 0 }}>Server Under Maintenance</h1>
        <span className="fm-dot" style={{ animationDelay: '0.6s' }} />
      </div>
      <p style={{ fontWeight: 800, color: '#FF6535', margin: '6px 0 0' }}>🍽️ Food Mela</p>
      <p style={{ color: '#9E8E86', marginTop: '8px' }}>Hum kuch naya bana rahe hain!<br />Thodi der me wapas aayenge 🙏</p>

      <div className="fm-bar-wrap"><div className="fm-bar" /></div>

      <p style={{ fontSize: '12px', marginTop: '16px', padding: '8px 16px', borderRadius: '999px', background: '#fff', color: '#FF6535', fontWeight: 700, boxShadow: '0 2px 8px rgba(255,101,53,0.2)' }}>
        ⏳ Expected: {eta}
      </p>
    </div>
  );
}
