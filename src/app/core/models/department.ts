export interface IDepartment {
  childDeptId: number;
  parentDeptId?: number;
  departmentName: string;
}
export interface IDepartmentAPIResponse {
  message: string;
  result: boolean;
  data: IDepartment[]; 
}