export default function HomePage() {
  return (
    <div className="bg-gray-100 min-h-screen p-6 flex flex-col">
      {/* Top Section: Image with Text Overlay */}
      <div className="relative w-full h-1/2">
        <img
          src="/images/hospital.jpg"
          alt="Hospital building"
          className="w-full h-25 object-cover rounded-lg shadow-md"
        />
        <div className="absolute right-6 top-6 bg-blue-800 bg-opacity-75 p-6 rounded-lg shadow-lg text-white text-left max-w-md h-500 flex items-center">
          <p className="text-5xl font-extrabold italic">
            “Your Health, Our Priority”
          </p>
        </div>
      </div>

      {/* Hospital Information Section */}
      <div className="grid grid-cols-2 gap-6 mt-6">
        {/* Services Section */}
        <div className="p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-blue-700">Our Services:</h2>
          <ul className="mt-4 space-y-2 text-gray-700">
            <li>✔ 24/7 Emergency Care</li>
            <li>✔ Specialized Medical Consultations</li>
            <li>✔ Advanced Surgical Procedures</li>
            <li>✔ Laboratory & Diagnostic Services</li>
            <li>✔ Maternity & Pediatric Care</li>
            <li>✔ Telemedicine & Online Consultations</li>
          </ul>
        </div>

        {/* About Us Section */}
        <div className="p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-blue-700">About Us:</h2>
          <p className="mt-4 text-gray-700">
            Apollo Medical Centre is committed to providing world-class
            healthcare services with state-of-the-art technology and
            highly qualified professionals. Our mission is to ensure
            the best medical care for every patient.
          </p>
          <p className="mt-2 text-gray-700">
            With a legacy of excellence in patient care, we are dedicated
            to offering compassionate treatment, advanced medical research,
            and innovative healthcare solutions.
          </p>
        </div>
      </div>

      {/* Contact Section */}
      <div className="mt-8 p-6 bg-blue-700 text-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold">Contact Us:</h2>
        <p className="mt-2">📞 +1 234 567 8901</p>
        <p>📧 contact@apollomedical.com</p>
        <p>🌍 www.apollomedical.com</p>
        <p>📍 456 Care Avenue, Medicity, California, USA</p>
      </div>
    </div>
  );
}
