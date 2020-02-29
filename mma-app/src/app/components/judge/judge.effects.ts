import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { login, authenticated, authenticationFailed, logout, autoAuth, loadPreferences, preferencesLoaded, loadPreferencesFailed } from "./judge.actions";
import { JudgeService } from "./judge.service";
import { switchMap, map, tap, catchError } from 'rxjs/operators';
import { Judge } from "./judge.model";
import { of } from "rxjs";
import { Router } from "@angular/router";

@Injectable()
export class JudgeEffects {
    authenticate$ = createEffect(
        () => this.actions$
            .pipe(
                ofType(login),
                switchMap(action => {
                    return this.judgeService.signinUserNew(action.authData);
                }),
                tap(
                    response => {
                        const now = new Date();
                        const expirationDuration = response.expiresIn;
                        const expirationDate = new Date(now.getTime() + expirationDuration * 1000)
                        localStorage.setItem("token", response.token);
                        localStorage.setItem("expiration", expirationDate.toISOString());
                        localStorage.setItem("judgeId", response.id);
                        localStorage.setItem("email", response.email);
                        localStorage.setItem("tokenExpirationDuration", expirationDuration.toString());

                        this.judgeService.setAuthTimer(expirationDuration);
                    }
                ),
                map(response => {
                    const judge: Judge = {
                        id: response.id,
                        email: response.email
                    }

                    const modifiedPreferences = response.preferences.stats.map(stat => {
                        return { ...stat, id: stat._id };
                    });

                    return authenticated(
                        {
                            judge: judge,
                            jwtToken: {
                                token: response.token,
                                expiresIn: response.expiresIn
                            },
                            preferences: modifiedPreferences
                        });
                }),
                //TODO: Proabably want to retry if it's not a 404
                catchError(err => of(authenticationFailed({ message: err.error.message })))
            )
    );

    logOut$ = createEffect(
        () => this.actions$.pipe(
            ofType(logout),
            tap(
                () => {
                    localStorage.removeItem("token");
                    localStorage.removeItem("expiration");
                    localStorage.removeItem("judgeId");
                    localStorage.removeItem("email");
                    localStorage.removeItem("tokenExpirationDuration");
                    this.router.navigate(["/signin"]);
                }
            )
        ),
        { dispatch: false }
    );
    
    loadPreferences$ = createEffect(
        () => this.actions$.pipe(
            ofType(loadPreferences),
            switchMap(
                () => this.judgeService.getPreferencesNew()
            ),
            map(response => {
                const modifiedPreferences = response.stats.map(stat => {
                    return { ...stat, id: stat._id };
                });
                return preferencesLoaded({preferences:modifiedPreferences})
            }),
            catchError(err => of(authenticationFailed({ message: err.error.message })))
        )
    );
    constructor(private actions$: Actions, private judgeService: JudgeService, private router: Router) {

    }
}