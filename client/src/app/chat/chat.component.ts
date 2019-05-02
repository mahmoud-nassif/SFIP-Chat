import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {
  users;
  constructor(private usersrv:UserService) { }

  ngOnInit() {
    this.getUsers();
  }

  getUsers()
  {
    this.usersrv.getUsers().subscribe(res=>{
      this.users=res
    })
  }

  getUser() {
    return this.usersrv.getLoggedInUser().username;
  }

}
