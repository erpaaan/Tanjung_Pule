'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface NewsItem {
  id: number;
  title: string;
  content: string;
  created_at: string;
  image_url?: string | null;
}

export default function News() {
  const [items, setItems] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await fetch('/api/news-admin');
        const data = await res.json();
        if (!mounted) return;
        setItems(data || []);
      } catch (err) {
        console.error(err);
        setItems([]);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false };
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 pb-20 font-sans">
      {/* 1. HEADER SECTION - MODIFIKASI: DENGAN BACKGROUND GAMBAR */}
      {/* 1. HEADER SECTION - MODIFIKASI AGAR SEPERTI PROFIL */}
      <section className="relative h-[300px] md:h-[400px] flex items-center justify-center text-white mb-12">
        {/* Container Gambar Background */}
        <div 
          className="absolute inset-0 bg-cover bg-center z-0"
          style={{ 
            backgroundImage: "url('/images/hero1.jpg')" // Menggunakan path yang sama dengan profil
          }}
        >
          {/* Overlay Hijau Tua & Blur (Sesuai kode Profil) */}
          <div className="absolute inset-0 bg-green-900/70 backdrop-blur-sm"></div>
        </div>

        {/* Konten Teks di Atas Background */}
        <div className="relative z-10 text-center px-4">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-4 drop-shadow-md text-white">
            Seputar Tanjung Pule
          </h1>
          <p className="text-lg md:text-xl opacity-90 font-bold max-w-2xl mx-auto text-white drop-shadow-lg italic">
            Kumpulan berita terbaru, pengumuman, dan dokumentasi kegiatan masyarakat Desa Tanjung Pule.
          </p>
          
          {/* Garis Aksen (Opsional agar makin manis) */}
          <div className="mt-8 flex justify-center">
            <div className="h-1.5 w-24 bg-green-500 rounded-full shadow-lg"></div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4">
        {loading ? (
          /* SKELETON LOADING */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-gray-200 h-96 rounded-2xl animate-pulse"></div>
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-dashed border-gray-300">
            <p className="text-gray-500 italic font-bold">Belum ada berita yang diterbitkan saat ini.</p>
          </div>
        ) : (
          /* 2. NEWS GRID - SEKARANG BISA DIKLIK */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {items.map((it) => (
              <Link 
                href={`/news/${it.id}`} 
                key={it.id} 
                className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 flex flex-col cursor-pointer"
              >
                {/* Image Container */}
                <div className="relative h-56 overflow-hidden">
                  <img 
                    src={it.image_url || 'https://images.unsplash.com/photo-1585829365234-750ca90a071d?auto=format&fit=crop&q=80'} 
                    alt={it.title} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-green-600 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest shadow-lg">
                      Info Desa
                    </span>
                  </div>
                </div>

                {/* Content Container */}
                <div className="p-6 flex flex-col flex-grow text-black">
                  <div className="flex items-center text-xs text-gray-400 mb-3 font-bold">
                    <span className="mr-2 text-black font-bold">📅</span>
                    {new Date(it.created_at).toLocaleDateString('id-ID', { 
                      day: 'numeric', 
                      month: 'long', 
                      year: 'numeric' 
                    })}
                  </div>
                  
                  <h2 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-green-600 transition-colors line-clamp-2">
                    {it.title}
                  </h2>
                  
                  <p className="text-gray-600 text-sm mb-6 line-clamp-3 leading-relaxed font-medium">
                    {it.content}
                  </p>

                  <div className="mt-auto pt-4 border-t border-gray-50">
                    <div className="text-green-600 font-bold text-sm inline-flex items-center group-hover:gap-2 transition-all">
                      BACA SELENGKAPNYA 
                      <span className="ml-1 text-lg">→</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* 3. CTA ADMIN */}
        <div className="mt-16 text-center">
          <Link href="/admin-news">
            <p className="text-gray-400 text-sm hover:text-green-600 transition-colors cursor-pointer font-bold">
              Anda Admin? Kelola berita di sini.
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
}