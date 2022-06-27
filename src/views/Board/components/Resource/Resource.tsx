import { useEffect, useState } from "react";
import { useAppSelector } from "@/hooks";
import { selectResource } from "@/resourceSlice";

import ResourceIcon from "@/components/Icon";

import { ResourceProps, ResourceType } from "./interface";

import "./style.scss";

function Resource({
  type,
  editable = false,
  minGen = 0,
  openModal,
}: ResourceProps) {
  const resource = useAppSelector(selectResource)(type);

  const [ammount, setAmmount] = useState(0);
  const [generation, setGeneration] = useState(0);

  useEffect(() => {
    setAmmount(resource.ammount);
    setGeneration(resource.generation);
  }, [resource]);

  return (
    <div
      className={`resource ${type.toLowerCase()} ${editable ? "editable" : ""}`}
      onClick={() => {
        editable && openModal(minGen);
      }}
    >
      <div className="icon-wrapper">
        <ResourceIcon type={type} />
      </div>
      {type !== ResourceType.TERRAFORMATION && (
        <div className="generation-wrapper">
          <div
            className={`generation ${generation < 0 ? "negative" : "positive"}`}
          >
            {generation}
          </div>
        </div>
      )}
      <div className="ammount">{ammount}</div>
    </div>
  );
}

export default Resource;
