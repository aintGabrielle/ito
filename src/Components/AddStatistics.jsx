import { useState } from "react";
import { supabase } from "../supabaseClient";
import useUser from "../hooks/useUser";
import { Link } from "react-router-dom";

const AddStatistics = () => {
  const [able, setAble] = useState(true);
  const { user } = useUser();
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
    <div className="flex justify-center items-center flex-col w-full h-screen">
      <div className=" p-5 rounded-lg shadow-lg  mx-auto">
        <h2 className="text-lg mb-2 text-green-400">
          We would like to know you more so we can give <br /> what's suited for
          you!
        </h2>
        <div className="flex flex-col max-w-4xl gap-3 ">
          <input
            className="border-b border-green-400 px-3 py-2 text-green-400 text-xl"
            name="first_name"
            type="text"
            placeholder="First Name"
            onChange={handleChange}
          />
          <input
            className="border-b border-green-400 px-3 py-2 text-green-400 text-xl"
            name="last_name"
            type="text"
            placeholder="Last Name"
            onChange={handleChange}
          />
          <input
            className="border-b border-green-400 px-3 py-2 text-green-400 text-xl"
            name="age"
            type="number"
            placeholder="Age"
            onChange={handleChange}
          />
          <input
            className="border-b border-green-400 px-3 py-2 text-green-400 text-xl"
            name="weight"
            type="number"
            placeholder="Weight in KG"
            onChange={handleChange}
          />
          <input
            className="border-b border-green-400 px-3 py-2 text-green-400 text-xl"
            name="height"
            type="number"
            placeholder="Height in CM"
            onChange={handleChange}
          />
          <input
            className="border-b border-green-400 px-3 py-2 text-green-400 text-xl"
            name="protein_intake"
            type="number"
            placeholder="Protein Intake"
            onChange={handleChange}
          />
        </div>
        <div className="flex flex-col gap-3 mt-3">
          <button
            onClick={addRecord}
            className="w-full bg-yellow-400 text-white px-3 py-2 rounded-lg font-semibold"
          >
            Add Statistics
          </button>
          <button
            disabled={able}
            className="w-full bg-green-400 text-white px-3 py-2 rounded-lg font-semibold"
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
