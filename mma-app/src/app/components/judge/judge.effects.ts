import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { login } from "./judge.actions";
import { JudgeService } from "./judge.service";
import { switchMap} from 'rxjs/operators';

@Injectable()
export class JudgeEffects {
    // authenticate$ = createEffect(
    //     () => this.actions$
    //     .pipe(
    //         ofType(login),
    //         switchMap(action => this.judgeService.signinUser(action.authData))
    //     )
    // );

    constructor(private actions$: Actions, private judgeService: JudgeService) {

    }
}