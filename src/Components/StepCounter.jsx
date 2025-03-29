import React, { useState, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Polyline,
  Marker,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { supabase } from "../supabaseClient";
import useCurrentUser from "@/hooks/use-current-user";

const StepCounterWithMap = () => {
  const { user } = useCurrentUser();
  const [steps, setSteps] = useState(0);
  const [distance, setDistance] = useState(0);
  const [position, setPosition] = useState(null);
  const [path, setPath] = useState([]);
  const [locationFetched, setLocationFetched] = useState(false);

  useEffect(() => {
    if (!user) return;

    if ("geolocation" in navigator) {
      const watchId = navigator.geolocation.watchPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          const newPoint = [latitude, longitude];

          setPosition(newPoint);
          setPath((prevPath) => {
            if (prevPath.length > 0) {
              const lastPoint = prevPath[prevPath.length - 1];
              const newDistance = calculateDistance(lastPoint, newPoint);

              if (newDistance > 0.8) {
                // Only count steps if the movement is significant
                setSteps((prev) => prev + 1);
              }

              setDistance((prev) => prev + newDistance);
            }
            return [...prevPath, newPoint];
          });

          setLocationFetched(true);
        },
        (error) => {
          console.error("GPS Error:", error);
          setLocationFetched(false);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );

      return () => navigator.geolocation.clearWatch(watchId);
    } else {
      console.error("Geolocation not supported.");
    }
  }, [user]);

  const calculateDistance = (coord1, coord2) => {
    const R = 6371e3;
    const toRadians = (degrees) => (degrees * Math.PI) / 180;

    const lat1 = toRadians(coord1[0]);
    const lat2 = toRadians(coord2[0]);
    const deltaLat = toRadians(coord2[0] - coord1[0]);
    const deltaLon = toRadians(coord2[1] - coord1[1]);

    const a =
      Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
      Math.cos(lat1) *
        Math.cos(lat2) *
        Math.sin(deltaLon / 2) *
        Math.sin(deltaLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  };

  const saveData = async () => {
    if (!user) {
      console.error("User not authenticated.");
      return;
    }

    const { data, error } = await supabase.from("step_tracking").insert([
      {
        user_id: user.id,
        steps,
        distance,
        path,
      },
    ]);

    if (error) console.error("Error saving data:", error);
    else console.log("Data saved successfully:", data);
  };

  return (
    <div className="z-10 p-4 text-center bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold text-green-600">Step Counter & Map</h2>

      <div className="my-4">
        <p className="text-lg">Steps: {steps}</p>
        <p className="text-lg">Distance: {(distance / 1000).toFixed(2)} km</p>
      </div>

      {locationFetched ? (
        <MapContainer
          center={position}
          zoom={15}
          style={{ height: "400px", width: "100%", zIndex: 10 }}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <Polyline positions={path} color="blue" />
          <Marker position={position} />
          <MapUpdater position={position} />
        </MapContainer>
      ) : (
        <p className="text-gray-500">
          Fetching location... Please allow location access.
        </p>
      )}

      <button
        onClick={saveData}
        className="px-4 py-2 mt-4 text-white bg-blue-500 rounded hover:bg-blue-600"
      >
        Save Progress
      </button>
    </div>
  );
};

const MapUpdater = ({ position }) => {
  const map = useMap();
  useEffect(() => {
    if (position) {
      map.setView(position, 15);
    }
  }, [position, map]);
  return null;
};

export default StepCounterWithMap;
