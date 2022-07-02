import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import * as BoardsApi from "@/services/api/boards";

import { PlayerObject } from "../ChoosePlayer/interface";
import { PlayerViewState } from "@/playerSlice";

import "./style.scss";

interface ChangeBoardProps {
  logedPlayer: PlayerObject;
}

function ChangeBoard({ logedPlayer }: ChangeBoardProps) {
  const [boards, setBoards] = useState<PlayerViewState[]>();

  useEffect(() => {
    async function syncAvailableBoards() {
      const data = await BoardsApi.GetBoards();
      setBoards(Object.values(data));
    }

    syncAvailableBoards();
  }, []);

  return (
    <div className="choose-board">
      <h1>Choose which board to see</h1>
      <ul className="users">
        {boards?.map((player) => (
          <Link key={player.user} to={`/boards/${player.user}`}>
            <li
              className={`user 
               ${player.user === logedPlayer.name ? "self" : ""}
               ${player.doneGen ? "gen-finished" : ""}
               ${player.ownTurn ? "turn-owner" : ""}
              `}
              style={{ background: player.playerColor }}
            >
              {player.user.toUpperCase()}
            </li>
          </Link>
        ))}
      </ul>
    </div>
  );
}

export default ChangeBoard;
