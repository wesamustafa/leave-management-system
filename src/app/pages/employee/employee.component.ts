import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { EmployeeListComponent } from "./employee-list/employee-list.component";
import { MatDialog } from '@angular/material/dialog';
import{EmployeeFormComponent} from './employee-form/employee-form.component'
import { EmployeeService } from '../../core/services/employee.service';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-employee',
  imports: [EmployeeListComponent],
  templateUrl: './employee.component.html',
  styleUrl: './employee.component.css'
})
export class EmployeeComponent implements OnInit, OnDestroy {
private dialog = inject(MatDialog);
private employeeService = inject(EmployeeService);
  private sub = new Subscription(); // لإلغاء الاشتراكات وتجنب تسريب الذاكرة
// 2. الفانكشن المسؤول عن فتح البوب أب
openEmployeeForm(employee?: any) {
    const dialogRef = this.dialog.open(EmployeeFormComponent, {
      width: '500px',
      disableClose: true,
      data: { 
        isEdit: !!employee, 
        employeeData: employee 
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // إخطار الـ Service لتحديث الجدول
        this.employeeService.triggerRefresh();
      }
    });
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe(); // تنظيف الاشتراكات
  }

  ngOnInit(): void {
    // الاستماع لطلب فتح البوب أب القادم من أي مكان عبر الـ Service
    this.sub.add(
      this.employeeService.openForm$.subscribe(empData => {
        this.openEmployeeForm(empData);
      })
    );
  }
  
}
