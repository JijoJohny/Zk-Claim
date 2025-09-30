"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { User } from "lucide-react";

export default function PatientsPage() {
  const [patients, setPatients] = useState([]);
  const router = useRouter();

  useEffect(() => {
    fetch("http://localhost:5001/api/patients/dids") // Fetch from the correct endpoint
      .then((res) => res.json())
      .then((data) => setPatients(data))
      .catch((error) => console.error("Error fetching patient DIDs:", error));
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Patient List</h2>
      <div className="flex flex-col space-y-4"> {/* Ensure cards are in a vertical list */}
        {patients.map((patient, index) => (
          <Card
            key={index} // Using index as key if DID is null
            className="p-6 shadow-lg rounded-2xl flex items-center space-x-4 cursor-pointer hover:bg-gray-100 transition"
            onClick={() => router.push(`/dashboard/hospital/patients/${patient.did}`)}
          >
            <div className="w-12 h-12 flex items-center justify-center bg-gray-200 text-gray-600 rounded-full">
              <User size={24} />
            </div>
            <CardContent>
              <h3 className="text-lg font-semibold">{patient.did || "Unknown DID"}</h3>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
