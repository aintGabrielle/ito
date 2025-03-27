import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import Nav from "./Nav";
import { supabase } from "../supabaseClient";
import axios from "axios";

const EnhancedSuggestions = () => {
  const [cards, setCards] = useState([]);
  const [selectedCard, setSelectedCard] = useState(null);
  const [loading, setLoading] = useState(true);

  const API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

  useEffect(() => {
    const fetchData = async () => {
      console.log("🔄 Starting AI suggestion fetch...");

      // Get current user
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        console.error("❌ User not found, cannot fetch assessment.");
        setLoading(false);
        return;
      }

      console.log("✅ User found:", user.id);

      // Fetch assessment data
      const { data: assessments, error: assessmentError } = await supabase
        .from("fitness_assessments")
        .select("*")
        .eq("user_id", user.id)
        .limit(1)
        .single();

      if (assessmentError || !assessments) {
        console.error("❌ Error fetching assessment:", assessmentError);
        setLoading(false);
        return;
      }

      console.log("✅ Fetched assessment data:", assessments);

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

        // Safely extract JSON
        const jsonStart = text.indexOf("[");
        const jsonEnd = text.lastIndexOf("]") + 1;

        if (jsonStart === -1 || jsonEnd === -1) {
          throw new Error("⚠️ Failed to parse JSON from AI response");
        }

        const suggestions = JSON.parse(text.substring(jsonStart, jsonEnd));
        setCards(suggestions);
        console.log("✅ AI Suggestions Loaded:", suggestions.length);
      } catch (err) {
        console.error("❌ OpenAI Error:", err);
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
      <div className="flex flex-col md:flex-row gap-6">
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
                src={`https://source.unsplash.com/featured/?${
                  item.type
                },${encodeURIComponent(item.title)}`}
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
        {loading ? (
          <p className="text-gray-500 text-center">Generating workouts...</p>
        ) : (
          renderCards("workout")
        )}

        <h2 className="text-3xl font-bold my-8 text-green-700">
          🥗 AI-Suggested Diet Plans
        </h2>
        {loading ? (
          <p className="text-gray-500 text-center">Generating diets...</p>
        ) : (
          renderCards("diet")
        )}
      </div>
    </div>
  );
};

export default EnhancedSuggestions;
