import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import moment from 'moment';
import { PeersService } from '../service/peers.service';
import { UserService } from '../service/user.service';
import { LoggerService } from '../service/logger.service';
import { AppointmentService } from '../service/appointment.service';
import { Helper } from '../helper';

@Injectable({
  providedIn: 'root'
})
export class InitSecGuard implements CanActivate {

  constructor(
    private _usrSvc: UserService,
    private _peerSvc: PeersService,
    private _aptSvc: AppointmentService,
    private _logSvc: LoggerService,
  ) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    return this._usrSvc.sessionCheck()
      .then(() => this._peerSvc.fetchSecDrs())
      .then(() => {
        this._aptSvc.monitorAPT(moment(), Helper.clinicNode, this._peerSvc.secDrs);
        return true;
      })
      .catch(e => {
        this._logSvc.log(e);
        return false;
      });
  }
}
