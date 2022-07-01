import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { ChoosePlayerProperties, PlayerObject } from "./interface";

import "./style.scss";

export const USERS: PlayerObject[] = [
  { name: "javier", color: "#FFE333" },
  { name: "ivan", color: "#44AB7D" },
  { name: "alex", color: "#8C8C8C" },
  { name: "marc", color: "#FF5950" },
  { name: "sergi", color: "#279BFF" },
];

function ChoosePlayer({ onPlayerSelected }: ChoosePlayerProperties) {
  const [player, setPlayer] = useState<PlayerObject>();
  const [simple, setSimple] = useState(false);

  useEffect(() => {
    player && onPlayerSelected(player);
  }, [onPlayerSelected, player]);

  return (
    <div className="choose-player">
      <div className="top">
        <h1>Choose user{simple ? " (Simple mode)" : ""}</h1>
        <button className="simpleModeToggle" onClick={() => setSimple(!simple)}>
          {simple ? "Disable" : "Enable"} Simple mode
        </button>
      </div>
      <ul className="users">
        {USERS.map((user) => (
          <Link
            key={user.name}
            onClick={() => setPlayer(user)}
            to={`/boards/${user.name}${simple ? "/simple" : ""}`}
          >
            <li className="user" style={{ background: user.color }}>
              {user.name.toUpperCase()}
            </li>
          </Link>
        ))}
      </ul>
    </div>
  );
}

export default ChoosePlayer;
