"use client";

import { useRouter } from "next/navigation";

export function useAuth() {
  const router = useRouter();

  const login = async (data: { email: string; password: string }) => {
    
    // 🔥 MOCK LOGIN CHECK
    if (data.email === "admin@test.com" && data.password === "123456") {
      
      // store fake user
      localStorage.setItem("user", JSON.stringify({ email: data.email }));

      return true;
    }

    throw new Error("Invalid credentials");
  };

  const logout = () => {
    localStorage.removeItem("user");
    router.push("/");
  };

  return { login, logout };
}