import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion } from "framer-motion";
import debounce from "lodash.debounce";

const API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

const ChatBot = () => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  // Move fetchChatResponse outside useEffect to fix scope issue
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

  return (
    <div className="max-w-lg mx-auto p-4 flex flex-col gap-4">
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
