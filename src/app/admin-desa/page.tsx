'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AdminDesa() {
  const [activeTab, setActiveTab] = useState<'stats' | 'leader' | 'officers'>('stats');
  const [loading, setLoading] = useState(false);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [editId, setEditId] = useState<number | null>(null);
  const router = useRouter();

  // Data States
  const [stats, setStats] = useState({ total_residents: 0, male_residents: 0, female_residents: 0, total_families: 0 });
  const [leader, setLeader] = useState({ name: '', message: '', image_url: '' });
  const [officers, setOfficers] = useState([]);
  const [officerForm, setOfficerForm] = useState({ name: '', role: '', image_url: '' });

  // 1. Proteksi Halaman (Cek Token localStorage)
  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      router.push('/login-admin');
    } else {
      setIsAuthLoading(false);
      fetchData();
    }
  }, [activeTab, router]);

  const fetchData = async () => {
    try {
      const endpoints: any = {
        stats: '/api/desa-config?target=stats',
        leader: '/api/desa-config?target=leader',
        officers: '/api/desa-officers'
      };
      const res = await fetch(endpoints[activeTab]);
      const data = await res.json();
      if (activeTab === 'stats') setStats(data || { total_residents: 0, male_residents: 0, female_residents: 0, total_families: 0 });
      else if (activeTab === 'leader') setLeader(data || { name: '', message: '', image_url: '' });
      else if (activeTab === 'officers') setOfficers(data || []);
    } catch (err) { console.error("Gagal mengambil data:", err); }
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'leader' | 'officer') => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLoading(true);
    const fd = new FormData();
    fd.append('file', file);
    try {
      const res = await fetch('/api/desa-upload', { method: 'POST', body: fd });
      const data = await res.json();
      if (res.ok) {
        if (type === 'leader') setLeader({ ...leader, image_url: data.url });
        else setOfficerForm({ ...officerForm, image_url: data.url });
      }
    } catch (err) { alert('Upload gagal'); }
    finally { setLoading(false); }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    let url = activeTab === 'officers' ? '/api/desa-officers' : `/api/desa-config?target=${activeTab}`;
    let method = activeTab === 'officers' ? (editId ? 'PUT' : 'POST') : 'PUT';
    if (activeTab === 'officers' && editId) url = `/api/desa-officers?id=${editId}`;

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(activeTab === 'officers' ? officerForm : (activeTab === 'stats' ? stats : leader))
    });

    if (res.ok) {
      setEditId(null);
      setOfficerForm({ name: '', role: '', image_url: '' });
      fetchData();
      alert('Data berhasil diperbarui!');
    }
    setLoading(false);
  };

  const startEdit = (off: any) => {
    setEditId(off.id);
    setOfficerForm({ name: off.name, role: off.role, image_url: off.image_url });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (isAuthLoading) return <div className="min-h-screen flex items-center justify-center font-bold text-slate-400">Memeriksa Akses...</div>;

  return (
    <div className="min-h-screen bg-[#F1F5F9] flex font-sans text-slate-900">
      {/* SIDEBAR - Warna Hijau Desa */}
      <aside className="w-72 bg-white text-slate-900 p-8 shadow-sm sticky h-screen top-0">
        <div className="mb-12">
          <h2 className="text-2xl font-black tracking-tighter text-green-600 uppercase tracking-tighter">Admin Desa</h2>
          <p className="text-[10px] text-slate-400 mt-1 font-bold uppercase tracking-widest">Desa Tanjung Pule</p>
        </div>
        
        <nav className="space-y-3">
          <Link href="/admin" className="w-full text-left px-5 py-4 rounded-2xl font-bold flex items-center gap-3 text-slate-600 hover:bg-slate-100 hover:text-black transition-all uppercase text-xs">🏠 Menu Utama</Link>
          
          <div className="pt-4 pb-2 text-[10px] font-black text-slate-400 uppercase tracking-widest ml-5">Modul Desa</div>
          <button onClick={() => {setActiveTab('stats'); setEditId(null);}} className={`w-full text-left px-5 py-4 rounded-2xl font-bold transition-all flex items-center gap-3 uppercase text-xs ${activeTab === 'stats' ? 'bg-green-600 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'}`}>📊 Statistik</button>
          <button onClick={() => {setActiveTab('leader'); setEditId(null);}} className={`w-full text-left px-5 py-4 rounded-2xl font-bold transition-all flex items-center gap-3 uppercase text-xs ${activeTab === 'leader' ? 'bg-green-600 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'}`}>👔 Profil Kades</button>
          <button onClick={() => {setActiveTab('officers'); setEditId(null);}} className={`w-full text-left px-5 py-4 rounded-2xl font-bold transition-all flex items-center gap-3 uppercase text-xs ${activeTab === 'officers' ? 'bg-green-600 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'}`}>👥 Petugas</button>

          <div className="pt-4 pb-2 text-[10px] font-black text-slate-400 uppercase tracking-widest ml-5">Navigasi Lain</div>
          <Link href="/admin-news" className="w-full text-left px-5 py-4 rounded-2xl font-bold flex items-center gap-3 text-slate-600 hover:bg-slate-100 hover:text-black transition-all uppercase text-xs">📰 Kelola Berita</Link>
          <Link href="/admin-contacts" className="w-full text-left px-5 py-4 rounded-2xl font-bold flex items-center gap-3 text-slate-600 hover:bg-slate-100 hover:text-black transition-all uppercase text-xs">📩 Pengaduan</Link>
          <Link href="/admin-surat" className="w-full text-left px-5 py-4 rounded-2xl font-bold flex items-center gap-3 text-slate-600 hover:bg-slate-100 hover:text-black transition-all uppercase text-xs">📄 Layanan Surat</Link>
        </nav>

        <div className="absolute bottom-8 left-8">
          <button onClick={() => { localStorage.removeItem('adminToken'); router.push('/'); }} className="text-xs font-bold text-red-400 hover:text-red-600 uppercase transition-colors">← Logout</button>
        </div>
      </aside>

      <main className="flex-1 p-12">
        <header className="mb-10 text-black">
          <h1 className="text-4xl font-black text-slate-800 tracking-tight">
            {editId ? '📝 Edit Petugas' : `Kelola ${activeTab === 'stats' ? 'Statistik' : activeTab === 'leader' ? 'Profil Kades' : 'Petugas'}`}
          </h1>
        </header>

        <form onSubmit={handleSave} className="bg-white p-10 rounded-[2.5rem] shadow-sm max-w-4xl space-y-8 text-black border-none">
          
          {activeTab === 'stats' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-black font-bold">
              {Object.keys(stats).map((key) => key !== 'id' && key !== 'updated_at' && (
                <div key={key}>
                  <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 tracking-widest ml-1">{key.replace('_', ' ')}</label>
                  <input type="number" value={(stats as any)[key] || 0} onChange={e => setStats({...stats, [key]: +e.target.value})} 
                    className="w-full p-4 bg-slate-50 border-2 border-slate-200 rounded-2xl text-slate-800 font-bold focus:border-green-500 focus:bg-white outline-none transition-all" />
                </div>
              ))}
            </div>
          )}

          {activeTab === 'leader' && (
            <div className="space-y-6">
              <input placeholder="Nama Kades" value={leader.name} onChange={e => setLeader({...leader, name: e.target.value})} className="w-full p-4 bg-slate-50 border-2 border-slate-200 rounded-2xl text-slate-800 font-bold focus:border-green-500 focus:bg-white outline-none transition-all" />
              <textarea placeholder="Pesan/Sambutan Kades" value={leader.message} onChange={e => setLeader({...leader, message: e.target.value})} className="w-full p-4 bg-slate-50 border-2 border-slate-200 rounded-2xl text-slate-800 outline-none font-medium focus:border-green-500 focus:bg-white transition-all" rows={4} />
              <div className="p-8 border-2 border-dashed border-slate-200 rounded-3xl text-center relative cursor-pointer bg-slate-50 hover:bg-green-50 transition-colors">
                <input type="file" onChange={e => handleUpload(e, 'leader')} className="absolute inset-0 opacity-0 cursor-pointer" />
                <p className="text-slate-400 font-bold text-sm">📸 {loading ? 'Mungunggah...' : 'Klik untuk Ganti Foto Kades'}</p>
              </div>
              {leader.image_url && <img src={leader.image_url} className="w-40 h-40 object-cover rounded-[2rem] shadow-lg border-4 border-white" />}
            </div>
          )}

          {activeTab === 'officers' && (
            <div className="space-y-10 text-black font-bold">
              <div className="bg-slate-50 p-8 rounded-[2.5rem] space-y-4 border-none">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input placeholder="Nama Petugas" value={officerForm.name} onChange={e => setOfficerForm({...officerForm, name: e.target.value})} className="p-4 rounded-2xl border-2 border-slate-200 bg-white focus:border-green-500 outline-none font-bold text-black" />
                  <input placeholder="Jabatan" value={officerForm.role} onChange={e => setOfficerForm({...officerForm, role: e.target.value})} className="p-4 rounded-2xl border-2 border-slate-200 bg-white focus:border-green-500 outline-none font-bold text-black" />
                </div>
                <div className="p-6 border-2 border-dashed border-slate-200 rounded-3xl text-center relative cursor-pointer bg-white hover:bg-green-50 transition-all">
                  <input type="file" onChange={e => handleUpload(e, 'officer')} className="absolute inset-0 opacity-0 cursor-pointer" />
                  <p className="text-slate-400 font-bold text-sm">📸 {loading ? '⌛ Sedang Upload...' : officerForm.image_url ? '✅ Foto Terpilih' : 'Klik untuk Unggah Foto Petugas'}</p>
                </div>
                <div className="flex gap-3">
                  <button className="flex-1 bg-green-600 hover:bg-green-700 active:scale-95 text-white p-4 rounded-2xl font-black transition-all shadow-lg shadow-green-100">
                    {editId ? '💾 UPDATE DATA' : '➕ TAMBAH PETUGAS'}
                  </button>
                  {editId && <button type="button" onClick={() => {setEditId(null); setOfficerForm({name:'', role:'', image_url:''});}} className="bg-slate-200 text-slate-600 px-8 rounded-2xl font-bold">BATAL</button>}
                </div>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 text-black font-bold">
                {officers.filter((off: any) => off.name && off.name !== 'EMPTY').map((off: any) => (
                  <div key={off.id} className="p-6 bg-white border border-slate-100 rounded-3xl flex items-center justify-between shadow-sm hover:shadow-md transition-all h-[130px]">
                    <div className="flex items-center gap-4 overflow-hidden">
                      <div className="w-24 h-24 flex-shrink-0 rounded-2xl overflow-hidden border-2 border-slate-50 shadow-sm">
                        <img src={off.image_url || "https://via.placeholder.com/150"} className="w-full h-full object-cover" />
                      </div>
                      <div className="overflow-hidden">
                        <p className="text-lg font-black text-slate-800 leading-tight truncate w-40">{off.name}</p>
                        <p className="text-[10px] text-green-600 font-bold uppercase mt-1 tracking-widest">{off.role}</p>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <button type="button" onClick={() => startEdit(off)} className="text-green-600 font-bold text-[10px] uppercase p-3 hover:bg-green-50 rounded-xl transition-colors">Edit</button>
                      <button type="button" onClick={async () => { if(confirm('Hapus?')) { await fetch(`/api/desa-officers?id=${off.id}`, {method: 'DELETE'}); fetchData(); } }} className="text-red-400 font-bold text-[10px] uppercase p-3 hover:bg-red-50 rounded-xl transition-colors">Hapus</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab !== 'officers' && (
            <button disabled={loading} className="w-full bg-green-600 hover:bg-green-700 active:scale-95 text-white py-5 rounded-2xl font-black text-lg shadow-xl shadow-green-100 transition-all">
              {loading ? '⌛ MEMPROSES...' : '🚀 SIMPAN PERUBAHAN'}
            </button>
          )}
        </form>
      </main>
    </div>
  );
}