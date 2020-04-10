import { createAction, props } from "@ngrx/store";
import { AuthData, Judge, JwtToken } from "./judge.model";
import { Update } from "@ngrx/entity";
import { Stat } from "../matchesExplorer/stat.model";

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

export const addStat = createAction(
    "[Preference Dialog] Add Stat",
    props<{stat:Stat}>()
);

export const statAdded = createAction(
    "[Judge Effect] Stat Added",
    props<{stat:Stat}>()
);

export const statAddedFailed = createAction(
    "[Judge Effect] Stat Add Failed"
);

export const deleteStat = createAction(
    "[Preference Dialog] Stat Delete",
    props<{statId:string}>()
);

export const deletedStat = createAction(
    "[Preference Dialog] Stat Deleted",
    props<{message:string}>()
);

export const deleteStatFailed = createAction(
    "[Judge Effect] Stat Delete Failed",
    props<{statId:string}>()
);

export const updateStat = createAction(
    "[Perference Dialog] Updating Stat",
    props<{update: Update<Stat>}>()
);

export const updatedStat = createAction(
    "[Judge Effect] Stat Updated",
    props<{message: string}>()
);

export const updatedStatFailed = createAction(
    "[Judge Effect] Stat Update Failed",
    props<{message: string}>()
);