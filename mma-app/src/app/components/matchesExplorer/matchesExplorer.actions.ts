import { createAction, props } from "@ngrx/store";
import { Filter, Organization, Match } from "./match.model";
import { EntityActionFactory, EntityOp, MergeStrategy } from "@ngrx/data";
import { FilterState } from "./reducers/filter.reducer";


export const addFilter = createAction(
    "[Header Add Button] Adding Filter",
    props<{filter:Filter}>()
);

export const removeFilter = createAction(
    "[Filter Chips] Removing Filter",
    props<{filter:Filter}>()
);

export const updatePageOptions = createAction(
    "[Paginator] Updating Page Options",
    props<{currentPage:number,pageSize:number}>()
);

export const updateOrg = createAction(
    "[Orginization Tabs] Updating Orginization",
    props<{newOrg:Organization}>()
);

export const updateTotalMatches = createAction(
    "[Match Data Service] Updating Total Matches",
    props<{totalMatches:number}>()
);

export const getMatches = createAction(
    "[Filter Options] Updating Filter Options",
    props<{filterState:FilterState}>()
);

export const getMatchesSuccess = createAction(
    "[Match Explorer Effect] Successfully Fetched Matches",
    props<{message:string,matches:Match[],totalMatches:number}>()
);

export const getMatchesFailure = createAction(
    "[Match Explorer Effect] Failed to Fetch Matches"
);