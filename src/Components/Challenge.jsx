import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { ScrollArea } from "./ui/scroll-area";
import {
  ChartNoAxesCombinedIcon,
  Edit2Icon,
  EditIcon,
  PenIcon,
  TrashIcon,
} from "lucide-react";
import { Line } from "react-chartjs-2";
import "chart.js/auto";
import "react-calendar/dist/Calendar.css";
import { CalendarFull } from "./ui/calendar-full";
import FloatingChatbot from "./ui/floating-chatbot";
import Nav from "./Nav";
import useWorkouts from "@/hooks/use-workouts";

const ChallengeManager = () => {
  const {
    workouts = [],
    addWorkout,
    updateWorkout,
    deleteWorkout,
  } = useWorkouts() || {};
  const [date, setDate] = useState(new Date());
  const [exercise, setExercise] = useState("");
  const [duration, setDuration] = useState("");

  const handleAddWorkout = () => {
    if (!exercise || !duration) return alert("Fill all fields!");
    addWorkout?.({ date, exercise, duration: parseInt(duration) });
    setExercise("");
    setDuration("");
  };

  const workoutGraphData = {
    labels: workouts.map((workout) => workout?.date || "Unknown Date"),
    datasets: [
      {
        label: "Workout Duration (mins)",
        data: workouts.map((workout) => workout?.duration || 0),
        borderColor: "rgb(75, 192, 192)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        tension: 0.4,
      },
    ],
  };

  return (
    <div className="flex overflow-hidden h-full">
      <Nav />
      <ScrollArea className="flex-1 h-screen">
        <div className="flex flex-col flex-1 gap-2 p-5 pt-20 mx-auto w-full md:pt-5">
          <div className="flex gap-4 items-center mb-10">
            <ChartNoAxesCombinedIcon size={40} />
            <h3>Workout Tracker</h3>
          </div>
          <div className="flex flex-col gap-4 md:flex-row">
            <div className="flex-1">
              <CalendarFull selectedDate={date} onDateSelect={setDate} />
            </div>
            <div className="flex flex-col flex-1 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Log Your Workout</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
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
                    <Button onClick={handleAddWorkout} className="w-full">
                      Add Workout
                    </Button>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Tracked Workouts</CardTitle>
                </CardHeader>
                <CardContent>
                  {workouts.length === 0 ? (
                    <p className="text-gray-500">No workouts logged yet.</p>
                  ) : (
                    <ul>
                      {workouts.map((workout) => (
                        <li
                          key={workout?.id || Math.random()}
                          className="flex justify-between items-center p-2 border-b"
                        >
                          <div>
                            <p className="font-semibold">
                              {workout?.exercise || "Unknown Exercise"}
                            </p>
                            <p className="text-gray-500">
                              {workout?.duration || 0} mins
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              onClick={() =>
                                updateWorkout?.(workout.id, {
                                  exercise:
                                    prompt(
                                      "Update Exercise",
                                      workout?.exercise
                                    ) || workout?.exercise,
                                  duration:
                                    prompt(
                                      "Update Duration",
                                      workout?.duration
                                    ) || workout?.duration,
                                })
                              }
                            >
                              <Edit2Icon />
                              Edit
                            </Button>
                            <Button
                              onClick={() => deleteWorkout?.(workout.id)}
                              variant="destructive"
                            >
                              <TrashIcon />
                              Delete
                            </Button>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Progress Chart</CardTitle>
                </CardHeader>
                <CardContent>
                  {workouts.length > 0 ? (
                    <Line data={workoutGraphData} />
                  ) : (
                    <p>No data available.</p>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
          <FloatingChatbot />
        </div>
      </ScrollArea>
    </div>
  );
};

export default ChallengeManager;
