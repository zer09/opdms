import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { map } from 'rxjs/operators';

import { UserService } from '../../service/user.service';
import { LoadingController, AlertController, NavController } from '@ionic/angular';
import { LoggerService } from '../../service/logger.service';
import { IPostResponse } from '../../interface/response/ipost-response';

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
        private _logSvc: LoggerService,
        private _fb: FormBuilder,
        private _navCtrl: NavController,
        private _loadingCtrl: LoadingController,
        private _alertCtrl: AlertController,
    ) { }

    ngOnInit() {
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

    public get rfc() {
        return this.rf.controls;
    }

    private validateUsername(control: FormControl) {
        return this._usrSvc.usernameExists(control.value).pipe(map(res => {
            return res['exists'] ? { exists: true } : null;
        }));
    }

    private matchingPassword(password: string, repassword: string) {
        return (group: FormGroup): { [key: string]: any } => {
            const p = group.controls[password];
            const r = group.controls[repassword];

            if (p.value !== r.value) {
                return { mismatchedPassword: true };
            }
        };
    }



    private async register() {
        this.submitted = true;
        if (!this.rf.valid) {
            await this._alertCtrl.create({
                header: 'Registration Error',
                subHeader: 'Some fields has missing/invalid value.' +
                    '<br><br>Please check, and try again.',
                buttons: ['OK']
            }).then(a => a.present());
            return;
        }

        const l = await this._loadingCtrl.create({
            message: 'Please wait...<br>Registration is on progress.'
        });

        l.present().then(() => {
            this._usrSvc.register(this.rf.value)
                .subscribe((res: IPostResponse) => {
                    l.onDidDismiss().then(() => {
                        if (!res['success']) {
                            this._alertCtrl.create({
                                header: 'Registration Error',
                                subHeader: res['msg'],
                                buttons: ['OK']
                            }).then(a => a.present());

                            return;
                        }

                        this._alertCtrl.create({
                            header: 'Registration',
                            subHeader: 'Successfully registered.',
                            buttons: ['OK']
                        }).then(a => {
                            a.onDidDismiss()
                                .then(() => this._navCtrl.navigateBack('/auth'));
                            a.present();
                        });
                    });

                    l.dismiss();
                }, err => {
                    this._logSvc.log(err);
                    l.dismiss();
                });
        });
    }

}
