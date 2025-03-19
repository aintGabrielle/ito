import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/Context/AuthContext";
import useUser from "../hooks/useUser";
import { Button } from "./ui/button";
import { Menu, X, BarChart, User, Dumbbell, LogOut } from "lucide-react"; // Sidebar Icons
import { supabase } from "../supabaseClient";
import StartedWorkout from "./StartedWorkout";
import StepCounter from "./StepCounter";
import DietPlanCard from "./DietPlanCard";

const Nav = () => {
  const { session, signInUser, signOut } = useAuth();
  const { user } = useUser();
  const [assessment, setAssessment] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAssessment = async () => {
      if (!user) {
        console.warn("User not found, cannot fetch assessment.");
        return;
      }

      const { data, error } = await supabase
        .from("fitness_assessments")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false }) // ✅ Get the most recent entry
        .limit(1) // ✅ Ensures only one row is fetched
        .maybeSingle(); // ✅ Prevents errors if no row is found

      if (error) {
        console.error("Supabase Error:", error.message);
      } else {
        console.log("Fetched Assessment Data:", data);
        setAssessment(data);
      }
    };

    fetchAssessment();
  }, [user]);

  return (
    <div className="flex min-h-screen overflow-hidden bg-gray-100">
      <button
        className="fixed top-4 left-4 z-50 text-gray-800 md:hidden"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X size={28} /> : <Menu size={28} />}
      </button>

      {/* Sidebar */}
      <div
        className={`fixed md:relative z-40 bg-white shadow-xl h-screen flex flex-col p-6 w-64 transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 transition-transform duration-300 ease-in-out`}
      >
        <div className="flex items-center gap-3 mb-8">
          <img src="/images/logo.png" className="w-12" alt="Logo" />
          <h1 className="font-bold italic text-2xl text-green-500">
            FitMission
          </h1>
        </div>

        <nav className="flex flex-col space-y-4 flex-grow">
          <Link
            to="/dashboard"
            className="flex items-center gap-3 text-lg hover:text-green-500"
          >
            <BarChart size={20} /> Dashboard
          </Link>
          <Link
            to="/challenge"
            className="flex items-center gap-3 text-lg hover:text-green-500"
          >
            <Dumbbell size={20} /> Tracker
          </Link>
          <Link
            to="/chatbot"
            className="flex items-center gap-3 text-lg hover:text-green-500"
          >
            🤖 AI Coach
          </Link>
          <Link
            to="/challenges"
            className="flex items-center gap-3 text-lg hover:text-green-500"
          >
            <Dumbbell size={20} /> Challenge
          </Link>
          <Link
            to="/profile"
            className="flex items-center gap-3 text-lg hover:text-green-500"
          >
            <Dumbbell size={20} /> Profile
          </Link>
        </nav>

        <div className="mt-auto">
          <Button
            className="mt-4 w-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center gap-2"
            onClick={() => {
              signOut();
              navigate("/");
            }}
          >
            <LogOut size={18} /> Sign Out
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Nav;
