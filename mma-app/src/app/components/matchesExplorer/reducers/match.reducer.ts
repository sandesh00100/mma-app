import { EntityState, createEntityAdapter } from "@ngrx/entity";
import { Match } from "../match.model";
import { createReducer, on } from "@ngrx/store";
import { getMatchesSuccess } from "../matchesExplorer.actions";

export interface MatchState extends EntityState<Match> {
    matchesLoaded:boolean
}

export const adapter = createEntityAdapter<Match>({});

export const initialMatchState = adapter.getInitialState({
    matchesLoaded:false
});

export const matchReducer = createReducer(
    initialMatchState,
    on(getMatchesSuccess,(state,action) => adapter.addAll(action.matches,{...state,matchesLoaded:true})),
);

export const {
    selectIds: selectArticleIds,
    selectEntities: selectArticleEntities,
    selectAll: selectAllArticles,
    selectTotal: articlesCount
 } = adapter.getSelectors(); 