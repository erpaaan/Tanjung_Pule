'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginAdmin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Jika sudah ada token, langsung lempar ke Hub Utama
    if (localStorage.getItem('adminToken')) {
      router.push('/admin');
    }
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: username.trim(), password: password.trim() }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem('adminToken', 'true');
        alert('Login Berhasil! Selamat bekerja.');
        router.push('/admin');
        router.refresh();
      } else {
        alert(data.error || 'Username atau Password salah!');
      }
    } catch (err) {
      alert('Terjadi masalah koneksi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4 font-sans text-black">
      <form onSubmit={handleLogin} className="bg-white p-10 rounded-[2.5rem] shadow-2xl w-full max-w-md space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-black text-slate-800 uppercase tracking-tight">Admin Login</h1>
          <p className="text-xs text-blue-500 font-bold uppercase tracking-widest mt-2">Desa Tanjung Pule</p>
        </div>

        <div className="space-y-4">
          <input 
            type="text" 
            placeholder="Username / Email" 
            required
            className="w-full p-4 border-2 border-slate-200 rounded-2xl focus:border-blue-500 outline-none font-bold"
            onChange={(e) => setUsername(e.target.value)}
          />
          <input 
            type="password" 
            placeholder="Password" 
            required
            className="w-full p-4 border-2 border-slate-200 rounded-2xl focus:border-blue-500 outline-none font-bold"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button 
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-2xl font-black text-lg shadow-lg active:scale-95 transition-all"
        >
          {loading ? '⌛ MENGECEK...' : 'MASUK KE DASHBOARD'}
        </button>
      </form>
    </div>
  );
}