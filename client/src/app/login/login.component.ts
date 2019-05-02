import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import {FlashMessagesModule,FlashMessagesService} from 'angular2-flash-messages';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  username:String;
  password:String;
  constructor(private usersrv:UserService,
    private fmservice:FlashMessagesService,
    private router:Router) { }

  ngOnInit() {
  }

  login()
  {
    const user={username:this.username,password:this.password}
    this.usersrv.login(user).subscribe(res=>{
      if(res.isPresent==true){
        if(res.correctPassword==true){
          localStorage.setItem("user",JSON.stringify(res.user))
          this.router.navigate(['/'])
          // this.fmservice.show('Successfully logged in', {cssClass: 'alert-success, timeout: 3000 })
        }
        else{
          console.log("incorrect password")
          // this.fmservice.show('incorrect password', {cssClass: 'alert-success, timeout: 3000 })
        }
      }
      else{
        console.log("user not found")
          // this.fmservice.show('user not found', {cssClass: 'alert-success, timeout: 3000 })
      }
    })
  }

}
