import React, { useEffect, useState } from "react";
import { supabase } from "@/supabaseClient";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "./ui/dialog";
import { toast } from "sonner";
import { Pencil, Trash, Copy, CheckCircle } from "lucide-react";
import Navbar from "./Navbar";

const ChallengeManager = () => {
  const [challenges, setChallenges] = useState([]);
  const [newChallenge, setNewChallenge] = useState({
    name: "",
    description: "",
    challenge_link: "",
  });
  const [editingChallenge, setEditingChallenge] = useState(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [user, setUser] = useState(null);

  // Fetch user on component mount
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getSession();
        console.log("Fetched user:", user); // Log user for debugging
        setUser(user || null);
      } catch (error) {
        console.error("Error fetching user session:", error.message);
      }
    };

    fetchUser();

    // Listen for auth state changes
    const authListener = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth state changed:", event, session); // Log auth state change
      setUser(session?.user || null);
    });

    // Cleanup on component unmount
    return () => {
      if (authListener) {
        authListener.unsubscribe; // Fixing unsubscribe call
      }
    };
  }, []);

  // Fetch challenges once the user is available
  useEffect(() => {
    if (user) {
      const fetchChallenges = async () => {
        try {
          console.log("Fetching challenges for user:", user.id); // Log fetch attempt
          const { data, error } = await supabase
            .from("challenge")
            .select("*")
            .eq("user_id", user.id);

          if (error) {
            console.error("Fetch error:", error.message);
          } else {
            setChallenges(data);
            console.log("Challenges fetched:", data); // Log fetched challenges
          }
        } catch (error) {
          console.error("Error during challenges fetch:", error.message);
        }
      };

      fetchChallenges();
    }
  }, [user]);

  const handleChange = (e) => {
    setNewChallenge({ ...newChallenge, [e.target.name]: e.target.value });
  };

  const createChallenge = async () => {
    if (!newChallenge.name || !newChallenge.description) {
      toast.error("Please enter name and description.");
      return;
    }

    // Check if user.id is available
    if (!user?.id) {
      toast.error("User is not logged in.");
      return;
    }

    const { data, error } = await supabase.from("challenge").insert([
      {
        name: newChallenge.name,
        description: newChallenge.description,
        challenge_link: newChallenge.challenge_link || "", // Default to empty string if no link
        user_id: user.id,
      },
    ]);

    if (error) {
      console.error("Error inserting challenge:", error.message); // Log detailed error
      toast.error(`Failed to create challenge: ${error.message}`);
    } else {
      setChallenges([...challenges, data[0]]);
      setNewChallenge({ name: "", description: "", challenge_link: "" }); // Clear fields
      toast.success("Challenge created successfully!");
    }
  };

  const openEditModal = (challenge) => {
    setEditingChallenge(challenge);
    setIsEditOpen(true);
  };

  const updateChallenge = async () => {
    const { id, name, description, is_done, challenge_link } = editingChallenge;
    try {
      const { error } = await supabase
        .from("challenge")
        .update({ name, description, is_done, challenge_link })
        .eq("id", id);

      if (error) {
        console.error(error);
        toast.error("Failed to update challenge.");
      } else {
        setChallenges(
          challenges.map((c) =>
            c.id === id
              ? { ...c, name, description, is_done, challenge_link }
              : c
          )
        );
        toast.success("Challenge updated!");
        setIsEditOpen(false);
      }
    } catch (error) {
      console.error("Error updating challenge:", error.message);
    }
  };

  const deleteChallenge = async (id) => {
    try {
      const { error } = await supabase.from("challenge").delete().eq("id", id);
      if (error) {
        console.error(error);
        toast.error("Failed to delete challenge.");
      } else {
        setChallenges(challenges.filter((c) => c.id !== id));
        toast.success("Challenge deleted.");
      }
    } catch (error) {
      console.error("Error deleting challenge:", error.message);
    }
  };

  const markAsDone = async (id) => {
    try {
      const { error } = await supabase
        .from("challenge")
        .update({ is_done: true })
        .eq("id", id);

      if (error) {
        console.error(error);
        toast.error("Failed to mark challenge as done.");
      } else {
        setChallenges(
          challenges.map((c) => (c.id === id ? { ...c, is_done: true } : c))
        );
        toast.success("Challenge marked as done!");
      }
    } catch (error) {
      console.error("Error marking challenge as done:", error.message);
    }
  };

  const copyShareLink = (id) => {
    const url = `${window.location.origin}/challenge/${id}`;
    navigator.clipboard.writeText(url);
    toast.success("Challenge link copied!");
  };

  return (
    <div className="flex justify-between">
      <Navbar />
      <div className="mx-auto p-6">
        <h1 className="text-3xl font-bold text-center mb-6">
          Challenge Manager
        </h1>

        {/* Create Challenge */}
        <div className="flex flex-col gap-3 mb-6">
          <Input
            name="name"
            placeholder="Challenge Name"
            value={newChallenge.name}
            onChange={handleChange}
          />
          <Input
            name="description"
            placeholder="Challenge Description"
            value={newChallenge.description}
            onChange={handleChange}
          />
          <Input
            name="challenge_link"
            placeholder="Paste the challenge link (Optional)"
            value={newChallenge.challenge_link}
            onChange={handleChange}
          />
          <Button onClick={createChallenge}>Create Challenge</Button>
        </div>

        {/* Challenge List */}
        <div className="grid gap-4">
          {challenges.map((challenge) => (
            <Card key={challenge.id}>
              <CardHeader className="flex justify-between">
                <CardTitle>{challenge.name}</CardTitle>
                <div className="flex gap-2">
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => openEditModal(challenge)}
                  >
                    <Pencil size={16} />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => deleteChallenge(challenge.id)}
                  >
                    <Trash size={16} />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => copyShareLink(challenge.id)}
                  >
                    <Copy size={16} />
                  </Button>
                  {!challenge.is_done && (
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => markAsDone(challenge.id)}
                    >
                      <CheckCircle size={16} />
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {challenge.description}
                {challenge.is_done && (
                  <span className="text-green-500"> - Done</span>
                )}
                {challenge.challenge_link && (
                  <div className="mt-2">
                    <label>Challenge Link:</label>
                    <Input
                      value={challenge.challenge_link}
                      readOnly
                      className="mt-1"
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Edit Challenge Modal */}
        {editingChallenge && (
          <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Challenge</DialogTitle>
              </DialogHeader>
              <div className="flex flex-col gap-3">
                <Input
                  name="name"
                  value={editingChallenge.name}
                  onChange={(e) =>
                    setEditingChallenge({
                      ...editingChallenge,
                      name: e.target.value,
                    })
                  }
                />
                <Input
                  name="description"
                  value={editingChallenge.description}
                  onChange={(e) =>
                    setEditingChallenge({
                      ...editingChallenge,
                      description: e.target.value,
                    })
                  }
                />
                <Input
                  name="challenge_link"
                  value={editingChallenge.challenge_link}
                  onChange={(e) =>
                    setEditingChallenge({
                      ...editingChallenge,
                      challenge_link: e.target.value,
                    })
                  }
                  placeholder="Paste the challenge link (Optional)"
                />
              </div>
              <DialogFooter>
                <Button onClick={updateChallenge}>Update</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  );
};

export default ChallengeManager;
