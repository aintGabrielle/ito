import { useEffect, useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { createClient } from "@supabase/supabase-js";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
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

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

const inputFields = ["height", "currentWeight", "dailyWalking", "pushups"];

const selectFields = [
  {
    label: "Goal",
    name: "goal",
    options: ["Lose Weight", "Maintain Weight", "Gain Muscle"],
  },
  {
    label: "Workout Level",
    name: "workoutLevel",
    options: ["Beginner", "Intermediate", "Advanced"],
  },
  {
    label: "Muscle Focus",
    name: "focusMuscle",
    options: ["Full Body", "Upper Body", "Lower Body", "Core & Abs"],
  },
  {
    label: "Exercise Type",
    name: "exerciseType",
    options: [
      "Strength Training",
      "Cardio",
      "Yoga & Flexibility",
      "Mixed Training",
    ],
  },
];

export default function FitnessAssessment() {
  const { user: currentUser } = useCurrentUser();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();
  const [message, setMessage] = useState(null);
  const navigate = useNavigate();

  const onSubmit = useCallback(
    async (data) => {
      if (!currentUser.id) {
        setMessage("Error: User not authenticated.");
        return;
      }

      const { error } = await supabase
        .from("fitness_assessments")
        .insert([{ ...data, user_id: currentUser.id }]);

      if (error) {
        console.error("Supabase Error:", error.message);
        setMessage("Error saving data. Try again.");
      } else {
        setMessage("Assessment saved successfully! Redirecting...");
        setTimeout(() => navigate("/dashboard"), 2000);
      }
    },
    [currentUser.id, navigate]
  );

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

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid grid-cols-1 gap-6 md:grid-cols-2"
        >
          {inputFields.map((name) => (
            <Input
              key={name}
              type="number"
              {...register(name, { required: true })}
              placeholder={name
                .replace(/([A-Z])/g, " $1")
                .replace(/^./, (s) => s.toUpperCase())}
              className="w-full"
            />
          ))}

          {selectFields.map(({ label, name, options }) => (
            <Select key={name} {...register(name, { required: true })}>
              <SelectTrigger>
                <SelectValue placeholder={label} />
              </SelectTrigger>
              <SelectContent>
                {options.map((option) => (
                  <SelectItem
                    key={option.toLowerCase()}
                    value={option.toLowerCase()}
                  >
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ))}

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full md:col-span-2"
          >
            {isSubmitting ? (
              "Submitting..."
            ) : (
              <>
                <UploadIcon />
                <span className="mr-2">Submit</span>
              </>
            )}
          </Button>
        </form>

        {message && <p className="mt-4 text-center">{message}</p>}
      </motion.div>
    </div>
  );
}
