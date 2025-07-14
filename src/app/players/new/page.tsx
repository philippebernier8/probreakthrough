"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AddPlayerPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: '',
    position: '',
    school: '',
    pbIndex: '',
  });
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const players = JSON.parse(localStorage.getItem('players') || '[]');
    const newPlayer = {
      ...form,
      id: Date.now().toString(),
      pbIndex: Number(form.pbIndex),
      image: '',
    };
    localStorage.setItem('players', JSON.stringify([...players, newPlayer]));
    setSuccess(true);
    setTimeout(() => {
      router.push('/players');
    }, 1000);
  };

  return (
    <div className="max-w-xl mx-auto py-12">
      <h1 className="text-2xl font-bold mb-6">Add New Athlete</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
          required
          className="w-full border rounded px-4 py-2"
        />
        <input
          name="position"
          placeholder="Position"
          value={form.position}
          onChange={handleChange}
          required
          className="w-full border rounded px-4 py-2"
        />
        <input
          name="school"
          placeholder="School/Club"
          value={form.school}
          onChange={handleChange}
          required
          className="w-full border rounded px-4 py-2"
        />
        <input
          name="pbIndex"
          placeholder="PB Index"
          type="number"
          value={form.pbIndex}
          onChange={handleChange}
          required
          className="w-full border rounded px-4 py-2"
        />
        <button
          type="submit"
          className="w-full bg-red-600 text-white py-2 rounded hover:bg-red-700"
        >
          Add Athlete
        </button>
        {success && <div className="text-green-600 mt-2">Athlete added! Redirecting...</div>}
      </form>
    </div>
  );
} 