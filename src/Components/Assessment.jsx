import { useEffect, useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { createClient } from "@supabase/supabase-js";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useCurrentUser from "@/hooks/use-current-user";
import { UploadIcon } from "lucide-react";
import useProfile from "@/hooks/use-profile";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/Components/ui/form";
import { toast } from "sonner";

const formSchema = z.object({
  goal: z.enum(["lose_weight", "maintain_weight", "gain_muscle"]),
  workoutLevel: z.enum(["beginner", "intermediate", "advanced"]),
  focusMuscle: z.enum(["full_body", "upper_body", "lower_body", "core"]),
  exerciseType: z.enum(["strength", "cardio", "yoga", "mixed"]),
});

export default function FitnessAssessment() {
  const { createAssessment } = useProfile();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    defaultValues: {
      goal: "lose_weight",
      workoutLevel: "beginner",
      focusMuscle: "core",
      exerciseType: "mixed",
    },
  });

  const navigate = useNavigate();

  const handleFormSubmit = async (data) => {
    setIsSubmitting(true);
    toast.promise(createAssessment(data), {
      loading: "Creating First Assessment",
      success: () => {
        setIsSubmitting(false);
        navigate("/dashboard");
        return "Assessment Created";
      },
      error: "Failed to submit assessment",
    });
  };

  return (
    <div className="flex justify-center items-center px-6 min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="p-8 w-full max-w-4xl rounded-xl shadow-lg bg-card"
      >
        <h2 className="mb-6 text-3xl font-bold text-center">
          Fitness & Diet Assessment
        </h2>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleFormSubmit)}
            className="grid grid-cols-2 gap-3"
          >
            <FormField
              control={form.control}
              name="goal"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Goal</FormLabel>
                  <Select
                    defaultValue={field.value}
                    onValueChange={field.onChange}
                    disabled={isSubmitting}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Goal" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="lose_weight">Lose Weight</SelectItem>
                      <SelectItem value="maintain_weight">
                        Maintain Weight
                      </SelectItem>
                      <SelectItem value="gain_muscle">Gain Muscle</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="workoutLevel"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Workout Level</FormLabel>
                  <Select
                    defaultValue={field.value}
                    onValueChange={field.onChange}
                    disabled={isSubmitting}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Goal" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="beginner">Beginner</SelectItem>
                      <SelectItem value="intermediate">Intermediate</SelectItem>
                      <SelectItem value="advanced">Advanced</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="focusMuscle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Focus Muscle</FormLabel>
                  <Select
                    defaultValue={field.value}
                    onValueChange={field.onChange}
                    disabled={isSubmitting}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Goal" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="full_body">full Body</SelectItem>
                      <SelectItem value="upper_body">Upper Body</SelectItem>
                      <SelectItem value="lower_body">Lower Body</SelectItem>
                      <SelectItem value="core">Core & Abs</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="exerciseType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Exercise Type</FormLabel>
                  <Select
                    defaultValue={field.value}
                    onValueChange={field.onChange}
                    disabled={isSubmitting}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Goal" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="strength">
                        Strength Training
                      </SelectItem>
                      <SelectItem value="cardio">Cardio</SelectItem>
                      <SelectItem value="yoga">Yoga & Flexibility</SelectItem>
                      <SelectItem value="mixed">Mixed Training</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              disabled={isSubmitting}
              type="submit"
              className="col-span-full"
            >
              Submit Assessment
            </Button>
          </form>
        </Form>
      </motion.div>
    </div>
  );
}
