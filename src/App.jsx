import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import LandingNav from "./Components/LandingNav";
import Nav from "./Components/Nav";
import { Button } from "./Components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./Components/ui/card";
import "./index.css";
import Footer from "./Components/Footer";

function FeatureSection({ title, description, imageSrc, imageAlt, imageLeft }) {
  return (
    <>
      <div className="grid grid-cols-1 gap-8 items-center md:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, x: imageLeft ? -30 : 0 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className={`flex justify-center ${
            imageLeft ? "md:order-1" : "md:order-2"
          }`}
        >
          <img
            src={imageSrc || "/placeholder.svg"}
            alt={imageAlt}
            className="w-[300px] md:max-w-[400px] md:w-full"
          />
        </motion.div>

        {/* <Nav /> */}
        <motion.div
          initial={{ opacity: 0, x: imageLeft ? 30 : -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className={`${imageLeft ? "md:order-2" : "md:order-1"}`}
        >
          <h3 className="text-secondary">{title}</h3>
          <p>{description}</p>
        </motion.div>
      </div>
    </>
  );
}

function App() {
  const cardData = [
    {
      title: "Challenges",
      image: "/images/challenge.jpg",
      description: "Join our fitness challenges",
    },
    {
      title: "Workout",
      image: "/images/workout.svg",
      description: "Get access to our workout plans",
    },
    {
      title: "Diet",
      image: "/images/diet.jpg",
      description: "Be guided on what to eat",
    },
  ];

  return (
    <>
      <LandingNav />

      <main className="flex flex-col items-center px-3 mx-auto w-full max-w-7xl min-h-screen">
        {/* Hero Section */}
        <div className="grid grid-cols-1 gap-10 py-12 md:grid-cols-2">
          <div className="flex flex-col order-2 gap-6 my-auto text-center md:order-1 md:text-left">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              Transform Your Fitness Journey
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <span className="text-xl italic font-semibold text-primary">
                FitMission
              </span>{" "}
              fosters community-driven fitness challenges, allowing users to
              compete, collaborate, and stay motivated through friendly
              competition.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Link href="/signin">
                <Button size="lg" className="text-lg font-medium">
                  GET STARTED
                </Button>
              </Link>
            </motion.div>
          </div>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7 }}
            className="flex order-1 justify-center md:order-2"
          >
            <img
              src="/images/workout.svg"
              className="w-[300px] md:w-[450px]"
              alt="Person working out"
              priority
            />
          </motion.div>
        </div>

        {/* Why Us Section */}
        <section className="py-16 w-full bg-background">
          <div className="flex flex-col gap-2 justify-center items-center mb-16">
            <motion.h1
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              Why Us?
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Our platform is designed to help you achieve your fitness goals
              with expert guidance and community support.
            </motion.p>
          </div>

          {/* Cards */}
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {cardData.map((card, index) => (
              <motion.div
                key={`cards_${index}`}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-2xl">{card.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <p>{card.description}</p>
                    <div className="overflow-hidden relative w-full h-48 rounded-md">
                      <img
                        src={card.image || "/placeholder.svg"}
                        fill
                        alt={`${card.title} illustration`}
                        className="object-contain"
                      />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16">
          <div className="space-y-20">
            <FeatureSection
              title="We Believe In You"
              description="A whole journey of fitness can lead to a great way of changes in life, join FitMission today and take the first step towards a Healthier, Fitter you with our comprehensive fitness plans, and Supportive Community."
              imageSrc="/images/fitness.svg"
              imageAlt="Fitness journey illustration"
              imageLeft={true}
            />

            <FeatureSection
              title="Artificial Intelligence"
              description="Experience the future of fitness with FitMission's AI-powered system, providing personalized plans and real-time feedback to help you achieve your goals efficiently."
              imageSrc="/images/ai.svg"
              imageAlt="AI fitness technology illustration"
              imageLeft={false}
            />

            <FeatureSection
              title="Challenges"
              description="Take on exciting fitness challenges with FitMission and push your limits to achieve new milestones in your fitness journey."
              imageSrc="/images/challenge.svg"
              imageAlt="Fitness challenges illustration"
              imageLeft={true}
            />
          </div>

          <div className="flex justify-center mt-16">
            <Link href="/signin">
              <Button size="lg">GET STARTED TODAY</Button>
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
// <div className="grid grid-cols-1 gap-10 px-3 py-10 md:grid-cols-2">
//   <div className="flex flex-col order-2 gap-3 my-auto md:order- md:mx-auto">
//     <p className="order-1 justify-start px-5 text-xl font-semibold text-gray-600 capitalize md:text-2xl md:max-w-2xl">
//       <span className="text-2xl italic font-semibold">FitMission</span>{" "}
//       also fosters community-driven fitness challenges, allowing users to
//       compete, collaborate, and stay motivated through friendly
//       competition.
//     </p>

//     <Link to="/signin">
//       <Button size="lg">GET STARTED</Button>
//     </Link>
//   </div>
//   <img
//     src="/images/workout.svg"
//     className="order-1 mx-auto w-full md:max-w-2xl md:order-2"
//     alt=""
//   />
// </div>
// <div className="py-12 w-full bg-white h-fit">
//   <div className="flex flex-col gap-4 justify-center items-center px-2 w-full h-full">
//     <motion.h1
//       initial={{ opacity: 0 }}
//       whileInView={{ opacity: 1 }}
//       className="text-5xl font-bold text-green-400 uppercase md:text-6xl lg:text-8xl"
//     >
//       Why Us?
//     </motion.h1>
//     <motion.p
//       initial={{ opacity: 0 }}
//       whileInView={{ opacity: 1 }}
//       className="max-w-sm text-lg font-semibold text-center text-gray-500 capitalize md:max-w-lg md:text-2xl"
//     >
//       Our platform is designed to help you achieve your fitness goals.
//     </motion.p>
//   </div>
//   {/* Cards */}

//   <div className="grid grid-cols-1 gap-4 place-items-center p-2 mt-20 w-full h-fit md:grid-cols-2 lg:grid-cols-3">
//     {cardData.map((card, index) => (
//       <motion.div
//         initial={{ opacity: 0 }}
//         whileInView={{ opacity: 1 }}
//         key={index}
//         id={`index_${index}`}
//         className="p-4 space-y-3 w-full max-w-sm text-center bg-white rounded-lg shadow-xl shadow-green-400/20"
//       >
//         <h1 className="text-2xl font-bold text-green-400 uppercase md:text-5xl">
//           {card.title}
//         </h1>
//         <p className="font-semibold text-gray-600 capitalize">
//           {card.description}
//         </p>
//         <div className="max-w-md">
//           <img src={card.image} alt="" />
//         </div>
//       </motion.div>
//     ))}
//   </div>
//   {/* Features */}
//   <div className="flex flex-col gap-12 pt-20 mt-20 border-t-2 border-green-100">
//     <div className="grid grid-cols-1 items-center p-4 bg-white md:grid-cols-2">
//       <img
//         src="/images/fitness.svg"
//         className="w-full max-w-[300px] md:max-w-[500px] mx-auto"
//         alt=""
//       />
//       <div className="flex flex-col gap-3 mt-8 rounded-3xl rounded-tl-none md:border md:border-green-400 md:p-5">
//         <h2 className="text-5xl italic font-bold text-green-400 md:text-6xl">
//           We Believe In You
//         </h2>
//         <p className="text-lg font-semibold text-gray-500 md:text-xl md:max-w-2xl">
//           A whole journey of fitness can lead to a great way of changes in
//           life, join FitMission today and take the first step towards a
//           Healthier, Fitter you with our comprehensive fitness plans, and
//           Supportive Community.
//         </p>
//       </div>
//     </div>
//     <div className="grid grid-cols-1 gap-4 items-center p-4 bg-white md:grid-cols-2">
//       <div className="flex flex-col order-2 gap-3 mx-auto mt-8 rounded-3xl rounded-tr-none md:order-1 md:border-green-400 md:border md:p-5">
//         <h2 className="text-5xl italic font-bold text-green-400 md:text-6xl">
//           Artificial Intelligence
//         </h2>
//         <p className="text-lg font-semibold text-gray-500 md:text-xl md:max-w-2xl">
//           Experience the future of fitness with FitMission's AI-powered
//           system, providing personalized plans and real-time feedback to
//           help you achieve your goals efficiently.
//         </p>
//       </div>
//       <div className="order-1 md:order-2">
//         <img
//           src="/images/ai.svg"
//           className="w-full max-w-[400px] md:max-w-[600px] mx-auto "
//           alt=""
//         />
//       </div>
//     </div>
//     <div className="grid grid-cols-1 items-center p-4 bg-white md:grid-cols-2">
//       <img
//         src="/images/challenge.svg"
//         className="w-full max-w-[300px] md:max-w-[400px] mx-auto"
//         alt=""
//       />
//       <div className="flex flex-col gap-3 mt-8 rounded-3xl rounded-tl-none md:border md:border-green-400 md:p-5">
//         <h2 className="text-5xl italic font-bold text-green-400 md:text-6xl">
//           Challenges
//         </h2>
//         <p className="text-lg font-semibold text-gray-500 md:text-xl md:max-w-2xl">
//           Take on exciting fitness challenges with FitMission and push
//           your limits to achieve new milestones in your fitness journey.
//         </p>
//       </div>
//     </div>
//   </div>
//   <button className="flex p-5 mx-auto mt-20 text-xl uppercase bg-green-400 rounded-xl hover:bg-green-200">
//     <Link to="/signin" className="text-white">
//       Get Started
//     </Link>
//   </button>
// </div>

export default App;
