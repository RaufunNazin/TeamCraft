import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import api from "../api";
import { Table, Modal } from "antd";
import Column from "antd/es/table/Column";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const MyTeam = () => {
  const [tab, setTab] = useState("TEST");
  const [players, setPlayers] = useState([]);
  const [playersLoading, setPlayersLoading] = useState(false);
  const [viewDetails, setViewDetails] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState({});

  const deletePlayer = () => {
    api
      .post(
        `/removeplayers/${
          JSON.parse(localStorage.getItem("user")).user_id
        }/${tab}/`,
        {
          player_ids: [selectedPlayer.player_id],
        }
      )
      .then(() => {
        toast.success("Player deleted successfully");
      })
      .catch((err) => {
        toast.error(err.response.data.error);
      })
      .finally(() => {
        setOpenDelete(false);
        getProfile();
      });
  };

  const getProfile = () => {
    setPlayersLoading(true);
    api
      .get(`/user/${JSON.parse(localStorage.getItem("user")).user_id}/`)
      .then((res) => {
        setPlayers(
          res.data.teams?.find((team) => team.team_type === tab).players
        );
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => setPlayersLoading(false));
  };

  useEffect(() => {
    getProfile();
  }, [tab]);
  return (
    <div className="min-h-screen">
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
      <div className="shadow-md">
        <Navbar active="myteam" />
      </div>
      <div className="flex border border-xred w-fit rounded-md mx-auto mt-5 lg:mt-10">
        <button
          className={`text-xl px-6 lg:px-10 py-1.5 lg:py-3 rounded-l-md ${
            tab === "TEST"
              ? "bg-xred text-white"
              : "hover:bg-slate-100 hover:text-xdark transition-all duration-200"
          }`}
          onClick={() => {
            setTab("TEST");
          }}
        >
          Test
        </button>
        <button
          className={`text-xl px-6 lg:px-10 py-1.5 lg:py-3 ${
            tab === "ODI"
              ? "bg-xred text-white"
              : "hover:bg-slate-100 hover:text-xdark transition-all duration-200"
          }`}
          onClick={() => {
            setTab("ODI");
          }}
        >
          ODI
        </button>
        <button
          className={`text-xl px-6 lg:px-10 py-1.5 lg:py-3 rounded-r-md ${
            tab === "T20"
              ? "bg-xred text-white"
              : "hover:bg-slate-100 hover:text-xdark transition-all duration-200"
          }`}
          onClick={() => {
            setTab("T20");
          }}
        >
          T20
        </button>
      </div>
      <div className="overflow-x-auto px-2 lg:px-16 mt-5 lg:mt-10">
        <Table
          loading={playersLoading}
          dataSource={players}
          rowKey="player_id"
          style={{ overflowX: "auto" }}
          pagination={{ pageSize: 15 }}
        >
          <Column
            title="Name"
            dataIndex="player_name"
            sorter={(a, b) => a.player_name.localeCompare(b.player_name)}
          ></Column>
          <Column
            title="Type"
            dataIndex="player_type"
            sorter={(a, b) => a.player_type.localeCompare(b.player_type)}
          ></Column>
          <Column
            title="Action"
            dataIndex="action"
            render={(text, record) => {
              return (
                <div className="flex gap-x-2 lg:gap-x-4">
                  <button
                    className="border border-xblue hover:bg-xblue hover:text-white transition-all duration-200 text-xblue px-3 py-1 rounded-md"
                    onClick={() => {
                      setSelectedPlayer(record);
                      setViewDetails(true);
                    }}
                  >
                    Details
                  </button>
                  <button
                    className="border border-xred hover:bg-xred hover:text-white transition-all duration-200 text-xred px-3 py-1 rounded-md"
                    onClick={() => {
                      setSelectedPlayer(record);
                      setOpenDelete(true);
                    }}
                  >
                    Delete
                  </button>
                </div>
              );
            }}
          ></Column>
        </Table>
      </div>
      <Modal
        title={`Details of ${selectedPlayer.player_name}`}
        open={viewDetails}
        onOk={() => setViewDetails(false)}
        okText="Close"
        cancelButtonProps={{ style: { display: "none" } }}
        closable={false}
        centered
      >
        <div className="mx-2 my-4 grid grid-cols-2 gap-y-4 lg:mx-4 lg:my-8">
          {Object.entries(selectedPlayer)
            .filter(([key]) => !key.includes("normalized"))
            .filter(
              ([key, value]) =>
                key !== "player_id" && key !== "player_photo" && value !== 0
            )
            .map(([key, value]) => (
              <div key={key} className="flex flex-col">
                <p className="text-sm font-semibold text-xgray">
                  {key
                    .split("_")
                    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(" ")}
                </p>
                <p className="text-xdark">{value}</p>
              </div>
            ))}
        </div>
      </Modal>
      <Modal
        title="Delete User"
        open={openDelete}
        onOk={deletePlayer}
        okText="Delete"
        onCancel={() => setOpenDelete(false)}
        closable={false}
        centered
      >
        <div className="mx-2 my-4">
          Are you sure you want to delete{" "}
          <p className="inline font-semibold">{selectedPlayer.player_name}</p>?
        </div>
      </Modal>
    </div>
  );
};

export default MyTeam;
