import { supabase } from "@/supabaseClient";
import axios from "axios";
import useSWR, { mutate } from "swr";
import useCurrentUser from "./use-current-user";

const fetcher = async (userId) => {
	if (!userId) return [];
	const { data, error } = await supabase
		.from("chat_messages")
		.select("*")
		.eq("user_id", userId)
		.order("created_at", { ascending: true });

	if (error) throw error;
	return data || [];
};

const useChatbot = () => {
	const { user } = useCurrentUser();
	const {
		data: messages = [],
		isLoading,
		error,
	} = useSWR(
		user ? ["chat_messages", user.id] : null,
		() => fetcher(user.id),
		{ keepPreviousData: true }, // Prevents flickering
	);

	const sendMessage = async (userInput) => {
		if (!userInput.trim() || !user) return;

		const newUserMessage = { role: "user", message: userInput };
		mutate(
			["chat_messages", user.id],
			(prev = []) => [...prev, newUserMessage],
			false,
		);

		await supabase.from("chat_messages").insert({
			user_id: user.id,
			role: "user",
			message: userInput,
		});

		try {
			const res = await axios.post(
				"https://api.openai.com/v1/chat/completions",
				{
					model: "gpt-3.5-turbo",
					messages: [
						{
							role: "system",
							content:
								"You are a helpful AI that only discusses fitness and diets.",
						},
						{ role: "user", content: userInput },
					],
					temperature: 0.7,
				},
				{
					headers: {
						Authorization: `Bearer ${import.meta.VITE_OPENAI_API_KEY}`,
						"Content-Type": "application/json",
					},
				},
			);

			const botResponse = res.data.choices[0].message.message;
			const newBotMessage = { role: "bot", content: botResponse };

			await supabase.from("chat_messages").insert({
				user_id: user.id,
				role: "bot",
				message: botResponse,
			});

			mutate(
				["chat_messages", user.id],
				(prev = []) => [...prev, newUserMessage, newBotMessage],
				false,
			);
		} catch (error) {
			console.error("Chatbot request failed:", error);
		}
	};

	return { messages, loading: isLoading, error, sendMessage };
};

export default useChatbot;
