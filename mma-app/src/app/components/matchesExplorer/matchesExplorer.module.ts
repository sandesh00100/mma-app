import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatchExplorerComponent } from './matchesExplorer.component';
import { MatExpansionModule, MatTabsModule, MatButtonModule, MatPaginatorModule, MatChipsModule, MatIconModule } from '@angular/material';
import { RouterModule } from '@angular/router';
import { StoreModule } from '@ngrx/store';
import { MatchResolver } from './matchesExplorer.resolver';
import { reducers } from './reducers';
import { EffectsModule } from '@ngrx/effects';
import { MatcheExplorerEffects } from './matchesExplorer.effects';
import { MatchFilterModule } from '../matchfilter/matchFilter.module';

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
    EffectsModule.forFeature([MatcheExplorerEffects]),
    MatChipsModule,
    MatIconModule,
    MatchFilterModule
  ],
  providers:[
    MatchResolver
  ]
})
export class MatchesModule {
}
