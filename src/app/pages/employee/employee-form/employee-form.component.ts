import { Component, inject, Inject, OnInit, signal } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EmployeeService } from '../../../core/services/employee.service';
import { IEmployeeData } from '../../../core/models/employee';
import { FormHelper } from '../../../core/helpers/form.helper';
import { DepartmentService } from '../../../core/services/department.service';
import { IDepartment } from '../../../core/models/department';
@Component({
  selector: 'app-employee-form',
  imports: [MatDialogModule, ReactiveFormsModule],
  templateUrl: './employee-form.component.html',
  styleUrl: './employee-form.component.css'
})
export class EmployeeFormComponent implements OnInit {
employeeForm: FormGroup;
isLoading = signal<boolean>(false);
private deptService = inject(DepartmentService);
isEditMode = signal<boolean>(false);
departments: IDepartment[] = [];
// جلب داتا الـ Dialog باستخدام دالة inject() الحديثة والأنيقة
  public data = inject<{ isEdit: boolean, employeeData?: IEmployeeData }>(MAT_DIALOG_DATA);
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
    employeeId: [0],
      name: ['', Validators.required],
      contactNo: ['', [Validators.required, Validators.pattern('^[0-9+ ]{10,15}$')]], // Validation أفضل لرقم الهاتف
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      department: ['', Validators.required],
      role: ['', Validators.required],
      gender: ['', Validators.required],
    });
  }
  ngOnInit(): void {
    this.loadDepartments(15569); // تمرير الـ parent ID المطلوب
    console.log(localStorage.getItem("leaveUser"))
    // إذا كانت البيانات الممررة تشير إلى عملية تعديل
    if (this.data && this.data.isEdit && this.data.employeeData) {
      this.isEditMode.set(true);
      const emp = this.data.employeeData;

      // ملء الفورم بالبيانات الحالية تلقائياً
      this.employeeForm.patchValue({
        employeeId: emp.employeeId,
        name: emp.employeeName,
        contactNo: emp.contactNo,
        email: emp.emailId,
        department: emp.deptId,
        role: emp.role,
        gender: emp.gender ? (emp.gender.charAt(0).toUpperCase() + emp.gender.slice(1)) : '' // تحويل أول حرف لـ Capital ليطابق الـ Select options
      });

      // في وضع التعديل، نجعل كلمة المرور غير إجبارية (لأن المستخدم قد لا يرغب بتغييرها)
      this.employeeForm.get('password')?.clearValidators();
      this.employeeForm.get('password')?.updateValueAndValidity();
    }
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
      employeeId: formValues.employeeId || 0,
      employeeName: formValues.name,
      contactNo: formValues.contactNo,
      emailId: formValues.email,
      password: formValues.password || this.data.employeeData?.password || '',
      deptId: formValues.department || 0, // جلب الـ ID أو 0 كقيمة افتراضية
      gender: formValues.gender.toLowerCase(), // الـ API يطلبها male/female
      role: formValues.role,
      createdDate: new Date().toISOString()
    };
    if (this.isEditMode()) {
      // 1. استدعاء API التعديل (PUT)
      this.employeeService.updateEmployee(employeePayload.employeeId!, employeePayload).subscribe({
        next: (response) => {
          this.isLoading.set(false);
          alert("Employee Updated Successfully");
          this.dialogRef.close(response); 
        },
        error: (err) => {
          this.isLoading.set(false);
          console.error('Error updating employee:', err);
        }
      });
    } else {
      // 2. استدعاء API الإضافة (POST)
      this.employeeService.createEmployee(employeePayload).subscribe({
        next: (response) => {
          this.isLoading.set(false);
          alert("Employee Created Successfully");
          this.dialogRef.close(response); 
        },
        error: (err) => {
          this.isLoading.set(false);
          console.error('Error creating employee:', err);
        }
      });
    }
  
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

 // components/create-employee/create-employee.component.ts
private loadDepartments(parentId: number): void {
  this.deptService.getChildDepartments(parentId).subscribe({
    next: (res) => {
      // التأكد من أن الـ API نجح وأن الداتا موجودة قبل الإسناد
      if (res.result && res.data) {
        this.departments = res.data; // هنا أسندنا الـ Array الفعلي (res.data)
      } else {
        this.departments = [];
      }
    },
    error: (err) => {
      console.error('Error fetching departments:', err);
      this.departments = []; // تصفير المصفوفة لتجنب أي كراش في الـ UI
    }
  });
}
}
