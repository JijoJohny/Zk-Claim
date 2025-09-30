"use client";

import { useRouter } from "next/navigation";
import { UserCircle, Home, ShieldCheck } from "lucide-react";

export default function Sidebar() {
  const router = useRouter();

  return (
    <div className="w-72 bg-blue-900 text-white p-5 flex flex-col items-center shadow-lg">
      {/* Profile Section */}
      <div className="flex flex-col items-center mb-6 cursor-pointer" onClick={() => router.push("/dashboard/patient")}>
        <div className="w-24 h-24 border-4 border-white rounded-full overflow-hidden">
          <img src="/Images/user.png" alt="Profile" className="w-full h-full object-cover" />
        </div>
        <h3 className="mt-3 text-lg font-semibold">User</h3>
      </div>

      {/* Sidebar Menu */}
      <ul className="w-full space-y-4">
        <li className="flex items-center p-3 rounded-lg cursor-pointer hover:bg-blue-700" onClick={() => router.push("/dashboard/patient")}>
          <UserCircle className="w-6 h-6 mr-3" /> Profile
        </li>
        <li className="flex items-center p-3 rounded-lg cursor-pointer hover:bg-blue-700" onClick={() => router.push("/dashboard/patient/plans")}>
          <Home className="w-6 h-6 mr-3" /> Home
        </li>
        <li className="flex items-center p-3 rounded-lg cursor-pointer hover:bg-blue-700" onClick={() => router.push("/dashboard/patient/purchased")}>
          <ShieldCheck className="w-6 h-6 mr-3" /> Insurance Purchased 
        </li>
      </ul>
    </div>
  );
}
