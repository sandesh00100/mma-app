import { createFeatureSelector, createSelector } from "@ngrx/store";
import { MatchExplorerState } from "./reducers";
import { selectAllArticles } from "./reducers/match.reducer";

export const selectMatchList = createFeatureSelector<MatchExplorerState>("matchExplorer");

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
    matchListState => matchListState.matches.matchesLoaded
);

export const selectMatchState = createSelector(
    selectMatchList,
    matchList => matchList.matches,
);

export const selectAllMatches = createSelector(
    selectMatchState,
    selectAllArticles
);