import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatchesComponent } from './match-list-screen/match-list-screen.component';
import { MatExpansionModule, MatTabsModule, MatButtonModule, MatPaginatorModule } from '@angular/material';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [MatchesComponent],
  imports: [
    CommonModule,
    MatExpansionModule,
    MatPaginatorModule,
    MatTabsModule,
    MatButtonModule,
    RouterModule
  ]
})
export class MatchesModule { }
