import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import firebase from 'firebase/compat/app'

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  userSub=new Subject()
  confirmationResult!:firebase.auth.ConfirmationResult
  userName:any

  constructor(private fireAuth:AngularFireAuth, private router: Router) {
    this.fireAuth.onAuthStateChanged( 
      (user)=>{
        if (user && this.userName){
          user.updateProfile(
            {
              displayName:this.userName
            }
          ).then(
            ()=>{
              this.userSub.next(user)
            }
          )
        }
        else this.userSub.next(user)
      }    
    )
   }

   getUser(){
    return this.userSub;
   }

   logout(){
    this.fireAuth.signOut().then(
      ()=>this.router.navigate(['/sign-in'])
    )
   }

   signInWithPhone(phoneNumber:any, verifier:any, userName:any){
    this.userName=userName
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
