import { Component } from '@angular/core';
import { EmployeeListComponent } from "./employee-list/employee-list.component";

@Component({
  selector: 'app-employee',
  imports: [EmployeeListComponent],
  templateUrl: './employee.component.html',
  styleUrl: './employee.component.css'
})
export class EmployeeComponent {

}
