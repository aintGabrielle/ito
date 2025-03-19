import React, { useEffect, useState } from "react";
import { supabase } from "@/supabaseClient";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
import { Menu, X, BarChart, Dumbbell, LogOut } from "lucide-react";
import WorkoutTracker from "./WorkoutTracker";
import { Link, useNavigate } from "react-router-dom";
import Nav from "./Nav";

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
    <div className="flex md:flex-row h-full overflow-hidden">
      {/* Mobile Sidebar Toggle */}
      <Nav />

      {/* Content Section */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 md:px-6 w-full">
        <h1 className="text-3xl font-bold text-center mb-6 text-green-400">
          Track your Journey!
        </h1>
        <WorkoutTracker />
      </div>
    </div>
  );
};

export default ChallengeManager;
