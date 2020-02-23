import { createAction, props } from "@ngrx/store";
import { AuthData, Judge } from "./judge.model";

export const login = createAction(
    "[Login Page] User Login",
    props<{authData:AuthData}>()
)

export const authenticated = createAction(
    "[Authenticate Effect]",
    props<{judge:Judge,token:string}>()
);

export const logout = createAction(
    "[Header Dropdown] User Login"
)