import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { ReCaptchaV3Provider } from 'firebase/app-check';
import { RecaptchaVerifier, getAuth } from 'firebase/auth';
import { environment } from 'src/environments/environment';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.page.html',
  styleUrls: ['./sign-in.page.scss'],
})
export class SignInPage  {
  // phone="501158737"
  phone="303236954"
  code=""
  countryJson=environment.counryJson;
  countryPhoneCode="+36"
  recapta!:any
  recaptaInvisible!:any
  recaptavisible!:RecaptchaVerifier
  smsSend=false
  recaptcha=true


  constructor(private auth:AuthService, private router: Router, private alerController:AlertController) { 
    this.auth.getUser().subscribe(
      (user)=>{
        console.log("SignIn User", user)
        if (user) this.router.navigate(['/home'])
      }
    )
  }
  
  contryCodeChange(event:any){
    console.log(event)
  }

  ionViewWillLeave(){
    
  }

 ionViewDidEnter(){
  if (!this.recaptaInvisible) this.recaptaInvisible = new RecaptchaVerifier(
  getAuth(),
  'recaptchainvisible',
  {
    'size':'invisible',
    'callback': ()=>{
      this.recapta=this.recaptaInvisible
    },
    'expired-callback':()=>{}
  }
  )
  this.recapta=this.recaptaInvisible

  if (!this.recaptavisible) this.recaptavisible = new RecaptchaVerifier(
  getAuth(),
  'recaptchavisible',
  {
    'size':'normal',
    'callback': ()=>{
      this.recaptcha=true
      this.recapta=this.recaptavisible
    },
    'expired-callback':()=>{
      this.recaptcha=false
      console.log("Látható Recaptcha Hiba!")
    }
  }
  )
 }


 signInWithPhone(){
  if (this.recaptcha)
  this.auth.signInWithPhone(this.countryPhoneCode+this.phone,this.recapta)
  .then(
    (res)=>{
      // this.smsSend=true
      console.log("SMS elküldve")
      this.verification()
    }
  )
  .catch(
    (err)=>{
      this.smsSend=false  
      console.log(err)
    }
  )
 }

 async verification(){
  const alert= await this.alerController.create({
    header:"Enter Verification Code",
    inputs:[
      {
        name: 'code',
        type:"text",
        placeholder:'Enter your code'
      }
    ],
    buttons:[
      {
        text:"Enter",
        handler: (res)=>{
          this.code=res.code
          this.verificationCode()
        }
      }
    ]
  })
  await alert.present()
 }


 verificationCode(){
  this.auth.verificationCode(this.code).then(
    ()=>{
      console.log("Sikeres belépés")
    
    }
  ).catch(
    ()=>{
      this.recaptcha=false
      this.recaptavisible.render()
      console.log("Kód nem stimmel")
  }
  )
 }

}
