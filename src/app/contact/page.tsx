'use client';

import { useState } from 'react';

export default function Contact() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<{ type: 'idle' | 'success' | 'error'; message?: string }>({ type: 'idle' });
  const [errorDetail, setErrorDetail] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) {
      setStatus({ type: 'error', message: 'Semua field wajib diisi.' });
      return;
    }

    setSubmitting(true);
    setStatus({ type: 'idle' });

    const payload = { name: name.trim(), email: email.trim(), message: message.trim() };

    try {
      const res = await fetch('/api/contacts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(payload),
      });

      const body = await res.text().then((t) => {
        try { return JSON.parse(t); } catch { return { raw: t }; }
      });

      if (!res.ok) {
        const serverMessage = (body && (body.error || body.message)) || `HTTP ${res.status}`;
        setErrorDetail(typeof body === 'string' ? body : JSON.stringify(body, null, 2));
        setStatus({ type: 'error', message: serverMessage });
        return;
      }

      setName('');
      setEmail('');
      setMessage('');
      setStatus({ type: 'success', message: 'Pesan berhasil dikirim. Terima kasih.' });

      try {
        window.dispatchEvent(new Event('contacts:updated'));
      } catch (err) {}
    } catch (err) {
      setStatus({ type: 'error', message: (err as Error).message || 'Terjadi kesalahan saat mengirim. Coba lagi.' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20 font-sans">
      {/* 1. HEADER SECTION - MODIFIKASI: DENGAN BACKGROUND GAMBAR */}
      {/* 1. HEADER SECTION - MODIFIKASI AGAR SEPERTI PROFIL */}
      <section className="relative h-[300px] md:h-[400px] flex items-center justify-center text-white mb-12">
        {/* Container Gambar Background */}
        <div 
          className="absolute inset-0 bg-cover bg-center z-0"
          style={{ 
            backgroundImage: "url('/images/hero2.jpg')" // Menggunakan path yang sama dengan profil
          }}
        >
          {/* Overlay Hijau Tua & Blur (Sesuai kode Profil) */}
          <div className="absolute inset-0 bg-green-900/70 backdrop-blur-sm"></div>
        </div>

        {/* Konten Teks di Atas Background */}
        <div className="relative z-10 text-center px-4">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-4 drop-shadow-md text-white">
            Pengaduan Masyarakat
          </h1>
          <p className="text-lg md:text-xl opacity-90 font-bold max-w-2xl mx-auto text-white drop-shadow-lg italic">
            Kirimkan aduan atau saran Anda kepada kami melalui formulir di bawah ini.
          </p>
          
          {/* Garis Aksen (Opsional agar makin manis) */}
          <div className="mt-8 flex justify-center">
            <div className="h-1.5 w-24 bg-green-500 rounded-full shadow-lg"></div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 -mt-10">
        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* 2. INFORMASI KONTAK (SIDEBAR) */}
          <div className="space-y-6">
            <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                <span className="w-2 h-8 bg-green-600 rounded-full mr-3"></span>
                Hubungi Kami
              </h2>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="bg-green-100 p-3 rounded-xl text-green-700">📍</div>
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase">Alamat</p>
                    <p className="text-gray-700 text-sm leading-relaxed">Jl. Desa Tanjung Pule, Kec. Indralaya Utara, Kab. Ogan Ilir, Sumatera Selatan 30862</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-green-100 p-3 rounded-xl text-green-700">📞</div>
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase">Telepon</p>
                    <p className="text-gray-700 text-sm">(021) 123-4567</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-green-100 p-3 rounded-xl text-green-700">✉️</div>
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase">Email</p>
                    <p className="text-gray-700 text-sm font-medium">tanjungpule@oganilir.go.id</p>
                  </div>
                </div>
              </div>

              {/* MAPS PLACEHOLDER */}
              <div className="mt-8 pt-8 border-t border-gray-100">
                <div className="aspect-video bg-gray-100 rounded-xl flex items-center justify-center text-gray-400 text-xs overflow-hidden">
                   <p className="italic text-center px-4">Tampilkan Google Maps di sini dengan menyematkan iframe</p>
                </div>
              </div>
            </div>
          </div>

          {/* 3. FORMULIR PESAN (KONTEN UTAMA) */}
          <div className="lg:col-span-2">
            <div className="bg-white p-8 md:p-10 rounded-3xl shadow-xl border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Kirim Pesan</h2>
              <p className="text-gray-500 mb-8">Isi formulir di bawah ini dan tim kami akan segera merespons Anda.</p>
              
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Nama Lengkap</label>
                    <input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      className="w-full p-4 bg-gray-50 border-2 border-transparent focus:border-green-500 focus:bg-white rounded-2xl transition-all outline-none text-gray-700"
                      placeholder="Masukkan nama Anda"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Alamat Email</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full p-4 bg-gray-50 border-2 border-transparent focus:border-green-500 focus:bg-white rounded-2xl transition-all outline-none text-gray-700"
                      placeholder="nama@email.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Pesan Anda</label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                    rows={6}
                    className="w-full p-4 bg-gray-50 border-2 border-transparent focus:border-green-500 focus:bg-white rounded-2xl transition-all outline-none text-gray-700"
                    placeholder="Tuliskan pesan, saran, atau pertanyaan Anda..."
                  ></textarea>
                </div>

                <div className="flex flex-col md:flex-row items-center gap-4">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full md:w-auto bg-green-600 hover:bg-green-700 text-white font-bold px-10 py-4 rounded-2xl shadow-lg shadow-green-100 transition-all active:scale-95 disabled:opacity-60 flex items-center justify-center gap-2"
                  >
                    {submitting ? (
                      <>
                        <span className="animate-spin">🌀</span>
                        Mengirim...
                      </>
                    ) : (
                      'Kirim Pesan Sekarang →'
                    )}
                  </button>

                  {status.type === 'success' && (
                    <div className="px-4 py-2 bg-green-50 text-green-700 rounded-full text-sm font-medium animate-pulse">
                      ✓ {status.message}
                    </div>
                  )}
                  {status.type === 'error' && (
                    <div className="px-4 py-2 bg-red-50 text-red-600 rounded-full text-sm font-medium">
                      ⚠ {status.message}
                    </div>
                  )}
                </div>

                {status.type === 'error' && errorDetail && (
                  <details className="mt-4 text-xs text-gray-400 bg-gray-50 p-4 rounded-xl">
                    <summary className="cursor-pointer hover:text-gray-600">Detail teknis kesalahan</summary>
                    <pre className="mt-2 whitespace-pre-wrap font-mono">{errorDetail}</pre>
                  </details>
                )}
              </form>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}