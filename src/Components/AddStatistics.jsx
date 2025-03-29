import { useState } from "react";
import { supabase } from "../supabaseClient";
import { Link } from "react-router-dom";
import useCurrentUser from "@/hooks/use-current-user";

const AddStatistics = () => {
  const [able, setAble] = useState(true);
  const { user } = useCurrentUser();
  const [formData, setFormData] = useState({
    weight: "",
    height: "",
    protein_intake: "",
    age: "",
    first_name: "",
    last_name: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const addRecord = async () => {
    if (!user) {
      console.error("No user found!");
      return;
    }

    const { data, error } = await supabase.from("statistics").insert([
      {
        ...formData,
        user_id: user.id,
      },
    ]);

    if (error) console.error(error);
    else console.log("Record added:", data);
  };

  return (
    <div className="flex flex-col justify-center items-center w-full h-screen">
      <div className="p-5 mx-auto rounded-lg shadow-lg">
        <h2 className="mb-2 text-lg text-green-400">
          We would like to know you more so we can give <br /> what's suited for
          you!
        </h2>
        <div className="flex flex-col gap-3 max-w-4xl">
          <input
            className="px-3 py-2 text-xl text-green-400 border-b border-green-400"
            name="first_name"
            type="text"
            placeholder="First Name"
            onChange={handleChange}
          />
          <input
            className="px-3 py-2 text-xl text-green-400 border-b border-green-400"
            name="last_name"
            type="text"
            placeholder="Last Name"
            onChange={handleChange}
          />
          <input
            className="px-3 py-2 text-xl text-green-400 border-b border-green-400"
            name="age"
            type="number"
            placeholder="Age"
            onChange={handleChange}
          />
          <input
            className="px-3 py-2 text-xl text-green-400 border-b border-green-400"
            name="weight"
            type="number"
            placeholder="Weight in KG"
            onChange={handleChange}
          />
          <input
            className="px-3 py-2 text-xl text-green-400 border-b border-green-400"
            name="height"
            type="number"
            placeholder="Height in CM"
            onChange={handleChange}
          />
          <input
            className="px-3 py-2 text-xl text-green-400 border-b border-green-400"
            name="protein_intake"
            type="number"
            placeholder="Protein Intake"
            onChange={handleChange}
          />
        </div>
        <div className="flex flex-col gap-3 mt-3">
          <button
            onClick={addRecord}
            className="px-3 py-2 w-full font-semibold text-white bg-yellow-400 rounded-lg"
          >
            Add Statistics
          </button>
          <button
            disabled={able}
            className="px-3 py-2 w-full font-semibold text-white bg-green-400 rounded-lg"
          >
            <Link to={"/dashboard"} className="">
              LOGIN
            </Link>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddStatistics;
