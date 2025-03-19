import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Loader2, Repeat, CheckCircle } from "lucide-react";
import Nav from "./Nav";

const exercises = [
  { name: "Push-ups", reps: "15" },
  { name: "Squats", reps: "20" },
  { name: "Jumping Jacks", reps: "30" },
  { name: "Sit-ups", reps: "15" },
  { name: "Lunges", reps: "10 per leg" },
  { name: "Plank", reps: "30 seconds" },
  { name: "Burpees", reps: "10" },
];

const Task = () => {
  const [currentChallenge, setCurrentChallenge] = useState(null);
  const [timeLeft, setTimeLeft] = useState(30);
  const [isActive, setIsActive] = useState(false);
  const [completedChallenges, setCompletedChallenges] = useState(0);

  // Function to start or restart a challenge
  const startChallenge = () => {
    const randomIndex = Math.floor(Math.random() * exercises.length);
    setCurrentChallenge(exercises[randomIndex]);
    setTimeLeft(30);
    setIsActive(true);
  };

  // Function to restart the challenge without changing exercise
  const restartChallenge = () => {
    setTimeLeft(30);
    setIsActive(true);
  };

  // Countdown Timer
  useEffect(() => {
    let timer;
    if (isActive && timeLeft > 0) {
      timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    } else if (timeLeft === 0) {
      setIsActive(false); // Stop timer when it reaches 0
    }
    return () => clearTimeout(timer);
  }, [isActive, timeLeft]);

  // Mark challenge as completed
  const completeChallenge = () => {
    setCompletedChallenges(completedChallenges + 1);
    setIsActive(false);
  };

  return (
    <div className="flex md:flex-row h-screen bg-green-400">
      <Nav />
      <div className="flex-1 flex flex-col items-center justify-center p-6">
        <Card className="w-full max-w-md bg-white shadow-lg rounded-lg p-6 text-center">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-green-500">
              🎯 Fitness Challenge
            </CardTitle>
          </CardHeader>
          <CardContent>
            {currentChallenge ? (
              <>
                <motion.div
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.3 }}
                  className="text-xl font-semibold"
                >
                  {currentChallenge.name}:{" "}
                  <span className="text-blue-600">{currentChallenge.reps}</span>
                </motion.div>
                <p className="text-gray-500 text-sm mt-2">
                  Time left: {timeLeft}s
                </p>
                <div className="flex flex-wrap gap-4 mt-4 justify-center">
                  {timeLeft > 0 ? (
                    <>
                      <Button
                        onClick={completeChallenge}
                        className="bg-green-500 text-white"
                      >
                        <CheckCircle className="mr-2" /> Complete!
                      </Button>
                      <Button
                        onClick={restartChallenge}
                        className="bg-yellow-500 text-white"
                      >
                        <Repeat className="mr-2" /> Restart
                      </Button>
                    </>
                  ) : (
                    <Button
                      onClick={startChallenge}
                      className="bg-red-500 text-white"
                    >
                      <Repeat className="mr-2" /> Try Again
                    </Button>
                  )}
                </div>
              </>
            ) : (
              <>
                <p className="text-gray-500">
                  Click below to start your challenge!
                </p>
                <Button
                  onClick={startChallenge}
                  className="mt-4 bg-blue-500 text-white"
                >
                  Start Challenge
                </Button>
              </>
            )}
          </CardContent>
        </Card>
        <p className="text-gray-600 mt-4 text-sm">
          Completed Challenges: {completedChallenges}
        </p>
      </div>
    </div>
  );
};

export default Task;
