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
        setSession(session);
        setUser(session?.user || null);
      }
    );

    return () => subscription?.subscription?.unsubscribe();
  }, []);

  // ✅ Sign Up with Email/Password
  const signUpNewUser = async (email, password) => {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) {
      console.error("Sign-up error:", error.message);
      return { success: false, error: error.message };
    }
    return { success: true, user: data.user };
  };

  // ✅ Sign In with Email/Password
  const signInUser = async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error("Sign-in failed:", error.message);
        return { success: false, error: error.message };
      }

      const session = data.session;
      const user = data.user;

      // ✅ Skip new-user check if OAuth user
      if (session?.provider_token) {
        return { success: true, isNewUser: false };
      }

      const { data: profile, error: profileError } = await supabase
        .from("fitness_assessments")
        .select("user_id")
        .eq("user_id", user.id)
        .maybeSingle();

      if (profileError) {
        console.error("Profile check error:", profileError.message);
        return { success: true, isNewUser: true };
      }

      if (!profile) {
        return { success: true, isNewUser: true };
      }

      return { success: true, isNewUser: false };
    } catch (err) {
      console.error("Unexpected error during sign-in:", err);
      return { success: false, error: "Unexpected error during sign-in." };
    }
  };

  // ✅ Sign In with Google (OAuth)
  const signInWithGoogle = async () => {
    try {
      const redirectURL =
        import.meta.env.MODE === "localhost"
          ? "http://localhost:5174/auth-redirect"
          : "https://devops-fitmission-app.vercel.app/auth-redirect";

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

  // ✅ Sign Up with Google (same as sign-in in Supabase OAuth)
  const signUpWithGoogle = async () => {
    try {
      const redirectURL =
        import.meta.env.MODE === "localhost"
          ? "http://localhost:5174/auth-redirect"
          : "https://devops-fitmission-app.vercel.app/auth-redirect";

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

  // ✅ Sign Out
  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error("Sign-out error:", error.message);
        return { success: false, error: error.message };
      }

      setSession(null);
      setUser(null);
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
        <p className="text-lg text-center text-gray-600">Loading...</p>
      )}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
