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
  mode: String = 'signin';
  constructor(private authService: AuthService,private router:Router) { }

  ngOnInit() {
    this.form = new FormGroup({
      username: new FormControl(null,{
        validators: [Validators.required]
      }),
      password: new FormControl(null,{
        validators: [Validators.required]
      })
    });

    if (this.router.url == '/signin'){
      this.mode = 'signin';
    } else {
      this.mode = 'register';
    }
  }

  authorize(){
    if (this.mode = 'sigin'){

    } else {

    }
  }

}
