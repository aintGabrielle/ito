import { zodResolver } from "@hookform/resolvers/zod";
import { PlusCircleIcon } from "lucide-react";
import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import useWorkouts from "@/hooks/use-workouts";

// Schema validation
const formSchema = z.object({
  exercise: z.string().min(1, "Activity name is required"),
  duration: z
    .string()
    .min(1, "Duration must be at least 1 minute")
    .regex(/^\d+$/, "Duration must be a number"), // Ensure it's a number
});

const AddActivityModal = ({ triggerComponent, assessment }) => {
  const { addWorkout } = useWorkouts();
  const [isAddingWorkout, setIsAddingWorkout] = useState(false);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      exercise: "",
      duration: "",
    },
  });

  // Watch the duration input
  const duration = useWatch({
    control: form.control,
    name: "duration",
  });

  // Get weight from assessment (default to 70kg)
  const weight = assessment?.weight || 70;

  // Convert minutes to hours before calculation
  const durationInHours = duration ? Number.parseInt(duration, 10) / 60 : 0;
  const calculatedCalories = 4.5 * weight * durationInHours;

  const onSubmit = async (data) => {
    toast.promise(
      addWorkout?.({
        exercise: data.exercise,
        duration: Number.parseInt(data.duration, 10),
        date: new Date(),
        calories_burned: calculatedCalories,
      }),
      {
        loading: "Adding activity...",
        success: () => {
          setIsAddingWorkout(false);
          form.reset();
          return "Activity added successfully";
        },
        error: "Failed to add activity",
      }
    );
  };

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

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-4 mt-5"
          >
            {/* Activity Name */}
            <FormField
              control={form.control}
              name="exercise"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Activity Name</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter exercise name" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Duration */}
            <FormField
              control={form.control}
              name="duration"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Duration (in minutes)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      placeholder="Enter duration"
                      onChange={(e) => field.onChange(e.target.value)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Calories Burned (Readonly) */}
            <FormItem>
              <FormLabel>Calories burned (kcal)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  readOnly
                  placeholder="Waiting for duration input..."
                  value={calculatedCalories.toFixed(2)}
                />
              </FormControl>
            </FormItem>

            {/* Buttons */}
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
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddActivityModal;
