import useSWR, { mutate } from "swr";
import { useState } from "react";
import { supabase } from "@/supabaseClient";
import useCurrentUser from "./use-current-user";

const fetcher = async (userId) => {
	if (!userId) return null;
	const { data, error } = await supabase
		.from("fitness_assessments")
		.select("*")
		.eq("user_id", userId)
		.order("created_at", { ascending: false })
		.limit(1)
		.maybeSingle();
	if (error) throw error;
	return data || {};
};

const useProfile = () => {
	const { user } = useCurrentUser();
	const [loading, setLoading] = useState(false);
	const { data: assessment, error } = useSWR(
		user ? ["fitness_assessments", user.id] : null,
		() => fetcher(user.id),
	);

	const updateAssessment = async (updatedValues) => {
		if (!user) return;
		setLoading(true);

		const { data, error } = await supabase
			.from("fitness_assessments")
			.update(updatedValues)
			.eq("user_id", user.id);

		if (!error) {
			mutate(["fitness_assessments", user.id]);
		} else {
			console.error("Error updating fitness assessment:", error);
		}

		setLoading(false);
		return assessment;
	};

	return { assessment, loading, error, updateAssessment };
};

export default useProfile;
