import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient"; // Adjust the import path as needed

const AuthRedirect = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        try {
          const { data: profile, error: profileError } = await supabase
            .from("user_profiles")
            .select("id")
            .eq("id", user.id)
            .single();

          if (profileError || !profile) {
            console.log("New user detected. Redirecting to assessment...");
            navigate("/assessment");
          } else {
            console.log("Existing user detected. Redirecting to dashboard...");
            navigate("/dashboard");
          }
        } catch (error) {
          console.error("Error checking profile:", error);
          // Handle error appropriately, maybe redirect to an error page
          navigate("/"); // Or an error page
        }
      } else {
        // No user, redirect to login or home
        navigate("/"); // Or your login page
      }
    };

    checkAuth();
  }, [navigate]);

  return (
    <div>
      {/* You can add a loading indicator here if you want */}
      <p>Checking authentication...</p>
    </div>
  );
};

export default AuthRedirect;
