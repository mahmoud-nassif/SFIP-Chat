import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../user.service';
import { SocketService } from '../socket.service';
import { checkAndUpdateDirectiveDynamic } from '@angular/core/src/view/provider';

@Component({
  selector: 'app-chatroom',
  templateUrl: './chatroom.component.html',
  styleUrls: ['./chatroom.component.css']
})
export class ChatroomComponent implements OnInit {
  username:String;
  email:String;
  chatroom;
  messagesArray:Array<{user:String,message:String}>=[];
  message:String;
  istyping=false;

  constructor(private aroute:ActivatedRoute,
    private usersrv:UserService,
    private socketsrv:SocketService) {

      this.socketsrv.newMessageRecieved().subscribe({
        next:(data)=>{this.messagesArray.push(data),console.log("message recieved"),this.istyping=false}
      })

      this.socketsrv.typingRecieved().subscribe(obj=>{
        this.istyping=obj.istyping;
      })
     }

     

  ngOnInit() {
    this.username=this.aroute.snapshot.queryParamMap.get('username')
    this.email=this.aroute.snapshot.queryParamMap.get('email');
    const currentUser=this.usersrv.getLoggedInUser();
    if(currentUser.username<this.username)
    {
      this.chatroom=currentUser.username.concat(this.username);
    }
    else{
      this.chatroom=this.username.concat(currentUser.username)
    }
    this.socketsrv.joinRoom({username:this.usersrv.getLoggedInUser().username,room:this.chatroom})
    this.socketsrv.socket.on('roomjoined',(chatroom)=>{
     this.usersrv.getChatRoom_Chat(chatroom).subscribe(messages=>{
      this.messagesArray=messages
     })
    })

    this.usersrv.getChatRoom_Chat(this.chatroom).subscribe(messages=>{
      this.messagesArray=messages
     })
  }

  sendMessage()
  {
    this.socketsrv.sendMessage({room:this.chatroom,
      currentUser:this.usersrv.getLoggedInUser().username,
      message:this.message})
    this.message='';
  }

  typing()
  {
    this.socketsrv.typing({room:this.chatroom,user:this.usersrv.getLoggedInUser().username})
  }
}
