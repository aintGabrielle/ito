import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

const AuthRedirect = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError) {
        console.error("Error fetching session:", sessionError.message);
        return navigate("/");
      }

      const user = session?.user;

      if (user) {
        // ✅ If OAuth user (Google), redirect directly to dashboard
        if (session?.provider_token) {
          console.log("OAuth user detected. Redirecting to dashboard...");
          return navigate("/dashboard");
        }

        try {
          const { data: profile, error: profileError } = await supabase
            .from("fitness_assessments")
            .select("user_id")
            .eq("user_id", user.id)
            .maybeSingle();

          if (profileError) {
            console.error("Error fetching profile:", profileError.message);
            return navigate("/");
          }

          if (!profile) {
            console.log("New user detected. Redirecting to assessment...");
            navigate("/assessment");
          } else {
            console.log("Existing user detected. Redirecting to dashboard...");
            navigate("/dashboard");
          }
        } catch (error) {
          console.error("Error checking profile:", error);
          navigate("/");
        }
      } else {
        // No user, redirect to login or home
        navigate("/");
      }
    };

    checkAuth();
  }, [navigate]);

  return (
    <div className="text-center py-10 text-lg text-gray-600">
      Checking authentication...
    </div>
  );
};

export default AuthRedirect;
