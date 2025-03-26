import React, { useState, useEffect, useCallback } from "react";
import "./index.css";
import { supabase } from "../supabaseClient";
// import OpenAI from 'openai'; // Uncomment if you have the SDK installed
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  Title,
  CategoryScale,
} from "chart.js";

ChartJS.register(LineElement, PointElement, LinearScale, Title, CategoryScale);

const mindfulMovementPrompts = [
  "Take 30 seconds for gentle shoulder rolls.",
  "Stand up and do 5 slow calf raises.",
  "Notice your posture and gently stretch your neck to each side.",
  "Close your eyes and take three deep breaths.",
  "Gently rotate your wrists and ankles.",
  // Add more prompts
];

const predefinedPrograms = [
  {
    id: 1,
    name: "3-Day Beginner Full Body",
    workouts: [
      /* Your program data */
    ],
  },
  {
    id: 2,
    name: "7-Day Core Challenge",
    workouts: [
      /* Your program data */
    ],
  },
];

const availableChallenges = [
  {
    id: 1,
    name: "7-Day Water Challenge",
    description: "Drink 8 glasses of water daily for a week.",
  },
  {
    id: 2,
    name: "30-Day Step Challenge",
    description: "Aim for 10,000 steps every day for 30 days.",
  },
];

const App = () => {
  const [userAssessment, setUserAssessment] = useState(null);
  const [aiWorkoutPlan, setAiWorkoutPlan] = useState(null);
  const [aiRecipeSuggestions, setAiRecipeSuggestions] = useState(null);
  const [aiChallenges, setAiChallenges] = useState(null);
  const [workoutLogs, setWorkoutLogs] = useState([]);
  const [currentLog, setCurrentLog] = useState({
    exercise: "",
    sets: "",
    reps: "",
  });
  const [fitnessGoals, setFitnessGoals] = useState([]);
  const [newGoal, setNewGoal] = useState("");
  const [activeProgram, setActiveProgram] = useState(null);
  const [activeChallenges, setActiveChallenges] = useState([]);
  const [mindfulMovementEnabled, setMindfulMovementEnabled] = useState(false);
  const [promptFrequency, setPromptFrequency] = useState(60); // in minutes
  const [promptIntervalId, setPromptIntervalId] = useState(null);
  const [currentPrompt, setCurrentPrompt] = useState(null);
  const [isPromptVisible, setIsPromptVisible] = useState(false);
  const [mindfulMovementLog, setMindfulMovementLog] = useState([]);

  useEffect(() => {
    fetchUserAssessment();
    fetchWorkoutLogs();
    fetchFitnessGoals();
    fetchActiveChallenges();
    fetchMindfulMovementLog();
  }, []);

  const fetchUserAssessment = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) {
      const { data, error } = await supabase
        .from("fitness_assessment")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (error) {
        console.error("Error fetching assessment:", error);
      } else if (data) {
        setUserAssessment(data);
        generateAiContent(data);
      } else {
        console.log("No assessment data found for user.");
      }
    }
  };

  const generateAiContent = async (assessment) => {
    if (!assessment) return;

    // const openai = new OpenAI({ apiKey: 'YOUR_OPENAI_API_KEY' });

    const promptBase = `Based on the following fitness assessment: ${JSON.stringify(
      assessment
    )}, please suggest:`;

    // try {
    //   const completion = await openai.chat.completions.create({
    //     model: "gpt-3.5-turbo",
    //     messages: [{ role: "user", content: `${promptBase} a personalized workout plan for the user.` }],
    //   });
    //   setAiWorkoutPlan(completion.choices[0].message.content);
    // } catch (error) {
    //   console.error('Error generating workout plan:', error);
    // }

    // try {
    //   const completion = await openai.chat.completions.create({
    //     model: "gpt-3.5-turbo",
    //     messages: [{ role: "user", content: `${promptBase} some recipe ideas that align with their goals and any dietary restrictions.` }],
    //   });
    //   setAiRecipeSuggestions(completion.choices[0].message.content);
    // } catch (error) {
    //   console.error('Error generating recipe suggestions:', error);
    // }

    // try {
    //   const completion = await openai.chat.completions.create({
    //     model: "gpt-3.5-turbo",
    //     messages: [{ role: "user", content: `${promptBase} some relevant fitness or diet challenges the user might be interested in.` }],
    //   });
    //   setAiChallenges(completion.choices[0].message.content);
    // } catch (error) {
    //   console.error('Error generating challenges:', error);
    // }

    setAiWorkoutPlan(
      "AI-generated workout plan will appear here based on your assessment."
    );
    setAiRecipeSuggestions("AI-generated recipe suggestions will appear here.");
    setAiChallenges("AI-generated challenge suggestions will appear here.");
  };

  const fetchWorkoutLogs = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) {
      const { data, error } = await supabase
        .from("workout_logs")
        .select("*")
        .eq("user_id", user.id)
        .order("date", { ascending: false });

      if (error) {
        console.error("Error fetching workout logs:", error);
      } else if (data) {
        setWorkoutLogs(data);
      }
    }
  };

  const handleLogInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentLog({ ...currentLog, [name]: value });
  };

  const logWorkout = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user && currentLog.exercise.trim()) {
      const { error } = await supabase.from("workout_logs").insert([
        {
          ...currentLog,
          user_id: user.id,
          date: new Date().toISOString().split("T")[0],
        },
      ]);

      if (error) {
        console.error("Error logging workout:", error);
      } else {
        setCurrentLog({ exercise: "", sets: "", reps: "" });
        fetchWorkoutLogs();
      }
    }
  };

  const fetchFitnessGoals = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) {
      const { data, error } = await supabase
        .from("fitness_goals")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching goals:", error);
      } else if (data) {
        setFitnessGoals(data);
      }
    }
  };

  const handleGoalInputChange = (e) => {
    setNewGoal(e.target.value);
  };

  const addGoal = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user && newGoal.trim()) {
      const { error } = await supabase
        .from("fitness_goals")
        .insert([{ user_id: user.id, text: newGoal, completed: false }]);

      if (error) {
        console.error("Error adding goal:", error);
      } else {
        setNewGoal("");
        fetchFitnessGoals();
      }
    }
  };

  const toggleGoalCompletion = async (id, completed) => {
    const { error } = await supabase
      .from("fitness_goals")
      .update({ completed: !completed })
      .eq("id", id);

    if (error) {
      console.error("Error updating goal:", error);
    } else {
      fetchFitnessGoals();
    }
  };

  const handleSelectProgram = (programId) => {
    const program = predefinedPrograms.find((p) => p.id === programId);
    setActiveProgram(program);
  };

  const fetchActiveChallenges = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) {
      const { data, error } = await supabase
        .from("user_challenges")
        .select("challenges(id, name, description)")
        .eq("user_id", user.id);

      if (error) {
        console.error("Error fetching active challenges:", error);
      } else if (data) {
        setActiveChallenges(data.map((item) => item.challenges));
      }
    }
  };

  const handleJoinChallenge = async (challengeId) => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user && !activeChallenges.some((c) => c.id === challengeId)) {
      const { error } = await supabase
        .from("user_challenges")
        .insert([{ user_id: user.id, challenge_id: challengeId }]);

      if (error) {
        console.error("Error joining challenge:", error);
      } else {
        fetchActiveChallenges();
      }
    }
  };

  const handleLeaveChallenge = async (challengeId) => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) {
      const { error } = await supabase
        .from("user_challenges")
        .delete()
        .eq("user_id", user.id)
        .eq("challenge_id", challengeId);

      if (error) {
        console.error("Error leaving challenge:", error);
      } else {
        fetchActiveChallenges();
      }
    }
  };

  const toggleMindfulMovement = () => {
    setMindfulMovementEnabled(!mindfulMovementEnabled);
  };

  const handleFrequencyChange = (event) => {
    setPromptFrequency(parseInt(event.target.value, 10));
  };

  const getRandomPrompt = useCallback(() => {
    if (!userAssessment) {
      return mindfulMovementPrompts[
        Math.floor(Math.random() * mindfulMovementPrompts.length)
      ];
    }

    const relevantPrompts = mindfulMovementPrompts.filter((prompt) => {
      // Example: Personalization logic based on userAssessment can be added here
      return true;
    });

    return relevantPrompts[Math.floor(Math.random() * relevantPrompts.length)];
  }, [mindfulMovementPrompts, userAssessment]);

  const triggerMindfulMovementPrompt = useCallback(() => {
    if (mindfulMovementEnabled) {
      const prompt = getRandomPrompt();
      setCurrentPrompt(prompt);
      setIsPromptVisible(true);
    }
  }, [getRandomPrompt, mindfulMovementEnabled]);

  useEffect(() => {
    if (mindfulMovementEnabled) {
      const intervalId = setInterval(() => {
        triggerMindfulMovementPrompt();
      }, promptFrequency * 60 * 1000);
      setPromptIntervalId(intervalId);
    } else {
      clearInterval(promptIntervalId);
      setPromptIntervalId(null);
    }
    return () => clearInterval(promptIntervalId);
  }, [mindfulMovementEnabled, promptFrequency, triggerMindfulMovementPrompt]);

  const logMindfulMovementCompletion = async (prompt) => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user && prompt) {
      const { error } = await supabase.from("mindful_movement_log").insert([
        {
          user_id: user.id,
          prompt: prompt,
          completed_at: new Date().toISOString(),
        },
      ]);

      if (error) {
        console.error("Error logging mindful movement:", error);
      } else {
        fetchMindfulMovementLog();
      }
    }
  };

  const fetchMindfulMovementLog = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) {
      const { data, error } = await supabase
        .from("mindful_movement_log")
        .select("*")
        .eq("user_id", user.id)
        .order("completed_at", { ascending: false })
        .limit(10);

      if (error) {
        console.error("Error fetching mindful movement log:", error);
      } else if (data) {
        setMindfulMovementLog(data);
      }
    }
  };

  // Example data for a workout frequency graph
  const workoutFrequencyData = {
    labels: workoutLogs.map((log) => log.date).reverse(),
    datasets: [
      {
        label: "Workouts Logged",
        data: workoutLogs
          .reduce((acc, curr) => {
            const dateIndex = acc.findIndex((item) => item.date === curr.date);
            if (dateIndex !== -1) {
              acc[dateIndex].count += 1;
            } else {
              acc.push({ date: curr.date, count: 1 });
            }
            return acc;
          }, [])
          .sort((a, b) => new Date(a.date) - new Date(b.date))
          .map((item) => item.count),
        fill: false,
        borderColor: "rgb(75, 192, 192)",
        tension: 0.1,
      },
    ],
  };

  const workoutFrequencyOptions = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: "Workout Frequency Over Time",
      },
    },
    scales: {
      yAxes: {
        title: {
          display: true,
          text: "Number of Workouts",
        },
        ticks: {
          beginAtZero: true,
          stepSize: 1,
        },
      },
      xAxes: {
        title: {
          display: true,
          text: "Date",
        },
      },
    },
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">
        Your AI-Powered Fitness & Diet Hub
      </h1>

      {userAssessment ? (
        <div>
          <section className="mb-6 p-4 border rounded shadow-md">
            <h2 className="text-xl font-semibold mb-2">Your Assessment</h2>
            <pre>{JSON.stringify(userAssessment, null, 2)}</pre>
          </section>

          <section className="mb-6 p-4 border rounded shadow-md">
            <h2 className="text-xl font-semibold mb-2">
              AI-Generated Workout Plan
            </h2>
            {aiWorkoutPlan ? (
              <p className="whitespace-pre-line">{aiWorkoutPlan}</p>
            ) : (
              <p>Generating workout plan...</p>
            )}
          </section>

          <section className="mb-6 p-4 border rounded shadow-md">
            <h2 className="text-xl font-semibold mb-2">
              AI-Generated Recipe Suggestions
            </h2>
            {aiRecipeSuggestions ? (
              <p className="whitespace-pre-line">{aiRecipeSuggestions}</p>
            ) : (
              <p>Generating recipe suggestions...</p>
            )}
          </section>

          <section className="mb-6 p-4 border rounded shadow-md">
            <h2 className="text-xl font-semibold mb-2">
              AI-Generated Challenge Suggestions
            </h2>
            {aiChallenges ? (
              <p className="whitespace-pre-line">{aiChallenges}</p>
            ) : (
              <p>Generating challenge suggestions...</p>
            )}
          </section>

          <section className="mb-6 p-4 border rounded shadow-md">
            <h2 className="text-xl font-semibold mb-2">Progress Tracking</h2>
            <div className="mb-4 flex space-x-2">
              <input
                type="text"
                name="exercise"
                value={currentLog.exercise}
                onChange={handleLogInputChange}
                placeholder="Exercise"
                className="shadow appearance-none border rounded w-1/2 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
              <input
                type="number"
                name="sets"
                value={currentLog.sets}
                onChange={handleLogInputChange}
                placeholder="Sets"
                className="shadow appearance-none border rounded w-1/4 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
              <input
                type="number"
                name="reps"
                value={currentLog.reps}
                onChange={handleLogInputChange}
                placeholder="Reps"
                className="shadow appearance-none border rounded w-1/4 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
              <button
                onClick={logWorkout}
                className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded mt-2"
              >
                Log Workout
              </button>
            </div>
            {workoutLogs.length > 0 && (
              <div>
                <h3 className="font-semibold mb-1">Workout History</h3>
                <ul>
                  {workoutLogs.map((log) => (
                    <li key={log.id} className="mb-1">
                      {log.date}: {log.exercise} - {log.sets} sets x {log.reps}{" "}
                      reps
                    </li>
                  ))}
                </ul>
                <div className="mt-4">
                  <h3 className="font-semibold mb-2">Workout Frequency</h3>
                  <Line
                    data={workoutFrequencyData}
                    options={workoutFrequencyOptions}
                  />
                </div>
              </div>
            )}
          </section>

          <section className="mb-6 p-4 border rounded shadow-md">
            <h2 className="text-xl font-semibold mb-2">Goal Setting</h2>
            <div className="mb-4 flex">
              <input
                type="text"
                value={newGoal}
                onChange={handleGoalInputChange}
                placeholder="Enter your fitness goal"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mr-2"
              />
              <button
                onClick={addGoal}
                className="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded"
              >
                Add Goal
              </button>
            </div>
            {fitnessGoals.length > 0 && (
              <ul>
                {fitnessGoals.map((goal) => (
                  <li
                    key={goal.id}
                    className={`mb-1 ${
                      goal.completed ? "line-through text-gray-500" : ""
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={goal.completed}
                      onChange={() =>
                        toggleGoalCompletion(goal.id, goal.completed)
                      }
                      className="mr-2"
                    />
                    {goal.text}
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className="mb-6 p-4 border rounded shadow-md">
            <h2 className="text-xl font-semibold mb-2">Structured Programs</h2>
            <ul>
              {predefinedPrograms.map((program) => (
                <li key={program.id} className="mb-2">
                  <button
                    onClick={() => handleSelectProgram(program.id)}
                    className="bg-teal-500 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded"
                  >
                    View {program.name}
                  </button>
                  {/* Display program description if available */}
                </li>
              ))}
            </ul>
            {activeProgram && (
              <div className="mt-4 p-4 border rounded">
                <h3 className="font-semibold mb-2">{activeProgram.name}</h3>
                {activeProgram.workouts &&
                  activeProgram.workouts.map((workout, index) => (
                    <div key={index} className="mb-2">
                      <h4 className="font-semibold">{workout.day}</h4>
                      <ul>
                        {workout.exercises.map((exercise, i) => (
                          <li key={i}>- {exercise}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                <button
                  onClick={() => setActiveProgram(null)}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded mt-2"
                >
                  End Program
                </button>
              </div>
            )}
          </section>

          <section className="mb-6 p-4 border rounded shadow-md">
            <h2 className="text-xl font-semibold mb-2">Challenges</h2>
            <h3 className="font-semibold mb-1">Available Challenges</h3>
            <ul>
              {availableChallenges.map((challenge) => (
                <li
                  key={challenge.id}
                  className="mb-2 flex items-center justify-between"
                >
                  <div>
                    <h4 className="font-semibold">{challenge.name}</h4>
                    <p className="text-gray-600 text-sm">
                      {challenge.description}
                    </p>
                  </div>
                  <button
                    onClick={() => handleJoinChallenge(challenge.id)}
                    disabled={activeChallenges.some(
                      (c) => c.id === challenge.id
                    )}
                    className={`bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded ${
                      activeChallenges.some((c) => c.id === challenge.id)
                        ? "opacity-50 cursor-not-allowed"
                        : ""
                    }`}
                  >
                    Join
                  </button>
                </li>
              ))}
            </ul>

            {activeChallenges.length > 0 && (
              <div className="mt-4">
                <h3 className="font-semibold mb-1">Your Active Challenges</h3>
                <ul>
                  {activeChallenges.map((challenge) => (
                    <li
                      key={challenge.id}
                      className="mb-2 flex items-center justify-between"
                    >
                      <div>
                        <h4 className="font-semibold">{challenge.name}</h4>
                        <p className="text-gray-600 text-sm">
                          {challenge.description}
                        </p>
                      </div>
                      <button
                        onClick={() => handleLeaveChallenge(challenge.id)}
                        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                      >
                        Leave
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </section>

          <section className="mb-6 p-4 border rounded shadow-md">
            <h2 className="text-xl font-semibold mb-2">
              Mindful Movement Prompts
            </h2>
            <div className="flex items-center mb-2">
              <label className="mr-2">Enable Prompts:</label>
              <input
                type="checkbox"
                className="form-checkbox h-5 w-5 text-indigo-600"
                checked={mindfulMovementEnabled}
                onChange={toggleMindfulMovement}
              />
            </div>
            {mindfulMovementEnabled && (
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Prompt Frequency (minutes):
                </label>
                <input
                  type="number"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  value={promptFrequency}
                  onChange={handleFrequencyChange}
                  min="15"
                  max="120"
                />
              </div>
            )}
          </section>

          <section className="mb-6 p-4 border rounded shadow-md">
            <h2 className="text-xl font-semibold mb-2">Mindful Movement Log</h2>
            {mindfulMovementLog.length > 0 ? (
              <ul>
                {mindfulMovementLog.map((log) => (
                  <li key={log.id} className="py-1 border-b last:border-b-0">
                    <span className="text-gray-600">
                      {new Date(log.completed_at).toLocaleTimeString()}
                    </span>{" "}
                    - {log.prompt}
                  </li>
                ))}
              </ul>
            ) : (
              <p>No mindful movements logged yet.</p>
            )}
          </section>

          <section className="p-4 border rounded shadow-md">
            <h2 className="text-xl font-semibold mb-2">Progress Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 border rounded">
                <h3 className="font-semibold mb-2">Workout Summary</h3>
                {workoutLogs.length > 0 ? (
                  <p>You've logged {workoutLogs.length} workouts.</p>
                ) : (
                  <p>No workouts logged yet.</p>
                )}
                <Line
                  data={workoutFrequencyData}
                  options={workoutFrequencyOptions}
                />
              </div>

              <div className="p-4 border rounded">
                <h3 className="font-semibold mb-2">Goal Progress</h3>
                {fitnessGoals.length > 0 ? (
                  <ul>
                    {fitnessGoals.map((goal) => (
                      <li
                        key={goal.id}
                        className={`${
                          goal.completed ? "line-through text-gray-500" : ""
                        }`}
                      >
                        {goal.text} -{" "}
                        {goal.completed ? "Completed" : "In Progress"}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No goals set yet.</p>
                )}
              </div>

              <div className="p-4 border rounded md:col-span-2">
                <h3 className="font-semibold mb-2">Active Challenges</h3>
                {activeChallenges.length > 0 ? (
                  <ul>
                    {activeChallenges.map((challenge) => (
                      <li key={challenge.id}>{challenge.name}</li>
                    ))}
                  </ul>
                ) : (
                  <p>No active challenges.</p>
                )}
              </div>

              {isPromptVisible && currentPrompt && (
                <div className="fixed bottom-8 left-8 bg-white border rounded-md shadow-lg p-4 z-50">
                  <h3 className="font-semibold mb-2">
                    Time for a Gentle Movement
                  </h3>
                  <p className="mb-2">{currentPrompt}</p>
                  <button
                    onClick={handleDismissPrompt}
                    className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
                  >
                    Done
                  </button>
                </div>
              )}
            </div>
          </section>
        </div>
      ) : (
        <p>Loading user assessment...</p>
      )}
    </div>
  );
};

export default App;
