import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { toast } from "sonner";
import Nav from "./Nav";
import { ScrollArea } from "./ui/scroll-area";
import { Edit2Icon, UserIcon, SaveIcon } from "lucide-react";
import useProfile from "@/hooks/use-profile";
import FloatingChatbot from "./ui/floating-chatbot";

const fitnessOptions = {
  goal: [
    { value: "lose_weight", label: "Lose Weight" },
    { value: "maintain_weight", label: "Maintain Weight" },
    { value: "gain_muscle", label: "Gain Muscle" },
  ],
  workoutLevel: [
    { value: "beginner", label: "Beginner" },
    { value: "intermediate", label: "Intermediate" },
    { value: "advanced", label: "Advanced" },
  ],
  focusMuscle: [
    { value: "full_body", label: "Full Body" },
    { value: "upper_body", label: "Upper Body" },
    { value: "lower_body", label: "Lower Body" },
    { value: "core", label: "Core & Abs" },
  ],
  exerciseType: [
    { value: "strength", label: "Strength Training" },
    { value: "cardio", label: "Cardio" },
    { value: "yoga", label: "Yoga & Flexibility" },
    { value: "mixed", label: "Mixed Training" },
  ],
};

const Profile = () => {
  const { assessment, loading, updateAssessment } = useProfile();
  const [tempValues, setTempValues] = useState(assessment);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (assessment) setTempValues(assessment);
  }, [assessment]);

  const handleChange = (field, value) => {
    setTempValues((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    await updateAssessment(tempValues);
    setIsEditing(false);
    toast.success("Fitness assessment updated successfully!");
  };

  return (
    <div className="flex relative min-h-screen">
      <Nav />
      <ScrollArea className="flex-1 h-screen">
        <div className="flex flex-col flex-1 gap-2 p-5 pt-20 mx-auto w-full md:pt-5">
          <div className="flex justify-between items-center mb-10">
            <div className="flex gap-4 items-center">
              <UserIcon size={40} />
              <h3 className="text-xl font-semibold">Your Profile</h3>
            </div>

            <div className="flex gap-2 items-center">
              {!isEditing ? (
                <Button onClick={() => setIsEditing(true)}>
                  <Edit2Icon className="mr-2" /> Edit
                </Button>
              ) : (
                <Button onClick={handleSave} disabled={loading}>
                  {loading ? (
                    "Saving..."
                  ) : (
                    <>
                      <SaveIcon className="mr-2" /> Save Changes
                    </>
                  )}
                </Button>
              )}
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
                value={tempValues.height}
                field="height"
                editing={isEditing}
                onChange={handleChange}
              />
              <EditableStatRow
                label="Weight"
                value={tempValues.currentWeight}
                field="currentWeight"
                editing={isEditing}
                onChange={handleChange}
              />
              <EditableStatRow
                label="Goal"
                value={tempValues.goal}
                field="goal"
                editing={isEditing}
                onChange={handleChange}
                options={fitnessOptions.goal}
              />
              <EditableStatRow
                label="Workout Level"
                value={tempValues.workoutLevel}
                field="workoutLevel"
                editing={isEditing}
                onChange={handleChange}
                options={fitnessOptions.workoutLevel}
              />
              <EditableStatRow
                label="Preferred Muscle Focus"
                value={tempValues.focusMuscle}
                field="focusMuscle"
                editing={isEditing}
                onChange={handleChange}
                options={fitnessOptions.focusMuscle}
              />
              <EditableStatRow
                label="Exercise Type"
                value={tempValues.exerciseType}
                field="exerciseType"
                editing={isEditing}
                onChange={handleChange}
                options={fitnessOptions.exerciseType}
              />
              <EditableStatRow
                label="Daily Walking"
                value={tempValues.dailyWalking}
                field="dailyWalking"
                editing={isEditing}
                onChange={handleChange}
              />
              <EditableStatRow
                label="Push-ups Capacity"
                value={tempValues.pushups}
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

      <FloatingChatbot />
    </div>
  );
};

const EditableStatRow = ({
  label,
  value,
  field,
  editing,
  onChange,
  options,
}) => {
  return (
    <div className="flex flex-col gap-2">
      <h5>{label}</h5>
      {options ? (
        <Select
          value={value}
          onValueChange={(value) => onChange(field, value)}
          disabled={!editing}
        >
          <SelectTrigger
            className={editing ? "border-input" : "border-transparent"}
          >
            <SelectValue placeholder="Select an option" />
          </SelectTrigger>
          <SelectContent>
            {options.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      ) : (
        <Input
          type="number"
          value={value || ""}
          onChange={(e) => editing && onChange(field, e.target.value)}
          readOnly={!editing}
          className={editing ? "border-input" : "border-transparent"}
        />
      )}
    </div>
  );
};

export default Profile;
