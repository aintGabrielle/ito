import React from "react";
import { useState, useEffect } from "react";
import { useAuth } from "@/Context/AuthContext";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import Nav from "./Nav";
import { ScrollArea } from "./ui/scroll-area";
import { ScrollIcon } from "lucide-react";
import useCurrentUser from "@/hooks/use-current-user";

const Forum = () => {
  const { session, signInUser, signOut } = useAuth();
  const [communityPosts, setCommunityPosts] = useState([]);
  const [newPost, setNewPost] = useState("");
  const [posting, setPosting] = useState(false);
  const { user } = useCurrentUser();

  const fetchCommunityPosts = async () => {
    const { data, error } = await supabase
      .from("community_posts")
      .select("id, user_id, content, created_at")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching community posts:", error.message);
    } else {
      setCommunityPosts(data);
    }
  };

  const handlePostSubmit = async () => {
    if (!user) {
      alert("You must be logged in to post!");
      return;
    }
    if (!newPost.trim()) {
      alert("Post cannot be empty!");
      return;
    }

    setPosting(true);

    const { error } = await supabase
      .from("community_posts")
      .insert([{ user_id: user.id, content: newPost }]);

    if (error) {
      console.error("Error adding post:", error.message);
      alert("Failed to post. Try again!");
    } else {
      setNewPost(""); // Clear input after posting
      fetchCommunityPosts(); // Refresh forum posts
    }

    setPosting(false);
  };

  return (
    <>
      <div className="flex relative min-h-screen">
        <Nav />
        <ScrollArea className="flex-1 h-screen">
          <div className="flex flex-col flex-1 gap-2 p-5 pt-20 mx-auto w-full md:pt-5">
            <div className="flex gap-4 items-center mb-10">
              <ScrollIcon size={40} />
              <h3>Public Forum</h3>
            </div>

            {/* Post Input */}
            <div className="flex flex-col gap-2 mb-4 md:flex-row">
              <Input
                type="text"
                placeholder="Share something..."
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
                className="flex-grow p-2 rounded-md border"
              />
              <Button
                onClick={handlePostSubmit}
                disabled={posting}
                className="w-full md:w-auto"
              >
                {posting ? "Posting..." : "Post"}
              </Button>
            </div>

            {/* Posts List */}
            <div className="overflow-y-auto p-2 max-h-64 rounded-lg border">
              {communityPosts.length > 0 ? (
                <ul className="space-y-4">
                  {communityPosts.slice(0, 4).map((post) => (
                    <li
                      key={post.id}
                      className="p-4 bg-gray-100 rounded-lg shadow-sm"
                    >
                      <strong>User {post.user_id}:</strong> {post.content}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-center text-gray-500">
                  No posts yet. Be the first to share!
                </p>
              )}
            </div>
          </div>
        </ScrollArea>
      </div>
    </>
  );
};

export default Forum;
