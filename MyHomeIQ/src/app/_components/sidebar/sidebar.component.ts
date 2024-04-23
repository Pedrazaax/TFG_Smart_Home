import { Component } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {
  dropdown: boolean = false;
  menu: boolean = false;
  consumodropdown: boolean = false;

  constructor() {
    const largeMediaQuery = window.matchMedia('(min-width: 1024px)');
    largeMediaQuery.addEventListener('change', (event) => {
      if (event.matches) {
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

  toggleConsumoDropDown() {
    this.consumodropdown = !this.consumodropdown;
  }
}

