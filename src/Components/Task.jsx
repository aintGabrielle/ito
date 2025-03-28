import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import Nav from "./Nav";
import { supabase } from "../supabaseClient";
import axios from "axios";
import { Skeleton } from "./ui/skeleton";
import { ScrollArea } from "./ui/scroll-area";
import { DumbbellIcon, LayoutGridIcon } from "lucide-react";

const EnhancedSuggestions = () => {
  const [cards, setCards] = useState([]);
  const [selectedCard, setSelectedCard] = useState(null);
  const [loading, setLoading] = useState(true);

  const API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

  // ✅ More reliable Unsplash image keywords
  const getImageURL = (item) => {
    const keywordMap = {
      HIIT: "hiit",
      "Strength Training Circuit": "strength training",
      "Yoga or Pilates": "yoga",
      Swimming: "swimming",
      Cycling: "cycling",
      Running: "running",
      Jogging: "jogging",
      "Outdoor Jogging": "jogging outdoor",
      "Bodyweight Exercises": "bodyweight workout",
      "Interval Running": "interval running",
      "Resistance Band Training": "resistance band",
      "Core Strengthening": "core exercise",
      "Upper Body Split": "upper body workout",
      "Full Body Workout": "full body training",
    };

    const keyword =
      keywordMap[item.title] ||
      item.title.split(" ").slice(0, 2).join(" ").toLowerCase() ||
      "fitness";

    // ✅ Use random instead of featured for reliability
    return `https://source.unsplash.com/random/800x600/?${item.type},${keyword}`;
  };

  useEffect(() => {
    const fetchData = async () => {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        console.error("User not found, cannot fetch assessment.");
        setLoading(false);
        return;
      }

      const { data: assessments, error: assessmentError } = await supabase
        .from("fitness_assessments")
        .select("*")
        .eq("user_id", user.id)
        .limit(1)
        .single();

      if (assessmentError || !assessments) {
        console.error("Error fetching assessment:", assessmentError);
        setLoading(false);
        return;
      }

      const prompt = `Based on this fitness assessment data:\n\n${JSON.stringify(
        assessments
      )}\n\nGenerate 20 personalized workout suggestions and 20 personalized diet suggestions.\n\nFor each item, return:\n- title (string)\n- description (1–2 sentences)\n- type: either "workout" or "diet"\n\nRespond in JSON format as an array.`;

      try {
        const res = await axios.post(
          "https://api.openai.com/v1/chat/completions",
          {
            model: "gpt-3.5-turbo",
            messages: [
              {
                role: "system",
                content: "You are a helpful AI fitness assistant.",
              },
              { role: "user", content: prompt },
            ],
            temperature: 0.7,
          },
          {
            headers: {
              Authorization: `Bearer ${API_KEY}`,
              "Content-Type": "application/json",
            },
          }
        );

        const text = res.data.choices[0].message.content;

        const jsonStart = text.indexOf("[");
        const jsonEnd = text.lastIndexOf("]") + 1;

        if (jsonStart === -1 || jsonEnd === -1) {
          throw new Error("Failed to parse JSON from AI response");
        }

        const suggestions = JSON.parse(text.substring(jsonStart, jsonEnd));
        setCards(suggestions);
      } catch (err) {
        console.error("OpenAI Error:", err);
      }

      setLoading(false);
    };

    fetchData();
  }, []);

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
                  e.target.src =
                    "https://source.unsplash.com/random/800x600/?fitness";
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
