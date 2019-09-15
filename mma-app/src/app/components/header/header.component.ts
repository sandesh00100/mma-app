import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Subscriber, Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  private authServiceListener: Subscription;
  isAuth:boolean = false;
  username:string;
  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.authServiceListener = this.authService.getAuthStatusListener().subscribe(authData => {
      this.isAuth = authData.isAuth;
      this.username = authData.username;
    });
  }

  signout(){
    this.authService.signout();
  }

}
