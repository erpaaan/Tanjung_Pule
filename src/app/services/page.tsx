'use client';

import { useState } from 'react';

export default function Services() {
  const [name, setName] = useState('');
  const [nik, setNik] = useState(''); 
  const [documentType, setDocumentType] = useState('Surat Pengantar Domisili'); 
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<{ type: 'idle' | 'success' | 'error'; message?: string }>({ type: 'idle' });

  const services = [
    { title: "Administrasi Kependudukan", desc: "Pengurusan KTP, Kartu Keluarga, dan Akta Kelahiran.", icon: "🪪" },
    { title: "Surat Keterangan", desc: "Surat Pengantar Nikah, Domisili, dan Keterangan Tidak Mampu (SKTM).", icon: "📄" },
    { title: "Pendaftaran UMKM", desc: "Bantuan legalitas dan pendataan usaha mikro masyarakat desa.", icon: "🛍️" },
    { title: "Layanan Bansos", desc: "Informasi dan pendaftaran bantuan sosial dari pemerintah.", icon: "🤝" },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setStatus({ type: 'idle' });
    
    try {
      // PERBAIKAN: Mengarah ke API surat-pengajuan agar masuk ke tabel yang benar
      const res = await fetch('/api/surat-pengajuan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          nama_lengkap: name, 
          nik: nik,
          jenis_surat: documentType,
          keperluan: message 
        }),
      });

      if (res.ok) {
        setStatus({ type: 'success', message: 'Pengajuan surat Anda telah terkirim. Petugas akan segera memprosesnya!' });
        setName(''); setNik(''); setMessage('');
      } else {
        throw new Error();
      }
    } catch {
      setStatus({ type: 'error', message: 'Gagal mengirim pengajuan. Silakan coba lagi nanti.' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-700 pb-20 font-sans">
      {/* 1. HEADER SECTION - MODIFIKASI: DENGAN BACKGROUND GAMBAR */}
      {/* 1. HEADER SECTION - MODIFIKASI AGAR SEPERTI PROFIL */}
      <section className="relative h-[300px] md:h-[400px] flex items-center justify-center text-white mb-12">
        {/* Container Gambar Background */}
        <div 
          className="absolute inset-0 bg-cover bg-center z-0"
          style={{ 
            backgroundImage: "url('/images/hero3.jpg')" // Menggunakan path yang sama dengan profil
          }}
        >
          {/* Overlay Hijau Tua & Blur (Sesuai kode Profil) */}
          <div className="absolute inset-0 bg-green-900/70 backdrop-blur-sm"></div>
        </div>

        {/* Konten Teks di Atas Background */}
        <div className="relative z-10 text-center px-4">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-4 drop-shadow-md text-white">
            Layanan Desa Tanjung Pule
          </h1>
          <p className="text-lg md:text-xl opacity-90 font-bold max-w-2xl mx-auto text-white drop-shadow-lg italic">
            Layanan administrasi desa kini lebih mudah dengan pengajuan surat secara mandiri dan online.
          </p>
          
          {/* Garis Aksen (Opsional agar makin manis) */}
          <div className="mt-8 flex justify-center">
            <div className="h-1.5 w-24 bg-green-500 rounded-full shadow-lg"></div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 -mt-10">
        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* 2. DAFTAR LAYANAN (KIRI) */}
          <div className="lg:col-span-2 space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              {services.map((item, idx) => (
                <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:border-green-500 transition-colors group">
                  <div className="text-4xl mb-4 group-hover:scale-110 transition-transform inline-block">
                    {item.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{item.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>

            {/* INFO ALUR LAYANAN */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                <span className="bg-green-100 p-2 rounded-lg mr-3">🕒</span> Jam Operasional Kantor
              </h2>
              <div className="grid grid-cols-2 gap-4 text-sm md:text-base">
                <div className="p-4 bg-gray-50 rounded-xl text-center">
                  <p className="text-gray-500 mb-1 font-medium italic text-black">Senin - Kamis</p>
                  <p className="font-bold text-gray-800">08:00 - 15:00 WIB</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl text-center">
                  <p className="text-gray-500 mb-1 font-medium italic text-black">Jumat</p>
                  <p className="font-bold text-gray-800">08:00 - 11:30 WIB</p>
                </div>
              </div>
            </div>
          </div>

          {/* 3. FORMULIR PENGAJUAN SURAT ONLINE (KANAN) */}
          <div className="space-y-6">
            <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-20 h-20 bg-green-50 rounded-bl-full -z-0"></div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2 relative z-10">Pengajuan Surat</h2>
              <p className="text-gray-500 text-sm mb-6 relative z-10">Isi data di bawah ini untuk mengajukan surat keterangan secara online.</p>
              
              <form className="space-y-4 relative z-10" onSubmit={handleSubmit}>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Nama Pemohon (Sesuai KTP)</label>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full p-3 bg-gray-50 border border-transparent focus:border-green-500 focus:bg-white rounded-xl transition-all outline-none text-gray-700"
                    placeholder="Masukkan nama lengkap"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-1 text-black font-bold">NIK (16 Digit)</label>
                  <input
                    value={nik}
                    onChange={(e) => setNik(e.target.value)}
                    required
                    maxLength={16}
                    className="w-full p-3 bg-gray-50 border border-transparent focus:border-green-500 focus:bg-white rounded-xl transition-all outline-none text-gray-700 font-mono text-black font-bold"
                    placeholder="Masukkan 16 digit NIK"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-1 text-black font-bold">Jenis Surat</label>
                  <select
                    value={documentType}
                    onChange={(e) => setDocumentType(e.target.value)}
                    className="w-full p-3 bg-gray-50 border border-transparent focus:border-green-500 focus:bg-white rounded-xl transition-all outline-none text-gray-700 cursor-pointer text-black font-bold"
                  >
                    <option>Surat Pengantar Domisili</option>
                    <option>Surat Keterangan Usaha (SKU)</option>
                    <option>Surat Keterangan Tidak Mampu (SKTM)</option>
                    <option>Surat Pengantar Nikah (NA)</option>
                    <option>Surat Keterangan Kematian</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Alasan Pengajuan</label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                    rows={3}
                    className="w-full p-3 bg-gray-50 border border-transparent focus:border-green-500 focus:bg-white rounded-xl transition-all outline-none text-gray-700"
                    placeholder="Tuliskan alasan atau keperluan surat ini"
                  ></textarea>
                </div>

                <div className="p-3 bg-yellow-50 rounded-xl border border-yellow-100 mb-2">
                  <p className="text-[10px] text-yellow-700 leading-tight">
                    *Pastikan data benar. Petugas akan menghubungi Anda jika surat sudah siap diambil.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-xl shadow-lg shadow-green-200 transition-all active:scale-95 disabled:opacity-50"
                >
                  {submitting ? 'Sedang Memproses...' : 'Ajukan Surat Sekarang'}
                </button>

                {status.type === 'success' && (
                  <div className="p-3 bg-green-100 text-green-700 text-sm rounded-lg text-center font-bold italic">
                    {status.message}
                  </div>
                )}
                {status.type === 'error' && (
                  <div className="p-3 bg-red-100 text-red-700 text-sm rounded-lg text-center font-bold">
                    {status.message}
                  </div>
                )}
              </form>
            </div>

            {/* INFO TAMBAHAN */}
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-2xl text-white shadow-lg">
              <p className="text-xs opacity-60 uppercase mb-2 tracking-widest text-center">Bantuan Layanan</p>
              <h4 className="text-2xl font-bold text-center text-green-400">Hubungi Kami</h4>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}