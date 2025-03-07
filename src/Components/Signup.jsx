import React, { useState } from "react";
import { useAuth } from "@/Context/AuthContext"; // ✅ Correct import
import { Link, useNavigate } from "react-router-dom";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // Changed from ""

  const { session, signUpNewUser } = useAuth(); // ✅ Now correctly using useAuth
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await signUpNewUser(email, password);

      if (result.success) {
        navigate("/assessment");
      } else {
        setError("Signup failed. Try again.");
      }
    } catch (error) {
      setError("An error occurred while signing up.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center flex-col w-full h-screen p-5">
      <div className="grid grid-cols-1 lg:grid-cols-2 items-center w-full max-w-3xl mx-auto p-5 shadow-md rounded-xl">
        <form onSubmit={handleSignUp}>
          <div className="flex items-center justify-around">
            <div className="flex items-center gap-2">
              <img src="/images/logo.png" className="w-14" alt="Logo" />
              <h1 className="text-xl font-bold text-green-400 italic">
                FitMission
              </h1>
            </div>
            <div>
              <p className="text-xl font-bold uppercase text-green-400">
                Sign-UP
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-3 mt-3">
            <input
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              placeholder="Enter email"
              className="border-b border-green-400 py-3 px-2 focus:ring-1 focus:ring-green-400 focus:outline-none bg-green-400 text-white placeholder:text-white rounded-lg"
            />
            <input
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              placeholder="Enter password"
              className="border-b border-green-400 py-3 px-2 focus:ring-1 focus:ring-green-400 focus:outline-none bg-green-400 text-white placeholder:text-white rounded-lg"
            />
            <button
              type="submit"
              disabled={loading}
              className="bg-yellow-400 px-2 py-3 rounded-lg text-xl text-white"
            >
              {loading ? "Signing up..." : "Sign Up"}
            </button>
            <p className="text-lg">
              Already have an account?{" "}
              <Link className="font-semibold text-green-400" to={"/signin"}>
                Sign-in
              </Link>
            </p>
            <Link to={"/"}>Back to home</Link>
            {error && <p className="text-red-500">{error}</p>}{" "}
            {/* ✅ Correct error display */}
          </div>
        </form>
        <div className="hidden lg:block">
          <img
            src="/images/fitness.svg"
            className="w-full mx-auto"
            alt="Fitness"
          />
        </div>
      </div>
    </div>
  );
};

export default Signup;
