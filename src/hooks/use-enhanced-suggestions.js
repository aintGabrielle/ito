import useSWR from "swr";
import { useState } from "react";
import axios from "axios";
import { supabase } from "@/supabaseClient";

const API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

const fetcher = async (userId) => {
	if (!userId) return [];

	const { data: assessments, error } = await supabase
		.from("fitness_assessments")
		.select("*")
		.eq("user_id", userId)
		.limit(1)
		.single();

	if (error || !assessments) {
		console.error("Error fetching assessment:", error);
		throw new Error("Failed to fetch assessment.");
	}

	const prompt = `Based on this fitness assessment data:\n\n${JSON.stringify(
		assessments,
	)}\n\nGenerate 20 personalized workout suggestions and 20 personalized diet suggestions.\n\nFor each item, return:\n- title (string)\n- description (1–2 sentences)\n- type: either "workout" or "diet"\n\nRespond in JSON format as an array.`;

	try {
		const res = await axios.post(
			"https://api.openai.com/v1/chat/completions",
			{
				model: "gpt-3.5-turbo",
				messages: [
					{
						role: "system",
						content: "You are a helpful AI fitness assistant.",
					},
					{ role: "user", content: prompt },
				],
				temperature: 0.7,
			},
			{
				headers: {
					Authorization: `Bearer ${API_KEY}`,
					"Content-Type": "application/json",
				},
			},
		);

		const text = res.data.choices[0].message.content;

		const jsonStart = text.indexOf("[");
		const jsonEnd = text.lastIndexOf("]") + 1;
		if (jsonStart === -1 || jsonEnd === -1)
			throw new Error("Invalid AI response format.");

		return JSON.parse(text.substring(jsonStart, jsonEnd));
	} catch (err) {
		console.error("OpenAI Error:", err);
		throw new Error("AI-generated suggestions failed.");
	}
};

const useEnhancedSuggestions = () => {
	const [selectedCard, setSelectedCard] = useState(null);

	const { data: session } = useSWR("user_session", async () => {
		const { data, error } = await supabase.auth.getUser();
		if (error) return null;
		return data?.user;
	});

	const { data: cards = [], error } = useSWR(
		session?.id ? ["enhanced_suggestions", session.id] : null,
		() => fetcher(session.id),
	);

	const getImageURL = (item) => {
		const keywordMap = {
			HIIT: "hiit",
			"Strength Training Circuit": "strength training",
			Yoga: "yoga",
			Swimming: "swimming",
			Cycling: "cycling",
			Running: "running",
			Jogging: "jogging",
			"Outdoor Jogging": "jogging outdoor",
			"Bodyweight Exercises": "bodyweight workout",
			"Interval Running": "interval running",
			"Resistance Band Training": "resistance band",
			"Core Strengthening": "core exercise",
			"Upper Body Split": "upper body workout",
			"Full Body Workout": "full body training",
		};

		const keyword =
			keywordMap[item.title] ||
			item.title.split(" ").slice(0, 2).join(" ").toLowerCase() ||
			"fitness";

		return `https://source.unsplash.com/random/800x600/?${item.type},${keyword}`;
	};

	return {
		cards,
		loading: !cards && !error,
		selectedCard,
		setSelectedCard,
		getImageURL,
	};
};

export default useEnhancedSuggestions;
