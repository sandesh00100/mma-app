import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { HistoryComponent } from './history/history.component';
import { PreferencesComponent } from '../judge/preferences/preferences.component';
import { ScoreCardComponent } from './scorecard/scorecard.component';
import { MatTabsModule, MatCardModule, MatExpansionModule, MatButtonModule, MatPaginatorModule, MatDialogModule, MatSlideToggleModule, MatSnackBarModule, MatTableModule, MatOptionModule, MatSelectModule, MatDividerModule, MatListModule, MatInputModule, MatIconModule } from '@angular/material';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { StoreModule } from '@ngrx/store';
import { scoreCardReducer } from './reducers/index';


@NgModule({
  declarations: [HistoryComponent,PreferencesComponent,ScoreCardComponent],
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatPaginatorModule,
    MatDialogModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatTableModule,
    MatOptionModule,
    MatSelectModule,
    MatDividerModule,
    MatListModule,
    MatInputModule,
    MatButtonModule,
    RouterModule,
    ReactiveFormsModule,
    FormsModule,
    MatIconModule,
    StoreModule.forFeature("scoreCard", scoreCardReducer)
  ] 
})
export class ScoreCardsModule { }
