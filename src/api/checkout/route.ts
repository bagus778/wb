import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { email, produkId, namaProduk, harga } = await req.json();
    
    if (!email || !produkId || !harga) {
      return NextResponse.json({ success: false, message: 'Data tidak lengkap' }, { status: 400 });
    }

    const orderId = `PTERO-${Date.now()}`;
    const secretKeyBase64 = Buffer.from(process.env.MIDTRANS_SERVER_KEY + ':').toString('base64');
    
    const isProd = process.env.MIDTRANS_IS_PRODUCTION === 'true';
    const midtransUrl = isProd 
      ? 'https://app.midtrans.com/snap/v1/transactions' 
      : 'https://app.sandbox.midtrans.com/snap/v1/transactions';

    const payload = {
      transaction_details: { order_id: orderId, gross_amount: harga },
      customer_details: { email: email },
      item_details: [{ id: produkId, price: harga, quantity: 1, name: namaProduk }],
      payment_type: "gopay"
    };

    const response = await fetch(midtransUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Basic ${secretKeyBase64}`
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();
    return NextResponse.json({ success: true, redirect_url: data.redirect_url, orderId });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Server Error' }, { status: 500 });
  }
}
