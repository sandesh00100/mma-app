import { MatchState, matchReducer } from "./match.reducer";
import { FilterState, filterReducer } from "./filter.reducer";
import { ActionReducerMap } from "@ngrx/store";

export interface MatchExplorerState {
    matches:MatchState,
    filter:FilterState
}

export const reducers: ActionReducerMap<MatchExplorerState> = {
    matches:matchReducer,
    filter:filterReducer
}