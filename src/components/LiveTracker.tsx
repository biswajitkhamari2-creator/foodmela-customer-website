import React, { useState, useEffect } from 'react';
import { useApp, playNotificationSound } from '../context/AppContext';
import { Phone, CheckCircle2, Navigation, MapPin, Receipt, Clock, Sparkles, Award } from 'lucide-react';
import { Order } from '../types';

export default function LiveTracker() {
  const { activeOrder, pastOrders, reorder, currentLocation } = useApp();
  const [showInvoiceId, setShowInvoiceId] = useState<string | null>(null);

  // Stepper Configurations
  const steps = [
    { key: 'placed', label: 'Order Placed', desc: 'Awaiting kitchen confirmation' },
    { key: 'preparing', label: 'In the Kitchen', desc: 'Chefs are preparing your premium feast' },
    { key: 'rider_assigned', label: 'Rider Appointed', desc: 'Rahul Kumar is picking up the parcel' },
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
    alert('Connecting call to Rahul Kumar (+91 98765 43210) via Food Mela Private VoIP...');
  };

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* ================= ACTIVE LIVE ORDER TRACKER ================= */}
      {activeOrder ? (
        <div className="space-y-6">
          
          <div className="p-6 bg-gradient-to-r from-orange-500/10 via-yellow-500/5 to-emerald-500/10 border border-orange-500/10 rounded-3xl relative overflow-hidden">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-orange-500 text-white font-black text-[9px] uppercase tracking-wider animate-pulse">
                  Live Tracking
                </span>
                <h3 className="text-xl font-black text-slate-900 dark:text-white font-display tracking-tight mt-1">
                  Order ID: {activeOrder.id}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold font-mono-numbers">
                  Created at {new Date(activeOrder.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
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
            
            {/* Stepper Steps (Left 2 Columns on desktop) */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Stepper Card */}
              <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-850 shadow-sm space-y-6">
                <h4 className="text-sm font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest border-b border-slate-50 dark:border-slate-800/60 pb-2">
                  Delivery Status Progression
                </h4>

                <div className="relative pl-8 space-y-6 border-l border-slate-100 dark:border-slate-800 ml-4.5">
                  {steps.map((step, idx) => {
                    const isCompleted = idx < activeIndex;
                    const isCurrent = idx === activeIndex;
                    const isUpcoming = idx > activeIndex;

                    return (
                      <div key={step.key} className="relative">
                        {/* Step Marker circle */}
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

              {/* Driver and Call Info details */}
              {activeOrder.rider && (
                <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-850 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6">
                  <div className="flex items-center gap-4 text-center sm:text-left flex-col sm:flex-row">
                    <div className="w-16 h-16 rounded-full bg-orange-100 dark:bg-orange-950/20 text-orange-500 font-black text-2xl flex items-center justify-center shrink-0 border-2 border-orange-500/10 overflow-hidden">
                      <span className="text-3xl">🚴</span>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center justify-center sm:justify-start gap-1.5">
                        <span className="text-sm font-black text-slate-900 dark:text-white">{activeOrder.rider.name}</span>
                        <span className="px-1.5 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/40 text-[9px] font-black uppercase text-emerald-600 dark:text-emerald-400 tracking-wider">Verified Rider</span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 font-mono-numbers font-semibold uppercase">{activeOrder.rider.vehicleNumber}</p>
                      
                      {/* OTP display badge */}
                      <span className="inline-block mt-1 text-[11px] font-bold text-orange-600 dark:text-orange-400">
                        Share PIN to receive order: <strong className="font-mono-numbers text-xs underline decoration-2">{activeOrder.rider.pin}</strong>
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={triggerCallRider}
                    className="w-full sm:w-auto py-3 px-5 bg-orange-500 hover:bg-orange-600 text-white font-extrabold text-xs rounded-xl shadow-md flex items-center justify-center gap-1.5 active:scale-95 transition-all"
                  >
                    <Phone className="w-4 h-4" />
                    <span>Call Delivery Executive</span>
                  </button>
                </div>
              )}
            </div>

            {/* Premium Simulated Route Grid Map (Right Column) */}
            <div className="space-y-4">
              <div className="p-5 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-850 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                    Live Express Route Map
                  </h4>
                  <span className="text-[10px] bg-emerald-500/10 text-emerald-600 px-2 py-0.5 rounded-full font-bold">
                    GPS Active
                  </span>
                </div>

                {/* Stylish Vector SVG Grid Map Simulation */}
                <div className="relative h-64 bg-slate-100 dark:bg-slate-950/80 rounded-2xl border border-slate-100 dark:border-slate-850 overflow-hidden">
                  
                  {/* Subtle Grid Lines pattern */}
                  <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.03)_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:20px_20px]" />
                  
                  {/* Fake streets layout */}
                  <div className="absolute top-1/3 left-0 right-0 h-1 bg-white/40 dark:bg-slate-900/40" />
                  <div className="absolute top-2/3 left-0 right-0 h-1 bg-white/40 dark:bg-slate-900/40" />
                  <div className="absolute top-0 bottom-0 left-1/4 w-1 bg-white/40 dark:bg-slate-900/40" />
                  <div className="absolute top-0 bottom-0 left-3/4 w-1 bg-white/40 dark:bg-slate-900/40" />

                  {/* 1. Restaurant Location (Delhi/Bengaluru food hub) */}
                  <div className="absolute top-[80%] left-[15%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                    <div className="p-2 bg-orange-100 dark:bg-orange-950/40 border border-orange-500 rounded-xl shadow-md text-orange-600">
                      <MapPin className="w-4 h-4 fill-current" />
                    </div>
                    <span className="text-[8px] font-black text-slate-500 dark:text-slate-400 mt-1 uppercase tracking-wide bg-white dark:bg-slate-900 px-1 py-0.5 rounded">Kitchen</span>
                  </div>

                  {/* 2. Destination: Customer Home */}
                  <div className="absolute top-[20%] left-[80%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                    <div className="p-2 bg-emerald-100 dark:bg-emerald-950/40 border border-emerald-500 rounded-xl shadow-md text-emerald-600">
                      <MapPin className="w-4 h-4 fill-current" />
                    </div>
                    <span className="text-[8px] font-black text-slate-500 dark:text-slate-400 mt-1 uppercase tracking-wide bg-white dark:bg-slate-900 px-1 py-0.5 rounded truncate max-w-[80px]">
                      {currentLocation.split(',')[0]}
                    </span>
                  </div>

                  {/* 3. Rider Icon Overlay (Dynamic movement coordinates) */}
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

                  {/* Dashed line connector path */}
                  <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-45">
                    <line 
                      x1="15%" 
                      y1="80%" 
                      x2="80%" 
                      y2="20%" 
                      stroke="#f97316" 
                      strokeWidth="2.5" 
                      strokeDasharray="5,5" 
                    />
                  </svg>
                </div>

                <div className="flex items-center gap-2.5 text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed bg-slate-50 dark:bg-slate-950/60 p-3.5 rounded-xl border border-slate-100/60 dark:border-slate-850/60">
                  <Clock className="w-4 h-4 text-orange-500 shrink-0" />
                  <span>
                    {activeOrder.status === 'delivered' 
                      ? 'Parcel handed over! Rate Rahul in the feedback card.' 
                      : `Fast delivery guaranteed in ${activeOrder.status === 'out_for_delivery' ? '3-5' : '10-15'} minutes.`}
                  </span>
                </div>
              </div>
            </div>

          </div>

        </div>
      ) : (
        // ================= NO ACTIVE ORDERS: SHOW PAST ORDERS HISTORY =================
        <div className="space-y-6">
          <div className="border-b border-slate-100 dark:border-slate-850 pb-2 flex items-center justify-between">
            <h3 className="text-xl font-black text-slate-900 dark:text-white font-display uppercase tracking-tight">
              Order Archives
            </h3>
            <span className="text-xs text-slate-400 font-mono-numbers font-bold">
              {pastOrders.length} Completed Trips
            </span>
          </div>

          {pastOrders.length === 0 ? (
            <div className="py-20 text-center flex flex-col items-center justify-center space-y-4 bg-white dark:bg-slate-900/40 border border-dashed border-slate-200 dark:border-slate-800 rounded-3xl p-6">
              <span className="text-5xl select-none">📦</span>
              <div className="space-y-1 text-center">
                <h4 className="text-base font-bold text-slate-900 dark:text-white font-display">No past orders discovered</h4>
                <p className="text-xs text-slate-400 max-w-sm">When you place and receive your first premium gourmet order, complete details will be logged in this visual archive tracker.</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {pastOrders.map((order) => (
                <div
                  key={order.id}
                  className="p-5 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-850 hover:border-orange-500/10 dark:hover:border-orange-500/15 shadow-sm transition-all flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-mono-numbers text-xs font-black text-slate-800 dark:text-slate-200 uppercase tracking-tight">
                        ID: {order.id}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 text-[10px] font-black uppercase tracking-wider">
                        Delivered
                      </span>
                    </div>

                    <p className="text-[11px] font-semibold text-slate-400 dark:text-slate-500">
                      Ordered on {new Date(order.createdAt).toLocaleDateString()} · ₹{order.totalAmount}
                    </p>

                    <div className="border-t border-slate-50 dark:border-slate-850/60 pt-2.5 space-y-1.5">
                      {order.items.map((ci) => (
                        <div key={ci.id} className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400 font-medium">
                          <span className="truncate max-w-[200px]">{ci.item.name} × {ci.quantity}</span>
                          <span className="font-mono-numbers">₹{ci.item.price * ci.quantity}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-2 border-t border-slate-50 dark:border-slate-850/60 pt-3">
                    <button
                      onClick={() => { playNotificationSound('click'); setShowInvoiceId(order.id); }}
                      className="flex-1 py-2 px-3 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800/60 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 active:scale-95 transition-all"
                    >
                      <Receipt className="w-3.5 h-3.5 text-orange-500" />
                      <span>Invoice</span>
                    </button>
                    <button
                      onClick={() => { playNotificationSound('success'); reorder(order); }}
                      className="flex-1 py-2 px-3 bg-orange-500 hover:bg-orange-600 text-white font-extrabold text-xs rounded-xl flex items-center justify-center gap-1 active:scale-95 transition-all shadow-sm shadow-orange-500/5"
                    >
                      <span>Reorder</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>
      )}

      {/* ================= INVOICE IN-APP DETAILED RECEIPT MODAL ================= */}
      {showInvoiceId && viewInvoiceOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div 
            className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl overflow-hidden shadow-2xl border border-slate-100 dark:border-slate-800 p-6 flex flex-col space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-50 dark:border-slate-850 pb-3">
              <div className="space-y-0.5">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Invoice Details</span>
                <h4 className="text-sm font-black text-slate-900 dark:text-white font-mono-numbers">
                  Order #{viewInvoiceOrder.id}
                </h4>
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
              <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Ship To Address</span>
              <p className="font-bold text-slate-800 dark:text-slate-200">
                {viewInvoiceOrder.deliveryAddress}
              </p>
              <p>Payment Method: <span className="font-bold">{viewInvoiceOrder.paymentMethod}</span></p>
            </div>

            {/* Receipt calculation details */}
            <div className="border-t border-b border-slate-100 dark:border-slate-800 py-3 space-y-2 text-xs">
              <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Itemized Summary</span>
              
              {viewInvoiceOrder.items.map((ci) => {
                const customPrice = ci.selectedCustomizations.reduce((acc, c) => acc + c.price, 0);
                const itemTotal = (ci.item.price + customPrice) * ci.quantity;

                return (
                  <div key={ci.id} className="flex justify-between items-center text-slate-700 dark:text-slate-300">
                    <div>
                      <span>{ci.item.name} × {ci.quantity}</span>
                      {ci.selectedCustomizations.length > 0 && (
                        <span className="block text-[9px] text-slate-400">
                          {ci.selectedCustomizations.map((c) => c.choiceName).join(', ')}
                        </span>
                      )}
                    </div>
                    <span className="font-mono-numbers text-slate-900 dark:text-white">₹{itemTotal}</span>
                  </div>
                );
              })}

              <hr className="border-slate-50 dark:border-slate-850/60 my-1" />

              <div className="flex justify-between text-slate-500 font-semibold">
                <span>Subtotal</span>
                <span className="font-mono-numbers">₹{viewInvoiceOrder.itemTotal}</span>
              </div>
              {viewInvoiceOrder.discountAmount > 0 && (
                <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-semibold">
                  <span>Vouchers Applied</span>
                  <span className="font-mono-numbers">-₹{viewInvoiceOrder.discountAmount}</span>
                </div>
              )}
              <div className="flex justify-between text-slate-500 font-semibold">
                <span>GST Taxes</span>
                <span className="font-mono-numbers">₹{viewInvoiceOrder.taxes}</span>
              </div>
              <div className="flex justify-between text-slate-500 font-semibold">
                <span>Express Delivery</span>
                <span className="font-mono-numbers">
                  {viewInvoiceOrder.deliveryFee === 0 ? 'Free' : `₹${viewInvoiceOrder.deliveryFee}`}
                </span>
              </div>
              <div className="flex justify-between text-slate-500 font-semibold">
                <span>Convenience Platform Fee</span>
                <span className="font-mono-numbers">
                  {viewInvoiceOrder.platformFee === 0 ? 'Waived' : `₹${viewInvoiceOrder.platformFee}`}
                </span>
              </div>
            </div>

            <div className="flex justify-between items-center text-slate-900 dark:text-white font-black text-sm">
              <span className="font-display">Total Paid Amount</span>
              <span className="font-mono-numbers text-base">₹{viewInvoiceOrder.totalAmount}</span>
            </div>

            <button
              onClick={() => {
                playNotificationSound('success');
                alert('Invoice downloaded successfully in device downloads!');
                setShowInvoiceId(null);
              }}
              className="w-full py-3 bg-slate-900 hover:bg-slate-800 dark:bg-emerald-600 text-white font-extrabold text-xs rounded-xl shadow-md"
            >
              Confirm & Download PDF
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
