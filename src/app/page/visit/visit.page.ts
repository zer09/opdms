import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatAutocompleteSelectedEvent, MatTable } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { AlertController, ModalController, NavController } from '@ionic/angular';
import { OverlayEventDetail } from '@ionic/core';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { MedicationInstruction } from '../../class/medication-instruction';
import { Medicine } from '../../class/medicine';
import { Visit } from '../../class/visit';
import { VisitMedication } from '../../class/visit-medication';
import { CurrentClinicalImpressionService } from '../../service/current-clinical-impression.service';
import { FindingExaminationService } from '../../service/finding-examination.service';
import { MedicationInstructionService } from '../../service/medication-instruction.service';
import { MedicationsService } from '../../service/medications.service';
import { PresentComplaintService } from '../../service/present-complaint.service';
import { VisitService } from '../../service/visit.service';
import { MedicalCertModalPage } from '../modal/certificate/medical-cert-modal/medical-cert-modal.page';
import { ReferralLetterModalPage } from '../modal/certificate/referral-letter-modal/referral-letter-modal.page';
import { MedInstructionQuickAddPage } from '../modal/med-instruction-quick-add-modal/med-instruction-quick-add.page';
import { MedicationInstructionModalPage } from '../modal/medication-instruction-modal/medication-instruction-modal.page';
import { MedicineQuickAddModalPage } from '../modal/medicine-quick-add-modal/medicine-quick-add-modal.page';
import { LabRequestPage } from '../modal/certificate/lab-request/lab-request.page';
import { ClearancesModalPage } from '../modal/certificate/clearances-modal/clearances-modal.page';

@Component({
  selector: 'app-visit',
  templateUrl: './visit.page.html',
  styleUrls: ['./visit.page.scss'],
})
export class VisitPage implements OnInit {
  @ViewChild(MatTable) medicationTable!: MatTable<VisitMedication>;

  private _vid!: string;
  private _visit!: Visit;

  public title = '';
  public nameLongString = '';
  public completeAddress = '';

  public vitalSignFB!: FormGroup;

  public BMI = '';
  public PTS = '';
  public allergies = '';
  public notes = '';
  public vitalSegment = '0';
  public detailsSegment = '0';

  public visitMedication: VisitMedication[] = [];
  public visitMedicationsDisplayedColumns = [
    'position',
    'medicine',
    'sig',
    'qty',
  ];

  public pcFC = new FormControl();
  public pcFilteredOptions!: Observable<string[]>;
  public pcTextArea = '';

  public cciFC = new FormControl();
  public cciFilteredOptions!: Observable<string[]>;
  public cciTextArea = '';

  public feFC = new FormControl();
  public feFilteredOptions!: Observable<string[]>;
  public feTextArea = '';

  public medsFC = new FormControl();
  public medsFilteredOptions!: Observable<Medicine[]>;

  public medQtyFC = new FormControl();

  public medSigFC = new FormControl();
  public medSigFilteredOptions!: Observable<MedicationInstruction[]>;

  constructor(
    private _vSvc: VisitService,
    private _pcSvc: PresentComplaintService,
    private _cciSvc: CurrentClinicalImpressionService,
    private _feSvc: FindingExaminationService,
    private _medSvc: MedicationsService,
    private _medIns: MedicationInstructionService,
    private _aRoute: ActivatedRoute,
    private _alertCtrl: AlertController,
    private _navCtrl: NavController,
    private _fb: FormBuilder,
    private _modalCtrl: ModalController,
  ) {
    this._initVitalSignFB();
  }

  ngOnInit() {
    this._vid = this._aRoute.snapshot.paramMap.get('vid') || '';
    if (this._vid === '') {
      this._navCtrl.goBack();
    }

    this._initVisit()
      .then(() => {
        this._listMedications();
      });

    this.pcFilteredOptions = this.pcFC.valueChanges.pipe(
      startWith(''),
      map((v: string): string[] => {
        v = v.toLowerCase();
        return this._pcSvc.pcList.filter(o => o.toLowerCase().indexOf(v) === 0);
      })
    );

    this.cciFilteredOptions = this.cciFC.valueChanges.pipe(
      startWith(''),
      map((v: string): string[] => {
        v = v.toLowerCase();
        return this._cciSvc.cciList.filter(o => o.toLowerCase().indexOf(v) === 0);
      })
    );

    this.feFilteredOptions = this.feFC.valueChanges.pipe(
      startWith(''),
      map((v: string): string[] => {
        v = v.toLowerCase();
        return this._feSvc.feList.filter(o => o.toLowerCase()
          .indexOf(v) === 0);
      })
    );

    this.medsFilteredOptions = this.medsFC.valueChanges.pipe(
      startWith(''),
      map((v: string | Medicine): Medicine[] => {
        if (typeof v === 'string') {
          v = v.toLowerCase();

          return this._medSvc.medsList.filter((f) => {
            return f.toString().toLowerCase().indexOf((v as string)) === 0;
          });
        }

        return this._medSvc.medsList.filter((f) => {
          return f.toString().toLowerCase().indexOf(v.toString().toLowerCase()) === 0;
        });
      })
    );

    this.medSigFilteredOptions = this.medSigFC.valueChanges.pipe(
      startWith(''),
      map((v: string): MedicationInstruction[] => {
        v = v.toLowerCase();
        return this._medIns.instructions.filter(o => o.instruction.toLowerCase()
          .indexOf(v) === 0);
      })
    );

    this.medQtyFC.setValue(100);

  }

  public get medQtyList(): number[] {
    return this._medSvc.qtyList;
  }

  private async _initVisit(): Promise<void> {
    const v = await this._vSvc.getVisit(this._vid);

    this._visit = v;
    this.title = this._visit.appointment.patient.toString();
    this.nameLongString = this._visit.appointment.patient.toLongString();
    this.completeAddress = this._visit.appointment.patient.completeAddress();
  }

  private _initVitalSignFB() {
    this.vitalSignFB = this._fb.group({
      bloodPressure: [''],
      pulse: [''],
      weight: [''],
      height: [''],
      temp: [''],
      resp: [''],
      waist: [''],
      hip: [''],
    });
  }

  private async _alertError(header: string, message: string): Promise<void> {
    const a = await this._alertCtrl.create({
      header,
      message,
      buttons: ['OK'],
    });

    await a.present();
  }

  public medicationDisplayFn(med: Medicine): string | undefined {
    return Medicine.displayFn(med);
  }

  public newMeds(): void {
    this._modalCtrl.create({
      component: MedicineQuickAddModalPage,
      backdropDismiss: false,
    }).then(m => {
      m.onDidDismiss().then((t: OverlayEventDetail<Medicine>) => {
        if (t.data) {
          this.medsFC.setValue(t.data);
        }
      });

      m.present();
    });
  }

  private _newInstruction(inst: string): void {
    this._modalCtrl.create({
      component: MedInstructionQuickAddPage,
      componentProps: { inst },
      backdropDismiss: false,
    }).then((m) => m.present());
  }

  public vitalSegmentChange(ev: any): void {
    this.vitalSegment = ev.target.value;
  }

  public detailsSegmentChange(ev: any): void {
    this.detailsSegment = ev.target.value;
  }

  public pcFCPress(ev: KeyboardEvent): void {
    if (ev.key === 'Enter') {
      const v = this.pcFC.value.trim();
      if (v.length > 0) {
        this._pcSvc.save(v);
        this.pcFC.setValue('');

        if (this.pcTextArea.length > 0) {
          this.pcTextArea += `\n${v}`;
        } else {
          this.pcTextArea = v;
        }
      }
    }
  }

  public cciFCPress(ev: KeyboardEvent): void {
    if (ev.key === 'Enter') {
      const v = this.cciFC.value.trim();
      if (v.length > 0) {
        this._cciSvc.save(v);
        this.cciFC.setValue('');

        if (this.cciTextArea.length > 0) {
          this.cciTextArea += `\n${v}`;
        } else {
          this.cciTextArea = v;
        }
      }
    }
  }

  public feFCPress(ev: KeyboardEvent): void {
    if (ev.key === 'Enter') {
      const v = this.feFC.value.trim();
      if (v.length > 0) {
        this._feSvc.save(v);
        this.feFC.setValue('');

        if (this.feTextArea.length > 0) {
          this.feTextArea += `\n${v}`;
        } else {
          this.feTextArea = v;
        }
      }
    }
  }

  public medSigFCPress(ev: KeyboardEvent): void {
    if (ev.key === 'Enter') {
      const v = this.medSigFC.value.trim();
      if (v.length > 0) {
        this._newInstruction(v);
      }
    }
  }

  public pcOptSel(ev: MatAutocompleteSelectedEvent): void {
    if (ev.option.value && ev.option.value.length > 0) {
      this.pcFC.setValue('');
      if (this.pcTextArea.length > 0) {
        this.pcTextArea += `\n${ev.option.value}`;
      } else {
        this.pcTextArea = ev.option.value;
      }
    }
  }

  public cciOptosel(ev: MatAutocompleteSelectedEvent): void {
    if (ev.option.value && ev.option.value.length > 0) {
      this.cciFC.setValue('');
      if (this.cciTextArea.length > 0) {
        this.cciTextArea += `\n${ev.option.value}`;
      } else {
        this.cciTextArea = ev.option.value;
      }
    }
  }

  public feOptSel(ev: MatAutocompleteSelectedEvent): void {
    if (ev.option.value && ev.option.value.length > 0) {
      this.feFC.setValue('');
      if (this.feTextArea.length > 0) {
        this.feTextArea += `\n${ev.option.value}`;
      } else {
        this.feTextArea = ev.option.value;
      }
    }
  }

  private async _listMedications(): Promise<void> {
    const l = this._vSvc.listMedications(this._visit);
    let done = false;

    let v = await l.next();
    done = v.done;

    while (!done) {

      this.visitMedication.push(v.value);
      this.medicationTable.renderRows();

      v = await l.next();
      done = v.done;
    }
  }

  public async addMedication(): Promise<void> {
    const medication: Medicine = this.medsFC.value;
    const sig: string = this.medSigFC.value;
    const qty: number = parseInt((this.medQtyFC.value as string), 10);

    if (!medication) {
      this._alertError('Medication', 'Please specify the medication.');
      return;
    }

    if (!sig || sig.length < 1) {
      this._alertError('Medication', 'Please specify the mediaction instruction.');
      return;
    }

    if (!qty || isNaN(qty)) {
      this._alertError('Medication', 'Please specify the mediction qty.');
      return;
    }

    const pos = this.visitMedication.length + 1;
    const v = new VisitMedication('', pos, medication, sig, qty);
    await this._vSvc.saveMedication(this._visit, v);
    this.visitMedication.push(v);

    this.medicationTable.renderRows();
    this.medsFC.setValue('');
    this.medSigFC.setValue('');
    this.medQtyFC.setValue(100);
  }

  public async openInstructions(_: MouseEvent): Promise<void> {
    const m = await this._modalCtrl.create({
      component: MedicationInstructionModalPage,
      componentProps: { visit: this._visit, visitMed: this.visitMedication },
      cssClass: 'modal-width-900',
    });

    await m.present();
  }

  public async openRefLetter(): Promise<void> {
    const m = await this._modalCtrl.create({
      component: ReferralLetterModalPage,
      componentProps: { visit: this._visit },
      cssClass: 'modal-width-900',
    });

    await m.present();
  }

  public async openMedCert(): Promise<void> {
    const m = await this._modalCtrl.create({
      component: MedicalCertModalPage,
      componentProps: { visit: this._visit },
      cssClass: 'modal-width-900',
    });

    await m.present();
  }

  public async openLabRequest(): Promise<void> {
    const m = await this._modalCtrl.create({
      component: LabRequestPage,
      componentProps: { visit: this._visit, visitMed: this.visitMedication },
      cssClass: 'modal-width-900',
    });

    await m.present();
  }

  public async openCertificates(): Promise<void> {
    const m = await this._modalCtrl.create({
      component: ClearancesModalPage,
      componentProps: { visit: this._visit },
      cssClass: 'modal-width-900',
    });

    await m.present();
  }

  public save(): void {

  }
}
