import { EntityState, createEntityAdapter } from "@ngrx/entity";
import { createReducer, on } from "@ngrx/store";
import { ScoreCard } from "../scorecard/scorecard.model";

export interface ScoreCardsState extends EntityState<ScoreCard> {
    matchesLoaded:boolean
}

export const adapter = createEntityAdapter<ScoreCard>({});

export const initialScoreCardsState = adapter.getInitialState({
    scoreCardsLoaded:false
});

export const scoreCardReducer = createReducer(
    initialScoreCardsState,
);

export const {
    selectIds: selectArticleIds,
    selectEntities: selectArticleEntities,
    selectAll: selectAllArticles,
    selectTotal: articlesCount
 } = adapter.getSelectors(); 