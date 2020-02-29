import { createSelector, createFeatureSelector } from "@ngrx/store";
import { JudgeState } from "./reducers";
import * as fromPreferences from "./reducers/preference.reducer"

export const selectJudgeState = createFeatureSelector<JudgeState>("judge");

export const selectAuthState = createSelector(
    selectJudgeState,
    judgeState => judgeState.auth
);

export const selectPreferenceState = createSelector(
    selectJudgeState,
    judgeState => judgeState.preferences
);

export const selectJudge = createSelector(
    selectAuthState,
    authState => authState.judge
);

export const isAuth = createSelector(
    selectAuthState,
    authState => authState.isAuth
);

export const isNotAuth = createSelector(
    isAuth,
    authStatus => !authStatus
);

export const selectToken = createSelector(
    selectAuthState,
    authState => authState.jwtToken.token
);

export const selectPreferences = createSelector(
    selectPreferenceState,
    fromPreferences.selectAllArticles
);
