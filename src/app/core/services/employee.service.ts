import { inject, Injectable } from '@angular/core';
import { IEmployeeData } from '../models/employee';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
private readonly apiUrl = `${environment.apiBaseUrl}`;
  constructor() { }
  private http = inject(HttpClient)
  createEmployee(employeeData: Partial<IEmployeeData>): Observable<IEmployeeData> {
    return this.http.post<IEmployeeData>(`${this.apiUrl}/CreateEmployee`, employeeData);
  }
  getAllEmployees(): Observable<IEmployeeData[]> {
    return this.http.get<IEmployeeData[]>(`${this.apiUrl}/GetAllEmployees`);
  }
}
