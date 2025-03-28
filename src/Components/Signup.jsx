import React, { useState, useEffect } from "react";
import { useAuth } from "../Context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import LandingNav from "./LandingNav";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Input } from "./ui/input";

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
    <>
      <LandingNav />
      <div className="flex justify-center items-center px-3 min-h-screen bg-background">
        <div className="p-5 w-full max-w-md rounded-lg border-2 shadow-lg border-border">
          <div className="text-center">
            <img
              src="/images/logo.png"
              className="mx-auto mb-2 w-16"
              alt="Logo"
            />
            <h3 className="text-primary">FitMission</h3>
            <p>Create your account</p>
          </div>

          <form onSubmit={handleSignUp} className="flex flex-col gap-2 mt-2">
            <div>
              <Label>Email</Label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
              />
            </div>

            <div>
              <Label>Password</Label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
              />
            </div>

            <div className="mb-5">
              <Label>Confirm Password</Label>
              <Input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your password"
                required
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full"
              size="lg"
            >
              {loading ? "Signing up..." : "Sign Up"}
            </Button>

            <Button
              type="button"
              onClick={handleGoogleSignUp}
              className="w-full"
              variant="outline"
              size="lg"
            >
              <FcGoogle className="text-2xl" /> Sign up with Google
            </Button>

            {error && (
              <p className="mt-2 text-sm text-center text-red-500">{error}</p>
            )}

            <div className="mt-5 text-center">
              <p>
                Already have an account?{" "}
                <Link className="font-semibold text-primary" to="/signin">
                  Sign-in
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Signup;
