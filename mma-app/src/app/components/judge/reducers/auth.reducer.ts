import { createReducer, on } from "@ngrx/store";
import { authenticated, logout} from "../judge.actions";
import { Judge } from "../judge.model";

export interface AuthState {
    judge: Judge;
    isAuth: boolean;
    jwtToken: {
        token:string,
        expiresIn:number
    };
}

export const initialAuthState: AuthState = {
    judge:null,
    isAuth: false,
    jwtToken:null
};

export const authReducer = createReducer(
    initialAuthState,
    on(authenticated, (state: AuthState,action) => {
        return {
            judge: action.judge,
            isAuth: true,
            jwtToken:action.jwtToken
        };
    }),
    on(logout, (state:AuthState, action) => {
        return {
            judge:null,
            isAuth: false,
            jwtToken:null
        }
    })
);