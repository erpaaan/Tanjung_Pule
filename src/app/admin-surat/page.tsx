'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AdminSurat() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!localStorage.getItem('adminToken')) {
      router.push('/login-admin');
    } else {
      setLoading(false);
      fetchRequests();
    }
  }, []);

  const fetchRequests = async () => {
    const res = await fetch('/api/surat-pengajuan');
    const data = await res.json();
    setRequests(data || []);
  };

  const handleUpdateStatus = async (id: number, status: string) => {
    await fetch(`/api/surat-pengajuan?id=${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    fetchRequests();
  };

  // FITUR BARU: Hapus Surat
  const handleDelete = async (id: number) => {
    if (confirm('Apakah Anda yakin ingin menghapus data pengajuan ini secara permanen?')) {
      await fetch(`/api/surat-pengajuan?id=${id}`, {
        method: 'DELETE',
      });
      fetchRequests();
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center font-bold text-slate-400">MEMERIKSA AKSES...</div>;

  return (
    <div className="min-h-screen bg-[#F1F5F9] flex font-sans">
      {/* SIDEBAR TETAP SAMA */}
      <aside className="w-72 bg-white p-8 shadow-sm sticky h-screen top-0">
        <h2 className="text-2xl font-black text-green-600 uppercase mb-8">Admin Desa</h2>
        <nav className="space-y-3">
          <Link href="/admin" className="block px-5 py-4 rounded-2xl font-bold text-slate-600 hover:bg-slate-100 text-xs uppercase">🏠 Menu Utama</Link>
          <div className="px-5 py-4 rounded-2xl font-bold bg-green-600 text-white shadow-md text-xs uppercase">📄 Layanan Surat</div>
          <Link href="/admin-news" className="block px-5 py-4 rounded-2xl font-bold text-slate-600 hover:bg-slate-100 text-xs uppercase">📰 Berita</Link>
          <Link href="/admin-contacts" className="block px-5 py-4 rounded-2xl font-bold text-slate-600 hover:bg-slate-100 text-xs uppercase">📩 Pengaduan</Link>
          <Link href="/admin-desa" className="block px-5 py-4 rounded-2xl font-bold text-slate-600 hover:bg-slate-100 text-xs uppercase">📊 Data Desa</Link>
        </nav>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 p-12">
        <h1 className="text-4xl font-black text-slate-800 mb-10 uppercase tracking-tight">Pengajuan Surat Warga</h1>

        <div className="grid grid-cols-1 gap-6 max-w-4xl">
          {requests.length === 0 ? (
            <div className="bg-white p-20 rounded-[3rem] text-center text-slate-300 font-bold italic">Belum ada pengajuan surat.</div>
          ) : (
            requests.map((item: any) => (
              <div key={item.id} className="p-8 bg-white rounded-[2.5rem] shadow-sm border border-slate-100 flex justify-between items-start transition-all hover:shadow-md">
                <div className="space-y-2 flex-1">
                  <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                    item.status === 'Selesai' ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'
                  }`}>
                    {item.status}
                  </span>
                  <h3 className="text-2xl font-black text-slate-800 tracking-tight uppercase">{item.nama_lengkap}</h3>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                    {item.jenis_surat} • NIK: {item.nik}
                  </p>
                  
                  {/* MODIFIKASI: MENAMPILKAN NOMOR TELEPON */}
                  <p className="text-[11px] font-black text-green-600 uppercase tracking-widest">
                    📞 No. Telp: {item.nomor_telepon || '-'}
                  </p>

                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-slate-600 text-sm italic font-medium">
                    "{item.keperluan}"
                  </div>

                  {/* MODIFIKASI: TOMBOL LIHAT BERKAS */}
                  {item.file_url && (
                    <a 
                      href={item.file_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-block mt-2 text-[10px] font-bold text-blue-600 underline uppercase tracking-tighter"
                    >
                      📂 Lihat Berkas Lampiran
                    </a>
                  )}
                </div>

                <div className="flex flex-col gap-2 ml-6">
                  {item.status !== 'Selesai' ? (
                    <button 
                      onClick={() => handleUpdateStatus(item.id, 'Selesai')}
                      className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-bold text-[10px] uppercase shadow-lg shadow-green-100 transition-all active:scale-95"
                    >
                      Tandai Selesai
                    </button>
                  ) : (
                    /* FITUR BARU: TOMBOL HAPUS (Hanya muncul jika sudah selesai) */
                    <button 
                      onClick={() => handleDelete(item.id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-xl font-bold text-[10px] uppercase shadow-lg shadow-red-100 transition-all active:scale-95"
                    >
                      Hapus Data
                    </button>
                  )}
                  <p className="text-[9px] text-center text-slate-300 font-bold uppercase tracking-widest">
                    {new Date(item.created_at).toLocaleDateString('id-ID')}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}