import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PopoverController, AlertController } from '@ionic/angular';
import { ServerAddressService } from '../server-address.service';
import { StoreService } from '.././store.service';
import { LoggerService } from '.././logger.service';
import { EncryptGCM } from '../../class/encrypt-gcm';
import { PostResponse } from '../../interface/response/post-response';
import { UserType } from '../../enum/user/user-type.enum';
import { UserService } from '../user.service';
import { Secretary } from '../../interface/common/secretary';
import { Helper } from '../../helper';
import { AddRemovePopoverPage } from '../../page/common/add-remove-popover/add-remove-popover.page';
import { User } from '../../class/user';
import { SecDoctor } from '../../class/sec-doctor';

@Injectable({
  providedIn: 'root'
})
export class SecretaryService {

  public secList: Secretary[] = [];

  constructor(
    private _usrSvc: UserService,
    private _saSvc: ServerAddressService,
    private _sSvc: StoreService,
    private _logSvc: LoggerService,
    private _enc: EncryptGCM,
    private _http: HttpClient,
    private _popCtrl: PopoverController,
    private _alertCtrl: AlertController,
  ) { }

  public fetchDoctorSecrtaries(): void {
    this.secList = [];
    const usr: User = this._usrSvc.user;
    this._sSvc.get(Helper.defStore).allDocs<{ p: string }>({
      include_docs: true,
      startkey: `ds${usr.signature}`,
      endkey: `ds${usr.signature}\ufff0`
    }).then(res => {
      res.rows.forEach(row => {
        if (row.doc) {
          const p = JSON.parse(this._enc.decrypt(row.doc.p, usr.UUID2));
          this.secList.push({
            _id: row.doc._id,
            _rev: row.doc._rev,
            name: [p.nam.first, p.name.last].join(' '),
          });
        }
      });
    }).catch(e => this._logSvc.log(e));
  }

  public addSecretary(username: string, password: string): Promise<boolean> {
    return new Promise<boolean>(resolve => {
      this._saSvc.getDefaultServerAPI().then(addr => {
        this._http.post<PostResponse>(
          addr + '/users/login',
          JSON.stringify({ username, password }), {
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            }
          }
        ).subscribe(res => {
          if (res.successful || parseInt(res.msg.act, 10) !==
            UserType.SECRETARY) {
            return resolve(false);
          }

          const usr: User = this._usrSvc.user;
          const st = this._sSvc.get(Helper.defStore);

          // will save the sec information to dr.
          const sSec = st.get<{ p: string }>(
            `ds${usr.signature}${res.msg.signature}`
          ).then(doc => {
            const oldP = this._enc.decrypt(doc.p, usr.UUID);
            const newP = JSON.stringify(res.msg);
            if (oldP !== newP) {
              doc.p = this._enc.encrypt(newP, usr.UUID2);
              st.put(doc);
            }
          }).catch(() => {
            st.put({
              _id: `ds${usr.signature}${res.msg.signature}`,
              p: this._enc.encrypt(JSON.stringify(res.msg), usr.UUID)
            });
          });

          const secDr = new SecDoctor();
          secDr.signature = usr.signature;
          secDr.UUID2 = usr.UUID2;
          secDr.PS = usr.PS;
          secDr.PES = usr.PES;
          secDr.APS = usr.APS;
          secDr.PTI = usr.PTI;
          secDr.userDetails = usr.userDetails;

          // will save th dr information to sec.
          const sDr = st.get<{ p: string }>(
            `sd${res.msg.signature}${usr.signature}`
          ).then(doc => {
            const oldP = this._enc.decrypt(doc.p, res.msg.uuid);
            if (oldP !== secDr.stringify()) {
              doc.p = this._enc.encrypt(secDr.stringify(), res.msg.uuid);
              st.put(doc);
            }
          }).catch(() => {
            st.put({
              _id: `sd${res.msg.signature}${usr.signature}`,
              p: this._enc.encrypt(secDr.stringify(), res.msg.uuid),
            });
          });

          return Promise.all([sSec, sDr]).then(() => {
            this.fetchDoctorSecrtaries();
            return resolve(true);
          });
        }, err => {
          throw err;
        });
      });
    });
  }

  public remove(secs: Secretary[]): void {
    const secList: any[] = [];
    const st = this._sSvc.get(Helper.defStore);
    for (let i = 0; i < secs.length; i++) {
      let id = secs[i]._id.substring(2);
      id = 'sd' + id.substring(27) + id.substring(0, 27);
      const p = st.get(id).then(doc => st.remove(doc));
      secList.push(p);

      (secs[i] as any)._deleted = true;
    }

    Promise.all(secList).then(data => {
      for (let i = 0; i < data.length; i++) {
        if (!data[i].ok) {
          return;
        }
      }

      st.bulkDocs(secs).then(() => this.fetchDoctorSecrtaries());
    }).catch(e => this._logSvc.log(e));
  }

  private _alertAdd(): void {
    let uname: string;
    let passw: string;

    this._alertCtrl.create({
      header: 'Add New Secretary',
      message: 'Please provide secretary credentials',
      inputs: [{
        name: 'uname',
        placeholder: 'Username',
        type: 'text',
      }, {
        name: 'passw',
        placeholder: 'Password',
        type: 'password'
      }],
      buttons: [{
        text: 'Cancel',
        role: 'cancel',
      }, {
        text: 'Login',
        handler: data => {
          uname = data.uname.trim();
          passw = data.passw.trim();
          // this.addSecretary(data.uname.trim(), data.pass.trim());
        },
      }]
    }).then(a => {
      a.onDidDismiss().then(() => {
        this.addSecretary(uname, passw).then(success => {
          if (!success) {
            this._alertCtrl.create({
              header: 'Failed to Login',
              message: 'Please try again.',
              buttons: ['OK'],
            }).then(a2 => a2.present());
          }
        }).catch(e => {
          this._logSvc.log(e);
          this._alertCtrl.create({
            header: 'Unexpected Error',
            message: `Please tyr again.<br><br>Error: ${e.message}`,
            buttons: ['OK'],
          }).then(a2 => a2.present());
        });
      });

      a.present();
    });
  }

  private _alertRM(): void {
    const del = this.secList.filter(s => s['_deleted']);
    const secs: string[] = [];

    for (let i = 0; i < del.length; i++) {
      secs.push(del[i].name);
    }

    this._alertCtrl.create({
      header: 'Confirm Removal',
      message: 'Are you sure to remove this secretaries?<br>' +
        secs.join('<br>'),
      buttons: [{
        text: 'Cancel',
        role: 'cancel'
      }, {
        text: 'Confirm',
        handler: () => this.remove(del),
      }]
    }).then(a => a.present());
  }

  public popOver(event: Event): void {
    this._popCtrl.create({
      component: AddRemovePopoverPage,
      event: event,
      componentProps: {
        addCB: this._alertAdd.bind(this),
        rmCB: this._alertRM.bind(this),
      }
    }).then(p => p.present());
  }
}
