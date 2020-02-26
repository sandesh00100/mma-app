import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { autoAuth } from "./app.actions";
import { tap } from "rxjs/operators";

@Injectable()
export class AppEffects {
    autoAuth$ = createEffect(
        () => this.actions$.pipe(
            ofType(autoAuth),
            tap(
            )
        ),
        { dispatch: false });

    constructor(private actions$: Actions) {

    }
}