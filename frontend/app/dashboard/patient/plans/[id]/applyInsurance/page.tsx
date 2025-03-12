"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

interface InsurancePlan {
  _id: string;
  plan: string;
  amount: number;
}

export default function ApplyInsurance() {
  const searchParams = useSearchParams();
  const planId = searchParams.get("planId");
  const [insurance, setInsurance] = useState<InsurancePlan | null>(null);
  const [paymentMethod, setPaymentMethod] = useState("Credit Card");

  useEffect(() => {
    if (!planId) return;

    // Fetch plan details
    fetch("http://localhost:5001/api/plans")
      .then((res) => res.json())
      .then((data: InsurancePlan[]) => {
        const selectedPlan = data.find((plan) => plan._id === planId);
        setInsurance(selectedPlan || null);
      })
      .catch((error) => console.error("Error fetching plan details:", error));
  }, [planId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Processing payment for:", {
      planId,
      amount: insurance?.amount,
      paymentMethod,
    });

    alert(`Payment Successful for Plan: ${insurance?.plan} using ${paymentMethod}`);
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100 p-6">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Apply for Insurance</h2>

        {!insurance ? (
          <p className="text-center text-gray-500">Loading plan details...</p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Plan Name Highlight */}
            <div className="text-center bg-blue-100 p-3 rounded-lg">
              <h3 className="text-lg font-semibold text-blue-800">{insurance.plan}</h3>
            </div>

            {/* Plan ID (Read-Only) */}
            <div>
              <label className="block text-gray-700 font-medium">Plan ID</label>
              <input
                type="text"
                value={insurance._id}
                readOnly
                className="w-full p-2 border rounded bg-gray-100 text-gray-700 font-semibold"
              />
            </div>

            {/* Pay Amount (Read-Only) */}
            <div>
              <label className="block text-gray-700 font-medium">Pay Amount</label>
              <input
                type="text"
                value={`$${insurance.amount}`}
                readOnly
                className="w-full p-2 border rounded bg-gray-100 text-gray-700 font-semibold"
              />
            </div>

            {/* Payment Method */}
            <div>
              <label className="block text-gray-700 font-medium">Payment Method</label>
              <select
                className="w-full p-2 border rounded text-gray-700 bg-white"
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
              >
                <option value="Credit Card">Credit Card</option>
                <option value="UPI">UPI</option>
                <option value="Net Banking">Net Banking</option>
              </select>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-blue-600 text-white p-3 rounded-md hover:bg-blue-700 font-semibold transition"
            >
              Pay Now
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
