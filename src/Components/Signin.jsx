import React, { useState, useEffect } from "react";
import { useAuth } from "../Context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Checkbox } from "./ui/checkbox";
import { Button } from "./ui/button";
import LandingNav from "./LandingNav";

const Signin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { signInUser, signInWithGoogle, signUpWithGoogle } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const savedEmail = localStorage.getItem("rememberedEmail");
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, []);

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
      if (rememberMe) {
        localStorage.setItem("rememberedEmail", email);
      } else {
        localStorage.removeItem("rememberedEmail");
      }

      const result = await signInUser(email, password);
      if (result.success) {
        if (result.isNewUser) {
          navigate("/dashboard");
        } else {
          navigate("/assessment");
        }
      } else {
        setError(result.error || "Invalid email or password.");
      }
    } catch (error) {
      setError("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const result = await signUpWithGoogle();

      if (result.success) {
        const { user } = result;

        // Check if the user exists in the profiles table
        const { data: profile, error } = await supabase
          .from("fitness_assessments") // Change "profiles" if necessary
          .select("user_id")
          .eq("user_id", user.id)
          .single();

        if (!profile) {
          navigate("/assessment");
        } else {
          navigate("/dashboard");
        }
      } else {
        setError(result.error || "Google sign-in failed.");
      }
    } catch (error) {
      setError("");
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
            <p>Sign in to continue</p>
          </div>

          <form onSubmit={handleSignIn} className="flex flex-col gap-2 mt-2">
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

            <div className="flex justify-between items-center py-3">
              <Label className="flex items-center text-sm">
                <Checkbox
                  checked={rememberMe}
                  onCheckedChange={() => setRememberMe(!rememberMe)}
                  className="mr-2"
                />
                Remember me
              </Label>
              <Link
                className="text-sm font-semibold text-primary"
                to="/forgot-password"
              >
                Forgot password?
              </Link>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full"
              size="lg"
            >
              {loading ? "Signing in..." : "Sign In"}
            </Button>

            <Button
              type="button"
              onClick={handleGoogleSignIn}
              className="w-full"
              variant="outline"
              size="lg"
            >
              <FcGoogle className="text-2xl" /> Sign in with Google
            </Button>

            <div className="mt-3 text-center">
              <p>
                Don't have an account?{" "}
                <Link className="font-semibold text-primary" to="/signup">
                  Sign-up
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Signin;
