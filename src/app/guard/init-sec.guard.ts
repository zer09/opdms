import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { PeersService } from '../service/peers.service';
import { UserService } from '../service/user.service';
import { LoggerService } from '../service/logger.service';

@Injectable({
  providedIn: 'root'
})
export class InitSecGuard implements CanActivate {

  constructor(
    private _usrSvc: UserService,
    private _peerSvc: PeersService,
    private _logSvc: LoggerService,
  ) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    return this._usrSvc.sessionCheck()
      .then(() => this._peerSvc.fetchSecDrs())
      .then(() => true)
      .catch(e => {
        this._logSvc.log(e);
        return false;
      });
  }
}
