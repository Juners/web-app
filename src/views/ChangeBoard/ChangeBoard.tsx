import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import * as BoardsApi from "@/services/api/boards";

import { PlayerObject } from "../ChoosePlayer/interface";

import "./style.scss";

interface ChangeBoardProps {
  logedPlayer: PlayerObject;
}

function ChangeBoard({ logedPlayer }: ChangeBoardProps) {
  const [boards, setBoards] = useState<PlayerObject[]>();

  useEffect(() => {
    async function syncAvailableBoards() {
      const data = await BoardsApi.GetBoards();
      setBoards(
        Object.values(data).map(({ user, playerColor }) => ({
          name: user,
          color: playerColor,
        }))
      );
    }

    syncAvailableBoards();
  }, []);

  return (
    <div className="choose-board">
      <h1>Choose which board to see</h1>
      <ul className="users">
        {boards?.map((user) => (
          <Link key={user.name} to={`/boards/${user.name}`}>
            <li
              className={`user ${user.name === logedPlayer.name ? "self" : ""}`}
              style={{ background: user.color }}
            >
              {user.name.toUpperCase()}
            </li>
          </Link>
        ))}
      </ul>
    </div>
  );
}

export default ChangeBoard;
