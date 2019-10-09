import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

const httpURL = environment.apiUrl + 'judge/';

@Injectable({
  providedIn: 'root'
})
export class JudgeService {

  constructor(private http:HttpClient) { 

  }

  getPreferences() {
    this.http.get<{message:string, stats: any}>(`${httpURL}/preference/stats`).subscribe((preferenceData) => {

    });
  }
}
