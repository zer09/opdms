import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import moment from 'moment';
import { UserService } from '../service/user.service';
import { PeersService } from '../service/peers.service';
import { AppointmentService } from '../service/appointment.service';
import { LoggerService } from '../service/logger.service';
import { Helper } from '../helper';

@Injectable({
  providedIn: 'root'
})
export class InitDrGuard implements CanActivate {

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
      .then(() => this._peerSvc.fetchCurDr())
      .then(() => {
        this._aptSvc.monitorAPT(moment(), Helper.clinicNode, [
          this._peerSvc.curDr
        ]);

        return true;
      })
      .catch(e => {
        this._logSvc.log(e);

        return false;
      });
  }
}
