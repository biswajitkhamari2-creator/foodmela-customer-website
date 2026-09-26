import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useShop } from '../store';
import { useDeliveryLocation } from './location-context';

const HERO_DISHES = [
  'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&q=80&fit=crop',
  'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800&q=80&fit=crop',
  'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d6?w=800&q=80&fit=crop',
];

const TICKER = [
  '🚜 Farm-fresh vegetables every morning',
  '🥛 Dairy picked up daily at 6 AM',
  '🛵 Live rider tracking on every order',
  '🎟️ MEGA70 — ₹70 off your feast',
  '⚡ Free delivery over ₹299',
  '❤️ 4.8 rated by your neighbours',
];

/**
 * Cinematic storefront hero — layered depth stage (not a gradient card):
 * photo plate with orbit ring, floating glass chips, parallax on mouse,
 * marquee ticker. Pure CSS + tiny parallax hook. No backend touch.
 */
export default function PremiumHero() {
  const nav = useNavigate();
  const { user, cartCount } = useShop();
  const { city, setLocOpen } = useDeliveryLocation();
  const [dish, setDish] = useState(0);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const t = setInterval(() => setDish((d) => (d + 1) % HERO_DISHES.length), 4200);
    return () => clearInterval(t);
  }, []);

  const onMove = (e: React.MouseEvent<HTMLElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    setTilt({ x: px, y: py });
  };

  return (
    <section className="px-hero" onMouseMove={onMove} aria-label="FoodMela storefront">
      {/* ambient layers */}
      <div className="px-hero-bg" aria-hidden="true">
        <span className="px-blob px-blob-a" />
        <span className="px-blob px-blob-b" />
        <span className="px-grain" />
        <span className="px-ring px-ring-1" />
        <span className="px-ring px-ring-2" />
      </div>

      <div className="px-hero-grid">
        {/* ── Copy column ── */}
        <div className="px-copy">
          <button className="px-eyebrow" onClick={() => setLocOpen(true)}>
            <span className="px-live-dot" aria-hidden="true" />
            Now delivering in {city} · change
          </button>
          <h1 className="px-title">
            Ghar ka khana,
            <br />
            <span className="px-title-fresh">bazaar se fresh.</span>
          </h1>
          <p className="px-sub">
            Vegetables, fruits, dairy &amp; daily staples — picked every morning
            from local mandis and at your door in minutes. No cold storage, no stale stock.
          </p>
          <div className="px-cta-row">
            <button className="px-cta-main" onClick={() => nav(user ? '/grocery' : '/login')}>
              <span>Shop fresh now</span>
              <span className="px-cta-arrow" aria-hidden="true">→</span>
            </button>
            <button className="px-cta-ghost" onClick={() => nav('/offers')}>
              🔥 Today&apos;s deals
            </button>
          </div>
          <div className="px-proof">
            <div className="px-avatars" aria-hidden="true">
              <i>🧑🏽‍🌾</i><i>👩🏽‍🍳</i><i>🧓🏽</i><i>👧🏽</i>
            </div>
            <div>
              <strong>2,400+ happy homes</strong>
              <small>★ 4.8 · 12k orders delivered</small>
            </div>
            {cartCount > 0 && (
              <span className="px-cart-nudge">{cartCount} in your basket 🧺</span>
            )}
          </div>
        </div>

        {/* ── Stage column ── */}
        <div
          className="px-stage"
          style={{ '--px': tilt.x.toFixed(3), '--py': tilt.y.toFixed(3) } as React.CSSProperties}
          aria-hidden="true"
        >
          <div className="px-orbit" />
          <div className="px-plate">
            {HERO_DISHES.map((src, i) => (
              <img key={src} src={src} alt="" loading={i === 0 ? 'eager' : 'lazy'} className={i === dish ? 'on' : ''} />
            ))}
            <span className="px-plate-shine" />
          </div>
          <div className="px-chip px-chip-a">
            <span className="px-chip-ico">🛵</span>
            <span><strong>28 min</strong><small>avg. delivery</small></span>
          </div>
          <div className="px-chip px-chip-b">
            <span className="px-chip-ico">🥬</span>
            <span><strong>Picked 6 AM</strong><small>mandi fresh today</small></span>
          </div>
          <div className="px-chip px-chip-c">
            <span className="px-chip-ico">🎟️</span>
            <span><strong>MEGA70</strong><small>₹70 off · tap to copy</small></span>
          </div>
          <div className="px-dots">
            {HERO_DISHES.map((_, i) => (
              <i key={i} className={i === dish ? 'on' : ''} />
            ))}
          </div>
        </div>
      </div>

      {/* ── Marquee ticker ── */}
      <div className="px-ticker" aria-hidden="true">
        <div className="px-ticker-track">
          {[...TICKER, ...TICKER].map((t, i) => (
            <span key={i} className="px-ticker-item">{t}<b>✦</b></span>
          ))}
        </div>
      </div>
    </section>
  );
}
