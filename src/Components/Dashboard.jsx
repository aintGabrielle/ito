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

const API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

const openai = new OpenAI({
  apiKey: API_KEY, // Ensure this is set in your .env file
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

  const navigate = useNavigate();

  const fetchWorkoutLogs = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from("workout_logs")
      .select("*")
      .eq("user_id", user.id)
      .order("workout_date", { ascending: true }); // ✅ Use `workout_date`

    if (error) {
      console.error("Error fetching workout logs:", error.message);
    } else {
      setWorkoutLogs(data);
    }
  };

  useEffect(() => {
    fetchWorkoutLogs();
  }, [user]);

  // ✅ Log or Update a Workout
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
      // ✅ Update existing log
      const { error } = await supabase
        .from("workout_logs")
        .update({ did_workout: status })
        .eq("id", existingLog.id);

      if (error) {
        console.error("Error updating workout log:", error.message);
        return;
      }
    } else {
      // ✅ Insert new log
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

    fetchWorkoutLogs(); // ✅ Refresh the graph after updating logs
  };

  // ✅ Delete a Workout
  const deleteWorkout = async (id) => {
    const { error } = await supabase.from("workout_logs").delete().eq("id", id);
    if (error) {
      console.error("Error deleting workout log:", error.message);
    } else {
      fetchWorkoutLogs();
    }
  };
  // ✅ Fetch fitness assessment for AI Diet Plan
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
      }
    }
  };

  // ✅ **Generate AI-Powered Diet Plan Using OpenAI**
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

    const prompt = `
      You are a professional dietitian. Generate a personalized diet plan for a user based on their fitness data:
      - Weight: ${weight} kg
      - Height: ${height} cm
      - BMI: ${bmi}
      - Goal: ${goal} (weight loss, muscle gain, or maintenance)
      - Workout Level: ${workoutLevel} (beginner, intermediate, advanced)
      - Exercise Type: ${exerciseType} (strength, cardio, mixed)
      - Daily Walking: ${dailyWalking} minutes
      - Push-ups: ${pushups} reps
  
      Provide a structured meal plan including:
      - Breakfast
      - Lunch
      - Dinner
      - Snacks
      - Additional recommendations
    `;

    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [{ role: "system", content: prompt }],
        max_tokens: 300,
        temperature: 0.7,
      });

      console.log(
        "AI Diet Plan Response:",
        response.choices[0]?.message?.content
      );
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

  // ✅ Fix: Add handlePostSubmit Function
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
      setNewPost(""); // Clear input after posting
      fetchCommunityPosts(); // Refresh forum posts
    }

    setPosting(false);
  };

  return (
    <div className="flex lg:flex-row min-h-screen bg-gray-100">
      <Nav />

      {/* Main Content */}
      <div className="flex-1 p-4 md:p-8 w-full max-w-7xl mx-auto">
        <h3 className="text-3xl font-bold text-green-600 mb-6 text-center md:text-left">
          📊 Your Fitness Dashboard
        </h3>

        {/* 🏋️ Workout Progress */}
        {/* 🏋️ Workout Logging Section */}
        <div className="mt-6 bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold mb-4 text-center">
            🏋️ Daily Workout Log
          </h2>

          <div className="flex flex-col md:flex-row gap-4">
            <Button
              onClick={() => logWorkout(true)}
              className="bg-green-500 w-full md:w-auto"
            >
              ✅ Yes, I worked out
            </Button>
            <Button
              onClick={() => logWorkout(false)}
              className="bg-red-500 w-full md:w-auto"
            >
              ❌ No workout today
            </Button>
          </div>

          {/* Workout Log List */}
          <ul className="mt-4 space-y-3">
            {workoutLogs.map((log) => (
              <li
                key={log.id}
                className="bg-gray-100 p-4 rounded-lg shadow-sm flex justify-between items-center"
              >
                <span>
                  📅 {log.date}:{" "}
                  {log.did_workout ? "✅ Worked Out" : "❌ No Workout"}
                </span>
                <div className="flex gap-2">
                  <Button
                    onClick={() => logWorkout(!log.did_workout)}
                    className="bg-blue-500"
                  >
                    🔄 Update
                  </Button>
                  <Button
                    onClick={() => deleteWorkout(log.id)}
                    className="bg-red-500"
                  >
                    🗑️ Delete
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* 📈 Workout Tracking Graph */}
        <div className="mt-6 bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold mb-4 text-center">
            📊 Workout Progress
          </h2>

          {workoutLogs.length === 0 ? (
            <p className="text-gray-500 text-center">
              No workout data available.
            </p>
          ) : (
            <div className="w-full h-64">
              <Line
                data={{
                  labels: workoutLogs.map((log) => log.workout_date), // ✅ Use `workout_date`
                  datasets: [
                    {
                      label: "Workout Days (1 = Workout, 0 = No Workout)",
                      data: workoutLogs.map((log) => (log.did_workout ? 1 : 0)),
                      borderColor: "blue",
                      borderWidth: 2,
                      fill: false,
                    },
                  ],
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: {
                    y: {
                      ticks: {
                        stepSize: 1,
                        min: 0,
                        max: 1, // ✅ Ensures graph is readable (0 = No, 1 = Yes)
                      },
                    },
                  },
                }}
              />
            </div>
          )}
        </div>

        {/* 💬 Community Forum */}
        <div className="mt-6 w-full bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold mb-4 text-green-400 text-center">
            💬 Community Forum
          </h2>

          {/* Post Input */}
          <div className="flex flex-col md:flex-row gap-2 mb-4">
            <Input
              type="text"
              placeholder="Share something..."
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
              className="flex-grow p-2 border rounded-md"
            />
            <Button
              onClick={handlePostSubmit}
              disabled={posting}
              className="w-full md:w-auto"
            >
              {posting ? "Posting..." : "Post"}
            </Button>
          </div>

          {/* Posts List */}
          <div className="overflow-y-auto max-h-64 border p-2 rounded-lg">
            {communityPosts.length > 0 ? (
              <ul className="space-y-4">
                {communityPosts.slice(0, 4).map((post) => (
                  <li
                    key={post.id}
                    className="bg-gray-100 p-4 rounded-lg shadow-sm"
                  >
                    <strong>User {post.user_id}:</strong> {post.content}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 text-center">
                No posts yet. Be the first to share!
              </p>
            )}
          </div>
        </div>

        {/* 🤖 AI-Generated Diet Plan */}
        <div className="mt-6 bg-white p-6 rounded-lg shadow-lg w-full">
          <h2 className="text-2xl font-semibold text-green-400 mb-4 text-center">
            🤖 AI Coach Diet Plan
          </h2>
          {dietPlan ? (
            <pre className="text-gray-800 whitespace-pre-wrap">{dietPlan}</pre>
          ) : (
            <p className="text-gray-500 text-center">
              ⚠️ No diet plan available. Please complete your fitness
              assessment.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
