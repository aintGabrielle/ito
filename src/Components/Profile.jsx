import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import useUser from "../hooks/useUser";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { toast } from "sonner";

const Profile = () => {
  const { user } = useUser();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [fitnessAssessment, setFitnessAssessment] = useState({
    weight: "",
    height: "",
    goal: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) fetchProfileData();
  }, [user]);

  // Fetch user profile & fitness assessment
  const fetchProfileData = async () => {
    if (!user) return;

    setLoading(true);
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("first_name, last_name")
      .eq("user_id", user.id)
      .single();

    const { data: fitness, error: fitnessError } = await supabase
      .from("fitness_assessment")
      .select("weight, height, goal")
      .eq("user_id", user.id)
      .single();

    if (profileError) console.error("Error fetching profile:", profileError);
    if (fitnessError)
      console.error("Error fetching fitness assessment:", fitnessError);

    if (profile) {
      setFirstName(profile.first_name || "");
      setLastName(profile.last_name || "");
    }
    if (fitness) {
      setFitnessAssessment({
        weight: fitness.weight || "",
        height: fitness.height || "",
        goal: fitness.goal || "",
      });
    }
    setLoading(false);
  };

  // Handle updating user profile
  const handleUpdateProfile = async () => {
    if (!user) return;

    setLoading(true);
    const { error } = await supabase
      .from("profiles")
      .upsert(
        { user_id: user.id, first_name: firstName, last_name: lastName },
        { onConflict: ["user_id"] }
      );

    if (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile.");
    } else {
      toast.success("Profile updated successfully!");
    }
    setLoading(false);
  };

  // Handle updating fitness assessment
  const handleUpdateFitness = async () => {
    if (!user) return;

    setLoading(true);
    const { error } = await supabase
      .from("fitness_assessment")
      .upsert(
        { user_id: user.id, ...fitnessAssessment },
        { onConflict: ["user_id"] }
      );

    if (error) {
      console.error("Error updating fitness assessment:", error);
      toast.error("Failed to update fitness assessment.");
    } else {
      toast.success("Fitness assessment updated!");
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col md:flex-row items-center justify-center min-h-screen bg-gray-100 p-6 gap-6">
      {/* User Profile Card */}
      <Card className="w-full md:w-1/3 p-4">
        <h3 className="text-lg font-bold mb-2">👤 User Profile</h3>
        <Input
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          placeholder="First Name"
        />
        <Input
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          placeholder="Last Name"
        />
        <Button
          onClick={handleUpdateProfile}
          disabled={loading}
          className="mt-2 w-full"
        >
          {loading ? "Saving..." : "Update Profile"}
        </Button>
      </Card>

      {/* Fitness Assessment Card */}
      <Card className="w-full md:w-1/3 p-4">
        <h3 className="text-lg font-bold mb-2">💪 Fitness Assessment</h3>
        <Input
          type="number"
          value={fitnessAssessment.weight}
          onChange={(e) =>
            setFitnessAssessment({
              ...fitnessAssessment,
              weight: e.target.value,
            })
          }
          placeholder="Weight (kg)"
        />
        <Input
          type="number"
          value={fitnessAssessment.height}
          onChange={(e) =>
            setFitnessAssessment({
              ...fitnessAssessment,
              height: e.target.value,
            })
          }
          placeholder="Height (cm)"
        />
        <Input
          value={fitnessAssessment.goal}
          onChange={(e) =>
            setFitnessAssessment({ ...fitnessAssessment, goal: e.target.value })
          }
          placeholder="Fitness Goal"
        />
        <Button
          onClick={handleUpdateFitness}
          disabled={loading}
          className="mt-2 w-full"
        >
          {loading ? "Saving..." : "Update Fitness"}
        </Button>
      </Card>
    </div>
  );
};

export default Profile;
