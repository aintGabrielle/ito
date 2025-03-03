import React from "react";
import { UserAuth } from "../Context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import useUser from "../hooks/useUser";
import { useState } from "react";
import { supabase } from "../supabaseClient";
import AddStatistics from "./AddStatistics";
import UserStatistics from "./UserStatistics";
import UpdateStatistics from "./UpdateStatistics";
import { useEffect } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/alert-dialog";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";
import StartedWorkout from "./StartedWorkout";

const Dashboard = () => {
  const { session, signOut } = UserAuth();
  const { user } = useUser();
  const [statistics, setStatistics] = useState([]);
  const navigate = useNavigate();

  const cardData = [
    {
      image: "/src/images/challenges/running.jpg",
      title: "Walking Activity",
      description:
        "Your Fitness Activity is near complete, you have a very brave mentality and wise decision making",
      progress: 88,
    },
    {
      image: "/src/images/challenges/walking.jpg",
      title: "Walking Activity",
      description: "Your Fitness Activity is half way complete, keep it up!",
      progress: 55,
    },
    {
      image: "/src/images/challenges/pushup.png",
      title: "Pushup Activity",
      description: "Your Fitness Activity is completed!, well done brave!",
      progress: 100,
    },
    {
      image: "/src/images/challenges/squat.png",
      title: "Squat Activity",
      description:
        "You started Fitness Activity, we are rooting for your journey!",
      progress: 1,
    },
  ];
  const data = [
    {
      title: "Weight",
      value: 230,
    },
    {
      title: "Height",
      value: 80,
    },
    {
      title: "Total Running in Kilometer",
      value: "0KM",
    },
    {
      title: "Protein Intake",
      value: "87 kg",
      description: "To insert your latest weight, go to Profile -> Weight",
    },
  ];

  useEffect(() => {
    const fetchUserStatistics = async () => {
      if (!user) return;

      const { data, error } = await supabase
        .from("statistics")
        .select("*")
        .eq("user_id", user.id);

      if (error) console.error(error);
      else setStatistics(data);
    };

    fetchUserStatistics();
  }, [user]);

  const handleSignOut = async (e) => {
    e.preventDefault();
    try {
      await signOut();
      navigate("/");
    } catch (err) {
      console.error(err);
    }
  };
  return (
    <div>
      <div className="flex justify-around items-center py-5">
        <div className="flex items-center gap-2">
          <img src="/src/images/logo.png" className="w-16" alt="" />
          <h1 className="font-bold italic text-2xl text-green-400">
            FitMission
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <Link to={"/dashboard"}>Dashboard</Link>
          <Link to={"/challenge"}>Challenge</Link>
          <Link to={"/activity"}>Activity</Link>
          <Link to={"/chatbot"}>AI</Link>
          <Link to={"/profile"}>Profile</Link>
          <h2 className="inline-flex gap-2 items-center">
            Welcome,{" "}
            {statistics.length > 0 ? (
              statistics.map((stat) => (
                <span className="text-2xl" key={stat.id}>
                  {stat.first_name}
                </span>
              ))
            ) : (
              <p>Loading...</p>
            )}
          </h2>
        </div>
      </div>
      <div className="max-w-5xl mx-auto">
        <div className="mb-8 px-3 flex flex-col gap-3">
          <h3 className="text-4xl font-bold text-primary/60">STATISTICS</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {statistics.map((item, index) => (
              <div
                key={index + 1}
                className="hover:scale-105 duration-500 transition-transform ease-out cursor-pointer bg-violet-500 p-5 rounded-2xl shadow-2xl shadow-primary/50"
              >
                <div className="flex items-center gap-3 justify-between mb-2">
                  <h2 className="text-2xl font-semibold text-white">
                    Weight: {item.weight} kg
                  </h2>
                  <p className="text-lg font-semibold text-yellow-400">
                    {item.value}
                  </p>
                </div>
                <p className="italic text-gray-400">{item.description}</p>
              </div>
            ))}
            {statistics.map((item, index) => (
              <div
                key={index + 1}
                className="hover:scale-105 duration-500 transition-transform ease-out cursor-pointer bg-violet-500 p-5 rounded-2xl shadow-2xl shadow-primary/50"
              >
                <div className="flex items-center gap-3 justify-between mb-2">
                  <h2 className="text-2xl font-semibold text-white">
                    Height: {item.height} cm
                  </h2>
                  <p className="text-lg font-semibold text-yellow-400">
                    {item.value}
                  </p>
                </div>
                <p className="italic text-gray-400">{item.description}</p>
              </div>
            ))}
            {statistics.map((item, index) => (
              <div
                key={index + 1}
                className="hover:scale-105 duration-500 transition-transform ease-out cursor-pointer bg-violet-500 p-5 rounded-2xl shadow-2xl shadow-primary/50"
              >
                <div className="flex items-center gap-3 justify-between mb-2">
                  <h2 className="text-2xl font-semibold text-white">
                    Protein Intake: {item.protein_intake} g
                  </h2>
                  <p className="text-lg font-semibold text-yellow-400">
                    {item.value}
                  </p>
                </div>
                <p className="italic text-gray-400">{item.description}</p>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-3 px-3">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button>START TRACKING</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogTitle>START TRACKING</AlertDialogTitle>
                <AlertDialogDescription>
                  <img src="/src/images/map.png" className="w-full" alt="" />
                </AlertDialogDescription>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction>Continue</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
        <StartedWorkout />
        {/* <UserStatistics /> */}
      </div>
    </div>
  );
};

export default Dashboard;
