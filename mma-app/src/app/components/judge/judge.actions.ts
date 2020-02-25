import { createAction, props } from "@ngrx/store";
import { AuthData, Judge } from "./judge.model";
import { Stat } from "../matches/stat.model";

export const login = createAction(
    "[Login Page] User Login",
    props<{authData:AuthData}>()
)

export const authenticated = createAction(
    "[Authenticate Effect] Authenticated",
    props<{judge:Judge,preferences:Stat[],jwtToken:{token:string,expiresIn:number}}>()
);

export const authenticationFailed = createAction(
    "[Authenticate Effect] Failed To Authenticate",
    props<{message:string}>()
);

export const logout = createAction(
    "[Header Dropdown] User Login"
);