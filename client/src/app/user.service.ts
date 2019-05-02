import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http:HttpClient) { }
  
  login(user)
  {
    const headers=new HttpHeaders()
    headers.append('Content-Type','application/json')
    return this.http.post<any>('http://localhost:3000/api/login',user,{headers:headers})
  }

  saveUser(user)
  {
    const headers=new HttpHeaders()
    headers.append('Content-Type','application/json')
    return this.http.post<any>('http://localhost:3000/api/users',user,{headers:headers})
  }

  isLoggedIn()
  {
    let user=JSON.parse(localStorage.getItem("user"))
    return user!=null?true:false
  }

  getLoggedInUser()
  {
    let user=JSON.parse(localStorage.getItem("user"))
    return user;
  }

  getUsers()
  {
    return this.http.get<any>('http://localhost:3000/api/users')
  }

  getChatRoom_Chat(chatroom)
  {
    return this.http.get<any>('http://localhost:3000/api/chatroom/'+chatroom)
  }

}
