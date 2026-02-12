'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AdminHub() {
  const router = useRouter();

  useEffect(() => {
    // Proteksi halaman menggunakan token localStorage
    const token = localStorage.getItem('adminToken');
    if (!token) {
      router.push('/login-admin');
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-6 font-sans">
      <div className="max-w-5xl w-full text-center space-y-12">
        <header>
          <h1 className="text-5xl font-black text-slate-900 tracking-tight">
            Selamat Datang, <span className="text-blue-600">Admin</span>
          </h1>
          <p className="text-slate-500 mt-4 text-lg font-medium italic">Pilih modul pengelolaan Desa Tanjung Pule hari ini.</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* MODUL DATA DESA */}
          <Link href="/admin-desa" className="group">
            <div className="bg-white p-10 h-full rounded-[3rem] shadow-xl shadow-slate-200 border border-slate-100 transition-all duration-300 group-hover:scale-105 group-hover:shadow-2xl group-hover:border-blue-200 flex flex-col items-center">
              <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-3xl flex items-center justify-center text-4xl mb-6 group-hover:bg-blue-600 group-hover:text-white transition-colors">📊</div>
              <h3 className="text-xl font-black text-slate-800 uppercase tracking-tight">Data Desa</h3>
              <p className="text-slate-400 mt-3 text-xs leading-relaxed font-bold">Kelola statistik, profil Kades, dan data petugas desa.</p>
            </div>
          </Link>

          {/* MODUL BERITA */}
          <Link href="/admin-news" className="group">
            <div className="bg-white p-10 h-full rounded-[3rem] shadow-xl shadow-slate-200 border border-slate-100 transition-all duration-300 group-hover:scale-105 group-hover:shadow-2xl group-hover:border-green-200 flex flex-col items-center">
              <div className="w-20 h-20 bg-green-50 text-green-600 rounded-3xl flex items-center justify-center text-4xl mb-6 group-hover:bg-green-600 group-hover:text-white transition-colors">📰</div>
              <h3 className="text-xl font-black text-slate-800 uppercase tracking-tight">Berita Desa</h3>
              <p className="text-slate-400 mt-3 text-xs leading-relaxed font-bold">Tulis dan edit pengumuman atau berita terbaru untuk warga.</p>
            </div>
          </Link>

          {/* MODUL PENGADUAN */}
          <Link href="/admin-contacts" className="group">
            <div className="bg-white p-10 h-full rounded-[3rem] shadow-xl shadow-slate-200 border border-slate-100 transition-all duration-300 group-hover:scale-105 group-hover:shadow-2xl group-hover:border-orange-200 flex flex-col items-center">
              <div className="w-20 h-20 bg-orange-50 text-orange-600 rounded-3xl flex items-center justify-center text-4xl mb-6 group-hover:bg-orange-600 group-hover:text-white transition-colors">📩</div>
              <h3 className="text-xl font-black text-slate-800 uppercase tracking-tight">Aduan Warga</h3>
              <p className="text-slate-400 mt-3 text-xs leading-relaxed font-bold">Pantau laporan dan aspirasi yang masuk dari masyarakat.</p>
            </div>
          </Link>

          {/* MODUL LAYANAN SURAT */}
<Link href="/admin-surat" className="group">
  <div className="bg-white p-10 h-full rounded-[3rem] shadow-xl shadow-slate-200 border border-slate-100 transition-all duration-300 group-hover:scale-105 group-hover:shadow-2xl group-hover:border-green-200 flex flex-col items-center">
    <div className="w-20 h-20 bg-green-50 text-green-600 rounded-3xl flex items-center justify-center text-4xl mb-6 group-hover:bg-green-600 group-hover:text-white transition-colors">📄</div>
    <h3 className="text-xl font-black text-slate-800 uppercase tracking-tight">Layanan Surat</h3>
    <p className="text-slate-400 mt-3 text-xs leading-relaxed font-bold">Kelola pengajuan surat mandiri dari warga.</p>
  </div>
</Link>
        </div>

        <div className="pt-8">
          <button 
            onClick={() => { localStorage.removeItem('adminToken'); window.location.href = '/'; }}
            className="text-slate-400 font-bold hover:text-red-500 transition-colors uppercase tracking-widest text-xs"
          >
            ← Keluar dari Sesi Admin
          </button>
        </div>
      </div>
    </div>
  );
}