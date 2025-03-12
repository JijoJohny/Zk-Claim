"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { User, Loader2 } from "lucide-react"; // Loader2 icon for spinner

export default function UserProfile() {
  const { did } = useParams();
  const [user, setUser] = useState(null);
  const [claims, setClaims] = useState([]);
  const [proofRequests, setProofRequests] = useState([]);
  const [loadingVerify, setLoadingVerify] = useState(null);
  const [loadingResponse, setLoadingResponse] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:5001/api/insurance/${did}`)
      .then((res) => res.json())
      .then((data) => setUser(data))
      .catch(console.error);
  }, [did]);

  useEffect(() => {
    fetch(`http://localhost:5001/api/claims/${did}`)
      .then((res) => res.json())
      .then((data) => setClaims(data))
      .catch(console.error);
  }, [did]);

  useEffect(() => {
    if (did) {
      fetch(`http://localhost:5001/api/proof-req/${did}`)
        .then((res) => res.json())
        .then((response) => {
          if (response?.data && typeof response.data === "object") {
            setProofRequests([response.data]);
          } else {
            setProofRequests([]);
          }
        })
        .catch(() => setProofRequests([]));
    }
  }, [did]);

const handleSendResponse = async (claimId, verificationMsg) => {
  setLoadingResponse(claimId);

  let status = verificationMsg === "Eligible for insurance claim" ? "Approved" : "Rejected";

  try {
    const response = await fetch(`http://localhost:5001/api/proof-req/update-claim/${claimId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ claimStatus: status, response: verificationMsg })
    });

    const result = await response.json();
    if (response.ok) {
      alert("Response sent successfully!");

      // ✅ Update the claims state to reflect the response immediately
      setClaims(prevClaims => 
        prevClaims.map(claim =>
          claim._id === claimId ? { ...claim, claimStatus: status, response: verificationMsg } : claim
        )
      );

      // ✅ Update proofRequests as well if necessary
      setProofRequests(prevRequests =>
        prevRequests.map(req =>
          req.claimId === claimId ? { ...req, response: verificationMsg } : req
        )
      );
    } else {
      alert("Failed to send response.");
    }
  } catch (error) {
    console.error("Error sending response:", error);
    alert("Error sending response. Please try again.");
  } finally {
    setLoadingResponse(null);
  }
};

  
  const handleRequestProof = async (did, provider, claimId,plan) => {
    try {
      const response = await fetch("http://localhost:5001/api/proof-req", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ did, provider, claimId, plan }),
      });

      const result = await response.json();
      if (response.ok) {
        alert("Proof requested successfully!");
        setProofRequests([...proofRequests, { did, companyName: provider, claimId }]);
      } else {
        alert("Failed to request proof.");
      }
    } catch (error) {
      console.error("Error requesting proof:", error);
      alert("Error requesting proof. Please try again.");
    }
  };

  const handleVerifyProof = async (claimId) => {
    const proofRequest = proofRequests.find(req => req.claimId === claimId);
    
    if (!proofRequest) {
      alert("No proof request found for this claim.");
      return;
    }

    setLoadingVerify(claimId); // Show loading spinner

    try {
      const response = await fetch("http://localhost:5001/api/verify/retrieve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ requestId: proofRequest._id }),
      });

      const result = await response.json();
      if (response.ok) {
        alert("Proof verified successfully!");

        await fetch(`http://localhost:5001/api/proof-req/verified/${proofRequest._id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ verified: "verified", verificationMsg: result.message }),
        });

        setProofRequests(prevRequests =>
          prevRequests.map(req =>
            req.claimId === claimId ? { ...req, verified: "verified", verificationMsg: result.message } : req
          )
        );
      } else {
        alert(result.message || "Failed to verify proof.");
      }
    } catch (error) {
      console.error("Error verifying proof:", error);
      alert("Error verifying proof. Please try again.");
    } finally {
      setLoadingVerify(null); // Hide loading spinner
    }
  };


  if (!user) return <p className="text-center mt-6">Loading user data...</p>;

  return (
    <div className="p-6 flex flex-col items-start space-y-6">
      <div className="flex items-center space-x-4">
        <div className="w-16 h-16 flex items-center justify-center bg-gray-200 text-gray-600 rounded-full">
          <User size={32} />
        </div>
        <h3 className="text-2xl font-semibold text-gray-800">User {did}</h3>
      </div>

      {user.length > 0 ? (
        user.map((insurance) => (
          <Card key={insurance._id} className="p-6 shadow-lg rounded-2xl w-full max-w-lg">
            <CardContent className="space-y-3">
              <p className="text-gray-700">Plan: {insurance.plan}</p>
              <p className="text-gray-700">Provider: {insurance.provider}</p>
              <p className="text-gray-700">Claim Status: {insurance.claim === "no" ? "Not Claimed" : insurance.claim}</p>
            </CardContent>
          </Card>
        ))
      ) : (
        <p className="text-center mt-4 text-gray-600">No insurances found for this user.</p>
      )}

      <h3 className="text-2xl font-semibold text-gray-800 mt-8">Notifications</h3>

      <div className="space-y-4 mt-4 w-full">
        {claims.length > 0 ? (
          claims.map((claim) => {
            const matchedInsurance = user.find((insurance) => insurance._id === claim.insuranceId);
            const provider = matchedInsurance?.provider || "Unknown";
            const proofRequested = proofRequests.some(req => req.did === did && req.claimId === claim._id);
            const proofGenerated = proofRequests.some(req => req.claimId === claim._id && req.proof === "generated");
            const proofVerifiedObj = proofRequests.find(req => req.claimId === claim._id && req.verified === "verified");
            const proofVerified = Boolean(proofVerifiedObj);
            const verificationMsg = proofVerifiedObj?.verificationMsg;
            const responseSent = proofRequests.some(req =>  req.claimId === claim._id && claim.response !== "");

            return (
              <Card key={claim._id} className="p-4 border border-blue-300 bg-blue-50 rounded-lg shadow flex flex-col space-y-2">
                <CardContent className="space-y-2">
                  <p className="text-lg font-semibold text-blue-800">
                    Claim for {matchedInsurance ? matchedInsurance.plan : "Unknown Plan"}
                  </p>
                  <p className="text-gray-700">Provider: {provider}</p>
                  <p className="text-gray-700">Hospital: {claim.hospitalName}</p>
                  <p className="text-gray-700">Disease: {claim.claimDisease}</p>
                  <p className="text-gray-700">Claim Amount: ₹{claim.claimAmount}</p>
                  <p className="text-gray-700">Status: {claim.claimStatus}</p>
                  <p className="text-gray-700">Submitted On: {new Date(claim.claimDate).toLocaleDateString()}</p>
                </CardContent>

                <button
                  className={`px-4 py-2 text-white font-semibold rounded-lg transition ${proofRequested ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"}`}
                  onClick={() => !proofRequested && handleRequestProof(did, provider, claim._id, matchedInsurance.plan)}
                  disabled={proofRequested}
                >
                  {proofRequested ? "Proof Requested" : "Request for Proof"}
                </button>
                {proofGenerated && <p className="text-green-700 font-semibold">Proof has been generated by {claim.hospitalName}</p>}
                {proofGenerated && (
                  <button
                    className="px-4 py-2 text-white font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 transition"
                    onClick={() => handleVerifyProof(claim._id)}
                    disabled={loadingVerify === claim._id || proofVerified}
                  >
                    {loadingVerify === claim._id ? (
                      <span className="flex items-center">
                        <Loader2 className="animate-spin mr-2" size={16} /> Verifying...
                      </span>
                    ) : proofVerified ? "Proof Verified" : "Verify Proof"}
                  </button>
                )}
                {verificationMsg && (
                  <div className="flex items-center space-x-2">
                    <p className="text-green-700 font-semibold">{verificationMsg}</p>
                   
                 
                  <button
                    className={`px-4 py-2 text-white font-semibold rounded-lg transition ${responseSent ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"}`}
                    onClick={() =>  handleSendResponse(claim._id, verificationMsg)}
                    disabled={responseSent}
                >
                    {responseSent ? "Response Sent" : "Send Response"}
                </button>
                  </div>
                )}
              </Card>
            );
          })
        ) : (
          <p className="text-center text-gray-600">No claim requests found.</p>
        )}
      </div>
    </div>
  );
}
