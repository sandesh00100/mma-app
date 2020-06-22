import { createFeatureSelector, createSelector } from "@ngrx/store";
import { selectAllArticles } from "./reducers/index";
import { MatchState } from "./reducers";

export const selectMatchList = createFeatureSelector<MatchState>("Matches");

export const selectFilterState = createSelector(
    selectMatchList,
    matchListState => matchListState.filter
);

export const selectFilters = createSelector(
    selectFilterState,
    filterState => filterState.filters
);

export const areMatchesLoaded = createSelector(
    selectMatchList,
    matchListState => matchListState.matchesLoaded
);

export const selectMatchState = createSelector(
    selectMatchList,
    matchList => matchList,
);

export const selectAllMatches = createSelector(
    selectMatchState,
    selectAllArticles
);