'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface ContactItem {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  created_at: string;
}

export default function AdminContacts() {
  const router = useRouter();
  const [contacts, setContacts] = useState<ContactItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // 1. Proteksi Halaman & Fetch Data
  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      router.push('/login-admin');
    } else {
      setLoading(false);
      fetchContacts();
    }
  }, [router]);

  const fetchContacts = async () => {
    try {
      const res = await fetch('/api/contacts-admin');
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Gagal mengambil data pengaduan');
      setContacts(data);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('Hapus laporan pengaduan ini?')) {
      try {
        await fetch(`/api/contacts-admin?id=${id}`, { method: 'DELETE' });
        fetchContacts();
      } catch (err) {
        alert('Gagal menghapus');
      }
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center font-bold text-slate-400 uppercase tracking-widest">Memeriksa Akses...</div>;

  return (
    <div className="min-h-screen bg-[#F1F5F9] flex font-sans text-slate-900">
      {/* SIDEBAR - Identik dengan Admin Desa & News */}
      <aside className="w-72 bg-white text-slate-900 p-8 shadow-sm sticky h-screen top-0">
        <div className="mb-12">
          <h2 className="text-2xl font-black tracking-tighter text-green-600 uppercase tracking-tighter">Admin Desa</h2>
          <p className="text-[10px] text-slate-400 mt-1 font-bold uppercase tracking-widest">Desa Tanjung Pule</p>
        </div>
        
        <nav className="space-y-3">
          <Link href="/admin" className="w-full text-left px-5 py-4 rounded-2xl font-bold flex items-center gap-3 text-slate-600 hover:bg-slate-100 hover:text-black transition-all uppercase text-xs">🏠 Menu Utama</Link>
          
          <div className="pt-4 pb-2 text-[10px] font-black text-slate-400 uppercase tracking-widest ml-5">Modul Desa</div>
          <Link href="/admin-desa" className="w-full text-left px-5 py-4 rounded-2xl font-bold flex items-center gap-3 text-slate-600 hover:bg-slate-100 hover:text-black transition-all uppercase text-xs">📊 Data Desa</Link>
          <Link href="/admin-news" className="w-full text-left px-5 py-4 rounded-2xl font-bold flex items-center gap-3 text-slate-600 hover:bg-slate-100 hover:text-black transition-all uppercase text-xs">📰 Kelola Berita</Link>
          <Link href="/admin-surat" className="w-full text-left px-5 py-4 rounded-2xl font-bold flex items-center gap-3 text-slate-600 hover:bg-slate-100 hover:text-black transition-all uppercase text-xs">📄 Layanan Surat</Link>

          <div className="pt-4 pb-2 text-[10px] font-black text-slate-400 uppercase tracking-widest ml-5">Navigasi Lain</div>
          <div className="px-5 py-4 rounded-2xl font-bold flex items-center gap-3 bg-green-600 text-white shadow-md uppercase text-xs transition-all">📩 Pengaduan Warga</div>
        </nav>

        <div className="absolute bottom-8 left-8">
          <button onClick={() => { localStorage.removeItem('adminToken'); router.push('/'); }} className="text-xs font-bold text-red-400 hover:text-red-600 uppercase transition-colors">← Logout</button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 p-12">
        <header className="mb-10 text-black">
          <h1 className="text-4xl font-black text-slate-800 tracking-tight uppercase">Kotak Masuk Pengaduan</h1>
          <p className="text-slate-500 font-medium mt-1">Dengarkan dan tindak lanjuti aspirasi warga Desa Tanjung Pule.</p>
        </header>

        {error && <div className="p-4 bg-red-50 text-red-600 rounded-2xl font-bold mb-6 border border-red-100">{error}</div>}

        {/* LIST PENGADUAN */}
        <div className="grid grid-cols-1 gap-6 max-w-4xl text-black font-bold">
          {contacts.length === 0 ? (
            <div className="bg-white p-20 rounded-[3rem] text-center shadow-sm text-slate-300 italic font-bold border-none transition-all">
              Belum ada pengaduan dari warga.
            </div>
          ) : (
            contacts.map((item) => (
              <div key={item.id} className="p-8 bg-white rounded-[2.5rem] shadow-sm hover:shadow-md transition-all border border-slate-100 space-y-4">
                <div className="flex justify-between items-start">
                  <div className="text-black font-bold">
                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mb-2 inline-block tracking-tighter">Aspirasi Warga</span>
                    <h3 className="text-xl font-black text-slate-800 tracking-tight uppercase tracking-tight">{item.subject}</h3>
                    <p className="text-xs text-slate-400 mt-1 uppercase tracking-widest">{item.name} • {item.email}</p>
                  </div>
                  <button onClick={() => handleDelete(item.id)} className="text-red-400 font-bold text-[10px] uppercase p-3 hover:bg-red-50 rounded-xl transition-colors">Hapus</button>
                </div>
                
                <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 text-slate-700 leading-relaxed text-sm italic font-medium">
                  "{item.message}"
                </div>
                
                <div className="flex justify-between items-center text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] pt-2">
                  <span>ID Laporan: #{item.id}</span>
                  <span className="text-green-600">Diterima: {new Date(item.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}