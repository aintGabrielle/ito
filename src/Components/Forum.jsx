import React from "react"
import {useState, useEffect} from "react"
import { useAuth } from "@/Context/AuthContext";
import useUser from "../hooks/useUser";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import Nav from "./Nav";

const Forum = () => {
      const { session, signInUser, signOut } = useAuth();
      const [communityPosts, setCommunityPosts] = useState([]);
      const [newPost, setNewPost] = useState("");
      const [posting, setPosting] = useState(false);
      const { user } = useUser();

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
        
          // ✅ Fix: Add handlePostSubmit Function
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
    
    return(
        <div className="flex ">
            <Nav />
            <div className="mt-6 w-full bg-white p-6 rounded-lg shadow-lg">
                      <h2 className="text-2xl font-semibold mb-4 text-green-400 text-center">
                        💬 Community Forum
                      </h2>
            
                      {/* Post Input */}
                      <div className="flex flex-col md:flex-row gap-2 mb-4">
                        <Input
                          type="text"
                          placeholder="Share something..."
                          value={newPost}
                          onChange={(e) => setNewPost(e.target.value)}
                          className="flex-grow p-2 border rounded-md"
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
                      <div className="overflow-y-auto max-h-64 border p-2 rounded-lg">
                        {communityPosts.length > 0 ? (
                          <ul className="space-y-4">
                            {communityPosts.slice(0, 4).map((post) => (
                              <li
                                key={post.id}
                                className="bg-gray-100 p-4 rounded-lg shadow-sm"
                              >
                                <strong>User {post.user_id}:</strong> {post.content}
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-gray-500 text-center">
                            No posts yet. Be the first to share!
                          </p>
                        )}
                      </div>
                    </div>
        </div>
    )
}

export default Forum