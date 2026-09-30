import React, { useState, useMemo } from 'react';
import { useApp, playNotificationSound } from '../context/AppContext';
import { 
  Phone, CheckCircle2, Navigation, MapPin, Receipt, Clock, Sparkles, 
  RotateCcw, XCircle, PackageCheck, AlertCircle, ShoppingBag, ChevronRight,
  ShieldCheck, Bike, Flame
} from 'lucide-react';
import { Order } from '../types';

export default function LiveTracker() {
  const { activeOrder, pastOrders, reorder, currentLocation, setActiveTab } = useApp();
  const [trackerTab, setTrackerTab] = useState<'active' | 'cancelled' | 'past'>('active');
  const [showInvoiceId, setShowInvoiceId] = useState<string | null>(null);

  // Stepper Configurations for Active Orders
  const steps = [
    { key: 'placed', label: 'Order Placed', desc: 'Merchant acknowledged order' },
    { key: 'preparing', label: 'In the Kitchen', desc: 'Chefs are packing your fresh essentials' },
    { key: 'rider_assigned', label: 'Rider Appointed', desc: 'Delivery partner reached pickup hub' },
    { key: 'out_for_delivery', label: 'Out for Delivery', desc: 'Rider is speeding towards your doorstep' },
    { key: 'delivered', label: 'Delivered', desc: 'Handed over fresh & hot!' },
  ];

  const getStepIndex = (status: string) => {
    const s = String(status || '').toLowerCase();
    if (s.includes('deliver')) return 4;
    if (s.includes('out')) return 3;
    if (s.includes('rider') || s.includes('assign')) return 2;
    if (s.includes('kitchen') || s.includes('pack') || s.includes('confirm')) return 1;
    return 0;
  };

  // Classify all user orders into the 3 distinct tabs
  const { activeList, cancelledList, pastList } = useMemo(() => {
    const all = [...pastOrders];
    if (activeOrder && !all.some((o) => o.id === activeOrder.id)) {
      all.unshift(activeOrder);
    }

    const active: Order[] = [];
    const cancelled: Order[] = [];
    const past: Order[] = [];

    all.forEach((o) => {
      const st = String(o.status || '').toLowerCase();
      if (st.includes('cancel')) {
        cancelled.push(o);
      } else if (st.includes('deliver') || (o.stage !== undefined && (o as any).stage >= 3)) {
        past.push(o);
      } else {
        active.push(o);
      }
    });

    return { activeList: active, cancelledList: cancelled, pastList: past };
  }, [activeOrder, pastOrders]);

  const displayedActive = activeOrder || (activeList.length > 0 ? activeList[0] : null);
  const activeIndex = displayedActive ? getStepIndex(displayedActive.status) : 0;

  // Selected Order for Bill
  const viewInvoiceOrder = useMemo(() => {
    if (!showInvoiceId) return null;
    return [...pastOrders, ...(activeOrder ? [activeOrder] : [])].find((o) => o.id === showInvoiceId) || null;
  }, [showInvoiceId, pastOrders, activeOrder]);

  const triggerCallRider = (phone?: string, name?: string) => {
    playNotificationSound('success');
    window.location.href = `tel:${phone || '8144503650'}`;
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in max-w-full overflow-hidden">
      
      {/* ================= PREMIUM HEADER & TAB NAVIGATION ================= */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-4 sm:p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-xl bg-orange-500/10 text-orange-500 dark:bg-orange-500/20">
                <Flame className="w-4 h-4 fill-orange-500" />
              </span>
              <span className="text-[11px] font-black uppercase text-orange-600 dark:text-orange-400 tracking-wider">
                Live Dispatch &amp; History
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white font-display tracking-tight">
              Order Command Center
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-[11px] font-mono-numbers font-black text-slate-600 dark:text-slate-300">
              {pastOrders.length} total orders logged
            </span>
          </div>
        </div>

        {/* 3 Premium Section Tabs */}
        <div className="grid grid-cols-3 gap-1.5 sm:gap-2 p-1.5 bg-slate-100 dark:bg-slate-850 rounded-2xl max-w-xl">
          {[
            { id: 'active', label: 'Active Order', count: activeList.length, color: 'text-orange-600 dark:text-orange-400' },
            { id: 'cancelled', label: 'Cancelled', count: cancelledList.length, color: 'text-rose-600 dark:text-rose-400' },
            { id: 'past', label: 'Past Orders', count: pastList.length, color: 'text-emerald-600 dark:text-emerald-400' },
          ].map((tab) => {
            const isActive = trackerTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => { playNotificationSound('click'); setTrackerTab(tab.id as any); }}
                className={`py-2.5 sm:py-3 px-2 sm:px-4 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 whitespace-nowrap min-w-0 ${
                  isActive
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-md border border-slate-200/50 dark:border-slate-800'
                    : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                }`}
              >
                <span className="truncate">{tab.label}</span>
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono-numbers font-black ${
                  isActive ? 'bg-orange-500 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                }`}>
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ================= TAB 1: ACTIVE ORDER ================= */}
      {trackerTab === 'active' && (
        displayedActive ? (
          <div className="space-y-6">
            
            {/* Live Banner Card */}
            <div className="p-5 sm:p-7 bg-gradient-to-r from-orange-500/10 via-amber-500/5 to-emerald-500/10 border border-orange-500/20 rounded-3xl relative overflow-hidden shadow-sm">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 text-white font-black text-[10px] uppercase tracking-wider shadow-sm animate-pulse">
                      <Bike className="w-3.5 h-3.5" />
                      <span>Live Delivery Tracking</span>
                    </span>
                    <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-mono-numbers text-[10px] font-black uppercase">
                      Status: {displayedActive.status.replace(/_/g, ' ')}
                    </span>
                  </div>
                  
                  <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white font-display tracking-tight">
                    Order ID: <span className="font-mono-numbers text-orange-600 dark:text-orange-400">#{displayedActive.id}</span>
                  </h3>
                  
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold font-mono-numbers">
                    Placed at {new Date(displayedActive.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} · Total: ₹{displayedActive.totalAmount}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => { playNotificationSound('click'); setShowInvoiceId(displayedActive.id); }}
                    className="px-4 py-2.5 bg-white dark:bg-slate-800 hover:bg-slate-50 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-sm active:scale-95 transition-all"
                  >
                    <Receipt className="w-3.5 h-3.5 text-orange-500" />
                    <span>View Bill</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Stepper Status (Left 2 Columns on desktop) */}
              <div className="lg:col-span-2 space-y-6">
                
                {/* Stepper Card */}
                <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6">
                  <h4 className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center justify-between">
                    <span>Delivery Progression</span>
                    <span className="text-orange-500 font-bold text-[11px]">Birmaharajpur Express</span>
                  </h4>

                  <div className="relative pl-8 space-y-6 border-l-2 border-slate-100 dark:border-slate-800 ml-4">
                    {steps.map((step, idx) => {
                      const isCompleted = idx < activeIndex;
                      const isCurrent = idx === activeIndex;

                      return (
                        <div key={step.key} className="relative">
                          {/* Step Marker circle */}
                          <div className={`absolute -left-[42px] top-0.5 w-7 h-7 rounded-full flex items-center justify-center text-xs font-black border transition-all ${
                            isCompleted 
                              ? 'bg-emerald-500 border-transparent text-white shadow-md shadow-emerald-500/20'
                              : isCurrent
                                ? 'bg-orange-500 border-transparent text-white animate-pulse shadow-md shadow-orange-500/30 ring-4 ring-orange-500/20'
                                : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-400'
                          }`}>
                            {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                          </div>

                          <div className="space-y-0.5">
                            <h5 className={`text-sm font-black ${isCurrent ? 'text-orange-600 dark:text-orange-400' : isCompleted ? 'text-slate-900 dark:text-white' : 'text-slate-400'}`}>
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

                {/* Driver and Call Info details */}
                <div className="p-5 sm:p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-5">
                  <div className="flex items-center gap-4 text-center sm:text-left flex-col sm:flex-row w-full sm:w-auto">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-orange-500 to-amber-500 text-white font-black text-2xl flex items-center justify-center shrink-0 shadow-md shadow-orange-500/20">
                      🚴
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center justify-center sm:justify-start gap-1.5">
                        <span className="text-sm font-black text-slate-900 dark:text-white">
                          {displayedActive.rider?.name || 'Assigned Food Mela Rider'}
                        </span>
                        <span className="px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/40 text-[9px] font-black uppercase text-emerald-600 dark:text-emerald-400 tracking-wider">
                          Verified Partner
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 font-mono-numbers font-semibold uppercase">
                        Vehicle: {displayedActive.rider?.vehicleNumber || 'OD-17-EXPRESS'}
                      </p>
                      
                      {/* OTP display badge */}
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-orange-500/10 text-orange-600 dark:text-orange-400 text-xs font-bold mt-1">
                        <span>Delivery PIN:</span>
                        <strong className="font-mono-numbers text-sm tracking-widest text-slate-900 dark:text-white">
                          {displayedActive.otp || '7829'}
                        </strong>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => triggerCallRider(displayedActive.rider?.phone)}
                    className="w-full sm:w-auto py-3 px-6 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-md flex items-center justify-center gap-2 active:scale-95 transition-all shrink-0"
                  >
                    <Phone className="w-4 h-4" />
                    <span>Call Delivery Partner</span>
                  </button>
                </div>

                {/* Items in active order */}
                <div className="p-5 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3">
                  <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">
                    Items in This Parcel ({displayedActive.items.length})
                  </h4>
                  <div className="space-y-2">
                    {displayedActive.items.map((ci) => (
                      <div key={ci.id} className="flex items-center justify-between text-xs py-1 border-b border-slate-50 dark:border-slate-800/60 last:border-0">
                        <span className="font-bold text-slate-800 dark:text-slate-200">
                          {ci.quantity}x {ci.item.name}
                        </span>
                        <span className="font-mono-numbers font-black text-slate-900 dark:text-white">
                          ₹{ci.item.price * ci.quantity}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              {/* Vector Map Simulation (Right Column) */}
              <div className="space-y-4">
                <div className="p-5 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                      Live Delivery Route
                    </h4>
                    <span className="text-[10px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded-full font-bold">
                      GPS Active
                    </span>
                  </div>

                  {/* SVG Map Canvas */}
                  <div className="relative h-64 bg-slate-100 dark:bg-slate-950/80 rounded-2xl border border-slate-200/60 dark:border-slate-800 overflow-hidden">
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.03)_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:20px_20px]" />
                    
                    {/* Simulated streets */}
                    <div className="absolute top-1/3 left-0 right-0 h-1 bg-white/60 dark:bg-slate-800/60" />
                    <div className="absolute top-2/3 left-0 right-0 h-1 bg-white/60 dark:bg-slate-800/60" />
                    <div className="absolute top-0 bottom-0 left-1/3 w-1 bg-white/60 dark:bg-slate-800/60" />
                    <div className="absolute top-0 bottom-0 left-2/3 w-1 bg-white/60 dark:bg-slate-800/60" />

                    {/* Kitchen Location */}
                    <div className="absolute top-[75%] left-[20%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                      <div className="p-2 bg-orange-100 dark:bg-orange-950 border border-orange-500 rounded-xl shadow-md text-orange-600">
                        <MapPin className="w-4 h-4 fill-current" />
                      </div>
                      <span className="text-[9px] font-black text-slate-600 dark:text-slate-300 mt-1 uppercase bg-white dark:bg-slate-900 px-1 rounded shadow">Hub</span>
                    </div>

                    {/* Destination Home */}
                    <div className="absolute top-[25%] left-[80%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                      <div className="p-2 bg-emerald-100 dark:bg-emerald-950 border border-emerald-500 rounded-xl shadow-md text-emerald-600">
                        <MapPin className="w-4 h-4 fill-current" />
                      </div>
                      <span className="text-[9px] font-black text-slate-600 dark:text-slate-300 mt-1 uppercase bg-white dark:bg-slate-900 px-1 rounded shadow truncate max-w-[80px]">
                        Doorstep
                      </span>
                    </div>

                    {/* Moving Rider Marker */}
                    <div 
                      className="absolute p-2 bg-orange-500 text-white rounded-full shadow-lg transition-all duration-1000 flex items-center justify-center animate-bounce"
                      style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}
                    >
                      <Navigation className="w-4 h-4 fill-current rotate-45 text-white" />
                    </div>

                    {/* Connector line */}
                    <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-40">
                      <line x1="20%" y1="75%" x2="80%" y2="25%" stroke="#f97316" strokeWidth="3" strokeDasharray="6,6" />
                    </svg>
                  </div>

                  <div className="flex items-center gap-2.5 text-xs text-slate-500 dark:text-slate-400 font-medium bg-slate-50 dark:bg-slate-950/60 p-3.5 rounded-xl border border-slate-100 dark:border-slate-800">
                    <Clock className="w-4 h-4 text-orange-500 shrink-0" />
                    <span>Estimated arrival: <strong>10–15 Minutes</strong> across Birmaharajpur.</span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        ) : (
          /* Empty Active Orders Card */
          <div className="py-16 sm:py-24 text-center flex flex-col items-center justify-center space-y-4 bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800 p-8 shadow-sm">
            <div className="w-16 h-16 rounded-3xl bg-orange-500/10 text-orange-500 flex items-center justify-center text-3xl">
              🛵
            </div>
            <div className="space-y-1 max-w-sm">
              <h4 className="text-xl font-black text-slate-900 dark:text-white font-display">
                No Active Orders Right Now
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                You do not have any ongoing deliveries. Browse our 24 verified grocery and food items to start your meal!
              </p>
            </div>
            <button
              onClick={() => { playNotificationSound('click'); setActiveTab('home'); }}
              className="px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-md transition-all active:scale-95"
            >
              Browse Food Mela Menu
            </button>
          </div>
        )
      )}

      {/* ================= TAB 2: CANCELLED ORDERS ================= */}
      {trackerTab === 'cancelled' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
            <h3 className="text-sm font-black uppercase tracking-wider text-slate-400">
              Cancelled Deliveries History
            </h3>
            <span className="text-xs font-mono-numbers font-bold text-slate-400">
              {cancelledList.length} items
            </span>
          </div>

          {cancelledList.length === 0 ? (
            <div className="py-16 text-center flex flex-col items-center justify-center space-y-3 bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800 p-8">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center text-2xl font-black">
                ✨
              </div>
              <h4 className="text-base font-bold text-slate-900 dark:text-white font-display">
                No Cancelled Orders!
              </h4>
              <p className="text-xs text-slate-400 max-w-sm">
                All your orders have arrived safely and intact. No cancellations have been logged on your account.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {cancelledList.map((order) => (
                <div
                  key={order.id}
                  className="p-5 bg-white dark:bg-slate-900 rounded-3xl border border-rose-100 dark:border-rose-950/40 shadow-sm flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-mono-numbers text-xs font-black text-slate-800 dark:text-slate-200">
                        Order #{order.id}
                      </span>
                      <span className="px-3 py-1 rounded-full bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 text-[10px] font-black uppercase tracking-wider border border-rose-200 dark:border-rose-900/40 flex items-center gap-1">
                        <XCircle className="w-3 h-3" />
                        <span>Cancelled</span>
                      </span>
                    </div>

                    <p className="text-[11px] font-semibold text-slate-400">
                      Logged on {new Date(order.createdAt).toLocaleDateString()} · ₹{order.totalAmount}
                    </p>

                    <div className="p-3 bg-rose-50/50 dark:bg-rose-950/20 rounded-xl text-[11px] text-rose-700 dark:text-rose-300 font-medium">
                      Status Note: Order was cancelled. If prepaid online via PayU, refund has been processed back to your original payment method.
                    </div>

                    <div className="border-t border-slate-100 dark:border-slate-800 pt-2.5 space-y-1">
                      {order.items.map((ci) => (
                        <div key={ci.id} className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
                          <span className="truncate max-w-[200px]">{ci.item.name} × {ci.quantity}</span>
                          <span className="font-mono-numbers">₹{ci.item.price * ci.quantity}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-2 border-t border-slate-100 dark:border-slate-800 pt-3">
                    <button
                      onClick={() => { playNotificationSound('success'); reorder(order); }}
                      className="w-full py-2.5 px-3 bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 text-white font-extrabold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all active:scale-95"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Re-Try This Order</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ================= TAB 3: PAST ORDERS (DELIVERED) ================= */}
      {trackerTab === 'past' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
            <h3 className="text-sm font-black uppercase tracking-wider text-slate-400">
              Delivered Orders ({pastList.length})
            </h3>
            <span className="text-xs font-mono-numbers font-bold text-slate-400">
              All Completed Feasts
            </span>
          </div>

          {pastList.length === 0 ? (
            <div className="py-16 text-center flex flex-col items-center justify-center space-y-3 bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800 p-8">
              <span className="text-4xl select-none">📦</span>
              <h4 className="text-base font-bold text-slate-900 dark:text-white font-display">
                No past delivered orders found
              </h4>
              <p className="text-xs text-slate-400 max-w-sm">
                When an order completes its delivery cycle, its invoice and receipt will be archived here for your records.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {pastList.map((order) => (
                <div
                  key={order.id}
                  className="p-5 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm hover:border-orange-500/20 transition-all flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-mono-numbers text-xs font-black text-slate-800 dark:text-slate-200">
                        Order #{order.id}
                      </span>
                      <span className="px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 text-[10px] font-black uppercase tracking-wider border border-emerald-200 dark:border-emerald-800/40 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Delivered</span>
                      </span>
                    </div>

                    <p className="text-[11px] font-semibold text-slate-400">
                      Completed on {new Date(order.createdAt).toLocaleDateString()} · ₹{order.totalAmount}
                    </p>

                    <div className="border-t border-slate-100 dark:border-slate-800 pt-2.5 space-y-1">
                      {order.items.map((ci) => (
                        <div key={ci.id} className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
                          <span className="truncate max-w-[200px]">{ci.item.name} × {ci.quantity}</span>
                          <span className="font-mono-numbers">₹{ci.item.price * ci.quantity}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-2 border-t border-slate-100 dark:border-slate-800 pt-3">
                    <button
                      onClick={() => { playNotificationSound('click'); setShowInvoiceId(order.id); }}
                      className="flex-1 py-2.5 px-3 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-300 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 active:scale-95 transition-all"
                    >
                      <Receipt className="w-3.5 h-3.5 text-orange-500" />
                      <span>View Bill</span>
                    </button>
                    <button
                      onClick={() => { playNotificationSound('success'); reorder(order); }}
                      className="flex-1 py-2.5 px-3 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-extrabold text-xs rounded-xl flex items-center justify-center gap-1 active:scale-95 transition-all shadow-md shadow-orange-500/10"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Re-Order</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ================= INVOICE RECEIPT MODAL ================= */}
      {showInvoiceId && viewInvoiceOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div 
            className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl overflow-hidden shadow-2xl border border-slate-100 dark:border-slate-800 p-6 flex flex-col space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="space-y-0.5">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Official Bill &amp; Tax Receipt</span>
                <div className="flex items-center gap-2">
                  <h4 className="text-base font-black text-slate-900 dark:text-white font-mono-numbers">
                    INV-{viewInvoiceOrder.id.replace(/[^0-9]/g, '') || viewInvoiceOrder.id}
                  </h4>
                  <span className="text-xs font-bold text-slate-400">({viewInvoiceOrder.id})</span>
                </div>
              </div>
              <button 
                onClick={() => setShowInvoiceId(null)}
                className="text-xs font-black text-red-500 hover:underline uppercase"
              >
                Close
              </button>
            </div>

            {/* Bill Address */}
            <div className="text-xs space-y-1 text-slate-600 dark:text-slate-400 font-medium">
              <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Customer &amp; Delivery Details</span>
              <p className="font-bold text-slate-800 dark:text-slate-200">
                Customer: <span className="text-orange-600 dark:text-orange-400">{user?.name || 'Customer'}</span> ({user?.phone ? `+91 ${user.phone}` : ''})
              </p>
              <p className="text-slate-600 dark:text-slate-400">
                Address: {viewInvoiceOrder.deliveryAddress}
              </p>
              <p>Payment Mode: <strong className="text-slate-900 dark:text-white">{viewInvoiceOrder.paymentMethod}</strong></p>
            </div>

            {/* Receipt calculation details */}
            <div className="border-t border-b border-slate-100 dark:border-slate-800 py-3 space-y-2 text-xs">
              <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Itemized Summary</span>
              
              {viewInvoiceOrder.items.map((ci) => (
                <div key={ci.id} className="flex justify-between items-center text-slate-700 dark:text-slate-300">
                  <span>{ci.quantity}x {ci.item.name}</span>
                  <span className="font-mono-numbers text-slate-900 dark:text-white">₹{ci.item.price * ci.quantity}</span>
                </div>
              ))}

              <hr className="border-slate-100 dark:border-slate-800 my-1" />

              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>Delivery &amp; Logistics (15-Min)</span>
                <span className="font-mono-numbers">{viewInvoiceOrder.deliveryFee === 0 ? 'FREE' : `₹${viewInvoiceOrder.deliveryFee || 0}`}</span>
              </div>
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>Restaurant GST &amp; Taxes</span>
                <span className="font-mono-numbers">₹{viewInvoiceOrder.taxes || 0}</span>
              </div>
              <div className="flex justify-between text-base font-black text-slate-900 dark:text-white pt-1 border-t border-slate-200 dark:border-slate-700">
                <span>Grand Total Paid</span>
                <span className="font-mono-numbers text-orange-500">₹{viewInvoiceOrder.totalAmount}</span>
              </div>
            </div>

            <button
              onClick={() => {
                playNotificationSound('success');
                window.print();
              }}
              className="w-full py-3 bg-slate-900 dark:bg-emerald-600 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow transition-all active:scale-95"
            >
              Print / Save Invoice Receipt
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
