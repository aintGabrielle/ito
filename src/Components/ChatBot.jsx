import { useState, useEffect, useCallback, useRef } from "react";
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
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, BarChart, User, Dumbbell, LogOut } from "lucide-react"; // Sidebar Icons
import { Loader2 } from "lucide-react";

const API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

const ChatBot = () => {
  const [input, setInput] = useState("");
  const { session, signOut } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: "bot", content: "Hello! How can I assist you today?" },
  ]);
  const [loading, setLoading] = useState(false);
  const { user } = useUser();
  const navigate = useNavigate();
  const debounceRef = useRef(null);

  useEffect(() => {
    const fetchMessages = async () => {
      if (!user) return;

      const { data, error } = await supabase
        .from("chat_messages")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: true });

      if (error) {
        console.error("Error fetching messages:", error);
      } else {
        console.log("Messages loaded from Supabase:", data);
        setMessages(
          data.map((msg) => ({
            role: msg.role,
            content: msg.message, // Ensure it matches message state
          }))
        );
      }
    };

    fetchMessages();
  }, [user]);

  const saveMessageToSupabase = async (role, content) => {
    if (!user) {
      console.error("User is not logged in.");
      return;
    }

    const { data, error } = await supabase
      .from("chat_messages")
      .insert([{ user_id: user.id, role, message: content }]);

    if (error) {
      console.error("Supabase Insert Error:", error);
    } else {
      console.log("Message saved to Supabase:", data);
    }
  };

  const fetchChatResponse = async (userInput) => {
    if (!userInput.trim()) return;
    setLoading(true);

    setMessages((prevMessages) => [
      ...prevMessages,
      { role: "user", content: userInput },
    ]);
    await saveMessageToSupabase("user", userInput);

    try {
      const res = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
          model: "gpt-3.5-turbo",
          messages: [
            { role: "system", content: "You are a helpful AI." },
            { role: "user", content: userInput },
          ],
          temperature: 0.7,
        },
        {
          headers: {
            Authorization: `Bearer ${API_KEY.trim()}`,
            "Content-Type": "application/json",
          },
        }
      );

      const botResponse = res.data.choices[0].message.content;
      setMessages((prevMessages) => [
        ...prevMessages,
        { role: "bot", content: botResponse },
      ]);
      await saveMessageToSupabase("bot", botResponse);
    } catch (error) {
      console.error(
        "Axios Error:",
        error.response ? error.response.data : error.message
      );
      alert(
        `Chatbot request failed: ${
          error.response?.data?.error?.message || error.message
        }`
      );
    }
    setLoading(false);
  };

  const debouncedFetchChatResponse = useCallback(
    debounce((userInput) => {
      fetchChatResponse(userInput);
    }, 1500),
    []
  );

  const handleSendMessage = () => {
    if (!input.trim() || loading) return;
    debouncedFetchChatResponse(input);
    setInput("");
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-green-400">
      <div
        className={`fixed md:relative z-40 bg-white shadow-xl h-screen flex flex-col p-6 w-64 transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 transition-transform duration-300 ease-in-out`}
      >
        <div className="flex items-center gap-3 mb-8">
          <img src="/images/logo.png" className="w-12" alt="Logo" />
          <h1 className="font-bold italic text-2xl text-green-500">
            FitMission
          </h1>
        </div>

        <nav className="flex flex-col space-y-4 flex-grow">
          <Link
            to="/dashboard"
            className="flex items-center gap-3 text-lg hover:text-green-500"
          >
            <BarChart size={20} /> Dashboard
          </Link>
          <Link
            to="/challenge"
            className="flex items-center gap-3 text-lg hover:text-green-500"
          >
            <Dumbbell size={20} /> Tracker
          </Link>

          <Link
            to="/chatbot"
            className="flex items-center gap-3 text-lg hover:text-green-500"
          >
            🤖 AI Coach
          </Link>
          {/* <Link
            to="/profile"
            className="flex items-center gap-3 text-lg hover:text-green-500"
          >
            🏆 Profile
          </Link> */}
        </nav>

        <div className="mt-auto">
          <Button
            className="mt-4 w-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center gap-2"
            onClick={() => {
              signOut();
              navigate("/");
            }}
          >
            <LogOut size={18} /> Sign Out
          </Button>
        </div>
      </div>
      <div className="flex-1 flex flex-col items-center justify-between p-6 w-full max-w-4xl mx-auto min-h-[80vh]">
        <Card className="w-full flex-grow rounded-2xl shadow-lg bg-white p-4 flex flex-col overflow-hidden">
          <ScrollArea className="flex-1 overflow-auto p-2 max-h-[60vh]">
            {messages.map((msg, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={`mb-2 p-3 rounded-xl max-w-xs text-sm shadow-md ${
                  msg.role === "user"
                    ? "bg-blue-600 text-white ml-auto"
                    : "bg-gray-200 text-black"
                }`}
              >
                {msg.content}
              </motion.div>
            ))}
            {loading && (
              <div className="flex items-center gap-2 p-2 text-gray-500">
                <Loader2 className="animate-spin" /> AI is thinking...
              </div>
            )}
          </ScrollArea>
        </Card>
        <div className="flex gap-2 w-full max-w-4xl mt-4 items-center flex-wrap sm:flex-nowrap">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
            placeholder="Ask me anything..."
            className="flex-1 border border-gray-300 rounded-lg px-4 py-2 shadow-sm w-full sm:w-auto"
          />
          <Button
            onClick={handleSendMessage}
            disabled={loading}
            className="bg-white hover:bg-blue-700 text-black px-4 py-2 rounded-lg shadow-md w-full sm:w-auto"
          >
            {loading ? <Loader2 className="animate-spin" /> : "Send"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatBot;
