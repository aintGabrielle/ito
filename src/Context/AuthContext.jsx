import { createContext, useEffect, useState, useContext } from "react";
import { supabase } from "../supabaseClient";

const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const restoreSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        console.error("Error restoring session:", error.message);
      }
      setSession(data?.session);
      setUser(data?.session?.user || null);
      setLoading(false);
    };

    restoreSession();

    const { data: subscription } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        console.log("Auth state changed:", session);
        setSession(session);
        setUser(session?.user || null);
      }
    );

    return () => subscription?.subscription?.unsubscribe();
  }, []);

  // ✅ Sign Up
  const signUpNewUser = async (email, password) => {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) {
      console.error("Sign-up error:", error.message);
      return { success: false, error: error.message };
    }
    return { success: true, user: data.user };
  };

  // ✅ Sign In
  const signInUser = async (email, password) => {
    try {
      console.log("Attempting login for:", email);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error("Sign-in failed:", error.message);
        return { success: false, error: error.message };
      }

      const user = data.user;

      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("id")
        .eq("id", user.id)
        .single();

      if (profileError || !profile) {
        console.log("New user detected. Redirecting to assessment...");
        return { success: true, isNewUser: true };
      }

      console.log("Existing user detected. Redirecting to dashboard...");
      return { success: true, isNewUser: false };
    } catch (err) {
      console.error("Unexpected error during sign-in:", err);
      return { success: false, error: "Unexpected error during sign-in." };
    }
  };

  // sign in with Google

  const signInWithGoogle = async () => {
    try {
      const redirectURL =
        import.meta.env.MODE === "localhost"
          ? "http://localhost:5173/dashboard"
          : "https://fitmission-zeta.vercel.app/assessment";

      console.log("Google Sign-In Redirecting to:", redirectURL);

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo: redirectURL },
      });

      if (error) {
        console.error("Google Sign-in Error:", error.message);
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (err) {
      console.error("Unexpected error during Google Sign-in:", err);
      return {
        success: false,
        error: err.message || "An unexpected error occurred.",
      };
    }
  };

  // Sign Up with Google

  const signUpWithGoogle = async () => {
    try {
      const redirectURL =
        import.meta.env.MODE === "localhost"
          ? "http://localhost:5173/assessment"
          : "https://fitmission-zeta.vercel.app/assessment";

      console.log("Google Sign-Up Redirecting to:", redirectURL);

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo: redirectURL },
      });

      if (error) {
        console.error("Google Sign-up Error:", error.message);
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (err) {
      console.error("Unexpected error during Google Sign-up:", err);
      return {
        success: false,
        error: err.message || "An unexpected error occurred.",
      };
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error("Sign-out error:", error.message);
        return { success: false, error: error.message };
      }

      setSession(null);
      setUser(null);
      console.log("User signed out successfully.");
      return { success: true };
    } catch (err) {
      console.error("Unexpected error during sign-out:", err);
      return { success: false, error: "Unexpected error during sign-out." };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        session,
        user,
        signOut,
        signUpNewUser,
        signInUser,
        signInWithGoogle,
        signUpWithGoogle,
      }}
    >
      {!loading ? (
        children
      ) : (
        <p className="text-center text-lg text-gray-600">Loading...</p>
      )}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
