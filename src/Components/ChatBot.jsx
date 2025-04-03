import { ChatBubble } from "@/Components/ui/chat-bubble";
import { useAuth } from "@/Context/AuthContext";
import useCurrentUser from "@/hooks/use-current-user";
import axios from "axios";
import { motion } from "framer-motion";
import { BotIcon, Loader2, SendIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { supabase } from "../supabaseClient";
import Nav from "./Nav";
import { Button } from "./ui/button";
import { ScrollArea } from "./ui/scroll-area";
import { Textarea } from "./ui/textarea";

const API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

const ChatBot = () => {
  const [input, setInput] = useState("");
  const { session, signOut } = useAuth();
  const { user } = useCurrentUser();
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const scrollContainerRef = useRef(null);

  const [messages, setMessages] = useState([
    { role: "bot", content: "Hello! How can I assist you today?" },
  ]);

  const saveMessageToSupabase = async (role, content) => {
    if (!user) return;
    const { error } = await supabase
      .from("chat_messages")
      .insert([{ user_id: user.id, role, message: content }]);
    if (error) console.error("Supabase Insert Error:", error.message);
  };

  const fetchChatResponse = async (userInput) => {
    if (!userInput.trim()) return;
    setLoading(true);

    const newMessages = [...messages, { role: "user", content: userInput }];
    setMessages(newMessages);
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
                "You are a helpful AI, but only talk about fitness and diets.",
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

      const botResponse = res.data.choices[0].message.content;
      const updatedMessages = [
        ...newMessages,
        { role: "bot", content: botResponse },
      ];
      setMessages(updatedMessages);
      await saveMessageToSupabase("bot", botResponse);
    } catch (error) {
      console.error("Axios Error:", error.response || error.message);
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

      <ScrollArea className="w-full">
        <div className="flex relative flex-col mx-auto w-full max-w-2xl min-h-screen">
          {/* Header */}
          <div className="flex sticky top-0 z-10 gap-4 items-center py-4 bg-background">
            <BotIcon size={40} />
            <h3 className="text-lg font-semibold">AI Fitness Coach</h3>
          </div>

          {/* Chat area */}
          <div
            className="overflow-y-auto flex-1 px-2 pt-4 pb-24 space-y-3"
            ref={scrollContainerRef}
          >
            {messages.map((msg, index) => (
              <motion.div
                key={`chat-${index}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
              >
                <ChatBubble
                  variant={msg.role === "user" ? "outline" : "default"}
                  message={msg.content}
                  role={msg.role}
                  position={msg.role === "user" ? "right" : "left"}
                  showAvatar={false}
                  username={msg.role === "user" ? "You" : "AI Fitness Coach"}
                />
              </motion.div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input area */}
          <div className="flex sticky bottom-0 gap-4 items-center p-4 border-t bg-background">
            <div className="flex flex-col gap-2 w-full">
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) =>
                  e.key === "Enter" && !e.shiftKey && handleSendMessage()
                }
                className="border border-gray-300 shadow-sm focus-visible:ring-1 focus-visible:ring-blue-500"
                placeholder="Ask me anything about fitness or diet..."
              />
              <div className="flex justify-end">
                <Button onClick={handleSendMessage} disabled={loading}>
                  {loading ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    <>
                      <span>Send</span>
                      <SendIcon className="ml-1 w-4 h-4" />
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};

export default ChatBot;
