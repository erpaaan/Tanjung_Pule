'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    // Sinkronisasi status login setiap kali URL berubah
    setIsLoggedIn(!!localStorage.getItem('adminToken'));
  }, [pathname]);

  return (
    <header className="bg-green-700 text-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-3">
          <div className="bg-white p-1.5 rounded-full">
            <img src="/logodesa.png" className="w-10 h-10 object-contain" alt="Logo" />
          </div>
          <div className="flex flex-col leading-tight uppercase font-bold text-white">
            <h1 className="text-lg md:text-xl font-extrabold">Desa Tanjung Pule</h1>
            <p className="text-[10px] opacity-90">Kabupaten Ogan Ilir</p>
          </div>
        </Link>

        <nav className="hidden md:block">
          <ul className="flex items-center space-x-6 text-sm font-bold text-white uppercase">
            <li><Link href="/" className="hover:text-green-200 text-white">Beranda</Link></li>
            <li><Link href="/about" className="hover:text-green-200 text-white">Profil</Link></li>
            <li><Link href="/services" className="hover:text-green-200 text-white">Layanan</Link></li>
            <li><Link href="/news" className="hover:text-green-200 text-white">Berita</Link></li>
            <li><Link href="/contact" className="hover:text-green-200 text-white">Kontak</Link></li>
            <li>
              <Link 
                href={isLoggedIn ? "/admin" : "/login-admin"} 
                className="bg-white text-green-700 px-5 py-2 rounded-full font-black text-xs shadow-sm hover:bg-green-50 transition-all"
              >
                {isLoggedIn ? '⚙️ Dashboard' : '🔐 Admin'}
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}