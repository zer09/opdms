import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { UserService } from '../service/user.service';
import { UserType } from '../enum/user/user-type.enum';

@Injectable({
    providedIn: 'root'
})
export class UserTypeGuard implements CanActivate {

    constructor(
        private _usrSvc: UserService,
        private _route: Router
    ) { }

    canActivate(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<boolean> | Promise<boolean> | boolean {
        return this._usrSvc.sessionCheck().then(() => {
            console.log(this._usrSvc.user)
            if (this._usrSvc.user.userType === UserType.ADMIN) {
                this._route.navigate(['/admin']);
            } else if (this._usrSvc.user.userType === UserType.DOCTOR) {
                this._route.navigate(['/doctor']);
            } else {
                this._route.navigate(['/secretary']);
            }

            return false;
        });
    }
}
