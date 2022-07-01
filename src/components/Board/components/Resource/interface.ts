export enum ResourceType {
  TERRAFORMATION = "TERRAFORMATION",
  MONEY = "MONEY",
  STEEL = "STEEL",
  TITANIUM = "TITANIUM",
  PLANTS = "PLANTS",
  ENERGY = "ENERGY",
  HEAT = "HEAT",
}

export type ResourceData = {
  ammount: number;
  generation: number;
};

export interface ResourceProps {
  type: ResourceType;
  data?: ResourceData;
  editable?: boolean;
  /** The minimum value in the generation. Defaults to 0 */
  minGen?: number;
  onClickCallback: (minGen?: number) => void;
}
