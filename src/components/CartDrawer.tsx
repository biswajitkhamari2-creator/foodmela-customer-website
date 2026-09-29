import React, { useState, useMemo } from 'react';
import { useApp, playNotificationSound } from '../context/AppContext';
import { X, Trash2, Tag, Percent, MapPin, CreditCard, ChevronRight, CheckCircle, Gift, Loader2, Phone, Edit3 } from 'lucide-react';

export default function CartDrawer() {
  const {
    cart,
    cartDrawerOpen,
    setCartDrawerOpen,
    removeFromCart,
    updateQuantity,
    cartTotal,
    deliveryFee,
    taxes,
    platformFee,
    discountAmount,
    grandTotal,
    appliedCoupon,
    couponError,
    applyCoupon,
    removeCoupon,
    user,
    currentLocation,
    setShowLoginModal,
    placeOrder,
  } = useApp();

  const [couponInput, setCouponInput] = useState('');
  const [selectedAddressId, setSelectedAddressId] = useState('addr_1');
  const [customAddress, setCustomAddress] = useState('');
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('UPI');
  const [isPlacing, setIsPlacing] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState<'cart' | 'checkout'>('cart');

  // Safely compute addresses list without ANY risk of undefined.map crash
  const addressesList = useMemo(() => {
    if (!user) return [];
    const fromSaved = Array.isArray(user.savedAddresses) && user.savedAddresses.length > 0 ? user.savedAddresses : null;
    const fromAddr = Array.isArray(user.addresses) && user.addresses.length > 0 ? user.addresses : null;
    const list = fromSaved || fromAddr;
    if (list && list.length > 0) {
      return list.map((a: any, idx: number) => ({
        id: a.id || `addr_${idx + 1}`,
        label: a.label || a.tag || 'Home',
        addressLine: a.addressLine || a.address || user.address || currentLocation || 'Birmaharajpur, Subarnapur, Odisha - 767018',
        city: a.city || 'Birmaharajpur',
      }));
    }
    return [
      {
        id: 'addr_1',
        label: 'Home',
        addressLine: user.address || currentLocation || 'Birmaharajpur, Subarnapur, Odisha - 767018',
        city: 'Birmaharajpur',
      },
    ];
  }, [user, currentLocation]);

  if (!cartDrawerOpen) return null;

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (couponInput.trim()) {
      await applyCoupon(couponInput.trim());
    }
  };

  const handleQuickApply = async (code: string) => {
    setCouponInput(code);
    await applyCoupon(code);
  };

  const getEffectiveAddress = () => {
    if (customAddress.trim()) {
      return customAddress.trim();
    }
    const found = addressesList.find((a) => a.id === selectedAddressId);
    if (found && found.addressLine) {
      return `${found.addressLine}, ${found.city}`;
    }
    return user?.address || currentLocation || 'Birmaharajpur, Subarnapur, Odisha - 767018';
  };

  const handleCheckoutSubmit = async () => {
    if (!user) {
      playNotificationSound('click');
      setShowLoginModal(true);
      return;
    }

    setIsPlacing(true);
    const finalAddr = getEffectiveAddress();
    
    try {
      const ok = await placeOrder(paymentMethod, finalAddr);
      if (ok) {
        setCheckoutStep('cart');
        setCartDrawerOpen(false);
      }
    } catch (e) {
      console.error('Checkout error:', e);
    } finally {
      setIsPlacing(false);
    }
  };

  const getCustomizationsText = (ci: any) => {
    if (!ci.selectedCustomizations || ci.selectedCustomizations.length === 0) return '';
    return ci.selectedCustomizations.map((c: any) => c.choiceName).join(', ');
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm animate-fade-in max-w-full overflow-hidden">
      {/* Backdrop Close Click */}
      <div className="absolute inset-0 -z-10" onClick={() => setCartDrawerOpen(false)} />

      {/* Main Drawer Container - Full width on mobile, constrained on desktop */}
      <div className="w-full max-w-full sm:max-w-md bg-white dark:bg-slate-900 h-full overflow-hidden shadow-2xl border-l border-slate-100 dark:border-slate-800 flex flex-col justify-between animate-slide-left">
        
        {/* Header Block */}
        <div className="p-4 sm:p-6 border-b border-slate-100 dark:border-slate-800/80 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white font-display uppercase tracking-tight">
              {checkoutStep === 'cart' ? 'Your Gourmet Bag' : 'Secure Checkout'}
            </h3>
            <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-850 text-[10px] font-mono-numbers font-black text-slate-500 dark:text-slate-400">
              {cart.length} items
            </span>
          </div>

          <button
            onClick={() => setCartDrawerOpen(false)}
            className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-full hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            aria-label="Close Bag"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content Pane */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 sm:space-y-6">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-12">
              <span className="text-5xl select-none">🍛</span>
              <div className="space-y-1">
                <h4 className="text-base font-bold text-slate-900 dark:text-white font-display">Your bag is empty</h4>
                <p className="text-xs text-slate-400 max-w-xs mx-auto">Add some sizzling Royal Biryanis or fresh grocery ingredients from the catalog to start your feast!</p>
              </div>
              <button
                onClick={() => setCartDrawerOpen(false)}
                className="px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs rounded-xl shadow-md transition-all active:scale-95"
              >
                Start Browsing Menu
              </button>
            </div>
          ) : checkoutStep === 'cart' ? (
            // ================= STEP 1: CART OVERVIEW =================
            <div className="space-y-4 sm:space-y-6">
              
              {/* Itemized list */}
              <div className="space-y-3">
                {cart.map((ci) => {
                  const customPrice = (ci.selectedCustomizations || []).reduce((acc, c) => acc + c.price, 0);
                  const totalUnit = (ci.item?.price || 0) + customPrice;

                  return (
                    <div 
                      key={ci.id}
                      className="flex items-start justify-between gap-3 p-3 sm:p-4 rounded-2xl bg-slate-50/50 dark:bg-slate-800/20 border border-slate-100/60 dark:border-slate-850/40 transition-all hover:bg-slate-50 dark:hover:bg-slate-800/40"
                    >
                      <div className="flex-1 space-y-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className={`w-2 h-2 rounded-full shrink-0 ${ci.item?.isVeg ? 'bg-emerald-500' : 'bg-red-500'}`} />
                          <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                            {ci.item?.name}
                          </h4>
                        </div>

                        {ci.selectedCustomizations && ci.selectedCustomizations.length > 0 && (
                          <p className="text-[10px] text-slate-400 font-medium italic truncate">
                            {getCustomizationsText(ci)}
                          </p>
                        )}

                        {ci.instructions && (
                          <div className="text-[10px] text-orange-600 dark:text-orange-400 bg-orange-50/40 dark:bg-orange-950/10 px-2 py-0.5 rounded-md inline-block max-w-full truncate">
                            “{ci.instructions}”
                          </div>
                        )}

                        <span className="block text-[10px] text-slate-400 font-mono-numbers font-semibold">
                          ₹{totalUnit} × {ci.quantity}
                        </span>
                      </div>

                      {/* Quantity Modifier Right Side */}
                      <div className="flex flex-col items-end justify-between h-full min-h-[50px] shrink-0">
                        <span className="text-xs font-mono-numbers font-black text-slate-900 dark:text-white">
                          ₹{totalUnit * ci.quantity}
                        </span>

                        <div className="flex items-center bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-100 dark:border-slate-700/60 p-0.5">
                          <button
                            onClick={() => updateQuantity(ci.id, -1)}
                            className="w-6 h-6 flex items-center justify-center text-slate-500 hover:text-orange-500 font-extrabold text-xs"
                            aria-label="Decrease quantity"
                          >
                            -
                          </button>
                          <span className="w-5 text-center text-xs font-mono-numbers font-black text-slate-800 dark:text-slate-200">
                            {ci.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(ci.id, 1)}
                            className="w-6 h-6 flex items-center justify-center text-slate-500 hover:text-orange-500 font-extrabold text-xs"
                            aria-label="Increase quantity"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Coupon Applicator Widget */}
              <div className="p-3 sm:p-4 bg-slate-50/50 dark:bg-slate-800/20 border border-slate-100 dark:border-slate-850 rounded-2xl space-y-3">
                <div className="flex items-center gap-2 text-slate-800 dark:text-slate-200">
                  <Tag className="w-4 h-4 text-orange-500 shrink-0" />
                  <span className="text-xs font-black uppercase tracking-wider">Coupons & Promos</span>
                </div>

                <form onSubmit={handleApply} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter Coupon (e.g. MELA50)"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                    className="flex-1 px-3 py-2 text-xs font-bold bg-white dark:bg-slate-800 border border-slate-250 dark:border-slate-750 rounded-xl focus:outline-none focus:border-orange-500 text-slate-900 dark:text-white"
                  />
                  <button
                    type="submit"
                    className="px-3 sm:px-4 py-2 bg-slate-900 dark:bg-emerald-600 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shrink-0"
                  >
                    Apply
                  </button>
                </form>

                {couponError && (
                  <p className="text-[10px] font-medium text-red-600 dark:text-red-400">
                    {couponError}
                  </p>
                )}

                {appliedCoupon ? (
                  <div className="flex items-center justify-between p-2.5 bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-500/25 rounded-xl text-[11px]">
                    <div className="flex items-center gap-1.5 text-emerald-800 dark:text-emerald-400 font-semibold truncate">
                      <Percent className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate">Applied: {appliedCoupon.code}</span>
                    </div>
                    <button
                      onClick={removeCoupon}
                      className="text-[10px] font-black text-red-500 hover:underline uppercase shrink-0"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  // Suggested list
                  <div className="space-y-1.5">
                    <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Suggested Codes</span>
                    <div className="flex flex-col gap-1.5">
                      <button
                        onClick={() => handleQuickApply('MELA50')}
                        className="flex items-center justify-between p-2 rounded-xl bg-white dark:bg-slate-850 hover:border-orange-500/30 border border-slate-100 dark:border-slate-750 text-left transition-colors text-[10px]"
                      >
                        <div>
                          <span className="font-extrabold text-orange-500 dark:text-orange-400">MELA50</span>
                          <span className="text-slate-400 font-medium ml-1.5">50% off up to ₹120</span>
                        </div>
                        <ChevronRight className="w-3 h-3 text-slate-400 shrink-0" />
                      </button>

                      <button
                        onClick={() => handleQuickApply('GOLD20')}
                        className="flex items-center justify-between p-2 rounded-xl bg-white dark:bg-slate-850 hover:border-orange-500/30 border border-slate-100 dark:border-slate-750 text-left transition-colors text-[10px]"
                      >
                        <div>
                          <span className="font-extrabold text-emerald-600 dark:text-emerald-400">GOLD20</span>
                          <span className="text-slate-400 font-medium ml-1.5">Flat 20% off meals</span>
                        </div>
                        <ChevronRight className="w-3 h-3 text-slate-400 shrink-0" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            // ================= STEP 2: ADDRESS & PAYMENT (COMPLETELY BULLETPROOF) =================
            <div className="space-y-4 sm:space-y-6">
              
              {/* Delivery Location Section */}
              <div className="space-y-3">
                <div className="flex items-center justify-between text-slate-800 dark:text-slate-200">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-orange-500 shrink-0" />
                    <span className="text-xs font-black uppercase tracking-wider">Delivery Address</span>
                  </div>
                  <button
                    onClick={() => setIsEditingAddress(!isEditingAddress)}
                    className="text-[10px] font-bold text-orange-500 hover:underline flex items-center gap-1"
                  >
                    <Edit3 className="w-3 h-3" />
                    <span>{isEditingAddress ? 'Use Saved' : 'Custom Address'}</span>
                  </button>
                </div>

                {!user ? (
                  <div className="p-4 bg-orange-50/40 dark:bg-orange-950/20 border border-orange-500/30 rounded-2xl space-y-3 text-center">
                    <div className="space-y-1">
                      <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                        Sign In to Select Saved Addresses
                      </p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        Enter your mobile number to get 1-touch OTP verification
                      </p>
                    </div>
                    <button
                      onClick={() => { playNotificationSound('click'); setShowLoginModal(true); }}
                      className="w-full py-2.5 px-4 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-md flex items-center justify-center gap-2"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>1-Tap OTP Login</span>
                    </button>
                  </div>
                ) : isEditingAddress ? (
                  <div className="space-y-2">
                    <textarea
                      rows={2}
                      value={customAddress}
                      onChange={(e) => setCustomAddress(e.target.value)}
                      placeholder="Enter house no, landmark, Birmaharajpur..."
                      className="w-full p-3 text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:border-orange-500 text-slate-900 dark:text-white"
                    />
                    <p className="text-[10px] text-slate-400">
                      Rider will navigate directly to this custom delivery location.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {addressesList.map((addr) => {
                      const isSelected = selectedAddressId === addr.id;
                      return (
                        <button
                          key={addr.id}
                          onClick={() => { playNotificationSound('click'); setSelectedAddressId(addr.id); }}
                          className={`w-full text-left p-3 rounded-xl border transition-all text-xs flex items-start gap-3 ${
                            isSelected 
                              ? 'bg-orange-50/40 border-orange-500 dark:bg-orange-950/20 dark:border-orange-500' 
                              : 'bg-slate-50/50 dark:bg-slate-800/40 border-slate-100 dark:border-slate-800'
                          }`}
                        >
                          <div className={`mt-0.5 w-3.5 h-3.5 rounded-full border flex items-center justify-center shrink-0 ${
                            isSelected ? 'border-orange-500' : 'border-slate-300 dark:border-slate-600'
                          }`}>
                            {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-orange-500" />}
                          </div>
                          <div className="min-w-0 flex-1">
                            <span className="font-extrabold text-slate-900 dark:text-white uppercase tracking-wider text-[10px]">
                              {addr.label}
                            </span>
                            <p className="text-slate-500 dark:text-slate-400 font-medium mt-0.5 line-clamp-2">
                              {addr.addressLine}, {addr.city}
                            </p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Secure Payment Mode selection */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-slate-800 dark:text-slate-200">
                  <CreditCard className="w-4 h-4 text-orange-500 shrink-0" />
                  <span className="text-xs font-black uppercase tracking-wider">Select Payment Method</span>
                </div>

                <div className="grid grid-cols-1 gap-2">
                  {[
                    { id: 'UPI', title: 'Instant UPI (GPay/PhonePe)', subtitle: 'Waived Platform Fee' },
                    { id: 'CARD', title: 'Credit / Debit Card', subtitle: 'Secure Online Gateway' },
                    { id: 'COD', title: 'Cash on Delivery (COD)', subtitle: 'Pay when food arrives' },
                  ].map((pay) => {
                    const isSelected = paymentMethod === pay.id;
                    return (
                      <button
                        key={pay.id}
                        onClick={() => { playNotificationSound('click'); setPaymentMethod(pay.id); }}
                        className={`w-full text-left p-3 rounded-xl border transition-all text-xs flex items-center justify-between ${
                          isSelected 
                            ? 'bg-orange-50/40 border-orange-500 dark:bg-orange-950/20 dark:border-orange-500' 
                            : 'bg-slate-50/50 dark:bg-slate-800/40 border-slate-100 dark:border-slate-800'
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center shrink-0 ${
                            isSelected ? 'border-orange-500' : 'border-slate-300 dark:border-slate-600'
                          }`}>
                            {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-orange-500" />}
                          </div>
                          <div className="min-w-0">
                            <span className="font-bold text-slate-900 dark:text-white truncate block">{pay.title}</span>
                            <span className="block text-[9px] text-slate-400 font-medium">{pay.subtitle}</span>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

            </div>
          )}
        </div>

        {/* Invoice pricing breakdown block */}
        {cart.length > 0 && (
          <div className="p-4 sm:p-6 bg-slate-50 dark:bg-slate-950 border-t border-slate-100 dark:border-slate-850 space-y-3 sm:space-y-4 shrink-0">
            <div className="space-y-1.5 text-xs font-semibold text-slate-600 dark:text-slate-400">
              <div className="flex items-center justify-between">
                <span>Food & Grocery Total</span>
                <span className="font-mono-numbers text-slate-900 dark:text-white">₹{cartTotal}</span>
              </div>

              {appliedCoupon && (
                <div className="flex items-center justify-between text-emerald-600 dark:text-emerald-400">
                  <span className="flex items-center gap-1">
                    <Gift className="w-3.5 h-3.5 shrink-0" />
                    <span>Coupon Savings ({appliedCoupon.code})</span>
                  </span>
                  <span className="font-mono-numbers">-₹{discountAmount}</span>
                </div>
              )}

              {user?.isGoldMember && (
                <div className="flex items-center justify-between text-yellow-600 dark:text-yellow-400 font-extrabold">
                  <span>Mela Gold Food Discount</span>
                  <span className="font-mono-numbers">-₹{Math.round(cartTotal * 0.15)}</span>
                </div>
              )}

              <div className="flex items-center justify-between">
                <span>Delivery Fee (15-Min Express)</span>
                <span className="font-mono-numbers text-slate-900 dark:text-white">
                  {deliveryFee === 0 ? <span className="text-emerald-500 font-bold uppercase text-[10px]">Free</span> : `₹${deliveryFee}`}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span>Restaurant Taxes & GST</span>
                <span className="font-mono-numbers text-slate-900 dark:text-white">₹{taxes}</span>
              </div>

              <div className="flex items-center justify-between">
                <span>Convenience / Platform Fee</span>
                <span className="font-mono-numbers text-slate-900 dark:text-white">
                  {platformFee === 0 ? <span className="text-emerald-500 font-bold uppercase text-[10px]">Waived</span> : `₹${platformFee}`}
                </span>
              </div>

              <hr className="border-slate-200 dark:border-slate-800 my-1" />

              <div className="flex items-center justify-between text-sm text-slate-900 dark:text-white font-black">
                <span className="font-display">Grand Total Amount</span>
                <span className="font-mono-numbers text-base sm:text-lg">₹{grandTotal}</span>
              </div>
            </div>

            {/* Step navigation & Submit CTAs */}
            {checkoutStep === 'cart' ? (
              <button
                onClick={() => { playNotificationSound('click'); setCheckoutStep('checkout'); }}
                className="w-full py-3.5 px-6 bg-slate-900 hover:bg-slate-800 dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white font-black text-xs sm:text-sm rounded-xl transition-all shadow-lg active:scale-[0.98] flex items-center justify-center gap-1.5 min-h-[44px]"
              >
                <span>Proceed to Checkout</span>
                <ChevronRight className="w-4 h-4 shrink-0" />
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={() => { playNotificationSound('click'); setCheckoutStep('cart'); }}
                  className="px-4 py-3.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 text-slate-700 dark:text-slate-300 font-bold text-xs rounded-xl min-h-[44px]"
                  disabled={isPlacing}
                >
                  Back
                </button>
                <button
                  onClick={handleCheckoutSubmit}
                  disabled={isPlacing}
                  className="flex-1 py-3.5 px-4 sm:px-6 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-black text-xs sm:text-sm rounded-xl transition-all shadow-lg shadow-orange-500/10 active:scale-[0.98] flex items-center justify-center gap-2 min-h-[44px]"
                >
                  {isPlacing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin shrink-0" />
                      <span>Connecting order...</span>
                    </>
                  ) : !user ? (
                    <>
                      <Phone className="w-4 h-4 shrink-0" />
                      <span>Sign In & Place Order · ₹{grandTotal}</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4 shrink-0" />
                      <span>Place Order · ₹{grandTotal}</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
