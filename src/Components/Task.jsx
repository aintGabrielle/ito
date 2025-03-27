import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import Nav from "./Nav";
import { supabase } from "../supabaseClient";
import axios from "axios";
import { useAuth } from "@/Context/AuthContext";

const EnhancedSuggestions = () => {
  const [cards, setCards] = useState([]);
  const [selectedCard, setSelectedCard] = useState(null);
  const { session } = useAuth();
  const [loading, setLoading] = useState(true);

  const API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

  useEffect(() => {
    const fetchAssessmentAndGenerateSuggestions = async () => {
      if (!session?.user) return;

      const { data: assessments, error } = await supabase
        .from("fitness_assessments")
        .select("*")
        .eq("user_id", session.user.id)
        .limit(1)
        .single();

      if (error || !assessments) {
        console.error("Error fetching assessment:", error);
        setLoading(false);
        return;
      }

      const prompt = `Based on this fitness assessment data:\n\n${JSON.stringify(
        assessments
      )}\n\nGenerate 20 personalized workout suggestions and 20 personalized diet suggestions.\n\nFor each item, return:\n- title (string)\n- description (1–2 sentences)\n- type: either \"workout\" or \"diet\"\n\nRespond in JSON format as an array.`;

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

        // Try to extract just the JSON block
        const jsonStart = text.indexOf("[");
        const jsonEnd = text.lastIndexOf("]") + 1;

        if (jsonStart === -1 || jsonEnd === -1) {
          throw new Error("Failed to parse JSON from AI response");
        }

        const jsonText = text.substring(jsonStart, jsonEnd);
        const suggestions = JSON.parse(jsonText);

        setCards(suggestions);
      } catch (err) {
        console.error("OpenAI Error:", err);
      }

      setLoading(false);
    };

    fetchAssessmentAndGenerateSuggestions();
  }, [session]);

  const handleCardClick = (card) => {
    setSelectedCard(card.id === selectedCard?.id ? null : card);
  };

  const renderCards = (type) => {
    const filtered = cards.filter((c) => c.type === type);

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {filtered.map((item, i) => (
          <motion.div
            key={i}
            layout
            whileTap={{ scale: 0.97 }}
            onClick={() => handleCardClick(item)}
            className="cursor-pointer"
          >
            <Card className="overflow-hidden shadow-lg rounded-2xl hover:shadow-xl transition-shadow duration-300">
              <img
                src={`https://source.unsplash.com/featured/?${item.type},${item.title}`}
                alt={item.title}
                className="w-full h-40 object-cover"
              />
              <CardHeader className="bg-white p-4">
                <CardTitle className="text-xl font-semibold text-gray-800">
                  {item.title}
                </CardTitle>
              </CardHeader>
              {selectedCard?.title === item.title && (
                <CardContent className="bg-gray-50 p-4 text-sm text-gray-600">
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
    <div className="flex flex-col h-full bg-green-100 min-h-screen">
      <Nav />
      <div className="px-6 py-8 max-w-7xl mx-auto w-full">
        <h2 className="text-3xl font-bold mb-6 text-green-700">
          💪 AI-Suggested Workouts
        </h2>
        {loading ? <p>Loading workouts...</p> : renderCards("workout")}

        <h2 className="text-3xl font-bold my-8 text-green-700">
          🥗 AI-Suggested Diet Plans
        </h2>
        {loading ? <p>Loading diets...</p> : renderCards("diet")}
      </div>
    </div>
  );
};

export default EnhancedSuggestions;
