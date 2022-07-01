import { useEffect, useState } from "react";

import { changeAmmount, changeGeneration, selectResource } from "@/playerSlice";
import { useAppSelector, useAppDispatch } from "@/hooks";
import Modal from "@/components/Modal";
import PrettyDisplayNumber from "@/components/PrettyDisplayNumber";
import { ResourceType } from "@/components/Board/components/Resource/interface";

import "./style.scss";

function useEditModal() {
  const [isOpen, setOpen] = useState(false);
  const [minGen, setMinGen] = useState(0);
  const [owner, setOwner] = useState<ResourceType>();
  const [disableGen, setDisableGen] = useState(false);

  return {
    isOpen,
    openModal: ({
      owner,
      disableGen = false,
      minGen = 0,
    }: {
      owner: ResourceType;
      disableGen?: boolean;
      minGen?: number;
    }) => {
      setOwner(owner);
      setDisableGen(disableGen);
      setMinGen(minGen);
      setOpen(true);
    },
    closeModal: () => {
      setOpen(false);
    },
    Modal: (
      <Modal open={isOpen} onClose={() => setOpen(false)}>
        {owner ? (
          <EditModalContent
            isOpen={isOpen}
            disableGen={disableGen}
            minGen={minGen}
            owner={owner}
            onValueUpdated={() => setOpen(false)}
          />
        ) : (
          <></>
        )}
      </Modal>
    ),
  };
}

export default useEditModal;

const INTERVALS = [25, 5, 1];

// TODO: Meter debounce para evitar acumulacion de cambios
function EditModalContent({
  isOpen,
  disableGen,
  minGen,
  owner,
  onValueUpdated,
}: {
  disableGen: boolean;
  isOpen: boolean;
  minGen: number;
  owner: ResourceType;
  onValueUpdated: () => void;
}) {
  const dispatch = useAppDispatch();
  const resource = useAppSelector(selectResource)(owner);

  const [ammount, setAmmount] = useState(resource.ammount);
  const [generation, setGeneration] = useState(resource.generation);

  useEffect(() => {
    setAmmount(resource.ammount);
    setGeneration(resource.generation);
  }, [resource, isOpen]);

  return (
    <form
      className="edit-generation"
      onSubmit={(ev) => {
        ev.preventDefault();
        const data = new FormData(ev.currentTarget);

        dispatch(
          changeGeneration({
            resource: owner,
            value: Number.parseInt(data.get("generation")?.toString() || "0"),
          })
        );
        dispatch(
          changeAmmount({
            resource: owner,
            value: Number.parseInt(data.get("ammount")?.toString() || "0"),
          })
        );

        onValueUpdated();
      }}
    >
      {disableGen ? (
        <input readOnly hidden type="number" name="generation" value={0} />
      ) : (
        <>
          <div className="row">Generation</div>
          <div className="row">
            {INTERVALS.map((val) => (
              <button
                key={val}
                className="modif negative"
                onClick={(ev) => {
                  ev.preventDefault();
                  setGeneration((generation) => {
                    const newVal = generation - val;
                    return newVal < minGen ? minGen : newVal;
                  });
                }}
              >
                -{val}
              </button>
            ))}
            <div className="data">
              <PrettyDisplayNumber max={999}>{generation}</PrettyDisplayNumber>
              <input
                readOnly
                hidden
                type="number"
                name="generation"
                value={generation}
              />
            </div>
            {INTERVALS.map((val) => (
              <button
                key={val}
                className="modif positive"
                onClick={(ev) => {
                  ev.preventDefault();
                  setGeneration((generation) => generation + val);
                }}
              >
                +{val}
              </button>
            )).reverse()}
          </div>
          <hr />
        </>
      )}
      <div className="row">Total</div>
      <div className="row">
        {INTERVALS.map((val) => (
          <button
            key={val}
            className="modif negative"
            onClick={(ev) => {
              ev.preventDefault();
              setAmmount((ammount) => {
                const newVal = ammount - val;
                return newVal < 0 ? 0 : newVal;
              });
            }}
          >
            -{val}
          </button>
        ))}
        <div className="data">
          <PrettyDisplayNumber max={999}>{ammount}</PrettyDisplayNumber>
          <input readOnly hidden type="number" name="ammount" value={ammount} />
        </div>
        {INTERVALS.map((val) => (
          <button
            key={val}
            className="modif positive"
            onClick={(ev) => {
              ev.preventDefault();
              setAmmount((ammount) => ammount + val);
            }}
          >
            +{val}
          </button>
        )).reverse()}
      </div>
      <hr />
      <div className="row save">
        <button type="submit">Guardar</button>
      </div>
    </form>
  );
}
