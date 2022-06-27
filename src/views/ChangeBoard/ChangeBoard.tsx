import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";

import "./style.scss";

interface ChangeBoardProps {
  logedPlayer: string;
}

function ChangeBoard({ logedPlayer }: ChangeBoardProps) {
  const [boards, setBoards] = useState<string[]>();

  useEffect(() => {
    async function syncAvailableBoards() {
      const call = await fetch("http://192.168.0.27:3001/boards");
      const data = await call.json();
      setBoards(data);
    }

    syncAvailableBoards();
  }, []);

  return (
    <div className="choose-player">
      <h1>Choose which board to see</h1>
      <ul>
        {boards?.map((board) => (
          <NavLink to={board} key={board}>
            <li>
              {board[0].toUpperCase() + board.substring(1)}
              {board === logedPlayer ? " (Your board)" : ""}
            </li>
          </NavLink>
        ))}
      </ul>
    </div>
  );
}

export default ChangeBoard;
