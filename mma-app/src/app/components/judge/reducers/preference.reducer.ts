import { Stat } from "../../matches/stat.model";
import {createEntityAdapter, EntityState} from '@ngrx/entity';
import { createReducer, on } from "@ngrx/store";
import { authenticated } from "../judge.actions";

export interface PreferenceState extends EntityState<Stat> {
    preferencesLoaded:boolean
}

export const adapter = createEntityAdapter<Stat>({
});

export const initialPreferenceState = adapter.getInitialState({
    preferencesLoaded:false
});

export const preferenceReducer = createReducer(
    initialPreferenceState,
    on(authenticated, (state,action) => adapter.addAll(action.preferences,{...state,preferencesLoaded:true})
    )
);

export const selectAll = adapter.getSelectors();