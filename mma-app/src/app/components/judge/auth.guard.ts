import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from "@angular/router";
import { Observable } from "rxjs";
import { Injectable } from "@angular/core";
import { JudgeService } from "./judge.service";

@Injectable()
export class AuthGuard implements CanActivate{
    constructor(private judgeService: JudgeService, private router:Router){
        
    }
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Observable<boolean> | Promise<boolean> {
        const isAuth = this.judgeService.userIsAuth();
        if (!isAuth){
            this.router.navigate(['/signin']);
        }
        return isAuth;
    }

}