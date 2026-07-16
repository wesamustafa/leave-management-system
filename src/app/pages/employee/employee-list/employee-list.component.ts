import { Component, inject, OnInit } from '@angular/core';
import { BehaviorSubject, Observable, switchMap } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { IEmployeeData } from '../../../core/models/employee';
import { EmployeeService } from '../../../core/services/employee.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
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
// 3. حقن خدمة الـ SnackBar
  private snackBar = inject(MatSnackBar);
  ngOnInit(): void {
   // ربط الـ stream بالـ service
  this.employees$ = this.refresh$.pipe(
    switchMap(() => this.employeeService.getAllEmployees())
  );

  // الاستماع لطلبات التحديث القادمة من الفورم عبر الـ Service
  this.employeeService.refreshList$.subscribe(() => {
    this.refresh$.next();
  });
  }
  // ميثود الحذف الجديدة
 deleteEmployee(id: number): void {
    if (confirm('Are you sure you want to delete this employee?')) {
      this.employeeService.deleteEmployee(id).subscribe({
        next: (res) => {
          // 4. استخدام الـ SnackBar عند النجاح
          this.snackBar.open('Employee deleted successfully!', 'Close', {
            duration: 3000, // تختفي بعد 3 ثوانٍ
            horizontalPosition: 'end',
            verticalPosition: 'top',
          });
          this.refresh$.next();
        },
        error: (err) => {
          console.error('Error:', err);
          // 5. استخدام الـ SnackBar عند الخطأ
          this.snackBar.open('Failed to delete employee.', 'Close', {
            duration: 4000,
            panelClass: ['bg-red-600', 'text-white'] // لتلوينها باللون الأحمر إذا أردت
          });
        }
      });
    }
  }
  onEdit(empId: number): void {
  // 1. استدعاء الـ API لجلب تفاصيل الموظف
  this.employeeService.getEmployeeById(empId).subscribe({
    next: (res: any) => {
      // نتحقق من بنية الريسبونس (إذا كان يرجع كـ { result: true, data: {...} })
      const empData = res.data ? res.data : res;
      
      // 2. نرسل البيانات للـ Service والـ Service تتولى الباقي
      this.employeeService.triggerEdit(empData);
    },
    error: (err) => {
      console.error('Error loading employee:', err);
      this.snackBar.open('Failed to load employee details', 'Close', { duration: 3000 });
    }
  });}
}
