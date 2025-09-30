"use client";

import { useRouter } from "next/navigation";
import { Hospital, Briefcase, Users, FileText, Bell } from "lucide-react";

export default function Sidebar() {
  const router = useRouter();

  return (
    <div className="w-72 bg-blue-900 text-white p-5 flex flex-col items-center shadow-lg">
      {/* Profile Section */}
      <div className="flex flex-col items-center mb-6 cursor-pointer" onClick={() => router.push("/dashboard/hospital/profile")}>
        <div className="w-24 h-24 border-4 border-white rounded-full overflow-hidden">
          <img src="/Images/hopsitalicon.jpg" alt="Profile" className="w-full h-full object-cover" />
        </div>
        <h3 className="mt-3 text-lg font-semibold">Apollo Medical Center</h3>
      </div>

      {/* Sidebar Menu */}
      <ul className="w-full space-y-4">
        <li className="flex items-center p-3 rounded-lg cursor-pointer hover:bg-blue-700" onClick={() => router.push("/dashboard/hospital")}>
          <Hospital className="w-6 h-6 mr-3" /> Home
        </li>
        <li className="flex items-center p-3 rounded-lg cursor-pointer hover:bg-blue-700" onClick={() => router.push("/dashboard/hospital/services")}>
          <Briefcase className="w-6 h-6 mr-3" /> Services
        </li>
        <li className="flex items-center p-3 rounded-lg cursor-pointer hover:bg-blue-700" onClick={() => router.push("/dashboard/hospital/patients")}>
          <Users className="w-6 h-6 mr-3" /> Patients
        </li>
        <li className="flex items-center p-3 rounded-lg cursor-pointer hover:bg-blue-700" onClick={() => router.push("/dashboard/hospital/ehr")}>
          <FileText className="w-6 h-6 mr-3" /> EHR
        </li>
        <li className="flex items-center p-3 rounded-lg cursor-pointer hover:bg-blue-700" onClick={() => router.push("/dashboard/hospital/notifications")}>
          <Bell className="w-6 h-6 mr-3" /> Notifications
        </li>
      </ul>
    </div>
  );
}
