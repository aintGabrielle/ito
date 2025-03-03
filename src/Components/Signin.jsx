import React from "react";
import { useState } from "react";
import { UserAuth } from "../Context/AuthContext";
import { Link, useNavigate } from "react-router-dom";

const Signin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState("");

  const { session, signInUser } = UserAuth();
  const navigate = useNavigate();

  const handleSignIn = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await signInUser(email, password);

      if (result.success) {
        navigate("/dashboard");
      }
    } catch (error) {
      setError("Error occured");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="flex justify-center items-center flex-col w-full h-screen p-5">
      <div className="grid grid-cols-1 lg:grid-cols-2 items-center w-full max-w-3xl mx-auto p-5 shadow-md rounded-xl">
        <form onSubmit={handleSignIn} className="">
          <div className="flex items-center justify-around">
            <div className="flex items-center gap-2">
              <img src="/src/images/logo.png" className="w-14" alt="" />
              <h1 className="text-xl font-bold text-green-400 italic">
                FitMission
              </h1>
            </div>
            <div>
              <p className="text-xl font-bold uppercase text-green-400">
                Sign-In
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
              Sign In
            </button>
            <p className="text-lg">
              Don't have an account?{" "}
              <Link className="font-semibold text-green-400" to={"/signup"}>
                Sign-up
              </Link>
            </p>
            <Link to={"/"}>Back to home</Link>
            {error && <p>{Error}</p>}
          </div>
        </form>
        <div className="hidden lg:block">
          <img src="/images/cycling.jpg" className="w-full" alt="" />
        </div>
      </div>
    </div>
  );
};

export default Signin;
