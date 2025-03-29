import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import axios from "axios";
import useCurrentUser from "@/hooks/use-current-user";

const API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

const DietPlanCard = () => {
  const { user } = useCurrentUser();
  const [dietPlan, setDietPlan] = useState(null);
  const [workoutPlan, setWorkoutPlan] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFitnessAssessment = async () => {
      if (!user) return;

      const { data, error } = await supabase
        .from("fitness_assessments")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (error) {
        console.error("Error fetching fitness assessment:", error);
        setLoading(false);
      } else {
        generatePlans(data);
      }
    };

    const generatePlans = async (assessment) => {
      try {
        const response = await axios.post(
          "https://api.openai.com/v1/chat/completions",
          {
            model: "gpt-3.5-turbo",
            messages: [
              {
                role: "system",
                content: "You are a fitness and nutrition expert.",
              },
              {
                role: "user",
                content: `Based on this fitness assessment: ${JSON.stringify(
                  assessment
                )}, generate a JSON structured response like this:
                  \n\`\`\`json
                  {
                    "dietPlan": {
                      "Breakfast": ["Oatmeal with nuts", "Scrambled eggs with toast"],
                      "Lunch": ["Grilled chicken with quinoa", "Salad with avocado"],
                      "Snacks": ["Greek yogurt with honey", "Mixed nuts"],
                      "Dinner": ["Salmon with sweet potatoes", "Steamed broccoli"]
                    },
                    "workoutPlan": {
                      "Warm-up": ["5 min jogging", "Dynamic stretching"],
                      "Main Workout": ["3 sets squats", "3 sets push-ups", "Planks"],
                      "Cool-down": ["5-min walk", "Static stretching"]
                    }
                  }
                  \`\`\`
                  Make sure the response is a valid JSON block and nothing else.`,
              },
            ],
            temperature: 0.7,
          },
          {
            headers: {
              Authorization: `Bearer ${API_KEY.trim()}`,
              "Content-Type": "application/json",
            },
          }
        );

        // Extracting and parsing JSON from response
        const rawText = response.data.choices[0].message.content;
        const jsonText = rawText.match(/```json\n([\s\S]*?)\n```/);
        if (!jsonText)
          throw new Error("Invalid JSON format received from OpenAI");

        const parsedResult = JSON.parse(jsonText[1]); // Parse the extracted JSON

        setDietPlan(parsedResult.dietPlan);
        setWorkoutPlan(parsedResult.workoutPlan);
      } catch (error) {
        console.error(
          "Error generating plans:",
          error.response?.data || error.message
        );
        setDietPlan(null);
        setWorkoutPlan(null);
      }
      setLoading(false);
    };

    fetchFitnessAssessment();
  }, [user]);

  if (loading) {
    return (
      <p className="text-center text-gray-500">
        Generating your personalized plans...
      </p>
    );
  }

  if (!dietPlan && !workoutPlan) {
    return null;
  }

  return (
    <div className="flex overflow-hidden flex-col flex-grow p-4 w-full bg-white rounded-2xl border border-gray-300 shadow-lg">
      {/* Diet Plan Section */}
      <h2 className="text-lg font-bold text-green-800">
        🍽️ Suggested Diet Plan
      </h2>
      {dietPlan ? (
        <ul className="pl-5 list-disc text-gray-700">
          {Object.entries(dietPlan).map(([meal, items]) => (
            <li key={meal} className="mb-1">
              <strong>{meal}:</strong>
              <ul className="pl-5 list-disc">
                {items.map((item, index) => (
                  <li key={index} className="text-sm">
                    ✅ {item}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-gray-500">No diet plan available.</p>
      )}

      {/* Workout Plan Section */}
      <h2 className="mt-6 text-lg font-bold text-blue-800">
        🏋️ Suggested Workout Plan
      </h2>
      {workoutPlan ? (
        <ul className="pl-5 list-disc text-gray-700">
          {Object.entries(workoutPlan).map(([section, exercises]) => (
            <li key={section} className="mb-1">
              <strong>{section}:</strong>
              <ul className="pl-5 list-disc">
                {exercises.map((exercise, index) => (
                  <li key={index} className="text-sm">
                    💪 {exercise}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-gray-500">No workout plan available.</p>
      )}
    </div>
  );
};

export default DietPlanCard;
