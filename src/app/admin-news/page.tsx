'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface NewsItem {
  id: number;
  title: string;
  content: string;
  created_at: string;
  image_url?: string | null;
}

export default function AdminNews() {
  const router = useRouter();
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [newsList, setNewsList] = useState<NewsItem[]>([]);
  const [formData, setFormData] = useState({ title: '', content: '', image_url: '', created_at: new Date().toISOString().split('T')[0] });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);

  // 1. Proteksi Halaman & Fetch Data
  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      router.push('/login-admin');
    } else {
      setIsAuthLoading(false);
      fetchNews();
    }
  }, [router]);

  const fetchNews = async () => {
    try {
      const response = await fetch('/api/news-admin');
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Gagal mengambil berita');
      setNewsList(data);
    } catch (error: any) {
      setFormError(error.message);
    }
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingImage(true);
    const fd = new FormData();
    fd.append('file', file);

    try {
      const res = await fetch('/api/news-upload', { method: 'POST', body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Upload failed');
      setFormData({ ...formData, image_url: data.url });
    } catch (err: any) {
      alert(err.message);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    setFormError('');

    try {
      const method = editingId ? 'PUT' : 'POST';
      const body = editingId ? { id: editingId, ...formData } : formData;
      
      const response = await fetch('/api/news-admin', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (response.ok) {
        setEditingId(null);
        setFormData({ title: '', content: '', image_url: '', created_at: new Date().toISOString().split('T')[0] });
        fetchNews();
        alert(editingId ? 'Berita diperbarui!' : 'Berita ditambahkan!');
      } else {
        const result = await response.json();
        setFormError(result.error || 'Gagal menyimpan berita');
      }
    } catch (error) {
      setFormError('Terjadi kesalahan server');
    } finally {
      setFormLoading(false);
    }
  };

  const startEdit = (news: NewsItem) => {
    setEditingId(news.id);
    setFormData({ 
      title: news.title, 
      content: news.content, 
      image_url: news.image_url || '',
      created_at: news.created_at.split('T')[0]
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: number) => {
    if (confirm('Hapus berita ini?')) {
      await fetch(`/api/news-admin?id=${id}`, { method: 'DELETE' });
      fetchNews();
    }
  };

  if (isAuthLoading) return <div className="min-h-screen flex items-center justify-center font-bold text-slate-400 uppercase tracking-widest">Memeriksa Akses...</div>;

  return (
    <div className="min-h-screen bg-[#F1F5F9] flex font-sans text-slate-900">
      {/* SIDEBAR - Identik dengan Admin Desa */}
      <aside className="w-72 bg-white text-slate-900 p-8 shadow-sm sticky h-screen top-0">
        <div className="mb-12">
          <h2 className="text-2xl font-black tracking-tighter text-green-600 uppercase">Admin Desa</h2>
          <p className="text-[10px] text-slate-400 mt-1 font-bold uppercase tracking-widest">Desa Tanjung Pule</p>
        </div>
        
        <nav className="space-y-3">
          <Link href="/admin" className="w-full text-left px-5 py-4 rounded-2xl font-bold flex items-center gap-3 text-slate-600 hover:bg-slate-100 hover:text-black transition-all uppercase text-xs">🏠 Menu Utama</Link>
          
          <div className="pt-4 pb-2 text-[10px] font-black text-slate-400 uppercase tracking-widest ml-5">Modul Desa</div>
          <Link href="/admin-desa" className="w-full text-left px-5 py-4 rounded-2xl font-bold flex items-center gap-3 text-slate-600 hover:bg-slate-100 hover:text-black transition-all uppercase text-xs">📊 Data Desa</Link>
          <div className="px-5 py-4 rounded-2xl font-bold flex items-center gap-3 bg-green-600 text-white shadow-md uppercase text-xs">📰 Kelola Berita</div>

          <div className="pt-4 pb-2 text-[10px] font-black text-slate-400 uppercase tracking-widest ml-5">Navigasi Lain</div>
          <Link href="/admin-contacts" className="w-full text-left px-5 py-4 rounded-2xl font-bold flex items-center gap-3 text-slate-600 hover:bg-slate-100 hover:text-black transition-all uppercase text-xs">📩 Pengaduan</Link>
          <Link href="/admin-surat" className="w-full text-left px-5 py-4 rounded-2xl font-bold flex items-center gap-3 text-slate-600 hover:bg-slate-100 hover:text-black transition-all uppercase text-xs">📄 Layanan Surat</Link>
        </nav>

        <div className="absolute bottom-8 left-8">
          <button onClick={() => { localStorage.removeItem('adminToken'); router.push('/'); }} className="text-xs font-bold text-red-400 hover:text-red-600 uppercase transition-colors">← Logout</button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 p-12">
        <header className="mb-10 text-black">
          <h1 className="text-4xl font-black tracking-tight">
            {editingId ? '📝 Edit Berita' : '📰 Tambah Berita Baru'}
          </h1>
        </header>

        {/* FORM INPUT BERITA */}
        <form onSubmit={handleSubmit} className="bg-white p-10 rounded-[2.5rem] shadow-sm max-w-4xl space-y-6 border-none text-black mb-10">
          {formError && <div className="p-4 bg-red-50 text-red-600 rounded-xl font-bold text-sm">{formError}</div>}
          
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Judul Berita</label>
              <input placeholder="Masukkan judul berita..." value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} required
                className="w-full p-4 border-2 border-slate-100 bg-slate-50 rounded-2xl focus:border-green-500 focus:bg-white outline-none font-bold text-black transition-all" />
            </div>
            
            <div className="space-y-2">
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Isi Konten Berita</label>
              <textarea placeholder="Tulis isi berita lengkap di sini..." value={formData.content} onChange={e => setFormData({ ...formData, content: e.target.value })} required rows={5}
                className="w-full p-4 border-2 border-slate-100 bg-slate-50 rounded-2xl focus:border-green-500 focus:bg-white outline-none font-medium text-black transition-all" />
            </div>
            
            <div className="p-6 border-2 border-dashed border-slate-200 rounded-3xl text-center relative cursor-pointer bg-slate-50 hover:bg-green-50 transition-colors">
              <input type="file" accept="image/*" onChange={handleUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
              <p className="text-slate-400 font-bold text-sm">{uploadingImage ? '⌛ Sedang Upload...' : '📸 Klik untuk Unggah Gambar Berita'}</p>
            </div>

            {formData.image_url && (
              <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl border-2 border-slate-100">
                <img src={formData.image_url} className="w-32 h-20 object-cover rounded-xl shadow-sm" alt="Preview" />
                <div>
                   <p className="text-[10px] font-black text-green-600 uppercase tracking-widest">Gambar Terpilih</p>
                   <button type="button" onClick={() => setFormData({...formData, image_url:''})} className="text-red-500 font-bold text-xs uppercase hover:underline">Hapus Gambar</button>
                </div>
              </div>
            )}

            <div className="space-y-2">
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Tanggal Publikasi</label>
              <input type="date" value={formData.created_at} onChange={e => setFormData({ ...formData, created_at: e.target.value })} required
                className="w-full p-4 border-2 border-slate-100 bg-slate-50 rounded-2xl focus:border-green-500 focus:bg-white outline-none font-bold text-black transition-all" />
            </div>
          </div>

          <div className="flex gap-3">
            <button type="submit" disabled={formLoading} className="flex-1 bg-green-600 hover:bg-green-700 text-white py-5 rounded-2xl font-black text-lg shadow-xl shadow-green-100 active:scale-95 transition-all">
              {formLoading ? '⌛ Menyimpan...' : editingId ? '💾 PERBARUI BERITA' : '🚀 PUBLIKASIKAN BERITA'}
            </button>
            {editingId && (
              <button type="button" onClick={() => {setEditingId(null); setFormData({ title: '', content: '', image_url: '', created_at: new Date().toISOString().split('T')[0] });}} 
                className="bg-slate-200 text-slate-600 px-8 rounded-2xl font-bold hover:bg-slate-300 transition-colors">BATAL</button>
            )}
          </div>
        </form>

        {/* LIST BERITA */}
        <header className="mb-6 text-black">
          <h2 className="text-2xl font-black tracking-tight">Postingan Berita</h2>
        </header>

        <div className="grid grid-cols-1 gap-4 max-w-4xl text-black">
          {newsList.length === 0 ? (
            <div className="bg-white p-20 rounded-[3rem] text-center shadow-sm text-slate-300 italic font-bold">Belum ada berita yang dipublikasikan.</div>
          ) : (
            newsList.map((news) => (
              <div key={news.id} className="p-6 bg-white rounded-3xl flex items-center justify-between shadow-sm hover:shadow-md transition-all border border-slate-100">
                <div className="flex items-center gap-4 overflow-hidden">
                  <div className="w-24 h-24 flex-shrink-0 rounded-2xl overflow-hidden border-2 border-slate-50 shadow-sm">
                    <img src={news.image_url || "https://via.placeholder.com/150"} className="w-full h-full object-cover" alt={news.title} />
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-lg font-black text-slate-800 leading-tight truncate w-64 md:w-96">{news.title}</p>
                    <p className="text-[10px] text-green-600 font-bold uppercase mt-1 tracking-widest">{new Date(news.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                  </div>
                </div>
                <div className="flex gap-1 ml-4">
                  <button onClick={() => startEdit(news)} className="text-blue-600 font-bold text-[10px] uppercase p-3 hover:bg-blue-50 rounded-xl transition-colors">Edit</button>
                  <button onClick={() => handleDelete(news.id)} className="text-red-400 font-bold text-[10px] uppercase p-3 hover:bg-red-50 rounded-xl transition-colors">Hapus</button>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}