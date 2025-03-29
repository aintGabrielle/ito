import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/Context/AuthContext";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { supabase } from "../supabaseClient";
import Nav from "./Nav";
import OpenAI from "openai";
import { Line } from "react-chartjs-2";
import TodaysFocus from "./TodayFocus";
import { LayoutGridIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { ScrollArea } from "./ui/scroll-area";
import { Skeleton } from "./ui/skeleton";
import { cn } from "@/lib/utils";
import FloatingChatbot from "./ui/floating-chatbot";
import useCurrentUser from "@/hooks/use-current-user";

const API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

const openai = new OpenAI({
  apiKey: API_KEY,
  dangerouslyAllowBrowser: true,
});

const Dashboard = () => {
  const { session, signInUser, signOut } = useAuth();
  const { user } = useCurrentUser();
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
    <>
      <div className="flex relative min-h-screen">
        <Nav />
        <ScrollArea className="flex-1 h-screen">
          <div className="flex flex-col flex-1 gap-2 p-5 pt-20 mx-auto w-full md:pt-5">
            <div className="flex gap-4 items-center mb-10">
              <LayoutGridIcon size={40} />
              <h3>Your Fitness Dashboard</h3>
            </div>

            <TodaysFocus />

            <div className="p-6 w-full rounded-lg shadow-lg bg-card">
              <h4 className="mb-5 text-center text-primary">
                🤖 AI Coach Diet Plan
              </h4>
              {dietPlan ? (
                <pre className="whitespace-pre-wrap">{dietPlan}</pre>
              ) : (
                <div className="flex flex-col gap-2">
                  {Array(5)
                    .fill(0)
                    .map((_, i) => (
                      <Skeleton
                        className="w-full h-5"
                        key={`diet-plan-skeleton-${i + 1}`}
                      />
                    ))}
                </div>
              )}
            </div>
          </div>
        </ScrollArea>

        <FloatingChatbot />
      </div>

      {/* Modal if no assessment */}
      <Dialog open={showAssessmentModal}>
        <DialogContent canClose={false}>
          <DialogHeader>
            <DialogTitle>No Assessment Found</DialogTitle>
            <DialogDescription>
              You haven't completed your fitness assessment yet. In order to get
              a personalized diet plan, please complete your fitness assessment.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={() => navigate("/assessment")}>
              Go to Assessment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Dashboard;
