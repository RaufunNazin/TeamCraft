import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Select } from "antd";
import api from "../api";
import { FcOk } from "react-icons/fc";
import { Modal } from "antd";

const PlayerList = () => {
  const [playerType, setPlayerType] = useState("batsman");
  const [playerAttributes, setPlayerAttributes] = useState({});
  const [sortedPlayers, setSortedPlayers] = useState([]);
  const [selectedPlayers, setSelectedPlayers] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [confirmModal, setConfirmModal] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState("ODI");
  const [user, setUser] = useState({});

  const fetchAndSortPlayers = () => {
    api
      .get("/players/")
      .then((res) => {
        const players = res.data;
        const sortedPlayers = players.sort((a, b) => {
          const scoreA = calculateWeightedScore(a, playerAttributes);
          const scoreB = calculateWeightedScore(b, playerAttributes);
          return scoreB - scoreA;
        });

        setSortedPlayers(sortedPlayers);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const showingAttributes = {
    batsman: ["batting_average", "strike_rate", "boundary_percentage"],
    bowler: ["bowling_average", "economy_rate", "wickets_taken"],
    allrounder: [
      "batting_average",
      "strike_rate",
      "boundary_percentage",
      "bowling_average",
      "economy_rate",
      "wickets_taken",
    ],
    keeper: [
      "batting_average",
      "strike_rate",
      "boundary_percentage",
      "catches",
      "dismissals",
      "missed_catches",
    ],
  };

  const attributes = {
    batsman: [
      "batting_average",
      "strike_rate",
      "rotating_strike",
      "boundary_percentage",
    ],
    bowler: ["bowling_average", "economy_rate", "wickets_taken"],
    allrounder: [
      "batting_average",
      "strike_rate",
      "rotating_strike",
      "boundary_percentage",
      "bowling_average",
      "economy_rate",
      "wickets_taken",
    ],
    keeper: [
      "batting_average",
      "strike_rate",
      "rotating_strike",
      "boundary_percentage",
      "catches",
      "dismissals",
      "missed_catches",
    ],
  };

  const getUser = () => {
    api
      .get(`/user/${JSON.parse(localStorage.getItem("user")).user_id}/`)
      .then((res) => {
        setUser(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleInputChange = (e, attribute) => {
    const value = e.target.value;
    setPlayerAttributes((prevAttributes) => ({
      ...prevAttributes,
      [attribute]: value,
    }));
  };

  const normalizeAttributes = (attributes) => {
    const total = Object.values(attributes).reduce(
      (acc, curr) => acc + parseFloat(curr || 0),
      0
    );
    const normalizedAttributes = {};
    for (const [key, value] of Object.entries(attributes)) {
      normalizedAttributes[key] = (parseFloat(value) || 0) / total;
    }
    return normalizedAttributes;
  };

  const calculateWeightedScore = (player, weights) => {
    let weightedScore = 0;

    // Assuming player data structure contains normalized attributes like player.batting_average_normalized, etc.
    attributes[playerType].forEach((attribute) => {
      const normalizedAttribute =
        normalizeAttributes(playerAttributes)[attribute] || 0; // Collect 0 for unfilled attributes
      weightedScore += player[`${attribute}_normalized`] * normalizedAttribute;
    });

    return weightedScore;
  };

  const togglePlayerSelection = (playerId) => {
    if (selectedPlayers.includes(playerId)) {
      setSelectedPlayers(selectedPlayers.filter((id) => id !== playerId));
    } else {
      setSelectedPlayers([...selectedPlayers, playerId]);
    }
  };

  const addToTeam = () => {
    // Get the players already in the selected team
    const team = user.teams.find((team) => team.team_type === selectedTeam);
    const existingPlayers = team
      ? team.players.map((player) => player.player_id)
      : [];

    // Filter out the selected players that are already in the team
    const filteredSelectedPlayers = selectedPlayers.filter(
      (playerId) => !existingPlayers.includes(playerId)
    );

    api
      .post(
        `/addplayers/${JSON.parse(localStorage.getItem("user")).user_id}/`,
        {
          team_type: selectedTeam,
          player_ids: filteredSelectedPlayers,
        }
      )
      .then(() => {
        toast.success("Players added successfully");
        setSelectedPlayers([]);
      })
      .catch((err) => {
        console.log(err);
      });
  };

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
        <Navbar active="playerlist" />
      </div>
      <div className="border mx-2 lg:mx-16 p-3 lg:p-5 rounded-md mt-5 lg:mt-10 relative">
        <div className="text-xlightgray text-sm lg:text-lg">
          Please input the desired attribute within range 0-100.
        </div>
        <div className=" grid grid-cols-2 lg:flex flex-wrap items-center gap-2 lg:gap-5">
          <Select
            value={playerType}
            showSearch
            className="h-12 w-full lg:w-[200px] py-1"
            options={[
              { value: "batsman", label: "Batsman" },
              { value: "bowler", label: "Bowler" },
              { value: "allrounder", label: "All-Rounder" },
              { value: "keeper", label: "Wicket Keeper" },
            ]}
            onChange={setPlayerType}
          />
          {attributes[playerType].map((attribute, index) => (
            <div key={index}>
              <input
                type="number"
                min={0}
                max={100}
                placeholder={attribute.split("_").join(" ")}
                className="w-full lg:w-[200px] rounded-md border border-[#DED2D9] px-2 py-1.5 focus:border-transparent focus:outline-none focus:ring-1 focus:ring-xblue"
                value={playerAttributes[attribute] || ""}
                onChange={(e) => {
                  const inputValue = e.target.value;

                  if (
                    inputValue === "" ||
                    (inputValue >= 0 && inputValue <= 100)
                  ) {
                    handleInputChange(e, attribute);
                  }
                }}
              />
            </div>
          ))}
        </div>
        <button
          onClick={fetchAndSortPlayers}
          className="bg-xred hover:bg-red-700 transition-all duration-200 absolute px-3 lg:px-5 py-1 lg:py-3 text-white rounded-md right-0 bottom-[-40px] lg:bottom-[-60px]"
        >
          Submit
        </button>
      </div>
      <div className="flex flex-wrap mx-2 lg:mx-16 my-20 lg:my-36 gap-y-16 gap-x-2 lg:gap-y-24 lg:gap-x-10 justify-center">
        {sortedPlayers.map((player, index) => (
          <button
            key={index}
            className="h-52 lg:h-72 w-40 lg:w-52 bg-xyellow rounded-md border-2 border-yellow-600 shadow-md relative"
            onClick={() => togglePlayerSelection(player.player_id)}
          >
            {selectedPlayers.includes(player.player_id) && (
              <FcOk className="text-3xl text-xblue absolute top-0 right-0 -mt-4 -mr-2" />
            )}
            <img
              src="src/assets/avatar.png"
              alt={player.player_name}
              className="w-16 lg:w-32 -mt-8 lg:-mt-12 mx-auto"
            />
            <div className="font-bold text-center text-xl">
              {player.player_name}
            </div>
            <div className="flex items-center justify-between px-1 lg:px-4 pb-2 lg:pb-6">
              <div className="text-2xl lg:text-3xl font-bold">
                {parseInt(
                  calculateWeightedScore(player, playerAttributes) * 100
                )}
              </div>
              <div className="text-md lg:text-lg font-bold">
                {player.player_type}
              </div>
            </div>

            <div className="grid grid-cols-3 text-center">
              {Object.entries(player)
                .filter(([key]) => !key.includes("normalized"))
                .filter(
                  ([key, value]) =>
                    key !== "player_id" &&
                    key !== "player_photo" &&
                    key !== "player_name" &&
                    key !== "player_type" &&
                    showingAttributes[playerType].includes(key) &&
                    value !== 0
                )
                .map(([key, value]) => (
                  <div key={key}>
                    <div className="font-bold uppercase">{key.slice(0, 3)}</div>
                    <div>{Math.ceil(value)}</div>
                  </div>
                ))}
            </div>
          </button>
        ))}
      </div>
      {selectedPlayers.length > 0 && (
        <button
          className="fixed bottom-5 lg:bottom-10 right-5 lg:right-10 bg-xblue text-white rounded-md px-2 lg:px-5 py-1 lg:py-3 text-lg lg:text-xl animate-bounce"
          onClick={() => setOpenModal(true)}
        >
          Add {selectedPlayers.length}{" "}
          {selectedPlayers.length === 1 ? "player" : "players"}
        </button>
      )}
      <Modal
        title="Team Select"
        open={openModal}
        okText={"Select Team"}
        onOk={() => {
          setConfirmModal(true);
          setOpenModal(false);
          getUser();
        }}
        onCancel={() => setOpenModal(false)}
        centered
      >
        <div className="flex items-center gap-x-2">
          <div>Please specify the team to add players</div>
          <div>
            <Select
              value={selectedTeam}
              showSearch
              className="h-12 w-full lg:w-[100px] py-1"
              options={[
                { value: "TEST", label: "Test" },
                { value: "ODI", label: "ODI" },
                { value: "T20", label: "T20I" },
              ]}
              onChange={setSelectedTeam}
            />
          </div>
        </div>
      </Modal>
      <Modal
        title="Confirmation"
        open={confirmModal}
        okText={"Confirm"}
        onOk={() => {
          addToTeam();
          setConfirmModal(false);
        }}
        onCancel={() => setConfirmModal(false)}
        centered
      >
        <div>Are you sure you want to add the selected players?</div>
      </Modal>
    </div>
  );
};

export default PlayerList;
