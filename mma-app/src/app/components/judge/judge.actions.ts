import { createAction, props } from "@ngrx/store";
import { AuthData, Judge, JwtToken } from "./judge.model";
import { Stat } from "../matches/stat.model";

export const login = createAction(
    "[Header Dropdown] Judge Login",
    props<{ authData: AuthData }>()
)

export const authenticated = createAction(
    "[Judge Effect] Authenticated",
    props<{ judge: Judge, preferences: Stat[], jwtToken:JwtToken }>()
);

export const authenticationFailed = createAction(
    "[Judge Effect] Failed To Authenticate",
    props<{ message: string }>()
);

export const loadAuthInfoFromStorage = createAction(
    "[Judge Service] Load Judge From Local Storage",
    props<{ judge: Judge, jwtToken:JwtToken}>()
);

export const loadPreferences = createAction(
    "[Judge Service] Load Preferences"
);

export const preferencesLoaded = createAction(
    "[Judge Effect] Preferences Loaded",
    props<{preferences:Stat[]}>()
);
export const loadPreferencesFailed = createAction(
    "[Judge Effect] Load Preferences failed",
    props<{ message: string }>()
);

export const autoAuth = createAction(
    "[App Component] Auto Authenticate"
);

export const logout = createAction(
    "[Header Dropdown | Time Out] Judge Logout"
);