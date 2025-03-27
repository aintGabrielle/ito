import { useState, useEffect, useRef } from "react";
import { supabase } from "../supabaseClient";
import axios from "axios";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { useAuth } from "@/Context/AuthContext";
import { ScrollArea } from "./ui/scroll-area";
import useUser from "../hooks/useUser";
import { motion } from "framer-motion";
import Nav from "./Nav";
import { Loader2 } from "lucide-react";

const API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

const ChatBot = () => {
  const [input, setInput] = useState("");
  const { session, signOut } = useAuth();
  const [messages, setMessages] = useState([
    { role: "bot", content: "Hello! How can I assist you today?" },
  ]);
  const [loading, setLoading] = useState(false);
  const { user } = useUser();
  const messagesEndRef = useRef(null); // ✅ Ref to track the bottom of the chat
  const scrollContainerRef = useRef(null); // ✅ Ref for the scrollable area

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
      } else if (data && data.length > 0) {
        setMessages(
          data.map((msg) => ({
            role: msg.role,
            content: msg.message,
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

    const { error } = await supabase
      .from("chat_messages")
      .insert([{ user_id: user.id, role, message: content }]);

    if (error) {
      console.error("Supabase Insert Error:", error.message);
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
            { role: "system", content: "You are a helpful AI, but only talks about Fitness and Diets" },
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

  const handleSendMessage = () => {
    if (!input.trim() || loading) return;
    fetchChatResponse(input);
    setInput("");
  };

  /** ✅ Auto-scroll to bottom whenever messages update */
  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop =
        scrollContainerRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="flex  h-screen bg-[url(/images/fitnesss.png)] bg-cover">
      <Nav />
      <div className="flex-1 flex flex-col items-center justify-between p-4 w-full max-w-[95%] md:max-w-3xl mx-auto h-full">
        <Card className="w-full flex-grow rounded-2xl shadow-lg bg-white p-4 flex flex-col overflow-hidden min-h-[75vh]">
          {/* ✅ Scrollable chat area with auto-scroll */}
          <ScrollArea
            ref={scrollContainerRef}
            className="flex-1 overflow-auto p-2 max-h-[75vh] min-h-[65vh]"
          >
            {messages.map((msg, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={`mb-2 p-3 rounded-xl text-sm shadow-md break-words ${
                  msg.role === "user"
                    ? "bg-blue-600 text-white ml-auto max-w-[80%]"
                    : "bg-gray-200 text-black max-w-[80%]"
                }`}
              >
                {msg.content}
              </motion.div>
            ))}
            {/* ✅ Invisible anchor to help scroll to bottom */}
            <div ref={messagesEndRef} />
          </ScrollArea>
        </Card>
        {/* ✅ Input and Send Button always visible */}
        <div className="flex gap-2 w-full max-w-3xl mt-4 items-center flex-wrap sm:flex-nowrap">
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
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-md w-full sm:w-auto"
          >
            {loading ? <Loader2 className="animate-spin" /> : "Send"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatBot;
