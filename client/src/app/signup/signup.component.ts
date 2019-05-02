import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import {FlashMessagesService,FlashMessagesModule} from 'angular2-flash-messages';
import { Router } from '@angular/router';


@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  count: number;
  username: String;
  email: String;
  password: String;
  usernameIsEmpty: boolean;
  emailIsEmpty: boolean;
  passwordIsEmpty: boolean;

  constructor(private usersrv:UserService,
    private fmservice:FlashMessagesService,
    private router:Router) { }

  ngOnInit() {
    this.passwordIsEmpty=false;
    this.emailIsEmpty=false;
    this.usernameIsEmpty=false;
    this.count=0;
  }

  submitForm()
  {
    this.usernameIsEmpty = false;
    this.emailIsEmpty = false;
    this.passwordIsEmpty = false;
    if (this.username === undefined || this.username === '') {
      this.usernameIsEmpty = true;
      this.count++;
    }
    if (this.email === undefined || this.email === '') {
      this.emailIsEmpty = true;
      this.count++;
    }
    if (this.password === undefined || this.password === '') {
      this.passwordIsEmpty = true;
      this.count++;
    }
    if(this.count===0)
    {
      const user={username:this.username,email:this.email,password:this.password}
      this.usersrv.saveUser(user).subscribe(res=>{
        if(res.user_already_signed_up===true)
        {
          //this.fmservice.show('user already taken',{cssClass:'alert-danger',timeout:3000})
          console.log("already taken")
        }
        else{
           //this.fmservice.show('succussfully signed up',{cssClass:'alert-danger',timeout:3000})
           console.log("succussfully signed up")
           this.router.navigate(['/login'])
        }
      })
    }
  }

}
