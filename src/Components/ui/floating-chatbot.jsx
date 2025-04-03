import { Button } from "@/Components/ui/button";
import { ChatBubble } from "@/Components/ui/chat-bubble";
import useChatbot from "@/hooks/use-chatbot";
import { motion } from "framer-motion";
import {
  BotIcon,
  Loader2Icon,
  MessageCircle,
  SendIcon,
  XIcon,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Avatar } from "./avatar";
import { Card, CardContent, CardHeader } from "./card";
import { ScrollArea } from "./scroll-area";
import { Textarea } from "./textarea";

const FloatingChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const scrollContainerRef = useRef(null);

  const { messages, loading, sendMessage } = useChatbot();

  const handleSendMessage = () => {
    if (!input.trim() || loading) return;
    sendMessage(input);
    setInput("");
  };

  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollIntoView(false);
    }
  }, [messages, isOpen]);

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
              <ScrollArea className="flex relative flex-col gap-2 h-[50dvh]">
                <div ref={scrollContainerRef} className="flex-1 p-4">
                  {messages?.map((msg, index) => (
                    <ChatBubble
                      key={`chat-${index}`}
                      variant={msg.role === "user" ? "outline" : "default"}
                      message={msg.message}
                      role={msg.role}
                      position={msg.role === "user" ? "right" : "left"}
                      showAvatar={false}
                      username={
                        msg.role === "user" ? "You" : "AI Fitness Coach"
                      }
                    />
                  ))}
                </div>
              </ScrollArea>
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
