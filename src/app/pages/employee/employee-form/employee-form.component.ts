import { Component, Inject, signal } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EmployeeService } from '../../../core/services/employee.service';
import { IEmployeeData } from '../../../core/models/employee';
import { FormHelper } from '../../../core/helpers/form.helper';
@Component({
  selector: 'app-employee-form',
  imports: [MatDialogModule, ReactiveFormsModule],
  templateUrl: './employee-form.component.html',
  styleUrl: './employee-form.component.css'
})
export class EmployeeFormComponent {
employeeForm: FormGroup;
isLoading = signal<boolean>(false);
// خريطة لتحويل أسماء الأقسام إلى معرفات رقمية للـ API
  private departmentMap: { [key: string]: number } = {
    'Engineering': 181,
    'HR': 182,
    'Marketing': 183,
    'Finance': 184
  };
  constructor(
    private fb: FormBuilder,
    // 1. حقن الـ DialogRef علشان نتحكم في قفل البوب أب من جوه الفورم
    private dialogRef: MatDialogRef<EmployeeFormComponent>,
    private employeeService: EmployeeService,
    // 2. استقبال البيانات الممررة (لو بتعمل Edit مثلاً)
    // @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    // تعريف الفورم
   this.employeeForm = this.fb.group({
      name: ['', Validators.required],
      contactNo: ['', [Validators.required, Validators.pattern('^[0-9+ ]{10,15}$')]], // Validation أفضل لرقم الهاتف
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      department: ['', Validators.required],
      role: ['', Validators.required],
      gender: ['', Validators.required],
    });
  }
  // حفظ البيانات وقفل البوب أب مع إرسال البيانات للكومبوننت الأب
  onSubmit() {
    
    if (this.employeeForm.invalid || this.isLoading()) {
      this.employeeForm.markAllAsTouched(); // إظهار الأخطاء للمستخدم إذا حاول الإرسال والفورم غير صالح
      return;
    }
    if (this.isLoading()) return; 
    this.isLoading.set(true); 
    const formValues = this.employeeForm.value;
    // تجهيز البيانات لتطابق الـ IEmployeeData المطلوبة في الـ API
    const employeePayload: Partial<IEmployeeData> = {
      employeeName: formValues.name,
      contactNo: formValues.contactNo,
      emailId: formValues.email,
      password: formValues.password,
      deptId: this.departmentMap[formValues.department] || 0, // جلب الـ ID أو 0 كقيمة افتراضية
      gender: formValues.gender.toLowerCase(), // الـ API يطلبها male/female
      role: formValues.role,
      createdDate: new Date().toISOString()
    };
    // استدعاء السيرفيس لإرسال البيانات
    this.employeeService.createEmployee(employeePayload).subscribe({
      next: (response) => {
         this.isLoading.set(false);
        // نغلق الـ Dialog ونرجع النتيجة الناجحة للـ Parent Component
        alert("Employee Created Successfully");
        this.dialogRef.close(response); 
      },
      error: (err) => {
         this.isLoading.set(false);
        console.error('Error creating employee:', err);
        // هنا يمكنك إظهار Toast أو رسالة خطأ للمستخدم
      }
    });
  }

  // إغلاق البوب أب بدون حفظ
  onCancel() {
    this.dialogRef.close();
  }
// 2️⃣ استدعاء الـ Helper هنا وتمرير الـ Form الحالي واسم الحقل
  isFieldInvalid(controlName: string): boolean {
    return FormHelper.isFieldInvalid(this.employeeForm, controlName);
  }
}
