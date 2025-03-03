import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createClient } from "@supabase/supabase-js";
import useUser from "../hooks/useUser";

import { Card, CardHeader, CardTitle, CardDescription } from "./ui/card";
import { Button } from "./ui/button";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogCancel,
  AlertDialogAction,
} from "./ui/alert-dialog";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

const workouts = [
  {
    image: "/src/assets/images/challenges/hipdip.jpg",
    title: "Hip Dip",
    description: "A core and oblique exercise where you move your hips side to side while holding a forearm plank position. This movement targets the obliques, glutes, and core, helping to improve stability, strength, and muscle definition in the midsection.",
  },
  {
    image: "/src/assets/images/challenges/updownplank.jpg",
    title: "Up Down Plank",
    description: "A dynamic core exercise that involves transitioning between a forearm plank and a full plank position. This movement targets the core, shoulders, and arms, improving strength, stability, and endurance. It also helps enhance coordination and engages multiple muscle groups for a full-body workout.",
  },
  {
    image: "/src/assets/images/challenges/jumpsquat.jpg",
    title: "Jump Squat",
    description: "A high-intensity plyometric exercise that combines squats with an explosive jump. This move helps to build strength, power, and endurance in the lower body, targeting the quads, hamstrings, glutes, and calves. Ideal for boosting athletic performance and improving overall fitness.",
  },
];

const Workout = () => {
  const [selectedWorkout, setSelectedWorkout] = useState(null);
  const navigate = useNavigate();
  const { user } = useUser(); // Get the logged-in user

  const handleStart = async (workout) => {
    if (!user) {
      alert("You must be logged in to start a workout.");
      return;
    }

    // Store workout in Supabase
    const { data, error } = await supabase.from("workout_sessions").insert([
      {
        user_id: user.id,
        workout_title: workout.title,
        workout_description: workout.description,
      },
    ]);

    if (error) {
      console.error("Error saving workout:", error);
      return;
    }

    // Navigate to the new page
    navigate("/started-workout");
  };

  return (
    <div className="flex flex-col gap-2">
      {workouts.map((item, index) => (
        <Card key={index} className="p-4">
          <CardHeader className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <CardTitle className="text-3xl font-semibold uppercase">
                {item.title}
              </CardTitle>
              <p className="text-black/60 font-sans capitalize">
                {item.description}
              </p>
            </div>
            <CardDescription>
              <img
                src={item.image}
                className="w-full h-64 object-cover rounded-xl"
                alt={item.title}
              />
            </CardDescription>
          </CardHeader>
          <Button className="w-full mt-2" onClick={() => handleStart(item)}>
            START
          </Button>
        </Card>
      ))}

      {/* AlertDialog for confirmation */}
      {selectedWorkout && (
        <AlertDialog
          open={!!selectedWorkout}
          onOpenChange={() => setSelectedWorkout(null)}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                Are you ready to start the{" "}
                <span className="uppercase font-bold text-primary">
                  {selectedWorkout.title}
                </span>{" "}
                Challenge?
              </AlertDialogTitle>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={() => handleStart(selectedWorkout)}>
                Continue
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  );
};

export default Workout;
