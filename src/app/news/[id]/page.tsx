'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

interface NewsItem {
  id: number;
  title: string;
  content: string;
  created_at: string;
  image_url?: string | null;
}

export default function NewsDetail() {
  const params = useParams();
  const router = useRouter();
  const [news, setNews] = useState<NewsItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        // Kita gunakan API admin yang sudah ada, tapi filter berdasarkan ID
        const response = await fetch('/api/news-admin');
        const data: NewsItem[] = await response.json();
        
        // Cari berita yang ID-nya cocok dengan URL
        const found = data.find((item) => item.id.toString() === params.id);
        
        if (found) {
          setNews(found);
        } else {
          // Jika ID tidak ditemukan, lempar ke 404
          router.push('/404');
        }
      } catch (error) {
        console.error('Error fetching detail:', error);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) fetchDetail();
  }, [params.id, router]);

  if (loading) return <div className="min-h-screen flex items-center justify-center font-bold text-slate-400 uppercase">Memuat Berita...</div>;

  if (!news) return null;

  return (
    <div className="min-h-screen bg-white">
      {/* HEADER BERITA */}
      <section className="container mx-auto px-4 py-12 max-w-4xl">
        <Link href="/" className="text-green-600 font-bold text-sm hover:underline uppercase tracking-widest flex items-center gap-2 mb-8">
          ← Kembali ke Beranda
        </Link>

        <img 
          src={news.image_url || 'https://via.placeholder.com/1200x600'} 
          className="w-full h-[400px] object-cover rounded-[2.5rem] shadow-xl mb-10"
          alt={news.title}
        />

        <div className="space-y-4 text-black">
          <p className="text-green-600 font-black uppercase tracking-[0.2em] text-xs">
            Berita Desa • {new Date(news.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
          <h1 className="text-4xl md:text-5xl font-black text-slate-800 leading-tight uppercase">
            {news.title}
          </h1>
        </div>

        <div className="h-[2px] bg-slate-100 my-10"></div>

        {/* ISI BERITA */}
        <article className="prose prose-lg max-w-none text-slate-700 leading-relaxed font-medium text-black">
          {news.content.split('\n').map((paragraph, index) => (
            <p key={index} className="mb-6">{paragraph}</p>
          ))}
        </article>
      </section>
    </div>
  );
}