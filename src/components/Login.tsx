import React, { useState } from "react";
import { useUser } from "@/context/UserContext";

const Login: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useUser();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!username.trim() || !password.trim()) {
      alert("Iltimos, username va parolni kiriting!");
      return;
    }

    login(username.trim());
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-sm mx-auto my-50 p-4 bg-lime-200 rounded shadow"
    >
      <h2 className="text-xl font-bold mb-4 text-sky-400">Login</h2>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="w-full p-2 border rounded mb-4 text-black"
      />
      <input
        type="password"
        placeholder="Parol"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full p-2 border rounded mb-4 text-black"
      />
      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 rounded"
      >
        Login
      </button>
    </form>
  );
};

export default Login;
