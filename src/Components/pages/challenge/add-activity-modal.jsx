import { Button } from "@/Components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/Components/ui/dialog";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import useWorkouts from "@/hooks/use-workouts";
import { PlusCircleIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const AddActivityModal = ({ triggerComponent }) => {
  const { addWorkout } = useWorkouts();
  const [isAddingWorkout, setIsAddingWorkout] = useState(false);

  return (
    <Dialog open={isAddingWorkout} onOpenChange={setIsAddingWorkout}>
      <DialogTrigger asChild>
        {triggerComponent || (
          <Button variant="outline">
            <span>Add Activity</span>
            <PlusCircleIcon />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Activity</DialogTitle>
        </DialogHeader>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.currentTarget);
            const data = Object.fromEntries(formData);

            console.log(data);
            toast.promise(
              addWorkout?.({
                exercise: data.exercise,
                duration: Number.parseInt(data.duration),
                date: new Date(),
                calories_burned: Number.parseInt(data.calories_burned),
              }),
              {
                loading: "Adding activity",
                success: () => {
                  setIsAddingWorkout(false);
                  return "Activity added successfully";
                },
                error: "Failed to add activity",
              }
            );
          }}
          className="flex flex-col gap-4 mt-5"
        >
          <Label className="flex flex-col gap-2">
            <span>Activity Name</span>
            <Input name="exercise" placeholder="Enter exercise name" />
          </Label>
          <Label className="flex flex-col gap-2">
            <span>Duration (in minutes)</span>
            <Input
              type="number"
              name="duration"
              placeholder="Enter duration"
              className="w-full"
            />
          </Label>
          <Label className="flex flex-col gap-2">
            <span>Calories burned (kcal)</span>
            <Input
              type="number"
              name="calories_burned"
              placeholder="Enter calories"
              className="w-full"
            />
          </Label>
          <div className="flex gap-2 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsAddingWorkout(false)}
            >
              Cancel
            </Button>
            <Button type="submit">Add</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddActivityModal;
