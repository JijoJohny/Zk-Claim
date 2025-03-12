"use client";

import { useForm } from "react-hook-form";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

type HospitalFormData = {
  name: string;
  contactEmail: string;
  phoneNumber: string;
  password: string;
  address: string;
};

export default function HospitalSignup() {
  const { register, handleSubmit, formState: { errors } } = useForm<HospitalFormData>();
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data: HospitalFormData) => {
    setLoading(true);

    try {
      const response = await fetch("http://localhost:5001/api/hospital/signup", { 
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Signup failed");
      }

      alert("Signup successful!");
    } catch (error: any) {
      console.error("Signup Error:", error);
      alert(error.message || "An unexpected error occurred.");
    }

    setLoading(false);
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold mb-6">Hospital Signup</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        
        {/* Company Name */}
        <div>
          <label className="block font-medium">Hospital Name</label>
          <input 
            {...register("name", { required: "Company Name is required" })} 
            type="text" 
            className="w-full p-2 border rounded" 
          />
          {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
        </div>

        {/* Email */}
        <div>
          <label className="block font-medium">Contact Email</label>
          <input 
            {...register("contactEmail", { required: "Email is required", pattern: { value: /^[^@ ]+@[^@ ]+\.[^@ .]{2,}$/, message: "Invalid email format" } })} 
            type="email" 
            className="w-full p-2 border rounded" 
          />
          {errors.contactEmail && <p className="text-red-500 text-sm">{errors.contactEmail.message}</p>}
        </div>

        {/* Phone Number */}
        <div>
          <label className="block font-medium">Phone Number</label>
          <input 
            {...register("phoneNumber", { required: "Phone number is required", pattern: { value: /^[0-9]{10}$/, message: "Invalid phone number" } })} 
            type="tel" 
            className="w-full p-2 border rounded" 
          />
          {errors.phoneNumber && <p className="text-red-500 text-sm">{errors.phoneNumber.message}</p>}
        </div>

        {/* Address */}
        <div>
          <label className="block font-medium">Address</label>
          <input 
            {...register("address", { required: "Address is required" })} 
            type="text" 
            className="w-full p-2 border rounded" 
          />
          {errors.address && <p className="text-red-500 text-sm">{errors.address.message}</p>}
        </div>

        {/* Password */}
        <div>
          <label className="block font-medium">Password</label>
          <input 
            {...register("password", { required: "Password must be at least 6 characters", minLength: { value: 6, message: "Must be at least 6 characters" } })} 
            type="password" 
            className="w-full p-2 border rounded" 
          />
          {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
        </div>

        {/* Submit Button */}
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Signing up..." : "Sign Up"}
        </Button>
      </form>

      <p className="mt-4 text-center">
        Already have an account? <Link href="/login" className="text-blue-500">Login</Link>
      </p>
    </div>
  );
}
