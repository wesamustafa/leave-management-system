
export interface ILogin {
  userName: string;
  password:  string;
}
export interface IEmployeeData {
  employeeId: number;
  employeeName: string;
  contactNo: string;
  emailId: string;
  deptId: number;
  password: string;
  gender: string;
  role: string;
  createdDate: string; // Rest API returns ISO Date string
}
export interface ILoginResponse {
  message: string;
  result: boolean;
  data: IEmployeeData; // Replace with your actual User model if available
}

