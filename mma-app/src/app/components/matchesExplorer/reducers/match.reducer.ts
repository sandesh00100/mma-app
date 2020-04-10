import { EntityState, createEntityAdapter } from "@ngrx/entity";
import { Match } from "../match.model";
import { createReducer } from "@ngrx/store";

export interface MatchState extends EntityState<Match> {
    matchesLoaded:boolean
}

export const adapter = createEntityAdapter<Match>({});

export const initialMatchState = adapter.getInitialState({
    matchesLoaded:false
});

export const matchReducer = createReducer(
    initialMatchState
);

export const {
    selectIds: selectArticleIds,
    selectEntities: selectArticleEntities,
    selectAll: selectAllArticles,
    selectTotal: articlesCount
 } = adapter.getSelectors(); 