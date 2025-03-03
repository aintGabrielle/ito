import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Workout from "./Workout";
import useUser from "@/hooks/useUser";
import { supabase } from "@/supabaseClient";

const Activity = () => {
  const LowCarbDiet = [
    {
      title: "Eggs",
      description:
        "A convenient source of protein, B vitamins, zinc, selenium, and vitamin D",
    },
    {
      title: "Fish",
      description: "High in protein, B vitamins, potassium, and selenium",
    },
    {
      title: "Cheese",
      description: "High in protein, healthy fats, and calcium",
    },
    {
      title: "Greek Yogurt",
      description: "High in protein and calcium",
    },
    {
      title: "Broccoli",
      description:
        "A popular keto vegetable, along with other cruciferous vegetables",
    },
    {
      title: "Leafy greens",
      description: "A popular keto vegetable",
    },
    {
      title: "Asparagus",
      description: "A popular keto vegetable",
    },
    {
      title: "Cucumber",
      description: "A popular keto vegetable",
    },
    {
      title: "Zucchini",
      description: "A popular keto vegetable",
    },
    {
      title: "Leafy greens",
      description: "A popular keto vegetable",
    },
  ];

  const lowCarbDishBf = [
    {
      description: "- Omelette with spinach and feta cheese",
    },
    {
      description: "- Egg white scramble with chopped bell peppers and bacon ",
    },
    {
      description: "- Avocado toast with smoked salmon ",
    },
  ];
  const lowCarbDishLunch = [
    {
      description: "- Chicken salad with mixed greens and cucumber ",
    },
    {
      description: "- Tuna salad with celery and low-carb crackers  ",
    },
    {
      description:
        "- Cauliflower rice bowl with grilled steak and roasted Brussels sprouts ",
    },
  ];
  const lowCarbDishDinner = [
    {
      description:
        "- Cauliflower rice bowl with grilled steak and roasted Brussels sprouts ",
    },
    {
      description: "- Beef stir-fry with broccoli and snap peas ",
    },
    {
      description:
        "- Stuffed portobello mushrooms with ground turkey and spinach ",
    },
  ];

  const VegetarianDiet = [
    "- Nuts and dried fruit",
    "- Popcorn",
    "- Dates and tahini",
    "- Fresh fruit with cheese, yogurt or nut butter",
    "- Hummus and pita wedges",
    "- Cucumber slices with chile powder and lime",
    "- Dried seaweed",
    "- Cheese and whole-grain crackers",
    "- Wasabi peas",
    "- Plantain or banana chips",
    "- Fruit smoothie",
    "- Spring rolls filled with fresh vegetables",
  ];

  const VegetarianLunch = [
    "- Grape leaves stuffed with rice, pine nuts, herbs and diced tomato",
    "- Vegetable sandwich: Sliced tomato, pepper, onion, avocado and hummus stuffed between slices of whole-grain bread or on a wrap",
    "- Chili made with beans and textured vegetable protein, served with cornbread",
    "- Vegetable burger with sauteed mushrooms and tomato on a whole-grain bun",
    "- Chana masala, a chickpea curry in tomato gravy, with naan bread and vegetable raita",
  ];

  const VegetarianBF = [
    "- Instant oatmeal made with low-fat or fat-free milk or soymilk, with nuts and chopped banana",
    "- Beans and brown rice, tomato, cooked plantain and an egg cooked your way",
    "- Low-fat yogurt or soy yogurt layered with crunchy cereal and berries for a breakfast parfait",
    "- Vegetable upma, a hot breakfast made from a creamy porridge and vegetables including onions, carrots and green beans and spiced with ginger, curry leaves, mustard seeds and cumin",
  ];

  const VegetarianDinner = [
    "- Vermicelli noodles with tofu, stir fried bean sprouts, napa cabbage and carrot and side of fresh fruit",
    "- Whole-grain pasta with tomato sauce and sauteed or roasted vegetables such as mushrooms, tomatoes, eggplant, peppers and onions",
    "- Tacos or burritos filled with your favorite combination of beans or lentils, cheese and vegetables",
    "- Tabbouleh and lentil soup, with pomegranate and low-fat yogurt",
  ];

  const HeavyMeal = [
    "- avocado toast with poached eggs ",
    "- grilled chicken with brown rice and roasted vegetables ",
    "- protein-packed smoothies ",
    "- cheese and nut-filled omelets ",
    "- salmon with quinoa ",
    "- lentil soup with whole-wheat bread ",
    "- peanut butter and banana sandwiches ",
    "- full-fat yogurt with granola and berries- ",
    "- Homemade protein bars with nuts and dried fruit",
  ];

  const HeavyMealBf = [
    "Scrambled eggs with avocado and whole-wheat toast, protein smoothie with banana and almond butter, oatmeal with mixed nuts and fruit ",
  ];
  const HeavyMealLunch = [
    "Grilled chicken salad with avocado and quinoa, tuna melt on whole-wheat bread with a side of sweet potato fries, lentil soup with whole-grain bread ",
  ];
  const HeavyMealDinner = [
    "Baked salmon with roasted vegetables and brown rice, beef stir-fry with brown rice, chicken breast with mashed potatoes and steamed broccoli ",
  ];
  const { user } = useUser();
  const [statistics, setStatistics] = useState([]);

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
  return (
    <div className=" w-full lg:max-w-5xl mx-auto flex flex-col px-3 py-2">
      <div className="flex justify-around items-center py-5">
        <div className="flex items-center gap-2">
          <img src="/src/images/logo.png" className="w-16" alt="" />
          <h1 className="font-bold italic text-2xl text-green-400">
            FitMission
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <Link to={"/dashboard"}>Dashboard</Link>
          <Link to={"/challenge"}>Challenge</Link>
          <Link to={"/activity"}>Activity</Link>
          <Link to={"/chatbot"}>AI</Link>
          <Link to={"/profile"}>Profile</Link>
          <h2 className="inline-flex gap-2 items-center">
            Welcome,{" "}
            {statistics.length > 0 ? (
              statistics.map((stat) => (
                <span className="text-2xl" key={stat.id}>
                  {stat.first_name}
                </span>
              ))
            ) : (
              <p>Loading...</p>
            )}
          </h2>
        </div>
      </div>
      <h1 className="text-3xl font-semibold text-primary">RECOMMENDED DIETS</h1>
      <div className="w-full">
        <Accordion type="single" collapsible>
          <AccordionItem value="item-1">
            <AccordionTrigger>Low-Carb Diet</AccordionTrigger>
            <AccordionContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="flex flex-col gap-2">
                  {LowCarbDiet.map((item, index) => (
                    <Card key={index + 1}>
                      <CardHeader className="flex flex-col gap-1">
                        <CardTitle className="text-xl text-primary">
                          {item.title}
                        </CardTitle>
                        <CardDescription className="text-black">
                          {item.description}
                        </CardDescription>
                      </CardHeader>
                    </Card>
                  ))}
                </div>
                <div>
                  <Card className="p-2">
                    <CardContent>
                      <div className="flex flex-col gap-2">
                        <div>
                          <h1 className="text-xl font-semibold uppercase">
                            Breakfast
                          </h1>
                          <div className="flex flex-col gap-1">
                            {lowCarbDishBf.map((item, index) => (
                              <p key={index}>{item.description}</p>
                            ))}
                          </div>
                        </div>
                        <div>
                          <h1 className="text-xl font-semibold uppercase">
                            Lunch
                          </h1>
                          {lowCarbDishLunch.map((item, index) => (
                            <p key={index}>{item.description}</p>
                          ))}
                        </div>
                        <div>
                          <h1 className="text-xl font-semibold uppercase">
                            Dinner
                          </h1>
                          {lowCarbDishDinner.map((item, index) => (
                            <p key={index}>{item.description}</p>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger>Vegetarian Diets</AccordionTrigger>
            <AccordionContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="flex flex-col gap-2">
                  {VegetarianDiet.map((item, index) => (
                    <Card key={index + 1}>
                      <CardHeader className="flex flex-col gap-1">
                        <CardTitle className="text-xl text-primary">
                          {item}
                        </CardTitle>
                      </CardHeader>
                    </Card>
                  ))}
                </div>
                <div>
                  <Card className="p-2">
                    <CardContent>
                      <div className="flex flex-col gap-2">
                        <div>
                          <h1 className="text-xl font-semibold uppercase">
                            Breakfast
                          </h1>
                          <div className="flex flex-col gap-1">
                            {VegetarianBF.map((item, index) => (
                              <p key={index}>{item}</p>
                            ))}
                          </div>
                        </div>
                        <div>
                          <h1 className="text-xl font-semibold uppercase">
                            Lunch
                          </h1>
                          {VegetarianLunch.map((item, index) => (
                            <p key={index}>{item}</p>
                          ))}
                        </div>
                        <div>
                          <h1 className="text-xl font-semibold uppercase">
                            Dinner
                          </h1>
                          {VegetarianDinner.map((item, index) => (
                            <p key={index}>{item}</p>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3">
            <AccordionTrigger>Intermittent Fasting</AccordionTrigger>
            <AccordionContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="flex flex-col gap-2">
                  {HeavyMeal.map((item, index) => (
                    <Card key={index + 1}>
                      <CardHeader className="flex flex-col gap-1">
                        <CardTitle className="text-xl text-primary">
                          {item}
                        </CardTitle>
                      </CardHeader>
                    </Card>
                  ))}
                </div>
                <div>
                  <Card className="p-2">
                    <CardContent>
                      <div className="flex flex-col gap-2">
                        <div>
                          <h1 className="text-xl font-semibold uppercase">
                            Breakfast
                          </h1>
                          <div className="flex flex-col gap-1">
                            {HeavyMealBf.map((item, index) => (
                              <p key={index}>{item}</p>
                            ))}
                          </div>
                        </div>
                        <div>
                          <h1 className="text-xl font-semibold uppercase">
                            Lunch
                          </h1>
                          {HeavyMealLunch.map((item, index) => (
                            <p key={index}>{item}</p>
                          ))}
                        </div>
                        <div>
                          <h1 className="text-xl font-semibold uppercase">
                            Dinner
                          </h1>
                          {HeavyMealDinner.map((item, index) => (
                            <p key={index}>{item}</p>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
      <div className="flex flex-col mt-5">
        <h1 className="text-3xl font-semibold text-primary">HOME WORKOUTS</h1>
        <Workout />
      </div>
    </div>
  );
};

export default Activity;
