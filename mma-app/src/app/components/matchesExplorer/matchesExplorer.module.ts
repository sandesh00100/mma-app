import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatchExplorerComponent } from './matchesExplorer.component';
import { MatExpansionModule, MatTabsModule, MatButtonModule, MatPaginatorModule, MatChipsModule, MatIconModule } from '@angular/material';
import { RouterModule } from '@angular/router';
import { StoreModule } from '@ngrx/store';
import { MatchResolver } from './matchesExplorer.resolver';
import { reducers } from './reducers';

@NgModule({
  declarations: [MatchExplorerComponent],
  imports: [
    CommonModule,
    MatExpansionModule,
    MatPaginatorModule,
    MatTabsModule,
    MatButtonModule,
    RouterModule,
    StoreModule.forFeature("matchExplorer", reducers),
    MatChipsModule,
    MatIconModule
  ],
  providers:[
    MatchResolver
  ]
})
export class MatchesModule {
}
