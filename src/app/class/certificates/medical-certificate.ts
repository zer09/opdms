export class MedicalCertificate {
  private _longName: string;
  private _address: string;
  // current clinical impression
  private _cci: string;
  private _recommendation: string;

  constructor(
    longName: string,
    address: string,
    cci: string,
    recommendation: string,
  ) {
    this._longName = longName;
    this._address = address;
    this._cci = cci;
    this._recommendation = recommendation;
  }

  public get longName(): string {
    return this._longName;
  }

  public get address(): string {
    return this._address;
  }

  public get cci(): string {
    return this._cci;
  }

  public get recommendation(): string {
    return this._recommendation;
  }

  public static unminified(s: string): MedicalCertificate {
    const p = JSON.parse(s);

    return new MedicalCertificate(p[0], p[1], p[2], p[3]);
  }

  public minified(): string {
    const p = {
      0: this._longName,
      1: this._address,
      2: this._cci,
      3: this._recommendation,
    };

    return JSON.stringify(p);
  }

}
