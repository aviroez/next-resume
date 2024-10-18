'use client';

import { useState, FormEvent } from 'react';

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
        headers: { 'Content-Type': 'application/json' },
      });

      if (!res.ok) {
        const errorData = await res.json();
        setError(errorData.message || 'Login failed');
      } else {
        setError(null);
        // Redirect or update the UI as needed
        window.location.href = '/'; // Example redirect after successful login
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    }
  }

  return (
    <div className="max-w-md mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-4">Login</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-black">
            Email
          </label>
          <input
            type="email"
            name="email"
            id="email"
            placeholder="Email..."
            required
            className="w-full p-2 border rounded mt-1"
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-black">
            Password
          </label>
          <input
            type="password"
            name="password"
            id="password"
            placeholder="Password..."
            required
            className="w-full p-2 border rounded mt-1"
          />
        </div>
        <button type="submit" className="w-full bg-gray-500 text-white p-2 rounded hover:bg-slate-800">
          Login
        </button>
      </form>
    </div>
  );
}
