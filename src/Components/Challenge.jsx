import React, { useEffect, useState } from "react";
import { supabase } from "@/supabaseClient";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "./ui/dialog";
import { toast } from "sonner";
import { Pencil, Trash, Copy, CheckCircle } from "lucide-react";
import Navbar from "./Navbar";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, BarChart, User, Dumbbell, LogOut } from "lucide-react"; // Sidebar Icons
import WorkoutTracker from "./WorkoutTracker";

const ChallengeManager = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [challenges, setChallenges] = useState([]);
  const [newChallenge, setNewChallenge] = useState({
    name: "",
    description: "",
    challenge_link: "",
  });
  const [editingChallenge, setEditingChallenge] = useState(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [user, setUser] = useState(null);

  // Fetch user on component mount
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getSession();
        console.log("Fetched user:", user); // Log user for debugging
        setUser(user || null);
      } catch (error) {
        console.error("Error fetching user session:", error.message);
      }
    };

    fetchUser();

    // Listen for auth state changes
    const authListener = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth state changed:", event, session); // Log auth state change
      setUser(session?.user || null);
    });

    // Cleanup on component unmount
    return () => {
      if (authListener) {
        authListener.unsubscribe; // Fixing unsubscribe call
      }
    };
  }, []);

  // Fetch challenges once the user is available
  useEffect(() => {
    if (user) {
      const fetchChallenges = async () => {
        try {
          console.log("Fetching challenges for user:", user.id); // Log fetch attempt
          const { data, error } = await supabase
            .from("challenge")
            .select("*")
            .eq("user_id", user.id);

          if (error) {
            console.error("Fetch error:", error.message);
          } else {
            setChallenges(data);
            console.log("Challenges fetched:", data); // Log fetched challenges
          }
        } catch (error) {
          console.error("Error during challenges fetch:", error.message);
        }
      };

      fetchChallenges();
    }
  }, [user]);

  const handleChange = (e) => {
    setNewChallenge({ ...newChallenge, [e.target.name]: e.target.value });
  };

  const createChallenge = async () => {
    if (!newChallenge.name || !newChallenge.description) {
      toast.error("Please enter name and description.");
      return;
    }

    // Check if user.id is available
    if (!user?.id) {
      toast.error("User is not logged in.");
      return;
    }

    const { data, error } = await supabase.from("challenge").insert([
      {
        name: newChallenge.name,
        description: newChallenge.description,
        challenge_link: newChallenge.challenge_link || "", // Default to empty string if no link
        user_id: user.id,
      },
    ]);

    if (error) {
      console.error("Error inserting challenge:", error.message); // Log detailed error
      toast.error(`Failed to create challenge: ${error.message}`);
    } else {
      setChallenges([...challenges, data[0]]);
      setNewChallenge({ name: "", description: "", challenge_link: "" }); // Clear fields
      toast.success("Challenge created successfully!");
    }
  };

  const openEditModal = (challenge) => {
    setEditingChallenge(challenge);
    setIsEditOpen(true);
  };

  const updateChallenge = async () => {
    const { id, name, description, is_done, challenge_link } = editingChallenge;
    try {
      const { error } = await supabase
        .from("challenge")
        .update({ name, description, is_done, challenge_link })
        .eq("id", id);

      if (error) {
        console.error(error);
        toast.error("Failed to update challenge.");
      } else {
        setChallenges(
          challenges.map((c) =>
            c.id === id
              ? { ...c, name, description, is_done, challenge_link }
              : c
          )
        );
        toast.success("Challenge updated!");
        setIsEditOpen(false);
      }
    } catch (error) {
      console.error("Error updating challenge:", error.message);
    }
  };

  const deleteChallenge = async (id) => {
    try {
      const { error } = await supabase.from("challenge").delete().eq("id", id);
      if (error) {
        console.error(error);
        toast.error("Failed to delete challenge.");
      } else {
        setChallenges(challenges.filter((c) => c.id !== id));
        toast.success("Challenge deleted.");
      }
    } catch (error) {
      console.error("Error deleting challenge:", error.message);
    }
  };

  const markAsDone = async (id) => {
    try {
      const { error } = await supabase
        .from("challenge")
        .update({ is_done: true })
        .eq("id", id);

      if (error) {
        console.error(error);
        toast.error("Failed to mark challenge as done.");
      } else {
        setChallenges(
          challenges.map((c) => (c.id === id ? { ...c, is_done: true } : c))
        );
        toast.success("Challenge marked as done!");
      }
    } catch (error) {
      console.error("Error marking challenge as done:", error.message);
    }
  };

  const copyShareLink = (id) => {
    const url = `${window.location.origin}/challenge/${id}`;
    navigator.clipboard.writeText(url);
    toast.success("Challenge link copied!");
  };

  return (
    <div className="flex justify-between md:justify-normal flex-col md:flex-row overflow-hidden">
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
      <div className="mx-auto p-6">
        <h1 className="text-3xl font-bold text-center mb-6 text-green-400">
          Track your Journey!
        </h1>

        {/* Create Challenge */}
        <WorkoutTracker />
      </div>
    </div>
  );
};

export default ChallengeManager;
