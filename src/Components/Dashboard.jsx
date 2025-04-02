import { useAuth } from "@/Context/AuthContext";
import useAISuggestions from "@/hooks/use-ai-suggestions";
import useCurrentUser from "@/hooks/use-current-user";
import useProfile from "@/hooks/use-profile";
import useWorkoutLogs from "@/hooks/use-workout-logs";
import { ClockIcon, LayoutGridIcon, TargetIcon } from "lucide-react";
import OpenAI from "openai";
import { useState } from "react";
import Markdown from "react-markdown";
import { useNavigate } from "react-router-dom";
import Nav from "./Nav";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import FloatingChatbot from "./ui/floating-chatbot";
import { ScrollArea } from "./ui/scroll-area";
import { Skeleton } from "./ui/skeleton";
import { useEffect } from "react";

const API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

const openai = new OpenAI({
  apiKey: API_KEY,
  dangerouslyAllowBrowser: true,
});

const Dashboard = () => {
  const { session, signInUser, signOut } = useAuth();
  const { user } = useCurrentUser();
  const [dietPlan, setDietPlan] = useState(null);
  const [communityPosts, setCommunityPosts] = useState([]);
  const [newPost, setNewPost] = useState("");
  const [posting, setPosting] = useState(false);
  // const [workoutLogs, setWorkoutLogs] = useState([]);
  const [showAssessmentModal, setShowAssessmentModal] = useState(false);
  const [targetWeight, setTargetWeight] = useState(null);
  const [estimatedTime, setEstimatedTime] = useState(null);

  const { data: workoutLogs, error: fetchError } = useWorkoutLogs();
  const {
    aiSuggestions,
    error,
    mutate,
    isLoading: aiSuggestionsLoading,
  } = useAISuggestions();
  const { assessment } = useProfile();

  const navigate = useNavigate();

  useEffect(() => {
    if (assessment?.user_id) {
      mutate();
    }
  }, [assessment, mutate]);

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
            {/* <TodaysFocus /> */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="p-6 rounded-lg shadow-lg bg-card">
                <h4 className="mb-5 text-center text-primary">
                  AI Coach Suggestions
                </h4>
                {aiSuggestions && !aiSuggestionsLoading ? (
                  <Markdown>
                    {aiSuggestions.choices[0].message.content}
                  </Markdown>
                ) : (
                  <Skeleton className="w-full h-5" />
                )}
              </div>
              <div className="flex flex-col items-center p-6 rounded-lg shadow-lg bg-card">
                <h4 className="mb-5 text-primary">Target Weight & Progress</h4>
                <div className="flex gap-4 items-center">
                  <p className="flex items-center">
                    <TargetIcon size={20} className="mr-2" />
                    Weight Goal: {assessment?.currentWeight} kg
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
      {assessment !== undefined && (
        <Dialog open={!assessment?.user_id}>
          <DialogContent canClose={false}>
            <DialogHeader>
              <DialogTitle>No Assessment Found</DialogTitle>
              <DialogDescription>
                You haven't completed your fitness assessment yet. In order to
                get a personalized diet plan, please complete your fitness
                assessment.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button onClick={() => navigate("/assessment")}>
                Go to Assessment
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

export default Dashboard;
