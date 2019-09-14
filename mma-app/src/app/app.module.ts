import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { MatToolbarModule, MatTabsModule, MatCardModule, MatExpansionModule, MatButtonModule, MatPaginatorModule, MatDividerModule, MatListModule} from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatchesComponent } from './components/matches/matches.component';
import { HttpClientModule } from '@angular/common/http';
import { AuthComponent } from './components/auth/auth.component';
import { AppRoutingModule } from './app-routing.module';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    MatchesComponent,
    AuthComponent
  ],
  imports: [
    BrowserModule,
    MatToolbarModule,
    BrowserAnimationsModule,
    MatTabsModule,
    MatCardModule,
    MatExpansionModule,
    MatButtonModule,
    MatPaginatorModule,
    HttpClientModule,
    MatDividerModule,
    MatListModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
