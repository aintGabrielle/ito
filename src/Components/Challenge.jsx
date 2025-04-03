import useWorkouts from "@/hooks/use-workouts";
import { cn } from "@/lib/utils";
import "chart.js/auto";
import {
  BicepsFlexedIcon,
  ChartNoAxesCombinedIcon,
  Clock4Icon,
  Edit2Icon,
  TrashIcon,
} from "lucide-react";
import { useState } from "react";
import "react-calendar/dist/Calendar.css";
import { Line } from "react-chartjs-2";
import { toast } from "sonner";
import Nav from "./Nav";
import AddActivityModal from "./pages/challenge/add-activity-modal";
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
import { Button, buttonVariants } from "./ui/button";
import { CalendarFull } from "./ui/calendar-full";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import FloatingChatbot from "./ui/floating-chatbot";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { ScrollArea } from "./ui/scroll-area";

const ActivityCard = ({ workout }) => {
  const { deleteWorkout, updateWorkout } = useWorkouts();
  const [isEditOpen, setIsEditOpen] = useState(false);

  return (
    <li
      key={workout?.id || Math.random()}
      className="flex justify-between items-center p-2 border-b"
    >
      <div>
        <p className="font-semibold">
          {workout?.exercise || "Unknown Exercise"}
        </p>
        <div className="flex gap-4">
          <div className="flex gap-1 items-center text-gray-500">
            <Clock4Icon size={20} />
            {workout?.duration || 0} mins
          </div>
          <div className="flex gap-1 items-center text-gray-500">
            <BicepsFlexedIcon size={20} />
            {workout?.calories_burned || 0} kcal
          </div>
        </div>
      </div>
      <div className="flex gap-2">
        <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
          <DialogTrigger asChild>
            <Button size="icon" variant="outline">
              <Edit2Icon />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Activity</DialogTitle>
            </DialogHeader>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const data = Object.fromEntries(formData);

                toast.promise(updateWorkout?.(workout.id, data), {
                  loading: "Updating activity",
                  success: () => {
                    setIsEditOpen(false);
                    return "Activity updated successfully";
                  },
                  error: "Failed to update activity",
                });
              }}
              className="flex flex-col gap-4 mt-5"
            >
              <Label className="flex flex-col gap-2">
                <span>Activity Name</span>
                <Input name="exercise" defaultValue={workout?.exercise} />
              </Label>
              <Label className="flex flex-col gap-2">
                <span>Duration (in minutes)</span>
                <Input
                  type="number"
                  name="duration"
                  defaultValue={workout?.duration}
                  className="w-full"
                />
              </Label>
              <Label className="flex flex-col gap-2">
                <span>Calories Burned</span>
                <Input
                  type="number"
                  name="calories_burned"
                  defaultValue={workout?.calories_burned}
                  className="w-full"
                />
              </Label>
              <Button type="submit">Confirm Edit</Button>
            </form>
          </DialogContent>
        </Dialog>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button size="icon" variant="destructive">
              <TrashIcon />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                Do you want to remove this activity?
              </AlertDialogTitle>
              <AlertDialogDescription>
                This action is irreversible. Please proceed with caution.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                className={cn(buttonVariants({ variant: "destructive" }))}
                onClick={() => {
                  toast.promise(deleteWorkout?.(workout.id), {
                    loading: "Removing activity",
                    success: "Activity removed successfully",
                    error: "Failed to remove activity",
                  });
                }}
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </li>
  );
};

const ChallengeManager = () => {
  const { workouts } = useWorkouts() || {};
  const [date, setDate] = useState(new Date());

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
          <div className="flex flex-1 gap-4 items-center mb-10">
            <ChartNoAxesCombinedIcon size={40} />
            <h3>Workout Tracker</h3>
          </div>
          <div className="flex flex-col flex-1 gap-4 lg:flex-row">
            <div className="flex-1">
              <CalendarFull selectedDate={date} onDateSelect={setDate} />
            </div>
            <div className="flex flex-col flex-1 gap-4">
              {/* <Card>
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
              </Card> */}
              <Card>
                <CardHeader className="flex flex-row justify-between items-center">
                  <CardTitle>Tracked Workouts</CardTitle>
                  <AddActivityModal />
                </CardHeader>
                <CardContent>
                  {workouts.length === 0 ? (
                    <p className="text-gray-500">No workouts logged yet.</p>
                  ) : (
                    <ul>
                      {workouts.map((workout) => (
                        <ActivityCard
                          key={workout?.id || Math.random()}
                          workout={workout}
                        />
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
