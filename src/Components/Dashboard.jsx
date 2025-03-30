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
import { ClockIcon, LayoutGridIcon, ScaleIcon, TargetIcon } from "lucide-react";
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
  const [aiSuggestions, setAiSuggestions] = useState([]);
  const [targetWeight, setTargetWeight] = useState(null);
  const [estimatedTime, setEstimatedTime] = useState(null);

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

  const fetchAISuggestions = async () => {
    if (!user) return;

    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "Provide 3 fitness and diet suggestions for users.",
          },
        ],
        max_tokens: 150,
        temperature: 0.7,
      });
      setAiSuggestions(response.choices[0]?.message?.content.split("\n") || []);
    } catch (error) {
      console.error("Error fetching AI suggestions:", error);
    }
  };

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
      setAssessment(data);
      if (data) {
        setTargetWeight((data.currentWeight - 5).toFixed(1));
        setEstimatedTime("~8 weeks");
      } else {
        setShowAssessmentModal(true);
      }
    }
  };

  useEffect(() => {
    fetchAssessment();
    fetchAISuggestions();
  }, [user]);

  return (
    <>
      <div className="flex relative min-h-screen">
        <Nav />
        <ScrollArea className="flex-1 p-6 h-screen">
          <div className="space-y-6">
            <div className="flex gap-4 items-center">
              <LayoutGridIcon size={40} />
              <h3>Your Fitness Dashboard</h3>
            </div>
            <TodaysFocus />
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="p-6 rounded-lg shadow-lg bg-card">
                <h4 className="mb-5 text-center text-primary">
                  AI Coach Suggestions
                </h4>
                {aiSuggestions.length > 0 ? (
                  <ul className="list-disc list-inside">
                    {aiSuggestions.map((suggestion, index) => (
                      <li key={index}>{suggestion}</li>
                    ))}
                  </ul>
                ) : (
                  <Skeleton className="w-full h-5" />
                )}
              </div>
              <div className="flex flex-col items-center p-6 rounded-lg shadow-lg bg-card">
                <h4 className="mb-5 text-primary">Target Weight & Progress</h4>
                <div className="flex gap-4 items-center">
                  <p className="flex items-center">
                    <TargetIcon size={20} className="mr-2" />
                    Weight Goal:
                  </p>
                  <p className="font-semibold">{targetWeight} kg</p>
                </div>
                <div className="flex gap-4 items-center">
                  <p className="flex items-center">
                    <ClockIcon size={20} className="mr-2" />
                    Estimated Time:
                  </p>
                  <p className="font-semibold">{estimatedTime}</p>
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>
        <FloatingChatbot />
      </div>
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
