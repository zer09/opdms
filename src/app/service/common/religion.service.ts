import { Injectable } from '@angular/core';
import { Religion } from '../../interface/common/religion';
import { StoreService } from '../store.service';
import { LoggerService } from '../logger.service';
import { PopoverController, AlertController } from '@ionic/angular';
import { Helper } from '../../helper';
import { AddRemovePopoverPage } from '../../page/common/add-remove-popover/add-remove-popover.page';

@Injectable({
  providedIn: 'root'
})
export class ReligionService {

  public religionList: Religion[] = [];

  constructor(
    private _sSvc: StoreService,
    private _logSvc: LoggerService,
    private _popCtrl: PopoverController,
    private _alertCtrl: AlertController,
  ) { }

  public fetchReligion() {
    this.religionList = [];
    this._sSvc.get(Helper.defStore).allDocs<{ religion: string }>({
      include_docs: true,
      startkey: `settings:religion:`,
      endkey: `settings:religion:\ufff0`
    }).then(res => {
      res.rows.forEach(row => {
        const doc = row.doc;
        if (doc) {
          this.religionList.push({
            _id: doc._id,
            _rev: doc._rev,
            religion: doc.religion
          });
        }
      });
    }).catch(e => this._logSvc.log(e));
  }

  public add(religion: string) {
    if (!religion || religion.trim().length < 1) {
      return;
    }

    religion = religion.trim();

    this._sSvc.get(Helper.defStore)
      .put({
        _id: `settings:religion:${religion}`,
        religion: religion
      }).then(res => {
        if (!res.ok) {
          return;
        }

        this.religionList.push({
          _id: res.id,
          _rev: res.rev,
          religion: religion
        });
      }).catch(e => this._logSvc.log(e));
  }

  public remove(religions: Religion[]) {
    for (let i = 0; i < religions.length; i++) {
      (religions[i] as any)._deleted = true;
    }

    this._sSvc.get(Helper.defStore)
      .bulkDocs(religions).then(() => this.fetchReligion())
      .catch(e => this._logSvc.log(e));
  }

  private _alertAdd(): void {
    this._alertCtrl.create({
      header: 'Add New Religion',
      inputs: [{
        name: 'religion',
        placeholder: 'Religion',
        type: 'text',
      }],
      buttons: [{
        text: 'Cancel',
        role: 'cancel',
      }, {
        text: 'Add',
        handler: data => this.add(data.religion),
      }]
    }).then(a => a.present());
  }

  private _alertRM(): void {
    const del = this.religionList.filter(t => t['_deleted']);
    const religions: string[] = [];

    for (let i = 0; i < del.length; i++) {
      religions.push(del[i].religion);
    }

    this._alertCtrl.create({
      header: 'Confirm Deletion',
      message: 'Are you sure to remove selected religions?<br>' +
        religions.join('<br>'),
      buttons: [{
        text: 'Cancel',
        role: 'cancel'
      }, {
        text: 'Confirm',
        handler: () => this.remove(del),
      }]
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
