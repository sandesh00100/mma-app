import { FilterState } from "../matchesExplorer/reducers/filter.reducer";
import { props, createAction } from "@ngrx/store";


export const getScoreCards = createAction(
    "[Scorecard Resolver] Fetching scorecards"
);