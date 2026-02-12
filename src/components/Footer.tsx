import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          
          {/* 1. BRAND & DESKRIPSI */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="bg-white p-1 rounded-full">
                <img 
                  src="/logodesa.png" 
                  alt="Logo Desa" 
                  className="w-10 h-10 object-contain"
                />
              </div>
              <div>
                <h3 className="text-white font-bold text-lg leading-tight">Desa Tanjung Pule</h3>
                <p className="text-[10px] uppercase tracking-widest text-green-500 font-bold">Ogan Ilir, Sumsel</p>
              </div>
            </div>
            <p className="text-sm leading-relaxed opacity-80">
              Website resmi Desa Tanjung Pule sebagai sarana informasi, transparansi, dan pelayanan digital bagi seluruh masyarakat desa.
            </p>
          </div>

          {/* 2. TAUTAN CEPAT */}
          <div>
            <h4 className="text-white font-bold mb-6 border-b-2 border-green-600 pb-2 inline-block">Tautan Cepat</h4>
            <ul className="space-y-3 text-sm">
              <li><Link href="/" className="hover:text-green-500 transition-colors">Beranda</Link></li>
              <li><Link href="/about" className="hover:text-green-500 transition-colors">Profil Desa</Link></li>
              <li><Link href="/services" className="hover:text-green-500 transition-colors">Layanan Publik</Link></li>
              <li><Link href="/news" className="hover:text-green-500 transition-colors">Warta Desa</Link></li>
            </ul>
          </div>

          {/* 3. LAYANAN SURAT */}
          <div>
            <h4 className="text-white font-bold mb-6 border-b-2 border-green-600 pb-2 inline-block">Layanan Surat</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2">
                <span className="text-green-500">✔</span> Surat Domisili
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-500">✔</span> Keterangan Usaha
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-500">✔</span> Keterangan Tidak Mampu
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-500">✔</span> Pengantar Nikah
              </li>
            </ul>
          </div>

          {/* 4. KONTAK & ALAMAT */}
          <div>
            <h4 className="text-white font-bold mb-6 border-b-2 border-green-600 pb-2 inline-block">Kontak Kami</h4>
            <ul className="space-y-4 text-sm text-gray-400">
              <li className="flex items-start gap-3">
                <span className="text-green-500 text-lg">📍</span>
                <span>Jl. Desa Tanjung Pule, Kec. Indralaya Utara, Kab. Ogan Ilir, Sumatera Selatan 30862</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="text-green-500 text-lg">📞</span>
                <span>+62 821-xxxx-xxxx</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="text-green-500 text-lg">✉️</span>
                <span>tanjungpule@oganilir.go.id</span>
              </li>
            </ul>
          </div>
        </div>

        {/* BOTTOM BAR */}
        <div className="pt-8 border-t border-gray-800 text-center">
          <p className="text-xs opacity-50">
            &copy; {new Date().getFullYear()} Pemerintah Desa Tanjung Pule. All Rights Reserved. <br className="md:hidden" />
            Designed by <span className="text-green-600 font-bold italic">Kader KKN Tanjung Pule 2026</span>
          </p>
        </div>
      </div>
    </footer>
  );
}