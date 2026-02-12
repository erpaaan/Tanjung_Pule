'use client';

import { useEffect, useState } from 'react';

interface ContactItem {
  id: number;
  name: string;
  email?: string;
  message: string;
  created_at: string;
}

export default function ComplaintsSidebar() {
  const [items, setItems] = useState<ContactItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const fetchContacts = async () => {
      try {
        const res = await fetch('/api/contacts');
        const data = await res.json();
        if (!mounted) return;
        if (Array.isArray(data)) {
          setItems(data.slice(0, 6)); // tampilkan 6 teratas
        } else {
          setItems([]);
        }
      } catch (err) {
        console.error('Error fetching contacts:', err);
        setItems([]);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    // initial fetch
    fetchContacts();

    // allow other components (form) to notify sidebar to refetch
    const refetch = () => {
      setLoading(true);
      fetchContacts().catch(() => {});
    };

    window.addEventListener('contacts:updated', refetch);

    return () => {
      mounted = false;
      window.removeEventListener('contacts:updated', refetch);
    };
  }, []);

  const formatDate = (iso?: string) =>
    iso ? new Date(iso).toLocaleDateString('id-ID', { day: '2-digit', month: 'short' }) : '';

  return (
    <aside className="w-full">
      <div className="bg-white bg-opacity-80 p-4 rounded-lg shadow-sm sticky top-24">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold">Pengaduan Masyarakat</h3>
          <a href="/contact" className="text-sm text-green-600 hover:underline">Lihat semua</a>
        </div>

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((s) => (
              <div key={s} className="h-12 bg-gray-100 rounded animate-pulse" />
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="text-sm text-gray-600">Belum ada pengaduan masuk.</div>
        ) : (
          <ul className="space-y-3">
            {items.map((it) => (
              <li key={it.id} className="p-3 bg-white rounded-lg border border-gray-100 shadow-sm">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-800 truncate">{it.name}</span>
                      <span className="text-xs text-gray-500">· {formatDate(it.created_at)}</span>
                    </div>
                    <p className="mt-1 text-sm text-gray-600 line-clamp-3">{it.message}</p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}

        <div className="mt-4 text-xs text-gray-500">Menampilkan 6 pengaduan terbaru</div>
      </div>
    </aside>
  );
}
