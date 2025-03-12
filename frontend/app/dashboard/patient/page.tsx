"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button"; // Adjust import based on your button component

export default function HomePage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [did, setDid] = useState("");

  useEffect(() => {
    const didFromUrl = searchParams.get("did");

    if (typeof window !== "undefined") {
      const storedDid = localStorage.getItem("did");

      if (didFromUrl) {
        setDid(didFromUrl);
        localStorage.setItem("did", didFromUrl);
      } else if (storedDid) {
        setDid(storedDid);
      }
    }
  }, [searchParams]);

  return (
    <div className="bg-gray-100 min-h-screen p-6 flex flex-col">
      <h1 className="text-xl font-semibold">Patient Dashboard</h1>
      <p className="mt-4">Your DID: {did || "Not available"}</p>

      {/* Show "Generate DID" button if DID is not available */}
      {!did && (
        <Button
          className="mt-4 bg-blue-500 text-white py-2 px-4 rounded-md"
          onClick={() => router.push("/dashboard/patient/generateDid/")}
        >
          Generate DID
        </Button>
      )}
    </div>
  );
}
