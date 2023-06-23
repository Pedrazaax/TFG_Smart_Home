import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {
  dropdown: boolean = false;
  menu: boolean = false;

  constructor(private breakpointObserver: BreakpointObserver) {
    this.breakpointObserver
      .observe([Breakpoints.Large])
      .subscribe((state) => {
        if (state.matches) {
          this.menu = false;
        }
      });
  }

  toggleDropdown() {
    this.dropdown = !this.dropdown;
  }

  toggleMenu() {
    this.menu = !this.menu;
  }
}

