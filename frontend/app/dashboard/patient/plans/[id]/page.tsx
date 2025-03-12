"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation"; // Added useRouter
import { useDID } from "@/context/DIDContext";
import { ShieldCheck, CheckCircle } from "lucide-react";

interface InsurancePlan {
  _id: string;
  provider: string;
  plan: string;
  amount: number;
  coverage: number;
  benefits: string[];
}

export default function PlanDetailsPage() {
  const { id } = useParams(); // Get plan ID from URL
  const { did } = useDID(); // Get DID from context
  const [insurance, setInsurance] = useState<InsurancePlan | null>(null);
  const [loading, setLoading] = useState(true);
  const [isPurchased, setIsPurchased] = useState(false);
  const router = useRouter(); // Initialize Next.js router

  useEffect(() => {
    if (!id) return;

    fetch("http://localhost:5001/api/plans")
      .then((res) => res.json())
      .then((data: InsurancePlan[]) => {
        const selectedPlan = data.find((plan) => plan._id === id);
        setInsurance(selectedPlan || null);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching insurance details:", error);
        setLoading(false);
      });
  }, [id]);

  useEffect(() => {
    if (!did || !id) return;

    // Fetch purchased plans for the logged-in user
    fetch(`http://localhost:5001/api/insurance/${did}`)
      .then((res) => res.json())
      .then((purchasedPlans) => {
        const alreadyPurchased = purchasedPlans.some((p) => p.planId === id);
        setIsPurchased(alreadyPurchased);
      })
      .catch((error) => console.error("Error checking purchased plans:", error));
  }, [did, id]);

  // Handle "Get Covered Now" button click
  const handleApply = () => {
    if (!isPurchased) {
      router.push(`/dashboard/patient/plans/[id]/applyInsurance?planId=${id}`);
    }
  };

  if (loading) {
    return <p className="text-center text-gray-600 text-xl mt-10">Loading plan details...</p>;
  }

  if (!insurance) {
    return <p className="text-center text-red-500 text-xl mt-10">Error: Insurance plan not found.</p>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-10 relative">
      <div className="max-w-5xl mx-auto bg-white shadow-lg rounded-lg p-10 relative">
        {/* Purchase Button */}
        <button
          className={`absolute top-6 right-6 px-6 py-3 font-semibold rounded-lg transition-all shadow-md ${
            isPurchased ? "bg-gray-500 text-white cursor-not-allowed" : "bg-blue-600 text-white hover:bg-blue-700"
          }`}
          onClick={handleApply} // Navigate on click
          disabled={isPurchased}
        >
          {isPurchased ? "Already Purchased" : "Get Covered Now"}
        </button>

        {/* Header Section */}
        <div className="flex items-center space-x-4 mb-8">
          <div className="w-16 h-16 flex items-center justify-center bg-blue-500 text-white rounded-full">
            <ShieldCheck size={32} />
          </div>
          <h1 className="text-4xl font-bold text-gray-900">{insurance.plan}</h1>
        </div>

        {/* Introduction */}
        <p className="text-lg text-gray-700 leading-relaxed">
          This <strong>{insurance.plan}</strong> plan is designed to provide you with **comprehensive** financial 
          protection against medical expenses. With our trusted provider <strong>{insurance.provider}</strong>, 
          you gain **peace of mind** knowing that your health and financial security are covered. 
          Whether it’s **routine checkups, emergency medical expenses, or specialized treatments**, this plan offers 
          a tailored solution to fit your needs.
        </p>

        {/* Plan Details Section */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-blue-100 p-6 rounded-lg">
            <h3 className="text-xl font-semibold text-gray-800">Plan Provider</h3>
            <p className="text-gray-700">{insurance.provider}</p>
          </div>

          <div className="bg-blue-100 p-6 rounded-lg">
            <h3 className="text-xl font-semibold text-gray-800">Coverage</h3>
            <p className="text-gray-700">${insurance.coverage}</p>
          </div>

          <div className="bg-blue-100 p-6 rounded-lg">
            <h3 className="text-xl font-semibold text-gray-800">Plan Amount</h3>
            <p className="text-gray-700">${insurance.amount} per year</p>
          </div>
        </div>

        {/* Benefits Section */}
        {insurance.benefits && insurance.benefits.length > 0 && (
          <div className="mt-10">
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">Key Benefits</h3>
            <p className="text-gray-700 mb-4">
              With this plan, you get **a range of benefits** that ensure your healthcare expenses are well managed.
              Below are some of the **top benefits** provided under this insurance plan:
            </p>
            <ul className="space-y-3">
              {insurance.benefits.map((benefit, index) => (
                <li key={index} className="flex items-center text-gray-800">
                  <CheckCircle className="text-green-500 w-5 h-5 mr-2" />
                  {benefit}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Call to Action */}
        <div className="mt-12 bg-gray-100 p-6 rounded-lg">
          <h3 className="text-2xl font-semibold text-gray-900 mb-2">Why Choose This Plan?</h3>
          <p className="text-gray-700">
            This insurance plan is **ideal for individuals and families** seeking a balance between cost and 
            **comprehensive medical coverage**. Whether you're dealing with **unexpected medical emergencies** 
            or planning for **long-term health security**, this plan provides a **reliable safety net**.
          </p>
        </div>

        {/* Footer */}
        <div className="mt-10 text-center">
          <p className="text-gray-600 text-sm">
            Have questions? Contact <span className="text-blue-500 font-semibold">{insurance.provider}</span> 
            for more details about your plan.
          </p>
        </div>
      </div>
    </div>
  );
}
