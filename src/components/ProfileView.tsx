import React, { useState } from 'react';
import { useApp, playNotificationSound } from '../context/AppContext';
import { 
  User, Award, MapPin, Power, LogIn, ChevronRight, Check, Heart, Shield, 
  Receipt, Clock, PackageCheck, RotateCcw, Compass, Phone, Sparkles, AlertCircle,
  Edit3, X, Loader2, Save
} from 'lucide-react';

export default function ProfileView() {
  const { user, logout, toggleGoldClub, setShowLoginModal, pastOrders, reorder, setActiveTab, activeOrder, updateProfile } = useApp();
  const [profileTab, setProfileTab] = useState<'orders' | 'profile' | 'gold'>('orders');
  const [selectedInvoiceId, setSelectedInvoiceId] = useState<string | null>(null);

  // Edit Profile Modal State
  const [showEditModal, setShowEditModal] = useState(false);
  const [editName, setEditName] = useState('');
  const [editAddress, setEditAddress] = useState('');
  const [savingProfile, setSavingProfile] = useState(false);
  const [editErr, setEditErr] = useState('');

  if (!user) {
    return (
      <div className="max-w-lg mx-auto py-12 px-6 text-center space-y-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl">
        <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
          <User className="w-8 h-8" />
        </div>
        <div className="space-y-1">
          <h4 className="text-xl font-bold text-slate-900 dark:text-white font-display">Sign in to View Profile &amp; Order History</h4>
          <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
            Access your past orders, delivery receipts, live status, saved addresses, and Food Mela Gold discounts.
          </p>
        </div>
        <button
          onClick={() => { playNotificationSound('click'); setShowLoginModal(true); }}
          className="px-8 py-3.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-black text-xs uppercase tracking-wider rounded-2xl shadow-lg shadow-orange-500/20 flex items-center justify-center gap-2 mx-auto active:scale-95 transition-all"
        >
          <LogIn className="w-4 h-4" />
          <span>Login / Register Now</span>
        </button>
      </div>
    );
  }

  const selectedOrderForBill = pastOrders.find((o) => o.id === selectedInvoiceId) || (activeOrder?.id === selectedInvoiceId ? activeOrder : null);

  const handleOpenEditModal = () => {
    setEditName(user.name || '');
    setEditAddress(user.address || '');
    setEditErr('');
    setShowEditModal(true);
    playNotificationSound('click');
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editName.trim()) {
      setEditErr('Please enter your full name.');
      return;
    }
    setSavingProfile(true);
    setEditErr('');
    try {
      const ok = await updateProfile(editName.trim(), editAddress.trim());
      if (ok) {
        setShowEditModal(false);
      } else {
        setEditErr('Failed to update profile. Please try again.');
      }
    } catch {
      setEditErr('Error connecting to server.');
    } finally {
      setSavingProfile(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Profile Header */}
      <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex flex-col md:flex-row items-center gap-4 text-center md:text-left">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-orange-500 to-amber-500 text-white flex items-center justify-center font-black text-3xl uppercase shadow-lg shadow-orange-500/20">
            {user.name ? user.name[0] : 'F'}
          </div>
          <div className="space-y-1">
            <div className="flex items-center justify-center md:justify-start gap-2">
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white font-display">
                {user.name || 'Food Mela Customer'}
              </h3>
              {user.isGoldMember && (
                <span className="px-2.5 py-0.5 rounded-full bg-gradient-to-r from-yellow-500 to-amber-500 text-white text-[9px] font-black uppercase tracking-wider shadow-sm flex items-center gap-1">
                  <Award className="w-3 h-3 fill-current" />
                  <span>Gold Member</span>
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-mono-numbers font-bold">
              📱 +91 {user.phone}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium flex items-center justify-center md:justify-start gap-1">
              <MapPin className="w-3.5 h-3.5 text-orange-500 shrink-0" />
              <span>{user.address || 'Birmaharajpur, Subarnapur, Odisha - 767018'}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-center md:self-start">
          <button
            onClick={handleOpenEditModal}
            className="px-4 py-2 bg-orange-50 hover:bg-orange-100 dark:bg-orange-950/30 dark:hover:bg-orange-950/50 text-orange-600 dark:text-orange-400 font-bold text-xs rounded-xl flex items-center gap-1.5 active:scale-95 transition-all border border-orange-200 dark:border-orange-900/40 shadow-sm"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Edit Profile</span>
          </button>

          <button
            onClick={() => { playNotificationSound('remove'); logout(); }}
            className="px-4 py-2 bg-red-50 hover:bg-red-100 dark:bg-red-950/30 dark:hover:bg-red-950/50 text-red-600 dark:text-red-400 font-bold text-xs rounded-xl flex items-center gap-1.5 active:scale-95 transition-all border border-red-200 dark:border-red-900/40"
          >
            <Power className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Navigation Sub-Tabs in Profile */}
      <div className="flex items-center gap-2 p-1.5 bg-slate-100 dark:bg-slate-850 rounded-2xl max-w-md">
        <button
          onClick={() => { playNotificationSound('click'); setProfileTab('orders'); }}
          className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
            profileTab === 'orders'
              ? 'bg-white dark:bg-slate-900 text-orange-600 dark:text-orange-400 shadow-sm'
              : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Receipt className="w-4 h-4" />
          <span>Order History ({pastOrders.length})</span>
        </button>

        <button
          onClick={() => { playNotificationSound('click'); setProfileTab('profile'); }}
          className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
            profileTab === 'profile'
              ? 'bg-white dark:bg-slate-900 text-orange-600 dark:text-orange-400 shadow-sm'
              : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <User className="w-4 h-4" />
          <span>Account &amp; Address</span>
        </button>

        <button
          onClick={() => { playNotificationSound('click'); setProfileTab('gold'); }}
          className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
            profileTab === 'gold'
              ? 'bg-white dark:bg-slate-900 text-yellow-600 dark:text-yellow-400 shadow-sm'
              : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>Gold Pass</span>
        </button>
      </div>

      {/* ================= TAB 1: ORDER HISTORY ================= */}
      {profileTab === 'orders' && (
        <div className="space-y-4">
          {pastOrders.length === 0 ? (
            <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 space-y-3">
              <PackageCheck className="w-12 h-12 text-slate-300 mx-auto" />
              <h5 className="font-bold text-slate-700 dark:text-slate-300">No Orders Placed Yet</h5>
              <p className="text-xs text-slate-400 max-w-xs mx-auto">
                Orders placed from either the website or the Food Mela mobile app will appear here instantly with full live tax receipts.
              </p>
              <button
                onClick={() => { playNotificationSound('click'); setActiveTab('home'); }}
                className="px-6 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs rounded-xl shadow-md transition-all active:scale-95"
              >
                Browse Fresh Catalog
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {pastOrders.map((order) => {
                const cleanDigits = order.id.replace(/[^0-9]/g, '');
                const invNumber = `INV-${cleanDigits || order.id}`;

                return (
                  <div
                    key={order.id}
                    className="p-5 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl shadow-sm hover:shadow-md transition-all space-y-4 flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-black text-slate-900 dark:text-white font-mono-numbers">
                              {order.id}
                            </span>
                            <span className="text-[10px] font-bold text-slate-400 font-mono-numbers">
                              ({invNumber})
                            </span>
                          </div>
                          <span className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                            <Clock className="w-3 h-3" />
                            <span>{order.createdAt}</span>
                          </span>
                        </div>

                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                          order.status === 'delivered'
                            ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400'
                            : 'bg-orange-50 text-orange-600 dark:bg-orange-950/40 dark:text-orange-400'
                        }`}>
                          {order.status}
                        </span>
                      </div>

                      <div className="space-y-1.5">
                        {order.items.map((it, idx) => (
                          <div key={idx} className="flex justify-between text-xs text-slate-600 dark:text-slate-300">
                            <span className="line-clamp-1">{it.quantity}x {it.item.name}</span>
                            <span className="font-semibold font-mono-numbers shrink-0 ml-2">₹{it.itemTotal || it.item.price * it.quantity}</span>
                          </div>
                        ))}
                      </div>

                      <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-400">Total Paid</span>
                        <span className="text-sm font-black text-orange-600 dark:text-orange-400 font-mono-numbers">
                          ₹{order.totalAmount}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-2">
                      <button
                        onClick={() => { playNotificationSound('click'); setSelectedInvoiceId(order.id); }}
                        className="flex-1 py-2 px-3 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all flex items-center justify-center gap-1.5"
                      >
                        <Receipt className="w-3.5 h-3.5 text-orange-500" />
                        <span>View Bill</span>
                      </button>

                      <button
                        onClick={() => { playNotificationSound('click'); reorder(order); }}
                        className="flex-1 py-2 px-3 rounded-xl bg-orange-500 hover:bg-orange-600 text-xs font-black text-white transition-all flex items-center justify-center gap-1.5 shadow-sm shadow-orange-500/20 active:scale-95"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Re-Order</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ================= TAB 2: ACCOUNT & ADDRESS ================= */}
      {profileTab === 'profile' && (
        <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-lg font-black text-slate-900 dark:text-white font-display">
                Profile &amp; Delivery Details
              </h4>
              <p className="text-xs text-slate-400">
                Your profile is synchronized in real-time between the Food Mela mobile app, backend &amp; website.
              </p>
            </div>
            <button
              onClick={handleOpenEditModal}
              className="px-4 py-2 bg-orange-50 hover:bg-orange-100 dark:bg-orange-950/30 text-orange-600 dark:text-orange-400 font-bold text-xs rounded-xl flex items-center gap-1.5 border border-orange-200 dark:border-orange-900/40 transition-all"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit Details</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200/60 dark:border-slate-750 space-y-1.5">
              <div className="flex items-center gap-2 text-xs font-bold text-orange-600 dark:text-orange-400">
                <User className="w-4 h-4" />
                <span>Customer Full Name</span>
              </div>
              <p className="text-base font-bold text-slate-900 dark:text-white">
                {user.name || 'Food Mela Customer'}
              </p>
              <p className="text-[11px] text-slate-400">
                Matches your registered account across the mobile app.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200/60 dark:border-slate-750 space-y-1.5">
              <div className="flex items-center gap-2 text-xs font-bold text-orange-600 dark:text-orange-400">
                <MapPin className="w-4 h-4" />
                <span>Primary Delivery Address</span>
              </div>
              <p className="text-sm font-semibold text-slate-900 dark:text-white">
                {user.address || 'Birmaharajpur, Subarnapur, Odisha - 767018'}
              </p>
              <p className="text-[11px] text-slate-400">
                Default delivery location for instant orders across Birmaharajpur.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-orange-500/5 dark:bg-orange-500/10 border border-orange-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-0.5">
              <span className="text-[10px] font-black uppercase tracking-wider text-orange-600 dark:text-orange-400">
                Customer Support &amp; Help Desk
              </span>
              <p className="text-xs font-bold text-slate-900 dark:text-white">
                Helpline: +91 8144503650 (7:00 AM – 10:30 PM)
              </p>
            </div>
            <a
              href="tel:8144503650"
              className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs rounded-xl shadow flex items-center justify-center gap-1.5"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Call Helpline</span>
            </a>
          </div>
        </div>
      )}

      {/* ================= TAB 3: GOLD PASS ================= */}
      {profileTab === 'gold' && (
        <div className="p-8 rounded-3xl bg-gradient-to-br from-amber-500 via-orange-500 to-yellow-600 text-white shadow-xl space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <Award className="w-6 h-6 text-white" />
              </div>
              <div>
                <h4 className="text-xl font-black font-display tracking-tight">Food Mela Gold Club</h4>
                <p className="text-xs text-white/80">Exclusive VIP Benefits &amp; Free Express Delivery</p>
              </div>
            </div>
            <span className="px-3 py-1 bg-white/20 rounded-full text-xs font-black uppercase tracking-wider">
              {user.isGoldMember ? 'ACTIVE' : 'INACTIVE'}
            </span>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-yellow-400/20 text-yellow-300">
                <Check className="w-4 h-4" />
              </div>
              <p className="text-xs font-semibold">Free Delivery on all orders above ₹299</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-yellow-400/20 text-yellow-300">
                <Check className="w-4 h-4" />
              </div>
              <p className="text-xs font-semibold">Flat 10% Gold Discount on groceries &amp; sweets</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-yellow-400/20 text-yellow-300">
                <Check className="w-4 h-4" />
              </div>
              <p className="text-xs font-semibold">Priority Rider Dispatch &amp; Live Tracking</p>
            </div>
          </div>
        </div>
      )}

      {/* ================= EDIT PROFILE MODAL ================= */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div 
            className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 max-w-md w-full border border-slate-200 dark:border-slate-800 shadow-2xl space-y-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <h4 className="text-lg font-black text-slate-900 dark:text-white font-display">
                  Edit Profile Details
                </h4>
                <p className="text-xs text-slate-400">
                  Instantly syncs with the Food Mela mobile app &amp; orders.
                </p>
              </div>
              <button
                onClick={() => setShowEditModal(false)}
                className="p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-900 dark:hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {editErr && (
              <div className="p-3 text-xs font-semibold text-red-600 bg-red-50 dark:bg-red-950/30 rounded-xl flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{editErr}</span>
              </div>
            )}

            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Customer Full Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="Enter your full name"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full px-4 py-3 text-sm font-bold bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl focus:outline-none focus:border-orange-500 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Primary Delivery Address
                </label>
                <textarea
                  rows={2}
                  required
                  placeholder="Enter your delivery address in Birmaharajpur"
                  value={editAddress}
                  onChange={(e) => setEditAddress(e.target.value)}
                  className="w-full px-4 py-3 text-xs font-semibold bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl focus:outline-none focus:border-orange-500 text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  disabled={savingProfile}
                  className="flex-1 py-3 px-4 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 font-bold text-xs rounded-xl text-slate-700 dark:text-slate-300 transition-all"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={savingProfile || !editName.trim()}
                  className="flex-1 py-3 px-4 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-orange-500/20 active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                  {savingProfile ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Saving…</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>Save Changes</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= INVOICE / BILL MODAL ================= */}
      {selectedOrderForBill && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 max-w-md w-full border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <Receipt className="w-5 h-5 text-orange-500" />
                  <h4 className="text-base font-black text-slate-900 dark:text-white font-display">
                    Official Tax Invoice
                  </h4>
                </div>
                <div className="flex items-center gap-2 font-mono-numbers text-xs">
                  <span className="font-black text-slate-900 dark:text-white">
                    INV-{selectedOrderForBill.id.replace(/[^0-9]/g, '') || selectedOrderForBill.id}
                  </span>
                  <span className="text-slate-400 font-medium">({selectedOrderForBill.id})</span>
                </div>
              </div>
              <button
                onClick={() => setSelectedInvoiceId(null)}
                className="p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-900 dark:hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl space-y-1">
                <p className="text-slate-500">Customer: <strong className="text-slate-900 dark:text-white">{user.name}</strong> (+91 {user.phone})</p>
                <p className="text-slate-500">Delivery Address: <span className="text-slate-700 dark:text-slate-300">{selectedOrderForBill.deliveryAddress || user.address}</span></p>
                <p className="text-slate-500">Status: <strong className="text-emerald-600">{selectedOrderForBill.status}</strong></p>
                <p className="text-slate-500">Payment Mode: <strong className="text-slate-900 dark:text-white">{selectedOrderForBill.paymentMethod}</strong></p>
              </div>

              <div className="space-y-1.5 pt-2">
                <span className="font-bold uppercase text-[10px] text-slate-400">Items:</span>
                {selectedOrderForBill.items.map((ci, idx) => (
                  <div key={idx} className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                    <span>{ci.quantity}x {ci.item.name}</span>
                    <span className="font-bold font-mono-numbers">₹{ci.itemTotal || ci.item.price * ci.quantity}</span>
                  </div>
                ))}
              </div>

              <div className="pt-2 flex justify-between text-sm font-black border-t border-slate-200 dark:border-slate-700">
                <span>Total Amount</span>
                <span className="text-orange-600 dark:text-orange-400 font-mono-numbers">₹{selectedOrderForBill.totalAmount}</span>
              </div>
            </div>

            <button
              onClick={() => setSelectedInvoiceId(null)}
              className="w-full py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs rounded-xl shadow"
            >
              Close Invoice
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
