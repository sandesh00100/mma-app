import { BrowserModule, HAMMER_GESTURE_CONFIG } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { GestureConfig} from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AuthInterceptor } from './components/auth/auth.interceptor';
import { PreferencesComponent } from './components/judge/preferences/preferences.component';
import { StoreModule } from '@ngrx/store';
import { reducers, metaReducers } from './reducers';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { environment } from '../environments/environment';
import { AuthModule } from './components/auth/auth.module';
import { HeaderModule } from './components/header/header.module';
import { JudgeModule } from './components/judge/judge.module';
import { MatchesModule } from './components/matches/matches.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AppRoutingModule,
    HeaderModule,
    MatchesModule,
    JudgeModule,
    AuthModule,
    StoreModule.forRoot(reducers, {
      metaReducers, 
      runtimeChecks: {
        strictStateImmutability: true,
        strictActionImmutability: true,
      }
    }),
    !environment.production ? StoreDevtoolsModule.instrument() : []
  ],
  // Hammerjs used to make sliding work for matsliders
  
  providers: [
    {provide: HAMMER_GESTURE_CONFIG, useClass: GestureConfig},
    {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true}
  ],
  bootstrap: [AppComponent],
  // TODO: look more at entry components and providers
  // Since it's a dialog angular doesn't see it so we have to put it as entry components
  entryComponents: [PreferencesComponent]
})
export class AppModule { }
