import { NgModule } from '@angular/core';
import { Routes, RouterModule} from '@angular/router';
import { MatchesComponent } from './components/matches/match-list-screen/match-list-screen.component';
import { LoginComponent } from './components/judge/login/login.component';
import { ScoreCardComponent } from './components/scorecards/scorecard/scorecard.component';
import { AuthGuard } from './components/judge/auth.guard';
import { HistoryComponent } from './components/scorecards/history/history.component';
import { MatchResolver } from './components/matches/match.resolver';

const routes: Routes = [
  {path:'', component:MatchesComponent, resolve:{
    Matches:MatchResolver
  }},
  {path:'signin', component:LoginComponent},
  {path:'register', component:LoginComponent},
  {path:'judge/:matchId', component:ScoreCardComponent, canActivate:[AuthGuard]},
  {path:'history', component: HistoryComponent}
]
@NgModule({
  declarations: [],
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [
    RouterModule
  ],
  providers:[AuthGuard]
})
export class AppRoutingModule { }

