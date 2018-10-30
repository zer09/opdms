import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { UserService } from '../service/user.service';
import { PeersService } from '../service/peers.service';

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate {

    constructor(
        private _usrSvc: UserService,
        private _peerSvc: PeersService,
        private _route: Router
    ) { }

    canActivate(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<boolean> | Promise<boolean> | boolean {
        return this._usrSvc.sessionCheck()
            .then(() => this._peerSvc.fetchSecDrs())
            .then(() => {
                if (!this._usrSvc.user) {
                    this._route.navigate(['/auth']);
                }

                return !!this._usrSvc.user;
            });
    }
}
