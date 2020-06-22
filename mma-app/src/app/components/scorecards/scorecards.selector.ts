import { ScoreCardsState } from "./reducers";
import { createFeatureSelector, createSelector } from "@ngrx/store";

export const scoreCardsState = createFeatureSelector<ScoreCardsState>("scoreCards");

export const areScorecardsLoaded = createSelector(
    scoreCardsState,
    scoreCardsState => scoreCardsState.matchesLoaded
);
