import { useEffect } from "react";
import { useSelector } from "react-redux";

import { GetGeneration } from "@/services/api/game";
import { GetBoards } from "@/services/api/boards";
import Board from "@/components/Board";
import { useAppDispatch } from "@/hooks";
import {
  changeBoardGeneration,
  selectBoardGenerationState,
  selectBoards,
  selectIsOutdated,
  updateBoards,
} from "@/globalViewSlice";

import "./style.scss";

function GlobalView() {
  const dispatch = useAppDispatch();

  const boards = useSelector(selectBoards);
  const gameGeneration = useSelector(selectBoardGenerationState);
  const isOutdated = useSelector(selectIsOutdated);

  useEffect(() => {
    async function syncGlobalView() {
      const generation = await GetGeneration();
      const boards = await GetBoards();
      dispatch(changeBoardGeneration(generation));
      dispatch(
        updateBoards({
          boards: Object.entries(boards),
          generation,
        })
      );
    }

    isOutdated && syncGlobalView();
  }, [dispatch, isOutdated]);

  return (
    <div className="global-view">
      <div className="generation-info">Generation {gameGeneration}</div>
      <div className="boards">
        {Object.entries(boards).map(([player, board]) => (
          <div
            key={player}
            className={`board-wrapper ${
              board.resourceState.doneGen ? "gen-finished" : ""
            } ${board.resourceState.ownTurn ? "turn-owner" : ""}`}
            style={{ background: board.playerColor }}
          >
            <div className="player-name">
              <span>{player}</span>
            </div>
            <Board resources={board.resourceState} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default GlobalView;
