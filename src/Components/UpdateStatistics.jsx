import { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import useUser from "../hooks/useUser";

const UpdateStatistics = () => {
  const { user } = useUser();
  const [statistics, setStatistics] = useState(null);
  const [formData, setFormData] = useState({});

  // Fetch user's current statistics
  useEffect(() => {
    const fetchUserStatistics = async () => {
      if (!user) return;

      const { data, error } = await supabase
        .from("statistics")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (error) console.error(error);
      else setStatistics(data);
    };

    fetchUserStatistics();
  }, [user]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value === "" ? null : e.target.value,
    }));
  };

  const updateStatistics = async () => {
    if (!user || Object.keys(formData).length === 0) {
      console.log("No changes detected.");
      return;
    }

    const { data, error } = await supabase
      .from("statistics")
      .update(formData)
      .eq("user_id", user.id);

    if (error) console.error(error);
    else {
      console.log("Statistics updated:", data);
      setStatistics((prev) => ({ ...prev, ...formData }));
      setFormData({});
    }
  };

  return (
    <div>
      <h2>Update Your Statistics</h2>
      <input
        name="weight"
        type="number"
        placeholder="Weight"
        onChange={handleChange}
      />
      <input
        name="height"
        type="number"
        placeholder="Height"
        onChange={handleChange}
      />
      <input
        name="protein_intake"
        type="number"
        placeholder="Protein Intake"
        onChange={handleChange}
      />
      <input
        name="age"
        type="number"
        placeholder="Age"
        onChange={handleChange}
      />
      <input
        name="first_name"
        type="text"
        placeholder="First Name"
        onChange={handleChange}
      />
      <input
        name="last_name"
        type="text"
        placeholder="Last Name"
        onChange={handleChange}
      />
      <button onClick={updateStatistics}>Update Statistics</button>
    </div>
  );
};

export default UpdateStatistics;
