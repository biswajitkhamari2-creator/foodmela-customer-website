import { useEffect, useRef, useState } from 'react';
import { MapPin, Search, Loader2, Bell, BellRing, MapPinOff } from 'lucide-react';
import { searchPlaces, notifyServiceability, PlaceSuggestion } from '../api/apiClient';
import { useApp } from '../context/AppContext';

/**
 * Picks the delivery location and shows the server-priced charge for it.
 *
 * A typed address has no coordinates, and the backend sizes the delivery fee
 * from coordinates — so an address the customer only typed cannot be priced.
 * This asks the backend for real places and stores the lat/lng of the one they
 * choose, which is what makes distance-based charging work on the web.
 */
export default function DeliveryLocationPicker() {
  const {
    deliveryCoords,
    setDeliveryCoords,
    deliveryQuote,
    deliveryQuoteLoading,
    deliveryOutOfZone,
    user,
  } = useApp();

  const [notifying, setNotifying] = useState(false);
  const [notifyRequested, setNotifyRequested] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<PlaceSuggestion[]>([]);
  const [searching, setSearching] = useState(false);
  const [open, setOpen] = useState(false);
  const debounce = useRef<number | null>(null);

  useEffect(() => {
    if (debounce.current) window.clearTimeout(debounce.current);
    const q = query.trim();
    if (q.length < 3) {
      setResults([]);
      setOpen(false);
      setSearching(false);
      return;
    }
    setSearching(true);
    debounce.current = window.setTimeout(async () => {
      const found = await searchPlaces(q);
      setResults(found);
      setOpen(true);
      setSearching(false);
    }, 300);
    return () => {
      if (debounce.current) window.clearTimeout(debounce.current);
    };
  }, [query]);

  const pick = (p: PlaceSuggestion) => {
    setDeliveryCoords({
      lat: p.lat,
      lng: p.lng,
      label: p.secondary ? `${p.primary}, ${p.secondary}` : p.primary,
    });
    setQuery('');
    setResults([]);
    setOpen(false);
  };

  const sendNotifyMe = async () => {
    if (notifying || notifyRequested || !deliveryCoords) return;
    const phone = user?.phone || '';
    if (phone.replace(/[^0-9]/g, '').length < 10) {
      alert('Please log in first so we can notify you.');
      return;
    }
    setNotifying(true);
    const ok = await notifyServiceability(
      phone,
      deliveryCoords.lat,
      deliveryCoords.lng,
      deliveryCoords.label,
      deliveryQuote?.km,
    );
    setNotifying(false);
    setNotifyRequested(ok);
    if (!ok) alert('Could not save your request — please try again.');
  };

  return (
    <div className="space-y-2">
      {deliveryCoords ? (
        <div className="flex items-start gap-2 p-2.5 rounded-xl bg-orange-50/60 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-900/40">
          <MapPin className="w-3.5 h-3.5 text-orange-600 mt-0.5 shrink-0" />
          <div className="min-w-0 flex-1">
            <p className="text-[11px] font-bold text-slate-900 dark:text-white leading-snug">
              {deliveryCoords.label}
            </p>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
              {deliveryQuoteLoading
                ? 'Calculating delivery charge…'
                : deliveryQuote
                  ? `${deliveryQuote.km.toFixed(1)} km by road` +
                    (deliveryQuote.surgeLabel ? ` • ${deliveryQuote.surgeLabel}` : '')
                  : 'Charge unavailable — check your connection'}
            </p>
          </div>
          <button
            onClick={() => setDeliveryCoords(null)}
            className="text-[10px] font-bold uppercase tracking-wider text-orange-600 hover:text-orange-700 shrink-0"
          >
            Change
          </button>
        </div>
      ) : (
        <p className="text-[10px] text-amber-600 dark:text-amber-500 font-semibold">
          Set your delivery location to see the delivery charge.
        </p>
      )}

      {deliveryOutOfZone && deliveryQuote && (
        <div className="rounded-2xl border border-red-100 dark:border-red-900/40 bg-white dark:bg-slate-900 p-4 text-center space-y-2.5">
          <div className="mx-auto w-12 h-12 rounded-full bg-red-50 dark:bg-red-950/40 flex items-center justify-center relative">
            <MapPinOff className="w-5 h-5 text-red-600" />
          </div>
          <p className="text-[13px] font-extrabold text-slate-900 dark:text-white">
            Your Location is Not Serviceable
          </p>
          <p className="text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">
            We're currently not delivering to your area, but we'll update you once we start serving
            your location.
          </p>
          <p className="text-[10px] font-semibold text-slate-400">
            This location is {deliveryQuote.km.toFixed(1)} km from the kitchen — we deliver within{' '}
            {deliveryQuote.maxDeliveryKm} km.
          </p>
          {notifyRequested ? (
            <div className="flex items-start gap-2 rounded-xl bg-pink-50 dark:bg-pink-950/30 px-3 py-2.5 text-left">
              <BellRing className="w-3.5 h-3.5 text-pink-600 mt-0.5 shrink-0" />
              <p className="text-[10.5px] font-semibold text-pink-800 dark:text-pink-300">
                We'll let you know as soon as FoodMela starts delivering to your area!
              </p>
            </div>
          ) : (
            <button
              onClick={sendNotifyMe}
              disabled={notifying}
              className="w-full py-2.5 rounded-xl bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2"
            >
              {notifying ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Bell className="w-3.5 h-3.5" />}
              {notifying ? 'Saving…' : 'Notify Me'}
            </button>
          )}
        </div>
      )}

      <div className="relative">
        <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search village, landmark or PIN…"
          className="w-full pl-9 pr-9 py-2.5 text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:border-orange-500 text-slate-900 dark:text-white"
        />
        {searching && (
          <Loader2 className="w-3.5 h-3.5 text-orange-500 animate-spin absolute right-3 top-1/2 -translate-y-1/2" />
        )}
      </div>

      {open && (
        <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 overflow-hidden max-h-56 overflow-y-auto">
          {results.length === 0 ? (
            <p className="p-3 text-[10px] text-slate-500 dark:text-slate-400">
              No match — try a nearby landmark or a different spelling.
            </p>
          ) : (
            results.map((p) => (
              <button
                key={p.placeId || `${p.lat},${p.lng}`}
                onClick={() => pick(p)}
                className="w-full text-left px-3 py-2.5 hover:bg-orange-50 dark:hover:bg-orange-950/30 border-b border-slate-100 dark:border-slate-700 last:border-0"
              >
                <p className="text-[11px] font-bold text-slate-900 dark:text-white">{p.primary}</p>
                {p.secondary && (
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 line-clamp-2">
                    {p.secondary}
                  </p>
                )}
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}
