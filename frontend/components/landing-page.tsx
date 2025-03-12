'use client'

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import Link from 'next/link';

export default function LandingPage() {
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-100 to-white flex flex-col items-center justify-center p-4 text-center">
   <motion.h1 
  className="text-5xl md:text-6xl font-bold text-sky-700 mb-6"
>
  Secure Health Data & Seamless Insurance Claims
</motion.h1>

<motion.p 
  className="text-xl md:text-2xl text-gray-700 mb-8 max-w-2xl"
>
  Protect your health data and claim insurance seamlessly with privacy-preserving technology.
</motion.p>

<Link href="/explore">
  <Button size="lg" className="bg-sky-600 hover:bg-sky-700 text-white px-8 py-3 rounded-full text-lg">
    Explore Secure Claims
  </Button>
</Link>

<motion.div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
  {[
    { title: "Privacy-Preserving Authentication", description: "Prove identity without revealing personal details." },
    { title: "Seamless & Trustless Insurance Claims", description: "File and verify claims without exposing sensitive medical records." },
    { title: "Zero-Knowledge Security for Data Sharing", description: "Ensure data integrity while maintaining full privacy." }
  ].map((feature, index) => (
    <motion.div 
      key={index}
      className="bg-white p-6 rounded-lg shadow-md"
    >
      <h2 className="text-xl font-semibold text-sky-600 mb-2">{feature.title}</h2>
      <p className="text-gray-600">{feature.description}</p>
    </motion.div>
  ))}
</motion.div>



      {/* Signup & Login Buttons in Top Right */}
      <div className="absolute top-4 right-4 flex space-x-4">
        <Link href="/login">
          <Button className="bg-gray-200 hover:bg-gray-300 text-gray-800">Login</Button>
        </Link>
        <div className="relative">
          <Button 
            className="bg-sky-600 hover:bg-sky-700 text-white"
            onClick={() => setShowDropdown(!showDropdown)}
          >
            Signup
          </Button>
          {showDropdown && (
            <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg py-2">
              <Link href="/signup/patient">
                <p className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Patient</p>
              </Link>
              <Link href="/signup/hospital">
                <p className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Hospital</p>
              </Link>
              <Link href="/signup/insurance">
                <p className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Insurance Company</p>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
