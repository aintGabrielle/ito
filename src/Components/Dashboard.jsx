import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/Context/AuthContext";
import useUser from "../hooks/useUser";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { supabase } from "../supabaseClient";
import Nav from "./Nav";
import OpenAI from "openai";
import { Line } from "react-chartjs-2";
import TodaysFocus from "./TodayFocus";

const API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

const openai = new OpenAI({
  apiKey: API_KEY,
  dangerouslyAllowBrowser: true,
});

const Dashboard = () => {
  const { session, signInUser, signOut } = useAuth();
  const { user } = useUser();
  const [assessment, setAssessment] = useState(null);
  const [dietPlan, setDietPlan] = useState(null);
  const [communityPosts, setCommunityPosts] = useState([]);
  const [newPost, setNewPost] = useState("");
  const [posting, setPosting] = useState(false);
  const [workoutLogs, setWorkoutLogs] = useState([]);
  const [showAssessmentModal, setShowAssessmentModal] = useState(false);

  const navigate = useNavigate();

  const fetchWorkoutLogs = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from("workout_logs")
      .select("*")
      .eq("user_id", user.id)
      .order("workout_date", { ascending: true });

    if (error) {
      console.error("Error fetching workout logs:", error.message);
    } else {
      setWorkoutLogs(data);
    }
  };

  useEffect(() => {
    fetchWorkoutLogs();
  }, [user]);

  const logWorkout = async (status) => {
    if (!user) return;
    const today = new Date().toISOString().split("T")[0];

    const { data: existingLog, error: fetchError } = await supabase
      .from("workout_logs")
      .select("id")
      .eq("user_id", user.id)
      .eq("workout_date", today)
      .maybeSingle();

    if (fetchError) {
      console.error("Error fetching existing log:", fetchError.message);
      return;
    }

    if (existingLog) {
      const { error } = await supabase
        .from("workout_logs")
        .update({ did_workout: status })
        .eq("id", existingLog.id);

      if (error) {
        console.error("Error updating workout log:", error.message);
        return;
      }
    } else {
      const { error } = await supabase
        .from("workout_logs")
        .insert([
          { user_id: user.id, workout_date: today, did_workout: status },
        ]);

      if (error) {
        console.error("Error adding workout log:", error.message);
        return;
      }
    }

    fetchWorkoutLogs();
  };

  const deleteWorkout = async (id) => {
    const { error } = await supabase.from("workout_logs").delete().eq("id", id);
    if (error) {
      console.error("Error deleting workout log:", error.message);
    } else {
      fetchWorkoutLogs();
    }
  };

  useEffect(() => {
    fetchAssessment();
    fetchCommunityPosts();
  }, [user]);

  const fetchAssessment = async () => {
    if (!user) {
      console.warn("User not found, cannot fetch assessment.");
      return;
    }

    const { data, error } = await supabase
      .from("fitness_assessments")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error("Supabase Error:", error.message);
    } else {
      console.log("Fetched Assessment Data:", data);
      if (data) {
        setAssessment(data);
        generateDietPlanWithAI(data);
      } else {
        setShowAssessmentModal(true);
      }
    }
  };

  const generateDietPlanWithAI = async (data) => {
    if (!data) return;

    const {
      weight,
      height,
      goal,
      workoutLevel,
      exerciseType,
      dailyWalking,
      pushups,
    } = data;
    const bmi = (weight / (height / 100) ** 2).toFixed(1);

    const prompt = `You are a professional dietitian. Generate a personalized diet plan for a user based on their fitness data:\n- Weight: ${weight} kg\n- Height: ${height} cm\n- BMI: ${bmi}\n- Goal: ${goal}\n- Workout Level: ${workoutLevel}\n- Exercise Type: ${exerciseType}\n- Daily Walking: ${dailyWalking} minutes\n- Push-ups: ${pushups} reps\n\nProvide a structured meal plan including:\n- Breakfast\n- Lunch\n- Dinner\n- Snacks\n- Additional recommendations`;

    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [{ role: "system", content: prompt }],
        max_tokens: 300,
        temperature: 0.7,
      });

      setDietPlan(
        response.choices[0]?.message?.content || "No response from AI."
      );
    } catch (error) {
      console.error("Error generating diet plan:", error);
      setDietPlan(
        `⚠️ Failed to generate AI meal plan. OpenAI Error: ${error.message}`
      );
    }
  };

  const fetchCommunityPosts = async () => {
    const { data, error } = await supabase
      .from("community_posts")
      .select("id, user_id, content, created_at")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching community posts:", error.message);
    } else {
      setCommunityPosts(data);
    }
  };

  const handlePostSubmit = async () => {
    if (!user) {
      alert("You must be logged in to post!");
      return;
    }
    if (!newPost.trim()) {
      alert("Post cannot be empty!");
      return;
    }

    setPosting(true);

    const { error } = await supabase
      .from("community_posts")
      .insert([{ user_id: user.id, content: newPost }]);

    if (error) {
      console.error("Error adding post:", error.message);
      alert("Failed to post. Try again!");
    } else {
      setNewPost("");
      fetchCommunityPosts();
    }

    setPosting(false);
  };

  return (
    <div className="flex lg:flex-row min-h-screen bg-gray-100">
      <Nav />
      <div className="flex-1 p-4 md:p-8 w-full max-w-7xl mx-auto">
        <h3 className="text-3xl font-bold text-green-600 mb-6 text-center md:text-left">
          📊 Your Fitness Dashboard
        </h3>

        {/* Modal if no assessment */}
        {showAssessmentModal && (
          <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white rounded-xl shadow-xl p-6 max-w-md text-center space-y-4">
              <h2 className="text-2xl font-bold text-red-500">
                🚨 No Assessment Found
              </h2>
              <p className="text-gray-700">
                You haven't completed your fitness assessment yet. Would you
                like to do it now?
              </p>
              <div className="flex justify-center gap-4 mt-4">
                <Button
                  className="bg-green-600 text-white px-4 py-2 rounded-md"
                  onClick={() => navigate("/assessment")}
                >
                  Go to Assessment
                </Button>
                <Button
                  className="bg-gray-300 px-4 py-2 rounded-md"
                  onClick={() => setShowAssessmentModal(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* The rest of your dashboard UI remains unchanged */}
        {/* ... */}

        <TodaysFocus />

        <div className="mt-6 bg-white p-6 rounded-lg shadow-lg w-full">
          <h2 className="text-2xl font-semibold text-green-400 mb-4 text-center">
            🤖 AI Coach Diet Plan
          </h2>
          {dietPlan ? (
            <pre className="text-gray-800 whitespace-pre-wrap">{dietPlan}</pre>
          ) : (
            <p className="text-gray-500 text-center">
              ⚠️ Loading generated data, please wait...
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
