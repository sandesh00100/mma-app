import { createAction, props } from "@ngrx/store";
import { AuthData, Judge } from "./judge.model";
import { Stat } from "../matches/stat.model";

export const login = createAction(
    "[Header Dropdown] Judge Login",
    props<{ authData: AuthData }>()
)

export const authenticated = createAction(
    "[Judge Effect] Authenticated",
    props<{ judge: Judge, preferences: Stat[], jwtToken: { token: string, expiresIn: number } }>()
);

export const authenticationFailed = createAction(
    "[Judge Effect] Failed To Authenticate",
    props<{ message: string }>()
);

export const autoAuth = createAction(
    "[Judge Effect] Start Timer",
    props<{ expirationDuration: number }>()
);

export const logout = createAction(
    "[Header Dropdown | Time Out] Judge Logout"
);