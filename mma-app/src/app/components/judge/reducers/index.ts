import { Judge } from "../judge.model";
import { createReducer, on } from "@ngrx/store";
import { login, authenticated } from "../judge.actions";

export interface JudgeState {
    judge: Judge;
    isAuth: boolean;
    jwtToken: string;
}

export const initialJudgeState: JudgeState = {
    judge:null,
    isAuth: false,
    jwtToken:null
};

export const judgeReducer = createReducer(
    initialJudgeState,
    on(authenticated, (state: JudgeState,action) => {
        return {
            judge: action.judge,
            isAuth: true,
            jwtToken:action.token
        };
    })
);