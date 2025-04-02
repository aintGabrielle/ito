import useSWR from "swr";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import Nav from "./Nav";
import { Skeleton } from "./ui/skeleton";
import { ScrollArea } from "./ui/scroll-area";
import { DumbbellIcon } from "lucide-react";
import useEnhancedSuggestions from "@/hooks/use-enhanced-suggestions";

const EnhancedSuggestions = () => {
  const { cards, loading, selectedCard, setSelectedCard, getImageURL } =
    useEnhancedSuggestions();

  const handleCardClick = (card) => {
    setSelectedCard(card.title === selectedCard?.title ? null : card);
  };

  const renderCards = (type) => {
    const filtered = cards.filter((c) => c.type === type);
    return (
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
        {filtered.map((item, i) => (
          <motion.div
            key={`card-${i}`}
            layout
            whileTap={{ scale: 0.97 }}
            onClick={() => handleCardClick(item)}
            className="cursor-pointer"
          >
            <Card className="overflow-hidden rounded-2xl shadow-lg transition-shadow duration-300 hover:shadow-xl">
              <img
                src={getImageURL(item)}
                alt={item.title}
                className="object-cover w-full h-40"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "https://source.unsplash.com/800x600/?fitness";
                }}
              />
              <CardHeader className="p-4 bg-white">
                <CardTitle className="text-xl font-semibold text-gray-800">
                  {item.title}
                </CardTitle>
              </CardHeader>
              {selectedCard?.title === item.title && (
                <CardContent className="p-4 text-sm text-gray-600 bg-gray-50">
                  {item.description}
                </CardContent>
              )}
            </Card>
          </motion.div>
        ))}
      </div>
    );
  };

  return (
    <div className="flex h-full min-h-screen">
      <Nav />
      <ScrollArea className="flex-1 h-screen">
        <div className="flex flex-col flex-1 gap-2 p-5 pt-20 mx-auto w-full md:pt-5">
          <div className="flex gap-4 items-center mb-10">
            <DumbbellIcon size={40} />
            <h3>Challenges</h3>
          </div>
          <h2>AI-Suggested Workouts</h2>
          {loading ? (
            <Skeleton className="w-full h-10" />
          ) : (
            renderCards("workout")
          )}
          <h2>AI-Suggested Diet Plans</h2>
          {loading ? <Skeleton className="w-full h-10" /> : renderCards("diet")}
        </div>
      </ScrollArea>
    </div>
  );
};

export default EnhancedSuggestions;
