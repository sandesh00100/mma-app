import { createFeatureSelector, createSelector } from "@ngrx/store";
import { FilterState } from "./reducers";

export const selectFilterState = createFeatureSelector<FilterState>("filter");

export const selectFilters = createSelector(
    selectFilterState,
    filterState => filterState.filters
);