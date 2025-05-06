"use client";

import { useEffect } from "react";

export default function Logout() {
  useEffect(() => {
    // Clear auth cookie
    document.cookie = "auth_token=; Max-Age=0; Path=/; SameSite=Lax";

    // Optional: clear storage
    localStorage.clear();
    sessionStorage.clear();

    // Delay slightly before redirect to avoid hydration issues
    setTimeout(() => {
      window.location.href = "/auth/sign-in";
    }, 10);
  }, []);

  return (
    <div className="flex justify-center items-center h-screen">
      <p className="text-lg text-gray-700">Logging out...</p>
    </div>
  );
}
