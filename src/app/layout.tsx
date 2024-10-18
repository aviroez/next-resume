'use client'

import type { Metadata } from "next";
import "./globals.css";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHouse, faUser, faLock, faListCheck } from '@fortawesome/free-solid-svg-icons';


// TODO: comment first to accomodate handle login
// export const metadata: Metadata = {
//   title: "Create Next App",
//   description: "Generated by create next app",
// };

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname()
  console.log(pathname)
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

        // Redirect if not in login page
        if (!pathname.includes('/login')) {
          window.location.href = '/login';
        }
      } else if (!json.success){
        if (!pathname.includes('/login')) {
          window.location.href = '/login';
        }
        setError(json.message);
      } else {
        setUser(json.data)
        setError(null);
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    }
  }
  useEffect(() => {
    handleLogin()
  }, [])

  return (
    <html lang="en">
      <body>
      {user ? (
          <div className="flex h-screen">
            {/* Left Navbar */}
            <aside className="w-64 bg-gray-800 text-white flex-shrink-0">
              <div className="p-4 text-lg font-bold">Menu</div>
              <nav>
                <ul className="space-y-2">
                  <li>
                    <Link href="/" className="flex items-center p-3 hover:bg-gray-700">
                      <FontAwesomeIcon icon={faHouse} />
                      <span className="mx-2">Dashboard</span>
                    </Link>
                  </li>
                  <li>
                    <Link href="/users" className="flex items-center p-3 hover:bg-gray-700">
                      <FontAwesomeIcon icon={faUser} />
                      <span className="mx-2">Users</span>
                    </Link>
                  </li>
                  <li>
                    <Link href="/portfolios" className="flex items-center p-3 hover:bg-gray-700">
                      <FontAwesomeIcon icon={faListCheck} />
                      <span className="mx-2">Portfolios</span>
                    </Link>
                  </li>
                  <li>
                    <Link href="/users" className="flex items-center p-3 hover:bg-gray-700">
                      <FontAwesomeIcon icon={faLock} />
                      <span className="mx-2">Logout</span>
                    </Link>
                  </li>
                </ul>
              </nav>
            </aside>

            {/* Content Area */}
            <div className="flex-1 flex flex-col">
              {/* Top Bar */}
              <header className="bg-gray-900 text-white p-4">
                <h1 className="text-xl">Admin</h1>
              </header>

              {/* Main Content */}
              <main className="flex-1 p-4 overflow-auto">
                {children}
              </main>
            </div>
          </div>
      ) : (
        <>
          {children}
        </>          
      )}
      </body>
    </html>
  );
}
