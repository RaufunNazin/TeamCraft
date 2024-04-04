import React, { useState } from "react";
import { BiCricketBall } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
import { Modal } from "antd";

const Navbar = ({ active }) => {
  const navigate = useNavigate();
  const [logoutModal, setLogoutModal] = useState(false);
  const logout = () => {
    localStorage.setItem("token", "");
    localStorage.setItem("user", "");
    navigate("/login", { state: "logout" });
  };
  return (
    <div className="w-full py-2 lg:py-5 flex justify-between items-center px-3 lg:px-16">
      <button
        className="flex items-center gap-x-2"
        onClick={() => {
          navigate("/");
        }}
      >
        <BiCricketBall className="text-xl lg:text-4xl text-xred" />
        <div className="text-xl font-bold font-sans text-xdark lg:text-3xl">
          CricSelector
        </div>
      </button>
      <div className="lg:flex hidden lg:gap-x-8 text-xl">
        <button
          className={`${
            active === "myteam"
              ? "text-xred underline underline-offset-4"
              : "text-xdark"
          } font-sans font-bold`}
          onClick={() => navigate("/myteam")}
        >
          My Team
        </button>
        <button
          className={`${
            active === "playerlist"
              ? "text-xred underline underline-offset-4"
              : "text-xdark"
          } font-sans font-bold`}
          onClick={() => navigate("/playerlist")}
        >
          Player List
        </button>
        {localStorage.getItem("token") !== "" ? (
          <button
            className={`"text-xdark font-sans font-bold`}
            onClick={() => setLogoutModal(true)}
          >
            Logout
          </button>
        ) : (
          <button
            className={`"text-xdark font-sans font-bold`}
            onClick={() => navigate("/login")}
          >
            Login
          </button>
        )}
      </div>
      <Modal
        title="Confirmation"
        open={logoutModal}
        okText={"Log out"}
        onOk={() => {
          logout();
          setLogoutModal(false);
        }}
        onCancel={() => setLogoutModal(false)}
        centered
      >
        <div>Are you sure you want to log out?</div>
      </Modal>
    </div>
  );
};

export default Navbar;
