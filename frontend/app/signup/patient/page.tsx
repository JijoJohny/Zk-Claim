"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function PatientSignup() {
  const router = useRouter();
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Handle Signup
  const onSubmit = async (data: any) => {
    setLoading(true);
    setErrorMessage("");

    try {
      const response = await axios.post("http://localhost:5001/api/patient/signup", {
        email: data.email,
        password: data.password,
        cpassword: data.cpassword, // Changed to match backend
        did: data.did || null, // Include `did` only if provided
      });

      if (response.status === 201) {
        router.push("/login"); // Redirect after signup
      }
    } catch (error: any) {
      console.error("Signup Error:", error);
      setErrorMessage(error.response?.data?.message || "Signup failed!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Patient Signup</h2>

      {errorMessage && <p className="text-red-500">{errorMessage}</p>}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Email Field */}
        <div>
          <label className="block font-medium">Email</label>
          <input
            type="email"
            {...register("email", { required: "Email is required" })}
            className="w-full p-2 border rounded"
          />
          {errors.email && <p className="text-red-500">{errors.email.message}</p>}
        </div>

        {/* Password Field */}
        <div>
          <label className="block font-medium">Password</label>
          <input
            type="password"
            {...register("password", {
              required: "Password is required",
              minLength: { value: 8, message: "Password must be at least 8 characters" },
            })}
            className="w-full p-2 border rounded"
          />
          {errors.password && <p className="text-red-500">{errors.password.message}</p>}
        </div>

        {/* Confirm Password Field */}
        <div>
          <label className="block font-medium">Confirm Password</label>
          <input
            type="password"
            {...register("cpassword", { // Changed to match backend
              required: "Please confirm your password",
              validate: (value) => value === watch("password") || "Passwords do not match",
            })}
            className="w-full p-2 border rounded"
          />
          {errors.cpassword && <p className="text-red-500">{errors.cpassword.message}</p>}
        </div>

        <Button type="submit" disabled={loading} className="w-full bg-blue-600 text-white">
          {loading ? "Signing Up..." : "Sign Up"}
        </Button>
      </form>
    </div>
  );
}
