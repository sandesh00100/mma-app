import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatchesComponent } from './match-list-screen/match-list-screen.component';
import { MatExpansionModule, MatTabsModule, MatButtonModule, MatPaginatorModule, MatChipsModule, MatIconModule } from '@angular/material';
import { RouterModule } from '@angular/router';
import { EntityDefinitionService, EntityDataService, EntityMetadataMap } from '@ngrx/data';
import { MatchesDataService } from './matches.data.service';
import { MatchEntityService } from './match.entity.service';
import { StoreModule } from '@ngrx/store';
import { filterReducer } from './reducers';
import { MatchResolver } from './match.resolver';

const entityMetaData: EntityMetadataMap = {
  Match: {
    entityDispatcherOptions:{
      // by default is pessimistic
      optimisticUpdate:true
    }
  }
};

@NgModule({
  declarations: [MatchesComponent],
  imports: [
    CommonModule,
    MatExpansionModule,
    MatPaginatorModule,
    MatTabsModule,
    MatButtonModule,
    RouterModule,
    StoreModule.forFeature("filter",filterReducer),
    MatChipsModule,
    MatIconModule
  ],
  providers:[
    MatchEntityService,
    MatchesDataService,
    MatchResolver
  ]
})
export class MatchesModule {
  constructor(private eds: EntityDefinitionService, private entityDataService: EntityDataService, private matchDataService: MatchesDataService) {
    eds.registerMetadataMap(entityMetaData);
    entityDataService.registerService("Match", matchDataService);
  }
}
