import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { login, authenticated, authenticationFailed, logout, autoAuth, loadPreferences, preferencesLoaded, loadPreferencesFailed, addStat, statAdded, statAddedFailed, deleteStat, deleteStatFailed, deletedStat, updateStat, updatedStatFailed, updatedStat } from "./judge.actions";
import { JudgeService } from "./judge.service";
import { switchMap, map, tap, catchError, mergeMap, concatMap } from 'rxjs/operators';
import { Judge } from "./judge.model";
import { of } from "rxjs";
import { Router } from "@angular/router";
import { dispatch } from "rxjs/internal/observable/pairs";

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
                //TODO: It seems like sometimes you are not able to sign in right after you register
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
    
    addStat$ = createEffect(
        () => this.actions$.pipe(
            ofType(addStat),
            mergeMap(
                addStatAction => {
                    return this.judgeService.addStat(addStatAction.stat);
                }
            ),
            map(
                (response:any) => {
                    console.log(response);
                    const modifiedStat = {
                        ...response.savedStat,
                        id:response.savedStat._id
                    };
                    return statAdded({stat:modifiedStat});
                }
            ),
            catchError(err => of(statAddedFailed))
        )
    );

    deleteStat$ = createEffect(
        () => this.actions$.pipe(
            ofType(deleteStat),
            mergeMap(
                action => this.judgeService.deleteStat(action.statId)  
            ),
            map(
                response => deletedStat(response.message)
            ),
            catchError(err => of(deleteStatFailed))
        )
    );
    
    // TODO: might need to turn dispatch on if catch error doesn't work with it off
    updateStat$ = createEffect(
        () => this.actions$.pipe(
            ofType(updateStat),
            concatMap(
                action => this.judgeService.updatePreference(action.update.id, action.update.changes)
            ),
            map(
                (response: any) => updatedStat(response.message)
            ),  
            catchError(err => of(updatedStatFailed))
        )
    );
    constructor(private actions$: Actions, private judgeService: JudgeService, private router: Router) {

    }
}