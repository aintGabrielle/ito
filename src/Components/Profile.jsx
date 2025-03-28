import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { toast } from "sonner";
import useUser from "../hooks/useUser";
import Nav from "./Nav";
import { ScrollArea } from "./ui/scroll-area";
import { Edit2Icon, UserIcon, SaveIcon } from "lucide-react";

const Profile = () => {
  const { user } = useUser();
  const [assessment, setAssessment] = useState(null);
  const [updatedValues, setUpdatedValues] = useState({});
  const [isEditing, setIsEditing] = useState(false);
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
      setAssessment(data);
      setUpdatedValues(data || {});
    }
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
      setIsEditing(false);
      fetchAssessment();
    }
    setLoading(false);
  };

  return (
    <div className="flex relative min-h-screen">
      <Nav />
      <ScrollArea className="flex-1 h-screen">
        <div className="flex flex-col flex-1 gap-2 p-5 pt-20 mx-auto w-full md:pt-5">
          {/* Profile Header */}
          <div className="flex justify-between items-center mb-10">
            <div className="flex gap-4 items-center">
              <UserIcon size={40} />
              <h3 className="text-xl font-semibold">Your Profile</h3>
            </div>

            <div className="flex gap-2 items-center">
              {/* Edit / Save Button */}
              {!isEditing ? (
                <Button
                  onClick={() => {
                    setIsEditing(true);
                  }}
                >
                  <Edit2Icon className="mr-2" /> Edit
                </Button>
              ) : (
                <Button onClick={handleUpdateFitness} disabled={loading}>
                  {loading ? (
                    "Saving..."
                  ) : (
                    <>
                      <SaveIcon className="mr-2" /> Save Changes
                    </>
                  )}
                </Button>
              )}
              {/* cancel edit */}
              {isEditing && (
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsEditing(false);
                    setUpdatedValues(assessment);
                  }}
                >
                  Cancel
                </Button>
              )}
            </div>
          </div>

          {assessment ? (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <EditableStatRow
                label="Height"
                value={updatedValues.height}
                field="height"
                editing={isEditing}
                onChange={handleChange}
              />
              <EditableStatRow
                label="Weight"
                value={updatedValues.currentWeight}
                field="currentWeight"
                editing={isEditing}
                onChange={handleChange}
              />
              <EditableStatRow
                label="Goal"
                value={updatedValues.goal}
                field="goal"
                editing={isEditing}
                onChange={handleChange}
              />
              <EditableStatRow
                label="Workout Level"
                value={updatedValues.workoutLevel}
                field="workoutLevel"
                editing={isEditing}
                onChange={handleChange}
              />
              <EditableStatRow
                label="Preferred Muscle Focus"
                value={updatedValues.focusMuscle}
                field="focusMuscle"
                editing={isEditing}
                onChange={handleChange}
              />
              <EditableStatRow
                label="Exercise Type"
                value={updatedValues.exerciseType}
                field="exerciseType"
                editing={isEditing}
                onChange={handleChange}
              />
              <EditableStatRow
                label="Daily Walking"
                value={updatedValues.dailyWalking}
                field="dailyWalking"
                editing={isEditing}
                onChange={handleChange}
              />
              <EditableStatRow
                label="Push-ups Capacity"
                value={updatedValues.pushups}
                field="pushups"
                editing={isEditing}
                onChange={handleChange}
              />
            </div>
          ) : (
            <p className="text-center">No fitness assessment found.</p>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

const EditableStatRow = ({ label, value, field, editing, onChange }) => {
  return (
    <div className="flex flex-col gap-2">
      <h5>{label}</h5>
      <Input
        type="text"
        value={value || ""}
        onChange={(e) => editing && onChange(field, e.target.value)}
        readOnly={!editing}
        className={editing ? "border-input" : "border-transparent"}
      />
    </div>
  );
};

export default Profile;
