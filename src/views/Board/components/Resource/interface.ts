export enum ResourceType {
  TERRAFORMATION = "TERRAFORMATION",
  MONEY = "MONEY",
  STEEL = "STEEL",
  TITANIUM = "TITANIUM",
  PLANTS = "PLANTS",
  ENERGY = "ENERGY",
  HEAT = "HEAT",
}

export interface ResourceProps {
  type: ResourceType;
  editable?: boolean;
  /** The minimum value in the generation. Defaults to 0 */
  minGen?: number;
  openModal: (minGen?: number) => void;
}
