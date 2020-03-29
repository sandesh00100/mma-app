import { Match, Filter } from "../match.model";
import { createReducer, on } from "@ngrx/store";
import { addFilter } from "../match.actions";

export interface MatchState {
    matches: Match[];
    filterOptions: {
        currentPage: number,
        pageSize: number,
        filters: Filter[]
    }
}

export const initialMatchState: MatchState = {
    matches: null,
    filterOptions: {
        currentPage: 1,
        pageSize: 5,
        filters: []
    }
}

export const matchReducer = createReducer(
    initialMatchState,
    on(addFilter, (state: MatchState, action) => {
        let currentFilters: Filter[] = [...state.filterOptions.filters];
        return {
            ...state,
            filters: currentFilters.push(action.filter)
        }
    })
);