"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function InsuranceDashboard() {
  const [requests, setRequests] = useState([
    { id: 123, patient: "Patient #123", did: "did:example:123", status: "Pending" },
  ]);
  const [proofs, setProofs] = useState([]);

  const verifyDID = (id) => {
    const updatedRequests = requests.map((req) =>
      req.id === id ? { ...req, status: "DID Verified" } : req
    );
    setRequests(updatedRequests);
  };

  const requestProof = (id) => {
    const updatedRequests = requests.map((req) =>
      req.id === id ? { ...req, status: "Proof Requested" } : req
    );
    setRequests(updatedRequests);
  };

  const verifyProof = (id) => {
    setProofs((prev) => prev.map((p) => (p.id === id ? { ...p, status: "Verified" } : p)));
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-blue-800 text-white p-5">
        <h2 className="text-2xl font-bold mb-6">Insurance Dashboard</h2>
        <ul>
          <li className="mb-4"><a href="#" className="hover:text-gray-300">Home</a></li>
          <li className="mb-4"><a href="#" className="hover:text-gray-300">Pending Requests</a></li>
          <li className="mb-4"><a href="#" className="hover:text-gray-300">Verify Proof</a></li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-10">
        <h1 className="text-3xl font-semibold mb-6">Welcome, Insurance Officer</h1>

        <Card className="mb-6">
          <CardContent className="p-6">
            <h2 className="text-xl font-bold">Insurance Applications</h2>
            <ul className="mt-4">
              {requests.map((request) => (
                <li key={request.id} className="mb-2 p-2 bg-gray-200 rounded">
                  {request.patient} - {request.status}
                  {request.status === "Pending" && (
                    <Button className="ml-2 bg-blue-500" onClick={() => verifyDID(request.id)}>
                      Verify DID
                    </Button>
                  )}
                  {request.status === "DID Verified" && (
                    <Button className="ml-2 bg-green-500" onClick={() => requestProof(request.id)}>
                      Request Proof
                    </Button>
                  )}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <h2 className="text-xl font-bold">Received Proofs</h2>
            <ul className="mt-4">
              {proofs.map((proof) => (
                <li key={proof.id} className="mb-2 p-2 bg-gray-200 rounded">
                  {proof.patient} - {proof.status}
                  {proof.status === "Received" && (
                    <Button className="ml-2 bg-purple-500" onClick={() => verifyProof(proof.id)}>
                      Verify Proof
                    </Button>
                  )}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
