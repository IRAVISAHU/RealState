"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const [city, setCity] = useState("");
  const router = useRouter();

  const handleSearch = () => {
    if (city.trim()) {
      router.push(`/city/${city}`);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-blue-600 mb-6">Find Real Estate Projects</h1>
      
      <div className="bg-white p-6 shadow-lg rounded-lg flex space-x-4">
        <input
          type="text"
          placeholder="Enter city name (e.g., Hyderabad)"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="border p-3 rounded-lg w-64 text-black "
        />
        <button
          onClick={handleSearch}
          className="bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition"
        >
          Search
        </button>
      </div>
    </div>
  );
}
