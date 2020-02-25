import { ActionReducerMap } from "@ngrx/store";
import { PreferenceState, preferenceReducer } from "./preference.reducer";
import { AuthState, authReducer } from "./auth.reducer";

export interface JudgeState {
    auth:AuthState
    preferences:PreferenceState;
}

export const reducers: ActionReducerMap<JudgeState> = {
    preferences:preferenceReducer,
    auth:authReducer
  };