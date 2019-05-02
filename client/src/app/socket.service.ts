import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import {Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class SocketService {
  socket=io('http://localhost:3000',{agent:"him"})
  constructor() { }

  joinRoom(data)
  {
    console.log("join room",data)
    this.socket.emit('join',data)
  }

  sendMessage(data)
  {
    console.log("send message",data)
    this.socket.emit('message',data)
  }

  newMessageRecieved()
  {
      const observable = new Observable<{ user: String, message: String}>(observer => {
      this.socket.on('new message', (data) => {
        observer.next(data);
        console.log("data",data)
        console.log("observer.next")
      });
      return ()=>{
        this.socket.disconnect();
      }
    });
    return observable;  
  }

  typing(data)
  {
    this.socket.emit('typing',data)
  }
 
  typingRecieved()
  {
    
    const observable=new Observable<{istyping:boolean}>((observer)=>{
      this.socket.on('typing',(obj)=>{
        observer.next(obj)
      })
      return ()=>{
        this.socket.disconnect()
      }
    })
    
    return observable;
  }

}
