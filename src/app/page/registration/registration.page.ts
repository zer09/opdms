import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { UserService } from '../../service/user.service';
import { LoadingController, AlertController, NavController } from '@ionic/angular';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.page.html',
  styleUrls: ['./registration.page.scss'],
})
export class RegistrationPage implements OnInit {

  public rf: FormGroup;
  public submitted = false;

  constructor(
    private _usrSvc: UserService,
    private _fb: FormBuilder,
    private _navCtrl: NavController,
    private _loadingCtrl: LoadingController,
    private _alertCtrl: AlertController,
  ) {
    this.rf = this._fb.group({
      username: ['', Validators.required],
      userType: ['2', Validators.required],
      password: ['', Validators.compose([
        Validators.required,
        Validators.minLength(8)
      ])],
      repassword: ['', Validators.required],
      firstname: ['', Validators.compose([
        Validators.required,
        Validators.pattern('[a-zA-Z ]*')
      ])],
      lastname: ['', Validators.compose([
        Validators.required,
        Validators.pattern('[a-zA-Z ]*')
      ])],
      middlename: ['', Validators.pattern('[a-zA-Z ]*')],
      suffixname: ['', Validators.pattern('[a-zA-Z ]*')],
      contactNumber: [''],
      address: [''],
      question1: ['', Validators.required],
      answer1: ['', Validators.required],
      question2: ['', Validators.required],
      answer2: ['', Validators.required],
    }, {
        validator: this.matchingPassword('password', 'repassword')
      });
  }

  ngOnInit() {
  }

  public get rfc() {
    return this.rf.controls;
  }

  private matchingPassword(password: string, repassword: string) {
    return (group: FormGroup): { [key: string]: any } => {
      const p = group.controls[password];
      const r = group.controls[repassword];

      if (p.value !== r.value) {
        return { mismatchedPassword: true };
      }

      return {};
    };
  }

  public register(): void {
    this.submitted = true;
    if (!this.rf.valid) {
      this._alertCtrl.create({
        header: 'Registration Error',
        message: 'Some fields have missing/invalid value.' +
          '<br><br>Please check, and try again.',
        buttons: ['OK'],
      }).then(a => a.present());
      return;
    }

    this._loadingCtrl.create({
      message: 'Please wait...<br>Registration is on progress.'
    }).then(l => {
      l.present().then(() => {
        this._usrSvc.register(this.rf.value).then(res => {
          l.onDidDismiss().then(() => {
            if (!res.successful) {
              this._alertCtrl.create({
                header: 'Registration Error',
                message: `Error: ${res.msg}`,
                buttons: ['OK'],
              }).then(a => a.present());
              return;
            }

            this._alertCtrl.create({
              header: 'Registration',
              message: 'Successfully registered.',
              buttons: ['OK'],
            }).then(a => {
              a.onDidDismiss().then(() => this._navCtrl.navigateBack('/auth'));
              a.present();
            });
          });

          l.dismiss();
        });
      });
    });
  }
}
