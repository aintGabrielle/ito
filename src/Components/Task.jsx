import { useState } from "react";
import { DumbbellIcon } from "lucide-react";
import useEnhancedSuggestions from "@/hooks/use-enhanced-suggestions";
import Nav from "./Nav";
import { Skeleton } from "./ui/skeleton";
import { ScrollArea } from "./ui/scroll-area";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "./ui/accordion";
import FloatingChatbot from "./ui/floating-chatbot";

const EnhancedSuggestions = () => {
  const { cards, loading } = useEnhancedSuggestions();

  const renderAccordion = (type) => {
    const filtered = cards.filter((c) => c.type === type);

    return (
      <Accordion type="single" collapsible className="w-full">
        {filtered.map((item, i) => (
          <AccordionItem key={i} value={`${item.title}-${i}`}>
            <AccordionTrigger>{item.title}</AccordionTrigger>
            <AccordionContent>{item.description}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    );
  };

  return (
    <div className="flex min-h-screen">
      <Nav />
      <ScrollArea className="flex-1 h-full">
        <div className="flex flex-col gap-6 p-6 pt-20 max-w-3xl mx-auto md:pt-6">
          <div className="flex items-center gap-4 mb-6">
            <DumbbellIcon size={32} />
            <h3 className="text-2xl font-bold">Challenges</h3>
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-2">
              AI-Suggested Workouts
            </h2>
            {loading ? (
              <Skeleton className="w-full h-10" />
            ) : (
              renderAccordion("workout")
            )}
          </div>

          <div>
            <h2 className="text-lg font-semibold mt-4 mb-2">
              AI-Suggested Diet Plans
            </h2>
            {loading ? (
              <Skeleton className="w-full h-10" />
            ) : (
              renderAccordion("diet")
            )}
          </div>
        </div>
      </ScrollArea>
      <FloatingChatbot />
    </div>
  );
};

export default EnhancedSuggestions;
