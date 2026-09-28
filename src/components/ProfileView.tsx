import React, { useState } from 'react';
import { useApp, playNotificationSound } from '../context/AppContext';
import { User, Award, MapPin, Power, LogIn, ChevronRight, Check, Heart, Shield } from 'lucide-react';

export default function ProfileView() {
  const { user, logout, toggleGoldClub, setShowLoginModal } = useApp();
  const [newAddressForm, setNewAddressForm] = useState(false);
  const [newLabel, setNewLabel] = useState<'Home' | 'Work' | 'Other'>('Other');
  const [newAddressLine, setNewAddressLine] = useState('');
  const [newCity, setNewCity] = useState('Bengaluru');

  const handleAddAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddressLine.trim() || !user) return;

    playNotificationSound('success');
    const newAddr = {
      id: `addr_${Date.now()}`,
      label: newLabel,
      addressLine: newAddressLine,
      city: newCity,
    };

    const updatedAddresses = [...user.savedAddresses, newAddr];
    // Update local context
    user.savedAddresses = updatedAddresses;
    localStorage.setItem('foodmela_user', JSON.stringify(user));
    setNewAddressLine('');
    setNewAddressForm(false);
  };

  const handleRemoveAddress = (id: string) => {
    if (!user) return;
    playNotificationSound('remove');
    const filtered = user.savedAddresses.filter((a) => a.id !== id);
    user.savedAddresses = filtered;
    localStorage.setItem('foodmela_user', JSON.stringify(user));
    // Trigger small component refresh by toggle state fake
    setNewAddressLine(' ');
    setTimeout(() => setNewAddressLine(''), 10);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Profile Header */}
      <div className="p-6 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-850 rounded-3xl shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
        {user ? (
          <div className="flex flex-col md:flex-row items-center gap-4 text-center md:text-left">
            <div className="w-20 h-20 rounded-2xl bg-orange-500 text-white flex items-center justify-center font-black text-3xl uppercase shadow-lg shadow-orange-500/10">
              {user.name ? user.name[0] : 'U'}
            </div>
            <div className="space-y-1">
              <div className="flex items-center justify-center md:justify-start gap-2">
                <h3 className="text-xl font-black text-slate-900 dark:text-white font-display">
                  {user.name || 'Gourmet Explorer'}
                </h3>
                {user.isGoldMember && (
                  <span className="px-2.5 py-0.5 rounded-full bg-gradient-to-r from-yellow-500 to-amber-500 text-white text-[9px] font-black uppercase tracking-wider shadow-sm flex items-center gap-1">
                    <Award className="w-3 h-3 fill-current" />
                    <span>Gold Member</span>
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 font-mono-numbers font-semibold">+91 {user.phone}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">{user.email || 'gourmet.lover@foodmela.online'}</p>
            </div>
          </div>
        ) : (
          <div className="flex-1 text-center py-6 space-y-4">
            <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
              <User className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h4 className="text-lg font-bold text-slate-900 dark:text-white font-display">Sign in to unlock Food Mela Gold</h4>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">Join the premium connoisseurs club, customize delivery routes, earn loyalty stars, and enjoy flat discounts!</p>
            </div>
            <button
              onClick={() => { playNotificationSound('click'); setShowLoginModal(true); }}
              className="px-6 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-1.5 mx-auto active:scale-95 transition-all"
            >
              <LogIn className="w-4 h-4" />
              <span>Login / Register Now</span>
            </button>
          </div>
        )}

        {user && (
          <button
            onClick={() => { playNotificationSound('remove'); logout(); }}
            className="px-4 py-2 bg-red-50 hover:bg-red-100 dark:bg-red-950/20 dark:hover:bg-red-950/40 text-red-600 dark:text-red-400 font-bold text-xs rounded-xl flex items-center gap-1.5 active:scale-95 transition-all self-center md:self-start"
          >
            <Power className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        )}
      </div>

      {user && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Mela Gold Club Membership Pass (Left 2 Columns) */}
          <div className="lg:col-span-2 space-y-6">
            
            <div className="p-6 bg-slate-900 dark:bg-slate-950 text-white rounded-3xl relative overflow-hidden shadow-xl border border-white/5 space-y-6">
              {/* Golden Background Light */}
              <div className="absolute right-0 bottom-0 top-0 w-1/2 opacity-10 pointer-events-none bg-[radial-gradient(circle_at_bottom_right,_var(--tw-gradient-stops))] from-amber-500 via-transparent to-transparent" />

              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2">
                  <Award className="w-6 h-6 text-yellow-300" />
                  <h4 className="text-sm font-black uppercase tracking-wider font-display">
                    Food Mela Gold Club
                  </h4>
                </div>
                <span className="text-[10px] bg-yellow-400 text-slate-950 px-2 py-0.5 rounded-full font-black uppercase">
                  Connoisseur Tier
                </span>
              </div>

              <div className="space-y-4 text-xs font-semibold text-slate-300">
                <p className="text-sm font-medium leading-relaxed text-white">
                  Gold Club members save an average of <strong className="text-yellow-400 font-mono-numbers text-sm">₹1,240</strong> monthly. Join today for exclusive access to hand-picked artisanal culinary events.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  {[
                    'Flat 15% OFF across all premium menu listings',
                    '₹0 Delivery Fee on every single order',
                    'Priority Kitchen Prep — skipped queue',
                    'Exclusive chef customizable platters',
                  ].map((benefit) => (
                    <div key={benefit} className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t border-white/10 pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">Membership Status</span>
                  <span className="text-sm font-black text-white">
                    {user.isGoldMember ? '🟢 Active member — saving 15% off menu prices!' : '🔴 Inactive member'}
                  </span>
                </div>

                <button
                  onClick={toggleGoldClub}
                  className={`py-3 px-5 rounded-xl font-extrabold text-xs transition-all active:scale-95 ${
                    user.isGoldMember 
                      ? 'bg-slate-800 hover:bg-slate-700 text-white' 
                      : 'bg-yellow-400 hover:bg-yellow-500 text-slate-950 shadow-md shadow-yellow-400/10'
                  }`}
                >
                  {user.isGoldMember ? 'Cancel Gold Pass' : 'Join Gold Club Pass'}
                </button>
              </div>
            </div>

            {/* Saved Addresses Manager section */}
            <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-850 shadow-sm space-y-6">
              <div className="flex items-center justify-between border-b border-slate-50 dark:border-slate-800/60 pb-2">
                <h4 className="text-sm font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                  Saved Address Locations
                </h4>
                <button
                  onClick={() => { playNotificationSound('click'); setNewAddressForm(!newAddressForm); }}
                  className="text-xs font-black text-orange-500 dark:text-orange-400 hover:underline"
                >
                  {newAddressForm ? 'Cancel Form' : '+ Add New'}
                </button>
              </div>

              {/* Add address form */}
              {newAddressForm && (
                <form onSubmit={handleAddAddress} className="p-4 bg-slate-50 dark:bg-slate-850 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Address Label</label>
                      <select
                        value={newLabel}
                        onChange={(e) => setNewLabel(e.target.value as any)}
                        className="w-full px-3 py-2 text-xs font-bold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-750 rounded-xl focus:outline-none"
                      >
                        <option value="Home">Home</option>
                        <option value="Work">Work</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">City</label>
                      <input
                        type="text"
                        value={newCity}
                        onChange={(e) => setNewCity(e.target.value)}
                        className="w-full px-3 py-2 text-xs font-bold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-750 rounded-xl focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Full Street Address</label>
                    <input
                      type="text"
                      placeholder="e.g. Apartment 101, block A, Saffron Garden"
                      value={newAddressLine}
                      onChange={(e) => setNewAddressLine(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-750 rounded-xl focus:outline-none focus:border-orange-500"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2 px-4 bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs rounded-xl shadow-md transition-all active:scale-95"
                  >
                    Save Address Location
                  </button>
                </form>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {user.savedAddresses.map((addr) => (
                  <div
                    key={addr.id}
                    className="p-4 rounded-2xl bg-slate-50/50 dark:bg-slate-800/20 border border-slate-100 dark:border-slate-850/60 relative flex flex-col justify-between"
                  >
                    <div className="space-y-1.5">
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-[9px] font-black uppercase text-slate-500 dark:text-slate-400 tracking-wider inline-block">
                        {addr.label}
                      </span>
                      <p className="text-xs font-bold text-slate-800 dark:text-slate-200 leading-relaxed">
                        {addr.addressLine}
                      </p>
                      <span className="block text-[10px] text-slate-400 font-medium">{addr.city}</span>
                    </div>

                    <button
                      onClick={() => handleRemoveAddress(addr.id)}
                      className="mt-3 text-[10px] font-black text-red-500 hover:underline uppercase text-left shrink-0"
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Quick Stats sidebar (Right 1 Column) */}
          <div className="space-y-4">
            <div className="p-5 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-850 shadow-sm space-y-4">
              <h4 className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest border-b border-slate-50 dark:border-slate-800/60 pb-2">
                Connoisseur Summary
              </h4>

              <div className="space-y-3">
                {[
                  { label: 'Gourmet Level', value: 'Silver Foodie', icon: <Heart className="w-4 h-4 text-rose-500" /> },
                  { label: 'Saved Addresses', value: user.savedAddresses.length, icon: <MapPin className="w-4 h-4 text-orange-500" /> },
                  { label: 'Account Security', value: 'OTP Secure', icon: <Shield className="w-4 h-4 text-emerald-500" /> },
                ].map((stat) => (
                  <div key={stat.label} className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50/50 dark:bg-slate-800/40 border border-slate-100/60 dark:border-slate-850/40 text-xs font-bold">
                    <div className="flex items-center gap-2">
                      {stat.icon}
                      <span className="text-slate-400 font-medium">{stat.label}</span>
                    </div>
                    <span className="text-slate-850 dark:text-white font-mono-numbers">{stat.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
