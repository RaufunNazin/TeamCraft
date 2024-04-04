import { slide as Menu } from "react-burger-menu";
import "../index.css";
import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { Modal } from "antd";

const Sidebar = () => {
  const navigate = useNavigate();
  let location = useLocation();
  const [logoutModal, setLogoutModal] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isOpen, setOpen] = useState(false);

  const to = (address) => {
    setOpen(false);
    navigate(`/${address}`);
  };

  useEffect(() => {
    const CheckIsLoggedIn = () => {
      const token = localStorage.getItem("token");
      if (token) {
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
        navigate("/login", { state: "login again" });
      }
    };

    CheckIsLoggedIn();
  }, []);

  const logout = () => {
    localStorage.setItem("token", "");
    localStorage.setItem("user", "");
    navigate("/login", { state: "logout" });
  };

  return (
    <div
      className={`${
        location.pathname === "/register" ||
        location.pathname === "/login" ||
        location.pathname === "*"
          ? "hideButton"
          : ""
      }`}
    >
      <Menu
        right
        isOpen={isOpen}
        onOpen={() => setOpen(!isOpen)}
        onClose={() => setOpen(!isOpen)}
      >
        <div className="menu-item">
          <div onClick={() => to("")}>Home</div>
        </div>
        <div className="menu-item">
          <div onClick={() => to("myteam")}>My Team</div>
        </div>
        <div className="menu-item">
          <div onClick={() => to("playerlist")}>Player List</div>
        </div>

        {isLoggedIn ? (
          <div
            className="menu-item"
            onClick={() => {
              setLogoutModal(true);
              setOpen(false);
            }}
          >
            <div>Logout</div>
          </div>
        ) : (
          <div className="menu-item">
            <div onClick={() => to("login")}>Login</div>
          </div>
        )}
      </Menu>
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

export default Sidebar;
