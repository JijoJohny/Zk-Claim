"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ShieldCheck } from "lucide-react"; // Icon for plans

export default function PlansPage() {
  const [plans, setPlans] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5001/api/plans")
      .then((res) => res.json())
      .then((data) => setPlans(data))
      .catch((error) => console.error("Error fetching plans:", error));
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Insurance Plans</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {plans.map((plan) => (
          <Card key={plan._id} className="p-6 shadow-lg rounded-2xl flex flex-col items-center space-y-4 w-80 h-64">
            {/* Icon inside a larger circle */}
            <div className="w-16 h-16 flex items-center justify-center bg-blue-500 text-white rounded-full">
              <ShieldCheck size={32} />
            </div>

            {/* Plan details */}
            <CardContent className="text-center">
              <h3 className="text-xl font-semibold">{plan.plan}</h3>
              <p className="text-gray-600 mt-2">Comprehensive coverage for your health.</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
