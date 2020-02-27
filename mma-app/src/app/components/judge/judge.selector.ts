import { createSelector, createFeatureSelector } from "@ngrx/store";
import { JudgeState } from "./reducers";

export const selectJudgeState = createFeatureSelector<JudgeState>("judge");

export const selectAuthState = createSelector(
    selectJudgeState,
    judgeState => judgeState.auth
);

export const isAuth = createSelector(
    selectAuthState,
    authState => authState.isAuth
);

export const isNotAuth = createSelector(
    isAuth,
    authStatus => !authStatus
);

export const selectJudge = createSelector(
    selectAuthState,
    authState => authState.judge
);