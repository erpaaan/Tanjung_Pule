'use client';

import { useState, useEffect } from 'react';

interface User {
  id: number;
  name: string;
  email: string;
  created_at: string;
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ name: '', email: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch users
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/users');
      const data = await res.json();
      setUsers(data);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  // Add user
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) return;

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setFormData({ name: '', email: '' });
        fetchUsers();
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete user
  const handleDelete = async (id: number) => {
    if (!confirm('Yakin ingin menghapus?')) return;

    try {
      const res = await fetch(`/api/users/${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        fetchUsers();
      }
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) return <div className="p-8 text-center">Loading...</div>;

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Kelola User</h1>

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow mb-8">
        <div className="grid gap-4 mb-4">
          <input
            type="text"
            placeholder="Nama"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="border p-2 rounded"
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="border p-2 rounded"
            required
          />
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {isSubmitting ? 'Menambah...' : 'Tambah User'}
        </button>
      </form>

      {/* Users Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="p-4 text-left">ID</th>
              <th className="p-4 text-left">Nama</th>
              <th className="p-4 text-left">Email</th>
              <th className="p-4 text-left">Dibuat</th>
              <th className="p-4 text-left">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-b hover:bg-gray-50">
                <td className="p-4">{user.id}</td>
                <td className="p-4">{user.name}</td>
                <td className="p-4">{user.email}</td>
                <td className="p-4 text-sm text-gray-500">
                  {new Date(user.created_at).toLocaleDateString('id-ID')}
                </td>
                <td className="p-4">
                  <button
                    onClick={() => handleDelete(user.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
                  >
                    Hapus
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {users.length === 0 && (
        <div className="text-center text-gray-500 py-8">
          Belum ada user
        </div>
      )}
    </div>
  );
}
