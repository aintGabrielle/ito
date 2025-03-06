import { useState, useEffect, useCallback } from "react";
import { supabase } from "../supabaseClient";
import axios from "axios";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { useAuth } from "@/Context/AuthContext";
import { ScrollArea } from "./ui/scroll-area";
import useUser from "../hooks/useUser";
import { motion } from "framer-motion";
import debounce from "lodash.debounce";
import Navbar from "./Navbar";
import { useNavigate } from "react-router-dom";

const API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

const ChatBot = () => {
  const [input, setInput] = useState("");
  const { session, signOut } = useAuth();
  const [messages, setMessages] = useState([
    { role: "bot", content: "Hello! How can I help you?" },
  ]);
  const [statistics, setStatistics] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useUser();
  const navigate = useNavigate();

  const fetchChatResponse = useCallback(
    debounce(async (userInput) => {
      if (!userInput.trim()) return;
      setLoading(true);

      try {
        const res = await axios.post(
          "https://api.openai.com/v1/chat/completions",
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
          console.warn("Rate limit exceeded. Retrying in 6 seconds...");
          setTimeout(() => fetchChatResponse(userInput), 6000);
        } else {
          console.error("Error fetching response:", error);
        }
      }
      setLoading(false);
    }, 2000), // Increased debounce delay to 2 seconds
    []
  );

  useEffect(() => {
    const fetchMessages = async () => {
      if (!user) return;

      const { data, error } = await supabase
        .from("chat_messages")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: true });

      if (error) console.error(error);
      else setMessages(data);
    };

    fetchMessages();
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
    <div className="flex flex-col md:flex-row min-h-screen">
      <Navbar />
      <div className="flex-1 flex flex-col items-center justify-center p-6">
        <Card className="w-full max-w-2xl h-96 overflow-hidden">
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
        <div className="flex gap-2 w-full max-w-2xl mt-4">
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
    </div>
  );
};

export default ChatBot;
