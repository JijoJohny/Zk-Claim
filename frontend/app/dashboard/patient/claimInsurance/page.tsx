"use client"; // Add this for Client Component

import { useState } from 'react';
import { Button } from '@/components/ui/button';

const SurgeryClaimForm = () => {
  const [claimData, setClaimData] = useState({
    surgeryDate: '',
    surgeryType: '',
    doctorName: '',
    hospitalName: '',
    hospitalAdmissionDate: '',
    medicalReport: null as File | null,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setClaimData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setClaimData((prev) => ({ ...prev, medicalReport: e.target.files[0] }));
    }
  };

  return (
    <form className="max-w-lg mx-auto p-6 bg-white shadow-lg rounded-md space-y-6">
      <h2 className="text-3xl font-semibold text-center">Insurance Claim Form</h2>

      <div className="space-y-4">
        <div>
          <label htmlFor="surgeryDate" className="block text-sm font-medium text-gray-700">Surgery Date</label>
          <input
            type="date"
            id="surgeryDate"
            name="surgeryDate"
            value={claimData.surgeryDate}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="surgeryType" className="block text-sm font-medium text-gray-700">Surgery Type</label>
          <input
            type="text"
            id="surgeryType"
            name="surgeryType"
            value={claimData.surgeryType}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="doctorName" className="block text-sm font-medium text-gray-700">Doctor's Name</label>
          <input
            type="text"
            id="doctorName"
            name="doctorName"
            value={claimData.doctorName}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="hospitalName" className="block text-sm font-medium text-gray-700">Hospital Name</label>
          <input
            type="text"
            id="hospitalName"
            name="hospitalName"
            value={claimData.hospitalName}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="hospitalAdmissionDate" className="block text-sm font-medium text-gray-700">Hospital Admission Date</label>
          <input
            type="date"
            id="hospitalAdmissionDate"
            name="hospitalAdmissionDate"
            value={claimData.hospitalAdmissionDate}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="medicalReport" className="block text-sm font-medium text-gray-700">Medical Report (if applicable)</label>
          <input
            type="file"
            id="medicalReport"
            name="medicalReport"
            onChange={handleFileChange}
            className="w-full p-3 border border-gray-300 rounded-md"
          />
        </div>
      </div>

      <div className="text-center">
        <Button className="mt-6 w-full py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600">Submit Claim</Button>
      </div>
    </form>
  );
};

export default SurgeryClaimForm;
