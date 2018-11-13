import { Injectable } from '@angular/core';
import { PopoverController, AlertController } from '@ionic/angular';
import { AddRemovePopoverPage } from '../../page/common/add-remove-popover/add-remove-popover.page';

import { StoreService } from '../store.service';
import { LoggerService } from '../logger.service';
import { Language } from '../../interface/common/language';
import { Helper } from '../../helper';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {

  public languageList: Language[] = [];

  constructor(
    private _sSvc: StoreService,
    private _logSvc: LoggerService,
    private _popCtrl: PopoverController,
    private _alertCtrl: AlertController,
  ) { }

  public fetchLanguages() {
    this.languageList = [];
    this._sSvc.get(Helper.defStore)
      .allDocs({
        include_docs: true,
        startkey: `settings:lang:`,
        endkey: `settings:lang:\ufff0`
      }).then(res => {
        const rows = res.rows;

        for (let i = 0; i < rows.length; i++) {
          const doc = rows[i].doc;
          this.languageList.push({
            _id: doc._id,
            _rev: doc._rev,
            language: doc.language
          });
        }
      }).catch(e => this._logSvc.log(e));
  }

  public add(language: string) {
    if (!language || language.trim().length < 1) {
      return;
    }

    language = language.trim();

    this._sSvc.get(Helper.defStore)
      .put({
        _id: `settings:lang:${language}`,
        language: language
      }).then(res => {
        if (!res.ok) {
          return;
        }

        this.languageList.push({
          _id: res.id,
          _rev: res.rev,
          language: language
        });
      }).catch(e => this._logSvc.log(e));
  }

  public remove(languages: Language[]) {
    for (let i = 0; i < languages.length; i++) {
      (languages[i] as any)._deleted = true;
    }

    this._sSvc.get(Helper.defStore)
      .bulkDocs(languages).then(() => this.fetchLanguages())
      .cath(e => this._logSvc.log(e));
  }

  private _alertAdd(): void {
    this._alertCtrl.create({
      header: 'Add New Language',
      inputs: [{
        name: 'language',
        placeholder: 'Language',
        type: 'text',
      }],
      buttons: [{
        text: 'Cancel',
        role: 'cancel',
      }, {
        text: 'Add',
        handler: data => this.add(data.language),
      }],
    }).then(a => a.present());
  }

  private _alertRM(): void {
    const del = this.languageList.filter(f => f['_deleted']);
    const languages: string[] = [];

    for (let i = 0; i < del.length; i++) {
      languages.push(del[i].language);
    }

    this._alertCtrl.create({
      header: 'Confirm Deletion',
      message: 'Are you sure to remove selected languages?<br>' +
        languages.join('<br>'),
      buttons: [{
        text: 'Cancel',
        role: 'cancel',
      }, {
        text: 'Confirm',
        handler: () => this.remove(del),
      }],
    }).then(a => a.present());
  }

  public popOver(event: Event) {
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
