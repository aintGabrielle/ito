import { supabase } from "@/supabaseClient";
import { useState } from "react";
import useSWR, { mutate, useSWRConfig } from "swr";
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
  const { mutate: globalMutate } = useSWRConfig();
  const [loading, setLoading] = useState(false);
  const { data: assessment, error } = useSWR(
    user ? ["fitness_assessments", user.id] : null,
    () => fetcher(user.id)
  );

  const createAssessment = async (values) => {
    if (!user) return;
    setLoading(true);

    const { data, error } = await supabase
      .from("fitness_assessments")
      .insert([{ ...values, user_id: user.id }])
      .select("*")
      .single();

    if (!error) {
      globalMutate(["fitness_assessments", user.id]);
    } else {
      console.error("Error creating fitness assessment:", error);
    }

    setLoading(false);
    return data;
  };

  const updateAssessment = async (updatedValues) => {
    if (!user) return;
    setLoading(true);

    const { data, error } = await supabase
      .from("fitness_assessments")
      .update(updatedValues)
      .eq("user_id", user.id);

    console.log(assessment);

    if (!error) {
      mutate(["fitness_assessments", user.id]);
    } else {
      console.error("Error updating fitness assessment:", error);
    }

    setLoading(false);
    return assessment;
  };

  return { assessment, loading, error, updateAssessment, createAssessment };
};

export default useProfile;
