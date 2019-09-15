import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthData } from './auth.model';
import { environment } from 'src/environments/environment';
import { Subject } from 'rxjs';


const httpURL = environment.apiUrl + 'user/';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  isAuth: boolean = false;
  private authStatusListener = new Subject<boolean>();
  constructor(private http: HttpClient, private router: Router) { }
  
  registerUser(email:string, password:string) {
    const authData: AuthData = {
      email: email,
      password: password
    }

    // Don't want to authorize users right after because we want them to verify that their email is theirs
    this.http.post(`${httpURL}signup`, authData)
      .subscribe(response => {
        this.router.navigate(['/']);
      });
    }
  
    getAuthStatusListener(){
      return this.authStatusListener;
    }
}
