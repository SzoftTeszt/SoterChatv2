import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { ReCaptchaV3Provider } from 'firebase/app-check';
import { RecaptchaVerifier, getAuth } from 'firebase/auth';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.page.html',
  styleUrls: ['./sign-in.page.scss'],
})
export class SignInPage  {
  phone="501158737"
  code=""
  countryJson=environment.counryJson;
  countryPhoneCode="+36"
  recaptaInvisible!:RecaptchaVerifier
  smsSend=false

  constructor(private auth:AuthService, private router: Router) { 
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

 ionViewDidEnter(){
  this.recaptaInvisible = new RecaptchaVerifier(
  getAuth(),
  'recaptchainvisible',
  {
    'size':'invisible',
    'callback': ()=>{},
    'expired-callback':()=>{}
  }
  )
 }


 signInWithPhone(){
  this.auth.signInWithPhone(this.countryPhoneCode+this.phone,this.recaptaInvisible)
  .then(
    (res)=>{
      this.smsSend=true
      console.log("SMS elküldve")
    
    }
  )
  .catch(
    (err)=>{
      this.smsSend=false  
      console.log(err)
    }
  )
 }
 verificationCode(){
  this.auth.verificationCode(this.code).then(
    ()=>{
      console.log("Sikeres belépés")
    
    }
  ).catch(
    ()=>console.log("Kód nem stimmel")
  )
 }

}
