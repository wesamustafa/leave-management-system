import { inject, Injectable } from '@angular/core';
import { IEmployeeData } from '../models/employee';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
private readonly apiUrl = `${environment.apiBaseUrl}`;
  constructor() { }
  private http = inject(HttpClient);
  // 1. قناة وسيطة لإرسال طلب فتح الفورم بالتعديل (تحتوي على بيانات الموظف)
  private openFormSubject = new Subject<IEmployeeData>();
  openForm$ = this.openFormSubject.asObservable();

  // 2. قناة وسيطة لإرسال إشارة بتحديث الجدول بعد الحفظ/التعديل
  private refreshListSubject = new Subject<void>();
  refreshList$ = this.refreshListSubject.asObservable();

  // ميثود يطلقها الـ List ليطلب فتح البوب أب للتعديل
  triggerEdit(employee: IEmployeeData) {
    this.openFormSubject.next(employee);
  }

  // ميثود يطلقها الفورم عند نجاح الحفظ ليحدث الجدول
  triggerRefresh() {
    this.refreshListSubject.next();
  }

  // الـ API الخاص بـ Get Employee By ID
  getEmployeeById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/GetEmployee/${id}`);
  }

  // الـ API الخاص بـ Update Employee (PUT)
  updateEmployee(id: number, payload: Partial<IEmployeeData>): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/UpdateEmployee/${id}`, payload);
  }

  
  createEmployee(employeeData: Partial<IEmployeeData>): Observable<IEmployeeData> {
    return this.http.post<IEmployeeData>(`${this.apiUrl}/CreateEmployee`, employeeData);
  }
  getAllEmployees(): Observable<IEmployeeData[]> {
    return this.http.get<IEmployeeData[]>(`${this.apiUrl}/GetAllEmployees`);
  }
  // ميثود الحذف الجديدة
  deleteEmployee(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/DeleteEmployee/${id}`);
  }
}
