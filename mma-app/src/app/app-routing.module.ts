import { NgModule } from '@angular/core';
import { Routes, RouterModule} from '@angular/router';
import { MatchesComponent } from './components/matches/match-list-screen/match-list-screen.component';
import { AuthComponent } from './components/auth/auth.component';
import { JudgeScreenComponent } from './components/judge/judge-screen.component';
import { AuthGuard } from './components/auth/auth.guard';
import { HistoryComponent } from './components/history/history.component';

const routes: Routes = [
  {path:'', component:MatchesComponent},
  {path:'signin', component:AuthComponent},
  {path:'register', component:AuthComponent},
  {path:'judge/:matchId', component:JudgeScreenComponent, canActivate:[AuthGuard]},
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
