import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // 1. Verifikasi Signature Key (Keamanan)
    const serverKey = process.env.MIDTRANS_SERVER_KEY || "";
    const signatureSource = body.order_id + body.status_code + body.gross_amount + serverKey;
    const signature = crypto.createHash("sha512").update(signatureSource).digest("hex");

    if (signature !== body.signature_key) {
      return NextResponse.json({ message: "Invalid Signature" }, { status: 403 });
    }

    const orderId = body.order_id;
    const transactionStatus = body.transaction_status;
    const fraudStatus = body.fraud_status;

    console.log(`Webhook received: Order ID ${orderId}, Status ${transactionStatus}`);

    // 2. Update Status Booking di Database
    let bookingStatus: "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED" = "PENDING";

    if (transactionStatus === "capture" || transactionStatus === "settlement") {
      if (fraudStatus === "accept" || !fraudStatus) {
        bookingStatus = "CONFIRMED";
      }
    } else if (
      transactionStatus === "cancel" ||
      transactionStatus === "deny" ||
      transactionStatus === "expire"
    ) {
      bookingStatus = "CANCELLED";
    } else if (transactionStatus === "pending") {
      bookingStatus = "PENDING";
    }

    await prisma.booking.update({
      where: { id: orderId },
      data: { status: bookingStatus },
    });

    return NextResponse.json({ message: "OK" });
  } catch (error) {
    console.error("Webhook Error:", error);
    return NextResponse.json({ message: "Error" }, { status: 500 });
  }
}
