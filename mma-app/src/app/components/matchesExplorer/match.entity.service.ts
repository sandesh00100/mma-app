import { Injectable } from "@angular/core";
import { Match } from "./match.model";
import { EntityCollectionServiceBase, EntityCollectionServiceElementsFactory } from "@ngrx/data";

@Injectable()
export class MatchEntityService extends EntityCollectionServiceBase<Match>{
    constructor(serviceElementsFactory: EntityCollectionServiceElementsFactory){
        super("Match", serviceElementsFactory);
    }
}
