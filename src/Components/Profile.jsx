import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { toast } from "sonner";
import useUser from "../hooks/useUser";
import Nav from "./Nav";

const Profile = () => {
  const { user } = useUser();
  const [assessment, setAssessment] = useState(null);
  const [editing, setEditing] = useState(null);
  const [updatedValues, setUpdatedValues] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) fetchAssessment();
  }, [user]);

  const fetchAssessment = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from("fitness_assessments")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error("Supabase Error:", error.message);
    } else {
      console.log("Fetched Assessment Data:", data);
      setAssessment(data);
      setUpdatedValues(data || {});
    }
  };

  const handleEdit = (field) => {
    setEditing(field);
  };

  const handleChange = (field, value) => {
    setUpdatedValues((prev) => ({ ...prev, [field]: value }));
  };

  const handleUpdateFitness = async () => {
    if (!user) return;

    setLoading(true);
    const { error } = await supabase
      .from("fitness_assessments")
      .update(updatedValues)
      .eq("user_id", user.id);

    if (error) {
      console.error("Error updating fitness assessment:", error);
      toast.error("Failed to update fitness assessment.");
    } else {
      toast.success("Fitness assessment updated successfully!");
      setEditing(null);
      fetchAssessment(); // Refresh data
    }
    setLoading(false);
  };

  return (
    <div className="flex md:flex-row min-h-screen">
      {/* <div className="absolute z-20 w-full h-full top-0 left-0">
        <img src="/images/fitness.png" className="w-full h-full" alt="" />
      </div> */}
      <Nav />
      <div className="flex flex-col gap-3 items-center justify-center px-4 md:px-6 w-full bg-[url(/images/fitnesss.png)] bg-cover gap-6">
        <h1 className="text-3xl  font-semibold">
          Your Fitness Statistics!
        </h1>

        {/* Fitness Assessment Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {assessment ? (
            <>
              <EditableStatCard
                label="Height"
                value={updatedValues.height}
                field="height"
                editing={editing}
                onEdit={handleEdit}
                onChange={handleChange}
              />
              <EditableStatCard
                label="Weight"
                value={updatedValues.currentWeight}
                field="currentWeight"
                editing={editing}
                onEdit={handleEdit}
                onChange={handleChange}
              />
              <EditableStatCard
                label="Goal"
                value={updatedValues.goal}
                field="goal"
                editing={editing}
                onEdit={handleEdit}
                onChange={handleChange}
              />
              <EditableStatCard
                label="Workout Level"
                value={updatedValues.workoutLevel}
                field="workoutLevel"
                editing={editing}
                onEdit={handleEdit}
                onChange={handleChange}
              />
              <EditableStatCard
                label="Preferred Muscle Focus"
                value={updatedValues.focusMuscle}
                field="focusMuscle"
                editing={editing}
                onEdit={handleEdit}
                onChange={handleChange}
              />
              <EditableStatCard
                label="Exercise Type"
                value={updatedValues.exerciseType}
                field="exerciseType"
                editing={editing}
                onEdit={handleEdit}
                onChange={handleChange}
              />
              <EditableStatCard
                label="Daily Walking"
                value={updatedValues.dailyWalking}
                field="dailyWalking"
                editing={editing}
                onEdit={handleEdit}
                onChange={handleChange}
              />
              <EditableStatCard
                label="Push-ups Capacity"
                value={updatedValues.pushups}
                field="pushups"
                editing={editing}
                onEdit={handleEdit}
                onChange={handleChange}
              />
            </>
          ) : (
            <p className="text-gray-600">No fitness assessment found.</p>
          )}
        </div>

        {/* Save Button */}
        {editing && (
          <Button onClick={handleUpdateFitness} className="mt-4">
            {loading ? "Saving..." : "Save Changes"}
          </Button>
        )}
      </div>
    </div>
  );
};

// Editable Stat Card Component
const EditableStatCard = ({
  label,
  value,
  field,
  editing,
  onEdit,
  onChange,
}) => {
  return (
    <div className="bg-gradient-to-r from-green-400 to-green-600 p-6 rounded-xl shadow-lg transform hover:scale-105 transition-all">
      <h2 className="text-lg font-semibold text-white">{label}</h2>
      {editing === field ? (
        <Input
          type="text"
          value={value || ""}
          onChange={(e) => onChange(field, e.target.value)}
          className="mt-2 p-2 rounded-md w-full text-white"
        />
      ) : (
        <p className="text-xl font-bold text-white">{value || "N/A"}</p>
      )}
      <Button
        className="mt-2 bg-white text-blue-600 hover:bg-gray-300"
        onClick={() => onEdit(field)}
      >
        Edit
      </Button>
    </div>
  );
};

export default Profile;
