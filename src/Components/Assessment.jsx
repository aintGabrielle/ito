import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom"; // Import navigation
import { createClient } from "@supabase/supabase-js";
import { motion } from "framer-motion";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

export default function FitnessAssessment() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();
  const [message, setMessage] = useState(null);
  const [userId, setUserId] = useState(null);
  const navigate = useNavigate(); // Navigation hook

  useEffect(() => {
    const getUser = async () => {
      const { data: user, error } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.user?.id);
      } else {
        console.error("Error fetching user:", error);
      }
    };
    getUser();
  }, []);

  const onSubmit = async (data) => {
    if (!userId) {
      setMessage("Error: User not authenticated.");
      return;
    }

    console.log("Submitting data:", { ...data, user_id: userId });

    const { error } = await supabase
      .from("fitness_assessments")
      .insert([{ ...data, user_id: userId }]);

    if (error) {
      console.error("Supabase Error:", error.message);
      setMessage("Error saving data. Try again.");
    } else {
      setMessage("Assessment saved successfully! Redirecting...");
      setTimeout(() => {
        navigate("/dashboard"); // Redirect after 2 seconds
      }, 2000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-600 via-purple-500 to-pink-500 flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-4xl w-full bg-white shadow-lg rounded-xl p-8"
      >
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
          🏋️‍♂️ Fitness & Diet Assessment
        </h2>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {/* Height */}
          <div>
            <label className="block text-lg font-semibold">Height (cm)</label>
            <input
              type="number"
              {...register("height", { required: true })}
              className="w-full p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-pink-500"
            />
            {errors.height && <p className="text-red-500 text-sm">Required</p>}
          </div>

          {/* Current Weight */}
          <div>
            <label className="block text-lg font-semibold">
              Current Weight (kg)
            </label>
            <input
              type="number"
              {...register("currentWeight", { required: true })}
              className="w-full p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-pink-500"
            />
            {errors.currentWeight && (
              <p className="text-red-500 text-sm">Required</p>
            )}
          </div>

          {/* Goal */}
          <div>
            <label className="block text-lg font-semibold">
              What is Your Goal?
            </label>
            <select
              {...register("goal", { required: true })}
              className="w-full p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-pink-500"
            >
              <option value="">Select goal</option>
              <option value="lose_weight">Lose Weight</option>
              <option value="maintain_weight">Maintain Weight</option>
              <option value="gain_muscle">Gain Muscle</option>
            </select>
            {errors.goal && <p className="text-red-500 text-sm">Required</p>}
          </div>

          {/* Workout Level */}
          <div>
            <label className="block text-lg font-semibold">
              Preferred Workout Level
            </label>
            <select
              {...register("workoutLevel", { required: true })}
              className="w-full p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-pink-500"
            >
              <option value="">Select level</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
            {errors.workoutLevel && (
              <p className="text-red-500 text-sm">Required</p>
            )}
          </div>

          {/* Focus Muscle */}
          <div>
            <label className="block text-lg font-semibold">
              Preferred Muscle Focus
            </label>
            <select
              {...register("focusMuscle", { required: true })}
              className="w-full p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-pink-500"
            >
              <option value="">Select muscle group</option>
              <option value="full_body">Full Body</option>
              <option value="upper_body">Upper Body</option>
              <option value="lower_body">Lower Body</option>
              <option value="core">Core & Abs</option>
            </select>
            {errors.focusMuscle && (
              <p className="text-red-500 text-sm">Required</p>
            )}
          </div>

          {/* Exercise Type */}
          <div>
            <label className="block text-lg font-semibold">
              Preferred Type of Exercise
            </label>
            <select
              {...register("exerciseType", { required: true })}
              className="w-full p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-pink-500"
            >
              <option value="">Select exercise type</option>
              <option value="strength">Strength Training</option>
              <option value="cardio">Cardio</option>
              <option value="yoga">Yoga & Flexibility</option>
              <option value="mixed">Mixed Training</option>
            </select>
            {errors.exerciseType && (
              <p className="text-red-500 text-sm">Required</p>
            )}
          </div>

          {/* Daily Walking */}
          <div>
            <label className="block text-lg font-semibold">
              How Long Do You Walk Daily? (Minutes)
            </label>
            <input
              type="number"
              {...register("dailyWalking", { required: true })}
              className="w-full p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-pink-500"
            />
          </div>

          {/* Push-ups */}
          <div>
            <label className="block text-lg font-semibold">
              How Many Push-ups Can You Do?
            </label>
            <input
              type="number"
              {...register("pushups", { required: true })}
              className="w-full p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-pink-500"
            />
          </div>

          {/* Submit Button */}
          <motion.button
            type="submit"
            whileTap={{ scale: 0.95 }}
            whileHover={{ scale: 1.05 }}
            disabled={isSubmitting}
            className="md:col-span-2 w-full bg-gradient-to-r from-red-500 to-pink-500 text-white p-3 rounded-lg font-bold text-lg shadow-md hover:shadow-xl transition-all"
          >
            {isSubmitting ? "Submitting..." : "🚀 Submit"}
          </motion.button>
        </form>

        {message && (
          <p className="text-center text-green-600 mt-4">{message}</p>
        )}
      </motion.div>
    </div>
  );
}
