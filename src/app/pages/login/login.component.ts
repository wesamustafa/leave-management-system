import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ILogin } from '../../core/models/auth';
import { StorageKey } from '../../core/enums/storage';
import { AuthService } from '../../core/services/auth.service';
@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
private router = inject(Router);
private authService = inject(AuthService);
LoginObj:ILogin={
  userName:"",
  password:""
};
isLoading = signal<boolean>(false);
onLogin():void{
if (!this.LoginObj.userName.trim() || !this.LoginObj.password.trim()) {
      alert('Please enter both your username and password.');
      return;
    }
  if (this.isLoading()) return; 
  this.isLoading.set(true); 
  this.authService.login(this.LoginObj).subscribe({
    next:(res)=>{
      this.isLoading.set(false);
      if(res.result){
        localStorage.setItem(StorageKey.LEAVE_USER,JSON.stringify(res.data));
        this.router.navigateByUrl('dashboard');
      }else{
        alert(res.message);
      }
    },
    error:(err)=> {
        this.isLoading.set(false);
        console.error('Login failed', err);
        alert('An unexpected error occurred. Please try again.');
    },
  })
}
}
