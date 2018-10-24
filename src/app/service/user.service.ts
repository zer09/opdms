import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { HttpClient } from '@angular/common/http';
import { Events } from '@ionic/angular';
import { Router } from '@angular/router';

import { ServerAddressService } from './server-address.service';
import { EncryptGCM } from '../class/encrypt-gcm';
import { StoreService } from './store.service';
import { LoggerService } from './logger.service';
import { User } from '../class/user';
import { IPostResponse } from '../interface/response/ipost-response';
import { UserType } from '../enum/user/user-type.enum';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class UserService {

    public user: User;

    constructor(
        private _saSvc: ServerAddressService,
        private _spSvc: StoreService,
        private _logSvc: LoggerService,
        private _enc: EncryptGCM,
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
                .then(addr => this._http.post(
                    addr + '/users/login',
                    JSON.stringify({ username, password }), {
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json'
                        }
                    }
                )).then(post => {
                    post.subscribe((res: IPostResponse) => {
                        if (res.successful) {
                            const msg = res.msg;
                            this.user = new User(
                                parseInt(msg.act, 10) as UserType
                            );

                            this.user.userDetails = {
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

                            this.user.UUID = msg.uuid;
                            this.user.privKey = msg.privKey;
                            this.user.pubKey = msg.pubKey;
                            this.user.signature = msg.signature;


                            if (this.user.userType === UserType.ADMIN) {

                            } else if (this.user.userType === UserType.DOCTOR) {
                                this.user.PS = msg.ps;
                                this.user.PES = msg.pes;
                                this.user.APS = msg.aps;
                                this.user.VS = msg.vs;
                                this.user.PTI = msg.pti;
                            } else if (this.user.userType === UserType.SECRETARY) {

                            } else {
                                this.user = undefined;
                                this._route.navigate(['']);
                            }

                            this._localStorage.set('session', this.user);
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

    public register(userInfo): Observable<Object> {
        return this._http.post(
            this._saSvc.getServerAPI(this._saSvc.remoteName) +
            '/registration/register',
            JSON.stringify(userInfo), {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            }
        );
    }

}
