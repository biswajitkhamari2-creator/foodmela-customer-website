import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MOODS,
  STOREFRONTS,
  PROMO_OFFERS,
  FOOD_MENU_CATS,
  readSeen,
} from '../data/catalog';
import { useShop } from '../store';
import { useDeliveryLocation } from '../components/location-context';
import FoodCard from '../components/FoodCard';
import FestBanner from '../components/FestBanner';
import OfferCard from '../components/OfferCard';
import PremiumHero from '../components/PremiumHero';

const GROCERY_CATS = new Set(['vegetables', 'fruits', 'grocery', 'dairy', 'eggs_meat']);

const BENEFITS = [
  { emoji: '⚡', bg: '#FFF4D6', title: 'Fast Delivery', text: 'Hot & fresh at your door in minutes' },
  { emoji: '🛡️', bg: '#E7F6EC', title: 'Safe & Secure', text: 'Trusted payments, every single order' },
  { emoji: '🥬', bg: '#E7F6EC', title: 'Fresh & Quality', text: 'Picked daily, quality-checked' },
  { emoji: '💰', bg: '#FFF4D6', title: 'Great Prices', text: 'Local rates, honest bills' },
  { emoji: '❤️', bg: '#FDECEA', title: 'Support Local', text: 'Every order helps your community' },
];

export default function Home() {
  const { allItems, customs, priceOf, mrpOf, user, favs } = useShop();
  const { city } = useDeliveryLocation();
  const nav = useNavigate();

  // ── Discovery rails — all computed from REAL catalog + live prices ──
  // Prepared-food menu items are excluded from every display rail (frontend only).
  const menuItems = useMemo(
    () => allItems.filter((c) => !FOOD_MENU_CATS.has(c.category)),
    [allItems],
  );
  const popular = useMemo(
    () => [...menuItems].sort((a, b) => b.rating - a.rating).slice(0, 10),
    [menuItems],
  );
  const bestValue = useMemo(
    () =>
      menuItems
        .map((c) => {
          const mrp = mrpOf(c);
          const price = priceOf(c);
          const off = mrp ? Math.round(((mrp - price) / mrp) * 100) : 0;
          return { c, off };
        })
        .filter((x) => x.off > 0)
        .sort((a, b) => b.off - a.off || b.c.rating - a.c.rating)
        .slice(0, 8)
        .map((x) => x.c),
    [menuItems, priceOf, mrpOf],
  );
  const freshToday = useMemo(
    () => menuItems.filter((c) => GROCERY_CATS.has(c.category)).sort((a, b) => b.rating - a.rating).slice(0, 8),
    [menuItems],
  );
  const freshAdded = useMemo(
    () => {
      const visibleCustoms = customs.filter((c) => !FOOD_MENU_CATS.has(c.category));
      return (visibleCustoms.length > 0 ? visibleCustoms : [...menuItems].sort((a, b) => b.rating - a.rating)).slice(0, 8);
    },
    [menuItems, customs],
  );
  // Hidden gems = rated well but not top-10 (real data, second tier).
  const hiddenGems = useMemo(
    () => [...menuItems].sort((a, b) => b.rating - a.rating).slice(10, 18),
    [menuItems],
  );
  const favItems = useMemo(
    () => menuItems.filter((c) => favs.has(c.id)),
    [menuItems, favs],
  );
  const becauseYouOrdered = useMemo(() => {
    const seen = readSeen();
    if (seen.length === 0) return [];
    const seenCats = new Set(
      seen
        .map((id) => menuItems.find((c) => c.id === id)?.category)
        .filter((c): c is string => Boolean(c)),
    );
    return menuItems
      .filter((c) => seenCats.has(c.category) && !seen.includes(c.id))
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 8);
  }, [menuItems]);
  const moodCounts = useMemo(() => {
    const m = new Map<string, number>();
    for (const mood of MOODS) {
      m.set(mood.key, allItems.filter((c) => mood.cats.includes(c.category)).length);
    }
    return m;
  }, [allItems]);

  return (
    <div className="page-enter">
      <PremiumHero />
      <FestBanner />

      {user ? (
        <>
          {/* ── MEGA OFFERS & HOT DISCOUNTS ── */}
          <div className="section" style={{ paddingBottom: 10 }}>
            <div className="section-head">
              <div>
                <span className="px-section-kicker">✦ Handpicked for you</span>
                <h2>🔥 Today&apos;s Hot <span className="accent-chili">Discounts &amp; Deals</span></h2>
                <p>Tap any coupon to copy &amp; save big on your order</p>
              </div>
              <span className="link-more" onClick={() => nav('/offers')}>All Offers (50% OFF) →</span>
            </div>
            <div className="ticket-grid" role="list">
              {PROMO_OFFERS.slice(0, 3).map((o) => (
                <OfferCard key={o.code} offer={o} />
              ))}
            </div>
          </div>

          {/* ── WHAT'S YOUR MOOD? ── */}
          <div className="section">
            <div className="section-head">
              <div>
                <span className="px-section-kicker">✦ Cravings, decoded</span>
                <h2>What&apos;s your <span className="accent">mood?</span></h2>
                <p>Six cravings, one neighbourhood — pick yours</p>
              </div>
              <span className="link-more" onClick={() => nav('/grocery')}>View all →</span>
            </div>
            <div className="mood-grid" role="list">
              {MOODS.map((m, i) => (
                <button
                  key={m.key}
                  role="listitem"
                  className={`mood-card mood-${i} reveal reveal-${Math.min(i, 4)}`}
                  onClick={() => nav(`/grocery?mood=${m.key}`)}
                  aria-label={`${m.title} — ${moodCounts.get(m.key) ?? 0} dishes`}
                >
                  <span className="m-count">{moodCounts.get(m.key) ?? 0} dishes</span>
                  <span className="m-emoji" aria-hidden="true">{m.emoji}</span>
                  <strong>{m.title}</strong>
                  <small>{m.blurb}</small>
                </button>
              ))}
            </div>
          </div>

          {/* ── MADE AROUND YOU ── */}
          <div className="section">
            <div className="local-band">
              <h2>Made <span className="accent">around you</span></h2>
              <p>Nearby kitchens &amp; stores in {city} — live menus, community favourites, honest prices.</p>
              <div className="local-scroll" role="list">
                {STOREFRONTS.map((s) => {
                  const items = allItems.filter((c) => c.category === s.key);
                  const top = items.reduce((m, c) => Math.max(m, c.rating), 0);
                  return (
                    <div key={s.key} role="listitem" className="local-card" onClick={() => nav(`/grocery?cat=${s.key}`)} tabIndex={0}
                      onKeyDown={(e) => { if (e.key === 'Enter') nav(`/grocery?cat=${s.key}`); }}
                      aria-label={`${s.name} — order now`}>
                      <img src={s.image} alt={s.name} loading="lazy" />
                      <div className="lc-body">
                        <h3>{s.name}</h3>
                        <p>{s.cuisine}</p>
                        <div className="lc-meta">
                          <span className="rate">★ {top > 0 ? top.toFixed(1) : '4.5'}</span>
                          <span className="eta">🛵 {s.eta}</span>
                          <span className="eta">{items.length} items</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* ── POPULAR RIGHT NOW ── */}
          <div className="section">
            <div className="section-head">
              <div>
                <span className="px-section-kicker">✦ Neighbourhood favourites</span>
                <h2>Popular <span className="accent">right now</span></h2>
                <p>Top-rated dishes people around you love</p>
              </div>
              <span className="link-more" onClick={() => nav('/grocery')}>View all →</span>
            </div>
            <div className="h-scroll">
              {popular.map((item) => (
                <FoodCard key={item.id} item={item} />
              ))}
            </div>
          </div>

          {/* ── BEST VALUE TODAY ── */}
          {bestValue.length > 0 && (
            <div className="section">
              <div className="section-head">
                <div>
                  <h2>Best value <span className="accent-chili">today</span></h2>
                  <p>Biggest live discounts, updated by the store</p>
                </div>
                <span className="link-more" onClick={() => nav('/offers')}>All offers →</span>
              </div>
              <div className="h-scroll">
                {bestValue.map((item) => (
                  <FoodCard key={item.id} item={item} />
                ))}
              </div>
            </div>
          )}

          {/* ── FRESH FOR YOUR HOME ── */}
          <div className="section" id="grocery">
            <div className="section-head">
              <div>
                <span className="px-section-kicker">✦ Mandi fresh, 6 AM</span>
                <h2>Fresh for <span className="accent">your home</span></h2>
                <p>Vegetables, fruits, dairy &amp; staples — one mela, everything fresh</p>
              </div>
              <span className="link-more" onClick={() => nav('/grocery')}>Open grocery →</span>
            </div>
            <div className="h-scroll">
              {freshToday.map((item) => (
                <FoodCard key={item.id} item={item} />
              ))}
            </div>
          </div>



          {/* ── FRESHLY ADDED ── */}
          <div className="section">
            <div className="section-head">
              <div>
                <h2>Freshly <span className="accent">added</span></h2>
                <p>{customs.length > 0 ? 'Just added by your local stores' : 'New to the mela this week'}</p>
              </div>
            </div>
            <div className="h-scroll">
              {freshAdded.map((item) => (
                <FoodCard key={item.id} item={item} />
              ))}
            </div>
          </div>

          {/* ── HIDDEN LOCAL GEMS ── */}
          {hiddenGems.length > 0 && (
            <div className="section">
              <div className="section-head">
                <div>
                  <h2>Hidden local <span className="accent">gems</span></h2>
                  <p>Quiet favourites worth discovering</p>
                </div>
              </div>
              <div className="h-scroll">
                {hiddenGems.map((item) => (
                  <FoodCard key={item.id} item={item} />
                ))}
              </div>
            </div>
          )}

          {/* ── YOUR MELa FAVOURITES ── */}
          {favItems.length > 0 && (
            <div className="section">
              <div className="section-head">
                <div>
                  <h2>Your <span className="accent-chili">favourites</span></h2>
                  <p>Your saved collection, one tap away</p>
                </div>
                <span className="link-more" onClick={() => nav('/profile')}>Manage →</span>
              </div>
              <div className="h-scroll">
                {favItems.map((item) => (
                  <FoodCard key={item.id} item={item} />
                ))}
              </div>
            </div>
          )}

          {/* ── BECAUSE YOU ORDERED ── */}
          {becauseYouOrdered.length > 0 && (
            <div className="section">
              <div className="section-head">
                <div>
                  <h2>Because you <span className="accent">ordered…</span></h2>
                  <p>More from the stores you love</p>
                </div>
              </div>
              <div className="h-scroll">
                {becauseYouOrdered.map((item) => (
                  <FoodCard key={item.id} item={item} />
                ))}
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="section" id="menu">
          <div className="menu-lock-card">
            <span className="lock-badge">🔒 Members Only Menu</span>
            <h2>Log in to enter the <span className="accent">mela</span></h2>
            <p>Sign in with your mobile number to explore fresh dishes, live prices, and order online in Birmaharajpur.</p>
            <button className="btn-primary" onClick={() => nav('/login')}>
              Login with Phone to View Menu →
            </button>
          </div>
        </div>
      )}

      {/* ── WHY FOODMELA ── */}
      <div className="section">
        <div className="section-head">
          <div>
            <h2>Why order with <span className="accent">FoodMela?</span></h2>
          </div>
        </div>
        <div className="benefit-grid">
          {BENEFITS.map((b) => (
            <div key={b.title} className="benefit-card">
              <div className="b-ico" style={{ background: b.bg }} aria-hidden="true">{b.emoji}</div>
              <strong>{b.title}</strong>
              <small>{b.text}</small>
            </div>
          ))}
        </div>
      </div>

      {/* ── FOODMELA APP & WEBSITE SYNC BAND ── */}
      <div className="section" id="app">
        <div className="app-band" style={{ background: 'linear-gradient(135deg, #094723 0%, #0e9f4e 100%)', color: '#ffffff', padding: '24px', borderRadius: '20px', boxShadow: '0 10px 30px rgba(14, 159, 78, 0.25)' }}>
          <div>
            <span style={{ background: '#ffc531', color: '#451a03', fontSize: '11px', fontWeight: 900, padding: '4px 10px', borderRadius: '999px', textTransform: 'uppercase', letterSpacing: '0.6px', display: 'inline-block', marginBottom: '8px' }}>
              ⚡ 100% REAL-TIME SYNCED
            </span>
            <h2 style={{ color: '#ffffff', margin: '6px 0 10px', fontSize: '24px', fontWeight: 900 }}>
              FoodMela App &amp; Website are 100% Synced! 📱🌐
            </h2>
            <p style={{ color: '#e2f5e8', fontSize: '14px', lineHeight: '1.5', marginBottom: '16px' }}>
              Order on website or app — live tracking, rider assignments, items, and your account sync instantly across all devices.
            </p>
            <div className="store-row" style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <button
                className="store-btn"
                onClick={() => nav('/apk')}
                style={{ background: '#ffffff', color: '#094723', border: 'none', fontWeight: 800, padding: '12px 18px', borderRadius: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                <span className="s-ico" style={{ fontSize: '20px' }}>📱</span>
                <span style={{ textAlign: 'left' }}>
                  <small style={{ display: 'block', fontSize: '10px', textTransform: 'uppercase', opacity: 0.8 }}>Customer App</small>
                  <strong style={{ fontSize: '14px' }}>Download FoodMela APK</strong>
                </span>
              </button>
              <button
                className="store-btn"
                onClick={() => nav('/rider-apk')}
                style={{ background: 'rgba(255,255,255,0.15)', color: '#ffffff', border: '1.5px solid rgba(255,255,255,0.4)', fontWeight: 800, padding: '12px 18px', borderRadius: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                <span className="s-ico" style={{ fontSize: '20px' }}>🚴‍♂️</span>
                <span style={{ textAlign: 'left' }}>
                  <small style={{ display: 'block', fontSize: '10px', textTransform: 'uppercase', color: '#ffc531' }}>Delivery Partner</small>
                  <strong style={{ fontSize: '14px' }}>Download Rider App</strong>
                </span>
              </button>
            </div>
            <div className="qr-hint" style={{ marginTop: '12px', fontSize: '12px', color: '#d1fae5' }}>
              ✓ Same phone number login &nbsp;|&nbsp; Live order status on website &amp; app
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
