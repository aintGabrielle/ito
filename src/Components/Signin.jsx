import React, { useState } from "react";
import { useAuth } from "../Context/AuthContext";
import { Link, useNavigate } from "react-router-dom";

const Signin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { signInUser } = useAuth();
  const navigate = useNavigate();

  const handleSignIn = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!email || !password) {
      setError("Email and password are required.");
      setLoading(false);
      return;
    }

    try {
      console.log("Signing in with:", email);

      const result = await signInUser(email, password);

      if (result.success) {
        console.log("Login successful:", result.user);
        navigate("/dashboard");
      } else {
        console.error("Login failed:", result.error);
        setError(result.error || "Invalid email or password.");
      }
    } catch (error) {
      console.error("Unexpected error:", error);
      setError("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-6">
        <div className="text-center">
          <img
            src="/images/logo.png"
            className="w-16 mx-auto mb-2"
            alt="Logo"
          />
          <h1 className="text-2xl font-bold text-green-500">FitMission</h1>
          <p className="text-gray-600">Sign in to continue</p>
        </div>

        <form onSubmit={handleSignIn} className="mt-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full px-3 py-2 border rounded-lg shadow-sm focus:ring-green-400 focus:border-green-400"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full px-3 py-2 border rounded-lg shadow-sm focus:ring-green-400 focus:border-green-400"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-500 text-white py-2 rounded-lg text-lg font-semibold hover:bg-green-600 transition-all"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>

          {error && (
            <p className="text-red-500 text-sm text-center mt-2">{error}</p>
          )}

          <div className="text-center mt-3">
            <p className="text-gray-600">
              Don't have an account?{" "}
              <Link className="text-green-500 font-semibold" to="/signup">
                Sign-up
              </Link>
            </p>
            <Link className="text-gray-500 text-sm mt-2 block" to="/">
              Back to home
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signin;
