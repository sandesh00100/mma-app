import { Component } from '@angular/core';
import { AuthService } from './components/judge/judge.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(private authService: AuthService){
    
  }
  ngOnInit(): void {
    this.authService.autoAuthUser();
  }
  title = 'app';
}
