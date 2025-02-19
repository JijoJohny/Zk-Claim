"use client";

import { useForm } from "react-hook-form";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

type HospitalFormData = {
  hospitalName: string;
  registrationNumber: string;
  accreditation: FileList;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  adminName: string;
  designation: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
};

export default function HospitalSignup() {
  const { register, handleSubmit, watch, formState: { errors } } = useForm<HospitalFormData>();
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data: HospitalFormData) => {
    setLoading(true);
    console.log("Submitting:", data);
    // TODO: Send data to backend API
    setLoading(false);
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold mb-6">Hospital Signup</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block font-medium">Hospital Name</label>
          <input {...register("hospitalName", { required: true })} type="text" className="w-full p-2 border rounded" />
          {errors.hospitalName && <p className="text-red-500 text-sm">Hospital Name is required.</p>}
        </div>

        <div>
          <label className="block font-medium">Registration Number</label>
          <input {...register("registrationNumber", { required: true })} type="text" className="w-full p-2 border rounded" />
        </div>

        <div>
          <label className="block font-medium">Accreditation Certificate</label>
          <input {...register("accreditation", { required: true })} type="file" className="w-full p-2 border rounded" />
        </div>

        <div>
          <label className="block font-medium">Address</label>
          <input {...register("address", { required: true })} type="text" className="w-full p-2 border rounded" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block font-medium">City</label>
            <input {...register("city", { required: true })} type="text" className="w-full p-2 border rounded" />
          </div>
          <div>
            <label className="block font-medium">State</label>
            <input {...register("state", { required: true })} type="text" className="w-full p-2 border rounded" />
          </div>
        </div>

        <div>
          <label className="block font-medium">ZIP Code</label>
          <input {...register("zipCode", { required: true })} type="text" className="w-full p-2 border rounded" />
        </div>

        <div>
          <label className="block font-medium">Admin Name</label>
          <input {...register("adminName", { required: true })} type="text" className="w-full p-2 border rounded" />
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
          <input {...register("password", { required: true })} type="password" className="w-full p-2 border rounded" />
        </div>

        <div>
          <label className="block font-medium">Confirm Password</label>
          <input {...register("confirmPassword", { 
            required: true,
            validate: (value) => value === watch("password") || "Passwords do not match",
          })} type="password" className="w-full p-2 border rounded" />
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
