import { useState, useEffect, useRef } from "react";
import { supabase } from "../supabaseClient";
import axios from "axios";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { useAuth } from "@/Context/AuthContext";
import { ScrollArea } from "./ui/scroll-area";
import { motion } from "framer-motion";
import Nav from "./Nav";
import { BotIcon, LayoutGridIcon, Loader2, SendIcon } from "lucide-react";
import { Textarea } from "./ui/textarea";
import { cn } from "@/lib/utils";
import { ChatBubble } from "./ui/chat-bubble";
import useCurrentUser from "@/hooks/use-current-user";

const API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

const ChatBot = () => {
  const [input, setInput] = useState("");
  const { session, signOut } = useAuth();
  const [messages, setMessages] = useState([
    { role: "bot", content: "Hello! How can I assist you today?" },
  ]);
  const [loading, setLoading] = useState(false);
  const { user } = useCurrentUser();
  const messagesEndRef = useRef(null); // ✅ Ref to track the bottom of the chat
  const scrollContainerRef = useRef(null); // ✅ Ref for the scrollable area

  // useEffect(() => {
  //   const fetchMessages = async () => {
  //     if (!user) return;

  //     const { data, error } = await supabase
  //       .from("chat_messages")
  //       .select("*")
  //       .eq("user_id", user.id)
  //       .order("created_at", { ascending: true });

  //     if (error) {
  //       console.error("Error fetching messages:", error);
  //     } else if (data && data.length > 0) {
  //       setMessages(
  //         data.map((msg) => ({
  //           role: msg.role,
  //           content: msg.message,
  //         }))
  //       );
  //     }
  //   };

  //   fetchMessages();
  // }, [user]);

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
            {
              role: "system",
              content:
                "You are a helpful AI, but only talks about Fitness and Diets",
            },
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

      const botResponse = res.data.choices[0].message.message;
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

  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop =
        scrollContainerRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="flex relative h-screen">
      <Nav />
      {/* <div className="flex-1 flex flex-col items-center justify-between p-4 w-full max-w-[95%] md:max-w-3xl mx-auto h-full">
        <Card className="w-full flex-grow rounded-2xl shadow-lg bg-white p-4 flex flex-col overflow-hidden min-h-[75vh]">
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
                {msg.message}
              </motion.div>
            ))}
            <div ref={messagesEndRef} />
          </ScrollArea>
        </Card>
        <div className="flex flex-wrap gap-2 items-center mt-4 w-full max-w-3xl sm:flex-nowrap">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
            placeholder="Ask me anything..."
            className="flex-1 px-4 py-2 w-full rounded-lg border border-gray-300 shadow-sm sm:w-auto"
          />
          <Button
            onClick={handleSendMessage}
            disabled={loading}
            className="px-4 py-2 w-full text-white bg-blue-600 rounded-lg shadow-md hover:bg-blue-700 sm:w-auto"
          >
            {loading ? <Loader2 className="animate-spin" /> : "Send"}
          </Button>
        </div>
      </div> */}

      <ScrollArea className="w-full">
        <div className="flex relative flex-col mx-auto w-full max-w-2xl min-h-screen">
          <div className="flex sticky top-0 gap-4 items-center py-4 bg-background">
            <BotIcon size={40} />
            <h3>AI Fitness Coach</h3>
          </div>

          {/* chat body */}
          <div className="flex-1 pt-10">
            {messages.map((msg, index) => (
              <ChatBubble
                key={`chat-${index}`}
                variant={msg.role === "user" ? "outline" : "default"}
                message={msg.message}
                role={msg.role}
                position={msg.role === "user" ? "right" : "left"}
                showAvatar={false}
                username={msg.role === "user" ? "You" : "AI Fitness Coach"}
              />
            ))}
          </div>

          {/* chat input */}
          <div className="flex sticky bottom-0 gap-4 items-center p-2 mb-5 rounded-md border-2">
            <div className="flex flex-col gap-2 w-full">
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                className="border-none shadow-none focus-visible:ring-0"
                placeholder="Ask me anything..."
              />
              <div className="flex justify-end">
                <Button onClick={handleSendMessage} disabled={loading}>
                  {loading ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    <>
                      <span>Send</span>
                      <SendIcon />
                    </>
                  )}
                </Button>
              </div>
            </div>
            {/* <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
              placeholder="Ask me anything..."
              className="flex-1 px-4 py-2 w-full rounded-lg border border-gray-300 shadow-sm sm:w-auto"
            /> */}
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};

export default ChatBot;
