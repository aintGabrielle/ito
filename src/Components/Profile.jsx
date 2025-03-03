import { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import useUser from "../hooks/useUser";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Navbar from "./Navbar";
import { UserAuth } from "@/Context/AuthContext";

const ProfilePage = () => {
  const { user } = useUser();
  const [formData, setFormData] = useState({});
  const [profile, setProfile] = useState(null);
  const { session, signOut } = UserAuth();

  //   Sign Out
  const handleSignOut = async (e) => {
    e.preventDefault();
    try {
      await signOut();
      navigate("/");
    } catch (err) {
      console.error(err);
    }
  };

  // Fetch user data
  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;

      const { data, error } = await supabase
        .from("statistics")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (error) console.error(error);
      else {
        setProfile(data);
        setFormData(data);
      }
    };

    fetchProfile();
  }, [user]);

  // Handle input changes
  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // Update profile data
  const updateProfile = async () => {
    if (!user || Object.keys(formData).length === 0) return;

    const { error } = await supabase
      .from("statistics")
      .update(formData)
      .eq("user_id", user.id);

    if (error) console.error(error);
    else console.log("Profile updated!");
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <Card className="w-full max-w-lg bg-white shadow-xl p-6 rounded-2xl">
          <CardContent className="flex flex-col gap-6">
            <h2 className="text-xl font-semibold text-center">
              Update Your Statistics
            </h2>

            <div className="grid grid-cols-2 gap-4">
              <Input
                name="first_name"
                placeholder="First Name"
                onChange={handleChange}
              />
              <Input
                name="last_name"
                placeholder="Last Name"
                onChange={handleChange}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Input
                name="weight"
                type="number"
                placeholder="Weight (kg)"
                onChange={handleChange}
              />
              <Input
                name="height"
                type="number"
                placeholder="Height (cm)"
                onChange={handleChange}
              />
            </div>
            <Input
              name="age"
              type="number"
              placeholder="Age"
              onChange={handleChange}
            />
            <Input
              name="protein_intake"
              type="number"
              placeholder="Protein Intake (g)"
              onChange={handleChange}
            />

            <Button onClick={updateProfile} className="w-full">
              Update Profile
            </Button>
            <Button onClick={handleSignOut} className="w-full">
              Sign Out
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProfilePage;
