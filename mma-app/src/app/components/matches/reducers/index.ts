import { Match, Filter } from "../match.model";
import { createReducer, on } from "@ngrx/store";
import { addFilter, removeFilter } from "../match.actions";
import { flatObjectsAreEqual } from "src/app/utility/checkEquality";

export interface FilterState{
        currentPage: number,
        pageSize: number,
        filters: Filter[]
}

export const initialMatchState: FilterState = {
        currentPage: 1,
        pageSize: 5,
        filters: []
}

export const filterReducer = createReducer(
    initialMatchState,
    on(addFilter, (state: FilterState, action) => {
        let filters: Filter[] = [...state.filters];
        for (const filter of filters) {
            if (filter.mode == action.filter.mode && flatObjectsAreEqual(filter.searchResult,action.filter.searchResult)) {
                return {
                    ...state
                }
            }
        }
        filters.push(action.filter);
        return{
            ...state,
            filters:filters
        }
    }),
    on(removeFilter, (state: FilterState, action) => {
        const filters: Filter[] = state.filters.filter( filter => !(filter.mode == action.filter.mode && flatObjectsAreEqual(filter.searchResult, action.filter.searchResult)))
        return {
            ...state,
            filters:filters
        }
    })
);