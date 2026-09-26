import { Link } from 'react-router-dom';

const RIDER_APK_URL = 'https://firebasestorage.googleapis.com/v0/b/food-mela-notification.firebasestorage.app/o/apk%2Frider-app.apk?alt=media&token=UPLOAD_APK_THEN_REPLACE_TOKEN';
const APP_SIZE_MB = '245 MB';
const APP_VERSION = '2.0.0';

const STEPS = [
  { n: '1', title: 'Download karo', text: 'APK file tumhare phone me save hogi.' },
  { n: '2', title: 'Tap "Keep anyway"', text: 'Chrome "harmful" dikhata hai — tap Keep anyway. Ye safe hai.' },
  { n: '3', title: 'Install karo', text: 'File kholo → allow Install unknown apps jab puche.' },
  { n: '4', title: 'Login karo OTP se', text: 'Wahi phone number jo delivery partner register kiya.' },
];

export default function RiderApk() {
  return (
    <div className="apk-wrap">
      <div className="apk-hero">
        <div className="apk-icon">🚴‍♂️</div>
        <h1>FoodMela Rider App</h1>
        <p className="apk-sub">Delivery partner ka app — orders accept karo, deliver karo, earnings dekho</p>
        <a href={RIDER_APK_URL} download="FoodMela-Rider.apk" className="apk-dl-btn">
          ⬇ DOWNLOAD RIDER APP
        </a>
        <div className="apk-meta">Android · {APP_SIZE_MB} · v{APP_VERSION}</div>
        <div className="apk-trust">
          <span className="trust-badge">✓ Official FoodMela App</span>
          <span className="trust-badge">✓ Signed & Verified</span>
          <span className="trust-badge">✓ Safe for Riders</span>
        </div>
      </div>

      {/* ── STEPS ── */}
      <div className="apk-steps">
        <h2>Install kaise kare</h2>
        <div className="apk-step-grid">
          {STEPS.map(s => (
            <div key={s.n} className="apk-step">
              <div className="apk-step-n">{s.n}</div>
              <h3>{s.title}</h3>
              <p>{s.text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── WARNING EXPLANATION ── */}
      <div className="apk-faq">
        <h3>⚠️ Chrome "harmful" kyun bolta hai?</h3>
        <p>
          Chrome ye warning <strong>har app</strong> pe dikhata hai jo Play Store se bahar hai — Instagram, WhatsApp, kisi bhi company ka APK.
          Ye FoodMela Rider specific nahi hai.
        </p>
        <p>
          <strong>File 100% safe hai.</strong> Ye humara official rider app hai, digitally signed by FoodMela.
          Jab warning dikhe, bas <strong>"Keep anyway"</strong> tap karo.
        </p>
        <p className="apk-faq-meta">
          🔒 SHA256 signature secure · Google Firebase hosted · No viruses
        </p>
      </div>

      <div className="apk-back">
        <Link to="/">← Back to home</Link>
      </div>
    </div>
  );
}
