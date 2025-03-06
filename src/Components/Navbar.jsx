import { useAuth } from "@/Context/AuthContext";
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import useUser from "../hooks/useUser";
import { Button } from "./ui/button";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const { session, signOut } = useAuth();
  const { user } = useUser();
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
        className={`fixed top-0 left-0 w-64 bg-white shadow-lg h-screen transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out md:translate-x-0 md:relative md:flex z-50`}
      >
        <div className="p-5 flex flex-col h-full">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <img src="/images/logo.png" className="w-12" alt="Logo" />
              <h1 className="font-bold italic text-xl text-green-500">
                FitMission
              </h1>
            </div>
            <button
              className="md:hidden p-2 text-gray-700"
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
              Challenge
            </Link>
            <Link to="/activity" className="hover:text-green-500">
              Activity
            </Link>
            <Link to="/chatbot" className="hover:text-green-500">
              Coach
            </Link>
            <Link to="/profile" className="hover:text-green-500">
              Profile
            </Link>
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
      <div className="flex-1 flex flex-col transition-all duration-300 md:ml-64">
        <header className="bg-white shadow-md py-4 px-6 flex justify-between items-center md:hidden">
          <button className="p-2 text-gray-700" onClick={() => setIsOpen(true)}>
            <Menu size={24} />
          </button>
          <h1 className="font-bold italic text-xl text-green-500">
            FitMission
          </h1>
        </header>
        <main className="p-6">{/* Your main content goes here */}</main>
      </div>
    </div>
  );
};

export default Navbar;
