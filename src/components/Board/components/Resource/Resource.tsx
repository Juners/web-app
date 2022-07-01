import { useEffect, useState } from "react";
import { useAppSelector } from "@/hooks";
import { selectResource } from "@/playerSlice";

import ResourceIcon from "@/components/Icon";

import { ResourceProps, ResourceType } from "./interface";

import "./style.scss";

function Resource({
  type,
  data,
  editable = false,
  minGen = 0,
  onClickCallback,
}: ResourceProps) {
  const ammount = data?.ammount || 0;
  const generation = data?.generation || 0;

  return (
    <div
      className={`resource ${type.toLowerCase()} ${editable ? "editable" : ""}`}
      onClick={() => {
        editable && onClickCallback(minGen);
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
