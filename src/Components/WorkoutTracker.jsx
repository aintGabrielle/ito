import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import useUser from "../hooks/useUser";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Line } from "react-chartjs-2";
import "chart.js/auto";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { motion } from "framer-motion";

const WorkoutTracker = () => {
  const { user } = useUser();
  const [date, setDate] = useState(new Date());
  const [exercise, setExercise] = useState("");
  const [duration, setDuration] = useState("");
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) fetchWorkouts();
  }, [user, date]);

  const fetchWorkouts = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from("workout_tracker")
      .select("*")
      .eq("user_id", user.id)
      .order("date", { ascending: true });

    if (error) console.error("Error fetching workouts:", error);
    else setWorkouts(data);
  };

  const handleAddWorkout = async () => {
    if (!exercise || !duration) return alert("Fill all fields!");

    setLoading(true);
    const { data, error } = await supabase
      .from("workout_tracker")
      .insert([
        { user_id: user.id, date, exercise, duration: parseInt(duration) },
      ]);

    if (error) {
      console.error("Error adding workout:", error);
    } else {
      setExercise("");
      setDuration("");
      fetchWorkouts();
    }
    setLoading(false);
  };

  const handleUpdateWorkout = async (id, updatedExercise, updatedDuration) => {
    setLoading(true);
    const { error } = await supabase
      .from("workout_tracker")
      .update({
        exercise: updatedExercise,
        duration: parseInt(updatedDuration),
      })
      .eq("id", id)
      .eq("user_id", user.id);

    if (error) {
      console.error("Error updating workout:", error);
    } else {
      fetchWorkouts();
    }
    setLoading(false);
  };

  const handleDeleteWorkout = async (id) => {
    setLoading(true);
    const { error } = await supabase
      .from("workout_tracker")
      .delete()
      .eq("id", id)
      .eq("user_id", user.id);

    if (error) {
      console.error("Error deleting workout:", error);
    } else {
      fetchWorkouts();
    }
    setLoading(false);
  };

  const workoutGraphData = {
    labels: workouts.map((workout) => workout.date),
    datasets: [
      {
        label: "Workout Duration (mins)",
        data: workouts.map((workout) => workout.duration),
        borderColor: "rgb(75, 192, 192)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        tension: 0.4,
      },
    ],
  };

  return (
    <div className="flex flex-col md:flex-row items-start justify-center min-h-screen bg-green-400 p-6 gap-6">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-2xl font-bold text-green-800 mb-4 text-center">
          📅 Workout Tracker
        </h2>
      </motion.div>

      {/* Left Section: Calendar & Add Workout Form */}
      <div className="flex flex-col gap-6 w-full md:w-1/3">
        {/* Calendar */}
        <Card className="p-4">
          <Calendar value={date} onChange={setDate} />
        </Card>

        {/* Add Workout Form */}
        <Card className="p-4">
          <h3 className="text-lg font-bold mb-2">📝 Log Your Workout</h3>
          <Input
            value={exercise}
            onChange={(e) => setExercise(e.target.value)}
            placeholder="Exercise Name"
          />
          <Input
            type="number"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            placeholder="Duration (minutes)"
          />
          <Button
            onClick={handleAddWorkout}
            disabled={loading}
            className="mt-2 w-full"
          >
            {loading ? "Saving..." : "Add Workout"}
          </Button>
        </Card>
      </div>

      {/* Middle Section: Workout List */}
      <div className="w-full md:w-1/3">
        <Card className="p-4">
          <h3 className="text-lg font-bold mb-2">📌 Tracked Workouts</h3>
          {workouts.length === 0 ? (
            <p className="text-gray-500">No workouts logged yet.</p>
          ) : (
            <ul>
              {workouts.map((workout) => (
                <li
                  key={workout.id}
                  className="flex justify-between items-center p-2 border-b"
                >
                  <div>
                    <p className="font-semibold">{workout.exercise}</p>
                    <p className="text-gray-500">{workout.duration} mins</p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={() =>
                        handleUpdateWorkout(
                          workout.id,
                          prompt("Update Exercise", workout.exercise),
                          prompt("Update Duration", workout.duration)
                        )
                      }
                    >
                      ✏️ Edit
                    </Button>
                    <Button
                      onClick={() => handleDeleteWorkout(workout.id)}
                      className="bg-red-500 hover:bg-red-600"
                    >
                      ❌ Delete
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>

      {/* Right Section: Workout Graph */}
      <div className="w-full md:w-1/3">
        <Card className="p-4">
          <h3 className="text-lg font-bold mb-2">📊 Progress Chart</h3>
          {workouts.length > 0 ? (
            <Line data={workoutGraphData} />
          ) : (
            <p className="text-gray-500">No data available.</p>
          )}
        </Card>
      </div>
    </div>
  );
};

export default WorkoutTracker;
