import React, { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import useUser from "../hooks/useUser";
import { Link, useNavigate } from "react-router-dom";

import { Card, CardHeader, CardTitle, CardDescription } from "./ui/card";
import { Button } from "./ui/button";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

const StartedWorkout = () => {
  const { user } = useUser();
  const [workout, setWorkout] = useState(null);

  useEffect(() => {
    const fetchWorkout = async () => {
      if (!user) return;

      const { data, error } = await supabase
        .from("workout_sessions")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

      if (error) {
        console.error("Error fetching workout:", error);
        return;
      }

      setWorkout(data);
    };

    fetchWorkout();
  }, [user]);

  if (!workout) {
    return <p className="text-center text-xl">No workout started yet.</p>;
  }

  return (
    <div className="flex flex-col items-center p-6">
      <Card className="max-w-lg p-6">
        <CardHeader>
          <CardTitle className="text-3xl font-semibold uppercase">
            {workout.workout_title}
          </CardTitle>
          <CardDescription className="text-black/60">
            {workout.workout_description}
          </CardDescription>
        </CardHeader>
        <img
          src={`/src/images/challenges/${workout.workout_title
            .toLowerCase()
            .replace(/\s+/g, "")}.jpg`}
          className="w-full h-64 object-cover rounded-xl"
          alt={workout.workout_title}
        />
        <Button className="mt-4 w-full">
          <Link to={"/activity"}>DONE</Link>
        </Button>
      </Card>
    </div>
  );
};

export default StartedWorkout;
