import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/Context/AuthContext";
import { Button, buttonVariants } from "./ui/button";
import {
  Menu,
  X,
  BarChart,
  User,
  Dumbbell,
  LogOut,
  BarChartIcon,
  BotIcon,
  ChartNoAxesCombinedIcon,
  GridIcon,
  Grid2X2Icon,
  LayoutGridIcon,
  PersonStandingIcon,
  ListIcon,
  ScrollIcon,
  UserIcon,
  BicepsFlexedIcon,
} from "lucide-react"; // Sidebar Icons
import { supabase } from "../supabaseClient";
import StartedWorkout from "./StartedWorkout";
import StepCounter from "./StepCounter";
import DietPlanCard from "./DietPlanCard";
import { cn } from "@/lib/utils";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/alert-dialog";
import useCurrentUser from "@/hooks/use-current-user";

const Nav = () => {
  const { session, signInUser, signOut } = useAuth();
  const { user } = useCurrentUser();
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
        setAssessment(data);
      }
    };

    fetchAssessment();
  }, [user]);

  return (
    <div className="flex fixed top-0 left-0 z-50 min-h-screen md:relative">
      <Button
        size="icon"
        onClick={() => setIsOpen(!isOpen)}
        className="absolute top-4 left-4 md:hidden"
      >
        {isOpen ? <X size={28} /> : <Menu size={28} />}
      </Button>

      {/* Sidebar */}
      <div
        className={cn(
          "flex sticky top-0 z-40 flex-col p-4 w-screen h-screen shadow-xl transform bg-sidebar md:w-72",
          "transition-transform duration-300 ease-in-out md:translate-x-0",
          {
            "translate-x-0": isOpen,
            "-translate-x-full": !isOpen,
          }
        )}
      >
        <div className="flex gap-5">
          <Button
            className="md:hidden"
            size="icon"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </Button>
          <div className="flex gap-3 items-center mb-8">
            <img src="/images/logo.png" className="w-12" alt="Logo" />
            <h4 className="italic text-primary">FitMission</h4>
          </div>
        </div>

        <nav className="flex flex-col flex-grow gap-2">
          <Link to="/dashboard">
            <Button variant="ghost" className="justify-start w-full">
              <LayoutGridIcon size={20} />
              Dashboard
            </Button>
          </Link>
          <Link to="/challenge">
            <Button variant="ghost" className="justify-start w-full">
              <ChartNoAxesCombinedIcon size={20} />
              Tracker
            </Button>
          </Link>
          {/* <Link to="/chatbot">
            <Button variant="ghost" className="justify-start w-full">
              <BotIcon size={20} />
              AI Coach
            </Button>
          </Link> */}
          <Link to="/challenges">
            <Button variant="ghost" className="justify-start w-full">
              <Dumbbell size={20} />
              Challenge
            </Button>
          </Link>
          <Link to="/fitness">
            <Button variant="ghost" className="justify-start w-full">
              <BicepsFlexedIcon size={20} />
              Fitness & Diet
            </Button>
          </Link>
          <Link to="/profile">
            <Button variant="ghost" className="justify-start w-full">
              <UserIcon size={20} />
              Profile
            </Button>
          </Link>
          {/* <Link to="/forum">
            <Button variant="ghost" className="justify-start w-full">
              <ScrollIcon size={20} />
              Forum
            </Button>
          </Link> */}
        </nav>

        <div className="mt-auto">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" className="w-full">
                <LogOut size={18} /> Sign Out
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  Do you really want to end your session?
                </AlertDialogTitle>
                <AlertDialogDescription>
                  All unsaved changes will be lost. Please proceed with caution.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => {
                    signOut();
                    window.localStorage.removeItem("app-cache");
                    navigate("/");
                  }}
                  className={cn(
                    buttonVariants({
                      variant: "destructive",
                    })
                  )}
                >
                  Sign Out
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </div>
  );
};

export default Nav;
