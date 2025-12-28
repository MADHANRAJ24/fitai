import { NextResponse } from "next/server";
import Razorpay from "razorpay";

const razorpay = new Razorpay({
    key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
    key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST(request: Request) {
    try {
        const { amount } = await request.json();

        // Razorpay works in Paisa (1 INR = 100 Paisa)
        // We assume 'amount' passed is in USD, so we convert roughly to INR for demo
        // OR if amount is already simple number, we treat it as INR for simplicity in India context
        // Let's assume the price passed is in DOLLARS ($9.99), so we convert to INR (x83) then to Paisa (x100)

        // However, usually plans in India are in ₹. Let's act as if the UI sends the numeric value.
        // We will treat the input simple number as INR for this migration context to keep it standard Indian.
        // e.g. 9.99 -> we will just make it a round 999 INR for simplicity or keep logic consistent.

        // Better approach: To keep the UI showing $, we can do a mock conversion or just charge that number in INR (cheap, but works for demo).
        // Let's convert: $1 = ₹83 approx.

        const amountInINR = Math.round(amount * 84); // Convert USD to INR
        const amountInPaisa = amountInINR * 100;

        const options = {
            amount: amountInPaisa,
            currency: "INR",
            receipt: `receipt_${Date.now()}`,
        };

        const order = await razorpay.orders.create(options);

        return NextResponse.json({
            id: order.id,
            currency: order.currency,
            amount: order.amount,
        });
    } catch (error) {
        console.error("Razorpay Error:", error);
        return NextResponse.json(
            { error: "Could not create order" },
            { status: 500 }
        );
    }
}
