"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function PatientDashboard() {
  const router = useRouter(); // Initialize router

  // Example data for purchased insurance policies
  const purchasedInsurance = [
    { id: 1, policyName: "Health Insurance Plan A" },
    { id: 2, policyName: "Health Insurance Plan B" },
    { id: 3, policyName: "Health Insurance Plan C" },
  ];

  const handleGenerateDID = () => {
    router.push("/dashboard/patient/generateDid"); // Navigate to DID generation page
  };

  const handleApplyNow = () => {
    router.push("/dashboard/patient/insuranceForm"); // Navigate to the insurance form page
  };

  const handleClaimInsurance = () => {
    // Navigate to the claim form (no ID passed)
    router.push("/dashboard/patient/claimInsurance");
  };

  const handleViewPurchasedInsurance = () => {
    // Display the purchased insurance policies (you can update this logic as per your design)
    router.push("/dashboard/patient/purchasedInsurance");
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-blue-800 text-white p-5">
        <h2 className="text-2xl font-bold mb-6">Patient Dashboard</h2>
        <ul>
          <li className="mb-4"><a href="#" className="hover:text-gray-300">Home</a></li>
          <li className="mb-4" onClick={handleApplyNow}><a href="#" className="hover:text-gray-300">Apply for Insurance</a></li>
          <li className="mb-4" onClick={handleViewPurchasedInsurance}><a href="#" className="hover:text-gray-300">Purchased Insurance</a></li>
          <li className="mb-4"><a href="#" className="hover:text-gray-300">Profile</a></li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-10">
        <h1 className="text-3xl font-semibold mb-6">Welcome, Patient</h1>

        <Card className="mb-6">
          <CardContent className="p-6">
            <h2 className="text-xl font-bold">Decentralized Identifier (DID)</h2>
            <Button onClick={handleGenerateDID} className="mt-4 bg-green-500 text-white px-4 py-2 rounded">
              Generate DID
            </Button>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardContent className="p-6">
            <h2 className="text-xl font-bold">Apply for Insurance</h2>
            <p className="text-sm text-gray-600">Submit your details to request insurance.</p>
            <Button onClick={handleApplyNow} className="mt-4 bg-blue-500 text-white px-4 py-2 rounded">
              Apply Now
            </Button>
          </CardContent>
        </Card>

        {/* Purchased Insurance List */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <h2 className="text-xl font-bold">Purchased Insurance</h2>
            <div className="space-y-4">
              {purchasedInsurance.map((insurance) => (
                <div key={insurance.id} className="flex justify-between items-center">
                  <p className="text-lg">{insurance.policyName}</p>
                  <Button
                    onClick={handleClaimInsurance} // No insuranceId required
                    className="ml-4 bg-yellow-500 text-white px-4 py-2 rounded"
                  >
                    Claim
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
