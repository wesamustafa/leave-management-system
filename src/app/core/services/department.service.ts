import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { IDepartment, IDepartmentAPIResponse } from '../models/department';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DepartmentService {

  constructor() { }
  // استخدام inject() هو الأسلوب الأحدث والأنظف في Angular بدلاً من الـ Constructor Injection
  private http = inject(HttpClient); 
  // private apiUrl = 'https://projectapi.gerasim.in/api/EmployeeManagement/GetChildDepartmentByParentId';
  private apiUrl = `${environment.apiBaseUrl}`;

  getChildDepartments(parentDeptId: number): Observable<IDepartmentAPIResponse> {
    return this.http.get<IDepartmentAPIResponse>(`${this.apiUrl}/GetChildDepartmentByParentId?deptId=${parentDeptId}`);
  }
}
