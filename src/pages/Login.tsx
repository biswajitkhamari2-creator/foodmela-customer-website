import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useShop } from '../store';

// ── OTP LOGIN — website is READ-ONLY for profile ──
// Same phone.email widget + client ID, same global callback, same backend
// proxy (api.verifyPhoneEmail), same Firestore users/{phone} lookup, same
// backend profile check. NO website profile form: a number with no server
// profile is directed to the mobile app (the ONLY place that edits profile).

// Same phone.email account as the apps — same client ID, same identity.
// Official "Sign in with Phone" button widget: OTP happens in a modal on
// THIS page, then phoneEmailListener hands us a user_json_url that only a
// server may fetch — so the website posts it to our backend proxy.
const PE_CLIENT_ID = '14442678863809499061';
const PE_WIDGET_SRC = 'https://www.phone.email/sign_in_button_v1.js';

// Every network step has a hard timeout — without one a stalled request
// leaves the button on "Verifying..." forever.
const STEP_TIMEOUT_MS = 15000;

function withTimeout<T>(p: Promise<T>, ms: number, label: string): Promise<T> {
  let t: ReturnType<typeof setTimeout>;
  const timeout = new Promise<never>((_, reject) => {
    t = setTimeout(() => reject(new Error(`${label} timed out`)), ms);
  });
  return Promise.race([p, timeout]).finally(() => clearTimeout(t!));
}

interface PeWidgetUser {
  user_json_url?: string;
  user_country_code?: string;
  user_phone_number?: string;
  user_first_name?: string;
  user_last_name?: string;
}

declare global {
  interface Window {
    phoneEmailListener?: (userObj: PeWidgetUser) => void;
  }
}

// ── Per-phone name cache ─────────────────────────────────────────────────────
// Survives logout, tab close, browser restart — once a name is known for a
// phone number we NEVER ask again. Key: fm_known_{10-digit-phone}
// Value: JSON { name, address }
function getCachedProfile(phone: string): { name: string; address: string } | null {
  try {
    const raw = localStorage.getItem(`fm_known_${phone}`);
    if (!raw) return null;
    const obj = JSON.parse(raw) as { name?: string; address?: string };
    const name = (obj.name ?? '').trim();
    return name ? { name, address: (obj.address ?? '').trim() } : null;
  } catch {
    return null;
  }
}

function setCachedProfile(phone: string, name: string, address: string) {
  try {
    localStorage.setItem(`fm_known_${phone}`, JSON.stringify({ name, address }));
  } catch { /* ignore */ }
}

function clearPeSession() {
  try {
    sessionStorage.removeItem('fm_pe_phone');
    sessionStorage.removeItem('fm_pe_name');
  } catch { /* ignore */ }
}

export default function Login() {
  const { setUser } = useShop();
  const nav = useNavigate();
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  const [step, setStep] = useState('');
  // No-profile state: number verified but no server profile exists.
  // Website NEVER asks for name/address — directs to the mobile app.
  const [noProfile, setNoProfile] = useState<{ phone: string } | null>(null);

  // Load the official widget script once, register the global callback
  // BEFORE the script runs so no verification result is ever missed.
  useEffect(() => {
    window.phoneEmailListener = (userObj: PeWidgetUser) => {
      if (userObj?.user_json_url) {
        void verifyWidgetUser(userObj.user_json_url);
      } else {
        setErr('Verification failed — phone.email did not confirm your number. Please try again.');
      }
    };
    if (!document.querySelector(`script[src="${PE_WIDGET_SRC}"]`)) {
      const s = document.createElement('script');
      s.src = PE_WIDGET_SRC;
      s.async = true;
      document.body.appendChild(s);
    }
    return () => {
      delete window.phoneEmailListener;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // If a verified session was interrupted (tab reloaded mid-lookup), the
  // server profile (not a form) decides the next step — nothing to resume.
  useEffect(() => {
    try {
      sessionStorage.removeItem('fm_pe_phone');
      sessionStorage.removeItem('fm_pe_name');
    } catch { /* ignore */ }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const enterWithProfile = (phone: string, name: string, address: string) => {
    clearPeSession();
    setCachedProfile(phone, name, address);
    setUser({ name, phone, address });
    nav('/');
  };

  // Widget callback → backend proxy fetches the user JSON server-to-server
  const verifyWidgetUser = async (userJsonUrl: string) => {
    setBusy(true);
    setErr('');
    setNoProfile(null);
    setStep('Confirming your number…');

    let phone = '';
    try {
      const { api } = await import('../api');
      const data = await withTimeout(
        api.verifyPhoneEmail({ user_json_url: userJsonUrl }),
        STEP_TIMEOUT_MS,
        'Verification server',
      );
      phone = String(data.phone ?? '').replace(/[^0-9]/g, '').slice(-10);
      if (!data.success || phone.length < 10) {
        setErr('Verification failed — phone.email did not confirm your number. Please try again.');
        setBusy(false);
        setStep('');
        return;
      }
      try {
        sessionStorage.setItem('fm_pe_phone', phone);
        const wName = String(data.name ?? '').trim();
        if (wName) sessionStorage.setItem('fm_pe_name', wName);
        if (data.jwt) sessionStorage.setItem('fm_pe_jwt', data.jwt);
        // OTP-minted token — kept for authenticated profile reads.
        if (data.apiToken) {
          localStorage.setItem('fm_api_token', data.apiToken);
          sessionStorage.setItem('fm_api_token', data.apiToken);
        }
      } catch { /* ignore */ }
    } catch {
      setErr('Could not reach verification server. Check your internet and try again.');
      setBusy(false);
      setStep('');
      return;
    }
    setStep('Looking up your account…');

    // ── STEP 0: localStorage cache — instant, survives logout/tab-close ──
    // Once a name is known for this phone we go straight in.
    // A silent background fetch updates the cache after login if name changed.
    const cached = getCachedProfile(phone);
    if (cached) {
      setUser({ name: cached.name, phone, address: cached.address });
      // Non-blocking background refresh — picks up name changes from app
      void (async () => {
        try {
          const { api } = await import('../api');
          const res = await api.userProfile(phone);
          const u = res.user as Record<string, unknown>;
          const freshName = String(u.fullName ?? u.name ?? '').trim();
          const addrs = Array.isArray(u.addresses) ? (u.addresses as Record<string, unknown>[]) : [];
          const freshAddr = String(addrs[0]?.address ?? u.address ?? cached.address).trim();
          if (freshName) {
            setCachedProfile(phone, freshName, freshAddr);
            setUser({ name: freshName, phone, address: freshAddr });
          }
        } catch { /* ignore — cached name already in use */ }
      })();
      clearPeSession();
      nav('/');
      return;
    }

    // ── STEP 1: Firestore users/{phone} — fast when rules allow read ──
    // Website is unauthenticated so this read is often denied.
    // A denial OR a 6s stall both fall through silently to step 2.
    try {
      const snap = await Promise.race([
        getDoc(doc(db, 'users', phone)),
        new Promise<null>((resolve) => setTimeout(() => resolve(null), 6000)),
      ]);
      if (snap === null) throw new Error('lookup stalled');
      if (snap.exists()) {
        const d = snap.data() as Record<string, unknown>;
        if (d.accountStatus === 'blocked') {
          setErr('Your account has been blocked. Please contact support.');
          setBusy(false);
          setStep('');
          return;
        }
        const fullName =
          (String(d.fullName ?? d.name ?? '').trim() ||
            `${String(d.firstName ?? '').trim()} ${String(d.lastName ?? '').trim()}`.trim());
        const addr = String(d.deliveryAddress ?? d.address ?? '').trim();
        if (fullName) {
          enterWithProfile(phone, fullName, addr);
          return;
        }
      }
    } catch {
      // Rules denied the read (unauthenticated web) — fall through to backend check
    }

    // ── STEP 2: Backend Redis profile — single source of truth ──
    // Returning customer goes straight in. A brand-new number (no profile
    // anywhere) is directed to the mobile app — website has NO profile form.
    try {
      const { api } = await import('../api');
      const res = await withTimeout(
        api.userProfile(phone),
        STEP_TIMEOUT_MS,
        'Profile server',
      );
      const u = res.user as Record<string, unknown>;
      if (String(u.accountStatus ?? 'active') === 'blocked') {
        setErr('Your account has been blocked. Please contact support.');
        setBusy(false);
        setStep('');
        return;
      }
      const fullName = String(u.fullName ?? u.name ?? '').trim();
      if (fullName) {
        const addrs = Array.isArray(u.addresses) ? (u.addresses as Record<string, unknown>[]) : [];
        const addr = String(addrs[0]?.address ?? u.address ?? '').trim();
        enterWithProfile(phone, fullName, addr);
        return;
      }
    } catch {
      setErr('Could not reach the profile server — check your internet and try again.');
      setBusy(false);
      setStep('');
      return;
    }

    // ── STEP 3: genuinely new number — NO website form. Mobile app only. ──
    clearPeSession();
    setNoProfile({ phone });
    setBusy(false);
    setStep('');
  };

  return (
    <div className="page-enter">
      <div className="auth-wrap">
        <div className="auth-card">
          <div className="auth-logo" aria-hidden="true">F</div>
          <h2 style={{ textAlign: 'center', margin: '16px 0 4px', fontSize: 24 }}>
            Welcome to FoodMela
          </h2>
          <p style={{ textAlign: 'center', color: '#66707D', fontSize: 13.5, marginBottom: 8 }}>
            Fresh groceries. Delivered happier. Login with OTP to order.
          </p>
          <div className="auth-perks">
            <span>⚡ Fast delivery</span>
            <span>🛡️ Secure OTP login</span>
            <span>❤️ Supports local</span>
          </div>

          {!noProfile ? (
            <>
              {/* Official phone.email button — renders itself, opens OTP modal on this page */}
              <div style={{ display: 'flex', justifyContent: 'center', marginTop: 18, opacity: busy ? 0.6 : 1, pointerEvents: busy ? 'none' : 'auto' }}>
                <div className="pe_signin_button" data-client-id={PE_CLIENT_ID} />
              </div>
              {busy && (
                <p style={{ textAlign: 'center', color: '#0e9f4e', fontWeight: 700, fontSize: 13, marginTop: 14 }}>
                  Verifying…
                </p>
              )}
              {step && <p style={{ textAlign: 'center', color: '#66707D', fontSize: 12, marginTop: 6 }}>{step}</p>}
              <p style={{ textAlign: 'center', color: '#9AA3AF', fontSize: 12, marginTop: 14 }}>
                Same OTP login as the app — one account everywhere. No new page, no popup.
              </p>
            </>
          ) : (
            <>
              <p style={{ fontSize: 13, color: '#0a5c2f', background: '#E7F6EC', borderRadius: 12, padding: '10px 14px', fontWeight: 700, marginBottom: 14, marginTop: 16 }}>
                ✓ Number verified: +91 {noProfile.phone}
              </p>
              <div style={{ textAlign: 'center', padding: '8px 4px 4px' }}>
                <div style={{ fontSize: 40 }} aria-hidden="true">📱</div>
                <h3 style={{ fontSize: 17, margin: '10px 0 6px' }}>One quick step in the app</h3>
                <p style={{ fontSize: 13.5, color: '#66707D', lineHeight: 1.6 }}>
                  This number has no profile yet. Please complete a one-time setup in the
                  <strong> FoodMela mobile app</strong> — then log in here again and you&apos;ll
                  go straight to ordering.
                </p>
                <button className="btn-primary" style={{ width: '100%', marginTop: 14 }} onClick={() => nav('/apk')}>
                  Get the FoodMela App →
                </button>
                <button
                  className="btn-ghost"
                  style={{ width: '100%', marginTop: 10 }}
                  onClick={() => { setNoProfile(null); setErr(''); }}
                >
                  Use a different number
                </button>
              </div>
            </>
          )}

          {err && <p style={{ color: '#C4271F', background: '#FDECEA', borderRadius: 12, padding: '10px 14px', fontSize: 13, marginTop: 14, textAlign: 'center' }}>{err}</p>}
        </div>
        <p style={{ textAlign: 'center', fontSize: 12, color: '#9AA3AF', marginTop: 16 }}>
          By continuing you agree to our Terms &amp; Privacy Policy.
        </p>
      </div>
    </div>
  );
}
