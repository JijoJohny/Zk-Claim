"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function LoginPage() {
  const [useOTP, setUseOTP] = useState(false);
  const { register, handleSubmit } = useForm();
  const router = useRouter();

  const onSubmit = (data: any) => {
    console.log("Login Data:", data);

    // Redirect user to respective dashboard based on role
    if (data.role === "patient") router.push("/dashboard/patient");
    else if (data.role === "hospital") router.push("/dashboard/hospital");
    else if (data.role === "insurance") router.push("/dashboard/insurance");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-center mb-4">Login</h2>

        {/* Toggle between Email/Password and OTP login */}
        <div className="flex justify-center mb-4">
          <button
            onClick={() => setUseOTP(false)}
            className={`px-4 py-2 ${!useOTP ? "bg-blue-500 text-white" : "bg-gray-300"} rounded-l-md`}
          >
            Email & Password
          </button>
          <button
            onClick={() => setUseOTP(true)}
            className={`px-4 py-2 ${useOTP ? "bg-blue-500 text-white" : "bg-gray-300"} rounded-r-md`}
          >
            OTP Login
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Role Selection */}
          <div>
            <label className="block text-sm font-medium">Role</label>
            <select {...register("role")} className="w-full p-2 border rounded-md">
              <option value="patient">Patient</option>
              <option value="hospital">Hospital</option>
              <option value="insurance">Insurance</option>
            </select>
          </div>

          {/* Login Type Selection */}
          <div>
            <label className="block text-sm font-medium">Login Type</label>
            <select {...register("loginType")} className="w-full p-2 border rounded-md">
              <option value="standard">Standard Login</option>
              <option value="secure">Secure Login</option>
            </select>
          </div>

          {/* Email & Password Login */}
          {!useOTP ? (
            <>
              <div>
                <label className="block text-sm font-medium">Email</label>
                <input
                  type="email"
                  {...register("email", { required: true })}
                  className="w-full p-2 border rounded-md"
                  placeholder="Enter your email"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Password</label>
                <input
                  type="password"
                  {...register("password", { required: true })}
                  className="w-full p-2 border rounded-md"
                  placeholder="Enter your password"
                />
              </div>
            </>
          ) : (
            // OTP-based login
            <>
              <div>
                <label className="block text-sm font-medium">Phone Number</label>
                <input
                  type="tel"
                  {...register("phone", { required: true })}
                  className="w-full p-2 border rounded-md"
                  placeholder="Enter your phone number"
                />
              </div>
              <Button className="w-full bg-blue-500 text-white py-2 rounded-md">Send OTP</Button>
              <div>
                <label className="block text-sm font-medium">Enter OTP</label>
                <input
                  type="text"
                  {...register("otp", { required: true })}
                  className="w-full p-2 border rounded-md"
                  placeholder="Enter OTP"
                />
              </div>
            </>
          )}

          <Button type="submit" className="w-full bg-green-500 text-white py-2 rounded-md">
            Login
          </Button>
        </form>

        <p className="text-center mt-4 text-sm">
          Don't have an account?{" "}
          <Link href="/signup" className="text-blue-500">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
