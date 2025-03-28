import { useEffect, useRef, useState } from "react";
import { Button } from "./button";
import {
  BotIcon,
  Loader2Icon,
  MessageCircle,
  MessageCircleIcon,
  SendIcon,
  XIcon,
} from "lucide-react";
import { Card, CardContent, CardHeader } from "./card";
import { Avatar } from "./avatar";
import { ScrollArea } from "./scroll-area";
import { Textarea } from "./textarea";
import useUser from "@/hooks/useUser";
import { motion } from "framer-motion";
import { ChatBubble } from "./chat-bubble";

const FloatingChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState("");
  const { user } = useUser();
  const [messages, setMessages] = useState([
    { role: "bot", content: "Hello! How can I assist you today?" },
  ]);
  const scrollContainerRef = useRef(null);

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

  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop =
        scrollContainerRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="fixed right-4 bottom-4 z-50">
      {isOpen ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
          className="origin-bottom-right"
        >
          <Card className="overflow-hidden w-[80dvw] shadow-lg md:w-[450px]">
            <CardHeader className="flex flex-row justify-between items-center p-4 border-b">
              <div className="flex gap-2 items-center">
                <Avatar className="flex justify-center items-center w-8 h-8 bg-primary">
                  <BotIcon size={16} className="text-primary-foreground" />
                </Avatar>
                <h5 className="font-semibold leading-none">AI Fitness Coach</h5>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
                aria-label="Close chat"
              >
                <XIcon size={20} />
              </Button>
            </CardHeader>
            <CardContent className="overflow-hidden p-0">
              <ScrollArea className="flex relative flex-col gap-2 h-[80dvh]">
                <div className="flex-1 p-4 min-h-[100dvh]">
                  {messages.map((msg, index) => (
                    <ChatBubble
                      key={`chat-${index}`}
                      variant={msg.role === "user" ? "outline" : "default"}
                      message={msg.content}
                      role={msg.role}
                      position={msg.role === "user" ? "right" : "left"}
                      showAvatar={false}
                      username={
                        msg.role === "user" ? "You" : "AI Fitness Coach"
                      }
                    />
                  ))}
                </div>
                <div className="flex sticky bottom-0 z-40 flex-col gap-2 p-4 w-full border-t bg-card">
                  <Textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                    className="p-0 border-none shadow-none focus-visible:ring-0"
                    placeholder="Ask me anything..."
                  />
                  <div className="flex justify-end">
                    <Button onClick={handleSendMessage} disabled={loading}>
                      {loading ? (
                        <Loader2Icon className="animate-spin" />
                      ) : (
                        <>
                          <span>Send</span>
                          <SendIcon />
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </motion.div>
      ) : (
        <Button
          onClick={() => setIsOpen(true)}
          size="icon"
          className="w-12 h-12 rounded-full shadow-lg"
          aria-label="Open chat"
        >
          <MessageCircle size={24} />
        </Button>
      )}
    </div>
  );
};

export default FloatingChatbot;
