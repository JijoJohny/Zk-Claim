export default function HomePage() {
    return (
      <div className="bg-gray-100 min-h-screen p-6 flex flex-col">
        {/* Top Half: Image with Text Overlay */}
        <div className="relative w-full h-1/2">
          <img
            src="/images/home.jpg"
            alt="Family enjoying health insurance benefits"
            className="w-full h-25 object-cover rounded-lg shadow-md"
          />
          <div className="absolute left-6 top-6 bg-blue-200 bg-opacity-75 p-6 rounded-lg shadow-lg text-white text-left max-w-md h-500 flex items-center">
  <p className="text-6xl font-extrabold italic text-blue-900">“The best gift for her future”</p>
</div>

        </div>
  
        {/* Bottom Half: Two-Column Layout */}
        <div className="grid grid-cols-2 gap-6 mt-6">
          {/* Services Section */}
          <div className="p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-blue-700">Service:</h2>
            <ul className="mt-4 space-y-2 text-gray-700">
              <li>✔ Giving advice to our customers, regarding their interests.</li>
              <li>✔ Assisting closely our customers as if they are our family members.</li>
              <li>✔ Personalizing your plan according to your budget.</li>
              <li>✔ Supporting our customers 24/7.</li>
            </ul>
          </div>
  
          {/* About Us Section */}
          <div className="p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-blue-700">About Us:</h2>
            <p className="mt-4 text-gray-700">
              Choose the card that opens doors in all 50 states. Protect yourself and your family with the
              compassion of the cross and the security of the shield.
            </p>
            <p className="mt-2 text-gray-700">
              “Your insurance” is the largest independent life insurance group – with a presence in 20 markets globally.
            </p>
          </div>
        </div>
  
        {/* Contact Section */}
        <div className="mt-8 p-6 bg-blue-700 text-white rounded-lg shadow-md">
          <h2 className="text-2xl font-bold">Contact Us:</h2>
          <p className="mt-2">📞 +00 123 4567890</p>
          <p>📧 example@example.com</p>
          <p>🌍 www.example.com</p>
          <p>📍 123 Street Name, City Name, State Name, Country, 12345</p>
        </div>
      </div>
    );
  }
  