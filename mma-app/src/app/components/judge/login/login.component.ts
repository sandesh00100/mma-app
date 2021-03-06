import { Component, OnInit } from '@angular/core';
import { JudgeService } from '../judge.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router} from '@angular/router';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/reducers';
import { login } from '../judge.actions';
import { AuthData } from '../judge.model';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  form:FormGroup;
  mode: String;
  constructor(private judgeService: JudgeService,private router:Router, private store: Store<AppState>) { }

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
      this.judgeService.signinUser(this.form.value.email,this.form.value.password);
      this.store.dispatch(login({authData:{email:this.form.value.email,password:this.form.value.password}}));
    } else {
      console.log(this.form.value);
      this.judgeService.registerUser(this.form.value.email,this.form.value.password);
    }
  }
}
