import { Component, inject, OnInit } from '@angular/core';
import { BehaviorSubject, Observable, switchMap } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { IEmployeeData } from '../../../core/models/employee';
import { EmployeeService } from '../../../core/services/employee.service';
@Component({
  selector: 'app-employee-list',
  imports: [AsyncPipe],
  templateUrl: './employee-list.component.html',
  styleUrl: './employee-list.component.css'
})
export class EmployeeListComponent implements OnInit {
// لإنشاء تيار بيانات (Stream) يتحدث تلقائيًا عند الحاجة
  private refresh$ = new BehaviorSubject<void>(undefined);
  
  // الـ Observable الذي سيرتبط بالـ HTML مباشرة
  employees$!: Observable<IEmployeeData[]>;

  private employeeService = inject(EmployeeService);

  ngOnInit(): void {
    // ربط الـ Stream: كلما أطلقنا قيمة في refresh$، سيتم جلب الموظفين مجددًا
    this.employees$ = this.refresh$.pipe(
      switchMap(() => this.employeeService.getAllEmployees())
    );
  }
}
