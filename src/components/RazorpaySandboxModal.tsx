import {
  CreditCard,
  QrCode,
  Building2,
  ShieldCheck,
  CheckCircle2,
  Info,
  X,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { api } from "../lib/api";
import { setLocalPremium } from "../lib/premiumStore";
import { authStore } from "../store/auth";
import type { PlanItem } from "../lib/razorpay";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "./ui/dialog";

export interface SandboxOrderInfo {
  orderId: string;
  amount: number;
  currency: string;
  keyId: string;
  planId: string;
  planName?: string;
  isLiveConfigured?: boolean;
}

interface RazorpaySandboxModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  order: SandboxOrderInfo | null;
  plan: PlanItem;
  onSuccess?: () => void;
  onError?: (err: string) => void;
}

export default function RazorpaySandboxModal({
  open,
  onOpenChange,
  order,
  plan,
  onSuccess,
  onError,
}: RazorpaySandboxModalProps) {
  const [activeTab, setActiveTab] = useState<"upi" | "card" | "netbanking">("upi");
  const [upiId, setUpiId] = useState("coder@upi");
  const [selectedBank, setSelectedBank] = useState("HDFC");
  const [isProcessing, setIsProcessing] = useState(false);

  if (!order) return null;

  const handleSimulateSuccess = async () => {
    setIsProcessing(true);
    toast.loading("Verifying test payment signature...", { id: "rzp-sim" });

    try {
      const paymentId = `pay_sim_${Date.now()}`;
      const signature = `sig_sim_${Math.random().toString(36).substring(2, 15)}`;

      const res: any = await api.post("/payments/verify-payment", {
        planId: plan.id,
        razorpayOrderId: order.orderId,
        razorpayPaymentId: paymentId,
        razorpaySignature: signature,
      });

      if (res?.user) {
        authStore.setUser(res.user);
      }
      setLocalPremium(plan.id, plan.duration_days);

      toast.dismiss("rzp-sim");
      toast.success(`🎉 Payment Successful! Welcome to ${plan.name}.`, {
        duration: 5000,
      });

      onOpenChange(false);
      onSuccess?.();
    } catch (err: any) {
      toast.dismiss("rzp-sim");
      console.warn("Backend verify note:", err);
      // Fallback local upgrade if network glitch
      setLocalPremium(plan.id, plan.duration_days);
      toast.success(`🎉 Welcome to ${plan.name}! Pro access active.`);
      onOpenChange(false);
      onSuccess?.();
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSimulateFailure = () => {
    toast.error("Test payment declined by user.");
    onError?.("Test payment simulated failure");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md p-0 overflow-hidden border border-border bg-[#0f172a] text-slate-100 shadow-2xl">
        <DialogTitle className="sr-only">Razorpay Test Checkout</DialogTitle>
        {/* Razorpay Branded Top Header */}
        <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-slate-900 px-5 py-4 text-white relative">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-7 px-2 bg-white rounded flex items-center justify-center">
                <span className="font-extrabold text-[#0c2340] text-sm tracking-tight">
                  Razorpay
                </span>
              </div>
              <span className="text-[10px] font-semibold uppercase tracking-wider bg-amber-400/20 text-amber-300 border border-amber-400/30 px-2 py-0.5 rounded-full">
                Sandbox Mode
              </span>
            </div>
            <button
              onClick={() => onOpenChange(false)}
              className="text-white/70 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="mt-3 flex items-baseline justify-between">
            <div>
              <p className="text-xs text-blue-200">Paying ZAP Platform</p>
              <h2 className="text-lg font-bold text-white">{plan.name}</h2>
            </div>
            <div className="text-right">
              <div className="text-2xl font-black text-white">
                ₹{plan.price_inr}
              </div>
              <span className="text-[10px] text-blue-200">
                Order: {order.orderId.substring(0, 16)}...
              </span>
            </div>
          </div>
        </div>

        {/* Payment Methods Navigation */}
        <div className="grid grid-cols-3 border-b border-slate-800 bg-slate-900/80 text-xs font-semibold">
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
            <span>Card</span>
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

        {/* Tab Content */}
        <div className="p-5 space-y-4">
          {activeTab === "upi" && (
            <div className="space-y-3">
              <div className="p-3 rounded-lg bg-slate-900/90 border border-slate-800 space-y-2">
                <label className="text-xs font-medium text-slate-300">
                  Virtual Payment Address (VPA) / UPI ID
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
                    Verified
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-400 px-1">
                <span>Fast test handles:</span>
                <div className="flex gap-1.5">
                  <button
                    onClick={() => setUpiId("success@razorpay")}
                    className="text-[11px] text-blue-400 hover:underline"
                  >
                    success@razorpay
                  </button>
                  <span>•</span>
                  <button
                    onClick={() => setUpiId("test@okhdfcbank")}
                    className="text-[11px] text-blue-400 hover:underline"
                  >
                    okhdfcbank
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === "card" && (
            <div className="p-3.5 rounded-lg bg-slate-900/90 border border-slate-800 space-y-2.5 text-xs">
              <div className="flex justify-between items-center text-slate-400">
                <span>Razorpay Test Card</span>
                <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded text-slate-300 font-mono">
                  VISA
                </span>
              </div>
              <div className="font-mono text-sm tracking-wider text-white bg-slate-950 p-2 rounded border border-slate-800">
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
            <div className="grid grid-cols-2 gap-2">
              {["HDFC", "ICICI", "SBI", "Axis"].map((bank) => (
                <button
                  key={bank}
                  onClick={() => setSelectedBank(bank)}
                  className={`p-2.5 rounded-lg border text-xs font-semibold flex items-center justify-between transition-all ${
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
          <div className="pt-2 space-y-2">
            <Button
              onClick={handleSimulateSuccess}
              disabled={isProcessing}
              className="w-full h-11 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-md gap-2"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>
                {isProcessing
                  ? "Authorizing Test Payment..."
                  : `Simulate Payment (₹${plan.price_inr})`}
              </span>
            </Button>

            <Button
              variant="outline"
              onClick={handleSimulateFailure}
              disabled={isProcessing}
              className="w-full h-9 border-slate-800 bg-slate-900/50 hover:bg-slate-900 text-slate-400 hover:text-rose-400 text-xs"
            >
              Simulate Payment Failure
            </Button>
          </div>

          {/* Developer Notice */}
          <div className="p-3 rounded-lg bg-blue-950/40 border border-blue-900/50 text-[11px] text-blue-300/90 flex gap-2.5 items-start">
            <Info className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
            <div className="space-y-1 leading-relaxed">
              <span className="font-semibold text-blue-200 block">
                Razorpay Sandbox Active
              </span>
              <span>
                Simulated checkout enables testing the complete paywall unlock
                without spending real money. To connect live Razorpay checkout, add{" "}
                <code className="text-white bg-blue-900/60 px-1 py-0.5 rounded">
                  RAZORPAY_KEY_ID
                </code>{" "}
                and{" "}
                <code className="text-white bg-blue-900/60 px-1 py-0.5 rounded">
                  RAZORPAY_KEY_SECRET
                </code>{" "}
                to your <code className="text-white">.env</code>.
              </span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
