import { Component, OnInit } from '@angular/core';
import { AuthService } from './auth.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router} from '@angular/router';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {
  form:FormGroup;
  mode: String;
  constructor(private authService: AuthService,private router:Router) { }

  ngOnInit() {
    this.form = new FormGroup({
      email: new FormControl(null,{
        validators: [Validators.required]
      }),
      password: new FormControl(null,{
        validators: [Validators.required]
      })
    });
    console.log("Current router url: " + this.router.url);
    if (this.router.url == '/signin'){
      this.mode = 'Sign in';
    } else {
      this.mode = 'Register';
    }
  }

  authorize(){
    if (this.mode == 'Sign in'){
      this.authService.signinUser(this.form.value.email,this.form.value.password);
    } else {
      console.log(this.form.value);
      this.authService.registerUser(this.form.value.email,this.form.value.password);
    }
  }
}
