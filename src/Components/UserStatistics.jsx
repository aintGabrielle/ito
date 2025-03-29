import { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import useCurrentUser from "@/hooks/use-current-user";

const UserStatistics = () => {
  const { user } = useCurrentUser();
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
    <div className="mx-auto max-w-5xl">
      {statistics.map((item) => (
        <div key={item.id} className="flex gap-3 items-center">
          <h1 className="flex-1 px-3 py-5 text-2xl text-white bg-green-400 rounded-lg shadow-lg">
            WEIGHT: <span>{item.weight}kg</span>
          </h1>
          <h1 className="flex-1 px-3 py-5 text-2xl text-white bg-green-400 rounded-lg shadow-lg">
            HEIGHT: <span>{item.height}cm</span>
          </h1>
          <h1 className="flex-1 px-3 py-5 text-2xl text-white bg-green-400 rounded-lg shadow-lg">
            PROTEIN INTAKE: <span>{item.protein_intake} g</span>
          </h1>
        </div>
      ))}
    </div>
  );
};

export default UserStatistics;
