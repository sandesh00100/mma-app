import { Filter, Organization } from "../match.model";
import { createReducer, on } from "@ngrx/store";
import { addFilter, removeFilter, updatePageOptions, updateOrg, updateTotalMatches } from "../matchesExplorer.actions";
import { flatObjectsAreEqual } from "src/app/utility/checkEquality";

export interface FilterState{
        currentPage: number,
        pageSize: number,
        totalMatches: number,
        org:Organization,
        filters: Filter[]
}

export const initialMatchState: FilterState = {
        currentPage: 1,
        pageSize: 5,
        totalMatches:0,
        org:Organization.ufc,
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
    }),
    on(updatePageOptions, (state: FilterState, action) => {
        return {
            ...state,
            currentPage:action.currentPage,
            pageSize:action.pageSize
        }
    }),
    on(updateOrg, (state: FilterState, action) => {
        return {
            ...state,
            org:action.newOrg
        }
    }),
    on(updateTotalMatches, (state: FilterState, action)=>{
        return {
            ...state,
            totalMatches:action.totalMatches
        }
    })
);

export const filterStateToQuery = (filterState:FilterState):string => {
    let queryString = `?pageSize=${filterState.pageSize}&page=${filterState.currentPage}&org=${filterState.org}`;

    for (const filter of filterState.filters) {
        const filterOption = filter.searchResult.searchId == null ? filter.searchResult.searchItem : filter.searchResult.searchId;
        queryString += `&${filter.mode.toLowerCase()}=${filterOption}`;
    }

    return queryString;
};