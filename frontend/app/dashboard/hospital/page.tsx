"use client";

import { useRouter } from "next/navigation";  // Import Next.js router
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function HospitalDashboard() {
  const router = useRouter(); // Initialize the router
  const [notifications, setNotifications] = useState(["Insurance proof requested for Patient #123"]);

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-blue-800 text-white p-5">
        <h2 className="text-2xl font-bold mb-6">Hospital Dashboard</h2>
        <ul>
          <li className="mb-4"><a href="#" className="hover:text-gray-300">Home</a></li>
          <li className="mb-4"><a href="#" className="hover:text-gray-300">Patient Records</a></li>
          <li className="mb-4"><a href="#" className="hover:text-gray-300">Proof Requests</a></li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-10">
        <h1 className="text-3xl font-semibold mb-6">Welcome, Hospital Admin</h1>

        <Card className="mb-6">
          <CardContent className="p-6">
            <h2 className="text-xl font-bold">Add Patient Data</h2>
            <Button 
              className="mt-4 bg-green-500 text-white px-4 py-2 rounded"
              onClick={() => router.push('/dashboard/hospital/health-form')} // Navigate to HealthForm
            >
              Add Record
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <h2 className="text-xl font-bold">Insurance Proof Requests</h2>
            <ul className="mt-4">
              {notifications.map((notification, index) => (
                <li key={index} className="mb-2 p-2 bg-gray-200 rounded">{notification}</li>
              ))}
            </ul>
            <Button className="mt-4 bg-blue-500 text-white px-4 py-2 rounded">
              Generate Proof
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
