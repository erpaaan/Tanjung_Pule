'use client';

import Link from 'next/dist/client/link';
import { useState, useEffect } from 'react';
// Import library untuk grafik
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

// Registrasi komponen Chart.js
ChartJS.register(ArcElement, Tooltip, Legend);

interface NewsItem { id: number; title: string; content: string; created_at: string; image_url?: string | null; }
interface VillageStats { total_residents: number; male_residents: number; female_residents: number; total_families: number; }
interface LeaderData { name: string; message: string; image_url: string; }

export default function Home() {
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<VillageStats>({ total_residents: 0, male_residents: 0, female_residents: 0, total_families: 0 });
  const [leader, setLeader] = useState<LeaderData>({ name: "Nama Kepala Desa", message: "Selamat datang...", image_url: "/images/kades.jpg" });

  // --- BAGIAN YANG DIBENARKAN: SLIDE KE KIRI BERATURAN ---
  const [currentSlide, setCurrentSlide] = useState(0);
  const heroImages = [
    '/images/hero1.jpg',
    '/images/hero2.jpg',
    '/images/hero3.jpg',
    '/images/hero4.jpg'
  ];

  useEffect(() => {
    const slideTimer = setInterval(() => {
      setCurrentSlide((prev) => (prev === heroImages.length - 1 ? 0 : prev + 1));
    }, 3000); 
    return () => clearInterval(slideTimer);
  }, [heroImages.length]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [newsRes, statsRes, leaderRes] = await Promise.all([
          fetch('/api/news-admin'),
          fetch('/api/desa-config?target=stats'),
          fetch('/api/desa-config?target=leader')
        ]);
        setNewsItems(await newsRes.json() || []);
        const sData = await statsRes.json();
        const lData = await leaderRes.json();
        if (sData) setStats(sData);
        if (lData) setLeader(lData);
      } catch (error) { console.error(error); }
      finally { setLoading(false); }
    };
    fetchData();
  }, []);

  // Konfigurasi Data Grafik
  const doughnutData = {
    labels: ['Laki-laki', 'Perempuan'],
    datasets: [
      {
        data: [stats.male_residents, stats.female_residents],
        backgroundColor: ['#3b82f6', '#ec4899'], // Biru & Pink
        hoverBackgroundColor: ['#2563eb', '#db2777'],
        borderWidth: 0,
        borderRadius: 10,
        spacing: 5,
      },
    ],
  };

  const doughnutOptions = {
    cutout: '80%', // Membuat bentuk cincin modern
    plugins: {
      legend: { display: false },
    },
    maintainAspectRatio: false,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 1. HERO SECTION - SLIDE GESER KE KIRI */}
      <section className="relative h-[500px] w-full overflow-hidden bg-black text-white">
        <div 
          className="flex h-full transition-transform duration-1000 ease-in-out"
          style={{ 
            transform: `translateX(-${currentSlide * 100}%)`,
            width: `${heroImages.length * 25}%` 
          }}
        >
          {heroImages.map((img, index) => (
            <div 
              key={index}
              className="relative h-full w-full flex-shrink-0 bg-cover bg-center"
              style={{ backgroundImage: `url('${img}')` }}
            >
              <div className="absolute inset-0 bg-black/50"></div>
            </div>
          ))}
        </div>
        
        <div className="absolute inset-0 z-10 flex items-center justify-center text-center px-4">
          <div>
            <h1 className="text-4xl md:text-6xl font-extrabold mb-4 drop-shadow-lg">
              Website Resmi Desa Tanjung Pule
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto font-light">
              Membangun Desa yang Mandiri, Kreatif, dan Berbasis Digital.
            </p>
            <div className="flex justify-center gap-4">
              <Link href="/about">
                <button className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-full font-bold transition-all shadow-lg active:scale-95">
                  Profil Desa
                </button>
              </Link>
              <Link href="/services">
                <button className="bg-white hover:bg-gray-100 text-green-700 px-8 py-3 rounded-full font-bold transition-all shadow-lg active:scale-95 border border-gray-200">
                  Layanan Publik
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 2. STATISTIK QUICK CARDS */}
      <section className="container mx-auto -mt-16 relative z-20 px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-black font-bold">
          {[
            { label: 'Penduduk', count: stats.total_residents, icon: '👥' },
            { label: 'Laki-laki', count: stats.male_residents, icon: '👨' },
            { label: 'Perempuan', count: stats.female_residents, icon: '👩' },
            { label: 'Keluarga', count: stats.total_families, icon: '🏠' },
          ].map((stat, i) => (
            <div key={i} className="bg-white p-6 rounded-xl shadow-md text-center border-b-4 border-green-600 transition-transform hover:-translate-y-2">
              <div className="text-3xl mb-2">{stat.icon}</div>
              <div className="text-2xl font-bold text-gray-800">{stat.count.toLocaleString('id-ID')}</div>
              <div className="text-sm text-gray-500 uppercase tracking-wider">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. SAMBUTAN KEPALA DESA */}
      <section className="container mx-auto py-20 px-4">
        <div className="flex flex-col md:flex-row items-center gap-12 bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-black font-bold">
          <div className="w-48 h-48 md:w-64 md:h-64 relative rounded-2xl overflow-hidden shadow-xl flex-shrink-0">
            <img src={leader.image_url} alt="Kepala Desa" className="w-full h-full object-cover" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Sambutan Kepala Desa</h2>
            <div className="w-20 h-1 bg-green-600 mb-6"></div>
            <p className="text-gray-600 italic text-lg leading-relaxed mb-6">"{leader.message}"</p>
            <p className="font-bold text-gray-800 text-xl">{leader.name}</p>
            <p className="text-green-600 font-medium">Kepala Desa Tanjung Pule</p>
          </div>
        </div>
      </section>

     {/* 4. DIGITAL DESA STYLE DEMOGRAPHY SECTION */}
      <section className="container mx-auto py-16 px-4 bg-white">
        {/* Header Header ala Digides */}
        <div className="flex items-center gap-4 mb-10">
          <div className="w-2 h-10 bg-blue-600 rounded-full"></div>
          <div>
            <h2 className="text-3xl font-bold text-slate-800 tracking-tight">Data Demografi</h2>
            <p className="text-slate-500 text-sm font-medium">Grafik dan statistik kependudukan Desa Tanjung Pule secara real-time.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* SISI KIRI: GRAFIK DOUGHNUT (33% Lebar) */}
          <div className="lg:col-span-4 bg-white p-8 rounded-3xl border border-slate-100 shadow-sm flex flex-col items-center justify-center">
            <div className="relative w-64 h-64 mb-6">
              <Doughnut 
                data={doughnutData} 
                options={{
                  cutout: '75%',
                  plugins: { legend: { display: false } },
                  maintainAspectRatio: false
                }} 
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl font-extrabold text-slate-800 tracking-tighter">
                  {stats.total_residents > 0 ? Math.round((stats.male_residents / stats.total_residents) * 100) : 0}%
                </span>
                <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest mt-1">Laki-Laki</span>
              </div>
            </div>
            
            {/* Legend ala Digides */}
            <div className="w-full space-y-3">
              <div className="flex justify-between items-center p-3 bg-blue-50 rounded-xl">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                  <span className="text-lg font-bold text-slate-700">Laki-laki</span>
                </div>
                <span className="text-lg font-bold text-slate-800">{stats.male_residents} Jiwa</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-pink-50 rounded-xl">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-pink-500 rounded-full"></div>
                  <span className="text-lg font-bold text-slate-700">Perempuan</span>
                </div>
                <span className="text-lg font-bold text-slate-800">{stats.female_residents} Jiwa</span>
              </div>
            </div>
          </div>

         {/* SISI KANAN: KARTU STATISTIK (66% Lebar) */}
          <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { label: 'Total Penduduk', val: stats.total_residents, unit: 'Jiwa', icon: '👥', color: 'bg-blue-600' },
              { label: 'Laki-laki', val: stats.male_residents, unit: 'Jiwa', icon: '👨', color: 'bg-sky-500' },
              { label: 'Perempuan', val: stats.female_residents, unit: 'Jiwa', icon: '👩', color: 'bg-pink-500' },
              { label: 'Keluarga', val: stats.total_families, unit: 'KK', icon: '🏠', color: 'bg-orange-500' }
            ].map((item, idx) => (
              <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all flex items-center gap-6 group">
                {/* Ikon di Samping ala Digides */}
                <div className={`${item.color} w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shadow-lg shadow-inner group-hover:scale-110 transition-transform`}>
                  {item.icon}
                </div>
                <div>
                  <p className="text-lg font-bold text-slate-400 uppercase tracking-widest mb-1">{item.label}</p>
                  
                  {/* SEJAJAR: Menggunakan items-baseline dan leading-none */}
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-slate-800 tracking-tight leading-none">
                      {item.val.toLocaleString('id-ID')}
                    </span>
                    <span className="text-2xl font-semibold text-slate-500 standard leading-none">
                      {item.unit}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          

          </div>

        </div>
      </section>

      {/* 5. BERITA TERKINI */}
      <section className="container mx-auto pb-20 px-4">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="text-3xl font-bold text-gray-800 text-black">Berita Desa</h2>
            <p className="text-gray-500">Informasi terbaru seputar kegiatan desa</p>
          </div>
          <Link href="/news" className="text-green-600 hover:text-green-700 font-bold border-b-2 border-green-600 pb-1 transition-all">
            Lihat Semua Berita →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-black font-bold">
          {newsItems.slice(0, 3).map((news) => (
            <article key={news.id} className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all overflow-hidden border border-gray-100 flex flex-col">
              <div className="relative h-48 overflow-hidden">
                <img src={news.image_url || 'https://via.placeholder.com/400x250?text=Berita+Desa'} alt={news.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
              </div>
              <div className="p-6 flex flex-col flex-grow">
                <p className="text-xs text-gray-400 mb-2 font-medium">📅 {new Date(news.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                <h3 className="text-xl font-bold text-gray-800 mb-3 line-clamp-2 uppercase">{news.title}</h3>
                <p className="text-gray-600 text-sm line-clamp-3 mb-6 font-medium">{news.content}</p>
                <div className="mt-auto">
                  <Link href={`/news/${news.id}`} className="inline-flex items-center text-green-600 font-bold text-sm">BACA SELENGKAPNYA →</Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      
    </div>
  );
}