'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

interface Officer {
  id: number;
  name: string;
  role: string;
  image_url: string;
}

interface VillageData {
  total_residents: number;
  total_families: number;
}

interface LeaderData {
  name: string;
  message: string;
  image_url: string;
}

export default function About() {
  const [officers, setOfficers] = useState<Officer[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<VillageData>({ total_residents: 0, total_families: 0 });
  const [leader, setLeader] = useState<LeaderData>({ name: '', message: '', image_url: '' });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resOff = await fetch('/api/desa-officers');
        if (resOff.ok) setOfficers(await resOff.json());

        const resStats = await fetch('/api/desa-config?target=stats');
        if (resStats.ok) setStats(await resStats.json());

        const resLeader = await fetch('/api/desa-config?target=leader');
        if (resLeader.ok) setLeader(await resLeader.json());

      } catch (error) {
        console.error('Gagal memuat data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 pb-20 font-sans text-black">
      {/* 1. HERO SECTION */}
      <section className="relative h-[300px] md:h-[400px] flex items-center justify-center text-white">
        <div 
          className="absolute inset-0 bg-cover bg-center z-0"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80')" }}
        >
          <div className="absolute inset-0 bg-green-900/70 backdrop-blur-sm"></div>
        </div>
        <div className="relative z-10 text-center px-4">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-4 drop-shadow-md text-white">
            Profil Desa Tanjung Pule
          </h1>
          <p className="text-lg md:text-xl opacity-90 font-light max-w-2xl mx-auto text-white">
            Mengenal lebih dekat sejarah, visi misi, dan jajaran aparatur pelayan masyarakat.
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 -mt-16 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 text-black">
          
          <div className="lg:col-span-2 space-y-8">
            {/* VISI & MISI */}
            <div className="bg-white p-8 rounded-2xl shadow-lg border-t-4 border-green-600 text-black">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                <span className="bg-green-100 p-2 rounded-lg mr-3">🎯</span> Visi & Misi
              </h2>
              <div className="bg-green-50 p-6 rounded-xl mb-8 border-l-4 border-green-600">
                <h3 className="text-green-800 font-bold uppercase text-xs tracking-widest mb-2">Visi</h3>
                <p className="text-xl text-gray-700 italic leading-relaxed">
                  "Menciptakan desa yang maju, mandiri, dan berkelanjutan melalui pemberdayaan masyarakat dan optimalisasi teknologi digital."
                </p>
              </div>
              <div className="space-y-4">
                <h3 className="text-gray-800 font-bold uppercase text-xs tracking-widest mb-4">Misi</h3>
                {[
                  "Meningkatkan kualitas SDM melalui pendidikan dan pelatihan.",
                  "Mewujudkan tata kelola pemerintahan desa yang transparan.",
                  "Membangun infrastruktur desa yang merata dan berkualitas.",
                  "Mendorong ekonomi kreatif berbasis potensi lokal."
                ].map((misi, i) => (
                  <div key={i} className="flex gap-4 items-start bg-gray-50 p-3 rounded-lg text-black">
                    <div className="bg-green-600 text-white h-6 w-6 rounded-full flex items-center justify-center text-xs flex-shrink-0 mt-1">
                      {i + 1}
                    </div>
                    <p className="text-gray-600 text-sm md:text-base">{misi}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* SEJARAH CARD */}
            <div className="bg-white p-8 rounded-2xl shadow-lg text-black">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                <span className="bg-green-100 p-2 rounded-lg mr-3">📜</span> Sejarah Desa
              </h2>
              <div className="prose prose-green max-w-none text-gray-600 leading-relaxed space-y-4">
                <p>
                  Desa Tanjung Pule terletak di Kabupaten Ogan Ilir, Sumatera Selatan. Nama "Tanjung Pule" sendiri diambil dari kondisi geografis wilayahnya yang menanjung dan banyaknya pohon Pule yang tumbuh subur di wilayah ini pada masa lampau.
                </p>
                <p>
                  Sejak masa kolonial hingga era kemerdekaan, desa ini dikenal sebagai wilayah agraris yang tangguh. Masyarakatnya secara turun-temurun menjaga tradisi gotong royong dan kearifan lokal.
                </p>
              </div>
            </div>

            {/* APARATUR SECTION */}
            <div className="bg-white p-8 rounded-2xl shadow-lg text-black">
              <h2 className="text-2xl font-bold text-gray-800 mb-8 flex items-center">
                <span className="bg-green-100 p-2 rounded-lg mr-3">👥</span> Aparatur & Kader Desa
              </h2>
              
              {loading ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-8 animate-pulse text-black">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex flex-col items-center text-black">
                      <div className="w-24 h-24 md:w-32 md:h-32 bg-gray-200 rounded-full mb-4"></div>
                      <div className="h-4 w-24 bg-gray-200 rounded"></div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-8 text-black">
                  {officers
                    .filter((kader) => kader.name && kader.name !== 'EMPTY' && kader.name.trim() !== '')
                    .map((kader) => (
                      <div key={kader.id} className="group text-center text-black">
                        <div className="relative w-24 h-24 md:w-32 md:h-32 mx-auto mb-4 overflow-hidden rounded-full border-4 border-gray-100 shadow-md transition-all group-hover:border-green-500 text-black">
                          {kader.image_url ? (
                            <img 
                              src={kader.image_url} 
                              alt={kader.name} 
                              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110 text-black" 
                            />
                          ) : (
                            <div className="w-full h-full bg-gray-200" />
                          )}
                        </div>
                        <h3 className="font-bold text-gray-800 text-sm md:text-base leading-tight uppercase text-black">
                          {kader.name}
                        </h3>
                        <p className="text-green-600 text-xs md:text-sm font-medium mt-1 text-black">
                          {kader.role}
                        </p>
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>

          {/* SIDEBAR */}
          <div className="space-y-8 text-black">
            <div className="bg-white p-6 rounded-2xl shadow-lg border-b-4 border-green-600 text-black">
              <h3 className="font-bold text-gray-800 mb-4 flex items-center text-black">
                <span className="mr-2">📍</span> Informasi Wilayah
              </h3>
              <ul className="space-y-3 text-black">
                <li className="flex justify-between text-sm border-b pb-2 text-black">
                  <span className="text-gray-500">Populasi</span>
                  <span className="font-bold text-gray-800">{stats.total_residents.toLocaleString('id-ID')} Jiwa</span>
                </li>
                <li className="flex justify-between text-sm border-b pb-2 text-black">
                  <span className="text-gray-500">Keluarga</span>
                  <span className="font-bold text-gray-800">{stats.total_families.toLocaleString('id-ID')} KK</span>
                </li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-green-600 to-green-800 p-8 rounded-2xl shadow-xl text-white">
              <div className="w-20 h-20 bg-white/20 rounded-full mx-auto mb-4 overflow-hidden border-2 border-white/50 text-white">
                {leader.image_url && <img src={leader.image_url} alt="Kades" className="w-full h-full object-cover text-white" />}
              </div>
              <h4 className="font-bold text-center text-white">{leader.name || "Kepala Desa"}</h4>
              <p className="text-sm italic text-center opacity-90 border-t border-white/20 pt-4 text-white">
                "{leader.message || "Selamat datang."}"
              </p>
            </div>

            <Link href="/" className="block text-black">
              <button className="w-full bg-gray-800 hover:bg-black text-white py-3 rounded-xl font-bold text-white">
                ← Kembali
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}