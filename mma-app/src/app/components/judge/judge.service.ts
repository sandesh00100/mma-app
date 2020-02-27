import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { Subject, Observable } from 'rxjs';
import { MatSnackBar } from '@angular/material';
import { Stat } from '../matches/stat.model';
import { AuthData } from './judge.model';

// TODO: Add loading screen
const httpURL = environment.apiUrl + '/judge';
@Injectable({
  providedIn: 'root'
})
export class JudgeService {
  isAuth: boolean = false;
  private token: string;
  private authStatusListener = new Subject<boolean>();
  private judgeId: string;
  private tokenTimer: any;
  private email: string;
  private preferenceUpdateListener = new Subject<Stat[]>();
  private preferenceStats: Stat[];

  constructor(private http: HttpClient, private router: Router, private snackBar: MatSnackBar) { }

  getPreferences(): void{
    this.http.get<{message:string, stats: Stat[]}>(`${httpURL}/preference/stats`).subscribe(transformedStatData => {
      this.preferenceStats = transformedStatData.stats;
      this.preferenceUpdateListener.next([...this.preferenceStats]);
    });
  }

  getPreferenceUpdateListener(): Subject<Stat[]>{
    return this.preferenceUpdateListener;
  }

  updatePreferences(statList: Stat[]): Observable<{message: string}>{
    return this.http.post<{message:string}>(`${httpURL}/preference/stats`,statList);
  }

  updatePreferenceListeners(statList: Stat[]): void{
    this.preferenceStats = statList;
    this.preferenceUpdateListener.next([...this.preferenceStats]);
  };
  
  getStats(): Stat[]{
    return [...this.preferenceStats];
  };
  
  registerUser(email: string, password: string): void{
    const authData: AuthData = {
      email: email,
      password: password
    }

    // Don't want to authorize users right after because we want them to verify that their email is theirs
    this.http.post<{message:string}>(`${httpURL}/register`, authData)
      .subscribe(response => {
        this.snackBar.open(response.message, 'Success', {
          duration: 3000
        });
        this.router.navigate(['/']);
      }, errResponse => {
        this.snackBar.open(errResponse.error.message, 'ERROR', {
          duration: 3000
        });
      });
  }

  signinUser(email: string, password: string): void{
    const authData: AuthData = {
      email: email,
      password: password
    }

    this.http.post<{ message:string, token: string, expiresIn: number, id: string, email: string,preferences:Stat[]}>(`${httpURL}/signin`, authData)
      .subscribe(response => {
        console.log(response);
        if (response.token) {
          const expiresInDuration = response.expiresIn;
          this.setAuthTimer(expiresInDuration);
          this.email = email;
          this.judgeId = response.id;
          this.token = response.token;
          this.isAuth = true;
          this.authStatusListener.next(this.isAuth);
          const now = new Date();
          const expirationDate = new Date(now.getTime() + expiresInDuration * 1000);
          this.saveJudgeData(this.token, expirationDate, this.judgeId, this.email);
          this.authStatusListener.next(this.isAuth);
          
          this.snackBar.open(response.message, 'Success', {
            duration: 3000
          });

          this.router.navigate(['/']);
        }
      }, errResponse => {
        console.log(errResponse);
        this.snackBar.open(errResponse.error.message, 'ERROR', {
          duration: 3000
        });
      });
  }

  signinUserNew(authData:AuthData): Observable<{ message:string, token: string, expiresIn: number, id: string, email: string,preferences:any }>{
    return this.http.post<{ message:string, token: string, expiresIn: number, id: string, email: string,preferences:any}>(`${httpURL}/signin`, authData);
  }

  getAuthStatusListener():Subject<boolean>{
    return this.authStatusListener;
  }

  // TODO: need to check where else this should be used
  userIsAuth(): boolean{
    return this.isAuth;
  }

  getToken(): string{
    return this.token;
  }

  getEmail(): string{
    return this.email;
  }

  /**
   * Used automatically authenticate user if auth info is valid in local storage
   */
  autoAuthUser() {
    const authInfo = this.getJudgeData();
    if (!authInfo){
      return;
    }
    const now = new Date();
    const expiresIn = authInfo.expirationDate.getTime() - now.getTime();
    console.log(authInfo, expiresIn);
    if (expiresIn > 0) {
      this.token = authInfo.token;
      this.setAuthTimer(expiresIn/1000);
      this.isAuth = true;
      this.judgeId = authInfo.judgeId;
      this.email = authInfo.email;
      this.authStatusListener.next(true);
    }
  }
  
  /**
   * Saves auth info into local storage
   * @param token user login token
   * @param expirationDate date when the token is valid until
   * @param judgeId judgeId gotten from login
   * @param email email used to signin
   */
   private saveJudgeData(token: string, expirationDate: Date, judgeId: string, email: string): void {
    localStorage.setItem('token', token);
    // isostring to convert date to string
    localStorage.setItem('expiration', expirationDate.toISOString());
    localStorage.setItem('judgeId', judgeId);
    localStorage.setItem('email', email);
  }

  /**
   * Gets auth information from local storage and puts it in the service
   */
  private getJudgeData(): any{
    const token = localStorage.getItem("token");
    const expirationDate = localStorage.getItem("expiration");
    const judgeId = localStorage.getItem('judgeId');3
    
    const email = localStorage.getItem('email');
    if (!token || !expirationDate) {
      return;
    }

    return {
      token: token,
      expirationDate: new Date(expirationDate),
      judgeId: judgeId,
      email:email
    };
  }
  
  /**
   * Depending on the number of seconds. This sets a timer for the client side
   * @param duration number of seconds
   */
  private setAuthTimer(duration: number): void{
    // Set time in miliseconds
    console.log("setting timer: " + duration);
    this.tokenTimer = setTimeout(() => {
    }, duration * 1000);
  }
}
