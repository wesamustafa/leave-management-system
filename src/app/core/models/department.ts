export interface IDepartment {
  childDeptId: number;
  parentDeptId?: number; // لو الـ API بيرجع الـ parent ID كمان
  departmentName: string;
}
export interface IDepartmentAPIResponse {
  message: string;
  result: boolean;
  data: IDepartment[]; // هنا المصفوفة الفعلية للأقسام
}