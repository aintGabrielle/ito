import React from "react";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";

const LandingNav = () => {
  return (
    <nav className="flex fixed top-0 z-40 justify-center px-3 py-3 w-full bg-background">
      <div className="flex justify-between items-center w-full max-w-7xl">
        <div className="flex gap-2 items-center">
          <img src="/images/logo.png" className="w-12" alt="" />
          <h5>FitMission</h5>
        </div>
        <div className="flex gap-3 items-center">
          <Link to="/signin">
            <Button size="sm">GET STARTED</Button>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default LandingNav;
