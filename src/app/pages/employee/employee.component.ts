import { Component, inject } from '@angular/core';
import { EmployeeListComponent } from "./employee-list/employee-list.component";
import { MatDialog } from '@angular/material/dialog';
import{EmployeeFormComponent} from './employee-form/employee-form.component'
@Component({
  selector: 'app-employee',
  imports: [EmployeeListComponent],
  templateUrl: './employee.component.html',
  styleUrl: './employee.component.css'
})
export class EmployeeComponent {
private dialog = inject(MatDialog);
// 2. الفانكشن المسؤول عن فتح البوب أب
openEmployeeForm() {
    const dialogRef = this.dialog.open(EmployeeFormComponent, {
      width: '500px', // تحديد عرض البوب أب
      disableClose: true, // يمنع قفل البوب أب لو المستخدم ضغط بره بالغلط (Best Practice للـ Forms)
      data: { title: 'إضافة موظف جديد' } // لو حابب تبعت بيانات للفورم (زي تعديل مثلاً)
    });
    // 3. استقبال البيانات بعد قفل البوب أب (لما يعمل Save مثلاً)
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('البيانات اللي رجعت من الفورم:', result);
        // هنا تقدر تنادي على الـ Service عشان تحفظ البيانات في الـ Database
      }
    });
  }
}
