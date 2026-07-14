import { Injectable, PLATFORM_ID, Inject, inject } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
@Injectable({
  providedIn: 'root'
})
export class SidebarService {
  private platformId = inject(PLATFORM_ID);
  // تتبع حالة الفتح والإغلاق: true = مفتوح/كامل، false = مغلق/مصغر
  private isOpenSubject = new BehaviorSubject<boolean>(true);
  isOpen$ = this.isOpenSubject.asObservable();

  // تتبع هل الشاشة صغيرة (Mobile) أم لا
  private isMobileSubject = new BehaviorSubject<boolean>(false);
  isMobile$ = this.isMobileSubject.asObservable();

  constructor() {
   // لم نعد بحاجة لكتابة أي شيء داخل الـ constructor signature
    if (isPlatformBrowser(this.platformId)) {
      this.checkViewport(window.innerWidth);
    }
}
toggle() {
    this.isOpenSubject.next(!this.isOpenSubject.value);
  }

  close() {
    this.isOpenSubject.next(false);
  }

  updateViewport(width: number) {
    this.checkViewport(width);
  }
  private checkViewport(width: number) {
    const isMobile = width < 1024; // lg breakpoint
    this.isMobileSubject.next(isMobile);
    // إذا كنا على الموبايل نجعل القائمة مغلقة تلقائياً، وعلى الديسك توب مفتوحة
    this.isOpenSubject.next(!isMobile);
  }
}

