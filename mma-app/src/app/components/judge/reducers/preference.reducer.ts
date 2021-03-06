import {createEntityAdapter, EntityState} from '@ngrx/entity';
import { createReducer, on } from "@ngrx/store";
import { authenticated, preferencesLoaded, statAdded, deleteStat, updateStat } from "../judge.actions";
import { Stat } from '../../matchesExplorer/stat.model';

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
    on(preferencesLoaded, (state,action) => adapter.addAll(action.preferences,{...state,preferencesLoaded:true})),
    on(statAdded,(state,action) => adapter.addOne(action.stat,state)),
    on(deleteStat,(state,action) => adapter.removeOne(action.statId,state)),
    on(updateStat,(state,action) => adapter.updateOne(action.update,state))
);

export const {
    selectIds: selectArticleIds,
    selectEntities: selectArticleEntities,
    selectAll: selectAllArticles,
    selectTotal: articlesCount
 } = adapter.getSelectors(); 