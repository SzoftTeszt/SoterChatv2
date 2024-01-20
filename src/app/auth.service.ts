import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { BehaviorSubject, Subject } from 'rxjs';
import firebase from 'firebase/compat/app'
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  userSub=new BehaviorSubject<any>(null)
  confirmationResult!:firebase.auth.ConfirmationResult
  user:any
  photo:any
  photoUrlSub= new Subject()

  constructor(private storage: AngularFireStorage, private fireAuth:AngularFireAuth, private router: Router) {
    this.fireAuth.onAuthStateChanged( 
      (user)=>{
        this.user=user
        this.userSub.next(user)
      }
    )
  }
  getPhotoURL(){
    return this.photoUrlSub
  }
  changePhoto(){
    const capturedPhoto = Camera.getPhoto({
      resultType: CameraResultType.Base64,
      source: CameraSource.Camera,
      quality:50,
      width:150,
      height:150
    }).then(
      (photo)=>{
        this.photo=photo
        this.pushFileToStorage(photo.base64String)
        console.log("Photo", this.photo)
      }
    )    
  }

  pushFileToStorage(photoString:any){
    const hova = this.user.uid+"ProfilPhoto.jpeg"
    const storageRef= this.storage.ref(hova)

    storageRef.putString(photoString, 'base64').then(
      (res)=>{
        console.log("Feltöltve", res)
        storageRef.getDownloadURL().subscribe(
          (url)=>{
            console.log("url:", url)
            this.photoUrlSub.next(url)
          }
        )
      }
    ).catch(
      (res)=>{
        console.log("Hibás feltöltés", res)
      }
    )
  }


  updateProfil(body:any){
      if (this.user) {
         this.user.updateProfile(
          {
            displayName:body.displayName,
            photoURL:body.photoURL
          }
        ).then(
          ()=>this.user.updateEmail(body.email).then(
            ()=>{
               this.sendVerificationEmail()
               this.router.navigate(['/home'])
            }          
           )
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

   sendVerificationEmail(){
    if (!this.user.emailVerified)
        this.user.sendEmailVerification().then(
        (()=>console.log("Email send")))
        .catch(()=>console.log("Email not send"))
    
  }
}
