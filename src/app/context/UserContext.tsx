// context/UserContext.tsx
import React, { createContext, useContext, useEffect, useState } from 'react';

interface UserContextType {
  user: object;
  setUser: (user: object) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<object>({}); // Replace with your auth logic

  const handleLogin = async () => {
    try {
      const res = await fetch('/api/auth', {
        method: 'GET',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
      });

      const json = await res.json();
      if (!res.ok) {
        window.location.href = '/login'; // Redirect if not loggedin
      } else {
        setUser(json.data)
        // Redirect or update the UI as needed
      }
    } catch (err) {
    }
  }
//   handleLogin()
  useEffect(() => {
    handleLogin()
  }, [])

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
