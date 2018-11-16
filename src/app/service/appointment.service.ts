import { Injectable } from '@angular/core';
import moment from 'moment';
import { StoreService } from './store.service';
import { EncryptGCM } from '../class/encrypt-gcm';
import { Appointment } from '../class/appointment';
import { SecDoctor } from '../class/sec-doctor';
import { PatientService } from './patient.service';
import { AppointmentSearch } from '../interface/appointment-search';
import { LoggerService } from './logger.service';

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {

  public aptList: Map<string, AppointmentSearch>
    = new Map<string, AppointmentSearch>();

  constructor(
    private _sSvc: StoreService,
    private _enc: EncryptGCM,
    private _ptSvc: PatientService,
    private _logSvc: LoggerService,
  ) { }

  public monitorAPT(m: moment.Moment, dr: SecDoctor[]): void {
    if (this.aptList.size > 0) { return; }

    this.aptList = new Map<string, AppointmentSearch>();

    dr.forEach(drElem => {
      const apsSearch: Appointment[] = [];
      const aps = this._sSvc.get(drElem.APS);

      this.aptList.set(drElem.signature, {
        Dr: drElem,
        Appointments: apsSearch
      });

      aps.allDocs<{ p: string }>({
        include_docs: true,
        startkey: m.format('YYYYMMDD'),
        endkey: m.format('YYYYMMDD') + `\ufff0`
      }).then(res => {
        res.rows.forEach(row => {
          const doc = row.doc;
          if (!doc) { return; }

          const aptId = doc._id;
          const ptId = Appointment.extractPatientId(aptId);

          this._ptSvc.getPatient(ptId, drElem).then(pt => {
            const apt = new Appointment(pt, aptId);
            apt.unminified(this._enc.decrypt(doc.p, drElem.UUID2));
            apsSearch.push(apt);
          }).catch(e => this._logSvc.log(e));
        });
      }).catch(e => this._logSvc.log(e));

      aps.changes<{ p: string }>({
        since: 'now',
        live: true,
        include_docs: true
      }).on('change', c => {
        const doc = c.doc;
        if (c.deleted || !doc) { return; }

        const aptId = doc._id;
        const ptId = Appointment.extractPatientId(aptId);

        this._ptSvc.getPatient(ptId, drElem).then(pt => {
          const apt = new Appointment(pt, aptId);
          apt.unminified(this._enc.decrypt(doc.p, drElem.UUID2));

          const ix = apsSearch.findIndex(i => i.Id === apt.Id);
          if (ix >= 0) {
            apsSearch[ix] = apt;
          } else {
            apsSearch.push(apt);
          }
        }).catch(e => this._logSvc.log(e));
      }).on('error', e => this._logSvc.log(e));
    });
  }

    return this._sSvc.get(sc.APS).get<{ p: string }>(id).then(doc => {
      return this._ptSvc.getPatient(Appointment.extractPatientId(id), sc)
        .then(pt => {
          const apt = new Appointment(pt, doc._id);
          apt.unminified(this._enc.decrypt(doc.p, sc.UUID2));

          return apt;
        }).catch(e => {
          throw e;
        });
    }).catch(e => {
      throw e;
    });
  }

  public save(apt: Appointment, sc: SecDoctor): Promise<Appointment> {
    const s = this._sSvc.get(sc.APS);
    return s.get<{ p: string }>(apt.Id).then(doc => {
      const oldP = this._enc.decrypt(doc.p, sc.UUID2);
      const newP = apt.minified();
      if (oldP === newP) {
        return apt;
      }

      doc.p = this._enc.encrypt(newP, sc.UUID2);
      return s.put(doc).then(() => apt);
    }).catch(() => {
      return s.put({
        _id: apt.Id,
        p: this._enc.encrypt(apt.minified(), sc.UUID2),
      }).then(() => apt);
    });
  }
}
