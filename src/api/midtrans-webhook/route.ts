import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { transaction_status, order_id, fraud_status } = body;

    if (transaction_status === 'settlement' && fraud_status === 'accept') {
      console.log(`[SUCCESS] Pembayaran terkonfirmasi untuk Order: ${order_id}`);

      // 1. Membuat akun user baru di Pterodactyl
      const userPayload = {
        email: `client-${Date.now()}@cyberstore.com`,
        username: `user_${Date.now().toString().slice(-5)}`,
        first_name: "Customer",
        last_name: "Store"
      };

      const userRes = await fetch(`${process.env.PTERODACTYL_URL}/api/application/users`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.PTERODACTYL_API_KEY}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(userPayload)
      });

      if (!userRes.ok) throw new Error('Gagal membuat user di Pterodactyl');
      const userData = await userRes.json();
      const userId = userData.attributes.id;

      // 2. Membuat server baru menggunakan Egg Nginx v3 kamu[span_0](start_span)[span_0](end_span)
      const serverPayload = {
        name: `Server-${order_id}`,
        user: userId,
        egg: 3, // ID Egg Nginx v3 kamu[span_1](start_span)[span_1](end_span)
        nest: 1,
        docker_image: "ghcr.io/ym0t/pterodactyl-nginx-egg:8.4-latest", // Docker image bawaan egg[span_2](start_span)[span_2](end_span)
        startup: "./start-modules.sh", // Startup command bawaan egg[span_3](start_span)[span_3](end_span)
        limits: { memory: 2048, swap: 0, disk: 5120, io: 500, cpu: 100 },
        feature_limits: { databases: 1, allocations: 1, backups: 1 },
        allocation: { default: 1 } // Ubah sesuai ID Port Alokasi Node kamu
      };

      const serverRes = await fetch(`${process.env.PTERODACTYL_URL}/api/application/servers`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.PTERODACTYL_API_KEY}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(serverPayload)
      });

      if (!serverRes.ok) throw new Error('Gagal mendeposisi server Pterodactyl');
      console.log(`[PTERODACTYL] Server otomatis untuk ${order_id} berhasil dibuat!`);
    }

    return NextResponse.json({ status: 'OK' });
  } catch (error: any) {
    console.error(`[ERROR WEBHOOK]: ${error.message}`);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
