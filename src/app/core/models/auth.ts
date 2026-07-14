import { IEmployeeData } from './employee';
export interface ILogin {
  userName: string;
  password:  string;
}
export interface ILoginResponse {
  message: string;
  result: boolean;
  data: IEmployeeData; // Replace with your actual User model if available
}

