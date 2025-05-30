import React, { createContext, useContext, useState, useEffect } from "react";

interface UserContextType {
  username: string | null;
  login: (name: string) => void;
  logout: () => void;
  isAdmin: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    const savedUsername = localStorage.getItem("username");
    if (savedUsername) setUsername(savedUsername);
  }, []);

  const login = (name: string) => {
    localStorage.setItem("username", name);
    setUsername(name);
  };

  const logout = () => {
    localStorage.removeItem("username");
    setUsername(null);
  };

  const isAdmin = username === "otabek";

  return (
    <UserContext.Provider value={{ username, login, logout, isAdmin }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
