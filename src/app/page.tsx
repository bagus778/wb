'use client';

import React, { useState } from 'react';
import { Server, Code, Terminal, Cpu, HardDrive, ShieldCheck } from 'lucide-react';

const PRODUK_LIST = [
  { id: 'ptero-2gb', type: 'PANEL', nama: 'Ptero Node Premium 2GB', harga: 15000, ram: '2 GB', cpu: '100% Core', disk: '5 GB' },
  { id: 'script-bot', type: 'SCRIPT', nama: 'Source Code Bot WhatsApp Multi-Device', harga: 35000, ram: 'Lightweight', cpu: 'Node.js', disk: 'Unlimited' }
];

export default function StorePage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState<string | null>(null);

  const handleBeli = async (produk: typeof PRODUK_LIST[0]) => {
    if (!email.includes('@')) {
      alert('Masukkan alamat email yang valid untuk pengiriman!');
      return;
    }

    setLoading(produk.id);

    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, produkId: produk.id, namaProduk: produk.nama, harga: produk.harga })
      });
      const data = await res.json();
      
      if (data.redirect_url) {
        window.location.href = data.redirect_url;
      } else {
        alert('Gagal mendapatkan link pembayaran Midtrans');
      }
    } catch (err) {
      alert('Terjadi kesalahan jaringan');
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-16 relative z-10">
      {/* Header Ala termai.cc */}
      <div className="text-center mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-zinc-800 bg-zinc-900/50 text-xs text-zinc-400 mb-4">
          <Terminal size={12} className="text-purple-400" /> system_status: online
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
          AUTOMATED <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">CYBERSTORE</span>
        </h1>
        <p className="mt-4 text-sm text-zinc-400 max-w-md mx-auto">
          Pembayaran QRIS otomatis menggunakan Midtrans. Bayar sukses, sistem langsung bekerja secara instan.
        </p>
      </div>

      {/* Input Email User */}
      <div className="max-w-md mx-auto mb-12 p-6 rounded-xl border border-zinc-800 bg-zinc-900/30 backdrop-blur-sm">
        <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">Email Penerima</label>
        <input 
          type="email" 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="ex: user@gmail.com"
          className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500 transition-colors"
        />
      </div>

      {/* Grid Produk */}
      <div className="grid md:grid-cols-2 gap-8">
        {PRODUK_LIST.map((produk) => (
          <div key={produk.id} className="group relative overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/20 backdrop-blur-md p-6 transition-all duration-300 hover:border-zinc-700 hover:shadow-[0_0_30px_rgba(147,51,234,0.05)]">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2.5 rounded-lg bg-zinc-900 border border-zinc-800 text-purple-400">
                {produk.type === 'PANEL' ? <Server size={20} /> : <Code size={20} />}
              </div>
              <span className="text-[10px] uppercase font-bold tracking-widest px-2.5 py-0.5 rounded border border-purple-500/30 bg-purple-500/10 text-purple-400">
                {produk.type}
              </span>
            </div>

            <h3 className="text-lg font-bold text-white group-hover:text-purple-400 transition-colors">{produk.nama}</h3>
            
            <div className="grid grid-cols-3 gap-2 my-6 text-xs text-zinc-400">
              <div className="flex items-center gap-1.5 p-2 rounded bg-zinc-900/50 border border-zinc-800/60"><Cpu size={12}/> {produk.cpu}</div>
              <div className="flex items-center gap-1.5 p-2 rounded bg-zinc-900/50 border border-zinc-800/60"><Server size={12}/> {produk.ram}</div>
              <div className="flex items-center gap-1.5 p-2 rounded bg-zinc-900/50 border border-zinc-800/60"><HardDrive size={12}/> {produk.disk}</div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-zinc-800/80">
              <div>
                <span className="block text-[10px] text-zinc-500 uppercase font-semibold">Harga Pas</span>
                <span className="text-xl font-black text-white">Rp {produk.harga.toLocaleString('id-ID')}</span>
              </div>
              
              <button
                onClick={() => handleBeli(produk)}
                disabled={loading !== null}
                className="inline-flex items-center gap-2 bg-white text-black font-semibold text-xs px-5 py-2.5 rounded-lg transition-transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
              >
                {loading === produk.id ? 'Memproses...' : 'Beli Instan'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
