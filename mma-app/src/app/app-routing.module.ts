import { NgModule } from '@angular/core';
import { Routes, RouterModule} from '@angular/router';
import { LoginComponent } from './components/judge/login/login.component';
import { ScoreCardComponent } from './components/scorecards/scorecard/scorecard.component';
import { AuthGuard } from './components/judge/auth.guard';
import { HistoryComponent } from './components/scorecards/history/history.component';
import { MatchExplorerComponent } from './components/matchesExplorer/matchesExplorer.component';
import { MatchResolver } from './components/matchesExplorer/matchesExplorer.resolver';

const routes: Routes = [
  {path:'', component:MatchExplorerComponent, resolve:{
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

