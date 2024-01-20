import { Component } from '@angular/core';
import { BaseService } from '../base.service';
import { map } from 'rxjs';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  messages:any
  newMessage:any
  userName="Attila"

  constructor(public router:Router,private base:BaseService, private auth:AuthService) {
    this.base.getMessages().snapshotChanges().pipe(
      map(
        (ch)=> ch.map(
          (c)=>({key: c.payload.key, ...c.payload.val()})
        )
      )
    ).subscribe(
      (res)=>this.messages=res
    )

   
  }

  ionViewDidEnter(){
    this.auth.getUser().subscribe(
      (user:any)=>{
        console.log("HomePage User", user)
        if (user) this.userName=user.displayName
      }
    )
  }
  addMessage(){
    if (this.newMessage){
      let time= new Date().toLocaleTimeString()
      let body = {user:this.userName, time:time, message:this.newMessage}
      this.base.addMessage(body)
      this.newMessage=""
     }
  }

  updateMessage(message:any){
    this.base.updateMessage(message)
  }


  deleteMessage(message:any){
    this.base.deleteMessage(message)
  }
  logout(){
    this.auth.logout()
  }
}
