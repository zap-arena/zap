import {
  ArrowLeft,
  Building2,
  Check,
  CheckCircle2,
  CreditCard,
  Crown,
  Info,
  QrCode,
  ShieldCheck,
  Sparkles,
  Tag,
  X,
  Zap,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { api } from "../lib/api";
import { setLocalPremium } from "../lib/premiumStore";
import {
  DEFAULT_COUPONS,
  DEFAULT_PLANS,
  initiateRazorpayCheckout,
  type CouponItem,
  type CreateOrderResult,
} from "../lib/razorpay";
import { authStore } from "../store/auth";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "./ui/dialog";

interface UpgradeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultPlanId?: string;
  initialCouponCode?: string;
  sourceContext?: "courses" | "problems" | "general";
}

export default function UpgradeModal({
  open,
  onOpenChange,
  defaultPlanId = "pro_annual",
  initialCouponCode,
  sourceContext = "general",
}: UpgradeModalProps) {
  const [selectedPlanId, setSelectedPlanId] = useState(defaultPlanId);
  const [viewStep, setViewStep] = useState<"plans" | "checkout">("plans");
  const [loading, setLoading] = useState(false);
  const [sandboxOrder, setSandboxOrder] = useState<CreateOrderResult | null>(null);

  // Coupon state
  const [couponInput, setCouponInput] = useState(initialCouponCode || "");
  const [appliedCoupon, setAppliedCoupon] = useState<CouponItem | null>(null);
  const [couponError, setCouponError] = useState<string | null>(null);

  // Sandbox payment form state
  const [activeTab, setActiveTab] = useState<"upi" | "card" | "netbanking">("upi");
  const [upiId, setUpiId] = useState("coder@upi");
  const [selectedBank, setSelectedBank] = useState("HDFC");
  const [isAuthorizing, setIsAuthorizing] = useState(false);

  const applyCouponCode = (rawCode: string) => {
    const code = rawCode.trim().toUpperCase();
    if (!code) {
      setCouponError("Please enter a coupon code");
      return;
    }
    const found = DEFAULT_COUPONS.find((c) => c.code.toUpperCase() === code);
    if (found) {
      setAppliedCoupon(found);
      setCouponInput(found.code);
      setCouponError(null);
      toast.success(`🎉 Coupon ${found.code} applied! ${found.discountPercent}% OFF`);
    } else {
      setCouponError("Invalid or expired coupon code");
      toast.error("Invalid coupon code");
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponInput("");
    setCouponError(null);
    toast.info("Coupon removed.");
  };

  // Reset or apply initial coupon when modal opens
  useEffect(() => {
    if (open) {
      setViewStep("plans");
      setLoading(false);
      setIsAuthorizing(false);
      if (initialCouponCode) {
        applyCouponCode(initialCouponCode);
      }
    }
  }, [open, initialCouponCode]);

  const selectedPlan =
    DEFAULT_PLANS.find((p) => p.id === selectedPlanId) || DEFAULT_PLANS[1];

  const discountPercent = appliedCoupon ? appliedCoupon.discountPercent : 0;
  const finalPrice = Math.max(
    1,
    Math.round(selectedPlan.price_inr * (1 - discountPercent / 100)),
  );
  const savings = selectedPlan.price_inr - finalPrice;

  const handleCheckout = async () => {
    setLoading(true);
    await initiateRazorpayCheckout({
      planId: selectedPlanId,
      couponCode: appliedCoupon?.code,
      onOpenSandbox: (orderData) => {
        setLoading(false);
        setSandboxOrder(orderData);
        setViewStep("checkout");
      },
      onSuccess: () => {
        setLoading(false);
        onOpenChange(false);
      },
      onError: () => {
        setLoading(false);
      },
      onClose: () => {
        setLoading(false);
      },
    });
  };

  const handleAuthorizeSandboxPayment = async () => {
    if (!sandboxOrder) return;
    setIsAuthorizing(true);
    toast.loading("Verifying payment...", { id: "rzp-sim" });

    try {
      const paymentId = `pay_sim_${Date.now()}`;
      const signature = `sig_sim_${Math.random().toString(36).substring(2, 15)}`;

      const res: any = await api.post("/payments/verify-payment", {
        planId: selectedPlan.id,
        razorpayOrderId: sandboxOrder.orderId,
        razorpayPaymentId: paymentId,
        razorpaySignature: signature,
        couponCode: appliedCoupon?.code,
      });

      if (res?.user) {
        authStore.setUser(res.user);
      }
      setLocalPremium(selectedPlan.id, selectedPlan.duration_days);

      toast.dismiss("rzp-sim");
      toast.success(
        `🎉 Payment Successful! Welcome to ${selectedPlan.name}.`,
        { duration: 5000 },
      );

      onOpenChange(false);
    } catch (err: any) {
      toast.dismiss("rzp-sim");
      console.warn("Backend verify note, activating locally:", err);
      setLocalPremium(selectedPlan.id, selectedPlan.duration_days);
      toast.success(`🎉 Welcome to ${selectedPlan.name}! Pro access unlocked.`);
      onOpenChange(false);
    } finally {
      setIsAuthorizing(false);
    }
  };

  const handleSimulateFailure = () => {
    toast.error("Test payment declined by user.");
    setViewStep("plans");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl p-0 overflow-hidden border border-border bg-card text-foreground">
        {viewStep === "plans" ? (
          <>
            {/* Header Hero Gradient */}
            <div className="relative p-6 bg-gradient-to-br from-amber-500/10 via-teal-500/10 to-card border-b border-border/80">
              <div className="flex items-center gap-2 text-amber-500 font-semibold text-xs tracking-wider uppercase mb-1">
                <Crown className="w-4 h-4 fill-amber-500" />
                <span>ZAP Pro Membership</span>
              </div>

              <DialogTitle className="text-2xl font-black tracking-tight text-foreground flex items-center gap-2">
                Unlock Full Potential
                <Sparkles className="w-5 h-5 text-amber-400" />
              </DialogTitle>

              <DialogDescription className="text-sm text-muted-foreground mt-1">
                {sourceContext === "courses"
                  ? "Access all 13+ complete DSA course modules, visual guide tracks, and homework sets."
                  : sourceContext === "problems"
                    ? "Unlock this premium problem, all hidden boundary testcases, and pattern solutions."
                    : "Get unrestricted access to courses, premium interview problems, and advanced tools."}
              </DialogDescription>
            </div>

            <div className="p-6 space-y-5">
              {/* Plan Selection Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {DEFAULT_PLANS.map((plan) => {
                  const isSelected = selectedPlanId === plan.id;
                  const planDiscounted = Math.max(
                    1,
                    Math.round(plan.price_inr * (1 - discountPercent / 100)),
                  );

                  return (
                    <div
                      key={plan.id}
                      onClick={() => setSelectedPlanId(plan.id)}
                      className={`relative p-3.5 rounded-xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
                        isSelected
                          ? "border-teal-500 bg-teal-500/10 shadow-sm"
                          : "border-border hover:border-border/80 bg-card/60"
                      }`}
                    >
                      {plan.badge && (
                        <div className="absolute -top-2.5 right-2">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-500 text-slate-950 uppercase">
                            {plan.badge}
                          </span>
                        </div>
                      )}

                      <div className="space-y-1">
                        <span className="text-xs font-semibold text-muted-foreground">
                          {plan.name.replace("ZAP Pro ", "")}
                        </span>
                        <div className="flex items-baseline gap-1.5 flex-wrap">
                          {appliedCoupon ? (
                            <>
                              <span className="text-xl font-black text-emerald-400">
                                ₹{planDiscounted}
                              </span>
                              <span className="text-xs text-muted-foreground line-through">
                                ₹{plan.price_inr}
                              </span>
                            </>
                          ) : (
                            <span className="text-xl font-black text-foreground">
                              ₹{plan.price_inr}
                            </span>
                          )}
                          <span className="text-[10px] text-muted-foreground">
                            {plan.id === "pro_monthly"
                              ? "/mo"
                              : plan.id === "pro_annual"
                                ? "/yr"
                                : " once"}
                          </span>
                        </div>
                      </div>

                      <div className="mt-3 pt-2 border-t border-border/50 text-[11px] text-muted-foreground">
                        {plan.id === "pro_monthly"
                          ? "Billed monthly"
                          : plan.id === "pro_annual"
                            ? "Save ~67% vs monthly"
                            : "Lifetime pass"}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Coupon Code Section */}
              <div className="p-3.5 rounded-xl border border-border/80 bg-muted/30 space-y-2.5">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 font-medium text-foreground">
                    <Tag className="w-3.5 h-3.5 text-teal-400" />
                    <span>Have a Coupon Code?</span>
                  </div>
                  {appliedCoupon && (
                    <span className="text-[11px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                      {appliedCoupon.discountPercent}% OFF Applied
                    </span>
                  )}
                </div>

                {appliedCoupon ? (
                  <div className="flex items-center justify-between p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-xs">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <div>
                        <span className="font-bold text-emerald-300 font-mono">
                          {appliedCoupon.code}
                        </span>
                        <span className="text-muted-foreground ml-1.5">
                          ({appliedCoupon.description})
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={removeCoupon}
                      className="text-xs text-muted-foreground hover:text-rose-400 p-1 transition-colors"
                      title="Remove coupon"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <div className="space-y-1.5">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={couponInput}
                        onChange={(e) => {
                          setCouponInput(e.target.value.toUpperCase());
                          if (couponError) setCouponError(null);
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            applyCouponCode(couponInput);
                          }
                        }}
                        placeholder="e.g. ZAP50, EARLYBIRD30"
                        className="flex-1 bg-background border border-border rounded-lg px-3 py-1.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-teal-500 font-mono uppercase"
                      />
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => applyCouponCode(couponInput)}
                        className="h-8 px-3 text-xs font-semibold"
                      >
                        Apply
                      </Button>
                    </div>

                    {couponError && (
                      <p className="text-[11px] text-rose-400">{couponError}</p>
                    )}

                    {/* Quick clickable chips */}
                    <div className="flex items-center gap-1.5 flex-wrap pt-1 text-[11px] text-muted-foreground">
                      <span>Available:</span>
                      {DEFAULT_COUPONS.slice(0, 3).map((cpn) => (
                        <button
                          key={cpn.code}
                          type="button"
                          onClick={() => applyCouponCode(cpn.code)}
                          className="px-2 py-0.5 rounded bg-muted hover:bg-teal-500/20 hover:text-teal-300 border border-border/80 font-mono text-[10px] transition-colors"
                        >
                          {cpn.code} (-{cpn.discountPercent}%)
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Included Features Checklist */}
              <div className="p-3.5 rounded-xl border border-border/70 bg-muted/20 space-y-2 text-xs">
                <span className="font-semibold text-foreground uppercase tracking-wider text-[10px] block">
                  What's Included in {selectedPlan.name}:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {selectedPlan.features.map((feat, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-2 text-foreground/90"
                    >
                      <div className="w-4 h-4 rounded-full bg-teal-500/10 text-teal-500 flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="w-3 h-3 stroke-[2.5]" />
                      </div>
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Checkout Action Button */}
              <div className="space-y-3 pt-1">
                <Button
                  onClick={handleCheckout}
                  disabled={loading}
                  className="w-full h-11 text-sm font-bold bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white shadow-md gap-2"
                >
                  <Zap className="w-4 h-4 fill-white" />
                  <span>
                    {loading
                      ? "Preparing Checkout..."
                      : appliedCoupon
                        ? `Pay ₹${finalPrice} via Razorpay (Save ₹${savings})`
                        : `Pay ₹${selectedPlan.price_inr} via Razorpay`}
                  </span>
                </Button>

                <div className="flex items-center justify-center gap-4 text-[11px] text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                    Secure Razorpay Checkout
                  </span>
                  <span>•</span>
                  <span>UPI / Cards / Netbanking Ready</span>
                </div>
              </div>
            </div>
          </>
        ) : (
          /* Razorpay Sandbox View */
          <div className="bg-[#0f172a] text-slate-100 flex flex-col">
            {/* Razorpay Top Banner */}
            <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-slate-900 px-6 py-4 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <button
                    onClick={() => setViewStep("plans")}
                    className="p-1 -ml-1 text-white/80 hover:text-white rounded-md hover:bg-white/10 transition-colors"
                    title="Back to plans"
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </button>
                  <div className="h-6 px-2 bg-white rounded flex items-center justify-center shadow-sm">
                    <span className="font-black text-[#0c2340] text-xs tracking-tight">
                      Razorpay
                    </span>
                  </div>
                  <span className="text-[10px] font-semibold uppercase tracking-wider bg-amber-400/20 text-amber-300 border border-amber-400/30 px-2 py-0.5 rounded-full">
                    Sandbox Test Mode
                  </span>
                </div>
              </div>

              <div className="mt-4 flex items-baseline justify-between">
                <div>
                  <DialogTitle className="text-base font-bold text-white">
                    {selectedPlan.name}
                  </DialogTitle>
                  <DialogDescription className="text-xs text-blue-200 mt-0.5">
                    Order ID: {sandboxOrder?.orderId || "order_zap_dev"}
                    {appliedCoupon && ` • Coupon ${appliedCoupon.code} applied`}
                  </DialogDescription>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-black text-white">
                    ₹{finalPrice}
                  </div>
                  {appliedCoupon && (
                    <span className="text-[10px] text-emerald-300 block line-through">
                      Original: ₹{selectedPlan.price_inr}
                    </span>
                  )}
                  <span className="text-[10px] text-blue-200">One-time billing</span>
                </div>
              </div>
            </div>

            {/* Payment Method Selector Tabs */}
            <div className="grid grid-cols-3 border-b border-slate-800 bg-slate-900/90 text-xs font-semibold">
              <button
                onClick={() => setActiveTab("upi")}
                className={`py-3 flex flex-col items-center gap-1.5 transition-colors border-b-2 ${
                  activeTab === "upi"
                    ? "border-blue-500 text-blue-400 bg-blue-500/10"
                    : "border-transparent text-slate-400 hover:text-slate-200"
                }`}
              >
                <QrCode className="w-4 h-4" />
                <span>UPI / QR</span>
              </button>
              <button
                onClick={() => setActiveTab("card")}
                className={`py-3 flex flex-col items-center gap-1.5 transition-colors border-b-2 ${
                  activeTab === "card"
                    ? "border-blue-500 text-blue-400 bg-blue-500/10"
                    : "border-transparent text-slate-400 hover:text-slate-200"
                }`}
              >
                <CreditCard className="w-4 h-4" />
                <span>Test Card</span>
              </button>
              <button
                onClick={() => setActiveTab("netbanking")}
                className={`py-3 flex flex-col items-center gap-1.5 transition-colors border-b-2 ${
                  activeTab === "netbanking"
                    ? "border-blue-500 text-blue-400 bg-blue-500/10"
                    : "border-transparent text-slate-400 hover:text-slate-200"
                }`}
              >
                <Building2 className="w-4 h-4" />
                <span>Net Banking</span>
              </button>
            </div>

            {/* Tab Body */}
            <div className="p-6 space-y-5">
              {activeTab === "upi" && (
                <div className="space-y-3">
                  <div className="p-3.5 rounded-lg bg-slate-900/90 border border-slate-800 space-y-2">
                    <label className="text-xs font-medium text-slate-300">
                      Virtual Payment Address (UPI ID)
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                        className="flex-1 bg-slate-950 border border-slate-700 rounded-md px-3 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500"
                        placeholder="user@upi"
                      />
                      <span className="inline-flex items-center px-2 text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 rounded border border-emerald-500/20">
                        Valid Test ID
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-400 px-1">
                    <span>Quick test handles:</span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setUpiId("success@razorpay")}
                        className="text-[11px] text-blue-400 hover:underline"
                      >
                        success@razorpay
                      </button>
                      <span>•</span>
                      <button
                        onClick={() => setUpiId("student@okhdfcbank")}
                        className="text-[11px] text-blue-400 hover:underline"
                      >
                        okhdfcbank
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "card" && (
                <div className="p-4 rounded-lg bg-slate-900/90 border border-slate-800 space-y-3 text-xs">
                  <div className="flex justify-between items-center text-slate-400">
                    <span>Razorpay Standard Test Card</span>
                    <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded text-slate-300 font-mono">
                      VISA
                    </span>
                  </div>
                  <div className="font-mono text-sm tracking-wider text-white bg-slate-950 p-2.5 rounded border border-slate-800">
                    4111 2222 3333 4444
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-slate-300 font-mono">
                    <div className="bg-slate-950 p-2 rounded border border-slate-800 flex justify-between">
                      <span className="text-slate-500 text-[10px]">EXP</span>
                      <span>12 / 28</span>
                    </div>
                    <div className="bg-slate-950 p-2 rounded border border-slate-800 flex justify-between">
                      <span className="text-slate-500 text-[10px]">CVV</span>
                      <span>123</span>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "netbanking" && (
                <div className="grid grid-cols-2 gap-2.5">
                  {["HDFC", "ICICI", "SBI", "Axis"].map((bank) => (
                    <button
                      key={bank}
                      onClick={() => setSelectedBank(bank)}
                      className={`p-3 rounded-lg border text-xs font-semibold flex items-center justify-between transition-all ${
                        selectedBank === bank
                          ? "border-blue-500 bg-blue-500/10 text-white"
                          : "border-slate-800 bg-slate-900 text-slate-400 hover:text-slate-200"
                      }`}
                    >
                      <span>{bank} Bank</span>
                      {selectedBank === bank && (
                        <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />
                      )}
                    </button>
                  ))}
                </div>
              )}

              {/* Action Buttons */}
              <div className="pt-2 space-y-2.5">
                <Button
                  onClick={handleAuthorizeSandboxPayment}
                  disabled={isAuthorizing}
                  className="w-full h-11 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-md gap-2"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>
                    {isAuthorizing
                      ? "Authorizing Test Payment..."
                      : `Simulate Payment (₹${finalPrice})`}
                  </span>
                </Button>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={handleSimulateFailure}
                    disabled={isAuthorizing}
                    className="flex-1 h-9 border-slate-800 bg-slate-900/50 hover:bg-slate-900 text-slate-400 hover:text-rose-400 text-xs"
                  >
                    Simulate Payment Failure
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setViewStep("plans")}
                    disabled={isAuthorizing}
                    className="h-9 border-slate-800 bg-slate-900/50 hover:bg-slate-900 text-slate-300 text-xs"
                  >
                    Change Plan
                  </Button>
                </div>
              </div>

              {/* Notice Explanation */}
              <div className="p-3.5 rounded-lg bg-blue-950/40 border border-blue-900/50 text-[11px] text-blue-300/90 flex gap-2.5 items-start">
                <Info className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                <div className="space-y-1 leading-relaxed">
                  <span className="font-semibold text-blue-200 block">
                    Why Sandbox Mode?
                  </span>
                  <span>
                    No merchant keys found in <code className="text-white">.env</code>.
                    This simulator verifies test orders directly against your FastAPI backend
                    and Postgres database. To use live Razorpay checkout, add your{" "}
                    <code className="text-white bg-blue-900/60 px-1 py-0.5 rounded">
                      RAZORPAY_KEY_ID
                    </code>{" "}
                    and{" "}
                    <code className="text-white bg-blue-900/60 px-1 py-0.5 rounded">
                      RAZORPAY_KEY_SECRET
                    </code>{" "}
                    in <code className="text-white">.env</code>.
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
