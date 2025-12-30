import { NextResponse } from "next/server";
import Razorpay from "razorpay";

export async function POST(request: Request) {
    try {
        const { amount } = await request.json();

        // Initialize Razorpay instance inside the handler to avoid build-time errors
        // if environment variables are missing during static generation.
        const razorpay = new Razorpay({
            key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "mock_key_id",
            key_secret: process.env.RAZORPAY_KEY_SECRET || "mock_key_secret",
        });

        // Razorpay works in Paisa (1 INR = 100 Paisa)
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
            { error: "Could not create order", details: (error as any).message || JSON.stringify(error) },
            { status: 500 }
        );
    }
}
