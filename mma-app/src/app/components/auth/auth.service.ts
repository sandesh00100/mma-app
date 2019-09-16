import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthData } from './auth.model';
import { environment } from 'src/environments/environment';
import { Subject } from 'rxjs';


const httpURL = environment.apiUrl + 'judge';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  isAuth: boolean = false;
  private authStatusListener = new Subject<{ isAuth: boolean, username: string }>();
  constructor(private http: HttpClient, private router: Router) { }

  registerUser(email: string, password: string) {
    const authData: AuthData = {
      email: email,
      password: password
    }

    // Don't want to authorize users right after because we want them to verify that their email is theirs
    this.http.post(`${httpURL}/register`, authData)
      .subscribe(response => {
        console.log("Register server response: ");
        console.log(response);
        this.router.navigate(['/']);
      });
  }

  signinUser(email: string, password: string) {
    const authData: AuthData = {
      email: email,
      password: password
    }

    this.http.post<{ token: string, expiresIn: number, judgeId: string, email: string }>(`${httpURL}/signin`, authData)
      .subscribe(response => {
        console.log("sigin server response: ");
        console.log(response);
        this.isAuth = true;
        this.authStatusListener.next({ isAuth: this.isAuth, username: response.email});
        this.router.navigate(['/']);
      });
  }

  signout(){
    this.isAuth = false;
    this.authStatusListener.next({isAuth:this.isAuth, username:''});
    this.router.navigate(["/"]);
  }

  getAuthStatusListener() {
    return this.authStatusListener;
  }
  
  userIsAuth(){
    return this.isAuth;
  }
}
