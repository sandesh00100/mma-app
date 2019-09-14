import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule} from '@angular/router';
import { MatchesComponent } from './components/matches/matches.component';
import { AuthComponent } from './components/auth/auth.component';

const routes: Routes = [
  {path:'', component:MatchesComponent},
  {path:'signin', component:AuthComponent},
  {path:'register', component:AuthComponent}
  // {path:'judge/:matchId', component:JudgeComponent}
]
@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ]
})
export class AppRoutingModule { }
