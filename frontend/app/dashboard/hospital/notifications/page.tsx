'use client';

import { useEffect, useState } from "react";

interface ProofRequest {
  _id: string;
  did: string;
  claimDisease: string;
  claimAmount: number;
  hospitalName: string;
  companyName: string;
  proof?: string; 
  plan :string;
}

export default function Notifications() {
  const [proofRequests, setProofRequests] = useState<ProofRequest[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<ProofRequest | null>(null);
  const [isGenerating, setIsGenerating] = useState(false); // Added state for buffering UI

  useEffect(() => {
    fetch("http://localhost:5001/api/proof-req")
      .then((res) => res.json())
      .then((data) => {
        setProofRequests(Array.isArray(data.data) ? data.data : []);
      })
      .catch((error) => {
        console.error("Error fetching proof requests:", error);
        setProofRequests([]);
      });
  }, []);

  const handleDetailsClick = (request: ProofRequest) => {
    setSelectedRequest(request);
  };

  const generateProof = async () => {
    if (!selectedRequest) return;

    setIsGenerating(true); // Start buffering

    try {
      const response = await fetch("http://localhost:5001/api/generate-proof", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          did: selectedRequest.did,
          claimDisease: selectedRequest.claimDisease,
          requestId: selectedRequest._id,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        alert(result.message || "Proof generated successfully!");

        // **Send update request to backend**
        await fetch(`http://localhost:5001/api/proof-req/${selectedRequest._id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ proof: "generated" }),
        });

        // **Update state after backend update**
        setProofRequests((prevRequests) =>
          prevRequests.map((req) =>
            req._id === selectedRequest._id ? { ...req, proof: "generated" } : req
          )
        );

        setSelectedRequest((prevRequest) =>
          prevRequest ? { ...prevRequest, proof: "generated" } : null
        );
      } else {
        throw new Error(result.message || "Failed to generate proof.");
      }
    } catch (error) {
      console.error("Error generating proof:", error);
      alert("Error generating proof. Please try again.");
    } finally {
      setIsGenerating(false); // Stop buffering
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Notifications</h2>

      {proofRequests.length === 0 ? (
        <p className="text-gray-500">No new proof requests.</p>
      ) : (
        <div className="space-y-4">
          {proofRequests.map((request, index) => (
            <div key={index} className="p-4 bg-white shadow-lg rounded-2xl flex justify-between items-center">
              <p className="text-gray-700">
                <span className="font-bold">{request.companyName}</span> has requested proof for patient with DID: {" "}
                <span className="font-semibold">{request.did}</span>.
              </p>
              
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                onClick={() => handleDetailsClick(request)}
              >
                Details
              </button>
            </div>
          ))}
        </div>
      )}

      {selectedRequest && (
        <div className="mt-6 p-4 bg-gray-100 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-2">Proof Request Details</h3>
          
          <p><strong>Plan:</strong> {selectedRequest.plan}</p>
          <p><strong>DID:</strong> {selectedRequest.did}</p>
          <p><strong>Disease:</strong> {selectedRequest.claimDisease}</p>
          <p><strong>Claim Amount:</strong> ${selectedRequest.claimAmount}</p>
          <p><strong>Hospital:</strong> {selectedRequest.hospitalName}</p>
          <p><strong>Requested by:</strong> {selectedRequest.companyName}</p>
          <p><strong>Proof:</strong> {selectedRequest.proof}</p>

          {selectedRequest.proof ? (
            <p className="mt-4 text-green-600 font-semibold">Proof Generated</p>
          ) : (
            <button
              className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              onClick={generateProof}
              disabled={isGenerating} // Disable button while proof is being generated
            >
              {isGenerating ? (
                <span className="flex items-center">
                  <svg className="animate-spin h-5 w-5 mr-2 text-white" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                  </svg>
                  Generating...
                </span>
              ) : (
                "Generate Proof"
              )}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
