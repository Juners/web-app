import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { ResourceType } from "./views/Board/components/Resource/interface";
import { RootState } from "./store";

// Define a type for the slice state
export type ResourceState = {
  [K in ResourceType]: {
    ammount: number;
    generation: number;
  };
};

// Define the initial state using that type
const initialState: ResourceState = {
  TERRAFORMATION: {
    ammount: 0,
    generation: 0,
  },
  MONEY: {
    ammount: 0,
    generation: 0,
  },
  STEEL: {
    ammount: 0,
    generation: 0,
  },
  TITANIUM: {
    ammount: 0,
    generation: 0,
  },
  PLANTS: {
    ammount: 0,
    generation: 0,
  },
  ENERGY: {
    ammount: 0,
    generation: 0,
  },
  HEAT: {
    ammount: 0,
    generation: 0,
  },
};

export const resourceSlice = createSlice({
  name: "resource",
  initialState,
  reducers: {
    changeGeneration: (
      state,
      action: PayloadAction<{ resource: ResourceType; value: number }>
    ) => {
      const { resource, value } = action.payload;
      state[resource].generation = value;
    },
    changeAmmount: (
      state,
      action: PayloadAction<{ resource: ResourceType; value: number }>
    ) => {
      const { resource, value } = action.payload;
      state[resource].ammount = value;
    },
    changeState: (state, action: PayloadAction<ResourceState>) => {
      state = action.payload;
    },
  },
});

export const { changeAmmount, changeGeneration, changeState } =
  resourceSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectResource = (state: RootState) => (resource: ResourceType) =>
  state.resource[resource];
export const selectState = (state: RootState) => state;

export default resourceSlice.reducer;
