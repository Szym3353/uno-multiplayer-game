import React, { useState } from "react";
import { Link } from "react-router-dom";
import useCommon from "../hooks/useCommon";
import useTitle from "../hooks/useTitle";
import { socket } from "../socketio";

//CSS
import "../styles/homepage.css";

const Homepage = () => {
  const { navigate, user } = useCommon();
  const [codeField, setCodeField] = useState<string>("");
  useTitle("Homepage");

  const [showCodeBox, setShowCodeBox] = useState<boolean>(false);
  const [codeBoxError, setCodeBoxError] = useState<string>("");

  const createLobby = () => {
    socket.emit("create-lobby", { hostId: user && user.id });
  };
  socket.on("join-lobby-homepage", (data) => {
    console.log("on join lobby data", data);
    navigate(`/lobby/${data.lobbyId}`);
  });

  const handleJoinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCodeField(e.target.value);
  };

  const joinLobby = () => {
    if (codeField.length == 0) {
      showCodeBox ? setShowCodeBox(false) : setShowCodeBox(true);
    } else {
      socket.emit(
        "connect-to-lobby",
        {
          code: codeField,
          userId: user && user.id,
        },
        (err: any, res: any) => {
          if (!err) {
            setShowCodeBox(false);
            setCodeBoxError("");
            setCodeField("");
          } else {
            setCodeBoxError(err);
          }
        }
      );
    }
  };

  return user ? (
    <div className="container">
      <div className="box centered homepage-box">
        <h2 className="homepage-header">Tostowe Uno</h2>
        <div className="homepage-userinfo">
          <img src="https://via.placeholder.com/150" className="userinfo-pfp" />
          <div className="userinfo-txt">
            <h3 className="userinfo-username">{user.username}</h3>
            <p className="userinfo-stats">
              Punkty: <b>2137</b> | Ranking: <b>#3</b>
            </p>
            <Link className="form-link" to="/">
              Statystyki
            </Link>
            <Link className="form-link" to="/">
              Edytuj profil
            </Link>
          </div>
        </div>
        <div className="homepage-lobby-buttons">
          <button
            onClick={createLobby}
            className="main-button button-style-1 homepage-lobbybutton"
          >
            Stwórz lobby
          </button>
          <button
            onClick={joinLobby}
            className="main-button button-style-2 homepage-lobbybutton "
          >
            Dołącz do lobby
          </button>
          <div className={`box ${showCodeBox && "show-code-box"} code-box`}>
            Kod:
            <input
              className="code-input"
              type="text"
              onChange={handleJoinChange}
            />
            {codeBoxError ? (
              <span className="code-box-error">{codeBoxError}</span>
            ) : (
              ""
            )}
          </div>
        </div>
      </div>
    </div>
  ) : (
    <div>You are not logged in</div>
  );
};

export default Homepage;
