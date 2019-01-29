export class ReferralLetter {
  private _to = '';
  private _dr = '';
  private _longName = '';
  private _address = '';
  private _cci = '';
  private _meds = '';

  constructor(longName: string, address: string) {
    this._longName = longName;
    this._address = address;
  }

  public get to(): string {
    return this._to;
  }

  public set to(s: string) {
    this._to = s;
  }

  public get dr(): string {
    return this._dr;
  }

  public set dr(s: string) {
    this._dr = s;
  }

  public get longName(): string {
    return this._longName;
  }

  public set longName(s: string) {
    this._longName = s;
  }

  public get address(): string {
    return this._address;
  }

  public set address(s: string) {
    this._address = s;
  }

  public get cci(): string {
    return this._cci;
  }

  public set cci(s: string) {
    this._cci = s;
  }

  public get meds(): string {
    return this._meds;
  }

  public set meds(s: string) {
    this._meds = s;
  }

  public static unminified(s: string): ReferralLetter {
    const p = JSON.parse(s);

    const l = new ReferralLetter(p[2], p[3]);
    l.to = p[0];
    l.dr = p[1];
    l.cci = p[4];
    l.meds = p[5];
    return l;
  }

  public minified(): string {
    const p = {
      0: this._to,
      1: this._dr,
      2: this._longName,
      3: this._address,
      4: this._cci,
      5: this._meds,
    };

    return JSON.stringify(p);
  }
}
