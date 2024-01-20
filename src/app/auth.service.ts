import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { BehaviorSubject, Subject } from 'rxjs';
import firebase from 'firebase/compat/app'

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  userSub=new BehaviorSubject<any>(null)
  confirmationResult!:firebase.auth.ConfirmationResult
  user:any

  constructor(private fireAuth:AngularFireAuth, private router: Router) {
    this.fireAuth.onAuthStateChanged( 
      (user)=>{
        this.user=user
        this.userSub.next(user)
      }
    )
  }

  updateProfil(body:any){
      if (this.user) {
        this.user.updateProfile(
          {
            displayName:body.username,
            email:body.email,
            //profilkép
          }
        )
      }
  }

        // if (user && this.userName){
        //   user.updateProfile(
        //     {
        //       displayName:this.userName
        //     }
        //   ).then(
        //     ()=>{
        //       this.userSub.next(user)
        //     }
        //   )
        
        
   

   getUser(){
    return this.userSub;
   }

   logout(){
    this.fireAuth.signOut().then(
      ()=>this.router.navigate(['/sign-in'])
    )
   }

   signInWithPhone(phoneNumber:any, verifier:any, userName?:any){
    
    return new Promise<any>(
      (resolve, reject)=>{
        this.fireAuth.signInWithPhoneNumber(phoneNumber, verifier).then(
          (confirmationResult)=>{ 
            this.confirmationResult=confirmationResult
            resolve(true)
          }
        ).catch(
          (error)=>{
            reject('SMS not send')
          }
        )
      }
    )   
   }
   verificationCode(code:any){
    return this.confirmationResult.confirm(code)
   }
}
