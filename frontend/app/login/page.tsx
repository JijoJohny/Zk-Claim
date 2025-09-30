"use client";

import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function LoginPage() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const onSubmit = async (data) => {
    setLoading(true);
    setErrorMessage("");

    try {
      const response = await fetch("http://localhost:5001/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        // Save token and role
        localStorage.setItem("token", result.token);
        localStorage.setItem("role", data.role);

        localStorage.setItem("did", result.did ?? ""); 
        console.log("Received DID from API:", result);


        // Small delay to ensure localStorage updates before navigation
        setTimeout(() => {
          if (data.role === "patient") {
            router.push("/dashboard/patient");
          } else if (data.role === "hospital") {
            router.push("/dashboard/hospital");
          } else if (data.role === "insurance") {
            router.push("/dashboard/insurance");
          }
        }, 100);
      } else {
        setErrorMessage(result.message || "Invalid email or password.");
      }
    } catch (error) {
      setErrorMessage("An error occurred. Please try again.");
    }

    setLoading(false);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-center mb-4">Login</h2>

        {errorMessage && <p className="text-red-500 text-sm text-center">{errorMessage}</p>}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Role Selection */}
          <div>
            <label className="block text-sm font-medium">Role</label>
            <select {...register("role", { required: "Role is required" })} className="w-full p-2 border rounded-md">
              <option value="patient">Patient</option>
              <option value="hospital">Hospital</option>
              <option value="insurance">Insurance</option>
            </select>
            {errors.role && <p className="text-red-500 text-sm">{errors.role.message}</p>}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium">Email</label>
            <input
              type="email"
              {...register("email", { required: "Email is required" })}
              className="w-full p-2 border rounded-md"
              placeholder="Enter your email"
            />
            {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium">Password</label>
            <input
              type="password"
              {...register("password", { required: "Password is required" })}
              className="w-full p-2 border rounded-md"
              placeholder="Enter your password"
            />
            {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
          </div>

          <Button type="submit" className="w-full bg-green-500 text-white py-2 rounded-md" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
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
