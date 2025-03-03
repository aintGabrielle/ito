import { UserAuth } from "@/Context/AuthContext";
import React, { useState } from "react";
import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import useUser from "../hooks/useUser";

const Navbar = () => {
  const { session, signOut } = UserAuth();
  const { user } = useUser();
  const [statistics, setStatistics] = useState([]);
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
    <div className="flex justify-around items-center py-5">
      <div className="flex items-center gap-2">
        <img src="/src/images/logo.png" className="w-16" alt="" />
        <h1 className="font-bold italic text-2xl text-green-400">FitMission</h1>
      </div>
      <div className="flex items-center gap-3">
        <Link to={"/dashboard"}>Dashboard</Link>
        <Link to={"/challenge"}>Challenge</Link>
        <Link to={"/activity"}>Activity</Link>
        <Link to={"/message"}>AI</Link>
        <Link to={"/profile"}>Profile</Link>
        <h2 className="inline-flex gap-2 items-center">
          Welcome,{" "}
          {statistics.length > 0 ? (
            statistics.map((stat) => (
              <span className="text-2xl" key={stat.id}>
                {stat.first_name}
              </span>
            ))
          ) : (
            <p>Loading...</p>
          )}
        </h2>
      </div>
    </div>
  );
};

export default Navbar;
