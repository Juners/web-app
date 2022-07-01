import Resource from "./components/Resource";

import { ResourceType } from "./components/Resource/interface";
import { PlayerBoardProps } from "./interface";

import "./style.scss";

const MONEY_MIN_GEN = -5;

function PlayerBoard({
  resources,
  editable = false,
  loading = false,
  onClickCallback,
}: PlayerBoardProps) {
  return (
    <div className={`board ${resources.doneGen ? "gen-finished" : ""}`}>
      {loading && (
        <div className="loading-screen">
          <div className="spin"></div>
        </div>
      )}
      <div className="terraformation-marker">
        <Resource
          data={resources.TERRAFORMATION}
          editable={editable}
          type={ResourceType.TERRAFORMATION}
          onClickCallback={() =>
            onClickCallback?.({
              resource: ResourceType.TERRAFORMATION,
              disableGen: true,
            })
          }
        />
      </div>
      <div className="resources">
        <Resource
          data={resources.MONEY}
          editable={editable}
          type={ResourceType.MONEY}
          minGen={MONEY_MIN_GEN}
          onClickCallback={() =>
            onClickCallback?.({ resource: ResourceType.MONEY, minGen: -5 })
          }
        />
        <Resource
          data={resources.STEEL}
          editable={editable}
          type={ResourceType.STEEL}
          onClickCallback={() =>
            onClickCallback?.({ resource: ResourceType.STEEL })
          }
        />
        <Resource
          data={resources.TITANIUM}
          editable={editable}
          type={ResourceType.TITANIUM}
          onClickCallback={() =>
            onClickCallback?.({ resource: ResourceType.TITANIUM })
          }
        />
        <Resource
          data={resources.PLANTS}
          editable={editable}
          type={ResourceType.PLANTS}
          onClickCallback={() =>
            onClickCallback?.({ resource: ResourceType.PLANTS })
          }
        />
        <Resource
          data={resources.ENERGY}
          editable={editable}
          type={ResourceType.ENERGY}
          onClickCallback={() =>
            onClickCallback?.({ resource: ResourceType.ENERGY })
          }
        />
        <Resource
          data={resources.HEAT}
          editable={editable}
          type={ResourceType.HEAT}
          onClickCallback={() =>
            onClickCallback?.({ resource: ResourceType.HEAT })
          }
        />
      </div>
    </div>
  );
}

export default PlayerBoard;
