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

  public secList: Secretary[];

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
    this._sSvc.get(Helper.defStore)
      .allDocs({
        include_docs: true,
        startkey: `ds${usr.signature}`,
        endkey: `ds${usr.signature}\ufff0`
      }).then(res => {
        const rows = res.rows;

        for (let i = 0; i < rows.length; i++) {
          const doc = rows[i].doc;
          const p = JSON.parse(this._enc.decrypt(doc.p, usr.UUID));
          this.secList.push({
            _id: doc._id,
            _rev: doc._rev,
            name: [p.name.first, p.name.last].join(' ')
          });
        }
      }).catch(e => this._logSvc.log(e));
  }


  public addSecretary(username: string, password: string): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      this._saSvc.getDefaultServerAPI().then(addr => {
        this._http.post(
          addr + '/users/login',
          JSON.stringify({ username, password }), {
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            }
          }).subscribe((res: PostResponse) => {
            if (!res.successful ||
              parseInt(res.msg.act, 10) !== UserType.SECRETARY) {
              return resolve(false);
            }

            const usr: User = this._usrSvc.user;
            const st = this._sSvc.get(Helper.defStore);

            // will save the sec information to dr.
            const sSec = st.upsert(
              `ds${usr.signature}${res.msg.signature}`,
              doc => {
                doc.p = this._enc.encrypt(
                  JSON.stringify(res.msg),
                  usr.UUID);
                return doc;
              }
            );

            // will save the dr information to sec.
            const sDr = st.upsert(
              `sd${res.msg.signature}${usr.signature}`,
              doc => {
                const secDr = new SecDoctor();
                secDr.signature = usr.signature;
                secDr.UUID2 = usr.UUID2;
                secDr.PS = usr.PS;
                secDr.PES = usr.PES;
                secDr.APS = usr.APS;
                secDr.PTI = usr.PTI;
                secDr.userDetails = usr.userDetails;

                doc.p = this._enc.encrypt(
                  secDr.stringify(),
                  res.msg.uuid
                );

                return doc;
              }
            );

            Promise.all([sSec, sDr]).then(() => {
              this.fetchDoctorSecrtaries();
              resolve(true);
            }).catch(e => {
              reject(e);
            });
          }, err => {
            reject(err);
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
    this._alertCtrl.create({
      header: 'Add New Secretary',
      message: 'Please provide secretary credentials',
      inputs: [{
        name: 'uname',
        placeholder: 'Username',
        type: 'text',
      }, {
        name: 'pass',
        placeholder: 'Password',
        type: 'password'
      }],
      buttons: [{
        text: 'Cancel',
        role: 'cancel',
      }, {
        text: 'Login',
        handler: data => {
          this.addSecretary(data.uname.trim(), data.pass.trim());
        },
      }]
    }).then(a => a.present());
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
