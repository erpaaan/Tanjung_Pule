'use client';

import { useState } from 'react';
import { createClient } from '@supabase/supabase-js';

// Inisialisasi Supabase untuk upload file langsung dari client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function Services() {
  const [name, setName] = useState('');
  const [nik, setNik] = useState(''); 
  const [phone, setPhone] = useState(''); // STATE BARU: Nomor Telepon
  const [documentType, setDocumentType] = useState('Surat Pengantar Domisili'); 
  const [message, setMessage] = useState('');
  const [file, setFile] = useState<File | null>(null); // STATE BARU: Berkas
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
      let publicUrl = "";

      // 1. PROSES UPLOAD BERKAS (Jika ada file yang dipilih)
      if (file) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
        const filePath = `requirements/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('requirements') // Pastikan Bucket 'requirements' sudah dibuat di Supabase
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data } = supabase.storage.from('requirements').getPublicUrl(filePath);
        publicUrl = data.publicUrl;
      }

      // 2. KIRIM DATA KE API
      const res = await fetch('/api/surat-pengajuan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          nama_lengkap: name, 
          nik: nik,
          nomor_telepon: phone, // DATA BARU
          jenis_surat: documentType,
          keperluan: message,
          file_url: publicUrl // URL FILE BARU
        }),
      });

      if (res.ok) {
        setStatus({ type: 'success', message: 'Pengajuan surat berhasil terkirim!' });
        setName(''); setNik(''); setPhone(''); setMessage(''); setFile(null);
      } else {
        throw new Error();
      }
    } catch (err) {
      setStatus({ type: 'error', message: 'Gagal mengirim pengajuan. Cek koneksi atau ukuran file.' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-700 pb-20 font-sans">
      {/* HEADER SECTION TETAP SAMA */}
      <section className="relative h-[300px] md:h-[400px] flex items-center justify-center text-white mb-12">
        <div className="absolute inset-0 bg-cover bg-center z-0" style={{ backgroundImage: "url('/images/hero3.jpg')" }}>
          <div className="absolute inset-0 bg-green-900/70 backdrop-blur-sm"></div>
        </div>
        <div className="relative z-10 text-center px-4">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-4 drop-shadow-md text-white">Layanan Desa Tanjung Pule</h1>
          <p className="text-lg md:text-xl opacity-90 font-bold max-w-2xl mx-auto text-white drop-shadow-lg italic">
            Layanan administrasi desa kini lebih mudah dengan pengajuan surat secara mandiri dan online.
          </p>
          <div className="mt-8 flex justify-center">
            <div className="h-1.5 w-24 bg-green-500 rounded-full shadow-lg"></div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 -mt-10">
        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* DAFTAR LAYANAN TETAP SAMA */}
          <div className="lg:col-span-2 space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              {services.map((item, idx) => (
                <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:border-green-500 transition-colors group">
                  <div className="text-4xl mb-4 group-hover:scale-110 transition-transform inline-block">{item.icon}</div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{item.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>

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

          {/* FORMULIR PENGAJUAN (DENGAN MODIFIKASI INPUT BARU) */}
          <div className="space-y-6">
            <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-20 h-20 bg-green-50 rounded-bl-full -z-0"></div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2 relative z-10">Pengajuan Surat</h2>
              <p className="text-gray-500 text-sm mb-6 relative z-10">Isi data di bawah ini untuk mengajukan surat keterangan secara online.</p>
              
              <form className="space-y-4 relative z-10" onSubmit={handleSubmit}>
                {/* INPUT NAMA & NIK TETAP SAMA */}
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Nama Pemohon</label>
                  <input value={name} onChange={(e) => setName(e.target.value)} required className="w-full p-3 bg-gray-50 border border-transparent focus:border-green-500 focus:bg-white rounded-xl outline-none text-gray-700" placeholder="Nama lengkap sesuai KTP" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-1">NIK (16 Digit)</label>
                  <input value={nik} onChange={(e) => setNik(e.target.value)} required maxLength={16} className="w-full p-3 bg-gray-50 border border-transparent focus:border-green-500 focus:bg-white rounded-xl outline-none text-gray-700 font-mono" placeholder="Masukkan 16 digit NIK" />
                </div>

                {/* INPUT BARU: NOMOR TELEPON */}
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Nomor WhatsApp/HP</label>
                  <input value={phone} onChange={(e) => setPhone(e.target.value)} required className="w-full p-3 bg-gray-50 border border-transparent focus:border-green-500 focus:bg-white rounded-xl outline-none text-gray-700" placeholder="Contoh: 08123456789" />
                </div>

                {/* INPUT BARU: UPLOAD BERKAS */}
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-1 text-green-600">Unggah Berkas (KTP/KK)</label>
                  <input type="file" onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)} accept="image/*,application/pdf" className="w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100 cursor-pointer" />
                </div>

                {/* JENIS SURAT & ALASAN TETAP SAMA */}
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Jenis Surat</label>
                  <select value={documentType} onChange={(e) => setDocumentType(e.target.value)} className="w-full p-3 bg-gray-50 border border-transparent focus:border-green-500 rounded-xl outline-none text-gray-700 text-sm font-bold">
                    <option>Surat Pengantar Domisili</option>
                    <option>Surat Keterangan Usaha (SKU)</option>
                    <option>Surat Keterangan Tidak Mampu (SKTM)</option>
                    <option>Surat Pengantar Nikah (NA)</option>
                    <option>Surat Keterangan Kematian</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Alasan Pengajuan</label>
                  <textarea value={message} onChange={(e) => setMessage(e.target.value)} required rows={3} className="w-full p-3 bg-gray-50 border border-transparent focus:border-green-500 rounded-xl outline-none text-gray-700" placeholder="Tuliskan keperluan surat ini"></textarea>
                </div>

                <button type="submit" disabled={submitting} className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-xl shadow-lg transition-all active:scale-95 disabled:opacity-50">
                  {submitting ? 'Sedang Memproses...' : 'Ajukan Surat Sekarang'}
                </button>

                {status.type !== 'idle' && (
                  <div className={`p-3 text-sm rounded-lg text-center font-bold italic ${status.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {status.message}
                  </div>
                )}
              </form>
            </div>
            {/* FOOTER BANTUAN TETAP SAMA */}
          </div>
        </div>
      </div>
    </div>
  );
}