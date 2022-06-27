import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { ResourceType } from "./views/Board/components/Resource/interface";
import { RootState } from "./store";

// Define a type for the slice state
export type ResourceStateType = {
  [K in ResourceType]: {
    ammount: number;
    generation: number;
  };
};

export interface ResourceState {
  doneGen: boolean;
  fetch: boolean;
  generation: number;
  outdated: boolean;
  user: string;
}

// Define the initial state using that type
const initialState: ResourceStateType & ResourceState = {
  doneGen: false,
  fetch: false,
  generation: 1,
  outdated: false,
  user: "",
  TERRAFORMATION: {
    ammount: 20,
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
      state.fetch = false;
    },
    changeAmmount: (
      state,
      action: PayloadAction<{ resource: ResourceType; value: number }>
    ) => {
      const { resource, value } = action.payload;
      state[resource].ammount = value;
      state.fetch = false;
    },
    changeBoardGeneration: (state, action: PayloadAction<number>) => {
      state.generation = action.payload;
    },
    changeState: (
      state,
      action: PayloadAction<{
        state: ResourceStateType;
        user: string;
        generation?: number;
        fetch?: boolean;
      }>
    ) => {
      state = Object.assign(state, action.payload.state);
      state.outdated = false;

      state.user = action.payload.user;

      if (action.payload.fetch) {
        state.fetch = action.payload.fetch;
      }
      if (action.payload.generation) {
        state.generation = action.payload.generation;
      }
    },
    changeOutdated: (state, action: PayloadAction<string>) => {
      if (state.user === action.payload) {
        state.outdated = true;
      }
    },
  },
});

export const {
  changeAmmount,
  changeBoardGeneration,
  changeGeneration,
  changeState,
  changeOutdated,
} = resourceSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectResource = (state: RootState) => (resource: ResourceType) =>
  state.resource[resource];
export const selectResourceState = (state: RootState) => state.resource;
export const selectBoardGenerationState = (state: RootState) =>
  state.resource.generation;
export const selectIsOutdated = (state: RootState) => state.resource.outdated;

export default resourceSlice.reducer;
