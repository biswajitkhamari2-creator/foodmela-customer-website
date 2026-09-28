import React, { useState } from 'react';
import { useApp, playNotificationSound } from '../context/AppContext';
import {
  Phone,
  CheckCircle2,
  Navigation,
  MapPin,
  Receipt,
  Clock,
  Sparkles,
  ShoppingBag,
  RotateCcw,
  ArrowRight,
  ChevronRight,
  Package,
  Calendar,
  CreditCard,
  Download,
  Share2,
} from 'lucide-react';
import { Order } from '../types';

export default function LiveTracker() {
  const { activeOrder, pastOrders, reorder, currentLocation, setActiveTab, user, setShowLoginModal } = useApp();
  const [trackerMode, setTrackerMode] = useState<'live' | 'history'>(activeOrder ? 'live' : 'history');
  const [showInvoiceId, setShowInvoiceId] = useState<string | null>(null);

  // Stepper Configurations
  const steps = [
    { key: 'placed', label: 'Order Placed', desc: 'Awaiting kitchen confirmation' },
    { key: 'preparing', label: 'In the Kitchen', desc: 'Chefs are preparing your premium feast' },
    { key: 'rider_assigned', label: 'Rider Appointed', desc: 'Rider is picking up the parcel' },
    { key: 'out_for_delivery', label: 'Out for Delivery', desc: 'Rider is speeding towards your location' },
    { key: 'delivered', label: 'Delivered', desc: 'Enjoy your warm gourmet meal!' },
  ];

  const getStepIndex = (status: string) => {
    return steps.findIndex((s) => s.key === status);
  };

  const activeIndex = activeOrder ? getStepIndex(activeOrder.status) : -1;

  // Invoice Download simulation modal
  const viewInvoiceOrder = pastOrders.find((o) => o.id === showInvoiceId) || (activeOrder?.id === showInvoiceId ? activeOrder : null);

  const triggerCallRider = () => {
    playNotificationSound('success');
    alert('Connecting call to Food Mela Rider (+91 98765 43210) via secure VoIP...');
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-5xl mx-auto">
      
      {/* ================= TOP TABS SWITCHER ================= */}
      <div className="flex items-center justify-between bg-white dark:bg-slate-900 p-2 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-2">
          {activeOrder && (
            <button
              onClick={() => { playNotificationSound('click'); setTrackerMode('live'); }}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                trackerMode === 'live'
                  ? 'bg-orange-500 text-white shadow-md shadow-orange-500/20'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
              <span>Active Order Live Tracker</span>
            </button>
          )}

          <button
            onClick={() => { playNotificationSound('click'); setTrackerMode('history'); }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              trackerMode === 'history' || !activeOrder
                ? 'bg-slate-900 dark:bg-emerald-600 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Package className="w-3.5 h-3.5" />
            <span>Past Orders & History ({pastOrders.length})</span>
          </button>
        </div>

        <span className="text-[11px] font-semibold text-slate-400 hidden sm:inline-block">
          {user ? `Account: +91 ${user.phone}` : 'Synced with Backend'}
        </span>
      </div>

      {/* ================= MODE 1: ACTIVE LIVE TRACKER ================= */}
      {trackerMode === 'live' && activeOrder && (
        <div className="space-y-6">
          <div className="p-6 bg-gradient-to-r from-orange-500/10 via-yellow-500/5 to-emerald-500/10 border border-orange-500/10 rounded-3xl relative overflow-hidden">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-orange-500 text-white font-black text-[9px] uppercase tracking-wider animate-pulse">
                  Live Tracking Active
                </span>
                <h3 className="text-xl font-black text-slate-900 dark:text-white font-display tracking-tight mt-1">
                  Order ID: {activeOrder.id}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold font-mono-numbers">
                  Placed at {new Date(activeOrder.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} · ₹{activeOrder.totalAmount}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => { playNotificationSound('click'); setShowInvoiceId(activeOrder.id); }}
                  className="px-4 py-2 bg-white dark:bg-slate-800 hover:bg-slate-50 border border-slate-200 dark:border-slate-750 text-slate-700 dark:text-slate-300 font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-sm active:scale-95 transition-all"
                >
                  <Receipt className="w-3.5 h-3.5 text-orange-500" />
                  <span>View Bill</span>
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Stepper Card */}
            <div className="lg:col-span-2 space-y-6">
              <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-850 shadow-sm space-y-6">
                <h4 className="text-sm font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest border-b border-slate-50 dark:border-slate-800/60 pb-2">
                  Delivery Status Progression
                </h4>

                <div className="relative pl-8 space-y-6 border-l border-slate-100 dark:border-slate-800 ml-4.5">
                  {steps.map((step, idx) => {
                    const isCompleted = idx < activeIndex;
                    const isCurrent = idx === activeIndex;

                    return (
                      <div key={step.key} className="relative">
                        <div className={`absolute -left-[45px] top-0.5 w-7 h-7 rounded-full flex items-center justify-center text-xs font-black border transition-all ${
                          isCompleted 
                            ? 'bg-emerald-500 border-transparent text-white shadow-md shadow-emerald-500/10'
                            : isCurrent
                              ? 'bg-orange-500 border-transparent text-white animate-pulse shadow-md shadow-orange-500/10'
                              : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-400'
                        }`}>
                          {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                        </div>

                        <div className="space-y-0.5">
                          <h5 className={`text-sm font-extrabold ${isCurrent ? 'text-orange-600 dark:text-orange-400' : isCompleted ? 'text-slate-900 dark:text-white' : 'text-slate-400'}`}>
                            {step.label}
                          </h5>
                          <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">
                            {step.desc}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Ordered Items Pill */}
              <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-850 space-y-3">
                <h5 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Items in this shipment ({activeOrder.items.reduce((s, i) => s + i.quantity, 0)} items)</h5>
                <div className="space-y-3 divide-y divide-slate-100 dark:divide-slate-800/60">
                  {activeOrder.items.map((ci) => (
                    <div key={ci.id} className="pt-2.5 first:pt-0 flex items-start justify-between gap-3 text-xs">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className={`w-3.5 h-3.5 rounded flex items-center justify-center border shrink-0 ${
                            ci.item.isVeg ? 'border-emerald-600 text-emerald-600' : 'border-rose-600 text-rose-600'
                          }`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${ci.item.isVeg ? 'bg-emerald-600' : 'bg-rose-600'}`} />
                          </span>
                          <span className="font-extrabold text-slate-900 dark:text-white text-sm leading-snug">
                            {ci.item.name}
                          </span>
                        </div>

                        <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-400 font-medium pl-5.5">
                          {ci.item.category && (
                            <span className="bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md text-slate-600 dark:text-slate-300 font-semibold">
                              {ci.item.category}
                            </span>
                          )}
                          {ci.item.unit && (
                            <span className="text-slate-500 dark:text-slate-400">
                              Portion: {ci.item.unit}
                            </span>
                          )}
                          <span className="text-orange-500 font-bold font-mono-numbers">
                            Qty: {ci.quantity} × ₹{ci.item.price}
                          </span>
                        </div>

                        {ci.selectedCustomizations && ci.selectedCustomizations.length > 0 && (
                          <div className="pl-5.5 text-[10px] text-slate-400 flex flex-wrap gap-1">
                            {ci.selectedCustomizations.map((c, idx) => (
                              <span key={idx} className="bg-orange-50 dark:bg-orange-950/30 text-orange-600 dark:text-orange-400 px-1.5 py-0.5 rounded border border-orange-200/50">
                                {c.choiceName} (+₹{c.price})
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      <span className="font-mono-numbers font-black text-sm text-slate-900 dark:text-white shrink-0">
                        ₹{(ci.item.price + (ci.selectedCustomizations?.reduce((a, b) => a + b.price, 0) || 0)) * ci.quantity}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Live GPS Map Simulation Card */}
            <div className="space-y-6">
              <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-850 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Live Route Map</h4>
                  <span className="text-[10px] bg-emerald-500/10 text-emerald-600 px-2 py-0.5 rounded-full font-bold">
                    GPS Active
                  </span>
                </div>

                <div className="relative h-64 bg-slate-100 dark:bg-slate-950/80 rounded-2xl border border-slate-100 dark:border-slate-850 overflow-hidden">
                  <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.03)_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:20px_20px]" />
                  
                  {/* Kitchen Pin */}
                  <div className="absolute top-[80%] left-[15%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                    <div className="p-2 bg-orange-100 dark:bg-orange-950/40 border border-orange-500 rounded-xl shadow-md text-orange-600">
                      <MapPin className="w-4 h-4 fill-current" />
                    </div>
                    <span className="text-[8px] font-black text-slate-500 dark:text-slate-400 mt-1 uppercase bg-white dark:bg-slate-900 px-1 py-0.5 rounded">Kitchen</span>
                  </div>

                  {/* Destination Pin */}
                  <div className="absolute top-[20%] left-[80%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                    <div className="p-2 bg-emerald-100 dark:bg-emerald-950/40 border border-emerald-500 rounded-xl shadow-md text-emerald-600">
                      <MapPin className="w-4 h-4 fill-current" />
                    </div>
                    <span className="text-[8px] font-black text-slate-500 dark:text-slate-400 mt-1 uppercase bg-white dark:bg-slate-900 px-1 py-0.5 rounded truncate max-w-[80px]">
                      {currentLocation.split(',')[0]}
                    </span>
                  </div>

                  {/* Rider Icon */}
                  {activeOrder.rider && (
                    <div 
                      className="absolute p-2 bg-slate-900 dark:bg-emerald-600 text-white rounded-full shadow-xl transition-all duration-1000 flex items-center justify-center"
                      style={{
                        top: `${(activeOrder.rider.lat * 100).toFixed(0)}%`,
                        left: `${(activeOrder.rider.lng * 100).toFixed(0)}%`,
                        transform: 'translate(-50%, -50%)',
                      }}
                    >
                      <Navigation className="w-4 h-4 fill-current rotate-45 animate-pulse text-yellow-300" />
                    </div>
                  )}

                  <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-45">
                    <line x1="15%" y1="80%" x2="80%" y2="20%" stroke="#f97316" strokeWidth="2.5" strokeDasharray="5,5" />
                  </svg>
                </div>

                {/* Rider Info Card */}
                {activeOrder.rider && (
                  <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-2xl flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-orange-500 text-white flex items-center justify-center font-bold text-sm">
                        {activeOrder.rider.name[0]}
                      </div>
                      <div>
                        <h5 className="text-xs font-bold text-slate-900 dark:text-white">{activeOrder.rider.name}</h5>
                        <p className="text-[10px] text-slate-400 font-mono-numbers">Delivery OTP: <span className="font-bold text-emerald-600">{activeOrder.rider.pin}</span></p>
                      </div>
                    </div>
                    <button
                      onClick={triggerCallRider}
                      className="p-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl shadow-md transition-transform active:scale-95"
                    >
                      <Phone className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODE 2: PAST ORDERS & ORDER HISTORY ================= */}
      {(trackerMode === 'history' || !activeOrder) && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-850 pb-4">
            <div>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white font-display tracking-tight flex items-center gap-2">
                <span>Order History & Past Orders</span>
                <span className="text-xs bg-orange-500/10 text-orange-600 dark:text-orange-400 px-2.5 py-0.5 rounded-full font-bold">
                  {pastOrders.length} Orders
                </span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                View itemized tax invoices, full product details, portion sizes, and reorder favourite feasts with 1-click.
              </p>
            </div>

            {!user && (
              <button
                onClick={() => setShowLoginModal(true)}
                className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold rounded-xl shadow-sm self-start sm:self-auto"
              >
                Sign in to Sync Account Orders
              </button>
            )}
          </div>

          {pastOrders.length === 0 ? (
            <div className="py-20 text-center flex flex-col items-center justify-center space-y-4 bg-white dark:bg-slate-900/50 border border-dashed border-slate-200 dark:border-slate-800 rounded-3xl p-8">
              <span className="text-6xl select-none">📦</span>
              <div className="space-y-1.5 text-center">
                <h4 className="text-lg font-bold text-slate-900 dark:text-white font-display">No past orders found</h4>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  When you place an order from the Food Mela festive menu or 15-min grocery hub, complete invoice details and order history will show here.
                </p>
              </div>
              <button
                onClick={() => { playNotificationSound('click'); setActiveTab('home'); }}
                className="px-6 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs rounded-xl shadow-md transition-all active:scale-95 flex items-center gap-2"
              >
                <span>Explore Festive Menu</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {pastOrders.map((order) => {
                const orderDate = new Date(order.createdAt);
                return (
                  <div
                    key={order.id}
                    className="p-5 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 hover:border-orange-500/30 dark:hover:border-orange-500/30 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4"
                  >
                    <div className="space-y-4">
                      {/* Top Row: ID, Date & Status */}
                      <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800/70">
                        <div className="flex items-center gap-2">
                          <span className="font-mono-numbers text-xs font-black text-slate-900 dark:text-white uppercase tracking-tight bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-lg">
                            #{order.id}
                          </span>
                          <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
                            <Calendar className="w-3 h-3 text-slate-400" />
                            {orderDate.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
                          </span>
                        </div>
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>{order.status === 'delivered' ? 'Delivered' : order.status}</span>
                        </span>
                      </div>

                      {/* Prominent Items Listing with Full Names & Details */}
                      <div className="space-y-3">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                          Ordered Items ({order.items.reduce((s, i) => s + i.quantity, 0)})
                        </span>
                        
                        <div className="space-y-2.5">
                          {order.items.map((ci) => (
                            <div 
                              key={ci.id} 
                              className="p-3 bg-slate-50/70 dark:bg-slate-850/50 rounded-2xl border border-slate-100 dark:border-slate-800/80 flex items-start justify-between gap-3"
                            >
                              <div className="space-y-1">
                                <div className="flex items-start gap-2">
                                  <span className={`w-3.5 h-3.5 rounded flex items-center justify-center border shrink-0 mt-0.5 ${
                                    ci.item?.isVeg ? 'border-emerald-600 text-emerald-600' : 'border-rose-600 text-rose-600'
                                  }`}>
                                    <span className={`w-1.5 h-1.5 rounded-full ${ci.item?.isVeg ? 'bg-emerald-600' : 'bg-rose-600'}`} />
                                  </span>
                                  <div>
                                    <h4 className="font-extrabold text-xs sm:text-sm text-slate-900 dark:text-white leading-snug">
                                      {ci.item?.name || 'Food Mela Special Item'}
                                    </h4>
                                    
                                    <div className="flex flex-wrap items-center gap-2 mt-1 text-[11px] text-slate-500 dark:text-slate-400">
                                      {ci.item?.category && (
                                        <span className="bg-slate-200/70 dark:bg-slate-750 px-1.5 py-0.5 rounded text-[10px] font-semibold text-slate-700 dark:text-slate-300">
                                          {ci.item.category}
                                        </span>
                                      )}
                                      {ci.item?.unit && (
                                        <span className="text-[11px] text-slate-400">
                                          {ci.item.unit}
                                        </span>
                                      )}
                                      <span className="text-orange-600 dark:text-orange-400 font-bold font-mono-numbers">
                                        Qty: {ci.quantity} × ₹{ci.item?.price || 0}
                                      </span>
                                    </div>

                                    {ci.selectedCustomizations && ci.selectedCustomizations.length > 0 && (
                                      <div className="mt-1 flex flex-wrap gap-1">
                                        {ci.selectedCustomizations.map((c, idx) => (
                                          <span key={idx} className="text-[9px] bg-orange-100/60 dark:bg-orange-950/40 text-orange-700 dark:text-orange-300 px-1.5 py-0.5 rounded">
                                            {c.choiceName} (+₹{c.price})
                                          </span>
                                        ))}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>

                              <span className="font-mono-numbers font-black text-sm text-slate-900 dark:text-white shrink-0">
                                ₹{((ci.item?.price || 0) + (ci.selectedCustomizations?.reduce((a, b) => a + b.price, 0) || 0)) * ci.quantity}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Delivery Address & Payment Summary */}
                      <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex flex-col gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                        <div className="flex items-center justify-between">
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-orange-500 shrink-0" />
                            <span className="truncate max-w-[200px]">{order.deliveryAddress || 'Indiranagar, Bengaluru'}</span>
                          </span>
                          <span className="font-semibold text-slate-600 dark:text-slate-300">
                            {order.paymentMethod || 'Paid Online'}
                          </span>
                        </div>
                        <div className="flex items-center justify-between font-bold pt-1 border-t border-slate-50 dark:border-slate-850">
                          <span className="text-slate-400">Total Amount Paid</span>
                          <span className="font-mono-numbers font-black text-base text-emerald-600 dark:text-emerald-400">
                            ₹{order.totalAmount}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons: Invoice & 1-Click Reorder */}
                    <div className="flex gap-2.5 border-t border-slate-100 dark:border-slate-800 pt-3">
                      <button
                        onClick={() => { playNotificationSound('click'); setShowInvoiceId(order.id); }}
                        className="flex-1 py-2.5 px-3 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800/60 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 active:scale-95 transition-all border border-slate-200/60 dark:border-slate-750"
                      >
                        <Receipt className="w-3.5 h-3.5 text-orange-500" />
                        <span>View Invoice</span>
                      </button>

                      <button
                        onClick={() => { playNotificationSound('success'); reorder(order); }}
                        className="flex-1 py-2.5 px-3 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-extrabold text-xs rounded-xl flex items-center justify-center gap-1.5 active:scale-95 transition-all shadow-md shadow-orange-500/10"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Reorder</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ================= INVOICE DETAILED MODAL ================= */}
      {showInvoiceId && viewInvoiceOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-sm animate-fade-in">
          <div 
            className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl overflow-hidden shadow-2xl border border-slate-100 dark:border-slate-800 p-6 flex flex-col space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Invoice Top Header */}
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <span className="text-[10px] uppercase font-bold text-orange-500 tracking-wider">Official Tax Invoice</span>
                <h4 className="text-base font-black text-slate-900 dark:text-white font-mono-numbers">
                  Order #{viewInvoiceOrder.id}
                </h4>
              </div>
              <button 
                onClick={() => setShowInvoiceId(null)}
                className="text-xs font-bold text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 uppercase"
              >
                Close
              </button>
            </div>

            {/* Delivery Info */}
            <div className="text-xs space-y-1 text-slate-600 dark:text-slate-400 font-medium bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl">
              <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Delivery Destination</span>
              <p className="font-bold text-slate-800 dark:text-slate-200">
                {viewInvoiceOrder.deliveryAddress || 'Indiranagar, Bengaluru'}
              </p>
              <p className="text-[11px] text-slate-500">
                Date: {new Date(viewInvoiceOrder.createdAt).toLocaleString()} · Mode: {viewInvoiceOrder.paymentMethod || 'Online'}
              </p>
            </div>

            {/* Itemized Summary */}
            <div className="border-t border-b border-slate-100 dark:border-slate-800 py-3 space-y-2 text-xs max-h-60 overflow-y-auto pr-1">
              <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Itemized Summary</span>
              
              {viewInvoiceOrder.items.map((ci) => {
                const customPrice = ci.selectedCustomizations?.reduce((acc, c) => acc + c.price, 0) || 0;
                const itemTotal = ((ci.item?.price || 0) + customPrice) * ci.quantity;

                return (
                  <div key={ci.id} className="flex justify-between items-start text-slate-700 dark:text-slate-300 gap-3 py-1">
                    <div className="space-y-0.5">
                      <span className="font-bold text-slate-900 dark:text-white leading-snug block">{ci.item?.name}</span>
                      <span className="text-[11px] text-slate-400 block font-mono-numbers">
                        Qty: {ci.quantity} × ₹{ci.item?.price || 0} {ci.item?.unit ? `(${ci.item.unit})` : ''}
                      </span>
                      {ci.selectedCustomizations && ci.selectedCustomizations.length > 0 && (
                        <span className="block text-[9px] text-orange-500 font-medium">
                          {ci.selectedCustomizations.map((c) => c.choiceName).join(', ')}
                        </span>
                      )}
                    </div>
                    <span className="font-mono-numbers text-slate-900 dark:text-white font-bold shrink-0">₹{itemTotal}</span>
                  </div>
                );
              })}

              <div className="border-t border-slate-100 dark:border-slate-800 pt-2 space-y-1 text-slate-500 dark:text-slate-400">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-mono-numbers">₹{viewInvoiceOrder.itemTotal || viewInvoiceOrder.totalAmount}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Fee</span>
                  <span className="font-mono-numbers">{viewInvoiceOrder.deliveryFee === 0 ? 'FREE' : `₹${viewInvoiceOrder.deliveryFee}`}</span>
                </div>
                {viewInvoiceOrder.discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-600">
                    <span>Discount Savings</span>
                    <span className="font-mono-numbers">-₹{viewInvoiceOrder.discountAmount}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Taxes & GST (5%)</span>
                  <span className="font-mono-numbers">₹{viewInvoiceOrder.taxes || 0}</span>
                </div>
                <div className="flex justify-between font-black text-sm text-slate-900 dark:text-white pt-1 border-t border-slate-100 dark:border-slate-800">
                  <span>Grand Total</span>
                  <span className="font-mono-numbers text-orange-500">₹{viewInvoiceOrder.totalAmount}</span>
                </div>
              </div>
            </div>

            {/* Download / Print button */}
            <button
              onClick={() => {
                playNotificationSound('success');
                window.print();
              }}
              className="w-full py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs rounded-xl shadow-md flex items-center justify-center gap-2 active:scale-95 transition-all"
            >
              <Download className="w-4 h-4" />
              <span>Print / Download Tax Receipt</span>
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
