"use client"; // Ensures this is a Client Component

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation"; // Import Next.js hooks
import { Button } from "@/components/ui/button";

const InsuranceClaimForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams(); // Get query params from URL

  const insuranceId = searchParams.get("insuranceId"); // Extract insuranceId from URL

  const [claimData, setClaimData] = useState({
    did: "",
    insuranceId: insuranceId || "", // Store insurance ID from URL
    claimDisease: "",  // ✅ Fixed field name
    claimAmount: "",
    hospitalName: "",
  });

  useEffect(() => {
    if (insuranceId) {
      setClaimData((prev) => ({ ...prev, insuranceId }));
    }
  }, [insuranceId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setClaimData((prev) => ({
      ...prev,
      [name]: name === "claimAmount" ? String(Math.max(0, Number(value))) : value, // Ensure claimAmount is valid
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5001/api/claims", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(claimData),
      });

      if (response.ok) {
        alert("Claim submitted successfully!");
        router.push("/dashboard/patient/purchased/"); // Redirect after submission
      } else {
        alert("Failed to submit claim.");
      }
    } catch (error) {
      console.error("Error submitting claim:", error);
      alert("An error occurred. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-lg mx-auto p-6 bg-white shadow-lg rounded-md space-y-6">
      <h2 className="text-3xl font-semibold text-center">Insurance Claim Form</h2>

      <div className="space-y-4">
        {/* DID Field */}
        <div>
          <label htmlFor="did" className="block text-sm font-medium text-gray-700">DID</label>
          <input
            type="text"
            id="did"
            name="did"
            value={claimData.did}
            onChange={handleChange}
            required
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Insurance ID Field (Read-Only) */}
        <div>
          <label htmlFor="insuranceId" className="block text-sm font-medium text-gray-700">Insurance ID</label>
          <input
            type="text"
            id="insuranceId"
            name="insuranceId"
            value={claimData.insuranceId}
            readOnly // Make it non-editable
            className="w-full p-3 border border-gray-300 rounded-md bg-gray-100 text-gray-500 cursor-not-allowed"
          />
        </div>

        {/* Claim Disease Field ✅ Fixed field name */}
        <div>
          <label htmlFor="claimDisease" className="block text-sm font-medium text-gray-700">Claim Disease</label>
          <input
            type="text"
            id="claimDisease"
            name="claimDisease"
            value={claimData.claimDisease}
            onChange={handleChange}
            required
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Claim Amount Field */}
        <div>
          <label htmlFor="claimAmount" className="block text-sm font-medium text-gray-700">Claim Amount</label>
          <input
            type="number"
            id="claimAmount"
            name="claimAmount"
            value={claimData.claimAmount}
            onChange={handleChange}
            min="0"
            required
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Hospital Name Field */}
        <div>
          <label htmlFor="hospitalName" className="block text-sm font-medium text-gray-700">Hospital Name</label>
          <input
            type="text"
            id="hospitalName"
            name="hospitalName"
            value={claimData.hospitalName}
            onChange={handleChange}
            required
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Submit Button */}
      <div className="text-center">
        <Button type="submit" className="mt-6 w-full py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600">
          Submit Claim
        </Button>
      </div>
    </form>
  );
};

export default InsuranceClaimForm;
