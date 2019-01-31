import { Injectable } from '@angular/core';
import { EncryptGCM } from '../class/encrypt-gcm';
import { SecDoctor } from '../class/sec-doctor';
import { User } from '../class/user';
import { PeersService } from './peers.service';
import { StoreService } from './store.service';
import { UserService } from './user.service';
import { Visit } from '../class/visit';
import moment from 'moment';
import { MedicalCertificate } from '../class/certificates/medical-certificate';
import { Payload } from '../interface/payload';
import { ReferralLetter } from '../class/certificates/referral-letter';
import { setTimeout } from 'timers';
import { Clearances } from '../class/certificates/clearances';

@Injectable({
  providedIn: 'root'
})
export class CertificateService {

  private _sd: SecDoctor;
  private _usr: User;

  constructor(
    private _sSvc: StoreService,
    private _usrSvc: UserService,
    private _peerSvc: PeersService,
    private _enc: EncryptGCM,
  ) {
    this._sd = this._peerSvc.getDrBySignature(this._usrSvc.user.signature);
    this._usr = this._usrSvc.user;
  }

  // the property p will be the minified string of the cert
  // this will throw if the id needed to be incremented in case the id exists.
  public async _saveCert(id: string, p: string): Promise<void> {
    const vs = this._sSvc.get(this._sd.VS);

    try {
      // check if the id is exists.
      // if it is then throw an error.
      await vs.get(id);
      throw new Error('need to increment the id');
    } catch (e) {
      await vs.put<Payload>({
        _id: id,
        p: this._enc.encrypt(p, this._usr.UUID),
      });
    }
  }

  public async saveMedicalCert(v: Visit, mc: MedicalCertificate): Promise<void> {
    const id = v.appointment.Id + ':medcert:' + moment().format('HHmmss');

    try {
      this._saveCert(id, mc.minified());
    } catch (e) {
      setTimeout(() => { this.saveMedicalCert(v, mc); }, 1000);
    }
  }

  public async listMedicalCertificate(v: Visit): Promise<MedicalCertificate[]> {
    const vs = this._sSvc.get(this._sd.VS);
    try {
      const docs = await vs.allDocs<Payload>({
        include_docs: true,
        startkey: v.appointment.Id + ':medcert:',
        endkey: v.appointment.Id + ':medcert:\ufff0',
      });

      const mcs: MedicalCertificate[] = [];
      for (const row of docs.rows) {
        const doc = row.doc;
        if (!doc) { continue; }

        const p = this._enc.decrypt(doc.p, this._usr.UUID);
        const mc = MedicalCertificate.unminified(p);
        mcs.push(mc);
      }

      return mcs;
    } catch (e) {
      return [];
    }
  }

  public async saveReferralLetter(v: Visit, rl: ReferralLetter): Promise<void> {
    const id = v.appointment.Id + ':reflet:' + moment().format('HHmmss');

    try {
      this._saveCert(id, rl.minified());
    } catch (e) {
      setTimeout(() => { this.saveReferralLetter(v, rl); }, 1000);
    }
  }

  public async saveClearance(v: Visit, c: Clearances): Promise<void> {
    const id = v.appointment.Id + ':clearance:' + moment().format('HHmmss');

    try {
      this._saveCert(id, c.minified());
    } catch (e) {
      setTimeout(() => { this.saveClearance(v, c) }, 1000);
    }
  }
}
