import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { login, authenticated, authenticationFailed, logout } from "./judge.actions";
import { JudgeService } from "./judge.service";
import { switchMap, map, tap, catchError } from 'rxjs/operators';
import { Judge } from "./judge.model";
import { of } from "rxjs";

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
                        const expirationDate = new Date(now.getTime() + response.expiresIn * 1000)
                        localStorage.setItem("token", response.token);
                        localStorage.setItem("expiration", expirationDate.toISOString());
                        localStorage.setItem("judgeId", response.id);
                        localStorage.setItem("email", response.email);
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
                }
            )
        ),
        { dispatch: false }
    );
    constructor(private actions$: Actions, private judgeService: JudgeService) {

    }
}