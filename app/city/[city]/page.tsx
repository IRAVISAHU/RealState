"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import "leaflet/dist/leaflet.css";

interface Project {
  projectName: string;
  location: string;
  price: string;
  builder: string;
  latitude: number;
  longitude: number;
}

export default function CityPage() {
  const params = useParams();
  const city = params.city as string;

  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch(`/api/scrape?city=${city}`);
        const data = await response.json();
        setProjects(data);
      } catch (error) {
        console.error("Error fetching projects:", error);
      } finally {
        setLoading(false);
      }
    };

    if (city) fetchProjects();
  }, [city]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-blue-600 mb-4">Real Estate Projects in {city}</h1>

      {loading ? (
        <p className="text-center text-gray-500 animate-pulse">Loading real estate projects...</p>
      ) : projects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, index) => (
            <div
              key={index}
              className="border-black-500  p-4 rounded-lg shadow-md bg-white hover:shadow-lg transition-shadow duration-300"
            >
              <h2 className="text-xl font-semibold text-gray-800 mb-2">{project.projectName}</h2>
              <p className="text-gray-600 mb-1">📍 {project.location}</p>
              <p className="text-green-600 font-medium mb-1">💰 {project.price}</p>
              <p className="text-blue-500 text-sm">Latitude: {project.latitude}</p>
              <p className="text-blue-500 text-sm">Longitude: {project.longitude}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-600">No projects found for {city}.</p>
      )}
    </div>
  );
}
