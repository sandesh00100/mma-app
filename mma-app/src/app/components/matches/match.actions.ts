import { createAction, props } from "@ngrx/store";
import { Filter } from "./match.model";


export const addFilter = createAction(
    "[Header Add Button] Adding Filter",
    props<{filter:Filter}>()
);

export const removeFilter = createAction(
    "[Filter Chips] Removing Filter",
    props<{filter:Filter}>()
);

export const updateItemsPerPage = createAction(
    "[Filter Options] Updating Items Per Page",
    props<{itemsPerPage:number}>()
);

export const nextPage = createAction(
    "[Filter Options] Next Page"
);

export const prevPage = createAction(
    "[Filter Options] Previous Page" 
);