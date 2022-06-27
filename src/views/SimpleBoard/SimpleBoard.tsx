import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";

import { useAppDispatch, useAppSelector } from "@/hooks";
import {
  changeState,
  selectBoardGenerationState,
  selectIsOutdated,
  selectResourceState,
} from "@/resourceSlice";

import { SimplePlayerBoardProps } from "./interface";

import "./style.scss";

function SimplePlayerBoard({ logedPlayer }: SimplePlayerBoardProps) {
  const dispatch = useAppDispatch();
  const boardGeneration = useAppSelector(selectBoardGenerationState);
  const outdated = useAppSelector(selectIsOutdated);
  const resources = useAppSelector(selectResourceState);

  const { user = "" } = useParams();

  const [emptyBoard, setEmptyBoard] = useState(false);
  const [ownBoard, setOwnBoard] = useState(user === logedPlayer);

  const syncing = useRef(false);

  useEffect(() => {
    async function syncLocalBoard() {
      syncing.current = true;

      const genCall = await fetch(`http://192.168.0.27:3001/currentGeneration`);
      const { gen } = await genCall.json();

      const boardCall = await fetch(
        `http://192.168.0.27:3001/users/${user}/board`
      );

      if (boardCall.status === 200) {
        const board = await boardCall.json();
        syncing.current = false;
        dispatch(
          changeState({
            state: board,
            user: user,
            fetch: true,
            generation: gen,
          })
        );
      } else if (boardCall.status === 404) {
        syncing.current = false;
        user === logedPlayer && setEmptyBoard(true);
      }
    }

    !syncing.current && syncLocalBoard();
  }, [dispatch, user, boardGeneration, logedPlayer, outdated]);

  useEffect(() => {
    if (emptyBoard && user === logedPlayer) {
      fetch(`http://192.168.0.27:3001/users/${user}/board/simple`, {
        headers: {
          "Content-Type": "application/json",
        },
        method: "PUT",
        body: JSON.stringify({ simpleBoard: true, doneGen: false }),
      });
      setEmptyBoard(false);
    }
  }, [emptyBoard, user, logedPlayer]);

  useEffect(() => {
    setOwnBoard(user === logedPlayer);
  }, [logedPlayer, user]);

  return (
    <div className="player-board">
      <div className="board">
        <div className="top-menu">
          <div className="player-info">
            <b>{user[0].toUpperCase() + user.substring(1)}</b>
            {ownBoard ? " (My board)" : ""}
          </div>
          <div className="game-generation">
            Generation: <span className="number">{boardGeneration}</span>
          </div>
        </div>
        <div className="full-screen-menu">
          <Link to="/boards">
            <button>See other boards</button>
          </Link>

          <button
            hidden={!ownBoard && !resources.doneGen}
            disabled={resources.doneGen}
            onClick={() => {
              async function finishGen() {
                syncing.current = true;
                const call = await fetch(
                  `http://192.168.0.27:3001/users/${user}/board/finishGen`,
                  { method: "POST" }
                );

                const board = await call.json();
                syncing.current = false;
                dispatch(
                  changeState({ state: board, user: user, fetch: true })
                );
              }

              ownBoard && !syncing.current && finishGen();
            }}
          >
            {resources.doneGen ? "Generation finished" : "Finish generation"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default SimplePlayerBoard;
