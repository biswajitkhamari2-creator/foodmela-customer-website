import React, { useState } from 'react';
import { useApp, playNotificationSound } from '../context/AppContext';
import { 
  User, Award, MapPin, Power, LogIn, ChevronRight, Check, Heart, Shield, 
  Receipt, Clock, PackageCheck, RotateCcw, Compass, Phone, Sparkles, AlertCircle 
} from 'lucide-react';

export default function ProfileView() {
  const { user, logout, toggleGoldClub, setShowLoginModal, pastOrders, reorder, setActiveTab, activeOrder } = useApp();
  const [profileTab, setProfileTab] = useState<'orders' | 'profile' | 'gold'>('orders');
  const [selectedInvoiceId, setSelectedInvoiceId] = useState<string | null>(null);

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

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Profile Header */}
      <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex flex-col md:flex-row items-center gap-4 text-center md:text-left">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-orange-500 to-amber-500 text-white flex items-center justify-center font-black text-3xl uppercase shadow-lg shadow-orange-500/20">
            {user.name ? user.name[0] : 'U'}
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

        <button
          onClick={() => { playNotificationSound('remove'); logout(); }}
          className="px-4 py-2 bg-red-50 hover:bg-red-100 dark:bg-red-950/30 dark:hover:bg-red-950/50 text-red-600 dark:text-red-400 font-bold text-xs rounded-xl flex items-center gap-1.5 active:scale-95 transition-all self-center md:self-start border border-red-200 dark:border-red-900/40"
        >
          <Power className="w-3.5 h-3.5" />
          <span>Sign Out</span>
        </button>
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
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
            <div>
              <h4 className="text-lg font-black text-slate-900 dark:text-white font-display uppercase tracking-tight">
                My Past Orders &amp; Receipts
              </h4>
              <p className="text-xs text-slate-400">
                Detailed history of all items ordered across Birmaharajpur
              </p>
            </div>
            {activeOrder && (
              <button
                onClick={() => { playNotificationSound('click'); setActiveTab('orders'); }}
                className="px-3.5 py-1.5 bg-orange-500 text-white font-bold text-xs rounded-xl shadow flex items-center gap-1.5 animate-pulse"
              >
                <Compass className="w-3.5 h-3.5" />
                <span>Live Active Order</span>
              </button>
            )}
          </div>

          {pastOrders.length === 0 ? (
            <div className="p-12 text-center space-y-4 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800">
              <span className="text-5xl select-none">🧾</span>
              <div className="space-y-1">
                <h4 className="text-base font-bold text-slate-900 dark:text-white">No Orders Placed Yet</h4>
                <p className="text-xs text-slate-400 max-w-xs mx-auto">
                  Explore fresh vegetables, fruits, and daily essentials and place your first order!
                </p>
              </div>
              <button
                onClick={() => { playNotificationSound('click'); setActiveTab('home'); }}
                className="px-6 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs rounded-xl shadow-md transition-all"
              >
                Start Shopping
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {pastOrders.map((order) => (
                <div
                  key={order.id}
                  className="p-5 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4 hover:border-orange-500/40 transition-all"
                >
                  {/* Order Top Bar */}
                  <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                    <div>
                      <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">
                        Order ID
                      </span>
                      <h5 className="text-sm font-black text-slate-900 dark:text-white font-display">
                        {order.id}
                      </h5>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2.5 py-1 rounded-xl text-[10px] font-bold uppercase tracking-wider ${
                        order.status === 'delivered'
                          ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/40'
                          : 'bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800/40'
                      }`}>
                        {order.status === 'delivered' ? '✓ Delivered' : '🛵 In Progress'}
                      </span>
                      {order.otp && (
                        <span className="px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-[10px] font-mono-numbers font-bold text-slate-600 dark:text-slate-300">
                          OTP: {order.otp}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Items List Breakdown */}
                  <div className="space-y-2">
                    <span className="text-[11px] font-black uppercase tracking-wider text-slate-400">
                      Ordered Items:
                    </span>
                    <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                      {order.items.map((ci, idx) => (
                        <div key={idx} className="flex items-center justify-between text-xs py-1 border-b border-slate-50 dark:border-slate-850">
                          <div className="flex items-center gap-2">
                            <span className="w-5 h-5 rounded-md bg-orange-500/10 text-orange-600 dark:text-orange-400 font-bold flex items-center justify-center text-[10px]">
                              {ci.quantity}x
                            </span>
                            <span className="font-semibold text-slate-800 dark:text-slate-200">
                              {ci.item.name}
                            </span>
                          </div>
                          <span className="font-bold text-slate-900 dark:text-white font-mono-numbers">
                            ₹{ci.itemTotal || ci.item.price * ci.quantity}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Total & Action Buttons */}
                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-400 block font-medium">Total Bill Paid</span>
                      <span className="text-base font-black text-slate-900 dark:text-white font-mono-numbers">
                        ₹{order.totalAmount}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          playNotificationSound('click');
                          setSelectedInvoiceId(order.id);
                        }}
                        className="px-3 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-200 font-bold text-xs rounded-xl flex items-center gap-1 transition-all"
                      >
                        <Receipt className="w-3.5 h-3.5 text-orange-500" />
                        <span>Bill</span>
                      </button>

                      <button
                        onClick={() => {
                          playNotificationSound('success');
                          reorder(order);
                        }}
                        className="px-3.5 py-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-black text-xs rounded-xl shadow-md flex items-center gap-1.5 active:scale-95 transition-all"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Re-Order</span>
                      </button>
                    </div>
                  </div>

                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ================= TAB 2: ACCOUNT & ADDRESS ================= */}
      {profileTab === 'profile' && (
        <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl shadow-sm space-y-6">
          <div>
            <h4 className="text-lg font-black text-slate-900 dark:text-white font-display">
              Saved Delivery Details
            </h4>
            <p className="text-xs text-slate-400">
              Your registered address is synchronized with the Food Mela backend &amp; mobile app.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200/60 dark:border-slate-750 space-y-2">
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

          <div className="p-4 rounded-2xl bg-orange-500/5 dark:bg-orange-500/10 border border-orange-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-0.5">
              <span className="text-[10px] font-black uppercase tracking-wider text-orange-600 dark:text-orange-400">
                Help &amp; Grievance Support Desk
              </span>
              <p className="text-xs font-bold text-slate-900 dark:text-white">
                Officer: Jitendriya Amat (+91 8144503650)
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
        <div className="p-6 bg-slate-900 dark:bg-slate-950 text-white rounded-3xl relative overflow-hidden shadow-xl border border-white/5 space-y-6">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div className="flex items-center gap-2">
              <Award className="w-6 h-6 text-yellow-300" />
              <h4 className="text-sm font-black uppercase tracking-wider font-display">
                Food Mela Gold VIP Pass
              </h4>
            </div>
            <span className="text-[10px] bg-yellow-400 text-slate-950 px-2.5 py-0.5 rounded-full font-black uppercase">
              Active Member
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

      {/* Invoice / Bill Modal */}
      {selectedOrderForBill && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 max-w-md w-full border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Receipt className="w-5 h-5 text-orange-500" />
                <h4 className="text-base font-black text-slate-900 dark:text-white font-display">
                  Tax Invoice - {selectedOrderForBill.id}
                </h4>
              </div>
              <button
                onClick={() => setSelectedInvoiceId(null)}
                className="p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-900 dark:hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl space-y-1">
                <p className="text-slate-500">Customer: <strong className="text-slate-900 dark:text-white">{user.name}</strong> (+91 {user.phone})</p>
                <p className="text-slate-500">Delivery Address: <span className="text-slate-700 dark:text-slate-300">{selectedOrderForBill.deliveryAddress || user.address}</span></p>
                <p className="text-slate-500">Status: <strong className="text-emerald-600">{selectedOrderForBill.status}</strong></p>
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
