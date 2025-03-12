"use client";

import { useForm } from "react-hook-form";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

type InsuranceFormData = {
  companyName: string;
  registrationNumber: string;
  representativeName: string;
  designation: string;
  email: string;
  phone: string;
  businessLicense: FileList;
  password: string;
  confirmPassword: string;
};

export default function InsuranceSignup() {
  const { register, handleSubmit, watch, formState: { errors } } = useForm<InsuranceFormData>();
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data: InsuranceFormData) => {
    setLoading(true);
    console.log("Submitting:", data);
    // TODO: Send data to backend API
    setLoading(false);
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold mb-6">Insurance Company Signup</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block font-medium">Company Name</label>
          <input {...register("companyName", { required: true })} type="text" className="w-full p-2 border rounded" />
        </div>

        <div>
          <label className="block font-medium">Registration Number</label>
          <input {...register("registrationNumber", { required: true })} type="text" className="w-full p-2 border rounded" />
        </div>

        <div>
          <label className="block font-medium">Business License</label>
          <input {...register("businessLicense", { required: true })} type="file" className="w-full p-2 border rounded" />
        </div>

        <div>
          <label className="block font-medium">Representative Name</label>
          <input {...register("representativeName", { required: true })} type="text" className="w-full p-2 border rounded" />
        </div>

        <div>
          <label className="block font-medium">Designation</label>
          <input {...register("designation", { required: true })} type="text" className="w-full p-2 border rounded" />
        </div>

        <div>
          <label className="block font-medium">Official Email</label>
          <input {...register("email", { required: true })} type="email" className="w-full p-2 border rounded" />
        </div>

        <div>
          <label className="block font-medium">Phone Number</label>
          <input {...register("phone", { required: true })} type="tel" className="w-full p-2 border rounded" />
        </div>

        <div>
          <label className="block font-medium">Password</label>
          <input {...register("password", { required: true, minLength: 6 })} type="password" className="w-full p-2 border rounded" />
          {errors.password && <p className="text-red-500 text-sm">Password must be at least 6 characters.</p>}
        </div>

        <div>
          <label className="block font-medium">Confirm Password</label>
          <input 
            {...register("confirmPassword", { 
              required: true,
              validate: (value) => value === watch("password") || "Passwords do not match",
            })} 
            type="password" className="w-full p-2 border rounded" 
          />
          {errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword.message}</p>}
        </div>

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
