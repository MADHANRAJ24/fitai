"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Loader2, Lock } from "lucide-react";

interface RazorpayModalProps {
    isOpen: boolean;
    onClose: () => void;
    planName: string;
    price: string;
    onSuccess: () => void;
}

export function RazorpayModal({
    isOpen,
    onClose,
    planName,
    price,
    onSuccess,
}: RazorpayModalProps) {
    const [isLoading, setIsLoading] = useState(false);
    // const { toast } = useToast(); 

    const loadRazorpayScript = () => {
        return new Promise((resolve) => {
            const script = document.createElement("script");
            script.src = "https://checkout.razorpay.com/v1/checkout.js";
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    };

    const handlePayment = async () => {
        setIsLoading(true);

        const res = await loadRazorpayScript();

        if (!res) {
            alert("Razorpay SDK failed to load. Are you online?");
            setIsLoading(false);
            return;
        }

        // 1. Create Order
        const orderRes = await fetch("/api/create-razorpay-order", {
            method: "POST",
            body: JSON.stringify({
                amount: parseFloat(price.replace("$", "")), // Clean price string
            }),
        });

        const orderData = await orderRes.json();

        if (!orderData.id) {
            alert("Server error. Could not create order.");
            setIsLoading(false);
            return;
        }

        // 2. Options
        const options = {
            key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
            amount: orderData.amount,
            currency: orderData.currency,
            name: "FitAI Bio-Hacking",
            description: `Upgrade to ${planName}`,
            image: "https://example.com/your_logo.png", // Optional
            order_id: orderData.id,
            handler: function (response: any) {
                // Validation success
                // alert(`Payment ID: ${response.razorpay_payment_id}`);
                // alert(`Order ID: ${response.razorpay_order_id}`);
                // alert(`Signature: ${response.razorpay_signature}`);
                onSuccess();
                onClose();
            },
            prefill: {
                name: "Agent FitAI",
                email: "user@fitai.com",
                contact: "9999999999",
            },
            notes: {
                address: "FitAI HQ",
            },
            theme: {
                color: "#10b981", // Emerald-500
            },
        };

        // 3. Open
        const paymentObject = new (window as any).Razorpay(options);
        paymentObject.open();
        setIsLoading(false);
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="glass border-white/10 text-white sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Lock className="h-4 w-4 text-emerald-500" />
                        Secure Checkout (Razorpay)
                    </DialogTitle>
                    <DialogDescription className="text-muted-foreground">
                        Upgrading to {planName} via Razorpay Secure Gateway.
                    </DialogDescription>
                </DialogHeader>

                <div className="flex flex-col items-center justify-center py-6 space-y-4">
                    <p className="text-sm text-center text-muted-foreground">
                        You will be redirected to the secure payment window.
                        <br />
                        (Supports UPI, Cards, NetBanking)
                    </p>

                    <Button
                        onClick={handlePayment}
                        disabled={isLoading}
                        className="w-full bg-emerald-500 hover:bg-emerald-600 text-white h-12 text-lg font-bold shadow-[0_0_20px_rgba(16,185,129,0.4)]"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Initializing...
                            </>
                        ) : (
                            `Pay ${price}`
                        )}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
