import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profil',
  templateUrl: './profil.page.html',
  styleUrls: ['./profil.page.scss'],
})
export class ProfilPage implements OnInit {
  user:any
  constructor(private auth:AuthService, public router:Router) {
    this.auth.getUser().subscribe(
      (user)=>{
        if (user){
        this.user=Object.assign(user); 
        // this.user={...user}
        // console.log("User Copy: ",this.user)
        }
      }
    )
   }

  ngOnInit() {
  }

  update(){
    let body={
      displayName:this.user._delegate.displayName,
      email:this.user._delegate.email,
      photoURL:this.user._delegate.photoURL
    }
    console.log("Body", body)
    this.auth.updateProfil(body)
  }

  sendVerificationEmail(){
    this.auth.sendVerificationEmail()
  }

  changePhoto(){
    console.log("changePhoto()")
  }
}
