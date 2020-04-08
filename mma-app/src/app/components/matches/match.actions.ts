import { createAction, props } from "@ngrx/store";
import { Filter, Organization } from "./match.model";


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