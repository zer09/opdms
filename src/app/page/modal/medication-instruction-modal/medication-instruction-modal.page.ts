import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTable } from '@angular/material';
import { ModalController, NavParams } from '@ionic/angular';
import { VisitMedicationDetailsList } from '../../../class/medication-instruction';
import { Visit } from '../../../class/visit';
import { VisitMedication } from '../../../class/visit-medication';
import { VisitService } from '../../../service/visit.service';

@Component({
  selector: 'app-medication-instruction-modal',
  templateUrl: './medication-instruction-modal.page.html',
  styleUrls: ['./medication-instruction-modal.page.scss'],
})
export class MedicationInstructionModalPage implements OnInit {
  @ViewChild(MatTable) detailsTable!: MatTable<VisitMedicationDetailsList>;

  private visit: Visit;
  private visitMed: VisitMedication[];

  public dataColumns = [
    'med',
    'ab',
    'al',
    'ad',
    'bb',
    'bl',
    'bd',
    'duration',
  ];

  public dataSource: VisitMedicationDetailsList[] = [];

  constructor(
    private _modalCtrl: ModalController,
    private _navParams: NavParams,
    private _visitSvc: VisitService,
  ) {
    this.visit = this._navParams.get('visit');
    this.visitMed = this._navParams.get('visitMed');
  }

  ngOnInit() {
    if (!this.visit) {
      this._modalCtrl.dismiss();
    } else {
      this._visitSvc.listMedicationInstDetails(this.visit, this.visitMed)
        .then((dl) => {
          this.dataSource = this.dataSource.concat(dl);
          this.detailsTable.renderRows();
        });
    }
  }

  public close(): void {
    this._modalCtrl.dismiss();
  }
}
