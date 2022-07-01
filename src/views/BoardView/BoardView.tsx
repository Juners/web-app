import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import { useAppDispatch, useAppSelector } from "@/hooks";
import {
  changeState,
  selectBoardGenerationState,
  selectIsOutdated,
  selectPlayerViewState,
} from "@/playerSlice";
import Board from "@/components/Board";

import useEditModal from "./components/EditModal";

import { PlayerBoardProps as PlayerBoardViewProps } from "./interface";

import "./style.scss";
import { toTitleCase } from "@/index";
import { USERS } from "../ChoosePlayer/ChoosePlayer";

function PlayerBoardView({ logedPlayer }: PlayerBoardViewProps) {
  const dispatch = useAppDispatch();
  const resources = useAppSelector(selectPlayerViewState);
  const boardGeneration = useAppSelector(selectBoardGenerationState);
  const outdated = useAppSelector(selectIsOutdated);

  const { user = "" } = useParams();
  const navigate = useNavigate();

  const { Modal, openModal } = useEditModal();

  const [emptyBoard, setEmptyBoard] = useState(false);
  const [ownBoard, setOwnBoard] = useState(user === logedPlayer.name);
  const [loading, setLoading] = useState(false);

  const syncing = useRef(false);

  useEffect(
    () => {
      async function syncLocalBoard() {
        setLoading(true);
        syncing.current = true;

        const boardCall = await fetch(
          `http://192.168.0.27:3001/users/${user}/board`
        );

        // Si hay valor, lo guardamos en local. Si no, creamos uno nuevo y se sube
        if (boardCall.status === 200) {
          const board = await boardCall.json();

          if (board.simpleBoard) {
            navigate("./simple");
          }

          const genCall = await fetch(
            `http://192.168.0.27:3001/currentGeneration`
          );
          const gen = await genCall.json();

          syncing.current = false;
          dispatch(
            changeState({
              state: board,
              user: user,
              fetch: true,
              generation: gen,
            })
          );

          setLoading(false);
        } else if (boardCall.status === 404) {
          ownBoard && setEmptyBoard(true);
        }
      }

      !syncing.current && syncLocalBoard();
    },
    // Solo se hace la primera vez que se crea el componente y cuando se queda stale
    [outdated]
  );

  useEffect(() => {
    if (!ownBoard) return;

    if (emptyBoard) {
      fetch(`http://192.168.0.27:3001/users/${user}/board`, {
        headers: {
          "Content-Type": "application/json",
        },
        method: "PUT",
        body: JSON.stringify({
          ...resources,
          fetch: undefined,
          initial: undefined,
          playerColor: USERS.find((u) => u.name === user)?.color,
          user,
        }),
      });
      setEmptyBoard(false);
    } else {
      if (!resources.fetch && !syncing.current) {
        fetch(`http://192.168.0.27:3001/users/${user}/board`, {
          headers: {
            "Content-Type": "application/json",
          },
          method: "POST",
          body: JSON.stringify({
            ...resources,
            fetch: undefined,
            initial: undefined,
          }),
        });
      }
    }
  }, [resources, emptyBoard, user, logedPlayer, ownBoard]);

  useEffect(() => {
    setOwnBoard(user === logedPlayer.name);
  }, [logedPlayer, user]);

  return (
    <div className={`player-board ${resources.doneGen ? "gen-finished" : ""}`}>
      {Modal}
      <div className="top-menu">
        <div className="player-info">
          <b>{toTitleCase(user)}</b>
          {ownBoard ? " (My board)" : ""}
        </div>
        <div className="game-generation">
          Generation: <span className="number">{boardGeneration}</span>
        </div>
      </div>
      <div className="top-menu">
        <>
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
        </>
      </div>
      <Board
        loading={loading}
        resources={resources}
        editable={ownBoard}
        onClickCallback={({ resource, disableGen, minGen }) => {
          openModal({ owner: resource, minGen, disableGen });
        }}
      />
    </div>
  );
}

export default PlayerBoardView;
