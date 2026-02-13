"use client";

import { useRouter } from "next/navigation";
import { clearAuth, getUsername, getEmail } from "@/lib/auth";

export default function UserInfo() {
  const router = useRouter();
  const username = getUsername();
  const email = getEmail();

  function handleLogout() {
    if (confirm("Are you sure you want to logout?")) {
      clearAuth();
      router.push("/login");
    }
  }

  return (
    <div className="bg-white/95 p-4 rounded-lg flex justify-between items-center mb-5 shadow-md">
      <div className="text-gray-700">
        <strong className="font-semibold">{username || "User"}</strong>
        <span className="text-gray-500 ml-2.5">{email}</span>
      </div>
      <button
        onClick={handleLogout}
        className="bg-red-600 text-white px-5 py-2 rounded-md text-sm font-semibold hover:bg-red-700 transition-colors"
      >
        Logout
      </button>
    </div>
  );
}
