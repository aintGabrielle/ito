import { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import useUser from "../hooks/useUser";
import { Card, CardContent } from "./ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import Navbar from "./Navbar";
import { useAuth } from "@/Context/AuthContext";

const ProfilePage = () => {
  const { user } = useUser();
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    weight: "",
    height: "",
    age: "",
    protein_intake: "",
  });
  const { signOut } = useAuth();
  const [loading, setLoading] = useState(false);

  // Fetch user profile from Supabase
  useEffect(() => {
    if (!user?.id) return;

    const fetchProfile = async () => {
      setLoading(true);
      console.log("Fetching profile for user:", user.id);

      const { data, error } = await supabase
        .from("statistics")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (error) {
        console.error("Error fetching profile:", error);
      } else if (data) {
        console.log("Fetched Data:", data);
        setFormData({
          first_name: data.first_name || "",
          last_name: data.last_name || "",
          weight: data.weight || "",
          height: data.height || "",
          age: data.age || "",
          protein_intake: data.protein_intake || "",
        });
      }
      setLoading(false);
    };

    fetchProfile();
  }, [user]);

  // Handle input changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Update profile in Supabase
  const updateProfile = async () => {
    if (!user) return;
    setLoading(true);

    const { error } = await supabase
      .from("statistics")
      .update(formData)
      .eq("user_id", user.id);

    if (error) {
      console.error("Error updating profile:", error);
    } else {
      console.log("Profile updated!");
    }

    setLoading(false);
  };

  // Sign out
  const handleSignOut = async () => {
    try {
      await signOut();
      window.location.href = "/"; // Redirect to home after sign-out
    } catch (err) {
      console.error("Error signing out:", err);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Navbar />
      <div className="flex flex-col items-center justify-center flex-1 p-6">
        <Card className="w-full max-w-lg bg-white shadow-xl p-6 rounded-2xl">
          <CardContent className="flex flex-col gap-6">
            <h2 className="text-xl font-semibold text-center">
              {loading ? "Loading Profile..." : "Update Your Statistics"}
            </h2>

            {/* Input Fields */}
            <div className="grid grid-cols-2 gap-4">
              <Input
                name="first_name"
                placeholder="First Name"
                value={formData.first_name || ""}
                onChange={handleChange}
              />
              <Input
                name="last_name"
                placeholder="Last Name"
                value={formData.last_name || ""}
                onChange={handleChange}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Input
                name="weight"
                type="number"
                placeholder="Weight (kg)"
                value={formData.weight || ""}
                onChange={handleChange}
              />
              <Input
                name="height"
                type="number"
                placeholder="Height (cm)"
                value={formData.height || ""}
                onChange={handleChange}
              />
            </div>
            <Input
              name="age"
              type="number"
              placeholder="Age"
              value={formData.age || ""}
              onChange={handleChange}
            />
            <Input
              name="protein_intake"
              type="number"
              placeholder="Protein Intake (g)"
              value={formData.protein_intake || ""}
              onChange={handleChange}
            />

            {/* Buttons */}
            <Button
              onClick={updateProfile}
              className="w-full"
              disabled={loading}
            >
              {loading ? "Updating..." : "Update Profile"}
            </Button>
            <Button
              onClick={handleSignOut}
              className="w-full bg-red-500 hover:bg-red-600"
            >
              Sign Out
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProfilePage;
