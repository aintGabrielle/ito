import OpenAI from "openai";
import useSWR from "swr/immutable";
import useProfile from "./use-profile";

const API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

const openai = new OpenAI({
	apiKey: API_KEY,
	dangerouslyAllowBrowser: true,
});

const useAISuggestions = () => {
	const { assessment } = useProfile();

	// Fetch function for AI suggestions
	const fetchAISuggestions = async () => {
		const response = await openai.chat.completions.create({
			model: "gpt-4",
			messages: [
				{
					role: "system",
					content: `
            Provide 3 fitness and diet suggestions for a person based on their current assessment.
            ---
            User's Current Assessment:
            Weight: ${assessment.weight}
            Height: ${assessment.height}
            Activity Level: ${assessment.activityLevel}
            Goal: ${assessment.goal}
            Activity Goal Count: ${assessment.activity_goal_count}
            Calories burned Goal Count: ${assessment.calorie_goal_count}
            ---
            The suggestions should be in markdown format containing a #### and a description.
            Add 2 breaking lines (\n\n) after each suggestion.
            The output should be concise and should be in a single markdown message.
          `,
				},
			],
			max_tokens: 500,
			temperature: 0.7,
		});
		return response;
	};

	const {
		data: aiSuggestions,
		error,
		mutate,
		isLoading,
	} = useSWR(["aiSuggestions"], fetchAISuggestions);

	return { aiSuggestions, error, mutate, isLoading };
};

export default useAISuggestions;
