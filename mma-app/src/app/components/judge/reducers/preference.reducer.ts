import { Stat } from "../../matches/stat.model";
import {createEntityAdapter, EntityState} from '@ngrx/entity';
import { createReducer, on } from "@ngrx/store";
import { authenticated, preferencesLoaded } from "../judge.actions";

export interface PreferenceState extends EntityState<Stat> {
    preferencesLoaded:boolean
}

export const adapter = createEntityAdapter<Stat>({
});

export const initialPreferenceState = adapter.getInitialState({
    preferencesLoaded:false
});

// TODO: Might want to switch to a case statement
export const preferenceReducer = createReducer(
    initialPreferenceState,
    on(authenticated, (state,action) => adapter.addAll(action.preferences,{...state,preferencesLoaded:true})),
    on(preferencesLoaded, (state,action) => adapter.addAll(action.preferences,{...state,preferencesLoaded:true}))
);

export const {
    selectIds: selectArticleIds,
    selectEntities: selectArticleEntities,
    selectAll: selectAllArticles,
    selectTotal: articlesCount
 } = adapter.getSelectors(); 