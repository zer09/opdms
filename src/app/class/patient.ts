import { Sex } from '../enum/sex.enum';
import { MaritalStatus } from '../enum/marital-status.enum';
import { Helper } from '../helper';

export class Patient {
  private _id: string;

  public title = '';
  public name = {
    first: '',
    last: '',
    middle: '',
    suffix: '',
    nickname: '',
  };

  public birthdate = '';
  public sex: Sex;
  public maritalStatus = MaritalStatus.Single;
  public language = '';
  public religion = '';
  public occupation = '';
  public city = '';
  public address = '';

  public contact = {
    mobile: '',
    home: '',
    email: '',
    office: ''
  };

  public father = '';
  public mother = '';
  public guardian = '';

  public referredBy = '';
  public allergies = '';

  constructor(id?: string) {
    this._id = !id || id.length !== 26 ? Helper.ulidString : id;
  }

  public get Id(): string {
    return this._id;
  }

  public minified(): string {
    const p = {
      0: this.title,
      1: this.name.first,
      2: this.name.last,
      3: this.name.middle,
      4: this.name.suffix,
      5: this.name.nickname,
      6: this.birthdate,
      7: this.sex,
      8: this.maritalStatus,
      9: this.language,
      10: this.religion,
      11: this.occupation,
      12: this.city,
      13: this.address,
      14: this.contact.mobile,
      15: this.contact.home,
      16: this.contact.email,
      17: this.contact.office,
      18: this.father,
      19: this.mother,
      20: this.guardian,
      21: this.referredBy,
      22: this.allergies,
    };

    return JSON.stringify(p);
  }

  public unminified(s: string): void {
    const p = JSON.parse(s);

    this.title = p[0];
    this.name.first = p[1];
    this.name.last = p[2];
    this.name.middle = p[3];
    this.name.suffix = p[4];
    this.name.nickname = p[5];
    this.birthdate = p[6];
    this.sex = p[7];
    this.maritalStatus = p[8];
    this.language = p[9];
    this.religion = p[10];
    this.occupation = p[11];
    this.city = p[12];
    this.address = p[13];
    this.contact.mobile = p[14];
    this.contact.home = p[15];
    this.contact.email = p[16];
    this.contact.office = p[17];
    this.father = p[18];
    this.mother = p[19];
    this.guardian = p[20];
    this.referredBy = p[21];
    this.allergies = p[22];
  }

}
