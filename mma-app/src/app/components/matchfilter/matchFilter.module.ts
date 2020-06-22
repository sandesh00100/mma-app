import { NgModule } from '@angular/core';
import { MatPaginatorModule, MatChipsModule, MatIconModule } from '@angular/material';
import { MatchfilterComponent } from './matchfilter.component';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { filterReducer } from './reducers';

@NgModule({
  declarations:[MatchfilterComponent],
  imports: [
    MatPaginatorModule,
    CommonModule,
    MatChipsModule,
    MatIconModule,
    StoreModule.forFeature("filterReducer", filterReducer),
  ],
  exports:[MatchfilterComponent]
})
export class MatchFilterModule {
}
