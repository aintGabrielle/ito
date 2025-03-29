import React, { useEffect, useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "./ui/card";
import Workout from "./Workout";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/supabaseClient";
import Navbar from "./Navbar";
import { useAuth } from "@/Context/AuthContext";
import { Menu, X } from "lucide-react";
import useCurrentUser from "@/hooks/use-current-user";

const Activity = () => {
  const { user } = useCurrentUser();
  const [statistics, setStatistics] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  useEffect(() => {
    const fetchUserStatistics = async () => {
      if (!user) return;
      const { data, error } = await supabase
        .from("statistics")
        .select("*")
        .eq("user_id", user.id);
      if (error) console.error(error);
      else setStatistics(data);
    };
    fetchUserStatistics();
  }, [user]);

  const diets = [
    {
      title: "Low-Carb Diet",
      foods: [
        {
          name: "Eggs",
          description: "A great source of protein and vitamins.",
        },
        {
          name: "Fish",
          description: "Rich in omega-3 fatty acids and protein.",
        },
      ],
      meals: {
        breakfast: [
          "Omelette with spinach and cheese",
          "Avocado toast with smoked salmon",
        ],
        lunch: ["Chicken salad with greens", "Tuna salad with celery"],
        dinner: ["Grilled steak with veggies", "Beef stir-fry with broccoli"],
      },
    },
    {
      title: "Vegetarian Diet",
      foods: [
        { name: "Nuts", description: "A great plant-based protein source." },
        { name: "Hummus", description: "Delicious and rich in healthy fats." },
      ],
      meals: {
        breakfast: ["Oatmeal with nuts and banana", "Vegetable upma"],
        lunch: ["Chickpea curry with naan", "Vegetable burger"],
        dinner: [
          "Whole-grain pasta with veggies",
          "Tacos with beans and cheese",
        ],
      },
    },
  ];

  return (
    <div className="flex flex-col w-full min-h-screen lg:flex-row">
      <div
        className={`absolute md:relative inset-y-0 left-0 w-64 bg-white shadow-lg transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out md:translate-x-0 md:w-64 z-50`}
      >
        <div className="flex flex-col p-5 h-full">
          <div className="flex justify-between items-center mb-6">
            <div className="flex gap-2 items-center">
              <img src="/images/logo.png" className="w-12" alt="Logo" />
              <h1 className="text-xl italic font-bold text-green-500">
                FitMission
              </h1>
            </div>
            <button
              className="p-2 text-gray-700 md:hidden"
              onClick={() => setIsOpen(false)}
            >
              <X size={24} />
            </button>
          </div>
          <nav className="flex flex-col space-y-4">
            <Link to="/dashboard" className="hover:text-green-500">
              Dashboard
            </Link>
            <Link to="/challenge" className="hover:text-green-500">
              Challenge
            </Link>
            <Link to="/activity" className="hover:text-green-500">
              Activity
            </Link>
            <Link to="/chatbot" className="hover:text-green-500">
              Coach
            </Link>
            <Link to="/profile" className="hover:text-green-500">
              Profile
            </Link>
          </nav>
          <div className="mt-auto">
            <h2 className="text-sm text-gray-500">
              Welcome,{" "}
              {statistics.length > 0 ? statistics[0].first_name : "Loading..."}
            </h2>
          </div>
        </div>
      </div>
      <div className="flex-1 p-4 sm:p-6">
        <h1 className="mb-4 text-2xl font-semibold sm:text-3xl text-primary">
          RECOMMENDED DIETS
        </h1>
        <Accordion type="single" collapsible className="space-y-4">
          {diets.map((diet, index) => (
            <AccordionItem key={index} value={`diet-${index}`}>
              <AccordionTrigger>{diet.title}</AccordionTrigger>
              <AccordionContent>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    {diet.foods.map((food, i) => (
                      <Card key={i}>
                        <CardHeader>
                          <CardTitle className="text-lg">{food.name}</CardTitle>
                          <CardDescription>{food.description}</CardDescription>
                        </CardHeader>
                      </Card>
                    ))}
                  </div>
                  <Card className="p-4">
                    <CardContent>
                      <h2 className="text-xl font-semibold">Meals</h2>
                      <div className="mt-2">
                        <h3 className="font-medium">Breakfast</h3>
                        <ul className="pl-4 list-disc">
                          {diet.meals.breakfast.map((meal, i) => (
                            <li key={i}>{meal}</li>
                          ))}
                        </ul>
                      </div>
                      <div className="mt-2">
                        <h3 className="font-medium">Lunch</h3>
                        <ul className="pl-4 list-disc">
                          {diet.meals.lunch.map((meal, i) => (
                            <li key={i}>{meal}</li>
                          ))}
                        </ul>
                      </div>
                      <div className="mt-2">
                        <h3 className="font-medium">Dinner</h3>
                        <ul className="pl-4 list-disc">
                          {diet.meals.dinner.map((meal, i) => (
                            <li key={i}>{meal}</li>
                          ))}
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
        <div className="mt-10">
          <h1 className="mb-4 text-2xl font-semibold sm:text-3xl text-primary">
            HOME WORKOUTS
          </h1>
          <Workout />
        </div>
      </div>
    </div>
  );
};

export default Activity;
