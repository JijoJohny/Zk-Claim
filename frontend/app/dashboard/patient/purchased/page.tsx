"use client"; // Ensures this is a Client Component

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; // Import Next.js router
import { User } from "lucide-react";
import { useDID } from "@/context/DIDContext";

export default function UserProfile() {
  const { did } = useDID(); // Get DID from context
  const [insurances, setInsurances] = useState([]); // Stores insurance plans
  const [claims, setClaims] = useState([]); // Stores user's claim requests
  const router = useRouter(); // Initialize Next.js router

  // Fetch user's purchased insurance plans and claims
  useEffect(() => {
    if (!did) return;

    fetch(`http://localhost:5001/api/insurance/${did}`)
      .then((res) => res.json())
      .then((data) => setInsurances(Array.isArray(data) ? data : [])) // Ensure array
      .catch((error) => {
        console.error("Error fetching insurance plans:", error);
        setInsurances([]); // Ensure empty array in case of error
      });

    fetch(`http://localhost:5001/api/claims/${did}`)
      .then((res) => res.json())
      .then((data) => {
        console.log("API Response for claims:", data);
        setClaims(Array.isArray(data) ? data : []); // Ensure array
      })
      .catch((error) => {
        console.error("Error fetching claims:", error);
        setClaims([]); // Ensure empty array in case of error
      });
  }, [did]);

  // Navigate to the claim page
  const handleClaimClick = (insuranceId: string) => {
    router.push(`claimInsurance?insuranceId=${insuranceId}`);
  };

  if (insurances.length === 0) return <p className="text-center mt-6">No insurance plans found.</p>;

  return (
    <div className="p-6">
      <div className="flex items-center space-x-4 mb-6">
        <div className="w-16 h-16 flex items-center justify-center bg-gray-200 text-gray-600 rounded-full">
          <User size={32} />
        </div>
        <h3 className="text-2xl font-semibold">User {did}</h3>
      </div>

      <div className="space-y-4">
        {insurances.map((insurance) => {
          // Ensure claims is an array before using .find()
          const matchingClaim = (claims || []).find(
            (claim) => claim.insuranceId === insurance._id
          );
          const claimStatus = matchingClaim ? matchingClaim.claimStatus : "Claim Now";

          // Define button styles
          let buttonClass = "bg-blue-600 text-white"; // Default: Claim Now (blue)
          let isDisabled = false;

          if (claimStatus === "rejected") {
            buttonClass = "bg-gray-500 text-white cursor-not-allowed";
            isDisabled = true;
          } else if (claimStatus === "approved") {
            buttonClass = "bg-green-300 text-black cursor-not-allowed";
            isDisabled = true;
          } else if (claimStatus === "pending") {
            buttonClass = "bg-blue-400 text-white cursor-not-allowed";
            isDisabled = true;
          }

          return (
            <div key={insurance._id} className="border p-6 rounded-lg shadow-md w-full max-w-2xl">
              <h3 className="text-xl font-semibold">{insurance.plan}</h3>
              <p className="text-gray-700">Provider: {insurance.provider}</p>
              <p className="text-gray-700">Purchased on: {new Date(insurance.purchaseDate).toLocaleDateString()}</p>

              {/* Claim Status Button (Always Visible) */}
              <button
                className={`mt-4 p-3 text-center font-semibold rounded-lg w-40 ${buttonClass}`}
                onClick={() => {
                  if (!matchingClaim) {
                    handleClaimClick(insurance._id);
                  }
                }}
                disabled={isDisabled}
              >
                {claimStatus}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
