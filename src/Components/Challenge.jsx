import React, { useEffect, useState } from "react";
import { supabase } from "@/supabaseClient";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
import {
  Menu,
  X,
  BarChart,
  Dumbbell,
  LogOut,
  LayoutGridIcon,
  ChartNoAxesCombinedIcon,
} from "lucide-react";
import WorkoutTracker from "./WorkoutTracker";
import { Link, useNavigate } from "react-router-dom";
import Nav from "./Nav";
import { ScrollArea } from "./ui/scroll-area";
import FloatingChatbot from "./ui/floating-chatbot";

const ChallengeManager = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);

  // Fetch user on mount
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getSession();
        setUser(user || null);
      } catch (error) {
        console.error("Error fetching user session:", error.message);
      }
    };

    fetchUser();

    // Listen for auth changes
    const authListener = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => {
      authListener.data?.subscription?.unsubscribe();
    };
  }, []);

  const navigate = useNavigate();

  return (
    <div className="flex overflow-hidden h-full">
      {/* Mobile Sidebar Toggle */}
      <Nav />

      {/* Content Section */}
      <ScrollArea className="flex-1 h-screen">
        <div className="flex flex-col flex-1 gap-2 p-5 pt-20 mx-auto w-full md:pt-5">
          <div className="flex gap-4 items-center mb-10">
            <ChartNoAxesCombinedIcon size={40} />
            <h3>Workout Tracker</h3>
          </div>
          <WorkoutTracker />

          <FloatingChatbot />
        </div>
      </ScrollArea>
    </div>
  );
};

export default ChallengeManager;
