import React from "react";
import { Link } from "react-router-dom";

const LandingNav = () => {
  return (
    <nav className="flex justify-around items-center px-3 py-2 w-full top-0 left-0 sticky bg-white">
      <div className="flex items-center gap-2">
        <img src="/src/images/logo.png" className="w-16" alt="" />
        <h3 className="font-bold text-xl text-green-400 italic">FitMission</h3>
      </div>
      <div>
        <Link
          to={"/signin"}
          className="text-white bg-green-400 font-semibold px-3 py-2 rounded-lg"
        >
          GET STARTED
        </Link>
      </div>
    </nav>
  );
};

export default LandingNav;
