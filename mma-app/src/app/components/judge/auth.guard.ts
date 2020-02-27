import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from "@angular/router";
import { Observable } from "rxjs";
import { Injectable } from "@angular/core";
import { JudgeService } from "./judge.service";
import { AppState } from "src/app/reducers";
import { Store, select } from "@ngrx/store";
import { isAuth } from "./judge.selector";
import { tap } from "rxjs/operators";

@Injectable()
export class AuthGuard implements CanActivate{
    constructor(private judgeService: JudgeService, private router:Router, private store:Store<AppState>){
        
    }
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean>{
        console.log("Activating guard");
        return this.store.pipe(
            select(isAuth),
            tap(
                isAuth => {
                    if (!isAuth){
                        this.router.navigate(['/signin']);
                    }
                }
            )
        );
    }

}