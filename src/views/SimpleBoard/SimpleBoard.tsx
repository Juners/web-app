import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";

import { useAppDispatch, useAppSelector } from "@/hooks";
import {
  changeState,
  selectBoardGenerationState,
  selectIsOutdated,
  selectPlayerViewState,
} from "@/playerSlice";

import { SimplePlayerBoardProps } from "./interface";

import "./style.scss";
import { toTitleCase } from "@/index";
import { USERS } from "../ChoosePlayer/ChoosePlayer";
import { EndTurn } from "@/services/api/boards";

function SimplePlayerBoard({ logedPlayer }: SimplePlayerBoardProps) {
  const dispatch = useAppDispatch();
  const boardGeneration = useAppSelector(selectBoardGenerationState);
  const outdated = useAppSelector(selectIsOutdated);
  const playerView = useAppSelector(selectPlayerViewState);

  const { user = "" } = useParams();

  const [emptyBoard, setEmptyBoard] = useState(false);
  const [ownBoard, setOwnBoard] = useState(user === logedPlayer.name);

  const syncing = useRef(false);

  useEffect(() => {
    async function syncLocalBoard() {
      syncing.current = true;

      const genCall = await fetch(`http://192.168.0.27:3001/currentGeneration`);
      const gen = await genCall.json();

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
        ownBoard && setEmptyBoard(true);
      }
    }

    !syncing.current && syncLocalBoard();
  }, [dispatch, user, boardGeneration, logedPlayer, outdated, ownBoard]);

  useEffect(() => {
    if (emptyBoard && ownBoard) {
      fetch(`http://192.168.0.27:3001/users/${user}/board/simple`, {
        headers: {
          "Content-Type": "application/json",
        },
        method: "PUT",
        body: JSON.stringify({
          simpleBoard: true,
          doneGen: false,
          playerColor: USERS.find((u) => u.name === user)?.color,
          user,
        }),
      });
      setEmptyBoard(false);
    }
  }, [emptyBoard, user, logedPlayer, ownBoard]);

  useEffect(() => {
    setOwnBoard(user === logedPlayer.name);
  }, [logedPlayer, user]);

  return (
    <div className="player-board">
      <div className="board">
        <div className="top-menu">
          <div className="player-info">
            <b>{toTitleCase(user)}</b>
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
            hidden={!ownBoard && !playerView.ownTurn}
            disabled={!playerView.ownTurn}
            onClick={() => {
              async function finishGen() {
                syncing.current = true;

                const board = await EndTurn(user);
                syncing.current = false;
                dispatch(
                  changeState({ state: board, user: user, fetch: true })
                );
              }

              ownBoard && !syncing.current && finishGen();
            }}
          >
            {ownBoard ? (
              <>{playerView.ownTurn ? "End turn" : "Not your turn"}</>
            ) : (
              <>{playerView.ownTurn ? "Current turn owner" : ""}</>
            )}
          </button>

          <button
            hidden={!ownBoard && !playerView.doneGen}
            disabled={playerView.doneGen}
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
            {playerView.doneGen ? "Generation finished" : "Finish generation"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default SimplePlayerBoard;
