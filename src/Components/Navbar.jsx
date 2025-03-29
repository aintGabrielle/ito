import { useAuth } from "@/Context/AuthContext";
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import { Button } from "./ui/button";
import { Menu, X } from "lucide-react";
import useCurrentUser from "@/hooks/use-current-user";

const Navbar = () => {
  const { session, signOut } = useAuth();
  const { user } = useCurrentUser();
  const [statistics, setStatistics] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserStatistics = async () => {
      if (!user) return;
      const { data, error } = await supabase
        .from("statistics")
        .select("*")
        .eq("user_id", user.id);
      if (error) console.error(error);
      else setStatistics(data);
    };
    fetchUserStatistics();
  }, [user]);

  const handleSignOut = async (e) => {
    e.preventDefault();
    try {
      await signOut();
      navigate("/");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 w-fit bg-white shadow-lg h-screen transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out md:translate-x-0 md:relative md:flex z-50`}
      >
        <div className="flex flex-col p-5 h-full">
          <div className="flex justify-between items-center mb-6">
            <div className="flex gap-2 items-center">
              <img src="/images/logo.png" className="w-12" alt="Logo" />
              <h1 className="text-xl italic font-bold text-green-500">
                FitMission
              </h1>
            </div>
            <button
              className="p-2 text-gray-700 md:hidden"
              onClick={() => setIsOpen(false)}
            >
              <X size={24} />
            </button>
          </div>
          <nav className="flex flex-col space-y-4">
            <Link to="/dashboard" className="hover:text-green-500">
              Dashboard
            </Link>
            <Link to="/challenge" className="hover:text-green-500">
              Tracker
            </Link>
            <Link to="/activity" className="hover:text-green-500">
              Activity
            </Link>
            <Link to="/chatbot" className="hover:text-green-500">
              Coach
            </Link>
            {/* <Link to="/profile" className="hover:text-green-500">
              Profile
            </Link> */}
          </nav>
          <div className="mt-auto">
            <h2 className="text-sm text-gray-500">
              Welcome,{" "}
              {statistics.length > 0 ? statistics[0].first_name : "Loading..."}
            </h2>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 transition-all duration-300">
        <header className="flex justify-between items-center px-6 py-4 bg-white shadow-md md:hidden">
          <button className="p-2 text-gray-700" onClick={() => setIsOpen(true)}>
            <Menu size={24} />
          </button>
          <h1 className="text-xl italic font-bold text-green-500">
            FitMission
          </h1>
        </header>
        <main className="p-6">{/* Your main content goes here */}</main>
      </div>
    </div>
  );
};

export default Navbar;
