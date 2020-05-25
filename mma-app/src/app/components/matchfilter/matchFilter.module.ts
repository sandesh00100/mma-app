import { NgModule } from '@angular/core';
import { MatPaginatorModule, MatChipsModule, MatIconModule } from '@angular/material';
import { MatchfilterComponent } from './matchfilter.component';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations:[MatchfilterComponent],
  imports: [
    MatPaginatorModule,
    CommonModule,
    MatChipsModule,
    MatIconModule
  ],
  exports:[MatchfilterComponent]
})
export class MatchFilterModule {
}
