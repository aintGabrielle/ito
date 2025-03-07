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

const Dashboard = () => {
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
    <div className="flex min-h-screen bg-gray-100">
      {/* Mobile Menu */}
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
          {/* <Link
            to="/profile"
            className="flex items-center gap-3 text-lg hover:text-green-500"
          >
            🏆 Profile
          </Link> */}
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

      {/* Main Content */}
      <div className="flex-1 p-8">
        <h3 className="text-3xl font-bold text-green-600 mb-6">
          📊 Your Fitness Assessment
        </h3>

        {/* Fitness Assessment Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {assessment ? (
            <>
              <StatCard
                label="Height"
                value={assessment.height ? `${assessment.height} cm` : "N/A"}
              />
              <StatCard
                label="Weight"
                value={
                  assessment.currentWeight
                    ? `${assessment.currentWeight} kg`
                    : "N/A"
                }
              />
              <StatCard
                label="Goal"
                value={
                  assessment.goal ? assessment.goal.replace("_", " ") : "N/A"
                }
              />
              <StatCard
                label="Workout Level"
                value={assessment.workoutLevel || "N/A"}
              />
              <StatCard
                label="Preferred Muscle Focus"
                value={assessment.focusMuscle || "N/A"}
              />
              <StatCard
                label="Exercise Type"
                value={assessment.exerciseType || "N/A"}
              />
              <StatCard
                label="Daily Walking"
                value={
                  assessment.dailyWalking
                    ? `${assessment.dailyWalking} min`
                    : "N/A"
                }
              />
              <StatCard
                label="Push-ups Capacity"
                value={
                  assessment.pushups ? `${assessment.pushups} reps` : "N/A"
                }
              />
            </>
          ) : (
            <p className="text-gray-600">No fitness assessment found.</p>
          )}
        </div>

        {/* Step Counter & Workouts */}
        <div className="mt-6">
          <DietPlanCard />
        </div>
        {/* <StartedWorkout /> */}
      </div>
    </div>
  );
};

/* Small reusable Stat Card component */
const StatCard = ({ label, value }) => (
  <div className="bg-gradient-to-r from-blue-400 to-purple-600 p-6 rounded-xl shadow-lg transform hover:scale-105 transition-all">
    <h2 className="text-lg font-semibold text-white">{label}</h2>
    <p className="text-xl font-bold text-white">{value}</p>
  </div>
);

export default Dashboard;
