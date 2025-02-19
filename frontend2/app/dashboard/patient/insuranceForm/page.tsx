"use client"; // Client component for using hooks

import React, { useState } from "react";

const InsuranceForm: React.FC = () => {
  const [formData, setFormData] = useState({
    did: "",
    ageGroup: "",
    planType: "",
    sumInsured: "",
    coveragePeriod: "",
    paymentMethod: "",
    consent: false,
    digitalSignature: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Process form data with ZKP verification
    console.log("Form Submitted:", formData);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-3xl font-semibold text-center mb-6"> Insurance Application Form</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* DID Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Unique Identifier (DID or Hash):</label>
          <input
            type="text"
            name="did"
            value={formData.did}
            onChange={handleChange}
            required
            className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Age Group Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Age Group:</label>
          <select
            name="ageGroup"
            value={formData.ageGroup}
            onChange={handleChange}
            required
            className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select Age Group</option>
            <option value="18-30">18-30</option>
            <option value="31-45">31-45</option>
            <option value="46-60">46-60</option>
            <option value="60+">60+</option>
          </select>
        </div>

        {/* Plan Type Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Plan Type:</label>
          <select
            name="planType"
            value={formData.planType}
            onChange={handleChange}
            required
            className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select Plan</option>
            <option value="standard">Standard</option>
            <option value="premium">Premium</option>
            <option value="critical">Critical Illness Cover</option>
          </select>
        </div>

        {/* Sum Insured Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Sum Insured (Range):</label>
          <select
            name="sumInsured"
            value={formData.sumInsured}
            onChange={handleChange}
            required
            className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select Amount</option>
            <option value="1-5L">₹1-5L</option>
            <option value="5-10L">₹5-10L</option>
            <option value="10L+">₹10L+</option>
          </select>
        </div>

        {/* Coverage Period */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Coverage Period:</label>
          <select
            name="coveragePeriod"
            value={formData.coveragePeriod}
            onChange={handleChange}
            required
            className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select Period</option>
            <option value="1year">1 Year</option>
            <option value="2years">2 Years</option>
            <option value="3years">3 Years</option>
          </select>
        </div>

        {/* Payment Method */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Payment Method:</label>
          <select
            name="paymentMethod"
            value={formData.paymentMethod}
            onChange={handleChange}
            required
            className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select Payment Method</option>
            <option value="crypto">Cryptocurrency</option>
            <option value="bank-transfer">Bank Transfer</option>
            <option value="upi">UPI Payment</option>
          </select>
        </div>

      

        {/* Submit Button */}
        <div className="mt-6">
          <button
            type="submit"
            className="w-full py-3 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default InsuranceForm;
