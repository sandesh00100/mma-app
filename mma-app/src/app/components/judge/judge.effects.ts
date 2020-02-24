import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { login, authenticated } from "./judge.actions";
import { JudgeService } from "./judge.service";
import { switchMap, map} from 'rxjs/operators';

@Injectable()
export class JudgeEffects {
    // authenticate$ = createEffect(
    //     () => this.actions$
    //     .pipe(
    //         ofType(login),
    //         switchMap(action => this.judgeService.signinUserNew(action.authData)),
    //         map(response => authenticated({judge:{}}))
    //     ),
    //     {dispatch:false}
    // );

    constructor(private actions$: Actions, private judgeService: JudgeService) {

    }
}