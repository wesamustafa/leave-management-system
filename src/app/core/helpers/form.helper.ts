import { FormGroup } from '@angular/forms';

export class FormHelper {
  /**
   * يتحقق مما إذا كان حقل معين في الفورم يحتوي على خطأ وملموس من المستخدم
   */
  static isFieldInvalid(form: FormGroup, controlName: string): boolean {
    const control = form.get(controlName);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }
}