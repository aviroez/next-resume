'use client'

import { useEffect, useState } from "react";

export default function Home({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<object | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async () => {
    try {
      const res = await fetch('/api/auth', {
        method: 'GET',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
      });

      const json = await res.json();
      if (!res.ok) {
        setError(json.message || 'Login failed');
        window.location.href = '/login'; // Example redirect after successful login
      } else {
        setUser(json.data)
        setError(null);
        // Redirect or update the UI as needed
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    }
  }
  useEffect(() => {
    handleLogin()
  }, [])
  const users = [{id: 1, name: 'Aviroez', email: 'avi.roez@gmail.com'}]
  return (
    <div>
      <h2 className="text-2xl font-bold">Welcome to the Admin Panel</h2>
      <p>Please select a menu item from the left to get started.</p>
    </div>
  );
}
