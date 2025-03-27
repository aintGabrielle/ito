// components/dashboard/TodaysFocus.jsx
import React, { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";

const TodaysFocus = () => {
  const [focus, setFocus] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTodaysFocus();
  }, []);

  const fetchTodaysFocus = async () => {
    setLoading(true);
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) {
      const today = new Date().toISOString().split("T")[0];
      const { data, error } = await supabase
        .from("daily_focus")
        .select("focus_text")
        .eq("user_id", user.id)
        .eq("focus_date", today)
        .single();

      if (error && error.code !== "PGRST116") {
        console.error("Error fetching today's focus:", error);
      } else if (data) {
        setFocus(data.focus_text);
      }
    }
    setLoading(false);
  };

  const handleFocusChange = (event) => {
    setFocus(event.target.value);
  };

  const saveTodaysFocus = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user && focus.trim()) {
      const today = new Date().toISOString().split("T")[0];
      const { data: existingFocus, error: fetchError } = await supabase
        .from("daily_focus")
        .select("id")
        .eq("user_id", user.id)
        .eq("focus_date", today)
        .single();

      if (fetchError && fetchError.code !== "PGRST116") {
        console.error("Error checking existing focus:", fetchError);
        return;
      }

      if (existingFocus) {
        // Update existing focus
        const { error: updateError } = await supabase
          .from("daily_focus")
          .update({ focus_text: focus })
          .eq("id", existingFocus.id);

        if (updateError) {
          console.error("Error updating today's focus:", updateError);
        }
      } else {
        // Insert new focus
        const { error: insertError } = await supabase
          .from("daily_focus")
          .insert([{ user_id: user.id, focus_date: today, focus_text: focus }]);

        if (insertError) {
          console.error("Error saving today's focus:", insertError);
        }
      }
    } else if (user && !focus.trim()) {
      // Optionally delete focus if the input is cleared
      const today = new Date().toISOString().split("T")[0];
      const { error: deleteError } = await supabase
        .from("daily_focus")
        .delete()
        .eq("user_id", user.id)
        .eq("focus_date", today);

      if (deleteError) {
        console.error("Error deleting today's focus:", deleteError);
      }
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <h2 className="font-semibold text-lg mb-2">Today's Focus</h2>
      {loading ? (
        <p className="text-gray-700">Loading...</p>
      ) : (
        <div className="flex items-center">
          <input
            type="text"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mr-2"
            placeholder="What's your focus for today?"
            value={focus}
            onChange={handleFocusChange}
          />
          
          <button
            onClick={saveTodaysFocus}
            className="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Save
          </button>
        </div>
      )}
    </div>
  );
};

export default TodaysFocus;
