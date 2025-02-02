import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const SlipCreate = () => {
  const [rollNo, setRollNo] = useState("");
  const [quantities, setQuantities] = useState({
    jeans: "",
    pant: "",
    shirt: "",
    tshirt: "",
    lower: "",
    shorts: "",
    towel: "",
    bsheets: "",
    pillowCover: "",
    dohar: "",
    socks: "",
    shoes: "",
    blanket: "",
    jacket: "",
    sweater: "",
    hoodie: "",
    bag: "",
    hankey: "",
    curtain: "",
  });

  const [isWorker, setIsWorker] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserRole = async () => {
      const token = localStorage.getItem("authToken");
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(`${import.meta.env.REACT_APP_API_URL}profile/`, {
          headers: { Authorization: `Token ${token}` },
        });

        setIsWorker(response.data.role === "worker");
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
      setLoading(false);
    };

    fetchUserRole();
  }, []);

  const handleChange = (item, value) => {
    setQuantities((prev) => ({
      ...prev,
      [item]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("authToken");
    try {
      await axios.post(
        `${import.meta.env.REACT_APP_API_URL}create-slip/`,
        { roll_no: rollNo, particulars: quantities },
        { headers: { Authorization: `Token ${token}`, "Content-Type": "application/json" } }
      );

      alert("Slip created successfully!");
      setRollNo("");
      setQuantities({
        jeans: "",
        pant: "",
        shirt: "",
        tshirt: "",
        lower: "",
        shorts: "",
        towel: "",
        bsheets: "",
        pillowCover: "",
        dohar: "",
        socks: "",
        shoes: "",
        blanket: "",
        jacket: "",
        sweater: "",
        hoodie: "",
        bag: "",
        hankey: "",
        curtain: "",
      });
    } catch (error) {
      console.error("Error creating slip:", error);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="p-6 bg-pink-200 min-h-screen">
      {isWorker ? (
        <>
          <h1 className="text-center text-2xl font-extrabold mb-4 text-gray-800">
            Create Laundry Slip
          </h1>
          <form onSubmit={handleSubmit} className="p-4 bg-white shadow-lg rounded-lg border-2 border-gray-800">
            <div className="mb-6">
              <label className="block text-sm font-bold mb-2">Roll Number</label>
              <input
                type="text"
                value={rollNo}
                onChange={(e) => setRollNo(e.target.value)}
                placeholder="Enter Roll Number"
                className="w-full px-2 py-1 border border-gray-700 rounded text-sm font-medium"
                required
              />
            </div>

            <div>
              <h2 className="text-lg font-bold mb-4">Particulars</h2>
              <div className="grid grid-cols-2 gap-4 border-t border-gray-800 pt-4">
                {Object.keys(quantities).map((item) => (
                  <div key={item} className="flex items-center">
                    <label className="w-1/3 capitalize">{item.replace(/_/g, " ")}</label>
                    <input
                      type="number"
                      value={quantities[item]}
                      onChange={(e) => handleChange(item, e.target.value)}
                      placeholder="Qty"
                      className="w-1/3 capitalize font-bold text-gray-800 text-sm"
                      min="0"
                    />
                  </div>
                ))}
              </div>
            </div>

            <button
              type="submit"
              className="btn block w-full px-4 py-2 bg-gray-800 text-white font-bold rounded hover:bg-gray-900"
            >
              Create Slip
            </button>
          </form>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center h-full">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h2>
          <p className="text-lg text-gray-800 mb-4">You must be logged in as a worker to create a slip.</p>
          <button
            className="btn px-4 py-2 bg-blue-600 text-white font-bold rounded hover:bg-blue-700"
            onClick={() => navigate("/Login/LaundryWorker/")}
          >
            Login
          </button>
        </div>
      )}
    </div>
  );
};

export default SlipCreate;
