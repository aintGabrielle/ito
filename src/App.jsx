import { useState } from "react";
import { motion } from "framer-motion";
import "./index.css";
import { Link } from "react-router-dom";
import LandingNav from "./Components/LandingNav";

function App() {
  const cardData = [
    {
      title: "Challenges",
      image: "/src/images/challenge.jpg",
      description: "Join our fitness challenges",
    },
    {
      title: "Workout",
      image: "/src/images/workout.svg",
      description: "Get access to our workout plans",
    },
    {
      title: "Diet",
      image: "/src/images/diet.jpg",
      description: "Be guided on what to eat",
    },
  ];

  return (
    <>
      <LandingNav />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 px-3 py-10">
        <div className="my-auto flex flex-col order-2 md:order- gap-3 md:mx-auto">
          <p className="text-xl md:text-2xl md:max-w-2xl  px-5 text-gray-600 capitalize font-semibold justify-start order-1">
            <span className="text-2xl font-semibold italic text-green-400">
              FitMission
            </span>{" "}
            also fosters community-driven fitness challenges, allowing users to
            compete, collaborate, and stay motivated through friendly
            competition.
          </p>
          <Link
            className="bg-green-400 text-white font-bold order-2 w-fit p-3 rounded-xl ml-3"
            to="/signin"
          >
            GET STARTED
          </Link>
        </div>
        <img
          src="/src/images/workout.svg"
          className="w-full md:max-w-2xl mx-auto order-1 md:order-2"
          alt=""
        />
      </div>
      <div className="w-full h-fit py-12 bg-white">
        <div className="w-full h-full flex flex-col items-center justify-center gap-4 px-2">
          <motion.h1
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-5xl md:text-6xl lg:text-8xl font-bold text-green-400 uppercase"
          >
            Why Us?
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="max-w-sm md:max-w-lg text-gray-500 text-lg md:text-2xl font-semibold text-center capitalize"
          >
            Our platform is designed to help you achieve your fitness goals.
          </motion.p>
        </div>
        {/* Cards */}

        <div className="w-full h-fit grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 place-items-center gap-4 p-2 mt-20">
          {cardData.map((card, index) => (
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              key={index}
              id={`index_${index}`}
              className="w-full max-w-sm bg-white p-4 text-center space-y-3 rounded-lg shadow-xl shadow-green-400/20"
            >
              <h1 className="font-bold text-green-400 uppercase text-2xl md:text-5xl">
                {card.title}
              </h1>
              <p className="text-gray-600 font-semibold capitalize">
                {card.description}
              </p>
              <div className="max-w-md">
                <img src={card.image} alt="" />
              </div>
            </motion.div>
          ))}
        </div>
        {/* Features */}
        <div className="mt-20 pt-20 border-t-2 flex flex-col gap-12 border-green-100">
          <div className="grid grid-cols-1 md:grid-cols-2 items-center bg-white p-4 ">
            <img
              src="/src/images/fitness.svg"
              className="w-full max-w-[300px] md:max-w-[500px] mx-auto"
              alt=""
            />
            <div className="flex flex-col gap-3 mt-8 md:border md:border-green-400 md:p-5 rounded-3xl rounded-tl-none">
              <h2 className="text-green-400 font-bold text-5xl md:text-6xl italic">
                We Believe In You
              </h2>
              <p className="text-gray-500 font-semibold text-lg md:text-xl md:max-w-2xl">
                A whole journey of fitness can lead to a great way of changes in
                life, join FitMission today and take the first step towards a
                Healthier, Fitter you with our comprehensive fitness plans, and
                Supportive Community.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center bg-white p-4">
            <div className="flex flex-col gap-3 mt-8 mx-auto order-2 md:order-1 md:border-green-400 md:border md:p-5 rounded-3xl rounded-tr-none">
              <h2 className="text-green-400 font-bold text-5xl md:text-6xl italic">
                Artificial Intelligence
              </h2>
              <p className="text-gray-500 font-semibold text-lg md:text-xl md:max-w-2xl">
                Experience the future of fitness with FitMission's AI-powered
                system, providing personalized plans and real-time feedback to
                help you achieve your goals efficiently.
              </p>
            </div>
            <div className="order-1 md:order-2">
              <img
                src="/src/images/ai.svg"
                className="w-full max-w-[400px] md:max-w-[600px] mx-auto "
                alt=""
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 items-center bg-white p-4">
            <img
              src="/src/images/challenge.svg"
              className="w-full max-w-[300px] md:max-w-[400px] mx-auto"
              alt=""
            />
            <div className="flex flex-col gap-3 mt-8 md:border md:border-green-400 md:p-5 rounded-3xl rounded-tl-none">
              <h2 className="text-green-400 font-bold text-5xl md:text-6xl italic">
                Challenges
              </h2>
              <p className="text-gray-500 font-semibold text-lg md:text-xl md:max-w-2xl">
                Take on exciting fitness challenges with FitMission and push
                your limits to achieve new milestones in your fitness journey.
              </p>
            </div>
          </div>
        </div>
        <button className="flex mx-auto mt-20 bg-green-400 rounded-xl hover:bg-green-200 text-xl uppercase p-5">
          <Link to="/signin" className="text-white">
            Get Started
          </Link>
        </button>
      </div>
    </>
  );
}

export default App;
