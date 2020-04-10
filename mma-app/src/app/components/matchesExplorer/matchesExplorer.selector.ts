import { createFeatureSelector, createSelector } from "@ngrx/store";
import { FilterState } from "./reducers/filter.reducer";
import { MatchExplorerState } from "./reducers";

export const selectMatchList = createFeatureSelector<MatchExplorerState>("matchExplorer");

export const selectFilterState = createSelector(
    selectMatchList,
    matchListState => matchListState.filter
);

export const selectFilters = createSelector(
    selectFilterState,
    filterState => filterState.filters
);