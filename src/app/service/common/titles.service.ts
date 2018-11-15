import { Injectable } from '@angular/core';
import { PopoverController, AlertController } from '@ionic/angular';
import { AddRemovePopoverPage } from '../../page/common/add-remove-popover/add-remove-popover.page';

import { StoreService } from '../store.service';
import { LoggerService } from '../logger.service';
import { Title } from '../../interface/common/title';
import { Helper } from '../../helper';

@Injectable({
  providedIn: 'root'
})
export class TitlesService {

  public titleList: Title[] = [];

  constructor(
    private _sSvc: StoreService,
    private _logSvc: LoggerService,
    private _popCtrl: PopoverController,
    private _alertCtrl: AlertController,
  ) { }

  public fetchTitles() {
    this.titleList = [];
    this._sSvc.get(Helper.defStore).allDocs<{ title: string }>({
      include_docs: true,
      startkey: 'settings:title:',
      endkey: 'settings:title:\ufff0'
    }).then(res => {
      res.rows.forEach(row => {
        const doc = row.doc;
        if (doc) {
          this.titleList.push({
            _id: doc._id,
            _rev: doc._rev,
            title: doc.title
          });
        }
      });
    }).catch(e => this._logSvc.log(e));
  }

  public add(title: string) {
    if (!title || title.trim().length < 1) {
      return;
    }

    title = title.trim();

    this._sSvc.get(Helper.defStore)
      .put({
        _id: `settings:title:${title}`,
        title: title
      }).then(res => {
        if (!res.ok) {
          return;
        }

        this.titleList.push({
          _id: res.id,
          _rev: res.rev,
          title: title
        });
      }).catch(e => this._logSvc.log(e));
  }

  public remove(titles: Title[]) {
    for (let i = 0; i < titles.length; i++) {
      (titles[i] as any)._deleted = true;
    }

    this._sSvc.get(Helper.defStore)
      .bulkDocs(titles).then(() => this.fetchTitles())
      .catch(e => this._logSvc.log(e));
  }

  private _alertAdd(): void {
    this._alertCtrl.create({
      header: 'Add New Title',
      inputs: [{
        name: 'title',
        placeholder: 'Title',
        type: 'text',
      }],
      buttons: [{
        text: 'Cancel',
        role: 'cancel',
      }, {
        text: 'Add',
        handler: data => this.add(data.title),
      }]
    }).then(a => a.present());
  }

  private _alertRM(): void {
    const del = this.titleList.filter(t => t['_deleted']);
    const titles: string[] = [];

    for (let i = 0; i < del.length; i++) {
      titles.push(del[i].title);
    }

    this._alertCtrl.create({
      header: 'Confirm Deletion',
      message: 'Are you sure to remove selected titles?<br>' +
        titles.join('<br>'),
      buttons: [{
        text: 'Cancel',
        role: 'cancel',
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
