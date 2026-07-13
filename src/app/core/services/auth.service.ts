import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { ILogin, ILoginResponse } from '../models/auth';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private baseUrl = environment.apiBaseUrl;
  constructor() { }
  login(data:ILogin):Observable<ILoginResponse>{
    return this.http.post<ILoginResponse>(`${this.baseUrl}/login`, data)
  }
}
