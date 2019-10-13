import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Subscriber, Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
 
  private authServiceListener: Subscription;
  isAuth:boolean = false;
  username:string;
  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.isAuth = this.authService.userIsAuth();
    this.username = this.authService.getEmail();
    
    this.authServiceListener = this.authService.getAuthStatusListener().subscribe(auth => {
      this.isAuth = auth;
      this.username = this.authService.getEmail();
    });
  }

  ngOnDestroy(): void {
   this.authServiceListener.unsubscribe();
  }

  signout(){
    this.authService.signout();
  }

}
