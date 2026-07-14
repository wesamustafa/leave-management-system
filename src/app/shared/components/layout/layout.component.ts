import { Component, inject, OnInit, HostListener } from '@angular/core';
import { SidebarService } from '../../../core/services/sidebar.service';
import { CommonModule } from '@angular/common';
import {Router, RouterLink, RouterLinkActive, RouterOutlet} from '@angular/router'
import { IEmployeeData } from '../../../core/models/employee';
@Component({
  selector: 'app-layout',
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css'
})
export class LayoutComponent implements OnInit {
sidebarService = inject(SidebarService);
loggedUserData!:IEmployeeData;
avatarLetter: string = '';
router = inject(Router)
constructor(){
  const localData = localStorage.getItem("leaveUser");
  if(localData){
    this.loggedUserData = JSON.parse(localData);
    this.avatarLetter = this.loggedUserData.employeeName.charAt(0);
  }
}
ngOnInit() {
    // تحديث الأبعاد عند بداية تحميل المكون[cite: 1]
    this.sidebarService.updateViewport(window.innerWidth);
  }
  // الاستماع المستمر لتغير حجم الشاشة[cite: 1]
  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.sidebarService.updateViewport(event.target.innerWidth);
  }
  logout(){
    localStorage.removeItem("leaveUser");
    this.router.navigateByUrl("login");
  }
}
