import { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import useUser from "../hooks/useUser";

const UserStatistics = () => {
  const { user } = useUser();
  const [statistics, setStatistics] = useState([]);

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

  return (
    <div className="max-w-5xl mx-auto ">
      {statistics.map((item) => (
        <div key={item.id} className="flex items-center gap-3">
          <h1 className="py-5 px-3 text-2xl shadow-lg rounded-lg bg-green-400 text-white flex-1">
            WEIGHT: <span>{item.weight}kg</span>
          </h1>
          <h1 className="py-5 px-3 text-2xl shadow-lg rounded-lg bg-green-400 text-white flex-1">
            HEIGHT: <span>{item.height}cm</span>
          </h1>
          <h1 className="py-5 px-3 text-2xl shadow-lg rounded-lg bg-green-400 text-white flex-1">
            PROTEIN INTAKE: <span>{item.protein_intake} g</span>
          </h1>
        </div>
      ))}
    </div>
  );
};

export default UserStatistics;
