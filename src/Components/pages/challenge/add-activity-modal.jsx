import { zodResolver } from "@hookform/resolvers/zod";
import { PlusCircleIcon } from "lucide-react";
import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

import { Button } from "@/Components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/Components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/Components/ui/form";
import { Input } from "@/Components/ui/input";
import useWorkouts from "@/hooks/use-workouts";

// Schema validation
const formSchema = z.object({
  exercise: z.string().min(1, "Activity name is required"),
  duration: z
    .string()
    .min(1, "Duration is required")
    .regex(/^\d+$/, "Must be a number")
    .refine((val) => Number.parseInt(val, 10) > 0, {
      message: "Duration must be greater than 0",
    }),
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
    mode: "onChange",
  });

  const duration = useWatch({
    control: form.control,
    name: "duration",
  });

  const weight = assessment?.weight || 70;

  const durationInHours = duration ? Number.parseInt(duration, 10) / 60 : 0;
  const calculatedCalories = Number.parseFloat(
    (4.5 * weight * durationInHours).toFixed(2)
  );

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

            {form.getValues("exercise") && duration && (
              <div className="p-3 text-center bg-gray-50 rounded-md border border-gray-300">
                <p className="text-sm text-gray-700">
                  🔥 You burned{" "}
                  <span className="font-semibold text-black">
                    {calculatedCalories} kcal
                  </span>{" "}
                  by doing{" "}
                  <span className="font-semibold text-black">
                    {form.getValues("exercise")}
                  </span>{" "}
                  for{" "}
                  <span className="font-semibold text-black">
                    {duration} min
                  </span>
                </p>
              </div>
            )}

            <div className="flex gap-2 justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsAddingWorkout(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={!form.formState.isValid}>
                Add
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddActivityModal;
