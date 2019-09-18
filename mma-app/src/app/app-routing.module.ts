import { NgModule } from '@angular/core';
import { Routes, RouterModule} from '@angular/router';
import { MatchesComponent } from './components/matches/match-list-screen/match-list-screen.component';
import { AuthComponent } from './components/auth/auth.component';
import { JudgeScreenComponent } from './components/matches/judge-screen/judge-screen.component';
import { AuthGuard } from './components/auth/auth.guard';

const routes: Routes = [
  {path:'', component:MatchesComponent},
  {path:'signin', component:AuthComponent},
  {path:'register', component:AuthComponent},
  {path:'judge/:matchId', component:JudgeScreenComponent, canActivate:[AuthGuard]}
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
