"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function Navbar() {
  const [signupVisible, setSignupVisible] = useState(false); // State to toggle signup options
  const [signupType, setSignupType] = useState<string | null>(null);

  const toggleSignupOptions = () => {
    setSignupVisible(!signupVisible); // Toggle visibility of the signup options
  };

  const handleSignupClick = (type: string) => {
    setSignupType(type); // Set the selected signup type
    setSignupVisible(false); // Close the signup options
  };

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="text-xl font-semibold text-sky-600">
                IdenZK
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link
                href="/landing"
                className="inline-flex items-center px-1 pt-1 border-b-2 border-sky-500 text-sm font-medium text-gray-900"
              >
                Home
              </Link>
              <Link
                href="/"
                className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700"
              >
                User
              </Link>
              <Link
                href="/health"
                className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700"
              >
                Hospital
              </Link>
              <Link
                href="/verify"
                className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700"
              >
                Insurance
              </Link>
            </div>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            <Button variant="outline" className="mr-2">
              Log in
            </Button>
            <Button onClick={toggleSignupOptions}>Sign up</Button>
          </div>
        </div>
      </div>

      {/* Side Panel for Signup Options */}
      {signupVisible && (
        <div className="fixed inset-0 flex justify-end bg-black bg-opacity-50">
          <div className="bg-white p-6 w-80 shadow-lg h-full">
            <h2 className="text-lg font-bold mb-4">Choose Signup Type</h2>
            <div className="space-y-4">
              <Button
                onClick={() => handleSignupClick("patient")}
                className="w-full"
              >
                Patient
              </Button>
              <Button
                onClick={() => handleSignupClick("hospital")}
                className="w-full"
              >
                Hospital
              </Button>
              <Button
                onClick={() => handleSignupClick("insurance")}
                className="w-full"
              >
                Insurance Company
              </Button>
            </div>
            <Button
              variant="outline"
              className="mt-4 w-full"
              onClick={toggleSignupOptions}
            >
              Close
            </Button>
          </div>
        </div>
      )}

      {/* Redirect to Signup Pages */}
      {signupType === "patient" && <SignupPatient />}
      {signupType === "hospital" && <SignupHospital />}
      {signupType === "insurance" && <SignupInsurance />}
    </nav>
  );
}

// Placeholder components for Signup Pages
function SignupPatient() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Patient Signup</h1>
      <form className="space-y-4">
        <input placeholder="Name" className="w-full p-2 border rounded" />
        <input placeholder="Date of Birth" className="w-full p-2 border rounded" />
        <input placeholder="Gender" className="w-full p-2 border rounded" />
        <input placeholder="Contact Number" className="w-full p-2 border rounded" />
        <input placeholder="Address" className="w-full p-2 border rounded" />
        <input placeholder="Email" className="w-full p-2 border rounded" />
        <input type="password" placeholder="Password" className="w-full p-2 border rounded" />
        <Button className="w-full">Submit</Button>
      </form>
    </div>
  );
}

function SignupHospital() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Hospital Signup</h1>
      <form className="space-y-4">
        <input placeholder="Hospital Name" className="w-full p-2 border rounded" />
        <input placeholder="Registration Number" className="w-full p-2 border rounded" />
        <input placeholder="Contact Email" className="w-full p-2 border rounded" />
        <input placeholder="Phone Number" className="w-full p-2 border rounded" />
        <input placeholder="Address" className="w-full p-2 border rounded" />
        <input placeholder="Departments Offered" className="w-full p-2 border rounded" />
        <input type="password" placeholder="Password" className="w-full p-2 border rounded" />
        <Button className="w-full">Submit</Button>
      </form>
    </div>
  );
}

function SignupInsurance() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Insurance Company Signup</h1>
      <form className="space-y-4">
        <input placeholder="Company Name" className="w-full p-2 border rounded" />
        <input placeholder="Registration Number" className="w-full p-2 border rounded" />
        <input placeholder="Contact Email" className="w-full p-2 border rounded" />
        <input placeholder="Phone Number" className="w-full p-2 border rounded" />
        <input placeholder="Address" className="w-full p-2 border rounded" />
        <input placeholder="Offered Plans" className="w-full p-2 border rounded" />
        <input type="password" placeholder="Password" className="w-full p-2 border rounded" />
        <Button className="w-full">Submit</Button>
      </form>
    </div>
  );
}
