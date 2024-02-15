import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']
})
export class InicioComponent {

  flag: boolean = true;

  constructor(private router: Router) {

  }

  ngOnInit() {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {

        this.flag = true

        if (event.url === "/login" || event.url === "/register" || event.url === "/"){
          this.flag = false
        }

        if (event.url === "/api"){
          if (event.url === "/api") {
            const section = document.querySelector('section.flex-grow');
            if (section !== null) {
              section.classList.add('flex', 'items-center', 'justify-center');
            }
          }
          
        }
        
      }
    });
  }

}
