'use client'

import customFetch from '@/customFetch';
import { faHouse, faListCheck, faLock, faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { useEffect, useState } from 'react'

interface ChildLayoutProps {
    children: React.ReactNode;
  }

export default function ChildLayout({ children }: ChildLayoutProps) {
    const tokenType = process.env.TOKEN_TYPE ?? "token";
    const pathname = usePathname()
    const [user, setUser] = useState<object | null>(null);
    const [error, setError] = useState<string | null>(null);
  
    const handleLogin = async () => {
      try {
        const res = await customFetch('/api/auth', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });
        if (res.data && res.data.id) {
          setUser(res.data)
          setError(null);
        } else {
          if (!pathname.includes('/login')) {
            window.location.href = '/login';
          }
        }
      } catch (err) {
        console.log(err)
        setError('An error occurred. Please try again.');
        // Redirect if not in login page
      }
    }
    useEffect(() => {
      handleLogin()
    }, [])

    const handleLogout = async () => {
        try {
          const res = await fetch('/api/auth/logout', {
            method: 'GET',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
          });

          if (res.ok) {
            if (tokenType == 'token') {
              sessionStorage.removeItem('bearer_token')
            }
            window.location.href = '/login';
          }
        } catch (err) {
            console.log(err)
            setError('An error occurred. Please try again.');
        }
      }
  return (
    <div>{user ? (
        <div className="flex h-screen">
          {/* Left Navbar */}
          <aside className="sm:w-56 w-32 bg-gray-800 text-white flex-shrink-0">
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
                  <button onClick={handleLogout} className="flex items-center p-3 hover:bg-gray-700">
                    <FontAwesomeIcon icon={faLock} />
                    <span className="mx-2">Logout</span>
                  </button>
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
                {error && (
                    <div className="flex items-center bg-yellow-500 text-white text-sm font-bold px-4 py-3" role="alert">
                        <svg className="fill-current w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M12.432 0c1.34 0 2.01.912 2.01 1.957 0 1.305-1.164 2.512-2.679 2.512-1.269 0-2.009-.75-1.974-1.99C9.789 1.436 10.67 0 12.432 0zM8.309 20c-1.058 0-1.833-.652-1.093-3.524l1.214-5.092c.211-.814.246-1.141 0-1.141-.317 0-1.689.562-2.502 1.117l-.528-.88c2.572-2.186 5.531-3.467 6.801-3.467 1.057 0 1.233 1.273.705 3.23l-1.391 5.352c-.246.945-.141 1.271.106 1.271.317 0 1.357-.392 2.379-1.207l.6.814C12.098 19.02 9.365 20 8.309 20z"/></svg>
                        <p>{error}</p>
                    </div>
                )}
                {children}
            </main>
          </div>
        </div>
    ) : (
      <>
        {children}
      </>
    )}
    </div>
  )
}
