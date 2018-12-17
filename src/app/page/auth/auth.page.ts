import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, Events, LoadingController, ModalController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { Helper } from '../../helper';
import { ServerListPage } from '../../page/server-list/server-list.page';
import { LoggerService } from '../../service/logger.service';
import { PeersService } from '../../service/peers.service';
import { UserService } from '../../service/user.service';


@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
})
export class AuthPage implements OnInit {

  public lf: FormGroup;

  constructor(
    private _usrSvc: UserService,
    private _peerSvc: PeersService,
    private _logSvc: LoggerService,
    private _fb: FormBuilder,
    private _localStorage: Storage,
    private _alertCtrl: AlertController,
    private _loadingCtrl: LoadingController,
    private _modalCtrl: ModalController,
    private _route: Router,
    private _events: Events,
  ) {
    this.lf = this._fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  ngOnInit() {
    if (this._usrSvc.user) {
      this._route.navigate(['']);
    }
  }

  public passEnter(ev: KeyboardEvent): void {
    if (ev.key === 'Enter') {
      this.login();
    }
  }

  public async  login() {
    if (!this.lf.valid) {
      return;
    }

    await this._localStorage.get(Helper.strDefNode).then(node => {
      Helper.clinicNode = node;
    });

    if (!Helper.clinicNode || Helper.clinicNode.length < 1) {
      const a = await this._alertCtrl.create({
        header: 'Error Login',
        message: 'No default server',
        buttons: ['OK']
      });

      return await a.present();
    }

    const l = await this._loadingCtrl.create({
      message: 'Logging in...'
    });

    l.present().then(() => this._usrSvc.login(
      this.lf.controls['username'].value,
      this.lf.controls['password'].value
    )).then(successful => {
      l.onDidDismiss()
        .then(() => this._peerSvc.fetchSecDrs())
        .then(() => {
          if (!successful) {
            this._alertCtrl.create({
              header: 'Authentication',
              message: 'Invaid username or password',
              buttons: ['OK']
            }).then(a => a.present());
          } else {
            this._route.navigate(['']);
          }
        })
        .catch(e => {
          this._logSvc.log(e);
          this._events.publish('usr:ses:logout');
        });

      this.lf.controls['username'].reset();
      this.lf.controls['password'].reset();
      l.dismiss();
    }).catch(() => {
      l.onDidDismiss().then(() => this._alertCtrl.create({
        header: 'Authentication',
        message: 'Unable to connect to the server.' +
          '<br><br>Please try again.',
        buttons: ['OK']
      })).then(a => a.present());

      this.lf.controls['username'].reset();
      this.lf.controls['password'].reset();
      l.dismiss();
    });
  }

  public async serverSetting() {
    const m = await this._modalCtrl.create({
      component: ServerListPage
    });

    return m.present();
  }

}
