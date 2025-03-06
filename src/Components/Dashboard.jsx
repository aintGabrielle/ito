import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/Context/AuthContext";
import useUser from "../hooks/useUser";
import { Button } from "./ui/button";
import { Menu, X } from "lucide-react"; // ✅ Ensure correct import
import { supabase } from "../supabaseClient";
import StartedWorkout from "./StartedWorkout";
import StepCounter from "./StepCounter";

const Navbar = () => {
  const { session, signInUser, signOut } = useAuth(); // ✅ Fix missing signOut()
  const { user } = useUser();
  const [statistics, setStatistics] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserStatistics = async () => {
      if (!user) return;
      const { data, error } = await supabase
        .from("statistics")
        .select("*")
        .eq("user_id", user.id);
      if (error) console.error(error);
      else setStatistics(data);
    };
    fetchUserStatistics();
  }, [user]);

  return (
    <div className="flex min-h-screen">
      {/* Mobile Menu Button */}
      <button
        className="fixed top-4 left-4 z-50 text-gray-800 md:hidden"
        onClick={() => {
          console.log("Toggling menu, current state:", isOpen);
          setIsOpen(!isOpen);
        }}
      >
        {isOpen ? <X size={28} /> : <Menu size={28} />}
      </button>

      {/* Sidebar */}
      <div
        className={`fixed md:relative z-40 bg-white shadow-lg h-screen flex flex-col p-5 w-64 transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 transition-transform duration-300 ease-in-out`}
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <img src="/images/logo.png" className="w-12" alt="Logo" />
            <h1 className="font-bold italic text-xl text-green-500">
              FitMission
            </h1>
          </div>
        </div>
        <nav className="flex flex-col space-y-4 flex-grow">
          <Link to="/dashboard" className="hover:text-green-500">
            Dashboard
          </Link>
          <Link to="/challenge" className="hover:text-green-500">
            Challenge
          </Link>
          <Link to="/activity" className="hover:text-green-500">
            Activity
          </Link>
          <Link to="/chatbot" className="hover:text-green-500">
            Coach
          </Link>
          <Link to="/profile" className="hover:text-green-500">
            Profile
          </Link>
        </nav>
        <div className="mt-auto">
          <h2 className="text-sm text-gray-500">
            Welcome, {statistics[0]?.first_name || "Loading..."}
          </h2>
          <Button
            className="mt-4 w-full bg-red-500 hover:bg-red-600 text-white"
            onClick={() => {
              signOut();
              navigate("/");
            }}
          >
            Sign Out
          </Button>
        </div>
      </div>

      {/* Content Section */}
      <div className="flex-1 p-6 w-full">
        <h3 className="text-3xl font-bold text-green-600 mb-6">Statistics</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {statistics.map((item, index) => (
            <div
              key={index}
              className="bg-green-400 p-6 rounded-xl shadow-lg transform hover:scale-105 transition-all"
            >
              <h2 className="text-lg font-semibold text-white">
                Height: {item.height} cm
              </h2>
            </div>
          ))}
          {statistics.map((item, index) => (
            <div
              key={index}
              className="bg-green-400 p-6 rounded-xl shadow-lg transform hover:scale-105 transition-all"
            >
              <h2 className="text-lg font-semibold text-white">
                Weight: {item.weight} kg
              </h2>
            </div>
          ))}
          {statistics.map((item, index) => (
            <div
              key={index}
              className="bg-green-400 p-6 rounded-xl shadow-lg transform hover:scale-105 transition-all"
            >
              <h2 className="text-lg font-semibold text-white">
                Protein Intake: {item.protein_intake} g
              </h2>
            </div>
          ))}
        </div>

        {/* Step Counter & Workouts */}
        <div className="mt-6">
          <StepCounter />
        </div>
        <StartedWorkout />
      </div>
    </div>
  );
};

export default Navbar;
