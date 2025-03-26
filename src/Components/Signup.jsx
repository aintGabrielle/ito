import React, { useState, useEffect } from "react";
import { useAuth } from "../Context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { signUpNewUser, signUpWithGoogle, signInWithGoogle, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const checkUserExists = async () => {
      if (!user) return;

      console.log("Checking if user exists in database...");

      const { data, error } = await supabase
        .from("fitness_assessments")
        .select("user_id")
        .eq("user_id", user.id)
        .maybeSingle();

      if (error) {
        console.error("Error checking user:", error.message);
      } else if (data) {
        console.log("User found, redirecting to dashboard...");
        navigate("/dashboard"); // ✅ Redirect returning users to dashboard
      } else {
        console.log("New user, redirecting to assessment...");
        navigate("/dashboard"); // ✅ Redirect new users to assessment
      }

      setLoading(false);
    };

    checkUserExists();
  }, [user, navigate]);

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!email || !password || !confirmPassword) {
      setError("All fields are required.");
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }

    try {
      const result = await signUpNewUser(email, password);
      if (result.success) {
        navigate("/dashboard");
      } else {
        setError(result.error || "Signup failed. Try again.");
      }
    } catch (error) {
      setError("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    try {
      const result = await signUpWithGoogle();

      if (result.success) {
        console.log("Google Sign-up Successful:", result.user);
        setTimeout(() => navigate("/dashboard"), 1000); // ✅ Redirect new users to assessment
      } else {
        setError(result.error || "Google sign-up failed.");
      }
    } catch (error) {
      setError("An unexpected error occurred.");
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
          <p className="text-gray-600">Create your account</p>
        </div>

        <form onSubmit={handleSignUp} className="mt-4 space-y-4">
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

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Confirm Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm your password"
              className="w-full px-3 py-2 border rounded-lg shadow-sm focus:ring-green-400 focus:border-green-400"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-500 text-white py-2 rounded-lg text-lg font-semibold hover:bg-green-600 transition-all"
          >
            {loading ? "Signing up..." : "Sign Up"}
          </button>

          <button
            type="button"
            onClick={handleGoogleSignUp}
            className="w-full flex items-center justify-center gap-2 bg-white border py-2 rounded-lg text-lg font-semibold shadow-md hover:bg-gray-100 transition-all"
          >
            <FcGoogle className="text-2xl" /> Sign up with Google
          </button>

          {error && (
            <p className="text-red-500 text-sm text-center mt-2">{error}</p>
          )}

          <div className="text-center mt-3">
            <p className="text-gray-600">
              Already have an account?{" "}
              <Link className="text-green-500 font-semibold" to="/signin">
                Sign-in
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

export default Signup;
