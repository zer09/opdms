import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { HttpClient } from '@angular/common/http';
import { Events } from '@ionic/angular';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

import { ServerAddressService } from './server-address.service';
import { User } from '../class/user';
import { PostResponse } from '../interface/response/post-response';
import { UserType } from '../enum/user/user-type.enum';
import { Helper } from '../helper';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  public user!: User;

  constructor(
    private _saSvc: ServerAddressService,
    private _localStorage: Storage,
    private _http: HttpClient,
    private _events: Events,
    private _route: Router,
  ) {
  }

  public sessionCheck(): Promise<void> {
    return this._localStorage.get('session').then(session => {
      if (!session) {
        return;
      }

      this.user = session;
    });
  }

  public login(username: string, password: string): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      this._saSvc.getDefaultServerAPI()
        .then(addr => this._http.post<PostResponse>(
          addr + '/users/login',
          JSON.stringify({ username, password }), {
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            }
          }
        )).then(post => {
          post.subscribe(res => {
            if (res.successful) {
              const msg = res.msg;
              const u = new User(parseInt(msg.act, 10) as UserType);

              u.userDetails = {
                name: {
                  first: msg.name.first,
                  middle: msg.name.middle,
                  last: msg.name.last,
                  suffix: msg.name.suffix,
                },
                address: msg.address,
                contact: msg.contact,
                regDate: msg.regdate,
              };

              u.UUID = msg.uuid;
              u.UUID2 = msg.uuid2;
              // this.user.privKey = msg.privKey;
              // this.user.pubKey = msg.pubKey;
              u.signature = msg.signature;


              if (u.userType === UserType.ADMIN) {

              } else if (u.userType === UserType.DOCTOR) {
                u.PS = msg.ps;
                u.PES = msg.pes;
                u.APS = msg.aps;
                u.VS = msg.vs;
                u.PTI = msg.pti;
              } else if (u.userType === UserType.SECRETARY) {

              } else {
                this._route.navigate(['']);
              }

              this.user = u;

              this._localStorage.set('session', this.user).then(() => {
                this._events.publish(Helper.strUsrSesChg, this.user);
              });
            }

            resolve(res.successful);
          }, err => {
            reject(err);
          });
        });
    });
  }

  public usernameExists(username: string): Observable<Object> {
    return this._http.post(
      this._saSvc.getServerAPI(this._saSvc.remoteName) + '/users/usernameexists',
      JSON.stringify({ username }), {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      }
    );
  }

  public register(userInfo) {
    return this._http.post<PostResponse>(
      this._saSvc.getServerAPI(this._saSvc.remoteName) + '/registration/register',
      JSON.stringify(userInfo), {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      }
    );
  }
}
