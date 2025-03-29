import useSWR from "swr";
import { supabase } from "@/supabaseClient";
import useCurrentUser from "./use-current-user";

const fetchWorkouts = async (userId) => {
	if (!userId) return [];
	const { data, error } = await supabase
		.from("workout_tracker")
		.select("*")
		.eq("user_id", userId)
		.order("date", { ascending: true });

	if (error) throw error;
	return data || [];
};

const useWorkouts = () => {
	const { user } = useCurrentUser();
	const { data: workouts, mutate } = useSWR(
		user ? ["workout_tracker", user.id] : null,
		() => fetchWorkouts(user.id),
	);

	const addWorkout = async (workout) => {
		if (!user) return;
		await supabase
			.from("workout_tracker")
			.insert([{ ...workout, user_id: user.id }]);
		mutate();
	};

	const updateWorkout = async (id, updatedWorkout) => {
		if (!user) return;
		await supabase.from("workout_tracker").update(updatedWorkout).eq("id", id);
		mutate();
	};

	const deleteWorkout = async (id) => {
		if (!user) return;
		await supabase.from("workout_tracker").delete().eq("id", id);
		mutate();
	};

	return { workouts, addWorkout, updateWorkout, deleteWorkout };
};

export default useWorkouts;
