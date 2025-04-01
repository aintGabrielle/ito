import { supabase } from "@/supabaseClient";
import useSWR from "swr";
import useCurrentUser from "./use-current-user";

const useWorkoutLogs = () => {
	const { user } = useCurrentUser();

	const fetchWorkoutLogs = async () => {
		if (!user) return;

		const { data, error } = await supabase
			.from("workout_logs")
			.select("*")
			.eq("user_id", user.id)
			.order("workout_date", { ascending: true });

		if (error) {
			console.error("Error fetching workout logs:", error.message);
		}

		return data;
	};

	return useSWR("workout_logs", fetchWorkoutLogs);
};

export default useWorkoutLogs;
