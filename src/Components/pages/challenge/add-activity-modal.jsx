import { useState } from "react";
import { toast } from "sonner";
import useWorkouts from "@/hooks/use-workouts";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/Components/ui/dialog";
import { Button } from "@/Components/ui/button";
import { PlusCircleIcon } from "lucide-react";
import { Label } from "@/Components/ui/label";
import { Input } from "@/Components/ui/input";

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
            toast.promise(
              addWorkout?.({
                exercise: data.exercise,
                duration: parseInt(data.duration),
                date: new Date(),
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
