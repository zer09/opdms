import { Helper } from '../helper';

export class VisitMedication {

  public Id: string;
  public position: number;
  public medicine: string;
  public sig: string;
  public qty: number;
  public checked?: boolean;

  constructor(id: string, pos: number, med: string, sig: string, qty: number) {
    this.Id = !id || id.length !== 26 ? Helper.ulidString : id;

    this.position = pos;
    this.medicine = med;
    this.sig = sig;
    this.qty = qty;
    this.checked = false;
  }

  public static unminified(Id: string, pos: number, s: string): VisitMedication {
    const p = JSON.parse(s);

    return new VisitMedication(Id, pos, p[0], p[1], p[2]);
  }

  public minified(): string {
    const p = {
      0: this.medicine,
      1: this.sig,
      2: this.qty,
    };

    return JSON.stringify(p);
  }
}
