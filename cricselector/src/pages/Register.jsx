import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { BiCricketBall } from "react-icons/bi";
import api from "../api";

const Register = () => {
  const [Name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      register();
    }
  };
  const register = () => {
    api
      .post("/register/", {
        name: Name,
        username: username,
        password: password,
      })
      .then((res) => {
        api
          .post("/login/", {
            username: username,
            password: password,
          })
          .then((res) => {
            localStorage.setItem("user", JSON.stringify(res.data.user));
            localStorage.setItem("token", res.data.token);
            navigate("/", { state: "login" });
          });
      })
      .catch((err) => {
        toast.error(err.response.data.error);
      });
  };
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-y-8">
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        draggable={true}
        pauseOnHover={false}
        theme="colored"
      />
      <div className="fixed top-8 flex items-center gap-x-2 lg:gap-x-4 lg:top-16">
        <BiCricketBall className="text-3xl lg:text-5xl text-xred" />
        <p className="text-3xl font-bold text-xdark lg:text-5xl">
          CricSelector
        </p>
      </div>
      <div className="flex flex-col items-center gap-y-2">
        <p className="text-3xl font-black text-xgray lg:text-4xl">
          Create your account
        </p>
        <p className="lg:text-md text-sm text-xgray">
          Revolution, to creating the ultimate team.
        </p>
      </div>
      <div className="flex w-[360px] flex-col gap-y-8 lg:w-[400px]">
        <div className="flex flex-col gap-y-6">
          <input
            type="text"
            placeholder="Name"
            className="w-full rounded-md border border-[#DED2D9] px-2 py-3 focus:border-transparent focus:outline-none focus:ring-1 focus:ring-xred"
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="text"
            placeholder="Username"
            className="w-full rounded-md border border-[#DED2D9] px-2 py-3 focus:border-transparent focus:outline-none focus:ring-1 focus:ring-xred"
            onChange={(e) => setUsername(e.target.value)}
          />
          <div className="flex flex-col gap-y-2">
            <input
              type="password"
              placeholder="Password"
              className="w-full rounded-md border border-[#DED2D9] px-2 py-3 focus:border-transparent focus:outline-none focus:ring-1 focus:ring-xred"
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={handleKeyPress}
            />
          </div>
        </div>
        <div>
          <button
            type="button"
            onClick={register}
            className="w-full rounded-md bg-xred p-3 text-lg font-medium text-white hover:bg-red-800 transition-all duration-200"
          >
            Register
          </button>
          <div className="flex justify-between items-center mt-3">
            <div className="text-sm text-xlightgray">
              Already have an account?
            </div>
            <button
              className="text-xred hover:text-red-800 transition-all duration-200 hover:underline"
              onClick={() => navigate("/login")}
            >
              Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
