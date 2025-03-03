import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { UserAuth } from "../Context/AuthContext";
import { ScrollArea } from "./ui/scroll-area";
import useUser from "../hooks/useUser";
import { motion } from "framer-motion";
import debounce from "lodash.debounce";
import Navbar from "./Navbar";

const API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

const ChatBot = () => {
  const [input, setInput] = useState("");
  const { session, signOut } = UserAuth();
  const [messages, setMessages] = useState([]);
  const [statistics, setStatistics] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useUser();
  // Move fetchChatResponse outside useEffect to fix scope issue
  const fetchChatResponse = useCallback(
    debounce(async (userInput) => {
      if (!userInput.trim()) return;
      setLoading(true);

      try {
        const res = await axios.post(
          "https://api.openai.com/v1/completions",
          {
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: userInput }],
          },
          {
            headers: {
              Authorization: `Bearer ${API_KEY}`,
              "Content-Type": "application/json",
            },
          }
        );

        setMessages((prevMessages) => [
          ...prevMessages,
          { role: "user", content: userInput },
          { role: "bot", content: res.data.choices[0].message.content },
        ]);
      } catch (error) {
        if (error.response?.status === 429) {
          console.warn("Rate limit exceeded. Retrying in 5 seconds...");
          setTimeout(() => fetchChatResponse(userInput), 5000);
        } else {
          console.error("Error fetching response:", error);
        }
      }
      setLoading(false);
    }, 1000),
    []
  );
useEffect(() => {
    const fetchUserStatistics = async () => {
      if (!user) return;

      const { data, error } = await supabase
        .from("statistics")
        .select("*")
        .eq("user_id", user.id);

      if (error) console.error(error);
      else setStatistics(data);
    };

    fetchUserStatistics();
  }, [user]);

  const handleSignOut = async (e) => {
    e.preventDefault();
    try {
      await signOut();
      navigate("/");
    } catch (err) {
      console.error(err);
    }
  };
  return (
    <div className="max-w-5xl mx-auto flex flex-col gap-4">
      <Navbar />
      <Card className="h-96 overflow-hidden">
        <ScrollArea className="h-full p-4">
          {messages.map((msg, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={`mb-2 p-3 rounded-lg max-w-xs ${
                msg.role === "user"
                  ? "bg-blue-500 text-white ml-auto"
                  : "bg-gray-200 text-black"
              }`}
            >
              {msg.content}
            </motion.div>
          ))}
        </ScrollArea>
      </Card>
      <div className="flex gap-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask me anything..."
          className="flex-1"
        />
        <Button
          onClick={() => {
            fetchChatResponse(input);
            setInput("");
          }}
          disabled={loading}
        >
          {loading ? "Thinking..." : "Send"}
        </Button>
      </div>
    </div>
  );
};

export default ChatBot;
