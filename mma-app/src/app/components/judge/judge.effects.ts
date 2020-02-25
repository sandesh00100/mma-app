import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { login, authenticated, authenticationFailed } from "./judge.actions";
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
                map(response => {
                    const judge: Judge = {
                        id: response.id,
                        email: response.email
                    }

                    const modifiedPreferences = response.preferences.stats.map(stat => {
                        return {...stat,id:stat._id};
                    });

                    return authenticated(
                        {
                            judge:judge,
                            jwtToken: {
                                token: response.token,
                                expiresIn: response.expiresIn
                            },
                            preferences: modifiedPreferences
                        });
                }),
                catchError(err => of(authenticationFailed({message:err.error.message})))
            )
    );

    constructor(private actions$: Actions, private judgeService: JudgeService) {

    }
}