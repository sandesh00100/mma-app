import { Match, Filter } from "../match.model";
import { createReducer, on } from "@ngrx/store";
import { addFilter } from "../match.actions";

export interface FilterState {
        currentPage: number,
        pageSize: number,
        filters: Filter[]
}

export const initialMatchState: FilterState = {
        currentPage: 1,
        pageSize: 5,
        filters: []
}

export const matchReducer = createReducer(
    initialMatchState,
    on(addFilter, (state: FilterState, action) => {
        let filters: Filter[] = [...state.filters];
        filters.push(action.filter);
        return{
            ...state,
            filters:filters
        }
    })
);