import { Injectable } from '@angular/core';
import { StoreService } from './store.service';
import { EncryptGCM } from '../class/encrypt-gcm';
import { Visit } from '../class/visit';
import { AppointmentService } from './appointment.service';
import { UserService } from './user.service';
import { PeersService } from './peers.service';
import { SecDoctor } from '../class/sec-doctor';
import { Payload } from '../interface/payload';
import { PouchError } from '../interface/db/pouch-error';
import { ErrorHelper } from '../error-helper';
import { User } from '../class/user';
import { VisitMedication } from '../class/visit-medication';
import { ArrayPayload } from '../interface/array-payload';

@Injectable({
  providedIn: 'root'
})
export class VisitService {

  private _visits: Visit[] = [];
  private _sd: SecDoctor;
  private _usr: User;

  constructor(
    private _sSvc: StoreService,
    private _usrSvc: UserService,
    private _peerSvc: PeersService,
    private _enc: EncryptGCM,
    private _aptSvc: AppointmentService,
  ) {
    this._sd = this._peerSvc.getDrBySignature(this._usrSvc.user.signature);
    this._usr = this._usrSvc.user;
  }

  public get visits(): Visit[] {
    return this._visits;
  }

  private _saveDetails(id: string, p: string): void {
    const vs = this._sSvc.get(this._sd.VS);

    vs.get<Payload>(id).then(doc => {
      const pyl = this._enc.decrypt(doc.p, this._usr.UUID);
      if (pyl !== p) {
        doc.p = this._enc.encrypt(p, this._usr.UUID);
        vs.put(doc);
      }
    }).catch((e: PouchError) => {
      if (ErrorHelper.IsPouchNotFound(e)) {
        vs.put<Payload>({
          _id: id,
          p: this._enc.encrypt(p, this._usr.UUID),
        }).catch(() => this._saveDetails(id, p));
      } else if (ErrorHelper.IsPouchDuplicate(e)) {
        this._saveDetails(id, p);
      }
    });
  }

  private async _medicationPosition(v: Visit, vm: VisitMedication)
    : Promise<void> {
    const vs = this._sSvc.get(this._sd.VS);

    try {
      const doc = await vs.get<ArrayPayload<string>>(v.appointment.Id + ':vmpos');
      if (doc.p.length < vm.position || !doc.p.includes(vm.Id)) {
        doc.p.push(vm.Id);
      } else {
        doc.p.splice(doc.p.indexOf(vm.Id), 1);
        doc.p.splice(vm.position, 0, vm.Id);
      }

      await vs.put<ArrayPayload<string>>(doc);
    } catch (e) {
      await vs.put<ArrayPayload<string>>({
        _id: v.appointment.Id + ':vmpos',
        p: [vm.Id],
      });
    }
  }

  public async getVisit(vid: string): Promise<Visit> {
    const v = await this._visits.find(f => f.appointment.Id === vid);
    if (v) {
      return v;
    }

    return this._aptSvc.getAppointment(vid, this._sd).then(apt => {
      return new Visit(apt);
    });
  }

  public save(v: Visit): void {
    this._saveDetails(v.appointment.Id + ':p', v.presentComplaint);
    this._saveDetails(v.appointment.Id + ':m', v.medicalHistory);
    this._saveDetails(v.appointment.Id + ':d', v.diagnosis);
    this._saveDetails(v.appointment.Id + ':t', v.treatmentAdvice);
    this._saveDetails(v.appointment.Id + ':f', v.findingExamination);
    this._saveDetails(v.appointment.Id + ':ph', v.patientHealthStatus);
  }

  public async saveMedication(v: Visit, vm: VisitMedication):
    Promise<void> {
    const vs = this._sSvc.get(this._sd.VS);

    try {
      const doc = await vs.get<Payload>(v.appointment.Id + ':vm:' + vm.Id);
      const oldP = this._enc.decrypt(doc.p, this._sd.UUID2);
      const newP = vm.minified();

      if (oldP === newP) { return; }

      doc.p = this._enc.encrypt(newP, this._sd.UUID2);
      await vs.put(doc);
    } catch (e) {
      await vs.put<Payload>({
        _id: v.appointment.Id + ':vm:' + vm.Id,
        p: this._enc.encrypt(vm.minified(), this._sd.UUID2),
      });
      await this._medicationPosition(v, vm);
    }
  }
}
