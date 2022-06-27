import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import { useAppDispatch, useAppSelector } from "@/hooks";
import {
  changeState,
  selectBoardGenerationState,
  selectIsOutdated,
  selectResourceState,
} from "@/resourceSlice";

import Resource from "./components/Resource";
import useEditModal from "./components/EditModal";

import { ResourceType } from "./components/Resource/interface";
import { PlayerBoardProps } from "./interface";

import "./style.scss";

const MONEY_MIN_GEN = -5;

function PlayerBoard({ logedPlayer }: PlayerBoardProps) {
  const dispatch = useAppDispatch();
  const resources = useAppSelector(selectResourceState);
  const boardGeneration = useAppSelector(selectBoardGenerationState);
  const outdated = useAppSelector(selectIsOutdated);

  const { user = "" } = useParams();
  const navigate = useNavigate();

  const { Modal, openModal: __openModal } = useEditModal();

  const [emptyBoard, setEmptyBoard] = useState(false);
  const [ownBoard, setOwnBoard] = useState(user === logedPlayer);

  const syncing = useRef(false);

  useEffect(() => {
    async function syncLocalBoard() {
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
        const { gen } = await genCall.json();

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
        user === logedPlayer && setEmptyBoard(true);
      }
    }

    !syncing.current && syncLocalBoard();
  }, [dispatch, user, boardGeneration, logedPlayer, outdated]);

  useEffect(() => {
    if (user !== logedPlayer) return;

    function createBoard() {
      fetch(`http://192.168.0.27:3001/users/${user}/board`, {
        headers: {
          "Content-Type": "application/json",
        },
        method: "PUT",
        body: JSON.stringify({
          ...resources,
          fetch: undefined,
          initial: undefined,
        }),
      });
      setEmptyBoard(false);
    }

    function updateBoard() {
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

    emptyBoard ? createBoard() : updateBoard();
  }, [resources, emptyBoard, user, logedPlayer]);

  useEffect(() => {
    setOwnBoard(user === logedPlayer);
  }, [logedPlayer, user]);

  const openModal =
    (owner: ResourceType, disableGen = false) =>
    (minGen?: number) => {
      __openModal({ disableGen, owner, minGen });
    };

  return (
    <div className={`player-board ${resources.doneGen ? "gen-finished" : ""}`}>
      {Modal}
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
        <div className="top-menu">
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
        <div className="terraformation-marker">
          <Resource
            editable={ownBoard}
            type={ResourceType.TERRAFORMATION}
            openModal={openModal(ResourceType.TERRAFORMATION, true)}
          />
        </div>
        <div className="resources">
          <Resource
            editable={ownBoard}
            type={ResourceType.MONEY}
            minGen={MONEY_MIN_GEN}
            openModal={openModal(ResourceType.MONEY)}
          />
          <Resource
            editable={ownBoard}
            type={ResourceType.STEEL}
            openModal={openModal(ResourceType.STEEL)}
          />
          <Resource
            editable={ownBoard}
            type={ResourceType.TITANIUM}
            openModal={openModal(ResourceType.TITANIUM)}
          />
          <Resource
            editable={ownBoard}
            type={ResourceType.PLANTS}
            openModal={openModal(ResourceType.PLANTS)}
          />
          <Resource
            editable={ownBoard}
            type={ResourceType.ENERGY}
            openModal={openModal(ResourceType.ENERGY)}
          />
          <Resource
            editable={ownBoard}
            type={ResourceType.HEAT}
            openModal={openModal(ResourceType.HEAT)}
          />
        </div>
      </div>
    </div>
  );
}

export default PlayerBoard;
