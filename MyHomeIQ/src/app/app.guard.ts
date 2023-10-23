import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AccountService } from './_services/account.service';

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate {

    constructor(private authService: AccountService, private router: Router) { }

    canActivate(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): any {

        this.authService.me().subscribe(
            (respuesta: any) => {
                console.log(respuesta)
                return true
            },
            (error: any) => {
                this.router.navigate(['/login']);
                alert("Error " + error.error.detail)
                return false
            }
        )

    }
}
